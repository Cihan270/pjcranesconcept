import { getTranslations } from "next-intl/server";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { company } from "@/data/company";
import { Reveal } from "@/components/shared/Reveal";

export async function SellCtaBand() {
  const t = await getTranslations("Home.sellCta");

  return (
    <section
      className="relative overflow-hidden bg-charcoal text-surface"
      aria-labelledby="sell-cta-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_35%,rgba(250,191,3,0.16),transparent_48%),radial-gradient(ellipse_at_92%_75%,rgba(250,191,3,0.07),transparent_42%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-18deg, transparent, transparent 11px, rgba(250,250,248,0.9) 11px, rgba(250,250,248,0.9) 12px)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-brand/50 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-14 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] md:items-center md:gap-12 md:px-8 md:py-16 lg:gap-16 lg:px-12 lg:py-16">
        <Reveal className="max-w-xl space-y-4">
          <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="sell-cta-title"
            className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-surface/70">
            {t("body")}
          </p>
        </Reveal>

        <Reveal
          delay={0.06}
          className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-end md:justify-self-end lg:flex-row lg:items-center"
        >
          <Link
            href="/sell-your-crane"
            className="focus-ring group inline-flex min-h-12 w-fit max-w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            {t("cta")}
            <ArrowRight
              className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <a
            href={`tel:${company.phone.tel}`}
            className="focus-ring inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-[var(--radius)] border border-surface/30 px-6 text-sm font-medium text-surface transition-colors hover:border-surface/70 hover:bg-surface/10"
          >
            <Phone className="size-4 text-brand" aria-hidden />
            {t("call")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
