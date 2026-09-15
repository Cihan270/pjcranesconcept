import { getTranslations } from "next-intl/server";
import { FeaturedInventoryCard } from "@/components/home/FeaturedInventoryCard";
import { FeaturedInventoryCarousel } from "@/components/home/FeaturedInventoryCarousel";
import { Reveal } from "@/components/shared/Reveal";
import { craneEditorialBadge } from "@/lib/inventory/format";
import type { Crane } from "@/types/crane";

type FeaturedInventoryProps = {
  cranes: Crane[];
  /** Newest dateAdded in stock — used for “new arrival” badges. */
  newestDateAdded?: string;
};

export async function FeaturedInventory({
  cranes,
  newestDateAdded,
}: FeaturedInventoryProps) {
  const t = await getTranslations("Home.featured");
  const newest =
    newestDateAdded ??
    cranes.reduce(
      (latest, crane) =>
        !latest || crane.dateAdded > latest ? crane.dateAdded : latest,
      "",
    );

  return (
    <section className="overflow-x-clip bg-background" aria-label={t("title")}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-12 lg:px-12 lg:py-14">
        {cranes.length === 0 ? (
          <Reveal>
            <div className="space-y-3">
              <p className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase">
                {t("eyebrow")}
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("title")}
              </h2>
              <p className="text-muted-foreground">{t("empty")}</p>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <FeaturedInventoryCarousel
              eyebrow={t("eyebrow")}
              title={t("title")}
              description={t("subtitle")}
              viewAllLabel={t("viewAll")}
              previousLabel={t("carousel.previous")}
              nextLabel={t("carousel.next")}
              progressLabel={t("carousel.progress")}
            >
              {cranes.map((crane, index) => (
                <FeaturedInventoryCard
                  key={crane.id}
                  crane={crane}
                  editorialBadge={craneEditorialBadge(crane, newest)}
                  priority={index < 2}
                />
              ))}
            </FeaturedInventoryCarousel>
          </Reveal>
        )}
      </div>
    </section>
  );
}
