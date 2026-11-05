"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { Link } from "@/i18n/navigation";
import {
  offices,
  type NetworkOfficeId,
  type Office,
  type OfficeRegion,
  type OfficeType,
} from "@/data/offices";
import worldMap from "@/data/maps/world-network.svg.json";

type MapLayer = {
  viewBox: string;
  width: number;
  height: number;
  land: string | null;
  offices: { id: number; key: string; d: string }[];
  markets: { id: number; d: string }[];
  markers: {
    id: NetworkOfficeId;
    x: number;
    y: number;
    hq?: boolean;
  }[];
};

export type NetworkMapCopy = {
  legendOffice: string;
  legendMarket: string;
  hqBadge: string;
  selectHint: string;
  mapLabel: string;
  dismiss: string;
  contactCta: string;
  regionLabel: string;
  typeLabel: string;
  phoneLabel: string;
  emailLabel: string;
  listHeading: string;
  regions: Record<OfficeRegion, string>;
  types: Record<OfficeType, string>;
  offices: Record<
    NetworkOfficeId,
    {
      city: string;
      country: string;
    }
  >;
};

type WorldNetworkMapProps = {
  copy: NetworkMapCopy;
  className?: string;
};

function placeLabel(copy: NetworkMapCopy, office: Office): string {
  const labels = copy.offices[office.id];
  if (labels.city) {
    return `${labels.city}, ${labels.country}`;
  }
  return labels.country;
}

/** Small label nudges (%) — keep anchors on the correct country body. */
const LABEL_OFFSET: Record<
  NetworkOfficeId,
  { x: number; y: number; align?: "left" | "right" | "center" }
> = {
  usa: { x: 0, y: -4.5, align: "center" },
  netherlands: { x: -1.5, y: -5.5, align: "center" },
  turkiye: { x: 0, y: -4, align: "center" },
  dubai: { x: 1, y: 4.5, align: "center" },
};

