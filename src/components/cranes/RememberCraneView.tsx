"use client";

import { useEffect } from "react";
import { rememberCraneSlug } from "@/lib/inventory/recently-viewed";

type RememberCraneViewProps = {
  slug: string;
};

export function RememberCraneView({ slug }: RememberCraneViewProps) {
  useEffect(() => {
    rememberCraneSlug(slug);
  }, [slug]);

  return null;
}
