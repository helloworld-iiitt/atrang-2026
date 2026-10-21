"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Component, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useQualityLevel } from "@/hooks/useQualityLevel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSettings } from "@/lib/settings";
import { useWorldStatus, worldStatusStore } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { SceneFallback } from "./SceneFallback";
import type { WorldView } from "./sceneState";

const WorldScene = dynamic(() => import("./WorldScene"), { ssr: false });

let webglSupport: boolean | undefined;
function detectWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      webglSupport = Boolean(gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    worldStatusStore.set("fallback");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function viewFor(pathname: string): WorldView {
  if (pathname === "/") return "menu";
  if (pathname.startsWith("/events")) return "events";
  return "lost";
}

/** True once the user has scrolled the world well out of view on long pages. */
function useScrolledAway(enabled: boolean) {
  const [away, setAway] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => setAway(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);
  return enabled && away;
}

const OVERLAYS: Record<WorldView, string> = {
  menu: "bg-[radial-gradient(ellipse_at_50%_55%,transparent_25%,rgb(4_7_15/0.55)_100%)]",
  events: "bg-[linear-gradient(to_bottom,rgb(4_7_15/0.25),rgb(4_7_15/0.55)_55%,rgb(4_7_15/0.82))]",
  lost: "bg-[radial-gradient(ellipse_at_center,rgb(120_0_0/0.35),rgb(60_0_0/0.75))]",
};

/** Persistent world behind every page. Lives in the root layout so it never remounts on navigation. */
export function WorldBackground() {
  const pathname = usePathname();
  const view = viewFor(pathname);
  const settings = useSettings();
  const reduced = useReducedMotion();
  const quality = useQualityLevel(settings.quality);
  const status = useWorldStatus();
  const webgl = useSyncExternalStore(noopSubscribe, detectWebGL, () => null);
  const scrolledAway = useScrolledAway(view === "events");

  useEffect(() => {
    if (webgl === false) worldStatusStore.set("fallback");
  }, [webgl]);

  const showCanvas = webgl === true && status !== "fallback";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <SceneFallback timeOfDay={settings.timeOfDay} />
      {showCanvas ? (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            status === "ready" ? "opacity-100" : "opacity-0",
          )}
        >
          <SceneErrorBoundary>
            <WorldScene
              view={view}
              quality={quality}
              timeOfDay={settings.timeOfDay}
              animate={!reduced && !scrolledAway}
            />
          </SceneErrorBoundary>
        </div>
      ) : null}
      {(Object.keys(OVERLAYS) as WorldView[]).map((key) => (
        <div
          key={key}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            OVERLAYS[key],
            key === view ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
