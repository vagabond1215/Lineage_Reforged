# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run the selected docs-only evidence audit:

`Version 0.5.334 - Business Company Authority Evidence Audit`

## Current accepted repo state

- Latest completed primary: `Version 0.5.333 - Roadmap Post-Institution Deferral Selection`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.334 - Business Company Authority Evidence Audit`
- No dedicated business/company content, schema, validator, or normal registration exists.
- Existing signals mix authored quest presentation, building/workplace descriptors, generated settlement owners/operators, account estate assets, runtime/UI projections, and demo state.
- No candidate id or collection name is approved.

## Purpose

Perform a focused repository evidence audit for business/company identity. Classify current sources, distinguish static named identity from templates, property/account ownership, providers, mutable ledgers, and projections, and decide whether a later boundary decision is justified. Do not design a schema or implement content.

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
- `docs/design/roadmap-post-institution-deferral-selection.md`;
- organization/faction/guild evidence and boundary decisions;
- economy, settlement/place, service/provider, family/estate, People/NPC/social, civic, and quest authority boundaries;
- the exact Ironwheel Haulage quest giver record;
- building `triggerBusinessTypes`, workplace `businessScale`, derived settlement company owner/operator logic, account estate business classification, runtime/UI business projections, and demo business fixtures;
- any existing contracts or tests needed to classify those surfaces without changing them.

Keep the audit focused on current business/company evidence.

## Expected output

Add:

- `docs/design/business-company-authority-evidence-audit.md`

## Required audit decisions

- confirm absence of dedicated business/company content, schema, validator, and registration;
- inventory and classify each current business/company signal as strong canonical evidence, partial authored evidence, presentation-only anchor, reusable template vocabulary, mutable account/property state, synthetic/derived runtime identity, demo/UI state, or hypothetical design guidance;
- determine whether `business` and `company` currently mean the same identity family, separate families, or unresolved layers;
- separate static identity from workplace/building templates, provider association, property/ownership, workforce, inventory/stock, prices, contracts, finance, upgrades, reputation, quest behavior, runtime ledgers, UI, and save/account state;
- protect guild, institution, faction, polity, religion/order, family/household, People/NPC, place/facility, service, profession/role, and account-estate owners;
- assess the Ironwheel Haulage Company anchor without promoting it automatically;
- assess generated `company.*` and demo `business.*` ids as non-canonical unless proven otherwise;
- list exact candidate ids only if current durable canon supports complete identity facts; otherwise carry forward zero ids;
- decide whether a later business/company boundary decision is justified, or whether the lane needs authorship/research/preservation instead;
- decide Deep Research, explicit-user-question, and support-suffix posture;
- select the exact next route.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, runtime, UI, account estate, save/account, or gameplay. Do not invent ids, normalize `business` to `company`, migrate anchors, or authorize providers/property/ledgers. Do not reopen gated/paused/rejected/closed lanes. Do not run Deep Research unless a precise external question and direct consumer are first identified.

## Allowed changes

- `docs/design/business-company-authority-evidence-audit.md`
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

Verify docs-only scope, unchanged content/contracts/runtime/UI/account state, no candidate or migration artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(economy): audit business company authority`
