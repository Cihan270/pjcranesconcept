import { cn } from "cn";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  /** Edge-to-edge main (e.g. homepage hero). Default constrains content. */
  bleed?: boolean;
};

export function PageShell({ children, className, bleed = false }: PageShellProps) {
  return (
    <main
      className={cn(
        "flex flex-1 flex-col",
        !bleed && "mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 lg:px-12",
        className,
      )}
    >
      {children}
    </main>
  );
}
