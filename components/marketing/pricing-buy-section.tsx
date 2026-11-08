import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { CheckoutButton } from "@/components/ui/checkout-button";
import { PricingVestStage } from "./pricing-vest-stage";

type PricingBuySectionProps = {
  signedIn: boolean;
  plan: string;
};

/**
 * Brand-first Calm+ buy composition beside the image vest stage
 * (worn person by default + product rotate with red wiring). Desktop:
 * copy at logical start, vest at logical end (RTL-safe grid).
 */
export async function PricingBuySection({
  signedIn,
  plan,
}: PricingBuySectionProps) {
  const t = await getTranslations("pricing");

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -top-24 end-[-10%] h-[30rem] w-[30rem] rounded-full bg-[color-mix(in_oklab,var(--color-vest-fabric)_20%,transparent)] blur-3xl animate-soft-pulse" />
        <div className="absolute bottom-[-12%] start-[-16%] h-[22rem] w-[22rem] rounded-full bg-primary/14 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230a4f4a' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-7.5rem)] max-w-6xl items-center gap-6 px-6 py-10 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-10 md:gap-y-6 md:px-10 md:py-16 lg:gap-x-14 lg:py-20">
        {/* Offer block — logical start */}
        <div className="relative z-10 max-w-xl justify-self-start md:col-start-1 md:row-start-1 lg:max-w-2xl">
          <p className="animate-rise font-display text-5xl font-semibold tracking-tight text-primary md:text-7xl">
            {t("brand")}
          </p>
          <h1 className="animate-rise-delay mt-5 font-display text-3xl font-medium leading-tight text-text text-balance md:text-5xl">
            {t("buyTitle")}
          </h1>
          <p className="animate-rise-delay-2 mt-4 text-lg text-muted md:text-xl">
            {t("buySupport")}
          </p>

          <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="font-display text-4xl font-semibold text-primary md:text-5xl">
              {t("paidPrice")}
            </p>
            <span className="text-base text-muted">{t("paidPeriod")}</span>
          </div>

          <p className="mt-3 text-sm font-medium text-accent">{t("physioNote")}</p>
        </div>

        {/* Person-in-vest — end column, spans both rows on desktop; after offer on mobile */}
        <div className="relative h-[min(42vh,22rem)] w-full md:col-start-2 md:row-span-2 md:row-start-1 md:h-[min(70vh,36rem)] lg:h-[min(78vh,40rem)]">
          <PricingVestStage label={t("vestLabel")} />
        </div>

        {/* Features + CTAs — under offer on desktop; follow vest on mobile */}
        <div className="relative z-10 max-w-xl justify-self-start md:col-start-1 md:row-start-2 lg:max-w-2xl">
          <ul className="space-y-2.5 text-base text-text">
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-vest-accent)]"
              />
              {t("paidFeature1")}
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-vest-accent)]"
              />
              {t("paidFeature2")}
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-vest-accent)]"
              />
              {t("paidFeature3")}
            </li>
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {plan === "calm_plus" ? (
              <Link
                href="/sessions"
                className="inline-flex items-center justify-center rounded-[var(--radius)] bg-primary px-6 py-3 text-base font-semibold text-primary-fg shadow-[0_12px_28px_rgba(12,82,74,0.22)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("ctaPaid")}
              </Link>
            ) : (
              <CheckoutButton
                label={t("ctaPaid")}
                signedIn={signedIn}
                className="inline-flex items-center justify-center rounded-[var(--radius)] bg-primary px-6 py-3 text-base font-semibold text-primary-fg shadow-[0_12px_28px_rgba(12,82,74,0.22)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-70"
              />
            )}
            <Link
              href={signedIn ? "/chat" : "/login"}
              className="inline-flex items-center justify-center rounded-[var(--radius)] border border-border bg-surface/75 px-6 py-3 text-base font-semibold text-text backdrop-blur transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("ctaFree")}
            </Link>
          </div>

          <p className="mt-6 max-w-md text-sm text-muted">{t("freeAside")}</p>
        </div>
      </div>
    </section>
  );
}
