# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the business authored-input deferral:

`Version 0.5.339 - Business Authority Seed Evidence Deferral`

## Current accepted repo state

- Latest completed primary: `Version 0.5.338 - Business Authority Seed Evidence Audit`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.339 - Business Authority Seed Evidence Deferral`
- Strict business schema, pure validator, focused tests, and schema parse coverage exist.
- The complete evidence gate found exactly zero canonical candidates.
- Ironwheel remains partial quest-owned evidence; all other classified business/company surfaces remain non-canonical or separately owned.
- Live content, normal registration, references, migrations, and consumers remain absent.

## Purpose

Formalize the fail-closed business seed deferral. Fix the exact authored-input reopening gate, prohibit repeated scans of unchanged evidence, preserve every current owner and scaffold boundary, and route back to roadmap selection. Do not implement content.

## Required first steps

Run:

```bash
git status --short --branch
git fetch origin
git pull --ff-only origin master
```

Read at minimum:

- `AGENTS.md`;
- `README.md`;
- current output, handoff, prompt, sequence, roadmap, and backlog;
- `docs/design/business-authority-seed-evidence-audit.md`;
- `docs/design/business-authority-schema-plan.md`;
- the business schema, validator, and focused tests;
- faction, People/NPC, and institution evidence-deferral patterns only as needed for structure.

Do not repeat business evidence discovery.

## Expected output

Add:

- `docs/design/business-authority-seed-evidence-deferral.md`

## Required deferral decisions

- carry forward exactly zero `business.*` ids;
- declare the `0.5.338` evidence audit complete and prohibit rerunning it against unchanged sources;
- preserve the exact implemented seed gate and content-independent scaffold;
- define qualifying reopening inputs: an explicit user-authored/approved canonical list, a materially new canonical repository source, or an explicitly authorized focused business-content authorship pass;
- define non-qualifying inputs, including consumer demand, generated/runtime/account/template/demo/test evidence, external research, genre convention, and fact recombination;
- keep live content and normal registration absent until their separate gates are explicitly selected;
- preserve reference-free first-pass identity and all current owners/prefixes;
- decide when an explicit user question becomes appropriate;
- keep Deep Research unnecessary and reject a support-suffix run;
- select `Version 0.5.340 - Roadmap Post-Business Deferral Selection` next.

## Guardrails

Docs only. Do not add/edit business content, schema, validator, tests, schema coverage, normal lint, quests, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent Ironwheel facts, promote Gannet/generated ids, normalize/migrate prefixes, add references, enable consumers, or repeat broad discovery. Do not reopen gated/paused/rejected/closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/business-authority-seed-evidence-deferral.md`
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

Verify docs-only scope, unchanged business scaffold and current owners/strings, absent content/registration/candidates/references/migrations/consumer changes, no repeated evidence scan, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(economy): defer business seed authority`
