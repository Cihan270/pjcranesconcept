"use client";

import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  inventoryFilterDefaults,
  inventoryParsers,
} from "@/lib/inventory/search-params";
import { craneStatuses, craneTypes, type CraneType } from "@/types/crane";
import { cn } from "cn";

const CAPACITY_OPTIONS_TONS = [20, 50, 100, 200, 300, 500, 1000] as const;
const MILEAGE_OPTIONS = [10_000, 25_000, 50_000, 100_000] as const;
const HOURS_OPTIONS = [2_000, 5_000, 8_000, 12_000, 20_000] as const;

type InventoryFiltersProps = {
  manufacturers: string[];
  models: string[];
  className?: string;
  idPrefix?: string;
};

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function InventoryFilters({
  manufacturers,
  models,
  className,
  idPrefix = "inv",
}: InventoryFiltersProps) {
  const t = useTranslations("Inventory.filters");
  const tType = useTranslations("Crane.type");
  const tStatus = useTranslations("Crane.status");
  const [params, setParams] = useQueryStates(inventoryParsers, {
    history: "push",
    shallow: true,
  });

  const yearNow = new Date().getFullYear();

  const capacityMinTons =
    params.capacityMinKg !== null
      ? String(params.capacityMinKg / 1000)
      : "any";
  const capacityMaxTons =
    params.capacityMaxKg !== null
      ? String(params.capacityMaxKg / 1000)
      : "any";

  const capacityItems = {
    any: t("any"),
    ...Object.fromEntries(
      CAPACITY_OPTIONS_TONS.map((tons) => [String(tons), `${tons} t`]),
    ),
  };

  const mileageItems = {
    any: t("any"),
    ...Object.fromEntries(
      MILEAGE_OPTIONS.map((km) => [
        String(km),
        t("mileageUpTo", { value: km.toLocaleString() }),
      ]),
    ),
  };

  const hoursItems = {
    any: t("any"),
    ...Object.fromEntries(
      HOURS_OPTIONS.map((hours) => [
        String(hours),
        t("hoursUpTo", { value: hours.toLocaleString() }),
      ]),
    ),
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-q`}>{t("query")}</Label>
        <Input
          id={`${idPrefix}-q`}
          value={params.q}
          onChange={(event) => setParams({ q: event.target.value })}
          placeholder={t("queryPlaceholder")}
          className="h-11 rounded-[var(--radius)]"
          autoComplete="off"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">{t("manufacturer")}</legend>
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
          {manufacturers.map((name) => {
            const id = `${idPrefix}-mfr-${name}`;
            const checked = params.manufacturer.includes(name);
            return (
              <label
                key={name}
                htmlFor={id}
                className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={() =>
                    setParams({
                      manufacturer: toggleValue(params.manufacturer, name),
                      model: [],
                    })
                  }
                />
                <span>{name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-model`}>{t("model")}</Label>
        <Select
          value={params.model[0] ?? "any"}
          onValueChange={(value) =>
            setParams({
              model: !value || value === "any" ? [] : [value],
            })
          }
          items={{
            any: t("allModels"),
            ...Object.fromEntries(models.map((m) => [m, m])),
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-model`}
            className="h-11 w-full rounded-[var(--radius)]"
          >
            <SelectValue placeholder={t("allModels")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("allModels")}</SelectItem>
            {models.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">{t("type")}</legend>
        <div className="space-y-2">
          {craneTypes.map((type) => {
            const id = `${idPrefix}-type-${type}`;
            const checked = params.type.includes(type);
            return (
              <label
                key={type}
                htmlFor={id}
                className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={() =>
                    setParams({
                      type: toggleValue(params.type, type as CraneType),
                    })
                  }
                />
                <span>{tType(type)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-year-min`}>{t("yearMin")}</Label>
          <Input
            id={`${idPrefix}-year-min`}
            type="number"
            inputMode="numeric"
            min={1970}
            max={yearNow + 1}
            value={params.yearMin ?? ""}
            onChange={(event) => {
              const raw = event.target.value;
              setParams({
                yearMin: raw === "" ? null : Number.parseInt(raw, 10),
              });
            }}
            className="h-11 rounded-[var(--radius)] tabular-nums"
            placeholder="1970"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-year-max`}>{t("yearMax")}</Label>
          <Input
            id={`${idPrefix}-year-max`}
            type="number"
            inputMode="numeric"
            min={1970}
            max={yearNow + 1}
            value={params.yearMax ?? ""}
            onChange={(event) => {
              const raw = event.target.value;
              setParams({
                yearMax: raw === "" ? null : Number.parseInt(raw, 10),
              });
            }}
            className="h-11 rounded-[var(--radius)] tabular-nums"
            placeholder={String(yearNow)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-cap-min`}>{t("capacityMin")}</Label>
          <Select
            value={capacityMinTons}
            onValueChange={(value) =>
              setParams({
                capacityMinKg:
                  !value || value === "any"
                    ? null
                    : Number.parseInt(value, 10) * 1000,
              })
            }
            items={capacityItems}
          >
            <SelectTrigger
              id={`${idPrefix}-cap-min`}
              className="h-11 w-full rounded-[var(--radius)]"
            >
              <SelectValue placeholder={t("any")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("any")}</SelectItem>
              {CAPACITY_OPTIONS_TONS.map((tons) => (
                <SelectItem key={tons} value={String(tons)}>
                  {tons} t
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-cap-max`}>{t("capacityMax")}</Label>
          <Select
            value={capacityMaxTons}
            onValueChange={(value) =>
              setParams({
                capacityMaxKg:
                  !value || value === "any"
                    ? null
                    : Number.parseInt(value, 10) * 1000,
              })
            }
            items={capacityItems}
          >
            <SelectTrigger
              id={`${idPrefix}-cap-max`}
              className="h-11 w-full rounded-[var(--radius)]"
            >
              <SelectValue placeholder={t("any")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("any")}</SelectItem>
              {CAPACITY_OPTIONS_TONS.map((tons) => (
                <SelectItem key={tons} value={String(tons)}>
                  {tons} t
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-mileage`}>{t("mileageMax")}</Label>
        <Select
          value={
            params.mileageMaxKm !== null ? String(params.mileageMaxKm) : "any"
          }
          onValueChange={(value) =>
            setParams({
              mileageMaxKm:
                !value || value === "any" ? null : Number.parseInt(value, 10),
            })
          }
          items={mileageItems}
        >
          <SelectTrigger
            id={`${idPrefix}-mileage`}
            className="h-11 w-full rounded-[var(--radius)]"
          >
            <SelectValue placeholder={t("any")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("any")}</SelectItem>
            {MILEAGE_OPTIONS.map((km) => (
              <SelectItem key={km} value={String(km)}>
                {t("mileageUpTo", { value: km.toLocaleString() })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-hours`}>{t("hoursMax")}</Label>
        <Select
          value={params.hoursMax !== null ? String(params.hoursMax) : "any"}
          onValueChange={(value) =>
            setParams({
              hoursMax:
                !value || value === "any" ? null : Number.parseInt(value, 10),
            })
          }
          items={hoursItems}
        >
          <SelectTrigger
            id={`${idPrefix}-hours`}
            className="h-11 w-full rounded-[var(--radius)]"
          >
            <SelectValue placeholder={t("any")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("any")}</SelectItem>
            {HOURS_OPTIONS.map((hours) => (
              <SelectItem key={hours} value={String(hours)}>
                {t("hoursUpTo", { value: hours.toLocaleString() })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">{t("availability")}</legend>
        <div className="space-y-2">
          {craneStatuses
            .filter((status) => status !== "sold")
            .map((status) => {
              const id = `${idPrefix}-status-${status}`;
              const checked = params.availability.includes(status);
              return (
                <label
                  key={status}
                  htmlFor={id}
                  className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={() =>
                      setParams({
                        availability: toggleValue(params.availability, status),
                      })
                    }
                  />
                  <span>{tStatus(status)}</span>
                </label>
              );
            })}
        </div>
      </fieldset>

      <label
        htmlFor={`${idPrefix}-include-sold`}
        className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
      >
        <Checkbox
          id={`${idPrefix}-include-sold`}
          checked={params.includeSold}
          onCheckedChange={(checked) =>
            setParams({ includeSold: Boolean(checked) })
          }
        />
        <span>{t("includeSold")}</span>
      </label>

      <button
        type="button"
        onClick={() => setParams(inventoryFilterDefaults)}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius)] border border-line bg-surface text-sm font-medium transition-colors hover:bg-background"
      >
        {t("reset")}
      </button>
    </div>
  );
}
