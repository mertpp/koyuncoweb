import { redirect } from "next/navigation";

import { GarmentSetup } from "@/features/garment/components/garment-setup";
import { garmentServerApi } from "@/features/garment/server";
import { taxonomyServerApi } from "@/features/taxonomy/server";
import { ApiError } from "@/shared/api/core";
import { Container } from "@/shared/components/koyun/layout";

export const instant = false;

/** J2: resume a draft where it was left (photos, analysis or review). */
export default async function GarmentSetupPage({
  params,
}: {
  params: Promise<{ workspaceId: string; garmentId: string }>;
}) {
  const { workspaceId, garmentId } = await params;

  const [garment, photos, types, analysis] = await Promise.all([
    garmentServerApi.getGarment(workspaceId, garmentId),
    garmentServerApi.listPhotos(workspaceId, garmentId),
    taxonomyServerApi.listGarmentTypes(),
    // 404 means the draft was never analysed.
    garmentServerApi.getAnalysis(workspaceId, garmentId).catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    }),
  ]);

  // A saved garment is no longer a draft: open its page instead.
  if (garment.status === "active") {
    redirect(`/workspaces/${workspaceId}/garments/${garmentId}`);
  }

  return (
    <Container className="flex justify-center py-12">
      <GarmentSetup
        workspaceId={workspaceId}
        garment={garment}
        photos={photos}
        analysis={analysis}
        types={types}
      />
    </Container>
  );
}
