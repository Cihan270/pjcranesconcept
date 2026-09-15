"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InventoryFilters } from "@/components/cranes/InventoryFilters";
import {
  countActiveFilters,
  inventoryParsers,
} from "@/lib/inventory/search-params";
import { craneSorts } from "@/types/crane";
import { cn } from "cn";

type InventoryToolbarProps = {
  total: number;
  manufacturers: string[];
  models: string[];
  className?: string;
};

export function InventoryToolbar({
  total,
  manufacturers,
  models,
  className,
}: InventoryToolbarProps) {
  const t = useTranslations("Inventory");
  const tNav = useTranslations("Nav");
  const [params, setParams] = useQueryStates(inventoryParsers, {
    history: "push",
    shallow: true,
  });
  const active = countActiveFilters(params);

  const sortItems = Object.fromEntries(
    craneSorts.map((sort) => [sort, t(`sort.${sort}`)]),
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        {t("results", { count: total })}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Sheet>
          <SheetTrigger
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] border border-line bg-surface px-3 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            {t("filters.open")}
            {active > 0 ? (
              <span className="bg-charcoal px-1.5 py-0.5 font-heading text-[0.65rem] tracking-wide text-brand tabular-nums uppercase">
                {active}
              </span>
            ) : null}
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-sm overflow-y-auto sm:max-w-md"
            closeLabel={tNav("close")}
          >
            <SheetHeader>
              <SheetTitle>{t("filters.title")}</SheetTitle>
              <SheetDescription>{t("filters.subtitle")}</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-8">
              <InventoryFilters
                manufacturers={manufacturers}
                models={models}
                idPrefix="sheet"
              />
            </div>
          </SheetContent>
        </Sheet>

        <Select
          value={params.sort}
          onValueChange={(value) => {
            if (value) setParams({ sort: value as typeof params.sort });
          }}
          items={sortItems}
        >
          <SelectTrigger className="h-11 min-w-[11rem] rounded-[var(--radius)]">
            <SelectValue placeholder={t("sort.label")} />
          </SelectTrigger>
          <SelectContent>
            {craneSorts.map((sort) => (
              <SelectItem key={sort} value={sort}>
                {t(`sort.${sort}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          className="inline-flex rounded-[var(--radius)] border border-line bg-surface p-0.5"
          role="group"
          aria-label={t("view.label")}
        >
          <button
            type="button"
            onClick={() => setParams({ view: "grid" })}
            aria-pressed={params.view === "grid"}
            className={cn(
              "focus-ring inline-flex size-11 items-center justify-center rounded-[calc(var(--radius)-1px)] transition-colors",
              params.view === "grid"
                ? "bg-charcoal text-brand"
                : "text-steel hover:text-foreground",
            )}
          >
            <LayoutGrid className="size-4" aria-hidden />
            <span className="sr-only">{t("view.grid")}</span>
          </button>
          <button
            type="button"
            onClick={() => setParams({ view: "list" })}
            aria-pressed={params.view === "list"}
            className={cn(
              "focus-ring inline-flex size-11 items-center justify-center rounded-[calc(var(--radius)-1px)] transition-colors",
              params.view === "list"
                ? "bg-charcoal text-brand"
                : "text-steel hover:text-foreground",
            )}
          >
            <List className="size-4" aria-hidden />
            <span className="sr-only">{t("view.list")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
