import { EditorialCard } from "../_editorial/editorial-card";
import type { QuoteBlock } from "../_editorial/types";

export function QuoteEditorialBlock({ data }: { data: QuoteBlock["data"] }) {
  return (
    <EditorialCard className="bg-primary text-primary-foreground">
      <figure className="mx-auto flex max-w-5xl flex-col items-center py-10 text-center md:py-16">
        {data.context && (
          <figcaption className="mb-space-md font-mono text-[10px] uppercase tracking-[0.24em] opacity-70">
            {data.context}
          </figcaption>
        )}
        <blockquote className="font-heading text-4xl italic leading-tight tracking-[-0.04em] md:text-6xl">
          “{data.quote}”
        </blockquote>
        {data.attribution && (
          <figcaption className="mt-space-lg font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
            {data.attribution}
          </figcaption>
        )}
      </figure>
    </EditorialCard>
  );
}
