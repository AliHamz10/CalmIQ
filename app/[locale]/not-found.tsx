import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("errors");
  return (
    <section className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">{t("notFound")}</h1>
      <p className="mt-3 text-muted">{t("notFoundBody")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg"
      >
        {t("backHome")}
      </Link>
    </section>
  );
}
