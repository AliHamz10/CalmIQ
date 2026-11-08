"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">{t("notFound")}</h1>
      <p className="mt-3 text-muted">{t("loadFailed")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-[var(--radius)] border border-border px-5 py-2.5 text-sm font-semibold"
        >
          {t("tryAgain")}
        </button>
        <Link
          href="/"
          className="inline-flex rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg"
        >
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}
