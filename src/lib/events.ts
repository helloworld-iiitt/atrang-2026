import type { LucideIcon } from "lucide-react";
import { BIOMES, EVENTS, type EventCategory, type FestEvent } from "@/data/events";

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
      `${event.title} ${event.summary} ${event.description} ${BIOMES[event.category].name}`,
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
