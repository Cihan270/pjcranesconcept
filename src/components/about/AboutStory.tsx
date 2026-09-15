import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";
import { aboutImages } from "@/data/about";

export async function AboutStory() {
  const t = await getTranslations("About.story");
  const body = t.raw("body") as string[];

  return (
    <section className="bg-background">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-14 md:gap-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:px-12 lg:py-20">
        <Reveal className="space-y-5">
          <p className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="max-w-[18ch] font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl">
            {t("title")}
          </h2>
          <div className="max-w-xl space-y-4 text-base leading-relaxed text-muted-foreground">
            {body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/cranes"
              className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
            >
              {t("ctaInventory")}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/sell-your-crane"
              className="focus-ring inline-flex min-h-11 items-center rounded-[var(--radius)] border border-line bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:border-charcoal/30"
            >
              {t("ctaSell")}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-charcoal sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={aboutImages.story.src}
              alt={t("imageAlt")}
              fill
              quality={85}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
              style={{ objectPosition: aboutImages.story.objectPosition }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
