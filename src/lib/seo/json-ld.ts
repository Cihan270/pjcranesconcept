import { company } from "@/data/company";
import { offices } from "@/data/offices";
import type { Crane } from "@/types/crane";
import type { FaqItem } from "@/types/content";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/site";
import type { AppLocale } from "@/i18n/routing";

export type JsonLd = Record<string, unknown>;

/** Verified office Places only — never invent street/phone/email. */
function organizationLocations(): JsonLd[] {
  return offices.map((office) => {
    const place: JsonLd = {
      "@type": "Place",
      name: office.hq
        ? `${company.brandName} headquarters`
        : `${company.brandName} ${office.country}`,
      address: {
        "@type": "PostalAddress",
        addressCountry: office.countryCode,
        ...(office.city ? { addressLocality: office.city } : {}),
        ...(office.street ? { streetAddress: office.street } : {}),
        ...(office.postalCode ? { postalCode: office.postalCode } : {}),
      },
    };

    if (office.phone) {
      place.telephone = office.phone.tel;
    }
    if (office.email) {
      place.email = office.email;
    }

    return place;
  });
}

/** Organization + LocalBusiness (Nijkerk HQ + verified office presence). */
export function organizationJsonLd(): JsonLd {
  const site = getSiteUrl();
  const social = company.socialLinks
    .map((link) => link.href)
    .filter((href): href is string => typeof href === "string" && href.length > 0);

  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${site}/#organization`,
    name: company.legalName,
    alternateName: company.brandName,
    url: site,
    email: company.email,
    telephone: company.phone.tel,
    vatID: company.vat,
    identifier: {
      "@type": "PropertyValue",
      name: "KvK",
      value: company.kvk,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressCountry: company.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: company.geo.latitude,
      longitude: company.geo.longitude,
    },
    areaServed: "Worldwide",
    logo: `${site}/brand/logo.svg`,
    location: organizationLocations(),
  };

  if (social.length > 0) {
    jsonLd.sameAs = social;
  }

  return jsonLd;
}

export type BreadcrumbItem = {
  name: string;
  /** Path without locale, or absolute URL. */
  path?: string;
};

export function breadcrumbJsonLd(
  locale: AppLocale | string,
  items: BreadcrumbItem[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const entry: JsonLd = {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
      };
      if (item.path !== undefined) {
        entry.item =
          item.path.startsWith("http")
            ? item.path
            : absoluteUrl(locale, item.path);
      }
      return entry;
    }),
  };
}

/** FAQPage schema from verified FAQ copy (or localized strings passed in). */
export function faqPageJsonLd(
  items: Array<Pick<FaqItem, "question" | "answer">>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Product-like schema for a crane listing.
 * Omits offers/price when none is published (live site is enquiry-only).
 */
export function craneProductJsonLd(
  locale: AppLocale | string,
  crane: Crane,
): JsonLd {
  const url = absoluteUrl(locale, `/cranes/${crane.slug}`);
  const images = crane.images.map((img) => img.src).filter(Boolean);
  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${crane.manufacturer} ${crane.model}`,
    sku: crane.reference,
    brand: {
      "@type": "Brand",
      name: crane.manufacturer,
    },
    model: crane.model,
    category: "Mobile crane",
    url,
    description:
      crane.description ??
      `${crane.manufacturer} ${crane.model} (${crane.year}), ref. ${crane.reference}`,
  };

  if (images.length > 0) {
    jsonLd.image = images;
  }

  if (crane.year) {
    jsonLd.releaseDate = String(crane.year);
  }

  if (typeof crane.price === "number" && crane.currency) {
    jsonLd.offers = {
      "@type": "Offer",
      url,
      priceCurrency: crane.currency,
      price: crane.price,
      availability: crane.sold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    };
  }

  return jsonLd;
}

/** Safe script payload — escape `<` to avoid XSS via JSON-LD. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
