"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Matrix4, type Group, type InstancedMesh } from "three";
import { generateClouds } from "@/lib/world/generate";
import { useBlockMaterials } from "./materials";
import { sceneState } from "./sceneState";

const CELL = 6;
const CLOUD_Y = 38;
const geometry = new BoxGeometry(CELL, 2, CELL);
const matrix = new Matrix4();

/** Flat, blocky clouds drifting across the sky. Two tiles leapfrog for seamless wrap. */
export function CloudLayer({ span }: { span: number }) {
  const { cloud } = useBlockMaterials();
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const cells = useMemo(() => generateClouds(span, CELL), [span]);
  const tileCount = cells.length / 3;
  const count = tileCount * 2;

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let tile = 0; tile < 2; tile++) {
      for (let i = 0; i < tileCount; i++) {
        matrix.makeTranslation(cells[i * 3] + tile * span, CLOUD_Y, cells[i * 3 + 2]);
        mesh.setMatrixAt(tile * tileCount + i, matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [cells, span, tileCount]);

  useFrame((state, delta) => {
    cloud.color.copy(sceneState.atmosphere.cloud);
    const group = groupRef.current;
    if (!group || state.frameloop !== "always") return;
    group.position.x -= delta * 1.1;
    if (group.position.x < -span) group.position.x += span;
  });

  if (count === 0) return null;

  return (
    <group ref={groupRef}>
      <instancedMesh key={count} ref={meshRef} args={[geometry, cloud, count]} frustumCulled={false} />
    </group>
  );
}
