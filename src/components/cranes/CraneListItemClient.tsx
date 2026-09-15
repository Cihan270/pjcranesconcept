"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  craneDisplayName,
  formatCapacityTons,
  formatHours,
  formatMileageKm,
} from "@/lib/inventory/format";
import type { Crane } from "@/types/crane";
import { cn } from "cn";

type CraneListItemClientProps = {
  crane: Crane;
  priority?: boolean;
  className?: string;
};

/** Client twin of CraneListItem for filtered inventory results. */
export function CraneListItemClient({
  crane,
  priority = false,
  className,
}: CraneListItemClientProps) {
  const t = useTranslations("Crane");
  const tType = useTranslations("Crane.type");
  const locale = useLocale();
  const name = craneDisplayName(crane);
  const image =
    crane.images.find((item) => item.primary) ?? crane.images[0] ?? null;
  const capacity = formatCapacityTons(crane.capacityKg, locale);
  const mileage = formatMileageKm(crane.mileageKm, locale);
  const hours = formatHours(
    crane.operatingHours ?? crane.hoursSuperstructure ?? crane.hoursCarrier,
    locale,
  );

  return (
    <article
      className={cn(
        "group grid gap-4 border-b border-line py-5 sm:grid-cols-[minmax(8rem,12rem)_1fr] md:grid-cols-[minmax(10rem,14rem)_1fr_auto]",
        className,
      )}
    >
      <Link
        href={`/cranes/${crane.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-secondary sm:aspect-[5/4]"
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, 14rem"
            className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="absolute inset-0 bg-[linear-gradient(135deg,#2a2a2e,#1b1b1d)]"
            aria-hidden
          />
        )}
      </Link>

      <div className="min-w-0 space-y-3">
        <div className="space-y-1">
          <p className="text-xs tracking-wide text-steel uppercase tabular-nums">
            {t("reference")} {crane.reference} · {t(`status.${crane.status}`)}
          </p>
          <h3 className="font-heading text-xl leading-tight font-semibold tracking-tight md:text-2xl">
            <Link
              href={`/cranes/${crane.slug}`}
              className="focus-ring rounded-[var(--radius)] transition-colors hover:text-steel"
            >
              {name}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            {tType(crane.type)} · {crane.year}
            {crane.location ? ` · ${crane.location}` : null}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-steel">{t("capacity")}</dt>
            <dd className="font-medium tabular-nums">
              {t("tons", { value: capacity })}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-steel">{t("year")}</dt>
            <dd className="font-medium tabular-nums">{crane.year}</dd>
          </div>
          <div>
            <dt className="text-xs text-steel">{t("hours")}</dt>
            <dd className="font-medium tabular-nums">{hours ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-steel">{t("mileage")}</dt>
            <dd className="font-medium tabular-nums">{mileage ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="hidden items-start md:flex">
        <Link
          href={`/cranes/${crane.slug}`}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-4 text-sm font-medium transition-colors hover:border-steel/40 hover:bg-background"
        >
          {t("viewDetails")}
        </Link>
      </div>
    </article>
  );
}
