import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/shared/Reveal";
import { aboutStatsSource } from "@/data/about";

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    value,
  );
}

export async function AboutStats() {
  const t = await getTranslations("About.stats");
  const locale = await getLocale();

  const items = [
    {
      value: t("experienceValue", {
        years: formatNumber(aboutStatsSource.experienceYears, locale),
      }),
      label: t("experienceLabel"),
    },
    {
      value: t("officesValue", {
        count: formatNumber(aboutStatsSource.officeCount, locale),
      }),
      label: t("officesLabel"),
    },
    {
      value: t("capacityValue", {
        min: formatNumber(aboutStatsSource.capacityMin, locale),
        max: formatNumber(aboutStatsSource.capacityMax, locale),
      }),
      label: t("capacityLabel"),
    },
    {
      value: t("brandsValue", {
        count: formatNumber(aboutStatsSource.brandCount, locale),
      }),
      label: t("brandsLabel"),
    },
  ] as const;

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12">
        <Reveal>
          <ul className="grid grid-cols-2 divide-x divide-y divide-line lg:grid-cols-4 lg:divide-y-0">
            {items.map((item) => (
              <li
                key={item.label}
                className="relative flex flex-col gap-1.5 px-4 py-7 sm:px-6 sm:py-8"
              >
                <span
                  className="absolute top-0 left-4 h-0.5 w-6 bg-brand sm:left-6"
                  aria-hidden
                />
                <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums text-foreground sm:text-4xl">
                  {item.value}
                </p>
                <p className="text-xs font-medium tracking-[0.16em] text-steel uppercase">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
