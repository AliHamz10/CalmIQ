import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      <section className="relative min-h-[calc(100vh-7.5rem)] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="animate-drift absolute -top-24 end-[-10%] h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl animate-soft-pulse" />
          <div className="absolute bottom-0 start-[-15%] h-[22rem] w-[22rem] rounded-full bg-primary/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f5c45' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-6xl flex-col justify-center px-6 py-16 md:px-10">
          <p className="animate-rise font-display text-5xl font-semibold tracking-tight text-primary md:text-7xl lg:text-8xl">
            {t("brand")}
          </p>
          <h1 className="animate-rise-delay mt-6 max-w-3xl font-display text-3xl font-medium leading-tight text-text text-balance md:text-5xl">
            {t("headline")}
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-xl text-lg text-muted md:text-xl">
            {t("support")}
          </p>
          <div className="animate-rise-delay-2 mt-10 flex flex-wrap items-center gap-4">
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
      </section>

      <section className="border-t border-border/70 bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
          <h2 className="font-display text-3xl font-semibold text-text text-balance md:text-4xl">
            {t("routinesTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            {t("routinesSupport")}
          </p>
          <Link
            href="/routines"
            className="mt-8 inline-flex items-center justify-center rounded-[var(--radius)] border border-border bg-surface px-6 py-3 text-base font-semibold text-text transition hover:bg-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t("routinesCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
