import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CloudDrizzle, Layers3, Shirt } from "lucide-react";

import { SignInButton } from "@/features/session/sign-in-button";
import { DEFAULT_AUTHENTICATED_PATH } from "@/shared/auth/constants";
import { getCurrentUser } from "@/shared/auth/server";
import { buttonStyles } from "@/shared/components/koyun/button";
import { Card, GarmentCard, ImageBadge, SpecGrid, SpecRow } from "@/shared/components/koyun/card";
import { Container, Eyebrow, Page, Section, SectionHeader } from "@/shared/components/koyun/layout";

export const instant = false;

export const metadata: Metadata = {
  title: "KoyunCo — Personal Wardrobe Archive",
  description: "A private archive for provenance, maintenance history and wardrobe intelligence.",
};

// Small mono caption, used for meta lines and footnotes across the landing.
const tech = "text-tech-sm text-muted-foreground";

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


export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect(DEFAULT_AUTHENTICATED_PATH);
  }

  const params = await searchParams;
  const nextPath = normalizeNextPath(params.next);

  return (
    <Page>
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
    </Page>
  );
}

function Header({ nextPath }: { nextPath: string }) {
  const navLink = "text-label-md text-muted-foreground hover:text-foreground";
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <Container className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <a className="group flex items-baseline gap-space-sm" href="#manifesto">
            <span className="font-heading text-headline-md text-ink group-hover:text-primary">Koyun</span>
            <span className={`hidden sm:inline ${tech}`}>Archival Protocol</span>
          </a>
          <nav className="hidden items-center gap-space-lg lg:flex">
            <a className="border-b border-primary pb-space-xs text-label-md" href="#manifesto">
              Manifesto
            </a>
            <a className={navLink} href="#public-wardrobes">
              Public Wardrobes
            </a>
            <a className={navLink} href="#intelligence">
              Wardrobe Intelligence
            </a>
            <a className={navLink} href="#protocol">
              Protocol
            </a>
          </nav>
        </div>
        <SignInButton nextPath={nextPath} />
      </Container>
    </header>
  );
}

function Hero({ nextPath }: { nextPath: string }) {
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
      <Container className="relative z-10 pb-20 pt-32">
        <div className="grid grid-cols-1 items-center gap-gutter lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-7">
            <div className="inline-flex items-center gap-space-sm">
              <span className="size-1.5 rounded-full bg-primary" />
              <Eyebrow>Personal Wardrobe Archive · Vault Protocol</Eyebrow>
            </div>
            <h1 className="max-w-2xl text-headline-2xl">
              Some people collect clothes.
              <br />
              <em>Others preserve them.</em>
            </h1>
            <p className="max-w-xl text-body-lg text-muted-foreground">Koyun. Personal wardrobe archive.</p>
            <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
              <SignInButton nextPath={nextPath} />
              <a className={buttonStyles("link")} href="#public-wardrobes">
                Explore Public Wardrobes →
              </a>
            </div>
            <div className={`flex flex-wrap items-center gap-space-lg pt-space-lg ${tech}`}>
              <span>✓ Secure sign-in powered by Microsoft</span>
              <span>✓ Encrypted Data Storage</span>
            </div>
          </div>
          <Card
            tone="page"
            elevated
            className="w-full min-w-0 max-w-md gap-0 bg-background/85 p-space-md backdrop-blur-lg lg:col-span-5 lg:ml-auto"
          >
            <div className="relative mb-space-md h-56 overflow-hidden rounded-lg bg-surface-container-high">
              <img className="size-full object-cover" src={specimenImage} alt="Ashby Wax Jacket" />
              <ImageBadge>British Heritage Winter</ImageBadge>
            </div>
            <h2 className="text-headline-md">Ashby Wax Jacket</h2>
            <p className="mt-space-xs text-body-md text-muted-foreground">Recommended for tomorrow&apos;s weather.</p>
            <dl className="mt-space-lg flex flex-col gap-space-sm">
              <SpecRow icon={<Shirt aria-hidden="true" className={iconClass} strokeWidth={1.4} />} label="Compatible" value="12 garments" />
              <SpecRow icon={<Layers3 aria-hidden="true" className={iconClass} strokeWidth={1.4} />} label="Outfits" value="18 combinations" />
              <SpecRow icon={<CloudDrizzle aria-hidden="true" className={iconClass} strokeWidth={1.4} />} label="Weather" value="8°C · Light rain" />
            </dl>
          </Card>
        </div>
      </Container>
    </section>
  );
}

