import { CloudDrizzle, MapPin, Thermometer } from "lucide-react";

import type { HeroBlock } from "../_editorial/types";

export function HeroEditorialBlock({ data }: { data: HeroBlock["data"] }) {
  return (
    <article className="relative min-h-[76svh] overflow-hidden rounded-3xl border border-border bg-surface-container-low shadow-sm">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/88 to-background/40 backdrop-blur-[2px] md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />

      <div className="relative z-10 grid min-h-[76svh] grid-cols-1 items-center gap-gutter p-space-lg md:p-space-xl lg:grid-cols-12">
        <div className="flex flex-col gap-space-md lg:col-span-7">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
            {data.eyebrow}
          </span>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.6} />
              {data.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Thermometer
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={1.6}
              />
              {data.temperature}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CloudDrizzle
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={1.6}
              />
              {data.condition}
            </span>
          </div>

          <div>
            <h2 className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.045em] text-on-surface md:text-7xl">
              {data.title}
            </h2>
            <p className="mt-space-sm max-w-2xl font-heading text-2xl italic leading-tight tracking-[-0.03em] text-on-surface/80 md:text-4xl">
              {data.subtitle}
            </p>
          </div>

          <p className="max-w-xl text-base leading-7 text-on-surface-variant md:text-lg">
            {data.body}
          </p>

          {data.ctaLabel && (
            <div>
              <button className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-md transition hover:opacity-90">
                {data.ctaLabel}
              </button>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-white/60 bg-surface/90 p-4 shadow-xl backdrop-blur-xl lg:col-span-5 lg:ml-auto lg:max-w-md">
          <div className="mb-4 border-b border-border pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
              Archival Selection
            </span>
            <h3 className="font-heading text-xl leading-tight text-on-surface">
              Recommended outfit for today.
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {data.outfit.map((item) => (
              <div
                key={`${item.layer}-${item.name}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-low"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-2 bottom-2 rounded-lg border border-border bg-surface/90 px-2 py-1 shadow-sm backdrop-blur-md">
                  <p className="flex justify-between gap-2 font-mono text-[9px] text-on-surface">
                    <span className="uppercase text-secondary">{item.layer}</span>
                    <span className="truncate font-medium">{item.name}</span>
                  </p>
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
