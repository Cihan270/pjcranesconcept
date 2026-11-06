import { getLocale, getTranslations } from "next-intl/server";
import { HeroView } from "@/components/home/HeroView";
import { company } from "@/data/company";

/** Fixed homepage hero photo (public/images). Swap the file to change it. */
const HERO_IMAGE_SRC = "/images/hero-crane-dusk.webp";

type HeroProps = {
  /** Available cranes, shown on the inventory CTA. */
  stockCount: number;
};

function formatFactNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    value,
  );
}

export async function Hero({ stockCount }: HeroProps) {
  const t = await getTranslations("Home");
  const locale = await getLocale();

  const minTons = formatFactNumber(company.capacityRangeTons.min, locale);
  const maxTons = formatFactNumber(company.capacityRangeTons.max, locale);

  return (
    <section className="relative isolate flex min-h-[36rem] w-full flex-col overflow-hidden bg-charcoal text-surface md:min-h-[42rem] md:h-[min(82svh,46rem)] lg:min-h-[38rem] lg:h-[min(72svh,36vw)]">
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
        image={{ src: HERO_IMAGE_SRC, alt: t("heroImageAlt") }}
      />
    </section>
  );
}
