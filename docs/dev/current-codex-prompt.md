# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the civic authored-input deferral:

`Version 0.5.343 - Government Jurisdiction Authority Evidence Deferral`

## Current accepted repo state

- Latest completed primary: `Version 0.5.342 - Government Jurisdiction Authority Boundary Decision`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.343 - Government Jurisdiction Authority Evidence Deferral`
- Government organization and jurisdiction applicability are separate future owners.
- Exactly zero government ids and zero jurisdiction ids carry forward.
- Neither owner is schema-ready because each requires unproven relationship/cardinality/temporal semantics.
- Law remains downstream of jurisdiction; force/enforcement remains separate.
- Quest `office.*` anchors and synthetic `authority.*` ids remain non-canonical.

## Purpose

Formalize the fail-closed government/jurisdiction deferral. Fix exact reopening inputs, prohibit unchanged-source rescans, preserve separate future gates and every current owner, and route back to roadmap selection. Do not implement or schema-plan either authority.

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
- `docs/design/government-jurisdiction-authority-boundary-decision.md`;
- `docs/design/government-jurisdiction-authority-evidence-audit.md`;
- prior faction, institution, business, and People/NPC authored-input deferrals only as needed for structure;
- civic/polity/institution-office boundaries and live posture only as needed to verify preservation.

Do not repeat civic evidence discovery.

## Expected output

Add:

- `docs/design/government-jurisdiction-authority-evidence-deferral.md`

## Required deferral decisions

- carry forward exactly zero `government.*` and zero `jurisdiction.*` ids;
- declare the `0.5.341` evidence audit and `0.5.342` boundary decision complete;
- prohibit rerunning unchanged-source scans or schema planning without a qualifying input;
- define qualifying reopening inputs: explicit user-authored/approved canon with relationship and temporal facts, a materially new canonical repository source, an authorized civic-content authorship pass, or a concrete ready consumer proving one minimal static contract with stable referenced owners;
- define non-qualifying inputs: consumer vocabulary alone, quest anchors, generated ids, settlement descriptors, polity form/place anchors, property/legal/access/runtime state, tests/demos/UI, external research, genre convention, or fact recombination;
- preserve separate future seed/content, schema, registration, reference, and consumer gates;
- preserve law after jurisdiction and force/enforcement as separate;
- decide explicit-user-question timing, Deep Research, support-suffix, and exact next route;
- keep temporary civic research retired.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account state, save/account, or gameplay. Do not invent candidates or reference semantics, promote current strings, add references, normalize prefixes, enable consumers, or plan law/force/runtime behavior. Do not reopen authored-input-gated, paused, rejected, or closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/government-jurisdiction-authority-evidence-deferral.md`
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

Verify docs-only scope, unchanged polity/institution/current-owner surfaces, zero candidate ids, absent government/jurisdiction/law/force content/schema/reference/consumer changes, no repeated evidence scan, no gated-lane reopening, retired temporary civic research, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to `Version 0.5.344 - Roadmap Post-Government-Jurisdiction Deferral Selection`.

## Suggested commit message

`docs(civic): defer government jurisdiction authority`
