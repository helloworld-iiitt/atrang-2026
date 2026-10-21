"use client";

import type { World } from "@/lib/world/generate";
import { BlockInstances } from "./Block";
import { useBlockMaterials } from "./materials";

const SOLID = ["grass", "dirt", "stone", "sand", "snow"] as const;

export function Terrain({ world, shadows }: { world: World; shadows: boolean }) {
  const materials = useBlockMaterials();
  return (
    <group>
      {SOLID.map((type) => (
        <BlockInstances
          key={type}
          set={world[type]}
          material={materials[type]}
          castShadow={shadows}
          receiveShadow={shadows}
        />
      ))}
      <BlockInstances set={world.water} material={materials.water} receiveShadow={shadows} />
    </group>
  );
}
