import { NextResponse } from "next/server";
import { getUserAccess, isDemoMode } from "@/lib/auth";
import { getAppUrl, getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { getCalmPlusPriceId } from "@/lib/stripe/plans";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export async function POST() {
  const access = await getUserAccess();
  if (!access.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured() || isDemoMode()) {
    return NextResponse.json({ demo: true });
  }

  const priceId = getCalmPlusPriceId();
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PRICE_CALM_PLUS is not set" },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  const appUrl = getAppUrl();

  let customerId: string | undefined;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", access.user.id)
      .maybeSingle();
    customerId = sub?.stripe_customer_id ?? undefined;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    customer_email: customerId ? undefined : access.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/en/account?checkout=success`,
    cancel_url: `${appUrl}/en/pricing?checkout=cancel`,
    client_reference_id: access.user.id,
    metadata: { user_id: access.user.id },
    subscription_data: {
      metadata: { user_id: access.user.id },
    },
  });

  return NextResponse.json({ url: session.url });
}
