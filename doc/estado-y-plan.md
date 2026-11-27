# Frontend status and plan

The single place for what has been done, what is next and what is pending. First review:
2026-11-25, from the backend session, reading this repo (commit `691bede`) against koyun-api
(`master`, `d5bbe5e`). It is a snapshot: **check each point against the code before acting**,
and strike out or fix what is no longer true. Last update: 2026-11-27, after J2, D15 (details), cleanup and CI.

## What is done (history)

All integrated into `master` by fast-forward; one branch per piece of work.

| Step | What | Commits |
| --- | --- | --- |
| 0 | **Generated API client.** `openapi-typescript` and `task api:generate` against `http://koyunco-dev:8004/openapi.json` → `src/shared/api/generated/schema.d.ts` (never edited by hand; ignored by ESLint). See "Cliente tipado" in `doc/backend-contract.md` | `7d1ffd0` |
| 0.5a | **Design tokens.** Text styles as Tailwind utilities (`text-headline-2xl` … `text-tech-sm`, with mobile sizes), radii back to the standard scale with an 8px base, `ink` colour, `shadow-elevated`, `max-w-page`. Stitch → our colour names in `doc/DESIGN.md`, "Decisiones de KoyunCo" | `b25bc5e` |
| 0.5b | **Pieces and rules.** `src/shared/components/koyun/`: `Page`, `Container`, `Section`, `Eyebrow`, `SectionHeader`, `Button` / `buttonStyles`, `Card`, `ImageBadge`, `SpecRow`, `SpecGrid`, `GarmentCard`. Landing at `/` rebuilt with them (approved against a token-only copy). `/design` is the inventory of the visual language (append only). `doc/design-system.md`. ESLint warns in `app/` and `features/` about arbitrary values, hex colours and `rounded-2xl`+. `cn()` from `clsx` + `tailwind-merge` aware of our tokens (D11). `/testpage` deleted (D9). shadcn removed: package, `components.json`, CSS import; the state variants `ui/*` uses (`data-open:` …, `no-scrollbar`) live in `globals.css` | `41e4314` … `c1ec6ba` |
| J1 | **Onboarding.** `ensureProfile()` / `POST /v1/profile` removed (R1). Profile and workspace types from the generated schema (`src/shared/api/schemas.ts`). Three steps: greeting with the Entra name (read only), where you live (city, country as ISO code), personal statement; one `PATCH /v1/profile` per step, skippable, "Start" always sets `onboarding_completed_at`. Ends in the workspace from `GET /v1/workspaces`, never creates one (R2, onboarding part). `Field`, `Input`, `Textarea`, `Select` pieces. `nav-user` through the feature API (D8). `/profile`: display name read only | `92737c5` … `5776963` |
| J2 | **Add garment.** Garment and taxonomy APIs on the generated types (R5). One set of routes under `/workspaces/{id}/garments` (D5). `GarmentSetup`: photos (Front, Back, Label, Detail) → analysis polled every 3 s → review prefilled by the backend → `PATCH status=active`; discard, retry, resume at `/{garmentId}/setup` (R2, R3). Wardrobe with "Pending drafts" (Draft badge) and saved garments. Detail page rebuilt with real data only | `fdb62bc` … `5516114` |
| D16 | **Friendly error screen.** `ErrorState` and `UnreachableState`; `(shell)/error.tsx`, root `error.tsx`, `global-error.tsx` | `e1c1432` |
| Fix | **Profile name read on the server.** `AppShell` reads the profile once per page; `NavUser` no longer calls `/v1/profile` from the browser on every session change | `62437e2` |
| D15a | **Edit a saved garment's details.** `GarmentFields` shared by the J2 review and `EditGarment` (`/{garmentId}/edit`, plain `PATCH`) | `c17172a` |
| Cleanup | **D2, D3, D4, D6, D7.** `/v1/*` rewrite removed, `@clerk/nextjs` removed, demo login leftovers deleted, README, GitHub Actions running `task check` on every push plus Dependabot | `4bc7d58`, `1d93286` |

Product decisions taken along the way:

