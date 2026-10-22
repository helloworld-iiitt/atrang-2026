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

/** One slot in an event's timetable. */
export type ScheduleSlot<Day extends number = number> = {
  /** Fest day number — a key of `FEST_DAYS`, which holds the actual date. */
  day: Day;
  /** Free text, e.g. "2:00 PM – 5:00 PM" or "All day". */
  time: string;
  /** What happens in this slot, e.g. "Round 1 — Obstacle Crash". */
  title: string;
  venue?: string;
};

export type Coordinator = {
  name: string;
  /** Shown as a tap-to-call link, e.g. "+91 99409 95449". */
  phone?: string;
};

/** One event. `Category` is a key of `BIOMES`, so a misspelt category is a type error. */
export type FestEventOf<Category extends string, Day extends number = number> = {
  /** Stable, URL-safe identifier. Must be unique; never reuse an id for a different event. */
  id: string;
  title: string;
  /** One or two sentences shown on the event card. */
  summary: string;
  /** Full description shown in the event details panel. Line breaks are preserved. */
  description: string;
  /** Which biome the event belongs to. Events with the same category are grouped together. */
  category: Category;
  /** Organising club or team. */
  organizer?: string;
  participation?: Participation;
  teamSize?: string;
  duration?: string;
  prize?: string;
  /** Main venue; individual schedule slots can name their own. */
  venue?: string;
  eligibility?: string;
  /** e.g. "Free" */
  fee?: string;
  /** Absolute external URL. When omitted the site shows "Registration details coming soon". */
  registrationUrl?: string;
  registrationDeadline?: string;
  /** Timetable, shown in the details panel; the card shows the date range. */
  schedule?: readonly ScheduleSlot<Day>[];
  highlights?: readonly string[];
  rules?: readonly string[];
  coordinators?: readonly Coordinator[];
  /** Optional: override the biome's colour for this event only. */
  color?: string;
  /** Optional: override the biome's icon for this event only. */
  icon?: LucideIcon;
};
