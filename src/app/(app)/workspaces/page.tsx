import { redirect } from "next/navigation";

import { createWorkspace, listWorkspaces } from "@/shared/api/koyun-api";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";


export const instant = false;

export default async function WorkspacesPage() {
  const [accessToken, user] = await Promise.all([
    getCurrentAccessToken(),
    getCurrentUser(),
  ]);

  if (!user) {
    redirect("/login");
  }

  const auth = {
    accessToken,
    ownerId: user.ownerId,
  };

  const workspaces = await listWorkspaces(auth);
  const workspace =
    workspaces.find((item) => item.name === "Personal") ??
    workspaces[0] ??
    (await createWorkspace(auth, "Personal"));

  redirect(`/workspaces/${workspace.id}`);
}
