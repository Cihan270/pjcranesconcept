import { getTranslations } from "next-intl/server";
import { Clock3, FileCheck2, Globe2, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

const TRUST_ITEMS = [
  { key: "noCure", icon: ShieldCheck },
  { key: "network", icon: Globe2 },
  { key: "paperwork", icon: FileCheck2 },
  { key: "speed", icon: Clock3 },
] as const;

export async function SellTrustBar() {
  const t = await getTranslations("Sell.trust");

  const items = TRUST_ITEMS.map(({ key, icon: Icon }) => ({
    key,
    Icon,
    title: t(`${key}.title`),
    body: t(`${key}.body`),
  }));

  return (
    <section
      className="border-b border-white/10 bg-charcoal text-surface"
      aria-label={items.map((item) => item.title).join(" · ")}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8 md:py-10 lg:px-12">
        <Reveal>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {items.map(({ key, Icon, title, body }) => (
              <li key={key} className="min-w-0">
                <span
                  className="mb-4 flex size-10 items-center justify-center bg-brand text-brand-foreground"
                  aria-hidden
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <p className="font-heading text-base font-semibold tracking-tight text-surface">
                  {title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-surface/60">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
