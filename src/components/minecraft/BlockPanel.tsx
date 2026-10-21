import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BlockPanelProps = {
  as?: ElementType;
  variant?: "dirt" | "slate" | "glass";
  className?: string;
  children: ReactNode;
} & Record<string, unknown>;

const VARIANT: Record<NonNullable<BlockPanelProps["variant"]>, string> = {
  dirt: "",
  slate: "mc-panel--slate",
  glass: "mc-panel--glass",
};

/** Textured, bevelled surface used for menus, cards, and dialogs. */
export function BlockPanel({
  as: Tag = "div",
  variant = "dirt",
  className,
  children,
  ...rest
}: BlockPanelProps) {
  return (
    <Tag className={cn("mc-panel", VARIANT[variant], className)} {...rest}>
      {children}
    </Tag>
  );
}
