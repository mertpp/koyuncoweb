"use client";

import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  FileScanIcon,
  PackageIcon,
  PaletteIcon,
  ShirtIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const brandSuggestions = [
  "The Row",
  "Loro Piana",
  "Margaret Howell",
  "Lemaire",
  "Auralee",
];

const categories = [
  "Outerwear",
  "Knitwear",
  "Tailoring",
  "Shirts",
  "Trousers",
  "Footwear",
  "Accessories",
];

const colors = [
  {
    name: "Charcoal Heather",
    value: "#26241e",
  },
  {
    name: "Deep Camel",
    value: "#947854",
  },
  {
    name: "Midnight Navy",
    value: "#1f2937",
  },
  {
    name: "Ecru / Natural",
    value: "#eae8e4",
  },
  {
    name: "Faded Olive",
    value: "#506350",
  },
];

const careProtocols = ["Dry Clean", "Hand Cold", "Steam Only"];

export default function NewGarmentPage() {
  const router = useRouter();

  const [brand, setBrand] = useState("The Row");
  const [category, setCategory] = useState("Outerwear");
  const [selectedColor, setSelectedColor] = useState("Ecru / Natural");
  const [activeCareProtocols, setActiveCareProtocols] = useState(["Dry Clean"]);
  const [showToast, setShowToast] = useState(false);

  function toggleCareProtocol(protocol: string) {
    setActiveCareProtocols((current) =>
      current.includes(protocol)
        ? current.filter((item) => item !== protocol)
        : [...current, protocol],
    );
  }

  function triggerArchiveSuccess() {
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
    }, 2500);
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-1 py-4 pb-28 md:py-8 md:pb-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="size-5" />
          </button>

          <div>
            <h1 className="font-heading text-3xl tracking-[-0.02em]">
              Create Garment
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Entry 084
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={triggerArchiveSuccess}
          className="rounded-full bg-secondary-container px-4 py-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
        >
          Save
        </button>
      </header>

      <form
        className="flex flex-col gap-8"
        onSubmit={(event) => {
          event.preventDefault();
          triggerArchiveSuccess();
        }}
      >
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl tracking-[-0.02em]">
              Visual Capture
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              3:4 Ratio Ideal
            </span>
          </div>

          <div className="relative flex aspect-[4/5] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#f5f3ef,transparent_45%),linear-gradient(135deg,#d8ccbb,#fbf9f5_45%,#e7e1d8)]" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            <div className="relative z-10 flex max-w-[240px] flex-col items-center rounded-xl bg-background/90 p-6 text-center shadow-sm backdrop-blur-md">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-primary">
                <CameraIcon className="size-6" />
              </div>

              <span className="text-sm font-medium">Add Primary Photo</span>
              <span className="mt-1 text-xs text-muted-foreground">
                Drag portrait or tap to browse
              </span>
            </div>

            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-primary-foreground backdrop-blur-md">
              <SparklesIcon className="size-3" />
              Silhouette auto-detection ready
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className="relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg border bg-card p-3 text-center transition-colors hover:bg-muted"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#e7e1d8,#fbf9f5,#d8ccbb)] opacity-70" />
              <div className="relative z-10 flex flex-col items-center">
                <SparklesIcon className="mb-1 size-5 text-primary" />
                <span className="text-xs font-medium leading-tight">
                  Fabric Close
                </span>
              </div>
              <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
            </button>

            <button
              type="button"
              className="flex aspect-square flex-col items-center justify-center rounded-lg border bg-card p-3 text-center transition-colors hover:bg-muted"
            >
              <FileScanIcon className="mb-1 size-5 text-primary" />
              <span className="text-xs font-medium leading-tight">
                Care Label
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-primary">
                OCR Active
              </span>
            </button>

            <button
              type="button"
              className="flex aspect-square flex-col items-center justify-center rounded-lg border bg-card p-3 text-center transition-colors hover:bg-muted"
            >
              <UserIcon className="mb-1 size-5 text-primary" />
              <span className="text-xs font-medium leading-tight">
                Fit on Body
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                Optional
              </span>
            </button>
          </div>

          <p className="flex items-start gap-2 px-1 text-xs leading-5 text-muted-foreground">
            <SparklesIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            Auto-detects silhouette, composition and wash symbols via scan.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl tracking-[-0.02em]">
              Identity & Maker
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Core Catalog
            </span>
          </div>

          <div className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="brand-input"
                className="flex justify-between text-sm font-medium text-muted-foreground"
              >
                <span>Brand / Atelier</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  Required
                </span>
              </label>

              <div className="relative">
                <input
                  id="brand-input"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                  className="w-full rounded-lg bg-muted px-4 py-3 text-sm outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-primary"
                  placeholder="e.g. Lemaire, Margaret Howell"
                />

                {brand ? (
                  <button
                    type="button"
                    onClick={() => setBrand("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Clear brand"
                  >
                    <XIcon className="size-4" />
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                <span className="mr-1 shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Suggestions:
                </span>

                {brandSuggestions.map((suggestion) => {
                  const active = brand === suggestion;

                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setBrand(suggestion)}
                      className="shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:bg-muted data-[active=false]:text-muted-foreground"
                      data-active={active}
                    >
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="garment-name"
                className="text-sm font-medium text-muted-foreground"
              >
                Garment Descriptor
              </label>

              <input
                id="garment-name"
                defaultValue="Double-Faced Cashmere Robe Coat"
                className="w-full rounded-lg bg-muted px-4 py-3 font-heading text-2xl tracking-[-0.02em] outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-primary"
                placeholder="e.g. Heavy Flannel Overshirt"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Primary Category
              </label>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => {
                  const active = category === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:bg-muted data-[active=false]:text-muted-foreground"
                      data-active={active}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl tracking-[-0.02em]">
              Fabrication & Tone
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Specs Matrix
            </span>
          </div>

          <div className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8 flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Material Spec
                </label>
                <input
                  defaultValue="Cashmere & Virgin Wool"
                  className="w-full rounded-lg bg-muted px-4 py-3 text-sm outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-primary"
                />
              </div>

              <div className="col-span-4 flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Blend %
                </label>
                <input
                  defaultValue="90 / 10"
                  className="w-full rounded-lg bg-muted px-3 py-3 text-center font-mono text-xs outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  Primary Hue & Cast
                </label>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                  {selectedColor}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted p-2">
                {colors.map((color) => {
                  const active = selectedColor === color.name;

                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className="flex size-9 items-center justify-center rounded-full transition-transform data-[active=true]:scale-110 data-[active=true]:ring-2 data-[active=true]:ring-primary"
                      data-active={active}
                      style={{ backgroundColor: color.value }}
                      aria-label={color.name}
                    >
                      {active ? (
                        <CheckIcon className="size-4 text-primary" />
                      ) : null}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Custom color"
                >
                  <PaletteIcon className="size-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Season Code
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
                  {["AW", "SS", "PERM"].map((season) => (
                    <button
                      key={season}
                      type="button"
                      className="rounded-xl px-2 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground first:bg-background first:text-foreground"
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Production Year
                </label>
                <input
                  defaultValue="2024"
                  className="w-full rounded-lg bg-muted px-4 py-3 text-center font-mono text-xs outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl tracking-[-0.02em]">
              Preservation & Ledger
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Care Index
            </span>
          </div>

          <div className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="acquisition-cost"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Acquisition Cost
                </label>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Optional · For wear-ledger
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
                  $
                </span>
                <input
                  id="acquisition-cost"
                  defaultValue="2850"
                  type="number"
                  className="w-full rounded-lg bg-muted px-8 py-3 font-mono text-xs outline-none ring-1 ring-transparent transition-all focus:bg-background focus:ring-primary"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  USD
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Care Protocol
              </label>

              <div className="grid grid-cols-3 gap-2">
                {careProtocols.map((protocol) => {
                  const active = activeCareProtocols.includes(protocol);

                  return (
                    <button
                      key={protocol}
                      type="button"
                      onClick={() => toggleCareProtocol(protocol)}
                      className="flex flex-col items-center justify-center gap-1 rounded-lg p-3 text-center text-xs font-medium transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:bg-muted data-[active=false]:text-muted-foreground"
                      data-active={active}
                    >
                      <ShirtIcon className="size-4" />
                      {protocol}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div className="flex items-center gap-3">
                <PackageIcon className="size-5 text-primary" />

                <div>
                  <p className="text-sm font-medium">Storage Vault</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Cedar Wardrobe · Main Suite
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Storage settings"
              >
                <SlidersHorizontalIcon className="size-4" />
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.99]"
          >
            <PackageIcon className="size-5" />
            Catalog & Commit to KoyunCo Vault
          </button>

          <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Encrypted archive record · Permanent index entry
          </p>
        </div>
      </form>

      <div
        className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-inverse-surface px-4 py-2.5 text-xs font-medium text-inverse-on-surface shadow-xl transition-all data-[visible=false]:pointer-events-none data-[visible=false]:translate-y-4 data-[visible=false]:opacity-0 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100"
        data-visible={showToast}
      >
        <CheckIcon className="size-4 text-primary-fixed" />
        Archived to KoyunCo Vault
      </div>
    </section>
  );
}
