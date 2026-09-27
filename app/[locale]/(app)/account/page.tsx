import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getUserAccess } from "@/lib/auth";
import { AccountActions } from "@/components/ui/account-actions";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account");
  const { user, plan } = await getUserAccess();

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-muted">{t("signInPrompt")}</p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg"
        >
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-6 py-16 md:px-10">
      <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-8">
        <AccountActions
          email={user.email}
          plan={plan}
          isDemo={user.isDemo}
        />
      </div>
    </section>
  );
}
