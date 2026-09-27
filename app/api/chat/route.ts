import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { cookies } from "next/headers";
import { getUserAccess, isDemoMode } from "@/lib/auth";
import {
  FREE_CHAT_DAILY_LIMIT,
  canAccessPhysio,
  canUseChat,
} from "@/lib/entitlements";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export const maxDuration = 60;

const DEMO_USAGE_COOKIE = "calmiq_demo_chat_usage";

function buildSystemPrompt(canPhysio: boolean): string {
  return [
    "You are CalmIq, a calm wellness companion for movement and recovery education.",
    "You are NOT a licensed clinician. Do not diagnose, prescribe, or claim medical authority.",
    "Encourage safe habits, pacing, and seeking professional care for red-flag symptoms.",
    canPhysio
      ? "This user has Calm+ and can request a physiotherapist session in the Sessions area. Suggest that when hands-on care would help."
      : "This user is on Free. If they need a physiotherapist, gently suggest upgrading to Calm+ for session requests.",
    "Keep replies concise, warm, and practical. Match the user's language when they write in Urdu.",
  ].join(" ");
}

function looksUrdu(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function demoAdvice(userText: string, urdu: boolean): string {
  const t = userText.toLowerCase();
  if (urdu) {
    if (/کندھ|گردن|neck|shoulder/.test(userText) || /shoulder|neck/.test(t)) {
      return "ایک دو دن اوورہیڈ بوجھ کم رکھیں، کندھے کانوں سے دور رکھیں، اور آہستہ بازو کھولنے کی حرکات آزمائیں۔ رات کا درد یا بے حسی ہو تو پیشہ ور سے معائنہ کروائیں۔";
    }
    if (/کمر|پیٹھ|back|sit/.test(userText) || /back|sit/.test(t)) {
      return "دفتری اکڑن کے لیے ہر 30–45 منٹ کھڑے ہو کر چلیں، درد کی حد میں نرم کمر کی حرکات کریں، اور زبردستی اسٹریچ سے گریز کریں۔";
    }
    if (/گھٹن|زانو|knee/.test(userText) || /knee|squat/.test(t)) {
      return "بغیر تیز درد کے کلک اکثر مکینیکل شور ہوتا ہے — چند دن گہری اسکواٹ کم کریں اور سوجن یا کمزوری نوٹ کریں۔";
    }
    return "نرم رفتاری رکھیں، دیکھیں کون سی حرکت آرام دیتی یا بگاڑتی ہے، اور تیز درد کے باوجود زور نہ دیں۔";
  }

  if (/\bice\b|icing|cold pack/.test(t)) {
    return "Short icing sessions (about 10–15 minutes, cloth barrier) can help comfort early on; stop if skin gets too cold or numb. Pair with easy range-of-motion only if it stays comfortable.";
  }
  if (/ankle|sprain|twist/.test(t)) {
    return "For a recent twist: relative rest, gentle elevation when you can, and avoid testing it with sharp pivots. If swelling, bruising, or weight-bearing pain is significant, get it checked in person.";
  }
  if (/knee|squat|click/.test(t)) {
    return "Knee clicks without sharp pain are often mechanical noise — reduce deep-squat volume for a few days, keep walks easy, and note swelling or giving-way (those deserve a clinician look).";
  }
  if (/back|spine|sit/.test(t)) {
    return "For desk-related stiffness: stand and walk briefly every 30–45 minutes, try gentle pelvic tilts or cat-camel within a pain-free range, and avoid forcing end-range stretches.";
  }
  if (/shoulder|neck|desk/.test(t)) {
    return "Ease overhead load for a day or two, keep shoulders relaxed away from the ears, and try slow open-arm reaches. Persistent night pain or arm numbness needs a professional assessment.";
  }
  return "Try gentle pacing, note what movements ease or aggravate symptoms, and avoid pushing through sharp pain.";
}

function demoReply(userText: string, canPhysio: boolean): string {
  const urdu = looksUrdu(userText);
  const hint = canPhysio
    ? urdu
      ? "Calm+ کے ساتھ آپ سیشنز سے فزیوتھیراپسٹ سیشن کی درخواست کر سکتے ہیں۔"
      : "With Calm+, you can request a physiotherapist session from Sessions when you want hands-on help."
    : urdu
      ? "فزیوتھیراپسٹ سیشن کے لیے Calm+ میں اپگریڈ کریں۔"
      : "Upgrade to Calm+ if you want to request a physiotherapist session.";
  const snippet = userText.slice(0, 180) + (userText.length > 180 ? "…" : "");

  if (urdu) {
    return [
      "CalmIq کے ساتھ شیئر کرنے کا شکریہ۔",
      snippet ? `میں نے سنا: “${snippet}”.` : "جب آپ بتائیں گے کیا ہو رہا ہے، میں یہاں ہوں۔",
      "یہ صرف تعلیمی رہنمائی ہے — میں طبی پیشہ ور نہیں۔ شدید، اچانک، یا بگڑتی علامات پر فوری طبی مدد لیں۔",
      demoAdvice(userText, true),
      hint,
    ].join("\n\n");
  }

  return [
    "Thanks for sharing that with CalmIq.",
    snippet
      ? `I heard: “${snippet}”.`
      : "I'm here when you want to describe what's going on.",
    "I'm educational support only — not a clinician. For severe, sudden, or worsening symptoms, seek urgent care.",
    demoAdvice(userText, false),
    hint,
  ].join("\n\n");
}

function extractLastUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.parts?.length) return "";
  return lastUser.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

