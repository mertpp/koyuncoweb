# Koyun Frontend Architecture

This document captures the intended frontend structure for Koyun after the first architecture cleanup.

## Layers

```txt
app
  -> features
  -> shared

features
  -> shared

shared
  -> no project dependencies
```

## Dependency rules

### Allowed

```txt
app -> features
app -> shared
features -> shared
same feature internal imports
```

### Forbidden

```txt
shared -> features
shared -> app
features -> app
```

`shared` must behave like a library. It must not know that product domains such as `collection`, `garment`, `outfit`, `workspace`, `profile`, or `session` exist.

## Feature-to-feature imports

Feature-to-feature imports are not forbidden by default, but they must be intentional and domain-driven.

Allowed when the domain relationship is real:

```txt
collection -> garment types
outfit -> garment types
collection detail -> outfit API
collection list -> workspace API
```

Current accepted examples:

- `CollectionGarment` contains a `Garment`, so `collection` may reference garment read types.
- `Outfit` contains garments, so `outfit` may reference garment list item types.
- Collection detail displays outfits scoped inside a collection, so collection UI may call the outfit API.
- Collection list is scoped inside a workspace, so collection UI may call the workspace API.

Avoid:

```txt
outfit -> collection -> outfit
collection -> workspace -> collection
profile -> session -> profile
```

Circular dependencies are architectural debt and should be treated as a bug.

## App layer responsibilities

`app` owns routing and route-level composition:

- route segments;
- `page.tsx`;
- `layout.tsx`;
- `loading.tsx`;
- `error.tsx`;
- parsing route params and search params;
- passing route-derived values into feature components.

`app` should not own business UI or domain workflows.

## Feature layer responsibilities

`features/*` owns domain behavior:

- domain API integrations;
- backend contract functions for that feature;
- domain-specific components;
- domain-specific client interactions;
- domain-specific state and forms.

Recommended feature shape:

```txt
src/features/<feature>/
  api.ts          # backend contract factory/functions
  client.ts       # browser-only API binding
  server.ts       # server-only API binding
  types.ts        # feature-owned domain types
  components/     # domain-specific UI
```

## Shared layer responsibilities

`shared` owns generic infrastructure:

- generic UI primitives;
- utilities;
- API core helpers;
- common types that are not owned by one domain.

Examples:

```txt
src/shared/api/core.ts
src/shared/api/client.ts
src/shared/api/server.ts
src/shared/components/ui/*
```

`shared` must not import from `app` or `features`.

## Data fetching conventions

```txt
api.ts    = backend contract factory/functions
client.ts = browser-only API binding
server.ts = server-only API binding
```

### `api.ts`

Defines the backend contract for a feature. It should be runtime-agnostic and receive an `ApiFetch` implementation.

### `client.ts`

Binds the feature API to browser/client-component fetching.

It may use:

```txt
src/shared/api/client.ts
```

### `server.ts`

Binds the feature API to Server Components, Server Actions, or Route Handlers.

It may use:

```txt
src/shared/api/server.ts
```

## Component placement

Generic components live in:

```txt
src/shared/components
```

Domain components live in:

```txt
src/features/<feature>/components
```

Route files in `app` may import domain components from features, but should not contain domain component implementations unless the component is purely route scaffolding.

## Route/search params policy

Route-specific parsing belongs in `app`.

For example, a page should parse:

```txt
params
searchParams
```

and pass validated values into feature components.

Feature components should avoid reading route state directly unless explicitly required for browser-only interaction.

## Contracts policy

Do not move all types to `shared` by default.

Move types to shared contracts only when they are:

- duplicated across multiple features;
- truly generic API infrastructure;
- not owned by one domain;
- needed to avoid unclear or circular feature dependencies.

Keep types in a feature when they:

- belong to one domain;
- encode domain language;
- make ownership clearer by staying local.

Potential future shared contracts location:

```txt
src/shared/api/contracts
```

Use this only after auditing duplication and ownership.

## Current collection structure

Collection currently owns its domain UI and API bindings:

```txt
src/features/collection/
  api.ts
  client.ts
  server.ts
  types.ts
  components/
    create-collection-form.tsx
    collections-client.tsx
    collection-detail-client.tsx
```

The App Router pages compose these components from `app`:

```txt
src/app/(app)/workspaces/[workspaceId]/collections/page.tsx
src/app/(app)/workspaces/[workspaceId]/collections/[collectionId]/page.tsx
```

## Architecture audit checklist

Before and after frontend architecture changes, check:

```txt
shared -> features  # must be absent
shared -> app       # must be absent
features -> app     # must be absent
```

Also inspect feature-to-feature imports for cycles and unclear ownership.
