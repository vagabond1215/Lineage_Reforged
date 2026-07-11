# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the next docs-first route:

`Version 0.5.325 - Faction Authority Seed Evidence Audit`

## Current accepted state

Latest completed primary:

- `Version 0.5.324 - Faction Authority Schema And Validator`

Latest support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next route:

- `Version 0.5.325 - Faction Authority Seed Evidence Audit`

Current faction posture:

- `packages/schemas/civilization/faction.schema.json` exists.
- `tools/content-lint/factions.mjs` exists and exports pure `validateFactions(wrapper, options)` validation.
- `tests/unit/faction-validation.test.mjs` exists and covers the faction validation contract plus absence gates.
- `tests/unit/schema-files.test.mjs` includes faction schema parse coverage.
- `packages/content/base/civilization/factions.json` remains absent.
- `tools/content-lint/index.mjs` remains without faction normal-lint registration.
- No live faction record or candidate id is approved.
- Deep Research is not required before this route.

## Required first steps

Start by syncing and inspecting the current repo state:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

If the pull reports the known multi-branch fast-forward ambiguity, verify alignment with:

```bash
git rev-parse HEAD
git rev-parse origin/master
git merge-base HEAD origin/master
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
- `docs/design/faction-authority-schema-plan.md`
- `docs/design/organization-faction-guild-boundary-decision.md`
- `docs/design/organization-faction-guild-authority-evidence-audit.md`
- `docs/design/civic-authority-boundary-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/people-npc-seed-evidence-deferral.md`
- `docs/design/people-npc-authority-evidence-audit.md`
- `packages/schemas/civilization/faction.schema.json`
- `tools/content-lint/factions.mjs`
- `tests/unit/faction-validation.test.mjs`
- `tests/unit/schema-files.test.mjs`
- `tools/content-lint/index.mjs`

Also search for current faction-like references and known weak inference sources, including `faction`, `factionId`, `factionIds`, guilds, religious orders, polities, quest anchors, settlement prose, backstory hooks, runtime groups, movement/ideology labels, and standing/reputation language.

Do not assume this prompt is more current than the repository. Inspect fresh local state before editing.

## Expected output

Add one docs-only audit:

- `docs/design/faction-authority-seed-evidence-audit.md`

## Audit goal

Determine whether the current repository contains any durable canonical faction evidence that satisfies the accepted faction seed gate from `docs/design/faction-authority-schema-plan.md`.

Classify every faction-like reference as one of:

1. strong canonical faction evidence;
2. possible but incomplete faction evidence;
3. weak or prohibited inference source;
4. existing-owner evidence, not faction evidence;
5. runtime/player-state/projection evidence, not authored static identity;
6. test/example/guardrail-only evidence.

The audit may validly conclude that no seed plan is justified.

## Required audit questions

Answer at least:

1. Is live faction content present?
2. Is normal faction content-lint registration present?
3. Are any live `faction.*` records present in content?
4. Are any exact faction candidate ids already approved?
5. What faction-like references were found?
6. Which references are schema/test/guardrail only?
7. Which references are runtime/player-state/projection only?
8. Which references are better owned by guild, polity, religion/order, business, family/house, service, place, quest, Knowledge, People/NPC, account, reputation, or runtime owners?
9. Is there any strong canonical faction evidence satisfying every seed gate requirement?
10. Is there any possible but incomplete faction evidence?
11. Is a faction seed plan justified now?
12. Is live faction content implementation authorized now?
13. Is normal content-lint registration authorized now?
14. Is schema/validator expansion authorized now?
15. Is Deep Research required before the immediate next route?
16. Is a support-suffix run needed?
17. Is an explicit user question needed before the next numbered route?
18. What immediate next route is selected?

## Required sections

The new audit doc should include:

1. Source version/run and date.
2. Audit summary.
3. Current completed-state posture.
4. Faction infrastructure posture.
5. Evidence source inventory.
6. Faction-like evidence classification table.
7. Strong candidate analysis.
8. Possible/incomplete candidate analysis.
9. Insufficient source classes.
10. Existing-owner protection notes.
11. Options considered.
12. Selected option and rationale.
13. Future reopening/seed gate.
14. Deep Research posture.
15. Support-suffix / explicit-question posture.
16. Explicit non-goals.
17. Audit question answers.
18. Checks run.
19. Next recommended version.

## Next-route guidance

Select based on evidence:

- If safe canonical candidates exist: `Version 0.5.326 - Faction Authority Seed Plan`.
- If no safe candidates exist: `Version 0.5.326 - Faction Authority Seed Evidence Deferral`.
- If explicit authorship is the best immediate next step: `Version 0.5.326 - Faction Authority Authored Seed Request`.

Expected outcome unless current repo evidence proves otherwise:

- `Version 0.5.326 - Faction Authority Seed Evidence Deferral`

Do not route directly to live content, normal lint registration, schema expansion, runtime behavior, UI, save/account, gameplay, Deep Research, or `0.6.0`.

## Hard guardrails

This run is docs-only.

Do not create or edit live content, schemas, validators, tests, normal-lint registration, runtime, UI, save/account, or gameplay paths. Do not create `packages/content/base/civilization/factions.json`. Do not approve weak candidates. Do not infer factions from existing owners, hooks, prose, examples, generated projections, or runtime/player state.

## Allowed changes

Allowed new doc:

- `docs/design/faction-authority-seed-evidence-audit.md`

Allowed prompt/coordination docs:

- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

Only update other files if the current handoff would otherwise become misleading, and explain why in `docs/dev/current-codex-output.md`.

## Required checks

Run:

```bash
node --test tests/unit/faction-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

If `npm.cmd` is unavailable, use the repo-appropriate npm command and report the exact command used.

Also scan for:

- no live faction wrapper;
- no normal faction registration;
- no live candidate `faction.*` ids in content;
- no content/schema/validator/test/normal-lint/runtime/UI/save/account/gameplay edits;
- no Deep Research artifact;
- no generic `world.pois`, Highcrown Knowledge, People/NPC, service, resource/commodity, or combat health reopening;
- conflict markers;
- trailing whitespace;
- stale next-version pointers.

## Expected final posture

If no safe candidates exist, mark:

- latest completed primary: `Version 0.5.325 - Faction Authority Seed Evidence Audit`
- latest support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- immediate next route: `Version 0.5.326 - Faction Authority Seed Evidence Deferral`

If safe candidates exist, select `Version 0.5.326 - Faction Authority Seed Plan` and explain the exact evidence basis.

## Final output requirements

Update `docs/dev/current-codex-output.md` with result, changed files, checks, runtime confirmation, risks/follow-up, next version, and suggested commit.

Update `docs/dev/current-gpt-handoff.md` with latest completed primary, support/audit run, immediate next route, faction seed evidence posture, selected option, Deep Research/question/support-suffix posture, and remaining guardrails.

Update roadmap/backlog/sequence docs consistently.

Update `docs/dev/current-codex-prompt.md` at the end only if the selected next route changes from the expected route and the current prompt would otherwise mislead the next run.

## Suggested commit message

`docs(civ): audit faction seed evidence`
