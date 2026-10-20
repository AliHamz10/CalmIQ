import Image from "next/image";

type VestProductPhotoProps = {
  label: string;
  priority?: boolean;
};

/**
 * Optional static product photo asset (kept in public/images/).
 * Not the primary marketing visual — VestCanvas (R3F + SVG) owns home/pricing.
 * No trademarks in alt text.
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
      <div className="relative flex h-full w-full items-center justify-center px-2 py-6 md:px-6 md:py-8">
        <Image
          src="/images/comfort-vest-white.jpg"
          alt={label}
          width={960}
          height={960}
          priority={priority}
          sizes="(max-width: 768px) 92vw, 58vw"
          className="animate-rise h-auto w-full max-w-[36rem] object-contain drop-shadow-[0_32px_56px_rgba(11,30,27,0.16)] md:max-w-[44rem] lg:max-w-[50rem]"
        />
      </div>
    </div>
  );
}
