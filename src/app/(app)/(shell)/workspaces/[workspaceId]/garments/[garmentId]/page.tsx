import Link from "next/link";
import { redirect } from "next/navigation";

import { DeleteGarmentButton } from "@/features/garment/components/delete-garment-button";
import { GarmentGallery } from "@/features/garment/components/garment-gallery";
import { garmentServerApi } from "@/features/garment/server";
import type { GarmentAttributeRead } from "@/features/garment/types";
import { taxonomyLabel } from "@/features/taxonomy/api";
import { taxonomyServerApi } from "@/features/taxonomy/server";
import { buttonStyles } from "@/shared/components/koyun/button";
import { Card, SpecGrid } from "@/shared/components/koyun/card";
import { Container, Eyebrow } from "@/shared/components/koyun/layout";

export const instant = false;

// J2 garment detail: only what the backend returns. Recommendations, outfits and the like
// arrive with their endpoints (and Today), never as sample data.

const conditionNames: Record<string, string> = {
  new_with_tags: "New with tags",
  new_without_tags: "New without tags",
  very_good: "Very good",
  fair: "Fair",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

function AttributeList({ label, items }: { label: string; items: GarmentAttributeRead[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-space-sm">
      <Eyebrow>{label}</Eyebrow>
      <ul className="flex flex-wrap gap-space-sm">
        {items.map((item) => (
          <li key={item.code} className="rounded-sm border border-border px-space-sm py-space-xs text-tech-sm">
            {taxonomyLabel(item.code)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function GarmentDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string; garmentId: string }>;
}) {
  const { workspaceId, garmentId } = await params;
  const wardrobe = `/workspaces/${workspaceId}/garments`;

  const [garment, photos, types] = await Promise.all([
    garmentServerApi.getGarment(workspaceId, garmentId),
    garmentServerApi.listPhotos(workspaceId, garmentId),
    taxonomyServerApi.listGarmentTypes(),
  ]);

  // A draft is not in the wardrobe yet: finish it first.
  if (garment.status === "draft") {
    redirect(`${wardrobe}/${garmentId}/setup`);
  }

  const type = types.find((item) => item.code === garment.garment_type_id);
  const title = garment.title ?? "Untitled garment";

  return (
    <Container className="flex flex-col gap-space-xl py-12">
      <Link href={wardrobe} className={buttonStyles("link", "self-start")}>
        Back to wardrobe
      </Link>

      <div className="grid gap-space-xl md:grid-cols-2">
        <GarmentGallery photos={photos} title={title} />

        <div className="flex flex-col gap-space-lg">
          <div className="flex flex-col gap-space-sm">
            <Eyebrow>{type ? taxonomyLabel(type.label_key) : "Garment"}</Eyebrow>
            <h1 className="text-headline-xl">{title}</h1>
            {garment.brand_raw ? (
              <p className="text-headline-sm italic text-muted-foreground">{garment.brand_raw}</p>
            ) : null}
          </div>

          <SpecGrid
            items={[
              { label: "Size", value: garment.size ?? "—" },
              { label: "Condition", value: garment.condition ? (conditionNames[garment.condition] ?? garment.condition) : "—" },
              { label: "Added", value: formatDate(garment.created_at) },
            ]}
          />

          <AttributeList label="Colours" items={garment.colors ?? []} />
          <AttributeList label="Materials" items={garment.materials ?? []} />

          {garment.description || garment.notes ? (
            <Card tone="muted">
              {garment.description ? <p className="text-body-md">{garment.description}</p> : null}
              {garment.notes ? <p className="text-body-md text-muted-foreground">{garment.notes}</p> : null}
            </Card>
          ) : null}

          <DeleteGarmentButton workspaceId={workspaceId} garmentId={garment.id} />
        </div>
      </div>
    </Container>
  );
}
