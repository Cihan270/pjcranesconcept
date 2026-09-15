/** Content models for FAQ, news, and services pages. */

export type FaqItem = {
  id: string;
  /** Stable key for next-intl dictionaries (Faq.items.<id>.question / .answer). */
  questionKey: string;
  answerKey: string;
  /** Verified EN copy from pj-cranes.com/en/faq — use until locale dictionaries are filled. */
  question: string;
  answer: string;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  coverImage?: string;
  draft?: boolean;
};

export type ServiceSlug =
  | "overview"
  | "buy"
  | "sell"
  | "find"
  | "transport-shipping"
  | "documentation-export";

export type ServiceItem = {
  id: ServiceSlug;
  slug: string;
  /** next-intl key under Services.<id>.* */
  titleKey: string;
  summaryKey: string;
  /** EN fallback copy. */
  title: string;
  summary: string;
  href: string;
  /** Background photo for homepage accordion panels. */
  image: {
    src: string;
    alt: string;
    /** CSS object-position for consistent focal framing. */
    objectPosition?: string;
  };
};
