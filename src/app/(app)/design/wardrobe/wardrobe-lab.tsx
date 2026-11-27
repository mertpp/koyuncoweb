"use client";

import { useState, type ReactNode } from "react";

import { ColorDots, GarmentCard } from "@/shared/components/koyun/card";
import { Select } from "@/shared/components/koyun/field";
import { ColorSwatches, RefineButton, SearchField } from "@/shared/components/koyun/filters";
import { Chip, GarmentGrid, SegmentedControl, gridDensities, type GridDensity } from "@/shared/components/koyun/garment-grid";
import { Eyebrow } from "@/shared/components/koyun/layout";

import { sampleCategories, sampleGarments } from "./sample-garments";

// Decided (rounds 1-3): medium thumbnails by default, label top-left, no size label, brand or
// category + name below, colour dots, bare filter bar below the title, chips without icons,
// size switch with icons, colours multi-select, brand on the photo and category below (round 4).

type Emphasis = "category-on-photo" | "brand-on-photo";
type Toggle = "on" | "off";

/** The card size that fits each grid density. */
const cardSize = { large: "default", medium: "compact", small: "photo" } as const;

const unique = (values: string[]) => [...new Set(values)].sort();
const brands = unique(sampleGarments.map((garment) => garment.brand));
const sizes = unique(sampleGarments.map((garment) => garment.size));
const swatches = [
  ...new Map(sampleGarments.flatMap((garment) => garment.colors).map((color) => [color.name, color])).values(),
];

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-xs">
      <span className="text-label-sm uppercase text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export function WardrobeLab() {
  const [density, setDensity] = useState<GridDensity>("medium");
  const [emphasis, setEmphasis] = useState<Emphasis>("brand-on-photo");
  const [drafts, setDrafts] = useState<Toggle>("on");

  // Lab only: in the real wardrobe, search and filters are the backend's job (gap B9).
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [refineOpen, setRefineOpen] = useState(false);
  const [size, setSize] = useState<string | null>(null);

  const needle = query.trim().toLowerCase();
  const garments = sampleGarments.filter(
    (garment) =>
      (drafts === "on" || !garment.draft) &&
      (!needle || `${garment.title} ${garment.brand}`.toLowerCase().includes(needle)) &&
      (!brand || garment.brand === brand) &&
      (!category || garment.category === category) &&
      // Any of the chosen colours: "blue and burgundy" shows the blue ones and the burgundy ones.
      (colors.length === 0 || garment.colors.some((item) => colors.includes(item.name))) &&
      (!size || garment.size === size),
  );

  return (
    <>
      <details className="rounded-lg border border-dashed border-border bg-surface-container-low p-space-md" open>
        <summary className="cursor-pointer text-tech-sm text-muted-foreground">
          DESIGN LAB · SAMPLE DATA · variants (nothing here calls the API)
        </summary>
        <div className="mt-space-md flex flex-wrap gap-space-lg">
          <Control label="On the photo / below">
            <SegmentedControl
              label="On the photo / below"
              options={[
                { value: "brand-on-photo", label: "Brand on photo · category below" },
                { value: "category-on-photo", label: "Category on photo · brand below" },
              ]}
              value={emphasis}
              onChange={setEmphasis}
            />
          </Control>
          <Control label="Drafts">
            <SegmentedControl
              label="Drafts"
              options={[
                { value: "on", label: "On" },
                { value: "off", label: "Off" },
              ]}
              value={drafts}
              onChange={setDrafts}
            />
          </Control>
        </div>
      </details>

      <header className="flex flex-col gap-space-md md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-space-sm">
          <Eyebrow>{garments.length} pieces</Eyebrow>
          <h1 className="text-headline-xl">Wardrobe</h1>
          <p className="text-headline-sm italic text-muted-foreground">Everything you own, in one quiet place.</p>
        </div>
        <SegmentedControl label="Thumbnail size" options={gridDensities} value={density} onChange={setDensity} />
      </header>

      <section aria-label="Filters" className="flex flex-col gap-space-md">
        <div className="flex flex-col gap-space-sm md:flex-row md:items-center">
          <SearchField
            aria-label="Search garments"
            placeholder="Search by name or brand"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="md:max-w-xs md:flex-1"
          />
          <div className="grid grid-cols-2 gap-space-sm md:flex">
            <Select aria-label="Brand" value={brand} onChange={(event) => setBrand(event.target.value)}>
              <option value="">All brands</option>
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Category"
              value={category ?? ""}
              onChange={(event) => setCategory(event.target.value || null)}
            >
              <option value="">All categories</option>
              {sampleCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <RefineButton
            open={refineOpen}
            count={size ? 1 : 0}
            onClick={() => setRefineOpen((open) => !open)}
            className="self-start md:ml-auto md:self-auto"
          />
        </div>

        <ColorSwatches colors={swatches} selected={colors} onChange={setColors} />

        <div className="-mx-margin-mobile flex gap-space-sm overflow-x-auto px-margin-mobile pb-space-xs md:mx-0 md:px-0">
          <Chip selected={category === null} onClick={() => setCategory(null)}>
            All
          </Chip>
          {sampleCategories.map((item) => (
            <Chip key={item} selected={category === item} onClick={() => setCategory(item)}>
              {item}
            </Chip>
          ))}
        </div>

        {refineOpen ? (
          <div className="flex flex-col gap-space-sm border-t border-border pt-space-md">
            <span className="text-label-sm uppercase text-muted-foreground">Size</span>
            <div className="flex flex-wrap gap-space-sm">
              {sizes.map((item) => (
                <Chip key={item} selected={size === item} onClick={() => setSize(size === item ? null : item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <GarmentGrid density={density}>
        {garments.map((garment) => {
          const brandOnPhoto = emphasis === "brand-on-photo";
          const onPhoto = brandOnPhoto ? garment.brand : garment.category;
          const below = brandOnPhoto ? garment.category : garment.brand;

          return (
            <GarmentCard
              key={garment.id}
              size={cardSize[density]}
              imageSrc={garment.image}
              imageAlt={garment.title}
              badge={onPhoto}
              status={garment.draft ? "Draft" : null}
              meta={below.toUpperCase()}
              title={garment.title}
              colors={<ColorDots colors={garment.colors} />}
            />
          );
        })}
      </GarmentGrid>

      {garments.length === 0 ? (
        <p className="text-body-md text-muted-foreground">No garments match these filters.</p>
      ) : null}
    </>
  );
}
