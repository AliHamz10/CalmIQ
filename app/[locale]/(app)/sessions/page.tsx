import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { cookies } from "next/headers";
import { getUserAccess, isDemoMode } from "@/lib/auth";
import { canAccessPhysio } from "@/lib/entitlements";
import { SessionRequestForm } from "@/components/sessions/session-request-form";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

type SessionRow = {
  id: string;
  status: string;
  notes: string | null;
  created_at: string;
  scheduled_at: string | null;
};

async function loadSessions(userId: string): Promise<SessionRow[]> {
  if (isDemoMode() || !isSupabaseConfigured()) {
    const jar = await cookies();
    const raw = jar.get("calmiq_demo_sessions")?.value;
    if (!raw) return [];
    try {
      return JSON.parse(decodeURIComponent(raw)) as SessionRow[];
    } catch {
      return [];
    }
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("physio_sessions")
    .select("id, status, notes, created_at, scheduled_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as SessionRow[] | null) ?? [];
}

export default async function SessionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sessions");
  const { user, plan } = await getUserAccess();

  if (!user) {
    return (
      <section className="mx-auto max-w-xl px-6 py-20 text-center">
        <Link
          href="/login"
          className="inline-flex rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg"
        >
          Sign in
        </Link>
      </section>
    );
  }

  if (!canAccessPhysio(plan)) {
    return (
      <section className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">{t("lockedTitle")}</h1>
        <p className="mt-4 text-muted">{t("lockedBody")}</p>
        <Link
          href="/pricing"
          className="mt-8 inline-flex rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg"
        >
          {t("upgradeCta")}
        </Link>
      </section>
    );
  }

  const sessions = await loadSessions(user.id);

  const statusLabel: Record<string, string> = {
    requested: t("statusRequested"),
    scheduled: t("statusScheduled"),
    completed: t("statusCompleted"),
    canceled: t("statusCanceled"),
  };

  return (
    <section className="mx-auto max-w-3xl space-y-10 px-6 py-12 md:px-10">
      <div>
        <h1 className="font-display text-4xl font-semibold">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("subtitle")}</p>
      </div>
      <SessionRequestForm />
      <div>
        <h2 className="font-display text-xl font-semibold">{t("listTitle")}</h2>
        {sessions.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{t("empty")}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="border border-border bg-surface/80 px-4 py-3 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-primary">
                    {statusLabel[s.status] ?? s.status}
                  </span>
                  <time className="text-muted">
                    {new Date(s.created_at).toLocaleDateString(locale)}
                  </time>
                </div>
                {s.notes ? (
                  <p className="mt-2 text-muted whitespace-pre-wrap">{s.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
