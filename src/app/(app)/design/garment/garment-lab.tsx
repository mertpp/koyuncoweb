"use client";

import { useState, type ReactNode } from "react";

import { buttonStyles } from "@/shared/components/koyun/button";
import { ColorDots, GarmentCard, ImageBadge } from "@/shared/components/koyun/card";
import { Eyebrow } from "@/shared/components/koyun/layout";
import { cn } from "@/shared/lib/utils";

import { sampleGarments } from "../wardrobe/sample-garments";

// Round 2 of the garment detail lab: one calm version, no switches. Sticky photo on the left;
// on the right an editorial sheet without boxes (header, a slim green wear band, stacked
// sections split by hairlines); pairings close the page at full width. Sample data only:
// wear, history and pairings have no endpoint yet.

const photo = (key: string) => `https://lh3.googleusercontent.com/aida-public/${key}`;

// Stitch sample photos (the same overcoat from several angles).
const photos = [
  {
    label: "Front",
    src: photo(
      "AB6AXuDe4cCZknOeZG6xiSCkDE8X2zw-_91Mo9UHX1dkOoO0ege87N3m7Jm1K2Ne434GNw8jO_6k49C4StqTyzzwXlJP42eXQmpFe9AO2iMuO3FlioDLKnX55s971BL3gpu8Zhkvf_mEjY9x-nB8DYnVTFCc0DXZ06qMM3R8JEX-wU4460vqhlL02ta332JowAEYgEy-CcovUhVErRvaL0Oe7DZC1rK24xRpROksQD8meqU",
    ),
  },
  {
    label: "Hanger",
    src: photo(
      "AB6AXuCFalPlhh4kprs4eOrFI1NtRd0GVeqextKWyeQj1wvXVJyeiPmWkQyW1XMz7p8iTjBL-imcCRyNfk0X_AMspiixnxRmge86LJycfjokuAalhTdUInlp1ipz4wF-8bodJo9q_lcMqbKjcG9RlI4Jd3yNndRIcsfRYxahCA0xRFdwx_gtGfHmrWi6FFEbdJ54J7-fTCZ54KhsGsWRsywxgW17Z9IuIRbFcQ_bMpWHSUc",
    ),
  },
  {
    label: "Weave",
    src: photo(
      "AB6AXuAPy_v46OHiJjR8R3dSxdbY18yHU2lsuDd-Pz7rUGo75vS4oZ3QB41dppdI_2stkwUVomo1jFbfkFzyLPjXUaHrhCjZcRXEtNCmUmCdYnD6rJ29qb1MnKOzTM-qCszQ5fbHxbKt6N7OFje0eU4Jjh0EVQnZHa_h3JuLo_I59IyZTJvOyN_TjprBZzhmRwrCvUREOgH2kOTA3spQT3zlOFByjIN6lN4E8NjiNkXLEME",
    ),
  },
  {
    label: "Button",
    src: photo(
      "AB6AXuB1NZpLOJ4kYN61GjpSxO0wyPPtgFMpNEBCMsv2-rsesz9GtuDkmJZ83Ql-SJ4DyQODCdA-s_dZ_k50lgteCaGhzMogn_fGEp5LGyScXYh_JH8wbPhz36xcFaay2ow5T2jeE05dswWwdBSEqP_dFkCQhdBlbj5B5QCEYea_GiTm6MaeG4tBwoj4-zC3Eynt9AVG-bhXTiE0rd4Sl7jSUQyYyq-dIQT-In_AMpReq9o",
    ),
  },
];

// What GarmentRead already returns (real fields), filled with sample values.
const garment = {
  title: "Double-Faced Cashmere Overcoat",
  brand: "A.P.C.",
  category: "Outerwear",
  size: "L",
  condition: "Very good",
  added: "Oct 12, 2026",
  colors: [{ name: "Camel", hex: "#c19a6b" }],
  materials: ["Cashmere", "Silk"],
  description: "Self-lined, unstructured shoulder, horn buttons.",
  notes: "Rest a day between wears. Steam, never iron.",
};

// No endpoint yet (sample only): wear counts, history and pairings.
const wear = [
  { label: "Worn", value: "18×" },
  { label: "Last worn", value: "4 days ago" },
  { label: "Per wear", value: "€142" },
] as const;
const history = [
  { date: "Oct 12", note: "Gallery opening" },
  { date: "Oct 04", note: "Studio visit" },
  { date: "Sep 28", note: "Dinner" },
];
const pairings = sampleGarments.filter((item) => ["2", "3", "4", "5"].includes(item.id));

function SampleTag({ className }: { className?: string }) {
  return <span className={cn("text-tech-sm opacity-70", className)}>SAMPLE · NO ENDPOINT</span>;
}

function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm bg-surface-container-high px-space-sm py-space-xs text-label-sm">{children}</span>
  );
}

/** One sheet section: small title on top, hairline above. */
function SheetSection({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-space-md border-t border-border pt-space-lg">
      <div className="flex items-baseline justify-between gap-space-md">
        <Eyebrow>{title}</Eyebrow>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** Label left in mono, value right: a spec sheet line. */
function SheetRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-space-md py-space-sm">
      <dt className="text-tech-sm uppercase text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-space-sm text-body-md">{children}</dd>
    </div>
  );
}

