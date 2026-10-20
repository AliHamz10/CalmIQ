import type { PlanId, SubscriptionStatus } from "@/lib/entitlements";
import { resolvePlan } from "@/lib/entitlements";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const DEMO_PLAN_COOKIE = "calmiq_demo_plan";
export const DEMO_USER_COOKIE = "calmiq_demo_user";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
  isDemo: boolean;
};

export type UserAccess = {
  user: AuthUser | null;
  plan: PlanId;
  status: SubscriptionStatus;
};

export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

export async function getDemoAccess(): Promise<UserAccess> {
  const jar = await cookies();
  const planCookie = jar.get(DEMO_PLAN_COOKIE)?.value;
  const userCookie = jar.get(DEMO_USER_COOKIE)?.value;
  const plan: PlanId = planCookie === "calm_plus" ? "calm_plus" : "free";

  if (!userCookie) {
    return { user: null, plan: "free", status: "none" };
  }

  return {
    user: {
      id: "demo-user",
      email: userCookie,
      displayName: userCookie.split("@")[0] ?? "Demo",
      isDemo: true,
    },
    plan,
    status: plan === "calm_plus" ? "active" : "none",
  };
}

export async function getUserAccess(): Promise<UserAccess> {
  if (!isSupabaseConfigured()) {
    return getDemoAccess();
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, plan: "free", status: "none" };
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan_id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    const status = (sub?.status as SubscriptionStatus | undefined) ?? "none";
    const plan = resolvePlan(sub?.plan_id, status);

    return {
      user: {
        id: user.id,
        email: user.email ?? "",
        displayName:
          (user.user_metadata?.display_name as string | undefined) ?? null,
        isDemo: false,
      },
      plan,
      status,
    };
  } catch {
    return getDemoAccess();
  }
}
