/**
 * Office ids for the network map and homepage international band.
 * Full office records: src/data/offices.ts
 * Paths/markers: src/data/maps/world-network.svg.json (node scripts/generate-world-map.mjs)
 */
export type NetworkOfficeId =
  | "usa"
  | "netherlands"
  | "germany"
  | "turkiye"
  | "dubai";

export const NETWORK_OFFICE_IDS = [
  "usa",
  "netherlands",
  "germany",
  "turkiye",
  "dubai",
] as const satisfies readonly NetworkOfficeId[];
