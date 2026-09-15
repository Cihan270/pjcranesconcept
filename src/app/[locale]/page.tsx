import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { BrandStrip } from "@/components/home/BrandStrip";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { FindCtaBand } from "@/components/home/FindCtaBand";
import { Hero } from "@/components/home/Hero";
import { InternationalBand } from "@/components/home/InternationalBand";
import { InventorySearchEntry } from "@/components/home/InventorySearchEntry";
import { NewsletterBand } from "@/components/home/NewsletterBand";
import { Positioning } from "@/components/home/Positioning";
import { ProcessSection } from "@/components/home/ProcessSection";
import { SellCtaBand } from "@/components/home/SellCtaBand";
import { ServicesEditorial } from "@/components/home/ServicesEditorial";
import {
  getCranes,
  getFeaturedCranes,
  getManufacturers,
} from "@/lib/inventory/repository";

export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [featured, manufacturers, available] = await Promise.all([
    getFeaturedCranes(8),
    getManufacturers(),
    getCranes({ includeSold: false }),
  ]);

  const searchInventory = available.items.map((crane) => ({
    manufacturer: crane.manufacturer,
    model: crane.model,
    reference: crane.reference,
    slug: crane.slug,
    description: crane.description,
    features: crane.features,
    year: crane.year,
    capacityKg: crane.capacityKg,
  }));

  const years = [
    ...new Set(available.items.map((crane) => crane.year)),
  ].sort((a, b) => b - a);

  const capacityTons = [
    ...new Set(
      available.items.map((crane) => Math.round(crane.capacityKg / 1000)),
    ),
  ].sort((a, b) => a - b);

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

  const heroImage =
    featured[0]?.images.find((image) => image.primary) ??
    featured[0]?.images[0] ??
    null;

  return (
    <PageShell bleed>
      <Hero image={heroImage} />
      <InventorySearchEntry
        manufacturers={manufacturers}
        years={years}
        capacityTons={capacityTons}
        inventory={searchInventory}
      />
      <FeaturedInventory
        cranes={featured}
        newestDateAdded={
          available.items.reduce(
            (latest, crane) =>
              !latest || crane.dateAdded > latest ? crane.dateAdded : latest,
            "",
          ) || undefined
        }
      />
      <FindCtaBand
        image={
          featured[1]?.images.find((item) => item.primary) ??
          featured[1]?.images[0] ??
          featured[0]?.images.find((item) => item.primary) ??
          featured[0]?.images[0] ??
          null
        }
      />
      <Positioning />
      <ServicesEditorial />
      <ProcessSection />
      <SellCtaBand />
      <InternationalBand />
      <BrandStrip brands={brands} />
      <NewsletterBand />
    </PageShell>
  );
}
