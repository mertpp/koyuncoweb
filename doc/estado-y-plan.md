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
| R1 | `ensureProfile()` llama a `POST /v1/profile` | `src/features/profile/api.ts`, usado en `src/app/onboarding/profile/actions.ts` | El endpoint ya no existe: el perfil lo crea `POST /v1/me`. El onboarding falla al guardar |
| R2 | El onboarding crea un workspace "Personal" si no hay | `src/app/onboarding/profile/actions.ts` | Lógica de negocio en el frontend. El backend ya crea "My Wardrobe" en `POST /v1/me`: basta con `GET /v1/workspaces` |
| R3 | Crear prenda = `POST …/garments` con título y tipo, y después **una** foto | `src/app/(app)/(shell)/garments/new/page.tsx`, `src/shared/api/koyun-api.ts` | Ahora la prenda nace siempre borrador, admite hasta 4 fotos, el análisis lo lanza el usuario (`POST …/analysis`) y guardar es `PATCH` con `status: "active"`. Falta todo el flujo de J2 |
| R4 | `POST /v1/catalog/brand-candidates` | `src/shared/api/koyun-api.ts` | Ya no existe (catálogo de solo lectura). La marca libre va en `brand_raw` |
| R5 | Tipos escritos a mano que no cuadran | `Garment` en `src/shared/api/koyun-api.ts` (`title: string`, `garment_type_id: string`) | En un borrador son `null`. Al generar el cliente del OpenAPI desaparece toda esta clase de errores |

## Deuda (no rompe, pero estorba)

| # | Qué | Propuesta |
| --- | --- | --- |
| D1 | Dos capas de API en paralelo: `src/shared/api/koyun-api.ts` (funciones y tipos de dominio **dentro de `shared`**, contra la propia regla "shared no conoce garment") y `src/features/*/api.ts` | Que los `features/*/api.ts` usen el cliente generado y vaciar `koyun-api.ts` poco a poco, feature a feature |
| D2 | `next.config.ts` tiene un `rewrite` de `/v1/*` directo al backend, sin token, además del proxy autenticado `/api/backend` | Comprobar si algo lo usa; si no, quitarlo. Una sola puerta |
| D3 | `@clerk/nextjs` en `package.json` sin usar (la auth es next-auth) | Quitar la dependencia |
| D4 | Restos del login de demo: `src/app/api/auth/demo-login/route.ts` (devuelve 404), `src/shared/auth/session.ts` (funciones que devuelven `null`/`false`), `AUTH_COOKIE_NAME` | Borrar si nada los usa |
| D5 | Rutas duplicadas: `/garments/new` y `/workspaces/[id]/garments/new`, `/garments/[id]` y `/workspaces/[id]/garments/[id]` | Quedarse con una al rehacer J2 |
| D6 | `README.md` es el de `create-next-app` | Reescribirlo: qué es, cómo arrancar, enlace a `CLAUDE.md` |
| D7 | Sin CI | GitHub Actions con `task check`. Repo público: gratis. Mismo esquema que el backend (actions fijadas por SHA, Dependabot) |

## Fuera de alcance ahora

- **Dashboard / Today** (`src/app/(app)/(shell)/dashboard/`): maqueta editorial con datos de
  ejemplo. Today tendrá su propio journey; no se toca.
- **Collections y outfits:** se rediseñan desde cero en el backend (J3). Mantener lo que hay
  funcionando, sin invertir.

## Plan propuesto (cada paso en su rama; resumen y OK antes de cada uno)

0. **Cliente generado del OpenAPI.** `openapi-typescript` + script `pnpm api:generate`
   contra `http://koyunco-dev:8004/openapi.json`. Base para todo lo demás (R5).
1. **J1.** Onboarding solo con `PATCH /v1/profile` (fuera R1 y R2); destino tras login según
   `onboarding_completed_at`; workspace desde `GET /v1/workspaces`.
2. **J2.** Flujo completo: borrador → fotos (máx. 4) → "Siguiente" (`POST …/analysis`) →
   "Analizando" con sondeo → formulario relleno → "Guardar" (`PATCH` activo, 422 con
   `details.missing`) + fallo (reintentar / empezar de nuevo) + descartar + borradores
   pendientes (R3, R4, D5).
3. **Limpieza:** D2, D3, D4, D6.
4. **CI** (D7).

Después: enseñar J1 y J2 a 5 personas, y diseñar Today.
