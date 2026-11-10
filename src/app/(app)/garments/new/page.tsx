"use client";

import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  ImagePlusIcon,
  Loader2Icon,
  SparklesIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  createBrandCandidate,
  createGarment,
  createWorkspace,
  ensureAccount,
  listGarmentTypes,
  listWorkspaces,
  searchCatalogBrands,
  uploadGarmentPhoto,
  type CatalogBrand,
  type GarmentCondition,
  type TaxonomyItem,
} from "@/shared/api/koyun-api";
import {
  KoyunCard,
  KoyunCardContent,
  KoyunPhotoCard,
} from "@/shared/components/koyun/koyun-card";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

const conditionOptions: Array<{
  value: GarmentCondition;
  label: string;
}> = [
  { value: "new_with_tags", label: "New with tags" },
  { value: "new_without_tags", label: "New without tags" },
  { value: "very_good", label: "Very good" },
  { value: "fair", label: "Fair" },
];

function formatTaxonomyLabel(labelKey: string) {
  const rawLabel = labelKey.includes(".")
    ? labelKey.split(".").at(-1)
    : labelKey;

  return (rawLabel ?? labelKey)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getOwnerIdFromCookie(): string {
  const DEFAULT_DEV_UUID = "123e4567-e89b-12d3-a456-426614174000";

  if (typeof document === "undefined") {
    return DEFAULT_DEV_UUID;
  }

  const match = document.cookie.match(/(?:^|; )koyunco_owner_id=([^;]*)/);
  let value = match ? decodeURIComponent(match[1]).trim() : "";

  // Validación estricta de formato UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(value)) {
    // Si no es un UUID válido (por ejemplo, es "owner_dev_01" o está vacío), lo inicializamos con un UUID válido
    value = DEFAULT_DEV_UUID;
    document.cookie = `koyunco_owner_id=${value}; path=/; max-age=31536000`;
  }

  return value;
}

