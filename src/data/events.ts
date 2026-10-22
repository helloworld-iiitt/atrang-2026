import { Atom, Bot, CodeXml, Gamepad2, Laptop, Rocket, ShieldCheck } from "lucide-react";
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
 * Change a date:   edit FEST_DAYS. Every event's schedule refers to day numbers,
 *                  so all of them follow automatically.
 *
 * Everything else — the biome picker, filters, counts, card colours, particle
 * colours, dates, and page descriptions — is generated from this file.
 */

/** Calendar date of each fest day (YYYY-MM-DD). */
export const FEST_DAYS = {
  1: "2026-10-23",
  2: "2026-10-24",
  3: "2026-10-25",
} as const;

export const BIOMES = {
  Inagural: { name: "Atrang Arena", color: "#ff5a4f", icon: Gamepad2 },
  Hackathon: { name: "Hackers' Hollow", color: "#a46bff", icon: Laptop },
  Cybersecurity: { name: "Firewall Fortress", color: "#4fa8ff", icon: ShieldCheck },
  Coding: { name: "Syntax Peaks", color: "#34c27a", icon: CodeXml },
  Entrepreneurship: { name: "Startup Savanna", color: "#f0a23b", icon: Rocket },
  Robotics: { name: "Iron Foundry", color: "#b9c2cf", icon: Bot },
  "Fun Zone": { name: "Arcade Badlands", color: "#ff5a4f", icon: Gamepad2 },
  Quantum: { name: "Quantum Frontier", color: "#44d7e8", icon: Atom },
} satisfies Record<string, Biome>;

export type FestDay = keyof typeof FEST_DAYS;
export type EventCategory = keyof typeof BIOMES;
export type FestEvent = FestEventOf<EventCategory, FestDay>;

