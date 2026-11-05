import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";
import {
  InternationalNetworkMap,
  type InternationalNetworkMapCopy,
} from "@/components/home/InternationalNetworkMap";
import { officeCount, type NetworkOfficeId } from "@/data/offices";

export async function InternationalBand() {
  const t = await getTranslations("Home.international");

  const mapCopy: InternationalNetworkMapCopy = {
    mapLabel: t("mapLabel"),
    hqBadge: t("hqBadge"),
    regionLabel: t("regionLabel"),
    typeLabel: t("typeLabel"),
    regions: {
      americas: t("regions.americas"),
      europe: t("regions.europe"),
      "middle-east": t("regions.middleEast"),
    },
    types: {
      headquarters: t("types.headquarters"),
      international: t("types.international"),
    },
    phoneLabel: t("phoneLabel"),
    emailLabel: t("emailLabel"),
    listHeading: t("listHeading"),
    offices: {
      usa: {
        city: t("offices.usa.city"),
        country: t("offices.usa.country"),
      },
      netherlands: {
        city: t("offices.netherlands.city"),
        country: t("offices.netherlands.country"),
      },
      turkiye: {
        city: t("offices.turkiye.city"),
        country: t("offices.turkiye.country"),
      },
      dubai: {
        city: t("offices.dubai.city"),
        country: t("offices.dubai.country"),
      },
    } satisfies Record<NetworkOfficeId, { city: string; country: string }>,
  };

  return (
    <section className="bg-charcoal text-surface" aria-labelledby="international-title">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 py-20 md:px-8 md:py-24 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16 lg:px-12 lg:py-28">
        <Reveal>
          <div className="max-w-xl space-y-5">
            <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              {t("eyebrow")}
            </p>
            <h2
              id="international-title"
              className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.75rem]"
            >
              {t("title")}
            </h2>
            <p className="text-base leading-relaxed text-surface/70 md:text-lg">
              {t("body", { count: officeCount })}
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/about#network"
                className="focus-ring group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] bg-brand px-5 text-sm font-semibold text-charcoal transition-colors hover:bg-accent"
              >
                {t("ctaOffices")}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/contact"
                className="focus-ring inline-flex min-h-12 flex-1 items-center justify-center rounded-[var(--radius)] border border-surface/25 px-5 text-sm font-medium text-surface transition-colors hover:border-surface/60 hover:bg-surface/10"
              >
                {t("ctaContact")}
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <InternationalNetworkMap copy={mapCopy} />
        </Reveal>
      </div>
    </section>
  );
}
