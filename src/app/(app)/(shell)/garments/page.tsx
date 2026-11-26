import { redirect } from "next/navigation";

import { wardrobePath } from "@/features/workspace/server";

export const instant = false;

/** Garments live in a workspace: /workspaces/{id}/garments is the only real route. */
export default async function GarmentsRedirect() {
  redirect(await wardrobePath());
}
