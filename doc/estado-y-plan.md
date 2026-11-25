# Estado del frontend y plan

Revisión hecha el 2026-11-25 desde la sesión del backend, leyendo el código de este repo
(commit `691bede`) contra koyun-api (`master`, `d5bbe5e`). Es una foto: **verifica cada punto
en el código antes de actuar**, y tacha o corrige lo que ya no sea cierto.

## Lo que está bien y se conserva

- **Auth en el servidor:** next-auth v4 + Entra External ID (`src/auth.ts`), token solo en la
  sesión, refresh del token, y `POST /v1/me` en el `signIn`. Es el patrón correcto.
- **Proxy autenticado** para el navegador: `src/app/api/backend/[...path]/route.ts`.
- **`src/proxy.ts`** redirige a login si no hay sesión.
- **Capas `app → features → shared`** documentadas en `doc/frontend-architecture.md`.
- **`shared/api/core.ts`:** timeout, `ApiError` con `status` y `body`.

## Desfasado respecto al backend (rompe hoy)

| # | Qué | Dónde | Por qué falla |
| --- | --- | --- | --- |
| R1 | `ensureProfile()` llama a `POST /v1/profile` | `src/features/profile/api.ts`, usado en `onboarding/profile/page.tsx`, `onboarding/profile/actions.ts`, `onboarding/continue/page.tsx`, `(shell)/profile/page.tsx` y `(shell)/profile/actions.ts` | El endpoint ya no existe: el perfil lo crea `POST /v1/me`. El onboarding falla al guardar |
| R2 | Se crea un workspace "Personal" si no hay | `src/app/onboarding/profile/actions.ts`, `src/app/(app)/(shell)/garments/page.tsx:116`, `src/features/garment/components/garment-photo-gallery.tsx:145` | Lógica de negocio en el frontend. El backend ya crea "My Wardrobe" en `POST /v1/me`: basta con `GET /v1/workspaces` |
| R3 | Crear prenda = `POST …/garments` con título y tipo, y después **una** foto | `src/app/(app)/(shell)/garments/new/page.tsx`, `src/shared/api/koyun-api.ts` | Ahora la prenda nace siempre borrador, admite hasta 4 fotos, el análisis lo lanza el usuario (`POST …/analysis`) y guardar es `PATCH` con `status: "active"`. Falta todo el flujo de J2 |
| R4 | `POST /v1/catalog/brand-candidates` | `src/shared/api/koyun-api.ts` | Ya no existe (catálogo de solo lectura). La marca libre va en `brand_raw` |
| R5 | Tipos escritos a mano que no cuadran (confirmado en el schema generado: `GarmentRead.title` y `garment_type_id` son `string \| null`) | `Garment` en `src/shared/api/koyun-api.ts` (`title: string`, `garment_type_id: string`) | En un borrador son `null`. Al generar el cliente del OpenAPI desaparece toda esta clase de errores |

## Deuda (no rompe, pero estorba)

| # | Qué | Propuesta |
| --- | --- | --- |
| D1 | Dos capas de API en paralelo: `src/shared/api/koyun-api.ts` (funciones y tipos de dominio **dentro de `shared`**, contra la propia regla "shared no conoce garment") y `src/features/*/api.ts` | Que los `features/*/api.ts` usen el cliente generado y vaciar `koyun-api.ts` poco a poco, feature a feature |
| D2 | `next.config.ts` tiene un `rewrite` de `/v1/*` directo al backend, sin token, además del proxy autenticado `/api/backend` | Comprobar si algo lo usa; si no, quitarlo. Una sola puerta |
| D3 | `@clerk/nextjs` en `package.json` sin usar (la auth es next-auth) | Quitar la dependencia |
| D4 | Restos del login de demo: `src/app/api/auth/demo-login/route.ts` (devuelve 404), `src/shared/auth/session.ts` (funciones que devuelven `null`/`false`), `AUTH_COOKIE_NAME` | Borrar si nada los usa |
| D5 | Rutas duplicadas: `/garments/new` y `/workspaces/[id]/garments/new`, `/garments/[id]` y `/workspaces/[id]/garments/[id]` | Quedarse con una al rehacer J2 |
| D6 | `README.md` es el de `create-next-app` | Reescribirlo: qué es, cómo arrancar, enlace a `CLAUDE.md` |
| D8 | `src/components/layout/nav-user.tsx:61` llama a `/v1/profile` con su propio `fetch`, saltándose la capa de API | Pasarlo a `features/profile` en J1 |
| ~~D9~~ | ~~`/testpage` route with no known use~~ | Done in 0.5b: deleted, replaced by `/design` |
| D10 | 14 avisos de lint (`<img>`, variables sin usar) en `dashboard/_blocks/*` y `(app)/page.tsx` | No se tocan hasta diseñar Today |
| D11 | `cn()` sale del paquete npm `cn` (`src/shared/lib/utils.ts`), no de `clsx` + `tailwind-merge` como en shadcn. Sin `tailwind-merge`, si dos clases chocan (`p-2` y `p-4`) no gana la última de forma fiable | Verificar qué es ese paquete; lo estándar es `clsx` + `tailwind-merge` |
| D7 | Sin CI | GitHub Actions con `task check`. Repo público: gratis. Mismo esquema que el backend (actions fijadas por SHA, Dependabot) |

## Fuera de alcance ahora

- **Dashboard / Today** (`src/app/(app)/(shell)/dashboard/`): maqueta editorial con datos de
  ejemplo. Today tendrá su propio journey; no se toca.
