import Image from "next/image";

type VestProductPhotoProps = {
  label: string;
  priority?: boolean;
};

/**
 * Dominant product photography for marketing surfaces.
 * Full-bleed comfort-vest shot — not a card; no trademarks in alt text.
 */
export function VestProductPhoto({
  label,
  priority = false,
}: VestProductPhotoProps) {
  return (
    <div className="relative h-full min-h-[inherit] w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_46%,color-mix(in_oklab,var(--color-surface)_88%,transparent),transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.55),transparent_70%)] blur-2xl animate-soft-pulse"
      />
      <div className="relative flex h-full w-full items-center justify-center px-4 py-8 md:px-8 md:py-10">
        <Image
          src="/images/comfort-vest-white.jpg"
          alt={label}
          width={960}
          height={960}
          priority={priority}
          sizes="(max-width: 768px) 92vw, 58vw"
          className="animate-rise h-auto w-full max-w-[34rem] object-contain drop-shadow-[0_28px_48px_rgba(11,30,27,0.14)] md:max-w-[40rem] lg:max-w-[46rem]"
        />
      </div>
    </div>
  );
}
