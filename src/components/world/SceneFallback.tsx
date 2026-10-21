import type { TimeOfDay } from "@/lib/settings";
import { cn } from "@/lib/utils";

const W = 192;
const H = 108;
const COL = 4;

type Layer = { base: number; amp: number; f1: number; f2: number; p: number; step: number };

function heights({ base, amp, f1, f2, p, step }: Layer): number[] {
  const out: number[] = [];
  for (let i = 0; i <= W / COL; i++) {
    const v = base + amp * (Math.sin(i * f1 + p) * 0.6 + Math.sin(i * f2 + p * 2.3) * 0.4);
    out.push(Math.round(v / step) * step);
  }
  return out;
}

function steppedPath(hs: number[], shift = 0): string {
  let d = `M0 ${H}`;
  hs.forEach((h, i) => {
    d += `V${H - h + shift}H${(i + 1) * COL}`;
  });
  return `${d}V${H}Z`;
}

const FAR = heights({ base: 52, amp: 20, f1: 0.21, f2: 0.47, p: 1.2, step: 4 });
const MID = heights({ base: 36, amp: 10, f1: 0.17, f2: 0.39, p: 4.1, step: 4 });
const NEAR = heights({ base: 20, amp: 8, f1: 0.13, f2: 0.31, p: 2.7, step: 4 });
const TREES = [6, 11, 31, 38, 41].map((i) => ({ x: i * COL, h: MID[i] }));

const SKY: Record<Exclude<TimeOfDay, "cycle">, { top: string; horizon: string; sun: string; far: string }> = {
  day: { top: "#3f7fe0", horizon: "#a6d0ff", sun: "#fff6c4", far: "#7f9fc8" },
  sunset: { top: "#2a3b7c", horizon: "#ff9a5a", sun: "#ffd27a", far: "#8a6a8a" },
  night: { top: "#040918", horizon: "#1a2a58", sun: "#e9eeff", far: "#24345e" },
};

/**
 * Static, CSS/SVG rendition of the world. Shown while the 3D scene loads, and as the
 * permanent background when WebGL is unavailable.
 */
export function SceneFallback({ timeOfDay, className }: { timeOfDay: TimeOfDay; className?: string }) {
  const sky = SKY[timeOfDay === "cycle" ? "day" : timeOfDay];
  const night = timeOfDay === "night";
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ background: `linear-gradient(to bottom, ${sky.top} 0%, ${sky.horizon} 62%)` }}
    >
      <div
        className="absolute top-[14%] right-[16%] size-[clamp(48px,7vw,96px)]"
        style={{ background: sky.sun, boxShadow: `0 0 80px 20px ${sky.sun}55` }}
      />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="#fff" opacity={night ? 0.25 : 0.85}>
          <rect x="20" y="12" width="28" height="3" />
          <rect x="26" y="9" width="14" height="3" />
          <rect x="120" y="18" width="34" height="3" />
          <rect x="128" y="15" width="16" height="3" />
        </g>
        <path d={steppedPath(FAR)} fill={sky.far} />
        <path d={steppedPath(FAR, 4)} fill={sky.far} opacity={0.75} style={{ filter: "brightness(0.85)" }} />
        <path d={steppedPath(MID)} fill={night ? "#244a1d" : "#4f8d34"} />
        <path d={steppedPath(MID, 3)} fill={night ? "#2d2219" : "#6e4f34"} />
        {TREES.map((t) => (
          <g key={t.x}>
            <rect x={t.x + 1} y={H - t.h - 8} width="2" height="8" fill="#5b4227" />
            <rect x={t.x - 2} y={H - t.h - 14} width="8" height="7" fill={night ? "#1d3d16" : "#356e23"} />
            <rect x={t.x} y={H - t.h - 16} width="4" height="2" fill={night ? "#1d3d16" : "#3f7f2a"} />
          </g>
        ))}
        <path d={steppedPath(NEAR)} fill={night ? "#2c5a22" : "#5f9e3a"} />
        <path d={steppedPath(NEAR, 3)} fill={night ? "#33261b" : "#86603f"} />
        <path d={steppedPath(NEAR, 14)} fill={night ? "#26262a" : "#6f6f72"} />
      </svg>
    </div>
  );
}
