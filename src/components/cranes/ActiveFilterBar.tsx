"use client";

import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import {
  countActiveFilters,
  inventoryFilterDefaults,
  inventoryParsers,
} from "@/lib/inventory/search-params";
import { formatCapacityTons } from "@/lib/inventory/format";
import type { CraneStatus, CraneType } from "@/types/crane";
import { cn } from "cn";

type ActiveFilterBarProps = {
  className?: string;
};

type Chip = {
  key: string;
  label: string;
  clear: () => void;
};

export function ActiveFilterBar({ className }: ActiveFilterBarProps) {
  const t = useTranslations("Inventory");
  const tType = useTranslations("Crane.type");
  const tStatus = useTranslations("Crane.status");
  const locale = useLocale();
  const [params, setParams] = useQueryStates(inventoryParsers, {
    history: "push",
    shallow: true,
  });

  if (countActiveFilters(params) === 0) return null;

  const chips: Chip[] = [];

  if (params.q.trim()) {
    chips.push({
      key: "q",
      label: `“${params.q.trim()}”`,
      clear: () => setParams({ q: "" }),
    });
  }

  for (const manufacturer of params.manufacturer) {
    chips.push({
      key: `mfr-${manufacturer}`,
      label: manufacturer,
      clear: () =>
        setParams({
          manufacturer: params.manufacturer.filter((item) => item !== manufacturer),
          model: [],
        }),
    });
  }

  for (const model of params.model) {
    chips.push({
      key: `model-${model}`,
      label: model,
      clear: () =>
        setParams({
          model: params.model.filter((item) => item !== model),
        }),
    });
  }

  for (const type of params.type) {
    chips.push({
      key: `type-${type}`,
      label: tType(type as CraneType),
      clear: () =>
        setParams({
          type: params.type.filter((item) => item !== type),
        }),
    });
  }

  if (params.yearMin !== null) {
    chips.push({
      key: "yearMin",
      label: t("chips.yearFrom", { year: params.yearMin }),
      clear: () => setParams({ yearMin: null }),
    });
  }

  if (params.yearMax !== null) {
    chips.push({
      key: "yearMax",
      label: t("chips.yearTo", { year: params.yearMax }),
      clear: () => setParams({ yearMax: null }),
    });
  }

  if (params.capacityMinKg !== null) {
    chips.push({
      key: "capMin",
      label: t("chips.capacityFrom", {
        value: formatCapacityTons(params.capacityMinKg, locale),
      }),
      clear: () => setParams({ capacityMinKg: null }),
    });
  }

  if (params.capacityMaxKg !== null) {
    chips.push({
      key: "capMax",
      label: t("chips.capacityTo", {
        value: formatCapacityTons(params.capacityMaxKg, locale),
      }),
      clear: () => setParams({ capacityMaxKg: null }),
    });
  }

  if (params.mileageMaxKm !== null) {
    chips.push({
      key: "mileage",
      label: t("chips.mileageMax", {
        value: params.mileageMaxKm.toLocaleString(locale),
      }),
      clear: () => setParams({ mileageMaxKm: null }),
    });
  }

  if (params.hoursMax !== null) {
    chips.push({
      key: "hours",
      label: t("chips.hoursMax", {
        value: params.hoursMax.toLocaleString(locale),
      }),
      clear: () => setParams({ hoursMax: null }),
    });
  }

  for (const status of params.availability) {
    chips.push({
      key: `status-${status}`,
      label: tStatus(status as CraneStatus),
      clear: () =>
        setParams({
          availability: params.availability.filter((item) => item !== status),
        }),
    });
  }

  if (params.includeSold) {
    chips.push({
      key: "sold",
      label: t("filters.includeSold"),
      clear: () => setParams({ includeSold: false }),
    });
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.clear}
          className="inline-flex min-h-11 items-center gap-1.5 border border-line bg-surface px-3 text-xs font-medium tracking-wide transition-colors hover:border-steel/40 focus-ring"
        >
          {chip.label}
          <X className="size-3.5 text-steel" aria-hidden />
          <span className="sr-only">{t("chips.remove")}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => setParams(inventoryFilterDefaults)}
        className="focus-ring min-h-11 text-xs font-medium text-steel underline-offset-2 hover:text-foreground hover:underline"
      >
        {t("filters.reset")}
      </button>
    </div>
  );
}
