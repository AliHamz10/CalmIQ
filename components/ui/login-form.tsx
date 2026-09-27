"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export function LoginForm({ demoOnly }: { demoOnly: boolean }) {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onMagicLink(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (demoOnly || !isSupabaseConfigured()) {
        await fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, plan: "free" }),
        });
        router.push("/chat");
        router.refresh();
        return;
      }
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/api/auth/callback?next=/${locale}/chat`,
        },
      });
      if (authError) {
        setError(t("error"));
        return;
      }
      setSent(true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  async function onDemo() {
    setLoading(true);
    await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || "demo@calmiq.app", plan: "free" }),
    });
    router.push("/chat");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md space-y-6 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </div>
      <form onSubmit={onMagicLink} className="space-y-4">
        <label className="block text-sm">
          <span>{t("emailLabel")}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="mt-2 w-full rounded-[var(--radius)] border border-border bg-surface px-3 py-2.5 outline-none focus:border-accent"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[var(--radius)] bg-primary py-2.5 text-sm font-semibold text-primary-fg disabled:opacity-50"
        >
          {loading ? "…" : t("submit")}
        </button>
      </form>
      {sent ? <p className="text-sm text-success">{t("sent")}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="button"
        onClick={onDemo}
        className="w-full rounded-[var(--radius)] border border-border py-2.5 text-sm font-semibold"
      >
        {t("demoCta")}
      </button>
    </div>
  );
}
