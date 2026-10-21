import { useId } from "react";
import { FEST } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** 5×7 block glyphs for the wordmark. "#" is a block, "." is empty. */
const GLYPHS: Record<string, readonly string[]> = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  G: [".###.", "#...#", "#....", "#.###", "#...#", "#...#", ".###."],
};

const CELL = 16;
const GAP = 1;
const DEPTH = 5;
const DEPTH_STEP = 1.4;

type Cell = { x: number; y: number; cap: boolean; accent: boolean };

function layout(word: string) {
  const cells: Cell[] = [];
  let col = 0;
  for (const letter of word) {
    const glyph = GLYPHS[letter];
    if (!glyph) continue;
    glyph.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch !== "#") return;
        const above = y > 0 && glyph[y - 1][x] === "#";
        // A gold "ore vein" runs through the middle row of every letter.
        cells.push({ x: (col + x) * CELL, y: y * CELL, cap: !above, accent: above && y === 3 });
      });
    });
    col += glyph[0].length + GAP;
  }
  return { cells, width: (col - GAP) * CELL, height: 7 * CELL };
}

const WORDMARK = layout(FEST.name);
const SQUARES = WORDMARK.cells.map((c) => `M${c.x} ${c.y}h${CELL}v${CELL}h-${CELL}z`).join("");

type AtrangLogoProps = {
  size?: "hero" | "md" | "sm";
  className?: string;
  /** Hide from assistive tech when the surrounding element already names it. */
  decorative?: boolean;
};

const SIZE_CLASS = {
  hero: "w-[min(88vw,720px)]",
  md: "w-[min(70vw,420px)]",
  sm: "w-[104px] sm:w-[124px]",
} as const;

/**
 * Original block-letter ATRANG wordmark. Grass-capped stone blocks with a solid
 * extruded shadow, drawn as a single inline SVG so it stays crisp at any size.
 */
export function AtrangLogo({ size = "hero", className, decorative = false }: AtrangLogoProps) {
  const id = useId();
  const pad = DEPTH * DEPTH_STEP + 2;
  const viewBox = `-2 -2 ${WORDMARK.width + pad + 2} ${WORDMARK.height + pad + 2}`;
  const detailed = size !== "sm";

  return (
    <svg
      viewBox={viewBox}
      className={cn("block h-auto select-none", SIZE_CLASS[size], className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `${FEST.name} ${FEST.edition}`}
      shapeRendering="crispEdges"
    >
      <defs>
        {(["stone", "grass-side", "gold"] as const).map((tex) => (
          <pattern key={tex} id={`${id}-${tex}`} patternUnits="userSpaceOnUse" width={CELL} height={CELL}>
            <image
              href={`/textures/${tex}.png`}
              width={CELL}
              height={CELL}
              preserveAspectRatio="none"
              style={{ imageRendering: "pixelated" }}
            />
          </pattern>
        ))}
        <linearGradient id={`${id}-depth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2b2f" />
          <stop offset="1" stopColor="#0c0c0e" />
        </linearGradient>
      </defs>

      {/* Extrusion */}
      {Array.from({ length: DEPTH }, (_, i) => DEPTH - i).map((step) => (
        <path
          key={step}
          d={SQUARES}
          fill={step === DEPTH ? "#050506" : `url(#${id}-depth)`}
          transform={`translate(${step * DEPTH_STEP} ${step * DEPTH_STEP})`}
        />
      ))}

      {/* Faces */}
      {WORDMARK.cells.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x}
          y={c.y}
          width={CELL}
          height={CELL}
          fill={
            detailed
              ? `url(#${id}-${c.accent ? "gold" : c.cap ? "grass-side" : "stone"})`
              : c.cap
                ? "#5f9e3a"
                : "#8a8a8c"
          }
        />
      ))}

      {/* Bevel highlights and shadows give each block its edge */}
      {detailed && (
        <g>
          <path
            d={WORDMARK.cells
              .map((c) => `M${c.x} ${c.y}h${CELL}v1.5h-${CELL - 1.5}v${CELL - 1.5}h-1.5z`)
              .join("")}
            fill="#fff"
            fillOpacity={0.28}
          />
          <path
            d={WORDMARK.cells
              .map((c) => `M${c.x + CELL} ${c.y}v${CELL}h-${CELL}v-1.5h${CELL - 1.5}v-${CELL - 1.5}z`)
              .join("")}
            fill="#000"
            fillOpacity={0.35}
          />
        </g>
      )}
      <path d={SQUARES} fill="none" stroke="#000" strokeOpacity={0.55} strokeWidth={0.6} />
    </svg>
  );
}
