import { cn } from "cn";

type ProseProps = {
  children: React.ReactNode;
  className?: string;
};

/** Long-form editorial / legal body copy. */
export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base",
        "[&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:first:mt-0 md:[&_h2]:text-2xl",
        "[&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-foreground",
        "[&_p]:text-muted-foreground",
        "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
        "[&_li]:text-muted-foreground",
        "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
