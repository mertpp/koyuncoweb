"use client";

import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { collectionClientApi } from "@/features/collection/client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

export function CreateCollectionForm({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vision, setVision] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Collection name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const collection = await collectionClientApi.createCollection(workspaceId, {
        name: trimmedName,
        description: description.trim() || null,
        vision: vision.trim() || null,
      });

      router.push(`/workspaces/${workspaceId}/collections/${collection.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create this collection. Please retry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-fit" size="lg">
        <PlusIcon className="size-4" />
        Create collection
      </Button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-4 rounded-3xl border bg-background/70 p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl tracking-[-0.02em]">
            Create collection
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Define an aesthetic territory inside this workspace.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setOpen(false)}
          aria-label="Close create collection form"
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Name
          </span>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Madrid summer tailoring"
            disabled={submitting}
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Description
          </span>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="A practical territory for lightweight tailoring, linen and warm evenings."
            disabled={submitting}
            rows={3}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Vision
          </span>
          <Textarea
            value={vision}
            onChange={(event) => setVision(event.target.value)}
            placeholder="Soft structure, muted contrast, breathable materials and pieces that survive real heat."
            disabled={submitting}
            rows={4}
          />
        </label>
      </div>

      {error ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
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
        <Button type="submit" disabled={submitting || !name.trim()}>
          {submitting ? <Loader2Icon className="size-4 animate-spin" /> : null}
          Save collection
        </Button>
      </div>
    </form>
  );
}
