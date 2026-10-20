"use client";

import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
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
      {reduceMotion ? (
        <group position={[0.1, 0.05, 0]}>{vest}</group>
      ) : (
        <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.3}>
          {vest}
        </Float>
      )}
      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.32}
        scale={8}
        blur={2.4}
        far={3.5}
      />
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
 * R3F Canvas stage for the comfort vest.
 */
export function VestScene({ label, fallback }: VestSceneProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <WebGlBoundary fallback={fallback}>
      <div className="h-full w-full" role="img" aria-label={label}>
        <Canvas
          shadows
          camera={{ position: [0.35, 0.35, 3.4], fov: 38 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.72} />
          <directionalLight position={[3.5, 4.5, 2.5]} intensity={1.35} color="#e8f7ff" />
          <directionalLight position={[-2.5, 1.5, -1.5]} intensity={0.55} color="#5ecfff" />
          <spotLight
            position={[0, 3.2, 2]}
            intensity={0.7}
            angle={0.45}
            penumbra={0.7}
            color="#c8f0ff"
          />
          <Suspense fallback={null}>
            <SceneContents reduceMotion={reduceMotion} />
          </Suspense>
        </Canvas>
      </div>
    </WebGlBoundary>
  );
}
