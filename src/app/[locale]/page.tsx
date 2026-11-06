import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { AboutSplit } from "@/components/home/AboutSplit";
import { BrandStrip } from "@/components/home/BrandStrip";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { Hero } from "@/components/home/Hero";
import { InternationalBand } from "@/components/home/InternationalBand";
import { NewsletterBand } from "@/components/home/NewsletterBand";
import { ProcessSection } from "@/components/home/ProcessSection";
import { RecentlySold } from "@/components/home/RecentlySold";
import { SellCtaBand } from "@/components/home/SellCtaBand";
import { ServicesSection } from "@/components/home/ServicesSection";
import { SourcingBlock } from "@/components/home/SourcingBlock";
import { getCranes, getFeaturedCranes } from "@/lib/inventory/repository";
import type { Crane } from "@/types/crane";

function primaryImage(crane: Crane | undefined) {
  return crane?.images.find((image) => image.primary) ?? crane?.images[0] ?? null;
}

export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [featured, available, sold] = await Promise.all([
    getFeaturedCranes(8),
    getCranes({ includeSold: false }),
    getCranes({ includeSold: true, availability: "sold", sort: "newest" }),
  ]);

  const brandCounts = new Map<string, number>();
  for (const crane of available.items) {
    brandCounts.set(
      crane.manufacturer,
      (brandCounts.get(crane.manufacturer) ?? 0) + 1,
    );
  }
  const brands = [...brandCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const newestDateAdded =
    available.items.reduce(
      (latest, crane) =>
        !latest || crane.dateAdded > latest ? crane.dateAdded : latest,
      "",
    ) || undefined;

  return (
    <PageShell bleed>
      <Hero stockCount={available.total} />
      <ServicesSection />
      {/* Sections alternate dark / light; keep that rhythm when adding or moving one. */}
      <FeaturedInventory cranes={featured} newestDateAdded={newestDateAdded} />
      <BrandStrip brands={brands} />
      <ProcessSection />
      <AboutSplit
        image={primaryImage(featured[1]) ?? primaryImage(featured[0])}
        stockCount={available.total}
      />
      <SellCtaBand />
      <RecentlySold
        cranes={sold.items.filter((crane) => crane.images.length > 0).slice(0, 4)}
        soldTotal={sold.total}
      />
      <InternationalBand />
      <SourcingBlock />
      <NewsletterBand />
    </PageShell>
  );
}
