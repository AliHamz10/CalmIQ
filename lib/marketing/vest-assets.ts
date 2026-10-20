/**
 * CalmIq image-vest asset contract.
 * Image agent: drop bg-removed blue PNGs at these public paths
 * (and optionally under /cursor/stores/self/media/image-vest/).
 * Component auto-uses whatever is present; swap files without code changes.
 */
export const VEST_FRAME_PATHS = [
  "/images/vest-front.png",
  "/images/vest-three-quarter.png",
  "/images/vest-side.png",
] as const;

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
  /** Percent of stage width/height — consistent hardware pad layout. */
  x: number;
  y: number;
};

/**
 * Actuator pad anchors on the vest silhouette.
 * Symmetric L/R where useful; battery sits mid-torso (~50, 58).
 */
export const VEST_HOTSPOTS: VestHotspot[] = [
  { id: "traps", x: 50, y: 26 },
  { id: "shoulders", x: 27, y: 36 },
  { id: "chest", x: 50, y: 44 },
  { id: "midBack", x: 73, y: 36 },
  { id: "lowerBack", x: 50, y: 74 },
];