- The onboarding asks the minimum. Colours and materials are learned from the wardrobe
  (vision extracts them); body data only when a feature needs it, explained and optional;
  work, travel and activity from Today when the context asks; birth year and gender are not
  asked (nothing uses them). Everything stays editable in `/profile`.
- The display name comes from Entra. The frontend shows it and never edits or sends it.
- Until Today exists, the onboarding ends in the wardrobe.
- Everything written to the repo is in English (code, comments, docs, commits).

## Next: J2 — add garment → photos → analyse → save

Branch `feat/j2-add-garment` (one branch for the whole journey, one commit per step, each
leaving the app working). Contract: `doc/backend-contract.md`, J2.

What exists today:

| Piece | State |
| --- | --- |
| `garments/new/page.tsx` (792 lines) | Creates the garment with title and type, uploads **one** photo, no analysis (R3). Creates a workspace if none (R2) |
| `garments/page.tsx` (786) and `garment-photo-gallery.tsx` (523) | Create a "Personal" workspace if none (R2) |
| `garments/[garmentId]/page.tsx` (1177) | Detail. Hand-written types: `title` always present, `null` in a draft (R5) |
| `shared/api/koyun-api.ts` | Old API layer (D1), including `createBrandCandidate` against a removed endpoint (R4) |
| Routes | Duplicated: `/garments/...` and `/workspaces/[id]/garments/...`; the second only re-exports the first (D5) |
| All four screens | Client components with many loose values (~130 lint warnings) |

Plan:

1. **Garment API in `features/garment`** on generated types: create draft (`POST …/garments`
   with `{}`), upload and delete photos, request analysis (`POST …/analysis`) and read it
   (`GET …/analysis`), read garment, activate (`PATCH` with `status: "active"`), discard
   (`DELETE`), list with `?status=draft|active`. Removes R4, R5 and the unused parts of
   `koyun-api.ts`.
2. **Single routes (D5).** Everything under `/workspaces/[id]/garments/...`; `/garments...`
   redirects to the workspace from `GET /v1/workspaces`, never creates one. Closes R2.
3. **Add flow** in one screen `/workspaces/[id]/garments/[garmentId]/setup`, in phases:
   - Photos: up to 4, each with a kind. "Next" requests the analysis.
   - Analysing: poll every 3 s until `completed` or `failed`. On failure: "Retry" (same
     `POST`) or "Start again" (`DELETE` and back to the wardrobe).
   - Review: form filled by vision (title, type, colours, materials, brand with
     autocomplete from `GET /v1/catalog/brands?query=`, dropdowns from `GET /v1/taxonomy/*`).
     "Save" activates; a 422 with `details.missing` marks what is missing.
   - "Discard" at any phase.
   - "Add garment" creates the draft and opens this screen.
4. **Wardrobe.** Garment list rebuilt with `GarmentCard`, plus a "Pending" block with drafts
   to resume.
5. **New pieces** that come up (photo picker, colour/material chips, loading state) in
   `koyun/` and `/design`.

Decisions taken:

| Decision | Choice |
| --- | --- |
| Garment detail page | Rebuilt with the pieces in this branch (one more step, tested together with the flow) |
| Photo kinds offered (backend accepts 14) | Front, Back, Label, Detail for now; the first photo defaults to `front` |
| Draft label | Unsaved garments (`status: "draft"`) show a "Draft" badge in a "Pending drafts" section, never in the wardrobe. "Incomplete" for saved garments waits for backend gap B2 |

Progress:
- Step 1 done: garment API on generated types (`src/features/garment/api.ts`, `types.ts`),
  photo helpers (`photos.ts`), taxonomy API (`src/features/taxonomy/`).
- Step 2 done: the only garment routes are `/workspaces/{id}/garments`, `/new` and
  `/{garmentId}`; `/garments/*` redirect there (`wardrobePath()` in
  `src/features/workspace/server.ts`). No screen creates a workspace any more (R2 closed).
  The wardrobe list (step 4) was written with it, since the redirect needs a target; drafts
  link to `/{garmentId}/setup`, built in step 3.
