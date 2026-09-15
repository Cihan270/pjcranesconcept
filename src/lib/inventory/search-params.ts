import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import {
  craneSorts,
  craneStatuses,
  craneTypes,
  type CraneFilterParams,
  type CraneSort,
  type CraneStatus,
  type CraneType,
} from "@/types/crane";

export const inventoryViewModes = ["grid", "list"] as const;
export type InventoryViewMode = (typeof inventoryViewModes)[number];

/**
 * Shared nuqs parsers for inventory filters/sort/view.
 * Import from this module on the server; clients re-export via inventoryParsers.
 */
export const inventoryParsers = {
  q: parseAsString.withDefault(""),
  manufacturer: parseAsArrayOf(parseAsString).withDefault([]),
  model: parseAsArrayOf(parseAsString).withDefault([]),
  type: parseAsArrayOf(parseAsStringLiteral(craneTypes)).withDefault([]),
  yearMin: parseAsInteger,
  yearMax: parseAsInteger,
  capacityMinKg: parseAsInteger,
  capacityMaxKg: parseAsInteger,
  mileageMaxKm: parseAsInteger,
  hoursMax: parseAsInteger,
  availability: parseAsArrayOf(parseAsStringLiteral(craneStatuses)).withDefault(
    [],
  ),
  includeSold: parseAsBoolean.withDefault(false),
  sort: parseAsStringLiteral(craneSorts).withDefault("newest"),
  view: parseAsStringLiteral(inventoryViewModes).withDefault("grid"),
};

export const inventorySearchParamsCache =
  createSearchParamsCache(inventoryParsers);

export type InventorySearchParams = {
  q: string;
  manufacturer: string[];
  model: string[];
  type: CraneType[];
  yearMin: number | null;
  yearMax: number | null;
  capacityMinKg: number | null;
  capacityMaxKg: number | null;
  mileageMaxKm: number | null;
  hoursMax: number | null;
  availability: CraneStatus[];
  includeSold: boolean;
  sort: CraneSort;
  view: InventoryViewMode;
};

function nonEmpty<T>(values: T[]): T[] | undefined {
  return values.length > 0 ? values : undefined;
}

/** Map URL/search state onto repository filter params. */
export function toCraneFilterParams(
  params: InventorySearchParams,
): CraneFilterParams {
  return {
    q: params.q.trim() || undefined,
    manufacturer: nonEmpty(params.manufacturer),
    model: nonEmpty(params.model),
    type: nonEmpty(params.type),
    yearMin: params.yearMin ?? undefined,
    yearMax: params.yearMax ?? undefined,
    capacityMinKg: params.capacityMinKg ?? undefined,
    capacityMaxKg: params.capacityMaxKg ?? undefined,
    mileageMaxKm: params.mileageMaxKm ?? undefined,
    hoursMax: params.hoursMax ?? undefined,
    availability: nonEmpty(params.availability),
    includeSold: params.includeSold,
    sort: params.sort,
  };
}

export function countActiveFilters(params: InventorySearchParams): number {
  let count = 0;
  if (params.q.trim()) count += 1;
  if (params.manufacturer.length) count += 1;
  if (params.model.length) count += 1;
  if (params.type.length) count += 1;
  if (params.yearMin !== null) count += 1;
  if (params.yearMax !== null) count += 1;
  if (params.capacityMinKg !== null) count += 1;
  if (params.capacityMaxKg !== null) count += 1;
  if (params.mileageMaxKm !== null) count += 1;
  if (params.hoursMax !== null) count += 1;
  if (params.availability.length) count += 1;
  if (params.includeSold) count += 1;
  return count;
}

export const inventoryFilterDefaults = {
  q: "",
  manufacturer: [] as string[],
  model: [] as string[],
  type: [] as CraneType[],
  yearMin: null as number | null,
  yearMax: null as number | null,
  capacityMinKg: null as number | null,
  capacityMaxKg: null as number | null,
  mileageMaxKm: null as number | null,
  hoursMax: null as number | null,
  availability: [] as CraneStatus[],
  includeSold: false,
  sort: "newest" as CraneSort,
  view: "grid" as InventoryViewMode,
};
