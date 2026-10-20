export type StepKind = "intro" | "breath" | "action" | "pause" | "outro";

export type RoutineSlug = "breathing" | "desk-reset" | "wind-down";

export type BreathPattern = {
  inhale: number;
  hold?: number;
  exhale: number;
  cycles?: number;
};

export type RoutineStep = {
  /** Message key fragment under routines.items.<slug>.steps.<id> */
  id: string;
  kind: StepKind;
  /** Timed step length in seconds (breath/action/pause). */
  durationSec?: number;
  breath?: BreathPattern;
};

export type RoutineDefinition = {
  slug: RoutineSlug;
  estimatedSec: number;
  steps: RoutineStep[];
};
