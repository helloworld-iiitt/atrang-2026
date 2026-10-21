"use client";

import type { World } from "@/lib/world/generate";
import { BlockInstances } from "./Block";
import { useBlockMaterials } from "./materials";

/** All trunks and leaf clusters, rendered as two instanced meshes. */
export function BlockTrees({ world, shadows }: { world: World; shadows: boolean }) {
  const materials = useBlockMaterials();
  return (
    <group>
      <BlockInstances set={world.log} material={materials.log} castShadow={shadows} receiveShadow={shadows} />
      <BlockInstances
        set={world.leaves}
        material={materials.leaves}
        castShadow={shadows}
        receiveShadow={shadows}
      />
    </group>
  );
}
