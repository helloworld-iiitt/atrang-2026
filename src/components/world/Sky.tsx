"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Fog,
  ShaderMaterial,
  type DirectionalLight,
  type Group,
  type HemisphereLight,
  type Mesh,
  type MeshBasicMaterial,
  type PointsMaterial,
} from "three";
import type { TimeOfDay } from "@/lib/settings";
import { mulberry32 } from "@/lib/utils";
import { CYCLE_SECONDS, sampleAtmosphere, TIME_POSITION } from "@/lib/world/atmosphere";
import { sceneState } from "./sceneState";

const SKY_RADIUS = 400;
const CELESTIAL_DISTANCE = 320;

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uGlow;
  varying vec3 vDir;
  void main() {
    float h = vDir.y;
    vec3 col = mix(uHorizon, uTop, pow(clamp(h, 0.0, 1.0), 0.55));
    col = mix(col, uHorizon * 0.85, smoothstep(0.0, -0.25, h));
    float sun = max(dot(normalize(vDir), uSunDir), 0.0);
    col += uSunColor * pow(sun, 12.0) * 0.45 * uGlow;
    // Quantise slightly for a banded, retro sky.
    col = floor(col * 48.0 + 0.5) / 48.0;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function createStarGeometry(count: number) {
  const rand = mulberry32(404);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const y = 0.05 + rand() * 0.95;
    const r = Math.sqrt(1 - y * y);
    positions[i * 3] = Math.cos(theta) * r * 300;
    positions[i * 3 + 1] = y * 300;
    positions[i * 3 + 2] = Math.sin(theta) * r * 300;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

/** Shortest signed distance on a 0..1 loop. */
function loopDelta(from: number, to: number) {
  let d = (to - from) % 1;
  if (d > 0.5) d -= 1;
  if (d < -0.5) d += 1;
  return d;
}

export function Sky({ timeOfDay, shadows }: { timeOfDay: TimeOfDay; shadows: boolean }) {
  const get = useThree((s) => s.get);
  const skyRef = useRef<Mesh>(null);
  const celestialRef = useRef<Group>(null);
  const sunRef = useRef<Mesh>(null);
  const moonRef = useRef<Mesh>(null);
  const starsRef = useRef<PointsMaterial>(null);
  const hemiRef = useRef<HemisphereLight>(null);
  const dirRef = useRef<DirectionalLight>(null);
  const cyclePos = useRef(timeOfDay === "cycle" ? 0 : TIME_POSITION[timeOfDay]);

  const skyMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: sceneState.atmosphere.skyTop.clone() },
          uHorizon: { value: sceneState.atmosphere.horizon.clone() },
          uSunDir: { value: sceneState.atmosphere.lightDir.clone() },
          uSunColor: { value: sceneState.atmosphere.sunColor.clone() },
          uGlow: { value: 1 },
        },
      }),
    [],
  );
  const starGeometry = useMemo(() => createStarGeometry(700), []);

  useEffect(() => {
    const { scene } = get();
    scene.fog = new Fog(sceneState.atmosphere.fog.clone(), 28, 120);
    const light = dirRef.current;
    if (light) {
      light.target.position.set(0, 0, -30);
      scene.add(light.target);
    }
    return () => {
      scene.fog = null;
      if (light) scene.remove(light.target);
    };
  }, [get]);

  useEffect(
    () => () => {
      skyMaterial.dispose();
      starGeometry.dispose();
    },
    [skyMaterial, starGeometry],
  );

  useFrame((state, delta) => {
    const animate = state.frameloop === "always";
    const target = timeOfDay === "cycle" ? null : TIME_POSITION[timeOfDay];
    if (target === null) {
      if (animate) cyclePos.current = (cyclePos.current + delta / CYCLE_SECONDS) % 1;
    } else {
      const d = loopDelta(cyclePos.current, target);
      cyclePos.current =
        animate && Math.abs(d) > 0.0005 ? cyclePos.current + d * Math.min(1, delta * 1.6) : target;
      cyclePos.current = ((cyclePos.current % 1) + 1) % 1;
    }

    const atm = sampleAtmosphere(cyclePos.current, sceneState.atmosphere);
    const cam = state.camera;

    const sky = skyRef.current;
    const u = (sky?.material as ShaderMaterial | undefined)?.uniforms;
    if (u) {
      u.uTop.value.copy(atm.skyTop);
      u.uHorizon.value.copy(atm.horizon);
      u.uSunDir.value.copy(atm.lightDir);
      u.uSunColor.value.copy(atm.sunColor);
      u.uGlow.value = atm.sun;
    }
    sky?.position.copy(cam.position);

    const fog = state.scene.fog;
    if (fog instanceof Fog) {
      fog.color.copy(atm.fog);
      fog.far = state.size.width < 768 ? 95 : 130;
    }

    if (hemiRef.current) {
      hemiRef.current.color.copy(atm.hemiSky);
      hemiRef.current.groundColor.copy(atm.hemiGround);
      hemiRef.current.intensity = atm.hemiIntensity;
    }
    if (dirRef.current) {
      dirRef.current.color.copy(atm.sunColor);
      dirRef.current.intensity = atm.sunIntensity;
      dirRef.current.position.copy(atm.lightDir).multiplyScalar(90).add(dirRef.current.target.position);
    }

    if (celestialRef.current) celestialRef.current.position.copy(cam.position);
    if (sunRef.current) {
      sunRef.current.position.copy(atm.lightDir).multiplyScalar(CELESTIAL_DISTANCE);
      sunRef.current.lookAt(cam.position);
      (sunRef.current.material as MeshBasicMaterial).opacity = atm.sun;
      sunRef.current.visible = atm.sun > 0.01;
    }
    if (moonRef.current) {
      moonRef.current.position.copy(atm.lightDir).multiplyScalar(CELESTIAL_DISTANCE);
      moonRef.current.lookAt(cam.position);
      (moonRef.current.material as MeshBasicMaterial).opacity = atm.moon;
      moonRef.current.visible = atm.moon > 0.01;
    }
    if (starsRef.current) starsRef.current.opacity = atm.stars;
  });

  return (
    <>
      <mesh ref={skyRef} material={skyMaterial} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[SKY_RADIUS, 32, 16]} />
      </mesh>

      <group ref={celestialRef}>
        <mesh ref={sunRef} renderOrder={-9}>
          <planeGeometry args={[34, 34]} />
          <meshBasicMaterial color="#fff6c4" transparent fog={false} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh ref={moonRef} renderOrder={-9}>
          <planeGeometry args={[22, 22]} />
          <meshBasicMaterial color="#e9eeff" transparent fog={false} depthWrite={false} toneMapped={false} />
        </mesh>
        <points geometry={starGeometry} renderOrder={-9} frustumCulled={false}>
          <pointsMaterial
            ref={starsRef}
            color="#ffffff"
            size={2}
            sizeAttenuation={false}
            transparent
            opacity={0}
            fog={false}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      </group>

      <hemisphereLight ref={hemiRef} />
      <directionalLight
        ref={dirRef}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-bias={-0.0006}
        shadow-normalBias={0.04}
      />
    </>
  );
}
