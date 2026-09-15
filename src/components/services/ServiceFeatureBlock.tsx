import { cn } from "cn";

type ServiceFeatureBlockProps = {
  title: string;
  body: string;
  index?: number;
  className?: string;
};

export function ServiceFeatureBlock({
  title,
  body,
  index,
  className,
}: ServiceFeatureBlockProps) {
  return (
    <article
      className={cn(
        "grid gap-3 border-t border-line py-6 md:grid-cols-[4rem_minmax(0,16rem)_1fr] md:gap-8 md:py-8",
        className,
      )}
    >
      {typeof index === "number" ? (
        <span className="font-heading text-sm font-semibold tracking-wider text-brand tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
      ) : (
        <span className="hidden md:block" aria-hidden />
      )}
      <h3 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
        {title}
      </h3>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {body}
      </p>
    </article>
  );
}
