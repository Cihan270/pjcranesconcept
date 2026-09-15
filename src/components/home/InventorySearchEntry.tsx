"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";
import { Input } from "@/components/ui/input";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type InventorySearchItem = {
  manufacturer: string;
  model: string;
  reference: string;
  slug: string;
  description?: string;
  features: string[];
  year: number;
  capacityKg: number;
};

type InventorySearchEntryProps = {
  manufacturers: string[];
  years: number[];
  capacityTons: number[];
  inventory: InventorySearchItem[];
};

type FilterState = {
  query: string;
  manufacturer: string;
  capacityMinTons: string;
  capacityMaxTons: string;
  yearMin: string;
  yearMax: string;
};

const EMPTY_FILTERS: FilterState = {
  query: "",
  manufacturer: "all",
  capacityMinTons: "any",
  capacityMaxTons: "any",
  yearMin: "any",
  yearMax: "any",
};

function matchesQuery(item: InventorySearchItem, q: string): boolean {
  const haystack = [
    item.manufacturer,
    item.model,
    item.reference,
    item.slug,
    item.description ?? "",
    ...item.features,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}

function countMatches(
  inventory: InventorySearchItem[],
  filters: FilterState,
): number {
  const trimmed = filters.query.trim();
  const capacityMinKg =
    filters.capacityMinTons !== "any"
      ? Number.parseInt(filters.capacityMinTons, 10) * 1000
      : null;
  const capacityMaxKg =
    filters.capacityMaxTons !== "any"
      ? Number.parseInt(filters.capacityMaxTons, 10) * 1000
      : null;
  const yearMin =
    filters.yearMin !== "any" ? Number.parseInt(filters.yearMin, 10) : null;
  const yearMax =
    filters.yearMax !== "any" ? Number.parseInt(filters.yearMax, 10) : null;

  return inventory.filter((item) => {
    if (trimmed && !matchesQuery(item, trimmed)) return false;
    if (
      filters.manufacturer !== "all" &&
      item.manufacturer !== filters.manufacturer
    ) {
      return false;
    }
    if (capacityMinKg !== null && item.capacityKg < capacityMinKg) return false;
    if (capacityMaxKg !== null && item.capacityKg > capacityMaxKg) return false;
    if (yearMin !== null && item.year < yearMin) return false;
    if (yearMax !== null && item.year > yearMax) return false;
    return true;
  }).length;
}

function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.manufacturer !== "all" ||
    filters.capacityMinTons !== "any" ||
    filters.capacityMaxTons !== "any" ||
    filters.yearMin !== "any" ||
    filters.yearMax !== "any"
  );
}

function buildSearchParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  const trimmed = filters.query.trim();
  if (trimmed) params.set("q", trimmed);
  if (filters.manufacturer !== "all") {
    params.set("manufacturer", filters.manufacturer);
  }
  if (filters.capacityMinTons !== "any") {
    params.set(
      "capacityMinKg",
      String(Number.parseInt(filters.capacityMinTons, 10) * 1000),
    );
  }
  if (filters.capacityMaxTons !== "any") {
    params.set(
      "capacityMaxKg",
      String(Number.parseInt(filters.capacityMaxTons, 10) * 1000),
    );
  }
  if (filters.yearMin !== "any") {
    params.set("yearMin", filters.yearMin);
  }
  if (filters.yearMax !== "any") {
    params.set("yearMax", filters.yearMax);
  }
  return params;
}

const fieldLabelClass =
  "text-xs font-medium tracking-wide text-steel uppercase";
const controlClass =
  "h-12 w-full rounded-[var(--radius)] border-line bg-surface text-sm md:text-sm";

