# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused diplomacy/conflict evidence deferral:

`Version 0.5.351 - Diplomacy Conflict Authority Evidence Deferral`

## Current accepted repo state

- Latest completed primary: `Version 0.5.350 - Diplomacy Conflict Authority Boundary Decision`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.351 - Diplomacy Conflict Authority Evidence Deferral`
- Diplomatic relations and conflict identity/history are separate future owners.
- Exactly zero diplomatic-relation ids and zero `conflict.*` ids carry forward.
- Actor/participant references, direction/cardinality, and effective temporal/history semantics are intrinsic but unproven.
- Neither owner is schema-ready; reference-free and combined schemas are rejected.

## Purpose

Fail closed on diplomacy/conflict evidence. Define the exact authored-input or ready-consumer conditions that may reopen schema planning or seed work, prohibit repeated scans of unchanged weak sources, preserve separate future gates and owners, and return to roadmap selection. Do not implement anything.

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
- `docs/design/diplomacy-conflict-authority-boundary-decision.md`;
- government/jurisdiction and force/public-order evidence-deferral patterns only as needed to align reopening gates.

Do not repeat the diplomacy/conflict evidence audit or broaden discovery.

## Expected output

Add:

- `docs/design/diplomacy-conflict-authority-evidence-deferral.md`

## Required deferral decisions

- preserve separate diplomacy and conflict owners and exactly zero candidate ids;
- define materially new authored canon, an approved exact relation/conflict list, an authorized political-content authorship pass, and a ready-consumer contract as possible reopening inputs;
- specify the minimum diplomatic actor/reference, direction/symmetry, cardinality, relation-kind, visibility, lifecycle, and effective-validity evidence required before schema planning or a seed;
- specify the minimum conflict identity, participant/role, kind, temporal-history, lifecycle, provenance, uncertainty, and non-implication evidence required before schema planning or a seed;
- reject unchanged map conflict zones, polity identities, place/quest prose, UI/creator vocabulary, combat allies/hostility, reputation `wartime`, validators/tests, design examples, external research, and runtime labels as reopening evidence;
- keep readiness, schema plan, schema/validator, seed plan, content, registration, references, migrations, consumers, and runtime as separate future gates;
- preserve claims/borders/territory/control/occupation and all adjacent identity, place, event, combat, runtime, UI, and save/account owners;
- decide explicit-user-question timing, Deep Research, support-suffix, and temporary-guardrail posture;
- select `Version 0.5.352 - Roadmap Post-Diplomacy-Conflict Deferral Selection` next without reopening another gated lane.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent actors, pairs, relations, conflicts, participants, roles, causes, dates, outcomes, claims, borders, treaties, alliances, wars, ids, or canon. Do not add references, normalize prefixes, enable consumers, or plan diplomacy/war/combat runtime. Do not reopen gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/diplomacy-conflict-authority-evidence-deferral.md`
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

`docs(civic): defer diplomacy conflict evidence`
