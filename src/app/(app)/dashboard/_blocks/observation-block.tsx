import { EditorialCard } from "../_editorial/editorial-card";
import type { ObservationBlock } from "../_editorial/types";

export function ObservationEditorialBlock({
  data,
}: {
  data: ObservationBlock["data"];
}) {
  return (
    <EditorialCard eyebrow={data.eyebrow} title={data.title}>
      <div className="flex flex-1 flex-col justify-between gap-space-lg">
        <p className="font-heading text-3xl italic leading-tight tracking-[-0.03em] text-on-surface md:text-4xl">
          “{data.observation}”
        </p>
        <div className="space-y-space-md">
          {data.evidence && (
            <p className="text-sm leading-6 text-on-surface-variant">
              {data.evidence}
            </p>
          )}
          {data.metric && (
            <div className="rounded-xl border border-border bg-background p-space-md font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
              {data.metric}
            </div>
          )}
        </div>
      </div>
    </EditorialCard>
  );
}
