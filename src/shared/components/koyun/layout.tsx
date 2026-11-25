import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

// Layout pieces. Pages compose these instead of writing widths, margins or vertical
// spacing themselves (doc/DESIGN.md, "Decisiones de KoyunCo"). Visual reference: /design.

/** Whole page: background and minimum height. */
export function Page({ className, ...props }: ComponentProps<"main">) {
  return <main className={cn("min-h-svh bg-background text-foreground", className)} {...props} />;
}

/** Content width (max 1440px) and side margins for mobile, tablet and desktop. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-page px-margin-mobile md:px-margin-tablet lg:px-margin",
        className,
      )}
      {...props}
    />
  );
}

const sectionTones = {
  default: "bg-background",
  muted: "bg-surface-container-low",
} as const;

/**
 * A full-width band with the standard vertical spacing. The background spans the whole
 * screen; the content sits inside a Container.
 */
export function Section({
  tone = "default",
  className,
  children,
  ...props
}: ComponentProps<"section"> & { tone?: keyof typeof sectionTones }) {
  return (
    <section className={cn("py-20 md:py-24", sectionTones[tone], className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

/** Small uppercase label above a title ("From the Koyun archive"). */
export function Eyebrow({ className, ...props }: ComponentProps<"span">) {
  return (
    <span className={cn("text-label-sm uppercase text-muted-foreground", className)} {...props} />
  );
}

const titleSizes = {
  default: "text-headline-xl",
  // Landing only, at most 2-3 per page (doc/DESIGN.md).
  display: "text-headline-2xl",
} as const;

/**
 * Eyebrow + title + optional italic description + optional actions, with the standard
 * spacing below it. Use `as="h1"` for the main title of a page.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  as: Heading = "h2",
  size = "default",
  align = "start",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  as?: "h1" | "h2";
  size?: keyof typeof titleSizes;
  align?: "start" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-space-xl flex flex-col gap-space-md md:flex-row md:items-end md:justify-between",
        centered && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("flex max-w-3xl flex-col gap-space-sm", centered && "items-center")}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Heading className={titleSizes[size]}>{title}</Heading>
        {description ? (
          <p className="text-headline-sm italic text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-space-md">{actions}</div> : null}
    </div>
  );
}
