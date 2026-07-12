# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused diplomacy/conflict owner decision:

`Version 0.5.350 - Diplomacy Conflict Authority Boundary Decision`

## Current accepted repo state

- Latest completed primary: `Version 0.5.349 - Diplomacy Conflict Authority Evidence Audit`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.350 - Diplomacy Conflict Authority Boundary Decision`
- Exactly zero diplomatic-relation ids and zero `conflict.*` ids passed the evidence audit.
- Two planned polities provide static actor identity only and have no authored relation.
- Four map conflict zones remain display/reference summaries, not conflict records.
- Diplomacy, conflict, claims/borders/control/occupation, government, jurisdiction, law, force, places, combat, and runtime remain separate.

## Purpose

Define separate future owner boundaries for diplomatic relations and conflict identity/history. Decide exact exclusions, actor/participant and temporal requirements, reference-free coherence, and at most one later schema-planning or fail-closed deferral route. Do not implement anything.

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
- `docs/design/diplomacy-conflict-authority-evidence-audit.md`;
- `docs/design/civic-authority-boundary-decision.md`;
- polity, government/jurisdiction, force/public-order, faction/institution, map, event/Chronicle, and runtime boundaries only as needed to confirm ownership.

Do not repeat the evidence audit or broaden discovery.

## Expected output

Add:

- `docs/design/diplomacy-conflict-authority-boundary-decision.md`

## Required boundary decisions

- preserve diplomacy and conflict as separate future owners or explain any narrower alternative without creating a generic political-state umbrella;
- define what a static diplomatic relation may own, including actor references, direction/symmetry, relation kind, public posture, lifecycle, effective temporal validity, provenance, and non-implication boundaries;
- define what a conflict identity/history record may own, including identity criteria, participant references/roles, conflict kind, temporal posture/history, lifecycle, provenance, and non-implication boundaries;
- decide how diplomatic relations and conflicts may reference one another without deriving peace, alliance, rivalry, recognition, war, or outcomes automatically;
- keep claims, borders, territory, control, occupation state, government, jurisdiction, law, courts, force, faction/institution, places, route security, quest/event/Chronicle, reputation, combat, runtime, UI, and save/account separate;
- classify the four map conflict zones, polity identities, place/quest prose, UI/creator vocabulary, combat allies/hostility, reputation `wartime`, validators, and tests as non-canonical relation/conflict evidence;
- carry forward exactly zero candidate ids;
- decide whether reference-free first-pass contracts are coherent or actor/participant references and temporal semantics are intrinsic and unproven;
- select at most one later schema-planning route or a fail-closed authored-input/ready-consumer deferral;
- decide Deep Research, explicit-user-question, support-suffix, and temporary-guardrail posture.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent actors, diplomatic pairs, conflicts, participants, roles, causes, dates, outcomes, claims, borders, treaties, alliances, wars, ids, or canon. Do not add references, normalize prefixes, enable consumers, or plan diplomacy/war/combat runtime. Do not reopen gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/diplomacy-conflict-authority-boundary-decision.md`
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

Verify docs-only scope, unchanged code/content/scaffolds/current owners, zero candidate ids, no diplomacy/conflict/claim/control content or schema changes, no references/migrations/consumer/runtime changes, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers.

## Suggested commit message

`docs(civic): decide diplomacy conflict boundary`
