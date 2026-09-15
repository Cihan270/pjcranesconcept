import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InventoryMarketplace } from "@/components/cranes/InventoryMarketplace";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCranes,
  getManufacturers,
  getModels,
} from "@/lib/inventory/repository";
import { inventorySearchParamsCache } from "@/lib/inventory/search-params";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cranes">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Inventory" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/cranes",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

function InventoryFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(14rem,18rem)_1fr]">
      <div className="hidden space-y-3 lg:block">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-11 w-full max-w-md" />
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function CranesPage({
  params,
  searchParams,
}: PageProps<"/[locale]/cranes">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Inventory");
  const tNav = await getTranslations("Nav");

  await inventorySearchParamsCache.parse(searchParams);

  const [{ items: cranes }, manufacturers, models] = await Promise.all([
    getCranes({ includeSold: true, sort: "newest" }),
    getManufacturers(),
    getModels(),
  ]);

  return (
    <PageShell>
      <Breadcrumbs
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("cranes") },
        ]}
      />
      <SectionHeader
        className="mt-6 mb-10"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />
      <Suspense fallback={<InventoryFallback />}>
        <InventoryMarketplace
          cranes={cranes}
          manufacturers={manufacturers}
          models={models}
        />
      </Suspense>
    </PageShell>
  );
}
