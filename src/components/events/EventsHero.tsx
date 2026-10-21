"use client";

import { ChevronsDown } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { FEST } from "@/lib/constants";
import type { EventCategory } from "@/data/events";
import { ACTIVE_CATEGORIES, getCategoryTheme } from "@/lib/events";
import { PixelHeading } from "../branding/PixelHeading";
import { IsoCube } from "./IsoCube";

type EventsHeroProps = {
  eventCount: number;
  onPickCategory: (category: EventCategory) => void;
};

export function EventsHero({ eventCount, onPickCategory }: EventsHeroProps) {
  const play = useSoundEffects();
  return (
    <section
      aria-labelledby="events-title"
      className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col justify-center gap-10 px-4 py-16 sm:px-6"
    >
      <div className="max-w-3xl">
        <PixelHeading as="h1" id="events-title" eyebrow={`${FEST.name} ${FEST.edition} · World map`}>
          Explore the world of Atrang
        </PixelHeading>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone/90 sm:text-xl">
          Every event lives in its own biome. Choose one to jump straight to its events, or scroll down to
          survey the whole map.
        </p>
      </div>

      <div className="grid gap-4">
        <p className="font-pixel text-xs tracking-[0.3em] text-gold uppercase text-shadow-pixel">
          Choose a biome
        </p>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-2 sm:gap-3 lg:grid-cols-[repeat(auto-fill,minmax(10rem,13rem))]">
          {ACTIVE_CATEGORIES.map((category) => {
            const theme = getCategoryTheme(category);
            return (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => {
                    play("click");
                    onPickCategory(category);
                  }}
                  className="group mc-panel mc-panel--glass flex h-full w-full flex-col items-center gap-2 px-1.5 pt-4 pb-3 transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 sm:px-3"
                >
                  <IsoCube
                    color={theme.color}
                    icon={theme.icon}
                    size={40}
                    className="m-1.5 transition-transform group-hover:scale-110"
                  />
                  <span className="font-pixel text-xs text-bone uppercase sm:text-sm">{category}</span>
                  <span className="text-center text-[0.65rem] leading-tight text-mist sm:text-[0.7rem]">
                    {theme.biome}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <dl className="font-pixel flex gap-6 text-shadow-pixel">
          {[
            { value: eventCount, label: "Events" },
            { value: ACTIVE_CATEGORIES.length, label: ACTIVE_CATEGORIES.length === 1 ? "Biome" : "Biomes" },
            { value: 1, label: "World" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="text-xs tracking-widest text-mist uppercase">{s.label}</dt>
              <dd className="text-3xl text-gold">{s.value}</dd>
            </div>
          ))}
        </dl>
        <a
          href="#events"
          className="font-pixel ml-auto inline-flex items-center gap-2 text-sm tracking-[0.2em] text-bone uppercase text-shadow-pixel hover:text-splash"
        >
          Scroll to explore
          <ChevronsDown aria-hidden className="size-5 animate-bob" strokeWidth={3} />
        </a>
      </div>
    </section>
  );
}
