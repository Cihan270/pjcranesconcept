import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  craneDisplayName,
  formatCapacityTons,
  formatHours,
  formatMileageKm,
} from "@/lib/inventory/format";
import type { Crane } from "@/types/crane";
import { cn } from "cn";

type CraneCardProps = {
  crane: Crane;
  /** Priority image load for LCP listing tiles. */
  priority?: boolean;
  className?: string;
};

export async function CraneCard({
  crane,
  priority = false,
  className,
}: CraneCardProps) {
  const t = await getTranslations("Crane");
  const locale = await getLocale();
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
        "group relative flex flex-col border-b border-line pb-6",
        className,
      )}
    >
      <Link
        href={`/cranes/${crane.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-secondary"
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className="absolute inset-0 bg-[linear-gradient(135deg,#2a2a2e,#1b1b1d)]"
            aria-hidden
          />
        )}
        <span className="absolute top-3 left-3 bg-charcoal/85 px-2 py-1 font-heading text-[0.7rem] font-semibold tracking-wider text-brand uppercase">
          {t(`status.${crane.status}`)}
        </span>
      </Link>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <div className="space-y-1">
          <p className="text-xs tracking-wide text-steel uppercase tabular-nums">
            {t("reference")} {crane.reference}
          </p>
          <h3 className="font-heading text-xl leading-tight font-semibold tracking-tight md:text-[1.35rem]">
            <Link
              href={`/cranes/${crane.slug}`}
              className="focus-ring rounded-[var(--radius)] transition-colors hover:text-steel"
            >
              {name}
            </Link>
          </h3>
        </div>

        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-line pt-3 text-sm">
          <div>
            <dt className="text-xs text-steel">{t("year")}</dt>
            <dd className="font-medium tabular-nums">{crane.year}</dd>
          </div>
          <div>
            <dt className="text-xs text-steel">{t("capacity")}</dt>
            <dd className="font-medium tabular-nums">
              {t("tons", { value: capacity })}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-steel">
              {hours ? t("hours") : mileage ? t("mileage") : t("location")}
            </dt>
            <dd className="truncate font-medium tabular-nums">
              {hours ?? mileage ?? crane.location ?? "—"}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