function Showcase() {
  const [active, setActive] = useState(0);
  const current = photos[active];

  if (!current) {
    return null;
  }

  return (
    <section className="flex flex-col gap-space-md lg:sticky lg:top-space-xl">
      <div className="group relative aspect-3/4 overflow-hidden rounded-lg bg-surface-container">
        <img
          className="size-full object-cover transition duration-700 group-hover:scale-105"
          src={current.src}
          alt={`${garment.title}, ${current.label.toLowerCase()}`}
        />
        <ImageBadge>{garment.category}</ImageBadge>
        <ImageBadge corner="top-right" tone="primary">
          In rotation
        </ImageBadge>
      </div>

      <div className="grid grid-cols-4 gap-space-sm">
        {photos.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={index === active}
            aria-label={item.label}
            className={cn(
              "aspect-3/4 overflow-hidden rounded-lg bg-surface-container transition",
              index === active ? "ring-1 ring-primary" : "opacity-60 hover:opacity-100",
            )}
          >
            <img className="size-full object-cover" src={item.src} alt="" />
          </button>
        ))}
      </div>
    </section>
  );
}

function WearBand() {
  return (
    <div className="flex flex-col gap-space-md rounded-lg bg-primary px-space-lg py-space-md text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
      <dl className="flex gap-space-xl">
        {wear.map((item) => (
          <div key={item.label} className="flex flex-col gap-space-xs">
            <dt className="text-tech-sm uppercase opacity-70">{item.label}</dt>
            <dd className="text-headline-sm">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col items-start gap-space-xs sm:items-end">
        <button
          type="button"
          className="rounded-lg bg-background px-space-md py-space-sm text-label-md text-foreground transition hover:opacity-90"
        >
          Log wear
        </button>
        <SampleTag />
      </div>
    </div>
  );
}

function Sheet() {
  return (
    <section className="flex flex-col gap-space-lg">
      <header className="flex flex-col gap-space-sm">
        <span className="text-tech-md uppercase text-muted-foreground">{garment.brand}</span>
        <h1 className="text-headline-xl">{garment.title}</h1>
        <p className="text-headline-sm italic text-muted-foreground">{garment.description}</p>
        <div className="flex flex-wrap gap-space-sm pt-space-sm">
          <MetaChip>Size {garment.size}</MetaChip>
          <MetaChip>{garment.condition}</MetaChip>
          <MetaChip>Added {garment.added}</MetaChip>
        </div>
      </header>

      <WearBand />

      <SheetSection title="Composition">
        <dl className="flex flex-col divide-y divide-border">
          <SheetRow label="Colours">
            <ColorDots colors={garment.colors} />
            {garment.colors.map((color) => color.name).join(", ")}
          </SheetRow>
          <SheetRow label="Materials">{garment.materials.join(", ")}</SheetRow>
        </dl>
      </SheetSection>

      <SheetSection title="Notes">
        <p className="text-headline-sm italic">“{garment.notes}”</p>
      </SheetSection>

      <SheetSection title="History" aside={<SampleTag className="text-muted-foreground" />}>
        <ul className="flex flex-col divide-y divide-border">
          {history.map((item) => (
            <li key={item.date} className="flex items-center justify-between gap-space-md py-space-sm">
              <span className="text-tech-md">{item.date}</span>
              <span className="text-body-md text-muted-foreground">{item.note}</span>
            </li>
          ))}
        </ul>
      </SheetSection>

      <div className="flex flex-wrap items-center gap-space-lg border-t border-border pt-space-lg">
        <button type="button" className={buttonStyles("secondary")}>
          Edit details
        </button>
        <button type="button" className={buttonStyles("link", "text-muted-foreground hover:text-destructive")}>
          Delete garment
        </button>
      </div>
    </section>
  );
}

function Pairings() {
  return (
    <section className="flex flex-col gap-space-lg border-t border-border pt-space-xl">
      <div className="flex items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <Eyebrow>From your wardrobe</Eyebrow>
          <h2 className="text-headline-lg">Pairs well with</h2>
        </div>
        <SampleTag className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-2 gap-gutter-mobile sm:grid-cols-3 sm:gap-gutter lg:grid-cols-4">
        {pairings.map((item) => (
          <GarmentCard
            key={item.id}
            size="compact"
            imageSrc={item.image}
            imageAlt={item.title}
            badge={item.brand}
            meta={item.category}
            title={item.title}
          />
        ))}
      </div>
    </section>
  );
}

export function GarmentLab() {
  return (
    <>
      <p className="rounded-lg border border-dashed border-border bg-surface-container-low p-space-md text-tech-sm text-muted-foreground">
        DESIGN LAB · ROUND 2 · SAMPLE DATA (nothing here calls the API)
      </p>

      <a href="#" className={buttonStyles("link", "self-start")}>
        Back to wardrobe
      </a>

      <div className="grid items-start gap-space-xl lg:grid-cols-2">
        <Showcase />
        <Sheet />
      </div>

      <Pairings />
    </>
  );
}
