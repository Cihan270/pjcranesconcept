import { ArrowRight, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company } from "@/data/company";
import { cn } from "cn";

type SoldCranePanelProps = {
  craneSlug: string;
  craneName: string;
  className?: string;
};

/** Replaces the enquiry form on sold listings: turn the visit into a sourcing request. */
export async function SoldCranePanel({
  craneSlug,
  craneName,
  className,
}: SoldCranePanelProps) {
  const t = await getTranslations("CraneDetail.sold");

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-charcoal p-5 text-surface md:p-6",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-brand"
        aria-hidden
      />
      <p className="inline-flex bg-brand px-2 py-1 font-heading text-xs font-semibold tracking-[0.18em] text-brand-foreground uppercase">
        {t("badge")}
      </p>
      <h2 className="mt-4 font-heading text-2xl leading-tight font-semibold tracking-tight">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-surface/70">
        {t("body", { crane: craneName })}
      </p>

      <div className="mt-5 flex flex-col gap-2">
        <Link
          href={`/find-a-crane?like=${encodeURIComponent(craneSlug)}#find-form`}
          className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
        >
          {t("findSimilar")}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
        <Link
          href="/cranes"
          className="focus-ring inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-surface/25 px-5 text-sm font-medium transition-colors hover:border-surface/60 hover:bg-surface/10"
        >
          {t("browseStock")}
        </Link>
        <a
          href={`tel:${company.phone.tel}`}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-surface/80 tabular-nums transition-colors hover:text-brand"
        >
          <Phone className="size-4" aria-hidden />
          {company.phone.display}
        </a>
      </div>
    </div>
  );
}
