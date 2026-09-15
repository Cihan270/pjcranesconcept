/**
 * Find-page FAQ content keys.
 *
 * TODO(business): Replace neutral answers with verified PJ Cranes policy copy
 * for sourcing timelines and inspection involvement before enabling FAQ JSON-LD.
 */
export const FIND_FAQ_IDS = [
  "stockVsSource",
  "whatToShare",
  "howLong",
  "brands",
  "inspection",
  "docsTransport",
] as const;

export type FindFaqId = (typeof FIND_FAQ_IDS)[number];
