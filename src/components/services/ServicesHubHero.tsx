import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Reveal } from "@/components/shared/Reveal";

export async function ServicesHubHero() {
  const t = await getTranslations("Services.hub.hero");
  const tNav = await getTranslations("Nav");

  return (
    <header>
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-8 lg:px-12">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: tNav("home"), href: "/" },
            { label: tNav("services") },
          ]}
        />
      </div>

      <section
        className="relative overflow-hidden border-b border-brand bg-charcoal text-surface"
        aria-labelledby="services-hero-title"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(250,191,3,0.14),transparent_42%)]"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-12 lg:px-12 lg:py-14">
          <Reveal className="max-w-2xl space-y-5">
            <p className="inline-flex bg-brand px-2.5 py-1 font-heading text-[0.7rem] font-semibold tracking-[0.18em] text-brand-foreground uppercase">
              {t("badge")}
            </p>
            <div className="space-y-3">
              <h1
                id="services-hero-title"
                className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
              >
                {t("title")}
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-surface/70 md:text-lg">
                {t("body")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </header>
  );
}
