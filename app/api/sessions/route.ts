import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserAccess, isDemoMode } from "@/lib/auth";
import { canAccessPhysio } from "@/lib/entitlements";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

type SessionRow = {
  id: string;
  status: string;
  notes: string | null;
  created_at: string;
  scheduled_at: string | null;
};

export async function POST(req: Request) {
  const access = await getUserAccess();
  if (!access.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canAccessPhysio(access.plan)) {
    return NextResponse.json(
      { error: "Physiotherapist sessions require Calm+" },
      { status: 403 },
    );
  }

  const body = (await req.json()) as { notes?: string };
  const notes = (body.notes ?? "").trim();
  if (!notes) {
    return NextResponse.json({ error: "Notes required" }, { status: 400 });
  }

  if (isDemoMode() || !isSupabaseConfigured()) {
    const jar = await cookies();
    const raw = jar.get("calmiq_demo_sessions")?.value;
    let list: SessionRow[] = [];
    if (raw) {
      try {
        list = JSON.parse(decodeURIComponent(raw)) as SessionRow[];
      } catch {
        list = [];
      }
    }
    const row: SessionRow = {
      id: `demo_${Date.now()}`,
      status: "requested",
      notes,
      created_at: new Date().toISOString(),
      scheduled_at: null,
    };
    list = [row, ...list].slice(0, 20);
    const res = NextResponse.json({ session: row });
    res.cookies.set(
      "calmiq_demo_sessions",
      encodeURIComponent(JSON.stringify(list)),
      {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      },
    );
    return res;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("physio_sessions")
    .insert({
      user_id: access.user.id,
      notes,
      status: "requested",
    })
    .select("id, status, notes, created_at, scheduled_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ session: data });
}
