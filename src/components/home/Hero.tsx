import { getLocale, getTranslations } from "next-intl/server";
import { HeroView } from "@/components/home/HeroView";
import { company } from "@/data/company";
import type { CraneImage } from "@/types/crane";

type HeroProps = {
  image?: CraneImage | null;
  /** Available cranes, shown on the inventory CTA. */
  stockCount: number;
};

function formatFactNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    value,
  );
}

export async function Hero({ image, stockCount }: HeroProps) {
  const t = await getTranslations("Home");
  const locale = await getLocale();

  const minTons = formatFactNumber(company.capacityRangeTons.min, locale);
  const maxTons = formatFactNumber(company.capacityRangeTons.max, locale);

  return (
    <section className="relative isolate flex min-h-[36rem] w-full flex-col overflow-hidden bg-charcoal text-surface -mt-20 md:min-h-[42rem] md:h-[min(82svh,46rem)] lg:-mt-[5.5rem] lg:min-h-[44rem] lg:h-[min(80svh,48rem)] xl:h-[min(78svh,50rem)]">
      <HeroView
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle", { min: minTons, max: maxTons })}
        ctaInventory={t("ctaInventoryCount", { count: stockCount })}
        ctaSell={t("ctaSell")}
        findLink={t("findLink")}
        trust={[
          {
            value: t("trust.capacityValue", { min: minTons, max: maxTons }),
            label: t("trust.capacityLabel"),
          },
          {
            value: t("trust.officesValue", {
              count: company.internationalOffices,
            }),
            label: t("trust.officesLabel"),
          },
          {
            value: t("trust.experienceValue", {
              years: company.experienceYears,
            }),
            label: t("trust.experienceLabel"),
          },
        ]}
        image={image}
      />
    </section>
  );
}
