import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CraneActions } from "@/components/cranes/CraneActions";
import { CraneEnquiryPanel } from "@/components/cranes/CraneEnquiryPanel";
import { CraneGallery } from "@/components/cranes/CraneGallery";
import { CraneSpecifications } from "@/components/cranes/CraneSpecifications";
import { DatasheetPrintHeader } from "@/components/cranes/DatasheetPrintHeader";
import { RelatedCranes } from "@/components/cranes/RelatedCranes";
import { RememberCraneView } from "@/components/cranes/RememberCraneView";
import { SoldCranePanel } from "@/components/cranes/SoldCranePanel";
import { StickyMobileCta } from "@/components/cranes/StickyMobileCta";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ShareButton } from "@/components/shared/ShareButton";
import { Reveal } from "@/components/shared/Reveal";
import {
  getCraneBySlug,
  getRelatedCranes,
} from "@/lib/inventory/repository";
import { craneDisplayName } from "@/lib/inventory/format";
import { cranes as mockCranes } from "@/data/cranes";
import {
  breadcrumbJsonLd,
  craneProductJsonLd,
} from "@/lib/seo/json-ld";
import { buildCraneMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";
import { routing, type AppLocale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    mockCranes.map((crane) => ({ locale, slug: crane.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cranes/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const crane = await getCraneBySlug(slug);
  if (!crane) {
    const t = await getTranslations({ locale, namespace: "CraneDetail" });
    return { title: t("notFoundTitle") };
  }
  return buildCraneMetadata(locale as AppLocale, crane);
}

export default async function CraneDetailPage({
  params,
}: PageProps<"/[locale]/cranes/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const crane = await getCraneBySlug(slug);
  if (!crane) notFound();

  const related = await getRelatedCranes(crane.slug, 4);
  const t = await getTranslations("CraneDetail");
  const tNav = await getTranslations("Nav");
  const tCrane = await getTranslations("Crane");
  const tType = await getTranslations("Crane.type");
  const name = craneDisplayName(crane);
  const sold = crane.sold || crane.status === "sold";

  return (
    <>
      <RememberCraneView slug={crane.slug} />
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tNav("home"), path: "/" },
            { name: tNav("cranes"), path: "/cranes" },
            { name, path: `/cranes/${crane.slug}` },
          ]),
          craneProductJsonLd(locale, crane),
        ]}
      />
      <PageShell className="pb-28 lg:pb-10 print:p-0">
        <DatasheetPrintHeader
          craneReference={crane.reference}
          url={absoluteUrl(locale, `/cranes/${crane.slug}`)}
        />
        <div className="print:hidden">
          <Breadcrumbs
            items={[
              { label: tNav("home"), href: "/" },
              { label: tNav("cranes"), href: "/cranes" },
              { label: name },
            ]}
          />
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,22rem)] lg:items-start xl:gap-12 print:mt-0 print:block">
          <div className="min-w-0 space-y-8 print:space-y-6">
            <Reveal mode="enter">
              <header className="space-y-3">
                <p className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-steel uppercase tabular-nums">
                  {sold ? (
                    <span className="bg-charcoal px-2 py-0.5 font-heading font-semibold tracking-[0.16em] text-brand">
                      {tCrane("status.sold")}
                    </span>
                  ) : null}
                  <span>
                    {tCrane("reference")} {crane.reference}
                    {sold ? null : ` · ${tCrane(`status.${crane.status}`)}`}
                  </span>
                </p>
                <h1 className="font-heading text-3xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                  {name}
                </h1>
                <p className="text-base text-muted-foreground">
                  {tType(crane.type)} · {crane.year}
                  {crane.location ? ` · ${crane.location}` : null}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 print:hidden">
                  <ShareButton title={name} text={crane.description} />
                  <CraneActions sold={sold} />
                </div>
                <p className="hidden text-sm font-semibold print:block">
                  {sold ? tCrane("status.sold") : t("enquiry.priceOnRequest")}
                </p>
              </header>
            </Reveal>

            <CraneGallery images={crane.images} title={name} />

            {crane.description ? (
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                {crane.description}
              </p>
            ) : null}

            <CraneSpecifications crane={crane} />
          </div>

          <aside className="lg:sticky lg:top-24 print:hidden">
            {sold ? (
              <SoldCranePanel craneSlug={crane.slug} craneName={name} />
            ) : (
              <>
                <div id="enquiry" className="scroll-mt-28">
                  <CraneEnquiryPanel
                    craneReference={crane.reference}
                    craneSlug={crane.slug}
                    craneName={name}
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-steel">
                  {t("enquiry.disclaimer")}
                </p>
              </>
            )}
          </aside>
        </div>

        <RelatedCranes cranes={related} className="mt-16 print:hidden" />
      </PageShell>
      <StickyMobileCta
        {...(sold
          ? {
              enquiryHref: `/${locale}/find-a-crane?like=${encodeURIComponent(crane.slug)}#find-form`,
              enquireLabel: t("sold.findSimilarShort"),
            }
          : {})}
      />
    </>
  );
}
