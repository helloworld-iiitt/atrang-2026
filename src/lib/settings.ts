import { createStore, useStore } from "./store";

export type MotionPreference = "system" | "reduce" | "full";
export type QualityPreference = "auto" | "low" | "high";
export type TimeOfDay = "day" | "sunset" | "night" | "cycle";

export type Settings = {
  sound: boolean;
  music: boolean;
  volume: number;
  motion: MotionPreference;
  quality: QualityPreference;
  timeOfDay: TimeOfDay;
};

export const DEFAULT_SETTINGS: Settings = {
  sound: false,
  music: false,
  volume: 0.6,
  motion: "system",
  quality: "auto",
  timeOfDay: "day",
};

const STORAGE_KEY = "atrang:settings:v1";

function readStoredSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const settingsStore = createStore<Settings>(readStoredSettings());

settingsStore.subscribe(() => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsStore.get()));
  } catch {
    // Storage can be unavailable (private mode); settings then last for the session only.
  }
});

export function updateSettings(patch: Partial<Settings>) {
  settingsStore.set((prev) => ({ ...prev, ...patch }));
}

export function useSettings(): Settings {
  return useStore(settingsStore, DEFAULT_SETTINGS);
}
