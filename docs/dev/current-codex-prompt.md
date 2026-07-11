# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the next docs-first boundary decision:

`Version 0.5.328 - Institution Office Authority Boundary Decision`

## Current accepted repo state

- Latest completed primary: `Version 0.5.327 - Roadmap Post-Faction Deferral Selection`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.328 - Institution Office Authority Boundary Decision`
- The existing institutional evidence audit already identifies Knowledge institution vocabulary, two quest `office.*` anchors, derived settlement institution profiles, protected guild/religion/polity/place/service owners, and missing institution/office authority.
- A general organization umbrella remains rejected.
- Faction and People/NPC are authored-input blocked.
- Service, resource/commodity, and combat health remain paused.
- Generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed.
- No Deep Research or explicit user question is required before this boundary decision.

## Purpose

Create a docs-only institution/office authority boundary decision.

Decide whether `institution` and `office` should be separate static identity owners, what each may own, how they remain distinct from existing/future specific authorities, and whether either is ready for one later schema/evidence route.

This run must not implement content, schemas, validators, tests, normal registration, runtime, UI, save/account, or gameplay.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Read at minimum:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`
- `docs/design/roadmap-post-faction-deferral-selection.md`
- `docs/design/organization-faction-guild-authority-evidence-audit.md`
- `docs/design/organization-faction-guild-boundary-decision.md`
- `docs/design/civic-authority-boundary-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/npc-social-authority-boundary-decision.md`
- `docs/design/people-npc-seed-evidence-deferral.md`
- current guild, polity, religion, service, place, quest, Knowledge, family/household, economy/account, and settlement-institution projection surfaces relevant to the boundary.

Use the existing evidence inventory. Do not repeat broad discovery unless a named source materially changed.

## Expected output

Add:

- `docs/design/institution-office-authority-boundary-decision.md`

## Required boundary decisions

Decide at minimum:

- whether `institution` is a distinct possible static owner for durable civic, administrative, judicial, scholarly, charitable, educational, or similar bodies not better owned elsewhere;
- whether `office` is a distinct possible static owner for a durable position, office, or administrative unit rather than a person/office-holder;
- whether institution and office must remain separate from each other;
- boundaries against polity, government, jurisdiction, law, force, guild, faction, religion/order, business/company, family/house, profession, facility/site, service/provider, school/academy, person/NPC, quest anchor, Knowledge vocabulary, and runtime projection;
- whether government departments/agencies belong to institution, office, government, or remain deferred;
- whether office-holder, membership, employment, rank, leadership, affiliation, and relationships belong to later link authorities;
- whether services, access, jurisdiction, law, enforcement, territory, finance, schedules, runtime, UI, save/account, and gameplay remain excluded;
- whether any current quest `office.*`, Knowledge institution label, demo string, generated id, or derived institution profile is canonical evidence;
- whether either institution or office is ready for one later schema plan, evidence audit, or preservation gate;
- at most one immediate next route.

## Required questions

Answer:

1. Does a canonical institution collection exist?
2. Does a canonical office collection exist?
3. Is institution distinct from office?
4. What may institution own?
5. What may office own?
6. What must remain owned by government/jurisdiction/law/force?
7. What must remain owned by guild/religion/faction/business/family/place/service authorities?
8. Are quest office anchors canonical?
9. Is Knowledge institution vocabulary canonical identity?
10. Are derived institution profiles or generated ids canonical?
11. Are members, office-holders, leaders, ranks, employment, or affiliation in scope?
12. Are services, access, reputation, law, territory, runtime, or gameplay in scope?
13. Is institution schema-ready?
14. Is office schema-ready?
15. Is any candidate id approved?
16. Is implementation authorized?
17. Is Deep Research required before the next route?
18. Is a support-suffix run needed?
19. Is an explicit user question needed?
20. What exact next route is selected?

## Selection guidance

Possible outcomes:

- an institution authority schema plan, only if the boundary is narrow and decision-complete;
- an office authority schema plan, only if office is clearer and independent;
- a focused evidence audit, only if a named unresolved repository source must be classified;
- an institution/office preservation gate if neither owner is schema-ready.

Do not select both schema plans concurrently. Do not route to content, registration, providers, membership, reputation, government/law behavior, runtime, UI, save/account, gameplay, or `0.6.0`.

## Hard guardrails

Docs only. Do not create/edit content, schemas, validators, tests, normal lint, runtime, UI, save/account, or gameplay. Do not infer identity from quest anchors, Knowledge vocabulary, demos, generated ids, or derived projections. Do not move or duplicate guilds, religious orders, polities, factions, businesses, families, services, or places. Do not reopen paused/blocked/rejected/closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/institution-office-authority-boundary-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify docs-only scope, no Deep Research artifacts, no conflict markers/trailing whitespace, and aligned next-version pointers. Update the active prompt to the selected next runnable route.

## Suggested commit message

`docs(civ): decide institution office boundaries`
