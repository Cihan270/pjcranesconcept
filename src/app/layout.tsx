import type { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

/**
 * Minimal root shell. Locale `<html lang>` + fonts live in `[locale]/layout`
 * so each language can set `lang` correctly (next-intl App Router pattern).
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
