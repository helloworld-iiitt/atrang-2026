"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { BREAK_DURATION_MS } from "@/lib/constants";
import { emitBurst, PALETTES, type BurstPalette } from "@/lib/particles";
import { useReducedMotion } from "./useReducedMotion";
import { useSoundEffects } from "./useSoundEffects";

export type BreakPhase = "idle" | "cracking" | "broken" | "flash";

const CRACK_STAGES = 6;

type Options = {
  palette?: BurstPalette;
  duration?: number;
  /** Number of cubic particles in the burst. */
  particles?: number;
};

/**
 * Drives the block-break interaction: progressive cracks, a particle burst, then the action.
 * With reduced motion it falls back to a brief highlight before running the action.
 */
export function useBlockBreak<T extends HTMLElement>({
  palette = PALETTES.stone,
  duration = BREAK_DURATION_MS,
  particles,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<BreakPhase>("idle");
  const [stage, setStage] = useState(0);
  const timers = useRef<number[]>([]);
  const reduced = useReducedMotion();
  const play = useSoundEffects();

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  // Activity keeps hidden routes mounted, so reset when this component is hidden or unmounted.
  useLayoutEffect(() => {
    return () => {
      clearTimers();
      setPhase("idle");
      setStage(0);
    };
  }, [clearTimers]);

  const trigger = useCallback(
    (action: () => void) => {
      if (timers.current.length > 0) return;
      const schedule = (fn: () => void, delay: number) => {
        timers.current.push(window.setTimeout(fn, delay));
      };
      const finish = () => {
        clearTimers();
        setPhase("idle");
        setStage(0);
      };

      play("click");

      if (reduced) {
        setPhase("flash");
        schedule(() => {
          action();
          finish();
        }, 120);
        return;
      }

      setPhase("cracking");
      setStage(0);
      const step = duration / CRACK_STAGES;
      for (let i = 1; i < CRACK_STAGES; i++) schedule(() => setStage(i), step * i);

      schedule(() => {
        setPhase("broken");
        play("break");
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          emitBurst({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            palette,
            count: particles,
          });
        }
        action();
      }, duration);

      schedule(finish, duration + 260);
    },
    [clearTimers, duration, palette, particles, play, reduced],
  );

  return {
    ref,
    trigger,
    phase,
    stage,
    isBusy: phase !== "idle",
  };
}
