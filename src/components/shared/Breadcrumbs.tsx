import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "cn";

export type BreadcrumbCrumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbCrumb[];
  className?: string;
};

export async function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const t = await getTranslations("Nav");
  if (items.length === 0) return null;

  return (
    <nav aria-label={t("breadcrumb")} className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-steel">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-line">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="focus-ring rounded-[var(--radius)] transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && "font-medium text-foreground")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
