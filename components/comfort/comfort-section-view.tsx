"use client";

import { useTranslations } from "next-intl";
import type { ComfortSection, ComfortSlug } from "@/lib/comfort";

type Props = {
  slug: ComfortSlug;
  section: ComfortSection;
  sectionIndex: number;
  totalSections: number;
  reducedMotion: boolean;
};

export function ComfortSectionView({
  slug,
  section,
  sectionIndex,
  totalSections,
  reducedMotion,
}: Props) {
  const t = useTranslations("comfort");
  const title = t(`items.${slug}.sections.${section.id}.title`);
  const body = t(`items.${slug}.sections.${section.id}.body`);

  return (
    <div
      key={section.id}
      className={reducedMotion ? undefined : "animate-rise"}
      aria-live="polite"
    >
      <p className="text-sm font-medium text-muted">
        {t("progress", {
          current: sectionIndex + 1,
          total: totalSections,
        })}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-primary text-balance md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{body}</p>

      {section.suggestedMinutes != null && section.suggestedMinutes > 0 ? (
        <p className="mt-6 text-sm font-semibold text-accent">
          {t("suggestedMinutes", { minutes: section.suggestedMinutes })}
        </p>
      ) : null}
    </div>
  );
}
