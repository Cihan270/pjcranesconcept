/**
 * Public marketing/static routes (English segments, as briefed).
 * Used by sitemap and metadata helpers — keep in sync with App Router pages.
 */
export const staticAppPaths = [
  "",
  "/cranes",
  "/sell-your-crane",
  "/find-a-crane",
  "/services",
  "/services/transport-shipping",
  "/services/documentation-export",
  "/about",
  "/contact",
  "/news",
  "/faq",
  "/terms",
] as const;

export type StaticAppPath = (typeof staticAppPaths)[number];

/** Primary nav destinations (header / mobile). */
export const primaryNavLinks = [
  { href: "/cranes", key: "cranes" },
  { href: "/find-a-crane", key: "find" },
  { href: "/sell-your-crane", key: "sell" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export type PrimaryNavKey = (typeof primaryNavLinks)[number]["key"];
