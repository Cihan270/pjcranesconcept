"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LocaleSwitcher } from "@/components/navigation/LocaleSwitcher";
import { MainNav } from "@/components/navigation/MainNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { SearchTrigger } from "@/components/navigation/SearchTrigger";
import { cn } from "cn";

const SCROLL_SOLID_AT = 48;

export function SiteHeader() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_SOLID_AT);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[background-color,box-shadow,border-color,backdrop-filter,height] duration-300 ease-out motion-reduce:transition-none print:hidden",
        "border-b border-line bg-white",
        scrolled && "shadow-[0_12px_32px_-20px_rgba(20,20,22,0.35)]",
      )}
      style={
        {
          "--site-header-height": scrolled ? "4.75rem" : "5.25rem",
        } as CSSProperties
      }
    >
      <div className="relative mx-auto flex h-[var(--site-header-height)] max-w-[1440px] items-center gap-3 px-4 transition-[height] duration-300 ease-out motion-reduce:transition-none md:gap-4 md:px-8 lg:gap-6 lg:px-12">
        <BrandLogo
          priority
          className={cn(
            "relative z-10 shrink-0 transition-[width,height] duration-300 motion-reduce:transition-none",
            scrolled
              ? "h-7 w-[8.75rem] md:h-8 md:w-[10rem]"
              : "h-8 w-[9.75rem] md:h-9 md:w-[11rem]",
          )}
        />

        <MainNav className="absolute left-1/2 hidden -translate-x-1/2 lg:flex" />

        <div className="relative z-10 ml-auto flex items-center gap-1 sm:gap-1.5">
          <SearchTrigger
            className="hidden sm:inline-flex"
            open={searchOpen}
            onOpenChange={setSearchOpen}
          />
          <LocaleSwitcher tone="light" className="hidden sm:inline-flex" />

          <Link
            href="/cranes"
            className="focus-ring inline-flex h-9 items-center justify-center gap-1.5 rounded-[var(--radius)] bg-brand px-3 text-xs font-semibold tracking-wide text-charcoal transition-colors hover:bg-accent sm:hidden"
          >
            {t("viewInventory")}
          </Link>

          <Link
            href="/cranes"
            className="focus-ring hidden h-10 items-center justify-center gap-2 rounded-[var(--radius)] bg-brand px-4 text-sm font-semibold tracking-wide text-charcoal transition-colors hover:bg-accent sm:inline-flex"
          >
            {t("viewInventory")}
            <ArrowRight className="size-3.5" strokeWidth={2.25} aria-hidden />
          </Link>

          <MobileNav onOpenSearch={() => setSearchOpen(true)} />
        </div>
      </div>
    </header>
  );
}
