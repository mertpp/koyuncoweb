# ADR 0001: Product Direction and Domain Language

## Status

Accepted

## Context

Koyunco is being built around garments, outfits, collections/capsules, and recommendations. Early UI explorations risked presenting the product as another wardrobe inventory or garment catalog.

The strategic direction is broader: users do not primarily need another place to list clothes. They need help deciding what to do with the clothes they have.

The core user problems are:

- What should I wear today?
- What should I pack for a trip?
- What should I buy?
- What should I sell or stop wearing?
- What is missing from my wardrobe?
- What is excessive or underused?
- What combines with what?
- What needs care, rest, or rotation?

Therefore, the product should not be framed as a wardrobe manager. It should be framed as a wardrobe decision engine.

## Decision

Koyunco is a **wardrobe decision engine**, not a wardrobe inventory manager.

The product direction is:

> From wardrobe data to wardrobe decisions.

The application should prioritize decision surfaces over inventory surfaces.

The primary authenticated experience remains technically routed through:

```txt
/dashboard
```

But the product UI should not call it "Dashboard". It should feel like a decision center, with the first module focused on Today.

The primary screen should answer:

What should I do with my wardrobe today?

Rather than:

What clothes do I own?

Domain Model Decision
The backend domain root is Workspace.

A user does not directly own garments. A user is a member of a workspace, and garments, collections, outfits, stylist context, and future recommendations belong to the active workspace.

Conceptually:

Code block

User
-> Membership
-> Workspace
-> Garments
-> Collections / Capsules
-> Outfits / Pairings
-> Stylist Context
-> Insights
There is no separate Wardrobe entity in the domain model.

workspace_id remains the technical root used by the backend API.

Examples:

Code block

/v1/workspaces/{workspace_id}/garments
/v1/workspaces/{workspace_id}/collections
/v1/workspaces/{workspace_id}/outfits
UI Language Decision
Avoid exposing internal implementation language unnecessarily.

Do not use the following as primary product concepts unless explicitly needed:

Taxonomy
CRUD
Garments dashboard
Projects
Workspace may be used in the UI if it represents the active operational space, but it should not become a second level beneath another concept like Wardrobe.

The bottom navigation currently uses:

Code block

Today
Collections
Add
Workspace
Stylist
The meaning is:

Today: the decision surface, currently /dashboard
Collections: capsules/collections inside the active workspace
Add: add garment flow inside the active workspace
Workspace: the operational space for the active workspace
Stylist: the AI stylist/chat assistant
Route Decision
For now, keep the technical home route as:

Code block

/dashboard
Rationale:

Today is the leading module, but the main authenticated surface will eventually contain more than today:

Today
Upcoming
Travel
Shopping
Care
Insights
Stylist recommendations
Therefore /dashboard remains flexible as the technical decision center route.

The UI should still lead with Today.

Product Surface Direction
The main authenticated screen should prioritize:

Today recommendation
Why the recommendation works
Upcoming decisions
Next decisions
Workspace snapshot
Collections / capsules
Wardrobe pulse / insights
The product should feel less like SaaS analytics and more like a personal wardrobe operating system.

Preferred product language examples:

Code block

Recommended outfit prepared
Why this works
Next Decisions
Wardrobe Pulse
Capsules
Stylist
Avoid generic SaaS language such as:

Code block

Recent Activity
Projects
Dashboard Overview
Design Direction
The visual direction is Quiet Luxury Editorial Archive.

Key principles:

Warm alabaster background
Soft ivory cards
Deep botanical/loden green primary color
Editorial serif headings via Newsreader
Geist for interface text
JetBrains Mono for codes, specs, and archival metadata
Hairline borders
Moderately rounded cards, not overly bubbly
Garment imagery and archival codes should carry much of the visual identity
Large containers should generally use restrained radii:

Code block

cards: rounded-xl
inputs: rounded-lg
chips/buttons: rounded-full
Avoid excessive use of:

Code block

rounded-3xl
rounded-[1.75rem]
unless a specific surface intentionally needs a soft mobile-app feel.

Authentication Decision
Current authentication is fake but structured to be replaceable by Azure later.

The current fake account is:

ts

{
label: "Continue as Mert",
ownerId: "11111111-1111-1111-1111-111111111111"
}
Authentication is represented by an HttpOnly cookie:

Code block

koyunco_owner_id
The current fake auth is intentionally wrapped in helper modules so Azure validation can replace the fake implementation later.

Consequences
The UI should start from decisions, not inventory.
Workspace is the technical root for all domain data.
Dashboard remains as the flexible technical route, but the UI should read as Today / Decision Center.
Add garment is an important flow, but it supports the larger decision engine.
Future backend integrations should resolve the active workspace internally and avoid requiring the user to think in backend terms.
Open Questions
Should the visible UI term remain Workspace, or should it eventually become a more user-friendly label?
Should /dashboard eventually be renamed to /today, or should /dashboard remain the stable technical route?
How should multiple workspace membership be surfaced, if at all?
What is the first real backend-powered decision module: weather-based outfit, travel capsule, or wardrobe gap analysis?
