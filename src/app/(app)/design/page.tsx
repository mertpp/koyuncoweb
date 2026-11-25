import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Eyebrow, Section, SectionHeader } from "@/shared/components/koyun/layout";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = {
  title: "Design system — KoyunCo",
};

// Visual catalogue of the design tokens (doc/DESIGN.md, "Decisiones de KoyunCo").
// Class names are written out literally so Tailwind can find them; do not build them
// from strings.

const typeScale = [
  { name: "text-headline-2xl (solo landing)", className: "text-headline-2xl", sample: "The Sanctuary" },
  { name: "text-headline-xl", className: "text-headline-xl", sample: "The Autumn Archive" },
  { name: "text-headline-lg", className: "text-headline-lg", sample: "Ashby Wax Jacket" },
  { name: "text-headline-md", className: "text-headline-md", sample: "Section title" },
  { name: "text-headline-sm", className: "text-headline-sm", sample: "Card title" },
  { name: "text-body-lg", className: "text-body-lg", sample: "A wardrobe is not an inventory. It is a record of how you choose to live." },
  { name: "text-body-md", className: "text-body-md", sample: "Interface copy, form fields and descriptive notes." },
  { name: "text-body-sm", className: "text-body-sm", sample: "Secondary notes and helper text." },
  { name: "text-label-md", className: "text-label-md", sample: "Label medium" },
  { name: "text-label-sm", className: "text-label-sm", sample: "Label small" },
  { name: "text-tech-md", className: "text-tech-md", sample: "100% wool · 480 gsm · 1998" },
  { name: "text-tech-sm", className: "text-tech-sm", sample: "SKU KC-0042 · AW98" },
] as const;

const colors = [
  { name: "background", className: "bg-background" },
  { name: "surface-container-low", className: "bg-surface-container-low" },
  { name: "surface-container", className: "bg-surface-container" },
  { name: "surface-container-high", className: "bg-surface-container-high" },
  { name: "primary (marca)", className: "bg-primary" },
  { name: "ink (tinta)", className: "bg-ink" },
  { name: "secondary", className: "bg-secondary" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "border", className: "bg-border" },
  { name: "destructive", className: "bg-destructive" },
] as const;

const radii = [
  { name: "rounded-sm · 4px", use: "checkbox, badge pequeño", className: "rounded-sm" },
  { name: "rounded-md · 6px", use: "paneles internos, campos", className: "rounded-md" },
  { name: "rounded-lg · 8px", use: "base: tarjetas, botones, imágenes", className: "rounded-lg" },
  { name: "rounded-xl · 12px", use: "solo modales y popovers", className: "rounded-xl" },
  { name: "rounded-full", use: "solo chips y estados", className: "rounded-full" },
] as const;

const spacing = [
  { name: "space-xs · 4px", className: "w-space-xs" },
  { name: "space-sm · 8px", className: "w-space-sm" },
  { name: "space-md · 16px", className: "w-space-md" },
  { name: "space-lg · 24px", className: "w-space-lg" },
  { name: "space-xl · 40px", className: "w-space-xl" },
  { name: "gutter · 24px", className: "w-gutter" },
  { name: "margin · 48px", className: "w-margin" },
] as const;

function CatalogSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-space-lg border-t border-border pt-space-xl">
      <h2 className="text-headline-md">{title}</h2>
      {children}
    </section>
  );
}

function Palette() {
  return (
    <div className="grid grid-cols-2 gap-space-md sm:grid-cols-5">
      {colors.map((color) => (
        <div key={color.name} className="flex flex-col gap-space-sm">
          <div className={`h-16 rounded-lg border border-border ${color.className}`} />
          <span className="text-tech-sm text-muted-foreground">{color.name}</span>
        </div>
      ))}
    </div>
  );
}

function Controls() {
  return (
    <div className="flex flex-wrap items-center gap-space-md">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
      <Badge>Active</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  );
}

