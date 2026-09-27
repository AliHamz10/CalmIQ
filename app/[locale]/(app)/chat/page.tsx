import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getUserAccess, isDemoMode } from "@/lib/auth";
import { ChatPanel } from "@/components/chat/chat-panel";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("chat");
  const tNav = await getTranslations("nav");
  const { user, plan } = await getUserAccess();

  if (!user) {
    return (
      <section className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="text-lg text-muted">{t("signInRequired")}</p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg"
        >
          {tNav("login")}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-10 md:px-10">
      <ChatPanel
        plan={plan}
        demoMode={isDemoMode() || !process.env.OPENAI_API_KEY}
      />
    </section>
  );
}
