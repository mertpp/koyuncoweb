"use client";

import {
  AlertTriangleIcon,
  ImageIcon,
  Loader2Icon,
  StarIcon,
  UploadIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createWorkspace,
  listGarmentPhotos,
  listWorkspaces,
  updateGarmentPhoto,
  uploadGarmentPhoto,
  type ApiAuthOptions,
  type GarmentPhoto,
  type GarmentPhotoKind,
} from "@/shared/api/koyun-api";

const processingStatuses = new Set(["pending", "processing"]);

const photoKindOptions: GarmentPhotoKind[] = [
  "front",
  "back",
  "side",
  "detail",
  "label",
  "fit",
  "collar",
  "sleeve",
  "fabric",
  "defect",
  "tag",
  "inside",
  "on_body",
  "unknown",
];

type GarmentPhotoGalleryProps = {
  garmentId: string;
  workspaceId?: string | null;
};

function getOwnerIdFromCookie(): string {
  const fallback = "123e4567-e89b-12d3-a456-426614174000";

  if (typeof document === "undefined") {
    return fallback;
  }

  const match = document.cookie.match(/(?:^|; )koyunco_owner_id=([^;]*)/);

  return match ? decodeURIComponent(match[1]) : fallback;
}

function sortPhotos(photos: GarmentPhoto[]) {
  return [...photos].sort((left, right) => {
    const sortDelta = left.sort_order - right.sort_order;

    if (sortDelta !== 0) {
      return sortDelta;
    }

    return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
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

function formatKind(kind: GarmentPhotoKind) {
  return kind.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function GarmentPhotoGallery({
  garmentId,
  workspaceId: workspaceIdProp,
}: GarmentPhotoGalleryProps) {
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(workspaceIdProp ?? null);
  const [photos, setPhotos] = useState<GarmentPhoto[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updatingPhotoId, setUpdatingPhotoId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadKind, setUploadKind] = useState<GarmentPhotoKind>("unknown");

  const auth = useMemo<ApiAuthOptions>(() => {
    return {
      accessToken: session?.azureAccessToken ?? null,
      ownerId: session?.user?.ownerId ?? getOwnerIdFromCookie(),
    };
  }, [session?.azureAccessToken, session?.user?.ownerId]);

  const orderedPhotos = useMemo(() => sortPhotos(photos), [photos]);
  const primaryPhoto = useMemo(() => choosePrimaryPhoto(orderedPhotos), [orderedPhotos]);
  const selectedPhoto =
    orderedPhotos.find((photo) => photo.id === selectedPhotoId) ?? primaryPhoto;
  const hasProcessingPhotos = orderedPhotos.some((photo) =>
    processingStatuses.has(photo.status),
  );

  const loadPhotos = useCallback(
    async (targetWorkspaceId = workspaceId) => {
      if (!targetWorkspaceId) {
        return;
      }

      const nextPhotos = await listGarmentPhotos(auth, targetWorkspaceId, garmentId);
      setPhotos(sortPhotos(nextPhotos));

      setSelectedPhotoId((current) => {
        if (current && nextPhotos.some((photo) => photo.id === current)) {
          return current;
        }

        return choosePrimaryPhoto(nextPhotos)?.id ?? null;
      });
    },
    [auth, garmentId, workspaceId],
  );

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      if (status === "loading") {
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);

        let resolvedWorkspaceId = workspaceIdProp ?? workspaceId;

        if (!resolvedWorkspaceId) {
          const workspaces = await listWorkspaces(auth);
          const workspace = workspaces[0] ?? (await createWorkspace(auth, "Personal"));
          resolvedWorkspaceId = workspace.id;
        }

        if (cancelled) {
          return;
        }

        setWorkspaceId(resolvedWorkspaceId);
        await loadPhotos(resolvedWorkspaceId);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Could not load garment photos.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [auth, loadPhotos, status, workspaceId, workspaceIdProp]);

  useEffect(() => {
    if (!workspaceId || !hasProcessingPhotos) {
      return;
    }

    const interval = window.setInterval(() => {
      void loadPhotos(workspaceId).catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not refresh garment photos.",
        );
      });
    }, 2500);

    return () => window.clearInterval(interval);
  }, [hasProcessingPhotos, loadPhotos, workspaceId]);

  async function handleUpload(file: File) {
    if (!workspaceId) {
      setErrorMessage("Workspace is not ready yet.");
      return;
    }

    try {
      setUploading(true);
      setErrorMessage(null);

      const photo = await uploadGarmentPhoto(auth, workspaceId, garmentId, file, {
        kind: uploadKind,
        sort_order: orderedPhotos.length + 1,
      });

      setPhotos((current) => sortPhotos([...current, photo]));
      setSelectedPhotoId(photo.id);

      if (processingStatuses.has(photo.status)) {
        await loadPhotos(workspaceId);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not upload photo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function setAsPrimary(photoId: string) {
    if (!workspaceId) {
      return;
    }

    try {
      setUpdatingPhotoId(photoId);
      setErrorMessage(null);
      await updateGarmentPhoto(auth, workspaceId, garmentId, photoId, {
        is_primary: true,
      });
      await loadPhotos(workspaceId);
      setSelectedPhotoId(photoId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not update primary photo.",
      );
    } finally {
      setUpdatingPhotoId(null);
    }
  }

  async function updateKind(photoId: string, kind: GarmentPhotoKind) {
    if (!workspaceId) {
      return;
    }

    try {
      setUpdatingPhotoId(photoId);
      setErrorMessage(null);
      await updateGarmentPhoto(auth, workspaceId, garmentId, photoId, { kind });
      await loadPhotos(workspaceId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not update photo metadata.",
      );
    } finally {
      setUpdatingPhotoId(null);
    }
  }

  async function refreshSignedUrls() {
    if (!workspaceId) {
      return;
    }

    try {
      await loadPhotos(workspaceId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not refresh image URLs.",
      );
    }
  }

  const mainImageUrl = selectedPhoto
    ? selectedPhoto.cutout_url ?? selectedPhoto.display_url
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-xl border bg-card shadow-md">
        <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-muted">
          {loading ? (
            <PhotoSkeleton label="Loading garment photos…" />
          ) : selectedPhoto?.status === "failed" ? (
            <PhotoError />
          ) : mainImageUrl ? (
            <>
              <img
                key={`${selectedPhoto?.id}-${mainImageUrl}`}
                src={mainImageUrl}
                alt={`${formatKind(selectedPhoto?.kind ?? "unknown")} garment photo`}
                className="size-full object-contain"
                onError={() => void refreshSignedUrls()}
              />
              {selectedPhoto && processingStatuses.has(selectedPhoto.status) ? (
                <ProcessingOverlay status={selectedPhoto.status} />
              ) : null}
            </>
          ) : selectedPhoto && processingStatuses.has(selectedPhoto.status) ? (
            <PhotoSkeleton label="Processing image…" />
          ) : (
            <EmptyPhotoState />
          )}

          {selectedPhoto ? (
            <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-md">
                <ImageIcon className="size-3.5 text-primary" />
                <span className="text-primary">{formatKind(selectedPhoto.kind)}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  · {selectedPhoto.status}
                </span>
              </span>

              {selectedPhoto.is_primary ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground shadow-sm">
                  <StarIcon className="size-3.5 fill-current" />
                  Primary
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-3 shadow-sm">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Archival Photo Views
            </span>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {orderedPhotos.length} associated views
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={uploadKind}
              onChange={(event) => setUploadKind(event.target.value as GarmentPhotoKind)}
              className="h-9 rounded-lg border bg-background px-2 text-xs text-foreground"
            >
              {photoKindOptions.map((kind) => (
                <option key={kind} value={kind}>
                  {formatKind(kind)}
                </option>
              ))}
            </select>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  void handleUpload(file);
                }
              }}
            />
            <button
              type="button"
              disabled={uploading || !workspaceId}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? <Loader2Icon className="size-4 animate-spin" /> : <UploadIcon className="size-4" />}
              Upload Photo
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {orderedPhotos.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
            {orderedPhotos.map((photo) => {
              const active = selectedPhoto?.id === photo.id;
              const thumbUrl = photo.thumb_url ?? photo.display_url;
              const isUpdating = updatingPhotoId === photo.id;

              return (
                <div key={photo.id} className="min-w-0 space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoId(photo.id)}
                    className={`group relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted transition-all ${
                      active ? "opacity-100 ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {photo.status === "failed" ? (
                      <div className="flex size-full items-center justify-center bg-destructive/10 text-destructive">
                        <AlertTriangleIcon className="size-5" />
                      </div>
                    ) : thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={`${formatKind(photo.kind)} thumbnail`}
                        className="size-full object-cover"
                        onError={() => void refreshSignedUrls()}
                      />
                    ) : (
                      <div className="size-full animate-pulse bg-muted-foreground/10" />
                    )}

                    {processingStatuses.has(photo.status) ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/55 backdrop-blur-[1px]">
                        <Loader2Icon className="size-5 animate-spin text-primary" />
                      </div>
                    ) : null}

                    <span className="absolute bottom-1 left-1 rounded bg-background/90 px-1.5 py-0.5 font-mono text-[9px] text-foreground backdrop-blur-sm">
                      {formatKind(photo.kind)}
                    </span>
                    {photo.is_primary ? (
                      <span className="absolute right-1 top-1 rounded-full bg-primary p-1 text-primary-foreground">
                        <StarIcon className="size-3 fill-current" />
                      </span>
                    ) : null}
                  </button>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={photo.is_primary || isUpdating}
                      onClick={() => void setAsPrimary(photo.id)}
                      className="flex-1 rounded bg-muted px-1.5 py-1 text-[10px] font-medium text-muted-foreground transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Primary
                    </button>
                    <select
                      value={photo.kind}
                      disabled={isUpdating}
                      onChange={(event) =>
                        void updateKind(photo.id, event.target.value as GarmentPhotoKind)
                      }
                      className="min-w-0 flex-1 rounded bg-muted px-1 py-1 text-[10px] text-muted-foreground"
                    >
                      {photoKindOptions.map((kind) => (
                        <option key={kind} value={kind}>
                          {formatKind(kind)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !loading ? (
          <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
            No photos yet. Upload the first archival view for this garment.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PhotoSkeleton({ label }: { label: string }) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 bg-muted">
      <div className="h-2/3 w-1/2 animate-pulse rounded-t-[42%] rounded-b-xl bg-muted-foreground/10" />
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function PhotoError() {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 bg-destructive/10 p-6 text-center text-destructive">
      <AlertTriangleIcon className="size-8" />
      <p className="text-sm font-medium">No se pudo procesar la imagen</p>
    </div>
  );
}

function EmptyPhotoState() {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground">
      <ImageIcon className="size-10" />
      <p className="text-sm">No archival photos are registered for this garment yet.</p>
    </div>
  );
}

function ProcessingOverlay({ status }: { status: GarmentPhoto["status"] }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/45 backdrop-blur-[1px]">
      <Loader2Icon className="size-7 animate-spin text-primary" />
      <span className="rounded-full bg-background/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground shadow-sm">
        {status === "pending" ? "Queued for processing" : "Processing image"}
      </span>
    </div>
  );
}
