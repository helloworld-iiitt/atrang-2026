import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IsoCubeProps = {
  color: string;
  icon?: LucideIcon;
  size?: number;
  className?: string;
};

/** Lightweight CSS 3D block used as the illustration for each event category. */
export function IsoCube({ color, icon: Icon, size = 64, className }: IsoCubeProps) {
  const face = Icon ? (
    <Icon
      aria-hidden
      className="text-black/60"
      style={{ width: size * 0.42, height: size * 0.42 }}
      strokeWidth={2.75}
    />
  ) : null;
  return (
    <div
      aria-hidden
      className={cn("iso-scene", className)}
      style={{ "--cube": `${size}px`, "--face": color } as CSSProperties}
    >
      <div className="iso-cube">
        <div className="iso-face iso-face--front">{face}</div>
        <div className="iso-face iso-face--back">{face}</div>
        <div className="iso-face iso-face--left">{face}</div>
        <div className="iso-face iso-face--right">{face}</div>
        <div className="iso-face iso-face--top" />
      </div>
    </div>
  );
}
