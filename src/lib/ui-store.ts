import { createStore, useStore } from "./store";

export type GlobalPanel = "about" | "settings" | null;

export const panelStore = createStore<GlobalPanel>(null);

export const openPanel = (panel: Exclude<GlobalPanel, null>) => panelStore.set(panel);
export const closePanel = () => panelStore.set(null);
export const usePanel = () => useStore(panelStore, null);

export type WorldStatus = "loading" | "ready" | "fallback";

/** Shared between the 3D world and the loading screen. */
export const worldStatusStore = createStore<WorldStatus>("loading");
export const useWorldStatus = () => useStore(worldStatusStore, "loading");
