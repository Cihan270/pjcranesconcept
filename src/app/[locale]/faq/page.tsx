import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FaqList } from "@/components/faq/FaqList";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getFaqItems } from "@/data/faq";
import type { AppLocale } from "@/i18n/routing";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Faq" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/faq",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Faq");
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");
  const items = getFaqItems();

  const localized = items.map((item) => {
    // questionKey/answerKey are full paths (Faq.items.<id>.*); strip namespace.
    const questionPath = item.questionKey.replace(/^Faq\./, "");
    const answerPath = item.answerKey.replace(/^Faq\./, "");
    return {
      id: item.id,
      question: t(questionPath),
      answer: t(answerPath),
    };
  });

  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: tNav("home"), path: "/" },
            { name: tFooter("faq"), path: "/faq" },
          ]),
          faqPageJsonLd(localized),
        ]}
      />

      <Breadcrumbs
        className="mb-8"
        items={[
          { label: tNav("home"), href: "/" },
          { label: tFooter("faq") },
        ]}
      />

      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        className="mb-10"
        action={
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center text-sm font-medium underline-offset-4 hover:underline"
          >
            {t("cta")}
          </Link>
        }
      />

      <FaqList items={localized} />
    </PageShell>
  );
}