export default function NewGarmentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Form states
  const [title, setTitle] = useState("");
  const [brandRaw, setBrandRaw] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<CatalogBrand | null>(null);
  const [brandResults, setBrandResults] = useState<CatalogBrand[]>([]);
  const [brandSearchLoading, setBrandSearchLoading] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState<GarmentCondition | "">(
    "very_good",
  );
  const [notes, setNotes] = useState("");

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Taxonomy states
  const [garmentTypes, setGarmentTypes] = useState<TaxonomyItem[]>([]);
  const [garmentTypeId, setGarmentTypeId] = useState("");
  const [taxonomyLoading, setTaxonomyLoading] = useState(true);
  const [taxonomyError, setTaxonomyError] = useState<string | null>(null);

  // Workspace & submission states
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load initial taxonomy and workspace context
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (status === "loading") {
        return;
      }

      try {
        setTaxonomyLoading(true);
        setTaxonomyError(null);

        const auth = {
          accessToken: session?.azureAccessToken ?? null,
          ownerId: session?.user?.ownerId ?? getOwnerIdFromCookie(),
        };

        const [typesResult] = await Promise.all([
          listGarmentTypes(),
          ensureAccount(auth),
        ]);

        if (cancelled) return;

        const activeGarmentTypes = typesResult.filter((item) => item.active);
        setGarmentTypes(activeGarmentTypes);

        if (activeGarmentTypes[0]) {
          setGarmentTypeId((current) => current || activeGarmentTypes[0].code);
        }

        const workspaces = await listWorkspaces(auth);
        const ws =
          workspaces[0] ?? (await createWorkspace(auth, "My Wardrobe"));

        if (!cancelled) {
          setWorkspaceId(ws.id);
        }
      } catch (error) {
        if (!cancelled) {
          setTaxonomyError(
            error instanceof Error
              ? error.message
              : "Could not load initial data.",
          );
        }
      } finally {
        if (!cancelled) {
          setTaxonomyLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [session?.azureAccessToken, session?.user?.ownerId, status]);

  useEffect(() => {
    const query = brandRaw.trim();

    if (!query || selectedBrand?.canonical_name === brandRaw) {
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        setBrandSearchLoading(true);
        const auth = {
          accessToken: session?.azureAccessToken ?? null,
          ownerId: session?.user?.ownerId ?? getOwnerIdFromCookie(),
        };
        const results = await searchCatalogBrands(auth, query, 10);

        if (!cancelled) {
          setBrandResults(results);
        }
      } catch {
        if (!cancelled) {
          setBrandResults([]);
        }
      } finally {
        if (!cancelled) {
          setBrandSearchLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    brandRaw,
    selectedBrand?.canonical_name,
    session?.azureAccessToken,
    session?.user?.ownerId,
  ]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleBrandInputChange(value: string) {
    const hasValue = Boolean(value.trim());

    setBrandRaw(value);
    setBrandDropdownOpen(hasValue);

    if (!hasValue) {
      setSelectedBrand(null);
      setBrandResults([]);
      setBrandSearchLoading(false);
      return;
    }

    if (selectedBrand?.canonical_name !== value) {
      setSelectedBrand(null);
    }
  }

  function selectBrand(brand: CatalogBrand) {
    setSelectedBrand(brand);
    setBrandRaw(brand.canonical_name);
    setBrandDropdownOpen(false);
    setBrandResults([]);
  }

  function useTypedBrand() {
    setSelectedBrand(null);
    setBrandRaw(brandRaw.trim());
    setBrandDropdownOpen(false);
    setBrandResults([]);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleCreateAndSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const auth = {
      accessToken: session?.azureAccessToken ?? null,
      ownerId: session?.user?.ownerId ?? getOwnerIdFromCookie(),
    };

    if (!auth.accessToken && !auth.ownerId) {
      setErrorMessage(
        "No se encontró una sesión válida. Inicia sesión de nuevo.",
      );
      return;
    }

    if (!workspaceId) {
      setErrorMessage("Workspace not ready yet.");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    if (!garmentTypeId) {
      setErrorMessage("Garment type is required.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const normalizedBrandRaw = brandRaw.trim() || null;

      if (normalizedBrandRaw && !selectedBrand) {
        void createBrandCandidate(auth, normalizedBrandRaw).catch(
          () => undefined,
        );
      }

      // 1. Create Garment JSON payload (Strictly no legacy or vision fields)
      const garment = await createGarment(auth, workspaceId, {
        title: title.trim(),
        garment_type_id: garmentTypeId,
        brand_id: selectedBrand?.id ?? null,
        brand_raw: normalizedBrandRaw,
        size: size.trim() || null,
        condition: condition || null,
        notes: notes.trim() || null,
      });

      // 2. Upload photo if selected
      if (file) {
        await uploadGarmentPhoto(auth, workspaceId, garment.id, file);
      }

      // 3. Redirect to detail page
      router.push(`/garments/${garment.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create garment.",
      );
      setSubmitting(false);
    }
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
            Capture the garment visually, enter minimum details, and commit to
            your Koyun archive.
          </p>
        </div>
      </header>

      {errorMessage || taxonomyError ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          {errorMessage || taxonomyError}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1fr] lg:items-start">
        <PhotoBooth
          file={file}
          previewUrl={previewUrl}
          disabled={submitting}
          onFileChange={handleFileChange}
        />

        <div className="flex flex-col gap-8">
          <form
            className="flex flex-col gap-8"
            onSubmit={handleCreateAndSubmit}
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

              <KoyunCard className="overflow-visible">
                <KoyunCardContent className="overflow-visible">
                  <FieldGroup>
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="title">Title *</FieldLabel>
                        <Input
                          id="title"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Barbour Ashby Jacket"
                          className="koyun-input"
                          disabled={submitting}
                        />
                      </Field>

                      <BrandTypeahead
                        disabled={submitting}
                        inputValue={brandRaw}
                        loading={brandSearchLoading}
                        open={brandDropdownOpen}
                        results={brandResults}
                        selectedBrand={selectedBrand}
                        onBlur={() => {
                          window.setTimeout(
                            () => setBrandDropdownOpen(false),
                            120,
                          );
                        }}
                        onFocus={() => {
                          if (brandRaw.trim()) setBrandDropdownOpen(true);
                        }}
                        onInputChange={handleBrandInputChange}
                        onOpenChange={setBrandDropdownOpen}
                        onSelectBrand={selectBrand}
                        onUseTypedBrand={useTypedBrand}
                      />

                      <Field>
                        <FieldLabel>Garment Type *</FieldLabel>

                        <Select
                          value={garmentTypeId}
                          onValueChange={(value) => {
                            if (value) setGarmentTypeId(value);
                          }}
                          disabled={taxonomyLoading || submitting}
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
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="size">Size</FieldLabel>
                        <Input
                          id="size"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          placeholder="e.g. L / 48"
                          className="koyun-input"
                          disabled={submitting}
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>Condition</FieldLabel>

                      <Select
                        value={condition || undefined}
                        onValueChange={(value) =>
                          setCondition(value as GarmentCondition)
                        }
                        disabled={submitting}
                      >
                        <SelectTrigger className="koyun-input">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>

                        <SelectContent align="start">
                          {conditionOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <h2 className="koyun-section-title">Notes & Provenance</h2>
                  </div>

                  <p className="koyun-section-description max-w-prose">
                    Additional context, fit details, or care notes for your
                    archive.
                  </p>
                </div>
              </div>

              <KoyunCard>
                <KoyunCardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="notes">Notes</FieldLabel>
                      <Textarea
                        id="notes"
                        rows={5}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Anything useful about provenance, fit, care, or details."
                        className="koyun-input min-h-32"
                        disabled={submitting}
                      />
                    </Field>
                  </FieldGroup>
                </KoyunCardContent>
              </KoyunCard>
            </section>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={submitting || taxonomyLoading}
                className="koyun-cta-primary"
              >
                {submitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Creating archive record...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="size-4" />
                    Create & Upload Photo
                  </>
                )}
              </Button>

              <p className="koyun-tech-data-sm text-center text-muted-foreground">
                Colors and materials will be extracted automatically by
                Koyun-Vision.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function BrandTypeahead({
  disabled,
  inputValue,
  loading,
  open,
  results,
  selectedBrand,
  onBlur,
  onFocus,
  onInputChange,
  onOpenChange,
  onSelectBrand,
  onUseTypedBrand,
}: {
  disabled: boolean;
  inputValue: string;
  loading: boolean;
  open: boolean;
  results: CatalogBrand[];
  selectedBrand: CatalogBrand | null;
  onBlur: () => void;
  onFocus: () => void;
  onInputChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSelectBrand: (brand: CatalogBrand) => void;
  onUseTypedBrand: () => void;
}) {
  const trimmedInput = inputValue.trim();
  const showTypedOption =
    Boolean(trimmedInput) && !selectedBrand && !loading && results.length === 0;

  return (
    <Field className="relative">
      <FieldLabel htmlFor="brand">Brand</FieldLabel>
      <div className="relative">
        <Input
          id="brand"
          value={inputValue}
          onBlur={onBlur}
          onChange={(event) => onInputChange(event.target.value)}
          onFocus={onFocus}
          placeholder="e.g. Barbour"
          className="koyun-input pr-10"
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="brand-typeahead-results"
        />
        <button
          type="button"
          aria-label="Show brand suggestions"
          className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onOpenChange(!open)}
        >
          <ChevronDownIcon
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open ? (
        <div
          id="brand-typeahead-results"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border bg-background shadow-xl"
        >
          {!trimmedInput ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Start typing to search catalog brands.
            </div>
          ) : null}

          {trimmedInput && loading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Searching brands…
            </div>
          ) : null}

          {trimmedInput
            ? results.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelectBrand(brand)}
                >
                  {brand.canonical_name}
                </button>
              ))
            : null}

          {showTypedOption ? (
            <button
              type="button"
              className="block w-full border-t px-3 py-2 text-left text-sm hover:bg-muted"
              onMouseDown={(event) => event.preventDefault()}
              onClick={onUseTypedBrand}
            >
              Use “{trimmedInput}” as written brand
              <span className="mt-0.5 block text-xs text-muted-foreground">
                We’ll review it if it is not in the catalog.
              </span>
            </button>
          ) : null}

          {trimmedInput &&
          !loading &&
          results.length === 0 &&
          !showTypedOption ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No brands found.
            </div>
          ) : null}
        </div>
      ) : null}
    </Field>
  );
}

function PhotoBooth({
  file,
  previewUrl,
  disabled,
  onFileChange,
}: {
  file: File | null;
  previewUrl: string | null;
  disabled: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
      <section className="flex flex-col gap-3">
        <KoyunPhotoCard>
          <label className="relative flex aspect-[4/5] cursor-pointer flex-col items-center justify-center overflow-hidden">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Selected garment preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#f5f3ef,transparent_45%),linear-gradient(135deg,#d8ccbb,#fbf9f5_45%,#e7e1d8)]" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />
              </>
            )}

            <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
              <span className="koyun-glass-badge koyun-tech-data-sm text-foreground">
                <SparklesIcon className="size-3 text-primary" />
                Koyun-Vision
              </span>

              <span className="koyun-glass-badge koyun-tech-data-sm text-muted-foreground">
                {file ? "File selected" : "Optional photo"}
              </span>
            </div>

            <div className="koyun-glass-panel relative z-10 flex max-w-[240px] flex-col items-center p-6 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-surface text-primary">
                {file ? (
                  <CheckIcon className="size-6" />
                ) : (
                  <CameraIcon className="size-6" />
                )}
              </div>

              <span className="text-sm font-medium">
                {file ? file.name : "Add Primary Photo"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                {file ? "Ready to upload" : "JPEG, PNG, WebP"}
              </span>
            </div>

            <div className="koyun-glass-bar absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-3 px-3 py-2">
              <span className="inline-flex min-w-0 items-center gap-2">
                <ImagePlusIcon className="size-4 text-primary" />
                <span className="koyun-tech-data-sm truncate">
                  {file ? "Selected" : "Browse file"}
                </span>
              </span>

              <span className="inline-flex h-8 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground">
                {file ? "Replace" : "Select"}
              </span>
            </div>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              disabled={disabled}
              className="sr-only"
            />
          </label>
        </KoyunPhotoCard>

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
                  description suggestions for review upon upload.
                </p>
              </div>
            </div>
          </KoyunCardContent>
        </KoyunCard>
      </section>
    </aside>
  );
}
