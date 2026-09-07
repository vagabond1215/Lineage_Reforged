# Activity Advancement Command, Result, And Effect-Routing Audit

Date: 2026-08-03

Execution surface: ChatGPT through GitHub Connector only

Source head inspected: `8214327906fbc2edf7ab4d02168cf94b3abc7e6f`

Status: `CANDIDATE_INTEGRATION`; documentation-only evidence; no implementation permission

## Executive Result

Player activity selection is engine-owned, command-shaped, revision-aware, and accepted-only. Activity advancement is not.

Current advancement remains a UI gameplay bridge that previews a limited consequence subset and then directly mutates multiple authoritative domains.

Classification:

`SELECTION_ENGINE_OWNED; ADVANCEMENT_UI_OWNED_MULTI_DOMAIN_MUTATION`

## Current Selection Foundation

The game engine already provides a reusable command pattern for activity selection:

- normalized command intent;
- deterministic command identity;
- snapshot revision and stale rejection;
- plan and execution separation;
- atomic accepted transition;
- typed result and event;
- accepted-only UI application;
- synchronized snapshot output.

This pattern is evidence for a future advancement owner. It is not itself advancement authority.

## Current Advancement Surface

`previewAdvanceCurrentActivity(...)` and `advanceCurrentActivity(...)` remain in the UI gameplay loop.

The current source distinguishes several hard-coded paths, including tracked quest-specific work and a generic activity shift. Advancement can directly change or append:

- clock and elapsed ticks;
- body and resource state;
- flags;
- skills and progression-like values;
- operations;
- inventory;
- discoveries;
- current activity;
- notifications;
- Chronicle rows;
- synchronized presentation projections.

These mutations cross multiple domain owners without one typed activity result or owner-specific consequence-receipt set.

## Preview/Execution Boundary

The preview path is not a complete semantic projection of execution.

A future contract must prove:

- identical admitted facts produce identical preview and execution consequences;
- preview identifies every proposed owner mutation, not only time/body changes;
- execution cannot add hidden rewards, flags, inventory, operations, discoveries, or narrative effects;
- rejected or stale commands produce no mutation;
- repeated execution cannot duplicate rewards or history;
- correction and replay do not rely on prose reconstruction.

Until then, preview is advisory UI output rather than a complete accepted plan.

## Missing Command Authority

A bounded engine-owned advancement lane needs:

1. command and occurrence identity;
2. actor, activity, location, quest, and snapshot-revision facts;
3. deterministic command sequence or equivalent collision-safe identity;
4. plan rejection codes;
5. accepted result identity;
6. typed proposed effects grouped by owner;
7. owner-specific admission and application receipts;
8. atomicity across accepted consequences or explicit partial-failure prohibition;
9. duplicate, replay, stale, and correction behavior;
10. persistence and synchronization;
11. observer-safe notification and Chronicle projections;
12. exact focused tests.

A generic event envelope is transport, not sufficient result or receipt authority.

## Effect-Routing Boundary

Activity resolution should not directly own every consequence domain.

The activity owner may resolve an occurrence and propose typed effects. Each affected owner must validate and apply its own consequence, for example:

- player resource/body owner;
- skill/progression owner;
- inventory/item owner;
- quest owner;
- Knowledge/discovery owner;
- economy/currency owner;
- notification and Chronicle projection owner.

Prose effect tokens, UI branches, or array operations must not substitute for typed owner acceptance.

## Existing Parallel Evidence

Mandatory companion evidence includes:

- progression and multi-owner rewards: `parallel/player-progression-reward-mutation-audit` at `387f2491d0d671ee7834656c28183e72a798f1ca`;
- Chronicle and notification provenance: `parallel/chronicle-notification-provenance-audit` at `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`;
- economy and currency/inventory transactions: `parallel/economy-command-surface-refresh` at `c98199dc8069099dbf52ded5fffcbf715fc08522`;
- quest turn-in/reward ownership: `parallel/quest-turn-in-reward-source-audit` at `470e8aca48510f68824f7a5aa8f603d0b13bbc1f`;
- Knowledge/discovery visibility: `parallel/knowledge-discovery-visibility-audit` at `46434f31f8b06d49aad9a516543fbe36d188d519`.

## Safe Future Sequence

The smallest credible path is:

1. docs-only advancement occurrence and effect-envelope decision;
2. pure plan builder with complete preview parity;
3. one narrow activity family with explicit typed effects;
4. owner-specific consequence application and receipts;
5. duplicate/replay/stale/correction tests;
6. accepted-only UI replacement of one legacy branch;
7. later expansion by activity family.

Do not begin with a universal activity resolver or migrate all hard-coded branches at once.

## Mandatory Consumers

Future work must inspect this audit when it concerns:

- advancing or completing activities;
- work shifts, surveys, procurement, gathering, crafting, study, or trials;
- multi-owner rewards;
- activity previews;
- activity occurrence/result/effect contracts;
- representative-loop activity claims;
- removal of UI gameplay-loop mutations.

## Review Trigger

Re-review when:

- an advancement command or result contract is proposed;
- one hard-coded activity branch moves into an engine owner;
- typed effect proposals or consequence receipts land;
- preview/execution parity tests land;
- a milestone claims activity resolution is replay-safe or engine-owned.

## Validation Limits

This audit used GitHub Connector source and accepted-document inspection only. It ran no tests, builds, typechecks, simulations, or local Git commands.

No runtime source, tests, schemas, content, UI, prompt, handoff, roadmap, or branch register changed.