"use client";

import { Clock, ExternalLink, Trophy, User, Users } from "lucide-react";
import type { ReactNode } from "react";
import type { FestEvent } from "@/data/events";
import { getEventTheme } from "@/lib/events";
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

type EventDetailsModalProps = {
  event: FestEvent | null;
  open: boolean;
  onClose: () => void;
};

export function EventDetailsModal({ event, open, onClose }: EventDetailsModalProps) {
  const theme = event ? getEventTheme(event) : null;
  const ParticipationIcon = event?.participation === "Individual" ? User : Users;

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
          </dl>

          {event.highlights?.length ? (
            <div className="grid gap-3">
              <h3 className="font-pixel text-xs tracking-[0.3em] text-gold uppercase">Highlights</h3>
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

          <div className="mc-panel mc-panel--slate grid gap-3 p-4">
            <h3 className="font-pixel text-xs tracking-[0.3em] text-gold uppercase">Registration</h3>
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
          <p className="text-xs text-mist/80">
            Details may change — check with the organising club for updates.
          </p>
        </div>
      ) : null}
    </Modal>
  );
}