export function InventorySearchEntry({
  manufacturers,
  years,
  capacityTons,
  inventory,
}: InventorySearchEntryProps) {
  const t = useTranslations("Home.search");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searched, setSearched] = useState(false);

  const active = hasActiveFilters(filters);
  const matchCount = useMemo(
    () => countMatches(inventory, filters),
    [inventory, filters],
  );

  const manufacturerItems = useMemo(
    () => ({
      all: t("allManufacturers"),
      ...Object.fromEntries(manufacturers.map((name) => [name, name])),
    }),
    [manufacturers, t],
  );

  const capacityItems = useMemo(
    () => ({
      any: t("capacityAny"),
      ...Object.fromEntries(
        capacityTons.map((tons) => [String(tons), `${tons} t`]),
      ),
    }),
    [capacityTons, t],
  );

  const yearItems = useMemo(
    () => ({
      any: t("yearAny"),
      ...Object.fromEntries(years.map((year) => [String(year), String(year)])),
    }),
    [years, t],
  );

  function updateFilter<K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setSearched(false);
  }

  function navigateWithFilters() {
    setSearched(true);
    const params = buildSearchParams(filters);
    const qs = params.toString();
    router.push(qs ? `/cranes?${qs}` : "/cranes");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFiltersOpen(false);
    navigateWithFilters();
  }

  function renderAdvancedFilters(idPrefix: string) {
    return (
      <>
        <div className="space-y-1.5">
          <label
            htmlFor={`${idPrefix}-manufacturer`}
            className={fieldLabelClass}
          >
            {t("manufacturer")}
          </label>
          <Select
            value={filters.manufacturer}
            onValueChange={(value) =>
              updateFilter("manufacturer", value ?? "all")
            }
            items={manufacturerItems}
          >
            <SelectTrigger
              id={`${idPrefix}-manufacturer`}
              className={controlClass}
            >
              <SelectValue placeholder={t("allManufacturers")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allManufacturers")}</SelectItem>
              {manufacturers.map((name) => (
                <SelectItem key={`${idPrefix}-mfr-${name}`} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-cap-min`} className={fieldLabelClass}>
            {t("capacityMin")}
          </label>
          <Select
            value={filters.capacityMinTons}
            onValueChange={(value) =>
              updateFilter("capacityMinTons", value ?? "any")
            }
            items={capacityItems}
          >
            <SelectTrigger id={`${idPrefix}-cap-min`} className={controlClass}>
              <SelectValue placeholder={t("capacityAny")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("capacityAny")}</SelectItem>
              {capacityTons.map((tons) => (
                <SelectItem
                  key={`${idPrefix}-min-${tons}`}
                  value={String(tons)}
                >
                  {tons} t
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-cap-max`} className={fieldLabelClass}>
            {t("capacityMax")}
          </label>
          <Select
            value={filters.capacityMaxTons}
            onValueChange={(value) =>
              updateFilter("capacityMaxTons", value ?? "any")
            }
            items={capacityItems}
          >
            <SelectTrigger id={`${idPrefix}-cap-max`} className={controlClass}>
              <SelectValue placeholder={t("capacityAny")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("capacityAny")}</SelectItem>
              {capacityTons.map((tons) => (
                <SelectItem
                  key={`${idPrefix}-max-${tons}`}
                  value={String(tons)}
                >
                  {tons} t
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-year-min`} className={fieldLabelClass}>
            {t("yearMin")}
          </label>
          <Select
            value={filters.yearMin}
            onValueChange={(value) => updateFilter("yearMin", value ?? "any")}
            items={yearItems}
          >
            <SelectTrigger id={`${idPrefix}-year-min`} className={controlClass}>
              <SelectValue placeholder={t("yearAny")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("yearAny")}</SelectItem>
              {years.map((year) => (
                <SelectItem
                  key={`${idPrefix}-ymin-${year}`}
                  value={String(year)}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-year-max`} className={fieldLabelClass}>
            {t("yearMax")}
          </label>
          <Select
            value={filters.yearMax}
            onValueChange={(value) => updateFilter("yearMax", value ?? "any")}
            items={yearItems}
          >
            <SelectTrigger id={`${idPrefix}-year-max`} className={controlClass}>
              <SelectValue placeholder={t("yearAny")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("yearAny")}</SelectItem>
              {years.map((year) => (
                <SelectItem
                  key={`${idPrefix}-ymax-${year}`}
                  value={String(year)}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </>
    );
  }

  const showResults = active || searched;
  const advancedActiveCount = [
    filters.manufacturer !== "all",
    filters.capacityMinTons !== "any",
    filters.capacityMaxTons !== "any",
    filters.yearMin !== "any",
    filters.yearMax !== "any",
  ].filter(Boolean).length;

  return (
    <section className="border-b border-line bg-surface" aria-labelledby="inventory-search-title">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 md:py-16 lg:px-12">
        <Reveal>
          <div className="flex flex-col gap-6 border border-line bg-background p-5 md:gap-7 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
              <div className="max-w-2xl space-y-2">
                <p className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase">
                  {t("eyebrow")}
                </p>
                <h2
                  id="inventory-search-title"
                  className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl lg:text-[2rem]"
                >
                  {t("title")}
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">
                  {t("subtitle")}
                </p>
              </div>

              {showResults ? (
                <p
                  className="shrink-0 text-sm font-medium text-foreground tabular-nums md:text-right"
                  aria-live="polite"
                >
                  {t("results", { count: matchCount })}
                </p>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Mobile / tablet: search + filters drawer */}
              <div className="flex flex-col gap-3 lg:hidden">
                <div className="space-y-1.5">
                  <label htmlFor="inventory-q-mobile" className={fieldLabelClass}>
                    {t("queryLabel")}
                  </label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-steel"
                      aria-hidden
                    />
                    <Input
                      id="inventory-q-mobile"
                      name="q-mobile"
                      value={filters.query}
                      onChange={(event) =>
                        updateFilter("query", event.target.value)
                      }
                      placeholder={t("placeholder")}
                      className={`${controlClass} pl-10`}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger
                      type="button"
                      className="focus-ring inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-[var(--radius)] border border-line bg-surface px-4 text-sm font-medium transition-colors hover:bg-background"
                    >
                      <SlidersHorizontal className="size-4 shrink-0" aria-hidden />
                      <span>{t("filters")}</span>
                      {advancedActiveCount > 0 ? (
                        <span className="bg-charcoal px-1.5 py-0.5 font-heading text-[0.65rem] tracking-wide text-brand tabular-nums uppercase">
                          {advancedActiveCount}
                        </span>
                      ) : null}
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      className="max-h-[85dvh] overflow-y-auto rounded-t-[var(--radius)]"
                      closeLabel={tNav("close")}
                    >
                      <SheetHeader>
                        <SheetTitle>{t("filtersTitle")}</SheetTitle>
                        <SheetDescription>
                          {t("filtersSubtitle")}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 px-4 pb-2 sm:grid-cols-2">
                        {renderAdvancedFilters("inv-sheet")}
                      </div>
                      <SheetFooter className="border-t border-line">
                        {active ? (
                          <button
                            type="button"
                            onClick={clearFilters}
                            className="focus-ring inline-flex h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-surface text-sm font-medium transition-colors hover:bg-background"
                          >
                            {t("clear")}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            setFiltersOpen(false);
                            navigateWithFilters();
                          }}
                          className="focus-ring inline-flex h-12 items-center justify-center rounded-[var(--radius)] bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
                        >
                          {t("submit")}
                        </button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>

                  <button
                    type="submit"
                    className="focus-ring inline-flex h-12 shrink-0 items-center justify-center rounded-[var(--radius)] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
                  >
                    {t("submit")}
                  </button>
                </div>

                {active ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="focus-ring self-start rounded-[var(--radius)] text-sm font-medium text-steel underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {t("clear")}
                  </button>
                ) : null}
              </div>

              {/* Desktop: horizontal filter bar */}
              <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(9rem,11rem)_minmax(7.5rem,9rem)_minmax(7.5rem,9rem)_minmax(7rem,8.5rem)_minmax(7rem,8.5rem)_auto] lg:items-end lg:gap-3">
                <div className="min-w-0 space-y-1.5">
                  <label htmlFor="inventory-q" className={fieldLabelClass}>
                    {t("queryLabel")}
                  </label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-steel"
                      aria-hidden
                    />
                    <Input
                      id="inventory-q"
                      name="q"
                      value={filters.query}
                      onChange={(event) =>
                        updateFilter("query", event.target.value)
                      }
                      placeholder={t("placeholder")}
                      className={`${controlClass} pl-10`}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="contents [&>div]:min-w-0">
                  {renderAdvancedFilters("inv")}
                </div>

                <button
                  type="submit"
                  className="focus-ring inline-flex h-12 items-center justify-center rounded-[var(--radius)] bg-primary px-7 text-sm font-semibold whitespace-nowrap text-primary-foreground transition-colors hover:bg-accent"
                >
                  {t("submit")}
                </button>
              </div>

              {active ? (
                <div className="hidden lg:flex lg:justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="focus-ring rounded-[var(--radius)] text-sm font-medium text-steel underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {t("clear")}
                  </button>
                </div>
              ) : null}
            </form>

            <div className="flex flex-col gap-2 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-muted-foreground">
                {t("secondaryPrompt")}
              </p>
              <Link
                href="/find-a-crane"
                className="focus-ring group inline-flex items-center gap-1.5 self-start text-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-charcoal hover:underline sm:self-auto"
              >
                <span>{t("secondaryCta")}</span>
                <ArrowRight
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
