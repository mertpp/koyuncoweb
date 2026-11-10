import { EditorialCard } from "../_editorial/editorial-card";
import type { CollectionSpotlightBlock } from "../_editorial/types";

export function CollectionSpotlightEditorialBlock({
  data,
}: {
  data: CollectionSpotlightBlock["data"];
}) {
  return (
    <EditorialCard className="p-0">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-12">
        <div className="relative min-h-80 overflow-hidden bg-surface-container lg:col-span-7">
          <img src={data.image} alt={data.alt} className="size-full object-cover" />
          <div className="absolute left-4 top-4 rounded-full border border-border bg-background/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-secondary backdrop-blur">
            {data.eyebrow}
          </div>
        </div>

        <div className="flex flex-col justify-center p-space-lg lg:col-span-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
            {data.vault}
          </span>
          <h2 className="mt-space-xs font-heading text-4xl leading-none tracking-[-0.04em] text-on-surface md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-space-md text-sm leading-6 text-on-surface-variant">
            {data.description}
          </p>

          <div className="mt-space-lg grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-background font-mono text-[10px]">
            {data.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={index === 1 ? "border-x border-border p-3" : "p-3"}
              >
                <span className="block uppercase tracking-[0.14em] text-secondary">
                  {stat.label}
                </span>
                <strong className="mt-1 block text-on-surface">{stat.value}</strong>
              </div>
            ))}
          </div>

          {data.actionLabel && (
            <span className="mt-space-lg font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
              {data.actionLabel} →
            </span>
          )}
        </div>
      </div>
    </EditorialCard>
  );
}
