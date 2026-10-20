import { VestProductPhoto } from "./vest-product-photo";

type PricingVestStageProps = {
  label: string;
};

/**
 * Photoreal person wearing the translucent blue comfort vest (Packages / buy).
 * Home keeps the rotatable R3F wearable vest; buy shows real-life fit.
 */
export function PricingVestStage({ label }: PricingVestStageProps) {
  return (
    <div className="relative isolate h-full min-h-[inherit] w-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_58%_44%,color-mix(in_oklab,var(--color-vest-fabric)_16%,transparent),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-10%] end-[-6%] h-64 w-64 rounded-full bg-[color-mix(in_oklab,var(--color-vest-accent)_28%,transparent)] blur-3xl"
      />
      <div className="relative h-full min-h-[inherit] w-full">
        <VestProductPhoto label={label} priority />
      </div>
    </div>
  );
}
