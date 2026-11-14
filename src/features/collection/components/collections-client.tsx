"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { collectionClientApi } from "@/features/collection/client";
import type { CollectionRead } from "@/features/collection/types";
import { workspaceClientApi } from "@/features/workspace/client";
import type { WorkspaceRead } from "@/features/workspace/types";
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

import { CreateCollectionForm } from "./create-collection-form";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function CollectionCard({
  collection,
  workspaceId,
}: {
  collection: CollectionRead;
  workspaceId: string;
}) {
  return (
    <Link
      href={`/workspaces/${workspaceId}/collections/${collection.id}`}
      className="group block min-h-full"
    >
      <Card className="min-h-full border-border/80 bg-card/95 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_40px_rgba(28,30,29,0.08)]">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl tracking-[-0.03em] transition-colors group-hover:text-primary">
              {collection.name}
            </CardTitle>
            <Badge variant="outline" className="capitalize">
              {collection.status}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 leading-6">
            {collection.description ??
              "An aesthetic territory waiting for its point of view."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col justify-between gap-8">
          <div className="rounded-2xl border bg-surface-container-low/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Vision
            </p>
            <p className="mt-3 line-clamp-4 text-sm leading-6 text-foreground">
              {collection.vision ??
                "Define the references, constraints and feeling that make this collection distinct."}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Updated {formatDate(collection.updated_at)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyCollections() {
  return (
    <Card className="border-dashed bg-card/80 py-16 text-center">
      <CardContent className="mx-auto max-w-xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Empty workspace territory
        </p>
        <h2 className="font-heading text-3xl tracking-[-0.03em]">
          No collections yet
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Create your first aesthetic territory to give garments a point of view
          inside this workspace.
        </p>
      </CardContent>
    </Card>
  );
}

function CollectionsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="min-h-72">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-28 w-full rounded-2xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CollectionsClient({ workspaceId }: { workspaceId: string }) {
  const [workspace, setWorkspace] = useState<WorkspaceRead | null>(null);
  const [collections, setCollections] = useState<CollectionRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const [workspaceResult, collectionResult] = await Promise.all([
        workspaceClientApi.getWorkspace(workspaceId),
        collectionClientApi.listCollections(workspaceId),
      ]);
      setWorkspace(workspaceResult);
      setCollections(collectionResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load this workspace collections view.",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load is intentionally recreated from workspaceId only.
  }, [workspaceId]);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 py-4 pb-24 md:py-8 md:pb-8">
      <header className="flex flex-col gap-6 rounded-[2rem] border bg-card px-6 py-7 shadow-sm md:flex-row md:items-end md:justify-between md:px-8 md:py-9">
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {workspace?.name ?? "Workspace"} · Workspace
          </p>
          <div className="space-y-3">
            <h1 className="font-heading text-4xl leading-tight tracking-[-0.04em] md:text-6xl">
              Collections
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Aesthetic territories inside this workspace. Use them to organize
              garments by meaning, mood and context while preserving what each
              collection stands for.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-4 md:w-auto md:items-end">
          <Badge variant="secondary" className="w-fit">
            {collections.length}{" "}
            {collections.length === 1 ? "collection" : "collections"}
          </Badge>
          <CreateCollectionForm workspaceId={workspaceId} />
        </div>
      </header>

      {error ? (
        <Card className="border-destructive/20 bg-card py-12 text-center">
          <CardContent className="mx-auto max-w-xl space-y-5">
            <h2 className="font-heading text-3xl tracking-[-0.03em]">
              Collections could not load
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">{error}</p>
            <Button
              onClick={() => {
                setLoading(true);
                void load();
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <CollectionsSkeleton />
      ) : collections.length === 0 ? (
        <EmptyCollections />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
