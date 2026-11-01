"use client";

import {
  AnchorIcon,
  ArchiveIcon,
  ArrowLeftIcon,
  CheckIcon,
  ChevronRightIcon,
  EditIcon,
  FolderIcon,
  FolderPlusIcon,
  ImageIcon,
  MaximizeIcon,
  PenLineIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StickyNoteIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

const garmentImages = [
  {
    id: "front",
    label: "Front",
    caption: "Full silhouette",
    tone: "from-[#6f724f] via-[#4f5539] to-[#d8d3c4]",
  },
  {
    id: "waxed-cotton",
    label: "Waxed Cotton",
    caption: "6oz Sylkoil",
    tone: "from-[#4a533e] via-[#777b65] to-[#d7d2c5]",
  },
  {
    id: "corduroy-collar",
    label: "Corduroy Collar",
    caption: "Chocolate brown",
    tone: "from-[#3c2f25] via-[#7f6145] to-[#ddd1bf]",
  },
  {
    id: "tartan-label",
    label: "Label / Tartan",
    caption: "Classic lining",
    tone: "from-[#20231c] via-[#8c2f2f] to-[#d7c6a5]",
  },
];

const attributeChips = [
  {
    label: "Color: Olive",
    value: "#4A533E",
    kind: "color",
  },
  {
    label: "Waxed Cotton",
    value: "6oz",
  },
  {
    label: "Pattern: Solid",
  },
  {
    label: "Fit: Regular Fit",
  },
  {
    label: "Smart Casual",
  },
  {
    label: "Autumn / Winter",
  },
];

const technicalSpecs = [
  {
    label: "Finish",
    title: "Sylkoil Matte",
    caption: "Thornproof",
  },
  {
    label: "Collar & Lapels",
    title: "Corduroy Collar",
    caption: "Chocolate brown",
  },
  {
    label: "Interior Lining",
    title: "Classic Tartan",
    caption: "100% pure cotton",
  },
];

const collections = [
  {
    title: "British Heritage Winter",
    count: "6 garments in collection",
    role: "Core Piece",
    id: "#COL-BHW",
    primary: true,
    icon: AnchorIcon,
  },
  {
    title: "Country Weekend",
    count: "12 garments in collection",
    role: "Supporting",
    id: "#COL-CWK",
    primary: false,
    icon: FolderIcon,
  },
];

const compatiblePieces = [
  {
    name: "White Oxford Shirt",
    category: "Shirt",
    color: "#f5f3ef",
  },
  {
    name: "Burgundy Crew Neck",
    category: "Knitwear",
    color: "#5b1f2e",
  },
  {
    name: "Camel Chinos",
    category: "Trouser",
    color: "#c5a271",
  },
  {
    name: "Dark Denim",
    category: "Jeans",
    color: "#172033",
  },
  {
    name: "Brown Boots",
    category: "Footwear",
    color: "#4a2f1f",
  },
];

const outfitFormulas = [
  {
    title: "Smart Casual",
    formula: "Formula 01",
    description: "Ashby + oxford shirt + camel chinos + brown boots",
    context: "Office & City",
  },
  {
    title: "British Country",
    formula: "Formula 02",
    description: "Ashby + burgundy knit + corduroy trousers + boots",
    context: "Cold & Field",
  },
  {
    title: "Weekend",
    formula: "Formula 03",
    description: "Ashby + grey knit + denim + boots",
    context: "Relaxed & Rain",
  },
];

const impactMetrics = [
  {
    label: "Compatibility",
    value: "14",
    detail: "related garments",
  },
  {
    label: "Versatility",
    value: "23",
    detail: "combinations",
  },
  {
    label: "Collections",
    value: "2",
    detail: "active capsules",
  },
  {
    label: "Optimal Window",
    value: "Autumn / Winter",
    detail: "6°C to 17°C",
  },
  {
    label: "Last Used",
    value: "12 days ago",
    detail: "high frequency",
  },
];

const curatedPairings = [
  {
    title: "Heavyweight Ribbed Knit",
    brand: "The Row",
    type: "Knitwear",
    matched: "Matched 8 wears",
    tone: "from-[#d8ccbb] via-[#f5f3ef] to-[#b8aa94]",
  },
  {
    title: "Twisted Volume Chino",
    brand: "Lemaire",
    type: "Trouser",
    matched: "Matched 11 wears",
    tone: "from-[#6f745b] via-[#a59b83] to-[#e4ded2]",
  },
  {
    title: "Cordovan Blucher 990",
    brand: "Alden",
    type: "Footwear",
    matched: "Matched 6 wears",
    tone: "from-[#4b241c] via-[#7a3f31] to-[#d7bfa7]",
  },
];

export default function GarmentDetailPage() {
  const router = useRouter();

  const [activeImage, setActiveImage] = useState(garmentImages[0]);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notes, setNotes] = useState(
    "Annual re-waxing with Barbour Thornproof Dressing planned for November. Waterproofing remains impeccable; Classic Tartan lining is intact.",
  );

  function editNotes() {
    const nextNotes = window.prompt("Edit personal note:", notes);

    if (nextNotes?.trim()) {
      setNotes(nextNotes.trim());
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-1 py-4 pb-28 md:py-8 md:pb-8">
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="size-5" />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Back to Gallery
              </span>
              <span className="hidden size-1 rounded-full bg-border sm:inline-flex" />
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Registry // KYN-ASH-09
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                Verified
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted">
            <EditIcon className="size-4 text-primary" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => setCollectionModalOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <FolderPlusIcon className="size-4 text-primary" />
            Add to Collection
          </button>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2Icon className="size-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <section className="flex flex-col gap-4 lg:sticky lg:top-20 lg:col-span-6">
          <div className="relative overflow-hidden rounded-xl border bg-card shadow-md">
            <div
              className={`relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br ${activeImage.tone}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.45),transparent_34%)]" />

              <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-md">
                  <SparklesIcon className="size-3.5 text-primary" />
                  <span className="text-primary">Koyun-Vision</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    · analysis complete
                  </span>
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground shadow-sm">
                  <span className="size-1.5 rounded-full bg-primary-foreground" />
                  Core Item
                </span>
              </div>

              <button
                type="button"
                className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-background hover:text-primary"
                aria-label="Fullscreen"
              >
                <MaximizeIcon className="size-4" />
              </button>

              <div className="relative z-0 flex h-[78%] w-[58%] items-center justify-center rounded-[1rem] bg-black/10 shadow-[inset_0_0_80px_rgba(255,255,255,0.20)]">
                <div className="h-[88%] w-[68%] rounded-t-[42%] rounded-b-xl bg-[#4a533e] shadow-[0_40px_80px_rgba(0,0,0,0.22)]" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                <div className="inline-flex min-w-0 items-center gap-2 rounded-full border bg-background/90 px-3 py-1.5 text-foreground shadow-sm backdrop-blur-md">
                  <ImageIcon className="size-4 text-primary" />
                  <span className="truncate font-mono text-[10px] uppercase tracking-[0.14em]">
                    Waxed cotton inspection · 6oz Sylkoil
                  </span>
                </div>

                <span className="hidden rounded bg-background/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground shadow-sm backdrop-blur-md sm:inline-flex">
                  Macro HD
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-2 shadow-sm">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Archival Detail Views
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                4 associated views
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {garmentImages.map((view) => {
                const active = activeImage.id === view.id;

                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => setActiveImage(view)}
                    className={`group relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br ${view.tone} transition-all ${
                      active
                        ? "opacity-100 ring-2 ring-primary ring-offset-2"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <span className="absolute bottom-1 left-1 rounded bg-background/90 px-1.5 py-0.5 font-mono text-[9px] text-foreground backdrop-blur-sm">
                      {view.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ImageIcon className="size-3.5" />
              Natural light filter · 16-bit archive
            </span>
            <span>Object ID: KYN-ASH-09-L</span>
          </div>
        </section>

        <section className="flex flex-col gap-6 lg:col-span-6">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.24em] text-muted-foreground">
                <span className="size-2 rounded-full bg-primary" />
                Barbour Archive // Heritage Collection
              </span>
            </div>

            <h1 className="font-heading text-5xl leading-tight tracking-[-0.04em] text-primary md:text-6xl">
              Barbour Ashby Jacket
            </h1>

            {/* Reducimos el margin-top de mt-4 a mt-2 */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* Badge 1: Temporada */}
              <span className="inline-flex items-center rounded-md bg-[#EAE8E3] px-3 py-1.5 text-xs font-medium text-[#1E3A5F]">
                Autumn / Winter 2022
              </span>

              {/* Badge 2: Origen / Adquisición */}
              <span className="inline-flex items-center rounded-md bg-[#EAE8E3] px-3 py-1.5 text-xs font-medium text-[#1E3A5F]">
                Milan Acquisition
              </span>

              {/* Badge 3: Ubicación con icono de armario/estante */}
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EAE8E3] px-3 py-1.5 text-xs font-medium text-[#1E3A5F]">
                <ArchiveIcon className="size-3.5 text-[#1E3A5F]" />
                Vault 01 • Main Suite
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-primary p-4 text-primary-foreground shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/75">
                Today
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-2 py-0.5 font-mono text-[10px] text-primary-foreground">
                Madrid 14°C · Light rain
              </span>
            </div>

            <h2 className="font-heading text-2xl tracking-[-0.02em]">
              Should I wear this today?
            </h2>
            <span className="text-sm tracking-[0.14em]">★★★★★</span>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/85">
              Good choice for today. Works well with your calendar and
              today&apos;s weather. The waxed Sylkoil cotton resists light rain
              forecast between 11:00 and 16:00.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary-foreground/75">
                2 in-person meetings · walking commute
              </p>

              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary-foreground px-4 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
              >
                Style it today →
              </button>
            </div>
          </div>
          {/*
          <Card>
            <div className="mb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                Today
              </p>

              <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="font-heading text-2xl tracking-[-0.02em]">
                  Strong recommendation
                </h2>

                <span className="text-sm tracking-[0.14em] text-primary">
                  ★★★★★
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                One of your best options today. Works with the weather, your
                calendar and your current rotation balance.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <TodaySignal
                title="Weather"
                value="Good for light rain"
                detail="Rain expected between 11:00 and 16:00"
              />

              <TodaySignal
                title="Calendar"
                value="Fits your meetings"
                detail="Two in-person meetings and walking commute"
              />

              <TodaySignal
                title="Rotation"
                value="Not worn for 12 days"
                detail="Good moment to bring it back into circulation"
              />

              <TodaySignal
                title="Wardrobe balance"
                value="Pairs with 14 garments"
                detail="Strong compatibility across current capsules"
              />
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Madrid 14°C · Light rain · Autumn rotation
              </p>

              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Build outfit →
              </button>
            </div>
          </Card>
        */}
          <Card>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="font-heading text-2xl tracking-[-0.02em]">
                    Style It & Wardrobe Intelligence
                  </h2>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                  Compatible styling formulas for this garment without starting
                  from scratch.
                </p>
              </div>
            </div>
            <div className="mb-5 border-t pt-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Works well with
                </p>

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  5 primary matches
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {compatiblePieces.map((piece) => (
                  <span
                    key={piece.name}
                    className="inline-flex items-center gap-2 rounded-lg border bg-muted px-3 py-1.5 text-sm"
                  >
                    <span
                      className="size-3 rounded-full border border-black/10"
                      style={{ backgroundColor: piece.color }}
                    />
                    <span className="font-medium">{piece.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {piece.category}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Ways to wear it
                </p>

                <p className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                  12 combinations available
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {outfitFormulas.map((outfit) => (
                  <article
                    key={outfit.title}
                    className="rounded-xl border bg-muted/70 p-3"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold">{outfit.title}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {outfit.formula}
                      </span>
                    </div>

                    <p className="min-h-12 text-sm leading-5 text-foreground">
                      {outfit.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {outfit.context}
                      </span>

                      <button
                        type="button"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Apply →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Styling intelligence
                </p>
                <h2 className="mt-1 font-heading text-2xl tracking-[-0.02em]">
                  Curated Wardrobe Pairings
                </h2>
              </div>

              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Archival ratio 0.94
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {curatedPairings.map((pairing) => (
                <article
                  key={pairing.title}
                  className="group cursor-pointer rounded-lg border bg-muted/60 p-1.5 transition-all hover:bg-muted hover:shadow-sm sm:rounded-xl sm:p-2"
                >
                  <div
                    className={`relative aspect-[3/4] overflow-hidden rounded-md bg-gradient-to-br sm:rounded-lg ${pairing.tone}`}
                  >
                    <span className="absolute left-1 top-1 rounded bg-background/90 px-1.5 py-0.5 font-mono text-[8px] text-foreground backdrop-blur-sm sm:left-2 sm:top-2 sm:px-2 sm:text-[9px]">
                      {pairing.type}
                    </span>
                  </div>

                  <div className="px-0.5 pb-1 pt-1.5 sm:pt-2">
                    <p className="truncate font-mono text-[9px] text-muted-foreground sm:text-[10px]">
                      {pairing.brand}
                    </p>

                    <h3 className="truncate text-xs font-medium text-foreground sm:text-sm">
                      {pairing.title}
                    </h3>

                    <p className="mt-0.5 truncate font-mono text-[9px] text-primary sm:mt-1 sm:text-[10px]">
                      {pairing.matched}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-2xl tracking-[-0.02em]">
                  Present in Collections
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setCollectionModalOpen(true)}
                className="inline-flex h-8 items-center gap-1 rounded-full border bg-muted px-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <FolderPlusIcon className="size-4" />
                Manage
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {collections.map((collection) => {
                const Icon = collection.icon;

                return (
                  <button
                    key={collection.id}
                    type="button"
                    className="group flex flex-col gap-3 rounded-xl border bg-muted p-3.5 text-left transition-all hover:bg-accent hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-lg shadow-sm ${
                            collection.primary
                              ? "bg-primary text-primary-foreground"
                              : "bg-card text-primary"
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>

                        <div>
                          <span className="block text-sm font-medium transition-colors group-hover:text-primary">
                            {collection.title}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {collection.count}
                          </span>
                        </div>
                      </div>

                      <ChevronRightIcon className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>

                    <div className="flex items-center justify-between border-t pt-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
                          collection.primary
                            ? "bg-primary-fixed text-on-primary-fixed"
                            : "bg-secondary-container text-on-secondary-container"
                        }`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {collection.role}
                      </span>

                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        ID: {collection.id}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
          <Card>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="font-heading text-2xl tracking-[-0.02em]">
                    Wearability & Wardrobe Impact
                  </h2>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                  Usage-based metrics and meaningful connections inside your
                  active workspace.
                </p>
              </div>

              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Explainable data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {impactMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border bg-muted/60 p-2.5"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    {metric.label}
                  </p>

                  <p className="mt-2 text-base font-semibold leading-tight text-foreground">
                    {metric.value}
                  </p>

                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    {metric.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-muted/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">
                  Amortization milestone
                </span>

                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                  18 / 26 wears · 69%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                <div className="h-full w-[69%] rounded-full bg-primary" />
              </div>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                8 more wears to bring this garment below $100 per wear.
              </p>
            </div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <StickyNoteIcon className="size-4 text-primary" />
                Personal Care & Maintenance Notes
              </span>

              <button
                type="button"
                onClick={editNotes}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <PenLineIcon className="size-3.5" />
                Edit notes
              </button>
            </div>

            <div className="rounded-lg border bg-muted/70 p-4">
              <p className="text-base leading-7 italic text-foreground">
                “{notes}”
              </p>
            </div>

            <div className="mt-4 flex flex-col justify-between gap-2 border-t pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:flex-row sm:items-center">
              <span className="inline-flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-primary" />
                Uploaded by you on October 29, 2026
              </span>

              <span className="rounded bg-muted px-2 py-1">
                Verified KoyunCo Vault Record #KYN-ASH-09
              </span>
            </div>
          </Card>
          <Collapsible defaultOpen={false}>
            <Card>
              <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 text-left">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Reference Layer
                  </p>
                  <h2 className="mt-1 font-heading text-2xl tracking-[-0.02em]">
                    Garment Details
                  </h2>
                </div>

                <ChevronRightIcon className="size-5 text-muted-foreground transition-transform group-data-[panel-open]:rotate-90" />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="mt-5 grid gap-4 border-t pt-5">
                  <section>
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Technical Sheet
                    </h3>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {technicalSpecs.map((spec) => (
                        <div
                          key={spec.label}
                          className="rounded-lg bg-muted/70 p-3"
                        >
                          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {spec.label}
                          </span>
                          <span className="mt-1 block text-sm font-medium">
                            {spec.title}
                          </span>
                          <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                            {spec.caption}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {attributeChips.map((chip) => (
                        <span
                          key={`${chip.label}-${chip.value ?? ""}`}
                          className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1.5 text-sm"
                        >
                          {chip.kind === "color" ? (
                            <span className="size-3.5 rounded-full border border-black/15 bg-[#4A533E] shadow-inner" />
                          ) : null}

                          <span className="font-medium">{chip.label}</span>

                          {chip.value ? (
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {chip.value}
                            </span>
                          ) : null}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="border-t pt-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Koyun-Vision Analysis
                    </h3>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div className="rounded-lg bg-muted/70 p-3">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Silhouette
                        </span>
                        <span className="mt-1 block text-sm font-medium">
                          Waxed field jacket
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                          confidence 96%
                        </span>
                      </div>

                      <div className="rounded-lg bg-muted/70 p-3">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Material
                        </span>
                        <span className="mt-1 block text-sm font-medium">
                          Waxed cotton
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                          visual + metadata
                        </span>
                      </div>

                      <div className="rounded-lg bg-muted/70 p-3">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Image Set
                        </span>
                        <span className="mt-1 block text-sm font-medium">
                          4 views indexed
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                          macro inspection ready
                        </span>
                      </div>
                    </div>
                  </section>

                  <section className="border-t pt-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Audit Trail
                    </h3>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="rounded-lg bg-muted/70 p-3">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Object ID
                        </span>
                        <span className="mt-1 block font-mono text-xs">
                          KYN-ASH-09-L
                        </span>
                      </div>

                      <div className="rounded-lg bg-muted/70 p-3">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Registry
                        </span>
                        <span className="mt-1 block font-mono text-xs">
                          Verified KoyunCo Vault Record
                        </span>
                      </div>

                      <div className="rounded-lg bg-muted/70 p-3">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Uploaded by
                        </span>
                        <span className="mt-1 block text-sm font-medium">
                          You
                        </span>
                      </div>

                      <div className="rounded-lg bg-muted/70 p-3">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Uploaded at
                        </span>
                        <span className="mt-1 block text-sm font-medium">
                          October 29, 2026
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </section>
      </div>

      {collectionModalOpen ? (
        <CollectionModal onClose={() => setCollectionModalOpen(false)} />
      ) : null}

      {deleteModalOpen ? (
        <DeleteModal onClose={() => setDeleteModalOpen(false)} />
      ) : null}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm md:p-6">
      {children}
    </div>
  );
}


function CollectionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <FolderPlusIcon className="size-5 text-primary" />
            <h3 className="font-heading text-2xl tracking-[-0.02em]">
              Add to Collection
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          Select the collections where you want to include the{" "}
          <strong className="text-foreground">Barbour Ashby Jacket</strong> and
          assign its role inside the archive.
        </p>

        <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
          {[
            {
              title: "British Heritage Winter",
              detail: "Core Piece · 6 garments",
              checked: true,
            },
            {
              title: "Country Weekend",
              detail: "Supporting · 12 garments",
              checked: true,
            },
            {
              title: "Rainy London Capsule",
              detail: "New addition · 4 garments",
              checked: false,
            },
          ].map((item) => (
            <label
              key={item.title}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 ${
                item.checked ? "border-primary/40 bg-muted" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="rounded text-primary"
                />
                <div>
                  <span className="block text-sm font-medium">
                    {item.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {item.detail}
                  </span>
                </div>
              </div>

              {item.checked ? (
                <CheckIcon className="size-4 text-primary" />
              ) : null}
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 border-t pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border bg-card p-6 shadow-xl">
        <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Trash2Icon className="size-5" />
        </div>

        <div>
          <h3 className="font-heading text-2xl tracking-[-0.02em]">
            Delete garment from archive?
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This will remove the{" "}
            <strong className="text-foreground">Barbour Ashby Jacket</strong>{" "}
            from all active collections and archive traces.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
