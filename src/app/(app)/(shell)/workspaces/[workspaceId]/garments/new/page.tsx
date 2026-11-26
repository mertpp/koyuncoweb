import { GarmentSetup } from "@/features/garment/components/garment-setup";
import { taxonomyServerApi } from "@/features/taxonomy/server";
import { Container } from "@/shared/components/koyun/layout";

export const instant = false;

/** J2: add a garment. Nothing is created until the first photo is uploaded. */
export default async function NewGarmentPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const [{ workspaceId }, types] = await Promise.all([
    params,
    taxonomyServerApi.listGarmentTypes(),
  ]);

  return (
    <Container className="flex justify-center py-12">
      <GarmentSetup workspaceId={workspaceId} garment={null} photos={[]} analysis={null} types={types} />
    </Container>
  );
}
