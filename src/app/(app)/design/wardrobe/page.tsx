import type { Metadata } from "next";

import { WardrobeLab } from "./wardrobe-lab";

export const metadata: Metadata = {
  title: "Wardrobe design lab — KoyunCo",
};

// Design lab for the wardrobe redesign: sample data and live switches to compare variants.
// Not linked from the app menu and never calls the API. What is chosen here becomes pieces
// and moves to the real wardrobe page.
export default function WardrobeLabPage() {
  return (
    <main className="mx-auto flex max-w-page flex-col gap-space-xl px-margin-mobile py-space-xl md:px-margin-tablet lg:px-margin">
      <WardrobeLab />
    </main>
  );
}
