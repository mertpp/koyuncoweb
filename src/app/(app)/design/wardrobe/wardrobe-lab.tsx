"use client";

import { useState } from "react";

import { ColorDots, GarmentCard } from "@/shared/components/koyun/card";
import { Chip, GarmentGrid, SegmentedControl, gridDensities, type GridDensity } from "@/shared/components/koyun/garment-grid";
import { Eyebrow } from "@/shared/components/koyun/layout";

import { sampleCategories, sampleGarments } from "./sample-garments";

type BadgeContent = "brand" | "category" | "none";
type BadgePlace = "top-left" | "bottom-left";
type TextLevel = "minimal" | "normal" | "full";
type Toggle = "on" | "off";

const onOff = [
  { value: "on", label: "On" },
  { value: "off", label: "Off" },
] as const;

/** The card size that fits each grid density. */
const cardSize = { large: "default", medium: "compact", small: "photo" } as const;

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-space-xs">
      <span className="text-label-sm uppercase text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export function WardrobeLab() {
  const [density, setDensity] = useState<GridDensity>("medium");
  const [badge, setBadge] = useState<BadgeContent>("brand");
  const [badgePlace, setBadgePlace] = useState<BadgePlace>("top-left");
  const [sizeBadge, setSizeBadge] = useState<Toggle>("off");
  const [text, setText] = useState<TextLevel>("normal");
  const [colors, setColors] = useState<Toggle>("on");
  const [chips, setChips] = useState<Toggle>("on");
  const [drafts, setDrafts] = useState<Toggle>("on");
  // Lab only: in the real wardrobe, filtering by category is the backend's job (gap B9).
  const [category, setCategory] = useState<string | null>(null);

  const garments = sampleGarments.filter(
    (garment) => (drafts === "on" || !garment.draft) && (!category || garment.category === category),
  );

  return (
    <>
      <div className="flex flex-col gap-space-md rounded-lg border border-dashed border-border bg-surface-container-low p-space-md">
        <p className="text-tech-sm text-muted-foreground">
          DESIGN LAB · SAMPLE DATA · switch the variants and compare. Nothing here calls the API.
        </p>
        <div className="flex flex-wrap gap-space-lg">
          <Control label="Thumbnail size">
            <SegmentedControl label="Thumbnail size" options={gridDensities} value={density} onChange={setDensity} />
          </Control>
          <Control label="Photo label">
            <SegmentedControl
              label="Photo label"
              options={[
                { value: "brand", label: "Brand" },
                { value: "category", label: "Category" },
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
          <Control label="Category chips">
            <SegmentedControl label="Category chips" options={onOff} value={chips} onChange={setChips} />
          </Control>
          <Control label="Drafts">
            <SegmentedControl label="Drafts" options={onOff} value={drafts} onChange={setDrafts} />
          </Control>
        </div>
      </div>

      <header className="flex flex-col gap-space-md md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-space-sm">
          <Eyebrow>{garments.length} pieces</Eyebrow>
          <h1 className="text-headline-xl">Wardrobe</h1>
          <p className="text-headline-sm italic text-muted-foreground">Everything you own, in one quiet place.</p>
        </div>
        <SegmentedControl label="Thumbnail size" options={gridDensities} value={density} onChange={setDensity} />
      </header>

      {chips === "on" ? (
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
      ) : null}

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
              meta={text === "minimal" ? null : `${garment.brand.toUpperCase()} · ${garment.category}`}
              title={garment.title}
              description={text === "full" ? garment.materials.join(" · ") : null}
              colors={colors === "on" ? <ColorDots colors={garment.colors} /> : null}
            />
          );
        })}
      </GarmentGrid>
    </>
  );
}
