"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";

export function SessionRequestForm() {
  const t = useTranslations("sessions");
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = (await res.json()) as { error?: string };
      if (res.status === 403) {
        setError(t("errorForbidden"));
        return;
      }
      if (!res.ok) {
        setError(data.error ?? t("errorGeneric"));
        return;
      }
      setNotes("");
      setMessage(t("success"));
      router.refresh();
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-border bg-surface/80 p-6">
      <h2 className="font-display text-xl font-semibold">{t("formTitle")}</h2>
      <label className="block text-sm">
        <span className="text-muted">{t("notesLabel")}</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
          rows={4}
          placeholder={t("notesPlaceholder")}
          className="mt-2 w-full rounded-[var(--radius)] border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>
      <button
        type="submit"
        disabled={loading || !notes.trim()}
        className="rounded-[var(--radius)] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg disabled:opacity-50"
      >
        {loading ? "…" : t("submit")}
      </button>
      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </form>
  );
}
