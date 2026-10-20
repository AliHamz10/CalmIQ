"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

/** Vivid blue / cyan glass — on-brand cool palette, not purple. */
const FABRIC = "#0d9dff";
const FABRIC_DARK = "#0678d4";
const TRIM = "#2cf0ff";
const PAD = "#9af8ff";
/** Soft cool silhouette — stylized, not fleshy; gray enough to contrast glass. */
const FIGURE = "#8b98a4";
const FIGURE_SOFT = "#a3b0ba";

type VestModelProps = {
  reduceMotion: boolean;
};

function GlassMaterial({
  color,
  opacity = 0.48,
  transmission = 0.55,
}: {
  color: string;
  opacity?: number;
  transmission?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.1}
      metalness={0.06}
      transmission={transmission}
      thickness={0.5}
      ior={1.4}
      transparent
      opacity={opacity}
      depthWrite={false}
      attenuationColor={color}
      attenuationDistance={0.65}
      emissive={color}
      emissiveIntensity={0.12}
      envMapIntensity={1.1}
      clearcoat={0.75}
      clearcoatRoughness={0.1}
    />
  );
}

function ActuatorPad({
  position,
  reduceMotion,
  phase = 0,
}: {
  position: [number, number, number];
  reduceMotion: boolean;
  phase?: number;
}) {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current || reduceMotion) return;
    const t = clock.getElapsedTime();
    const pulse = 0.28 + Math.sin(t * 1.35 + phase) * 0.14;
    const mat = mesh.current.material;
    if (mat && "emissiveIntensity" in mat) {
      (mat as { emissiveIntensity: number }).emissiveIntensity = pulse;
    }
  });

  return (
    <mesh ref={mesh} position={position} castShadow>
      {/* Compact actuator nodes */}
      <sphereGeometry args={[0.028, 12, 12]} />
      <meshStandardMaterial
        color={PAD}
        emissive={PAD}
        emissiveIntensity={reduceMotion ? 0.18 : 0.26}
        roughness={0.28}
        metalness={0.12}
        transparent
        opacity={0.82}
      />
    </mesh>
  );
}

/**
 * Soft stylized human figure — tasteful silhouette wearing the vest.
 * Mostly opaque cool gray-blue so it reads through glass (avoid transparent stacking).
 * No facial detail.
 */
function HumanSilhouette() {
  return (
    <group position={[0, -0.18, -0.2]} scale={1.05} renderOrder={0}>
      {/* Head — above collar, readable */}
      <mesh position={[0, 1.3, 0.08]} renderOrder={0}>
        <sphereGeometry args={[0.23, 22, 22]} />
        <meshStandardMaterial color={FIGURE} roughness={0.86} metalness={0} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.05, 0.06]} renderOrder={0}>
        <cylinderGeometry args={[0.075, 0.09, 0.18, 12]} />
        <meshStandardMaterial color={FIGURE_SOFT} roughness={0.88} metalness={0} />
      </mesh>
      {/* Torso core (shows through glass panels) */}
      <mesh position={[0, 0.32, -0.04]} renderOrder={0}>
        <capsuleGeometry args={[0.3, 0.82, 6, 14]} />
        <meshStandardMaterial color={FIGURE} roughness={0.9} metalness={0} />
      </mesh>
      {/* Upper arms hanging naturally (wearing pose) */}
      <mesh position={[-0.46, 0.42, 0.02]} rotation={[0.15, 0, 0.22]} renderOrder={0}>
        <capsuleGeometry args={[0.09, 0.42, 4, 10]} />
        <meshStandardMaterial color={FIGURE_SOFT} roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[0.46, 0.42, 0.02]} rotation={[0.15, 0, -0.22]} renderOrder={0}>
        <capsuleGeometry args={[0.09, 0.42, 4, 10]} />
        <meshStandardMaterial color={FIGURE_SOFT} roughness={0.88} metalness={0} />
      </mesh>
      {/* Hip / upper leg suggestion */}
      <mesh position={[-0.15, -0.52, 0]} renderOrder={0}>
        <capsuleGeometry args={[0.11, 0.3, 4, 10]} />
        <meshStandardMaterial color={FIGURE} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0.15, -0.52, 0]} renderOrder={0}>
        <capsuleGeometry args={[0.11, 0.3, 4, 10]} />
        <meshStandardMaterial color={FIGURE} roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