- **Collections y outfits:** se rediseñan desde cero en el backend (J3). Mantener lo que hay
  funcionando, sin invertir.

## Plan propuesto (cada paso en su rama; resumen y OK antes de cada uno)

0. ✅ **Hecho (2026-11-25, `7d1ffd0`).** ~~**Cliente generado del OpenAPI.** `openapi-typescript` + script `pnpm api:generate`
   contra `http://koyunco-dev:8004/openapi.json`. Base para todo lo demás (R5).~~ Ver "Cliente tipado" en `doc/backend-contract.md`.
0.5. **Sistema de diseño (antes que nada más).** Decisiones en `doc/DESIGN.md`, sección
   "Decisiones de KoyunCo". Objetivo: que una página nueva, hecha por IA o a mano, salga igual
   sin corregir márgenes.
   - ✅ **0.5a Tokens** (hecho 2026-11-25, `task check` en verde; catálogo en `/design`): estilos de texto de la guía como clases de Tailwind (`text-headline-xl`…
     con tamaño, interlineado, tracking y versión móvil); radios a la escala estándar de
     Tailwind (hoy `globals.css:91-97` la redefine: `lg`=16px, `xl`–`4xl`=24px); tabla de
     nombres de color Stitch → nuestros. Afecta a todas las pantallas (menos redondeo).
   - **0.5b Pieces and rules** (in progress, branch `feat/design-pieces`): done — layout and
     content pieces, landing at `/` rebuilt with them, `/design` inventory, `doc/design-system.md`,
     CLAUDE.md rule, ESLint warnings, `/testpage` deleted. Pending — remove shadcn (needs the
     contents of `shadcn/tailwind.css` first), rebuild `ui/*` with our pieces.
     Original plan: `Page`, `PageHeader`, `Section`, `Stack`, `Grid`, `Eyebrow`,
     `SpecList`, `GarmentCard`… en `src/shared/components/koyun/`, sacadas de la landing;
     página `/design` con todas montadas (sustituye a `/testpage`, D9); `doc/design-system.md`;
     regla en `CLAUDE.md`; ESLint que avisa de valores sueltos (`text-[10px]`, hex,
     `rounded-2xl`+) en `app/` y `features/`, que pasa a error cuando esté migrado.
   - Medición inicial de valores sueltos: detalle de prenda 72, landing 49, onboarding 40.
   - Opcional: migrar la landing a las piezas como prueba de que la reproducen.
1. **J1.** Onboarding solo con `PATCH /v1/profile` (fuera R1 y R2); destino tras login según
   `onboarding_completed_at`; workspace desde `GET /v1/workspaces`.
2. **J2.** Flujo completo: borrador → fotos (máx. 4) → "Siguiente" (`POST …/analysis`) →
   "Analizando" con sondeo → formulario relleno → "Guardar" (`PATCH` activo, 422 con
   `details.missing`) + fallo (reintentar / empezar de nuevo) + descartar + borradores
   pendientes (R3, R4, D5).
3. **Limpieza:** D2, D3, D4, D6, D9.
4. **CI** (D7).

Después: enseñar J1 y J2 a 5 personas, y diseñar Today.

## Entorno: la red entre los dos devcontainers

El devcontainer web (`koyunco-webdev`) se une a la red Docker `koyunco-dev`, pero el del
backend (`koyunco/.devcontainer/devcontainer.json`) solo se llama `koyunco-dev` y **no** se une
a esa red. Resultado: `ENOTFOUND koyunco-dev` desde el web (pasó al generar el schema).

- Arreglo temporal (se pierde al recrear el contenedor del backend):
  `docker network connect koyunco-dev koyunco-dev`.
- Arreglo definitivo, pendiente de OK en el repo `koyunco`: `"runArgs": ["--name",
  "koyunco-dev", "--network", "koyunco-dev"]`. La red se crea una vez por máquina:
  `docker network create koyunco-dev`.
- La API tiene que escuchar en `0.0.0.0:8004`, no en `127.0.0.1`.

## Cómo se trabaja con dos ordenadores

- **PC de trabajo (Windows, sin pnpm ni registro npm):** Claude edita código y docs, hace commit
  y push de la rama. No puede instalar dependencias, generar el schema ni pasar `task check`.
- **PC con el devcontainer:** `git pull`, `pnpm install` o `pnpm add`, `task api:generate`,
  `task check`. Lo que genere (`pnpm-lock.yaml`, `schema.d.ts`) se commitea ahí, fichero por
  fichero, y se hace push.
- Integración en `master` por fast-forward cuando `task check` está en verde.

Comandos habituales en el devcontainer:

```
git fetch --prune                      # traer ramas y olvidar las borradas en GitHub
git switch <rama> && git pull --ff-only
task install                           # si cambió package.json
task api:generate                      # si cambió el backend (con el backend levantado)
task check                             # verde antes de commitear
git add <fichero> <fichero> …          # siempre por ruta
git commit -m "tipo(ámbito): qué hace"
git push

# si tras un pull los estilos no cambian (faltan clases o variables nuevas de
# globals.css): es la caché de Turbopack. Parar task dev y:
rm -rf .next                           # solo caché de compilación; se regenera
task dev                               # y recargar con Ctrl+Shift+R

# tras integrar una rama en master
git switch master && git pull --ff-only
git branch -d <rama>                   # -d (no -D): solo borra si ya está integrada
git push origin --delete <rama>        # si sigue en GitHub
```
