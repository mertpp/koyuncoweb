import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

// Content pieces from doc/DESIGN.md: hairline-framed cards, glass image badges, spec rows
// and the garment card (3:4 photo). Visual reference: /design.

const cardTones = {
  default: "bg-surface-container-lowest",
  page: "bg-background",
  muted: "bg-surface-container-low",
} as const;

/** Hairline-framed card, 8px radius. `elevated` adds the micro-elevation shadow. */
export function Card({
  tone = "default",
  elevated = false,
  className,
  ...props
}: ComponentProps<"article"> & { tone?: keyof typeof cardTones; elevated?: boolean }) {
  return (
    <article
      className={cn(
        "flex flex-col gap-space-md rounded-lg border border-border p-space-lg",
        cardTones[tone],
        elevated && "shadow-elevated",
        className,
      )}
      {...props}
    />
  );
}

const badgeCorners = {
  "top-left": "left-space-sm top-space-sm",
  "bottom-left": "bottom-space-sm left-space-sm",
  "bottom-right": "bottom-space-sm right-space-sm",
} as const;

export type BadgeCorner = keyof typeof badgeCorners;

/** Glass label over a photo (top-left by default). The parent must be `relative`. */
export function ImageBadge({
  corner = "top-left",
  className,
  ...props
}: ComponentProps<"span"> & { corner?: BadgeCorner }) {
  return (
    <span
      className={cn(
        "absolute max-w-4/5 truncate rounded-sm border border-border bg-background/85 px-space-sm py-space-xs text-tech-sm backdrop-blur-lg",
        badgeCorners[corner],
        className,
      )}
      {...props}
    />
  );
}

/**
 * Small colour swatches. `colors` are the hex hints the taxonomy returns for each colour code
 * (data, not design tokens), with their names for screen readers.
 */
export function ColorDots({ colors }: { colors: ReadonlyArray<{ name: string; hex: string }> }) {
  if (colors.length === 0) {
    return null;
  }

  return (
    <ul className="flex items-center gap-space-xs" aria-label="Colours">
      {colors.map((color) => (
        <li
          key={color.name}
          title={color.name}
          aria-label={color.name}
          className="size-3 rounded-full border border-border"
          style={{ backgroundColor: color.hex }}
        />
      ))}
    </ul>
  );
}

type SpecItem = { label: ReactNode; value: ReactNode };

/** One label/value line of a spec list. Use inside <dl className="flex flex-col gap-space-sm">. */
export function SpecRow({ icon, label, value }: { icon?: ReactNode; label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-space-md">
      <dt className="flex items-center gap-space-sm text-label-sm uppercase">
        {icon}
        {label}
      </dt>
      <dd className="text-right text-body-md">{value}</dd>
    </div>
  );
}

const specColumns = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" } as const;

/** Ledger of 2–4 short facts in monospace columns (established, garments, brands…). */
export function SpecGrid({
  items,
}: {
  items:
    | readonly [SpecItem, SpecItem]
    | readonly [SpecItem, SpecItem, SpecItem]
    | readonly [SpecItem, SpecItem, SpecItem, SpecItem];
}) {
  return (
    <dl
      className={cn(
        "grid divide-x divide-border overflow-hidden rounded-md border border-border bg-background",
        specColumns[items.length],
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-space-xs p-space-sm text-center">
          <dt className="text-tech-sm text-muted-foreground">{item.label}</dt>
          <dd className="text-tech-md">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Gallery card: 3:4 photo, optional glass badges, mono meta line, serif title, notes, colours,
 * footer. `size="compact"` is for dense grids: smaller title, no description or footer.
 * `size="photo"` shows the photo and its badges only (the smallest thumbnails).
 */
export function GarmentCard({
  imageSrc,
  imageAlt,
  badge,
  badgeCorner = "top-left",
  cornerBadge,
  meta,
  title,
  description,
  colors,
  footer,
  size = "default",
}: {
  /** Without a photo (a draft that has none yet) the frame shows `imageAlt` instead. */
  imageSrc?: string | null;
  imageAlt: string;
  badge?: ReactNode;
  badgeCorner?: Exclude<BadgeCorner, "bottom-right">;
  /** Second, smaller badge in the bottom-right corner (a size, for instance). */
  cornerBadge?: ReactNode;
  meta?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  colors?: ReactNode;
  footer?: ReactNode;
  size?: "default" | "compact" | "photo";
}) {
  const compact = size === "compact";

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface-container-lowest transition hover:shadow-elevated">
      <div className="relative aspect-3/4 overflow-hidden bg-surface-container">
        {/* Plain <img> for now (lint warning, like the rest of the app): next/image needs the
            photo hosts configured, which comes with the real garment photos in J2. */}
        {imageSrc ? (
          <img
            className="size-full object-cover transition duration-700 group-hover:scale-105"
            src={imageSrc}
            alt={imageAlt}
          />
        ) : (
          <span className="flex size-full items-center justify-center text-tech-sm text-muted-foreground">
            {imageAlt}
          </span>
        )}
        {badge ? <ImageBadge corner={badgeCorner}>{badge}</ImageBadge> : null}
        {cornerBadge ? <ImageBadge corner="bottom-right">{cornerBadge}</ImageBadge> : null}
      </div>
      {size === "photo" ? (
        <h3 className="sr-only">{title}</h3>
      ) : (
        <div
          className={cn(
            "flex flex-1 flex-col justify-between",
            compact ? "gap-space-sm p-space-sm" : "gap-space-md p-space-md",
          )}
        >
          <div className="flex flex-col gap-space-xs">
            {meta ? <span className="truncate text-tech-sm text-muted-foreground">{meta}</span> : null}
            <h3 className={compact ? "text-headline-sm" : "text-headline-md"}>{title}</h3>
            {description && !compact ? (
              <p className="text-body-md text-muted-foreground">{description}</p>
            ) : null}
            {colors}
          </div>
          {footer && !compact ? <span className="text-tech-sm text-muted-foreground">{footer}</span> : null}
        </div>
      )}
    </article>
  );
}
