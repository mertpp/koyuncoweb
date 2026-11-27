"use client";

import { Footprints, LayoutGrid, Shirt } from "lucide-react";
import { useState, type ReactNode } from "react";

import { ColorDots, GarmentCard } from "@/shared/components/koyun/card";
import { Select } from "@/shared/components/koyun/field";
import { ColorSwatches, RefineButton, SearchField } from "@/shared/components/koyun/filters";
import { Chip, GarmentGrid, SegmentedControl, gridDensities, type GridDensity } from "@/shared/components/koyun/garment-grid";
import { Eyebrow } from "@/shared/components/koyun/layout";
import { cn } from "@/shared/lib/utils";

import { sampleCategories, sampleGarments } from "./sample-garments";

type BadgeContent = "brand" | "category" | "none";
type BadgePlace = "top-left" | "bottom-left";
type TextLevel = "minimal" | "normal" | "full";
type BarStyle = "panel" | "bare";
type Toggle = "on" | "off";

const onOff = [
  { value: "on", label: "On" },
  { value: "off", label: "Off" },
] as const;

/** The card size that fits each grid density. */
const cardSize = { large: "default", medium: "compact", small: "photo" } as const;

// lucide has few clothing icons: only these categories get one (option A).
const categoryIcons: Record<string, ReactNode> = {
  Footwear: <Footprints aria-hidden />,
  Shirting: <Shirt aria-hidden />,
};

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
  // Variants (defaults = what was chosen in the first round).
  const [density, setDensity] = useState<GridDensity>("medium");
  const [badge, setBadge] = useState<BadgeContent>("category");
  const [badgePlace, setBadgePlace] = useState<BadgePlace>("top-left");
  const [sizeBadge, setSizeBadge] = useState<Toggle>("off");
  const [text, setText] = useState<TextLevel>("normal");
  const [colors, setColors] = useState<Toggle>("on");
  const [barStyle, setBarStyle] = useState<BarStyle>("bare");
  const [chips, setChips] = useState<Toggle>("on");
  const [chipIcons, setChipIcons] = useState<Toggle>("on");
  const [drafts, setDrafts] = useState<Toggle>("on");

  // Lab only: in the real wardrobe, search and filters are the backend's job (gap B9).
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [refineOpen, setRefineOpen] = useState(false);
  const [size, setSize] = useState<string | null>(null);

  const needle = query.trim().toLowerCase();
  const garments = sampleGarments.filter(
    (garment) =>
      (drafts === "on" || !garment.draft) &&
      (!needle || `${garment.title} ${garment.brand}`.toLowerCase().includes(needle)) &&
      (!brand || garment.brand === brand) &&
      (!category || garment.category === category) &&
      (!color || garment.colors.some((item) => item.name === color)) &&
      (!size || garment.size === size),
  );
  const refineCount = size ? 1 : 0;

  return (
    <>
      <details className="rounded-lg border border-dashed border-border bg-surface-container-low p-space-md" open>
        <summary className="cursor-pointer text-tech-sm text-muted-foreground">
          DESIGN LAB · SAMPLE DATA · variants (nothing here calls the API)
        </summary>
        <div className="mt-space-md flex flex-wrap gap-space-lg">
          <Control label="Thumbnail size">
            <SegmentedControl label="Thumbnail size" options={gridDensities} value={density} onChange={setDensity} />
          </Control>
          <Control label="Photo label">
            <SegmentedControl
              label="Photo label"
              options={[
                { value: "category", label: "Category" },
                { value: "brand", label: "Brand" },
                { value: "none", label: "None" },
              ]}
              value={badge}
              onChange={setBadge}
            />
          </Control>
          <Control label="Label position">
            <SegmentedControl
              label="Label position"
              options={[
                { value: "top-left", label: "Top" },
                { value: "bottom-left", label: "Bottom" },
              ]}
              value={badgePlace}
              onChange={setBadgePlace}
            />
          </Control>
          <Control label="Size label">
            <SegmentedControl label="Size label" options={onOff} value={sizeBadge} onChange={setSizeBadge} />
          </Control>
          <Control label="Text below">
            <SegmentedControl
              label="Text below"
              options={[
                { value: "minimal", label: "Minimal" },
                { value: "normal", label: "Normal" },
                { value: "full", label: "Full" },
              ]}
              value={text}
              onChange={setText}
            />
          </Control>
          <Control label="Colours">
            <SegmentedControl label="Colours" options={onOff} value={colors} onChange={setColors} />
          </Control>
          <Control label="Filter bar">
            <SegmentedControl
              label="Filter bar"
              options={[
                { value: "bare", label: "Bare" },
                { value: "panel", label: "Panel" },
              ]}
              value={barStyle}
              onChange={setBarStyle}
            />
          </Control>
          <Control label="Category chips">
            <SegmentedControl label="Category chips" options={onOff} value={chips} onChange={setChips} />
          </Control>
          <Control label="Chip icons">
            <SegmentedControl label="Chip icons" options={onOff} value={chipIcons} onChange={setChipIcons} />
          </Control>
          <Control label="Drafts">
            <SegmentedControl label="Drafts" options={onOff} value={drafts} onChange={setDrafts} />
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

      <section
        aria-label="Filters"
        className={cn(
          "flex flex-col gap-space-md",
          barStyle === "panel" && "rounded-lg border border-border bg-surface-container-low p-space-md",
        )}
      >
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
            count={refineCount}
            onClick={() => setRefineOpen((open) => !open)}
            className="self-start md:ml-auto md:self-auto"
          />
        </div>

        <ColorSwatches colors={swatches} selected={color} onSelect={setColor} />

        {chips === "on" ? (
          <div className="-mx-margin-mobile flex gap-space-sm overflow-x-auto px-margin-mobile pb-space-xs md:mx-0 md:px-0">
            <Chip
              selected={category === null}
              icon={chipIcons === "on" ? <LayoutGrid aria-hidden /> : null}
              onClick={() => setCategory(null)}
            >
              All
            </Chip>
            {sampleCategories.map((item) => (
              <Chip
                key={item}
                selected={category === item}
                icon={chipIcons === "on" ? categoryIcons[item] : null}
                onClick={() => setCategory(item)}
              >
                {item}
              </Chip>
            ))}
          </div>
        ) : null}

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
          const label = garment.draft
            ? "Draft"
            : badge === "brand"
              ? garment.brand
              : badge === "category"
                ? garment.category
                : null;

          return (
            <GarmentCard
              key={garment.id}
              size={cardSize[density]}
              imageSrc={garment.image}
              imageAlt={garment.title}
              badge={label}
              badgeCorner={badgePlace}
              cornerBadge={sizeBadge === "on" ? garment.size : null}
              meta={text === "minimal" ? null : garment.brand.toUpperCase()}
              title={garment.title}
              description={text === "full" ? garment.materials.join(" · ") : null}
              colors={colors === "on" ? <ColorDots colors={garment.colors} /> : null}
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
