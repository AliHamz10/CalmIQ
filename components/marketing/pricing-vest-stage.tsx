import { VestCanvas } from "./vest-canvas";

type PricingVestStageProps = {
  label: string;
};

/**
 * Rotatable blue-glass 3D vest for the packages / Calm+ buy page.
 * Atmosphere + orbit — not a card; pointer events stay enabled for drag.
 */
export function PricingVestStage({ label }: PricingVestStageProps) {
  return (
    <div className="relative isolate h-full min-h-[inherit] w-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,var(--color-hero-glow),transparent_64%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 end-[-8%] h-56 w-56 rounded-full bg-[color-mix(in_oklab,var(--color-vest-accent)_35%,transparent)] blur-3xl animate-soft-pulse"
      />
      <div className="relative h-full min-h-[inherit] w-full touch-none">
        <VestCanvas label={label} />
      </div>
    </div>
  );
}
