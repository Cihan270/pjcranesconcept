import type { NewsArticle } from "@/types/content";

/**
 * News index is empty on the live site.
 * Keep a typed empty list (and optional stub) so routes/sitemap can stay empty-ready.
 */
export const newsArticles: NewsArticle[] = [];

/** Structural stub — set draft: false when ready to publish. */
export const newsStub: NewsArticle = {
  id: "welcome",
  slug: "welcome-to-pj-cranes",
  title: "Welcome to the PJ Cranes newsroom",
  excerpt:
    "Market updates, new arrivals and company news will appear here soon.",
  body: "This is a structural placeholder. The live site currently has no published news articles.",
  publishedAt: "2025-05-01",
  draft: true,
};

export function getNewsArticles(options?: {
  includeDrafts?: boolean;
}): NewsArticle[] {
  const includeDrafts = options?.includeDrafts ?? false;
  return newsArticles.filter((article) => includeDrafts || !article.draft);
}

export function getNewsArticleBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
): NewsArticle | undefined {
  const includeDrafts = options?.includeDrafts ?? false;
  const pool = includeDrafts
    ? [...newsArticles, newsStub]
    : getNewsArticles();
  return pool.find((article) => article.slug === slug);
}
