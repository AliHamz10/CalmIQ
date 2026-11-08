"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { ComfortGuide } from "@/lib/comfort";
import { ComfortSectionView } from "@/components/comfort/comfort-section-view";

type Props = {
  guide: ComfortGuide;
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

export function ComfortGuidePlayer({ guide }: Props) {
  const t = useTranslations("comfort");
  const reducedMotion = usePrefersReducedMotion();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const sections = guide.sections;
  const section = sections[sectionIndex];
  const totalSections = sections.length;
  const progressValue = finished ? totalSections : sectionIndex + 1;
  const isEscalate = guide.slug === "escalate";

  function goBack() {
    if (finished) {
      setFinished(false);
      setSectionIndex(totalSections - 1);
      return;
    }
    if (sectionIndex > 0) setSectionIndex((i) => i - 1);
  }

  function goNext() {
    if (finished) return;
    if (sectionIndex >= totalSections - 1) {
      setFinished(true);
      return;
    }
    setSectionIndex((i) => i + 1);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:px-10 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/comfort"
          className="text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("backToList")}
        </Link>
        <p className="font-display text-lg font-semibold text-primary">
          {t(`items.${guide.slug}.title`)}
        </p>
      </div>

      <div
        className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-border/70"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSections}
        aria-valuenow={progressValue}
        aria-label={t("progress", {
          current: progressValue,
          total: totalSections,
        })}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{
            width: `${(progressValue / totalSections) * 100}%`,
          }}
        />
      </div>

      <div className="mt-10 min-h-[16rem] border-y border-border py-8">
        {finished || !section ? (
          <div className={reducedMotion ? undefined : "animate-rise"}>
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              {t("doneTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
              {t("doneBody")}
            </p>
          </div>
        ) : (
          <ComfortSectionView
            slug={guide.slug}
            section={section}
            sectionIndex={sectionIndex}
            totalSections={totalSections}
            reducedMotion={reducedMotion}
          />
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={!finished && sectionIndex === 0}
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
            {sectionIndex >= totalSections - 1 ? t("finish") : t("next")}
          </button>
        ) : (
          <Link
            href={`/chat?comfort=${guide.slug}`}
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-base font-semibold text-primary-fg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t("chatCta")}
          </Link>
        )}
      </div>

      {finished ? (
        <div
          className={`mt-6 flex flex-wrap gap-3 ${reducedMotion ? "" : "animate-rise-delay"}`}
        >
          <Link
            href="/routines"
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-border bg-surface/70 px-5 text-base font-semibold text-text transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t("routinesCta")}
          </Link>
          {isEscalate ? (
            <>
              <Link
                href="/sessions"
                className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-accent/40 bg-accent-soft/40 px-5 text-base font-semibold text-primary transition hover:bg-accent-soft/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("sessionsCta")}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-border bg-surface/70 px-5 text-base font-semibold text-text transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("pricingCta")}
              </Link>
            </>
          ) : null}
        </div>
      ) : null}

      {!finished && isEscalate && section?.kind === "escalate" ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/sessions"
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-accent/40 bg-accent-soft/40 px-5 text-base font-semibold text-primary transition hover:bg-accent-soft/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t("sessionsCta")}
          </Link>
          <Link
            href="/pricing"
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-border bg-surface/70 px-5 text-base font-semibold text-text transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t("pricingCta")}
          </Link>
        </div>
      ) : null}

      <p className="mt-10 border-s-4 border-accent ps-4 text-sm leading-relaxed text-muted">
        {t("disclaimer")}
      </p>
    </div>
  );
}
