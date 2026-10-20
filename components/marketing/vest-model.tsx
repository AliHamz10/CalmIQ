"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

/** Cool teal / cyan glass — CalmIq brand tokens, not purple. */
const FABRIC = "#0d9dff";
const FABRIC_DARK = "#0678d4";
const TRIM = "#2cf0ff";
const PAD = "#9af8ff";
/** Soft cool silhouette — readable through glass, never dominates. */
const FIGURE = "#8b98a4";
const FIGURE_SOFT = "#a3b0ba";

type VestModelProps = {
  reduceMotion: boolean;
};

function GlassMaterial({
  color,
  opacity = 0.38,
  transmission = 0.72,
}: {
  color: string;
  opacity?: number;
  transmission?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.08}
      metalness={0.04}
      transmission={transmission}
      thickness={0.45}
      ior={1.42}
      transparent
      opacity={opacity}
      depthWrite={false}
      attenuationColor={color}
      attenuationDistance={0.55}
      emissive={color}
      emissiveIntensity={0.14}
      envMapIntensity={1.25}
      clearcoat={0.85}
      clearcoatRoughness={0.08}
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
    const pulse = 0.32 + Math.sin(t * 1.35 + phase) * 0.16;
    const mat = mesh.current.material;
    if (mat && "emissiveIntensity" in mat) {
      (mat as { emissiveIntensity: number }).emissiveIntensity = pulse;
    }
  });

  return (
    <group position={position}>
      {/* Small-to-medium actuator disk — readable through glass shell */}
      <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.022, 20]} />
        <meshStandardMaterial
          color={PAD}
          emissive={PAD}
          emissiveIntensity={reduceMotion ? 0.22 : 0.34}
          roughness={0.22}
          metalness={0.18}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.012]}>
        <cylinderGeometry args={[0.028, 0.028, 0.01, 14]} />
        <meshStandardMaterial
          color="#e8ffff"
          emissive={TRIM}
          emissiveIntensity={0.45}
          roughness={0.18}
          metalness={0.25}
        />
      </mesh>
    </group>
  );
}

/**
 * Soft stylized human figure — tasteful silhouette wearing the vest.
 * Cool gray-blue so it reads through glass without competing for attention.
 */
function HumanSilhouette() {
  return (
    <group position={[0, -0.18, -0.2]} scale={1.05} renderOrder={0}>
      <mesh position={[0, 1.3, 0.08]} renderOrder={0}>
        <sphereGeometry args={[0.22, 22, 22]} />
        <meshStandardMaterial color={FIGURE} roughness={0.86} metalness={0} />
      </mesh>
      <mesh position={[0, 1.05, 0.06]} renderOrder={0}>
        <cylinderGeometry args={[0.07, 0.085, 0.18, 12]} />
        <meshStandardMaterial color={FIGURE_SOFT} roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[0, 0.32, -0.04]} renderOrder={0}>
        <capsuleGeometry args={[0.28, 0.8, 6, 14]} />
        <meshStandardMaterial color={FIGURE} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[-0.44, 0.42, 0.02]} rotation={[0.15, 0, 0.22]} renderOrder={0}>
        <capsuleGeometry args={[0.085, 0.4, 4, 10]} />
        <meshStandardMaterial color={FIGURE_SOFT} roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[0.44, 0.42, 0.02]} rotation={[0.15, 0, -0.22]} renderOrder={0}>
        <capsuleGeometry args={[0.085, 0.4, 4, 10]} />
        <meshStandardMaterial color={FIGURE_SOFT} roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[-0.14, -0.5, 0]} renderOrder={0}>
        <capsuleGeometry args={[0.1, 0.28, 4, 10]} />
        <meshStandardMaterial color={FIGURE} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0.14, -0.5, 0]} renderOrder={0}>
        <capsuleGeometry args={[0.1, 0.28, 4, 10]} />
        <meshStandardMaterial color={FIGURE} roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

