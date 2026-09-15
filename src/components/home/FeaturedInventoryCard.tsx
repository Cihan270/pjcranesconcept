import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  formatCapacityTons,
  formatHours,
  formatMileageKm,
} from "@/lib/inventory/format";
import type { Crane } from "@/types/crane";

type FeaturedInventoryCardProps = {
  crane: Crane;
  /** Data-backed label: new arrival, or null to derive from status. */
  editorialBadge?: "new_arrival" | "featured" | null;
  priority?: boolean;
};

function CraneImagePlaceholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[linear-gradient(160deg,#e8e8e4_0%,#d8d8d2_48%,#ecece8_100%)]"
      role="img"
      aria-label={label}
    >
      <span
        className="size-8 border border-line/80 bg-surface/40"
        aria-hidden
      />
      <span className="font-heading text-[0.6rem] font-semibold tracking-[0.18em] text-steel uppercase">
        {label}
      </span>
    </div>
  );
}

export async function FeaturedInventoryCard({
  crane,
  editorialBadge = null,
  priority = false,
}: FeaturedInventoryCardProps) {
  const t = await getTranslations("Crane");
  const tFeatured = await getTranslations("Home.featured");
  const locale = await getLocale();
  const href = `/cranes/${crane.slug}`;
  const image =
    crane.images.find((item) => item.primary) ?? crane.images[0] ?? null;
  const capacity = formatCapacityTons(crane.capacityKg, locale);
  const mileage = formatMileageKm(crane.mileageKm, locale);
  const hours = formatHours(
    crane.operatingHours ?? crane.hoursSuperstructure ?? crane.hoursCarrier,
    locale,
  );
  const imageAlt = image?.alt || `${crane.manufacturer} ${crane.model}`;

  const availabilityLabel =
    editorialBadge === "new_arrival"
      ? tFeatured("newArrival")
      : crane.status === "available"
        ? tFeatured("directAvailable")
        : t(`status.${crane.status}`);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {image ? (
          <Image
            src={image.src}
            alt={imageAlt}
            fill
            preload={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 48vw, (max-width: 1280px) 38vw, 31vw"
            className="object-cover object-[center_40%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <CraneImagePlaceholder label={tFeatured("noImage")} />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-charcoal/0 motion-safe:transition-colors motion-safe:duration-500 motion-safe:group-hover:bg-charcoal/10"
          aria-hidden
        />
        <span className="pointer-events-none absolute top-3 left-3 bg-charcoal/90 px-2 py-1 font-heading text-[0.65rem] font-semibold tracking-wider text-brand uppercase">
          {availabilityLabel}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-3.5 md:p-4">
        <div className="space-y-0.5">
          <p className="font-heading text-[0.65rem] font-semibold tracking-[0.18em] text-steel uppercase">
            {crane.manufacturer}
          </p>
          <h3 className="font-heading text-lg leading-tight font-semibold tracking-tight">
            <Link
              href={href}
              className="focus-ring rounded-[var(--radius)] after:absolute after:inset-0 after:z-[1] after:content-[''] hover:text-steel"
            >
              {crane.model}
            </Link>
          </h3>
        </div>

        <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line pt-2.5 text-sm">
          <div>
            <dt className="text-[0.65rem] tracking-wide text-steel uppercase">
              {t("year")}
            </dt>
            <dd className="mt-0.5 font-medium tabular-nums">{crane.year}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] tracking-wide text-steel uppercase">
              {t("capacity")}
            </dt>
            <dd className="mt-0.5 font-medium tabular-nums">
              {t("tons", { value: capacity })}
            </dd>
          </div>
          {hours ? (
            <div>
              <dt className="text-[0.65rem] tracking-wide text-steel uppercase">
                {t("hours")}
              </dt>
              <dd className="mt-0.5 font-medium tabular-nums">{hours}</dd>
            </div>
          ) : null}
          {mileage ? (
            <div>
              <dt className="text-[0.65rem] tracking-wide text-steel uppercase">
                {t("mileage")}
              </dt>
              <dd className="mt-0.5 font-medium tabular-nums">{mileage}</dd>
            </div>
          ) : null}
          {!hours && !mileage ? (
            <div>
              <dt className="text-[0.65rem] tracking-wide text-steel uppercase">
                {t("hours")}
              </dt>
              <dd className="mt-0.5 font-medium tabular-nums">—</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-[0.65rem] tracking-wide text-steel uppercase">
              {t("location")}
            </dt>
            <dd className="mt-0.5 truncate font-medium">
              {crane.location ?? "—"}
            </dd>
          </div>
        </dl>

        <Link
          href={href}
          className="focus-ring group/link relative z-[2] inline-flex min-h-9 w-fit items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-steel"
        >
          {t("viewMachine")}
          <ArrowRight
            className="size-4 text-brand transition-transform duration-300 group-hover/link:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}
