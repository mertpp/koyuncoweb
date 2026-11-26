"use client";

import { useState, useTransition } from "react";

import type { Profile } from "@/features/profile/api";
import { Button } from "@/shared/components/koyun/button";
import { Card } from "@/shared/components/koyun/card";
import { Field, Input, Select, Textarea } from "@/shared/components/koyun/field";
import { Container, Page } from "@/shared/components/koyun/layout";
import { StepHeader } from "@/shared/components/koyun/steps";

import { finishOnboarding, saveOnboardingStep, type OnboardingUpdate, type StepResult } from "./actions";
import type { CountryOption } from "./countries";

// J1 onboarding: greeting, where you live, personal statement. Everything but the greeting
// can be skipped; "Start" always marks the onboarding as done. Product rationale: ask the
// minimum, Koyun learns the rest from the wardrobe.

const steps = ["Welcome", "Where you live", "Your statement"] as const;

const statementExamples = [
  "Quiet, well made, built to last.",
  "Relaxed during the week, sharp when it matters.",
  "Less, but better.",
];

/** Empty text means "no value", sent as null. */
function textOrNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function OnboardingWizard({
  name,
  profile,
  countries,
}: {
  name: string;
  profile: Profile;
  countries: CountryOption[];
}) {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(profile.city ?? "");
  const [countryCode, setCountryCode] = useState(profile.country_code ?? "");
  const [statement, setStatement] = useState(profile.personal_statement ?? "");
  const [error, setError] = useState<Extract<StepResult, { ok: false }> | null>(null);
  const [pending, startTransition] = useTransition();

  const isLast = step === steps.length - 1;
  const countryList =
    countryCode && !countries.some((country) => country.code === countryCode)
      ? [{ code: countryCode, name: countryCode }, ...countries]
      : countries;

  function stepUpdate(): OnboardingUpdate {
    if (step === 1) {
      return { city: textOrNull(city), country_code: countryCode || null };
    }

    if (step === 2) {
      return { personal_statement: textOrNull(statement) };
    }

    return {};
  }

  function run(action: () => Promise<StepResult>, onDone: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();

      if (result.ok) {
        onDone();
      } else {
        setError(result);
      }
    });
  }

  function goNext() {
    setError(null);
    setStep((value) => Math.min(value + 1, steps.length - 1));
  }

  /** Saves the current step, then moves on (or finishes on the last one). */
  function next() {
    const update = stepUpdate();

    if (isLast) {
      run(() => finishOnboarding(update), () => undefined);
    } else if (step === 0) {
      goNext();
    } else {
      run(() => saveOnboardingStep(update), goNext);
    }
  }

  /** Moves on without saving this step. On the last step, still finishes the onboarding. */
  function skip() {
    if (isLast) {
      run(() => finishOnboarding({}), () => undefined);
    } else {
      goNext();
    }
  }

  const fieldError = (field: string) => error?.fieldErrors[field];

  return (
    <Page className="flex items-center">
      <Container className="flex justify-center py-20">
        <Card className="w-full max-w-xl gap-space-lg p-space-xl">
          <StepHeader steps={steps} current={step} />

          {step === 0 ? (
            <div className="flex flex-col gap-space-sm">
              <h1 className="text-headline-xl">Hello, {name}.</h1>
              <p className="text-body-lg text-muted-foreground">
                This is how Koyun will address you. It comes from your Microsoft account.
              </p>
              <p className="text-body-md text-muted-foreground">
                Two short questions and you are in. Both can be skipped.
              </p>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-space-lg">
              <div className="flex flex-col gap-space-sm">
                <h1 className="text-headline-lg">Where do you live?</h1>
                <p className="text-body-md text-muted-foreground">
                  So Koyun can think about your climate and your seasons.
                </p>
              </div>
              <Field label="City" htmlFor="city" error={fieldError("city")}>
                <Input
                  id="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  autoComplete="address-level2"
                  aria-invalid={fieldError("city") ? true : undefined}
                />
              </Field>
              <Field label="Country" htmlFor="country" error={fieldError("country_code")}>
                <Select
                  id="country"
                  value={countryCode}
                  onChange={(event) => setCountryCode(event.target.value)}
                  aria-invalid={fieldError("country_code") ? true : undefined}
                >
                  <option value="">Select a country</option>
                  {countryList.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-space-lg">
              <div className="flex flex-col gap-space-sm">
                <h1 className="text-headline-lg">What would you like your clothes to say about you?</h1>
                <p className="text-body-md text-muted-foreground">
                  Not what you like today, but where you want to go. In your own words.
                </p>
              </div>
              <Field
                label="Your statement"
                htmlFor="statement"
                hint={`For example: “${statementExamples.join("” · “")}”`}
                error={fieldError("personal_statement")}
              >
                <Textarea
                  id="statement"
                  value={statement}
                  onChange={(event) => setStatement(event.target.value)}
                  aria-invalid={fieldError("personal_statement") ? true : undefined}
                />
              </Field>
            </div>
          ) : null}

          {error && Object.keys(error.fieldErrors).length === 0 ? (
            <p className="text-body-sm text-destructive" role="alert">
              {error.message}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-space-md">
            {step > 0 ? (
              <Button variant="link" onClick={() => setStep(step - 1)} disabled={pending}>
                Back
              </Button>
            ) : (
              <span />
            )}
            <div className="flex flex-wrap gap-space-md">
              {step > 0 ? (
                <Button variant="secondary" onClick={skip} disabled={pending}>
                  Skip
                </Button>
              ) : null}
              <Button onClick={next} disabled={pending}>
                {pending ? "Saving…" : isLast ? "Start" : "Continue"}
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    </Page>
  );
}
