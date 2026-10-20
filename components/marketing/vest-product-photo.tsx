import Image from "next/image";

type VestProductPhotoProps = {
  label: string;
  priority?: boolean;
};

/**
 * Photoreal person wearing the translucent blue CalmIq comfort vest.
 * Primary Packages / buy visual — shows real-life product presence.
 */
export function VestProductPhoto({
  label,
  priority = false,
}: VestProductPhotoProps) {
  return (
    <div className="relative h-full min-h-[inherit] w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_42%,var(--color-hero-glow),transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_50%_48%,color-mix(in_oklab,var(--color-vest-accent)_18%,transparent),transparent_70%)] blur-2xl animate-soft-pulse"
      />
      <div className="relative flex h-full w-full items-center justify-center px-2 py-6 md:px-6 md:py-8">
        <Image
          src="/images/comfort-vest-person-blue.jpg"
          alt={label}
          width={864}
          height={1152}
          priority={priority}
          sizes="(max-width: 768px) 92vw, 56vw"
          className="animate-rise h-auto w-full max-w-[22rem] object-contain drop-shadow-[0_28px_52px_rgba(12,40,72,0.18)] md:max-w-[28rem] lg:max-w-[32rem]"
        />
      </div>
    </div>
  );
}
