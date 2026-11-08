import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { planFromStripePriceId } from "@/lib/stripe/plans";
import {
  createServiceRoleClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

async function upsertSubscription(params: {
  userId: string;
  customerId: string;
  subscriptionId: string;
  planId: string;
  status: string;
  currentPeriodEnd: string | null;
}) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.info("[stripe webhook] supabase not configured; skipped upsert", params);
    return;
  }
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: params.userId,
      stripe_customer_id: params.customerId,
      stripe_subscription_id: params.subscriptionId,
      plan_id: params.planId,
      status: params.status,
      current_period_end: params.currentPeriodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) {
    console.error("[stripe webhook] upsert failed", error);
    throw error;
  }
}

function periodEnd(sub: Stripe.Subscription): string | null {
  const end = sub.items.data[0]?.current_period_end ?? null;
  return end ? new Date(end * 1000).toISOString() : null;
}

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Missing webhook signature configuration" },
      { status: 400 },
    );
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          session.client_reference_id ||
          session.metadata?.user_id ||
          undefined;
        if (!userId || !session.subscription || !session.customer) break;

        const subscription = await stripe.subscriptions.retrieve(
          String(session.subscription),
        );
        const priceId = subscription.items.data[0]?.price.id;
        await upsertSubscription({
          userId,
          customerId: String(session.customer),
          subscriptionId: subscription.id,
          planId: planFromStripePriceId(priceId),
          status: subscription.status,
          currentPeriodEnd: periodEnd(subscription),
        });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        const customerId = String(subscription.customer);
        let resolvedUserId = userId;

        if (!resolvedUserId && isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const supabase = createServiceRoleClient();
          const { data } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_customer_id", customerId)
            .maybeSingle();
          resolvedUserId = data?.user_id;
        }

        if (!resolvedUserId) break;

        const priceId = subscription.items.data[0]?.price.id;
        const planId =
          event.type === "customer.subscription.deleted"
            ? "free"
            : planFromStripePriceId(priceId);

        await upsertSubscription({
          userId: resolvedUserId,
          customerId,
          subscriptionId: subscription.id,
          planId,
          status:
            event.type === "customer.subscription.deleted"
              ? "canceled"
              : subscription.status,
          currentPeriodEnd: periodEnd(subscription),
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler error", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