export default function DesignPage() {
  return (
    <main className="mx-auto flex max-w-page flex-col gap-space-xl px-margin-mobile py-space-xl md:px-margin-tablet lg:px-margin">
      <header className="flex flex-col gap-space-sm">
        <p className="text-label-sm uppercase text-muted-foreground">Design system</p>
        <h1 className="text-headline-xl">KoyunCo Editorial Archive</h1>
        <p className="max-w-2xl text-body-lg text-muted-foreground">
          Todos los tokens montados. Si algo de una pantalla no se parece a esto, la pantalla está
          mal. Reglas en doc/DESIGN.md, sección «Decisiones de KoyunCo».
        </p>
      </header>

      <CatalogSection title="Tipografía">
        <div className="flex flex-col gap-space-lg">
          {typeScale.map((style) => (
            <div key={style.name} className="grid gap-space-xs md:grid-cols-4 md:gap-space-lg">
              <span className="text-tech-sm text-muted-foreground">{style.name}</span>
              <p className={`md:col-span-3 ${style.className}`}>{style.sample}</p>
            </div>
          ))}
        </div>
      </CatalogSection>

      <CatalogSection title="Color">
        <Palette />
        <div className="dark rounded-lg bg-background p-space-lg text-foreground">
          <p className="mb-space-md text-label-sm uppercase text-muted-foreground">Modo oscuro</p>
          <Palette />
        </div>
      </CatalogSection>

      <CatalogSection title="Radios">
        <div className="grid grid-cols-2 gap-space-md sm:grid-cols-5">
          {radii.map((radius) => (
            <div key={radius.name} className="flex flex-col gap-space-sm">
              <div className={`h-24 border border-border bg-surface-container-high ${radius.className}`} />
              <span className="text-tech-sm">{radius.name}</span>
              <span className="text-body-sm text-muted-foreground">{radius.use}</span>
            </div>
          ))}
        </div>
      </CatalogSection>

      <CatalogSection title="Espaciado">
        <div className="flex flex-col gap-space-sm">
          {spacing.map((space) => (
            <div key={space.name} className="flex items-center gap-space-md">
              <div className={`h-4 bg-primary ${space.className}`} />
              <span className="text-tech-sm text-muted-foreground">{space.name}</span>
            </div>
          ))}
        </div>
      </CatalogSection>

      <CatalogSection title="Controles actuales">
        <Controls />
        <div className="dark rounded-lg bg-background p-space-lg text-foreground">
          <Controls />
        </div>
      </CatalogSection>
      <CatalogSection title="Piezas de maquetación">
        <p className="max-w-2xl text-body-md text-muted-foreground">
          src/shared/components/koyun/layout.tsx. Las páginas se montan con estas piezas: Page,
          Container, Section, SectionHeader y Eyebrow. Ninguna página escribe márgenes ni tamaños.
        </p>

        <div className="flex flex-col gap-space-sm">
          <span className="text-tech-sm text-muted-foreground">Eyebrow</span>
          <Eyebrow>From the Koyun archive</Eyebrow>
        </div>

        <div className="flex flex-col gap-space-sm">
          <span className="text-tech-sm text-muted-foreground">SectionHeader · default</span>
          <SectionHeader
            eyebrow="From the Koyun archive"
            title="Collection of the Week"
            description="A privately curated collection from the Koyun archive."
            actions={<Button variant="outline">Explore</Button>}
          />
        </div>

        <div className="flex flex-col gap-space-sm">
          <span className="text-tech-sm text-muted-foreground">
            SectionHeader · size=&quot;display&quot; align=&quot;center&quot; (solo landing)
          </span>
          <SectionHeader
            eyebrow="A home for your wardrobe"
            title="The Sanctuary of Considered Clothing"
            size="display"
            align="center"
          />
        </div>

        <div className="flex flex-col gap-space-sm">
          <span className="text-tech-sm text-muted-foreground">
            Section · tone=&quot;muted&quot; (banda a todo el ancho con el relleno estándar)
          </span>
          <div className="overflow-hidden rounded-lg border border-border">
            <Section tone="muted">
              <SectionHeader eyebrow="The curatorial thesis" title="Why we preserve before we consume." />
            </Section>
          </div>
        </div>
      </CatalogSection>
    </main>
  );
}
