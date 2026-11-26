import { Eyebrow } from "./layout";

// Step indicator for short guided flows (onboarding, add garment). Visual reference: /design.

/** "Step 2 of 3 · Name" plus one bar per step, filled up to the current one. */
export function StepHeader({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <div className="flex items-center justify-between">
      <Eyebrow>
        Step {current + 1} of {steps.length} · {steps[current]}
      </Eyebrow>
      <div className="flex gap-space-xs" aria-hidden="true">
        {steps.map((label, index) => (
          <span
            key={label}
            className={index <= current ? "h-1 w-8 rounded-full bg-primary" : "h-1 w-8 rounded-full bg-border"}
          />
        ))}
      </div>
    </div>
  );
}
