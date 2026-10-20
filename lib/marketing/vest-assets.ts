/**
 * CalmIq image-vest asset contract (see internal/image-vest-sources.md).
 * Image agent drops bg-removed PNGs here; swap files without code changes.
 */

/** Baked hardware frames — blue shell + Li-ion + red wires + molded red pads. */
export const VEST_FRAME_PATHS = [
  "/images/vest-front.png",
  "/images/vest-three-quarter.png",
  "/images/vest-side.png",
] as const;

/** Shell-only frames (no battery/wires/pads) for optional compositing. */
export const VEST_SHELL_FRAME_PATHS = [
  "/images/comfort-vest-blue-shell-front.png",
  "/images/comfort-vest-blue-shell-threequarter.png",
  "/images/comfort-vest-blue-shell-side.png",
] as const;

/** Single molded red actuator pad cutout (clickable hotspot visual). */
export const VEST_PAD_OVERLAY_PATH = "/images/vest-overlay-actuator-pad.png";

/** Lithium pack cutout for compositing on shells. */
export const VEST_BATTERY_OVERLAY_PATH =
  "/images/comfort-vest-overlay-battery.png";

/** Buy-page person-wearing-vest asset — replaceable by image agent. */
export const VEST_WORN_PATH = "/images/vest-worn.png";

export type VestZoneId =
  | "traps"
  | "shoulders"
  | "midBack"
  | "lowerBack"
  | "chest";

export type VestHotspot = {
  id: VestZoneId;
  /** Percent of stage width/height — aligned to baked molded pads. */
  x: number;
  y: number;
};

/**
 * Actuator anchors matching baked front-frame pad layout
 * (upper L/R, mid L/R, lower center; battery ~50/62).
 */
export const VEST_HOTSPOTS: VestHotspot[] = [
  { id: "traps", x: 36, y: 30 },
  { id: "shoulders", x: 64, y: 30 },
  { id: "chest", x: 36, y: 54 },
  { id: "midBack", x: 64, y: 54 },
  { id: "lowerBack", x: 50, y: 80 },
];
