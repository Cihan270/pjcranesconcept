import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Reveal } from "@/components/shared/Reveal";
import { company } from "@/data/company";
import { contactImages } from "@/data/contact";

export async function ContactHero() {
  const t = await getTranslations("Contact");
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");

  return (
    <header>
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-6 md:px-8 md:pt-8 lg:px-12">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: tNav("home"), href: "/" },
            { label: tNav("contact") },
          ]}
        />
      </div>

      <section
        className="relative isolate flex min-h-[22.5rem] w-full flex-col overflow-hidden bg-charcoal text-surface md:min-h-[24rem] lg:min-h-[26rem]"
        aria-labelledby="contact-hero-title"
      >
        <div className="absolute inset-0">
          <Image
            src={contactImages.hero.src}
            alt={t("hero.imageAlt")}
            fill
          preload
          quality={85}
            sizes="100vw"
            className="object-cover object-[78%_32%] opacity-55"
          />
        </div>
        <div
          className="absolute inset-0 bg-[linear-gradient(105deg,rgba(20,20,22,0.96)_0%,rgba(20,20,22,0.9)_38%,rgba(20,20,22,0.55)_68%,rgba(20,20,22,0.28)_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(250,191,3,0.12),transparent_42%)]"
          aria-hidden
        />

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 py-10 md:px-8 md:py-12 lg:px-12">
          <Reveal className="max-w-2xl space-y-5">
            <p className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-brand uppercase sm:text-xs">
              <span
                className="hidden h-px w-8 shrink-0 bg-brand sm:block"
                aria-hidden
              />
              {t("hero.eyebrow")}
            </p>

            <div className="space-y-3">
              <h1
                id="contact-hero-title"
                className="font-heading text-[clamp(1.85rem,4vw,3rem)] leading-[1.06] font-semibold tracking-[-0.025em] text-balance"
              >
                {t("hero.title")}
              </h1>
              <p className="max-w-xl text-[0.9375rem] leading-relaxed text-surface/75 sm:text-base">
                {t("hero.body")}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <a
                href="#contact-form"
                className="focus-ring group inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-5 text-sm font-semibold tracking-wide text-primary-foreground transition-colors hover:bg-accent sm:h-12 sm:px-6"
              >
                {t("hero.ctaMessage")}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden
                />
              </a>
              <a
                href={`tel:${company.phone.tel}`}
                className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius)] border border-white/25 px-5 text-sm font-medium text-surface transition-colors hover:border-brand hover:text-brand sm:h-12 sm:px-6"
              >
                <Phone className="size-4" aria-hidden />
                {t("hero.ctaCall")}
              </a>
            </div>
          </Reveal>

          <Reveal
            delay={0.05}
            className="mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <a
              href={`tel:${company.phone.tel}`}
              className="focus-ring group flex items-start gap-2.5 rounded-[var(--radius)] py-1 transition-colors hover:text-brand"
            >
              <Phone
                className="mt-0.5 size-4 shrink-0 text-brand"
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-[0.65rem] font-semibold tracking-[0.14em] text-surface/50 uppercase">
                  {tFooter("phoneGeneral")}
                </span>
                <span className="mt-0.5 block text-sm tabular-nums text-surface/90 group-hover:text-brand">
                  {company.phone.display}
                </span>
              </span>
            </a>
            <a
              href={`tel:${company.mobile.tel}`}
              className="focus-ring group flex items-start gap-2.5 rounded-[var(--radius)] py-1 transition-colors hover:text-brand"
            >
              <Smartphone
                className="mt-0.5 size-4 shrink-0 text-brand"
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-[0.65rem] font-semibold tracking-[0.14em] text-surface/50 uppercase">
                  {tFooter("phoneSales")}
                </span>
                <span className="mt-0.5 block text-sm tabular-nums text-surface/90 group-hover:text-brand">
                  {company.mobile.display}
                </span>
              </span>
            </a>
            <a
              href={`mailto:${company.email}`}
              className="focus-ring group flex items-start gap-2.5 rounded-[var(--radius)] py-1 transition-colors hover:text-brand"
            >
              <Mail
                className="mt-0.5 size-4 shrink-0 text-brand"
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-[0.65rem] font-semibold tracking-[0.14em] text-surface/50 uppercase">
                  {tFooter("emailLabel")}
                </span>
                <span className="mt-0.5 block truncate text-sm text-surface/90 group-hover:text-brand">
                  {company.email}
                </span>
              </span>
            </a>
            <div className="flex items-start gap-2.5 py-1">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-brand"
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-[0.65rem] font-semibold tracking-[0.14em] text-surface/50 uppercase">
                  {t("hero.headOfficeLabel")}
                </span>
                <span className="mt-0.5 block text-sm text-surface/90">
                  {tFooter("headOffice")}
                </span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </header>
  );
}
