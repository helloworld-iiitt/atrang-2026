// Generates the original 16x16 pixel textures used by the site (CSS + Three.js).
// Run with `npm run textures`. Output is committed to public/textures and src/app/icon.png.
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "textures");
mkdirSync(outDir, { recursive: true });

// ---------- PNG encoding ----------
const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------- helpers ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

class Img {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = Buffer.alloc(w * h * 4);
  }
  set(x, y, color, alpha = 255) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const [r, g, b] = typeof color === "string" ? hex(color) : color;
    const i = (y * this.w + x) * 4;
    this.data[i] = r;
    this.data[i + 1] = g;
    this.data[i + 2] = b;
    this.data[i + 3] = alpha;
  }
  save(path) {
    writeFileSync(path, encodePng(this.w, this.h, this.data));
  }
}

function noiseFill(img, palette, seed, weights) {
  const r = rng(seed);
  for (let y = 0; y < img.h; y++) {
    for (let x = 0; x < img.w; x++) {
      let v = r();
      let idx = 0;
      let acc = 0;
      for (let i = 0; i < weights.length; i++) {
        acc += weights[i];
        if (v <= acc) {
          idx = i;
          break;
        }
        idx = i;
      }
      img.set(x, y, palette[idx]);
    }
  }
}

const textures = {};

// Stone: cool gray with darker fissure clusters.
textures.stone = () => {
  const img = new Img(16, 16);
  noiseFill(img, ["#7f7f80", "#737374", "#8d8d8e", "#6a6a6b"], 11, [0.45, 0.25, 0.2, 0.1]);
  const r = rng(12);
  for (let i = 0; i < 6; i++) {
    let x = Math.floor(r() * 16);
    let y = Math.floor(r() * 16);
    for (let s = 0; s < 3; s++) {
      img.set(x, y, "#5e5e60");
      x += r() > 0.5 ? 1 : 0;
      y += r() > 0.5 ? 1 : -1;
    }
  }
  return img;
};

// Dirt: warm browns with pebbles.
const dirtPalette = ["#86603f", "#77543a", "#946c48", "#634630", "#a07a55"];
const dirtWeights = [0.4, 0.25, 0.18, 0.1, 0.07];
textures.dirt = () => {
  const img = new Img(16, 16);
  noiseFill(img, dirtPalette, 21, dirtWeights);
  return img;
};

const grassPalette = ["#5f9e3a", "#548f33", "#6cae43", "#4a8030", "#77ba4c"];
const grassWeights = [0.38, 0.24, 0.2, 0.1, 0.08];
textures["grass-top"] = () => {
  const img = new Img(16, 16);
  noiseFill(img, grassPalette, 31, grassWeights);
  return img;
};

textures["grass-side"] = () => {
  const img = new Img(16, 16);
  noiseFill(img, dirtPalette, 41, dirtWeights);
  const r = rng(42);
  const gr = rng(43);
  for (let x = 0; x < 16; x++) {
    const depth = 3 + Math.floor(r() * 2.6);
    for (let y = 0; y < depth; y++) {
      const v = gr();
      img.set(x, y, v < 0.4 ? "#5f9e3a" : v < 0.7 ? "#548f33" : v < 0.9 ? "#6cae43" : "#4a8030");
    }
  }
  return img;
};

textures["log-side"] = () => {
  const img = new Img(16, 16);
  const r = rng(51);
  const cols = ["#6b4f30", "#5b4227", "#7a5b38", "#4a3520"];
  for (let x = 0; x < 16; x++) {
    const base = x % 4 === 0 ? 3 : x % 3 === 0 ? 1 : 0;
    for (let y = 0; y < 16; y++) {
      const v = r();
      img.set(x, y, cols[v < 0.15 ? 2 : v < 0.25 ? 3 : base === 0 ? 0 : base]);
    }
  }
  return img;
};

textures["log-top"] = () => {
  const img = new Img(16, 16);
  const r = rng(61);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const d = Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5));
      let c;
      if (d > 6.5) c = "#5b4227";
      else c = Math.floor(d) % 2 === 0 ? "#b58e5a" : "#9c774a";
      if (r() < 0.08) c = "#8a6740";
      img.set(x, y, c);
    }
  }
  return img;
};

textures.leaves = () => {
  const img = new Img(16, 16);
  noiseFill(img, ["#3f7f2a", "#356e23", "#4c9133", "#25521a", "#5aa23c"], 71, [0.32, 0.26, 0.2, 0.14, 0.08]);
  return img;
};

textures.sand = () => {
  const img = new Img(16, 16);
  noiseFill(img, ["#dccf9c", "#d1c38d", "#e6dbab", "#c7b77f"], 81, [0.45, 0.25, 0.2, 0.1]);
  return img;
};

textures.snow = () => {
  const img = new Img(16, 16);
  noiseFill(img, ["#f3f8fb", "#e5eef4", "#ffffff", "#d6e3ec"], 91, [0.45, 0.25, 0.2, 0.1]);
  return img;
};

