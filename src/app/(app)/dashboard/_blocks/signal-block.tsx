import { EditorialCard } from "../_editorial/editorial-card";
import type { SignalBlock } from "../_editorial/types";

export function SignalEditorialBlock({ data }: { data: SignalBlock["data"] }) {
  return (
    <EditorialCard className="min-h-48">
      <div className="flex h-full flex-col justify-between gap-space-lg">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
          {data.label}
        </span>
        <div>
          <p className="font-heading text-4xl leading-none tracking-[-0.04em] text-on-surface">
            {data.value}
          </p>
          {data.delta && (
            <p className="mt-space-xs font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
              {data.delta}
            </p>
          )}
        </div>
        {data.detail && (
          <p className="text-xs leading-5 text-on-surface-variant">{data.detail}</p>
        )}
      </div>
    </EditorialCard>
  );
}
