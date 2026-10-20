import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getUserAccess } from "@/lib/auth";
import { CheckoutButton } from "@/components/ui/checkout-button";
import { PricingVestStage } from "@/components/marketing/pricing-vest-stage";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const { user, plan } = await getUserAccess();

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-text md:text-5xl text-balance">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
        <p className="mt-3 text-sm font-medium text-accent">{t("physioNote")}</p>
      </div>

      <div className="mt-12 grid items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.95fr)] lg:gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.9fr)]">
        <div className="grid gap-8 md:grid-cols-2">
          <article className="border border-border bg-surface/80 p-8 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-2xl font-semibold text-primary">
              {t("freeName")}
            </h2>
            <p className="mt-2 font-display text-4xl font-semibold">
              {t("freePrice")}
            </p>
            <p className="mt-3 text-muted">{t("freeDesc")}</p>
            <ul className="mt-6 space-y-2 text-sm text-text">
              <li>{t("freeFeature1")}</li>
              <li>{t("freeFeature2")}</li>
              <li>{t("freeFeature3")}</li>
            </ul>
            <Link
              href={user ? "/chat" : "/login"}
              className="mt-8 inline-flex rounded-[var(--radius)] border border-border px-5 py-2.5 text-sm font-semibold hover:bg-bg"
            >
              {t("ctaFree")}
            </Link>
          </article>

          <article className="border border-primary/40 bg-primary text-primary-fg p-8 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-2xl font-semibold">
              {t("paidName")}
            </h2>
            <p className="mt-2 font-display text-4xl font-semibold">
              {t("paidPrice")}
              <span className="ms-1 text-base font-normal opacity-80">
                {t("paidPeriod")}
              </span>
            </p>
            <p className="mt-3 opacity-90">{t("paidDesc")}</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>{t("paidFeature1")}</li>
              <li>{t("paidFeature2")}</li>
              <li>{t("paidFeature3")}</li>
            </ul>
            {plan === "calm_plus" ? (
              <Link
                href="/sessions"
                className="mt-8 inline-flex rounded-[var(--radius)] bg-surface px-5 py-2.5 text-sm font-semibold text-primary"
              >
                {t("ctaPaid")}
              </Link>
            ) : (
              <CheckoutButton
                label={t("ctaPaid")}
                signedIn={Boolean(user)}
                className="mt-8 inline-flex rounded-[var(--radius)] bg-surface px-5 py-2.5 text-sm font-semibold text-primary"
              />
            )}
          </article>
        </div>

        {/* Vest + human — reuses VestCanvas / VestScene; calm+ buy context */}
        <div className="order-first min-h-[16rem] lg:order-none lg:min-h-full">
          <PricingVestStage label={t("vestLabel")} />
        </div>
      </div>
    </section>
  );
}
