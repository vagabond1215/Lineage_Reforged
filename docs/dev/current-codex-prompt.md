# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the next docs-first evidence audit:

`Version 0.5.325 - Faction Authority Seed Evidence Audit`

## Current accepted repo state

The latest accepted primary run is:

`Version 0.5.324 - Faction Authority Schema And Validator`

That run added the future faction validation scaffold:

- `packages/schemas/civilization/faction.schema.json`
- `tools/content-lint/factions.mjs`
- `tests/unit/faction-validation.test.mjs`
- schema-file parse coverage in `tests/unit/schema-files.test.mjs`

Current confirmed posture:

- Latest completed primary: `Version 0.5.324 - Faction Authority Schema And Validator`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.325 - Faction Authority Seed Evidence Audit`
- `civilization.factions` now has a strict future records-only schema and pure fixture-driven validator.
- `validateFactions(wrapper, options)` returns human-readable issue strings and has no filesystem or owner dependencies.
- Focused faction validation tests cover the full contract and absence gates.
- `packages/content/base/civilization/factions.json` remains absent.
- No live faction candidate id is approved or present in content.
- `tools/content-lint/index.mjs` remains unchanged and has no faction import, path/check, helper call, or invocation.
- Normal registration remains deferred until live content exists and a separate decision approves exact-once wiring.
- Deep Research is not required before this evidence audit.
- No explicit user question or support-suffix run is required.

## Current faction contract posture

The accepted schema/validator implements a strict static identity contract only.

Required future faction record fields:

- `id`
- `slug`
- `name`
- `status`
- `category`
- `publicPosture`
- `summary`
- `sourceAuthorityNotes`
- `notes`

Allowed values:

- `status`: `planned`, `active`, `retired`
- `category`: `political`, `social`, `ideological`, `criminal`, `rebel`, `resistance`, `advocacy`, `pressure_group`, `other`
- `publicPosture`: `public`, `semi_public`, `secret`, `unknown`

The first contract allows no cross-authority references and rejects all unknown fields.

## Purpose

Create a docs-only faction seed evidence audit.

This audit should inspect durable repository evidence for canonical faction candidates against the accepted faction boundary and seed gate.

This run must not create live content, candidate records, schemas, validators, tests, normal content-lint registration, runtime behavior, UI, save/account behavior, or gameplay.

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
- `docs/design/faction-authority-schema-plan.md`
- `docs/design/organization-faction-guild-boundary-decision.md`
- `docs/design/organization-faction-guild-authority-evidence-audit.md`
- `docs/design/civic-authority-boundary-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/people-npc-seed-evidence-deferral.md`
- `docs/design/people-npc-authority-evidence-audit.md`
- `docs/design/static-authority-validation-consolidation-audit.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `packages/schemas/civilization/faction.schema.json`
- `tools/content-lint/factions.mjs`
- `tests/unit/faction-validation.test.mjs`
- `tests/unit/schema-files.test.mjs`
- `tools/content-lint/index.mjs`

Also search/read durable faction-like evidence and forbidden inference surfaces, including:

- `faction`, `factions`, `factionId`, `factionIds`
- `standing`, `reputation`, `favorability`
- `guild`, `religious_order`, `organization`, `institution`
- `office`, `government`, `business`, `company`
- `family`, `house`, `lineage`
- `shadow`, `network`, `movement`, `ideology`
- quest anchors and prose
- backstory hooks
- settlement prose
- runtime groups/projections
- tests/examples/fixtures that mention faction-like fields

Do not assume this prompt is more current than the repository. Inspect fresh local state before editing.

## Expected output

Add one new docs-only audit:

`docs/design/faction-authority-seed-evidence-audit.md`

## Audit goal

Determine whether the current repository contains any durable canonical faction evidence strong enough to justify a later faction seed plan.

The audit must classify evidence against the accepted faction boundary:

A future faction may own only stable authored identity for a durable named organized collective whose primary authored posture is political, social, ideological, criminal, rebel, resistance, advocacy, pressure-group, or similar non-sovereign collective action.

A faction must not duplicate or substitute for:

