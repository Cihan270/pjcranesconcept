import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { AboutSplit } from "@/components/home/AboutSplit";
import { BrandStrip } from "@/components/home/BrandStrip";
import { CapacityClasses } from "@/components/home/CapacityClasses";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { Hero } from "@/components/home/Hero";
import { InternationalBand } from "@/components/home/InternationalBand";
import { NewsletterBand } from "@/components/home/NewsletterBand";
import { ProcessSection } from "@/components/home/ProcessSection";
import { QuickSearch } from "@/components/home/QuickSearch";
import { RecentlySold } from "@/components/home/RecentlySold";
import { SellCtaBand } from "@/components/home/SellCtaBand";
import { ServicesEditorial } from "@/components/home/ServicesEditorial";
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

  const searchInventory = available.items.map((crane) => ({
    manufacturer: crane.manufacturer,
    model: crane.model,
    reference: crane.reference,
    slug: crane.slug,
    description: crane.description,
    features: crane.features,
    capacityKg: crane.capacityKg,
  }));

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
      <Hero image={primaryImage(featured[0])} stockCount={available.total} />
      <QuickSearch inventory={searchInventory} />
      <FeaturedInventory cranes={featured} newestDateAdded={newestDateAdded} />
      <CapacityClasses
        capacitiesKg={available.items.map((crane) => crane.capacityKg)}
      />
      <ServicesEditorial />
      <AboutSplit
        image={primaryImage(featured[1]) ?? primaryImage(featured[0])}
        stockCount={available.total}
      />
      <ProcessSection />
      <SellCtaBand />
      <RecentlySold
        cranes={sold.items.filter((crane) => crane.images.length > 0).slice(0, 4)}
        soldTotal={sold.total}
      />
      <InternationalBand />
      <BrandStrip brands={brands} />
      <SourcingBlock />
      <NewsletterBand />
    </PageShell>
  );
}
