"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { GarmentCard } from "@/shared/components/koyun/card";
import { GarmentGrid, SegmentedControl, gridDensities, type GridDensity } from "@/shared/components/koyun/garment-grid";
import { Eyebrow } from "@/shared/components/koyun/layout";

// The wardrobe grid with the thumbnail size switch (target design: /design/wardrobe).
// The chosen size is a screen preference, remembered in this browser only.

export type WardrobeItem = {
  id: string;
  href: string;
  imageSrc: string | null;
  title: string;
  /** Glass label on the photo: the brand once the list carries it (gap B8). */
  label: string | null;
  /** Mono line below the photo (the category). */
  meta: string | null;
  draft: boolean;
};

const STORAGE_KEY = "koyun.wardrobe.density";
const CHANGE_EVENT = "koyun:wardrobe-density";
const DEFAULT_DENSITY: GridDensity = "medium";

/** The card size that fits each grid density. */
const cardSize = { large: "default", medium: "compact", small: "photo" } as const;

function isDensity(value: string | null): value is GridDensity {
  return gridDensities.some((option) => option.value === value);
}

function readDensity(): GridDensity {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isDensity(stored) ? stored : DEFAULT_DENSITY;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function saveDensity(density: GridDensity) {
  window.localStorage.setItem(STORAGE_KEY, density);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function Cards({ items, density }: { items: WardrobeItem[]; density: GridDensity }) {
  return (
    <GarmentGrid density={density}>
      {items.map((item) => (
        <Link key={item.id} href={item.href} aria-label={item.draft ? `Continue draft: ${item.title}` : item.title}>
          <GarmentCard
            size={cardSize[density]}
            imageSrc={item.imageSrc}
            imageAlt={item.imageSrc ? item.title : "No photo yet"}
            badge={item.label}
            status={item.draft ? "Draft" : null}
            meta={item.meta}
            title={item.title}
          />
        </Link>
      ))}
    </GarmentGrid>
  );
}

export function WardrobeGallery({
  garments,
  drafts,
  actions,
  empty,
}: {
  garments: WardrobeItem[];
  drafts: WardrobeItem[];
  actions: React.ReactNode;
  empty: React.ReactNode;
}) {
  // Server render and first paint use the default; the stored choice applies right after.
  const density = useSyncExternalStore(subscribe, readDensity, () => DEFAULT_DENSITY);

  return (
    <>
      <header className="flex flex-col gap-space-md md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-space-sm">
          <Eyebrow>
            {garments.length} {garments.length === 1 ? "piece" : "pieces"}
          </Eyebrow>
          <h1 className="text-headline-xl">Wardrobe</h1>
          <p className="text-headline-sm italic text-muted-foreground">Everything you own, in one quiet place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-space-md">
          <SegmentedControl label="Thumbnail size" options={gridDensities} value={density} onChange={saveDensity} />
          {actions}
        </div>
      </header>

      {drafts.length > 0 ? (
        <section className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <h2 className="text-headline-md">Pending drafts</h2>
            <p className="text-body-md text-muted-foreground">
              Not saved yet. Continue where you left off, or discard them.
            </p>
          </div>
          <Cards items={drafts} density={density} />
        </section>
      ) : null}

      {garments.length === 0 ? empty : <Cards items={garments} density={density} />}
    </>
  );
}
