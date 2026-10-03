"use client";

import { useTranslations } from "next-intl";
import type { BreathPattern, RoutineSlug, RoutineStep } from "@/lib/routines";

export type BreathPhase = "inhale" | "hold" | "exhale";

type Props = {
  slug: RoutineSlug;
  step: RoutineStep;
  stepIndex: number;
  totalSteps: number;
  remainingSec: number | null;
  breathPhase: BreathPhase | null;
  timerComplete: boolean;
  reducedMotion: boolean;
};

export function RoutineStepView({
  slug,
  step,
  stepIndex,
  totalSteps,
  remainingSec,
  breathPhase,
  timerComplete,
  reducedMotion,
}: Props) {
  const t = useTranslations("routines");
  const title = t(`items.${slug}.steps.${step.id}.title`);
  const body = t(`items.${slug}.steps.${step.id}.body`);
  const showBreathVisual = step.kind === "breath" && step.breath;

  return (
    <div
      key={step.id}
      className={reducedMotion ? undefined : "animate-rise"}
      aria-live="polite"
    >
      <p className="text-sm font-medium text-muted">
        {t("progress", { current: stepIndex + 1, total: totalSteps })}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-primary text-balance md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{body}</p>

      {showBreathVisual ? (
        <BreathVisual
          phase={breathPhase}
          pattern={step.breath!}
          reducedMotion={reducedMotion}
          phaseLabel={
            breathPhase === "inhale"
              ? t("inhale")
              : breathPhase === "hold"
                ? t("hold")
                : breathPhase === "exhale"
                  ? t("exhale")
                  : null
          }
        />
      ) : null}

      {remainingSec != null ? (
        <p
          className="mt-6 font-display text-2xl font-semibold tabular-nums text-accent"
          aria-live="polite"
        >
          {timerComplete
            ? t("timerSeconds", { seconds: 0 })
            : t("timerSeconds", { seconds: remainingSec })}
        </p>
      ) : null}
    </div>
  );
}

function BreathVisual({
  phase,
  pattern,
  reducedMotion,
  phaseLabel,
}: {
  phase: BreathPhase | null;
  pattern: BreathPattern;
  reducedMotion: boolean;
  phaseLabel: string | null;
}) {
  const scale =
    phase === "inhale" ? 1.12 : phase === "hold" ? 1.08 : phase === "exhale" ? 0.92 : 1;
  const durationSec =
    phase === "inhale"
      ? pattern.inhale
      : phase === "hold"
        ? (pattern.hold ?? 0)
        : phase === "exhale"
          ? pattern.exhale
          : 1;

  return (
    <div className="mt-8 flex flex-col items-start gap-3">
      <div
        aria-hidden
        className="flex h-28 w-28 items-center justify-center rounded-full border border-accent/40 bg-accent-soft/50"
        style={
          reducedMotion
            ? undefined
            : {
                transform: `scale(${scale})`,
                transition: `transform ${Math.max(durationSec, 0.4)}s ease-in-out`,
              }
        }
      >
        <span className="h-14 w-14 rounded-full bg-accent/35" />
      </div>
      {phaseLabel ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          {phaseLabel}
        </p>
      ) : null}
    </div>
  );
}
