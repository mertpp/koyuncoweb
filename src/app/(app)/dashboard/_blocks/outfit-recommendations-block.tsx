import { EditorialCard } from "../_editorial/editorial-card";
import type { OutfitRecommendationsBlock } from "../_editorial/types";

export function OutfitRecommendationsEditorialBlock({
  data,
}: {
  data: OutfitRecommendationsBlock["data"];
}) {
  return (
    <EditorialCard eyebrow={data.eyebrow} title={data.title}>
      <div className="flex flex-1 flex-col gap-space-lg">
        <p className="text-sm leading-6 text-on-surface-variant">{data.body}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {data.items.map((item) => (
            <div
              key={`${item.layer}-${item.name}`}
              className="overflow-hidden rounded-xl border border-border bg-background"
            >
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
                <img src={item.image} alt={item.alt} className="size-full object-cover" />
              </div>
              <div className="p-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
                  {item.layer}
                </span>
                <p className="font-medium text-on-surface">{item.name}</p>
                <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorialCard>
  );
}
