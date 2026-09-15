import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/** Fallback for static export / unmatched root; proxy normally redirects `/` → `/nl`. */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
