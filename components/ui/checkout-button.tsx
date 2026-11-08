"use client";

import { useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";

type Props = {
  label: string;
  signedIn: boolean;
  className?: string;
};

export function CheckoutButton({ label, signedIn, className }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onClick() {
    if (!signedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await res.json()) as {
        url?: string;
        demo?: boolean;
        error?: string;
      };
      if (data.demo) {
        // Demo mode: flip plan cookie via demo API then go to sessions.
        await fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: "calm_plus", email: "demo@calmiq.app" }),
        });
        router.push("/sessions");
        router.refresh();
        return;
      }
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout unavailable");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Checkout unavailable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={className}
      >
        {loading ? "…" : label}
      </button>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
