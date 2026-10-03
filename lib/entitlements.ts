export type PlanId = "free" | "calm_plus";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "unpaid"
  | "none";

export function canAccessPhysio(plan: PlanId): boolean {
  return plan === "calm_plus";
}

export function canUseChat(_plan: PlanId): boolean {
  return true;
}

/** Free tier soft limit — enforced server-side when usage table exists. */
export const FREE_CHAT_DAILY_LIMIT = 20;

export function isPaidStatus(status: SubscriptionStatus): boolean {
  return status === "active" || status === "trialing";
}

export function resolvePlan(
  planId: string | null | undefined,
  status: SubscriptionStatus = "none",
): PlanId {
  if (planId === "calm_plus" && isPaidStatus(status)) {
    return "calm_plus";
  }
  return "free";
}
