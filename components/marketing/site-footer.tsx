import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tMeta = await getTranslations("meta");

  return (
    <footer className="border-t border-border/70 bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <p className="font-display text-lg font-semibold text-primary">
            {tMeta("brand")}
          </p>
          <p className="mt-1 text-sm text-muted">{t("rights")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <Link href="/privacy" className="hover:text-text">
            {t("privacy")}
          </Link>
          <Link href="/terms" className="hover:text-text">
            {t("terms")}
          </Link>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
