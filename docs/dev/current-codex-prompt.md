# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused diplomacy/conflict authority evidence audit:

`Version 0.5.349 - Diplomacy Conflict Authority Evidence Audit`

## Current accepted repo state

- Latest completed primary: `Version 0.5.348 - Roadmap Post-Force-Public-Order Deferral Selection`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.349 - Diplomacy Conflict Authority Evidence Audit`
- Exactly two planned polity identities are live and normally validated.
- Diplomatic relations, conflicts, claims/borders/control, government, jurisdiction, law, force, places, and runtime are separate owners.
- Existing map `conflictZones` are descriptors, not canonical conflicts.
- No diplomacy/conflict collection, schema, validator, content, registration, or runtime authority is approved.

## Purpose

Classify current repository evidence for static diplomatic relations and conflict identities/history. Determine whether any canonical candidates exist, preserve separate claims/borders/control and runtime owners, and select at most one later boundary decision or fail-closed deferral. Do not implement anything.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Read at minimum:

- `AGENTS.md` and `README.md`;
- current output, handoff, prompt, sequence, roadmap, and backlog;
- `docs/design/roadmap-post-force-public-order-deferral-selection.md`;
- `docs/design/civic-authority-boundary-decision.md`;
- polity schema/seed boundaries and current live polity posture;
- exact current map conflict-zone, region/settlement, quest, design, consumer, and runtime surfaces only as needed to classify diplomacy/conflict evidence.

Keep discovery targeted. Do not audit claims/borders/control, political simulation, war runtime, or every use of generic combat/conflict language.

## Expected output

Add:

- `docs/design/diplomacy-conflict-authority-evidence-audit.md`

## Required audit decisions

- confirm whether dedicated diplomacy/conflict authorities, schemas, validators, focused tests, content, and normal registration exist;
- inventory and classify exact polity, map conflict-zone, place, quest, derived, design, consumer, test, and runtime signals;
- distinguish a diplomatic relation from polity identity, recognition/vassalage/claim/control, faction reputation, current hostility, negotiation, treaty execution, and runtime state;
- distinguish a conflict identity/history from map zone, place prose, quest/combat event, battle/encounter, current war state, occupation/control, and simulation;
- keep claims, borders, control, occupation, government, jurisdiction, law, force, faction, institution, places, combat, events, runtime, UI, and save/account separately owned;
- reject map `conflictZones`, prose, synthetic ids, fixtures, UI, and runtime labels as canon unless a durable authority is explicit;
- carry forward exact candidate ids only if complete canonical identity and relationship/history evidence exists; otherwise carry zero;
- decide whether diplomacy and conflict require separate future owners and whether a focused boundary decision is justified;
- select at most one next docs-only boundary or evidence-deferral route;
- decide Deep Research, explicit-user-question, support-suffix, and temporary-guardrail posture.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent diplomatic pairs, conflicts, participants, causes, dates, outcomes, claims, borders, treaties, alliances, wars, ids, or canon. Do not add references, normalize prefixes, enable consumers, or plan diplomacy/war/combat runtime. Do not reopen gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/diplomacy-conflict-authority-evidence-audit.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/polity-validation.test.mjs
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify docs-only scope, unchanged code/content/scaffolds/current owners, no invented candidate ids, no diplomacy/conflict/claim/control content or schema changes, no references/migrations/consumer/runtime changes, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers.

## Suggested commit message

`docs(civic): audit diplomacy conflict evidence`
