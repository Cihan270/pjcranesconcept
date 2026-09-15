"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CraneCardClient } from "@/components/cranes/CraneCardClient";
import { CraneListItemClient } from "@/components/cranes/CraneListItemClient";
import { InventoryFilters } from "@/components/cranes/InventoryFilters";
import { InventoryToolbar } from "@/components/cranes/InventoryToolbar";
import { ActiveFilterBar } from "@/components/cranes/ActiveFilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { filterCranes } from "@/lib/inventory/repository";
import {
  inventoryFilterDefaults,
  inventoryParsers,
  toCraneFilterParams,
} from "@/lib/inventory/search-params";
import type { Crane } from "@/types/crane";

type InventoryMarketplaceProps = {
  cranes: Crane[];
  manufacturers: string[];
  models: string[];
};

export function InventoryMarketplace({
  cranes,
  manufacturers,
  models,
}: InventoryMarketplaceProps) {
  const t = useTranslations("Inventory");
  const reduceMotion = useReducedMotion();
  const [params, setParams] = useQueryStates(inventoryParsers, {
    history: "push",
    shallow: true,
  });

  const filtered = useMemo(
    () => filterCranes(cranes, toCraneFilterParams(params)),
    [cranes, params],
  );

  const availableModels = useMemo(() => {
    if (params.manufacturer.length === 0) return models;
    const allowed = new Set(
      params.manufacturer.map((name) => name.toLowerCase()),
    );
    return [
      ...new Set(
        cranes
          .filter((crane) => allowed.has(crane.manufacturer.toLowerCase()))
          .map((crane) => crane.model),
      ),
    ].sort();
  }, [cranes, models, params.manufacturer]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(14rem,18rem)_1fr] lg:gap-10">
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4 border border-line bg-surface p-5">
          <div>
            <p className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase">
              {t("filters.eyebrow")}
            </p>
            <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight">
              {t("filters.title")}
            </h2>
          </div>
          <InventoryFilters
            manufacturers={manufacturers}
            models={availableModels}
            idPrefix="desktop"
          />
        </div>
      </aside>

      <div className="min-w-0 space-y-5">
        <InventoryToolbar
          total={filtered.length}
          manufacturers={manufacturers}
          models={availableModels}
        />
        <ActiveFilterBar />

        {filtered.length === 0 ? (
          <EmptyState
            title={t("empty.title")}
            description={t("empty.description")}
            action={
              <button
                type="button"
                onClick={() => setParams(inventoryFilterDefaults)}
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
              >
                {t("filters.reset")}
              </button>
            }
          />
        ) : params.view === "list" ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key="list"
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="divide-y-0"
            >
              {filtered.map((crane, index) => (
                <CraneListItemClient
                  key={crane.id}
                  crane={crane}
                  priority={index === 0}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key="grid"
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3"
            >
              {filtered.map((crane, index) => (
                <CraneCardClient
                  key={crane.id}
                  crane={crane}
                  priority={index === 0}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