- guilds;
- polities;
- governments;
- jurisdictions;
- laws;
- civic offices;
- public-order or military forces;
- religions or religious orders;
- businesses or companies;
- families, clans, noble houses, dynasties, or genealogical lineages;
- temporary parties, quest teams, crowds, movement labels, ideology-only concepts, or professions;
- generated shadow networks, derived institution profiles, runtime actor groups, or player standing buckets.

## Seed evidence gate

A candidate can be carried forward only if durable authored repository evidence supplies or permits every required seed fact without invention:

- exact canonical faction name;
- unambiguous `faction.<slug>` id or explicit authority to derive it;
- matching lower-snake-case slug;
- proof the entity satisfies the accepted faction boundary and is not better owned elsewhere;
- non-invented summary;
- supported category, or `other` only when faction identity is proven but narrower category is not;
- supported public posture, or `unknown` when visibility is not authored;
- lifecycle posture, normally `planned` unless evidence supports another current data posture;
- non-empty durable provenance notes;
- notes stating explicit non-implication boundaries;
- confirmation that no members, leaders, affiliations, relationships, standing, services, law, territory, runtime state, UI, save/account, or gameplay behavior is inferred.

Current `factionId` hooks, forbidden-field lists, prose references, guilds, religious orders, quest anchors, settlements, shadow networks, runtime groups, movement/ideology labels, and reputation/standing state are insufficient by default.

## Evidence classifications

Classify all located evidence into these classes:

### Strong candidate evidence

Durable authored repository content that clearly identifies a named faction under the accepted boundary and supplies enough facts for a future schema-valid static identity record without invention.

### Weak or insufficient evidence

Faction-shaped fields, prose, hooks, references, tests, examples, labels, or ambiguous collectives that do not supply the full required seed facts or are better owned elsewhere.

### Existing owner, not faction

Evidence already owned by guild, polity, religion/religious order, service, place, People/NPC gate, economy/account, Knowledge, quest, runtime, or another protected authority.

### Synthetic / derived / runtime-only

Generated shadow networks, runtime groups, derived institution profiles, generated businesses, standing/reputation state, owner/operator categories, or similar non-authored projections.

### Presentation-only metadata

Quest anchors, labels, source vocabulary, UI-facing strings, test fixtures, examples, or documentation language that does not establish canonical faction identity.

## Required audit questions

Answer all of the following:

1. Is live faction content currently present?
2. Are any `faction.*` records present in repository content?
3. Are any canonical faction candidates approved by current evidence?
4. Which faction-like surfaces were scanned?
5. Which evidence, if any, is strong enough to carry forward?
6. Which evidence is weak or insufficient?
7. Which evidence is owned by existing non-faction authorities?
8. Which evidence is synthetic, derived, or runtime-only?
9. Which evidence is presentation-only metadata?
10. Are guilds usable as faction seed evidence?
11. Are religious orders usable as faction seed evidence?
12. Are polities, governments, offices, businesses, families/houses, or services usable as faction seed evidence?
13. Are quest anchors or backstory hooks usable as faction seed evidence?
14. Are shadow networks, runtime groups, reputation/standing, or generated projections usable as seed evidence?
15. Are tests, schemas, examples, or guardrails usable as seed evidence?
16. Does the audit approve a later faction seed plan?
17. Does the audit approve live faction content implementation?
18. Does the audit approve normal content-lint registration?
19. Is Deep Research required before the immediate next route?
20. Is a support-suffix run needed?
21. Is an explicit user question needed before the next numbered route?
22. What immediate next route is selected?

## Required sections

The new audit doc should include:

1. Source version/run and date.
2. Audit summary.
3. Current completed-state posture.
4. Evidence source inventory.
5. Candidate evidence classification table.
6. Strong candidate assessment.
7. Weak/insufficient evidence analysis.
8. Existing-owner exclusions.
9. Synthetic/runtime/presentation exclusions.
10. Seed-readiness decision.
11. Options considered:
    - faction seed plan;
    - seed evidence deferral/preservation gate;
    - repeat schema/validator work;
    - normal content-lint registration;
    - Deep Research;
    - live implementation.
12. Selected option and rationale.
13. Deep Research posture.
14. Support-suffix / explicit-question posture.
15. Explicit non-goals.
16. Audit question answers.
17. Checks run.
18. Next recommended version.

## Next-route decision guidance

