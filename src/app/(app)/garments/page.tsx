"use client";

import {
  ArchiveIcon,
  ChevronDownIcon,
  Clock3Icon,
  Grid3X3Icon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  TableRowsSplitIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  createWorkspace,
  ensureAccount,
  listGarmentPhotos,
  listGarments,
  listGarmentTypes,
  listWorkspaces,
  type Garment,
  type GarmentPhoto,
  type TaxonomyItem,
} from "@/shared/api/koyun-api";

function sortPhotos(photos: GarmentPhoto[]) {
  return [...photos].sort((left, right) => {
    const sortDelta = left.sort_order - right.sort_order;

    if (sortDelta !== 0) {
      return sortDelta;
    }

    return (
      new Date(left.created_at).getTime() - new Date(right.created_at).getTime()
    );
  });
}

function choosePrimaryPhoto(photos: GarmentPhoto[]) {
  const sorted = sortPhotos(photos);

  return (
    sorted.find((photo) => photo.is_primary) ??
    sorted.find((photo) => photo.kind === "front") ??
    sorted[0] ??
    null
  );
}

function getOwnerIdFromCookie() {
  const fallback = "123e4567-e89b-12d3-a456-426614174000";

  if (typeof document === "undefined") {
    return fallback;
  }

  const match = document.cookie.match(/(?:^|; )koyunco_owner_id=([^;]*)/);

  return match ? decodeURIComponent(match[1]) : fallback;
}

function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function taxonomyLabel(item?: TaxonomyItem) {
  if (!item) return "Unclassified";
  const raw = item.label_key.includes(".")
    ? item.label_key.split(".").at(-1)
    : item.label_key;
  return titleCase(raw ?? item.code);
}

type ViewMode = "grid" | "compact" | "timeline";


