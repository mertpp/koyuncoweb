# Contrato con el backend (koyun-api)

Resumen para trabajar en el frontend sin abrir el repo del backend. **Fuente de verdad:** el
OpenAPI de koyun-api (`http://koyunco-dev:8004/openapi.json` desde el devcontainer) y, en el
repo privado `koyunco`, `docs/journeys/` y `docs/adr/`. Si algo de aquí contradice al OpenAPI,
manda el OpenAPI y este documento se corrige.

Actualizado: 2026-11-25 (backend en `master`, commit `d5bbe5e`).

## Principios que impone el backend

- **Cero lógica en el frontend.** Pinta lo que devuelve la API y envía lo que el usuario
  decide. Si una pantalla tiene que decidir algo de negocio, falta un endpoint.
- **Endpoints mínimos.** Antes de pedir uno nuevo, comprobar si uno existente basta.
- Todo el negocio cuelga de `/v1`. Un cambio incompatible sería `/v2`.

## Autenticación

- Login con **Microsoft Entra External ID** (OIDC), hecho por next-auth en el servidor de
  Next (`src/auth.ts`). El access token **nunca llega al navegador**: vive en la sesión de
  next-auth (cookie cifrada) y lo añade el servidor.
- koyun-api valida el JWT (`Authorization: Bearer …`) él mismo: emisor, audiencia y scope
  `access_as_user` (ADR 0031 del backend). El frontend no valida nada.
- La cabecera `x-test-subject` existe **solo en los tests del backend**. Nunca se usa aquí.
- Variables de entorno (solo nombres; los valores van en `.env.local`, que no se commitea):
  `AZURE_ENTRA_CLIENT_ID`, `AZURE_ENTRA_CLIENT_SECRET`, `AZURE_ENTRA_TENANT_ID`,
  `AZURE_ENTRA_API_SCOPE`, `AZURE_ENTRA_TENANT_SUBDOMAIN` (o `AZURE_ENTRA_AUTHORITY`),
  `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `API_BASE_URL`.

## Cómo llega una petición a la API

```
Server Component / Server Action ──(token de la sesión)──────────────► koyun-api :8004
Navegador ──► /api/backend/<ruta> (route handler, añade el token) ───► koyun-api :8004
```

- `src/shared/config/api.ts`: en el servidor, `API_BASE_URL` (por defecto
  `http://koyunco-dev:8004`); en el navegador, `/api/backend` (proxy autenticado,
  `src/app/api/backend/[...path]/route.ts`).
- Ver en `doc/estado-y-plan.md` la duda sobre el `rewrite` de `/v1` en `next.config.ts`.

## Errores: un único sobre (ADR 0003 del backend)

```json
{"error": {"code": "not_found", "message": "texto para humanos", "details": null}}
```

- `code` es el contrato (estable, en inglés): el código decide por `code`, nunca por
  `message`.
- `details` depende del caso. Validación (422): la lista de errores campo a campo. Activar una
  prenda sin requisitos (422): `details.missing` con los que faltan (`title`,
  `garment_type_id`, `photo`, `analysis`).
- Cada respuesta trae `x-request-id`. Si algo falla, enseñarlo o registrarlo: es lo que hay
  que buscar en los logs del backend.

## Cliente tipado

El backend publica OpenAPI. Los tipos de TypeScript **se generan** de ahí y no se editan a
mano; hoy están escritos a mano en `src/shared/api/koyun-api.ts` y `src/features/*/types.ts`
y ya divergen del backend (ver `doc/estado-y-plan.md`). Propuesta: `openapi-typescript` para
generar los tipos y un script `pnpm api:generate` que lea
`http://koyunco-dev:8004/openapi.json`. El fichero generado se commitea; si el backend cambia,
se regenera.

## J1 — Registro → perfil → Today

**Resultado:** el usuario llega a Today con cuenta, workspace y perfil (aunque incompleto).

| # | Pantalla | Acción | Sistema |
| --- | --- | --- | --- |
| 1 | Bienvenida | "Entrar" | login con Entra |
| 2 | (sin pantalla) | — | `POST /v1/me` con `{"locale": "es"}`: crea **en una transacción** cuenta, workspace **"My Wardrobe"** y perfil vacío. Idempotente: si ya existen, los devuelve. Ya se llama en el `signIn` de `src/auth.ts` |
| 3 | Onboarding de perfil | rellena pasos, puede saltarlos | `PATCH /v1/profile` por paso |
| 4 | Fin de onboarding | "Empezar" | `PATCH /v1/profile` con `onboarding_completed_at` |
| 5 | Today | — | por diseñar (hoy, maqueta) |

