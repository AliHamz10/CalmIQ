import { getTranslations, setRequestLocale } from "next-intl/server";
import { listRoutines } from "@/lib/routines";
import { RoutineList } from "@/components/routines/routine-list";

export default async function RoutinesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("routines");
  const routines = listRoutines();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
      <h1 className="font-display text-4xl font-semibold text-text text-balance md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{t("support")}</p>
      <RoutineList routines={routines} />
    </section>
  );
}
