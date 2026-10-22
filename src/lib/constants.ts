export const FEST = {
  name: "ATRANG",
  edition: "2026–27",
  college: "IIIT Tiruchirappalli",
  collegeShort: "IIIT Trichy",
  tagline: "IIIT Tiruchirappalli Technical Fest",
  motto: "A new world awaits",
  description:
    "Atrang is the annual technical fest of IIIT Tiruchirappalli — a world built by students, for builders, coders, designers, and dreamers.",
  instagram: { handle: "atrang.iiitt", url: "https://www.instagram.com/atrang.iiitt/" },
} as const;

/** Set NEXT_PUBLIC_SITE_URL to the deployed origin so social previews resolve absolute URLs. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type NavItem = { label: string; href: "/" | "/events" };

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
];

/** Rotating splash lines shown beside the logo on the home menu. */
export const SPLASH_LINES = [
  `${FEST.motto}!`,
  "Compile. Craft. Conquer!",
  "Now with 100% more circuits!",
  "Respawn at Atrang!",
  "Made in Tiruchirappalli!",
  'git commit -m "legendary"',
  "Mind the creepers in prod!",
] as const;

export const KEYBOARD_CONTROLS = [
  { keys: ["↑", "↓"], action: "Move between main menu options" },
  { keys: ["Enter", "Space"], action: "Select the focused button or event" },
  { keys: ["/"], action: "Jump to event search" },
  { keys: ["M"], action: "Toggle sound effects" },
  { keys: ["B"], action: "Toggle background music" },
  { keys: ["Esc"], action: "Close any open panel" },
] as const;

/** Duration of the block-break effect before the action fires. */
export const BREAK_DURATION_MS = 320;
