/** Non-WebGL wearable blue-glass vest silhouette (matches R3F form language). */
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
        viewBox="0 0 280 360"
        className="relative h-[min(74vh,36rem)] w-auto max-w-[90%] drop-shadow-[0_28px_60px_rgba(12,40,72,0.2)] animate-drift"
      >
        <defs>
          <linearGradient id="vestBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-vest-accent)" stopOpacity="0.7" />
            <stop offset="45%" stopColor="var(--color-vest-fabric)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#065a96" stopOpacity="0.68" />
          </linearGradient>
          <linearGradient id="vestPad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-vest-pad)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--color-vest-accent)" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="figureFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8aa0b4" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#6e8498" stopOpacity="0.42" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft human silhouette */}
        <ellipse cx="140" cy="68" rx="20" ry="22" fill="url(#figureFill)" />
        <path
          d="M120 92 C120 84 160 84 160 92 L166 220 C168 258 160 288 140 296 C120 288 112 258 114 220 Z"
          fill="url(#figureFill)"
        />
        <path
          d="M120 108 C98 124 90 154 94 184"
          fill="none"
          stroke="#9eb0c0"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.28"
        />
        <path
          d="M160 108 C182 124 190 154 186 184"
          fill="none"
          stroke="#9eb0c0"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.28"
        />

        {/* Wearable curved vest shell — not flat panes */}
        <path
          d="M78 96
             C62 88 48 98 44 118
             L36 168 C30 210 34 250 46 292
             L54 310 C62 322 86 328 110 322
             L140 316 L170 322
             C194 328 218 322 226 310
             L234 292 C246 250 250 210 244 168
             L236 118 C232 98 218 88 202 96
             C188 78 152 72 140 72 C128 72 92 78 78 96 Z"
          fill="url(#vestBody)"
          stroke="var(--color-vest-accent)"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />
        {/* Open front scoop */}
        <path
          d="M128 108 C132 150 132 210 130 280 L140 286 L150 280 C148 210 148 150 152 108 C146 100 134 100 128 108 Z"
          fill="var(--color-bg)"
          opacity="0.55"
        />
        {/* Collar */}
        <path
          d="M108 90 C122 74 158 74 172 90 L162 108 C152 96 128 96 118 108 Z"
          fill="#0a6aad"
          opacity="0.55"
        />
        {/* Zip */}
        <rect x="137" y="112" width="5" height="168" rx="2" fill="var(--color-vest-accent)" opacity="0.75" />
        {/* Soft discs */}
        <ellipse cx="112" cy="158" rx="11" ry="9" fill="url(#vestPad)" filter="url(#softGlow)" className="animate-soft-pulse" />
        <ellipse cx="168" cy="158" rx="11" ry="9" fill="url(#vestPad)" filter="url(#softGlow)" className="animate-soft-pulse" />
        <ellipse cx="114" cy="212" rx="9" ry="8" fill="url(#vestPad)" opacity="0.75" />
        <ellipse cx="166" cy="212" rx="9" ry="8" fill="url(#vestPad)" opacity="0.75" />
        {/* Cinched waist */}
        <ellipse
          cx="140"
          cy="300"
          rx="78"
          ry="14"
          fill="none"
          stroke="var(--color-vest-accent)"
          strokeWidth="10"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
