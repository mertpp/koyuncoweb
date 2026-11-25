import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CloudDrizzle, Layers3, Shirt } from "lucide-react";

import { DEFAULT_AUTHENTICATED_PATH } from "@/shared/auth/constants";

import { SignInButton } from "./sign-in-button";

// Comparison copy of the landing (src/app/(app)/page.tsx) built only with DESIGN.md
// tokens: no px/hex/arbitrary values. Temporary: once a landing is chosen, the winner
// stays at "/" and this route is removed.

export const metadata: Metadata = {
  title: "KoyunCo — Landing (tokens)",
};

const nextPath = DEFAULT_AUTHENTICATED_PATH;

// Repeated patterns, written once. These become the shared pieces in step 0.5b.
const container = "mx-auto w-full max-w-page px-margin-mobile md:px-margin-tablet lg:px-margin";
const section = "py-20 md:py-24";
const eyebrow = "text-label-sm uppercase text-muted-foreground";
const subtitle = "text-headline-sm italic text-muted-foreground";
const tech = "text-tech-sm text-muted-foreground";
const imageBadge =
  "absolute left-space-md top-space-md rounded-sm border border-border bg-background/85 px-space-sm py-space-xs text-tech-sm backdrop-blur-lg";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuChkGxQycyE5T0OoJgAK8tzwT5gNyJ39YMgiwWfLAlLIPZHKG5CCB0h3CdkxbDw8VGCXMel4K_ze7WvrdCEjobmwy081qw_xbLwU7IVVGGAYcsUAtAadQjwJ4vkly5dJ2MjQQcERYg1G3qDwHlgFvg3Gdfip__JWDyEdWADfVIeziumnE-CTFWuGrlUGY4Pe77XVTLN-CvGbubxKhwnlhYWBhXUVelLYyZRtmfh2MI";
const specimenImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAkFUB7jLqep_5UvGKaseakgBLCcyFrlm4q13Efm6Y_gplde7t4jPD0clms_g8iXMJxKe1-sjsWL0W8vsNk4pqfVTrC7UldPzoK61u-lvTKDhRkK9wXRCHWTkFXiaTjOZ52_WUVN8uf59fSBVBa0xz1w-9cpwSl6G7KSVk3lO7IKwP_tQz8p9m0VkzEYly2756M6O5jsl1SAQAvyFxrzgxmvkc9mfqVOwClKeHQ0e4";

const thesis = [
  ["PROVENANCE", "Memory & Provenance", "Record acquisitions, alterations, repairs and ownership history so every garment retains its context."],
  ["HARMONY", "Wardrobe Intelligence", "Learn from what you actually wear. Koyun transforms ownership history into practical wardrobe insight."],
  ["SOVEREIGNTY", "Private Ownership", "A sealed personal vault with zero advertisement tracking and self-custodied wardrobe history."],
] as const;

