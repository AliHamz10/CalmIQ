"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, Mesh } from "three";

/** Match `--color-vest-*` (Three can't read CSS vars in materials). */
const FABRIC = "#0d9dff";
const FABRIC_DARK = "#0678d4";
const TRIM = "#2cf0ff";
const PAD = "#9af8ff";
const PAD_CORE = "#e8ffff";
const FIGURE = "#8b98a4";
const FIGURE_SOFT = "#a3b0ba";

type VestModelProps = {
  reduceMotion: boolean;
};

function GlassMaterial({
  color,
  opacity = 0.42,
  transmission = 0.58,
}: {
  color: string;
  opacity?: number;
  transmission?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.1}
      metalness={0.05}
      transmission={transmission}
      thickness={0.5}
      ior={1.4}
      transparent
      opacity={opacity}
      depthWrite={false}
      attenuationColor={color}
      attenuationDistance={0.65}
      emissive={color}
      emissiveIntensity={0.1}
      envMapIntensity={1.2}
      clearcoat={0.8}
      clearcoatRoughness={0.1}
      side={THREE.DoubleSide}
    />
  );
}

function ActuatorPad({
  position,
  rotation = [Math.PI / 2, 0, 0] as [number, number, number],
  reduceMotion,
  phase = 0,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  reduceMotion: boolean;
  phase?: number;
}) {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current || reduceMotion) return;
    const t = clock.getElapsedTime();
    const pulse = 0.34 + Math.sin(t * 1.35 + phase) * 0.15;
    const mat = mesh.current.material;
    if (mat && "emissiveIntensity" in mat) {
      (mat as { emissiveIntensity: number }).emissiveIntensity = pulse;
    }
  });

  return (
    <group position={position} rotation={rotation} renderOrder={5}>
      <mesh ref={mesh} castShadow>
        <cylinderGeometry args={[0.052, 0.052, 0.018, 20]} />
        <meshStandardMaterial
          color={PAD}
          emissive={PAD}
          emissiveIntensity={reduceMotion ? 0.24 : 0.36}
          roughness={0.24}
          metalness={0.14}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.01, 14]} />
        <meshStandardMaterial
          color={PAD_CORE}
          emissive={TRIM}
          emissiveIntensity={0.4}
          roughness={0.18}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

/** Cool grey scale anchor — full head + torso + upper legs in frame. */
function HumanSilhouette() {
  return (
    <group position={[0, -0.22, -0.06]} scale={1} renderOrder={0}>
      <mesh position={[0, 1.28, 0.04]}>
        <sphereGeometry args={[0.2, 22, 22]} />
        <meshStandardMaterial color={FIGURE} roughness={0.86} metalness={0} />
      </mesh>
      <mesh position={[0, 1.04, 0.03]}>
        <cylinderGeometry args={[0.065, 0.078, 0.16, 12]} />
        <meshStandardMaterial color={FIGURE_SOFT} roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[0, 0.28, -0.02]}>
        <capsuleGeometry args={[0.26, 0.78, 6, 14]} />
        <meshStandardMaterial color={FIGURE} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[-0.4, 0.38, 0.02]} rotation={[0.12, 0, 0.28]}>
        <capsuleGeometry args={[0.078, 0.38, 4, 10]} />
        <meshStandardMaterial color={FIGURE_SOFT} roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[0.4, 0.38, 0.02]} rotation={[0.12, 0, -0.28]}>
        <capsuleGeometry args={[0.078, 0.38, 4, 10]} />
        <meshStandardMaterial color={FIGURE_SOFT} roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[-0.12, -0.52, 0]}>
        <capsuleGeometry args={[0.095, 0.32, 4, 10]} />
        <meshStandardMaterial color={FIGURE} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0.12, -0.52, 0]}>
        <capsuleGeometry args={[0.095, 0.32, 4, 10]} />
        <meshStandardMaterial color={FIGURE} roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

/** Profile curve: neck → shoulder flare → ribcage → cinched waist (wearable vest). */
function useVestProfile(scale = 1) {
  return useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const samples = 28;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const y = (0.95 - t * 1.55) * scale;
      // Wider at chest/shoulders, soft cinch at waist
      const chest = Math.sin(Math.min(t, 0.55) * Math.PI) * 0.14;
      const waist = t > 0.7 ? (t - 0.7) * 0.22 : 0;
      const r = (0.42 + chest - waist) * scale;
      pts.push(new THREE.Vector2(Math.max(0.22, r), y));
    }
    return pts;
  }, [scale]);
}

/**
 * Wearable blue-glass comfort vest — curved shells wrap the torso (not flat panes).
 * Visual metaphor only. Orbit owned by VestScene.
 */
