"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MathUtils, type Group, type Material } from "three";
import { BLOCK_GEOMETRY, useBlockMaterials, type BlockMaterials } from "./materials";
import { sceneState } from "./sceneState";

type FloatingSpec = {
  material: keyof BlockMaterials;
  /** Position as a fraction of the visible half-width / half-height at `depth`. */
  fx: number;
  fy: number;
  depth: number;
  scale: number;
  spin: number;
  phase: number;
};

const SPECS: FloatingSpec[] = [
  { material: "grass", fx: -0.78, fy: 0.42, depth: 13, scale: 1.7, spin: 0.35, phase: 0 },
  { material: "gold", fx: 0.74, fy: 0.5, depth: 15, scale: 1.3, spin: -0.45, phase: 1.3 },
  { material: "ore", fx: 0.8, fy: -0.42, depth: 11, scale: 1.2, spin: 0.5, phase: 2.1 },
  { material: "log", fx: -0.72, fy: -0.5, depth: 12, scale: 1.35, spin: -0.3, phase: 3.4 },
  { material: "planks", fx: -0.42, fy: 0.82, depth: 19, scale: 0.9, spin: 0.6, phase: 4.2 },
  { material: "stone", fx: 0.46, fy: -0.8, depth: 18, scale: 0.9, spin: -0.55, phase: 5.1 },
];

/**
 * A handful of slowly spinning blocks that frame the menu. They follow the camera,
 * so they keep framing the interface whichever part of the world is in view.
 */
export function FloatingBlocks({ count }: { count: number }) {
  const materials = useBlockMaterials();
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const groupRef = useRef<Group>(null);
  const blockRefs = useRef<Array<Group | null>>([]);
  const specs = useMemo(() => SPECS.slice(0, count), [count]);

  const portrait = size.width < size.height;
  const fov = "fov" in camera ? (camera.fov as number) : 50;
  const aspect = size.width / Math.max(size.height, 1);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    group.position.copy(camera.position);
    group.quaternion.copy(camera.quaternion);
    const t = state.clock.elapsedTime;
    const animate = state.frameloop === "always";
    const { pointer } = sceneState;
    specs.forEach((spec, i) => {
      const block = blockRefs.current[i];
      if (!block) return;
      const halfH = Math.tan(MathUtils.degToRad(fov / 2)) * spec.depth;
      const halfW = halfH * aspect;
      // Portrait screens push blocks into the top and bottom bands, away from the menu.
      const fx = portrait ? spec.fx * 0.85 : spec.fx;
      const fy = portrait ? Math.sign(spec.fy) * Math.max(Math.abs(spec.fy), 0.78) : spec.fy;
      const bob = animate ? Math.sin(t * 0.8 + spec.phase) * 0.35 : 0;
      block.position.set(
        fx * halfW - pointer.x * 0.4 * (spec.depth / 12),
        fy * halfH + bob - pointer.y * 0.25,
        -spec.depth,
      );
      if (animate) {
        block.rotation.y = t * spec.spin + spec.phase;
        block.rotation.x = Math.sin(t * 0.4 + spec.phase) * 0.35 + 0.35;
      } else {
        block.rotation.set(0.45, 0.75 + spec.phase, 0);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {specs.map((spec, i) => (
        <group
          key={spec.material}
          ref={(node) => {
            blockRefs.current[i] = node;
          }}
          scale={portrait ? spec.scale * 0.75 : spec.scale}
        >
          <mesh geometry={BLOCK_GEOMETRY} material={materials[spec.material] as Material | Material[]} />
        </group>
      ))}
    </group>
  );
}
