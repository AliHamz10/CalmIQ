import { NextResponse } from "next/server";
import { getUserAccess, isDemoMode } from "@/lib/auth";
import { getAppUrl, getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export async function POST() {
  const access = await getUserAccess();
  if (!access.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured() || isDemoMode()) {
    return NextResponse.json({ demo: true });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ demo: true });
  }

  const supabase = await createClient();
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", access.user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No Stripe customer on file" },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${getAppUrl()}/en/account`,
  });

  return NextResponse.json({ url: portal.url });
}
