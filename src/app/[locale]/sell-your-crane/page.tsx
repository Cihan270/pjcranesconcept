import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { SellFaq } from "@/components/sell/SellFaq";
import { SellFinalCta } from "@/components/sell/SellFinalCta";
import { SellFormSection } from "@/components/sell/SellFormSection";
import { SellHero } from "@/components/sell/SellHero";
import { SellTrustBar } from "@/components/sell/SellTrustBar";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Sell" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/sell-your-crane",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function SellYourCranePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell bleed className="gap-0 py-0">
      <SellHero />
      <SellTrustBar />
      <SellFormSection />
      <SellFaq />
      <SellFinalCta />
    </PageShell>
  );
}
