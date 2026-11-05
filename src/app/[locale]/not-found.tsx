import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("NotFound");
  const tNav = await getTranslations("Nav");

  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-[1440px] flex-col items-start justify-center gap-4 px-4 py-16 md:px-8 lg:px-12">
      <p className="font-heading text-sm font-semibold tracking-[0.18em] text-steel uppercase">
        404
      </p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        {t("title")}
      </h1>
      <p className="max-w-prose text-muted-foreground">{t("description")}</p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {tNav("home")}
        </Link>
        <Link
          href="/cranes"
          className="inline-flex min-h-11 items-center rounded-[var(--radius)] border border-line px-4 text-sm font-medium"
        >
          {tNav("viewInventory")}
        </Link>
      </div>
    </div>
  );
}
