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

const editionOutfit = [
  {
    layer: "Outerwear",
    name: "Waxed Ashby",
    image: outfitImages.outerwear,
    alt: "Waxed cotton field jacket",
  },
  {
    layer: "Knitwear",
    name: "Shetland Crew",
    image: outfitImages.knitwear,
    alt: "Shetland wool crew neck knitwear",
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

export const thornproofRegisterEdition = {
  id: "2026-11-14-thornproof-register",
  title: "The Thornproof Register",
  date: "14 Nov 2026",
  dek: "A British heritage edit for low clouds, wet stone and clothes that improve by refusing novelty.",
  body: "Today favours the old intelligence of waxed cotton, Shetland wool, flannel and grain leather: materials that manage weather quietly and record use beautifully.",
  location: "London",
  temperature: "9°C",
  condition: "Cold drizzle",
  image: heroImage,
  ctaLabel: "Assemble the register",
  outfit: editionOutfit,
  rows: [
    {
      id: "thornproof-register-intelligence-pairing",
      pattern: "DUAL_EQUAL",
      placements: [
        {
          id: "observation-waxed-cotton-axis",
          cadence: "daily",
          weight: "feature",
          block: {
            type: "observation",
            data: {
              eyebrow: "Observation",
              title: "Waxed cotton is the axis",
              observation:
                "The archive performs best when the outer layer sets the tone before colour or silhouette does.",
              evidence:
                "Your strongest wet-weather combinations start with a waxed shell, then let wool and leather provide warmth, tactility and structure.",
              metric: "87% of rain-ready looks begin with waxed outerwear",
            },
          },
        },
        {
          id: "opportunity-flannel-replaces-denim",
          cadence: "weekly",
          weight: "feature",
          block: {
            type: "opportunity",
            data: {
              eyebrow: "Opportunity",
              title: "Let flannel replace denim",
              insight:
                "Grey flannel gives the heritage palette a quieter, more architectural base than dark denim today.",
              recommendation:
                "Pair it with olive waxed cotton, undyed Shetland wool and pebble grain derbies for a softer city-country balance.",
              confidence: "91%",
            },
          },
        },
      ],
    },
    {
      id: "thornproof-register-material-briefing",
      pattern: "QUOTE",
      placements: [
        {
          id: "material-briefing-patina-logic",
          cadence: "seasonal",
          weight: "feature",
          block: {
            type: "materialBriefing",
            data: {
              eyebrow: "Material Briefing",
              title: "Patina is the operating system",
              body: "The best British field clothes are not pristine objects. They are weather instruments: wax darkens, wool relaxes, leather marks, and the outfit becomes more specific with each wear.",
              materials: [
                {
                  name: "Thornproof Wax",
                  reason:
                    "Resists drizzle while gaining creases, shade and evidence of use.",
                },
                {
                  name: "Shetland Wool",
                  reason:
                    "Warmth and texture without the polished finish of worsted knitwear.",
                },
                {
                  name: "Pebble Grain Leather",
                  reason:
                    "A formal shape with enough surface to tolerate wet pavements.",
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: "thornproof-register-collection-palette",
      pattern: "FEATURE_LEFT",
      placements: [
        {
          id: "collection-country-house-utility",
          cadence: "weekly",
          weight: "feature",
          block: {
            type: "collectionSpotlight",
            data: {
              eyebrow: "Collection Spotlight",
              title: "Country House Utility",
              vault: "Northumberland Vault · 052 Items",
              description:
                "A focused register of waxed jackets, brushed wool, cavalry twill, flannel and boots designed to cross wet pavements without looking technical.",
              image: collectionImage,
              alt: "British heritage wardrobe collection",
              stats: [
                { label: "Core", value: "Wax · Wool" },
                { label: "Items", value: "52" },
                { label: "Mood", value: "Field Formal" },
              ],
              actionLabel: "Open the vault",
            },
          },
        },
        {
          id: "palette-study-olive-taupe-oxblood",
          cadence: "seasonal",
          weight: "supporting",
          block: {
            type: "paletteStudy",
            data: {
              eyebrow: "Palette Study",
              title: "Olive, taupe, oxblood",
              description:
                "A restrained British register: muted greens, grey wool, weathered tan and dark red-brown leather.",
              colors: [
                {
                  label: "HUE 01",
                  name: "Barbour Olive",
                  value: "#34412F",
                  material: "Thornproof Wax",
                },
                {
                  label: "HUE 02",
                  name: "Flannel Grey",
                  value: "#8C8982",
                  material: "Brushed Wool",
                },
                {
                  label: "HUE 03",
                  name: "Oxblood Grain",
                  value: "#4A2422",
                  material: "Derby Leather",
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: "thornproof-register-outfits-signals",
      pattern: "TRIO",
      placements: [
        {
          id: "outfit-recommendations-field-formal",
          cadence: "daily",
          weight: "supporting",
          block: {
            type: "outfitRecommendations",
            data: {
              eyebrow: "Wear Today",
              title: "Field formal anchors",
              body: "The strongest set keeps the silhouette urban but lets the materials do the weather work.",
              items: [
                {
                  layer: "Outerwear",
                  name: "Waxed Ashby",
                  note: "The correct first layer for drizzle and wind.",
                  image: outfitImages.outerwear,
                  alt: "Waxed cotton field jacket",
                },
                {
                  layer: "Knitwear",
                  name: "Shetland Crew",
                  note: "Adds warmth without flattening the palette.",
                  image: outfitImages.knitwear,
                  alt: "Shetland wool knitwear",
                },
                {
                  layer: "Footwear",
                  name: "Grain Derby",
                  note: "Keeps the outfit grounded and city-appropriate.",
                  image: outfitImages.footwear,
                  alt: "Pebble grain derby boots",
                },
              ],
            },
          },
        },
        {
          id: "signal-patina-index",
          cadence: "weekly",
          weight: "minor",
          block: {
            type: "signal",
            data: {
              label: "Patina Index",
              value: "High",
              delta: "+18 this month",
              detail:
                "Waxed cotton and grain leather are accumulating visible character quickly.",
            },
          },
        },
        {
          id: "signal-heritage-coherence",
          cadence: "seasonal",
          weight: "minor",
          block: {
            type: "signal",
            data: {
              label: "Heritage Coherence",
              value: "96%",
              delta: "Stable palette",
              detail:
                "Olive, grey, tan and oxblood are carrying the season without repetition fatigue.",
            },
          },
        },
      ],
    },
    {
      id: "thornproof-register-closing-quote",
      pattern: "QUOTE",
      placements: [
        {
          id: "quote-old-clothes-weather-better",
          cadence: "weekly",
          weight: "feature",
          block: {
            type: "quote",
            data: {
              context: "Archive Note",
              quote:
                "The most useful clothes are rarely the newest; they are the ones that have learned the weather with you.",
              attribution: "KoyunCo Editorial Desk",
            },
          },
        },
      ],
    },
  ],
} satisfies EditorialEdition;
