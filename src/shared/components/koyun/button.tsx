import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";

// Buttons from doc/DESIGN.md (Components > Buttons), with the 8px radius decision.
// For a link that looks like a button: <a className={buttonStyles("primary")}>.

const variants = {
  /** Solid brand green. One per area: the main commitment. */
  primary: "rounded-lg bg-primary px-5 py-2.5 text-primary-foreground hover:opacity-90",
  /** Hairline border on the page background; fills with surface on hover. */
  secondary:
    "rounded-lg border border-border bg-background px-5 py-2.5 text-foreground hover:bg-surface-container-lowest",
  /** Editorial link: no container, underlined with a stone rule. */
  link: "text-foreground underline decoration-border underline-offset-3 hover:text-primary",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonStyles(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-space-sm text-label-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  );
}

export function Button({
  variant = "primary",
  type = "button",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonStyles(variant, className)} {...props} />;
}
