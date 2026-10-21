"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { useEventFilters } from "@/hooks/useEventFilters";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EVENTS, type EventCategory, type FestEvent } from "@/data/events";
import { PixelHeading } from "../branding/PixelHeading";
import { EmptyEventsState } from "./EmptyEventsState";
import { EventDetailsModal } from "./EventDetailsModal";
import { EventFilters } from "./EventFilters";
import { EventGrid } from "./EventGrid";
import { EventsHero } from "./EventsHero";

/** Client island for the events page: owns filter state and the selected event. */
export function EventsExperience() {
  const filters = useEventFilters(EVENTS);
  const [selected, setSelected] = useState<FestEvent | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const reduced = useReducedMotion();
  const { setCategory, setQuery } = filters;

  // Close the details panel if the page is hidden by navigation.
  useLayoutEffect(() => () => setDetailsOpen(false), []);

  const openDetails = useCallback((event: FestEvent) => {
    setSelected(event);
    setDetailsOpen(true);
  }, []);

  const pickCategory = useCallback(
    (category: EventCategory) => {
      setQuery("");
      setCategory(category);
      document.getElementById("events")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    },
    [reduced, setCategory, setQuery],
  );

  return (
    <>
      <EventsHero eventCount={EVENTS.length} onPickCategory={pickCategory} />

      <section
        id="events"
        aria-labelledby="events-list-title"
        className="relative scroll-mt-20 border-t-2 border-black bg-[rgb(8_9_14/0.78)] shadow-[inset_0_2px_0_rgb(255_255_255/0.06)] backdrop-blur-sm"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6">
          <PixelHeading id="events-list-title" eyebrow="Quest board">
            All events
          </PixelHeading>
          <EventFilters
            query={filters.query}
            onQueryChange={filters.setQuery}
            category={filters.category}
            onCategoryChange={filters.setCategory}
            counts={filters.counts}
            resultCount={filters.results.length}
            total={EVENTS.length}
          />
          {filters.results.length > 0 ? (
            <EventGrid events={filters.results} onSelect={openDetails} />
          ) : (
            <EmptyEventsState onReset={filters.reset} />
          )}
        </div>
      </section>

      <EventDetailsModal event={selected} open={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </>
  );
}
