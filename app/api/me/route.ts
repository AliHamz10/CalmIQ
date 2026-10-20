import { NextResponse } from "next/server";
import { getUserAccess } from "@/lib/auth";
import { canAccessPhysio } from "@/lib/entitlements";

export async function GET() {
  const access = await getUserAccess();
  return NextResponse.json({
    authenticated: Boolean(access.user),
    email: access.user?.email ?? null,
    plan: access.plan,
    canAccessPhysio: canAccessPhysio(access.plan),
    isDemo: access.user?.isDemo ?? !access.user,
  });
}
