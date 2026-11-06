import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DEFAULT_AUTHENTICATED_PATH } from "@/shared/auth/constants";
import { getCurrentUser } from "@/shared/auth/server";

import { CloudDrizzle, Layers3, Shirt } from "lucide-react";
import { LandingAuthButton } from "../../components/layout/landing-auth-button";

export const instant = false;

export const metadata: Metadata = {
  title: "KoyunCo — Personal Wardrobe Archive",
  description:
    "A private archive for provenance, maintenance history and wardrobe intelligence.",
};

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuChkGxQycyE5T0OoJgAK8tzwT5gNyJ39YMgiwWfLAlLIPZHKG5CCB0h3CdkxbDw8VGCXMel4K_ze7WvrdCEjobmwy081qw_xbLwU7IVVGGAYcsUAtAadQjwJ4vkly5dJ2MjQQcERYg1G3qDwHlgFvg3Gdfip__JWDyEdWADfVIeziumnE-CTFWuGrlUGY4Pe77XVTLN-CvGbubxKhwnlhYWBhXUVelLYyZRtmfh2MI";
const specimenImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAkFUB7jLqep_5UvGKaseakgBLCcyFrlm4q13Efm6Y_gplde7t4jPD0clms_g8iXMJxKe1-sjsWL0W8vsNk4pqfVTrC7UldPzoK61u-lvTKDhRkK9wXRCHWTkFXiaTjOZ52_WUVN8uf59fSBVBa0xz1w-9cpwSl6G7KSVk3lO7IKwP_tQz8p9m0VkzEYly2756M6O5jsl1SAQAvyFxrzgxmvkc9mfqVOwClKeHQ0e4";

const thesis = [
  [
    "PROVENANCE",
    "Memory & Provenance",
    "Record acquisitions, alterations, repairs and ownership history so every garment retains its context.",
  ],
  [
    "HARMONY",
    "Wardrobe Intelligence",
    "Learn from what you actually wear. Koyun transforms ownership history into practical wardrobe insight.",
  ],
  [
    "SOVEREIGNTY",
    "Private Ownership",
    "A sealed personal vault with zero advertisement tracking and self-custodied wardrobe history.",
  ],
] as const;

const wardrobes = [
  [
    "British Heritage Winter",
    "Devonshire Vault · 048 Items",
    "14 Years Cataloged",
    "Curated country tailoring, Thornproof waxed cotton, estate Harris tweed and heavy Shetland knitwear.",
    "#Levis #Charhartt #Zara",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7x3zxRQ7Lo-LiHFErYmJuCNLmVswb0sKZVCXTiy-LaSvX3PWiZidAdUBodhht_dKI54mkeG91RA9sa1tdBFmYXX7MKVpZfiHC5dFzaIpdktPu2xhPmWlFfK3Ekbs8O_6qgiFwlH-59mSR8BY727_aR-blRS3FgEtVU-nArhFKvVlHN4VJqTqeJf7WK590NAv-EaORxUmLYk6gxl2dOllB0GblvJ9BmuKG4YeshI",
  ],
  [
    "Architect in Copenhagen",
    "Copenhagen Vault · 036 Items",
    "9 Years Cataloged",
    "Monochromatic architectural cuts, double-bonded technical wool and high-gauge merino base layers.",
    "#Burberry #Acronym #Camoshita",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD7a8FGSdF1R0xrh1EdEo6OVvjcvGA7HuQswwXpk3UXX0KflQlzaLvdKvSxQseRndnK7illy7Pp1MyzRhsZzhgPt6KrcLuuAb81K5n28jLK1jZVp4q-TvaXe8nXMd9ssJQRJEig2nnqRvKr5IVdMKG4z42pljS3WndfPObBi54sDuYOdNZn9ulEuPBkfUkKjy4zZU_ZVxrO806cN6NHOrnw0IVuu492ySmhd2tfAes",
  ],
  [
    "Madrid Minimalist",
    "Salamanca Vault · 029 Items",
    "7 Years Cataloged",
    "Spanish bespoke tailoring, crisp Italian poplin, summer cashmere and raw Irish flax linen.",
    "#Hackett #Barbour #Camoshita",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBwJ06iDw3-4ldDM_s699bVwtZIR0k1D05BI_GOqzFmJ1UiyzAwWXlWBqTnq1VwGqCS5rVJfEEPZss362cx82EOvH4mddBs5n6ItHRXm6XuQlGiC07E7yQarb3ZP7iV0-pPQWq9t_Q0W0thW4VQ1pEmXJ5Vm5GMl5V4xKLns5wObMGcdsPdRC7MAg0n5eo0E8VqeP1upoJ6Gr5fYsLTcEwp4K9-P-gNMqHfgREXnPM",
  ],
  [
    "Japanese Denim & Craft",
    "Kojima Vault · 052 Items",
    "11 Years Cataloged",
    "Kuroki shuttle loom selvedge, indigo dip phases, Wakayama cottons and brass patina.",
    "#OrSlow #Kapital #Warehouse",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAlDC7W_oEeclRpDN3CZ_H2ES4-V7X-_uJy1qqDtueWPcAVHmbWAuLHc61D6ptZIEEopyIytQjEAg5wBAkHdRD39i2WrAMk42Z9k9BYbBnmT1OUOlccEgBD61NDc9X-VItGuNz5hyF4BGxzuQAWOZK4VsYuBvi3IqGZMgKjXbi8r55d8kgTctnv0OwRb-xZTAX1Whb7NRqDAEgl8dYPwEVIs3x8cwDF1yrXg-wFroQ",
  ],
] as const;

