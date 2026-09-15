import { company } from "@/data/company";
import {
  NETWORK_OFFICE_IDS,
  type NetworkOfficeId,
} from "@/data/network";

/**
 * Reusable office network configuration.
 * Presence for five offices is verified via NETWORK_OFFICE_IDS / live site.
 * Full street/phone/email details are only confirmed for Nijkerk HQ —
 * do not invent contact data for other locations.
 */

export type OfficeRegion = "americas" | "europe" | "middle-east";

export type OfficeType = "headquarters" | "international";

export type OfficeContact = {
  display: string;
  tel: string;
};

export type Office = {
  id: NetworkOfficeId;
  region: OfficeRegion;
  type: OfficeType;
  hq: boolean;
  /** Verified city name, or null until confirmed */
  city: string | null;
  /** Country / market label confirmed in project content */
  country: string;
  countryCode: string;
  /** Verified street line, or null until confirmed */
  street: string | null;
  postalCode: string | null;
  phone: OfficeContact | null;
  email: string | null;
};

export const offices = [
  {
    id: "usa",
    region: "americas",
    type: "international",
    hq: false,
    // TODO: verify city, street address, phone, and email for USA office
    city: null,
    country: "USA",
    countryCode: "US",
    street: null,
    postalCode: null,
    phone: null,
    email: null,
  },
  {
    id: "netherlands",
    region: "europe",
    type: "headquarters",
    hq: true,
    city: company.address.city,
    country: company.address.country,
    countryCode: company.address.countryCode,
    street: company.address.street,
    postalCode: company.address.postalCode,
    phone: company.phone,
    email: company.email,
  },
  {
    id: "germany",
    region: "europe",
    type: "international",
    hq: false,
    // TODO: verify city, street address, phone, and email for Germany office
    city: null,
    country: "Germany",
    countryCode: "DE",
    street: null,
    postalCode: null,
    phone: null,
    email: null,
  },
  {
    id: "turkiye",
    region: "middle-east",
    type: "international",
    hq: false,
    // TODO: verify city, street address, phone, and email for Türkiye office
    city: null,
    country: "Türkiye",
    countryCode: "TR",
    street: null,
    postalCode: null,
    phone: null,
    email: null,
  },
  {
    id: "dubai",
    region: "middle-east",
    type: "international",
    hq: false,
    // City + UAE presence confirmed in About.network.offices ("Dubai, UAE")
    // TODO: verify street address, phone, and email for Dubai office
    city: "Dubai",
    country: "UAE",
    countryCode: "AE",
    street: null,
    postalCode: null,
    phone: null,
    email: null,
  },
] as const satisfies readonly Office[];

/** Verified office count — use for “vijf kantoren” / “five offices” copy. */
export const officeCount = NETWORK_OFFICE_IDS.length;

/** Live overview of the international office network (About page). */
export const officesOverviewHref = "/about#network" as const;

export function getHeadquartersOffice(): Office {
  const office = offices.find((item) => item.hq);
  if (!office) {
    throw new Error("Headquarters office is not configured");
  }
  return office;
}

export function getOfficeMapUrl(office: Office): string | null {
  if (!office.street || !office.city) return null;
  const parts = [
    office.street,
    [office.postalCode, office.city].filter(Boolean).join(" "),
    office.country,
  ].filter(Boolean);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(", "))}`;
}

export function getOfficeById(id: NetworkOfficeId): Office {
  const office = offices.find((item) => item.id === id);
  if (!office) {
    throw new Error(`Unknown office id: ${id}`);
  }
  return office;
}

export type { NetworkOfficeId };