/**
 * Procedural comfort-vest silhouette for marketing surfaces.
 * Visual metaphor only — not a medical device schematic.
 */
export function VestModel({ reduceMotion }: VestModelProps) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    if (reduceMotion) {
      group.current.rotation.y = -0.28;
      group.current.position.y = 0;
      return;
    }
    const t = clock.getElapsedTime();
    group.current.rotation.y = -0.35 + Math.sin(t * 0.35) * 0.22;
    group.current.position.y = Math.sin(t * 0.7) * 0.04;
  });

  return (
    <group ref={group} position={[0, -0.15, 0]} scale={1.15}>
      <HumanSilhouette />

      {/* Back panel — glass */}
      <mesh position={[0, 0.15, -0.16]} castShadow receiveShadow renderOrder={1}>
        <boxGeometry args={[1.35, 1.55, 0.1]} />
        <GlassMaterial color={FABRIC_DARK} opacity={0.45} transmission={0.5} />
      </mesh>

      {/* Front left panel */}
      <mesh position={[-0.34, 0.12, 0.14]} rotation={[0, 0.08, 0]} castShadow receiveShadow renderOrder={2}>
        <boxGeometry args={[0.62, 1.5, 0.08]} />
        <GlassMaterial color={FABRIC} opacity={0.5} transmission={0.58} />
      </mesh>

      {/* Front right panel */}
      <mesh position={[0.34, 0.12, 0.14]} rotation={[0, -0.08, 0]} castShadow receiveShadow renderOrder={2}>
        <boxGeometry args={[0.62, 1.5, 0.08]} />
        <GlassMaterial color={FABRIC} opacity={0.5} transmission={0.58} />
      </mesh>

      {/* Center zipper channel */}
      <mesh position={[0, 0.05, 0.2]}>
        <boxGeometry args={[0.05, 1.35, 0.035]} />
        <meshPhysicalMaterial
          color={TRIM}
          roughness={0.22}
          metalness={0.35}
          transparent
          opacity={0.72}
          transmission={0.25}
        />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.95, 0.02]} castShadow>
        <torusGeometry args={[0.38, 0.08, 10, 28, Math.PI]} />
        <GlassMaterial color={FABRIC_DARK} opacity={0.48} transmission={0.5} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.72, 0.72, 0]} rotation={[0, 0, 0.35]} castShadow>
        <capsuleGeometry args={[0.17, 0.4, 6, 12]} />
        <GlassMaterial color={FABRIC} opacity={0.44} transmission={0.55} />
      </mesh>
      <mesh position={[0.72, 0.72, 0]} rotation={[0, 0, -0.35]} castShadow>
        <capsuleGeometry args={[0.17, 0.4, 6, 12]} />
        <GlassMaterial color={FABRIC} opacity={0.44} transmission={0.55} />
      </mesh>

      {/* Waist band */}
      <mesh position={[0, -0.62, 0.02]} castShadow>
        <boxGeometry args={[1.42, 0.14, 0.26]} />
        <meshPhysicalMaterial
          color={TRIM}
          roughness={0.28}
          metalness={0.2}
          transparent
          opacity={0.62}
          transmission={0.35}
          thickness={0.3}
        />
      </mesh>

      {/* Soft comfort pads (atmosphere, unlabeled) — smaller */}
      <ActuatorPad position={[-0.32, 0.35, 0.26]} reduceMotion={reduceMotion} phase={0} />
      <ActuatorPad position={[0.32, 0.35, 0.26]} reduceMotion={reduceMotion} phase={1.1} />
      <ActuatorPad position={[-0.28, -0.15, 0.26]} reduceMotion={reduceMotion} phase={2.2} />
      <ActuatorPad position={[0.28, -0.15, 0.26]} reduceMotion={reduceMotion} phase={3.0} />
    </group>
  );
}
