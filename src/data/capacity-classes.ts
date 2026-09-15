/**
 * Lifting-capacity bands used on the homepage (quick search, capacity tiles,
 * quick sourcing form). Bounds are inclusive and never overlap, so a crane
 * always falls in exactly one band.
 */
export const capacityClasses = [
  { id: "upTo60", minKg: null, maxKg: 60_000 },
  { id: "60to100", minKg: 60_001, maxKg: 100_000 },
  { id: "100to200", minKg: 100_001, maxKg: 200_000 },
  { id: "over200", minKg: 200_001, maxKg: null },
] as const satisfies ReadonlyArray<{
  id: string;
  minKg: number | null;
  maxKg: number | null;
}>;

export type CapacityClass = (typeof capacityClasses)[number];
export type CapacityClassId = CapacityClass["id"];

export function isInCapacityClass(
  capacityKg: number,
  capacityClass: CapacityClass,
): boolean {
  if (capacityClass.minKg !== null && capacityKg < capacityClass.minKg) {
    return false;
  }
  if (capacityClass.maxKg !== null && capacityKg > capacityClass.maxKg) {
    return false;
  }
  return true;
}

/** Query string for `/cranes` matching the inventory filter parsers. */
export function capacityClassSearchParams(
  capacityClass: CapacityClass,
): URLSearchParams {
  const params = new URLSearchParams();
  if (capacityClass.minKg !== null) {
    params.set("capacityMinKg", String(capacityClass.minKg));
  }
  if (capacityClass.maxKg !== null) {
    params.set("capacityMaxKg", String(capacityClass.maxKg));
  }
  return params;
}
