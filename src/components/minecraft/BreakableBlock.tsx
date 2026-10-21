import type { CSSProperties, ReactNode } from "react";
import type { BreakPhase } from "@/hooks/useBlockBreak";
import { cn } from "@/lib/utils";

export function CrackOverlay({
  phase,
  stage,
  size = 48,
}: {
  phase: BreakPhase;
  stage: number;
  size?: number;
}) {
  if (phase !== "cracking" && phase !== "broken") return null;
  return (
    <span
      aria-hidden
      className="crack-overlay"
      data-stage={phase === "broken" ? 5 : stage}
      style={{ "--crack-size": `${size}px` } as CSSProperties}
    />
  );
}

type BreakableBlockProps = {
  phase: BreakPhase;
  stage: number;
  crackSize?: number;
  className?: string;
  children: ReactNode;
};

/** Presentational wrapper that shows cracks and the break/shrink state driven by `useBlockBreak`. */
export function BreakableBlock({ phase, stage, crackSize = 64, className, children }: BreakableBlockProps) {
  return (
    <div className={cn("breakable", className)} data-break={phase === "idle" ? undefined : phase}>
      {children}
      <CrackOverlay phase={phase} stage={stage} size={crackSize} />
    </div>
  );
}
