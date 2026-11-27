import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

// Gallery grid with three thumbnail sizes, and the small controls that go with it
// (size switch, category chips). Visual reference: /design and /design/wardrobe.

const densities = {
  large: "grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3",
  medium: "grid-cols-2 gap-gutter-mobile sm:grid-cols-3 sm:gap-gutter lg:grid-cols-4",
  small: "grid-cols-3 gap-gutter-mobile sm:grid-cols-4 lg:grid-cols-6",
} as const;

export type GridDensity = keyof typeof densities;

export const gridDensities: ReadonlyArray<{ value: GridDensity; label: string }> = [
  { value: "large", label: "Large" },
  { value: "medium", label: "Medium" },
  { value: "small", label: "Small" },
];

/** Columns per size: large 1/2/3, medium 2/3/4, small 3/4/6 (mobile/tablet/desktop). */
export function GarmentGrid({
  density = "medium",
  className,
  ...props
}: ComponentProps<"div"> & { density?: GridDensity }) {
  return <div className={cn("grid", densities[density], className)} {...props} />;
}

/** A small set of mutually exclusive options (thumbnail size, view…). */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: ReactNode }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg border border-border bg-surface-container-low p-space-xs">
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md px-space-sm py-space-xs text-label-sm transition",
              selected
                ? "bg-surface-container-lowest text-foreground shadow-elevated"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** One filter chip; `selected` fills it with the brand green. */
export function Chip({
  selected = false,
  className,
  ...props
}: ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-lg border px-space-md py-space-xs text-label-md transition",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
