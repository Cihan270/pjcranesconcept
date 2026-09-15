import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";
import { aboutImages } from "@/data/about";

export async function AboutHero() {
  const t = await getTranslations("About.hero");

  return (
    <section className="relative isolate flex min-h-[28rem] w-full flex-col overflow-hidden bg-charcoal text-surface md:min-h-[30rem] md:h-[min(58svh,36rem)] lg:h-[min(56svh,36.25rem)]">
      <div className="absolute inset-0">
        <Image
          src={aboutImages.hero.src}
          alt={t("imageAlt")}
          fill
          preload
          quality={90}
          sizes="100vw"
          className="object-cover object-[72%_38%] sm:object-[74%_34%] md:object-[78%_32%] lg:object-[80%_30%]"
        />
      </div>

      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,22,0.92)_0%,rgba(20,20,22,0.82)_28%,rgba(20,20,22,0.5)_52%,rgba(20,20,22,0.2)_72%,rgba(20,20,22,0.06)_88%,transparent_100%)] max-md:bg-[linear-gradient(105deg,rgba(20,20,22,0.94)_0%,rgba(20,20,22,0.84)_40%,rgba(20,20,22,0.45)_65%,rgba(20,20,22,0.14)_82%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,22,0.45)_0%,transparent_22%,transparent_78%,rgba(20,20,22,0.35)_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col justify-center px-4 py-12 md:px-8 md:py-14 lg:px-12">
        <Reveal mode="enter" className="max-w-[36rem]">
          <p className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-brand uppercase sm:text-xs">
            <span
              className="hidden h-px w-8 shrink-0 bg-brand sm:block"
              aria-hidden
            />
            {t("eyebrow")}
          </p>

          <h1 className="mt-3 max-w-[18ch] font-heading text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] font-semibold tracking-[-0.025em] text-balance text-surface md:mt-3.5 md:max-w-[20ch]">
            {t("title")}
          </h1>

          <p className="mt-3 max-w-[32rem] text-[0.875rem] leading-relaxed text-surface/80 sm:text-[0.9375rem] md:mt-3.5">
            {t("subtitle")}
          </p>

          <div className="mt-5 flex w-full flex-col gap-2.5 sm:mt-6 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Link
              href="/cranes"
              className="focus-ring group inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-[var(--radius)] bg-primary px-5 text-sm font-semibold tracking-wide text-primary-foreground transition-[background-color,transform,box-shadow] duration-300 hover:bg-accent hover:shadow-[0_8px_28px_-12px_rgba(250,191,3,0.55)] active:translate-y-px sm:h-12 sm:w-auto sm:px-6"
            >
              {t("ctaInventory")}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex h-11 w-full items-center justify-center rounded-[var(--radius)] border border-white/25 bg-transparent px-5 text-sm font-medium text-surface transition-colors hover:border-brand hover:text-brand sm:h-12 sm:w-auto sm:px-6"
            >
              {t("ctaContact")}
            </Link>
          </div>

          <p className="mt-4 text-xs tracking-[0.04em] text-surface/55 sm:text-sm">
            {t("support")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
