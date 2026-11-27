import type { Metadata } from "next";

import { GarmentLab } from "./garment-lab";

export const metadata: Metadata = {
  title: "Garment detail design lab — KoyunCo",
};

// Design lab for the garment detail page: sample data and live switches to compare variants.
// Not linked from the app menu and never calls the API. Self-contained on purpose: nothing
// here is a shared piece yet, so it can be dropped without touching the rest of the app.
export default function GarmentLabPage() {
  return (
    <main className="mx-auto flex max-w-page flex-col gap-space-xl px-margin-mobile py-space-xl md:px-margin-tablet lg:px-margin">
      <GarmentLab />
    </main>
  );
}
