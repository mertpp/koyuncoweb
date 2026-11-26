import { redirect } from "next/navigation";

import { wardrobePath } from "@/features/workspace/server";

export const instant = false;

/** Old bookmarks. Real route: /workspaces/{id}/garments/{garmentId}. */
export default async function GarmentRedirect({
  params,
}: {
  params: Promise<{ garmentId: string }>;
}) {
  const { garmentId } = await params;

  redirect(await wardrobePath(`/${encodeURIComponent(garmentId)}`));
}
