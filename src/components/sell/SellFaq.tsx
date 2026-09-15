import { getTranslations } from "next-intl/server";
import { FaqList } from "@/components/faq/FaqList";
import { Reveal } from "@/components/shared/Reveal";
import { SELL_FAQ_IDS } from "@/data/sell-faq";

export async function SellFaq() {
  const t = await getTranslations("Sell.faq");

  const items = SELL_FAQ_IDS.map((id) => ({
    id,
    question: t(`items.${id}.question`),
    answer: t(`items.${id}.answer`),
  }));

  return (
    <section
      className="border-b border-line bg-background"
      aria-labelledby="sell-faq-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 md:py-14 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <Reveal className="space-y-3 text-center">
            <p className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase">
              {t("eyebrow")}
            </p>
            <h2
              id="sell-faq-title"
              className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
            >
              {t("title")}
            </h2>
          </Reveal>

          <Reveal delay={0.06} className="mt-8">
            <FaqList items={items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
