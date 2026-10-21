"use client";

import { Info, Map, Pickaxe, Settings } from "lucide-react";
import type { CSSProperties, KeyboardEvent } from "react";
import { openPanel } from "@/lib/ui-store";
import { MinecraftButton } from "../minecraft/MinecraftButton";

const ICON = "size-5";

/** Minecraft-style main menu. Arrow keys move between options like a game menu. */
export function MainMenu() {
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[data-menu-item]"));
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      index === -1 ? 0 : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    event.preventDefault();
    items[next]?.focus();
  };

  const item = (i: number) => ({ animationDelay: `${250 + i * 70}ms` }) as CSSProperties;

  return (
    <nav aria-label="Main menu" className="w-full max-w-[26rem]" onKeyDown={onKeyDown}>
      <ul className="grid gap-3">
        <li className="page-enter" style={item(0)}>
          <MinecraftButton
            href="/events"
            variant="grass"
            size="lg"
            fullWidth
            icon={<Pickaxe className={ICON} strokeWidth={2.5} />}
            data-menu-item
          >
            Enter the world
          </MinecraftButton>
        </li>
        <li className="page-enter" style={item(1)}>
          <MinecraftButton
            href="/events#events"
            fullWidth
            icon={<Map className={ICON} strokeWidth={2.5} />}
            data-menu-item
          >
            Explore events
          </MinecraftButton>
        </li>
        <li className="page-enter" style={item(2)}>
          <MinecraftButton
            fullWidth
            icon={<Info className={ICON} strokeWidth={2.5} />}
            onActivate={() => openPanel("about")}
            aria-haspopup="dialog"
            data-menu-item
          >
            About Atrang
          </MinecraftButton>
        </li>
        <li className="page-enter" style={item(3)}>
          <MinecraftButton
            fullWidth
            icon={<Settings className={ICON} strokeWidth={2.5} />}
            onActivate={() => openPanel("settings")}
            aria-haspopup="dialog"
            data-menu-item
          >
            Controls / Settings
          </MinecraftButton>
        </li>
      </ul>
    </nav>
  );
}
