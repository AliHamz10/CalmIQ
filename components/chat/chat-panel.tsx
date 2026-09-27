"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { PlanId } from "@/lib/entitlements";
import { canAccessPhysio } from "@/lib/entitlements";

type Props = {
  plan: PlanId;
  demoMode: boolean;
};

function messageText(message: {
  parts?: Array<{ type: string; text?: string }>;
  content?: string;
}): string {
  if (message.parts?.length) {
    return message.parts
      .filter((p) => p.type === "text" && p.text)
      .map((p) => p.text)
      .join("");
  }
  return typeof message.content === "string" ? message.content : "";
}

const STARTERS = [
  "My lower back is stiff after sitting all day",
  "My knee clicks when I squat — should I keep training?",
  "I twisted my ankle yesterday. What should I do today?",
] as const;

export function ChatPanel({ plan, demoMode }: Props) {
  const t = useTranslations("chat");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
  });
  const busy = status === "submitted" || status === "streaming";
  const paid = canAccessPhysio(plan);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    clearError?.();
    setInput("");
    await sendMessage({ text: trimmed });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await send(input);
  }

  return (
    <div className="flex min-h-[70vh] flex-col border border-border bg-surface/80 shadow-[var(--shadow-soft)]">
      <div className="border-b border-border px-5 py-4">
        <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
        {demoMode ? (
          <p className="mt-2 text-xs text-accent">{t("demoMode")}</p>
        ) : null}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-muted">{t("empty")}</p>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {t("startersLabel")}
              </p>
              {STARTERS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={busy}
                  onClick={() => send(prompt)}
                  className="rounded-[var(--radius)] border border-border bg-bg px-3 py-2 text-start text-sm text-text transition hover:border-accent hover:bg-surface disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "user"
                  ? "ms-auto max-w-[85%] rounded-[var(--radius)] bg-primary px-4 py-3 text-primary-fg"
                  : "me-auto max-w-[85%] rounded-[var(--radius)] border border-border bg-bg px-4 py-3"
              }
            >
              <div className="space-y-2 text-sm leading-relaxed">
                {messageText(m)
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={`${m.id}-${i}`} className="whitespace-pre-wrap">
                      {para}
                    </p>
                  ))}
              </div>
            </div>
          ))
        )}
        {busy ? (
          <p className="text-sm text-muted animate-soft-pulse">{t("loading")}</p>
        ) : null}
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {t("error")}
          </p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border px-5 py-3 text-xs text-muted">
        <p>{t("disclaimer")}</p>
        <p className="mt-1">
          {paid ? (
            <>
              {t("bookHint")}{" "}
              <Link href="/sessions" className="text-accent underline">
                {t("bookLink")}
              </Link>
            </>
          ) : (
            <>
              {t("upgradeHint")}{" "}
              <Link href="/pricing" className="text-accent underline">
                {t("upgradeLink")}
              </Link>
            </>
          )}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex gap-2 border-t border-border p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 rounded-[var(--radius)] border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-accent"
          disabled={busy}
          aria-label={t("placeholder")}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-[var(--radius)] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg disabled:opacity-50"
        >
          {t("send")}
        </button>
      </form>
    </div>
  );
}
