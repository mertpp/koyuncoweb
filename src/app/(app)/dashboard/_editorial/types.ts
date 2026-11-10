export type EditorialCadence = "daily" | "weekly" | "seasonal";

export type BlockWeight = "hero" | "feature" | "supporting" | "minor";

export type EditorialPattern =
  | "HERO"
  | "DUAL_EQUAL"
  | "FEATURE_LEFT"
  | "FEATURE_RIGHT"
  | "TRIO"
  | "SIGNALS"
  | "QUOTE";

export type HeroBlock = {
  type: "hero";
  data: {
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    location: string;
    temperature: string;
    condition: string;
    image: string;
    ctaLabel?: string;
    outfit: Array<{
      layer: string;
      name: string;
      image: string;
      alt: string;
    }>;
  };
};

export type ObservationBlock = {
  type: "observation";
  data: {
    eyebrow: string;
    title: string;
    observation: string;
    evidence?: string;
    metric?: string;
  };
};

export type OpportunityBlock = {
  type: "opportunity";
  data: {
    eyebrow: string;
    title: string;
    insight: string;
    recommendation: string;
    confidence?: string;
  };
};

export type CollectionSpotlightBlock = {
  type: "collectionSpotlight";
  data: {
    eyebrow: string;
    title: string;
    vault: string;
    description: string;
    image: string;
    alt: string;
    stats: Array<{
      label: string;
      value: string;
    }>;
    actionLabel?: string;
  };
};

export type QuoteBlock = {
  type: "quote";
  data: {
    quote: string;
    attribution?: string;
    context?: string;
  };
};

export type SignalBlock = {
  type: "signal";
  data: {
    label: string;
    value: string;
    delta?: string;
    detail?: string;
  };
};

export type PaletteStudyBlock = {
  type: "paletteStudy";
  data: {
    eyebrow: string;
    title: string;
    description: string;
    colors: Array<{
      label: string;
      name: string;
      value: string;
      material?: string;
    }>;
  };
};

export type OutfitRecommendationsBlock = {
  type: "outfitRecommendations";
  data: {
    eyebrow: string;
    title: string;
    body: string;
    items: Array<{
      layer: string;
      name: string;
      note: string;
      image: string;
      alt: string;
    }>;
  };
};

export type MaterialBriefingBlock = {
  type: "materialBriefing";
  data: {
    eyebrow: string;
    title: string;
    body: string;
    materials: Array<{
      name: string;
      reason: string;
    }>;
  };
};

export type Block =
  | HeroBlock
  | ObservationBlock
  | OpportunityBlock
  | CollectionSpotlightBlock
  | QuoteBlock
  | SignalBlock
  | PaletteStudyBlock
  | OutfitRecommendationsBlock
  | MaterialBriefingBlock;

export type EditorialPlacement = {
  id: string;
  cadence: EditorialCadence;
  weight: BlockWeight;
  block: Block;
};

export type EditorialRow = {
  id: string;
  pattern: EditorialPattern;
  placements: EditorialPlacement[];
};

export type EditorialEdition = {
  id: string;
  title: string;
  date: string;
  dek?: string;
  rows: EditorialRow[];
};
