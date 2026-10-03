"use client";

import { useEffect, useState } from "react";
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

function breathPhaseAt(elapsed: number, breath: BreathPattern): BreathPhase {
  const hold = breath.hold ?? 0;
  const cycle = breath.inhale + hold + breath.exhale;
  if (cycle <= 0) return "inhale";
  const pos = elapsed % cycle;
  if (pos < breath.inhale) return "inhale";
  if (pos < breath.inhale + hold) return "hold";
  return "exhale";
}

export function RoutinePlayer({ routine }: Props) {
  const t = useTranslations("routines");
  const reducedMotion = usePrefersReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);

  const steps = routine.steps;
  const step = steps[stepIndex];
  const totalSteps = steps.length;
  const durationSec = step?.durationSec ?? null;
  const timerComplete =
    durationSec != null ? elapsed >= durationSec : false;
  const remainingSec =
    durationSec != null ? Math.max(0, durationSec - elapsed) : null;
  const breathPhase =
    step?.kind === "breath" && step.breath
      ? breathPhaseAt(elapsed, step.breath)
      : null;

  useEffect(() => {
    setElapsed(0);
  }, [stepIndex]);

  useEffect(() => {
    if (finished || durationSec == null || timerComplete) return;

    const id = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setElapsed((prev) => Math.min(prev + 1, durationSec));
    }, 1000);

    return () => window.clearInterval(id);
  }, [durationSec, finished, stepIndex, timerComplete]);

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

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:px-10 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/routines"
          className="text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("backToList")}
        </Link>
        <p className="font-display text-lg font-semibold text-primary">
          {t(`items.${routine.slug}.title`)}
        </p>
      </div>

      <div
        className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-border/70"
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

      <div className="mt-10 min-h-[16rem] border-y border-border py-8">
        {finished || !step ? (
          <div className={reducedMotion ? undefined : "animate-rise"}>
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              {t("doneTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
              {t("doneBody")}
            </p>
          </div>
        ) : (
          <RoutineStepView
            slug={routine.slug}
            step={step}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            remainingSec={remainingSec}
            breathPhase={breathPhase}
            timerComplete={timerComplete}
            reducedMotion={reducedMotion}
          />
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={!finished && stepIndex === 0}
          className="inline-flex min-h-12 min-w-[7rem] items-center justify-center rounded-[var(--radius)] border border-border bg-surface/70 px-5 text-base font-semibold text-text transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("back")}
        </button>
        {!finished ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-12 min-w-[7rem] items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-base font-semibold text-primary-fg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {stepIndex >= totalSteps - 1 ? t("finish") : t("next")}
          </button>
        ) : (
          <Link
            href={`/chat?routine=${routine.slug}`}
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-base font-semibold text-primary-fg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t("chatCta")}
          </Link>
        )}
      </div>

      <p className="mt-10 border-s-4 border-accent ps-4 text-sm leading-relaxed text-muted">
        {t("disclaimer")}
      </p>
    </div>
  );
}
