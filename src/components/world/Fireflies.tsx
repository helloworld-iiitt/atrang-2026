"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, type PointsMaterial } from "three";
import { mulberry32 } from "@/lib/utils";
import { sceneState } from "./sceneState";

const POLLEN = new Color("#fff7d6");
const FIREFLY = new Color("#d4ff6a");

/** Drifting pollen by day that turns into glowing fireflies at dusk and night. */
export function Fireflies({ count }: { count: number }) {
  const materialRef = useRef<PointsMaterial>(null);
  const { geometry, base, phases } = useMemo(() => {
    const rand = mulberry32(77);
    const base = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      base[i * 3] = (rand() - 0.5) * 60;
      base[i * 3 + 1] = 6 + rand() * 12;
      base[i * 3 + 2] = 4 - rand() * 50;
      phases[i] = rand() * Math.PI * 2;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(base.slice(), 3));
    return { geometry, base, phases };
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    const material = materialRef.current;
    const { fireflies } = sceneState.atmosphere;
    if (material) {
      material.color.copy(POLLEN).lerp(FIREFLY, fireflies);
      material.opacity = 0.35 + fireflies * 0.6;
      material.size = 0.18 + fireflies * 0.14;
    }
    if (state.frameloop !== "always") return;
    const t = state.clock.elapsedTime;
    const attr = geometry.getAttribute("position") as BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const p = phases[i];
      arr[i * 3] = base[i * 3] + Math.sin(t * 0.3 + p) * 2.5;
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.5 + p * 2) * 1.2;
      arr[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 0.25 + p) * 2.5;
    }
    attr.needsUpdate = true;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={materialRef}
        size={0.2}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        color={POLLEN}
      />
    </points>
  );
}
