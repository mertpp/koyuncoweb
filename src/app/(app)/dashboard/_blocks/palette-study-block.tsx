import { EditorialCard } from "../_editorial/editorial-card";
import type { PaletteStudyBlock } from "../_editorial/types";

export function PaletteStudyEditorialBlock({
  data,
}: {
  data: PaletteStudyBlock["data"];
}) {
  return (
    <EditorialCard eyebrow={data.eyebrow} title={data.title}>
      <div className="flex flex-1 flex-col justify-between gap-space-lg">
        <p className="text-sm leading-6 text-on-surface-variant">
          {data.description}
        </p>

        <div className="space-y-3">
          {data.colors.map((color) => (
            <div
              key={color.label}
              className="grid grid-cols-[3rem_1fr] items-center gap-3 rounded-xl border border-border bg-background p-3"
            >
              <div
                className="h-12 rounded-lg"
                style={{ backgroundColor: color.value }}
              />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
                  {color.label}
                </span>
                <p className="font-medium text-on-surface">{color.name}</p>
                {color.material && (
                  <p className="font-mono text-[10px] text-secondary">
                    {color.material}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorialCard>
  );
}
