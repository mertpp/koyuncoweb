"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { garmentClientApi } from "@/features/garment/client";
import { offeredPhotoKinds, photoUrl } from "@/features/garment/photos";
import type {
  GarmentAnalysisRead,
  GarmentCondition,
  GarmentPhotoKind,
  GarmentPhotoRead,
  GarmentRead,
} from "@/features/garment/types";
import { taxonomyLabel, type GarmentType } from "@/features/taxonomy/api";
import { ApiError } from "@/shared/api/core";
import { describeApiError, type ApiErrorInfo } from "@/shared/api/errors";
import { Button } from "@/shared/components/koyun/button";
import { Card } from "@/shared/components/koyun/card";
import { Field, Input, Select, Textarea } from "@/shared/components/koyun/field";
import { StepHeader } from "@/shared/components/koyun/steps";

// J2 "add garment" (ADR 0036). Every rule lives in the backend; this screen only walks the
// user through its flow:
//   1. Photos: the first upload creates the draft (POST garments), then each photo is uploaded.
//   2. Analysing: POST analysis, then GET analysis every 3 s until it is completed or failed.
//   3. Review: the draft comes back prefilled; PATCH with status "active" saves it. A 422
//      (missing title, type…) is shown on its field.
// Discard deletes the draft. A draft can be resumed at /garments/{id}/setup.

const POLL_MS = 3000;

const conditionOptions: ReadonlyArray<{ value: GarmentCondition; label: string }> = [
  { value: "new_with_tags", label: "New with tags" },
  { value: "new_without_tags", label: "New without tags" },
  { value: "very_good", label: "Very good" },
  { value: "fair", label: "Fair" },
];

type Step = "photos" | "analysing" | "review";

/** Which screen a draft opens on, from what the backend already has. */
function initialStep(photos: GarmentPhotoRead[], analysis: GarmentAnalysisRead | null): Step {
  if (!analysis || photos.length === 0) {
    return "photos";
  }

  return analysis.status === "completed" ? "review" : "analysing";
}

type ReviewForm = {
  title: string;
  typeId: string;
  brand: string;
  size: string;
  condition: string;
  notes: string;
};

function formFrom(garment: GarmentRead | null): ReviewForm {
  return {
    title: garment?.title ?? "",
    typeId: garment?.garment_type_id ?? "",
    brand: garment?.brand_raw ?? "",
    size: garment?.size ?? "",
    condition: garment?.condition ?? "",
    notes: garment?.notes ?? "",
  };
}

function textOrNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function toCondition(value: string): GarmentCondition | null {
  return conditionOptions.find((option) => option.value === value)?.value ?? null;
}

function isNotFound(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}

