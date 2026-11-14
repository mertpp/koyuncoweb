import { EditorialCard } from "../_editorial/editorial-card";
import type { OpportunityBlock } from "../_editorial/types";

export function OpportunityEditorialBlock({
  data,
}: {
  data: OpportunityBlock["data"];
}) {
  return (
    <EditorialCard
      eyebrow={data.eyebrow}
      title={data.title}
      footer={
        <div className="flex items-center justify-between gap-space-md font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
          <span>Recommendation</span>
          {data.confidence && <span>Confidence {data.confidence}</span>}
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-between gap-space-lg">
        <p className="text-base leading-7 text-on-surface-variant">
          {data.insight}
        </p>
        <div className="rounded-2xl bg-primary p-space-lg text-primary-foreground">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
            Wear next
          </span>
          <p className="mt-space-xs font-heading text-3xl leading-tight tracking-[-0.03em]">
            {data.recommendation}
          </p>
        </div>
      </div>
    </EditorialCard>
  );
}
