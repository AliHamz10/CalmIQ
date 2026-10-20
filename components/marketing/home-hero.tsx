import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { VestCanvas } from "./vest-canvas";

/**
 * Brand-first home hero: CalmIq + headline + support + CTAs + dominant rotatable 3D vest.
 * Hero budget only — no cards, badges, or secondary marketing.
 */
export async function HomeHero() {
  const t = await getTranslations("home");

  return (
    <section className="relative min-h-[calc(100vh-7.5rem)] overflow-hidden">
      {/* Atmospheric wash — not the dominant visual */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -top-28 end-[-12%] h-[30rem] w-[30rem] rounded-full bg-accent/25 blur-3xl animate-soft-pulse" />
        <div className="absolute bottom-[-10%] start-[-18%] h-[24rem] w-[24rem] rounded-full bg-primary/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230a4f4a' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Dominant full-bleed vest plane — pointer events for orbit drag */}
      <div className="pointer-events-none absolute inset-y-0 end-0 z-0 w-full md:w-[58%] lg:w-[62%]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,var(--color-hero-glow),transparent_62%)]" />
        <div className="pointer-events-auto h-full w-full opacity-95 md:opacity-100">
          <VestCanvas label={t("vestLabel")} />
        </div>
      </div>

      {/* Readability scrim toward copy (logical start works in RTL) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-0 z-[1] w-full max-w-3xl bg-gradient-to-r from-[var(--color-bg)] from-25% via-[color-mix(in_oklab,var(--color-bg)_72%,transparent)] to-transparent rtl:bg-gradient-to-l md:w-[48%]"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-6xl flex-col justify-center px-6 py-16 md:px-10">
        <div className="pointer-events-none max-w-xl lg:max-w-2xl">
          <p className="animate-rise font-display text-5xl font-semibold tracking-tight text-primary md:text-7xl lg:text-8xl">
            {t("brand")}
          </p>
          <h1 className="animate-rise-delay mt-6 font-display text-3xl font-medium leading-tight text-text text-balance md:text-5xl">
            {t("headline")}
          </h1>
          <p className="animate-rise-delay-2 mt-5 text-lg text-muted md:text-xl">
            {t("support")}
          </p>
          <div className="animate-rise-delay-2 pointer-events-auto mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-[var(--radius)] bg-primary px-6 py-3 text-base font-semibold text-primary-fg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-[var(--radius)] border border-border bg-surface/70 px-6 py-3 text-base font-semibold text-text backdrop-blur transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
