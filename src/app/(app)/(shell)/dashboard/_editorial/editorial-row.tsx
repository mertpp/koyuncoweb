import { cn } from "cn";

import { BlockRenderer } from "./block-renderer";
import { COL_SPAN_CLASS, EDITORIAL_LAYOUTS } from "./layouts";
import type { EditorialRow as EditorialRowType } from "./types";

export function EditorialRow({ row }: { row: EditorialRowType }) {
  const layout = EDITORIAL_LAYOUTS[row.pattern];

  return (
    <section
      aria-label={row.id}
      className="grid grid-cols-1 gap-gutter lg:grid-cols-10"
      data-editorial-pattern={row.pattern}
    >
      {row.placements.map((placement, index) => {
        const span = layout[index];

        if (!span) {
          return null;
        }

        return (
          <div
            key={placement.id}
            className={cn("min-w-0", COL_SPAN_CLASS[span])}
            data-cadence={placement.cadence}
            data-placement-id={placement.id}
            data-weight={placement.weight}
          >
            <BlockRenderer block={placement.block} />
          </div>
        );
      })}
    </section>
  );
}
