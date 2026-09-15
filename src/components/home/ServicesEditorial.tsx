import type { ComponentProps } from "react";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getServices } from "@/data/services";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";
import type { ServiceSlug } from "@/types/content";

type AppHref = ComponentProps<typeof Link>["href"];

const servicePanelKey: Record<
  Exclude<ServiceSlug, "overview">,
  "buy" | "sell" | "find" | "transport" | "documentation"
> = {
  buy: "buy",
  sell: "sell",
  find: "find",
  "transport-shipping": "transport",
  "documentation-export": "documentation",
};

export async function ServicesEditorial() {
  const t = await getTranslations("Home.services");
  const items = getServices().map((service) => {
    const key =
      servicePanelKey[service.id as Exclude<ServiceSlug, "overview">];
    return {
      id: service.id,
      href: service.href,
      title: t(`panels.${key}.title`),
      summary: t(`panels.${key}.summary`),
      cta: t(`panels.${key}.cta`),
      image: service.image,
    };
  });

  return (
    <section className="bg-charcoal text-surface">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
        <Reveal>
          <SectionHeader
            inverted
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("subtitle")}
            action={
              <Link
                href={"/services" as AppHref}
                className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] text-sm font-medium text-surface/75 transition-colors hover:text-brand"
              >
                {t("viewAll")}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            }
          />
        </Reveal>

        <Reveal className="mt-10 md:mt-14" delay={0.06}>
          <ServicesAccordion items={items} tablistLabel={t("tablistLabel")} />
        </Reveal>
      </div>
    </section>
  );
}
