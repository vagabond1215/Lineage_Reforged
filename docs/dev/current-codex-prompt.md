# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the next docs-only evidence gate:

`Version 0.5.331 - Institution Authority Seed Evidence Audit`

## Current accepted repo state

- Latest completed primary: `Version 0.5.330 - Institution Authority Schema And Validator`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.331 - Institution Authority Seed Evidence Audit`
- Strict institution schema, pure validator, focused tests, and schema parse coverage exist.
- Live institution content, normal registration, candidate ids, references, resolvers, and consumer enablement remain absent.
- Office remains separate and not schema-ready.

## Purpose

Audit current durable authored repository evidence against the exact institution seed gate. Decide whether any strong canonical institution candidate exists, carrying forward zero ids unless every required fact is supported. Do not implement content.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Read at minimum:

- `AGENTS.md`
- `README.md`
- current output, handoff, prompt, sequence, roadmap, and backlog;
- `docs/design/institution-authority-schema-plan.md`;
- `docs/design/institution-office-authority-boundary-decision.md`;
- the institution schema, validator, and focused tests;
- organization/faction/guild evidence and boundary docs;
- relevant civic, settlement/district/site, guild, religion/order, service, Knowledge, Magic Study, backstory, quest, and runtime sources needed to classify candidate evidence.

Do not repeat broad unrelated discovery.

## Expected output

Add:

- `docs/design/institution-authority-seed-evidence-audit.md`

## Required audit decisions

- restate the exact complete seed gate;
- classify every plausible current institution-shaped source as strong canonical evidence, partial evidence, another owner's canon, consumer vocabulary, presentation/prose, synthetic/derived/runtime, or hypothetical;
- require exact canonical name, unambiguous institution identity, safe id/slug authority, non-invented summary, category, public posture, lifecycle, durable provenance, and non-implication notes;
- reject inference from office anchors, generic building/workplace nouns, school/academy/archive/hospital/court/charity labels, Knowledge/Magic Study/backstory/service hooks, guilds, factions, religious orders, polities, businesses, places/facilities, generated companies, derived institution profiles, runtime indexes, demos, UI, tests, or design examples;
- list exact candidate ids only if the complete gate is met;
- otherwise carry forward zero ids and select a fail-closed evidence deferral;
- keep live content, normal registration, references, consumers, office, and behavior closed;
- decide Deep Research, support-suffix, and explicit-user-question posture;
- select the exact next route.

## Guardrails

Docs only. Do not add/edit institution content, schema, validator, tests, schema coverage, normal lint, references, consumers, runtime, UI, save/account, or gameplay. Do not weaken the contract or invent candidates. Do not reopen office or any paused/blocked/rejected/closed lane. Do not run Deep Research unless the audit first identifies a precise external question with a direct repository consumer; external research cannot create canon.

## Allowed changes

- `docs/design/institution-authority-seed-evidence-audit.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify docs-only scope, unchanged institution scaffold, absent live content/normal registration/candidates/references/consumer changes, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the next runnable route.

## Suggested commit message

`docs(civ): audit institution seed evidence`
