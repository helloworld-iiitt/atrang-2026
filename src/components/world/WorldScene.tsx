"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { TimeOfDay } from "@/lib/settings";
import { worldStatusStore } from "@/lib/ui-store";
import { clamp } from "@/lib/utils";
import { generateWorld } from "@/lib/world/generate";
import { BlockTrees } from "./BlockTrees";
import { CameraRig } from "./CameraRig";
import { CloudLayer } from "./CloudLayer";
import { Fireflies } from "./Fireflies";
import { FloatingBlocks } from "./FloatingBlocks";
import { BlockMaterialsProvider } from "./materials";
import { QUALITY, sceneState, type QualityLevel, type WorldView } from "./sceneState";
import { Sky } from "./Sky";
import { Terrain } from "./Terrain";

export type WorldSceneProps = {
  view: WorldView;
  quality: QualityLevel;
  timeOfDay: TimeOfDay;
  /** When false the scene renders on demand only (reduced motion or off-screen). */
  animate: boolean;
};

function ReadySignal() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
    const id = requestAnimationFrame(() => requestAnimationFrame(() => worldStatusStore.set("ready")));
    return () => cancelAnimationFrame(id);
  }, [invalidate]);
  return null;
}

/** Re-renders on-demand scenes whenever something visible changes. */
function Invalidator({ deps }: { deps: readonly unknown[] }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
    // Give damped values a few frames to settle when rendering on demand.
    const id = window.setTimeout(() => invalidate(), 50);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidate, ...deps]);
  return null;
}

function PointerTracker() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      sceneState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}

export default function WorldScene({ view, quality, timeOfDay, animate }: WorldSceneProps) {
  const config = QUALITY[quality];
  const world = useMemo(
    () => generateWorld({ width: config.width, depth: config.depth, trees: config.trees }),
    [config.width, config.depth, config.trees],
  );
  const [dprScale, setDprScale] = useState(1);
  const dpr = clamp(config.dpr[1] * dprScale, config.dpr[0], config.dpr[1]);

  return (
    <Canvas
      key={quality}
      flat
      shadows={config.shadows}
      dpr={dpr}
      frameloop={animate ? "always" : "demand"}
      camera={{ position: [0, 30, 30], fov: 50, near: 0.5, far: 900 }}
      gl={{ antialias: quality !== "low", powerPreference: "high-performance", alpha: false }}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        onDecline={() => setDprScale((s) => Math.max(0.55, s - 0.15))}
        onIncline={() => setDprScale((s) => Math.min(1, s + 0.1))}
      />
      <Suspense fallback={null}>
        <BlockMaterialsProvider>
          <Sky timeOfDay={timeOfDay} shadows={config.shadows} />
          <Terrain world={world} shadows={config.shadows} />
          <BlockTrees world={world} shadows={config.shadows} />
          <CloudLayer span={config.cloudSpan} />
          <FloatingBlocks count={config.floatingBlocks} />
          <Fireflies count={config.fireflies} />
          <ReadySignal />
        </BlockMaterialsProvider>
      </Suspense>
      <CameraRig view={view} />
      <Invalidator deps={[view, timeOfDay, animate]} />
      <PointerTracker />
    </Canvas>
  );
}
