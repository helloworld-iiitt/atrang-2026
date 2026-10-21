import type { LucideIcon } from "lucide-react";

/**
 * Shapes used by `src/data/events.ts`. You shouldn't need to edit this file to add
 * events or categories — everything is configured in the data file.
 */

/** A category of events, shown in-world as a "biome". */
export type Biome = {
  /** In-world name shown on the biome picker and event cards, e.g. "Hackers' Hollow". */
  name: string;
  /** Accent colour as a 6-digit hex value, e.g. "#a46bff". Used for blocks, borders, and particles. */
  color: string;
  /** Any icon from https://lucide.dev/icons, imported at the top of the data file. */
  icon: LucideIcon;
};

export type Participation = "Individual" | "Team" | "Individual or Team";

/** One event. `Category` is a key of `BIOMES`, so a misspelt category is a type error. */
export type FestEventOf<Category extends string> = {
  /** Stable, URL-safe identifier. Must be unique; never reuse an id for a different event. */
  id: string;
  title: string;
  /** One or two sentences shown on the event card. */
  summary: string;
  /** Full description shown in the event details panel. Line breaks are preserved. */
  description: string;
  /** Which biome the event belongs to. Events with the same category are grouped together. */
  category: Category;
  participation?: Participation;
  teamSize?: string;
  duration?: string;
  prize?: string;
  /** Absolute external URL. When omitted the site shows "Registration details coming soon". */
  registrationUrl?: string;
  highlights?: readonly string[];
  /** Optional: override the biome's colour for this event only. */
  color?: string;
  /** Optional: override the biome's icon for this event only. */
  icon?: LucideIcon;
};
