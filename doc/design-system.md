# Design system

How to build a screen so it looks like the rest of KoyunCo without fixing paddings and
margins by hand. The visual language is defined in `doc/DESIGN.md`; its section
"Decisiones de KoyunCo" wins over everything else in that guide. The live inventory is the
`/design` page.

## The rule

Pages compose **pieces** from `src/shared/components/koyun/` and **tokens** from
`src/app/globals.css`. A page never writes its own font sizes, colours, radii, content
widths or section spacing. If a piece is missing, it is created first (see "Adding a piece").

ESLint warns in `src/app/` and `src/features/` about:

- arbitrary Tailwind values (`text-[10px]`, `max-w-[1440px]`, `shadow-[…]`);
- radii above `rounded-xl` (`rounded-2xl`, `rounded-3xl`, `rounded-4xl`);
- hex colours inside `className`.

It is a warning while the older screens (dashboard, garment detail, onboarding) are still
unmigrated; it becomes an error afterwards.

## Which piece for what

### Layout (`koyun/layout.tsx`)

| Need | Piece |
| --- | --- |
| Whole page (background, min height) | `Page` |
| Content width (max 1440px) and side margins | `Container` |
| Full-width band with the standard vertical spacing | `Section` (`tone="muted"` for the alternate band) |
| Small uppercase label above a title | `Eyebrow` |
| Eyebrow + title + italic description + actions | `SectionHeader` (`as="h1"` for the page title; `size="display"` and `align="center"` on the landing only) |

### Content (`koyun/card.tsx`, `koyun/button.tsx`, `koyun/steps.tsx`)

| Need | Piece |
| --- | --- |
| Main action | `Button` (`variant="primary"`, one per area) |
| Secondary action | `Button variant="secondary"` |
| Editorial text link | `buttonStyles("link")` on an `<a>` |
| Link that looks like a button | `<a className={buttonStyles("primary")}>` |
| Framed block of content | `Card` (`tone` default / page / muted, `elevated` for the shadow) |
| Glass label over a photo | `ImageBadge` (parent must be `relative`; `corner` top-left, bottom-left or bottom-right) |
| Colour swatches (taxonomy hex hints) | `ColorDots` |
| Label / value list | `SpecRow` inside `<dl className="flex flex-col gap-space-sm">` |
| 2–4 short facts in mono columns | `SpecGrid` |
| Gallery tile with a 3:4 photo | `GarmentCard` (`imageSrc` optional: without it the frame shows `imageAlt`; `badge="Draft"` for unsaved garments; `badgeCorner`, `cornerBadge`, `colors`; `size` default / compact / photo) |
| Gallery grid with three thumbnail sizes | `GarmentGrid` (`density` large 1/2/3, medium 2/3/4, small 3/4/6 columns) (`koyun/garment-grid.tsx`) |
| Small set of exclusive options (thumbnail size…) | `SegmentedControl` (`koyun/garment-grid.tsx`); `gridDensities` gives the size switch its icons |
| Filter chip, optional icon | `Chip` (`koyun/garment-grid.tsx`) |
| Search box with icon | `SearchField` (`koyun/filters.tsx`) |
| Pickable colour circles, several at once | `ColorSwatches` (`koyun/filters.tsx`) |
| "Refine" toggle with active-filter count | `RefineButton` (`koyun/filters.tsx`) |
| Trying variants of a screen with sample data | A design lab under `/design/…` (first one: `/design/wardrobe`). Sample data lives only there |
| Step indicator of a short guided flow | `StepHeader` (`koyun/steps.tsx`) |
| A screen that could not load | `ErrorState` (`koyun/error-state.tsx`); the error boundaries use `UnreachableState` (`koyun/unreachable.tsx`: retry + go home) |
| Garment photo gallery, photo slots, setup flow | Garment feature, not shared: `GarmentGallery`, `GarmentSetup`, `GarmentFields` (details form, shared by the review step and `EditGarment`) (`src/features/garment/components/`) |
| Form field: label, control, hint or error | `Field` + `Input` / `Textarea` / `Select` (`koyun/field.tsx`) |
| Sign-in with Microsoft Entra | `SignInButton` (`src/features/session/sign-in-button.tsx`) |

## Tokens

### Typography

| Class | Font | Use |
| --- | --- | --- |
| `text-headline-2xl` | Newsreader 60/68 (mobile 48/56) | Landing display headlines only, max 2–3 per page |
| `text-headline-xl` | Newsreader 48/56 (mobile 32/40) | Section and page titles |
| `text-headline-lg` | Newsreader 36/44 (mobile 26/34) | Card titles in feature blocks, quotes |
| `text-headline-md` | Newsreader 24/32 | Card titles, logo |
| `text-headline-sm` | Newsreader 20/28, 500 | Italic section descriptions |
| `text-body-lg` | Geist 16/26 | Lead paragraphs |
| `text-body-md` | Geist 14/22 | Default body text |
| `text-body-sm` | Geist 12/18 | Small print |
| `text-label-md` | Geist 13/18, 500 | Buttons, navigation |
| `text-label-sm` | Geist 11/16, 500 | Eyebrows, spec labels (with `uppercase`) |
| `text-tech-md` | JetBrains Mono 12/16, uppercase | Values in spec grids |
| `text-tech-sm` | JetBrains Mono 10/14, uppercase | Meta lines, badges, footnotes |

Headings (`h1`–`h4`) get the serif font and the `ink` colour automatically.

### Colour

Use the semantic names, never hex: `bg-background`, `bg-surface-container-lowest` /
`-low` / (none) / `-high`, `text-foreground`, `text-muted-foreground`, `text-ink`,
`bg-primary` / `text-primary-foreground`, `border-border`. Dark mode comes from the same
names. The Stitch → ours mapping is in `doc/DESIGN.md`.

### Radius

`rounded-sm` 4px (badges, checkboxes) · `rounded-md` 6px (inner panels, inputs) ·
`rounded-lg` 8px (**base**: cards, buttons, images) · `rounded-xl` 12px (modals and popovers
only) · `rounded-full` (chips, status dots). Nothing larger; buttons are not pills.

### Spacing

`space-xs`, `space-sm`, `space-md`, `space-lg`, `space-xl` for gaps and paddings inside
blocks; `gutter` between grid columns; `margin*` are used by `Container`. Section spacing
belongs to `Section`, not to the page.

### Elevation

`shadow-elevated`: the only shadow. Applied by `Card elevated`.

## Adding a piece

1. Check that no existing piece (or a variant of one) covers it.
2. Write it in `src/shared/components/koyun/` using only tokens, with a one-line comment
   saying what it is for. Variants are a small map of class names, not free `className`
   props for colours or sizes.
3. Append an example to `/design` (`src/app/(app)/design/page.tsx`). Append only: the
   existing sections are not reorganised.
4. Add it to the tables above.

## Known exceptions

- Landing, "The Sanctuary of Considered Clothing": the title block is written out instead of
  `SectionHeader`, because its lead paragraph is plain `body-lg`, not italic. If the pattern
  repeats, it becomes a `SectionHeader` variant.
- `GarmentCard` uses a plain `<img>` until the photo hosts are configured for `next/image`
  (J2).