Select the next route based on the audit.

### Option A — if strong candidates exist

`Version 0.5.326 - Faction Authority Seed Plan`

Use this only if the audit identifies at least one strong faction candidate with enough durable evidence to draft a future schema-valid record without invention.

The seed plan must remain docs-only and must not create content.

### Option B — likely if no strong candidates exist

`Version 0.5.326 - Faction Authority Seed Evidence Deferral`

Use this if current repository evidence contains no safe faction candidates. This should define a fail-closed reopening gate and route elsewhere.

### Option C — if evidence is inconclusive due to missing repository read coverage

`Version 0.5.326 - Faction Authority Evidence Audit Follow-up`

Use only if a bounded repository source was not inspectable and must be checked before a decision.

### Option D — if external grounding is genuinely required

Use a future Deep Research route only if the audit identifies a concrete external question and named downstream consumer. External research cannot manufacture project canon.

Do not run Deep Research in this route.

Do not route directly to:

- live faction content implementation;
- normal content-lint registration;
- membership/affiliation/reputation implementation;
- service provider implementation;
- government/jurisdiction/law implementation;
- runtime faction behavior;
- UI;
- save/account;
- gameplay;
- `0.6.0`.

## Hard guardrails

This run must be docs-only.

Do not:

- create `packages/content/base/civilization/factions.json`
- add faction records
- approve weak candidate ids
- edit faction schema, validator, or focused tests unless fixing an observed issue required by the audit, and stop first if so
- edit live content
- edit live guild content
- edit polity content
- edit religion content
- edit settlement/district/site content
- edit quest content
- edit Knowledge content
- edit service/resource/commodity/combat health/People/NPC content
- edit `tools/content-lint/index.mjs`
- register factions in normal content lint
- add cross-authority references
- add resolver logic
- add memberships, affiliations, leaders, relationships, ranks, offices, reputation, standing, or favorability
- add provider/service behavior
- add law, jurisdiction, diplomacy, conflict, or territory fields
- add runtime behavior
- add UI
- add save/account behavior
- add gameplay
- infer factions from guilds, religious orders, polities, governments, businesses, families/houses, quest anchors, backstory hooks, settlement prose, shadow networks, runtime groups, movement labels, ideology-only labels, or standing/reputation
- infer people/NPCs from institutions
- duplicate polities, religions, guilds, services, or places into faction or organization authorities
- reopen generic `world.pois`
- reopen Highcrown Knowledge
- reopen People/NPC without a new authored input
- resume service/resource/commodity/combat-health lanes
- run Deep Research
- create temporary Deep Research artifacts

## Allowed changes

Allowed new doc:

- `docs/design/faction-authority-seed-evidence-audit.md`

Allowed coordination docs:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

Only update other files if the current handoff would otherwise become misleading or if a required audit check exposes an actual issue that must be fixed before continuing. Explain any extra change in `docs/dev/current-codex-output.md`.

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

If your shell environment does not support `npm.cmd`, use the repo’s platform-appropriate npm command and report the exact command used.

Also run lightweight scans for:

- no live `packages/content/base/civilization/factions.json`;
- no normal faction content-lint registration;
- no approved candidate `faction.*` ids in content;
- only allowed docs and coordination docs changed;
- no schema/validator/test edits unless explicitly justified;
- no live content edits;
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

If no strong faction candidates are found, mark:

- latest completed primary: `Version 0.5.325 - Faction Authority Seed Evidence Audit`
- latest support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- immediate next route: `Version 0.5.326 - Faction Authority Seed Evidence Deferral`

If strong candidates are found, select `Version 0.5.326 - Faction Authority Seed Plan` and list exactly which ids are carried forward and why they pass the gate.

If evidence is inconclusive, select a bounded follow-up and explain the missing source.

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
- faction seed evidence posture;
- selected option and rationale;
- live content and normal registration posture;
- Deep Research / question / support-suffix posture;
- remaining deferred authority guardrails.

Update roadmap/backlog/sequence docs consistently.

Update `docs/dev/current-codex-prompt.md` so it contains the next runnable prompt after this route, not this completed route, if the repository convention is to keep it as the active prompt.

## Suggested commit message

`docs(civ): audit faction seed evidence`
