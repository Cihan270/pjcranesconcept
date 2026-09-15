"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { company } from "@/data/company";
import { cn } from "cn";

type BrandLogoProps = {
  /** Light mark for dark / transparent headers. */
  inverted?: boolean;
  /** Original PJ Cranes mark for the dark header — transparent, no white box. */
  header?: boolean;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  inverted = false,
  header = false,
  className,
  priority = false,
}: BrandLogoProps) {
  const src = header
    ? "/brand/logo-header.svg"
    : inverted
      ? "/brand/logo-on-dark.svg"
      : "/brand/logo.svg";

  return (
    <Link
      href="/"
      className={cn(
        "focus-ring relative block shrink-0 rounded-[var(--radius)] transition-[width,height] duration-300",
        className,
      )}
      aria-label={company.brandName}
    >
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="200px"
        className="object-contain object-left"
      />
    </Link>
  );
}
