"use client";

import { useState } from "react";

import { coverPhoto, photoUrl } from "@/features/garment/photos";
import type { GarmentPhotoRead } from "@/features/garment/types";
import { cn } from "@/shared/lib/utils";

/** Main 3:4 photo plus thumbnails to switch it. Opens on the cover photo. */
export function GarmentGallery({ photos, title }: { photos: GarmentPhotoRead[]; title: string }) {
  const ordered = [...photos].sort((left, right) => left.sort_order - right.sort_order);
  const [selectedId, setSelectedId] = useState(coverPhoto(photos)?.id ?? null);
  const selected = ordered.find((photo) => photo.id === selectedId) ?? ordered[0] ?? null;
  const src = photoUrl(selected, "display");

  return (
    <div className="flex flex-col gap-space-md">
      <div className="aspect-3/4 overflow-hidden rounded-lg border border-border bg-surface-container">
        {src ? (
          <img src={src} alt={title} className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-tech-sm text-muted-foreground">
            No photo
          </span>
        )}
      </div>
      {ordered.length > 1 ? (
        <div className="grid grid-cols-4 gap-space-sm">
          {ordered.map((photo) => {
            const thumb = photoUrl(photo);

            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedId(photo.id)}
                aria-label={`Show ${photo.kind} photo`}
                aria-pressed={photo.id === selected?.id}
                className={cn(
                  "aspect-3/4 overflow-hidden rounded-md border bg-surface-container",
                  photo.id === selected?.id ? "border-primary" : "border-border",
                )}
              >
                {thumb ? <img src={thumb} alt="" className="size-full object-cover" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
