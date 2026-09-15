import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { ServicesHubFaq } from "@/components/services/ServicesHubFaq";
import { ServicesHubFinalCta } from "@/components/services/ServicesHubFinalCta";
import { ServicesHubHero } from "@/components/services/ServicesHubHero";
import { ServicesHubList } from "@/components/services/ServicesHubList";
import { ServicesHubProcess } from "@/components/services/ServicesHubProcess";
import { ServicesHubTrustBar } from "@/components/services/ServicesHubTrustBar";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services.hub" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/services",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell bleed className="gap-0 py-0">
      <ServicesHubHero />
      <ServicesHubTrustBar />
      <ServicesHubList />
      <ServicesHubProcess />
      <ServicesHubFaq />
      <ServicesHubFinalCta />
    </PageShell>
  );
}
