"use client";

type HoneypotFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

/** Hidden field for bots; must stay empty. */
export function HoneypotField({ id, value, onChange }: HoneypotFieldProps) {
  return (
    <div
      className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
      aria-hidden
    >
      <label htmlFor={id}>Website</label>
      <input
        id={id}
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
