import type { ReactNode } from "react";

import { CollectionSpotlightEditorialBlock } from "../_blocks/collection-spotlight-block";
import { HeroEditorialBlock } from "../_blocks/hero-block";
import { MaterialBriefingEditorialBlock } from "../_blocks/material-briefing-block";
import { ObservationEditorialBlock } from "../_blocks/observation-block";
import { OpportunityEditorialBlock } from "../_blocks/opportunity-block";
import { OutfitRecommendationsEditorialBlock } from "../_blocks/outfit-recommendations-block";
import { PaletteStudyEditorialBlock } from "../_blocks/palette-study-block";
import { QuoteEditorialBlock } from "../_blocks/quote-block";
import { SignalEditorialBlock } from "../_blocks/signal-block";
import type { Block } from "./types";

type BlockByType<T extends Block["type"]> = Extract<Block, { type: T }>;

type BlockRendererMap = {
  [K in Block["type"]]: (block: BlockByType<K>) => ReactNode;
};

const BLOCK_RENDERERS = {
  hero: (block) => <HeroEditorialBlock data={block.data} />,
  observation: (block) => <ObservationEditorialBlock data={block.data} />,
  opportunity: (block) => <OpportunityEditorialBlock data={block.data} />,
  collectionSpotlight: (block) => (
    <CollectionSpotlightEditorialBlock data={block.data} />
  ),
  quote: (block) => <QuoteEditorialBlock data={block.data} />,
  signal: (block) => <SignalEditorialBlock data={block.data} />,
  paletteStudy: (block) => <PaletteStudyEditorialBlock data={block.data} />,
  outfitRecommendations: (block) => (
    <OutfitRecommendationsEditorialBlock data={block.data} />
  ),
  materialBriefing: (block) => (
    <MaterialBriefingEditorialBlock data={block.data} />
  ),
} satisfies BlockRendererMap;

export function BlockRenderer({ block }: { block: Block }) {
  const render = BLOCK_RENDERERS[block.type] as unknown as (
    block: Block,
  ) => ReactNode;

  return render(block);
}
