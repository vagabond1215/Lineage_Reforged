# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the strict business seed gate:

`Version 0.5.338 - Business Authority Seed Evidence Audit`

## Current accepted repo state

- Latest completed primary: `Version 0.5.337 - Business Authority Schema And Validator`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.338 - Business Authority Seed Evidence Audit`
- Strict business schema, pure validator, focused tests, and schema parse coverage exist.
- Live content, normal registration, candidates, references, migrations, and consumers remain absent.
- Existing evidence was classified in `docs/design/business-company-authority-evidence-audit.md`; do not repeat broad discovery.

## Purpose

Apply the exact completed business record contract and seed gate to current durable authored evidence. Decide whether any complete canonical seed candidate exists, carrying forward zero ids unless every required fact is supported. Do not implement content.

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
- `docs/design/business-authority-schema-plan.md`;
- `docs/design/business-company-authority-boundary-decision.md`;
- `docs/design/business-company-authority-evidence-audit.md`;
- the business schema, validator, and focused tests;
- exact Ironwheel quest evidence and only the already-classified Gannet/account/generated/template/runtime surfaces needed to verify posture.

Do not repeat unrelated or broad evidence discovery.

## Expected output

Add:

- `docs/design/business-authority-seed-evidence-audit.md`

## Required audit decisions

- restate the complete seed gate using the implemented fields and enums;
- assess Ironwheel Haulage Company against every required field without filling gaps by inference;
- preserve Gannet, generated company ids, account assets, template vocabulary, settlement businesses, UI/demo/tests, and quest behavior as non-canonical/separately owned;
- require exact name, enduring-body proof, canonical `business.<slug>` authority, non-invented summary, lifecycle, form, public posture, provenance, notes, and reference-free coherence;
- list exact candidate ids only if every requirement is met;
- otherwise carry forward zero ids and select a fail-closed evidence deferral;
- keep content, normal registration, current prefixes, migrations, consumers, runtime, UI, and account state unchanged;
- decide Deep Research, explicit-user-question, and support-suffix posture;
- select the exact next route.

## Guardrails

Docs only. Do not add/edit business content, schema, validator, tests, schema coverage, normal lint, quests, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent missing Ironwheel facts, promote Gannet/generated ids, normalize/migrate prefixes, add references, or enable consumers. Do not reopen gated/paused/rejected/closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/business-authority-seed-evidence-audit.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/business-validation.test.mjs
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify docs-only scope, unchanged business scaffold and current owners/strings, absent content/registration/candidates/references/migrations/consumer changes, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(economy): audit business seed evidence`