async function demoStreamResponse(
  messages: UIMessage[],
  canPhysio: boolean,
): Promise<Response> {
  const text = demoReply(extractLastUserText(messages) || "hello", canPhysio);
  const words = text.split(/(\s+)/).filter(Boolean);

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const id = `text_${Date.now()}`;
      writer.write({ type: "text-start", id });
      for (const word of words) {
        writer.write({ type: "text-delta", id, delta: word });
        await new Promise((r) => setTimeout(r, 10));
      }
      writer.write({ type: "text-end", id });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

async function checkAndIncrementUsage(
  userId: string,
  plan: "free" | "calm_plus",
): Promise<{ allowed: boolean; count: number }> {
  if (plan === "calm_plus") {
    return { allowed: true, count: 0 };
  }

  const today = new Date().toISOString().slice(0, 10);

  if (isDemoMode() || !isSupabaseConfigured()) {
    const jar = await cookies();
    const raw = jar.get(DEMO_USAGE_COOKIE)?.value;
    let day = today;
    let count = 0;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { day?: string; count?: number };
        day = parsed.day ?? today;
        count = parsed.count ?? 0;
        if (day !== today) {
          day = today;
          count = 0;
        }
      } catch {
        count = 0;
      }
    }
    if (count >= FREE_CHAT_DAILY_LIMIT) {
      return { allowed: false, count };
    }
    count += 1;
    // Cookie set on the response happens in route via headers below — store on jar for demo.
    jar.set(DEMO_USAGE_COOKIE, JSON.stringify({ day, count }), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
    return { allowed: true, count };
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("chat_usage")
      .select("message_count")
      .eq("user_id", userId)
      .eq("day", today)
      .maybeSingle();
    const current = data?.message_count ?? 0;
    if (current >= FREE_CHAT_DAILY_LIMIT) {
      return { allowed: false, count: current };
    }
    await supabase.from("chat_usage").upsert(
      {
        user_id: userId,
        day: today,
        message_count: current + 1,
      },
      { onConflict: "user_id,day" },
    );
    return { allowed: true, count: current + 1 };
  } catch {
    // Don't block chat if usage table isn't migrated yet.
    return { allowed: true, count: 0 };
  }
}

export async function POST(req: Request) {
  const access = await getUserAccess();
  if (!access.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!canUseChat(access.plan)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let messages: UIMessage[] = [];
  try {
    const body = (await req.json()) as { messages?: UIMessage[] };
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const usage = await checkAndIncrementUsage(access.user.id, access.plan);
  if (!usage.allowed) {
    return new Response(
      JSON.stringify({
        error: "Free plan daily chat limit reached",
        code: "RATE_LIMITED",
        limit: FREE_CHAT_DAILY_LIMIT,
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const canPhysio = canAccessPhysio(access.plan);

  if (!process.env.OPENAI_API_KEY) {
    return demoStreamResponse(messages, canPhysio);
  }

  try {
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: buildSystemPrompt(canPhysio),
      messages: await convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[chat] streamText failed, falling back to demo", err);
    return demoStreamResponse(messages, canPhysio);
  }
}
