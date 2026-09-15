import type { MetadataRoute } from "next";
import { getNewsArticles } from "@/data/news";
import { getCranes } from "@/lib/inventory/repository";
import { routing } from "@/i18n/routing";
import { staticAppPaths } from "@/lib/seo/routes";
import { absoluteUrl, languageAlternates } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ items: cranes }, news] = await Promise.all([
    getCranes({ includeSold: true }),
    Promise.resolve(getNewsArticles()),
  ]);

  const dynamicPaths = [
    ...cranes.map((crane) => `/cranes/${crane.slug}`),
    ...news.map((article) => `/news/${article.slug}`),
  ];

  const paths = [...staticAppPaths, ...dynamicPaths];
  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: path.startsWith("/cranes/")
          ? "weekly"
          : path === "" || path === "/cranes"
            ? "daily"
            : "monthly",
        priority:
          path === ""
            ? 1
            : path === "/cranes"
              ? 0.9
              : path.startsWith("/cranes/")
                ? 0.8
                : 0.6,
        alternates: {
          languages: languageAlternates(path),
        },
      });
    }
  }

  return entries;
}
