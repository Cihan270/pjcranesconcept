import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { ServiceFeaturesSection } from "@/components/services/ServiceFeaturesSection";
import { ServiceFinalCta } from "@/components/services/ServiceFinalCta";
import {
  ServiceSubpageHero,
  ServiceSubpageHeroCta,
} from "@/components/services/ServiceSubpageHero";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

const FEATURE_KEYS = ["scope", "pricing", "coordination"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Services.transportPage",
  });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/services/transport-shipping",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function TransportShippingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Services.transportPage");
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");

  return (
    <PageShell bleed className="gap-0 py-0">
      <ServiceSubpageHero
        breadcrumbs={[
          { label: tNav("home"), href: "/" },
          { label: tNav("services"), href: "/services" },
          { label: tFooter("transport") },
        ]}
        badge={t("hero.badge")}
        title={t("hero.title")}
        body={t("hero.body")}
        titleId="transport-hero-title"
        action={
          <ServiceSubpageHeroCta href="/contact" label={t("cta")} />
        }
      />

      <ServiceFeaturesSection
        eyebrow={t("featuresSection.eyebrow")}
        title={t("featuresSection.title")}
        body={t("featuresSection.body")}
        titleId="transport-features-title"
        features={FEATURE_KEYS.map((key) => ({
          key,
          title: t(`features.${key}.title`),
          body: t(`features.${key}.body`),
        }))}
      />

      <ServiceFinalCta
        titleId="transport-final-cta-title"
        title={t("finalCta.title")}
        body={t("finalCta.body")}
        contactLabel={t("finalCta.contact")}
        callLabel={t("finalCta.callSales")}
      />
    </PageShell>
  );
}