function WardrobeOfWeek() {
  const [title, vault, , , , image] = wardrobes[0];
  return (
    <Section>
      <SectionHeader
        eyebrow="From The Koyun Archive"
        title="Collection of the Week"
        description="A privately curated collection from the Koyun archive."
      />
      <Card elevated className="grid gap-0 overflow-hidden p-space-md lg:grid-cols-12 lg:gap-space-lg lg:p-space-lg">
        <div className="relative h-72 overflow-hidden rounded-lg bg-surface-container lg:col-span-7 lg:h-80">
          <img className="size-full object-cover" src={image} alt={`${title} archival collection spotlight`} />
          <ImageBadge>Thornproof Waxed Canvas</ImageBadge>
        </div>
        <div className="flex flex-col justify-center gap-space-md py-space-lg lg:col-span-5 lg:py-0">
          <Eyebrow>{vault.split(" · ")[0]}</Eyebrow>
          <h3 className="text-headline-lg">{title}</h3>
          <p className="max-w-xl text-body-md text-muted-foreground">
            A collection built around natural fibres, weather resistance, understated tailoring of
            thornproof waxed canvas and Scottish border tweeds.
          </p>
          <SpecGrid
            items={[
              { label: "Established", value: "2010" },
              { label: "Garments", value: "48 Items" },
              { label: "Brands", value: "Drakes · Barbour · Margaret Howell" },
            ]}
          />
          <div className={`flex flex-wrap items-center justify-between gap-space-md ${tech}`}>
            <span>Curator: Alistair H. · Edinburgh, Scotland</span>
            <a className="text-label-md text-foreground hover:text-primary" href="#public-wardrobes">
              Explore Collection →
            </a>
          </div>
        </div>
      </Card>
    </Section>
  );
}

function PublicWardrobes() {
  return (
    <Section id="public-wardrobes">
      <SectionHeader
        eyebrow="From The Community Archive"
        title="Explore Real Collections"
        description="Discover how people build collections around personal taste."
      />
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
        {wardrobes.map(([title, vault, years, body, tags, image]) => (
          <GarmentCard
            key={title}
            imageSrc={image}
            imageAlt={`${title} wardrobe archive`}
            badge={years}
            meta={vault}
            title={title}
            description={body}
            footer={tags}
          />
        ))}
      </div>
    </Section>
  );
}

function Thesis() {
  return (
    <Section tone="muted" id="manifesto">
      <SectionHeader eyebrow="The Curatorial Thesis" title="Why we preserve before we consume." />
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        {thesis.map(([code, title, body]) => (
          <Card key={code} tone="page" className="gap-space-sm">
            <span className={tech}>{code}</span>
            <h3 className="text-headline-lg">{title}</h3>
            <p className="text-body-md text-muted-foreground">{body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function InterfacePreview() {
  return (
    <Section id="protocol">
      {/* Display title with a plain (not italic) lead paragraph, so not a SectionHeader. */}
      <div className="mx-auto mb-space-xl flex max-w-3xl flex-col items-center gap-space-sm text-center">
        <Eyebrow>A Home For Your Wardrobe</Eyebrow>
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
    </Section>
  );
}

function Intelligence() {
  return (
    <Section id="intelligence">
      <SectionHeader
        eyebrow="Analytical Marginalia"
        title="Wardrobe Intelligence"
        description="Observations drawn from ownership, wear history and wardrobe habits."
      />
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
        {intelligence.map(([node, quote, action]) => (
          <Card key={node} tone="muted" className="hover:bg-surface-container">
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
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Manifesto() {
  const fast = ["Consumption as Recreation", "Ephemeral Trends", "Algorithmic Feed Infiltration", "Influencer Endorsements", "Planned Obsolescence & Novelty"];
  const koyun = ["Preservation & Custodianship", "Generational Continuity", "Sacred Private Archive", "Documented Provenance", "Mending, Patination & Textile Reverence"];
  return (
    <Section tone="muted">
      <SectionHeader eyebrow="Comparative Philosophy" title="The Archival Divergence" align="center" />
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-gutter md:grid-cols-2">
        <Compare title="Fast Fashion Internet" items={fast} muted />
        <Compare title="Koyun Protocol" items={koyun} />
      </div>
    </Section>
  );
}

function Compare({ title, items, muted = false }: { title: string; items: string[]; muted?: boolean }) {
  const accent = muted ? "text-muted-foreground" : "text-primary";
  return (
    <Card
      tone="page"
      elevated={!muted}
      className={`gap-space-lg p-space-xl ${muted ? "" : "bg-surface-container"}`}
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
    </Card>
  );
}

function FinalCta({ nextPath }: { nextPath: string }) {
  return (
    <Container className="flex flex-col items-center gap-space-md py-32 text-center">
      <Eyebrow>Repository Enrollment</Eyebrow>
      <h2 className="max-w-2xl text-headline-2xl">Start building the archive of your wardrobe.</h2>
      <p className="max-w-lg text-body-lg text-muted-foreground">
        Document what you own. Understand what you wear. Preserve what matters.
      </p>
      <SignInButton nextPath={nextPath} />
      <p className={tech}>Private vault custody • Zero commercial tracking • Encrypted client-side</p>
    </Container>
  );
}

function Footer() {
  return (
    <footer className="bg-surface-container-low">
      <Container className="flex flex-col justify-between gap-space-lg py-space-xl md:flex-row md:items-baseline">
        <div className="flex flex-col gap-space-xs">
          <span className="font-heading text-headline-md italic text-ink">KoyunCo Colophon</span>
          <p className={tech}>Archival Record Series No. 71-MK · European Standard Repository</p>
        </div>
        <div className={`flex flex-wrap gap-x-space-lg gap-y-space-xs ${tech}`}>
          <span>Node Kyoto-09 · Encrypted</span>
          <span>TLS 1.3 / Post-Quantum Crypt</span>
          <span>© 2025 KoyunCo Archive Corp.</span>
        </div>
      </Container>
    </footer>
  );
}
