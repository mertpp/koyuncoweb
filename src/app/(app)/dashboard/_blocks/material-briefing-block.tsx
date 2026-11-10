import { EditorialCard } from "../_editorial/editorial-card";
import type { MaterialBriefingBlock } from "../_editorial/types";

export function MaterialBriefingEditorialBlock({
  data,
}: {
  data: MaterialBriefingBlock["data"];
}) {
  return (
    <EditorialCard eyebrow={data.eyebrow} title={data.title}>
      <div className="grid flex-1 grid-cols-1 gap-space-lg md:grid-cols-[1fr_1.2fr] md:items-end">
        <p className="text-base leading-7 text-on-surface-variant">{data.body}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {data.materials.map((material) => (
            <div
              key={material.name}
              className="rounded-xl border border-border bg-background p-space-md"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">
                {material.name}
              </span>
              <p className="mt-space-sm text-sm leading-6 text-on-surface-variant">
                {material.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </EditorialCard>
  );
}
