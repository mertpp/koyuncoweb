import { cn } from "cn";
import type { ReactNode } from "react";

export function EditorialCard({
  eyebrow,
  title,
  children,
  className,
  footer,
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-container-lowest shadow-sm",
        className,
      )}
    >
      {(eyebrow || title) && (
        <header className="border-b border-border px-space-lg py-space-md">
          {eyebrow && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-secondary">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="mt-1 font-heading text-2xl leading-tight tracking-[-0.02em] text-on-surface md:text-3xl">
              {title}
            </h2>
          )}
        </header>
      )}
      <div className="flex flex-1 flex-col p-space-lg">{children}</div>
      {footer && (
        <footer className="border-t border-border px-space-lg py-space-md">
          {footer}
        </footer>
      )}
    </article>
  );
}
