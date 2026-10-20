"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

const FABRIC = "#0d5c56";
const FABRIC_DARK = "#084540";
const TRIM = "#1a7a84";
const PAD = "#5ec4c8";

type VestModelProps = {
  reduceMotion: boolean;
};

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
    const pulse = 0.22 + Math.sin(t * 1.35 + phase) * 0.12;
    const mat = mesh.current.material;
    if (mat && "emissiveIntensity" in mat) {
      (mat as { emissiveIntensity: number }).emissiveIntensity = pulse;
    }
  });

  return (
    <mesh ref={mesh} position={position} castShadow>
      <capsuleGeometry args={[0.11, 0.16, 6, 12]} />
      <meshStandardMaterial
        color={PAD}
        emissive={PAD}
        emissiveIntensity={reduceMotion ? 0.18 : 0.28}
        roughness={0.35}
        metalness={0.08}
      />
    </mesh>
  );
}

/**
 * Procedural comfort-vest silhouette for the home hero.
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
      {/* Back panel */}
      <mesh position={[0, 0.15, -0.16]} castShadow receiveShadow>
        <boxGeometry args={[1.35, 1.55, 0.12]} />
        <meshStandardMaterial color={FABRIC_DARK} roughness={0.72} metalness={0.05} />
      </mesh>

      {/* Front left panel */}
      <mesh position={[-0.34, 0.12, 0.14]} rotation={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 1.5, 0.1]} />
        <meshStandardMaterial color={FABRIC} roughness={0.65} metalness={0.06} />
      </mesh>

      {/* Front right panel */}
      <mesh position={[0.34, 0.12, 0.14]} rotation={[0, -0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 1.5, 0.1]} />
        <meshStandardMaterial color={FABRIC} roughness={0.65} metalness={0.06} />
      </mesh>

      {/* Center zipper channel */}
      <mesh position={[0, 0.05, 0.2]}>
        <boxGeometry args={[0.06, 1.35, 0.04]} />
        <meshStandardMaterial color={TRIM} roughness={0.4} metalness={0.25} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.95, 0.02]} castShadow>
        <torusGeometry args={[0.38, 0.09, 10, 28, Math.PI]} />
        <meshStandardMaterial color={FABRIC_DARK} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.72, 0.72, 0]} rotation={[0, 0, 0.35]} castShadow>
        <capsuleGeometry args={[0.18, 0.42, 6, 12]} />
        <meshStandardMaterial color={FABRIC} roughness={0.68} metalness={0.05} />
      </mesh>
      <mesh position={[0.72, 0.72, 0]} rotation={[0, 0, -0.35]} castShadow>
        <capsuleGeometry args={[0.18, 0.42, 6, 12]} />
        <meshStandardMaterial color={FABRIC} roughness={0.68} metalness={0.05} />
      </mesh>

      {/* Waist band */}
      <mesh position={[0, -0.62, 0.02]} castShadow>
        <boxGeometry args={[1.42, 0.16, 0.28]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} metalness={0.12} />
      </mesh>

      {/* Soft comfort pads (atmosphere, unlabeled) */}
      <ActuatorPad position={[-0.32, 0.35, 0.28]} reduceMotion={reduceMotion} phase={0} />
      <ActuatorPad position={[0.32, 0.35, 0.28]} reduceMotion={reduceMotion} phase={1.1} />
      <ActuatorPad position={[-0.28, -0.15, 0.28]} reduceMotion={reduceMotion} phase={2.2} />
      <ActuatorPad position={[0.28, -0.15, 0.28]} reduceMotion={reduceMotion} phase={3.0} />
    </group>
  );
}
