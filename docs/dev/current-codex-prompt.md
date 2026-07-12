# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Formalize the fail-closed seed gate:

`Version 0.5.332 - Institution Authority Seed Evidence Deferral`

## Current accepted repo state

- Latest completed primary: `Version 0.5.331 - Institution Authority Seed Evidence Audit`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.332 - Institution Authority Seed Evidence Deferral`
- The institution schema/validator/test scaffold exists and remains content-independent.
- The audit found no complete canonical candidate and carries forward exactly zero ids.
- Live content, normal registration, references, resolvers, and consumers remain absent.
- Office remains separate and not schema-ready.

## Purpose

Create a docs-only institution seed evidence deferral. Fix the exact reopening gate, prohibit repeated weak-source scans without new canon, preserve zero ids, and route back to roadmap selection without implementation.

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
- `docs/design/institution-authority-seed-evidence-audit.md`;
- `docs/design/institution-authority-schema-plan.md`;
- `docs/design/institution-office-authority-boundary-decision.md`;
- the faction and People/NPC evidence-deferral patterns;
- the institution schema, validator, and focused tests only to confirm preserved scaffold posture.

Do not repeat the evidence search.

## Expected output

Add:

- `docs/design/institution-authority-seed-evidence-deferral.md`

## Required decisions

- carry forward exactly zero candidate ids;
- state that the current evidence audit is complete and must not be rerun against unchanged sources;
- define qualifying new durable inputs: an explicit user-authored institution list with complete facts, a new canonical source intentionally naming institution bodies, or an explicitly authorized institution-content authorship pass;
- state that new consumer code, generic prose, additional hooks, external research, generated/derived state, or another broad scan does not reopen the gate;
- preserve the exact complete seed gate and strict no-reference contract;
- keep live content, normal registration, Knowledge/Magic Study and other consumers, runtime, and office work closed;
- decide whether an explicit user question should be asked now or only when institution content is intentionally prioritized;
- decide Deep Research and support-suffix posture;
- select the exact next roadmap-selection route.

## Guardrails

Docs only. Do not add/edit institution content, schema, validator, tests, schema coverage, normal lint, references, consumers, runtime, UI, save/account, or gameplay. Do not invent or carry forward ids. Do not repeat weak-source discovery. Do not reopen office or any paused/blocked/rejected/closed lane. Do not run Deep Research.

## Allowed changes

- `docs/design/institution-authority-seed-evidence-deferral.md`
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

Verify docs-only scope, unchanged scaffold, zero ids, absent content/registration/references/consumer changes, no repeated evidence artifact, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected roadmap-selection route.

## Suggested commit message

`docs(civ): defer institution seed evidence`
