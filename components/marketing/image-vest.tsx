"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  VEST_FRAME_PATHS,
  VEST_HOTSPOTS,
  type VestZoneId,
} from "@/lib/marketing/vest-assets";
import { VestActuatorPad } from "./vest-actuator-pad";
import { VestWiringOverlay } from "./vest-wiring-overlay";

type ImageVestProps = {
  label: string;
  /** Show actuator hotspot buttons (default true). */
  showHotspots?: boolean;
  /** Red Li-ion pack + lead wires (default true). */
  showWiring?: boolean;
  priority?: boolean;
  className?: string;
};

const DRAG_THRESHOLD = 36;

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}

/**
 * Photoreal blue vest cutout — drag/click-rotate through baked hardware
 * frames (molded red pads + Li-ion + red wires in the PNG). Hotspots use
 * the molded pad overlay image. Optional SVG wiring only when compositing
 * on shell frames (showWiring).
 */
export function ImageVest({
  label,
  showHotspots = true,
  /** Baked frames already include Li-ion + red leads — off by default. */
  showWiring = false,
  priority = true,
  className = "",
}: ImageVestProps) {
  const t = useTranslations("vest");
  const reduceMotion = usePrefersReducedMotion();
  const panelId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const dragOriginX = useRef<number | null>(null);
  const dragMoved = useRef(false);

  const [frame, setFrame] = useState(0);
  const [activeZone, setActiveZone] = useState<VestZoneId | null>(null);
  const [cssSpin, setCssSpin] = useState(0);
  const [useCssSpinFallback, setUseCssSpinFallback] = useState(false);

  const frameCount = VEST_FRAME_PATHS.length;

  const stepFrame = useCallback(
    (delta: number) => {
      if (useCssSpinFallback || frameCount <= 1) {
        setCssSpin((prev) => prev + delta * 28);
        return;
      }
      setFrame((prev) => (prev + delta + frameCount) % frameCount);
    },
    [frameCount, useCssSpinFallback],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-vest-hotspot]")) return;
    dragOriginX.current = event.clientX;
    dragMoved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragOriginX.current == null) return;
    const dx = event.clientX - dragOriginX.current;
    if (Math.abs(dx) < DRAG_THRESHOLD) return;
    dragMoved.current = true;
    dragOriginX.current = event.clientX;
    stepFrame(dx > 0 ? 1 : -1);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragOriginX.current == null) return;
    const wasDrag = dragMoved.current;
    dragOriginX.current = null;
    dragMoved.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    if (!wasDrag && !(event.target as HTMLElement).closest("[data-vest-hotspot]")) {
      stepFrame(1);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      stepFrame(event.key === "ArrowRight" ? 1 : -1);
    }
    if (event.key === "Escape") setActiveZone(null);
  };

  const src = VEST_FRAME_PATHS[frame] ?? VEST_FRAME_PATHS[0];
  const spinStyle =
    useCssSpinFallback || frameCount <= 1
      ? {
          transform: `rotateY(${cssSpin}deg)`,
          transition: reduceMotion ? undefined : "transform 0.35s ease-out",
        }
      : undefined;

  return (
    <div
      className={`relative flex h-full min-h-[inherit] w-full flex-col overflow-hidden ${className}`}
    >
      <div
        ref={stageRef}
        role="img"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative isolate h-full min-h-[inherit] w-full cursor-grab touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:cursor-grabbing"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_46%,var(--color-hero-glow),transparent_64%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_50%_48%,color-mix(in_oklab,var(--color-vest-pad)_35%,transparent),transparent_70%)] blur-2xl animate-soft-pulse"
        />

        <div className="relative flex h-full w-full items-center justify-center px-2 py-4 md:px-4 md:py-6 [perspective:1200px]">
          <div
            className="relative h-full w-full max-w-[36rem] md:max-w-[44rem] lg:max-w-[50rem]"
            style={spinStyle}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={priority}
              /* unoptimized: avoid stale Next image-optimizer cache serving shell bytes */
              unoptimized
              sizes="(max-width: 768px) 92vw, 58vw"
              className="animate-rise object-contain drop-shadow-[0_28px_48px_rgba(11,30,27,0.18)]"
              onError={() => setUseCssSpinFallback(true)}
              draggable={false}
            />

            {showWiring ? <VestWiringOverlay /> : null}

            {showHotspots
              ? VEST_HOTSPOTS.map((spot) => {
                  const selected = activeZone === spot.id;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      data-vest-hotspot
                      aria-expanded={selected}
                      aria-controls={panelId}
                      aria-label={t(`zones.${spot.id}.name`)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveZone((prev) => (prev === spot.id ? null : spot.id));
                      }}
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-vest-wire)] active:scale-95"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    >
                      <VestActuatorPad
                        selected={selected}
                        mode={showWiring ? "photo" : "hit"}
                      />
                    </button>
                  );
                })
              : null}
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-2 start-1/2 z-10 w-[min(100%,22rem)] -translate-x-1/2 text-center text-xs text-muted md:bottom-3 md:text-sm">
          {t("rotateHint")}
        </p>
      </div>

      {activeZone ? (
        <div
          id={panelId}
          role="region"
          aria-live="polite"
          className="absolute start-3 end-3 bottom-10 z-20 max-w-sm rounded-[var(--radius)] border border-border bg-surface/95 px-4 py-3 text-start shadow-[var(--shadow-soft)] backdrop-blur md:start-6 md:end-6 md:bottom-12"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-base font-semibold text-primary">
                {t(`zones.${activeZone}.name`)}
              </p>
              <p className="mt-1 text-sm text-muted">{t(`zones.${activeZone}.body`)}</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveZone(null)}
              className="shrink-0 rounded-[var(--radius)] px-2 py-1 text-sm font-medium text-muted transition hover:bg-bg-deep hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("closeInfo")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
