"use client";

import { useMemo, useState } from "react";

import type { Profile } from "@/features/profile/api";
import { completeProfileOnboarding, saveOnboardingDraft } from "./actions";

const totalSteps = 5;

const steps = [
  { eyebrow: "SECTION 01 // ORIGIN", title: "Identity", meta: "Curator Details" },
  { eyebrow: "SECTION 02 // PROPORTIONS", title: "Body & Fit", meta: "Measurements & Drape" },
  { eyebrow: "SECTION 03 // CADENCE", title: "Lifestyle", meta: "Rhythm & Environment" },
  { eyebrow: "SECTION 04 // MATERIALITY", title: "Preferences", meta: "Sensory Ledger" },
  { eyebrow: "SECTION 05 // PHILOSOPHY", title: "Personal Statement", meta: "Archival Credo" },
] as const;

const countries = [
  { value: "ES", label: "Spain" },
  { value: "TR", label: "Turkey" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "DK", label: "Denmark" },
  { value: "JP", label: "Japan" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "IT", label: "Italy" },
] as const;

const bodyShapes = ["Slim", "Athletic", "Regular", "Broad", "Curvy", "Custom"];
const workEnvironments = ["Remote", "Office", "Hybrid", "Manual Work", "Student", "Retired"];
const travelFrequencies = ["Rarely", "Monthly", "Weekly", "Frequently"];
const activityLevels = ["Low", "Moderate", "Active", "Very Active"];

const inputClass =
  "w-full border-0 border-b border-[#E8E4DC] bg-transparent px-0 py-3 text-base text-[#1A1C1A] outline-none transition placeholder:text-[#71756E]/60 focus:border-[#2C3E2D]";
const labelClass =
  "block font-mono text-[11px] uppercase tracking-wider text-[#71756E]";
const helperClass = "pt-1 font-mono text-[10px] text-[#71756E]/80";

function listToText(value: string[] | null | undefined) {
  return value?.join(", ") ?? "";
}

