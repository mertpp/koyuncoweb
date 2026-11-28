"use client";

import { useState, type ReactNode } from "react";

import { Button, buttonStyles } from "@/shared/components/koyun/button";
import { ColorDots, GarmentCard, ImageBadge } from "@/shared/components/koyun/card";
import { Chip } from "@/shared/components/koyun/garment-grid";
import { Eyebrow } from "@/shared/components/koyun/layout";
import { cn } from "@/shared/lib/utils";

import { sampleGarments } from "../wardrobe/sample-garments";

// Round 5 of the garment detail lab: the garment as a node of the wardrobe, told as a story.
// Each section has its own visual language (signals as chips, usage as large numbers and
// sentences, outfits as photo compositions, companions as garment cards, collections as
// moodboards) and the coat stays present in every one. Specs go to a collapsed line at the
// end. Only pieces already in /design plus tokens. Sample data only: none of the
// relationships, signals or insights have an endpoint yet.

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

const coat = photos[0]?.src ?? "";

const garment = {
  title: "Double-Faced Cashmere Overcoat",
  brand: "A.P.C.",
  category: "Outerwear",
  // Real fields (GarmentRead), sample values.
  size: "L",
  colors: [{ name: "Camel", hex: "#c19a6b" }],
  materials: ["Cashmere", "Silk"],
  condition: "Very good",
  added: "Oct 12, 2026",
  // No endpoint yet.
  quote: "The coat you reach for when you want to look put together.",
  signals: ["Smart casual", "Heritage", "Autumn · Winter", "Evening"],
};

const byId = (id: string) => sampleGarments.find((item) => item.id === id);
const imageOf = (id: string) => byId(id)?.image ?? "";

// No endpoint yet: everything below is sample.
const usage = [
  { value: "18", label: "times worn" },
  { value: "7", label: "outfits" },
  { value: "3", label: "collections" },
  { value: "Top 10%", label: "most worn outerwear" },
];

const insights = [
  "Most worn from October to February, almost never after March.",
  "Most often paired with the ribbed cashmere knit and the olive chinos.",
  "One of the central pieces of your British Country collection.",
];

const outfits = [
  { title: "Sunday in the city", meta: "Worn 6 times · last in October", pieces: ["3", "4", "5"] },
  { title: "Gallery opening", meta: "Worn 4 times · last in September", pieces: ["2", "8", "5"] },
];

const companions = [
  { id: "3", together: "Together 11 times" },
  { id: "4", together: "Together 9 times" },
  { id: "5", together: "Together 6 times" },
];

const collections = [
  { title: "British Country", line: "One of its central pieces.", meta: "14 pieces", images: ["6", "3", "5"] },
  { title: "Milan Winter", line: "Bought on that trip.", meta: "9 pieces", images: ["2", "4", "8"] },
  { title: "Sister's Wedding", line: "Worn to the ceremony.", meta: "6 pieces", images: ["2", "5", "6"] },
];

function SampleTag() {
  return <span className="text-tech-sm text-muted-foreground">SAMPLE · NO ENDPOINT</span>;
}

/** Plain framed photo, same frame as GarmentCard. */
function Frame({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-surface-container", className)}>
      <img className="size-full object-cover" src={src} alt={alt} />
    </div>
  );
}

function StoryHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-space-md">
      <div className="flex flex-col gap-space-xs">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-headline-xl">{title}</h2>
      </div>
      {children ?? <SampleTag />}
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
    <section className="flex flex-col gap-space-md">
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

/** Hero right side: who this garment is. Signals as chips, the quote as the voice. */
function Identity() {
  return (
    <section className="flex flex-col gap-space-xl lg:pt-space-xl">
      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <Eyebrow>
          {garment.brand} · {garment.category}
        </Eyebrow>
        <div className="flex items-center gap-space-sm">
          <Button variant="secondary">Edit details</Button>
          <Button variant="secondary" className="text-destructive">
            Delete
          </Button>
        </div>
      </div>

      <h1 className="text-headline-xl">{garment.title}</h1>

      <p className="text-headline-lg italic text-muted-foreground">“{garment.quote}”</p>

      <div className="flex flex-col gap-space-sm">
        <Eyebrow>Style signals</Eyebrow>
        <div className="flex flex-wrap gap-space-sm">
          {garment.signals.map((signal, index) => (
            <Chip key={signal} selected={index === 0}>
              {signal}
            </Chip>
          ))}
        </div>
      </div>

      <Button className="self-start">Build an outfit with it</Button>
    </section>
  );
}

