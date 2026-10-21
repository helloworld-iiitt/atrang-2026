import { createAtmosphere } from "@/lib/world/atmosphere";

/**
 * Mutable per-frame scene state shared between 3D components. Kept outside React
 * so animation updates never trigger re-renders.
 */
export const sceneState = {
  atmosphere: createAtmosphere(),
  /** Normalised pointer position, -1..1 on each axis. */
  pointer: { x: 0, y: 0 },
};

export type WorldView = "menu" | "events" | "lost";

export type QualityLevel = "low" | "medium" | "high";

export type QualityConfig = {
  width: number;
  depth: number;
  trees: number;
  fireflies: number;
  floatingBlocks: number;
  cloudSpan: number;
  dpr: [number, number];
  shadows: boolean;
};

export const QUALITY: Record<QualityLevel, QualityConfig> = {
  low: {
    width: 60,
    depth: 54,
    trees: 24,
    fireflies: 24,
    floatingBlocks: 3,
    cloudSpan: 150,
    dpr: [0.75, 1.25],
    shadows: false,
  },
  medium: {
    width: 88,
    depth: 70,
    trees: 48,
    fireflies: 48,
    floatingBlocks: 6,
    cloudSpan: 200,
    dpr: [1, 1.5],
    shadows: false,
  },
  high: {
    width: 108,
    depth: 82,
    trees: 72,
    fireflies: 72,
    floatingBlocks: 6,
    cloudSpan: 240,
    dpr: [1, 2],
    shadows: true,
  },
};
