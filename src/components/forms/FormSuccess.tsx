type FormSuccessProps = {
  title: string;
  description?: string;
  className?: string;
};

export function FormSuccess({
  title,
  description,
  className,
}: FormSuccessProps) {
  return (
    <div
      role="status"
      className={className ?? "space-y-2 border border-brand/40 bg-brand/10 p-5"}
    >
      <p className="font-heading text-lg font-semibold tracking-tight text-foreground">
        {title}
      </p>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
