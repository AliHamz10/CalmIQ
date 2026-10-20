"use client";

import { useEffect, useState, type ComponentType } from "react";
import { VestFallback } from "./vest-fallback";

type VestSceneProps = {
  label: string;
  fallback: React.ReactNode;
};

type VestCanvasProps = {
  label: string;
};

/**
 * Client-only mount + lazy R3F import.
 * SVG silhouette for no-WebGL / prefers-reduced-motion; interactive 3D otherwise.
 */
export function VestCanvas({ label }: VestCanvasProps) {
  const [Scene, setScene] = useState<ComponentType<VestSceneProps> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const probe = document.createElement("canvas");
    const hasWebGl = !!(
      probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl")
    );

    if (!hasWebGl) return;

    void import("./vest-scene")
      .then((mod) => {
        if (!cancelled) setScene(() => mod.VestScene);
      })
      .catch(() => {
        /* keep SVG fallback */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fallback = <VestFallback label={label} />;

  if (!Scene) return fallback;

  return <Scene label={label} fallback={fallback} />;
}
