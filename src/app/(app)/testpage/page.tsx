"use client";

import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  FileScanIcon,
  ImagePlusIcon,
  Loader2Icon,
  SaveIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { listGarmentTypes, type TaxonomyItem } from "@/shared/api/koyun-api";
import {
  KoyunCard,
  KoyunCardContent,
  KoyunPhotoCard,
} from "@/shared/components/koyun/koyun-card";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

const conditions = [
  "New with tags",
  "New",
  "Excellent",
  "Good",
  "Worn",
] as const;

type Condition = (typeof conditions)[number];

const colorOptions = [
  {
    name: "Navy",
    value: "#172033",
  },
  {
    name: "Cream",
    value: "#f5f3ef",
  },
  {
    name: "Charcoal",
    value: "#26241e",
  },
  {
    name: "Olive",
    value: "#4a533e",
  },
  {
    name: "Camel",
    value: "#a47f52",
  },
];

const materialOptions = [
  "Wool",
  "Cashmere",
  "Cotton",
  "Linen",
  "Leather",
  "Silk",
];

function formatTaxonomyLabel(labelKey: string) {
  const rawLabel = labelKey.includes(".")
    ? labelKey.split(".").at(-1)
    : labelKey;

  return (rawLabel ?? labelKey)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function NewGarmentPage() {
  const router = useRouter();

  const [condition, setCondition] = useState<Condition>("Excellent");

  const [garmentTypes, setGarmentTypes] = useState<TaxonomyItem[]>([]);
  const [garmentType, setGarmentType] = useState("");
  const [taxonomyLoading, setTaxonomyLoading] = useState(true);
  const [taxonomyError, setTaxonomyError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTaxonomy() {
      try {
        setTaxonomyLoading(true);
        setTaxonomyError(null);

        const result = await listGarmentTypes();

        if (cancelled) {
          return;
        }

        const activeGarmentTypes = result.filter((item) => item.active);

        setGarmentTypes(activeGarmentTypes);

        if (activeGarmentTypes[0]) {
          setGarmentType((current) => current || activeGarmentTypes[0].code);
        }
      } catch (error) {
        if (!cancelled) {
          setTaxonomyError(
            error instanceof Error
              ? error.message
              : "Could not load garment types.",
          );
        }
      } finally {
        if (!cancelled) {
          setTaxonomyLoading(false);
        }
      }
    }

    loadTaxonomy();

    return () => {
      cancelled = true;
    };
  }, []);

  const [selectedColors, setSelectedColors] = useState(["Navy", "Cream"]);
  const [selectedMaterials, setSelectedMaterials] = useState(["Wool"]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleColor(color: string) {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color],
    );
  }

  function toggleMaterial(material: string) {
    setSelectedMaterials((current) =>
      current.includes(material)
        ? current.filter((item) => item !== material)
        : [...current, material],
    );
  }

  function handleCreateAndAnalyze() {
    setAnalyzing(true);

    window.setTimeout(() => {
      setAnalyzing(false);
      setAnalysisVisible(true);
    }, 900);
  }

  function handleSave() {
    setSaved(true);

    window.setTimeout(() => {
      router.push("/garments/ashby");
    }, 700);
  }

  return (
    <section className="koyun-page mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 py-8 pb-28 md:px-12 md:py-12 md:pb-12">
      <header className="flex items-start gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
          className="mt-1 rounded-full"
        >
          <ArrowLeftIcon className="size-5" />
        </Button>

        <div>
          <p className="koyun-eyebrow">New archive entry</p>

          <h1 className="koyun-headline-xl mt-1">Register Garment</h1>

          <p className="koyun-body-muted mt-3 max-w-2xl">
            Capture the garment visually, enter only the minimum details, and
            let Koyun draft the rest for review.
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1fr] lg:items-start">
        <PhotoBooth />

        <div className="flex flex-col gap-8">
          <form
            className="flex flex-col gap-8"
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateAndAnalyze();
            }}
          >
            <section className="flex flex-col gap-3">
              <div className="koyun-section-header">
                <div className="koyun-section-copy">
                  <div className="koyun-section-heading-row">
                    <SparklesIcon className="koyun-section-icon" />
                    <h2 className="koyun-section-title">Identity & Maker</h2>
                  </div>

                  <p className="koyun-section-description max-w-prose">
                    The essential identity of the garment and how it should be
                    recognized in your archive.
                  </p>
                </div>
              </div>

              <KoyunCard>
                <KoyunCardContent>
                  <FieldGroup>
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="title">Title *</FieldLabel>
                        <Input
                          id="title"
                          required
                          placeholder="e.g. Barbour Ashby Jacket"
                          className="koyun-input"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="brand">Brand</FieldLabel>
                        <Input
                          id="brand"
                          placeholder="e.g. Barbour"
                          className="koyun-input"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="product">
                          Product / Model
                        </FieldLabel>
                        <Input
                          id="product"
                          placeholder="e.g. Ashby, Boston, 990"
                          className="koyun-input"
                        />
                      </Field>

                      <Field>
                        <FieldLabel>Garment Type *</FieldLabel>

                        <Select
                          value={garmentType}
                          onValueChange={(value) => {
                            if (value) {
                              setGarmentType(value);
                            }
                          }}
                          disabled={taxonomyLoading}
                        >
                          <SelectTrigger className="koyun-input">
                            <SelectValue
                              placeholder={
                                taxonomyLoading
                                  ? "Loading garment types..."
                                  : "Select type"
                              }
                            />
                          </SelectTrigger>

                          <SelectContent align="start">
                            {garmentTypes.map((type) => (
                              <SelectItem key={type.code} value={type.code}>
                                {formatTaxonomyLabel(type.label_key)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {taxonomyError ? (
                          <FieldDescription className="text-destructive">
                            {taxonomyError}
                          </FieldDescription>
                        ) : null}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="size">Size</FieldLabel>
                        <Input
                          id="size"
                          placeholder="e.g. L / 48"
                          className="koyun-input"
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>Condition</FieldLabel>

                      <div className="flex flex-wrap gap-2">
                        {conditions.map((item) => {
                          const active = condition === item;

                          return (
                            <Button
                              key={item}
                              type="button"
                              variant={active ? "default" : "outline"}
                              size="sm"
                              className={
                                active
                                  ? "koyun-chip koyun-chip-active"
                                  : "koyun-chip"
                              }
                              onClick={() => setCondition(item)}
                            >
                              {item}
                            </Button>
                          );
                        })}
                      </div>
                    </Field>
                  </FieldGroup>
                </KoyunCardContent>
              </KoyunCard>
            </section>

            <section className="flex flex-col gap-3">
              <div className="koyun-section-header">
                <div className="koyun-section-copy">
                  <div className="koyun-section-heading-row">
                    <SparklesIcon className="koyun-section-icon" />
                    <h2 className="koyun-section-title">Specification</h2>
                  </div>

                  <p className="koyun-section-description max-w-prose">
                    Draft garment attributes for Koyun to refine after visual
                    analysis.
                  </p>
                </div>
              </div>

              <KoyunCard>
                <KoyunCardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Colors</FieldLabel>

                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => {
                          const active = selectedColors.includes(color.name);

                          return (
                            <Button
                              key={color.name}
                              type="button"
                              variant={active ? "default" : "outline"}
                              size="sm"
                              className={
                                active
                                  ? "koyun-chip koyun-chip-active"
                                  : "koyun-chip"
                              }
                              onClick={() => toggleColor(color.name)}
                            >
                              <span
                                className="size-3 rounded-full border border-black/10"
                                style={{ backgroundColor: color.value }}
                              />
                              {color.name}
                            </Button>
                          );
                        })}
                      </div>

                      <FieldDescription>
                        Optional. Koyun can refine this after visual analysis.
                      </FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel>Materials</FieldLabel>

                      <div className="flex flex-wrap gap-2">
                        {materialOptions.map((material) => {
                          const active = selectedMaterials.includes(material);

                          return (
                            <Button
                              key={material}
                              type="button"
                              variant={active ? "default" : "outline"}
                              size="sm"
                              className={
                                active
                                  ? "koyun-chip koyun-chip-active"
                                  : "koyun-chip"
                              }
                              onClick={() => toggleMaterial(material)}
                            >
                              {material}
                            </Button>
                          );
                        })}
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="description">Description</FieldLabel>

                      <Textarea
                        id="description"
                        rows={5}
                        placeholder="Briefly describe the silhouette, use case, or anything visually important."
                        className="koyun-input min-h-32"
                      />
                    </Field>
                  </FieldGroup>
                </KoyunCardContent>
              </KoyunCard>
            </section>

            <section className="flex flex-col gap-3">
              <div className="koyun-section-header">
                <div className="koyun-section-copy">
                  <div className="koyun-section-heading-row">
                    <SparklesIcon className="koyun-section-icon" />
                    <h2 className="koyun-section-title">Care</h2>
                  </div>

                  <p className="koyun-section-description max-w-prose">
                    Preservation notes, routines and handling instructions for
                    the archive record.
                  </p>
                </div>
              </div>

              <KoyunCard>
                <KoyunCardContent>
                  <Field>
                    <FieldLabel htmlFor="care-notes">Care notes</FieldLabel>

                    <Textarea
                      id="care-notes"
                      rows={4}
                      placeholder="Dry clean only, hand wash cold, re-wax annually, store on cedar hanger..."
                      className="koyun-input min-h-28"
                    />

                    <FieldDescription>
                      Keep care information simple. Detailed routines can live
                      in the garment detail later.
                    </FieldDescription>
                  </Field>
                </KoyunCardContent>
              </KoyunCard>
            </section>

            {!analysisVisible ? (
              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={analyzing}
                  className="koyun-cta-primary"
                >
                  {analyzing ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" />
                      Creating archive record…
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="size-4" />
                      Create & Analyze
                    </>
                  )}
                </Button>

                <p className="koyun-tech-data-sm text-center text-muted-foreground">
                  Koyun will generate a draft record for review.
                </p>
              </div>
            ) : null}
          </form>

          {analysisVisible ? (
            <section className="flex flex-col gap-8 border-t pt-8">
              <section className="flex flex-col gap-3">
                <div className="koyun-section-header">
                  <div className="koyun-section-copy">
                    <div className="koyun-section-heading-row">
                      <SparklesIcon className="koyun-section-icon" />
                      <h2 className="koyun-section-title">
                        Garment Intelligence
                      </h2>
                    </div>

                    <p className="koyun-section-description max-w-prose">
                      AI-assisted editorial draft generated from the captured
                      garment record.
                    </p>
                  </div>

                  <span className="koyun-section-meta">Editorial draft</span>
                </div>

                <KoyunCard>
                  <KoyunCardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="koyun-analysis-block">
                        <p className="koyun-analysis-label">Materials</p>

                        <p className="koyun-analysis-value">Wool / Cashmere</p>

                        <p className="koyun-analysis-description">
                          Detected from visual texture and garment type.
                        </p>
                      </div>

                      <div className="koyun-analysis-block">
                        <p className="koyun-analysis-label">Color Profile</p>

                        <p className="koyun-analysis-value">Navy / Stone</p>

                        <p className="koyun-analysis-description">
                          Dominant palette extracted from the draft record.
                        </p>
                      </div>

                      <div className="koyun-analysis-block">
                        <p className="koyun-analysis-label">Confidence</p>

                        <p className="koyun-analysis-value">High</p>

                        <p className="koyun-analysis-description">
                          The record is consistent enough to review.
                        </p>
                      </div>
                    </div>
                  </KoyunCardContent>
                </KoyunCard>
              </section>

              <section className="flex flex-col gap-3">
                <div className="koyun-section-header">
                  <div className="koyun-section-copy">
                    <div className="koyun-section-heading-row">
                      <SparklesIcon className="koyun-section-icon" />
                      <h2 className="koyun-section-title">
                        Finalize the Record
                      </h2>
                    </div>

                    <p className="koyun-section-description max-w-prose">
                      Review Koyun detected values before committing the garment
                      to the wardrobe.
                    </p>
                  </div>

                  <span className="koyun-section-meta">User verified</span>
                </div>

                <KoyunCard>
                  <KoyunCardContent>
                    <FieldGroup>
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field>
                          <FieldLabel htmlFor="detected-colors">
                            Detected Colors
                          </FieldLabel>
                          <Input
                            id="detected-colors"
                            defaultValue="Navy / Stone / Charcoal"
                            className="koyun-input"
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="detected-materials">
                            Detected Materials
                          </FieldLabel>
                          <Input
                            id="detected-materials"
                            defaultValue="Wool / Cashmere"
                            className="koyun-input"
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="review-brand">Brand</FieldLabel>
                          <Input
                            id="review-brand"
                            defaultValue="Barbour"
                            className="koyun-input"
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="review-garment-type">
                            Garment Type
                          </FieldLabel>
                          <Input
                            id="review-garment-type"
                            defaultValue="Outerwear"
                            className="koyun-input"
                          />
                        </Field>
                      </div>

                      <Field>
                        <FieldLabel htmlFor="review-description">
                          Description
                        </FieldLabel>
                        <Textarea
                          id="review-description"
                          rows={5}
                          defaultValue="A versatile outerwear piece with quiet utility, suitable for light rain, city walks and casual layering."
                          className="koyun-input min-h-32"
                        />
                      </Field>
                    </FieldGroup>
                  </KoyunCardContent>
                </KoyunCard>
              </section>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saved}
                  className="koyun-cta-primary"
                >
                  {saved ? (
                    <>
                      <CheckIcon className="size-4" />
                      Saved to Wardrobe
                    </>
                  ) : (
                    <>
                      <SaveIcon className="size-4" />
                      Save to Wardrobe
                    </>
                  )}
                </Button>

                <p className="koyun-tech-data-sm text-center text-muted-foreground">
                  Verified archive record · Ready for recommendations
                </p>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function PhotoBooth() {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
      <section className="flex flex-col gap-3">
        <KoyunPhotoCard>
          <div className="relative flex aspect-[4/5] cursor-pointer flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#f5f3ef,transparent_45%),linear-gradient(135deg,#d8ccbb,#fbf9f5_45%,#e7e1d8)]" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
              <span className="koyun-glass-badge koyun-tech-data-sm text-foreground">
                <SparklesIcon className="size-3 text-primary" />
                Koyun-Vision
              </span>

              <span className="koyun-glass-badge koyun-tech-data-sm text-muted-foreground">
                Main shot
              </span>
            </div>

            <div className="koyun-glass-panel relative z-10 flex max-w-[240px] flex-col items-center p-6 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-surface text-primary">
                <CameraIcon className="size-6" />
              </div>

              <span className="text-sm font-medium">Add Primary Photo</span>
              <span className="mt-1 text-xs text-muted-foreground">
                Tap to browse or open camera
              </span>
            </div>

            <div className="koyun-glass-bar absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-3 px-3 py-2">
              <span className="inline-flex min-w-0 items-center gap-2">
                <ImagePlusIcon className="size-4 text-primary" />
                <span className="koyun-tech-data-sm truncate">
                  RAW / DNG / TIFF
                </span>
              </span>

              <Button type="button" variant="secondary" size="sm">
                Replace
              </Button>
            </div>
          </div>
        </KoyunPhotoCard>

        <div className="grid grid-cols-3 gap-3">
          <KoyunCard size="sm" className="relative">
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />

            <KoyunCardContent className="flex aspect-square flex-col items-center justify-center text-center">
              <SparklesIcon className="mb-1 size-5 text-primary" />
              <span className="text-xs font-medium leading-tight">
                Macro Textile
              </span>
              <span className="koyun-tech-data-sm mt-1 text-muted-foreground">
                Optional
              </span>
            </KoyunCardContent>
          </KoyunCard>

          <KoyunCard size="sm" className="relative">
            <KoyunCardContent className="flex aspect-square flex-col items-center justify-center text-center">
              <FileScanIcon className="mb-1 size-5 text-primary" />
              <span className="text-xs font-medium leading-tight">
                Care Label
              </span>
              <span className="koyun-tech-data-sm mt-1 text-muted-foreground">
                OCR
              </span>
            </KoyunCardContent>
          </KoyunCard>

          <KoyunCard size="sm" className="relative">
            <KoyunCardContent className="flex aspect-square flex-col items-center justify-center text-center">
              <UserIcon className="mb-1 size-5 text-primary" />
              <span className="text-xs font-medium leading-tight">On Body</span>
              <span className="koyun-tech-data-sm mt-1 text-muted-foreground">
                Fit
              </span>
            </KoyunCardContent>
          </KoyunCard>
        </div>

        <KoyunCard>
          <KoyunCardContent>
            <div className="flex items-start gap-3">
              <SparklesIcon className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  Extraction assisted by Koyun-Vision
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Photo analysis will draft color, material, category and
                  description suggestions for review.
                </p>
                <p className="koyun-tech-data-sm mt-3 text-muted-foreground">
                  Engine standby · no backend call yet
                </p>
              </div>
            </div>
          </KoyunCardContent>
        </KoyunCard>
      </section>
    </aside>
  );
}
