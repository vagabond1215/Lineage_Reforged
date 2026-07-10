# Roadmap Next Authority Selection

Source version/run: Version 0.5.317 - Roadmap Next Authority Selection
Date: 2026-07-10
Status: documentation-only authority-lane selection

## Selection Summary

Select People/NPC as the next authority lane, beginning with:

- `Version 0.5.318 - People NPC Authority Evidence Audit`

People/NPC is the safest useful next docs-first lane because its permanent boundary decision, separate person/NPC schemas, pure validator, focused tests, and prior seed-plan history already exist, while live people/NPC files and normal content-lint registration remain absent. The previous content-seed attempt correctly deferred implementation because it found no safe canonical named-person evidence or approved authored seed list.

The next run should re-audit current canonical identity evidence and decide whether any later people-only seed planning is justified. It must not create people or NPC records, infer canon from quest contacts or synthetic ids, change schemas or validators, or implement social/runtime behavior.

## Current Completed-State Posture

- `Version 0.5.316 - Combat Status Condition Injury Next Expansion Gate` paused combat health with its stable registered two-status seed.
- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit` remains the latest support/audit run.
- Service authority is stable for the current foundation slice.
- Resource/commodity authority is stable and paused.
- Combat health authority is stable and paused.
- Generic `world.pois` remains rejected.
- The Highcrown settlement Knowledge lane remains closed.
- Runtime, UI, save/account, and gameplay remain outside this selection.

## Candidate Lane Comparison

| Candidate lane | Current evidence | Selection |
| --- | --- | --- |
| Combat health continuation | Stable two-record seed, exact-once registration, clean audit, explicit pause gate. | Not selected; preserve pause. |
| Resource/commodity continuation | Stable registered paired seed and explicit pause; broad work requires gathering/extraction research. | Not selected; preserve pause. |
| Service authority continuation | Stable five-record registered vocabulary; post-registration audit found no follow-up. | Not selected. |
| Generic discovery/POI authority | Generic `world.pois` was explicitly rejected. | Rejected; do not reopen. |
| Highcrown Knowledge | Parent settlement/district/site coverage lane is closed. | Rejected; do not reopen. |
| People/NPC authority | Boundary, schemas, pure validator, focused tests, and prior seed plan exist; live content and normal lint registration are absent; prior seed implementation deferred for lack of canon. | Selected for fresh docs-only evidence audit. |
| Organization/faction/guild authority | Live guild content exists, but no current decision selects a broader organization/faction authority as the next gap. | Defer; requires its own boundary/evidence audit. |
| Location/region/settlement gaps | District/site foundations exist; generic POI is rejected; Highcrown Knowledge is closed; no specific open gap is selected. | Defer. |
| Other deferred lanes | Property, construction, companions, dialogue/social memory, agriculture, maritime, temporal/weather, progression, and runtime transition remain dependency- or research-gated. | Defer pending later selection. |

## Stable Paused Lanes

Service remains stable for the current provider-independent vocabulary slice. Resource/commodity remains paused with exactly `resource.iron_ore`, `resource.grain`, `commodity.iron_ore_lots`, and `commodity.grain_bundles`; `GPT-DR.resources.gathering-extraction` still gates broad expansion. Combat health remains paused with exactly `combat_status.stagger` and `combat_status.bind`, both planned control-family statuses.

No registration follow-up is needed for these lanes.

## Rejected And Closed Lanes

- Generic `world.pois` remains rejected. Discovery state, map reveal, and UI markers stay separate.
- Highcrown settlement Knowledge remains closed.
- No paused service, resource/commodity, or combat-health lane is reopened.
- No organization/faction/guild or location lane is inferred merely because related content exists.

## Selected Lane And Rationale

Select People/NPC for a fresh evidence audit.

Current infrastructure:

- boundary: `docs/design/npc-social-authority-boundary-decision.md`;
- schema decision: `docs/design/person-vs-npc-schema-decision.md`;
- prior seed plan: `docs/design/first-people-npc-content-seed-plan.md`;
- schemas: `packages/schemas/civilization/person.schema.json` and `packages/schemas/civilization/npc.schema.json`;
- validator: `tools/content-lint/people-npcs.mjs`;
- focused tests: `tests/unit/people-npc-validation.test.mjs`.

Current missing live surfaces:

- `packages/content/base/civilization/people.json` is absent;
- `packages/content/base/civilization/npcs.json` is absent;
- normal content-lint registration for those absent files is absent.

The prior seed plan identified quest contact names and one legacy-shaped `npc.corin_ash` string but correctly treated them as insufficient canon. It approved no exact person/NPC ids and no authored seed list. That unresolved evidence question makes a fresh audit useful without authorizing content.

## Next People/NPC Audit Scope

`Version 0.5.318` should:

- verify current content absence and schema/validator/test posture;
- inspect durable design docs and authored content for explicit canonical named-person identity evidence;
- distinguish stable canon from quest contacts, synthetic operators, combatants, player/account identities, roles, titles, workplaces, Knowledge vocabulary, deities, organizations, and prose-only names;
- decide whether any later tiny people-only seed plan is justified;
- keep NPC overlays deferred unless stable person identity and explicit presence/interaction posture are proven;
- accept no-safe-candidate as a valid outcome.

It must not create live files, infer canon, edit schemas/validators/tests/normal lint, migrate quests, or add social/runtime behavior.

## Deep Research Posture

Deep Research is not required before the selected evidence audit. Canonical repo identity must come from repository evidence or explicit user-authored canon; external research cannot manufacture it.

Deep Research may become relevant only for later historically/culturally grounded demographics, generated populations, social simulation, dialogue/reputation, companions, or other externally informed systems.

## Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. No explicit user question is needed before the evidence audit. An explicit user-authored canonical seed list may be required later if the audit still finds no safe candidates.

## Non-Goals

This selection does not:

- implement or edit content, schemas, validators, tests, normal lint, runtime, UI, save/account, or gameplay;
- create people, NPC, organization, faction, guild, location, POI, service, resource, commodity, or combat-health records;
- approve a People/NPC live seed list;
- infer person canon from contacts, synthetic ids, generated operators, roles, titles, player/account characters, Knowledge labels, deities, organizations, or prose;
- reopen paused, rejected, or closed lanes;
- run Deep Research or route directly to implementation or `0.6.0`.

## Selection Question Answers

1. Yes. Service, resource/commodity, and combat health are stable enough to remain paused.
2. No. No registration follow-up is needed for those lanes.
3. No. Combat health continuation is not authorized now.
4. No. Resource/commodity expansion is not authorized now.
5. No. Service expansion is not authorized now.
6. No. Generic `world.pois` is not authorized.
7. No. Highcrown Knowledge is not authorized to reopen.
8. Yes. People/NPC authority is eligible for a docs-first evidence audit.
9. No. People/NPC has no approved live seed list today.
10. The next run should audit canonical named-person evidence, classify insufficient sources, and decide whether a later tiny people-only seed plan is justified.
11. It must not create content, infer canon, approve overlays without evidence, or change implementation/runtime surfaces.
12. No. The selected evidence audit does not require Deep Research before it starts.
13. No. A support-suffix run is not required.
14. No. An explicit user question is not required before the audit.
15. Select `Version 0.5.318 - People NPC Authority Evidence Audit`.

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required roadmap, backlog, lane-decision, registration-audit, and People/NPC boundary/schema/seed-plan reads.
- Verified all listed service/resource audit and decision paths exist under the requested filenames.
- Verified person and NPC schemas, validator, and focused tests exist; live `people.json` and `npcs.json` remain absent.
- Verified the prior seed plan approved no exact candidate list and recorded the no-safe-canon deferral.
- `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs` (passed; 90 tests)
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (67 files checked)`)
- Final docs-only scope, conflict-marker, whitespace, stale-route, and diff checks are recorded in `docs/dev/current-codex-output.md`.

## Next Recommended Version

Version 0.5.318 - People NPC Authority Evidence Audit
