import { redirect } from "next/navigation";

import { wardrobePath } from "@/features/workspace/server";

export const instant = false;

/** Real route: /workspaces/{id}/garments/new. */
export default async function NewGarmentRedirect() {
  redirect(await wardrobePath("/new"));
}
