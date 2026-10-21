import { Color, Vector3 } from "three";
import type { TimeOfDay } from "@/lib/settings";

export type Atmosphere = {
  skyTop: Color;
  horizon: Color;
  fog: Color;
  sunColor: Color;
  sunIntensity: number;
  hemiSky: Color;
  hemiGround: Color;
  hemiIntensity: number;
  lightDir: Vector3;
  cloud: Color;
  sun: number;
  moon: number;
  stars: number;
  fireflies: number;
};

type Preset = {
  skyTop: string;
  horizon: string;
  fog: string;
  sunColor: string;
  sunIntensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  lightDir: [number, number, number];
  cloud: string;
  sun: number;
  moon: number;
  stars: number;
  fireflies: number;
};

const PRESETS: Record<"day" | "sunset" | "night" | "sunrise", Preset> = {
  day: {
    skyTop: "#3f7fe0",
    horizon: "#a6d0ff",
    fog: "#b3d6ff",
    sunColor: "#fff3d6",
    sunIntensity: 2.4,
    hemiSky: "#d9ecff",
    hemiGround: "#6a5338",
    hemiIntensity: 1.35,
    lightDir: [0.55, 0.78, 0.3],
    cloud: "#ffffff",
    sun: 1,
    moon: 0,
    stars: 0,
    fireflies: 0,
  },
  sunset: {
    skyTop: "#2a3b7c",
    horizon: "#ff9a5a",
    fog: "#e29a76",
    sunColor: "#ffae6b",
    sunIntensity: 1.9,
    hemiSky: "#ffc8a0",
    hemiGround: "#3d2c22",
    hemiIntensity: 1.0,
    lightDir: [0.75, 0.12, -0.65],
    cloud: "#ffc7a8",
    sun: 1,
    moon: 0,
    stars: 0.25,
    fireflies: 0.5,
  },
  night: {
    skyTop: "#040918",
    horizon: "#1a2a58",
    fog: "#15214a",
    sunColor: "#a9bcff",
    sunIntensity: 1.05,
    hemiSky: "#5a6cae",
    hemiGround: "#1c1722",
    hemiIntensity: 0.95,
    lightDir: [-0.6, 0.2, -0.78],
    cloud: "#4b5578",
    sun: 0,
    moon: 1,
    stars: 1,
    fireflies: 1,
  },
  sunrise: {
    skyTop: "#4a63a8",
    horizon: "#ffb79a",
    fog: "#efb39a",
    sunColor: "#ffc69a",
    sunIntensity: 1.7,
    hemiSky: "#ffd6c0",
    hemiGround: "#3f3026",
    hemiIntensity: 1.0,
    lightDir: [-0.7, 0.14, -0.6],
    cloud: "#ffd2c2",
    sun: 1,
    moon: 0,
    stars: 0.15,
    fireflies: 0.3,
  },
};

const ORDER = ["day", "sunset", "night", "sunrise"] as const;

/** Cycle position (0..1) for each fixed time-of-day setting. */
export const TIME_POSITION: Record<Exclude<TimeOfDay, "cycle">, number> = {
  day: 0,
  sunset: 0.25,
  night: 0.5,
};

/** Seconds for one full day/night loop in "cycle" mode. */
export const CYCLE_SECONDS = 160;

const parsed = Object.fromEntries(
  ORDER.map((key) => {
    const p = PRESETS[key];
    return [
      key,
      {
        ...p,
        skyTop: new Color(p.skyTop),
        horizon: new Color(p.horizon),
        fog: new Color(p.fog),
        sunColor: new Color(p.sunColor),
        hemiSky: new Color(p.hemiSky),
        hemiGround: new Color(p.hemiGround),
        cloud: new Color(p.cloud),
        lightDir: new Vector3(...p.lightDir).normalize(),
      } satisfies Atmosphere,
    ];
  }),
) as Record<(typeof ORDER)[number], Atmosphere>;

export function createAtmosphere(): Atmosphere {
  const d = parsed.day;
  return {
    ...d,
    skyTop: d.skyTop.clone(),
    horizon: d.horizon.clone(),
    fog: d.fog.clone(),
    sunColor: d.sunColor.clone(),
    hemiSky: d.hemiSky.clone(),
    hemiGround: d.hemiGround.clone(),
    cloud: d.cloud.clone(),
    lightDir: d.lightDir.clone(),
  };
}

/** Writes the atmosphere for cycle position `t` (0..1, wraps) into `out` without allocating. */
export function sampleAtmosphere(t: number, out: Atmosphere): Atmosphere {
  const wrapped = ((t % 1) + 1) % 1;
  const scaled = wrapped * ORDER.length;
  const i = Math.floor(scaled);
  const a = parsed[ORDER[i]];
  const b = parsed[ORDER[(i + 1) % ORDER.length]];
  const raw = scaled - i;
  // Hold each preset for a while, then blend quickly to the next one.
  const k = Math.min(1, Math.max(0, (raw - 0.55) / 0.45));
  const f = k * k * (3 - 2 * k);

  out.skyTop.copy(a.skyTop).lerp(b.skyTop, f);
  out.horizon.copy(a.horizon).lerp(b.horizon, f);
  out.fog.copy(a.fog).lerp(b.fog, f);
  out.sunColor.copy(a.sunColor).lerp(b.sunColor, f);
  out.hemiSky.copy(a.hemiSky).lerp(b.hemiSky, f);
  out.hemiGround.copy(a.hemiGround).lerp(b.hemiGround, f);
  out.cloud.copy(a.cloud).lerp(b.cloud, f);
  out.lightDir.copy(a.lightDir).lerp(b.lightDir, f).normalize();
  out.sunIntensity = a.sunIntensity + (b.sunIntensity - a.sunIntensity) * f;
  out.hemiIntensity = a.hemiIntensity + (b.hemiIntensity - a.hemiIntensity) * f;
  out.sun = a.sun + (b.sun - a.sun) * f;
  out.moon = a.moon + (b.moon - a.moon) * f;
  out.stars = a.stars + (b.stars - a.stars) * f;
  out.fireflies = a.fireflies + (b.fireflies - a.fireflies) * f;
  return out;
}
