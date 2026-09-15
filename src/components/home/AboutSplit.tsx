import Image from "next/image";
import { ArrowRight, Check, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CountUp } from "@/components/shared/CountUp";
import { Reveal } from "@/components/shared/Reveal";
import { company } from "@/data/company";
import type { CraneImage } from "@/types/crane";
import { cn } from "cn";

type AboutSplitProps = {
  /** Real inventory photo — never decorative stock art. */
  image?: CraneImage | null;
  stockCount: number;
};

const CHECKLIST_KEYS = ["specs", "logistics", "contact"] as const;

export async function AboutSplit({ image = null, stockCount }: AboutSplitProps) {
  const t = await getTranslations("Home.about");
  const locale = await getLocale();
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale).format(value);

  return (
    <section aria-labelledby="about-title">
      <div className="bg-surface">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:py-24">
          <Reveal className="relative isolate">
            <div
              className="absolute -bottom-3 -left-3 hidden h-2/3 w-2/3 bg-brand md:block"
              aria-hidden
            />
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[center_40%]"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-[linear-gradient(150deg,#141416_0%,#252528_52%,#141416_100%)]"
                  aria-hidden
                />
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="max-w-xl space-y-5">
              <p className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase">
                {t("eyebrow")}
              </p>
              <h2
                id="about-title"
                className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.65rem]"
              >
                {t("title")}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {t("body", {
                  city: company.address.city,
                  years: company.experienceYears,
                  brands: company.manufacturers.join(", "),
                })}
              </p>

              <ul className="space-y-3 pt-1">
                {CHECKLIST_KEYS.map((key) => (
                  <li key={key} className="flex items-start gap-3 text-[0.95rem]">
                    <span
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-brand text-brand-foreground"
                      aria-hidden
                    >
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                    {t(`checklist.${key}`)}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/about"
                  className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] bg-charcoal px-6 text-sm font-medium text-surface transition-colors hover:bg-charcoal/90"
                >
                  {t("ctaAbout")}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
                <a
                  href={`tel:${company.phone.tel}`}
                  className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] border border-line bg-background px-6 text-sm font-medium tabular-nums transition-colors hover:border-foreground/30"
                >
                  <Phone className="size-4 text-steel" aria-hidden />
                  {company.phone.display}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="bg-charcoal text-surface">
        <dl className="mx-auto grid w-full max-w-[1440px] grid-cols-2 px-4 md:px-8 lg:grid-cols-4 lg:px-12">
          {[
            {
              key: "experience",
              value: (
                <CountUp
                  value={company.experienceYears}
                  suffix="+"
                  locale={locale}
                />
              ),
            },
            {
              key: "capacity",
              value: `${formatNumber(company.capacityRangeTons.min)}–${formatNumber(company.capacityRangeTons.max)}`,
            },
            {
              key: "offices",
              value: (
                <CountUp value={company.internationalOffices} locale={locale} />
              ),
            },
            {
              key: "stock",
              value: <CountUp value={stockCount} locale={locale} />,
            },
          ].map((stat, index) => (
            <div
              key={stat.key}
              className={cn(
                "flex flex-col-reverse justify-end gap-2 border-white/10 py-8 md:py-10",
                index % 2 === 1 && "border-l pl-5 md:pl-8",
                index === 2 && "lg:border-l lg:pl-8",
                index >= 2 && "border-t lg:border-t-0",
              )}
            >
              <dt className="text-xs font-medium tracking-[0.16em] text-surface/60 uppercase">
                {t(`stats.${stat.key}`)}
              </dt>
              <dd className="font-heading text-4xl leading-none font-semibold tracking-tight text-brand tabular-nums md:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
