import { Suspense } from "react";

import type { CollectionGarmentListStatus } from "@/features/collection/types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { CollectionDetailClient } from "@/features/collection/components/collection-detail-client";

export const instant = false;

type CollectionDetailPageProps = {
  params: Promise<{
    workspaceId: string;
    collectionId: string;
  }>;
  searchParams: Promise<{
    status?: string | string[];
  }>;
};

const statusValues = [
  "included",
  "candidate",
  "rejected",
  "all",
] as const satisfies readonly CollectionGarmentListStatus[];

function parseStatus(value: string | string[] | undefined): CollectionGarmentListStatus {
  const raw = Array.isArray(value) ? value[0] : value;

  return statusValues.some((status) => status === raw)
    ? (raw as CollectionGarmentListStatus)
    : "included";
}

function CollectionDetailShellFallback() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 py-4 pb-24 md:py-8 md:pb-8">
      <div className="rounded-[2rem] border bg-card px-6 py-7 shadow-sm md:px-8 md:py-9">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-5 h-14 w-full max-w-2xl" />
        <Skeleton className="mt-4 h-5 w-full max-w-3xl" />
      </div>
      <Card>
        <CardContent className="py-8">
          <Skeleton className="h-20 w-full rounded-2xl" />
        </CardContent>
      </Card>
    </section>
  );
}

export default async function CollectionDetailPage({
  params,
  searchParams,
}: CollectionDetailPageProps) {
  const [{ workspaceId, collectionId }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const activeStatus = parseStatus(query.status);

  return (
    <Suspense fallback={<CollectionDetailShellFallback />}>
      <CollectionDetailClient
        activeStatus={activeStatus}
        collectionId={collectionId}
        workspaceId={workspaceId}
      />
    </Suspense>
  );
}