- Step 3 done: `GarmentSetup` (`src/features/garment/components/garment-setup.tsx`) on
  `/new` and `/{garmentId}/setup`. Photos (the first upload creates the draft and the URL
  switches to `/setup`) -> analysing (poll every 3 s) -> review prefilled by the analysis ->
  `PATCH status=active`. Discard, retry after a failure and "change photos" (reanalyse).
  422 errors land on their field (`describeApiError` in `src/shared/api/errors.ts`, shared
  with the onboarding). R3 closed.
- Step 5 done: the garment detail rebuilt with real data only (gallery, size, condition,
  date, colours, materials, notes, delete with confirmation). The old page was all sample
  data (weather, ratings, pairings, outfits) and is gone, with `garment-photo-gallery.tsx`.
  A draft opened here goes to `/setup`. A saved garment is edited at `/edit` (D15).
- Step 6 done: `StepHeader` (`koyun/steps.tsx`, used by onboarding and add garment) and
  `GarmentCard` without photo / with the Draft badge, in `/design` and `design-system.md`.
- J2 test on the devcontainer, fixes so far: `source` required by the generated type on
  create; the screen did not move to review when the analysis completed (it cancelled its
  own polling); "Change photos" also while analysing (F1); errors without a backend message
  show the HTTP status.

## Broken against the backend

| # | What | Where | Status |
| --- | --- | --- | --- |
| ~~R1~~ | ~~`ensureProfile()` called `POST /v1/profile`~~ | | Done in J1 |
| ~~R2~~ | A "Personal" workspace is created if there is none: business logic in the frontend; `POST /v1/me` already creates "My Wardrobe" | `garments/page.tsx:116`, `garments/new/page.tsx:140`, `garment-photo-gallery.tsx:145` | Done (J1 and J2 step 2) |
| ~~R3~~ | Create garment = `POST …/garments` with title and type, then **one** photo. Now a garment is always born a draft, takes up to 4 photos, the user requests the analysis and saving is a `PATCH` with `status: "active"` | `garments/new/page.tsx`, `koyun-api.ts` | Done (J2 step 3) |
| ~~R4~~ | ~~`POST /v1/catalog/brand-candidates` no longer exists~~ | | Done in J2: a free brand goes in `brand_raw` |
| ~~R5~~ | ~~Hand-written garment types~~ | | Done in J2: types from the generated schema |

## Debt

