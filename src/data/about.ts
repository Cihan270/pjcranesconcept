import { company } from "@/data/company";
import { officeCount } from "@/data/offices";

const MACHINE = "https://pj-cranes.com/machines";

/**
 * Verified About-page display values — always derive from company/offices.
 * Do not add unverified KPIs (e.g. countries served, cranes sold).
 */
export const aboutStatsSource = {
  experienceYears: company.experienceYears,
  officeCount,
  capacityMin: company.capacityRangeTons.min,
  capacityMax: company.capacityRangeTons.max,
  brandCount: company.manufacturers.length,
} as const;

export const aboutImages = {
  hero: {
    src: `${MACHINE}/1678695475prkuy.jpg`,
    objectPosition: "72% 38%",
  },
  story: {
    src: `${MACHINE}/1762941241qtp3m.jpg`,
    objectPosition: "50% 55%",
  },
} as const;
