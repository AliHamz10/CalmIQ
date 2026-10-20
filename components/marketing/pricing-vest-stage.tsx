import { VestCanvas } from "./vest-canvas";

type PricingVestStageProps = {
  label: string;
};

/**
 * Reuses VestCanvas for the packages / Calm+ buy page.
 * Atmosphere only — not a card; packages remain the interaction surface.
 */
export function PricingVestStage({ label }: PricingVestStageProps) {
  return (
    <div className="relative isolate flex h-full min-h-[18rem] w-full items-center overflow-hidden md:min-h-[22rem] lg:min-h-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,var(--color-hero-glow),transparent_64%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 end-[-8%] h-56 w-56 rounded-full bg-[color-mix(in_oklab,var(--color-vest-accent)_35%,transparent)] blur-3xl animate-soft-pulse"
      />
      <div className="relative h-full min-h-[inherit] w-full lg:min-h-full">
        <VestCanvas label={label} />
      </div>
    </div>
  );
}
