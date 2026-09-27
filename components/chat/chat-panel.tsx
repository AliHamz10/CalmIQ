"use client";

import { FormEvent, useMemo, useState } from "react";
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

export function ChatPanel({ plan, demoMode }: Props) {
  const t = useTranslations("chat");
  const [input, setInput] = useState("");
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );
  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";
  const paid = canAccessPhysio(plan);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
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
          <p className="text-muted">{t("empty")}</p>
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
          <p className="text-sm text-danger">{t("error")}</p>
        ) : null}
      </div>

      <div className="border-t border-border px-5 py-3 text-xs text-muted">
        <p>{t("disclaimer")}</p>
        <p className="mt-1">
          {paid ? (
            <>
              {t("bookHint")}{" "}
              <Link href="/sessions" className="text-accent underline">
                →
              </Link>
            </>
          ) : (
            <>
              {t("upgradeHint")}{" "}
              <Link href="/pricing" className="text-accent underline">
                →
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
