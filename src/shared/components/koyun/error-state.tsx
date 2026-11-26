import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import { Eyebrow } from "./layout";

// Calm, centred message for a screen that could not load (error.tsx, global-error.tsx).
// It never shows the technical error: in production Next.js hides it anyway.

export function ErrorState({
  eyebrow = "Something went wrong",
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "mx-auto flex max-w-xl flex-col items-center gap-space-md py-20 text-center",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-headline-xl">{title}</h1>
      {description ? (
        <p className="text-headline-sm italic text-muted-foreground">{description}</p>
      ) : null}
      {actions ? <div className="flex flex-wrap justify-center gap-space-md">{actions}</div> : null}
    </div>
  );
}
