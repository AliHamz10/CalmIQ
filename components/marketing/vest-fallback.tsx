/** Attractive non-WebGL vest silhouette for load / reduced environments. */
export function VestFallback({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative flex h-full w-full items-center justify-center"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_42%,var(--color-hero-glow),transparent_58%)]"
      />
      <svg
        aria-hidden
        viewBox="0 0 280 340"
        className="relative h-[min(72vh,34rem)] w-auto max-w-[90%] drop-shadow-[0_28px_60px_rgba(12,31,36,0.22)] animate-drift"
      >
        <defs>
          <linearGradient id="vestBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-vest-accent)" />
            <stop offset="45%" stopColor="var(--color-vest-fabric)" />
            <stop offset="100%" stopColor="#063832" />
          </linearGradient>
          <linearGradient id="vestPad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-vest-pad)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--color-vest-accent)" stopOpacity="0.55" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Shoulders + torso */}
        <path
          d="M70 78 C58 70 42 78 36 96 L28 150 C24 176 30 210 38 248 L48 292 C52 308 68 318 86 316 L140 308 L194 316 C212 318 228 308 232 292 L242 248 C250 210 256 176 252 150 L244 96 C238 78 222 70 210 78 L188 92 C176 70 104 70 92 92 Z"
          fill="url(#vestBody)"
        />
        {/* Collar */}
        <path
          d="M104 86 C120 68 160 68 176 86 L166 104 C154 92 126 92 114 104 Z"
          fill="#084540"
          opacity="0.9"
        />
        {/* Zipper */}
        <rect x="137" y="110" width="6" height="180" rx="2" fill="var(--color-vest-accent)" opacity="0.85" />
        {/* Soft comfort pads */}
        <ellipse cx="108" cy="150" rx="22" ry="28" fill="url(#vestPad)" filter="url(#softGlow)" className="animate-soft-pulse" />
        <ellipse cx="172" cy="150" rx="22" ry="28" fill="url(#vestPad)" filter="url(#softGlow)" className="animate-soft-pulse" />
        <ellipse cx="112" cy="210" rx="18" ry="22" fill="url(#vestPad)" opacity="0.75" />
        <ellipse cx="168" cy="210" rx="18" ry="22" fill="url(#vestPad)" opacity="0.75" />
        {/* Waist band */}
        <path
          d="M48 286 C70 300 210 300 232 286 L228 304 C200 318 80 318 52 304 Z"
          fill="var(--color-vest-accent)"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
