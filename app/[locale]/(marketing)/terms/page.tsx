import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <h1 className="font-display text-3xl font-semibold">{t("termsTitle")}</h1>
      <p className="mt-6 text-muted leading-relaxed">{t("termsBody")}</p>
    </section>
  );
}
