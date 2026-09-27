import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
      <h1 className="font-display text-4xl font-semibold md:text-5xl text-balance">
        {t("title")}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">{t("body")}</p>
      <p className="mt-8 border-s-4 border-accent ps-4 text-sm text-muted">
        {t("disclaimer")}
      </p>
    </section>
  );
}
