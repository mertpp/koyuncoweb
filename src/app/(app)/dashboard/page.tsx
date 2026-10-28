import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  CloudIcon,
  MoonIcon,
  RotateCcwIcon,
  SparklesIcon,
} from "lucide-react";

const outfitPieces = [
  {
    code: "COAT-01",
    name: "Vicuña Coat",
    brand: "Loro Piana",
    tone: "from-[#c4a27e] to-[#efe7dc]",
  },
  {
    code: "KNT-04",
    name: "Ribbed Cashmere",
    brand: "The Row",
    tone: "from-[#d8ccbb] to-[#f6f0e6]",
  },
  {
    code: "TR-08",
    name: "Twisted Chino",
    brand: "Lemaire",
    tone: "from-[#6b6e68] to-[#d8d5ce]",
  },
  {
    code: "SH-02",
    name: "Cordovan Blucher",
    brand: "Alden 990",
    tone: "from-[#4b241c] to-[#d9c1aa]",
  },
];

const healthCards = [
  {
    title: "In Circulation",
    value: "14",
    description: "garments active this week",
    marker: "●",
  },
  {
    title: "Fiber Resting",
    value: "28",
    description: "wool and knitwear pieces staged",
    marker: "☾",
  },
];

export default function DashboardPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-1 py-4 pb-24 md:py-8 md:pb-8">
      <header className="space-y-4">
        <h1 className="font-heading text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
          Good morning, Julian.
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground md:text-base">
          <CalendarDaysIcon className="size-4 text-primary" />
          <span>Thursday, 24 Oct</span>
          <span>·</span>
          <span>Milan (15°C, Overcast)</span>
        </div>
      </header>

      <article className="rounded-[1.75rem] border bg-card p-5 shadow-[0_2px_8px_-2px_rgba(28,30,29,0.04),0_12px_24px_-4px_rgba(28,30,29,0.06)] md:p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-3xl tracking-[-0.02em]">
              Today&apos;s Outfit
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground md:text-base">
              Temperate layering for overcast weather.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
            <CloudIcon className="size-4" />
            Overcast 15°C
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {outfitPieces.map((piece) => (
            <div key={piece.code} className="min-w-0">
              <div
                className={`relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br ${piece.tone}`}
              >
                <div className="absolute left-2 top-2 rounded bg-background/85 px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.18em] text-foreground backdrop-blur md:text-xs">
                  {piece.code}
                </div>
              </div>

              <div className="mt-3 min-w-0">
                <h3 className="truncate text-sm font-semibold md:text-base">
                  {piece.name}
                </h3>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {piece.brand}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 rounded-2xl bg-muted p-4 md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <SparklesIcon className="mt-1 size-5 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-foreground md:text-base">
                Fiber balance: 70% Wool, 25% Cashmere, 5% Cordovan
              </p>
            </div>

            <div className="shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <p>Index</p>
              <p className="mt-1 text-foreground">98/100</p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            <CheckCircle2Icon className="size-5" />
            Confirm Today&apos;s Wear
          </button>

          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-muted px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:min-w-36">
            <RotateCcwIcon className="size-5" />
            Shuffle
          </button>
        </div>
      </article>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Wardrobe Cadence & Health
          </h2>

          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            44 Total Assets
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {healthCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="mt-2 font-heading text-4xl tracking-[-0.03em]">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>

                <span className="text-primary">
                  {card.marker === "☾" ? (
                    <MoonIcon className="size-5" />
                  ) : (
                    card.marker
                  )}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