- **Usuario que vuelve:** login → `POST /v1/me` → `GET /v1/profile`. Sin
  `onboarding_completed_at`, retoma el onboarding; con él, va a Today.
- **El frontend no crea workspaces ni perfiles.** `POST /v1/profile` **ya no existe**. El
  workspace del usuario sale de `GET /v1/workspaces`. Renombrarlo: `PATCH /v1/workspaces/{id}`.
- Todos los campos del perfil son opcionales. Pregunta abierta de producto: qué pide el
  onboarding y en qué orden (`ProfileUpdate` tiene más de 20 campos; pedir lo mínimo).
- Estados: login cancelado → se queda en bienvenida con mensaje; 422 en un paso → el campo se
  marca con el detalle.

## J2 — Añadir prenda → fotos → analizar → guardar

**Resultado:** la prenda está en el armario (`status=active`), revisada por el usuario.
`…` = `/v1/workspaces/{workspace_id}`.

| # | Pantalla | Acción | Sistema |
| --- | --- | --- | --- |
| 1 | Armario | "Añadir prenda" | `POST …/garments` (body puede ir vacío `{}`): **siempre crea un borrador** (`status=draft`). No acepta `status` |
| 2 | Fotos | sube hasta **4** fotos (frente, espalda, etiqueta…) | `POST …/garments/{id}/photos/upload` (multipart: `file`, `kind`, `sort_order`), una por foto. Solo guarda; no analiza |
| 3 | Fotos | "Siguiente" | `POST …/garments/{id}/analysis` **sin body**. 201 = análisis nuevo `pending`; 200 = ya había uno `pending` (doble clic, no pasa nada). 422 si no hay fotos |
| 4 | Analizando | espera | sondeo de `GET …/garments/{id}/analysis` cada pocos segundos hasta `completed` o `failed`. Sin SSE ni WebSocket |
| 5 | Formulario relleno | revisa y corrige | `GET …/garments/{id}`: vision ya ha rellenado título, tipo, colores, materiales y marca sugeridos. Marca con autocompletado: `GET /v1/catalog/brands?query=`. Desplegables: `GET /v1/taxonomy/*` |
| 6 | Formulario | "Guardar" | `PATCH …/garments/{id}` con `status: "active"` y las correcciones. 422 con `details.missing` si falta `title`, `garment_type_id`, `photo` o `analysis` |
| 7 | Detalle | — | prenda en el armario |

- **Análisis fallido** (`failed`, tras los reintentos automáticos de vision): "No hemos podido
  analizar la prenda" con dos salidas: **Reintentar** (el mismo `POST …/analysis`) o **Empezar
  de nuevo** (`DELETE …/garments/{id}` y vuelta al paso 1). No hay relleno manual sin análisis.
- **Descartar** en cualquier paso antes de guardar: `DELETE …/garments/{id}`. Borra al
  instante, sin papelera.
- **Retomar borradores:** `GET …/garments?status=draft` ("tienes N prendas sin terminar").
  Los que no se tocan en 7 días los purga el backend.
- **Añadir fotos más tarde:** subir foto + `POST …/analysis`. El análisis nuevo sustituye lo
  que propuso vision; lo que corrigió el usuario no se toca.
- **Fotos:** `GarmentPhotoRead` trae `original_url`, `thumb_url`, `display_url`. El frontend
  **no construye URLs de blob**: usa las que devuelve la API. La miniatura aparece cuando el
  análisis termina (`thumb_url` deja de ser `null`).
- **Listas:** `GET …/garments` (por defecto `status=active`) devuelve elementos ligeros
  (`id`, `title`, `garment_type_id`, `brand_id`); el detalle completo es
  `GET …/garments/{id}`.
- **Marca:** el usuario elige una marca del catálogo (`brand_id`) o escribe texto libre
  (`brand_raw`). `POST /v1/catalog/brand-candidates` **ya no existe**: el catálogo es de solo
  lectura (ADR 0032 del backend).
- **Aún no existe en el backend (ADR 0035, aceptada, pendiente):** construcción y detalles de
  la prenda (bolsillos, cuello, cierre…). No se pintan hasta que existan.

## Otros endpoints que ya usa la app

- Collections y outfits: `…/collections`, `…/collections/{c}/garments/{g}`,
  `…/collections/{c}/outfits`. El diseño de collections, outfits y stylist se rehará (J3,
  sesión de diseño pendiente en el backend): **no invertir en esas pantallas ahora**.
- Taxonomía: `GET /v1/taxonomy/garment-families`, `garment-types`, `colors`, `materials`,
  `patterns`, `styles`.
