import { getLocale, getTranslations } from "next-intl/server";
import { formatCapacityTons } from "@/lib/inventory/format";
import type { Crane } from "@/types/crane";
import { cn } from "cn";

type CraneSpecificationsProps = {
  crane: Crane;
  className?: string;
};

export async function CraneSpecifications({
  crane,
  className,
}: CraneSpecificationsProps) {
  const t = await getTranslations("Crane");
  const tSpec = await getTranslations("Crane.spec");
  const tDetail = await getTranslations("CraneDetail");
  const locale = await getLocale();

  const overview: Array<{ label: string; value: string }> = [
    { label: t("reference"), value: crane.reference },
    { label: t("year"), value: String(crane.year) },
    {
      label: t("capacity"),
      value: t("tons", {
        value: formatCapacityTons(crane.capacityKg, locale),
      }),
    },
  ];

  if (crane.operatingHours !== undefined) {
    overview.push({
      label: t("hours"),
      value: `${crane.operatingHours.toLocaleString()} h`,
    });
  }
  if (crane.hoursSuperstructure !== undefined) {
    overview.push({
      label: tDetail("hoursSuperstructure"),
      value: `${crane.hoursSuperstructure.toLocaleString()} h`,
    });
  }
  if (crane.hoursCarrier !== undefined) {
    overview.push({
      label: tDetail("hoursCarrier"),
      value: `${crane.hoursCarrier.toLocaleString()} h`,
    });
  }
  if (crane.mileageKm !== undefined) {
    overview.push({
      label: t("mileage"),
      value: `${crane.mileageKm.toLocaleString()} km`,
    });
  }
  if (crane.location) {
    overview.push({ label: t("location"), value: crane.location });
  }

  return (
    <section className={cn("space-y-8", className)}>
      <div>
        <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {tDetail("specsTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {tDetail("specsSubtitle")}
        </p>
      </div>

      <dl className="grid gap-x-6 gap-y-4 border-t border-line sm:grid-cols-2">
        {overview.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-line py-3"
          >
            <dt className="text-sm text-steel">{row.label}</dt>
            <dd className="text-right text-sm font-medium tabular-nums">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {crane.specifications.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-t border-line text-sm">
            <caption className="sr-only">{tDetail("technicalCaption")}</caption>
            <tbody>
              {crane.specifications.map((spec) => (
                <tr key={`${spec.key}-${spec.value}`} className="border-b border-line">
                  <th
                    scope="row"
                    className="py-3 pr-4 text-left font-normal text-steel"
                  >
                    {spec.label ?? tSpec(spec.key)}
                  </th>
                  <td className="py-3 text-right font-medium tabular-nums">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {crane.features.length > 0 ? (
        <div>
          <h3 className="font-heading text-lg font-semibold tracking-tight">
            {tDetail("featuresTitle")}
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {crane.features.map((feature) => (
              <li
                key={feature}
                className="border-l-2 border-brand pl-3 text-sm leading-relaxed"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
