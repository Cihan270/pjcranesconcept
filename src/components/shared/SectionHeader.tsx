import { cn } from "cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Invert text for charcoal bands. */
  inverted?: boolean;
  align?: "start" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  inverted = false,
  align = "start",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "font-heading text-xs font-semibold tracking-[0.22em] uppercase",
              inverted ? "text-brand" : "text-steel",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.65rem]",
            inverted ? "text-surface" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "max-w-xl text-base leading-relaxed",
              inverted ? "text-surface/70" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
