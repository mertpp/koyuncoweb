import Link from "next/link";

import { coverPhoto, photoUrl } from "@/features/garment/photos";
import { garmentServerApi } from "@/features/garment/server";
import { taxonomyLabel } from "@/features/taxonomy/api";
import { taxonomyServerApi } from "@/features/taxonomy/server";
import { buttonStyles } from "@/shared/components/koyun/button";
import { Card, GarmentCard } from "@/shared/components/koyun/card";
import { Container, SectionHeader } from "@/shared/components/koyun/layout";

export const instant = false;

// J2 wardrobe: saved garments, plus the caller's unsaved drafts ("continue or discard").
// What is a draft and what is saved is decided by the backend (`status`).

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

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
      ids.map(async (id) =>
        photoUrl(coverPhoto(await garmentServerApi.listPhotos(workspaceId, id))),
      ),
    );
  const [garmentPhotos, draftPhotos] = await Promise.all([
    withPhotos(garments.map((garment) => garment.id)),
    withPhotos(drafts.map((draft) => draft.id)),
  ]);

  return (
    <Container className="flex flex-col gap-space-xl py-12">
      <SectionHeader
        as="h1"
        eyebrow="Your wardrobe"
        title="Wardrobe"
        description={`${garments.length} ${garments.length === 1 ? "garment" : "garments"}`}
        actions={
          <Link href={`${base}/new`} className={buttonStyles("primary")}>
            Add garment
          </Link>
        }
      />

      {drafts.length > 0 ? (
        <section className="flex flex-col gap-space-md">
          <SectionHeader
            title="Pending drafts"
            description="Not saved yet. Continue where you left off, or discard them."
          />
          <div className="grid grid-cols-2 gap-space-md md:grid-cols-3 lg:grid-cols-4">
            {drafts.map((draft, index) => (
              <Link key={draft.id} href={`${base}/${draft.id}/setup`} aria-label="Continue draft">
                <GarmentCard
                  imageSrc={draftPhotos[index]}
                  imageAlt="No photo yet"
                  badge="Draft"
                  meta={typeName(draft.garment_type_id) ?? "Untitled"}
                  title={draft.title ?? "Untitled garment"}
                  footer={`Edited ${formatDate(draft.updated_at)}`}
                />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {garments.length === 0 ? (
        <Card tone="muted" className="items-start">
          <h2 className="text-headline-md">Your wardrobe is empty</h2>
          <p className="text-body-md text-muted-foreground">
            Add a garment with a few photos. Koyun reads them and fills in the details for you.
          </p>
          <Link href={`${base}/new`} className={buttonStyles("secondary")}>
            Add your first garment
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-space-md md:grid-cols-3 lg:grid-cols-4">
          {garments.map((garment, index) => (
            <Link key={garment.id} href={`${base}/${garment.id}`}>
              <GarmentCard
                imageSrc={garmentPhotos[index]}
                imageAlt={garment.title}
                meta={typeName(garment.garment_type_id)}
                title={garment.title}
              />
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
