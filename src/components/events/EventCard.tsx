"use client";

import { CalendarDays, Clock, User, Users } from "lucide-react";
import type { CSSProperties } from "react";
import { useBlockBreak } from "@/hooks/useBlockBreak";
import type { FestEvent } from "@/data/events";
import { eventDateRange, getEventTheme } from "@/lib/events";
import { BreakableBlock } from "../minecraft/BreakableBlock";
import { IsoCube } from "./IsoCube";

const SPARKLES = [
  { top: "12%", left: "8%", delay: "0ms" },
  { top: "22%", right: "10%", delay: "300ms" },
  { bottom: "18%", left: "14%", delay: "600ms" },
  { bottom: "30%", right: "6%", delay: "900ms" },
] as const;

type EventCardProps = {
  event: FestEvent;
  onSelect: (event: FestEvent) => void;
};

export function EventCard({ event, onSelect }: EventCardProps) {
  const theme = getEventTheme(event);
  const { ref, trigger, phase, stage, isBusy } = useBlockBreak<HTMLElement>({
    palette: theme.palette,
    particles: 22,
  });
  const ParticipationIcon = event.participation === "Individual" ? User : Users;
  const dates = eventDateRange(event);

  return (
    <article
      ref={ref}
      className="mc-panel mc-panel--slate mc-card group relative h-full"
      style={{ "--accent": theme.color } as CSSProperties}
    >
      <BreakableBlock phase={phase} stage={stage} className="flex h-full flex-col gap-4 p-5">
        <div aria-hidden className="mc-card-sparkle pointer-events-none absolute inset-0">
          {SPARKLES.map(({ delay, ...pos }, i) => (
            <span key={i} style={{ ...pos, animationDelay: delay }} />
          ))}
        </div>

        <div className="flex items-start justify-between gap-3">
          <IsoCube color={theme.color} icon={theme.icon} size={56} className="m-2" />
          <div className="flex flex-col items-end gap-2 text-right">
            <span
              className="font-pixel border-2 border-black px-2 py-0.5 text-xs tracking-wider text-black uppercase"
              style={{ background: theme.color }}
            >
              {event.category}
            </span>
            <span className="text-xs text-mist">{theme.biome}</span>
          </div>
        </div>

        <div className="grid gap-2">
          <h3 className="font-pixel text-2xl leading-tight font-bold text-bone text-shadow-pixel">
            {event.title}
          </h3>
          <p className="text-[0.95rem] leading-relaxed text-mist">{event.summary}</p>
        </div>

        <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-mist">
          {dates ? (
            <li className="inline-flex items-center gap-1.5 text-bone">
              <CalendarDays aria-hidden className="size-3.5" />
              {dates}
            </li>
          ) : null}
          {event.participation ? (
            <li className="inline-flex items-center gap-1.5">
              <ParticipationIcon aria-hidden className="size-3.5" />
              {event.participation}
              {event.teamSize ? ` · ${event.teamSize}` : ""}
            </li>
          ) : null}
          {event.duration ? (
            <li className="inline-flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" />
              {event.duration}
            </li>
          ) : null}
        </ul>

        <button
          type="button"
          className="mc-btn mc-btn--sm static w-full after:absolute after:inset-0 after:content-['']"
          onClick={() => {
            if (!isBusy) trigger(() => onSelect(event));
          }}
          aria-haspopup="dialog"
          aria-label={`View details for ${event.title}`}
        >
          View details
        </button>
      </BreakableBlock>
    </article>
  );
}
