"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";

const links = [
  { href: "/", key: "home" as const },
  { href: "/pricing", key: "pricing" as const },
  { href: "/about", key: "about" as const },
  { href: "/routines", key: "routines" as const },
  { href: "/chat", key: "chat" as const },
  { href: "/sessions", key: "sessions" as const },
  { href: "/account", key: "account" as const },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const tMeta = useTranslations("meta");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [canPhysio, setCanPhysio] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data: { canAccessPhysio?: boolean }) => {
        if (!cancelled) setCanPhysio(Boolean(data.canAccessPhysio));
      })
      .catch(() => {
        if (!cancelled) setCanPhysio(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function labelFor(key: (typeof links)[number]["key"]) {
    if (key === "sessions" && canPhysio === false) {
      return t("sessionsLocked");
    }
    return t(key);
  }

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
                {labelFor(item.key)}
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
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[var(--radius)] border border-border px-2.5 py-2 text-sm md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 bg-text" />
              <span className="block h-0.5 w-4 bg-text" />
              <span className="block h-0.5 w-4 bg-text" />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-border/70 bg-surface px-6 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-2 text-sm font-medium text-muted">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-[var(--radius)] px-2 py-2 hover:bg-bg hover:text-text"
                >
                  {labelFor(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/chat"
                className="mt-1 inline-flex rounded-[var(--radius)] bg-primary px-3.5 py-2 text-primary-fg"
              >
                {t("cta")}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
