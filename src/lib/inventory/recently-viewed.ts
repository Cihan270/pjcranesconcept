const STORAGE_KEY = "pj-cranes:recently-viewed";
const MAX_ITEMS = 8;

/** Client-only helper — never blocks rendering if storage is unavailable. */
export function rememberCraneSlug(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readRecentlyViewedSlugs().filter((item) => item !== slug);
    const next = [slug, ...existing].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function readRecentlyViewedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}