| # | What | Proposal |
| --- | --- | --- |
| D1 | Two API layers: `src/shared/api/koyun-api.ts` (domain functions inside `shared`, against the "shared knows no garment" rule) and `src/features/*/api.ts` | Feature APIs on the generated types; empty `koyun-api.ts` feature by feature (J2 does garments) |
| ~~D2~~ | ~~`next.config.ts` rewrote `/v1/*` straight to the backend, without a token~~ | Done: removed. The browser only goes through `/api/backend` |
| ~~D3~~ | ~~`@clerk/nextjs` in `package.json`, unused~~ | Done (`1d93286`) |
| ~~D4~~ | ~~Demo login leftovers~~ | Done: `api/auth/demo-login`, `shared/auth/session.ts` and `shared/auth/access-token.ts` deleted. `AUTH_COOKIE_NAME` and `api/auth/logout` (which only deletes that old cookie) stay until D18, which redesigns logout |
| ~~D5~~ | ~~Duplicated garment routes~~ | Done in J2 |
| ~~D6~~ | ~~`README.md` was the `create-next-app` one~~ | Done |
| ~~D7~~ | ~~No CI~~ | Done: `.github/workflows/ci.yml` runs `task check` on every push (actions pinned by SHA, fake auth variables for the build); `.github/dependabot.yml` for actions and npm (Next.js and React excluded: pinned canary) |
| ~~D8~~ | ~~`nav-user.tsx` had its own `fetch`~~ | Done in J1 |
| ~~D9~~ | ~~`/testpage`~~ | Done in 0.5b |
| D10 | ~285 lint warnings: `<img>` and loose values in dashboard, garment screens, collections, `/profile`, workspaces | Go down as screens are rebuilt; the design rule becomes an error at zero. Dashboard not touched until Today is designed |
| ~~D11~~ | ~~`cn` npm package~~ | Done in 0.5b (`clsx` + `tailwind-merge`) |
| D12 | `ui/*` components (sidebar, select, dropdown…) still in the shadcn style | Rebuild with our pieces over `@base-ui/react` as J2 and later screens need them |
| D13 | `/profile` page still in the old style (only the name field changed) | Rebuild with `Field` and friends when touched |
| D14 | Older docs in Spanish (`backend-contract.md`, `frontend-architecture.md`, `frontend-governance.md`, `designlanguage.md`, parts of `DESIGN.md` and `CLAUDE.md`) | Translate to English when touched |
| ~~D15~~ | ~~Editing a saved garment~~ | Done: details only (`c17172a`). **Decision:** once saved, photos are the truth. Details are editable; photos are not, and a saved garment is never re-analysed. Wrong photos: delete the garment and add it again. The frontend already enforces it (`/setup` redirects saved garments to their page) |
| ~~D16~~ | ~~Backend down shows the raw Next.js error page~~ | Done in J2: `(shell)/error.tsx`, root `error.tsx` and `global-error.tsx` show `UnreachableState` (one calm message for any unexpected failure; validation errors and 404s keep their own handling). Pending: "Go to home" points to `/`, which goes through `/onboarding/continue`; point it to Today once Today exists |
| ~~D17~~ | ~~In dev, every open tab reloads every second~~ | Gone after clearing the cache; reopen if it comes back |
| D18 | Auth and tokens are not enterprise grade. Today next-auth v4 keeps the Azure tokens encrypted inside the session cookie (`strategy: "jwt"`): a refresh done while rendering a page cannot be saved (only `/api/auth/session` writes the cookie), so requests after expiry refresh again; a failed refresh (`RefreshAccessTokenError`) is never acted on, the expired token reaches the API and pages fail with 401; the session cannot be revoked from the server; logout does not end the Entra session; no idle or absolute session timeout. | **Do not patch in the web alone.** Design one auth model for every client (web, mobile, API): who holds the tokens (BFF with a server-side session store vs. the backend issuing its own session), single refresh with a lock, refresh token rotation, revocation, Entra logout, session timeouts, audit of login events. Decide in an ADR shared with the backend, then implement |

## Backend gaps (found from the frontend)

| # | Gap | Why |
| --- | --- | --- |
| B1 | `POST /v1/me` stores the Entra name in the **account** (`accounts/service.py`, `identity.display_name`) but leaves `profile.display_name` as `null` (asserted in `test_accounts_integration.py`), and `AccountRead` does not expose it | The name comes from Entra and the frontend never sits in between. Until the backend copies it into the profile (or exposes it), the onboarding and `/profile` show the session name, read only, and send nothing. The frontend already reads `profile.display_name` first, so no frontend change is needed after the fix |
| B2 | No signal for a saved garment with optional fields still empty (material, season…) | Deciding which fields count is business logic. If an "Incomplete" label is wanted, the backend exposes it (`is_complete` or `missing_fields` on `GarmentListItemRead`); until then the frontend shows nothing |
| B3 | `GarmentListItemRead` and `GarmentDraftItemRead` carry no photo | The wardrobe asks for each garment's photos to draw its card (N+1 calls). A `cover_photo_url` (or thumb) on the list items removes them |
| B4 | `POST /analysis` commits a `pending` analysis, then enqueues; if the queue (Redis) is down the job is lost, the analysis stays `pending` and every new launch returns that same one for 10 min (`analysis_pending_timeout_seconds`). `GET /analysis` never expires a stale `pending` | Seen in the J2 test with Redis unreachable: the screen waits forever. Fix: on enqueue failure mark it `failed` and answer 503 with a message; let `GET` report a `pending` older than the timeout as `failed` (the timeout stays a backend rule). No frontend change needed (the 503 message and the `failed` state already show) |
| B5 | `delete_garment` deletes the photo blobs before the commit and without retry | A failed commit leaves a garment without photos; a failed blob delete leaves orphan blobs. Usual fix: delete blobs after the commit, plus a cleanup job for orphans |
| ~~B7~~ | ~~A new analysis of a saved garment changes nothing~~ | Closed by the D15 decision: saved garments are never re-analysed |
| B8 | `GarmentListItemRead` carries no display data for the card: no brand name (`brand_raw` or the catalogue name), colours or size | These already exist on the garment (`GarmentRead`); the list only has to return them. Until then the wardrobe card can label the category only |
| B9 | The wardrobe cannot be filtered by category or sorted, and returns no counts | Filtering, counting and sorting are backend work (`?garment_type=`, `?sort=`, counts per type). Category chips are only tried in the design lab |
| B6 | Profile `city` accepts 120 characters | Product wants a shorter limit (60 proposed). Backend change (`max_length` + migration), then regenerate; the form already shows the backend error |

