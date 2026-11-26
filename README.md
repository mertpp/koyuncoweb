# koyuncoweb

Web frontend for **Koyun**, an AI-powered digital wardrobe: photograph a garment, let Koyun
read it, keep it in your wardrobe. Collections, outfits and the daily "Today" view come next.

Next.js 16 (App Router, React 19), strict TypeScript, Tailwind 4, `@base-ui/react` styled
with our own pieces, and next-auth v4 with Microsoft Entra External ID. The backend
(`koyun-api`, FastAPI) lives in a separate private repository.

## Getting started

Development runs in the devcontainer (`.devcontainer/`), on the same Docker network as the
backend devcontainer, which serves the API at `http://koyunco-dev:8004`.

```bash
task install   # pnpm install
task dev       # http://localhost:3000
task check     # typecheck + lint + build: green before every commit
```

Configuration comes from environment variables in a local `.env` that is **never
committed** (this repository is public). The names the app reads are in `src/auth.ts`,
`src/proxy.ts` and `src/shared/api/`.

When the API contract changes, regenerate its types with the backend running:

```bash
task api:generate
```

## Documentation

- `CLAUDE.md` and `AGENTS.md`: working rules for this repository.
- `doc/estado-y-plan.md`: status, plan, debt and backend gaps.
- `doc/backend-contract.md`: auth, API calls, errors and the journeys.
- `doc/frontend-architecture.md`, `doc/frontend-governance.md`: layers and change rules.
- `doc/design-system.md`, `doc/DESIGN.md`: which piece to use for what, and the visual language.
- `doc/adr/`: frontend decisions.

## CI

GitHub Actions runs `task check` on every push (`.github/workflows/ci.yml`). Actions are
pinned by commit SHA; Dependabot proposes upgrades weekly.
