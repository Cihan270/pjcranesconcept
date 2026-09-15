import { cranes as mockCranes } from "@/data/cranes";
import type {
  Crane,
  CraneFilterParams,
  CraneListResult,
  CraneSort,
  CraneStatus,
  CraneType,
} from "@/types/crane";

/**
 * Inventory repository adapter.
 * V1 reads local mock data. Replace the `loadAll` implementation later
 * (Supabase / CRM) without changing UI call sites.
 */

export type InventoryRepository = {
  getCranes: (filters?: CraneFilterParams) => Promise<CraneListResult>;
  getCraneBySlug: (slug: string) => Promise<Crane | null>;
  getCraneByReference: (reference: string) => Promise<Crane | null>;
  getFeaturedCranes: (limit?: number) => Promise<Crane[]>;
  getRelatedCranes: (slug: string, limit?: number) => Promise<Crane[]>;
  getManufacturers: () => Promise<string[]>;
  getModels: (manufacturer?: string) => Promise<string[]>;
};

function loadAll(): Crane[] {
  return mockCranes;
}

function asArray<T extends string>(value: T | T[] | undefined): T[] | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value : [value];
}

function primaryHours(crane: Crane): number | undefined {
  return (
    crane.operatingHours ??
    crane.hoursSuperstructure ??
    crane.hoursCarrier
  );
}

function matchesQuery(crane: Crane, q: string): boolean {
  const haystack = [
    crane.manufacturer,
    crane.model,
    crane.reference,
    crane.slug,
    crane.description ?? "",
    ...crane.features,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}

function compareCranes(a: Crane, b: Crane, sort: CraneSort): number {
  switch (sort) {
    case "year_desc":
      return b.year - a.year;
    case "year_asc":
      return a.year - b.year;
    case "capacity_desc":
      return b.capacityKg - a.capacityKg;
    case "capacity_asc":
      return a.capacityKg - b.capacityKg;
    case "manufacturer_asc": {
      const byMfr = a.manufacturer.localeCompare(b.manufacturer);
      return byMfr !== 0 ? byMfr : a.model.localeCompare(b.model);
    }
    case "newest":
    default:
      return (
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
  }
}

export function filterCranes(
  items: Crane[],
  filters: CraneFilterParams = {},
): Crane[] {
  const manufacturers = asArray(filters.manufacturer)?.map((m) =>
    m.toLowerCase(),
  );
  const models = asArray(filters.model)?.map((m) => m.toLowerCase());
  const types = asArray(filters.type as CraneType | CraneType[] | undefined);
  const availability = asArray(
    filters.availability as CraneStatus | CraneStatus[] | undefined,
  );
  const includeSold = filters.includeSold ?? false;
  const sort = filters.sort ?? "newest";

  let result = items.filter((crane) => {
    if (!includeSold && (crane.sold || crane.status === "sold")) {
      return false;
    }
    if (filters.q && !matchesQuery(crane, filters.q)) return false;
    if (
      manufacturers &&
      !manufacturers.includes(crane.manufacturer.toLowerCase())
    ) {
      return false;
    }
    if (models && !models.includes(crane.model.toLowerCase())) return false;
    if (types && !types.includes(crane.type)) return false;
    if (availability && !availability.includes(crane.status)) return false;
    if (filters.featured !== undefined && crane.featured !== filters.featured) {
      return false;
    }
    if (filters.yearMin !== undefined && crane.year < filters.yearMin) {
      return false;
    }
    if (filters.yearMax !== undefined && crane.year > filters.yearMax) {
      return false;
    }
    if (
      filters.capacityMinKg !== undefined &&
      crane.capacityKg < filters.capacityMinKg
    ) {
      return false;
    }
    if (
      filters.capacityMaxKg !== undefined &&
      crane.capacityKg > filters.capacityMaxKg
    ) {
      return false;
    }
    if (
      filters.mileageMaxKm !== undefined &&
      (crane.mileageKm === undefined || crane.mileageKm > filters.mileageMaxKm)
    ) {
      return false;
    }
    if (filters.hoursMax !== undefined) {
      const hours = primaryHours(crane);
      if (hours === undefined || hours > filters.hoursMax) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => compareCranes(a, b, sort));
  return result;
}

async function getCranes(
  filters: CraneFilterParams = {},
): Promise<CraneListResult> {
  const items = filterCranes(loadAll(), filters);
  return { items, total: items.length };
}

async function getCraneBySlug(slug: string): Promise<Crane | null> {
  return loadAll().find((crane) => crane.slug === slug) ?? null;
}

async function getCraneByReference(reference: string): Promise<Crane | null> {
  const normalized = reference.trim().toUpperCase();
  return (
    loadAll().find((crane) => crane.reference.toUpperCase() === normalized) ??
    null
  );
}

async function getFeaturedCranes(limit = 6): Promise<Crane[]> {
  const { items } = await getCranes({
    featured: true,
    sort: "newest",
    includeSold: false,
  });
  return items.slice(0, limit);
}

async function getRelatedCranes(slug: string, limit = 4): Promise<Crane[]> {
  const current = await getCraneBySlug(slug);
  if (!current) return [];

  const candidates = loadAll().filter(
    (crane) =>
      crane.slug !== slug &&
      !crane.sold &&
      crane.status !== "sold" &&
      (crane.manufacturer === current.manufacturer ||
        crane.type === current.type ||
        Math.abs(crane.capacityKg - current.capacityKg) <= 50_000),
  );

  candidates.sort((a, b) => {
    const score = (crane: Crane) => {
      let value = 0;
      if (crane.manufacturer === current.manufacturer) value += 3;
      if (crane.model === current.model) value += 2;
      if (crane.type === current.type) value += 1;
      return value;
    };
    return score(b) - score(a);
  });

  return candidates.slice(0, limit);
}

async function getManufacturers(): Promise<string[]> {
  return [...new Set(loadAll().map((crane) => crane.manufacturer))].sort();
}

async function getModels(manufacturer?: string): Promise<string[]> {
  const items = manufacturer
    ? loadAll().filter(
        (crane) =>
          crane.manufacturer.toLowerCase() === manufacturer.toLowerCase(),
      )
    : loadAll();
  return [...new Set(items.map((crane) => crane.model))].sort();
}

export const inventoryRepository: InventoryRepository = {
  getCranes,
  getCraneBySlug,
  getCraneByReference,
  getFeaturedCranes,
  getRelatedCranes,
  getManufacturers,
  getModels,
};

export {
  getCranes,
  getCraneBySlug,
  getCraneByReference,
  getFeaturedCranes,
  getRelatedCranes,
  getManufacturers,
  getModels,
};