const intelligence = [
  [
    "CATEGORY SATURATION",
    "You own seven navy garments serving the same purpose.",
    "Recommendation: Pause new purchases in this category.",
  ],
  [
    "SEASONAL COVERAGE",
    "Your wardrobe is already well equipped for winter conditions.",
    "Observation:Additional outerwear may not offer practical benefit.",
  ],
  [
    "COLLECTION BALANCE",
    "Most recent acquisitions continue a long-standing preference for soft tailoring and neutral palettes.",
    "Observation: Style direction unchanged over three years.",
  ],
  [
    "MISSING COMBINATIONS",
    "Three tailored trousers are underutilized due to missing shoe pairing.",
    "Recommendation: A compatible footwear would unlock  additional combinations.",
  ],
] as const;

function normalizeNextPath(next: string | string[] | undefined) {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//")
  ) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  return next;
}

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const user = await getCurrentUser();

  if (user) {
    redirect(DEFAULT_AUTHENTICATED_PATH);
  }

  const params = await searchParams;
  const nextPath = normalizeNextPath(params.next);

  return (
    <main className="min-h-svh bg-background text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
      <Header nextPath={nextPath} />
      <Hero nextPath={nextPath} />
      <WardrobeOfWeek />
      <PublicWardrobes />
      <Thesis />
      <InterfacePreview />
      <Intelligence />
      <Manifesto />
      <FinalCta nextPath={nextPath} />
      <Footer />
    </main>
  );
}

