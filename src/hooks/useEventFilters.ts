"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { countByCategory, filterEvents, type CategoryFilter } from "@/lib/events";
import type { FestEvent } from "@/data/events";

export function useEventFilters(events: readonly FestEvent[]) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => filterEvents(events, { query: deferredQuery, category }),
    [events, deferredQuery, category],
  );
  const counts = useMemo(() => countByCategory(events), [events]);

  const reset = useCallback(() => {
    setQuery("");
    setCategory("All");
  }, []);

  return {
    query,
    setQuery,
    category,
    setCategory,
    results,
    counts,
    reset,
    isFiltered: query.trim() !== "" || category !== "All",
  };
}
