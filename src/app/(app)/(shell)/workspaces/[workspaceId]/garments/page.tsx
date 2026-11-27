import Link from "next/link";

import { WardrobeGallery, type WardrobeItem } from "@/features/garment/components/wardrobe-gallery";
import { coverPhoto, photoUrl } from "@/features/garment/photos";
import { garmentServerApi } from "@/features/garment/server";
import { taxonomyLabel } from "@/features/taxonomy/api";
import { taxonomyServerApi } from "@/features/taxonomy/server";
import { buttonStyles } from "@/shared/components/koyun/button";
import { Card } from "@/shared/components/koyun/card";
import { Container } from "@/shared/components/koyun/layout";

export const instant = false;

// J2 wardrobe: saved garments, plus the caller's unsaved drafts ("continue or discard").
// What is a draft and what is saved is decided by the backend (`status`).
// Target design: /design/wardrobe (sample data). This page shows only what the backend
// returns today; brand label and colour dots arrive with gap B8, filters with gap B9.

export default async function WardrobePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const base = `/workspaces/${workspaceId}/garments`;

  const [garments, drafts, types] = await Promise.all([
    garmentServerApi.listGarments(workspaceId),
    garmentServerApi.listDrafts(workspaceId),
    taxonomyServerApi.listGarmentTypes(),
  ]);

  const typeNames = new Map(types.map((type) => [type.code, taxonomyLabel(type.label_key)]));
  const typeName = (code: string | null) => (code ? (typeNames.get(code) ?? code) : null);

  // Gap B3: the list carries no photo, so each card asks for its photos.
  const withPhotos = (ids: string[]) =>
    Promise.all(
      ids.map(async (id) => photoUrl(coverPhoto(await garmentServerApi.listPhotos(workspaceId, id)))),
    );
  const [garmentPhotos, draftPhotos] = await Promise.all([
    withPhotos(garments.map((garment) => garment.id)),
    withPhotos(drafts.map((draft) => draft.id)),
  ]);

  // Until B8 the list has no brand name: the photo label is empty, the category goes below.
  const savedItems: WardrobeItem[] = garments.map((garment, index) => ({
    id: garment.id,
    href: `${base}/${garment.id}`,
    imageSrc: garmentPhotos[index] ?? null,
    title: garment.title,
    label: null,
    meta: typeName(garment.garment_type_id),
    draft: false,
  }));
  const draftItems: WardrobeItem[] = drafts.map((draft, index) => ({
    id: draft.id,
    href: `${base}/${draft.id}/setup`,
    imageSrc: draftPhotos[index] ?? null,
    title: draft.title ?? "Untitled garment",
    label: null,
    meta: typeName(draft.garment_type_id),
    draft: true,
  }));

  return (
    <Container className="flex flex-col gap-space-xl py-12">
      <WardrobeGallery
        garments={savedItems}
        drafts={draftItems}
        actions={
          <Link href={`${base}/new`} className={buttonStyles("primary")}>
            Add garment
          </Link>
        }
        empty={
          <Card tone="muted" className="items-start">
            <h2 className="text-headline-md">Your wardrobe is empty</h2>
            <p className="text-body-md text-muted-foreground">
              Add a garment with a few photos. Koyun reads them and fills in the details for you.
            </p>
            <Link href={`${base}/new`} className={buttonStyles("secondary")}>
              Add your first garment
            </Link>
          </Card>
        }
      />
    </Container>
  );
}