textures.water = () => {
  const img = new Img(16, 16);
  noiseFill(img, ["#3b6fd0", "#3565c2", "#4a80e0", "#2f5bb0"], 101, [0.45, 0.25, 0.18, 0.12]);
  const r = rng(102);
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(r() * 13);
    const y = Math.floor(r() * 16);
    for (let k = 0; k < 3; k++) img.set(x + k, y, "#6b9cf0");
  }
  return img;
};

textures.planks = () => {
  const img = new Img(16, 16);
  const r = rng(111);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const seam = y % 4 === 3;
      const offset = Math.floor(y / 4) % 2 === 0 ? 0 : 8;
      const vSeam = (x + offset) % 16 === 0 && !seam;
      const v = r();
      let c = v < 0.5 ? "#a2804e" : v < 0.8 ? "#b08c58" : "#977546";
      if (seam || vSeam) c = "#6e5532";
      img.set(x, y, c);
    }
  }
  return img;
};

textures.gold = () => {
  const img = new Img(16, 16);
  noiseFill(img, ["#f2c43d", "#e5b22e", "#fbd85e", "#d39d22"], 121, [0.45, 0.25, 0.18, 0.12]);
  for (let i = 0; i < 16; i++) {
    img.set(i, 0, "#fff0a8");
    img.set(0, i, "#fff0a8");
    img.set(i, 15, "#b07e14");
    img.set(15, i, "#b07e14");
  }
  return img;
};

// A custom ore: stone with glowing cyan crystal flecks (original Atrang "techite").
textures.ore = () => {
  const img = textures.stone();
  const flecks = [
    [3, 2],
    [10, 4],
    [5, 8],
    [12, 11],
    [2, 12],
    [8, 13],
  ];
  for (const [x, y] of flecks) {
    img.set(x, y, "#5ff2e0");
    img.set(x + 1, y, "#2bc4b4");
    img.set(x, y + 1, "#2bc4b4");
    img.set(x + 1, y + 1, "#1a8f84");
  }
  return img;
};

// Dark slate used behind menus and panels.
textures.slate = () => {
  const img = new Img(16, 16);
  noiseFill(img, ["#3a3a42", "#33333a", "#42424b", "#2c2c32"], 141, [0.45, 0.25, 0.18, 0.12]);
  return img;
};

// Button surface: light stone, slightly smoother than terrain stone.
textures.button = () => {
  const img = new Img(16, 16);
  noiseFill(img, ["#8a8a8c", "#828284", "#929294", "#7b7b7d"], 151, [0.5, 0.22, 0.18, 0.1]);
  return img;
};

// Crack overlay: 6 progressive stages, saved as cracks-0.png ... cracks-5.png.
function crackStrip() {
  const img = new Img(96, 16);
  const r = rng(161);
  const rays = [];
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2 + r() * 0.6;
    const path = [];
    let x = 7.5;
    let y = 7.5;
    let a = angle;
    for (let s = 0; s < 10; s++) {
      a += (r() - 0.5) * 0.9;
      x += Math.cos(a);
      y += Math.sin(a);
      path.push([Math.round(x), Math.round(y)]);
    }
    rays.push({ path, startStage: i < 4 ? 0 : i - 3 });
  }
  for (let stage = 0; stage < 6; stage++) {
    img.set(stage * 16 + 7, 7, "#000000", 210);
    img.set(stage * 16 + 8, 8, "#000000", 210);
    for (const ray of rays) {
      if (stage < ray.startStage) continue;
      const progress = (stage - ray.startStage + 1) / (6 - ray.startStage);
      const len = Math.ceil(ray.path.length * progress);
      for (const [x, y] of ray.path.slice(0, len)) {
        if (x >= 0 && x < 16 && y >= 0 && y < 16) img.set(stage * 16 + x, y, "#000000", 210);
      }
    }
  }
  return img;
}

for (const [name, make] of Object.entries(textures)) {
  make().save(join(outDir, `${name}.png`));
}

{
  const strip = crackStrip();
  for (let stage = 0; stage < 6; stage++) {
    const frame = new Img(16, 16);
    for (let y = 0; y < 16; y++) {
      strip.data.copy(frame.data, y * 64, (y * 96 + stage * 16) * 4, (y * 96 + stage * 16 + 16) * 4);
    }
    frame.save(join(outDir, `cracks-${stage}.png`));
  }
}

// Favicon: a 32x32 front-facing grass block with an "A" notch.
{
  const icon = new Img(32, 32);
  const grassTop = textures["grass-side"]();
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const i = ((y >> 1) * 16 + (x >> 1)) * 4;
      icon.set(x, y, [grassTop.data[i], grassTop.data[i + 1], grassTop.data[i + 2]]);
    }
  }
  const A = ["01110", "10001", "11111", "10001", "10001"];
  A.forEach((row, ry) =>
    [...row].forEach((c, rx) => {
      if (c === "1") {
        for (let dy = 0; dy < 3; dy++)
          for (let dx = 0; dx < 3; dx++) icon.set(9 + rx * 3 + dx, 12 + ry * 3 + dy, "#f2c43d");
      }
    }),
  );
  icon.save(join(root, "src", "app", "icon.png"));
}

console.log(`Generated ${Object.keys(textures).length} textures in public/textures`);
