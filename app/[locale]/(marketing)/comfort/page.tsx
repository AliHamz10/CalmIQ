import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { listComfortGuides } from "@/lib/comfort";
import { ComfortList } from "@/components/comfort/comfort-list";

export default async function ComfortIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("comfort");
  const guides = listComfortGuides();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
      <h1 className="font-display text-4xl font-semibold text-text text-balance md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{t("support")}</p>
      <p className="mt-3 max-w-2xl text-base text-muted">
        <Link
          href="/routines"
          className="font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("routinesCta")}
        </Link>
      </p>
      <ComfortList guides={guides} />
    </section>
  );
}
