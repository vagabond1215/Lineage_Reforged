# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the next docs-first roadmap selection:

`Version 0.5.327 - Roadmap Post-Faction Deferral Selection`

## Current accepted repo state

The latest accepted primary run is:

`Version 0.5.326 - Faction Authority Seed Evidence Deferral`

That run added:

- `docs/design/faction-authority-seed-evidence-deferral.md`

Current confirmed posture:

- Latest completed primary: `Version 0.5.326 - Faction Authority Seed Evidence Deferral`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.327 - Roadmap Post-Faction Deferral Selection`
- Faction schema, pure validator, focused tests, and schema parse coverage are complete and unchanged.
- `packages/content/base/civilization/factions.json` remains absent.
- No content `faction.*` record exists.
- No faction candidate id is carried forward.
- `tools/content-lint/index.mjs` has no faction registration.
- Faction seed planning is deferred until an explicit user-authored canonical faction list or a new durable repository lore/content source supplies every accepted static identity fact without invention.
- Do not repeat broad faction evidence scans without new authored input or a materially changed named source.
- Existing owners remain protected.
- People/NPC, service, resource/commodity, and combat health remain paused.
- Generic `world.pois` remains rejected.
- Highcrown settlement Knowledge remains closed.
- A general organization umbrella remains rejected.
- Institution/office, government/jurisdiction/law/force, business/company, provider, membership/affiliation/rank, relationships, and local reputation/standing/favorability remain deferred behind separate decisions.
- Deep Research is not required before this roadmap selection.
- No support-suffix run or explicit user question is required before routing elsewhere.

## Purpose

Create a docs-only roadmap selection that compares eligible remaining authority/planning lanes after faction seed deferral and selects exactly one immediate next primary route.

The selection should identify the smallest safe docs-first next step that is not blocked by accepted authored-input gates, rejected lanes, closed lanes, missing Deep Research, or implementation prerequisites.

This run must not implement content, schemas, validators, tests, normal content-lint registration, runtime behavior, UI, save/account behavior, or gameplay.

## Required first steps

Start by syncing and inspecting current repository state:

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
- `docs/design/faction-authority-seed-evidence-deferral.md`
- `docs/design/faction-authority-seed-evidence-audit.md`
- `docs/design/faction-authority-schema-plan.md`
- `docs/design/organization-faction-guild-boundary-decision.md`
- `docs/design/organization-faction-guild-authority-evidence-audit.md`
- `docs/design/roadmap-post-people-npc-deferral-selection.md`
- `docs/design/roadmap-next-authority-selection.md`
- `docs/design/people-npc-seed-evidence-deferral.md`
- `docs/design/people-npc-authority-evidence-audit.md`
- `docs/design/service-authority-post-registration-audit.md`
- `docs/design/resource-commodity-next-expansion-gate.md`
- `docs/design/combat-status-condition-injury-next-expansion-gate.md`
- `docs/design/civic-authority-boundary-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/static-authority-validation-consolidation-audit.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/gpt-deep-research-prompt-pack-decision.md`

Read other design docs/backlog entries as needed for serious candidate lanes, but do not reopen or repeat completed evidence audits unless the repository now contains a materially changed prerequisite.

## Expected output

Add one docs-only selection document:

- `docs/design/roadmap-post-faction-deferral-selection.md`

## Required comparison

Compare at minimum:

1. faction authority;
2. People/NPC;
3. service;
4. resource/commodity;
5. combat health/status/condition/injury;
6. generic POI/discovery;
7. Highcrown settlement Knowledge;
8. organization/faction/guild/institution umbrella work;
9. institution/office;
10. government/jurisdiction/law/force;
11. business/company;
12. provider/service organization;
13. membership/affiliation/rank/office-holder links;
14. local reputation/standing/favorability;
15. location/place specialization beyond rejected generic POIs;
16. family/lineage/household continuation;
17. property/construction/building ownership;
18. social/relationship/dialogue/companion systems;
19. agriculture;
20. maritime;
21. temporal/weather/festivals;
22. progression/advancement;
23. runtime ownership transition;
24. any other concrete roadmap/backlog lane that is more eligible than the above.

For each serious candidate, state:

- current authority/readiness;
- whether it is paused, rejected, closed, authored-input blocked, Deep-Research blocked, implementation-blocked, or eligible;
- unmet prerequisites;
- whether Deep Research is needed now;
- whether a docs-only evidence audit, boundary decision, schema plan, preservation gate, or roadmap selection is the smallest safe next step;
- why it should or should not be selected immediately.

## Required selection constraints

Select exactly one immediate next primary route.

Prefer the smallest coherent docs-first route with repository-local evidence and no blocked authored-input prerequisite.

Do not select:

- faction seed work unless the exact reopening gate in `docs/design/faction-authority-seed-evidence-deferral.md` is met;
- People/NPC work unless new authored person/NPC input exists;
- service expansion, resource/commodity expansion, or combat health expansion without their accepted prerequisites;
- generic `world.pois`;
- Highcrown Knowledge reopening;
- a general organization umbrella;
- live content implementation where an evidence/boundary/schema/deferral step is still needed;
- normal content-lint registration without approved live content and a separate exact-once registration decision;
- runtime, UI, save/account, gameplay, or `0.6.0` transition without a dedicated readiness decision.

## Candidate route guidance

Likely eligible docs-first directions may include, if supported by current roadmap/backlog evidence:

- an institution/office authority boundary decision;
- a government/jurisdiction/law/force boundary decision;
- a business/company authority boundary decision;
- a provider/service-organization boundary decision;
- a membership/affiliation/rank/office-holder link authority boundary decision;
- a local reputation/standing/favorability boundary decision;
- a location/place specialization evidence audit that does not reopen generic POIs;
- a family/lineage/household evidence audit if not People/NPC-blocked;
- a property/construction/building ownership boundary decision;
- another narrowly scoped docs-first roadmap lane if clearly more ready.

A preserve-and-select-later outcome is acceptable only if no eligible lane is ready; explain why and select the exact next route accordingly.

## Required sections

The new selection doc should include:

1. Source version/run and date.
2. Selection summary.
3. Current completed-state posture.
4. Guardrails carried forward.
5. Candidate lane inventory.
6. Candidate comparison table.
7. Rejected / paused / closed lane explanations.
8. Eligible lane analysis.
9. Selected option and rationale.
10. Deep Research posture.
11. Support-suffix / explicit-question posture.
12. Explicit non-goals.
13. Selection question answers.
14. Checks run.
15. Next recommended version.

## Required questions

Answer all of the following:

1. Which lanes are currently paused, rejected, closed, or authored-input blocked?
2. Which remaining lanes are genuinely eligible now?
3. Which eligible candidate has the clearest unresolved owner boundary or evidence need?
4. Which candidate has enough repository evidence for a docs-only next step?
5. Which candidate is the smallest safe next route?
6. Is Deep Research required before the selected route?
7. Is a support-suffix run needed?
8. Is an explicit user question needed?
9. Does the selected route authorize content, schema, validator, test, registration, runtime, UI, save/account, or gameplay implementation?
10. What exact next version/name is selected?
11. Which guardrails must be carried into the next prompt?

## Hard guardrails

This run must be docs-only.

Do not:

- create or edit live content;
- create or edit schemas;
- create or edit validators;
- create or edit tests;
- edit normal content-lint registration;
- add aliases or migrations;
- create faction, People/NPC, service, resource/commodity, combat health, POI, Highcrown Knowledge, organization, institution, government, office, business, provider, membership, reputation, family, property, location, runtime, UI, save/account, or gameplay implementation;
- run Deep Research;
- create temporary Deep Research artifacts;
- reopen a paused/rejected/closed lane without its accepted prerequisite;
- infer canon from hooks, prose, tests, examples, demos, derived state, or runtime projections;
- transition to `0.6.0`.

## Allowed changes

Allowed new doc:

- `docs/design/roadmap-post-faction-deferral-selection.md`

Allowed coordination docs:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

Only update other docs if the current handoff/roadmap would otherwise become misleading, and explain why in `docs/dev/current-codex-output.md`.

## Validation expectations

Because this run is docs-only, implementation tests are not required. Do not invent test results.

Run:

```bash
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

If your shell environment does not support `npm.cmd`, use the repo's platform-appropriate npm command and report the exact command used.

Also run lightweight scans for:

- docs-only scope;
- no content/schema/validator/test/normal-lint/runtime/UI/save/account/gameplay edits;
- no Deep Research artifacts;
- no generic `world.pois` implementation;
- no Highcrown Knowledge reopening;
- no faction or People/NPC reopening without authored input;
- no service/resource/commodity/combat health expansion;
- conflict markers;
- trailing whitespace;
- stale next-version pointers;
- current prompt updated to the newly selected next route.

## Expected final posture

After the selection, mark:

- latest completed primary: `Version 0.5.327 - Roadmap Post-Faction Deferral Selection`
- latest support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- immediate next route: the exact selected route from this selection document.

The selected next route should normally be a docs-first evidence audit, boundary decision, schema plan, or preservation gate, not implementation.

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
- post-faction roadmap selection posture;
- selected option and rationale;
- Deep Research / question / support-suffix posture;
- remaining deferred authority guardrails.

Update roadmap/backlog/sequence docs consistently.

Update `docs/dev/current-codex-prompt.md` so it contains the next runnable prompt for the selected route.

## Suggested commit message

`docs(roadmap): select post-faction deferral route`
