import { ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";
import { company } from "@/data/company";

type ServiceFinalCtaProps = {
  title: string;
  body: string;
  contactLabel: string;
  callLabel: string;
  titleId: string;
};

export function ServiceFinalCta({
  title,
  body,
  contactLabel,
  callLabel,
  titleId,
}: ServiceFinalCtaProps) {
  return (
    <section className="bg-charcoal text-surface" aria-labelledby={titleId}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between md:gap-10 md:px-8 md:py-14 lg:px-12">
        <Reveal className="max-w-xl space-y-3">
          <h2
            id={titleId}
            className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h2>
          <p className="text-base leading-relaxed text-surface/70">{body}</p>
        </Reveal>

        <Reveal
          delay={0.06}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="/contact"
            className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            {contactLabel}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <a
            href={`tel:${company.mobile.tel}`}
            className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] border border-white/20 px-6 text-sm font-medium text-surface transition-colors hover:border-brand hover:text-brand"
          >
            <Phone className="size-4" aria-hidden />
            {callLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
