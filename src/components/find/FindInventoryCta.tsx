import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";

export async function FindInventoryCta() {
  const t = await getTranslations("Find.inventoryCta");

  return (
    <section
      className="border-b border-line bg-surface"
      aria-labelledby="find-inventory-cta-title"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between md:gap-10 md:px-8 md:py-14 lg:px-12">
        <Reveal className="max-w-xl space-y-3">
          <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="find-inventory-cta-title"
            className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("body")}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <Link
            href="/cranes"
            className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] border border-line bg-background px-6 text-sm font-medium text-foreground transition-colors hover:border-brand hover:bg-brand hover:text-brand-foreground"
          >
            {t("cta")}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
