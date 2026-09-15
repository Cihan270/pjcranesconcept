import type { ComponentProps } from "react";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CraneCard } from "@/components/cranes/CraneCard";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import type { Crane } from "@/types/crane";

type AppHref = ComponentProps<typeof Link>["href"];

type RecentlySoldProps = {
  cranes: Crane[];
  soldTotal: number;
};

/** Track record: recent sales, linking to the sold archive in the inventory. */
export async function RecentlySold({ cranes, soldTotal }: RecentlySoldProps) {
  const t = await getTranslations("Home.recentlySold");

  if (cranes.length === 0) return null;

  return (
    <section className="border-t border-line bg-background" aria-label={t("title")}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("subtitle")}
            action={
              <Link
                href={"/cranes?includeSold=true&availability=sold" as AppHref}
                className="focus-ring group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground/80 underline decoration-line underline-offset-[0.35em] transition-colors hover:text-foreground hover:decoration-brand"
              >
                {t("viewArchive", { count: soldTotal })}
                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            }
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {cranes.map((crane) => (
            <CraneCard key={crane.id} crane={crane} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
