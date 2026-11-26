import { redirect } from "next/navigation";

import { EditGarment } from "@/features/garment/components/edit-garment";
import { garmentServerApi } from "@/features/garment/server";
import { taxonomyServerApi } from "@/features/taxonomy/server";
import { Container } from "@/shared/components/koyun/layout";

export const instant = false;

/** D15: edit a saved garment's details. */
export default async function EditGarmentPage({
  params,
}: {
  params: Promise<{ workspaceId: string; garmentId: string }>;
}) {
  const { workspaceId, garmentId } = await params;

  const [garment, types] = await Promise.all([
    garmentServerApi.getGarment(workspaceId, garmentId),
    taxonomyServerApi.listGarmentTypes(),
  ]);

  // A draft is finished in its guided flow, not here.
  if (garment.status === "draft") {
    redirect(`/workspaces/${workspaceId}/garments/${garmentId}/setup`);
  }

  return (
    <Container className="flex justify-center py-12">
      <EditGarment workspaceId={workspaceId} garment={garment} types={types} />
    </Container>
  );
}
