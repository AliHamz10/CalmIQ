import { NextResponse } from "next/server";
import {
  DEMO_PLAN_COOKIE,
  DEMO_USER_COOKIE,
  type AuthUser,
} from "@/lib/auth";
import type { PlanId } from "@/lib/entitlements";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string; plan?: PlanId };
  const email = (body.email || "demo@calmiq.app").trim().toLowerCase();
  const plan: PlanId = body.plan === "calm_plus" ? "calm_plus" : "free";

  const res = NextResponse.json({
    ok: true,
    user: { id: "demo-user", email, isDemo: true } satisfies Partial<AuthUser>,
    plan,
  });

  res.cookies.set(DEMO_USER_COOKIE, email, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  res.cookies.set(DEMO_PLAN_COOKIE, plan, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_USER_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(DEMO_PLAN_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set("calmiq_demo_sessions", "", { path: "/", maxAge: 0 });
  return res;
}
