/**
 * Looping background music. Routed through Web Audio so volume works everywhere
 * (iOS ignores `HTMLAudioElement.volume`), and only started from a user gesture.
 */

import { AUDIO_FILES } from "./audio-config";
import { getAudioContext } from "./sound";

const MUSIC_LEVEL = 0.45;

let element: HTMLAudioElement | null = null;
let gain: GainNode | null = null;
let wanted = false;
let volume = 0.6;
let waitingForGesture = false;
let pauseTimer = 0;

function hasUserActivation(): boolean {
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } })
    .userActivation;
  return activation ? activation.hasBeenActive : true;
}

function ensureGraph(): boolean {
  if (element && gain) return true;
  const src = AUDIO_FILES.music;
  const ctx = getAudioContext();
  if (!src || !ctx) return false;
  element = new Audio(src);
  element.loop = true;
  element.preload = "auto";
  gain = ctx.createGain();
  gain.gain.value = 0;
  ctx.createMediaElementSource(element).connect(gain).connect(ctx.destination);
  return true;
}

function fadeTo(value: number, seconds: number) {
  const ctx = getAudioContext();
  if (!ctx || !gain) return;
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(value, now + seconds);
}

/** Retry on the next click or key press when the browser blocks playback. */
function awaitGesture() {
  if (waitingForGesture) return;
  waitingForGesture = true;
  const resume = () => {
    waitingForGesture = false;
    window.removeEventListener("pointerdown", resume);
    window.removeEventListener("keydown", resume);
    if (wanted) start();
  };
  window.addEventListener("pointerdown", resume);
  window.addEventListener("keydown", resume);
}

function start() {
  if (!hasUserActivation()) return awaitGesture();
  if (!ensureGraph() || !element) return;
  window.clearTimeout(pauseTimer);
  element
    .play()
    .then(() => fadeTo(volume * MUSIC_LEVEL, 2))
    .catch(() => awaitGesture());
}

function stop() {
  fadeTo(0, 0.8);
  window.clearTimeout(pauseTimer);
  pauseTimer = window.setTimeout(() => {
    if (!wanted) element?.pause();
  }, 850);
}

/** Bring playback in line with the current settings. Safe to call repeatedly. */
export function syncMusic(enabled: boolean, nextVolume: number) {
  if (typeof window === "undefined") return;
  volume = nextVolume;
  if (enabled && !wanted) {
    wanted = true;
    start();
  } else if (!enabled && wanted) {
    wanted = false;
    stop();
  } else if (enabled && element && !element.paused) {
    fadeTo(volume * MUSIC_LEVEL, 0.2);
  }
}

/** Pause while the tab is hidden; resume when it returns. Returns a cleanup function. */
export function bindMusicToVisibility(): () => void {
  const onChange = () => {
    if (!element) return;
    if (document.hidden) element.pause();
    else if (wanted) start();
  };
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