export default function GarmentsIndexPage() {
  const { data: session, status } = useSession();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [garments, setGarments] = useState<Garment[]>([]);
  const [photoByGarmentId, setPhotoByGarmentId] = useState<
    Record<string, GarmentPhoto | null>
  >({});
  const [types, setTypes] = useState<TaxonomyItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [condition, setCondition] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useMemo(
    () => ({
      accessToken: session?.azureAccessToken ?? null,
      ownerId: session?.user?.ownerId ?? getOwnerIdFromCookie(),
    }),
    [session?.azureAccessToken, session?.user?.ownerId],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (status === "loading") return;
      try {
        setLoading(true);
        setError(null);
        const [taxonomy] = await Promise.all([
          listGarmentTypes(),
          ensureAccount(auth),
        ]);
        const workspaces = await listWorkspaces(auth);
        const workspace =
          workspaces[0] ?? (await createWorkspace(auth, "Personal"));
        const rows = await listGarments(auth, workspace.id);
        if (cancelled) return;
        setTypes(taxonomy.filter((item) => item.active));
        setWorkspaceId(workspace.id);
        setGarments(Array.isArray(rows) ? rows : []);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error
              ? err.message
              : "Could not load garment archive.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [auth, status]);

  useEffect(() => {
    if (!workspaceId || garments.length === 0 || status === "loading") {
      return;
    }

    const activeWorkspaceId = workspaceId;
    let cancelled = false;

    async function loadCardPhotos() {
      const entries = await Promise.all(
        garments.map(async (garment) => {
          try {
            const photos = await listGarmentPhotos(
              auth,
              activeWorkspaceId,
              garment.id,
            );
            return [garment.id, choosePrimaryPhoto(photos)] as const;
          } catch {
            return [garment.id, null] as const;
          }
        }),
      );

      if (!cancelled) {
        setPhotoByGarmentId(Object.fromEntries(entries));
      }
    }

    void loadCardPhotos();

    return () => {
      cancelled = true;
    };
  }, [auth, garments, status, workspaceId]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("garment-search")?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const typeMap = useMemo(
    () => new Map(types.map((type) => [type.code, type])),
    [types],
  );
  const categories = useMemo(
    () =>
      types
        .map((type) => ({
          code: type.code,
          label: taxonomyLabel(type),
          count: garments.filter((g) => g.garment_type_id === type.code).length,
        }))
        .filter((x) => x.count > 0)
        .sort((a, b) => b.count - a.count),
    [garments, types],
  );
  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          garments
            .map((garment) => garment.brand_raw?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [garments],
  );
  const materials = useMemo(
    () =>
      Array.from(
        new Set(
          garments
            .flatMap((garment) => garment.materials ?? [])
            .map((item) => item.code),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [garments],
  );
  const conditions = useMemo(
    () =>
      Array.from(
        new Set(
          garments
            .map((garment) => garment.condition)
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [garments],
  );
  const activeFilterCount = [brand, material, condition].filter(Boolean).length;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return garments.filter((g) => {
      const matchesCategory =
        category === "all" || g.garment_type_id === category;
      const matchesBrand = !brand || g.brand_raw?.trim() === brand;
      const matchesMaterial =
        !material || g.materials?.some((item) => item.code === material);
      const matchesCondition = !condition || g.condition === condition;
      const haystack = [
        g.title,
        g.brand_raw,
        g.notes,
        g.size,
        g.condition,
        ...(g.materials ?? []).map((item) => item.code),
        ...(g.colors ?? []).map((item) => item.code),
        taxonomyLabel(typeMap.get(g.garment_type_id)),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        matchesCategory &&
        matchesBrand &&
        matchesMaterial &&
        matchesCondition &&
        (!q || haystack.includes(q))
      );
    });
  }, [brand, category, condition, garments, material, query, typeMap]);
  const timelineGroups = useMemo(() => {
    const groups = new Map<string, Garment[]>();
    const chronological = [...filtered].sort(
      (left, right) =>
        new Date(right.created_at).getTime() -
        new Date(left.created_at).getTime(),
    );

    for (const garment of chronological) {
      const year = new Date(garment.created_at).getFullYear().toString();
      groups.set(year, [...(groups.get(year) ?? []), garment]);
    }

    return Array.from(groups, ([year, items]) => ({ year, items }));
  }, [filtered]);

  async function refreshCardPhoto(garmentId: string) {
    if (!workspaceId) return;

    const photos = await listGarmentPhotos(auth, workspaceId, garmentId);
    setPhotoByGarmentId((current) => ({
      ...current,
      [garmentId]: choosePrimaryPhoto(photos),
    }));
  }

  return (
    <section className="flex w-full flex-col bg-background text-on-surface">
      <header className="px-margin-mobile pb-space-md pt-space-lg md:px-margin-tablet lg:px-margin">
        <div className="mx-auto flex w-full max-w-none flex-col gap-space-md">
          <div className="flex items-center justify-between gap-space-md">
            <div className="min-w-0">
              <h1 className="font-heading text-3xl leading-tight tracking-[-0.03em] md:text-4xl">
                My Wardrobe
              </h1>
              <p className="mt-1 text-sm text-on-surface-variant">
                {garments.length} garments · {categories.length} categories
              </p>
            </div>
            <Link
              href="/garments/new"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-container px-4 py-2.5 text-sm font-medium text-primary-foreground"
            >
              <PlusIcon className="size-4" />
              <span className="hidden sm:inline">Add garment</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="sticky top-0 z-30 bg-background/95 px-margin-mobile py-3 backdrop-blur-md md:px-margin-tablet lg:px-margin">
        <div className="mx-auto flex w-full max-w-none flex-col gap-3">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-secondary" />
            <input
              id="garment-search"
              type="search"
              aria-label="Search garments"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl bg-surface-container py-3 pl-10 pr-16 text-sm outline-none placeholder:text-secondary focus:bg-surface-container-low focus-visible:ring-2 focus-visible:ring-primary/40"
              placeholder="Search garments by name, brand, material..."
            />
            <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] text-secondary md:inline">
              ⌘K
            </span>
          </div>
          <div className="-mx-1 flex min-w-0 items-center gap-2 px-1">
            <details className="group relative shrink-0">
              <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full bg-surface-container px-3.5 text-sm font-medium marker:hidden hover:bg-surface-container-high">
                <SlidersHorizontalIcon className="size-4" />
                <span>Filters</span>
                {activeFilterCount > 0 ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
                    {activeFilterCount}
                  </span>
                ) : null}
                <ChevronDownIcon className="size-4 text-secondary transition-transform group-open:rotate-180" />
              </summary>
              <div className="absolute left-0 top-full z-40 mt-2 grid w-[min(20rem,calc(100vw-2rem))] gap-3 rounded-xl border border-border bg-background p-4 shadow-lg sm:w-80">
                <label className="grid gap-1.5 text-xs font-medium text-on-surface-variant">
                  Brand
                  <select
                    className="h-10 w-full rounded-lg bg-surface-container px-3 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                  >
                    <option value="">All brands</option>
                    {brands.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-medium text-on-surface-variant">
                  Material
                  <select
                    className="h-10 w-full rounded-lg bg-surface-container px-3 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    value={material}
                    onChange={(event) => setMaterial(event.target.value)}
                  >
                    <option value="">All materials</option>
                    {materials.map((item) => (
                      <option key={item} value={item}>
                        {titleCase(item)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-medium text-on-surface-variant">
                  Condition
                  <select
                    className="h-10 w-full rounded-lg bg-surface-container px-3 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    value={condition}
                    onChange={(event) => setCondition(event.target.value)}
                  >
                    <option value="">All conditions</option>
                    {conditions.map((item) => (
                      <option key={item} value={item}>
                        {titleCase(item)}
                      </option>
                    ))}
                  </select>
                </label>
                {activeFilterCount > 0 ? (
                  <button
                    className="min-h-9 text-left text-sm font-medium text-primary hover:underline"
                    type="button"
                    onClick={() => {
                      setBrand("");
                      setMaterial("");
                      setCondition("");
                    }}
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            </details>
            <div
              role="group"
              aria-label="Filter by category"
              className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1"
            >
              <Pill
                active={category === "all"}
                onClick={() => setCategory("all")}
              >
                All ({garments.length})
              </Pill>
              {categories.map((item) => (
                <Pill
                  key={item.code}
                  active={category === item.code}
                  onClick={() => setCategory(item.code)}
                >
                  {item.label} ({item.count})
                </Pill>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-xs text-on-surface-variant">
              Showing{" "}
              <span className="font-semibold text-on-surface">
                {filtered.length}
              </span>{" "}
              of {garments.length}
            </p>
            <div
              aria-label="Garment display mode"
              className="flex rounded-full bg-surface-container p-1"
              role="group"
            >
              <ViewModeButton
                active={viewMode === "grid"}
                label="Grid"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3Icon className="size-4" />
              </ViewModeButton>
              <ViewModeButton
                active={viewMode === "compact"}
                label="Compact"
                onClick={() => setViewMode("compact")}
              >
                <TableRowsSplitIcon className="size-4" />
              </ViewModeButton>
              <ViewModeButton
                active={viewMode === "timeline"}
                label="Timeline"
                onClick={() => setViewMode("timeline")}
              >
                <Clock3Icon className="size-4" />
              </ViewModeButton>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-space-xl md:px-6 lg:px-8">
        <div className="w-full">
          {loading ? (
            <State
              icon={
                <Loader2Icon className="size-8 animate-spin text-primary" />
              }
              title="Loading your wardrobe…"
            />
          ) : null}
          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {!loading && !error && filtered.length === 0 ? <Empty /> : null}
          {!loading && !error && filtered.length > 0 ? (
            viewMode === "timeline" ? (
              <div className="space-y-8">
                {timelineGroups.map(({ year, items }) => (
                  <section key={year} aria-labelledby={`timeline-${year}`}>
                    <h2
                      id={`timeline-${year}`}
                      className="mb-3 border-b border-border/60 pb-2 font-mono text-xs font-semibold uppercase tracking-widest text-secondary"
                    >
                      {year}
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {items.map((garment) => (
                        <GarmentCard
                          key={garment.id}
                          garment={garment}
                          photo={photoByGarmentId[garment.id]}
                          onPhotoError={() => void refreshCardPhoto(garment.id)}
                          viewMode="compact"
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(265px,265px))] sm:justify-center"
                    : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                }
              >
                {filtered.map((garment) => (
                  <GarmentCard
                    key={garment.id}
                    garment={garment}
                    photo={photoByGarmentId[garment.id]}
                    onPhotoError={() => void refreshCardPhoto(garment.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )
          ) : null}
        </div>
      </section>
    </section>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`min-h-10 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium ${active ? "bg-primary text-primary-foreground" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ViewModeButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={`${label} view`}
      aria-pressed={active}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition sm:px-3 ${active ? "bg-background text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
      onClick={onClick}
      type="button"
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function State({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-surface-container-low p-8 text-center">
      {icon}
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">
        {title}
      </p>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-surface-container-low p-8 text-center">
      <ArchiveIcon className="size-10 text-secondary" />
      <h2 className="font-heading text-3xl">No garments yet</h2>
      <Link
        href="/garments/new"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
      >
        <PlusIcon className="size-4" />
        Add New Garment
      </Link>
    </div>
  );
}


function GarmentCard({
  garment,
  photo,
  onPhotoError,
  viewMode,
}: {
  garment: Garment;
  photo?: GarmentPhoto | null;
  onPhotoError: () => void;
  viewMode: ViewMode;
}) {
  const route = `/garments/${garment.id}`;
  const imageUrl =
    photo?.original_url ?? photo?.display_url ?? photo?.cutout_url;
  const compact = viewMode !== "grid";

  if (compact) {
    return (
      <article className="min-w-0">
        <Link
          aria-label={`View ${garment.title}`}
          className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-surface-container-low"
          href={route}
        >
          <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container sm:w-24">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- Garment photos are signed URLs refreshed on error.
              <img
                src={imageUrl}
                alt={`${garment.title} garment`}
                className="size-full object-cover"
                onError={onPhotoError}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-[10px] text-on-surface-variant">
                No photo
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
              {garment.brand_raw || "Unbranded"}
            </p>
            <h2 className="mt-1 line-clamp-2 font-heading text-base leading-tight text-on-surface">
              {garment.title}
            </h2>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="min-w-0 sm:w-[265px]">
      <Link aria-label={`View ${garment.title}`} className="group block" href={route}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-container">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Grid uses fixed-size image cards and signed URLs.
            <img
              src={imageUrl}
              alt={`${garment.title} garment`}
              className="size-full object-cover transition-opacity duration-200 group-hover:opacity-95"
              onError={onPhotoError}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-on-surface-variant">
              {photo?.status === "failed" ? "Photo unavailable" : "Awaiting photo"}
            </div>
          )}
        </div>
        <div className="pt-3">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
            {garment.brand_raw || "Unbranded"}
          </p>
          <h2 className="mt-1 line-clamp-2 font-heading text-lg leading-snug tracking-[-0.02em] text-on-surface">
            {garment.title}
          </h2>
        </div>
      </Link>
    </article>
  );
}
