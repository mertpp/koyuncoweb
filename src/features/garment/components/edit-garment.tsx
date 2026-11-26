"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { garmentClientApi } from "@/features/garment/client";
import { GarmentFields, formFrom, updateFrom, type GarmentForm } from "@/features/garment/components/garment-fields";
import type { GarmentRead } from "@/features/garment/types";
import type { GarmentType } from "@/features/taxonomy/api";
import { describeApiError, type ApiErrorInfo } from "@/shared/api/errors";
import { Button, buttonStyles } from "@/shared/components/koyun/button";
import { Card } from "@/shared/components/koyun/card";

// D15: edit the details of a saved garment. Same fields as the J2 review step; a plain PATCH
// without status, validated by the backend (422 shown on its field).

export function EditGarment({
  workspaceId,
  garment,
  types,
}: {
  workspaceId: string;
  garment: GarmentRead;
  types: GarmentType[];
}) {
  const router = useRouter();
  const detail = `/workspaces/${workspaceId}/garments/${garment.id}`;

  const [form, setForm] = useState(() => formFrom(garment));
  const [error, setError] = useState<ApiErrorInfo | null>(null);
  const [pending, startTransition] = useTransition();

  const setField = (field: keyof GarmentForm, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await garmentClientApi.updateGarment(workspaceId, garment.id, updateFrom(form));
        router.push(detail);
        router.refresh();
      } catch (saveError) {
        setError(describeApiError(saveError, "Could not save the changes."));
      }
    });
  }

  const generalError = error && Object.keys(error.fieldErrors).length === 0 ? error.message : null;

  return (
    <Card className="w-full max-w-3xl gap-space-lg p-space-xl">
      <h1 className="text-headline-lg">Edit details</h1>

      <GarmentFields form={form} onChange={setField} error={error} types={types} />

      {generalError ? (
        <p className="text-body-sm text-destructive" role="alert">
          {generalError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <Link href={detail} className={buttonStyles("link")}>
          Cancel
        </Link>
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </Card>
  );
}
