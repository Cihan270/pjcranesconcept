import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";

const ROUTES = [
  {
    id: "buy",
    href: "/cranes",
    number: "01",
  },
  {
    id: "sell",
    href: "/sell-your-crane",
    number: "02",
  },
  {
    id: "source",
    href: "/find-a-crane",
    number: "03",
  },
] as const;

export async function ContactQuickRoutes() {
  const t = await getTranslations("Contact.quickRoutes");

  return (
    <section
      className="border-b border-line bg-background"
      aria-labelledby="contact-quick-routes-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-12 lg:px-12">
        <Reveal>
          <p className="font-heading text-[0.6875rem] font-semibold tracking-[0.18em] text-steel uppercase sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2 id="contact-quick-routes-title" className="sr-only">
            {t("eyebrow")}
          </h2>
        </Reveal>

        <ul className="mt-6 grid gap-0 border-t border-line md:grid-cols-3">
          {ROUTES.map((route, index) => (
            <li
              key={route.id}
              className={
                index > 0 ? "border-t border-line md:border-t-0 md:border-l" : ""
              }
            >
              <Link
                href={route.href}
                className="focus-ring group flex h-full flex-col gap-3 px-0 py-6 transition-colors md:px-6 md:first:pl-0 md:last:pr-0 lg:py-7"
              >
                <span className="font-heading text-xs font-semibold tracking-[0.2em] text-brand">
                  {route.number}
                </span>
                <span className="font-heading text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-charcoal sm:text-2xl">
                  {t(`${route.id}.title`)}
                </span>
                <span className="max-w-sm flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`${route.id}.body`)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                  {t(`${route.id}.cta`)}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
