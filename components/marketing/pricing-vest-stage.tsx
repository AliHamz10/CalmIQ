import { VestProductPhoto } from "./vest-product-photo";

type PricingVestStageProps = {
  label: string;
};

/**
 * White comfort-vest product photo for the packages / Calm+ buy page.
 * Full-bleed atmosphere only — not a card.
 */
export function PricingVestStage({ label }: PricingVestStageProps) {
  return (
    <div className="relative isolate flex h-full min-h-[18rem] w-full items-center overflow-hidden md:min-h-[22rem] lg:min-h-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_58%_44%,color-mix(in_oklab,var(--color-surface)_70%,transparent),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-10%] end-[-6%] h-64 w-64 rounded-full bg-[color-mix(in_oklab,var(--color-accent-soft)_40%,transparent)] blur-3xl"
      />
      <div className="relative h-full min-h-[inherit] w-full lg:min-h-full">
        <VestProductPhoto label={label} priority />
      </div>
    </div>
  );
}
