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
import { craneDisplayName } from "@/lib/inventory/format";
import { getCraneBySlug } from "@/lib/inventory/repository";
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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // `?like=<slug>` comes from a sold listing: prefill the request with that machine.
  const { like } = await searchParams;
  const likeSlug = Array.isArray(like) ? like[0] : like;
  const likeCrane = likeSlug ? await getCraneBySlug(likeSlug) : null;
  const similarTo = likeCrane
    ? {
        name: craneDisplayName(likeCrane),
        reference: likeCrane.reference,
        manufacturer: likeCrane.manufacturer,
        model: likeCrane.model,
        type: likeCrane.type,
        year: likeCrane.year,
        capacityTons: Math.round(likeCrane.capacityKg / 1000),
      }
    : null;

  return (
    <PageShell bleed className="gap-0 py-0">
      <FindHero />
      <FindTrustBar />
      <FindFormSection similarTo={similarTo} />
      <FindInventoryCta />
      <FindFaq />
      <FindFinalCta />
    </PageShell>
  );
}
