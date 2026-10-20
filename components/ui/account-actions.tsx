"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import type { PlanId } from "@/lib/entitlements";

type Props = {
  email: string;
  plan: PlanId;
  isDemo: boolean;
};

export function AccountActions({ email, plan, isDemo }: Props) {
  const t = useTranslations("account");
  const router = useRouter();

  async function setDemoPlan(next: PlanId) {
    await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, plan: next }),
    });
    router.refresh();
  }

  async function openPortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = (await res.json()) as { url?: string; demo?: boolean };
    if (data.demo) {
      router.push("/pricing");
      return;
    }
    if (data.url) window.location.href = data.url;
  }

  async function signOut() {
    if (isDemo) {
      await fetch("/api/demo", {
        method: "DELETE",
      });
      router.push("/");
      router.refresh();
      return;
    }
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-muted">{t("email")}</dt>
          <dd className="font-medium">{email}</dd>
        </div>
        <div>
          <dt className="text-muted">{t("plan")}</dt>
          <dd className="font-medium text-primary">
            {plan === "calm_plus" ? t("planPaid") : t("planFree")}
          </dd>
        </div>
      </dl>

      {!isDemo ? (
        <button
          type="button"
          onClick={openPortal}
          className="rounded-[var(--radius)] border border-border px-4 py-2 text-sm font-semibold"
        >
          {t("manageBilling")}
        </button>
      ) : (
        <div className="space-y-3 rounded-[var(--radius)] border border-accent/40 bg-accent-soft/40 p-4">
          <p className="text-sm text-muted">{t("demoNotice")}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDemoPlan("free")}
              className="rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-sm"
            >
              {t("simulateFree")}
            </button>
            <button
              type="button"
              onClick={() => setDemoPlan("calm_plus")}
              className="rounded-[var(--radius)] bg-primary px-3 py-2 text-sm text-primary-fg"
            >
              {t("simulatePaid")}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={signOut}
        className="block text-sm text-danger underline"
      >
        Sign out
      </button>
    </div>
  );
}
