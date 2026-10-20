"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ImageVest } from "./image-vest";
import { WornVestStage } from "./worn-vest-stage";

type PricingVestStageProps = {
  label: string;
};

type VestView = "product" | "worn";

/**
 * Packages / Calm+ buy stage: person-wearing-vest by default + product
 * image vest (rotate, red actuators/wiring). Image agent may replace
 * `public/images/vest-worn.png` / WornVestStage assets.
 */
export function PricingVestStage({ label }: PricingVestStageProps) {
  const t = useTranslations("vest");
  const [view, setView] = useState<VestView>("worn");

  return (
    <div className="relative isolate flex h-full min-h-[inherit] w-full flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_58%_44%,color-mix(in_oklab,var(--color-vest-fabric)_16%,transparent),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-10%] end-[-6%] h-64 w-64 rounded-full bg-[color-mix(in_oklab,var(--color-vest-accent)_28%,transparent)] blur-3xl"
      />

      <div
        role="tablist"
        aria-label={t("viewToggleLabel")}
        className="relative z-10 mx-auto mt-1 flex gap-1 rounded-[var(--radius)] border border-border bg-surface/80 p-1 text-sm backdrop-blur"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === "product"}
          onClick={() => setView("product")}
          className={`rounded-[calc(var(--radius)-2px)] px-3 py-1.5 font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            view === "product"
              ? "bg-primary text-primary-fg"
              : "text-muted hover:text-text"
          }`}
        >
          {t("viewProduct")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "worn"}
          onClick={() => setView("worn")}
          className={`rounded-[calc(var(--radius)-2px)] px-3 py-1.5 font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            view === "worn"
              ? "bg-primary text-primary-fg"
              : "text-muted hover:text-text"
          }`}
        >
          {t("viewWorn")}
        </button>
      </div>

      <div className="relative min-h-0 flex-1 touch-none">
        {view === "product" ? (
          <ImageVest label={label} showHotspots />
        ) : (
          <WornVestStage label={t("wornLabel")} showWiring />
        )}
      </div>
    </div>
  );
}
