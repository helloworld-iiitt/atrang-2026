"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { MathUtils, Vector3, type PerspectiveCamera } from "three";
import { sceneState, type WorldView } from "./sceneState";

type Shot = { position: [number, number, number]; target: [number, number, number] };

const SHOTS: Record<WorldView, Shot> = {
  menu: { position: [0, 15, 14], target: [0, 10.5, -24] },
  events: { position: [24, 31, 14], target: [-3, 7, -26] },
  lost: { position: [0, 6.5, 4], target: [0, 26, -40] },
};

const desiredPos = new Vector3();
const desiredTarget = new Vector3();
const offset = new Vector3();
const UP = new Vector3(0, 1, 0);

/** Composes the camera for each route and glides between shots. */
export function CameraRig({ view }: { view: WorldView }) {
  const size = useThree((s) => s.size);
  const get = useThree((s) => s.get);
  const lookAt = useRef(new Vector3(...SHOTS[view].target));
  const initialised = useRef(false);

  const portrait = size.width < size.height;
  const fov = portrait ? 66 : size.width < 1024 ? 56 : 50;

  const shot = useMemo(() => {
    const s = SHOTS[view];
    const pos = new Vector3(...s.position);
    const target = new Vector3(...s.target);
    if (portrait) {
      // Pull back so the narrow frame still reads as a landscape.
      offset.copy(pos).sub(target).normalize().multiplyScalar(10);
      pos.add(offset);
    }
    return { pos, target };
  }, [view, portrait]);

  useLayoutEffect(() => {
    const { camera, invalidate } = get() as { camera: PerspectiveCamera; invalidate: () => void };
    camera.fov = fov;
    camera.updateProjectionMatrix();
    if (!initialised.current) {
      // Start high above the valley and descend into the first shot.
      camera.position.copy(shot.pos).add(new Vector3(0, 18, 12));
      lookAt.current.copy(shot.target);
      camera.lookAt(lookAt.current);
      initialised.current = true;
    }
    invalidate();
  }, [get, fov, shot]);

  useFrame((state, delta) => {
    const camera = state.camera;
    const animate = state.frameloop === "always";
    const t = state.clock.elapsedTime;
    const { pointer } = sceneState;

    desiredPos.copy(shot.pos);
    desiredTarget.copy(shot.target);

    if (animate) {
      if (view === "events") {
        // Slow arc around the valley, like a world-map flyover.
        const yaw = Math.sin(t * 0.045) * 0.32;
        offset.copy(shot.pos).sub(shot.target).applyAxisAngle(UP, yaw);
        desiredPos.copy(shot.target).add(offset);
      } else {
        desiredPos.x += Math.sin(t * 0.09) * 1.6;
        desiredPos.y += Math.sin(t * 0.13) * 0.5;
      }
      desiredTarget.x += pointer.x * 2.2;
      desiredTarget.y += pointer.y * 1.1;
      desiredPos.x += pointer.x * 0.7;

      const lambda = 1.15;
      camera.position.x = MathUtils.damp(camera.position.x, desiredPos.x, lambda, delta);
      camera.position.y = MathUtils.damp(camera.position.y, desiredPos.y, lambda, delta);
      camera.position.z = MathUtils.damp(camera.position.z, desiredPos.z, lambda, delta);
      lookAt.current.x = MathUtils.damp(lookAt.current.x, desiredTarget.x, lambda * 1.3, delta);
      lookAt.current.y = MathUtils.damp(lookAt.current.y, desiredTarget.y, lambda * 1.3, delta);
      lookAt.current.z = MathUtils.damp(lookAt.current.z, desiredTarget.z, lambda * 1.3, delta);
    } else {
      camera.position.copy(desiredPos);
      lookAt.current.copy(desiredTarget);
    }
    camera.lookAt(lookAt.current);
  });

  return null;
}
