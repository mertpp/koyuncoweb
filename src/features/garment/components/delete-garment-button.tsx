"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { garmentClientApi } from "@/features/garment/client";
import { describeApiError } from "@/shared/api/errors";
import { Button } from "@/shared/components/koyun/button";

/** Delete with a second click to confirm. The backend removes the garment and its photos. */
export function DeleteGarmentButton({ workspaceId, garmentId }: { workspaceId: string; garmentId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function remove() {
    setError(null);
    startTransition(async () => {
      try {
        await garmentClientApi.deleteGarment(workspaceId, garmentId);
        router.push(`/workspaces/${workspaceId}/garments`);
        router.refresh();
      } catch (deleteError) {
        setError(describeApiError(deleteError, "Could not delete the garment.").message);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-space-xs">
      {confirming ? (
        <div className="flex flex-wrap items-center gap-space-md">
          <span className="text-body-sm text-muted-foreground">Delete it and its photos?</span>
          <Button variant="secondary" onClick={remove} disabled={pending}>
            {pending ? "Deleting…" : "Yes, delete"}
          </Button>
          <Button variant="link" onClick={() => setConfirming(false)} disabled={pending}>
            Keep it
          </Button>
        </div>
      ) : (
        <Button variant="link" onClick={() => setConfirming(true)}>
          Delete garment
        </Button>
      )}
      {error ? (
        <p className="text-body-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
