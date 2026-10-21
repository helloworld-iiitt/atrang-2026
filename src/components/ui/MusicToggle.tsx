"use client";

import { Disc3 } from "lucide-react";
import { syncMusic } from "@/lib/music";
import { updateSettings, useSettings } from "@/lib/settings";
import { MinecraftButton } from "../minecraft/MinecraftButton";

/** Must run inside the click/key handler so browsers allow playback to start. */
export function toggleMusic(current: { music: boolean; volume: number }) {
  const next = !current.music;
  updateSettings({ music: next });
  syncMusic(next, current.volume);
}

export function MusicToggle({ className }: { className?: string }) {
  const settings = useSettings();
  return (
    <MinecraftButton
      variant="slate"
      size="icon"
      breakEffect={false}
      onActivate={() => toggleMusic(settings)}
      aria-pressed={settings.music}
      aria-label={settings.music ? "Turn background music off" : "Turn background music on"}
      title={settings.music ? "Music on (B)" : "Music off (B)"}
      className={className}
    >
      <Disc3
        className={settings.music ? "size-5 animate-[spin_3s_linear_infinite]" : "size-5 opacity-70"}
        strokeWidth={2.5}
      />
    </MinecraftButton>
  );
}
