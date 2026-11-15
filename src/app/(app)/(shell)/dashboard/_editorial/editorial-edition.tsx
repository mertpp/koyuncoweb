import { HeroEditorialBlock } from "../_blocks/hero-block";
import { EditorialRow } from "./editorial-row";
import type { EditorialEdition as EditorialEditionType } from "./types";

export function EditorialEditionView({
  edition,
}: {
  edition: EditorialEditionType;
}) {
  return (
    <div className="w-full bg-background pb-32 text-on-surface">
      <HeroEditorialBlock edition={edition} />

      <div className="space-y-20 md:space-y-24">
        {edition.rows.map((row) => (
          <EditorialRow key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}
