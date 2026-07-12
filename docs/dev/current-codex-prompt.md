# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused force/public-order evidence deferral:

`Version 0.5.347 - Force Public Order Authority Evidence Deferral`

## Current accepted repo state

- Latest completed primary: `Version 0.5.346 - Force Public Order Authority Boundary Decision`
- Latest completed support/audit run: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
- Immediate next primary route: `Version 0.5.347 - Force Public Order Authority Evidence Deferral`
- One broad future static force identity family is selected for enduring civic-watch, militia, garrison, military-force, and route-security organizations.
- Exactly zero `force.*` ids carry forward.
- Affiliation, mandate, coverage, and headquarters relationships are intrinsic but unproven.
- Force authority is boundary-ready but not schema-ready; a reference-free schema plan is rejected.

## Purpose

Fail closed on force/public-order evidence. Define the exact authored-input or ready-consumer conditions that may reopen schema planning or seed work, prohibit repeated scans of unchanged weak sources, preserve separate future gates, and return to roadmap selection. Do not implement anything.

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
- `docs/design/force-public-order-authority-evidence-audit.md`;
- `docs/design/force-public-order-authority-boundary-decision.md`;
- government/jurisdiction, institution, faction, business, and People/NPC evidence-deferral patterns only as needed to align reopening gates.

Do not repeat the force evidence audit or broaden discovery.

## Expected output

Add:

- `docs/design/force-public-order-authority-evidence-deferral.md`

## Required deferral decisions

- preserve one broad future force family and exactly zero `force.*` ids;
- define materially new authored canon, an approved exact seed list, an authorized civic authorship pass, and a ready-consumer contract as possible reopening inputs;
- specify the minimum force identity plus affiliation, mandate, coverage, and headquarters evidence required before schema planning or a seed can proceed;
- reject unchanged quest presentation, place prose/tags/names, route-security posture/fixtures, synthetic authority ids, combat/backstory/UI/reputation/test/runtime strings, and unsupported user-facing labels as reopening evidence;
- keep schema, validator, content, registration, references, migrations, consumers, and runtime as separate future gates;
- preserve all adjacent identity, place, route-security, law, enforcement, combat, runtime, UI, and save/account owners;
- decide explicit-user-question timing, Deep Research, support-suffix, and temporary-guardrail posture;
- select `Version 0.5.348 - Roadmap Post-Force-Public-Order Deferral Selection` next without reopening another gated lane in this run.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent candidates, promote current strings, add references, normalize prefixes, enable consumers, or plan enforcement/patrol/combat/runtime behavior. Do not reopen authored-input-gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/force-public-order-authority-evidence-deferral.md`
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

Verify docs-only scope, unchanged code/content/scaffolds/current owners, zero candidate ids, no force/public-order/government/jurisdiction/law/office content or schema changes, no references/migrations/consumer changes, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers.

## Suggested commit message

`docs(civic): defer force public-order evidence`
