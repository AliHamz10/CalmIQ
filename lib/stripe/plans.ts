import type { PlanId } from "@/lib/entitlements";

export type StripePlanConfig = {
  planId: PlanId;
  priceEnvVar: string;
  name: string;
};

/** Maps Stripe Price IDs (from env) to CalmIq plan ids. */
export const PAID_PLAN: StripePlanConfig = {
  planId: "calm_plus",
  priceEnvVar: "STRIPE_PRICE_CALM_PLUS",
  name: "Calm+",
};

export function getCalmPlusPriceId(): string | null {
  return process.env.STRIPE_PRICE_CALM_PLUS ?? null;
}

export function planFromStripePriceId(priceId: string | undefined): PlanId {
  const calmPlus = getCalmPlusPriceId();
  if (calmPlus && priceId === calmPlus) {
    return "calm_plus";
  }
  return "free";
}