const wardrobes = [
  ["British Heritage Winter", "Devonshire Vault · 048 Items", "14 Years Cataloged", "Curated country tailoring, Thornproof waxed cotton, estate Harris tweed and heavy Shetland knitwear.", "#Levis #Charhartt #Zara", "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7x3zxRQ7Lo-LiHFErYmJuCNLmVswb0sKZVCXTiy-LaSvX3PWiZidAdUBodhht_dKI54mkeG91RA9sa1tdBFmYXX7MKVpZfiHC5dFzaIpdktPu2xhPmWlFfK3Ekbs8O_6qgiFwlH-59mSR8BY727_aR-blRS3FgEtVU-nArhFKvVlHN4VJqTqeJf7WK590NAv-EaORxUmLYk6gxl2dOllB0GblvJ9BmuKG4YeshI"],
  ["Architect in Copenhagen", "Copenhagen Vault · 036 Items", "9 Years Cataloged", "Monochromatic architectural cuts, double-bonded technical wool and high-gauge merino base layers.", "#Burberry #Acronym #Camoshita", "https://lh3.googleusercontent.com/aida-public/AB6AXuD7a8FGSdF1R0xrh1EdEo6OVvjcvGA7HuQswwXpk3UXX0KflQlzaLvdKvSxQseRndnK7illy7Pp1MyzRhsZzhgPt6KrcLuuAb81K5n28jLK1jZVp4q-TvaXe8nXMd9ssJQRJEig2nnqRvKr5IVdMKG4z42pljS3WndfPObBi54sDuYOdNZn9ulEuPBkfUkKjy4zZU_ZVxrO806cN6NHOrnw0IVuu492ySmhd2tfAes"],
  ["Madrid Minimalist", "Salamanca Vault · 029 Items", "7 Years Cataloged", "Spanish bespoke tailoring, crisp Italian poplin, summer cashmere and raw Irish flax linen.", "#Hackett #Barbour #Camoshita", "https://lh3.googleusercontent.com/aida-public/AB6AXuBwJ06iDw3-4ldDM_s699bVwtZIR0k1D05BI_GOqzFmJ1UiyzAwWXlWBqTnq1VwGqCS5rVJfEEPZss362cx82EOvH4mddBs5n6ItHRXm6XuQlGiC07E7yQarb3ZP7iV0-pPQWq9t_Q0W0thW4VQ1pEmXJ5Vm5GMl5V4xKLns5wObMGcdsPdRC7MAg0n5eo0E8VqeP1upoJ6Gr5fYsLTcEwp4K9-P-gNMqHfgREXnPM"],
  ["Japanese Denim & Craft", "Kojima Vault · 052 Items", "11 Years Cataloged", "Kuroki shuttle loom selvedge, indigo dip phases, Wakayama cottons and brass patina.", "#OrSlow #Kapital #Warehouse", "https://lh3.googleusercontent.com/aida-public/AB6AXuAlDC7W_oEeclRpDN3CZ_H2ES4-V7X-_uJy1qqDtueWPcAVHmbWAuLHc61D6ptZIEEopyIytQjEAg5wBAkHdRD39i2WrAMk42Z9k9BYbBnmT1OUOlccEgBD61NDc9X-VItGuNz5hyF4BGxzuQAWOZK4VsYuBvi3IqGZMgKjXbi8r55d8kgTctnv0OwRb-xZTAX1Whb7NRqDAEgl8dYPwEVIs3x8cwDF1yrXg-wFroQ"],
] as const;

const intelligence = [
  ["CATEGORY SATURATION", "You own seven navy garments serving the same purpose.", "Recommendation: Pause new purchases in this category."],
  ["SEASONAL COVERAGE", "Your wardrobe is already well equipped for winter conditions.", "Observation: Additional outerwear may not offer practical benefit."],
  ["COLLECTION BALANCE", "Most recent acquisitions continue a long-standing preference for soft tailoring and neutral palettes.", "Observation: Style direction unchanged over three years."],
  ["MISSING COMBINATIONS", "Three tailored trousers are underutilized due to missing shoe pairing.", "Recommendation: A compatible footwear would unlock additional combinations."],
] as const;

export default function LandingTokensPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <Header />
      <Hero />
      <WardrobeOfWeek />
      <PublicWardrobes />
      <Thesis />
      <InterfacePreview />
      <Intelligence />
      <Manifesto />
      <FinalCta />
      <Footer />
    </main>
  );
}

