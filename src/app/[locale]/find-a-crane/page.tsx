import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FindFaq } from "@/components/find/FindFaq";
import { FindFinalCta } from "@/components/find/FindFinalCta";
import { FindFormSection } from "@/components/find/FindFormSection";
import { FindHero } from "@/components/find/FindHero";
import { FindInventoryCta } from "@/components/find/FindInventoryCta";
import { FindTrustBar } from "@/components/find/FindTrustBar";
import { PageShell } from "@/components/layout/PageShell";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Find" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/find-a-crane",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function FindACranePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell bleed className="gap-0 py-0">
      <FindHero />
      <FindTrustBar />
      <FindFormSection />
      <FindInventoryCta />
      <FindFaq />
      <FindFinalCta />
    </PageShell>
  );
}
