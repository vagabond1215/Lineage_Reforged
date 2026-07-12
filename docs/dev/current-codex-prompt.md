# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the focused force/public-order owner decision:

`Version 0.5.346 - Force Public Order Authority Boundary Decision`

## Current accepted repo state

- Latest completed primary: `Version 0.5.345 - Force Public Order Authority Evidence Audit`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.346 - Force Public Order Authority Boundary Decision`
- Exactly zero canonical force ids passed the evidence audit.
- Aurelis Civic Watch remains partial quest presentation under an `office.*` anchor.
- Settlement force-like signals remain place descriptors; route-security watch ids are test-only; synthetic garrison/military ids remain derived.
- Static force identity remains separate from enforcement/runtime.

## Purpose

Decide whether civic guard/watch, militia, garrison, military force/order, route-security body, and other public-order identities belong to one broad future static authority family or require narrower owners. Define exact exclusions, carry forward zero ids, and select at most one later schema-planning or fail-closed deferral route. Do not implement anything.

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
- `docs/design/civic-authority-boundary-decision.md`;
- government/jurisdiction and institution/office boundaries/deferrals;
- route-security schema/validator posture;
- exact already-audited quest, place, derived, combat, prose, consumer, test, and runtime surfaces only as needed to confirm the boundary.

Do not repeat the evidence audit or broaden discovery.

## Expected output

Add:

- `docs/design/force-public-order-authority-boundary-decision.md`

## Required boundary decisions

- decide one broad force family versus separate civic-watch, militia, garrison, military-force/order, route-security-body, or other owners;
- define what static force identity may own and what remains descriptive relationship/state;
- separate force from polity, government, jurisdiction, law, institution, office, guild/religious order/faction, place/facility, profession/role, combat actor/unit/party, route-security overlay, quest/reputation, and runtime;
- define boundaries for affiliation, mandate, coverage, headquarters, public posture, readiness, membership, rank, office-holders, roster, schedule, patrol, spawn, encounter, AI, arrest, enforcement, cases, access, reputation, runtime, UI, save/account, and gameplay;
- classify Aurelis Civic Watch, settlement descriptors, route-security fixtures, and synthetic garrison ids as non-canonical;
- carry forward exactly zero `force.*` ids;
- decide whether a reference-free first-pass contract could be coherent or references are intrinsic and unproven;
- select at most one later schema-planning route, or a fail-closed authored-input/ready-consumer deferral;
- decide Deep Research, explicit-user-question, support-suffix, and exact next-route posture;
- make an explicit temporary-guardrail cleanup decision.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent candidates, promote current strings, add references, normalize prefixes, enable consumers, or plan enforcement/patrol/combat/runtime behavior. Do not reopen authored-input-gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/force-public-order-authority-boundary-decision.md`
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

Verify docs-only scope, unchanged code/content/scaffolds/current owners, zero candidate ids, no force/public-order/government/jurisdiction/law/office content or schema changes, no references/migrations/consumer changes, no gated-lane reopening, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(civic): decide force public-order boundary`
