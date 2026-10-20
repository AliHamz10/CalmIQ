import type { ComfortGuide, ComfortSlug } from "./types";

export const COMFORT_SLUGS = [
  "self-massage",
  "comfort-tools",
  "escalate",
] as const satisfies readonly ComfortSlug[];

/**
 * Structure-only catalog — titles/bodies live in next-intl under
 * `comfort.items.<slug>.*` keyed by section `id`.
 */
const CATALOG: readonly ComfortGuide[] = [
  {
    slug: "self-massage",
    estimatedMinutes: 8,
    sections: [
      { id: "s1", kind: "intro" },
      { id: "s2", kind: "idea", suggestedMinutes: 2 },
      { id: "s3", kind: "idea", suggestedMinutes: 2 },
      { id: "s4", kind: "idea", suggestedMinutes: 2 },
      { id: "s5", kind: "safety" },
      { id: "s6", kind: "outro" },
    ],
  },
  {
    slug: "comfort-tools",
    estimatedMinutes: 6,
    sections: [
      { id: "s1", kind: "intro" },
      { id: "s2", kind: "idea", suggestedMinutes: 2 },
      { id: "s3", kind: "idea", suggestedMinutes: 2 },
      { id: "s4", kind: "idea", suggestedMinutes: 1 },
      { id: "s5", kind: "safety" },
      { id: "s6", kind: "outro" },
    ],
  },
  {
    slug: "escalate",
    estimatedMinutes: 5,
    sections: [
      { id: "s1", kind: "intro" },
      { id: "s2", kind: "safety" },
      { id: "s3", kind: "escalate" },
      { id: "s4", kind: "escalate" },
      { id: "s5", kind: "outro" },
    ],
  },
];

const BY_SLUG = Object.fromEntries(
  CATALOG.map((guide) => [guide.slug, guide]),
) as Record<ComfortSlug, ComfortGuide>;

export function listComfortGuides(): readonly ComfortGuide[] {
  return CATALOG;
}

export function getComfortGuide(slug: string): ComfortGuide | undefined {
  if (!isComfortSlug(slug)) return undefined;
  return BY_SLUG[slug];
}

export function isComfortSlug(value: string): value is ComfortSlug {
  return (COMFORT_SLUGS as readonly string[]).includes(value);
}
