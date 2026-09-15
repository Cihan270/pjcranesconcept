import type { ComponentProps } from "react";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  capacityClasses,
  capacityClassSearchParams,
  isInCapacityClass,
} from "@/data/capacity-classes";

type AppHref = ComponentProps<typeof Link>["href"];

type CapacityClassesProps = {
  /** Capacities (kg) of all available cranes. */
  capacitiesKg: number[];
};

export async function CapacityClasses({ capacitiesKg }: CapacityClassesProps) {
  const t = await getTranslations("Home.capacity");

  const tiles = capacityClasses.map((item) => ({
    id: item.id,
    href: `/cranes?${capacityClassSearchParams(item)}` as AppHref,
    range: t(`classes.${item.id}.range`),
    label: t(`classes.${item.id}.label`),
    description: t(`classes.${item.id}.description`),
    count: capacitiesKg.filter((kg) => isInCapacityClass(kg, item)).length,
  }));

  return (
    <section className="border-t border-line bg-surface" aria-label={t("title")}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("subtitle")}
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10 md:mt-12">
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((tile) => (
              <li key={tile.id} className="bg-surface">
                <Link
                  href={tile.href}
                  aria-label={t("linkLabel", {
                    label: tile.label,
                    count: tile.count,
                  })}
                  className="focus-ring group relative flex h-full min-h-[13rem] flex-col p-6 transition-colors hover:bg-charcoal md:p-7"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />
                  <p className="font-heading text-4xl leading-none font-semibold tracking-tight tabular-nums transition-colors group-hover:text-surface md:text-[2.75rem]">
                    {tile.range}
                    <span className="ml-1 text-lg font-medium text-steel transition-colors group-hover:text-surface/60">
                      t
                    </span>
                  </p>
                  <p className="mt-3 font-heading text-base font-semibold tracking-tight transition-colors group-hover:text-surface">
                    {tile.description}
                  </p>
                  <p className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-sm font-medium text-steel tabular-nums transition-colors group-hover:border-white/15 group-hover:text-brand">
                    {t("inStock", { count: tile.count })}
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
