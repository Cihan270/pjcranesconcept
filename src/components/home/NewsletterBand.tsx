import { getTranslations } from "next-intl/server";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/shared/Reveal";

export async function NewsletterBand() {
  const t = await getTranslations("Home.newsletter");

  return (
    <section className="relative overflow-hidden bg-charcoal text-surface">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(250,191,3,0.08),transparent_42%)]"
        aria-hidden
      />
      <div className="relative mx-auto grid w-full max-w-[1440px] gap-6 px-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] md:items-center md:gap-10 md:px-8 md:py-12 lg:px-12">
        <Reveal className="space-y-2.5 md:space-y-3">
          <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="font-heading text-2xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-3xl md:text-[2.25rem]">
            {t("title")}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-surface/70 md:text-base">
            {t("subtitle")}
          </p>
        </Reveal>
        <Reveal delay={0.08} className="relative">
          <NewsletterForm inverted />
        </Reveal>
      </div>
    </section>
  );
}
