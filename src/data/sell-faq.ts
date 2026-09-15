/**
 * Sell-page FAQ content keys.
 *
 * TODO(business): Replace neutral answers with verified PJ Cranes policy copy
 * for documentation/transport involvement and response timing before enabling FAQ JSON-LD.
 */
export const SELL_FAQ_IDS = [
  "whichCranes",
  "allSpecs",
  "photos",
  "valuation",
  "docsTransport",
  "responseTime",
] as const;

export type SellFaqId = (typeof SELL_FAQ_IDS)[number];
