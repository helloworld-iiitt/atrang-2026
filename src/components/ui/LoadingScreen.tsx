"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useWorldStatus } from "@/lib/ui-store";
import { AtrangLogo } from "../branding/AtrangLogo";

const STEPS = ["Generating terrain", "Planting trees", "Spawning clouds", "Preparing spawn point"] as const;
const MIN_VISIBLE_MS = 700;
const MAX_VISIBLE_MS = 2600;

/** Short "generating world" screen on first load. Hides via CSS even if JavaScript never runs. */
export function LoadingScreen() {
  const status = useWorldStatus();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      const t = performance.now() - start;
      setElapsed(t);
      if (t < MAX_VISIBLE_MS) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const done = (status !== "loading" && elapsed >= MIN_VISIBLE_MS) || elapsed >= MAX_VISIBLE_MS;
  const progress = done ? 1 : Math.min(0.92, elapsed / MAX_VISIBLE_MS);
  const step = STEPS[Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))];

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="loading"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="loading-screen fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 px-6"
          style={{
            background:
              "linear-gradient(rgb(10 8 6 / 0.55), rgb(10 8 6 / 0.55)), url(/textures/dirt.png) 0 0 / 64px 64px",
            imageRendering: "pixelated",
          }}
          role="status"
          aria-live="polite"
        >
          <AtrangLogo size="md" decorative />
          <div className="grid w-full max-w-sm gap-3 text-center">
            <p className="font-pixel text-lg text-bone text-shadow-pixel">{step}…</p>
            <div className="h-4 border-2 border-black bg-black/60 p-0.5" aria-hidden>
              <div
                className="h-full bg-grass-light shadow-[inset_0_-3px_0_rgb(0_0_0/0.3)]"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="sr-only">Loading the Atrang world</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
