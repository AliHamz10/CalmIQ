/**
 * Gemini / Google Generative AI config for the chat API.
 * Keys come from env only — never hardcode secrets.
 */

import { APICallError } from "ai";

const DEFAULT_MODEL = "gemini-2.5-flash";

/** Non-empty keys from GEMINI_KNOWLEDGE_API_KEYS (comma-separated). */
export function getGeminiApiKeys(): string[] {
  const raw = process.env.GEMINI_KNOWLEDGE_API_KEYS ?? "";
  const fromCustom = raw
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
  if (fromCustom.length > 0) return fromCustom;

  // Alias expected by @ai-sdk/google when using the default provider instance.
  const alias = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  return alias ? [alias] : [];
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

export function isInvalidGeminiApiKeyError(error: unknown): boolean {
  const haystack = [
    error instanceof Error ? error.message : "",
    APICallError.isInstance(error) ? (error.responseBody ?? "") : "",
    APICallError.isInstance(error) ? String(error.statusCode ?? "") : "",
  ]
    .join(" ")
    .toUpperCase();

  return (
    haystack.includes("API_KEY_INVALID") ||
    haystack.includes("API KEY NOT VALID") ||
    haystack.includes("API KEY IS INVALID") ||
    (APICallError.isInstance(error) &&
      error.statusCode === 400 &&
      (haystack.includes("INVALID_ARGUMENT") ||
        haystack.includes("API_KEY")))
  );
}

/** Safe client-facing message for Gemini provider failures (no secrets). */
export function formatGeminiClientError(error: unknown): string {
  if (isInvalidGeminiApiKeyError(error)) {
    return "Invalid Gemini API key. Update GEMINI_KNOWLEDGE_API_KEYS in Vercel (Production) and redeploy.";
  }
  console.error("[chat] gemini provider error", error);
  return "Chat is temporarily unavailable. Please try again.";
}
