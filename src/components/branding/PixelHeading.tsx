import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PixelHeadingProps = {
  as?: "h1" | "h2" | "h3";
  eyebrow?: ReactNode;
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
  id?: string;
};

const SIZE = {
  h1: "text-[clamp(1.9rem,6vw,4.25rem)] leading-[1.05]",
  h2: "text-[clamp(1.5rem,4vw,2.6rem)] leading-tight",
  h3: "text-xl leading-snug",
} as const;

export function PixelHeading({
  as: Tag = "h2",
  eyebrow,
  children,
  className,
  align = "left",
  id,
}: PixelHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <p className="font-pixel mb-3 text-xs tracking-[0.3em] text-gold uppercase text-shadow-pixel sm:text-sm">
          {eyebrow}
        </p>
      ) : null}
      <Tag id={id} className={cn("font-pixel font-bold text-bone uppercase text-shadow-pixel-lg", SIZE[Tag])}>
        {children}
      </Tag>
    </div>
  );
}
