import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Reveal } from "@/components/shared/Reveal";

type BreadcrumbItem = ComponentProps<typeof Breadcrumbs>["items"][number];

type ServiceSubpageHeroProps = {
  breadcrumbs: BreadcrumbItem[];
  badge: string;
  title: string;
  body: string;
  titleId: string;
  action?: ReactNode;
};

export function ServiceSubpageHero({
  breadcrumbs,
  badge,
  title,
  body,
  titleId,
  action,
}: ServiceSubpageHeroProps) {
  return (
    <header>
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-8 lg:px-12">
        <Breadcrumbs className="mb-6" items={breadcrumbs} />
      </div>

      <section
        className="relative overflow-hidden border-b border-brand bg-charcoal text-surface"
        aria-labelledby={titleId}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_0%,rgba(250,191,3,0.14),transparent_42%)]"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-12 lg:px-12 lg:py-14">
          <Reveal className="max-w-2xl space-y-5">
            <p className="inline-flex bg-brand px-2.5 py-1 font-heading text-[0.7rem] font-semibold tracking-[0.18em] text-brand-foreground uppercase">
              {badge}
            </p>
            <div className="space-y-3">
              <h1
                id={titleId}
                className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
              >
                {title}
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-surface/70 md:text-lg">
                {body}
              </p>
            </div>
            {action ? <div className="pt-1">{action}</div> : null}
          </Reveal>
        </div>
      </section>
    </header>
  );
}

type ServiceSubpageHeroCtaProps = {
  href: ComponentProps<typeof Link>["href"];
  label: string;
};

export function ServiceSubpageHeroCta({
  href,
  label,
}: ServiceSubpageHeroCtaProps) {
  return (
    <Link
      href={href}
      className="focus-ring inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
    >
      {label}
    </Link>
  );
}
