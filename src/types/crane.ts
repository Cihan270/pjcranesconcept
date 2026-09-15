/**
 * Inventory domain types for the crane marketplace.
 * Repository adapters return these shapes regardless of data source (mock → Supabase/CRM).
 */

export const craneTypes = [
  "mobile",
  "crawler",
  "all_terrain",
  "city",
  "rough_terrain",
  "other",
] as const;

export type CraneType = (typeof craneTypes)[number];

export const craneStatuses = [
  "available",
  "reserved",
  "sold",
  "on_request",
] as const;

export type CraneStatus = (typeof craneStatuses)[number];

/** Spec keys aligned with fields commonly shown on live listing pages. */
export const craneSpecKeys = [
  "boom",
  "flyJib",
  "drive",
  "transmission",
  "tyres",
  "engineSuperstructure",
  "engineCarrier",
  "lmi",
  "hookblocks",
  "counterweight",
  "winches",
  "weight",
  "other",
] as const;

export type CraneSpecKey = (typeof craneSpecKeys)[number];

export type CraneSpecification = {
  key: CraneSpecKey;
  /** Human-readable value as shown on the listing (e.g. "60 M", "6x8"). */
  value: string;
  label?: string;
};

export type CraneImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  primary?: boolean;
};

export type CraneDocument = {
  label: string;
  href: string;
  /** e.g. pdf — omitted when not available publicly. */
  type?: string;
};

export type CraneSeo = {
  title?: string;
  description?: string;
};

export type Crane = {
  id: string;
  slug: string;
  /** Stock / reference number (e.g. P1659). */
  reference: string;
  manufacturer: string;
  model: string;
  type: CraneType;
  year: number;
  capacityKg: number;
  mileageKm?: number;
  /** Primary hours figure when only one value is published. */
  operatingHours?: number;
  hoursSuperstructure?: number;
  hoursCarrier?: number;
  /** Public prices are not published on the live site — omit or leave undefined. */
  price?: number;
  currency?: string;
  location?: string;
  status: CraneStatus;
  /**
   * Short EN description for detail/enquiry copy.
   * Prefer message keys in UI when full i18n copy exists.
   */
  description?: string;
  descriptionKey?: string;
  specifications: CraneSpecification[];
  features: string[];
  images: CraneImage[];
  documents: CraneDocument[];
  dateAdded: string;
  featured: boolean;
  sold: boolean;
  seo?: CraneSeo;
};

export const craneSorts = [
  "newest",
  "year_desc",
  "year_asc",
  "capacity_desc",
  "capacity_asc",
  "manufacturer_asc",
] as const;

export type CraneSort = (typeof craneSorts)[number];

export type CraneFilterParams = {
  q?: string;
  manufacturer?: string | string[];
  model?: string | string[];
  type?: CraneType | CraneType[];
  yearMin?: number;
  yearMax?: number;
  capacityMinKg?: number;
  capacityMaxKg?: number;
  mileageMaxKm?: number;
  hoursMax?: number;
  availability?: CraneStatus | CraneStatus[];
  featured?: boolean;
  includeSold?: boolean;
  sort?: CraneSort;
};

export type CraneListResult = {
  items: Crane[];
  total: number;
};
