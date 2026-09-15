import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";
import type { CraneImage } from "@/types/crane";

type FindCtaBandProps = {
  /** Optional real inventory photo for atmosphere — never decorative stock art. */
  image?: CraneImage | null;
};

export async function FindCtaBand({ image = null }: FindCtaBandProps) {
  const t = await getTranslations("Home.findCta");

  return (
    <section
      className="relative overflow-hidden bg-charcoal text-surface"
      aria-labelledby="find-cta-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_30%,rgba(250,191,3,0.14),transparent_45%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="flex flex-col justify-center gap-6 px-4 py-14 md:gap-7 md:px-8 md:py-16 lg:px-12 lg:py-16">
          <Reveal className="max-w-xl space-y-4">
            <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              {t("eyebrow")}
            </p>
            <h2
              id="find-cta-title"
              className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
            >
              {t("title")}
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-surface/70">
              {t("body")}
            </p>
          </Reveal>

          <Reveal delay={0.06} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/find-a-crane"
              className="focus-ring group inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
            >
              {t("cta")}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex min-h-11 w-fit items-center text-sm font-medium text-surface/85 underline decoration-surface/30 underline-offset-4 transition-colors hover:text-surface hover:decoration-brand"
            >
              {t("contact")}
            </Link>
          </Reveal>
        </div>

        {image ? (
          <div className="relative min-h-[12rem] border-t border-white/10 lg:min-h-0 lg:border-t-0 lg:border-l lg:border-white/10">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[center_40%] opacity-90"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-charcoal/20 lg:bg-gradient-to-r lg:from-charcoal lg:via-charcoal/50 lg:to-transparent"
              aria-hidden
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
