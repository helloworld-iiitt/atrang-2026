"use client";

import { useCallback } from "react";
import { settingsStore } from "@/lib/settings";
import { playSound, type SoundName } from "@/lib/sound";

/** Returns a stable `play` function that respects the user's sound settings at call time. */
export function useSoundEffects() {
  const play = useCallback((name: SoundName) => {
    const { sound, volume } = settingsStore.get();
    if (sound) playSound(name, volume);
  }, []);
  return play;
}