/**
 * Procedural comfort-vest for marketing — blue glass shell, actuators readable through it.
 * Visual metaphor only — not a medical device schematic. No trademark claims.
 * Orbit / auto-spin is owned by VestScene (OrbitControls); this mesh only soft-bobs.
 */
export function VestModel({ reduceMotion }: VestModelProps) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    if (reduceMotion) {
      group.current.position.y = 0;
      return;
    }
    const t = clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 0.65) * 0.035;
  });

  return (
    <group ref={group} position={[0, -0.12, 0]} scale={1.18} rotation={[0, -0.32, 0]}>
      <HumanSilhouette />

      {/* Back panel — slightly denser glass */}
      <mesh position={[0, 0.15, -0.16]} castShadow receiveShadow renderOrder={1}>
        <boxGeometry args={[1.32, 1.52, 0.09]} />
        <GlassMaterial color={FABRIC_DARK} opacity={0.4} transmission={0.62} />
      </mesh>

      {/* Front left panel */}
      <mesh position={[-0.33, 0.12, 0.14]} rotation={[0, 0.1, 0]} castShadow receiveShadow renderOrder={2}>
        <boxGeometry args={[0.6, 1.48, 0.07]} />
        <GlassMaterial color={FABRIC} opacity={0.36} transmission={0.78} />
      </mesh>

      {/* Front right panel */}
      <mesh position={[0.33, 0.12, 0.14]} rotation={[0, -0.1, 0]} castShadow receiveShadow renderOrder={2}>
        <boxGeometry args={[0.6, 1.48, 0.07]} />
        <GlassMaterial color={FABRIC} opacity={0.36} transmission={0.78} />
      </mesh>

      {/* Center zipper channel */}
      <mesh position={[0, 0.05, 0.2]}>
        <boxGeometry args={[0.045, 1.32, 0.032]} />
        <meshPhysicalMaterial
          color={TRIM}
          roughness={0.2}
          metalness={0.4}
          transparent
          opacity={0.78}
          transmission={0.2}
          emissive={TRIM}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.94, 0.02]} castShadow>
        <torusGeometry args={[0.36, 0.075, 10, 28, Math.PI]} />
        <GlassMaterial color={FABRIC_DARK} opacity={0.42} transmission={0.6} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.7, 0.7, 0]} rotation={[0, 0, 0.35]} castShadow>
        <capsuleGeometry args={[0.16, 0.38, 6, 12]} />
        <GlassMaterial color={FABRIC} opacity={0.34} transmission={0.75} />
      </mesh>
      <mesh position={[0.7, 0.7, 0]} rotation={[0, 0, -0.35]} castShadow>
        <capsuleGeometry args={[0.16, 0.38, 6, 12]} />
        <GlassMaterial color={FABRIC} opacity={0.34} transmission={0.75} />
      </mesh>

      {/* Waist band */}
      <mesh position={[0, -0.6, 0.02]} castShadow>
        <boxGeometry args={[1.38, 0.13, 0.24]} />
        <meshPhysicalMaterial
          color={TRIM}
          roughness={0.25}
          metalness={0.22}
          transparent
          opacity={0.58}
          transmission={0.4}
          thickness={0.28}
          emissive={TRIM}
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Soft comfort pads — small-to-medium, clearly readable through shell */}
      <ActuatorPad position={[-0.3, 0.38, 0.24]} reduceMotion={reduceMotion} phase={0} />
      <ActuatorPad position={[0.3, 0.38, 0.24]} reduceMotion={reduceMotion} phase={1.1} />
      <ActuatorPad position={[-0.26, -0.12, 0.24]} reduceMotion={reduceMotion} phase={2.2} />
      <ActuatorPad position={[0.26, -0.12, 0.24]} reduceMotion={reduceMotion} phase={3.0} />
      <ActuatorPad position={[0, 0.12, 0.25]} reduceMotion={reduceMotion} phase={1.6} />
    </group>
  );
}