export function GarmentSetup({
  workspaceId,
  garment: initialGarment,
  photos: initialPhotos,
  analysis: initialAnalysis,
  types,
}: {
  workspaceId: string;
  garment: GarmentRead | null;
  photos: GarmentPhotoRead[];
  analysis: GarmentAnalysisRead | null;
  types: GarmentType[];
}) {
  const router = useRouter();
  const base = `/workspaces/${workspaceId}/garments`;

  const [garment, setGarment] = useState(initialGarment);
  const [photos, setPhotos] = useState(initialPhotos);
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [step, setStep] = useState<Step>(initialStep(initialPhotos, initialAnalysis));
  const [error, setError] = useState<ApiErrorInfo | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploadingKind, setUploadingKind] = useState<GarmentPhotoKind | null>(null);

  // Review form, prefilled by the analysis.
  const [form, setForm] = useState(() => formFrom(initialGarment));
  const setField = (field: keyof ReviewForm) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  // Poll the analysis while it is pending.
  const garmentId = garment?.id ?? null;
  const analysisPending = step === "analysing" && analysis?.status === "pending";
  useEffect(() => {
    if (!analysisPending || !garmentId) {
      return;
    }

    let cancelled = false;
    const timer = setInterval(async () => {
      try {
        const latest = await garmentClientApi.getAnalysis(workspaceId, garmentId);

        if (cancelled || latest.status === "pending") {
          return;
        }

        // Load the prefilled draft before touching state: setting the analysis to a final
        // status stops this polling (cancelled = true), so nothing may come after it.
        const prefilled =
          latest.status === "completed" ? await garmentClientApi.getGarment(workspaceId, garmentId) : null;

        if (cancelled) {
          return;
        }

        if (prefilled) {
          setGarment(prefilled);
          setForm(formFrom(prefilled));
          setStep("review");
        }

        setAnalysis(latest);
      } catch (pollError) {
        if (!cancelled) {
          setError(describeApiError(pollError, "Could not check the analysis."));
        }
      }
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [analysisPending, garmentId, workspaceId]);

  function run(action: () => Promise<void>, fallback: string) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
      } catch (actionError) {
        setError(describeApiError(actionError, fallback));
      }
    });
  }

  /** The draft exists from the first photo on. The URL then points at it, so it can be resumed. */
  async function ensureDraft() {
    if (garment) {
      return garment;
    }

    const created = await garmentClientApi.createGarment(workspaceId);
    setGarment(created);
    window.history.replaceState(null, "", `${base}/${created.id}/setup`);
    return created;
  }

  async function upload(kind: GarmentPhotoKind, file: File) {
    setError(null);
    setUploadingKind(kind);

    try {
      const draft = await ensureDraft();
      const photo = await garmentClientApi.uploadPhoto(workspaceId, draft.id, file, kind, photos.length);
      setPhotos((current) => [...current, photo]);
    } catch (uploadError) {
      setError(describeApiError(uploadError, "Could not upload the photo."));
    } finally {
      setUploadingKind(null);
    }
  }

  function removePhoto(photo: GarmentPhotoRead) {
    run(async () => {
      await garmentClientApi.deletePhoto(workspaceId, photo.garment_id, photo.id);
      setPhotos((current) => current.filter((item) => item.id !== photo.id));
    }, "Could not remove the photo.");
  }

  function analyse() {
    if (!garment) {
      return;
    }

    run(async () => {
      const launched = await garmentClientApi.launchAnalysis(workspaceId, garment.id);
      setAnalysis(launched);
      setStep("analysing");
    }, "Could not start the analysis.");
  }

  function save() {
    if (!garment) {
      return;
    }

    run(async () => {
      const title = textOrNull(form.title);
      const saved = await garmentClientApi.updateGarment(workspaceId, garment.id, {
        // Empty title or type are left out: the backend answers which ones it still needs.
        ...(title ? { title } : {}),
        ...(form.typeId ? { garment_type_id: form.typeId } : {}),
        brand_raw: textOrNull(form.brand),
        size: textOrNull(form.size),
        condition: toCondition(form.condition),
        notes: textOrNull(form.notes),
        status: "active",
      });
      router.push(`${base}/${saved.id}`);
    }, "Could not save the garment.");
  }

  function discard() {
    run(async () => {
      if (garment) {
        try {
          await garmentClientApi.deleteGarment(workspaceId, garment.id);
        } catch (deleteError) {
          if (!isNotFound(deleteError)) {
            throw deleteError;
          }
        }
      }

      router.push(base);
    }, "Could not discard the draft.");
  }

  const fieldError = (field: string) => error?.fieldErrors[field];
  const generalError = error && Object.keys(error.fieldErrors).length === 0 ? error.message : null;
  const activeTypes = types.filter((type) => type.active);
  const typeList =
    form.typeId && !activeTypes.some((type) => type.code === form.typeId)
      ? [...activeTypes, ...types.filter((type) => type.code === form.typeId)]
      : activeTypes;
  const steps: Step[] = ["photos", "analysing", "review"];
  const stepNames: Record<Step, string> = { photos: "Photos", analysing: "Analysis", review: "Review" };

  return (
    <Card className="w-full max-w-3xl gap-space-lg p-space-xl">
      <StepHeader steps={steps.map((item) => stepNames[item])} current={steps.indexOf(step)} />

      {step === "photos" ? (
        <div className="flex flex-col gap-space-lg">
          <div className="flex flex-col gap-space-sm">
            <h1 className="text-headline-lg">Photograph your garment</h1>
            <p className="text-body-md text-muted-foreground">
              Start with the front. The label helps Koyun read the brand, size and materials.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-space-md md:grid-cols-4">
            {offeredPhotoKinds.map(({ kind, label }) => {
              const photo = photos.find((item) => item.kind === kind) ?? null;
              const src = photoUrl(photo);

              return (
                <div key={kind} className="flex flex-col gap-space-xs">
                  <label className="relative flex aspect-3/4 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface-container-low text-tech-sm text-muted-foreground hover:border-primary">
                    {src ? (
                      <img src={src} alt={label} className="size-full object-cover" />
                    ) : photo ? (
                      <span>Processing…</span>
                    ) : (
                      <span>{uploadingKind === kind ? "Uploading…" : `+ ${label}`}</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={Boolean(photo) || uploadingKind !== null || pending}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";

                        if (file) {
                          void upload(kind, file);
                        }
                      }}
                    />
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm uppercase text-muted-foreground">{label}</span>
                    {photo ? (
                      <Button variant="link" onClick={() => removePhoto(photo)} disabled={pending}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {step === "analysing" ? (
        <div className="flex flex-col gap-space-sm">
          {analysis?.status === "failed" ? (
            <>
              <h1 className="text-headline-lg">Koyun could not read these photos</h1>
              <p className="text-body-md text-muted-foreground">
                {analysis.error ?? "The analysis failed."} Try again, or change the photos first.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-headline-lg">Koyun is looking at your garment…</h1>
              <p className="text-body-md text-muted-foreground">
                It reads the photos and fills in the details. This usually takes a few seconds.
              </p>
            </>
          )}
        </div>
      ) : null}

      {step === "review" ? (
        <div className="flex flex-col gap-space-lg">
          <div className="flex flex-col gap-space-sm">
            <h1 className="text-headline-lg">Check the details</h1>
            <p className="text-body-md text-muted-foreground">
              Koyun filled in what it could read. Correct anything, then save it to your wardrobe.
            </p>
          </div>
          <div className="grid gap-space-md md:grid-cols-2">
            <Field label="Name" htmlFor="title" error={fieldError("title")} className="md:col-span-2">
              <Input
                id="title"
                value={form.title}
                onChange={(event) => setField("title")(event.target.value)}
                aria-invalid={fieldError("title") ? true : undefined}
              />
            </Field>
            <Field label="Category" htmlFor="type" error={fieldError("garment_type_id")}>
              <Select
                id="type"
                value={form.typeId}
                onChange={(event) => setField("typeId")(event.target.value)}
                aria-invalid={fieldError("garment_type_id") ? true : undefined}
              >
                <option value="">Select a category</option>
                {typeList.map((type) => (
                  <option key={type.code} value={type.code}>
                    {taxonomyLabel(type.label_key)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Brand" htmlFor="brand" error={fieldError("brand_raw")}>
              <Input id="brand" value={form.brand} onChange={(event) => setField("brand")(event.target.value)} />
            </Field>
            <Field label="Size" htmlFor="size" error={fieldError("size")}>
              <Input id="size" value={form.size} onChange={(event) => setField("size")(event.target.value)} />
            </Field>
            <Field label="Condition" htmlFor="condition" error={fieldError("condition")}>
              <Select id="condition" value={form.condition} onChange={(event) => setField("condition")(event.target.value)}>
                <option value="">Not specified</option>
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Notes" htmlFor="notes" error={fieldError("notes")} className="md:col-span-2">
              <Textarea id="notes" value={form.notes} onChange={(event) => setField("notes")(event.target.value)} />
            </Field>
          </div>
        </div>
      ) : null}

      {generalError ? (
        <p className="text-body-sm text-destructive" role="alert">
          {generalError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <Button variant="link" onClick={discard} disabled={pending}>
          {garment ? "Discard draft" : "Cancel"}
        </Button>
        <div className="flex flex-wrap gap-space-md">
          {step !== "photos" ? (
            <Button variant="secondary" onClick={() => setStep("photos")} disabled={pending}>
              Change photos
            </Button>
          ) : null}
          {step === "photos" ? (
            <Button onClick={analyse} disabled={pending || photos.length === 0 || uploadingKind !== null}>
              {pending ? "Starting…" : "Analyse"}
            </Button>
          ) : null}
          {step === "analysing" && analysis?.status === "failed" ? (
            <Button onClick={analyse} disabled={pending}>
              {pending ? "Starting…" : "Try again"}
            </Button>
          ) : null}
          {step === "review" ? (
            <Button onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save to wardrobe"}
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
