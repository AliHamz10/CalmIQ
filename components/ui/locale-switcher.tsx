"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="sr-only">Language</span>
      <select
        className="rounded-[var(--radius)] border border-border bg-surface px-2 py-1.5 text-text"
        value={locale}
        onChange={(e) => {
          router.replace(pathname, { locale: e.target.value });
        }}
        aria-label="Language"
      >
        {routing.locales.map((code) => (
          <option key={code} value={code}>
            {code === "en" ? "EN" : "اردو"}
          </option>
        ))}
      </select>
    </label>
  );
}
