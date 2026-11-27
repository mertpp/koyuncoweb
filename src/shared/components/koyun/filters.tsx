import { Search, SlidersHorizontal } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";

import { Input } from "./field";

// Filter bar pieces for galleries: search field, colour swatches and the "Refine" button.
// They only show and report choices; filtering itself is the backend's job.
// Visual reference: /design/wardrobe.

/** Text input with a search icon. Give it an `aria-label` (it has no visible label). */
export function SearchField({ className, ...props }: ComponentProps<"input">) {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-space-sm top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input type="search" className="pl-space-xl" {...props} />
    </div>
  );
}

/** Pickable colour circles; the selected one gets a ring. `hex` comes from the taxonomy. */
export function ColorSwatches({
  colors,
  selected,
  onSelect,
}: {
  colors: ReadonlyArray<{ name: string; hex: string }>;
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Colour" className="flex flex-wrap items-center gap-space-sm">
      {colors.map((color) => {
        const active = color.name === selected;

        return (
          <button
            key={color.name}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={color.name}
            title={color.name}
            onClick={() => onSelect(active ? null : color.name)}
            className={cn(
              "size-6 rounded-full border border-border transition",
              active ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:scale-110",
            )}
            style={{ backgroundColor: color.hex }}
          />
        );
      })}
    </div>
  );
}

/** "Refine" toggle with a sliders icon and the number of active filters. */
export function RefineButton({
  open,
  count,
  className,
  ...props
}: ComponentProps<"button"> & { open: boolean; count: number }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      className={cn(
        "inline-flex items-center gap-space-sm rounded-lg border px-space-md py-space-sm text-label-md transition",
        open ? "border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      <SlidersHorizontal aria-hidden className="size-4" />
      Refine
      {count > 0 ? (
        <span className="rounded-sm bg-primary px-space-xs text-tech-sm text-primary-foreground">{count}</span>
      ) : null}
    </button>
  );
}
