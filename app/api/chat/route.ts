import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { getUserAccess } from "@/lib/auth";
import { canAccessPhysio, canUseChat } from "@/lib/entitlements";

export const maxDuration = 60;

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

function demoAdvice(userText: string): string {
  const t = userText.toLowerCase();
  if (/ankle|sprain|twist/.test(t)) {
    return "For a recent twist: relative rest, gentle elevation when you can, and avoid testing it with sharp pivots. If swelling, bruising, or weight-bearing pain is significant, get it checked in person.";
  }
  if (/\bice\b|icing|cold pack/.test(t)) {
    return "Short icing sessions (about 10–15 minutes, cloth barrier) can help comfort early on; stop if skin gets too cold or numb. Pair with easy range-of-motion only if it stays comfortable.";
  }
  if (/knee|squat|click/.test(t)) {
    return "Knee clicks without sharp pain are often mechanical noise — reduce deep-squat volume for a few days, keep walks easy, and note swelling or giving-way (those deserve a clinician look).";
  }
  if (/back|spine|sit/.test(t)) {
    return "For desk-related stiffness: stand and walk briefly every 30–45 minutes, try gentle pelvic tilts or cat-camel within a pain-free range, and avoid forcing end-range stretches.";
  }
  if (/shoulder|neck|desk/.test(t) || /کندھ/.test(userText)) {
    return "Ease overhead load for a day or two, keep shoulders relaxed away from the ears, and try slow open-arm reaches. Persistent night pain or arm numbness needs a professional assessment.";
  }
  return "Try gentle pacing, note what movements ease or aggravate symptoms, and avoid pushing through sharp pain.";
}

function demoReply(userText: string, canPhysio: boolean): string {
  const hint = canPhysio
    ? "With Calm+, you can request a physiotherapist session from Sessions when you want hands-on help."
    : "Upgrade to Calm+ if you want to request a physiotherapist session.";
  const snippet = userText.slice(0, 180) + (userText.length > 180 ? "…" : "");
  return [
    "Thanks for sharing that with CalmIq.",
    snippet ? `I heard: “${snippet}”.` : "I'm here when you want to describe what's going on.",
    "I'm educational support only — not a clinician. For severe, sudden, or worsening symptoms, seek urgent care.",
    demoAdvice(userText),
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
  // Chunk by words so the UI shows progressive streaming in demo mode.
  const words = text.split(/(\s+)/).filter(Boolean);

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const id = `text_${Date.now()}`;
      writer.write({ type: "text-start", id });
      for (const word of words) {
        writer.write({ type: "text-delta", id, delta: word });
        await new Promise((r) => setTimeout(r, 12));
      }
      writer.write({ type: "text-end", id });
    },
  });

  return createUIMessageStreamResponse({ stream });
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
