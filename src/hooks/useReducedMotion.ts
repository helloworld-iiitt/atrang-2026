"use client";

import { useSyncExternalStore } from "react";
import { useSettings } from "@/lib/settings";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function useSystemReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/** True when motion should be minimised, combining the OS preference with the in-app setting. */
export function useReducedMotion(): boolean {
  const { motion } = useSettings();
  const system = useSystemReducedMotion();
  if (motion === "reduce") return true;
  if (motion === "full") return false;
  return system;
}
