import type { EditorialEdition } from "../_editorial/types";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuChkGxQycyE5T0OoJgAK8tzwT5gNyJ39YMgiwWfLAlLIPZHKG5CCB0h3CdkxbDw8VGCXMel4K_ze7WvrdCEjobmwy081qw_xbLwU7IVVGGAYcsUAtAadQjwJ4vkly5dJ2MjQQcERYg1G3qDwHlgFvg3Gdfip__JWDyEdWADfVIeziumnE-CTFWuGrlUGY4Pe77XVTLN-CvGbubxKhwnlhYWBhXUVelLYyZRtmfh2MI";

const collectionImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7x3zxRQ7Lo-LiHFErYmJuCNLmVswb0sKZVCXTiy-LaSvX3PWiZidAdUBodhht_dKI54mkeG91RA9sa1tdBFmYXX7MKVpZfiHC5dFzaIpdktPu2xhPmWlFfK3Ekbs8O_6qgiFwlH-59mSR8BY727_aR-blRS3FgEtVU-nArhFKvVlHN4VJqTqeJf7WK590NAv-EaORxUmLYk6gxl2dOllB0GblvJ9BmuKG4YeshI";

const outfitImages = {
  outerwear:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCcnIdWJna90LymlsmL8O8wG2lp2B8BXV6CRkhBuAlBPLPJ6wO9zZ6jGG0xdAHysfWuyCkQ6gIaZP75_hWCZPz8IB2OaUdjMnL0PAoWUeTJXaY4aG3IveXZ5oNws9pwOhpRL8AlTrFyO7whF-l9_soTRsJtYJEdCdnx0NSo90LkgQaEgAlUUP5N3FL2-QI62nWOp1W51xMBiuTAr8L-BDxKP9AIxFMBCeOKUcW5cyc",
  knitwear:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBwxPI3ztdediymz5Fg0YdXtV_9ipz3Wp2emXlGiit0fW5rVBjrPdxqTc7taOaUxPhaTbJM3Xc4I4gs_DT7dQ7kt6ttDsJpq7Hhzz4KAtZmqgqdd630vyWdGyhjujEmLuiHeUy9CjTvv_ALkv_m1WmTmZri-60OLC9UC7oEzVfLgy-ZWzacGFomHCLSe_EKgnXBbb9lKPllgpiunuwlKQxX4z64mw6szjMYtkF5VVw",
  trousers:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAu_Y_ejuOZ6P7EFVq1oZu_4JAI25CGbhjBVFPulUtyDylgTbV6PMnj0IwLTPIjhhRG5gF0NpPXebl3afod9m3KHwrSsmOPrQzVt4pyS6xxo7tq7rkoZY5ywZpxgBZsWvgEKhD-RlJ22jCRDWp0AYmQEdAuRlD8eHeAW8ytqM47U_x6Wtx5T5BXLTE4kR7mqzHGgJhdcceI7S8f1MgSmT86Ikid5sYKMO9PSJUe04Y",
  footwear:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB_mhmXzrrT5ZhcM9O_LXLa8cBibpIV_BtBCMl-J0LVXb9hvgH_cEwbiqKZlHrLNJ96tzofR7D6pj9rIZVeQj3_fLlG7bgCFjoqFalj6xZnKMSvRk0S63NVyVAWj1Lxf6qOVjhdoHJv38rHnfUVDUOJxNQKnz1NzV8hW1EVS0fBvhx1TOc69IvITlgpw077ZeutvCF6QyT7MtDOfR4yV8Fb0_DHmkDWv_ppKzsy5cE",
};

const heroOutfit = [
  {
    layer: "Outerwear",
    name: "Barbour Ashby",
    image: outfitImages.outerwear,
    alt: "Barbour Ashby waxed cotton jacket",
  },
  {
    layer: "Layer",
    name: "Shetland Crew",
    image: outfitImages.knitwear,
    alt: "Shetland wool knitwear",
  },
  {
    layer: "Trousers",
    name: "Grey Flannel",
    image: outfitImages.trousers,
    alt: "Grey wool flannel trousers",
  },
  {
    layer: "Footwear",
    name: "Grain Derby",
    image: outfitImages.footwear,
    alt: "Pebble grain derby boots",
  },
];

