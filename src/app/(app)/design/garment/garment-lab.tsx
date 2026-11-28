"use client";

import { useState, type ReactNode } from "react";

import { Button, buttonStyles } from "@/shared/components/koyun/button";
import { ColorDots, GarmentCard, ImageBadge } from "@/shared/components/koyun/card";
import { Eyebrow } from "@/shared/components/koyun/layout";
import { cn } from "@/shared/lib/utils";

import { sampleGarments } from "../wardrobe/sample-garments";

// Round 4 of the garment detail lab: the garment's profile inside your wardrobe, not a spec
// sheet. Editorial text next to the photo, then large photo galleries of its connections
// (pairings, outfits, collections). Only pieces already in /design. Sample data only: role,
// wear, pairings, outfits and "collections of this garment" have no endpoint yet.

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

const garment = {
  title: "Double-Faced Cashmere Overcoat",
  brand: "A.P.C.",
  category: "Outerwear",
  // Real fields (GarmentRead), sample values.
  size: "L",
  colors: [{ name: "Camel", hex: "#c19a6b" }],
  materials: ["Cashmere", "Silk"],
  description: "The coat I reach for when I want to look put together. Bought on a trip to Milan.",
  notes: "Rest a day between wears.",
  // No endpoint yet.
  role: "Winter smart-casual outerwear",
  wear: "Worn 18 times · last worn 4 days ago",
};

const imageOf = (id: string) => sampleGarments.find((item) => item.id === id)?.image ?? null;

// No endpoint yet: pairings, outfits and the collections this garment belongs to.
const pairings = sampleGarments.filter((item) => ["2", "3", "4", "5"].includes(item.id));
const outfits = [
  { id: "o1", title: "Sunday in the city", meta: "4 pieces · worn 6 times", image: imageOf("3") },
  { id: "o2", title: "Gallery opening", meta: "3 pieces · worn 4 times", image: imageOf("2") },
  { id: "o3", title: "Office, cold days", meta: "4 pieces · worn 5 times", image: imageOf("4") },
];
const collections = [
  { id: "c1", title: "British Country", meta: "14 pieces", image: imageOf("6") },
  { id: "c2", title: "Milan Winter", meta: "9 pieces", image: imageOf("1") },
  { id: "c3", title: "Sister's Wedding", meta: "6 pieces", image: imageOf("8") },
];

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

function Profile() {
  return (
    <section className="flex flex-col gap-space-xl">
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
        <p className="text-headline-lg italic text-muted-foreground">{garment.role}</p>
      </header>

      <div className="flex flex-col gap-space-sm">
        <Eyebrow>In rotation</Eyebrow>
        <p className="text-tech-md">{garment.wear}</p>
        <SampleTag />
      </div>

      <div className="flex flex-col gap-space-sm">
        <Eyebrow>About this garment</Eyebrow>
        <p className="text-body-lg">{garment.description}</p>
        <p className="text-body-md italic text-muted-foreground">{garment.notes}</p>
      </div>

      <div className="flex flex-wrap items-center gap-space-md text-tech-sm text-muted-foreground">
        <span>Size {garment.size}</span>
        <span className="flex items-center gap-space-xs">
          <ColorDots colors={garment.colors} />
          {garment.colors.map((color) => color.name).join(", ")}
        </span>
        <span>{garment.materials.join(" · ")}</span>
      </div>
    </section>
  );
}

function Gallery({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-space-lg">
      <div className="flex items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-headline-xl">{title}</h2>
        </div>
        <SampleTag />
      </div>
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

export function GarmentLab() {
  return (
    <>
      <p className="rounded-lg border border-dashed border-border bg-surface-container-low p-space-md text-tech-sm text-muted-foreground">
        DESIGN LAB · ROUND 4 · SAMPLE DATA (nothing here calls the API)
      </p>

      <a href="#" className={buttonStyles("link", "self-start")}>
        Back to wardrobe
      </a>

      <div className="grid items-start gap-space-xl lg:grid-cols-2">
        <Showcase />
        <Profile />
      </div>

      <Gallery eyebrow="Its companions" title="Usually paired with">
        {pairings.slice(0, 3).map((item) => (
          <GarmentCard
            key={item.id}
            imageSrc={item.image}
            imageAlt={item.title}
            badge={item.brand}
            meta={item.category}
            title={item.title}
          />
        ))}
      </Gallery>

      <Gallery eyebrow="Where it shows up" title="Appears in">
        {outfits.map((item) => (
          <GarmentCard
            key={item.id}
            imageSrc={item.image}
            imageAlt={item.title}
            badge="Outfit"
            meta={item.meta}
            title={item.title}
          />
        ))}
      </Gallery>

      <Gallery eyebrow="Part of" title="Collections">
        {collections.map((item) => (
          <GarmentCard
            key={item.id}
            imageSrc={item.image}
            imageAlt={item.title}
            badge="Collection"
            meta={item.meta}
            title={item.title}
          />
        ))}
      </Gallery>
    </>
  );
}
