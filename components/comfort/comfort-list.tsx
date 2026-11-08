import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { ComfortGuide } from "@/lib/comfort";

type Props = {
  guides: readonly ComfortGuide[];
};

export async function ComfortList({ guides }: Props) {
  const t = await getTranslations("comfort");

  return (
    <ul className="mt-10 divide-y divide-border border-y border-border">
      {guides.map((guide) => {
        const minutes = Math.max(1, guide.estimatedMinutes);
        return (
          <li key={guide.slug}>
            <Link
              href={`/comfort/${guide.slug}`}
              className="group flex flex-col gap-2 py-6 transition hover:bg-surface/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-2"
            >
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold text-primary group-hover:text-accent">
                  {t(`items.${guide.slug}.title`)}
                </p>
                <p className="mt-1 text-muted">
                  {t(`items.${guide.slug}.intent`)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="text-sm text-muted">
                  {t("durationMinutes", { minutes })}
                </span>
                <span className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius)] bg-primary px-4 text-sm font-semibold text-primary-fg transition group-hover:brightness-110">
                  {t("open")}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
