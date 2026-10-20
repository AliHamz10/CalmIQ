import { getTranslations } from "next-intl/server";
import { listPhysioClinics, PHYSIO_CITY } from "@/lib/physio";

/**
 * Below-fold Islamabad physio directory — independent clinics to call.
 * Mount after Routines / Comfort teasers; keep out of the hero.
 */
export async function PhysioDirectory() {
  const t = await getTranslations("home");
  const clinics = listPhysioClinics();

  return (
    <section
      aria-labelledby="home-physios-heading"
      className="relative overflow-hidden border-t border-border/80"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 420px at 85% 10%, var(--color-hero-glow), transparent 55%), linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-accent-soft) 35%, transparent) 100%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {t("physiosIndependent")}
        </p>
        <h2
          id="home-physios-heading"
          className="mt-3 font-display text-3xl font-semibold text-primary text-balance md:text-4xl"
        >
          {t("physiosTitle", { city: PHYSIO_CITY })}
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">{t("physiosSupport")}</p>

        <ul className="mt-10 grid gap-0 sm:grid-cols-1">
          {clinics.map((clinic, index) => (
            <li
              key={clinic.id}
              className="group border-t border-border/90 last:border-b"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <div className="flex flex-col gap-3 py-5 transition group-hover:bg-surface/50 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-1 md:py-6">
                <div className="min-w-0">
                  <p className="font-display text-xl font-semibold text-text md:text-2xl">
                    {clinic.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    <span className="text-accent/90">{clinic.area}</span>
                    <span aria-hidden className="mx-2 text-border">
                      ·
                    </span>
                    <span>{PHYSIO_CITY}</span>
                  </p>
                </div>

                <a
                  href={`tel:${clinic.phone}`}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-[var(--radius)] border border-primary/30 bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-w-[14rem]"
                  aria-label={`${t("physiosCall")} ${clinic.name}: ${clinic.displayPhone}`}
                >
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary-fg/80">
                    {t("physiosCall")}
                  </span>
                  <span className="tabular-nums tracking-wide">
                    {clinic.displayPhone}
                  </span>
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl text-sm text-muted">{t("physiosNote")}</p>
      </div>
    </section>
  );
}
