import { CloudDrizzle, MapPin, Thermometer } from "lucide-react";

import type { EditorialEdition } from "../_editorial/types";

export function HeroEditorialBlock({ edition }: { edition: EditorialEdition }) {
  return (
    <section className="mx-auto w-full max-w-360 px-margin-mobile md:px-margin-tablet lg:px-margin">
      <article className="relative flex min-h-[92svh] items-center">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-surface-container-low md:w-[calc(100vw-var(--sidebar-width-icon))]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${edition.image})` }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/85 to-background/45 backdrop-blur-[2px] md:to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/30" />
        </div>

        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-gutter py-16 md:py-20 lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <MapPin
                  aria-hidden="true"
                  className="size-3.5"
                  strokeWidth={1.6}
                />
                {edition.location}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
                {edition.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Thermometer
                  aria-hidden="true"
                  className="size-3.5"
                  strokeWidth={1.6}
                />
                {edition.temperature}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CloudDrizzle
                  aria-hidden="true"
                  className="size-3.5"
                  strokeWidth={1.6}
                />
                {edition.condition}
              </span>
            </div>

            <div>
              <h1 className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.045em] text-on-surface md:text-7xl">
                {edition.title}
              </h1>
              {edition.dek && (
                <p className="mt-space-sm max-w-2xl font-heading text-2xl italic leading-tight tracking-[-0.03em] text-on-surface/80 md:text-4xl">
                  {edition.dek}
                </p>
              )}
            </div>

            {edition.body && (
              <p className="max-w-xl text-base leading-7 text-on-surface-variant md:text-lg">
                {edition.body}
              </p>
            )}

            {edition.ctaLabel && (
              <div>
                <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-md transition hover:opacity-90">
                  {edition.ctaLabel}
                </button>
              </div>
            )}
          </div>

          <aside className="w-full min-w-0 max-w-md rounded-md border border-white/60 bg-background/90 p-4 shadow-xl backdrop-blur-xl sm:p-5 lg:col-span-5 lg:ml-auto">
            <div className="mb-4 border-b border-border pb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
                Archival Selection
              </span>
              <h2 className="font-heading text-xl leading-tight text-on-surface">
                Recommended outfit for today.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {edition.outfit.map((item) => (
                <div
                  key={`${item.layer}-${item.name}`}
                  className="group relative aspect-4/5 overflow-hidden rounded-md bg-surface-container-low"
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-2 bottom-2 rounded border border-border bg-surface/90 px-2 py-1 shadow-sm backdrop-blur-md">
                    <p className="flex justify-between gap-2 font-mono text-[9px] text-on-surface">
                      <span className="uppercase text-secondary">
                        {item.layer}
                      </span>
                      <span className="truncate font-medium">{item.name}</span>
                    </p>
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </article>
    </section>
  );
}
