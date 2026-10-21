"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SPLASH_LINES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Pulsing yellow splash line beside the wordmark, cycling through `SPLASH_LINES`. */
export function SplashText({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SPLASH_LINES.length), 4200);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <p className={cn("mc-splash sm:text-lg", !reduced && "animate-splash", className)} aria-live="off">
      {SPLASH_LINES[index]}
    </p>
  );
}
