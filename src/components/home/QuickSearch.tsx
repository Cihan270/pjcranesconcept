"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  capacityClasses,
  capacityClassSearchParams,
  isInCapacityClass,
} from "@/data/capacity-classes";

export type QuickSearchItem = {
  manufacturer: string;
  model: string;
  reference: string;
  slug: string;
  description?: string;
  features: string[];
  capacityKg: number;
};

type QuickSearchProps = {
  inventory: QuickSearchItem[];
};

function matchesQuery(item: QuickSearchItem, q: string): boolean {
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

const fieldLabelClass =
  "text-xs font-medium tracking-wide text-steel uppercase";
const controlClass =
  "h-12 w-full rounded-[var(--radius)] border-line bg-surface text-sm md:text-sm";

/**
 * Compact stock search that overlaps the hero: three fields and a live
 * result count on the button. Advanced filters live on /cranes.
 */
export function QuickSearch({ inventory }: QuickSearchProps) {
  const t = useTranslations("Home.quickSearch");
  const tCapacity = useTranslations("Home.capacity.classes");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [manufacturer, setManufacturer] = useState("all");
  const [capacity, setCapacity] = useState("any");

  const selectedClass = capacityClasses.find((item) => item.id === capacity);

  const matchCount = useMemo(
    () =>
      inventory.filter((item) => {
        if (query.trim() && !matchesQuery(item, query)) return false;
        if (manufacturer !== "all" && item.manufacturer !== manufacturer) {
          return false;
        }
        if (selectedClass && !isInCapacityClass(item.capacityKg, selectedClass)) {
          return false;
        }
        return true;
      }).length,
    [inventory, query, manufacturer, selectedClass],
  );

  const manufacturerCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of inventory) {
      counts.set(item.manufacturer, (counts.get(item.manufacturer) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [inventory]);

  const manufacturerItems = useMemo(
    () => ({
      all: t("allManufacturers"),
      ...Object.fromEntries(
        manufacturerCounts.map(([name, count]) => [name, `${name} (${count})`]),
      ),
    }),
    [manufacturerCounts, t],
  );

  const capacityItems = useMemo(
    () => ({
      any: t("anyCapacity"),
      ...Object.fromEntries(
        capacityClasses.map((item) => [
          item.id,
          `${tCapacity(`${item.id}.label`)} (${
            inventory.filter((crane) => isInCapacityClass(crane.capacityKg, item))
              .length
          })`,
        ]),
      ),
    }),
    [inventory, t, tCapacity],
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = selectedClass
      ? capacityClassSearchParams(selectedClass)
      : new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (manufacturer !== "all") params.set("manufacturer", manufacturer);
    const qs = params.toString();
    router.push(qs ? `/cranes?${qs}` : "/cranes");
  }

  return (
    <section
      className="relative z-10 bg-background"
      aria-labelledby="quick-search-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12">
        <div className="-mt-10 border border-line bg-surface p-5 shadow-[0_24px_60px_-28px_rgba(20,20,22,0.45)] md:-mt-14 md:p-7 lg:-mt-20">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2
              id="quick-search-title"
              className="font-heading text-xl font-semibold tracking-tight md:text-2xl"
            >
              {t("title")}
            </h2>
            <Link
              href="/cranes"
              className="focus-ring group inline-flex items-center gap-1.5 text-sm font-medium text-steel underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {t("advanced")}
              <ArrowRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
          >
            <div className="min-w-0 space-y-1.5 md:col-span-2 lg:col-span-1">
              <label htmlFor="quick-q" className={fieldLabelClass}>
                {t("queryLabel")}
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-steel"
                  aria-hidden
                />
                <Input
                  id="quick-q"
                  name="q"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("placeholder")}
                  className={`${controlClass} pl-10`}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="min-w-0 space-y-1.5">
              <label htmlFor="quick-manufacturer" className={fieldLabelClass}>
                {t("manufacturer")}
              </label>
              <Select
                value={manufacturer}
                onValueChange={(value) => setManufacturer(value ?? "all")}
                items={manufacturerItems}
              >
                <SelectTrigger id="quick-manufacturer" className={controlClass}>
                  <SelectValue placeholder={t("allManufacturers")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(manufacturerItems).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0 space-y-1.5">
              <label htmlFor="quick-capacity" className={fieldLabelClass}>
                {t("capacity")}
              </label>
              <Select
                value={capacity}
                onValueChange={(value) => setCapacity(value ?? "any")}
                items={capacityItems}
              >
                <SelectTrigger id="quick-capacity" className={controlClass}>
                  <SelectValue placeholder={t("anyCapacity")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(capacityItems).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              type="submit"
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius)] bg-charcoal px-7 text-sm font-semibold whitespace-nowrap text-surface tabular-nums transition-colors hover:bg-charcoal/90 md:col-span-2 lg:col-span-1"
              aria-live="polite"
            >
              {t("submit", { count: matchCount })}
              <ArrowRight className="size-4 text-brand" aria-hidden />
            </button>
          </form>

          {matchCount === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {t("noResults")}{" "}
              <Link
                href="/find-a-crane"
                className="focus-ring font-semibold text-foreground underline underline-offset-4 hover:decoration-brand"
              >
                {t("noResultsCta")}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
