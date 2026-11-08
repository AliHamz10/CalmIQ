import Image from "next/image";
import { VEST_HOTSPOTS, VEST_WORN_PATH } from "@/lib/marketing/vest-assets";
import { VestActuatorPad } from "./vest-actuator-pad";
import { VestWiringOverlay } from "./vest-wiring-overlay";

type WornVestStageProps = {
  label: string;
  priority?: boolean;
  /** Same red Li-ion + hardware pads language as product ImageVest. */
  showWiring?: boolean;
  className?: string;
};

/**
 * Buy-page “person wearing vest” stage.
 *
 * IMAGE AGENT HOOK — replace `public/images/vest-worn.png`. Prefer assets
 * with defined red hardware pads + red wires to Li-ion (clear edges, not
 * soft glow). Set showWiring when the file lacks baked power hardware.
 */
export function WornVestStage({
  label,
  priority = false,
  showWiring = true,
  className = "",
}: WornVestStageProps) {
  return (
    <div
      data-calmiq-slot="worn-vest-stage"
      className={`relative isolate h-full min-h-[inherit] w-full overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,var(--color-hero-glow),transparent_64%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 end-[-8%] h-56 w-56 rounded-full bg-[color-mix(in_oklab,var(--color-vest-accent)_30%,transparent)] blur-3xl animate-soft-pulse"
      />
      <div className="relative flex h-full min-h-[inherit] w-full items-center justify-center px-2 py-4 md:px-4 md:py-6">
        <div className="relative h-full w-full max-w-[36rem] md:max-w-[44rem]">
          <Image
            src={VEST_WORN_PATH}
            alt={label}
            fill
            priority={priority}
            sizes="(max-width: 768px) 92vw, 50vw"
            className="animate-rise object-contain drop-shadow-[0_28px_48px_rgba(11,30,27,0.16)]"
          />
          {showWiring ? (
            <>
              <VestWiringOverlay />
              {VEST_HOTSPOTS.map((spot) => (
                <span
                  key={spot.id}
                  aria-hidden
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  <VestActuatorPad mode="photo" />
                </span>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
