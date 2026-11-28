"use client";

import { useState } from "react";

import { Button, buttonStyles } from "@/shared/components/koyun/button";
import { Card, ColorDots, GarmentCard, ImageBadge, SpecGrid, SpecRow } from "@/shared/components/koyun/card";
import { Eyebrow } from "@/shared/components/koyun/layout";
import { cn } from "@/shared/lib/utils";

import { sampleGarments } from "../wardrobe/sample-garments";

// Round 3 of the garment detail lab: only pieces already in /design (Card, SpecGrid, SpecRow,
// ImageBadge, GarmentCard, Button, Eyebrow) and the tokens. No green card: that piece does
// not exist. Sample data only: wear, history and pairings have no endpoint yet.

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
const pairings = sampleGarments.filter((item) => ["3", "4", "5"].includes(item.id));

function SampleTag() {
  return <span className="text-tech-sm text-muted-foreground">SAMPLE · NO ENDPOINT</span>;
}

function Showcase() {
  const [active, setActive] = useState(0);
  const current = photos[active];

  if (!current) {
    return null;
  }

  return (
    <section className="flex flex-col gap-space-md lg:sticky lg:top-space-xl">
      <div className="group relative aspect-3/4 overflow-hidden rounded-lg border border-border bg-surface-container">
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
              "aspect-3/4 overflow-hidden rounded-lg border bg-surface-container transition",
              index === active ? "border-primary" : "border-border opacity-70 hover:opacity-100",
            )}
          >
            <img className="size-full object-cover" src={item.src} alt="" />
          </button>
        ))}
      </div>
    </section>
  );
}

function Sheet() {
  return (
    <section className="flex flex-col gap-space-lg">
      <header className="flex flex-col gap-space-sm">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <Eyebrow>{garment.brand}</Eyebrow>
          <div className="flex items-center gap-space-sm">
            <Button variant="secondary">Edit details</Button>
            <Button variant="secondary" className="text-destructive">
              Delete
            </Button>
          </div>
        </div>
        <h1 className="text-headline-xl">{garment.title}</h1>
        <p className="text-headline-sm italic text-muted-foreground">{garment.description}</p>
      </header>

      <SpecGrid
        items={[
          { label: "Size", value: garment.size },
          { label: "Condition", value: garment.condition },
          { label: "Added", value: garment.added },
        ]}
      />

      <Card>
        <div className="flex items-baseline justify-between gap-space-md">
          <h2 className="text-headline-md">In your rotation</h2>
          <SampleTag />
        </div>
        <SpecGrid
          items={[
            { label: "Worn", value: "18 times" },
            { label: "Last worn", value: "4 days ago" },
            { label: "Per wear", value: "€142" },
          ]}
        />
        <Button className="self-start">Log today&apos;s wear</Button>
      </Card>

      <Card>
        <h2 className="text-headline-md">Composition</h2>
        <dl className="flex flex-col gap-space-sm">
          <SpecRow
            label="Colours"
            value={
              <span className="flex items-center justify-end gap-space-sm">
                <ColorDots colors={garment.colors} />
                {garment.colors.map((color) => color.name).join(", ")}
              </span>
            }
          />
          <SpecRow label="Materials" value={garment.materials.join(", ")} />
        </dl>
      </Card>

      <Card tone="muted">
        <Eyebrow>Notes</Eyebrow>
        <p className="text-headline-sm italic">{garment.notes}</p>
      </Card>

      <section className="flex flex-col gap-space-md">
        <div className="flex items-baseline justify-between gap-space-md">
          <h2 className="text-headline-md">Pairs well with</h2>
          <SampleTag />
        </div>
        <div className="grid grid-cols-3 gap-gutter-mobile sm:gap-gutter">
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
    </section>
  );
}

export function GarmentLab() {
  return (
    <>
      <p className="rounded-lg border border-dashed border-border bg-surface-container-low p-space-md text-tech-sm text-muted-foreground">
        DESIGN LAB · ROUND 3 · SAMPLE DATA (nothing here calls the API)
      </p>

      <a href="#" className={buttonStyles("link", "self-start")}>
        Back to wardrobe
      </a>

      <div className="grid items-start gap-space-xl lg:grid-cols-2">
        <Showcase />
        <Sheet />
      </div>
    </>
  );
}
