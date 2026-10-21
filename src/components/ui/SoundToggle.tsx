"use client";

import { Volume2, VolumeX } from "lucide-react";
import { updateSettings, useSettings } from "@/lib/settings";
import { playSound } from "@/lib/sound";
import { MinecraftButton } from "../minecraft/MinecraftButton";

export function toggleSound(current: { sound: boolean; volume: number }) {
  const next = !current.sound;
  updateSettings({ sound: next });
  if (next) playSound("pop", current.volume);
}

export function SoundToggle({ className }: { className?: string }) {
  const settings = useSettings();
  return (
    <MinecraftButton
      variant="slate"
      size="icon"
      breakEffect={false}
      onActivate={() => toggleSound(settings)}
      aria-pressed={settings.sound}
      aria-label={settings.sound ? "Turn sound effects off" : "Turn sound effects on"}
      title={settings.sound ? "Sound on (M)" : "Sound off (M)"}
      className={className}
    >
      {settings.sound ? (
        <Volume2 className="size-5" strokeWidth={2.5} />
      ) : (
        <VolumeX className="size-5" strokeWidth={2.5} />
      )}
    </MinecraftButton>
  );
}
