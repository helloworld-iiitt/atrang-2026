"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { onBurst, type BurstRequest } from "@/lib/particles";

type Particle = {
  id: number;
  x: number;
  y: number;
  dx: number;
  rise: number;
  fall: number;
  size: number;
  rotate: number;
  color: string;
  duration: number;
};

let nextId = 0;

function spawn({ x, y, width, height, palette, count = 16 }: BurstRequest): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const px = x + Math.random() * width;
    const py = y + Math.random() * height;
    const fromCenter = (px - (x + width / 2)) / Math.max(width / 2, 1);
    particles.push({
      id: nextId++,
      x: px,
      y: py,
      dx: fromCenter * (40 + Math.random() * 60) + (Math.random() - 0.5) * 50,
      rise: 30 + Math.random() * 60,
      fall: 90 + Math.random() * 140,
      size: 5 + Math.floor(Math.random() * 3) * 2,
      rotate: (Math.random() - 0.5) * 360,
      color: palette[Math.floor(Math.random() * palette.length)],
      duration: 0.55 + Math.random() * 0.35,
    });
  }
  return particles;
}

/** Global fixed layer that renders cubic debris for every block-break burst. */
export function BlockParticleBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(
    () =>
      onBurst((burst) => {
        const fresh = spawn(burst);
        setParticles((prev) => [...prev.slice(-80), ...fresh]);
      }),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: "inset -2px -2px 0 rgb(0 0 0 / 0.3)",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: p.dx,
            y: [0, -p.rise, p.fall],
            rotate: p.rotate,
            opacity: [1, 1, 0],
            scale: [1, 1, 0.6],
          }}
          transition={{
            x: { duration: p.duration, ease: "linear" },
            y: { duration: p.duration, times: [0, 0.3, 1], ease: ["easeOut", "easeIn"] },
            rotate: { duration: p.duration, ease: "linear" },
            opacity: { duration: p.duration, times: [0, 0.7, 1] },
            scale: { duration: p.duration, times: [0, 0.7, 1] },
          }}
          onAnimationComplete={() => setParticles((prev) => prev.filter((item) => item.id !== p.id))}
        />
      ))}
    </div>
  );
}
