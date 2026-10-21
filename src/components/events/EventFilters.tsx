"use client";

import { CATEGORY_FILTERS, getCategoryTheme, type CategoryFilter } from "@/lib/events";
import { MinecraftButton } from "../minecraft/MinecraftButton";
import { EventSearch } from "./EventSearch";

type EventFiltersProps = {
  query: string;
  onQueryChange: (query: string) => void;
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  counts: Record<CategoryFilter, number>;
  resultCount: number;
  total: number;
};

export function EventFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  counts,
  resultCount,
  total,
}: EventFiltersProps) {
  return (
    <div className="grid gap-4">
      <EventSearch value={query} onChange={onQueryChange} />
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((c) => {
          const active = category === c;
          return (
            <MinecraftButton
              key={c}
              size="sm"
              variant="slate"
              breakEffect={false}
              aria-pressed={active}
              onActivate={() => onCategoryChange(c)}
              icon={
                c === "All" ? undefined : (
                  <span
                    className="block size-2.5 border border-black"
                    style={{ background: getCategoryTheme(c).color }}
                  />
                )
              }
            >
              {c === "All" ? "All events" : c}
              <span className="ml-1 text-[0.7rem] opacity-70">{counts[c]}</span>
            </MinecraftButton>
          );
        })}
      </div>
      <p className="text-sm text-mist" aria-live="polite">
        Showing <strong className="text-bone">{resultCount}</strong> of {total} events
        {category !== "All" ? (
          <>
            {" "}
            in <strong className="text-bone">{getCategoryTheme(category).biome}</strong>
          </>
        ) : null}
        {query.trim() ? (
          <>
            {" "}
            matching “<span className="text-bone">{query.trim()}</span>”
          </>
        ) : null}
      </p>
    </div>
  );
}
