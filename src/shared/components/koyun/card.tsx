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

/** Glass label over a photo (top-left corner). The parent must be `relative`. */
export function ImageBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "absolute left-space-md top-space-md rounded-sm border border-border bg-background/85 px-space-sm py-space-xs text-tech-sm backdrop-blur-lg",
        className,
      )}
      {...props}
    />
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

/** Gallery card: 3:4 photo, optional badge, mono meta line, serif title, notes, footer. */
export function GarmentCard({
  imageSrc,
  imageAlt,
  badge,
  meta,
  title,
  description,
  footer,
}: {
  imageSrc: string;
  imageAlt: string;
  badge?: ReactNode;
  meta?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface-container-lowest">
      <div className="relative aspect-3/4 overflow-hidden bg-surface-container">
        {/* Plain <img> for now (lint warning, like the rest of the app): next/image needs the
            photo hosts configured, which comes with the real garment photos in J2. */}
        <img
          className="size-full object-cover transition duration-700 group-hover:scale-105"
          src={imageSrc}
          alt={imageAlt}
        />
        {badge ? <ImageBadge>{badge}</ImageBadge> : null}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-space-md p-space-md">
        <div className="flex flex-col gap-space-xs">
          {meta ? <span className="text-tech-sm text-muted-foreground">{meta}</span> : null}
          <h3 className="text-headline-md">{title}</h3>
          {description ? <p className="text-body-md text-muted-foreground">{description}</p> : null}
        </div>
        {footer ? <span className="text-tech-sm text-muted-foreground">{footer}</span> : null}
      </div>
    </article>
  );
}
