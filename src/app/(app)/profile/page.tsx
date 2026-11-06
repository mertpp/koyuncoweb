import { redirect } from "next/navigation";

import { saveProfile } from "./actions";

import { ensureProfile } from "@/features/profile/api";
import { ensureAccount } from "@/shared/api/koyun-api";
import { getCurrentAccessToken, getCurrentUser } from "@/shared/auth/server";

export const instant = false;

type ProfilePageProps = {
  searchParams: Promise<{
    saved?: string;
  }>;
};

function listToText(value: string[]) {
  return value.join(", ");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-md border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary";

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const [params, accessToken, user] = await Promise.all([
    searchParams,
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

  await ensureAccount(auth);
  const profile = await ensureProfile(auth);
  const saved = params.saved === "1";

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-1 py-4 pb-24 md:py-8 md:pb-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Profile
        </p>
        <h1 className="font-heading text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
          Your KoyunCo profile
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          Complete these fields once so KoyunCo can personalize wardrobe
          recommendations, fit context and style intelligence.
        </p>
      </header>

      {saved ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          Profile saved.
        </div>
      ) : null}

      <form action={saveProfile} className="flex flex-col gap-8">
        <section className="rounded-md border bg-card p-5 shadow-sm md:p-6">
          <h2 className="font-heading text-2xl tracking-[-0.02em]">Identity</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Display name">
              <input
                name="displayName"
                defaultValue={profile.display_name ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Country code">
              <input
                name="countryCode"
                defaultValue={profile.country_code ?? ""}
                maxLength={2}
                placeholder="ES"
                className={inputClass}
              />
            </Field>
            <Field label="City">
              <input
                name="city"
                defaultValue={profile.city ?? ""}
                placeholder="Madrid"
                className={inputClass}
              />
            </Field>
            <Field label="Occupation">
              <input
                name="occupation"
                defaultValue={profile.occupation ?? ""}
                placeholder="Architect"
                className={inputClass}
              />
            </Field>
            <Field label="Birth year">
              <input
                name="birthYear"
                type="number"
                defaultValue={profile.birth_year ?? ""}
                min={1900}
                className={inputClass}
              />
            </Field>
            <Field label="Gender">
              <input
                name="gender"
                defaultValue={profile.gender ?? ""}
                placeholder="male"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-md border bg-card p-5 shadow-sm md:p-6">
          <h2 className="font-heading text-2xl tracking-[-0.02em]">
            Body & fit
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Height cm">
              <input
                name="heightCm"
                type="number"
                defaultValue={profile.height_cm ?? ""}
                min={100}
                max={250}
                className={inputClass}
              />
            </Field>
            <Field label="Weight kg">
              <input
                name="weightKg"
                type="number"
                defaultValue={profile.weight_kg ?? ""}
                min={30}
                max={250}
                className={inputClass}
              />
            </Field>
            <Field label="Body shape">
              <input
                name="bodyShape"
                defaultValue={profile.body_shape ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Body notes">
              <textarea
                name="bodyNotes"
                defaultValue={profile.body_notes ?? ""}
                rows={4}
                className={`${inputClass} md:col-span-2`}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-md border bg-card p-5 shadow-sm md:p-6">
          <h2 className="font-heading text-2xl tracking-[-0.02em]">
            Lifestyle
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field label="Work environment">
              <input
                name="workEnvironment"
                defaultValue={profile.work_environment ?? ""}
                placeholder="Office, remote, field..."
                className={inputClass}
              />
            </Field>
            <Field label="Travel frequency">
              <input
                name="travelFrequency"
                defaultValue={profile.travel_frequency ?? ""}
                placeholder="Rarely, monthly..."
                className={inputClass}
              />
            </Field>
            <Field label="Activity level">
              <input
                name="activityLevel"
                defaultValue={profile.activity_level ?? ""}
                placeholder="Low, medium, high"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-md border bg-card p-5 shadow-sm md:p-6">
          <h2 className="font-heading text-2xl tracking-[-0.02em]">
            Preferences
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use comma-separated values. Empty lists will clear the field.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Values">
              <input
                name="values"
                defaultValue={listToText(profile.values)}
                placeholder="quality, comfort, heritage"
                className={inputClass}
              />
            </Field>
            <Field label="Favorite colors">
              <input
                name="favoriteColors"
                defaultValue={listToText(profile.favorite_colors)}
                placeholder="navy, brown, ecru"
                className={inputClass}
              />
            </Field>
            <Field label="Avoided colors">
              <input
                name="avoidedColors"
                defaultValue={listToText(profile.avoided_colors)}
                placeholder="neon, purple"
                className={inputClass}
              />
            </Field>
            <Field label="Favorite materials">
              <input
                name="favoriteMaterials"
                defaultValue={listToText(profile.favorite_materials)}
                placeholder="wool, linen, denim"
                className={inputClass}
              />
            </Field>
            <Field label="Avoided materials">
              <input
                name="avoidedMaterials"
                defaultValue={listToText(profile.avoided_materials)}
                placeholder="polyester"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-md border bg-card p-5 shadow-sm md:p-6">
          <h2 className="font-heading text-2xl tracking-[-0.02em]">
            Personal statement
          </h2>
          <textarea
            name="personalStatement"
            defaultValue={profile.personal_statement ?? ""}
            rows={6}
            placeholder="What do you want your wardrobe to do for you?"
            className={`${inputClass} mt-5 w-full`}
          />
        </section>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
          >
            Save profile
          </button>
        </div>
      </form>
    </section>
  );
}
