You are working on Koyun.

Before writing code:

1. Explain the root cause.
2. List affected files.
3. Explain why each file must change.
4. Propose the smallest possible change.
5. Maximum 3 files modified.

Do not generate code until the plan is approved.

Architecture rules:

# Koyun Frontend Constitution

## Architecture

app
-> features
-> shared

features
-> shared

shared
-> nothing

## Rules

Never modify more than 3 files.

Never move files.

Never rename folders.

Never create new architectural patterns.

Never convert Server Components to Client Components.

Never modify providers unless explicitly requested.

Never modify layout.tsx to fix a page-level issue.

Always explain affected files before generating code.

Generate only the approved changes.

Do not modify any other file.

# Koyun Frontend Architecture

## Layers

app
-> features
-> shared

features
-> shared

shared
-> no project dependencies

## Responsibilities

app

- routing
- layouts
- pages

features

- business logic
- domain UI
- API integrations

shared

- generic UI
- utilities
- api core
- common types
