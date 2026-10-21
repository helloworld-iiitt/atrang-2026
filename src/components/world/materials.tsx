"use client";

import { useTexture } from "@react-three/drei";
import { createContext, use, useEffect, useMemo, type ReactNode } from "react";
import {
  BoxGeometry,
  MeshLambertMaterial,
  NearestFilter,
  NearestMipmapLinearFilter,
  SRGBColorSpace,
  type Material,
  type Texture,
} from "three";

const TEXTURE_URLS = {
  grassTop: "/textures/grass-top.png",
  grassSide: "/textures/grass-side.png",
  dirt: "/textures/dirt.png",
  stone: "/textures/stone.png",
  sand: "/textures/sand.png",
  snow: "/textures/snow.png",
  water: "/textures/water.png",
  logSide: "/textures/log-side.png",
  logTop: "/textures/log-top.png",
  leaves: "/textures/leaves.png",
  planks: "/textures/planks.png",
  gold: "/textures/gold.png",
  ore: "/textures/ore.png",
} as const;

type TextureKey = keyof typeof TEXTURE_URLS;

export type BlockMaterials = {
  grass: Material[];
  dirt: Material;
  stone: Material;
  sand: Material;
  snow: Material;
  water: Material;
  log: Material[];
  leaves: Material;
  planks: Material;
  gold: Material;
  ore: Material;
  cloud: MeshLambertMaterial;
};

/** One shared unit cube for every block in the scene. */
export const BLOCK_GEOMETRY = new BoxGeometry(1, 1, 1);

const MaterialsContext = createContext<BlockMaterials | null>(null);

function pixelate(texture: Texture) {
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestMipmapLinearFilter;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
}

export function BlockMaterialsProvider({ children }: { children: ReactNode }) {
  const textures = useTexture(TEXTURE_URLS) as Record<TextureKey, Texture>;

  const materials = useMemo<BlockMaterials>(() => {
    Object.values(textures).forEach(pixelate);
    const lambert = (map: Texture, extra: ConstructorParameters<typeof MeshLambertMaterial>[0] = {}) =>
      new MeshLambertMaterial({ map, ...extra });
    const grassSide = lambert(textures.grassSide);
    const logSide = lambert(textures.logSide);
    const logTop = lambert(textures.logTop);
    return {
      grass: [grassSide, grassSide, lambert(textures.grassTop), lambert(textures.dirt), grassSide, grassSide],
      dirt: lambert(textures.dirt),
      stone: lambert(textures.stone),
      sand: lambert(textures.sand),
      snow: lambert(textures.snow),
      water: lambert(textures.water, { transparent: true, opacity: 0.78, depthWrite: false }),
      log: [logSide, logSide, logTop, logTop, logSide, logSide],
      leaves: lambert(textures.leaves),
      planks: lambert(textures.planks),
      gold: lambert(textures.gold, { emissive: "#5a3d00", emissiveIntensity: 0.35 }),
      ore: lambert(textures.ore, { emissive: "#0b3833", emissiveIntensity: 0.4 }),
      cloud: new MeshLambertMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.88,
        depthWrite: false,
      }),
    };
  }, [textures]);

  useEffect(
    () => () => {
      const unique = new Set<Material>();
      Object.values(materials).forEach((m) => (Array.isArray(m) ? m : [m]).forEach((x) => unique.add(x)));
      unique.forEach((m) => m.dispose());
    },
    [materials],
  );

  return <MaterialsContext value={materials}>{children}</MaterialsContext>;
}

export function useBlockMaterials(): BlockMaterials {
  const materials = use(MaterialsContext);
  if (!materials) throw new Error("useBlockMaterials must be used inside <BlockMaterialsProvider>");
  return materials;
}
