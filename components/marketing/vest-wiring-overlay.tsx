"use client";

import { useId } from "react";
import { VEST_HOTSPOTS } from "@/lib/marketing/vest-assets";

type VestWiringOverlayProps = {
  className?: string;
};

/** Li-ion pack anchor — percent coords matching hotspot layout. */
export const VEST_BATTERY = { x: 50, y: 58 };

/**
 * Red lead wires + visible Li-ion pack. Wire ends meet actuator pad
 * terminals (same percent coords as clickable VestActuatorPad buttons).
 */
export function VestWiringOverlay({ className = "" }: VestWiringOverlayProps) {
  const uid = useId().replace(/:/g, "");
  const wireGrad = `vestWireRed-${uid}`;
  const bx = VEST_BATTERY.x;
  const by = VEST_BATTERY.y;

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 z-[5] h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id={wireGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b0e1c" />
          <stop offset="40%" stopColor="#e11d2e" />
          <stop offset="100%" stopColor="#c4122a" />
        </linearGradient>
      </defs>

      {VEST_HOTSPOTS.map((spot) => {
        const midX = (bx + spot.x) / 2 + (spot.x < bx ? -5 : 5);
        const midY = Math.min(by, spot.y) + Math.abs(by - spot.y) * 0.35;
        // Stop just short of pad center so wire meets the terminal notch
        const endY = spot.y + 3.2;
        const d = `M ${bx} ${by - 5.2} C ${bx} ${midY}, ${midX} ${midY}, ${spot.x} ${endY}`;
        return (
          <g key={spot.id}>
            {/* Cable sheath */}
            <path
              d={d}
              fill="none"
              stroke="#4a0810"
              strokeWidth="1.55"
              strokeLinecap="round"
            />
            <path
              d={d}
              fill="none"
              stroke={`url(#${wireGrad})`}
              strokeWidth="0.95"
              strokeLinecap="round"
            />
            {/* Highlight strand */}
            <path
              d={d}
              fill="none"
              stroke="#ff6b7d"
              strokeWidth="0.28"
              strokeLinecap="round"
              opacity="0.75"
            />
            {/* Crimp at pad terminal */}
            <rect
              x={spot.x - 1.1}
              y={endY - 0.4}
              width="2.2"
              height="1.4"
              rx="0.3"
              fill="#2a050a"
              stroke="#e11d2e"
              strokeWidth="0.35"
            />
          </g>
        );
      })}

      {/* Lithium battery pack — lower mid torso */}
      <g transform={`translate(${bx} ${by})`}>
        <rect
          x="-8.5"
          y="-6.2"
          width="17"
          height="12.4"
          rx="1.4"
          fill="#141a1f"
          stroke="#e11d2e"
          strokeWidth="0.85"
        />
        <rect x="-7.2" y="-4.6" width="12.5" height="5.2" rx="0.55" fill="#222b33" />
        <rect x="-6.4" y="-3.8" width="4.6" height="3.6" rx="0.35" fill="#e11d2e" />
        <rect x="-1.2" y="-3.8" width="5.2" height="3.6" rx="0.35" fill="#3a4650" />
        {/* Cell divider lines */}
        <line x1="-6.4" y1="-2" x2="-1.8" y2="-2" stroke="#8b0e1c" strokeWidth="0.25" />
        <line x1="-1.2" y1="-2" x2="4" y2="-2" stroke="#1a2228" strokeWidth="0.25" />
        {/* + terminal */}
        <rect x="7.2" y="-2.4" width="2" height="4.8" rx="0.35" fill="#c8d0d8" stroke="#8a929a" strokeWidth="0.3" />
        <text
          x="-0.4"
          y="5.4"
          textAnchor="middle"
          fill="#ff2d4a"
          fontSize="2.55"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="700"
          letterSpacing="0.04em"
        >
          Li-ion
        </text>
      </g>
    </svg>
  );
}
