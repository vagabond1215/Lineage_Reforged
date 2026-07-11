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

If `git pull --ff-only origin master` reports the known multi-branch fast-forward ambiguity, verify local/remote alignment with:

```bash
git rev-parse HEAD
git rev-parse origin/master
git merge-base HEAD origin/master
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
- `docs/design/organization-faction-guild-authority-evidence-audit.md`
- `docs/design/civic-authority-boundary-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/people-npc-seed-evidence-deferral.md`
- `docs/design/static-authority-validation-consolidation-audit.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `packages/schemas/civilization/faction.schema.json`
- `tools/content-lint/factions.mjs`
- `tests/unit/faction-validation.test.mjs`
- `tests/unit/schema-files.test.mjs`
- `tools/content-lint/index.mjs`

Do not repeat broad evidence discovery unless repository state has materially changed. Confirm only the accepted absence and gate posture needed for this deferral.

## Expected output

Add one new docs-only deferral document:

`docs/design/faction-authority-seed-evidence-deferral.md`

## Deferral goals

The new document should:

- record that zero faction candidate ids are carried forward;
- preserve the completed faction schema/validator/focused-test posture;
- preserve absent live faction content;
- preserve absent normal faction registration;
- define exact future reopening inputs;
- prohibit repeated weak-source scans without new authored evidence;
- prohibit inference from existing owners, hooks, prose, tests, examples, demos, and runtime state;
- state that schema/validator readiness does not create seed readiness;
- route away from faction seed planning to the next eligible roadmap lane.

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

## Required deferral questions

Answer all of the following:

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

## Required sections

The new deferral doc should include:

1. Source version/run and date.
2. Deferral summary.
3. Current completed-state posture.
4. Faction contract readiness versus seed readiness.
5. Candidate carry-forward decision.
6. Reopening gate.
7. Prohibited weak sources and inference boundaries.
8. Registration posture.
9. Deep Research posture.
10. Support-suffix / explicit-question posture.
11. Options considered:
   - seed plan now;
   - live implementation;
   - normal registration;
   - repeat evidence audit;
   - request user-authored faction list now;
   - deferral and route elsewhere.
12. Selected option and rationale.
13. Explicit non-goals.
14. Deferral question answers.
15. Checks run.
16. Next recommended version.

## Next-route guidance

Normally select:

`Version 0.5.327 - Roadmap Post-Faction Deferral Selection`

Use that route if the faction lane is properly deferred and no explicit user-authored faction list exists now.

That next route should be docs-first and should compare eligible roadmap/backlog lanes while preserving all current pauses and closures.

Do not select:

- faction seed plan;
- faction content implementation;
- normal faction registration;
- another broad faction evidence scan;
- Deep Research;
- runtime/UI/save/account/gameplay;
- `0.6.0`.

## Hard guardrails

This run must be docs-only.

Do not:

- create `packages/content/base/civilization/factions.json`
- add faction records
- add candidate faction ids
- approve faction seed candidates
- edit schemas
- edit validators
- edit tests
- edit `tools/content-lint/index.mjs`
- register factions in normal content lint
- edit live guild, polity, religion, settlement/district/site, quest, Knowledge, service/resource/commodity, combat health, People/NPC, economy, account, reputation, runtime, UI, save/account, or gameplay files
- add cross-authority references
- add resolver logic
- add memberships, affiliations, leaders, relationships, ranks, offices, reputation, standing, favorability, providers, services, law, jurisdiction, diplomacy, conflict, territory, AI, dialogue, schedules, effects, runtime, UI, save/account, or gameplay behavior
- infer factions from guilds, religious orders, polities, governments, businesses, families/houses, quest anchors, backstory hooks, settlement prose, pirate/raider descriptors, movement/ideology labels, shadow networks, runtime groups, or standing/reputation
- infer people/NPCs from institutions
- duplicate polities/religions/guilds/services/places into faction or organization authorities
- reopen generic `world.pois`
- reopen Highcrown Knowledge
- reopen People/NPC without a new authored input
- resume service/resource/commodity/combat-health lanes
- run Deep Research
- create temporary Deep Research artifacts

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

Only update other docs if the current handoff would otherwise become misleading, and explain why in `docs/dev/current-codex-output.md`.

## Validation expectations

Because this run is docs-only, implementation tests are not required. Do not invent test results.

Run:

```bash
node --test tests/unit/faction-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

If your shell environment does not support `npm.cmd`, use the repo's platform-appropriate npm command and report the exact command used.

Also run lightweight scans for:

- no live `packages/content/base/civilization/factions.json`;
- no normal faction content-lint registration;
- no content `faction.*` record id;
- no candidate ids carried forward;
- no accidental content edits;
- no schema edits;
- no validator edits;
- no test edits;
- no normal-lint index edits;
- no runtime/UI/save/account/gameplay edits;
- no Deep Research artifacts;
- no generic `world.pois` implementation;
- no Highcrown Knowledge reopening;
- no People/NPC reopening without new authored input;
- no service/resource/commodity/combat health expansion;
- conflict markers;
- trailing whitespace;
- stale next-version pointers.

## Expected final posture

After successful deferral, mark:

- latest completed primary: `Version 0.5.326 - Faction Authority Seed Evidence Deferral`
- latest support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- immediate next route: `Version 0.5.327 - Roadmap Post-Faction Deferral Selection`

If an explicit user-authored faction seed list or new durable canonical source is unexpectedly present, stop and document why the route changed. Do not infer candidates.

## Final output requirements

Update `docs/dev/current-codex-output.md` with:

- source version/run;
- result;
- changed files;
- checks run;
- behavior/runtime confirmation;
- risks/follow-up;
- next recommended version;
- suggested commit message.

Update `docs/dev/current-gpt-handoff.md` with:

- latest completed primary;
- latest support/audit run;
- immediate next primary route;
- faction deferral posture;
- reopening gate;
- live content and normal registration posture;
- Deep Research / question / support-suffix posture;
- remaining deferred authority guardrails.

Update roadmap/backlog/sequence docs consistently.

Update `docs/dev/current-codex-prompt.md` so it points at the newly selected next route after this run.

## Suggested commit message

`docs(civ): defer faction seed evidence`
