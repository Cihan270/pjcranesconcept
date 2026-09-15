import { getTranslations } from "next-intl/server";
import { CraneCard } from "@/components/cranes/CraneCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import type { Crane } from "@/types/crane";
import { cn } from "cn";

type RelatedCranesProps = {
  cranes: Crane[];
  className?: string;
};

export async function RelatedCranes({
  cranes,
  className,
}: RelatedCranesProps) {
  const t = await getTranslations("CraneDetail");
  if (cranes.length === 0) return null;

  return (
    <section className={cn("space-y-8 border-t border-line pt-12", className)}>
      <SectionHeader
        eyebrow={t("related.eyebrow")}
        title={t("related.title")}
        description={t("related.subtitle")}
      />
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {cranes.map((crane) => (
          <CraneCard key={crane.id} crane={crane} />
        ))}
      </div>
    </section>
  );
}
