import { setRequestLocale } from "next-intl/server";
import { isDemoMode } from "@/lib/auth";
import { LoginForm } from "@/components/ui/login-form";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoginForm demoOnly={isDemoMode()} />;
}
