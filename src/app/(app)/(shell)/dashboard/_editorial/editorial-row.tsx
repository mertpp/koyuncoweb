import { cn } from "cn";

import { BlockRenderer } from "./block-renderer";
import { COL_SPAN_CLASS, EDITORIAL_LAYOUTS } from "./layouts";
import type { EditorialRow as EditorialRowType } from "./types";

export function EditorialRow({ row }: { row: EditorialRowType }) {
  const layout = EDITORIAL_LAYOUTS[row.pattern];

  return (
    <section
      aria-label={row.id}
      className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-gutter px-margin-mobile md:px-margin-tablet lg:grid-cols-10 lg:px-margin"
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
