"use client";

import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Link, usePathname } from "@/i18n/navigation";
import { primaryNavLinks } from "@/lib/seo/routes";

type MainNavProps = {
  className?: string;
  onNavigate?: () => void;
  /** Larger tap targets and type for mobile drawer. */
  variant?: "desktop" | "mobile";
};

export function MainNav({
  className,
  onNavigate,
  variant = "desktop",
}: MainNavProps) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const isMobile = variant === "mobile";

  return (
    <nav
      aria-label={isMobile ? t("mobileNav") : t("mainNav")}
      className={cn(
        isMobile ? "flex flex-col gap-0.5" : "items-center gap-0.5 xl:gap-1",
        className,
      )}
    >
      {primaryNavLinks.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative font-heading tracking-[0.02em] transition-colors duration-200 outline-none",
              "focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2",
              isMobile
                ? "min-h-12 rounded-[var(--radius)] px-4 py-3.5 text-lg font-semibold tracking-wide focus-visible:ring-offset-charcoal"
                : "rounded-[var(--radius)] px-3 py-2 text-sm font-semibold focus-visible:ring-offset-white xl:px-3.5",
              // Mobile drawer stays dark; the desktop bar sits in the white header.
              isMobile
                ? active
                  ? "text-white"
                  : "text-white/78 hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:text-white"
                : active
                  ? "text-charcoal"
                  : "text-steel hover:bg-charcoal/[0.05] hover:text-charcoal focus-visible:bg-charcoal/[0.05] focus-visible:text-charcoal",
            )}
            aria-current={active ? "page" : undefined}
          >
            {t(item.key)}
            <span
              className={cn(
                "pointer-events-none absolute origin-left bg-brand transition-transform duration-300 ease-out motion-reduce:transition-none",
                isMobile
                  ? "inset-x-4 bottom-2.5 h-0.5"
                  : "inset-x-3 -bottom-px h-0.5",
                active
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-80 group-hover:scale-x-100 group-focus-visible:scale-x-100",
              )}
              aria-hidden
            />
          </Link>
        );
      })}
    </nav>
  );
}
