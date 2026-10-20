"use client";

import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float, OrbitControls } from "@react-three/drei";
import { VestModel } from "./vest-model";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}

function SceneContents({ reduceMotion }: { reduceMotion: boolean }) {
  const vest = <VestModel reduceMotion={reduceMotion} />;

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.55}
        rotateSpeed={0.7}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.65}
        minAzimuthAngle={-Math.PI * 0.85}
        maxAzimuthAngle={Math.PI * 0.85}
        target={[0, 0.12, 0]}
        dampingFactor={0.08}
        enableDamping
      />
      {reduceMotion ? (
        <group position={[0.08, 0.04, 0]}>{vest}</group>
      ) : (
        <Float speed={0.9} rotationIntensity={0.06} floatIntensity={0.18}>
          {vest}
        </Float>
      )}
      {/* Soft ground contact only — never a hard grey plate */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.26}
        scale={7}
        blur={2.8}
        far={3.2}
        color="#0a3a5c"
      />
      <Environment preset="city" environmentIntensity={0.4} />
    </>
  );
}

class WebGlBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

type VestSceneProps = {
  label: string;
  fallback: ReactNode;
};

/**
 * R3F Canvas stage — blue glass vest with slow auto-spin + drag orbit.
 */
export function VestScene({ label, fallback }: VestSceneProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <WebGlBoundary fallback={fallback}>
      <div className="h-full w-full touch-none" role="img" aria-label={label}>
        <Canvas
          shadows
          camera={{ position: [0.5, 0.35, 3.55], fov: 34 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent", touchAction: "none" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.58} />
          <directionalLight position={[3.6, 4.8, 2.8]} intensity={1.45} color="#e8f7ff" castShadow />
          <directionalLight position={[-2.8, 1.8, -1.6]} intensity={0.62} color="#5ecfff" />
          <spotLight
            position={[0.2, 3.4, 2.2]}
            intensity={0.85}
            angle={0.42}
            penumbra={0.75}
            color="#c8f0ff"
          />
          <pointLight position={[-1.2, 0.6, 1.4]} intensity={0.35} color="#2cf0ff" />
          <Suspense fallback={null}>
            <SceneContents reduceMotion={reduceMotion} />
          </Suspense>
        </Canvas>
      </div>
    </WebGlBoundary>
  );
}
