# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the next docs-first deferral route:

`Version 0.5.326 - Faction Authority Seed Evidence Deferral`

## Current accepted repo state

The latest accepted primary run is:

`Version 0.5.325 - Faction Authority Seed Evidence Audit`

That run added:

- `docs/design/faction-authority-seed-evidence-audit.md`

Current confirmed posture:

- Latest completed primary: `Version 0.5.325 - Faction Authority Seed Evidence Audit`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.326 - Faction Authority Seed Evidence Deferral`
- The strict faction schema, pure validator, focused tests, and schema parse coverage are complete and passing.
- `packages/content/base/civilization/factions.json` remains absent.
- No `faction.*` record exists in repository content.
- No canonical faction candidate passes the accepted seed gate.
- Current hooks, quest prose, pirate/raider descriptors, UI/demo entries, tests, examples, and planning language are insufficient.
- Guilds, polities, religious orders, services, places, family/lineage, economy/account, Knowledge, quests, People/NPC gates, and runtime state retain their own authority.
- Normal faction content-lint registration remains absent and unauthorized.
- Deep Research is not required.
- No support-suffix run or explicit user question is required before this deferral.

## Purpose

Create a docs-only faction seed evidence deferral that records the exact fail-closed reopening gate, prohibits repeated weak-source audits, carries forward no candidate ids, and routes to another roadmap lane.

This run must not create content, candidates, schemas, validators, tests, registration, runtime behavior, UI, save/account behavior, or gameplay.

## Required first steps

Start by syncing and inspecting the current repo state:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Then read at minimum:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`
- `docs/design/faction-authority-seed-evidence-audit.md`
- `docs/design/faction-authority-schema-plan.md`
- `docs/design/organization-faction-guild-boundary-decision.md`
- `docs/design/people-npc-seed-evidence-deferral.md`
- `packages/schemas/civilization/faction.schema.json`
- `tools/content-lint/factions.mjs`
- `tests/unit/faction-validation.test.mjs`
- `tools/content-lint/index.mjs`

Do not repeat broad evidence discovery unless repository state has materially changed. Confirm only the accepted absence and gate posture needed for this deferral.

## Expected output

Add:

- `docs/design/faction-authority-seed-evidence-deferral.md`

## Required deferral decisions

The document must state:

- zero candidate ids are carried forward;
- live faction content remains unauthorized;
- normal content-lint registration remains unauthorized;
- schema/validator readiness does not establish seed readiness;
- broad repository scans must not be repeated without a new durable authored input;
- acceptable reopening inputs are:
  - an explicit user-authored canonical faction seed list; or
  - a new durable repository lore/content source that clearly owns named faction identity and supplies the complete accepted record facts;
- quest anchors/prose, backstory hooks, UI/demo data, tests/examples, guilds, religious orders, polities, businesses, families/houses, settlements, pirate/raider labels, shadow networks, runtime groups, and standing/reputation remain insufficient;
- any future seed candidate must satisfy every field and boundary requirement in `docs/design/faction-authority-schema-plan.md` and `docs/design/faction-authority-seed-evidence-audit.md` without invention;
- normal registration may occur only after live content exists and a separate exact-once registration decision approves it.

## Required questions

Answer:

1. Is the faction schema/validator complete?
2. Is live faction content present?
3. Is normal faction registration present?
4. Are any candidate ids carried forward?
5. Why is the lane deferred?
6. What exact inputs may reopen seed planning?
7. Which sources remain prohibited for inference?
8. Should broad evidence scanning repeat without new authored input?
9. Is a seed plan approved?
10. Is content implementation approved?
11. Is registration approved?
12. Is Deep Research required?
13. Is a support-suffix run needed?
14. Is an explicit user question needed before routing elsewhere?
15. What immediate next route is selected?

## Next-route guidance

Normally select:

`Version 0.5.327 - Roadmap Post-Faction Deferral Selection`

That route should compare remaining roadmap lanes while preserving the faction gate. Do not reopen People/NPC, service, resource/commodity, combat health, generic `world.pois`, or Highcrown Knowledge unless their explicit prerequisites have changed.

Do not route directly to faction seed planning, live content, registration, runtime faction behavior, UI, save/account, gameplay, or `0.6.0`.

## Hard guardrails

This run must be docs-only.

Do not:

- create `packages/content/base/civilization/factions.json`;
- add or approve faction ids;
- repeat broad weak-source evidence scanning;
- edit faction schema, validator, tests, or normal-lint index;
- edit live content;
- add references, resolvers, membership, affiliation, leadership, ranks, relationships, standing, reputation, favorability, services, law, territory, runtime, UI, save/account, or gameplay behavior;
- infer factions from any source rejected by the audit;
- reopen generic `world.pois`, Highcrown Knowledge, People/NPC, service, resource/commodity, or combat health;
- run Deep Research or create temporary research artifacts.

## Allowed changes

Allowed new doc:

- `docs/design/faction-authority-seed-evidence-deferral.md`

Allowed coordination docs:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Required checks

Run:

```bash
node --test tests/unit/faction-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Also confirm absent live faction content, absent normal registration, zero content `faction.*` ids, docs-only scope, no Deep Research artifacts, no conflict markers or trailing whitespace, and aligned next-version pointers.

## Expected final posture

- latest completed primary: `Version 0.5.326 - Faction Authority Seed Evidence Deferral`
- latest support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- immediate next route: `Version 0.5.327 - Roadmap Post-Faction Deferral Selection`

## Suggested commit message

`docs(civ): defer faction seed evidence`
