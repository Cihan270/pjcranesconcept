import { notFound } from "next/navigation";

/**
 * Catches unknown paths inside a locale (e.g. /de/xyz) so they render the
 * localized `[locale]/not-found.tsx` with header and footer, instead of
 * Next's bare global 404.
 */
export default function CatchAllNotFound() {
  notFound();
}
