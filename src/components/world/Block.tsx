"use client";

import { useLayoutEffect, useRef } from "react";
import { Color, Matrix4, type InstancedMesh, type Material } from "three";
import type { InstanceSet } from "@/lib/world/generate";
import { BLOCK_GEOMETRY } from "./materials";

type BlockInstancesProps = {
  set: InstanceSet;
  material: Material | Material[];
  castShadow?: boolean;
  receiveShadow?: boolean;
};

const matrix = new Matrix4();
const color = new Color();

/** Renders every block of one type as a single instanced draw call. */
export function BlockInstances({ set, material, castShadow, receiveShadow }: BlockInstancesProps) {
  const ref = useRef<InstancedMesh>(null);
  const count = set.shades.length;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const { positions, shades } = set;
    for (let i = 0; i < count; i++) {
      matrix.makeTranslation(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, color.setScalar(shades[i]));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [set, count]);

  if (count === 0) return null;

  return (
    <instancedMesh
      key={count}
      ref={ref}
      args={[BLOCK_GEOMETRY, material, count]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  );
}
