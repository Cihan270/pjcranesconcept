import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/shared/Reveal";
import {
  WorldNetworkMap,
  type NetworkMapCopy,
} from "@/components/about/WorldNetworkMap";
import type { NetworkOfficeId } from "@/data/network";
import type { OfficeRegion, OfficeType } from "@/data/offices";

export async function WorldwideNetwork() {
  const t = await getTranslations("About.network");

  const copy: NetworkMapCopy = {
    legendOffice: t("legendOffice"),
    legendMarket: t("legendMarket"),
    hqBadge: t("hqBadge"),
    selectHint: t("selectHint"),
    mapLabel: t("mapLabel"),
    dismiss: t("dismiss"),
    contactCta: t("contactCta"),
    regionLabel: t("regionLabel"),
    typeLabel: t("typeLabel"),
    phoneLabel: t("phoneLabel"),
    emailLabel: t("emailLabel"),
    listHeading: t("listHeading"),
    regions: {
      americas: t("regions.americas"),
      europe: t("regions.europe"),
      "middle-east": t("regions.middle-east"),
    } satisfies Record<OfficeRegion, string>,
    types: {
      headquarters: t("types.headquarters"),
      international: t("types.international"),
    } satisfies Record<OfficeType, string>,
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
    <section id="network" className="scroll-mt-24 bg-charcoal text-surface">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal className="mx-auto mb-8 max-w-2xl space-y-3 text-center md:mb-10">
          <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-surface/70">
            {t("description")}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <WorldNetworkMap copy={copy} />
        </Reveal>
      </div>
    </section>
  );
}
