import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { listComfortGuides } from "@/lib/comfort";

/**
 * Below-fold home section. Agent D mounts this from the marketing home page —
 * keep the first viewport brand-first (no hero placement).
 */
export async function HomeComfortTeaser() {
  const tHome = await getTranslations("home");
  const tComfort = await getTranslations("comfort");
  const guides = listComfortGuides();

  return (
    <section
      aria-labelledby="home-comfort-heading"
      className="border-t border-border/80 bg-surface/25"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <h2
          id="home-comfort-heading"
          className="font-display text-3xl font-semibold text-primary text-balance md:text-4xl"
        >
          {tHome("comfortTitle")}
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          {tHome("comfortSupport")}
        </p>

        <ul className="mt-8 divide-y divide-border border-y border-border">
          {guides.map((guide) => {
            const minutes = Math.max(1, guide.estimatedMinutes);
            return (
              <li key={guide.slug}>
                <Link
                  href={`/comfort/${guide.slug}`}
                  className="flex flex-col gap-1 py-4 transition hover:bg-surface/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-1"
                >
                  <span className="font-display text-lg font-semibold text-text">
                    {tComfort(`items.${guide.slug}.title`)}
                  </span>
                  <span className="text-sm text-muted">
                    {tComfort("durationMinutes", { minutes })}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/comfort"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-border bg-surface/80 px-5 py-2.5 text-sm font-semibold text-text transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {tHome("comfortCta")}
        </Link>
      </div>
    </section>
  );
}
