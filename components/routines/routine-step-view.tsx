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
  durationSec: number | null;
  elapsedMs: number;
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
  durationSec,
  elapsedMs,
  breathPhase,
  timerComplete,
  reducedMotion,
}: Props) {
  const t = useTranslations("routines");
  const title = t(`items.${slug}.steps.${step.id}.title`);
  const body = t(`items.${slug}.steps.${step.id}.body`);
  const showBreathVisual = step.kind === "breath" && step.breath;
  const progressRatio =
    durationSec != null && durationSec > 0
      ? Math.min(1, elapsedMs / (durationSec * 1000))
      : null;

  return (
    <div
      key={step.id}
      className={
        reducedMotion
          ? "space-y-5"
          : "animate-rise space-y-5 motion-reduce:animate-none"
      }
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-sm font-medium text-muted">
          {t("progress", { current: stepIndex + 1, total: totalSteps })}
        </p>
        <span className="rounded-[var(--radius)] border border-border/80 bg-surface/70 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
          {t(`kinds.${step.kind}`)}
        </span>
      </div>

      <h2 className="font-display text-3xl font-semibold text-primary text-balance md:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {body}
      </p>

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

      {remainingSec != null && durationSec != null ? (
        <div className="space-y-3">
          <div
            className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-border/60"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={durationSec}
            aria-valuenow={Math.min(
              durationSec,
              Math.floor(elapsedMs / 1000),
            )}
            aria-label={
              timerComplete
                ? t("stepReady")
                : t("timerSeconds", { seconds: remainingSec })
            }
          >
            <div
              className={`h-full rounded-full bg-accent ${
                reducedMotion
                  ? ""
                  : "transition-[width] duration-200 ease-linear motion-reduce:transition-none"
              }`}
              style={{
                width: `${(progressRatio ?? 0) * 100}%`,
              }}
            />
          </div>
          <p
            className="font-display text-2xl font-semibold tabular-nums text-accent sm:text-3xl"
            aria-live="polite"
          >
            {timerComplete
              ? t("stepReady")
              : t("timerSeconds", { seconds: remainingSec })}
          </p>
          {timerComplete ? (
            <p className="text-sm text-muted">{t("autoAdvanceHint")}</p>
          ) : null}
        </div>
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
    phase === "inhale"
      ? 1.18
      : phase === "hold"
        ? 1.1
        : phase === "exhale"
          ? 0.86
          : 1;
  const durationSec =
    phase === "inhale"
      ? pattern.inhale
      : phase === "hold"
        ? (pattern.hold ?? 0)
        : phase === "exhale"
          ? pattern.exhale
          : 1;
  const ring =
    phase === "inhale"
      ? "border-accent/55 bg-accent-soft/70"
      : phase === "hold"
        ? "border-primary/40 bg-accent-soft/55"
        : "border-accent/35 bg-accent-soft/40";

  return (
    <div className="mt-2 flex flex-col items-center gap-4 sm:items-start">
      <div
        aria-hidden
        className={`relative flex h-36 w-36 items-center justify-center rounded-full border-2 sm:h-40 sm:w-40 ${ring}`}
        style={
          reducedMotion
            ? undefined
            : {
                transform: `scale(${scale})`,
                transition: `transform ${Math.max(durationSec, 0.35)}s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s ease, border-color 0.4s ease`,
              }
        }
      >
        <span
          className="h-16 w-16 rounded-full bg-accent/40 sm:h-[4.5rem] sm:w-[4.5rem]"
          style={
            reducedMotion
              ? undefined
              : {
                  transform: `scale(${phase === "exhale" ? 0.88 : phase === "inhale" ? 1.08 : 1})`,
                  transition: `transform ${Math.max(durationSec, 0.35)}s cubic-bezier(0.4, 0, 0.2, 1)`,
                }
          }
        />
      </div>
      {phaseLabel ? (
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
          {phaseLabel}
        </p>
      ) : null}
    </div>
  );
}
