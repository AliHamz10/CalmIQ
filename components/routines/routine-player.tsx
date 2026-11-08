"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { BreathPattern, RoutineDefinition } from "@/lib/routines";
import {
  RoutineStepView,
  type BreathPhase,
} from "@/components/routines/routine-step-view";

type Props = {
  routine: RoutineDefinition;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

function breathPhaseAt(elapsedSec: number, breath: BreathPattern): BreathPhase {
  const hold = breath.hold ?? 0;
  const cycle = breath.inhale + hold + breath.exhale;
  if (cycle <= 0) return "inhale";
  const pos = elapsedSec % cycle;
  if (pos < breath.inhale) return "inhale";
  if (pos < breath.inhale + hold) return "hold";
  return "exhale";
}

export function RoutinePlayer({ routine }: Props) {
  const t = useTranslations("routines");
  const reducedMotion = usePrefersReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finished, setFinished] = useState(false);
  const stepStartedAt = useRef<number | null>(null);

  const steps = routine.steps;
  const step = steps[stepIndex];
  const totalSteps = steps.length;
  const durationSec = step?.durationSec ?? null;
  const durationMs = durationSec != null ? durationSec * 1000 : null;
  const timerComplete =
    durationMs != null ? elapsedMs >= durationMs : false;
  const remainingSec =
    durationSec != null
      ? Math.max(0, Math.ceil((durationMs! - elapsedMs) / 1000))
      : null;
  const breathPhase =
    step?.kind === "breath" && step.breath
      ? breathPhaseAt(elapsedMs / 1000, step.breath)
      : null;

  useEffect(() => {
    setElapsedMs(0);
    stepStartedAt.current = performance.now();
  }, [stepIndex]);

  useEffect(() => {
    if (finished || durationMs == null || timerComplete) return;

    let frame = 0;
    let pausedAt: number | null = null;

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        pausedAt = performance.now();
        return;
      }
      if (pausedAt != null && stepStartedAt.current != null) {
        stepStartedAt.current += performance.now() - pausedAt;
        pausedAt = null;
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      if (document.visibilityState === "hidden") {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      const started = stepStartedAt.current ?? performance.now();
      const next = Math.min(performance.now() - started, durationMs);
      setElapsedMs(next);
      if (next < durationMs) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [durationMs, finished, stepIndex, timerComplete]);

  // Previously timed steps froze on "0s" with no advance — continue automatically.
  useEffect(() => {
    if (!timerComplete || finished) return;

    const id = window.setTimeout(() => {
      setStepIndex((current) => {
        if (current >= totalSteps - 1) {
          setFinished(true);
          return current;
        }
        return current + 1;
      });
    }, 900);

    return () => window.clearTimeout(id);
  }, [timerComplete, finished, stepIndex, totalSteps]);

  const progressValue = finished ? totalSteps : stepIndex + 1;

  function goBack() {
    if (finished) {
      setFinished(false);
      setStepIndex(totalSteps - 1);
      return;
    }
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function goNext() {
    if (finished) return;
    if (stepIndex >= totalSteps - 1) {
      setFinished(true);
      return;
    }
    setStepIndex((i) => i + 1);
  }

  const primaryLabel =
    stepIndex >= totalSteps - 1
      ? t("finish")
      : timerComplete
        ? t("continue")
        : t("next");

  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-10 sm:px-6 md:px-10 md:pb-16 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/routines"
          className="text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("backToList")}
        </Link>
        <p className="font-display text-base font-semibold text-primary sm:text-lg">
          {t(`items.${routine.slug}.title`)}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-border/70"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={progressValue}
          aria-label={t("progress", {
            current: progressValue,
            total: totalSteps,
          })}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{
              width: `${(progressValue / totalSteps) * 100}%`,
            }}
          />
        </div>
        <ol className="flex flex-wrap gap-1.5" aria-hidden>
          {steps.map((item, index) => {
            const complete = finished || index < stepIndex;
            const current = !finished && index === stepIndex;
            return (
              <li
                key={item.id}
                className={`h-1.5 flex-1 min-w-6 rounded-full transition-colors duration-300 ${
                  complete
                    ? "bg-accent"
                    : current
                      ? "bg-accent/55"
                      : "bg-border/80"
                }`}
              />
            );
          })}
        </ol>
      </div>

      <div className="mt-8 min-h-[18rem] border-y border-border py-8 sm:mt-10 sm:min-h-[16rem]">
        {finished || !step ? (
          <div
            className={
              reducedMotion
                ? "space-y-5"
                : "animate-rise space-y-5 motion-reduce:animate-none"
            }
          >
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              {t("doneEyebrow")}
            </p>
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              {t("doneTitle")}
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {t("doneBody")}
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <Link
                href={`/chat?routine=${routine.slug}`}
                className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-base font-semibold text-primary-fg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("chatCta")}
              </Link>
              <Link
                href="/routines"
                className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-border bg-surface/80 px-5 text-base font-semibold text-text transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("browseCta")}
              </Link>
            </div>
          </div>
        ) : (
          <RoutineStepView
            slug={routine.slug}
            step={step}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            remainingSec={remainingSec}
            durationSec={durationSec}
            elapsedMs={elapsedMs}
            breathPhase={breathPhase}
            timerComplete={timerComplete}
            reducedMotion={reducedMotion}
          />
        )}
      </div>

      {!finished ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/80 bg-surface/95 px-5 py-3 backdrop-blur-sm md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div className="mx-auto flex max-w-3xl flex-wrap gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="inline-flex min-h-12 min-w-[6.5rem] flex-1 items-center justify-center rounded-[var(--radius)] border border-border bg-surface/70 px-5 text-base font-semibold text-text transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-none"
            >
              {t("back")}
            </button>
            <button
              type="button"
              onClick={goNext}
              className={`inline-flex min-h-12 min-w-[7.5rem] flex-[1.4] items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-base font-semibold text-primary-fg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-none ${
                timerComplete && !reducedMotion ? "animate-rise" : ""
              }`}
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-12 min-w-[7rem] items-center justify-center rounded-[var(--radius)] border border-border bg-surface/70 px-5 text-base font-semibold text-text transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t("back")}
          </button>
        </div>
      )}

      <p className="mt-10 border-s-4 border-accent ps-4 text-sm leading-relaxed text-muted">
        {t("disclaimer")}
      </p>
    </div>
  );
}
