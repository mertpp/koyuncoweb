"use client";

import {
  ArchiveIcon,
  DownloadIcon,
  Grid3X3Icon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
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

const tones = [
  "from-[#4a3628] via-[#9b8a76] to-[#efe7dc]",
  "from-[#203525] via-[#73785f] to-[#e8e2d9]",
  "from-[#26201c] via-[#7b6958] to-[#f4ece1]",
  "from-[#414838] via-[#8f947a] to-[#f5f3ef]",
  "from-[#353739] via-[#8b8e8d] to-[#e4e2de]",
  "from-[#1b2234] via-[#526073] to-[#e7e1d8]",
];
const hues = ["#1b2234", "#203525", "#f4ece1", "#4a3628", "#353739", "#414838"];

const processingPhotoStatuses = new Set(["pending", "processing"]);

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

export default function GarmentsIndexPage() {
  const { data: session, status } = useSession();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState("Personal Wardrobe");
  const [garments, setGarments] = useState<Garment[]>([]);
  const [photoByGarmentId, setPhotoByGarmentId] = useState<
    Record<string, GarmentPhoto | null>
  >({});
  const [types, setTypes] = useState<TaxonomyItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (status === "loading") return;
      const auth = {
        accessToken: session?.azureAccessToken ?? null,
        ownerId: session?.user?.ownerId ?? getOwnerIdFromCookie(),
      };
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
        setWorkspaceName(workspace.name);
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
  }, [session?.azureAccessToken, session?.user?.ownerId, status]);

  useEffect(() => {
    if (!workspaceId || garments.length === 0 || status === "loading") {
      setPhotoByGarmentId({});
      return;
    }

    let cancelled = false;
    const auth = {
      accessToken: session?.azureAccessToken ?? null,
      ownerId: session?.user?.ownerId ?? getOwnerIdFromCookie(),
    };

    async function loadCardPhotos() {
      const entries = await Promise.all(
        garments.map(async (garment) => {
          try {
            const photos = await listGarmentPhotos(
              auth,
              workspaceId,
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
  }, [
    garments,
    session?.azureAccessToken,
    session?.user?.ownerId,
    status,
    workspaceId,
  ]);

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
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return garments.filter((g) => {
      const matchesCategory =
        category === "all" || g.garment_type_id === category;
      const haystack = [
        g.title,
        g.brand_raw,
        g.notes,
        g.size,
        g.condition,
        taxonomyLabel(typeMap.get(g.garment_type_id)),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }, [category, garments, query, typeMap]);

  const materialCount = new Set(
    garments.flatMap((g) => (g.materials ?? []).map((m) => m.code)),
  ).size;
  const colorCount = new Set(
    garments.flatMap((g) => (g.colors ?? []).map((c) => c.code)),
  ).size;
  const activeRate = garments.length
    ? `${Math.round((garments.filter((g) => g.condition !== "fair").length / garments.length) * 100)}% In-Flow`
    : "No Data";

  return (
    <section className="flex w-full flex-col bg-background text-on-surface">
      <header className="px-margin-mobile py-space-xl md:px-margin-tablet lg:px-margin">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-space-lg">
          <div className="flex flex-col justify-between gap-space-lg lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <h1 className="font-heading text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
                Mert Personal Wardrobe
              </h1>
              <p className="mt-space-xs max-w-2xl text-base leading-7 text-on-surface-variant md:text-sm">
                A comprehensive indexed custodial register of all{" "}
                {garments.length} accessioned garments in {workspaceName}.
              </p>
            </div>
            <div className="flex flex-wrap gap-space-sm">
              <button
                className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-highest px-4 py-2.5 text-sm font-medium"
                type="button"
              >
                <DownloadIcon className="size-4" />
                Export Ledger CSV/PDF
              </button>
              <Link
                href="/garments/new"
                className="inline-flex items-center gap-space-xs rounded-full bg-primary-container px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                <PlusIcon className="size-4" />
                Accession New Garment
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-space-md rounded-xl bg-background p-space-md  sm:grid-cols-3 lg:grid-cols-5">
            <Metric
              label="Total Specimens"
              value={`${garments.length} Accn.`}
            />
            <Metric
              label="Categories"
              value={`${categories.length} Taxonomies`}
            />
            <Metric
              label="Fiber Records"
              value={`${materialCount} Materials`}
            />
            <Metric
              label="Chromatic Index"
              value={`${colorCount} Hues`}
              highlight
            />
            <Metric label="Active Rotation Rate" value={activeRate} />
          </div>
        </div>
      </header>

      <section className="sticky top-0 z-30 border-b border-border/50 bg-background/90 px-margin-mobile py-space-lg  backdrop-blur-md md:px-margin-tablet lg:px-margin">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-space-md">
          <div className="flex flex-col gap-space-md xl:flex-row xl:items-center xl:justify-between">
            <div className="relative max-w-xl flex-1">
              <SearchIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-secondary" />
              <input
                id="garment-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg bg-surface-container py-2 pl-10 pr-16 text-sm outline-none placeholder:text-secondary focus:bg-surface-container-low"
                placeholder="Search specimen by title, atelier, fiber, or archive note..."
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] text-secondary">
                ⌘K
              </span>
            </div>
            <div className="flex items-center gap-space-xs overflow-x-auto pb-1">
              <Pill
                active={category === "all"}
                onClick={() => setCategory("all")}
              >
                All Categories ({garments.length})
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
          <div className="flex flex-wrap items-center justify-between gap-space-md">
            <div className="flex flex-wrap gap-space-xs">
              <Facet label="Atelier: All Houses" />
              <Facet label="Fiber: All Compositions" />
              <Facet label="Season: All Periods" />
              <Facet label="Status: All Conditions" />
              <div className="hidden items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-1 md:flex">
                <span className="mr-1 font-mono text-[10px] uppercase text-secondary">
                  Hue:
                </span>
                {hues.map((hue) => (
                  <button
                    key={hue}
                    className="size-3.5 rounded-full"
                    style={{ backgroundColor: hue }}
                    type="button"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="font-mono text-[10px] uppercase text-secondary">
                Specimens:{" "}
                <strong className="text-on-surface">
                  {filtered.length} / {garments.length}
                </strong>
              </span>
              <div className="flex rounded-lg bg-surface-container p-0.5">
                <button
                  className="rounded bg-background p-1 text-primary shadow-sm"
                  type="button"
                >
                  <Grid3X3Icon className="size-4" />
                </button>
                <button className="rounded p-1 text-secondary" type="button">
                  <TableRowsSplitIcon className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-margin-mobile py-space-xl md:px-margin-tablet lg:px-margin">
        <div className="mx-auto max-w-[1440px]">
          {loading ? (
            <State
              icon={
                <Loader2Icon className="size-8 animate-spin text-primary" />
              }
              title="Synchronizing specimen ledger…"
            />
          ) : null}
          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {!loading && !error && filtered.length === 0 ? <Empty /> : null}
          {!loading && !error && filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((garment, index) => (
                <GarmentCard
                  key={garment.id}
                  garment={garment}
                  photo={photoByGarmentId[garment.id]}
                  onPhotoError={() => {
                    if (!workspaceId) return;
                    const auth = {
                      accessToken: session?.azureAccessToken ?? null,
                      ownerId: session?.user?.ownerId ?? getOwnerIdFromCookie(),
                    };
                    void listGarmentPhotos(auth, workspaceId, garment.id).then(
                      (photos) => {
                        setPhotoByGarmentId((current) => ({
                          ...current,
                          [garment.id]: choosePrimaryPhoto(photos),
                        }));
                      },
                    );
                  }}
                  index={index}
                  typeLabel={taxonomyLabel(
                    typeMap.get(garment.garment_type_id),
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <footer className="border-t border-border/50 bg-surface-container-low px-margin-mobile py-space-xl md:px-margin-tablet lg:px-margin">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-space-lg">
          <div className="flex flex-col items-center justify-between gap-space-md sm:flex-row">
            <span className="font-mono text-[10px] uppercase text-secondary">
              Displaying Specimens 1–{filtered.length} of {garments.length}{" "}
              Indexed Units
            </span>
            <span className="rounded bg-primary px-3 py-1.5 font-mono text-[10px] text-primary-foreground">
              1
            </span>
          </div>
          <div className="flex flex-col items-start justify-between gap-space-md rounded-xl bg-background p-space-md md:flex-row md:items-center">
            <div className="flex items-center gap-space-md">
              <div className="flex size-10 items-center justify-center rounded-full bg-surface-container text-primary">
                <ShieldCheckIcon className="size-5" />
              </div>
              <div>
                <h2 className="font-heading text-2xl">
                  Cryptographic Provenance Verification
                </h2>
                <p className="text-sm text-on-surface-variant">
                  All garments are indexed under physical-digital custodial
                  records with maintenance audit logs.
                </p>
              </div>
            </div>
            <span className="rounded bg-surface-container-high px-2 py-1 font-mono text-[10px] uppercase text-secondary">
              Ledger Hash: 9f8a...2e04
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
}

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">
        {label}
      </span>
      <span
        className={`font-mono text-xs font-medium ${highlight ? "text-primary" : "text-on-surface"}`}
      >
        {value}
      </span>
    </div>
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
      className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium ${active ? "bg-primary text-primary-foreground" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
function Facet({ label }: { label: string }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-1.5 text-xs font-medium"
      type="button"
    >
      <SlidersHorizontalIcon className="size-3.5 text-secondary" />
      {label}
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
      <h2 className="font-heading text-3xl">No garments indexed yet</h2>
      <Link
        href="/garments/new"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
      >
        <PlusIcon className="size-4" />
        Accession New Garment
      </Link>
    </div>
  );
}
function GarmentCard({
  garment,
  photo,
  onPhotoError,
  index,
  typeLabel,
}: {
  garment: Garment;
  photo?: GarmentPhoto | null;
  onPhotoError: () => void;
  index: number;
  typeLabel: string;
}) {
  const condition = titleCase(garment.condition ?? "active");
  const route = `/garments/${garment.id}`;
  const imageUrl = photo?.display_url;
  const photoProcessing = photo
    ? processingPhotoStatuses.has(photo.status)
    : false;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-low transition hover:shadow-md">
      <div
        className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${tones[index % tones.length]}`}
      >
        {photo?.status === "failed" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 p-6 text-center text-sm font-medium text-destructive">
            No se pudo procesar la imagen
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={`${garment.title} garment photo`}
            className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
            onError={onPhotoError}
          />
        ) : photoProcessing ? (
          <div className="absolute inset-0 animate-pulse bg-surface-container-high" />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.34),transparent_34%)]" />
        {photoProcessing ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/35 backdrop-blur-[1px]">
            <span className="rounded-full bg-background/90 px-3 py-1 font-mono text-[10px] uppercase text-secondary shadow-sm">
              {photo?.status === "pending" ? "Queued" : "Processing"}
            </span>
          </div>
        ) : null}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded bg-background/90 px-2 py-0.5 font-mono text-[10px] uppercase backdrop-blur">
            #SPEC-{String(index + 1).padStart(2, "0")}
          </span>
          <span className="rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            {typeLabel}
          </span>
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-0.5 font-mono text-[10px] uppercase backdrop-blur">
          ● {condition}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between rounded bg-background/85 px-2.5 py-1 font-mono text-[10px] backdrop-blur">
          <span>{48 + index * 17} Rotations</span>
          <span>€{(0.31 + (index % 7) * 0.23).toFixed(2)} / Wear</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-space-sm p-space-md">
        <div>
          <div className="flex justify-between gap-3">
            <span className="truncate text-xs font-medium uppercase tracking-[0.18em] text-secondary">
              {garment.brand_raw || "Unattributed Atelier"}
            </span>
            <span
              className="size-3 rounded-full border"
              style={{ backgroundColor: hues[index % hues.length] }}
            />
          </div>
          <h2 className="mt-1 font-heading text-2xl leading-7 group-hover:text-primary">
            {garment.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-on-surface-variant">
            {garment.notes ||
              garment.description ||
              "Indexed specimen awaiting extended provenance notes and custodial annotations."}
          </p>
        </div>
        <div className="border-t border-surface-container pt-space-xs">
          <div className="flex justify-between gap-3 font-mono text-[10px] text-secondary">
            <span>FABRICATION</span>
            <span className="truncate text-on-surface">
              {(garment.materials ?? [])[0]?.code ?? "Composition pending"}
            </span>
          </div>
          <div className="mt-1 flex justify-between gap-3 font-mono text-[10px] text-secondary">
            <span>CUSTODY SINCE</span>
            <span className="text-on-surface">
              {new Date(garment.created_at).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <Link
            className="mt-space-xs inline-flex w-full justify-between pt-2 text-sm font-medium text-primary hover:underline"
            href={route}
          >
            <span>Inspect Specimen Dossier</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
