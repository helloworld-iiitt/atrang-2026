import type { LucideIcon } from "lucide-react";
import { BIOMES, EVENTS, FEST_DAYS, type EventCategory, type FestDay, type FestEvent } from "@/data/events";

/**
 * Everything the UI needs is derived from `src/data/events.ts` here, so adding an
 * event or a biome there updates the hero, filters, counts, cards, and page copy.
 */

export type CategoryFilter = EventCategory | "All";

export type EventTheme = {
  biome: string;
  color: string;
  icon: LucideIcon;
  /** Shades used for block-break particles. */
  palette: readonly string[];
};

const HEX = /^#[0-9a-f]{6}$/i;

function validate() {
  const seen = new Set<string>();
  for (const event of EVENTS) {
    if (seen.has(event.id)) throw new Error(`events.ts: duplicate event id "${event.id}"`);
    seen.add(event.id);
    if (event.color && !HEX.test(event.color)) {
      throw new Error(
        `events.ts: event "${event.id}" has color "${event.color}"; use a 6-digit hex like "#a46bff"`,
      );
    }
  }
  for (const [day, date] of Object.entries(FEST_DAYS)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`events.ts: FEST_DAYS[${day}] is "${date}"; use YYYY-MM-DD like "2026-10-23"`);
    }
  }
  for (const [key, biome] of Object.entries(BIOMES)) {
    if (!HEX.test(biome.color)) {
      throw new Error(
        `events.ts: biome "${key}" has color "${biome.color}"; use a 6-digit hex like "#a46bff"`,
      );
    }
  }
}
validate();

/** Categories that have at least one event, in the order they appear in `BIOMES`. */
export const ACTIVE_CATEGORIES: readonly EventCategory[] = (Object.keys(BIOMES) as EventCategory[]).filter(
  (category) => EVENTS.some((event) => event.category === category),
);

export const CATEGORY_FILTERS: readonly CategoryFilter[] = ["All", ...ACTIVE_CATEGORIES];

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => {
    const v = (n >> shift) & 255;
    const out = amount >= 0 ? v + (255 - v) * amount : v * (1 + amount);
    return Math.round(Math.min(255, Math.max(0, out)))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(16)}${channel(8)}${channel(0)}`;
}

function makeTheme(biome: string, color: string, icon: LucideIcon): EventTheme {
  return { biome, color, icon, palette: [color, shade(color, -0.3), shade(color, 0.35), "#3a3a42"] };
}

const CATEGORY_THEMES = Object.fromEntries(
  (Object.keys(BIOMES) as EventCategory[]).map((key) => {
    const { name, color, icon } = BIOMES[key];
    return [key, makeTheme(name, color, icon)];
  }),
) as Record<EventCategory, EventTheme>;

export function getCategoryTheme(category: EventCategory): EventTheme {
  return CATEGORY_THEMES[category];
}

/** The biome theme, with this event's own `color` / `icon` overrides applied. */
export function getEventTheme(event: FestEvent): EventTheme {
  const base = CATEGORY_THEMES[event.category];
  if (!event.color && !event.icon) return base;
  return makeTheme(base.biome, event.color ?? base.color, event.icon ?? base.icon);
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function filterEvents(
  events: readonly FestEvent[],
  { query, category }: { query: string; category: CategoryFilter },
): FestEvent[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return events.filter((event) => {
    if (category !== "All" && event.category !== category) return false;
    if (terms.length === 0) return true;
    const haystack = normalize(
      `${event.title} ${event.summary} ${event.description} ${BIOMES[event.category].name} ${event.organizer ?? ""}`,
    );
    return terms.every((term) => haystack.includes(term));
  });
}

export function countByCategory(events: readonly FestEvent[]): Record<CategoryFilter, number> {
  const counts = Object.fromEntries(CATEGORY_FILTERS.map((c) => [c, 0])) as Record<CategoryFilter, number>;
  for (const event of events) {
    counts[event.category] = (counts[event.category] ?? 0) + 1;
    counts.All += 1;
  }
  return counts;
}

// ---------- dates ----------
// Formatted by hand (not Intl) so server-rendered and browser-rendered text always match.

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function parts(day: FestDay) {
  const [y, m, d] = FEST_DAYS[day].split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return { year: y, month: MONTHS[m - 1], date: d, weekday };
}

/** e.g. "Fri 23 Oct" */
export function formatFestDay(day: FestDay): string {
  const p = parts(day);
  return `${p.weekday} ${p.date} ${p.month}`;
}

function formatRange(first: FestDay, last: FestDay, withYear = false): string {
  const a = parts(first);
  const b = parts(last);
  const year = withYear ? ` ${b.year}` : "";
  if (first === last) return `${a.weekday} ${a.date} ${a.month}${year}`;
  if (a.month === b.month) return `${a.weekday} ${a.date} – ${b.weekday} ${b.date} ${b.month}${year}`;
  return `${a.weekday} ${a.date} ${a.month} – ${b.weekday} ${b.date} ${b.month}${year}`;
}

/** Date range an event runs over, from its schedule, e.g. "Fri 23 – Sun 25 Oct". */
export function eventDateRange(event: FestEvent): string | null {
  if (!event.schedule?.length) return null;
  const days = event.schedule.map((slot) => slot.day);
  return formatRange(Math.min(...days) as FestDay, Math.max(...days) as FestDay);
}

const FEST_DAY_KEYS = (Object.keys(FEST_DAYS).map(Number) as FestDay[]).sort((a, b) => a - b);

/** Whole-fest date range, e.g. "Fri 23 – Sun 25 Oct 2026". */
export const FEST_DATE_RANGE = formatRange(FEST_DAY_KEYS[0], FEST_DAY_KEYS[FEST_DAY_KEYS.length - 1], true);