export const EVENTS: readonly FestEvent[] = [
  {
    id: "inauguration-ceremony",
    title: "Atrang Inauguration Ceremony",
    summary:
      "The grand opening of Atrang 2026 — bringing together faculty, students, and the organizing team to begin the celebration.",

    description: `🎉 ATRANG 2026 — INAUGURATION CEREMONY

✨ THE CELEBRATION BEGINS HERE!

Join us for the grand inauguration of ATRANG 2026, our college's annual technical fest. Be part of the opening ceremony as we come together to celebrate innovation, creativity, technology, and student talent.

🎓 CHIEF FACULTY GUEST
Dr. R. Krishnamurthy
Extra-Curricular In-Charge

🏛️ FACULTY REPRESENTATION
Head of the Department
Assistant Professor

🎤 STUDENT COORDINATORS

Technical Secretary: Ayush Soni
Host: Shubhanashi Payasi — +91 7489550689
Coordinator: Hemeshkumar S — 9345046883

📅 DATE: 23 October 2026
⏰ TIME: 10:00 AM
📍 VENUE: Room 312

🚀 A NEW CHAPTER. A NEW EXPERIENCE.
LET ATRANG 2026 BEGIN!

`,

    category: "Inagural",
    organizer: "Atrang Organizing Committee",
    participation: "Individual",
    teamSize: "Not applicable",
    prize: "No prizes",
    registrationUrl: "",

    schedule: [{ day: 1, time: "10:00 AM – 11:30 AM", title: "Inauguration Ceremony", venue: "Room 312" }],

    highlights: [
      "Grand opening of Atrang 2026",
      "Faculty and student representation",
      "Celebration of innovation, creativity, and technology",
      "Opening ceremony with speeches and performances",
    ],

    coordinators: [
      {
        name: "Ayush Soni",
        phone: "+91 73398 89592",
      },
      {
        name: "Shubhanashi Payasi",
        phone: "+91 74895 50689",
      },
      {
        name: "Hemeshkumar S",
        phone: "+91 93450 46883",
      },
    ],
  },
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

💻 THE CLASH IS READY. ARE YOU?`,
    category: "Coding",
    organizer: "Competitive Programming Club",
    participation: "Team",
    teamSize: "4 members (mandatory)",
    prize: "₹4,000 winner · ₹2,000 runner-up",
    registrationUrl: "https://forms.gle/NMWYGiV9Qst6AX4CA",
    schedule: [
      { day: 2, time: "2:00 PM – 5:00 PM", title: "Contest — session 1", venue: "Hall 312" },
      { day: 3, time: "10:00 AM – 1:00 PM", title: "Contest — session 2", venue: "Seminar Hall 213" },
    ],
    highlights: [
      "Competitive programming",
      "Winner: ₹4,000",
      "Runner-up: ₹2,000",
      "Presented by Competitive Programming Club",
    ],
    coordinators: [
      { name: "Tanish Patidar", phone: "+91 91658 49391" },
      { name: "Aditya Raj", phone: "+91 70043 72711" },
      { name: "Shaik Sareen", phone: "+91 81060 85774" },
      { name: "Syed Adam", phone: "+91 99667 86351" },
    ],
  },
  {
    id: "startup-sprint",
    title: "Startup Sprint",
    summary:
      "Turn an idea into a startup in 24 hours through problem discovery, customer validation, MVP development, and pitching.",

    description: `🚀 E-CELL IIIT TRICHY PRESENTS

🏁 STARTUP SPRINT — 24-HOUR STARTUP HACKATHON

Got a startup idea? Have a problem you want to solve?
Turn your idea into a potential business in just 24 hours!

📝 REGISTER NOW:
https://forms.gle/JxqLdKHSDnDPXqs5A

💡 THE STARTUP JOURNEY

1. PROBLEM STATEMENT
Identify and define a real-world problem worth solving.

2. SOLUTION DEVELOPMENT
Develop an innovative, practical solution to the problem.

3. IDEA VALIDATION
Interact with potential users to validate your problem and proposed solution.

4. OVERNIGHT MVP
Build a Minimum Viable Product (MVP) within the 24-hour time limit.

5. FINAL PITCH
Present your problem, solution, MVP, validation findings, and business potential to the judges.

🏆 PRIZE POOL: ₹6,000
🥇 1st Prize: ₹4,000
🥈 Runner-up: ₹2,000

🔥 WHAT YOU'LL GAIN
• Build an MVP overnight.
• Validate your idea with potential users.
• Experience real-world product development.
• Explore entrepreneurship and business strategy.
• Pitch your idea to judges.

📋 RULES
• Team size: 1–6 members, as stated in the event details.
• Complete all five stages within the 24-hour time limit.
• Demonstrate your MVP during the final presentation.
• Present evidence of customer interactions and idea validation.
• Explain the problem, solution, validation, MVP, and business potential in your final pitch.

🧑‍⚖️ JUDGING CRITERIA
• Problem identification and validation.
• Innovation and solution quality.
• MVP execution and functionality.
• Business potential and feasibility.
• Pitch quality and presentation.

THINK FAST. BUILD SMART. PITCH BIG.

Your startup journey starts here!`,

    category: "Entrepreneurship",
    organizer: "E-Cell IIIT Trichy",
    participation: "Team",
    teamSize: "1–6 members",
    duration: "24 hours",
    prize: "₹6,000 pool — ₹4,000 first prize · ₹2,000 runner-up",
    registrationUrl: "https://forms.gle/JxqLdKHSDnDPXqs5A",

    schedule: [
      {
        day: 2,
        time: "10:00 AM",
        title: "Sprint Begins — Problem Statement",
        venue: "Seminar Hall 213",
      },
      {
        day: 2,
        time: "2:00 PM – 8:00 PM",
        title: "Solution Development & Idea Validation",
        venue: "Lab 302",
      },
      {
        day: 3,
        time: "10:00 AM – 1:00 PM",
        title: "MVP Demonstrations & Final Pitches",
        venue: "Lab 302",
      },
    ],

    highlights: [
      "24-hour startup-building hackathon",
      "Identify and solve real-world problems",
      "Validate ideas with potential users",
      "Build a Minimum Viable Product overnight",
      "Pitch to judges",
      "Prize pool of ₹6,000",
    ],

    rules: [
      "Each team may have 1–6 members, based on the supplied event details.",
      "Teams must complete all five stages of the event.",
      "All work must be completed within the 24-hour time limit.",
      "Teams must demonstrate their MVP during the final presentation.",
      "Customer interactions and idea-validation findings should be presented as evidence.",
      "The final pitch should cover the problem, solution, MVP, validation results, and business potential.",
      "Final evaluation will consider problem validation, solution quality, MVP execution, business potential, and pitch presentation.",
    ],

    coordinators: [{ name: "Nishant Singh" }, { name: "Palash Patel" }],
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
🚀 And much more!

🧭 ROUNDS
• Round 1 — Prelims: 12 web and security challenges on the Level 1 stack. Top teams qualify.
• Round 2 — Finals: 10 advanced web, API, and privilege-escalation challenges on the Level 2 stack.
• Round 3 — Workshop & Talk: solution walkthroughs, a cybersecurity tech talk, and prize distribution.

🏁 Scoring: total points on the live scoreboard at the end of the time limit. Ties go to the team that reached its final score first.

💻 Bring a laptop with charger and Wi-Fi, and a modern browser (Chrome/Firefox). Useful tools: Burp Suite Community Edition, curl, Python 3, or Kali Linux/WSL.

❓ Beginners welcome — Round 1 is designed for newcomers to web security. Kali Linux is not mandatory. Cross-year and cross-department teams are welcome.

📝 Interested in participating? Fill out the registration form below!

👉 https://forms.gle/GC1UHVuyxbJqKuNg6

🔥 ATRANG 2026 — Same Internet. Different Perspectives.

Organised by NetSec Club, IIIT Tiruchirappalli 🛡️`,
    category: "Cybersecurity",
    organizer: "NetSec Club, IIIT Tiruchirappalli",
    participation: "Team",
    teamSize: "2–3 members",
    duration: "3 hours per round",
    prize: "₹6,000 pool — ₹4,000 first · ₹2,000 second",
    venue: "Hall 312",
    eligibility: "Open to all",
    fee: "Free",
    registrationUrl: "https://forms.gle/GC1UHVuyxbJqKuNg6",
    registrationDeadline: "Friday, 10:00 AM",
    schedule: [
      { day: 1, time: "2:00 PM – 5:00 PM", title: "Round 1 — CTF Prelims", venue: "Hall 312" },
      { day: 2, time: "10:00 AM – 1:00 PM", title: "Round 2 — CTF Finals", venue: "Hall 312" },
      { day: 3, time: "10:00 AM – 1:00 PM", title: "Round 3 — Workshop, talk & prizes", venue: "Hall 312" },
    ],
    highlights: [
      "CTF challenges",
      "Technical workshops",
      "Tech talks",
      "Prize pool: ₹6,000",
      "Organised by NetSec Club",
    ],
    rules: [
      "No AI tools or LLMs (ChatGPT, Claude, Copilot, etc.) during active rounds.",
      "Attacking the CTF infrastructure, the scoring portal, or other participants is prohibited (instant ban).",
      "No DoS/DDoS attacks against target labs.",
      "Sharing flags, hints, or credentials between teams is forbidden.",
      "Laptops must connect only to the authorised event network.",
      "Organisers' decisions are final in all disputes.",
    ],
    coordinators: [
      { name: "Aditya Patel", phone: "+91 82006 79211" },
      { name: "Sudhishana Mallavarapu", phone: "+91 77299 22099" },
      { name: "Himanshu Gunwant", phone: "+91 79838 84182" },
      { name: "Goutham G", phone: "+91 83040 91475" },
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

📦 SUBMIT
A working website, a new GitHub repository with a complete README, a live or local demo, and a presentation. Public deployment is not mandatory — a local demo is accepted.

⚠️ Violations of the rules may result in disqualification.

Build something original. Bring a universe to life. Make it unforgettable.`,
    category: "Hackathon",
    organizer: "Web Dev Club",
    participation: "Team",
    teamSize: "3–4 members",
    duration: "48 hours",
    prize: "₹6,000 pool — ₹4,000 winner · ₹2,000 runner-up",
    eligibility: "IIIT Tiruchirappalli students only",
    fee: "Free",
    registrationUrl: "https://forms.gle/2Xrqr5sPn64X3jjX6",
    schedule: [
      { day: 1, time: "11:00 AM", title: "Kickoff & problem statement release", venue: "Hall 312" },
      { day: 1, time: "2:00 PM onwards", title: "Build phase", venue: "Online" },
      { day: 3, time: "2:00 PM – 5:00 PM", title: "Presentations & awards", venue: "Hall 312" },
    ],
    highlights: [
      "Movie, series, and gaming-inspired websites",
      "Open-source resources only",
      "Original development required",
      "Backend and AI integration",
      "System design and creativity",
      "Presentation and demonstration",
    ],
    coordinators: [
      { name: "Arushi Sharma", phone: "+91 96949 11426" },
      { name: "Bhuvan M Acharya", phone: "+91 96066 54776" },
      { name: "Ashmit Singh" },
      { name: "Lalit Adhitya K" },
    ],
  },
  {
    id: "robo-rush",
    title: "Robo Rush",
    summary:
      "Build, compete, and dominate in a multi-round robotic arena featuring Obstacle Crash, Robo Sumo, and Speed Run.",
    description: `🤖 ROBO RUSH — Presented by Robotics Club, IIIT Trichy | ATRANG 2026

Get ready for an electrifying bot showdown of precision, power, and speed! Build and pilot your custom robots across three intense rounds of combat and agility.

🏁 ROUNDS
• Round 1 — Obstacle Crash: navigate the arena and push designated obstacles out of the zone within a fixed time limit.
• Round 2 — Robo Sumo: head-to-head robot wrestling — push your opponent completely out of the combat ring.
• Round 3 — Speed Run: race through a complex timed obstacle course. Fastest valid run wins.

🏆 JUDGING
Points for obstacles cleared in Round 1, match wins and ring-outs in Round 2, and the fastest completion time in Round 3. Cumulative points decide the podium.

🧰 WHAT TO BRING
An operational robot (custom or pre-built chassis) ready for technical inspection, a dedicated controller or transmitter, battery packs and chargers, backup power cells, and a repair kit.

🔩 PARTS & SOFTWARE
Open hardware designs, off-the-shelf motor drivers, sensors, transceivers, and chassis components are allowed, along with Arduino IDE, PlatformIO, ROS, Python, or standard microcontroller firmware tools.

❓ FAQ
• Wired or wireless? Both control mechanisms are allowed.
• Mixed teams? Yes — cross-branch and cross-year teams are welcome.
• Bot damaged mid-round? Teams get a short pit stop between bouts and runs for repairs.

Register online before Round 1, or on the spot.`,
    category: "Robotics",
    organizer: "Robotics Club, IIIT Trichy",
    participation: "Team",
    teamSize: "4 members",
    duration: "3 hours per day",
    venue: "Seminar Hall 213",
    eligibility: "Open to all students",
    fee: "Free",
    registrationUrl: "https://forms.gle/NVGH6uSehBxA2uLn9",
    registrationDeadline: "Before Round 1 (on-the-spot registration available)",
    schedule: [
      { day: 1, time: "5:00 PM – 8:00 PM", title: "Round 1 — Obstacle Crash", venue: "Seminar Hall 213" },
      { day: 2, time: "5:00 PM – 8:00 PM", title: "Round 2 — Robo Sumo", venue: "Seminar Hall 213" },
      { day: 3, time: "2:00 PM – 5:00 PM", title: "Round 3 — Speed Run", venue: "Seminar Hall 213" },
    ],
    highlights: [
      "Custom bot engineering",
      "Multi-terrain arena navigation",
      "Head-to-head Robo Sumo",
      "High-speed agility track",
      "Free entry",
    ],
    rules: [
      "Both wired and wireless remote-controlled robots are permitted.",
      "Robots must meet the safety, dimension, and weight limits checked during pre-match inspection.",
      "Damaging arena infrastructure or unsportsmanlike conduct leads to immediate disqualification.",
      "Teams must be at the venue before their scheduled match slot.",
      "Referees' and organisers' decisions are final in all rounds.",
    ],
    coordinators: [
      { name: "Abilashini V", phone: "+91 99409 95449" },
      { name: "Shashank H", phone: "+91 98448 76641" },
    ],
  },
  {
    id: "quantum-club-intro",
    title: "Quantum Club: Introduction & Qiskit Workshop",
    summary:
      "Celebrate the first-ever launch of the Quantum Club at IIIT Tiruchirappalli with an introduction to quantum computing and a hands-on Qiskit workshop.",
    description: `🌌 QUANTUM CLUB — INAUGURATION & QISKIT WORKSHOP

Be part of a first for IIIT Tiruchirappalli as we introduce the Quantum Club and open the door to the exciting world of quantum computing.

🔬 WHAT TO EXPECT
• Introduction to the Quantum Club, its goals, and future activities
• A beginner-friendly introduction to quantum computing
• A hands-on workshop using Qiskit
• An opportunity to explore quantum circuits and get started with quantum programming

📅 DATE: 24 October 2026
⏰ TIME: 2:00 PM – 5:00 PM
📍 VENUE: 312
🎟️ ENTRY: Free and open to all

No prior quantum-computing experience is assumed. Bring a laptop and curiosity; any specific setup instructions will be shared by the organizers.

Meet the club, try Qiskit, and take your first step into quantum computing!`,
    category: "Quantum",
    organizer: "Quantum Club, IIIT Tiruchirappalli",
    participation: "Individual",
    teamSize: "Not applicable",
    duration: "3 hours",
    venue: "312",
    eligibility: "Open to all",
    fee: "Free",
    prize: "No prizes — introductory session and workshop",
    registrationUrl: "",
    schedule: [
      {
        day: 2,
        time: "2:00 PM – 5:00 PM",
        title: "Quantum Club Introduction & Hands-on Qiskit Workshop",
        venue: "312",
      },
    ],
    highlights: [
      "First Quantum Club inauguration at IIIT Tiruchirappalli",
      "Introduction to the club and its future activities",
      "Beginner-friendly quantum computing introduction",
      "Hands-on Qiskit workshop",
      "Free entry for all",
    ],
    coordinators: [
      { name: "Shreyash Balasaheb Sabale", phone: "+91 98228 43992" },
      { name: "Bhuvan M Acharya", phone: "+91 96066 54776" },
      { name: "Ayush Soni" },
    ],
  },
  {
    id: "side-quest",
    title: "Side Quest",
    summary:
      "Take a break from the main quests — fun games, quizzes, PS4 and VR gaming, soapy football, and stalls all fest long.",
    description: `🎮 SIDE QUEST — ATRANG 2026

Every adventure needs a few side quests. Between rounds, drop in for games, challenges, and good food across all three days of Atrang.

🕹️ WHAT'S ON
• Fun games and quiz — Day 1
• PS4 and VR gaming — Day 2
• Soapy football — Day 2
• Stalls on the ground — all three days

Walk in, play, and level up your fest.`,
    category: "Fun Zone",
    participation: "Individual or Team",
    schedule: [
      { day: 1, time: "11:00 AM – 8:00 PM", title: "Fun games and quiz", venue: "Lab 216" },
      { day: 1, time: "All day", title: "Stalls", venue: "Ground" },
      { day: 2, time: "10:00 AM – 8:00 PM", title: "PS4 and VR gaming", venue: "Lab 216" },
      { day: 2, time: "10:00 AM – 8:00 PM", title: "Soapy football", venue: "Ground" },
      { day: 2, time: "All day", title: "Stalls", venue: "Ground" },
      { day: 3, time: "Until 5:00 PM", title: "Stalls", venue: "Ground" },
    ],
    highlights: ["Fun games and quiz", "PS4 and VR gaming", "Soapy football", "Stalls all three days"],
    coordinators: [{ name: "Raj Aryan" }, { name: "Aashish Yadav" }],
  },
];
