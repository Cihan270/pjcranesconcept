import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { company } from "@/data/company";
import { Reveal } from "@/components/shared/Reveal";

export async function Positioning() {
  const t = await getTranslations("Home.positioning");

  const points = [
    {
      label: t("experienceLabel"),
      value: t("experienceValue", { years: company.experienceYears }),
    },
    {
      label: t("capacityLabel"),
      value: t("capacityValue", {
        min: company.capacityRangeTons.min,
        max: company.capacityRangeTons.max,
      }),
    },
    {
      label: t("officesLabel"),
      value: t("officesValue", { count: company.internationalOffices }),
    },
  ] as const;

  return (
    <section className="border-y border-line bg-surface" aria-labelledby="positioning-title">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 py-16 md:gap-14 md:px-8 md:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:px-12 lg:py-24">
        <Reveal>
          <div className="max-w-xl space-y-5">
            <p className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase">
              {t("eyebrow")}
            </p>
            <h2
              id="positioning-title"
              className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.75rem]"
            >
              {t("title")}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("body", { city: company.address.city })}
            </p>
            <Link
              href="/about"
              className="focus-ring group mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground/80 underline decoration-line underline-offset-[0.35em] transition-colors hover:text-foreground hover:decoration-brand"
            >
              {t("cta")}
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="divide-y divide-line border-y border-line">
            {points.map((point, index) => (
              <li
                key={point.label}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 gap-y-1 py-6 first:pt-5 last:pb-5 md:gap-x-6 md:py-7"
              >
                <span
                  className="font-heading text-sm font-semibold tabular-nums text-brand"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 space-y-1.5">
                  <p className="font-heading text-[1.75rem] leading-none font-semibold tracking-tight text-foreground sm:text-3xl md:text-[2.125rem]">
                    {point.value}
                  </p>
                  <p className="text-xs font-medium tracking-[0.16em] text-steel uppercase">
                    {point.label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
