import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactCompanyDetails } from "@/components/contact/ContactCompanyDetails";
import { ContactFinalCta } from "@/components/contact/ContactFinalCta";
import { ContactHeadOffice } from "@/components/contact/ContactHeadOffice";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMainSection } from "@/components/contact/ContactMainSection";
import { ContactQuickRoutes } from "@/components/contact/ContactQuickRoutes";
import { ContactSalesContacts } from "@/components/contact/ContactSalesContacts";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { resolveContactSubjectKey } from "@/lib/validators/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/contact",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = await searchParams;
  const subjectKey = resolveContactSubjectKey(firstParam(query.subject));
  const craneReference =
    firstParam(query.reference) ??
    firstParam(query.ref) ??
    firstParam(query.crane) ??
    "";
  const craneSlug = firstParam(query.slug) ?? "";

  const tNav = await getTranslations("Nav");

  return (
    <PageShell bleed className="gap-0 py-0">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav("home"), path: "/" },
          { name: tNav("contact"), path: "/contact" },
        ])}
      />

      <ContactHero />
      <ContactQuickRoutes />
      <ContactMainSection
        defaultSubjectKey={subjectKey}
        craneReference={craneReference}
        craneSlug={craneSlug}
      />
      <ContactSalesContacts />
      <ContactHeadOffice />
      <ContactCompanyDetails />
      <ContactFinalCta />
    </PageShell>
  );
}
