"use client";

import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { collectionClientApi } from "@/features/collection/client";
import { garmentClientApi } from "@/features/garment/client";
import type { GarmentListItemRead } from "@/features/garment/types";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

export type AddGarmentToCollectionFormProps = {
  workspaceId: string;
  collectionId: string;
  onAdded: () => void;
};

export function AddGarmentToCollectionForm({
  collectionId,
  onAdded,
  workspaceId,
}: AddGarmentToCollectionFormProps) {
  const [open, setOpen] = useState(false);
  const [garments, setGarments] = useState<GarmentListItemRead[]>([]);
  const [selectedGarmentId, setSelectedGarmentId] = useState("");
  const [userNote, setUserNote] = useState("");
  const [loadingGarments, setLoadingGarments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || garments.length > 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      async function loadGarments() {
        try {
          setLoadingGarments(true);
          setError(null);
          const rows = await garmentClientApi.listGarments(workspaceId);
          setGarments(rows);
          setSelectedGarmentId((current) => current || rows[0]?.id || "");
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load garments for this workspace.",
          );
        } finally {
          setLoadingGarments(false);
        }
      }

      void loadGarments();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [garments.length, open, workspaceId]);

  async function addGarment() {
    if (!selectedGarmentId) {
      setError("Choose a garment before adding it to this collection.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await collectionClientApi.upsertCollectionGarment(
        workspaceId,
        collectionId,
        selectedGarmentId,
        {
          status: "included",
          role: "unknown",
          source: "manual",
          user_note: userNote.trim() || null,
        },
      );

      setOpen(false);
      setSelectedGarmentId("");
      setUserNote("");
      onAdded();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not add this garment to the collection.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
        <PlusIcon className="size-4" />
        Add garment
      </Button>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-4 rounded-lg border bg-background/70 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl tracking-[-0.02em]">
            Add garment
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Add an existing workspace garment to this collection.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setOpen(false)}
          aria-label="Close add garment form"
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Garment
        </span>
        <select
          value={selectedGarmentId}
          onChange={(event) => setSelectedGarmentId(event.target.value)}
          disabled={loadingGarments || submitting || garments.length === 0}
          className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        >
          {loadingGarments ? (
            <option>Loading garments…</option>
          ) : garments.length === 0 ? (
            <option>No garments available</option>
          ) : (
            garments.map((garment) => (
              <option key={garment.id} value={garment.id}>
                {garment.title} · {garment.brand_id ?? "Unknown"}
              </option>
            ))
          )}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Note
        </span>
        <Textarea
          value={userNote}
          onChange={(event) => setUserNote(event.target.value)}
          placeholder="Why does this garment belong in this collection?"
          disabled={submitting}
          rows={3}
        />
      </label>

      <div className="rounded-lg border bg-surface-container-low/40 p-3 text-xs leading-5 text-muted-foreground">
        Default relationship: included · unknown role · manual source.
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setOpen(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={addGarment}
          disabled={submitting || loadingGarments || !selectedGarmentId}
        >
          {submitting ? <Loader2Icon className="size-4 animate-spin" /> : null}
          Add garment
        </Button>
      </div>
    </div>
  );
}