function Header({ nextPath }: { nextPath: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 shadow-[0_1px_8px_rgba(28,30,29,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex items-center gap-space-lg">
          <a
            className="group flex items-baseline gap-space-sm"
            href="#manifesto"
          >
            <span className="font-heading text-2xl tracking-tight text-on-surface group-hover:text-primary">
              Koyun
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-on-surface-variant/70 sm:inline">
              Archival Protocol
            </span>
          </a>
          <nav className="hidden items-center gap-space-lg lg:flex">
            <a
              className="border-b border-primary pb-0.5 text-sm font-medium"
              href="#manifesto"
            >
              Manifesto
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-on-surface"
              href="#public-wardrobes"
            >
              Public Wardrobes
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-on-surface"
              href="#intelligence"
            >
              Wardrobe Intelligence
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-on-surface"
              href="#protocol"
            >
              Protocol
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-space-md">
          <LandingAuthButton
            nextPath={nextPath}
            className="px-space-md py-2.5"
          />
        </div>
      </div>
    </header>
  );
}

function Hero({ nextPath }: { nextPath: string }) {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden bg-surface-container-low pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/45 backdrop-blur-[2px] md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-margin-mobile pb-20 pt-32 md:px-margin-tablet lg:px-margin">
        <div className="grid grid-cols-1 items-center gap-gutter lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-7">
            <div className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary-container" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
                Personal Wardrobe Archive · Vault Protocol
              </span>
            </div>
            <h1 className="max-w-2xl font-heading text-3xl leading-none tracking-[-0.03em] text-on-surface md:text-5xl">
              Some people collect clothes.
            </h1>
            <h1 className="max-w-2xl font-heading text-3xl italic leading-none tracking-[-0.03em] text-on-surface md:text-5xl">
              Others preserve them.
            </h1>
            <p className="max-w-xl text-base leading-7 text-on-surface-variant md:text-md">
              Koyun. Personal wardrobe archive.
            </p>
            <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
              <LandingAuthButton
                nextPath={nextPath}
                className="bg-neutral-800 px-5 py-3"
              />
              <a
                className="px-1 py-2 text-sm font-medium text-on-surface underline decoration-outline-variant underline-offset-4 hover:text-primary"
                href="#public-wardrobes"
              >
                Explore Public Wardrobes →
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-space-lg pt-space-lg font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
              <span>✓ Secure sign-in powered by Microsoft</span>
              <span>✓ Encrypted Data Storage</span>
            </div>
          </div>
          <article className="w-full min-w-0 max-w-md rounded-md border border-white/60 bg-background/95 p-4 shadow-xl backdrop-blur-xl sm:p-5 lg:col-span-5 lg:ml-auto">
            <div className="relative mb-4 h-56 overflow-hidden rounded-md bg-surface-container-high">
              <img
                className="size-full object-cover"
                src={specimenImage}
                alt="Ashby Wax Jacket"
              />

              <span className="absolute left-3 top-3 rounded border border-white/70 bg-background/90 px-3 py-1 backdrop-blur-md">
                <p className="font-mono text-[10px] text-on-surface">
                  British Heritage Winter
                </p>
              </span>
            </div>

            <h2 className="font-heading text-2xl leading-tight tracking-[-0.03em] text-on-surface">
              Ashby Wax Jacket
            </h2>

            <p className="mt-1 text-sm">
              Recommended for tomorrow&apos;s weather.
            </p>

            <div className="my-4" />

            <dl className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2.5 text-xs uppercase tracking-[0.08em] text-on-surface">
                  <Shirt
                    aria-hidden="true"
                    className="size-4 shrink-0 text-secondary"
                    strokeWidth={1.4}
                  />
                  Compatible
                </dt>
                <dd className="text-right text-sm text-on-surface">
                  12 garments
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2.5 text-xs uppercase tracking-[0.08em] text-on-surface">
                  <Layers3
                    aria-hidden="true"
                    className="size-4 shrink-0 text-secondary"
                    strokeWidth={1.4}
                  />
                  Outfits
                </dt>
                <dd className="text-right text-sm text-on-surface">
                  18 combinations
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2.5 text-xs uppercase tracking-[0.08em] text-on-surface">
                  <CloudDrizzle
                    aria-hidden="true"
                    className="size-4 shrink-0 text-secondary"
                    strokeWidth={1.4}
                  />
                  Weather
                </dt>
                <dd className="text-right text-sm text-on-surface">
                  8°C · Light rain
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}

function WardrobeOfWeek() {
  const [title, vault, years, body, combos, image] = wardrobes[0];

  return (
    <section className="">
      <div className="mx-auto max-w-[1440px] px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="mb-space-lg flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div>
            <span className="mb-space-xs block font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
              From The Koyun Archive
            </span>
            <h2 className="font-heading text-4xl leading-none tracking-[-0.03em] text-on-surface md:text-5xl">
              Collection of the Week
            </h2>
            <p className="mt-space-sm font-heading text-xl italic text-secondary">
              A privately curated collection from the Koyun archive.
            </p>
          </div>
        </div>

        <article className="grid overflow-hidden rounded-md border border-border bg-surface-container-lowest p-space-md shadow-[0_10px_24px_rgba(28,30,29,0.10)] lg:grid-cols-12 lg:gap-space-lg lg:p-space-lg">
          <div className="relative h-72 overflow-hidden rounded-md bg-surface-container lg:col-span-7 lg:h-[320px]">
            <img
              className="size-full object-cover transition duration-700 hover:scale-[1.02]"
              src={image}
              alt={`${title} archival collection spotlight`}
            />
            <div className="absolute left-4 top-4 rounded bg-background/90 px-3 py-1 font-mono text-[10px] text-on-surface shadow-sm backdrop-blur-md">
              Thornproof Waxed Canvas
            </div>
          </div>

          <div className="flex flex-col justify-center py-space-lg lg:col-span-5 lg:py-0">
            <div className="mb-space-sm flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
              <span>{vault.split(" · ")[0]}</span>
            </div>
            <h3 className="font-heading text-3xl leading-tight tracking-[-0.03em] text-on-surface md:text-4xl">
              {title}
            </h3>
            <p className="mt-space-md max-w-xl text-sm leading-6 text-on-surface-variant">
              A collection built around natural fibres, weather resistance,
              understated tailoring of thornproof waxed canvas and Scottish
              border tweeds.
            </p>

            <div className="mt-space-md grid grid-cols-3 overflow-hidden rounded-md border border-border bg-background font-mono text-[10px]">
              <div className="p-space-sm text-center">
                <span className="block text-secondary">Established</span>
                <strong className="text-on-surface">2010</strong>
              </div>
              <div className="border-x border-border p-space-sm text-center">
                <span className="block text-secondary">Garments</span>
                <strong className="text-on-surface">48 Items</strong>
              </div>
              <div className="p-space-sm text-center">
                <span className="block text-secondary">Brands</span>
                <strong className="text-on-surface">
                  Drakes · Barbour · Margaret Howell
                </strong>
              </div>
            </div>

            <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-md font-mono text-[10px] text-secondary">
              <span>Curator: Alistair H. · Edinburgh, Scotland</span>
              <a
                className="font-semibold text-on-surface transition hover:text-primary"
                href="#public-wardrobes"
              >
                Explore Collection →
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function PublicWardrobes() {
  return (
    <section className="py-20 md:py-24" id="public-wardrobes">
      <div className="mx-auto max-w-[1440px] px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="mb-space-xl max-w-3xl">
          <span className="mb-space-xs block font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
            FROM THE COMMUNITY ARCHIVE
          </span>
          <h2 className="mb-space-xs font-heading text-4xl tracking-[-0.02em] md:text-5xl">
            Explore Real Collections
          </h2>
          <p className="font-heading text-2xl italic text-secondary">
            Discover how people build collections around personal taste.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 lg:grid-cols-4">
          {wardrobes.map(([title, vault, years, body, combos, image]) => (
            <article
              key={title}
              className="group flex flex-col overflow-hidden rounded-xl bg-background shadow-sm hover:shadow-md"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  className="size-full object-cover transition duration-700 group-hover:scale-105"
                  src={image}
                  alt={`${title} wardrobe archive`}
                />
                <div className="absolute left-3 top-3 rounded bg-background/90 px-2 py-0.5 font-mono text-[10px] backdrop-blur-md">
                  {years}
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-space-md">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-secondary">
                    {vault}
                  </span>
                  <h3 className="mb-2 mt-1 font-heading text-2xl">{title}</h3>
                  <p className="text-sm leading-6 text-on-surface-variant">
                    {body}
                  </p>
                </div>
                <div className="font-mono text-[10px] text-secondary">
                  <span>{combos}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Thesis() {
  return (
    <section className="bg-surface-container-low py-20 md:py-24" id="manifesto">
      <div className="mx-auto max-w-[1440px] px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="mb-space-xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-space-xs block font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
              The Curatorial Thesis
            </span>
            <h2 className="font-heading text-4xl tracking-[-0.02em] md:text-5xl">
              Why we preserve before we consume.
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {thesis.map(([code, title, body]) => (
            <article
              key={code}
              className="rounded-md bg-background p-space-lg shadow-sm transition hover:-translate-y-1"
            >
              <div className="mb-space-sm">
                <span className="bg-background font-mono text-[10px] text-secondary">
                  {code}
                </span>
              </div>
              <h3 className="mb-space-sm font-heading text-3xl tracking-[-0.02em]">
                {title}
              </h3>
              <p className="text-sm leading-6 text-on-surface-variant">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InterfacePreview() {
  return (
    <section className="bg-background py-20 md:py-24" id="protocol">
      <div className="mx-auto max-w-[1440px] px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="mx-auto mb-space-xl max-w-3xl text-center">
          <span className="mb-space-xs block font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
            A HOME FOR YOUR WARDROBE
          </span>
          <h2 className="font-heading text-5xl leading-tight tracking-[-0.03em] md:text-6xl">
            The Sanctuary of Considered Clothing
          </h2>
          <p className="mt-space-xs text-base leading-7 text-on-surface-variant md:text-lg">
            A museum-grade operating system designed for tactile calm, precise
            maintenance telemetry and effortless decision-making.
          </p>
        </div>
        <div className="rounded-md h-120 bg-[linear-gradient(135deg,#645946,#d8d2c5_50%,#2c3e2d)] p-space-md shadow-xl md:p-space-lg">
          <span className="rounded bg-background/80 px-4 py-2 font-mono text-[10px] backdrop-blur">
            In Vault · Good Condition
          </span>
        </div>
      </div>
    </section>
  );
}

function Intelligence() {
  return (
    <section className="bg-background py-20 md:py-24" id="intelligence">
      <div className="mx-auto max-w-[1440px] px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="mb-space-xl max-w-2xl">
          <span className="mb-space-xs block font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
            Analytical Marginalia
          </span>
          <h2 className="mb-space-xs font-heading text-4xl tracking-[-0.02em] md:text-5xl">
            Wardrobe Intelligence
          </h2>
          <p className="font-heading text-2xl italic text-secondary">
            Observations drawn from ownership, wear history and wardrobe habits.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2">
          {intelligence.map(([node, quote, action]) => (
            <article
              key={node}
              className="rounded-xl bg-surface-container-low p-space-lg shadow-sm hover:bg-surface-container"
            >
              <div className="mb-space-md flex justify-between">
                <span className="font-mono text-[10px] text-secondary">
                  {node}
                </span>
                <span className="size-2 rounded-full bg-primary" />
              </div>
              <p className="mb-space-sm font-heading text-3xl italic leading-snug">
                “{quote}”
              </p>
              <p className="text-sm leading-6 text-on-surface-variant">
                Analysis translates your archive into non-commercial,
                preservation-first decisions.
              </p>
              <div className="mt-space-md flex justify-between pt-space-md font-mono text-[10px] text-secondary">
                <span>{action}</span>
                <span className="text-on-surface">Confidence 98.4%</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  const fast = [
    "Consumption as Recreation",
    "Ephemeral Trends",
    "Algorithmic Feed Infiltration",
    "Influencer Endorsements",
    "Planned Obsolescence & Novelty",
  ];
  const koyun = [
    "Preservation & Custodianship",
    "Generational Continuity",
    "Sacred Private Archive",
    "Documented Provenance",
    "Mending, Patination & Textile Reverence",
  ];
  return (
    <section className="bg-surface-container-low py-20 md:py-24">
      <div className="mx-auto max-w-[1440px] px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="mx-auto mb-space-xl max-w-2xl text-center">
          <span className="mb-space-xs block font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
            Comparative Philosophy
          </span>
          <h2 className="font-heading text-4xl tracking-[-0.02em] md:text-5xl">
            The Archival Divergence
          </h2>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-space-lg md:grid-cols-2">
          <Compare title="Fast Fashion Internet" items={fast} muted />
          <Compare title="Koyun Protocol" items={koyun} />
        </div>
      </div>
    </section>
  );
}

function FinalCta({ nextPath }: { nextPath: string }) {
  return (
    <section className="flex flex-col items-center justify-center bg-background px-margin-mobile py-32 text-center md:px-margin-tablet lg:px-margin">
      <span className="mb-space-sm block font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
        Repository Enrollment
      </span>
      <h2 className="mx-auto mb-space-md max-w-2xl font-heading text-5xl leading-tight tracking-[-0.03em] md:text-6xl">
        Start building the archive of your wardrobe.
      </h2>
      <p className="mx-auto mb-space-lg max-w-lg text-base leading-7 text-on-surface-variant md:text-lg">
        Document what you own. Understand what you wear. Preserve what matters.
      </p>
      <LandingAuthButton nextPath={nextPath} className="px-8 py-4" />
      <p className="mt-space-sm font-mono text-[10px] text-secondary">
        Private vault custody • Zero commercial tracking • Encrypted client-side
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-surface-container-low">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-space-lg px-margin-mobile py-space-xl text-on-surface-variant md:flex-row md:items-baseline md:px-margin-tablet lg:px-margin">
        <div>
          <span className="font-heading text-2xl italic text-on-surface">
            KoyunCo Colophon
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">
            Archival Record Series No. 71-MK · European Standard Repository
          </p>
        </div>
        <div className="flex flex-wrap gap-x-space-lg gap-y-space-xs font-mono text-[10px]">
          <span>Node Kyoto-09 · Encrypted</span>
          <span>TLS 1.3 / Post-Quantum Crypt</span>
          <span>© 2025 KoyunCo Archive Corp.</span>
        </div>
      </div>
    </footer>
  );
}

function Spec({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <span className="block font-mono text-[10px] text-secondary">
        {label}
      </span>
      <span
        className={`font-mono text-xs ${highlight ? "font-semibold text-primary" : "text-on-surface"}`}
      >
        {value}
      </span>
    </div>
  );
}
function Card({
  className = "",
  title,
  children,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`rounded-xl bg-background p-space-md shadow-sm ${className}`}
    >
      <span className="mb-space-sm block font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
        {title}
      </span>
      {children}
    </article>
  );
}
function Outfit({ layer, name }: { layer: string; name: string }) {
  return (
    <div className="mt-2 flex items-center gap-3 rounded-lg bg-surface-container-low p-2">
      <div className="h-14 w-12 rounded bg-gradient-to-br from-surface-container-highest to-primary/30" />
      <div>
        <span className="block font-mono text-[10px] text-secondary">
          {layer}
        </span>
        <span className="text-sm font-medium">{name}</span>
        <p className="font-mono text-[10px] text-on-surface-variant">
          €4.12 CPW · 62 Wears
        </p>
      </div>
    </div>
  );
}
function Log({ left, right }: { left: string; right: string }) {
  return (
    <div className="mt-1.5 flex justify-between rounded bg-surface-container-low p-1.5 font-mono text-[10px]">
      <span className="text-secondary">{left}</span>
      <span>{right}</span>
    </div>
  );
}
function Gauge({
  label,
  width,
  muted = false,
}: {
  label: string;
  width: string;
  muted?: boolean;
}) {
  return (
    <div className="mt-3 font-mono text-[10px]">
      <div className="mb-1 flex justify-between">
        <span>{label}</span>
        <span>
          {width === "w-full" ? "100%" : width === "w-[92%]" ? "92%" : "74%"}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-container-high">
        <div
          className={`h-full rounded-full ${width} ${muted ? "bg-secondary" : "bg-primary-container"}`}
        />
      </div>
    </div>
  );
}
function Compare({
  title,
  items,
  muted = false,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <article
      className={`${muted ? "bg-background" : "bg-surface-container shadow-md"} rounded-2xl p-space-xl shadow-sm`}
    >
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.18em] ${muted ? "text-secondary" : "text-primary"}`}
      >
        {muted ? "The Default System" : "The Archival Standard"}
      </span>
      <h3
        className={`mb-space-lg mt-space-md font-heading text-3xl ${muted ? "text-secondary" : "text-on-surface"}`}
      >
        {title}
      </h3>
      <ul className="space-y-space-md">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={muted ? "text-secondary" : "text-primary"}>
              {muted ? "×" : "✓"}
            </span>
            <span className="font-medium">{item}</span>
          </li>
        ))}
      </ul>
      <p
        className={`mt-space-xl font-mono text-[10px] ${muted ? "text-secondary" : "text-primary"}`}
      >
        {muted ? "Status: Volatile & Discardable" : "Status: Indelible Record"}
      </p>
    </article>
  );
}
