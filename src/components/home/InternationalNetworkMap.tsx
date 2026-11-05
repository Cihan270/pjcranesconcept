"use client";

import { useId, useState } from "react";
import { cn } from "cn";
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
  markers: {
    id: NetworkOfficeId;
    x: number;
    y: number;
    hq?: boolean;
  }[];
};

export type InternationalNetworkMapCopy = {
  mapLabel: string;
  hqBadge: string;
  regionLabel: string;
  typeLabel: string;
  regions: Record<OfficeRegion, string>;
  types: Record<OfficeType, string>;
  phoneLabel: string;
  emailLabel: string;
  offices: Record<
    NetworkOfficeId,
    {
      /** City display when verified; empty when unavailable */
      city: string;
      country: string;
    }
  >;
  listHeading: string;
};

type InternationalNetworkMapProps = {
  copy: InternationalNetworkMapCopy;
  className?: string;
};

function placeLabel(
  copy: InternationalNetworkMapCopy,
  office: Office,
): string {
  const labels = copy.offices[office.id];
  if (labels.city) {
    return `${labels.city}, ${labels.country}`;
  }
  return labels.country;
}

function OfficeDetail({
  office,
  copy,
}: {
  office: Office;
  copy: InternationalNetworkMapCopy;
}) {
  const labels = copy.offices[office.id];
  const location = placeLabel(copy, office);

  return (
    <div className="space-y-3 border-t border-white/10 pt-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-heading text-lg font-semibold tracking-tight text-surface">
          {location}
        </p>
        {office.hq ? (
          <span className="rounded-sm bg-brand px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-charcoal uppercase">
            {copy.hqBadge}
          </span>
        ) : null}
      </div>

      <dl className="grid gap-2 text-sm text-surface/70 sm:grid-cols-2">
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
        <p className="text-sm text-surface/70">
          {office.street}
          <br />
          {office.postalCode} {labels.city}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5 text-sm">
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
      </div>
    </div>
  );
}

export function InternationalNetworkMap({
  copy,
  className,
}: InternationalNetworkMapProps) {
  const reactId = useId();
  const listId = `${reactId}-offices`;
  const [activeId, setActiveId] = useState<NetworkOfficeId>("netherlands");
  const layer = worldMap.main as MapLayer;
  const activeOffice =
    offices.find((office) => office.id === activeId) ?? offices[1];

  return (
    <div className={cn("space-y-5", className)}>
      <div className="overflow-hidden rounded-[var(--radius)] border border-white/10 bg-[#141416]">
        <svg
          viewBox={layer.viewBox}
          role="img"
          aria-label={copy.mapLabel}
          className="h-auto w-full [shape-rendering:geometricPrecision]"
        >
          <rect
            width={layer.width}
            height={layer.height}
            fill="#1b1b1d"
          />

          {layer.land ? (
            <path d={layer.land} fill="#4f5663" stroke="none" />
          ) : null}

          {layer.markers.map((marker) => {
            const office = offices.find((item) => item.id === marker.id);
            if (!office) return null;

            const isActive = activeId === marker.id;
            const label = placeLabel(copy, office);

            return (
              <g key={marker.id}>
                <title>{office.hq ? `${label} — ${copy.hqBadge}` : label}</title>
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={office.hq ? 18 : 14}
                  fill="transparent"
                  className="cursor-pointer"
                  aria-hidden
                  onMouseEnter={() => setActiveId(marker.id)}
                  onClick={() => setActiveId(marker.id)}
                />
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={office.hq ? 6.5 : 4.5}
                  fill={isActive ? "#fabf03" : office.hq ? "#fabf03" : "#fafaf8"}
                  stroke={isActive ? "#fafaf8" : "#1b1b1d"}
                  strokeWidth={office.hq ? 2 : 1.5}
                  className="pointer-events-none"
                />
                {office.hq ? (
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="11"
                    fill="none"
                    stroke="#fabf03"
                    strokeWidth="1.25"
                    opacity="0.85"
                    className="pointer-events-none"
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-wrap gap-2">
            {offices.map((office) => {
              const isActive = activeId === office.id;
              return (
                <button
                  key={office.id}
                  type="button"
                  aria-pressed={isActive}
                  onMouseEnter={() => setActiveId(office.id)}
                  onFocus={() => setActiveId(office.id)}
                  onClick={() => setActiveId(office.id)}
                  className={cn(
                    "focus-ring rounded-sm border px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                    isActive
                      ? "border-brand bg-brand text-charcoal"
                      : "border-white/15 bg-white/5 text-surface/80 hover:border-white/30 hover:text-surface",
                  )}
                >
                  {placeLabel(copy, office)}
                  {office.hq ? (
                    <span className="mt-0.5 block text-[10px] tracking-[0.12em] uppercase opacity-80">
                      {copy.hqBadge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <OfficeDetail office={activeOffice} copy={copy} />
        </div>
      </div>

      {/* Non-visual accessible office list with clickable contacts */}
      <div className="sr-only">
        <h3 id={listId}>{copy.listHeading}</h3>
        <ul aria-labelledby={listId}>
          {offices.map((office) => {
            const labels = copy.offices[office.id];
            return (
              <li key={`a11y-${office.id}`}>
                <p>
                  {placeLabel(copy, office)}
                  {office.hq ? ` (${copy.hqBadge})` : ""}
                </p>
                <p>
                  {copy.regions[office.region]} — {copy.types[office.type]}
                </p>
                {office.street && office.postalCode && labels.city ? (
                  <p>
                    {office.street}, {office.postalCode} {labels.city}
                  </p>
                ) : null}
                {office.phone ? (
                  <p>
                    <a href={`tel:${office.phone.tel}`}>
                      {copy.phoneLabel}: {office.phone.display}
                    </a>
                  </p>
                ) : null}
                {office.email ? (
                  <p>
                    <a href={`mailto:${office.email}`}>
                      {copy.emailLabel}: {office.email}
                    </a>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
