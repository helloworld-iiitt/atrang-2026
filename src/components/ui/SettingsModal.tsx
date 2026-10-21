"use client";

import { useId, type ReactNode } from "react";
import { KEYBOARD_CONTROLS } from "@/lib/constants";
import {
  updateSettings,
  useSettings,
  type MotionPreference,
  type QualityPreference,
  type TimeOfDay,
} from "@/lib/settings";
import { closePanel, usePanel } from "@/lib/ui-store";
import { MinecraftButton } from "../minecraft/MinecraftButton";
import { Modal } from "./Modal";
import { toggleMusic } from "./MusicToggle";
import { toggleSound } from "./SoundToggle";

type Option<T extends string> = { value: T; label: string };

function OptionRow<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint?: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
}) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <div>
        <p id={id} className="font-pixel text-sm tracking-wider text-bone uppercase">
          {label}
        </p>
        {hint ? <p className="text-sm text-mist">{hint}</p> : null}
      </div>
      <div role="group" aria-labelledby={id} className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {options.map((option) => (
          <MinecraftButton
            key={option.value}
            size="sm"
            variant="slate"
            breakEffect={false}
            aria-pressed={value === option.value}
            onActivate={() => onChange(option.value)}
          >
            {option.label}
          </MinecraftButton>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4">
      <h3 className="font-pixel border-b-2 border-white/10 pb-2 text-xs tracking-[0.3em] text-gold uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

const MOTION_OPTIONS: Option<MotionPreference>[] = [
  { value: "system", label: "System" },
  { value: "reduce", label: "Reduced" },
  { value: "full", label: "Full" },
];

const QUALITY_OPTIONS: Option<QualityPreference>[] = [
  { value: "auto", label: "Auto" },
  { value: "low", label: "Fast" },
  { value: "high", label: "Fancy" },
];

const TIME_OPTIONS: Option<TimeOfDay>[] = [
  { value: "day", label: "Day" },
  { value: "sunset", label: "Sunset" },
  { value: "night", label: "Night" },
  { value: "cycle", label: "Cycle" },
];

export function SettingsModal() {
  const open = usePanel() === "settings";
  const settings = useSettings();
  const volumeId = useId();

  return (
    <Modal
      open={open}
      onClose={closePanel}
      eyebrow="Options"
      title="Controls & Settings"
      size="lg"
      footer={
        <MinecraftButton variant="grass" onActivate={closePanel} breakEffect={false} data-autofocus>
          Done
        </MinecraftButton>
      }
    >
      <div className="grid gap-8">
        <Section title="Audio">
          <OptionRow
            label="Sound effects"
            hint="Clicks and block-breaking sounds. Off by default."
            value={settings.sound ? "on" : "off"}
            options={[
              { value: "off", label: "Off" },
              { value: "on", label: "On" },
            ]}
            onChange={(v) => {
              if ((v === "on") !== settings.sound) toggleSound(settings);
            }}
          />
          <OptionRow
            label="Background music"
            hint="A looping soundtrack while you explore. Off by default."
            value={settings.music ? "on" : "off"}
            options={[
              { value: "off", label: "Off" },
              { value: "on", label: "On" },
            ]}
            onChange={(v) => {
              if ((v === "on") !== settings.music) toggleMusic(settings);
            }}
          />
          <div className="grid gap-2">
            <label htmlFor={volumeId} className="font-pixel text-sm tracking-wider text-bone uppercase">
              Volume: {Math.round(settings.volume * 100)}%
            </label>
            <input
              id={volumeId}
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              disabled={!settings.sound && !settings.music}
              onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
              className="h-3 w-full cursor-pointer accent-[var(--color-grass-light)] disabled:cursor-not-allowed disabled:opacity-40"
            />
          </div>
        </Section>

        <Section title="Video">
          <OptionRow
            label="Graphics"
            hint="Fast simplifies the world for older devices. Fancy adds shadows and more terrain."
            value={settings.quality}
            options={QUALITY_OPTIONS}
            onChange={(quality) => updateSettings({ quality })}
          />
          <OptionRow
            label="Time of day"
            value={settings.timeOfDay}
            options={TIME_OPTIONS}
            onChange={(timeOfDay) => updateSettings({ timeOfDay })}
          />
          <OptionRow
            label="Motion"
            hint="Reduced pauses the camera, clouds, and block-break animations."
            value={settings.motion}
            options={MOTION_OPTIONS}
            onChange={(motion) => updateSettings({ motion })}
          />
        </Section>

        <Section title="Controls">
          <dl className="grid gap-3">
            {KEYBOARD_CONTROLS.map((control) => (
              <div key={control.action} className="flex flex-wrap items-center justify-between gap-3">
                <dt className="text-sm text-mist">{control.action}</dt>
                <dd className="flex gap-1.5">
                  {control.keys.map((key) => (
                    <kbd
                      key={key}
                      className="font-pixel min-w-8 border-2 border-black bg-stone-dark px-2 py-0.5 text-center text-xs text-bone shadow-[inset_-2px_-2px_0_rgb(0_0_0/0.5),inset_2px_2px_0_rgb(255_255_255/0.15)]"
                    >
                      {key}
                    </kbd>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </Modal>
  );
}
