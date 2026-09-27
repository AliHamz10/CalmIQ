/**
 * Gemini / Google Generative AI config for the chat API.
 * Keys come from env only — never hardcode secrets.
 */

const DEFAULT_MODEL = "gemini-2.5-flash";

/** Non-empty keys from GEMINI_KNOWLEDGE_API_KEYS (comma-separated). */
export function getGeminiApiKeys(): string[] {
  const raw = process.env.GEMINI_KNOWLEDGE_API_KEYS ?? "";
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
}

/** First configured key, or null when none are set. */
export function getGeminiApiKey(): string | null {
  return getGeminiApiKeys()[0] ?? null;
}

export function hasGeminiApiKey(): boolean {
  return getGeminiApiKey() !== null;
}

/** Model id from GEMINI_MODEL, defaulting to gemini-2.5-flash. */
export function getGeminiModel(): string {
  const model = process.env.GEMINI_MODEL?.trim();
  return model && model.length > 0 ? model : DEFAULT_MODEL;
}
