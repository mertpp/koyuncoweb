"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { collectionClientApi } from "@/features/collection/client";
import type {
  CollectionGarmentItemRead,
  CollectionGarmentListStatus,
  CollectionRead,
} from "@/features/collection/types";
import { outfitClientApi } from "@/features/outfit/client";
import type { OutfitRead } from "@/features/outfit/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const statusOptions = [
  { value: "included", label: "Included" },
  { value: "candidate", label: "Candidate" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
] as const satisfies ReadonlyArray<{
  value: CollectionGarmentListStatus;
  label: string;
}>;

function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) =>
    character.toUpperCase(),
  );
}

function StatusTabs({
  activeStatus,
  collectionId,
  workspaceId,
}: {
  activeStatus: CollectionGarmentListStatus;
  collectionId: string;
  workspaceId: string;
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Collection garment status">
      {statusOptions.map((option) => (
        <Link
          key={option.value}
          href={`/workspaces/${workspaceId}/collections/${collectionId}?status=${option.value}`}
          className="rounded-full border px-4 py-2 text-sm font-medium transition data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:border-primary/40"
          data-active={option.value === activeStatus}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}

function CollectionGarmentCard({ item }: { item: CollectionGarmentItemRead }) {
  const relationship = item.collection_garment;

  return (
    <Card className="bg-card/95">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {item.garment.brand_id ?? "Unknown"}
            </p>
            <CardTitle className="mt-1 text-xl tracking-[-0.02em]">
              {item.garment.title}
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {relationship.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {titleCase(relationship.role)}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {titleCase(relationship.source)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border bg-background px-3 py-1">
            Type: {titleCase(item.garment.garment_type_id)}
          </span>
        </div>
        {relationship.user_note ? (
          <p className="rounded-2xl border bg-surface-container-low/40 p-4 text-sm leading-6 text-muted-foreground">
            {relationship.user_note}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function OutfitCard({ outfit }: { outfit: OutfitRead }) {
  const orderedItems = [...outfit.items].sort(
    (left, right) => left.position - right.position,
  );

  return (
    <Card className="bg-card/95">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl tracking-[-0.02em]">
              Saved combination
            </CardTitle>
            <CardDescription>
              {orderedItems.length} {orderedItems.length === 1 ? "garment" : "garments"}
            </CardDescription>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Badge variant="secondary" className="capitalize">
              {outfit.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {outfit.source}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {orderedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No garments saved yet.</p>
        ) : (
          <ol className="space-y-3">
            {orderedItems.map((item) => (
              <li
                key={`${outfit.id}-${item.garment.id}-${item.position}`}
                className="flex items-center justify-between gap-4 rounded-2xl border bg-background px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {item.garment.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.garment.brand_id ?? "Unknown"}
                  </p>
                </div>
                <Badge variant="outline">{item.position}</Badge>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

function DetailSkeleton() {
  return (
    <>
      <div className="rounded-[2rem] border bg-card px-6 py-7 shadow-sm md:px-8 md:py-9">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-5 h-14 w-full max-w-2xl" />
        <Skeleton className="mt-4 h-5 w-full max-w-3xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export function CollectionDetailClient({
  activeStatus,
  collectionId,
  workspaceId,
}: {
  activeStatus: CollectionGarmentListStatus;
  collectionId: string;
  workspaceId: string;
}) {
  const [collection, setCollection] = useState<CollectionRead | null>(null);
  const [garments, setGarments] = useState<CollectionGarmentItemRead[]>([]);
  const [outfits, setOutfits] = useState<OutfitRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const [collectionResult, garmentResult, outfitResult] = await Promise.all([
        collectionClientApi.getCollection(workspaceId, collectionId),
        collectionClientApi.listCollectionGarments(
          workspaceId,
          collectionId,
          activeStatus,
        ),
        outfitClientApi.listOutfits(workspaceId, collectionId),
      ]);
      setCollection(collectionResult);
      setGarments(garmentResult);
      setOutfits(outfitResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load this collection.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load is intentionally keyed by route params and active status.
  }, [workspaceId, collectionId, activeStatus]);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 py-4 pb-24 md:py-8 md:pb-8">
      {error ? (
        <Card className="border-destructive/20 bg-card py-12 text-center">
          <CardContent className="mx-auto max-w-xl space-y-5">
            <h1 className="font-heading text-3xl tracking-[-0.03em]">
              Collection could not load
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">{error}</p>
            <Button onClick={() => { setLoading(true); void load(); }}>Retry</Button>
          </CardContent>
        </Card>
      ) : loading || !collection ? (
        <DetailSkeleton />
      ) : (
        <>
          <header className="rounded-[2rem] border bg-card px-6 py-7 shadow-sm md:px-8 md:py-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl space-y-4">
                <Link
                  href={`/workspaces/${workspaceId}/collections`}
                  className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  ← Collections
                </Link>
                <div className="space-y-3">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Aesthetic territory
                  </p>
                  <h1 className="font-heading text-4xl leading-tight tracking-[-0.04em] md:text-6xl">
                    {collection.name}
                  </h1>
                  {collection.description ? (
                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                      {collection.description}
                    </p>
                  ) : null}
                </div>
              </div>
              <Badge variant="secondary" className="w-fit capitalize">
                {collection.status}
              </Badge>
            </div>

            {collection.vision ? (
              <div className="mt-8 rounded-2xl border bg-surface-container-low/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Vision
                </p>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-foreground">
                  {collection.vision}
                </p>
              </div>
            ) : null}
          </header>

          <section className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Collection garments
                </p>
                <h2 className="mt-2 font-heading text-3xl tracking-[-0.03em]">
                  Garments in this territory
                </h2>
              </div>
              <StatusTabs
                activeStatus={activeStatus}
                collectionId={collectionId}
                workspaceId={workspaceId}
              />
            </div>

            {garments.length === 0 ? (
              <Card className="border-dashed bg-card/80 py-12 text-center">
                <CardContent className="mx-auto max-w-lg space-y-3">
                  <h2 className="font-heading text-2xl tracking-[-0.03em]">
                    No garments here yet
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    This collection has no {activeStatus === "all" ? "garments" : activeStatus}{" "}
                    garments yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {garments.map((item) => (
                  <CollectionGarmentCard
                    key={`${item.garment.id}-${item.collection_garment.status}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Outfits
              </p>
              <h2 className="mt-2 font-heading text-3xl tracking-[-0.03em]">
                Saved combinations
              </h2>
            </div>

            {outfits.length === 0 ? (
              <Card className="border-dashed bg-card/80 py-10 text-center">
                <CardContent className="mx-auto max-w-lg space-y-3">
                  <h2 className="font-heading text-2xl tracking-[-0.03em]">
                    No saved combinations yet
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Save outfits here once this collection has expressions worth
                    keeping.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {outfits.map((outfit) => (
                  <OutfitCard key={outfit.id} outfit={outfit} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}
