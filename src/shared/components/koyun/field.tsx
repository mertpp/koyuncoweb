import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

// Form pieces from doc/DESIGN.md: hairline inputs with the 6px radius (inner panels,
// inputs), label above, hint or error below. Visual reference: /design.

const controlStyles =
  "w-full rounded-md border border-border bg-background px-space-md py-space-sm text-body-md text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50 aria-invalid:border-destructive";

/** Label + control + hint or error. Pass the control's `id` as `htmlFor`. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-space-xs", className)}>
      <label htmlFor={htmlFor} className="text-label-sm uppercase text-muted-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-body-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-body-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlStyles, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlStyles, "min-h-32 resize-y", className)} {...props} />;
}

/** Native select, styled like Input. */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlStyles, "appearance-auto", className)} {...props} />;
}
