"use client";

import { useId } from "react";

type VestActuatorPadProps = {
  selected?: boolean;
  className?: string;
};

/**
 * Hardware-style red comfort actuator pad — distinct rim, beveled face,
 * center contact, mounting lugs. Not a soft glow blob.
 */
export function VestActuatorPad({
  selected = false,
  className = "",
}: VestActuatorPadProps) {
  const uid = useId().replace(/:/g, "");
  const face = `padFace-${uid}`;
  const rim = `padRim-${uid}`;
  const contact = `padContact-${uid}`;

  return (
    <span
      aria-hidden
      className={`relative block h-11 w-11 md:h-12 md:w-12 ${className}`}
    >
      <svg viewBox="0 0 48 48" className="h-full w-full">
        <defs>
          <linearGradient id={face} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={selected ? "#ff5a6e" : "#f02438"} />
            <stop offset="40%" stopColor={selected ? "#e11d2e" : "#c4122a"} />
            <stop offset="100%" stopColor="#6e0c18" />
          </linearGradient>
          <linearGradient id={rim} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a070e" />
            <stop offset="100%" stopColor="#140206" />
          </linearGradient>
          <linearGradient id={contact} x1="20%" y1="15%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#ff9aa6" />
            <stop offset="50%" stopColor="#ff2d4a" />
            <stop offset="100%" stopColor="#7a0c18" />
          </linearGradient>
        </defs>

        {/* Hard outer chassis — squared, not a blob */}
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="5"
          fill={`url(#${rim})`}
          stroke="#ff2d4a"
          strokeWidth="1.8"
        />
        {/* Beveled plate */}
        <rect
          x="5.5"
          y="5.5"
          width="37"
          height="37"
          rx="3.5"
          fill={`url(#${face})`}
          stroke="#ffb0b8"
          strokeWidth="1.1"
        />
        {/* Recessed well */}
        <rect
          x="11"
          y="11"
          width="26"
          height="26"
          rx="2.5"
          fill="#4a0810"
          stroke="#2a050a"
          strokeWidth="1"
        />
        {/* Square contact plate (hardware, not soft disc) */}
        <rect
          x="16"
          y="16"
          width="16"
          height="16"
          rx="2"
          fill={`url(#${contact})`}
          stroke="#3a070e"
          strokeWidth="1.1"
        />
        <rect x="20" y="20" width="8" height="8" rx="1" fill="#fff5f6" opacity="0.35" />

        {/* Crosshair etch for pad readability */}
        <line x1="24" y1="17.5" x2="24" y2="30.5" stroke="#5a0a14" strokeWidth="0.7" />
        <line x1="17.5" y1="24" x2="30.5" y2="24" stroke="#5a0a14" strokeWidth="0.7" />

        {/* Corner screws */}
        <circle cx="9" cy="9" r="1.7" fill="#1a0508" stroke="#ff6b7d" strokeWidth="0.7" />
        <circle cx="39" cy="9" r="1.7" fill="#1a0508" stroke="#ff6b7d" strokeWidth="0.7" />
        <circle cx="9" cy="39" r="1.7" fill="#1a0508" stroke="#ff6b7d" strokeWidth="0.7" />
        <circle cx="39" cy="39" r="1.7" fill="#1a0508" stroke="#ff6b7d" strokeWidth="0.7" />
        <line x1="7.8" y1="9" x2="10.2" y2="9" stroke="#ffb0b8" strokeWidth="0.45" />
        <line x1="9" y1="7.8" x2="9" y2="10.2" stroke="#ffb0b8" strokeWidth="0.45" />
        <line x1="37.8" y1="9" x2="40.2" y2="9" stroke="#ffb0b8" strokeWidth="0.45" />
        <line x1="39" y1="7.8" x2="39" y2="10.2" stroke="#ffb0b8" strokeWidth="0.45" />

        {/* Bottom wire crimp terminal */}
        <rect
          x="19"
          y="41.5"
          width="10"
          height="4.2"
          rx="0.7"
          fill="#1a0508"
          stroke="#ff2d4a"
          strokeWidth="0.9"
        />
        <rect x="21.5" y="42.5" width="5" height="2" rx="0.3" fill="#e11d2e" />

        {selected ? (
          <rect
            x="0.5"
            y="0.5"
            width="47"
            height="47"
            rx="5.5"
            fill="none"
            stroke="#ff2d4a"
            strokeWidth="2.2"
          />
        ) : null}
      </svg>
    </span>
  );
}
