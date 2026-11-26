import type { GarmentPhotoKind, GarmentPhotoRead } from "./types";

/** Photo kinds offered when adding photos (J2 decision: four for now; the backend accepts 14). */
export const offeredPhotoKinds = [
  { kind: "front", label: "Front" },
  { kind: "back", label: "Back" },
  { kind: "label", label: "Label" },
  { kind: "detail", label: "Detail" },
] as const satisfies ReadonlyArray<{ kind: GarmentPhotoKind; label: string }>;

/**
 * The photo shown on a card: the one the backend marks primary, else the first in order.
 * Presentation only. The list endpoint carries no photo, so cards fetch the photos (gap B3).
 */
export function coverPhoto(photos: GarmentPhotoRead[]) {
  const ordered = [...photos].sort((left, right) => left.sort_order - right.sort_order);

  return ordered.find((photo) => photo.is_primary) ?? ordered[0] ?? null;
}

export function photoUrl(photo: GarmentPhotoRead | null, size: "thumb" | "display" = "thumb") {
  if (!photo) {
    return null;
  }

  return size === "thumb"
    ? (photo.thumb_url ?? photo.display_url ?? photo.cutout_url ?? photo.original_url ?? null)
    : (photo.display_url ?? photo.cutout_url ?? photo.original_url ?? photo.thumb_url ?? null);
}
