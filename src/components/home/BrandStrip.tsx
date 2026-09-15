import type { ComponentProps } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";

type AppHref = ComponentProps<typeof Link>["href"];

export type BrandStripItem = {
  name: string;
  count: number;
};

type BrandStripProps = {
  brands: BrandStripItem[];
};

function brandHref(name: string): AppHref {
  return `/cranes?manufacturer=${encodeURIComponent(name)}` as AppHref;
}

export async function BrandStrip({ brands }: BrandStripProps) {
  const t = await getTranslations("Home.brands");

  if (brands.length === 0) {
    return null;
  }

  return (
    <section
      className="border-y border-line bg-background"
      aria-labelledby="brands-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-12 lg:px-12">
        <Reveal>
          <div className="max-w-md space-y-2">
            <p
              id="brands-title"
              className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase"
            >
              {t("eyebrow")}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-8 md:mt-10">
          <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => {
              const countLabel = t("availableCount", { count: brand.count });
              const showCount = brand.count > 0;

              return (
                <li key={brand.name} className="border-b border-line">
                  <Link
                    href={brandHref(brand.name)}
                    className="focus-ring group flex min-h-14 items-baseline gap-2.5 py-4 transition-colors hover:bg-foreground/[0.02] sm:px-1"
                    aria-label={
                      showCount
                        ? t("linkLabel", {
                            name: brand.name,
                            count: brand.count,
                          })
                        : brand.name
                    }
                  >
                    <span className="font-heading text-2xl font-semibold tracking-tight text-foreground/80 transition-colors group-hover:text-foreground sm:text-[1.65rem]">
                      {brand.name}
                    </span>
                    {showCount ? (
                      <>
                        <span
                          className="text-brand/70 transition-colors group-hover:text-brand"
                          aria-hidden
                        >
                          ·
                        </span>
                        <span className="text-xs font-medium tracking-[0.04em] text-steel tabular-nums transition-colors group-hover:text-foreground/70">
                          {countLabel}
                        </span>
                      </>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
