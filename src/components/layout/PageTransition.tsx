import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CSS-driven page entrance. Hidden routes are kept mounted with `display: none`,
 * and CSS animations replay whenever an element becomes visible again, so this
 * also runs when returning to a previously visited page.
 */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("page-enter flex flex-1 flex-col", className)}>{children}</div>;
}
