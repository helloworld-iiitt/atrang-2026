/**
 * Event bus for block-break particle bursts. Bursts render in a fixed layer in the
 * root layout, so they keep flying even after the page that spawned them navigates away.
 */

export type BurstPalette = readonly string[];

export type BurstRequest = {
  x: number;
  y: number;
  width: number;
  height: number;
  palette: BurstPalette;
  count?: number;
};

type Listener = (burst: BurstRequest) => void;

const listeners = new Set<Listener>();

export function emitBurst(burst: BurstRequest) {
  listeners.forEach((listener) => listener(burst));
}

export function onBurst(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const PALETTES = {
  stone: ["#8d8d8e", "#737374", "#5e5e60", "#a3a3a5"],
  grass: ["#5f9e3a", "#4a8030", "#86603f", "#634630", "#77ba4c"],
  dirt: ["#86603f", "#634630", "#a07a55", "#77543a"],
  gold: ["#f2c43d", "#fbd85e", "#d39d22", "#fff0a8"],
  slate: ["#42424b", "#2c2c32", "#5a5a64"],
} as const satisfies Record<string, BurstPalette>;
