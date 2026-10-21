"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { bindMusicToVisibility, syncMusic } from "@/lib/music";
import { settingsStore, useSettings } from "@/lib/settings";
import { isTypingTarget } from "@/lib/utils";
import { toggleMusic } from "../ui/MusicToggle";
import { toggleSound } from "../ui/SoundToggle";

/** App-wide client behaviour: motion preference, background music, global hotkeys. */
export function AppProviders({ children }: { children: ReactNode }) {
  const { motion, music, volume } = useSettings();
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    if (motion === "system") delete root.dataset.motion;
    else root.dataset.motion = motion;
  }, [motion]);

  // Covers music saved as "on" from a previous visit; it starts on the first interaction.
  useEffect(() => syncMusic(music, volume), [music, volume]);
  useEffect(() => bindMusicToVisibility(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === "m") toggleSound(settingsStore.get());
      if (key === "b") toggleMusic(settingsStore.get());
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>;
}
