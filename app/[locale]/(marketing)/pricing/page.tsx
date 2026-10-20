import { setRequestLocale } from "next-intl/server";
import { getUserAccess } from "@/lib/auth";
import { PricingBuySection } from "@/components/marketing/pricing-buy-section";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { user, plan } = await getUserAccess();

  return <PricingBuySection signedIn={Boolean(user)} plan={plan} />;
}