function OfficePanel({
  office,
  copy,
  onDismiss,
  panelId,
}: {
  office: Office;
  copy: NetworkMapCopy;
  onDismiss: () => void;
  panelId: string;
}) {
  const labels = copy.offices[office.id];
  const location = placeLabel(copy, office);

  return (
    <div
      id={panelId}
      role="dialog"
      aria-label={location}
      className="absolute right-3 bottom-3 left-3 z-20 max-w-sm border border-white/15 bg-charcoal/95 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:right-4 sm:bottom-4 sm:left-auto sm:w-[18rem]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="font-heading text-lg font-semibold tracking-tight text-surface">
            {location}
          </p>
          {office.hq ? (
            <span className="inline-block rounded-sm bg-brand px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-charcoal uppercase">
              {copy.hqBadge}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="focus-ring shrink-0 rounded-[var(--radius)] px-2 py-1 text-xs text-surface/60 transition-colors hover:text-surface"
        >
          {copy.dismiss}
        </button>
      </div>

      <dl className="mt-3 grid gap-2 text-sm text-surface/70">
        <div>
          <dt className="text-[11px] tracking-[0.16em] text-surface/45 uppercase">
            {copy.regionLabel}
          </dt>
          <dd className="mt-0.5 text-surface/85">{copy.regions[office.region]}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-[0.16em] text-surface/45 uppercase">
            {copy.typeLabel}
          </dt>
          <dd className="mt-0.5 text-surface/85">{copy.types[office.type]}</dd>
        </div>
      </dl>

      {office.street && office.postalCode && labels.city ? (
        <p className="mt-3 text-sm text-surface/70">
          {office.street}
          <br />
          {office.postalCode} {labels.city}
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-1.5 text-sm">
        {office.phone ? (
          <a
            href={`tel:${office.phone.tel}`}
            className="focus-ring w-fit rounded-[var(--radius)] text-brand underline-offset-4 hover:underline"
          >
            <span className="sr-only">{copy.phoneLabel}: </span>
            {office.phone.display}
          </a>
        ) : null}
        {office.email ? (
          <a
            href={`mailto:${office.email}`}
            className="focus-ring w-fit rounded-[var(--radius)] text-brand underline-offset-4 hover:underline"
          >
            <span className="sr-only">{copy.emailLabel}: </span>
            {office.email}
          </a>
        ) : null}
        <Link
          href="/contact"
          className="focus-ring mt-1 w-fit text-sm font-medium text-surface underline-offset-4 hover:text-brand hover:underline"
        >
          {copy.contactCta}
        </Link>
      </div>
    </div>
  );
}

export function WorldNetworkMap({ copy, className }: WorldNetworkMapProps) {
  const reactId = useId();
  const clipId = `${reactId}-clip`;
  const glowId = `${reactId}-glow`;
  const panelId = `${reactId}-panel`;
  const listHeadingId = `${reactId}-list`;
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<NetworkOfficeId | null>("netherlands");
  const [hoveredId, setHoveredId] = useState<NetworkOfficeId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const layer = worldMap.main as MapLayer;
  const highlightId = hoveredId ?? activeId;
  const activeOffice = activeId
    ? (offices.find((office) => office.id === activeId) ?? null)
    : null;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveId(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function selectOffice(id: NetworkOfficeId) {
    setActiveId(id);
  }

  function toggleOffice(id: NetworkOfficeId) {
    setActiveId((current) => (current === id ? null : id));
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-center justify-center gap-5 text-xs tracking-[0.14em] text-surface/55 uppercase">
        <span className="inline-flex items-center gap-2">
          <span className="relative size-2.5 bg-brand" aria-hidden>
            <span className="absolute inset-0 border border-brand/40" />
          </span>
          {copy.legendOffice}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="size-2.5 bg-[#3d6b4f]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent, transparent 1px, rgba(255,255,255,0.12) 1px, rgba(255,255,255,0.12) 2px)",
            }}
            aria-hidden
          />
          {copy.legendMarket}
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[var(--radius)] border border-white/10 bg-black/25"
      >
        <svg
          viewBox={layer.viewBox}
          role="img"
          aria-label={copy.mapLabel}
          className="aspect-[16/7.2] h-auto w-full overflow-visible [shape-rendering:geometricPrecision]"
        >
          <defs>
            <clipPath id={clipId}>
              <rect width={layer.width} height={layer.height} />
            </clipPath>
            <filter
              id={glowId}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern
              id={`${reactId}-market-pattern`}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <g clipPath={`url(#${clipId})`}>
            <rect width={layer.width} height={layer.height} fill="#0f0f11" />

            {layer.land ? (
              <path d={layer.land} fill="#4a4a50" stroke="none" />
            ) : null}

            {layer.markets.map((region) => (
              <g key={`m-${region.id}`}>
                <path
                  d={region.d}
                  fill="#3d6b4f"
                  stroke="#0f0f11"
                  strokeWidth="0.5"
                />
                <path
                  d={region.d}
                  fill={`url(#${reactId}-market-pattern)`}
                  stroke="none"
                  pointerEvents="none"
                />
              </g>
            ))}

            {layer.offices.map((region) => {
              const key = region.key as NetworkOfficeId;
              const isActive = highlightId === key;
              return (
                <path
                  key={`o-${region.id}`}
                  d={region.d}
                  fill="#fabf03"
                  stroke={isActive ? "#fff4c2" : "#0f0f11"}
                  strokeWidth={isActive ? 1.4 : 0.65}
                  filter={isActive ? `url(#${glowId})` : undefined}
                  className="transition-[stroke,stroke-width] duration-200"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredId(key)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => selectOffice(key)}
                />
              );
            })}
          </g>

          {layer.markers.map((marker, index) => {
            const isActive = highlightId === marker.id;
            const office = offices.find((item) => item.id === marker.id);
            if (!office) return null;
            const label = placeLabel(copy, office);

            return (
              <g key={`pin-${marker.id}`}>
                {!reduceMotion ? (
                  <motion.circle
                    cx={marker.x}
                    cy={marker.y}
                    r="10"
                    fill="none"
                    stroke="#fabf03"
                    strokeWidth="1"
                    initial={{ opacity: 0.35, scale: 0.7 }}
                    animate={{ opacity: [0.35, 0], scale: [0.75, 1.55] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeOut",
                    }}
                    className="pointer-events-none"
                  />
                ) : null}
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={office.hq ? 14 : 12}
                  fill="transparent"
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={
                    office.hq ? `${label} — ${copy.hqBadge}` : label
                  }
                  aria-pressed={activeId === marker.id}
                  aria-controls={panelId}
                  onMouseEnter={() => setHoveredId(marker.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => toggleOffice(marker.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleOffice(marker.id);
                    }
                  }}
                />
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={isActive ? 5 : office.hq ? 4.5 : 4}
                  fill="#1b1b1d"
                  stroke="#fabf03"
                  strokeWidth="2"
                  className="pointer-events-none"
                />
              </g>
            );
          })}
        </svg>

        {/* Desktop / tablet HTML labels */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {layer.markers.map((marker) => {
            const office = offices.find((item) => item.id === marker.id);
            if (!office) return null;
            const isActive = highlightId === marker.id;
            const offset = LABEL_OFFSET[marker.id];
            const left = (marker.x / layer.width) * 100 + offset.x;
            const top = (marker.y / layer.height) * 100 + offset.y;
            const text = placeLabel(copy, office);
            const translate =
              offset.align === "left"
                ? "-translate-y-1/2"
                : offset.align === "right"
                  ? "-translate-x-full -translate-y-1/2"
                  : "-translate-x-1/2 -translate-y-1/2";

            return (
              <button
                key={`label-${marker.id}`}
                type="button"
                tabIndex={-1}
                aria-hidden
                onMouseEnter={() => setHoveredId(marker.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => selectOffice(marker.id)}
                className={cn(
                  "pointer-events-auto absolute z-10 whitespace-nowrap rounded-sm border border-[#1b1b1d]/60 px-2 py-1 text-[11px] font-semibold text-[#1b1b1d] shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-transform duration-200 lg:px-2.5 lg:py-1.5 lg:text-xs",
                  translate,
                  isActive
                    ? "scale-105 bg-[#fdc702]"
                    : "bg-brand hover:bg-[#fdc702]",
                )}
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                {text}
                {office.hq ? (
                  <span className="ml-1 opacity-80">· {copy.hqBadge}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {activeOffice && !reduceMotion ? (
          <motion.div
            key={activeOffice.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 hidden sm:block"
          >
            <div className="pointer-events-auto absolute inset-0">
              <OfficePanel
                office={activeOffice}
                copy={copy}
                onDismiss={() => setActiveId(null)}
                panelId={panelId}
              />
            </div>
          </motion.div>
        ) : activeOffice ? (
          <div className="hidden sm:block">
            <OfficePanel
              office={activeOffice}
              copy={copy}
              onDismiss={() => setActiveId(null)}
              panelId={panelId}
            />
          </div>
        ) : null}
      </div>

      {/* Mobile / always-visible semantic office list */}
      <div className="space-y-3">
        <h3
          id={listHeadingId}
          className="font-heading text-sm font-semibold tracking-[0.18em] text-brand uppercase"
        >
          {copy.listHeading}
        </h3>
        <ul
          aria-labelledby={listHeadingId}
          className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
        >
          {offices.map((office) => {
            const isActive = activeId === office.id;
            const location = placeLabel(copy, office);
            return (
              <li key={office.id}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectOffice(office.id)}
                  className={cn(
                    "focus-ring flex min-h-11 w-full flex-col items-start gap-0.5 rounded-[var(--radius)] border px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "border-brand bg-brand text-charcoal"
                      : "border-white/15 bg-white/5 text-surface/85 hover:border-white/30 hover:text-surface",
                  )}
                >
                  <span className="text-sm font-medium">{location}</span>
                  <span
                    className={cn(
                      "text-[10px] tracking-[0.14em] uppercase",
                      isActive ? "text-charcoal/70" : "text-surface/50",
                    )}
                  >
                    {office.hq ? copy.hqBadge : copy.types[office.type]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Mobile detail under list */}
        {activeOffice ? (
          <div className="border border-white/10 bg-black/20 p-4 sm:hidden">
            <p className="font-heading text-lg font-semibold text-surface">
              {placeLabel(copy, activeOffice)}
            </p>
            {activeOffice.hq ? (
              <p className="mt-1 text-xs tracking-[0.14em] text-brand uppercase">
                {copy.hqBadge}
              </p>
            ) : null}
            <p className="mt-2 text-sm text-surface/70">
              {copy.regions[activeOffice.region]} ·{" "}
              {copy.types[activeOffice.type]}
            </p>
            {activeOffice.phone ? (
              <a
                href={`tel:${activeOffice.phone.tel}`}
                className="mt-3 block text-sm text-brand"
              >
                {activeOffice.phone.display}
              </a>
            ) : null}
            {activeOffice.email ? (
              <a
                href={`mailto:${activeOffice.email}`}
                className="mt-1 block text-sm text-brand"
              >
                {activeOffice.email}
              </a>
            ) : null}
            <Link
              href="/contact"
              className="mt-3 inline-block text-sm font-medium text-surface underline-offset-4 hover:text-brand hover:underline"
            >
              {copy.contactCta}
            </Link>
          </div>
        ) : null}
      </div>

      <p className="sr-only">{copy.selectHint}</p>
    </div>
  );
}