function SectionHeader({
  label,
  title,
  description,
  centered = false,
}: {
  label: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={`mb-space-xl flex max-w-3xl flex-col gap-space-sm ${centered ? "mx-auto text-center" : ""}`}>
      <span className={eyebrow}>{label}</span>
      <h2 className="text-headline-xl">{title}</h2>
      {description ? <p className={subtitle}>{description}</p> : null}
    </div>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className={`${container} flex h-20 items-center justify-between`}>
        <div className="flex items-center gap-space-lg">
          <a className="group flex items-baseline gap-space-sm" href="#manifesto">
            <span className="font-heading text-headline-md text-ink group-hover:text-primary">Koyun</span>
            <span className={`hidden sm:inline ${tech}`}>Archival Protocol</span>
          </a>
          <nav className="hidden items-center gap-space-lg lg:flex">
            <a className="border-b border-primary pb-space-xs text-label-md" href="#manifesto">
              Manifesto
            </a>
            <a className="text-label-md text-muted-foreground hover:text-foreground" href="#public-wardrobes">
              Public Wardrobes
            </a>
            <a className="text-label-md text-muted-foreground hover:text-foreground" href="#intelligence">
              Wardrobe Intelligence
            </a>
            <a className="text-label-md text-muted-foreground hover:text-foreground" href="#protocol">
              Protocol
            </a>
          </nav>
        </div>
        <SignInButton nextPath={nextPath} />
      </div>
    </header>
  );
}

function SpecRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-space-md">
      <dt className="flex items-center gap-space-sm text-label-sm uppercase">
        {icon}
        {label}
      </dt>
      <dd className="text-right text-body-md">{value}</dd>
    </div>
  );
}

function Hero() {
  const iconClass = "size-4 shrink-0 text-muted-foreground";
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-surface-container-low pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/85 to-background/45 md:to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/30" />
      <div className={`${container} relative z-10 pb-20 pt-32`}>
        <div className="grid grid-cols-1 items-center gap-gutter lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-7">
            <div className="inline-flex items-center gap-space-sm">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className={eyebrow}>Personal Wardrobe Archive · Vault Protocol</span>
            </div>
            <h1 className="max-w-2xl text-headline-2xl">
              Some people collect clothes.
              <br />
              <em>Others preserve them.</em>
            </h1>
            <p className="max-w-xl text-body-lg text-muted-foreground">Koyun. Personal wardrobe archive.</p>
            <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
              <SignInButton nextPath={nextPath} />
              <a
                className="text-label-md underline decoration-border underline-offset-3 hover:text-primary"
                href="#public-wardrobes"
              >
                Explore Public Wardrobes →
              </a>
            </div>
            <div className={`flex flex-wrap items-center gap-space-lg pt-space-lg ${tech}`}>
              <span>✓ Secure sign-in powered by Microsoft</span>
              <span>✓ Encrypted Data Storage</span>
            </div>
          </div>
          <article className="w-full min-w-0 max-w-md rounded-lg border border-border bg-background/85 p-space-md shadow-elevated backdrop-blur-lg lg:col-span-5 lg:ml-auto">
            <div className="relative mb-space-md h-56 overflow-hidden rounded-lg bg-surface-container-high">
              <img className="size-full object-cover" src={specimenImage} alt="Ashby Wax Jacket" />
              <span className={imageBadge}>British Heritage Winter</span>
            </div>
            <h2 className="text-headline-md">Ashby Wax Jacket</h2>
            <p className="mt-space-xs text-body-md text-muted-foreground">Recommended for tomorrow&apos;s weather.</p>
            <dl className="mt-space-lg flex flex-col gap-space-sm">
              <SpecRow icon={<Shirt aria-hidden="true" className={iconClass} strokeWidth={1.4} />} label="Compatible" value="12 garments" />
              <SpecRow icon={<Layers3 aria-hidden="true" className={iconClass} strokeWidth={1.4} />} label="Outfits" value="18 combinations" />
              <SpecRow icon={<CloudDrizzle aria-hidden="true" className={iconClass} strokeWidth={1.4} />} label="Weather" value="8°C · Light rain" />
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}