function OptionGrid({
  name,
  value,
  options,
  onChange,
  columns = "md:grid-cols-4",
}: {
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  columns?: string;
}) {
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <div className={`grid grid-cols-2 gap-2.5 ${columns}`}>
        {options.map((option) => {
          const active = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={
                active
                  ? "rounded border-2 border-[#2C3E2D] bg-[#2C3E2D]/5 px-3 py-3 text-center transition-all"
                  : "rounded border border-[#E8E4DC] bg-white px-3 py-3 text-center transition-all hover:border-[#2C3E2D]"
              }
            >
              <span
                className={
                  active
                    ? "block font-serif text-base font-medium text-[#2C3E2D]"
                    : "block font-serif text-base text-[#1A1C1A]"
                }
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepHeading({ step }: { step: (typeof steps)[number] }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4">
      <div>
        <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-[#71756E]">
          {step.eyebrow}
        </span>
        <h2 className="font-heading text-3xl font-normal tracking-tight text-[#1A1C1A] md:text-4xl">
          {step.title}
        </h2>
      </div>
      <span className="hidden font-mono text-xs italic text-[#71756E] sm:inline">
        {step.meta}
      </span>
    </div>
  );
}

export function OnboardingWizard({
  profile,
  saved,
}: {
  profile: Profile;
  saved: boolean;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bodyShape, setBodyShape] = useState(profile.body_shape ?? "Athletic");
  const [workEnvironment, setWorkEnvironment] = useState(
    profile.work_environment ?? "Hybrid",
  );
  const [travelFrequency, setTravelFrequency] = useState(
    profile.travel_frequency ?? "Monthly",
  );
  const [activityLevel, setActivityLevel] = useState(
    profile.activity_level ?? "Moderate",
  );

  const step = steps[currentStep - 1];
  const progressBars = useMemo(
    () => Array.from({ length: totalSteps }, (_, index) => index + 1),
    [],
  );

  function nextStep() {
    setCurrentStep((value) => Math.min(totalSteps, value + 1));
  }

  function previousStep() {
    setCurrentStep((value) => Math.max(1, value - 1));
  }

  return (
    <main className="flex min-h-svh flex-col justify-between bg-[#FBF9F5] text-[#1A1C1A] selection:bg-[#2C3E2D] selection:text-white">
      <header className="sticky top-0 z-30 w-full border-b border-[#E8E4DC]/60 bg-[#FBF9F5]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-medium tracking-tight">Koyun</span>
            <span className="border-l border-[#E8E4DC] py-0.5 pl-2 font-mono text-[10px] uppercase tracking-widest text-[#71756E]">
              Archival System
            </span>
          </div>
          <div className="hidden items-center gap-2 font-mono text-xs text-[#71756E] sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-[#2C3E2D]/70" />
            <span>FOLIO PROTOCOL // 04.2</span>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:py-16">
        <div className="mb-12 border-b border-[#E8E4DC] pb-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#71756E]">
              <span className="inline-block h-px w-2 bg-[#71756E]" />
              Personal Wardrobe Profile
            </span>
            <div className="rounded-full bg-[#EFECE6] px-3 py-1 font-mono text-xs font-medium tracking-wider text-[#2C3E2D]">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          <h1 className="mb-3 font-heading text-3xl font-normal leading-[1.15] tracking-tight text-[#1A1C1A] md:text-5xl">
            Create your wardrobe identity
            <span className="italic text-[#2C3E2D]">.</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[#71756E] md:text-base">
            This profile helps Koyun understand your environment, climate
            nuances, preferences, and personal style philosophy without
            commercial surveillance.
          </p>

          <div className="mt-8 flex items-center gap-1.5 pt-2 sm:gap-2">
            {progressBars.map((bar) => (
              <div
                key={bar}
                className={
                  bar <= currentStep
                    ? "h-[2px] flex-1 bg-[#2C3E2D] transition-all duration-300"
                    : "h-[2px] flex-1 bg-[#E8E4DC] transition-all duration-300"
                }
              />
            ))}
          </div>
        </div>

        {saved ? (
          <div className="mb-8 rounded border border-[#2C3E2D]/20 bg-[#2C3E2D]/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-[#2C3E2D]">
            Draft saved.
          </div>
        ) : null}

        <form action={completeProfileOnboarding} className="relative">
          <section className={currentStep === 1 ? "block animate-in fade-in-0 slide-in-from-bottom-2 duration-300" : "hidden"}>
            <StepHeading step={step} />
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClass}>Display Name *</label>
                <input name="displayName" required defaultValue={profile.display_name ?? ""} placeholder="e.g. Julian Thorne" className={`${inputClass} font-heading text-lg`} />
                <p className={helperClass}>Appears on ledger folios & care reports</p>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Occupation / Discipline</label>
                <input name="occupation" defaultValue={profile.occupation ?? ""} placeholder="e.g. Architect, Curatorial Scholar" className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Country / Territory</label>
                <select name="countryCode" defaultValue={profile.country_code ?? ""} className={`${inputClass} cursor-pointer appearance-none`}>
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>City of Residence</label>
                <input name="city" defaultValue={profile.city ?? ""} placeholder="e.g. Edinburgh, Copenhagen, Kyoto" className={inputClass} />
                <p className={helperClass}>Calibrates humidity & seasonal rotation</p>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Birth Year</label>
                <input name="birthYear" type="number" min={1900} defaultValue={profile.birth_year ?? ""} placeholder="1992" className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Gender / Silhouette Paradigm</label>
                <select name="gender" defaultValue={profile.gender ?? ""} className={`${inputClass} cursor-pointer appearance-none`}>
                  <option value="">Prefer unstated</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="androgynous">Androgynous / Fluid</option>
                  <option value="unspecified">Prefer unstated</option>
                </select>
              </div>
            </div>
          </section>

          <section className={currentStep === 2 ? "block animate-in fade-in-0 slide-in-from-bottom-2 duration-300" : "hidden"}>
            <StepHeading step={step} />
            <div className="mb-10 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClass}>Height (cm)</label>
                <input name="heightCm" type="number" min={100} max={250} defaultValue={profile.height_cm ?? ""} placeholder="180" className={`${inputClass} font-heading text-xl`} />
                <p className={helperClass}>Aids trouser break & overcoat drop estimation</p>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Weight (kg)</label>
                <input name="weightKg" type="number" min={30} max={250} defaultValue={profile.weight_kg ?? ""} placeholder="72" className={`${inputClass} font-heading text-xl`} />
              </div>
            </div>
            <div className="mb-10">
              <label className={`${labelClass} mb-3`}>Body Shape Archetype</label>
              <OptionGrid name="bodyShape" value={bodyShape} options={bodyShapes} onChange={setBodyShape} columns="md:grid-cols-6" />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Body Notes & Tailoring Nuances</label>
              <textarea name="bodyNotes" rows={4} defaultValue={profile.body_notes ?? ""} className="w-full rounded border border-[#E8E4DC] bg-white p-5 font-heading text-lg leading-relaxed text-[#1A1C1A] outline-none transition focus:border-[#2C3E2D]" placeholder="e.g. Slightly longer arms; prefer higher waistlines..." />
              <p className="text-xs italic text-[#71756E]">Describe fit preferences, proportions or tailoring considerations.</p>
            </div>
          </section>

          <section className={currentStep === 3 ? "block animate-in fade-in-0 slide-in-from-bottom-2 duration-300" : "hidden"}>
            <StepHeading step={step} />
            <div className="space-y-10">
              <div>
                <label className={`${labelClass} mb-3`}>Primary Work Environment</label>
                <OptionGrid name="workEnvironment" value={workEnvironment} options={workEnvironments} onChange={setWorkEnvironment} columns="md:grid-cols-6" />
              </div>
              <div>
                <label className={`${labelClass} mb-3`}>Travel Frequency & Transits</label>
                <OptionGrid name="travelFrequency" value={travelFrequency} options={travelFrequencies} onChange={setTravelFrequency} />
              </div>
              <div>
                <label className={`${labelClass} mb-3`}>Physical Activity Level</label>
                <OptionGrid name="activityLevel" value={activityLevel} options={activityLevels} onChange={setActivityLevel} />
              </div>
            </div>
          </section>

          <section className={currentStep === 4 ? "block animate-in fade-in-0 slide-in-from-bottom-2 duration-300" : "hidden"}>
            <StepHeading step={step} />
            <div className="mb-8 flex items-center justify-between rounded-r border-l-2 border-[#2C3E2D] bg-[#F4F1EA] p-3.5 text-xs text-[#1A1C1A]">
              <span>Separate values with commas.</span>
              <span className="hidden font-mono text-[10px] uppercase text-[#71756E] sm:inline">Token-based Inputs</span>
            </div>
            <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
              <div className="space-y-2">
                <label className={labelClass}>Values</label>
                <input name="values" defaultValue={listToText(profile.values)} placeholder="quality, comfort, heritage" className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Favorite Colors & Tones</label>
                <input name="favoriteColors" defaultValue={listToText(profile.favorite_colors)} placeholder="navy, cream, olive" className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Avoided Colors</label>
                <input name="avoidedColors" defaultValue={listToText(profile.avoided_colors)} placeholder="neon magenta, saturated yellow" className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Favorite Materials & Textiles</label>
                <input name="favoriteMaterials" defaultValue={listToText(profile.favorite_materials)} placeholder="Irish linen, Shetland tweed" className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Avoided Materials</label>
                <input name="avoidedMaterials" defaultValue={listToText(profile.avoided_materials)} placeholder="polyester, acrylic" className={inputClass} />
              </div>
            </div>
          </section>

          <section className={currentStep === 5 ? "block animate-in fade-in-0 slide-in-from-bottom-2 duration-300" : "hidden"}>
            <StepHeading step={step} />
            <div className="space-y-4">
              <label className="block font-heading text-xl font-normal text-[#1A1C1A] md:text-2xl">
                Describe your relationship with clothing
                <span className="italic text-[#2C3E2D]">.</span>
              </label>
              <textarea name="personalStatement" rows={7} defaultValue={profile.personal_statement ?? ""} className="w-full rounded border border-[#E8E4DC] bg-white p-5 font-heading text-lg leading-relaxed text-[#1A1C1A] outline-none transition focus:border-[#2C3E2D]" placeholder="Write freely about why you collect, preserve, or wear what you own..." />
              <div className="flex flex-col gap-2 pt-3 sm:flex-row">
                {[
                  "I value longevity over trends.",
                  "My wardrobe should support frequent travel with durable layering.",
                  "I prefer understated garments with strong craftsmanship.",
                ].map((prompt) => (
                  <button key={prompt} type="button" className="rounded border border-[#E8E4DC] bg-white px-3 py-2 text-left font-heading text-sm italic text-[#1A1C1A]/90 transition-all hover:border-[#2C3E2D]">
                    «{prompt}»
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-14 flex items-center justify-between border-t border-[#E8E4DC] pt-6">
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#71756E] transition-colors hover:text-[#1A1C1A] disabled:pointer-events-none disabled:opacity-30"
            >
              ← Back
            </button>

            <div className="flex items-center gap-3 sm:gap-6">
              <button
                type="submit"
                formAction={saveOnboardingDraft}
                className="font-mono text-xs uppercase tracking-wider text-[#71756E] transition-colors hover:text-[#1A1C1A]"
              >
                Save & Exit
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded bg-[#2C3E2D] px-7 py-3 font-mono text-xs uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#233224]"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  className="rounded bg-[#2C3E2D] px-7 py-3 font-mono text-xs uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#233224]"
                >
                  Continue →
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <footer className="w-full border-t border-[#E8E4DC]/60 bg-[#FBF9F5] px-6 py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 font-mono text-[11px] text-[#71756E] sm:flex-row">
          <div className="flex items-center gap-4">
            <span>© MMXXIV KOYUNCO S.A.</span>
            <span>•</span>
            <span>PROTOCOL ISO-16363</span>
          </div>
          <div className="flex items-center gap-6">
            <span>ZERO TELEMETRY</span>
            <span>•</span>
            <span>ENCRYPTED VAULT ENCLAVE</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
