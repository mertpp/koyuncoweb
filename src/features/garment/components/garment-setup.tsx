"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { garmentClientApi } from "@/features/garment/client";
import { offeredPhotoKinds, photoUrl } from "@/features/garment/photos";
import { GarmentFields, formFrom, updateFrom, type GarmentForm } from "@/features/garment/components/garment-fields";
import type {
  GarmentAnalysisRead,
  GarmentPhotoKind,
  GarmentPhotoRead,
  GarmentRead,
} from "@/features/garment/types";
import type { GarmentType } from "@/features/taxonomy/api";
import { ApiError } from "@/shared/api/core";
import { describeApiError, type ApiErrorInfo } from "@/shared/api/errors";
import { Button } from "@/shared/components/koyun/button";
import { Card } from "@/shared/components/koyun/card";
import { StepHeader } from "@/shared/components/koyun/steps";

// J2 "add garment" (ADR 0036). Every rule lives in the backend; this screen only walks the
// user through its flow:
//   1. Photos: the first upload creates the draft (POST garments), then each photo is uploaded.
//   2. Analysing: POST analysis, then GET analysis every 3 s until it is completed or failed.
//   3. Review: the draft comes back prefilled; PATCH with status "active" saves it. A 422
//      (missing title, type…) is shown on its field.
// Discard deletes the draft. A draft can be resumed at /garments/{id}/setup.

const POLL_MS = 3000;

type Step = "photos" | "analysing" | "review";

/** Which screen a draft opens on, from what the backend already has. */
function initialStep(photos: GarmentPhotoRead[], analysis: GarmentAnalysisRead | null): Step {
  if (!analysis || photos.length === 0) {
    return "photos";
  }

  return analysis.status === "completed" ? "review" : "analysing";
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
  const setField = (field: keyof GarmentForm, value: string) =>
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
      const saved = await garmentClientApi.updateGarment(workspaceId, garment.id, {
        ...updateFrom(form),
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

  const generalError = error && Object.keys(error.fieldErrors).length === 0 ? error.message : null;
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
          <GarmentFields form={form} onChange={setField} error={error} types={types} />
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
