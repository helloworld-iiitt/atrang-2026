import { mulberry32 } from "@/lib/utils";

export const BLOCK_TYPES = ["grass", "dirt", "stone", "sand", "snow", "water", "log", "leaves"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export type InstanceSet = {
  /** xyz triplets of block centres */
  positions: Float32Array;
  /** per-instance brightness multiplier (fake ambient occlusion + variation) */
  shades: Float32Array;
};

export type World = Record<BlockType, InstanceSet>;

export type WorldOptions = {
  width: number;
  depth: number;
  trees: number;
  seed?: number;
};

export const WATER_LEVEL = 4;
export const WORLD_NEAR_Z = 8;

// ---------- noise ----------
function createNoise(seed: number) {
  const rand = mulberry32(seed);
  const perm = new Uint8Array(512);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const fade = (t: number) => t * t * (3 - 2 * t);
  const hash = (x: number, y: number) => perm[(perm[x & 255] + y) & 511] / 255;

  const value = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = fade(x - xi);
    const yf = fade(y - yi);
    const a = hash(xi, yi);
    const b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1);
    const d = hash(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };

  return (x: number, y: number, octaves = 4) => {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += value(x * freq, y * freq) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return sum / norm;
  };
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export function riverCenter(z: number) {
  return 5 * Math.sin(z * 0.07) + 2 * Math.sin(z * 0.023 + 1);
}

export function createHeightField(seed: number) {
  const fbm = createNoise(seed);
  return (x: number, z: number) => {
    const n = fbm(x * 0.045, z * 0.045, 4);
    const ridgeRaw = fbm(x * 0.028 + 50, z * 0.028 + 50, 3);
    const ridge = 1 - Math.abs(ridgeRaw * 2 - 1);
    const valley = smoothstep(2.5, 15, Math.abs(x - riverCenter(z)));
    const far = smoothstep(-6, -46, z);
    const side = smoothstep(12, 40, Math.abs(x));
    const h = 3 + valley * (2 + n * 6) + far * (ridge * ridge * 24 + n * 6) + side * (n * 9 + 4);
    return Math.floor(h);
  };
}

class Builder {
  positions: number[] = [];
  shades: number[] = [];
  push(x: number, y: number, z: number, shade: number) {
    this.positions.push(x, y, z);
    this.shades.push(shade);
  }
  done(): InstanceSet {
    return { positions: new Float32Array(this.positions), shades: new Float32Array(this.shades) };
  }
}

/** Builds only the visible blocks of a deliberately composed valley scene. */
export function generateWorld({ width, depth, trees, seed = 2026 }: WorldOptions): World {
  const heightAt = createHeightField(seed);
  const rand = mulberry32(seed + 7);
  const b = Object.fromEntries(BLOCK_TYPES.map((t) => [t, new Builder()])) as Record<BlockType, Builder>;

  const x0 = -Math.floor(width / 2);
  const z0 = WORLD_NEAR_Z;
  const heights = new Int16Array(width * depth);
  const idx = (ix: number, iz: number) => iz * width + ix;

  for (let iz = 0; iz < depth; iz++) {
    for (let ix = 0; ix < width; ix++) heights[idx(ix, iz)] = heightAt(x0 + ix, z0 - iz);
  }

  const treeCandidates: Array<{ x: number; z: number; h: number }> = [];

  for (let iz = 0; iz < depth; iz++) {
    for (let ix = 0; ix < width; ix++) {
      const x = x0 + ix;
      const z = z0 - iz;
      const h = heights[idx(ix, iz)];
      const neighbor = (dx: number, dz: number) => {
        const nx = ix + dx;
        const nz = iz + dz;
        if (nx < 0 || nz < 0 || nx >= width || nz >= depth) return h;
        return heights[idx(nx, nz)];
      };
      const minN = Math.min(neighbor(1, 0), neighbor(-1, 0), neighbor(0, 1), neighbor(0, -1));
      const steep = h - minN >= 3;
      const nearWater = Math.abs(x - riverCenter(z)) < 4.5;
      const jitter = () => 0.94 + rand() * 0.1;

      let top: BlockType;
      if (h <= WATER_LEVEL || (h <= WATER_LEVEL + 1 && nearWater)) top = "sand";
      else if (h >= 22) top = "snow";
      else if (h >= 15 && steep) top = "stone";
      else top = "grass";

      b[top].push(x, h, z, jitter());

      for (let y = minN + 1; y < h; y++) {
        const depthBelow = h - y;
        const shade = Math.max(0.55, 1 - depthBelow * 0.045) * jitter();
        const fill: BlockType =
          top === "sand" ? "sand" : top === "grass" && depthBelow <= 2 ? "dirt" : "stone";
        b[fill].push(x, y, z, shade);
      }

      if (h < WATER_LEVEL) b.water.push(x, WATER_LEVEL - 0.1, z, 0.9 + rand() * 0.1);

      if (top === "grass" && h >= WATER_LEVEL + 2 && h <= 14 && !nearWater && z < 2 && z > -48) {
        treeCandidates.push({ x, z, h });
      }
    }
  }

  // Scatter trees with a minimum spacing so the canopy reads as individual trees.
  const placed: Array<{ x: number; z: number }> = [];
  for (let i = treeCandidates.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [treeCandidates[i], treeCandidates[j]] = [treeCandidates[j], treeCandidates[i]];
  }
  for (const c of treeCandidates) {
    if (placed.length >= trees) break;
    if (placed.some((p) => Math.abs(p.x - c.x) < 5 && Math.abs(p.z - c.z) < 5)) continue;
    placed.push(c);
    const trunk = 4 + Math.floor(rand() * 3);
    for (let y = 1; y <= trunk; y++) b.log.push(c.x, c.h + y, c.z, 0.9 + rand() * 0.1);
    const topY = c.h + trunk;
    for (let dy = -2; dy <= 1; dy++) {
      const radius = dy <= -1 ? 2 : 1;
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          const corner = Math.abs(dx) === radius && Math.abs(dz) === radius;
          if (corner && (dy === 1 || rand() < 0.6)) continue;
          if (dx === 0 && dz === 0 && dy < 1) continue;
          const shade = (dy === 1 ? 1.05 : dy === 0 ? 0.98 : 0.86) * (0.92 + rand() * 0.12);
          b.leaves.push(c.x + dx, topY + dy, c.z + dz, shade);
        }
      }
    }
  }

  return Object.fromEntries(BLOCK_TYPES.map((t) => [t, b[t].done()])) as World;
}

/** Cloud cells for the drifting cloud layer, generated from the same noise family. */
export function generateClouds(span: number, cell: number, seed = 99): Float32Array {
  const fbm = createNoise(seed);
  const out: number[] = [];
  const n = Math.floor(span / cell);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (fbm(i * 0.22, j * 0.22, 3) > 0.6) out.push(i * cell - span / 2, 0, j * cell - span * 0.75);
    }
  }
  return new Float32Array(out);
}
