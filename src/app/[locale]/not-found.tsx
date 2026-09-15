import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("Nav");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-[1440px] flex-col items-start justify-center gap-4 px-4 py-16 md:px-8 lg:px-12">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        {t("home")}
      </Link>
    </div>
  );
}
