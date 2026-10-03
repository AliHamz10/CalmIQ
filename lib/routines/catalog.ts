import type { RoutineDefinition, RoutineSlug } from "./types";

export const ROUTINE_SLUGS = [
  "breathing",
  "desk-reset",
  "wind-down",
] as const satisfies readonly RoutineSlug[];

/**
 * Structure-only catalog — titles/bodies live in next-intl under
 * `routines.items.<slug>.*` keyed by step `id`.
 */
const CATALOG: readonly RoutineDefinition[] = [
  {
    slug: "breathing",
    estimatedSec: 120,
    steps: [
      { id: "s1", kind: "intro", durationSec: 15 },
      {
        id: "s2",
        kind: "breath",
        // 4 inhale + 2 hold + 6 exhale × 4 cycles ≈ 48s
        durationSec: 48,
        breath: { inhale: 4, hold: 2, exhale: 6, cycles: 4 },
      },
      { id: "s3", kind: "pause", durationSec: 20 },
      {
        id: "s4",
        kind: "breath",
        // 4 inhale + 6 exhale × 3 cycles ≈ 30s
        durationSec: 30,
        breath: { inhale: 4, exhale: 6, cycles: 3 },
      },
      { id: "s5", kind: "outro", durationSec: 10 },
    ],
  },
  {
    slug: "desk-reset",
    estimatedSec: 180,
    steps: [
      { id: "s1", kind: "intro", durationSec: 15 },
      { id: "s2", kind: "action", durationSec: 30 },
      { id: "s3", kind: "action", durationSec: 40 },
      { id: "s4", kind: "action", durationSec: 30 },
      { id: "s5", kind: "action", durationSec: 45 },
      { id: "s6", kind: "outro", durationSec: 15 },
    ],
  },
  {
    slug: "wind-down",
    estimatedSec: 300,
    steps: [
      { id: "s1", kind: "intro", durationSec: 20 },
      { id: "s2", kind: "action", durationSec: 40 },
      {
        id: "s3",
        kind: "breath",
        // 4 inhale + 4 hold + 8 exhale × 4 cycles ≈ 64s
        durationSec: 64,
        breath: { inhale: 4, hold: 4, exhale: 8, cycles: 4 },
      },
      { id: "s4", kind: "action", durationSec: 45 },
      { id: "s5", kind: "pause", durationSec: 60 },
      {
        id: "s6",
        kind: "breath",
        // 4 inhale + 8 exhale × 3 cycles ≈ 36s
        durationSec: 36,
        breath: { inhale: 4, exhale: 8, cycles: 3 },
      },
      { id: "s7", kind: "outro", durationSec: 20 },
    ],
  },
];

const BY_SLUG = Object.fromEntries(
  CATALOG.map((routine) => [routine.slug, routine]),
) as Record<RoutineSlug, RoutineDefinition>;

export function listRoutines(): readonly RoutineDefinition[] {
  return CATALOG;
}

export function getRoutine(slug: string): RoutineDefinition | undefined {
  if (!isRoutineSlug(slug)) return undefined;
  return BY_SLUG[slug];
}

export function isRoutineSlug(value: string): value is RoutineSlug {
  return (ROUTINE_SLUGS as readonly string[]).includes(value);
}
