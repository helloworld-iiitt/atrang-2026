import { CodeXml, Laptop, Rocket, ShieldCheck } from "lucide-react";
import type { Biome, FestEventOf } from "@/types/event";

/**
 * ─── THE ONLY FILE YOU NEED TO EDIT FOR EVENTS ───────────────────────────────
 *
 * Add an event:    add an object to EVENTS below. Give it a unique `id` and a
 *                  `category` that matches a key in BIOMES. Events that share a
 *                  category are grouped into the same biome automatically.
 *
 * Add a category:  add an entry to BIOMES with a name, a hex colour, and an icon
 *                  (pick one at https://lucide.dev/icons and add it to the import
 *                  above). It appears on the site as soon as an event uses it.
 *
 * Everything else — the biome picker, filters, counts, card colours, particle
 * colours, and page descriptions — is generated from this file.
 */

export const BIOMES = {
  Coding: { name: "Syntax Peaks", color: "#34c27a", icon: CodeXml },
  Entrepreneurship: { name: "Startup Savanna", color: "#f0a23b", icon: Rocket },
  Cybersecurity: { name: "Firewall Fortress", color: "#4fa8ff", icon: ShieldCheck },
  Hackathon: { name: "Hackers' Hollow", color: "#a46bff", icon: Laptop },
} satisfies Record<string, Biome>;

export type EventCategory = keyof typeof BIOMES;
export type FestEvent = FestEventOf<EventCategory>;

export const EVENTS: readonly FestEvent[] = [
  {
    id: "clash-of-coders",
    title: "Clash of Coders",
    summary: "Think faster. Code smarter. Compete with the best in this competitive programming showdown.",
    description: `THE CODING BATTLEFIELD IS HERE!

💻 CLASH OF CODERS — Presented by Competitive Programming Club | ATRANG 2026

Think faster. Code smarter. Compete with the best.

CLASH. COMPETE. CONQUER.

🏆 WINNER — ₹4,000/-
🥈 RUNNER UP — ₹2,000/-

👥 TEAM SIZE: 4 MEMBERS (Mandatory)

📲 REGISTER NOW:
https://forms.gle/NMWYGiV9Qst6AX4CA

💻 THE CLASH IS READY. ARE YOU?

For queries, contact:
Tanish Patidar - +91 91658 49391
Aditya Raj - +91 70043 72711
Shaik Sareen - +91 81060 85774
Syed Adam - +91 99667 86351`,
    category: "Coding",
    participation: "Team",
    teamSize: "4 members",
    prize: "₹4,000 winner · ₹2,000 runner-up",
    registrationUrl: "https://forms.gle/NMWYGiV9Qst6AX4CA",
    highlights: [
      "Competitive programming",
      "Winner: ₹4,000",
      "Runner-up: ₹2,000",
      "Presented by Competitive Programming Club",
    ],
  },
  {
    id: "startup-sprint",
    title: "Startup Sprint",
    summary: "Turn an idea into a startup in just 24 hours through innovation, validation, and pitching.",
    description: `E-CELL IIIT TRICHY PRESENTS

🏁 STARTUP SPRINT — 24-HOUR STARTUP HACKATHON

📝 Register here:
https://forms.gle/JxqLdKHSDnDPXqs5A

Have a startup idea or want to build something from scratch? Turn your idea into a startup in just 24 hours!

What to Expect?

• Identify a real-world problem and define your problem statement.
• Develop an innovative solution.
• Validate your idea by interacting with potential users.
• Build an MVP overnight.
• Pitch your startup to the judges.

Complete each stage to move one step closer to winning!

🏆 Prize Pool: ₹6,000
1st Prize: ₹4,000
Runner-up: ₹2,000

Think fast. Build smart. Pitch big.`,
    category: "Entrepreneurship",
    participation: "Team",
    teamSize: "As specified by organizers",
    duration: "24 hours",
    prize: "₹6,000 pool — ₹4,000 winner · ₹2,000 runner-up",
    registrationUrl: "https://forms.gle/JxqLdKHSDnDPXqs5A",
    highlights: [
      "24-hour startup hackathon",
      "Problem identification and validation",
      "Build an MVP",
      "Pitch to judges",
      "Prize pool: ₹6,000",
    ],
  },
  {
    id: "netsec-club",
    title: "NetSec Club",
    summary: "Explore cybersecurity through CTF challenges, technical workshops, talks, and innovation.",
    description: `🚨🔥 ATRANG 2026 — THE TECHNICAL FEST 🔥🚨

The NetSec Club, IIIT Tiruchirappalli is bringing you an exciting tech experience packed with cybersecurity, challenges, and innovation! 🛡️💻

🏆 PRIZE POOL: ₹6,000
🥇 1st Place — ₹4,000
🥈 2nd Place — ₹2,000

⚡ What's waiting for you?
🔐 CTF Challenges
💻 Technical Workshops
🎤 Tech Talks
🚀 And much more!

📝 Interested in participating? Fill out the registration form below!

👉 https://forms.gle/GC1UHVuyxbJqKuNg6

📢 Make sure to fill out the form and stay tuned for more updates!

🔥 ATRANG 2026 — Same Internet. Different Perspectives.

Organised by NetSec Club, IIIT Tiruchirappalli 🛡️`,
    category: "Cybersecurity",
    participation: "Individual or Team",
    prize: "₹6,000 pool — ₹4,000 first · ₹2,000 second",
    registrationUrl: "https://forms.gle/GC1UHVuyxbJqKuNg6",
    highlights: [
      "CTF challenges",
      "Technical workshops",
      "Tech talks",
      "Prize pool: ₹6,000",
      "Organised by NetSec Club",
    ],
  },
  {
    id: "crossover",
    title: "Crossover",
    summary: "Bring your favourite fictional universe to life through an original, theme-based website.",
    description: `CROSSOVER — WHERE FANDOM MEETS INNOVATION

Build a website inspired by a popular movie, web series, video game, or fictional universe.

🎬 THEMES
Stranger Things, Game of Thrones, Minecraft, Marvel, and more.

👥 TEAM SIZE: 3–4 MEMBERS

⚙️ DEVELOPMENT RULES
• Only open-source resources with clear, verifiable licenses are permitted.
• Paid AI tools, paid LLM services, proprietary resources, and paid assets are strictly prohibited.
• AI tools and coding harnesses may be used only if they satisfy the open-source requirements.
• Projects must be original and developed specifically for this hackathon.
• Copied code, pre-existing projects, and old submissions are prohibited.
• Use a new GitHub repository with no commits predating the official development period.

🏆 MAIN EVALUATION AREAS
• Theme integration
• Originality and creativity
• System design
• Backend implementation
• AI integration
• UI/UX and presentation

Additional evaluation criteria may also apply.

⚠️ Violations of the rules may result in disqualification.

Build something original. Bring a universe to life. Make it unforgettable.`,
    category: "Hackathon",
    participation: "Team",
    teamSize: "3–4 members",
    highlights: [
      "Movie, series, and gaming-inspired websites",
      "Open-source resources only",
      "Original development required",
      "Backend and AI integration",
      "System design and creativity",
      "Presentation and demonstration",
    ],
  },
];