/** Usage as large numbers and plain sentences: no table. */
function Usage() {
  return (
    <section className="flex flex-col gap-space-xl">
      <StoryHeader eyebrow="Role in your wardrobe" title="Your most worn winter coat" />
      <div className="grid grid-cols-2 gap-space-xl lg:grid-cols-4">
        {usage.map((item) => (
          <div key={item.label} className="flex flex-col gap-space-xs">
            <span className="text-headline-xl">{item.value}</span>
            <span className="text-label-sm uppercase text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
      <ul className="grid gap-space-lg lg:grid-cols-3">
        {insights.map((line) => (
          <li key={line} className="text-headline-sm italic">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Outfits as compositions: the coat large, its companions stacked beside it. */
function Outfits() {
  return (
    <section className="flex flex-col gap-space-lg">
      <StoryHeader eyebrow="Appears in 7 outfits" title="How you wear it" />
      <div className="grid gap-gutter lg:grid-cols-2">
        {outfits.map((outfit) => (
          <article key={outfit.title} className="flex flex-col gap-space-md">
            <div className="grid aspect-4/3 grid-cols-3 grid-rows-3 gap-space-sm">
              <Frame src={coat} alt={garment.title} className="col-span-2 row-span-3" />
              {outfit.pieces.map((id) => (
                <Frame key={id} src={imageOf(id)} alt={byId(id)?.title ?? ""} />
              ))}
            </div>
            <div className="flex items-baseline justify-between gap-space-md">
              <h3 className="text-headline-md">{outfit.title}</h3>
              <span className="text-tech-sm text-muted-foreground">{outfit.meta}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Companions as garment cards: the only place with regular cards. */
function Companions() {
  return (
    <section className="flex flex-col gap-space-lg">
      <StoryHeader eyebrow="Its companions" title="Most often paired with" />
      <div className="grid gap-gutter sm:grid-cols-3">
        {companions.map((item) => {
          const piece = byId(item.id);
          return piece ? (
            <GarmentCard
              key={item.id}
              imageSrc={piece.image}
              imageAlt={piece.title}
              badge={piece.brand}
              meta={item.together}
              title={piece.title}
            />
          ) : null;
        })}
      </div>
    </section>
  );
}

/** Collections as moodboards: three photos and the coat's place in each. */
function Collections() {
  return (
    <section className="flex flex-col gap-space-lg">
      <StoryHeader eyebrow="Part of 3 collections" title="Where it belongs" />
      <div className="grid gap-gutter lg:grid-cols-3">
        {collections.map((collection) => (
          <article key={collection.title} className="flex flex-col gap-space-md">
            <div className="grid aspect-square grid-cols-2 grid-rows-2 gap-space-xs">
              <Frame src={coat} alt={garment.title} className="row-span-2" />
              {collection.images.slice(0, 2).map((id) => (
                <Frame key={id} src={imageOf(id)} alt={byId(id)?.title ?? ""} />
              ))}
            </div>
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-baseline justify-between gap-space-md">
                <h3 className="text-headline-md">{collection.title}</h3>
                <span className="text-tech-sm text-muted-foreground">{collection.meta}</span>
              </div>
              <p className="text-body-md italic text-muted-foreground">{collection.line}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Specs last and collapsed: secondary on purpose. */
function Details() {
  return (
    <details className="group rounded-lg border border-border bg-surface-container-low p-space-md">
      <summary className="cursor-pointer text-label-sm uppercase text-muted-foreground">Garment details</summary>
      <div className="mt-space-md flex flex-wrap items-center gap-space-lg text-tech-sm">
        <span>Size {garment.size}</span>
        <span className="flex items-center gap-space-xs">
          <ColorDots colors={garment.colors} />
          {garment.colors.map((color) => color.name).join(", ")}
        </span>
        <span>{garment.materials.join(" · ")}</span>
        <span>{garment.condition}</span>
        <span>Added {garment.added}</span>
      </div>
    </details>
  );
}

export function GarmentLab() {
  return (
    <>
      <p className="rounded-lg border border-dashed border-border bg-surface-container-low p-space-md text-tech-sm text-muted-foreground">
        DESIGN LAB · ROUND 5 · SAMPLE DATA (nothing here calls the API)
      </p>

      <a href="#" className={buttonStyles("link", "self-start")}>
        Back to wardrobe
      </a>

      <div className="grid items-start gap-space-xl lg:grid-cols-2">
        <Showcase />
        <Identity />
      </div>

      <Usage />
      <Outfits />
      <Companions />
      <Collections />
      <Details />
    </>
  );
}
