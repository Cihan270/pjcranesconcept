import { NETWORK_OFFICE_IDS } from "@/data/network";

/**
 * Verified company facts from pj-cranes.com.
 * Prefer these constants over hardcoding contact/legal details in UI.
 */
export const company = {
  legalName: "PJ Cranes B.V.",
  brandName: "PJ Cranes",
  address: {
    street: "Riddererf 11P",
    postalCode: "3861 PT",
    city: "Nijkerk",
    country: "Netherlands",
    countryCode: "NL",
  },
  /**
   * Approximate WGS84 center for the verified Nijkerk head-office address.
   * Used for map display and LocalBusiness geo only — directions use the address string.
   */
  geo: {
    latitude: 52.2264,
    longitude: 5.4867,
  },
  email: "info@pj-cranes.com",
  phone: {
    display: "(+31) 033 20 48 020",
    tel: "+31332048020",
    /** General / reception line */
    role: "general" as const,
  },
  mobile: {
    display: "+31 6 10 04 41 46",
    tel: "+31610044146",
    label: "Sales",
    role: "sales" as const,
  },
  /**
   * WhatsApp CTA stays off until a number is explicitly confirmed for operations.
   * Set to a full international number (digits only, no +) when verified.
   */
  whatsapp: null as string | null,
  kvk: "87020254",
  vat: "NL864179200B01",
  contacts: [
    { name: "Fatih Pinarci", role: "Sales" },
    { name: "Roman Makarewicz", role: "Sales" },
  ],
  experienceYears: 20,
  capacityRangeTons: { min: 20, max: 1000 },
  /** Derived from verified network office ids — keep single source in network.ts */
  internationalOffices: NETWORK_OFFICE_IDS.length,
  manufacturers: [
    "Liebherr",
    "Grove",
    "Terex-Demag",
    "Tadano Faun",
  ] as const,
  /**
   * Social presence names are known; only render links when `href` is a verified URL.
   * Keep `href` typed as `string | null` (not `as const` null) so URLs can be filled in later.
   */
  socialLinks: [
    { id: "facebook", label: "Facebook", href: null as string | null },
    { id: "instagram", label: "Instagram", href: null as string | null },
    { id: "linkedin", label: "LinkedIn", href: null as string | null },
  ],
  /** @deprecated Prefer socialLinks — kept for any legacy string joins */
  socialNetworks: ["Facebook", "Instagram", "LinkedIn"] as const,
  siteUrl: "https://www.pj-cranes.com",
} as const;

export type Company = typeof company;

export type SocialLink = {
  id: string;
  label: string;
  href: string | null;
};

/** Social entries with a verified profile URL. */
export function getConfiguredSocialLinks(): Array<{
  id: string;
  label: string;
  href: string;
}> {
  const configured: Array<{ id: string; label: string; href: string }> = [];
  for (const link of company.socialLinks) {
    if (typeof link.href === "string" && link.href.length > 0) {
      configured.push({ id: link.id, label: link.label, href: link.href });
    }
  }
  return configured;
}

/** Google Maps search URL for the verified Nijkerk head-office address. */
export function getHeadquartersMapUrl(): string {
  const { street, postalCode, city, country } = company.address;
  const query = encodeURIComponent(
    `${street}, ${postalCode} ${city}, ${country}`,
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Privacy-friendly OpenStreetMap embed URL centered on the Nijkerk HQ. */
export function getHeadquartersOsmEmbedUrl(): string {
  const { latitude, longitude } = company.geo;
  const delta = 0.008;
  const bbox = [
    longitude - delta,
    latitude - delta * 0.7,
    longitude + delta,
    latitude + delta * 0.7,
  ]
    .map((n) => n.toFixed(5))
    .join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude.toFixed(5)}%2C${longitude.toFixed(5)}`;
}
