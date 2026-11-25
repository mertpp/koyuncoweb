# CLAUDE.md — koyuncoweb

Claude Code lee este fichero al empezar cada sesión. Es la memoria del proyecto: lo que se
decida en una conversación y tenga que durar se escribe aquí o en `doc/`, nunca solo en el
chat.

@AGENTS.md

## Qué es esto

Frontend web de **Koyun**: armario digital con IA (prendas, collections, outfits y, más
adelante, Today). Next.js 16 (canary, App Router, React 19), TypeScript estricto, Tailwind 4,
shadcn (`base-nova`) y next-auth v4 con Microsoft Entra External ID. Gestor de paquetes:
pnpm (versión fijada en `package.json`). Repo **público**: `github.com/mertpp/koyuncoweb`.

El backend es otro repo, **privado**: `koyunco` (FastAPI, `koyun-api`). En el PC del usuario
está al lado de este: `../koyunco`. Si la sesión tiene acceso (abrir Claude con
`--add-dir ../koyunco` o `/add-dir ../koyunco`), su documentación es la fuente de verdad. Si
no, `doc/backend-contract.md` resume lo necesario.

## Lee esto antes de proponer nada

1. `doc/backend-contract.md`: auth, cómo se llama a la API, errores, y los journeys J1 y J2
   con sus endpoints reales.
2. `doc/estado-y-plan.md`: qué está desfasado respecto al backend y el plan propuesto.
3. `doc/frontend-architecture.md` y `doc/frontend-governance.md`: capas `app → features →
   shared` y reglas de cambio. Se respetan.
4. `doc/DESIGN.md`, `doc/designlanguage.md`: lenguaje visual.
5. `doc/adr/`: decisiones del frontend.
6. **Design:** `doc/design-system.md` says which piece to use for what. The "Decisiones de
   KoyunCo" section of `doc/DESIGN.md` wins over the rest of that guide. Pages compose pieces
   from `src/shared/components/koyun/` and tokens; no loose sizes, margins, colours or radii
   (ESLint warns in `app/` and `features/`). If a piece is missing, create it first and
   append it to `/design`.

## Con quién trabajas

- El usuario es ingeniero de backend (Python). **El frontend no es su terreno y confía en ti
  para TypeScript.** Eso exige más, no menos:
  - explica cada decisión en lenguaje llano, sin jerga de React innecesaria;
  - elige lo aburrido y estándar antes que lo ingenioso; un patrón nuevo es un coste que él
    tendrá que mantener;
  - si algo no lo sabes de esta versión de Next.js, léelo en `node_modules/next/dist/docs/`
    (ver AGENTS.md) antes de escribirlo.
- Habla en español en la conversación. **Everything written to the repo is in English:**
  code, comments, docs and commit messages. Older Spanish docs are translated when touched.

## Reglas de trabajo (no negociables)

1. **Antes de implementar, un resumen breve de lo que vas a hacer y espera su OK.** Siempre.
   `doc/frontend-governance.md` añade: causa raíz, ficheros afectados y por qué. Su límite de
   "máximo 3 ficheros" vale para arreglos; un trabajo de journey (J1, J2) lo supera: dilo en
   el resumen, pártelo en pasos y que él decida.
2. **Cero lógica en el frontend.** Si una pantalla tiene que calcular, filtrar o decidir
   algo de negocio, es un hueco del backend: se apunta y se pide el endpoint, no se
   resuelve en TypeScript. Ejemplo real: crear el workspace por defecto lo hace
   `POST /v1/me`, no el onboarding.
3. **Endpoints reales, nunca inventados.** Si falta uno, se marca como hueco.
4. **El cliente de la API se genera del OpenAPI y no se edita a mano.** Si el contrato
   cambia, se regenera.
5. **Repo público: cero secretos.** Nada de `.env`, claves, client secrets ni IDs de tenant
   reales en código, docs o ejemplos. Solo nombres de variables (`AZURE_ENTRA_CLIENT_ID`…).
6. **Git:**
   - ramas por trabajo, integración en master por **fast-forward** (sin merge commits);
   - commit, push o merge **solo cuando él lo pida**;
   - nunca `git add -A` / `git add .`: ficheros por ruta;
   - nada destructivo (`reset --hard`, `clean`, `checkout .`, `restore .`);
   - mensajes de commit que digan lo que hacen (`feat(garment): …`).
7. **Nada de suprimir errores de tipos**: ni `any`, ni `as any`, ni `@ts-ignore`,
   ni `@ts-expect-error`. Se arregla la causa.
8. **Verde antes de commitear:** `task check` (typecheck + lint + build).

## Comandos

| Comando | Qué hace |
| --- | --- |
| `task install` | `pnpm install` |
| `task dev` / `task dev:host` | Next.js en `:3000` (`dev:host` escucha en 0.0.0.0) |
| `task check` | typecheck + lint + build. Verde antes de commitear |
| `task api:generate` | Regenera `src/shared/api/generated/schema.d.ts` desde el OpenAPI |

El usuario trabaja en el **devcontainer** (`.devcontainer/`, contenedor `koyunco-webdev`).
Está en la red Docker `koyunco-dev`, la misma que el devcontainer del backend: la API se
alcanza en `http://koyunco-dev:8004` y su contrato en `http://koyunco-dev:8004/openapi.json`.
El devcontainer está en **otro ordenador**: desde aquí no hay pnpm ni acceso a la API, así que
instalar, `task api:generate` y `task check` los ejecuta él allí. Flujo, comandos y el problema
de red pendiente: `doc/estado-y-plan.md` ("Cómo se trabaja con dos ordenadores").

## Estado y siguiente paso

Ver `doc/estado-y-plan.md`. Resumen: el backend ha cambiado (J1 con `POST /v1/me` que lo crea
todo, ADR 0036 con borradores y análisis por prenda) y este frontend aún no. Siguiente: J1 y
J2 contra el backend local, enseñárselo a 5 personas y después diseñar Today. Today es la
pantalla más importante de la app; el `dashboard` actual es una maqueta con datos de ejemplo:
no se toca hasta su diseño.
