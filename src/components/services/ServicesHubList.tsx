import type { ComponentProps } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getServices } from "@/data/services";
import { Reveal } from "@/components/shared/Reveal";
import type { ServiceSlug } from "@/types/content";

type AppHref = ComponentProps<typeof Link>["href"];

const serviceMessageKey: Record<
  Exclude<ServiceSlug, "overview">,
  "buy" | "sell" | "find" | "transport" | "documentation"
> = {
  buy: "buy",
  sell: "sell",
  find: "find",
  "transport-shipping": "transport",
  "documentation-export": "documentation",
};

export async function ServicesHubList() {
  const t = await getTranslations("Services");
  const tHub = await getTranslations("Services.hub");
  const items = getServices();

  return (
    <section
      id="services-list"
      className="scroll-mt-24 border-b border-line bg-background"
      aria-labelledby="services-list-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 md:py-14 lg:px-12 lg:py-16">
        <Reveal className="mb-10 max-w-xl space-y-3">
          <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {tHub("list.eyebrow")}
          </p>
          <h2
            id="services-list-title"
            className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {tHub("list.title")}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {tHub("list.body")}
          </p>
        </Reveal>

        <Reveal delay={0.04}>
          <ol className="divide-y divide-line border-y border-line">
            {items.map((service, index) => {
              const key =
                serviceMessageKey[
                  service.id as Exclude<ServiceSlug, "overview">
                ];
              return (
                <li key={service.id}>
                  <Link
                    href={service.href as AppHref}
                    className="group grid gap-5 py-7 transition-colors sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:items-center sm:gap-8 md:grid-cols-[minmax(0,14rem)_4rem_minmax(0,1fr)_auto] md:gap-8 md:py-8"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-charcoal sm:aspect-[5/3]">
                      <Image
                        src={service.image.src}
                        alt={service.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 224px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        style={
                          service.image.objectPosition
                            ? { objectPosition: service.image.objectPosition }
                            : undefined
                        }
                      />
                    </div>

                    <span className="hidden font-heading text-sm font-semibold tracking-wider text-brand tabular-nums md:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 space-y-2">
                      <div className="flex items-baseline gap-3 md:block">
                        <span className="font-heading text-sm font-semibold tracking-wider text-brand tabular-nums md:hidden">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
                          {t(`${key}.title`)}
                        </h3>
                      </div>
                      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                        {t(`${key}.summary`)}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-steel transition-colors group-hover:text-foreground">
                      {tHub("explore")}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