## Out of scope now

- **Dashboard / Today** (`src/app/(app)/(shell)/dashboard/`): editorial mock with sample
  data. Today gets its own journey; not touched. It looks off since the radius change in
  0.5a; expected until its redesign.
- **Collections and outfits:** redesigned from scratch in the backend (J3). Keep what works,
  no investment.

## Roadmap after J2

1. ~~**Cleanup:** D2, D3, D4, D6.~~ Done.
2. ~~**CI** (D7).~~ Done.
3. **Now:** redesign of the garments pages, branch `feat/wardrobe-redesign`. Step 1: design
   lab `/design/wardrobe` with sample data and live switches (thumbnail size, photo label,
   size label, text below, colours, category chips, drafts); the user picks, then the
   choice moves to the real wardrobe with real data (B3, B8, B9 for what the list lacks). Scope frozen until the 5-person test: only J1,
   J2 and their bugs; new ideas go to this document, not to the code. Backend gaps are
   handled in the backend repo.
4. Show J1 and J2 to 5 people. B4 first (it is what can break a demo), B3 if the
   wardrobe will hold more than a few garments.
5. Design **Today**; then the onboarding ends there instead of the wardrobe.

## Environment: the network between the two devcontainers

The web devcontainer (`koyunco-webdev`) joins the Docker network `koyunco-dev`, but the
backend one (`koyunco/.devcontainer/devcontainer.json`) is only named `koyunco-dev` and does
**not** join it. Result: `ENOTFOUND koyunco-dev` from the web (seen when generating the
schema).

- Temporary fix (lost when the backend container is recreated):
  `docker network connect koyunco-dev koyunco-dev`.
- Permanent fix, pending OK in the `koyunco` repo: `"runArgs": ["--name", "koyunco-dev",
  "--network", "koyunco-dev"]`. The network is created once per machine:
  `docker network create koyunco-dev`.
- The API must listen on `0.0.0.0:8004`, not `127.0.0.1`.

## Working with two computers

- **Work PC (Windows, no pnpm, no npm registry):** Claude edits code and docs, commits and
  pushes the branch. It cannot install dependencies, generate the schema or run
  `task check`.
- **Devcontainer PC:** `git pull`, `pnpm install` or `pnpm add`, `task api:generate`,
  `task check`. What it generates (`pnpm-lock.yaml`, `schema.d.ts`) is committed there, file
  by file, and pushed.
- Integration into `master` by fast-forward once `task check` is green.
- `node_modules` is hidden in the VS Code explorer (`files.exclude` in
  `.devcontainer/devcontainer.json`) and pnpm links packages, so use `find -L` to search it.

Usual commands in the devcontainer:

```
git fetch --prune                      # fetch branches, forget the ones deleted on GitHub
git switch <branch> && git pull --ff-only
task install                           # if package.json changed
task api:generate                      # if the backend changed (backend running)
task check                             # green before committing
git add <file> <file> …                # always by path
git commit -m "type(scope): what it does"
git push

# if styles do not change after a pull (new classes or variables from globals.css
# missing): Turbopack cache. Stop task dev and:
rm -rf .next                           # build cache only; regenerated
task dev                               # and reload with Ctrl+Shift+R

# after integrating a branch into master
git switch master && git pull --ff-only
git branch -d <branch>                 # -d (not -D): only deletes if already integrated
git push origin --delete <branch>      # if still on GitHub
```