function WardrobeOfWeek() {
  const [title, vault, , , , image] = wardrobes[0];
  const stats = [
    ["Established", "2010"],
    ["Garments", "48 Items"],
    ["Brands", "Drakes · Barbour · Margaret Howell"],
  ] as const;

  return (
    <section className={section}>
      <div className={container}>
        <SectionHeader
          label="From The Koyun Archive"
          title="Collection of the Week"
          description="A privately curated collection from the Koyun archive."
        />
        <article className="grid overflow-hidden rounded-lg border border-border bg-surface-container-lowest p-space-md shadow-elevated lg:grid-cols-12 lg:gap-space-lg lg:p-space-lg">
          <div className="relative h-72 overflow-hidden rounded-lg bg-surface-container lg:col-span-7 lg:h-80">
            <img className="size-full object-cover" src={image} alt={`${title} archival collection spotlight`} />
            <span className={imageBadge}>Thornproof Waxed Canvas</span>
          </div>
          <div className="flex flex-col justify-center gap-space-md py-space-lg lg:col-span-5 lg:py-0">
            <span className={eyebrow}>{vault.split(" · ")[0]}</span>
            <h3 className="text-headline-lg">{title}</h3>
            <p className="max-w-xl text-body-md text-muted-foreground">
              A collection built around natural fibres, weather resistance, understated tailoring of
              thornproof waxed canvas and Scottish border tweeds.
            </p>
            <dl className="grid grid-cols-3 divide-x divide-border overflow-hidden rounded-md border border-border bg-background">
              {stats.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-space-xs p-space-sm text-center">
                  <dt className={tech}>{label}</dt>
                  <dd className="text-tech-md">{value}</dd>
                </div>
              ))}
            </dl>
            <div className={`flex flex-wrap items-center justify-between gap-space-md ${tech}`}>
              <span>Curator: Alistair H. · Edinburgh, Scotland</span>
              <a className="text-label-md text-foreground hover:text-primary" href="#public-wardrobes">
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
    <section className={section} id="public-wardrobes">
      <div className={container}>
        <SectionHeader
          label="From The Community Archive"
          title="Explore Real Collections"
          description="Discover how people build collections around personal taste."
        />
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
          {wardrobes.map(([title, vault, years, body, tags, image]) => (
            <article key={title} className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface-container-lowest">
              <div className="relative aspect-3/4 overflow-hidden">
                <img className="size-full object-cover transition duration-700 group-hover:scale-105" src={image} alt={`${title} wardrobe archive`} />
                <span className={imageBadge}>{years}</span>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-space-md p-space-md">
                <div className="flex flex-col gap-space-xs">
                  <span className={tech}>{vault}</span>
                  <h3 className="text-headline-md">{title}</h3>
                  <p className="text-body-md text-muted-foreground">{body}</p>
                </div>
                <span className={tech}>{tags}</span>
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
    <section className={`${section} bg-surface-container-low`} id="manifesto">
      <div className={container}>
        <SectionHeader label="The Curatorial Thesis" title="Why we preserve before we consume." />
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {thesis.map(([code, title, body]) => (
            <article key={code} className="flex flex-col gap-space-sm rounded-lg border border-border bg-background p-space-lg">
              <span className={tech}>{code}</span>
              <h3 className="text-headline-lg">{title}</h3>
              <p className="text-body-md text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InterfacePreview() {
  return (
    <section className={section} id="protocol">
      <div className={container}>
        <div className="mx-auto mb-space-xl flex max-w-3xl flex-col gap-space-sm text-center">
          <span className={eyebrow}>A Home For Your Wardrobe</span>
          <h2 className="text-headline-2xl">The Sanctuary of Considered Clothing</h2>
          <p className="text-body-lg text-muted-foreground">
            A museum-grade operating system designed for tactile calm, precise maintenance telemetry
            and effortless decision-making.
          </p>
        </div>
        <div className="h-120 rounded-lg bg-linear-135 from-tertiary-container via-surface-container-high to-primary p-space-lg shadow-elevated">
          <span className="rounded-sm border border-border bg-background/85 px-space-md py-space-sm text-tech-sm backdrop-blur-lg">
            In Vault · Good Condition
          </span>
        </div>
      </div>
    </section>
  );
}

function Intelligence() {
  return (
    <section className={section} id="intelligence">
      <div className={container}>
        <SectionHeader
          label="Analytical Marginalia"
          title="Wardrobe Intelligence"
          description="Observations drawn from ownership, wear history and wardrobe habits."
        />
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {intelligence.map(([node, quote, action]) => (
            <article key={node} className="flex flex-col gap-space-md rounded-lg border border-border bg-surface-container-low p-space-lg hover:bg-surface-container">
              <div className="flex justify-between">
                <span className={tech}>{node}</span>
                <span className="size-2 rounded-full bg-primary" />
              </div>
              <p className="font-heading text-headline-lg italic text-ink">“{quote}”</p>
              <p className="text-body-md text-muted-foreground">
                Analysis translates your archive into non-commercial, preservation-first decisions.
              </p>
              <div className={`flex justify-between pt-space-sm ${tech}`}>
                <span>{action}</span>
                <span className="text-foreground">Confidence 98.4%</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  const fast = ["Consumption as Recreation", "Ephemeral Trends", "Algorithmic Feed Infiltration", "Influencer Endorsements", "Planned Obsolescence & Novelty"];
  const koyun = ["Preservation & Custodianship", "Generational Continuity", "Sacred Private Archive", "Documented Provenance", "Mending, Patination & Textile Reverence"];
  return (
    <section className={`${section} bg-surface-container-low`}>
      <div className={container}>
        <SectionHeader label="Comparative Philosophy" title="The Archival Divergence" centered />
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-gutter md:grid-cols-2">
          <Compare title="Fast Fashion Internet" items={fast} muted />
          <Compare title="Koyun Protocol" items={koyun} />
        </div>
      </div>
    </section>
  );
}

function Compare({ title, items, muted = false }: { title: string; items: string[]; muted?: boolean }) {
  const accent = muted ? "text-muted-foreground" : "text-primary";
  return (
    <article
      className={`flex flex-col gap-space-lg rounded-lg border border-border p-space-xl ${muted ? "bg-background" : "bg-surface-container shadow-elevated"}`}
    >
      <span className={`text-tech-sm ${accent}`}>{muted ? "The Default System" : "The Archival Standard"}</span>
      <h3 className={`text-headline-lg ${muted ? "text-muted-foreground" : ""}`}>{title}</h3>
      <ul className="flex flex-col gap-space-md">
        {items.map((item) => (
          <li key={item} className="flex gap-space-sm text-body-lg">
            <span className={accent}>{muted ? "×" : "✓"}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className={`text-tech-sm ${accent}`}>{muted ? "Status: Volatile & Discardable" : "Status: Indelible Record"}</p>
    </article>
  );
}

function FinalCta() {
  return (
    <section className={`${container} flex flex-col items-center gap-space-md py-32 text-center`}>
      <span className={eyebrow}>Repository Enrollment</span>
      <h2 className="max-w-2xl text-headline-2xl">Start building the archive of your wardrobe.</h2>
      <p className="max-w-lg text-body-lg text-muted-foreground">
        Document what you own. Understand what you wear. Preserve what matters.
      </p>
      <SignInButton nextPath={nextPath} />
      <p className={tech}>Private vault custody • Zero commercial tracking • Encrypted client-side</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-surface-container-low">
      <div className={`${container} flex flex-col justify-between gap-space-lg py-space-xl md:flex-row md:items-baseline`}>
        <div className="flex flex-col gap-space-xs">
          <span className="font-heading text-headline-md italic text-ink">KoyunCo Colophon</span>
          <p className={tech}>Archival Record Series No. 71-MK · European Standard Repository</p>
        </div>
        <div className={`flex flex-wrap gap-x-space-lg gap-y-space-xs ${tech}`}>
          <span>Node Kyoto-09 · Encrypted</span>
          <span>TLS 1.3 / Post-Quantum Crypt</span>
          <span>© 2025 KoyunCo Archive Corp.</span>
        </div>
      </div>
    </footer>
  );
}
