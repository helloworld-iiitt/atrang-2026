"use client";

import {
  BadgeCheck,
  CalendarClock,
  Clock,
  ExternalLink,
  Landmark,
  MapPin,
  Phone,
  Ticket,
  Trophy,
  User,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { FestEvent } from "@/data/events";
import { formatFestDay, getEventTheme } from "@/lib/events";
import { MinecraftButton } from "../minecraft/MinecraftButton";
import { Modal } from "../ui/Modal";
import { IsoCube } from "./IsoCube";

const TBA = "To be announced";

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) {
  return (
    <div className="mc-panel mc-panel--slate flex items-center gap-3 p-3">
      <span aria-hidden className="text-gold">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="font-pixel text-[0.7rem] tracking-[0.2em] text-mist uppercase">{label}</dt>
        <dd className={value ? "text-bone" : "text-mist italic"}>{value ?? TBA}</dd>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="font-pixel text-xs tracking-[0.3em] text-gold uppercase">{children}</h3>;
}

type EventDetailsModalProps = {
  event: FestEvent | null;
  open: boolean;
  onClose: () => void;
};

export function EventDetailsModal({ event, open, onClose }: EventDetailsModalProps) {
  const theme = event ? getEventTheme(event) : null;
  const ParticipationIcon = event?.participation === "Individual" ? User : Users;

  // Optional facts are only shown when the event provides them.
  const extras = event
    ? [
        { icon: <Landmark className="size-5" />, label: "Organised by", value: event.organizer },
        { icon: <MapPin className="size-5" />, label: "Venue", value: event.venue },
        { icon: <BadgeCheck className="size-5" />, label: "Eligibility", value: event.eligibility },
        { icon: <Ticket className="size-5" />, label: "Entry fee", value: event.fee },
        {
          icon: <CalendarClock className="size-5" />,
          label: "Registration closes",
          value: event.registrationDeadline,
        },
      ].filter((item): item is typeof item & { value: string } => Boolean(item.value))
    : [];

  return (
    <Modal
      open={open && event !== null}
      onClose={onClose}
      size="lg"
      eyebrow={event && theme ? `${event.category} · ${theme.biome}` : undefined}
      title={event?.title ?? ""}
      icon={theme ? <IsoCube color={theme.color} icon={theme.icon} size={48} className="m-1.5" /> : undefined}
      footer={
        <MinecraftButton variant="slate" onActivate={onClose} breakEffect={false} data-autofocus>
          Back to events
        </MinecraftButton>
      }
    >
      {event ? (
        <div className="grid gap-6">
          <p className="text-[1.02rem] leading-relaxed whitespace-pre-line text-mist">{event.description}</p>

          <dl className="grid gap-3 sm:grid-cols-2">
            <Stat
              icon={<ParticipationIcon className="size-5" />}
              label="Participation"
              value={event.participation}
            />
            <Stat icon={<Users className="size-5" />} label="Team size" value={event.teamSize} />
            <Stat icon={<Clock className="size-5" />} label="Duration" value={event.duration} />
            <Stat icon={<Trophy className="size-5" />} label="Prizes" value={event.prize} />
            {extras.map((item) => (
              <Stat key={item.label} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </dl>

          {event.schedule?.length ? (
            <div className="grid gap-3">
              <SectionTitle>Schedule</SectionTitle>
              <ol className="grid gap-2">
                {event.schedule.map((slot, i) => (
                  <li
                    key={`${slot.day}-${slot.time}-${i}`}
                    className="mc-panel mc-panel--slate grid gap-1 p-3 sm:grid-cols-[9.5rem_1fr] sm:gap-4"
                  >
                    <div>
                      <p className="font-pixel text-xs tracking-[0.15em] text-gold uppercase">
                        Day {slot.day}
                      </p>
                      <p className="text-sm text-bone">{formatFestDay(slot.day)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-bone">{slot.title}</p>
                      <p className="flex flex-wrap gap-x-3 text-sm text-mist">
                        <span className="inline-flex items-center gap-1">
                          <Clock aria-hidden className="size-3.5" />
                          {slot.time}
                        </span>
                        {slot.venue ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin aria-hidden className="size-3.5" />
                            {slot.venue}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {event.highlights?.length ? (
            <div className="grid gap-3">
              <SectionTitle>Highlights</SectionTitle>
              <ul className="grid gap-2">
                {event.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-bone">
                    <span
                      aria-hidden
                      className="mt-2 size-2 shrink-0 border border-black"
                      style={{ background: theme?.color }}
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {event.rules?.length ? (
            <div className="grid gap-3">
              <SectionTitle>Rules</SectionTitle>
              <ol className="grid list-decimal gap-2 pl-5 text-bone marker:font-pixel marker:text-gold">
                {event.rules.map((rule) => (
                  <li key={rule} className="pl-1">
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="mc-panel mc-panel--slate grid gap-3 p-4">
            <SectionTitle>Registration</SectionTitle>
            {event.registrationUrl ? (
              <MinecraftButton
                href={event.registrationUrl}
                external
                variant="grass"
                icon={<ExternalLink className="size-4" strokeWidth={2.5} />}
              >
                Register for {event.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </MinecraftButton>
            ) : (
              <p className="text-bone">
                Registration details coming soon.{" "}
                <span className="text-mist">Check back once the organising team opens registrations.</span>
              </p>
            )}
          </div>

          {event.coordinators?.length ? (
            <div className="grid gap-3">
              <SectionTitle>Coordinators</SectionTitle>
              <ul className="grid gap-2 sm:grid-cols-2">
                {event.coordinators.map((person) => (
                  <li key={person.name} className="mc-panel mc-panel--slate flex items-center gap-3 p-3">
                    <User aria-hidden className="size-5 shrink-0 text-gold" />
                    <div className="min-w-0">
                      <p className="text-bone">{person.name}</p>
                      {person.phone ? (
                        <a
                          href={`tel:${person.phone.replace(/[^\d+]/g, "")}`}
                          className="inline-flex items-center gap-1 text-sm text-mist underline-offset-2 hover:text-splash hover:underline"
                        >
                          <Phone aria-hidden className="size-3.5" />
                          {person.phone}
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="text-xs text-mist/80">
            Details may change — check with the organising club for updates.
          </p>
        </div>
      ) : null}
    </Modal>
  );
}
