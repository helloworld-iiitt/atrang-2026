/**
 * UI sound effects via Web Audio. Sounds with a file in `AUDIO_FILES` play that
 * sample; the rest are synthesised. The AudioContext is only created after a user
 * gesture (the first sound request always comes from a click or key press).
 */

import { AUDIO_FILES } from "./audio-config";

export type SoundName = "click" | "break" | "pop" | "open" | "close";

let ctx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
const fileBuffers = new Map<string, AudioBuffer | "loading" | "failed">();
let preloaded = false;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function getNoise(audio: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const length = Math.floor(audio.sampleRate * 0.5);
  noiseBuffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    // Mostly brown noise (gravelly) with a little white noise for grit.
    last = (last + 0.09 * white) / 1.02;
    data[i] = last * 3 + white * 0.12;
  }
  return noiseBuffer;
}

/** Returns a decoded file buffer if ready; starts loading it otherwise. */
function fileBuffer(audio: AudioContext, url: string): AudioBuffer | null {
  const cached = fileBuffers.get(url);
  if (cached instanceof AudioBuffer) return cached;
  if (cached) return null;
  fileBuffers.set(url, "loading");
  fetch(url)
    .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error(res.statusText))))
    .then((data) => audio.decodeAudioData(data))
    .then((buffer) => fileBuffers.set(url, buffer))
    .catch(() => fileBuffers.set(url, "failed"));
  return null;
}

function tone(
  audio: AudioContext,
  out: AudioNode,
  {
    type,
    from,
    to,
    start,
    duration,
    gain,
  }: {
    type: OscillatorType;
    from: number;
    to: number;
    start: number;
    duration: number;
    gain: number;
  },
) {
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + duration);
  amp.gain.setValueAtTime(gain, start);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp).connect(out);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** One short burst of filtered noise — the building block of every stone/dirt sound. */
function grain(
  audio: AudioContext,
  out: AudioNode,
  {
    start,
    duration,
    gain,
    freq,
    q = 1.1,
  }: { start: number; duration: number; gain: number; freq: number; q?: number },
) {
  const src = audio.createBufferSource();
  src.buffer = getNoise(audio);
  src.playbackRate.value = 0.85 + Math.random() * 0.3;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;
  const amp = audio.createGain();
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter).connect(amp).connect(out);
  src.start(start, Math.random() * 0.3, duration + 0.05);
}

const jitter = (base: number, spread: number) => base * (1 - spread / 2 + Math.random() * spread);

export function playSound(name: SoundName, volume: number) {
  const audio = getAudioContext();
  if (!audio || volume <= 0) return;
  if (!preloaded) {
    // Decode sample files on the first sound so the first block break is already ready.
    preloaded = true;
    if (AUDIO_FILES.break) fileBuffer(audio, AUDIO_FILES.break);
    if (AUDIO_FILES.click) fileBuffer(audio, AUDIO_FILES.click);
  }
  const out = audio.createGain();
  out.gain.value = volume * 0.5;
  out.connect(audio.destination);
  const t = audio.currentTime + 0.005;

  const file = name === "break" || name === "click" ? AUDIO_FILES[name] : undefined;
  if (file) {
    const buffer = fileBuffer(audio, file);
    if (buffer) {
      const src = audio.createBufferSource();
      src.buffer = buffer;
      // Slight random pitch so repeated breaks don't sound identical.
      src.playbackRate.value = jitter(1, 0.16);
      src.connect(out);
      src.start(t);
      return;
    }
  }

  switch (name) {
    case "click":
      tone(audio, out, { type: "square", from: 1250, to: 820, start: t, duration: 0.05, gain: 0.18 });
      break;
    case "break": {
      // Stone giving way: a cascade of crunchy grains falling in pitch, over a soft thud.
      const grains = 5;
      for (let i = 0; i < grains; i++) {
        grain(audio, out, {
          start: t + i * jitter(0.028, 0.4),
          duration: jitter(0.09, 0.4) + i * 0.015,
          gain: 0.9 - i * 0.12,
          freq: jitter(1700 - i * 230, 0.25),
          q: 0.9,
        });
      }
      grain(audio, out, { start: t, duration: 0.22, gain: 0.45, freq: 320, q: 0.7 });
      tone(audio, out, { type: "triangle", from: 150, to: 55, start: t, duration: 0.14, gain: 0.3 });
      break;
    }
    case "pop":
      tone(audio, out, { type: "sine", from: 420, to: 980, start: t, duration: 0.09, gain: 0.3 });
      break;
    case "open":
      tone(audio, out, { type: "square", from: 520, to: 780, start: t, duration: 0.07, gain: 0.12 });
      tone(audio, out, { type: "square", from: 780, to: 1040, start: t + 0.07, duration: 0.08, gain: 0.1 });
      break;
    case "close":
      tone(audio, out, { type: "square", from: 780, to: 420, start: t, duration: 0.09, gain: 0.12 });
      break;
  }
}
