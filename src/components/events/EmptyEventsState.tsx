"use client";

import { RotateCcw } from "lucide-react";
import { MinecraftButton } from "../minecraft/MinecraftButton";
import { IsoCube } from "./IsoCube";

export function EmptyEventsState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mc-panel mc-panel--slate flex flex-col items-center gap-5 px-6 py-14 text-center">
      <IsoCube color="#5a5a64" size={64} className="opacity-80" />
      <div className="grid gap-2">
        <h3 className="font-pixel text-2xl text-bone text-shadow-pixel">Nothing to mine here</h3>
        <p className="max-w-md text-mist">
          No events match your search in this biome. Try a different keyword or explore every category.
        </p>
      </div>
      <MinecraftButton onActivate={onReset} icon={<RotateCcw className="size-4" strokeWidth={2.5} />}>
        Clear filters
      </MinecraftButton>
    </div>
  );
}
