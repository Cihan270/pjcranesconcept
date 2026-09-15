/**
 * Services hub FAQ content keys.
 *
 * TODO(business): Align answers with verified PJ Cranes service scope
 * before enabling FAQ JSON-LD.
 */
export const SERVICES_FAQ_IDS = [
  "whatIncluded",
  "pricing",
  "stockOrSource",
  "international",
  "transportDocs",
  "contact",
] as const;

export type ServicesFaqId = (typeof SERVICES_FAQ_IDS)[number];
