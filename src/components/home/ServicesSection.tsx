import type { ComponentProps } from "react";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  FileCheck,
  Handshake,
  Search,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "cn";

type AppHref = ComponentProps<typeof Link>["href"];

const SERVICES: {
  key: "buy" | "sell" | "find" | "transport" | "documentation";
  href: AppHref;
  icon: LucideIcon;
}[] = [
  { key: "buy", href: "/cranes", icon: Warehouse },
  { key: "sell", href: "/sell-your-crane", icon: Handshake },
  { key: "find", href: "/find-a-crane", icon: Search },
  { key: "transport", href: "/services/transport-shipping", icon: Truck },
  {
    key: "documentation",
    href: "/services/documentation-export",
    icon: FileCheck,
  },
];

/** Homepage overview of the five services, as a full-width dark band. */
export async function ServicesSection() {
  const t = await getTranslations("Home.services");
  const lastIsOdd = SERVICES.length % 2 === 1;

  return (
    <section
      className="bg-charcoal text-surface"
      aria-labelledby="services-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-4 pb-12 md:px-8 md:pt-6 md:pb-14 lg:px-12 lg:pt-8 lg:pb-16">
        <Reveal>
          <div className="flex flex-col gap-4 pb-8 md:flex-row md:items-end md:justify-between md:pb-10">
            <div className="space-y-3">
              <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
                {t("eyebrow")}
              </p>
              <h2
                id="services-title"
                className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
              >
                {t("title")}
              </h2>
              <p className="text-base leading-relaxed text-surface/65">
                {t("subtitle")}
              </p>
            </div>
            <Link
              href="/services"
              className="focus-ring group inline-flex min-h-10 shrink-0 items-center gap-2 rounded-[var(--radius)] text-sm font-medium whitespace-nowrap text-surface transition-colors hover:text-brand"
            >
              {t("viewAll")}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="grid border-y border-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map(({ key, href, icon: Icon }, index) => (
              <li
                key={key}
                className={cn(
                  "border-white/10 lg:border-t-0",
                  index > 0 && "border-t lg:border-l",
                  index === 1 && "sm:border-t-0",
                  index % 2 === 1 && "sm:border-l",
                  index === SERVICES.length - 1 &&
                    lastIsOdd &&
                    "sm:col-span-2 lg:col-span-1",
                )}
              >
                <Link
                  href={href}
                  className="focus-ring group relative flex h-full flex-col gap-3 py-6 transition-colors hover:bg-white/[0.03] sm:px-6 lg:py-7 xl:px-8"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center bg-brand text-brand-foreground"
                      aria-hidden
                    >
                      <Icon className="size-[1.125rem]" strokeWidth={1.75} />
                    </span>
                    <h3 className="font-heading text-lg leading-tight font-semibold tracking-tight">
                      {t(`panels.${key}.title`)}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-surface/65">
                    {t(`panels.${key}.summary`)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-surface transition-colors group-hover:text-brand">
                    {t(`panels.${key}.cta`)}
                    <ArrowRight
                      className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
