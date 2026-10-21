"use client";

import { useSyncExternalStore } from "react";
import type { QualityLevel } from "@/components/world/sceneState";
import type { QualityPreference } from "@/lib/settings";

const SMALL_SCREEN = "(max-width: 767px)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(SMALL_SCREEN);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function detectAutoLevel(): QualityLevel {
  const small = window.matchMedia(SMALL_SCREEN).matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return small || cores <= 4 || memory <= 4 ? "low" : "medium";
}

/** Resolves the user's quality preference into a concrete level for this device. */
export function useQualityLevel(preference: QualityPreference): QualityLevel {
  const auto = useSyncExternalStore(subscribe, detectAutoLevel, () => "medium" as const);
  return preference === "auto" ? auto : preference;
}
