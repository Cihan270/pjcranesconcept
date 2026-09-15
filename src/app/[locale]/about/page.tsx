import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutExpertise } from "@/components/about/AboutExpertise";
import { AboutFinalCta } from "@/components/about/AboutFinalCta";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutStory } from "@/components/about/AboutStory";
import { WorldwideNetwork } from "@/components/about/WorldwideNetwork";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/about",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("Nav");

  return (
    <PageShell bleed>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav("home"), path: "/" },
          { name: tNav("about"), path: "/about" },
        ])}
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 pt-6 md:px-8 md:pt-8 lg:px-12">
        <Breadcrumbs
          className="mb-6 md:mb-8"
          items={[
            { label: tNav("home"), href: "/" },
            { label: tNav("about") },
          ]}
        />
      </div>

      <AboutHero />
      <AboutStats />
      <WorldwideNetwork />
      <AboutStory />
      <AboutExpertise />
      <AboutFinalCta />
    </PageShell>
  );
}
