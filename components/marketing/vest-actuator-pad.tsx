"use client";

import Image from "next/image";
import { VEST_PAD_OVERLAY_PATH } from "@/lib/marketing/vest-assets";

type VestActuatorPadProps = {
  selected?: boolean;
  /**
   * `photo` — molded pad PNG (shell compositing).
   * `hit` — clear click target over baked pads; selected ring only (default).
   */
  mode?: "photo" | "hit";
  className?: string;
};

/**
 * Molded red actuator pad control. Default `hit` mode sits over baked
 * hardware frames without covering them with flat SVG squares. `photo`
 * mode uses the image-agent cutout for shell compositing.
 */
export function VestActuatorPad({
  selected = false,
  mode = "hit",
  className = "",
}: VestActuatorPadProps) {
  if (mode === "photo") {
    return (
      <span
        aria-hidden
        className={`relative block h-12 w-12 md:h-14 md:w-14 ${className}`}
      >
        <Image
          src={VEST_PAD_OVERLAY_PATH}
          alt=""
          fill
          sizes="56px"
          draggable={false}
          className={`object-contain transition duration-150 ${
            selected
              ? "scale-110 drop-shadow-[0_0_0_3px_var(--color-vest-wire-bright)] brightness-110"
              : "drop-shadow-[0_2px_4px_rgba(11,30,27,0.35)]"
          }`}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={`relative block h-11 w-14 md:h-12 md:w-16 ${className}`}
    >
      {/* Invisible hit footprint matching molded rectangular pads */}
      <span
        className={`absolute inset-0 rounded-[0.65rem] border-[3px] transition ${
          selected
            ? "border-[var(--color-vest-wire-bright)] bg-[color-mix(in_oklab,var(--color-vest-wire)_22%,transparent)] shadow-[0_0_0_2px_rgba(255,45,74,0.35)]"
            : "border-transparent bg-transparent hover:border-[color-mix(in_oklab,var(--color-vest-wire)_70%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-vest-wire)_12%,transparent)]"
        }`}
      />
    </span>
  );
}