export function VestModel({ reduceMotion }: VestModelProps) {
  const group = useRef<Group>(null);
  const profile = useVestProfile(1);

  useFrame(({ clock }) => {
    if (!group.current) return;
    if (reduceMotion) {
      group.current.position.y = 0;
      return;
    }
    group.current.position.y = Math.sin(clock.getElapsedTime() * 0.65) * 0.03;
  });

  return (
    <group ref={group} position={[0, -0.08, 0]} scale={1.12} rotation={[0.04, -0.38, 0]}>
      <HumanSilhouette />

      {/* Back shell — open gilet arc wrapping the torso */}
      <mesh castShadow receiveShadow renderOrder={1}>
        <latheGeometry args={[profile, 48, Math.PI * 0.55, Math.PI * 0.9]} />
        <GlassMaterial color={FABRIC_DARK} opacity={0.42} transmission={0.5} />
      </mesh>

      {/* Front-left curved panel (wraps ribcage, open at center zip) */}
      <mesh castShadow receiveShadow renderOrder={2}>
        <latheGeometry args={[profile, 36, -Math.PI * 0.42, Math.PI * 0.55]} />
        <GlassMaterial color={FABRIC} opacity={0.4} transmission={0.6} />
      </mesh>

      {/* Front-right curved panel */}
      <mesh castShadow receiveShadow renderOrder={2}>
        <latheGeometry args={[profile, 36, Math.PI * 0.87, Math.PI * 0.55]} />
        <GlassMaterial color={FABRIC} opacity={0.4} transmission={0.6} />
      </mesh>

      {/* Side underarm bridges — soft capsule wrap, not flat panes */}
      <mesh position={[-0.4, 0.2, -0.02]} rotation={[0.1, 0.4, 0.15]} castShadow renderOrder={2}>
        <capsuleGeometry args={[0.11, 0.85, 6, 12]} />
        <GlassMaterial color={FABRIC} opacity={0.32} transmission={0.65} />
      </mesh>
      <mesh position={[0.4, 0.2, -0.02]} rotation={[0.1, -0.4, -0.15]} castShadow renderOrder={2}>
        <capsuleGeometry args={[0.11, 0.85, 6, 12]} />
        <GlassMaterial color={FABRIC} opacity={0.32} transmission={0.65} />
      </mesh>

      {/* Collar ring */}
      <mesh position={[0, 0.88, 0.02]} rotation={[0.15, 0, 0]} castShadow>
        <torusGeometry args={[0.3, 0.055, 12, 36, Math.PI * 1.35]} />
        <GlassMaterial color={FABRIC_DARK} opacity={0.48} transmission={0.5} />
      </mesh>

      {/* Shoulder caps */}
      <mesh position={[-0.48, 0.72, 0.02]} rotation={[0.2, 0.15, 0.55]} castShadow>
        <sphereGeometry args={[0.2, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        <GlassMaterial color={FABRIC} opacity={0.38} transmission={0.58} />
      </mesh>
      <mesh position={[0.48, 0.72, 0.02]} rotation={[0.2, -0.15, -0.55]} castShadow>
        <sphereGeometry args={[0.2, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        <GlassMaterial color={FABRIC} opacity={0.38} transmission={0.58} />
      </mesh>

      {/* Center zip channel */}
      <mesh position={[0, 0.12, 0.34]}>
        <capsuleGeometry args={[0.018, 1.05, 4, 8]} />
        <meshPhysicalMaterial
          color={TRIM}
          roughness={0.22}
          metalness={0.4}
          transparent
          opacity={0.8}
          transmission={0.15}
          emissive={TRIM}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Cinched waist band */}
      <mesh position={[0, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.38, 0.045, 10, 48]} />
        <meshPhysicalMaterial
          color={TRIM}
          roughness={0.28}
          metalness={0.2}
          transparent
          opacity={0.62}
          transmission={0.32}
          thickness={0.2}
          emissive={TRIM}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Soft comfort discs — through glass, unlabeled */}
      <ActuatorPad
        position={[-0.22, 0.42, 0.36]}
        rotation={[1.15, 0.25, 0]}
        reduceMotion={reduceMotion}
        phase={0}
      />
      <ActuatorPad
        position={[0.22, 0.42, 0.36]}
        rotation={[1.15, -0.25, 0]}
        reduceMotion={reduceMotion}
        phase={1.1}
      />
      <ActuatorPad
        position={[-0.2, 0.02, 0.38]}
        rotation={[1.25, 0.2, 0]}
        reduceMotion={reduceMotion}
        phase={2.2}
      />
      <ActuatorPad
        position={[0.2, 0.02, 0.38]}
        rotation={[1.25, -0.2, 0]}
        reduceMotion={reduceMotion}
        phase={3.0}
      />
    </group>
  );
}
