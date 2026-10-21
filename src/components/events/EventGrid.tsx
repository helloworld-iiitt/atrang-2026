"use client";

import { AnimatePresence, motion } from "motion/react";
import type { FestEvent } from "@/data/events";
import { EventCard } from "./EventCard";

type EventGridProps = {
  events: readonly FestEvent[];
  onSelect: (event: FestEvent) => void;
};

export function EventGrid({ events, onSelect }: EventGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence initial={false} mode="popLayout">
        {events.map((event) => (
          <motion.li
            key={event.id}
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.22 }}
          >
            <EventCard event={event} onSelect={onSelect} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
