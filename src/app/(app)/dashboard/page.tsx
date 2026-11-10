import type { Metadata } from "next";

import { EditorialEditionView } from "./_editorial/editorial-edition";
import { morningTextureEdition } from "./_mock";

export const instant = false;

export const metadata: Metadata = {
  title: "KoyunCo — Daily Wardrobe Edition",
  description:
    "A private editorial dashboard for wardrobe intelligence, weather context and archival recommendations.",
};

export default function DashboardPage() {
  const edition = morningTextureEdition;

  return (
    <main className="min-h-svh bg-background text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
      <EditorialEditionView edition={edition} />
    </main>
  );
}
