import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { RoutineDefinition } from "@/lib/routines";

type Props = {
  routines: readonly RoutineDefinition[];
};

export async function RoutineList({ routines }: Props) {
  const t = await getTranslations("routines");

  return (
    <ul className="mt-10 divide-y divide-border border-y border-border">
      {routines.map((routine) => {
        const minutes = Math.max(1, Math.round(routine.estimatedSec / 60));
        return (
          <li key={routine.slug}>
            <Link
              href={`/routines/${routine.slug}`}
              className="group flex flex-col gap-2 py-6 transition hover:bg-surface/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-2"
            >
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold text-primary group-hover:text-accent">
                  {t(`items.${routine.slug}.title`)}
                </p>
                <p className="mt-1 text-muted">
                  {t(`items.${routine.slug}.intent`)}
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
