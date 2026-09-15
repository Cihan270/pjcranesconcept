import * as z from "zod";

import {
  craneSorts,
  craneStatuses,
  craneTypes,
} from "@/types/crane";

/**
 * Inventory filter/sort query params (nuqs + server).
 * Coercion keeps URL strings SSR-safe.
 */
export const inventoryFilterSchema = z.object({
  q: z.string().trim().max(120).optional(),
  manufacturer: z.union([z.string(), z.array(z.string())]).optional(),
  model: z.union([z.string(), z.array(z.string())]).optional(),
  type: z
    .union([z.enum(craneTypes), z.array(z.enum(craneTypes))])
    .optional(),
  yearMin: z.coerce.number().int().min(1970).optional(),
  yearMax: z.coerce
    .number()
    .int()
    .max(new Date().getFullYear() + 1)
    .optional(),
  capacityMinKg: z.coerce.number().int().positive().optional(),
  capacityMaxKg: z.coerce.number().int().positive().optional(),
  mileageMaxKm: z.coerce.number().int().nonnegative().optional(),
  hoursMax: z.coerce.number().int().nonnegative().optional(),
  availability: z
    .union([z.enum(craneStatuses), z.array(z.enum(craneStatuses))])
    .optional(),
  featured: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      if (typeof value === "boolean") return value;
      return value === "true";
    }),
  includeSold: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((value) => {
      if (value === undefined) return false;
      if (typeof value === "boolean") return value;
      return value === "true";
    }),
  sort: z.enum(craneSorts).optional().default("newest"),
});

export type InventoryFilterInput = z.infer<typeof inventoryFilterSchema>;
