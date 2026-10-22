"use client";

import { Cpu, Lightbulb, Swords, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { FEST } from "@/lib/constants";
import { closePanel, usePanel } from "@/lib/ui-store";
import { InstagramIcon } from "../branding/InstagramIcon";
import { MinecraftButton } from "../minecraft/MinecraftButton";
import { Modal } from "../ui/Modal";

const PILLARS = [
  {
    icon: Swords,
    title: "Compete",
    text: "Coding battles, CTF challenges, and hackathons that test skill under pressure.",
  },
  {
    icon: Cpu,
    title: "Build",
    text: "Hardware, software, and design challenges where ideas become working things.",
  },
  {
    icon: Lightbulb,
    title: "Learn",
    text: "Sessions and hands-on experiences that push beyond the classroom.",
  },
  { icon: Users, title: "Connect", text: "Meet builders, mentors, and teams from across campuses." },
] as const;

export function AboutModal() {
  const open = usePanel() === "about";
  const pathname = usePathname();

  return (
    <Modal
      open={open}
      onClose={closePanel}
      eyebrow={`${FEST.college} · ${FEST.edition}`}
      title="About Atrang"
      size="lg"
      footer={
        <>
          <MinecraftButton variant="slate" onActivate={closePanel} breakEffect={false}>
            Back
          </MinecraftButton>
          {pathname !== "/events" ? (
            <MinecraftButton
              href="/events"
              variant="grass"
              breakEffect={false}
              onClick={() => closePanel()}
              data-autofocus
            >
              Explore events
            </MinecraftButton>
          ) : (
            <MinecraftButton variant="grass" onActivate={closePanel} breakEffect={false} data-autofocus>
              Keep exploring
            </MinecraftButton>
          )}
        </>
      }
    >
      <div className="grid gap-6 text-[1.02rem] leading-relaxed text-mist">
        <p>
          <strong className="text-bone">Atrang</strong> is the annual technical fest of {FEST.college} — a
          world built by students, for anyone who loves to code, solder, design, and dream. Each edition turns
          the campus into a playground of competitions, workshops, and showcases.
        </p>
        <p>
          For {FEST.edition}, Atrang opens a brand-new world. Pick your path, gather your party, and craft
          something legendary.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="mc-panel mc-panel--slate flex gap-3 p-4">
              <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-gold" strokeWidth={2.5} />
              <div>
                <p className="font-pixel text-base tracking-wide text-bone uppercase">{title}</p>
                <p className="text-sm leading-snug">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mc-panel mc-panel--slate flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-snug">
            Updates, announcements, and behind-the-scenes from the Atrang team on Instagram.
          </p>
          <MinecraftButton
            href={FEST.instagram.url}
            external
            size="sm"
            icon={<InstagramIcon className="size-4" strokeWidth={2.5} />}
            className="shrink-0 normal-case"
          >
            @{FEST.instagram.handle}
            <span className="sr-only"> on Instagram (opens in a new tab)</span>
          </MinecraftButton>
        </div>
        <p className="border-l-4 border-gold/70 pl-3 text-sm">
          Dates, venue, and the official event line-up will be announced by the Atrang organising team.
        </p>
      </div>
    </Modal>
  );
}
