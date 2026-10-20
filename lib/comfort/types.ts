export type SectionKind =
  | "intro"
  | "idea"
  | "safety"
  | "escalate"
  | "outro";

export type ComfortSlug = "self-massage" | "comfort-tools" | "escalate";

export type ComfortSection = {
  /** Message key fragment under comfort.items.<slug>.sections.<id> */
  id: string;
  kind: SectionKind;
  /** Soft “try for ~N min” hint only — no mandatory countdown UI. */
  suggestedMinutes?: number;
};

export type ComfortGuide = {
  slug: ComfortSlug;
  /** Rough read time for index list. */
  estimatedMinutes: number;
  sections: ComfortSection[];
};
