import { convertToModelMessages, streamText, type UIMessage } from "ai";
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

function demoReply(userText: string, canPhysio: boolean): string {
  const hint = canPhysio
    ? "With Calm+, you can request a physiotherapist session from Sessions when you want hands-on help."
    : "Upgrade to Calm+ if you want to request a physiotherapist session.";
  return [
    "Thanks for sharing that with CalmIq.",
    `I heard: “${userText.slice(0, 180)}${userText.length > 180 ? "…" : ""}”.`,
    "I'm educational support only — not a clinician. For severe, sudden, or worsening symptoms, seek urgent care.",
    "Try gentle pacing, note what movements ease or aggravate symptoms, and avoid pushing through sharp pain.",
    hint,
  ].join("\n\n");
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

  const body = (await req.json()) as { messages?: UIMessage[] };
  const messages = body.messages ?? [];
  const canPhysio = canAccessPhysio(access.plan);
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastText =
    lastUser?.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? "";

  if (!process.env.OPENAI_API_KEY) {
    const text = demoReply(lastText || "hello", canPhysio);
    // Minimal UI message stream compatible shape for DefaultChatTransport.
    const encoder = new TextEncoder();
    const id = `msg_demo_${Date.now()}`;
    const stream = new ReadableStream({
      start(controller) {
        const chunks = [
          `data: ${JSON.stringify({ type: "start" })}\n\n`,
          `data: ${JSON.stringify({ type: "text-start", id })}\n\n`,
          `data: ${JSON.stringify({ type: "text-delta", id, delta: text })}\n\n`,
          `data: ${JSON.stringify({ type: "text-end", id })}\n\n`,
          `data: ${JSON.stringify({ type: "finish" })}\n\n`,
          `data: [DONE]\n\n`,
        ];
        for (const c of chunks) controller.enqueue(encoder.encode(c));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "x-vercel-ai-ui-message-stream": "v1",
      },
    });
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: buildSystemPrompt(canPhysio),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
