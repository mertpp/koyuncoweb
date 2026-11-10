import { EditorialRow } from "./editorial-row";
import type { EditorialEdition as EditorialEditionType } from "./types";

export function EditorialEditionView({
  edition,
}: {
  edition: EditorialEditionType;
}) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-margin-mobile pb-24 pt-8 md:px-margin-tablet lg:px-margin">
      <header className="mb-space-lg flex flex-col justify-between gap-space-md border-b border-border pb-space-lg md:flex-row md:items-end">
        <div className="max-w-3xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
            Koyun Daily Edition · {edition.date}
          </span>
          <h1 className="mt-space-xs font-heading text-4xl leading-none tracking-[-0.04em] text-on-surface md:text-6xl">
            {edition.title}
          </h1>
          {edition.dek && (
            <p className="mt-space-sm max-w-2xl text-base leading-7 text-on-surface-variant md:text-lg">
              {edition.dek}
            </p>
          )}
        </div>
        <div className="rounded-full border border-border bg-surface-container-lowest px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">
          {edition.rows.length} editorial rows
        </div>
      </header>

      <div className="space-y-gutter">
        {edition.rows.map((row) => (
          <EditorialRow key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}
