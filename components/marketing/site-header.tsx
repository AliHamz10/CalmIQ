"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";

const links = [
  { href: "/", key: "home" as const },
  { href: "/pricing", key: "pricing" as const },
  { href: "/about", key: "about" as const },
  { href: "/chat", key: "chat" as const },
  { href: "/sessions", key: "sessions" as const },
  { href: "/account", key: "account" as const },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const tMeta = useTranslations("meta");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-primary"
        >
          {tMeta("brand")}
        </Link>
        <nav
          className="hidden items-center gap-5 text-sm font-medium text-muted md:flex"
          aria-label="Primary"
        >
          {links.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "text-primary"
                    : "hover:text-text transition-colors"
                }
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/chat"
            className="hidden rounded-[var(--radius)] bg-primary px-3.5 py-2 text-sm font-semibold text-primary-fg sm:inline-flex"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