export const morningTextureEdition = {
  id: "2026-11-10-morning-texture",
  title: "Morning Texture",
  date: "10 Nov 2026",
  dek: "A wet Madrid morning edited through waxed cotton, brushed flannel and a restrained winter palette.",
  rows: [
    {
      id: "morning-texture-hero",
      pattern: "HERO",
      placements: [
        {
          id: "hero-madrid-light-rain",
          cadence: "daily",
          weight: "hero",
          block: {
            type: "hero",
            data: {
              eyebrow: "Daily wardrobe briefing",
              title: "Good morning, Mert.",
              subtitle: "Today your wardrobe is asking for texture.",
              body: "Waxed cotton, brushed flannel and soft merino are the most compatible surfaces for today's weather.",
              location: "Madrid",
              temperature: "14°C",
              condition: "Light rain",
              image: heroImage,
              ctaLabel: "Build today's outfit",
              outfit: heroOutfit,
            },
          },
        },
      ],
    },
    {
      id: "morning-texture-intelligence-pairing",
      pattern: "DUAL_EQUAL",
      placements: [
        {
          id: "observation-outerwear-dominance",
          cadence: "daily",
          weight: "feature",
          block: {
            type: "observation",
            data: {
              eyebrow: "Observation",
              title: "Outerwear is carrying the week",
              observation:
                "Your last four wears all began with weather-resistant outer layers.",
              evidence:
                "The archive is leaning on waxed cotton, dense wool and dark leather as the weather turns damp.",
              metric: "4 / 4 recent outfits include protective outerwear",
            },
          },
        },
        {
          id: "opportunity-grey-flannel-unlock",
          cadence: "weekly",
          weight: "feature",
          block: {
            type: "opportunity",
            data: {
              eyebrow: "Opportunity",
              title: "Unlock the quiet trouser",
              insight:
                "The grey flannel trouser is underused despite matching both the temperature and the current palette.",
              recommendation:
                "Anchor it with waxed cotton, a brushed Shetland layer and grain leather boots.",
              confidence: "92%",
            },
          },
        },
      ],
    },
    {
      id: "morning-texture-material-briefing",
      pattern: "QUOTE",
      placements: [
        {
          id: "material-briefing-natural-fibres",
          cadence: "seasonal",
          weight: "feature",
          block: {
            type: "materialBriefing",
            data: {
              eyebrow: "Material Briefing",
              title: "The day favours natural resistance",
              body: "Rain does not require technical clothing by default. Today's edit is built around breathable materials that improve with age and record use honestly.",
              materials: [
                {
                  name: "Waxed Cotton",
                  reason: "Water resistance with visible patina rather than synthetic shine.",
                },
                {
                  name: "Wool Flannel",
                  reason: "Warmth, drape and softness without overheating indoors.",
                },
                {
                  name: "Grain Leather",
                  reason: "Texture that tolerates wet pavements and repeated wear.",
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: "morning-texture-collection-palette",
      pattern: "FEATURE_LEFT",
      placements: [
        {
          id: "collection-british-heritage-winter",
          cadence: "weekly",
          weight: "feature",
          block: {
            type: "collectionSpotlight",
            data: {
              eyebrow: "Collection Spotlight",
              title: "British Heritage Winter",
              vault: "Devonshire Vault · 048 Items",
              description:
                "A collection built around natural fibres, weather resistance, understated tailoring and thornproof waxed canvas.",
              image: collectionImage,
              alt: "British heritage winter wardrobe collection",
              stats: [
                { label: "Established", value: "2010" },
                { label: "Garments", value: "48" },
                { label: "Core", value: "Wax · Wool" },
              ],
              actionLabel: "Explore archive",
            },
          },
        },
        {
          id: "palette-study-peat-cordovan-indigo",
          cadence: "seasonal",
          weight: "supporting",
          block: {
            type: "paletteStudy",
            data: {
              eyebrow: "Palette Study",
              title: "Peat, indigo, cordovan",
              description:
                "The current range is narrow by design: green-brown outerwear, dark denim, warm leather and undyed knitwear.",
              colors: [
                {
                  label: "HUE 01",
                  name: "Highland Peat",
                  value: "#2C3E2D",
                  material: "Barbour Wax #08",
                },
                {
                  label: "HUE 02",
                  name: "Natural Vicuña",
                  value: "#BF9B7A",
                  material: "Undyed Fleece",
                },
                {
                  label: "HUE 03",
                  name: "Tokushima Indigo",
                  value: "#2C3646",
                  material: "14oz Selvedge",
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: "morning-texture-outfits-signals",
      pattern: "TRIO",
      placements: [
        {
          id: "outfit-recommendations-rain-set",
          cadence: "daily",
          weight: "supporting",
          block: {
            type: "outfitRecommendations",
            data: {
              eyebrow: "Wear Today",
              title: "Three reliable anchors",
              body: "The recommendation engine is prioritising items that can handle rain, indoor warmth and long wear time.",
              items: [
                {
                  layer: "Outerwear",
                  name: "Barbour Ashby",
                  note: "Best weather match today.",
                  image: outfitImages.outerwear,
                  alt: "Barbour Ashby waxed cotton jacket",
                },
                {
                  layer: "Knitwear",
                  name: "Shetland Crew",
                  note: "Soft texture without bulk.",
                  image: outfitImages.knitwear,
                  alt: "Shetland wool knitwear",
                },
                {
                  layer: "Footwear",
                  name: "Grain Derby",
                  note: "High grip and patina tolerance.",
                  image: outfitImages.footwear,
                  alt: "Pebble grain derby boots",
                },
              ],
            },
          },
        },
        {
          id: "signal-rain-compatibility",
          cadence: "daily",
          weight: "minor",
          block: {
            type: "signal",
            data: {
              label: "Rain Match",
              value: "94%",
              delta: "+12 from yesterday",
              detail: "Outerwear and footwear are strongly aligned with forecast.",
            },
          },
        },
        {
          id: "signal-flannel-rotation",
          cadence: "weekly",
          weight: "minor",
          block: {
            type: "signal",
            data: {
              label: "Flannel Rotation",
              value: "Low",
              delta: "3 wears behind",
              detail: "A good moment to rebalance trousers away from denim.",
            },
          },
        },
      ],
    },
    {
      id: "morning-texture-closing-quote",
      pattern: "QUOTE",
      placements: [
        {
          id: "quote-preservation-before-novelty",
          cadence: "weekly",
          weight: "feature",
          block: {
            type: "quote",
            data: {
              context: "Archive Note",
              quote:
                "A wardrobe becomes intelligent when it remembers why each object was kept.",
              attribution: "KoyunCo Editorial Desk",
            },
          },
        },
      ],
    },
  ],
} satisfies EditorialEdition;

export const rainyCityEdition = {
  ...morningTextureEdition,
  id: "2026-11-11-rainy-city",
  title: "Rainy City",
  dek: "A tighter issue for errands, dark pavements and quiet technical restraint.",
} satisfies EditorialEdition;

export const heritageWeekEdition = {
  ...morningTextureEdition,
  id: "2026-11-12-heritage-week",
  title: "Heritage Week",
  dek: "A slower edition centred on provenance, wool, repair and recurring silhouettes.",
} satisfies EditorialEdition;
