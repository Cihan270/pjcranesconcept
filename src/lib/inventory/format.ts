/**
 * Display helpers for inventory specs.
 * Pure functions — safe in Server and Client Components.
 */

export function formatCapacityTons(capacityKg: number, locale = "en"): string {
  const tons = capacityKg / 1000;
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: tons % 1 === 0 ? 0 : 1,
  }).format(tons);
}

export function formatCapacityKg(capacityKg: number, locale = "en"): string {
  return `${new Intl.NumberFormat(locale).format(capacityKg)} kg`;
}

export function formatMileageKm(
  mileageKm: number | undefined,
  locale = "en",
): string | undefined {
  if (mileageKm === undefined) return undefined;
  return `${new Intl.NumberFormat(locale).format(mileageKm)} km`;
}

export function formatHours(
  hours: number | undefined,
  locale = "en",
): string | undefined {
  if (hours === undefined) return undefined;
  return `${new Intl.NumberFormat(locale).format(hours)} h`;
}

export function craneDisplayName(crane: {
  manufacturer: string;
  model: string;
}): string {
  return `${crane.manufacturer} ${crane.model}`;
}

const DAY_MS = 86_400_000;

/**
 * True when `dateAdded` falls within `windowDays` of the newest stock date.
 * Uses inventory dates only — no wall-clock “today” assumptions.
 */
export function isRecentlyAdded(
  dateAdded: string,
  newestInStock: string,
  windowDays = 45,
): boolean {
  const added = Date.parse(dateAdded);
  const newest = Date.parse(newestInStock);
  if (Number.isNaN(added) || Number.isNaN(newest)) return false;
  return newest - added <= windowDays * DAY_MS;
}

/** Editorial badge for featured placements, only when data supports it. */
export function craneEditorialBadge(
  crane: { featured: boolean; dateAdded: string },
  newestInStock: string,
): "new_arrival" | "featured" | null {
  if (isRecentlyAdded(crane.dateAdded, newestInStock)) return "new_arrival";
  if (crane.featured) return "featured";
  return null;
}
