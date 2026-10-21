/**
 * Audio files served from `public/audio/`. Sound effects without a file here fall
 * back to the synthesised versions in `sound.ts`; music is only played from a file.
 *
 * Make sure the Atrang team has the rights to any audio published on the site.
 */
export const AUDIO_FILES: {
  music?: string;
  break?: string;
  click?: string;
} = {
  music: "/audio/background-music.mp3",
  break: "/audio/block-break.wav",
};
