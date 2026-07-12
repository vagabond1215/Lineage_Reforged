# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Decide the commercial identity owner boundary:

`Version 0.5.335 - Business Company Authority Boundary Decision`

## Current accepted repo state

- Latest completed primary: `Version 0.5.334 - Business Company Authority Evidence Audit`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.335 - Business Company Authority Boundary Decision`
- The evidence audit carries forward exactly zero candidate ids.
- No dedicated business/company content, schema, validator, registration, or canonical prefix exists.
- `business` and `company` are unresolved across quest, templates, account state, derived simulation, UI/demo, and tests.

## Purpose

Create a docs-only business/company authority boundary decision. Decide whether one narrow static commercial-body identity owner is justified, whether business/company are synonyms or distinct layers, what the owner may contain, and what remains with existing template/property/account/runtime owners. Do not design a schema or implement content.

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
- `docs/design/business-company-authority-evidence-audit.md`;
- `docs/design/roadmap-post-institution-deferral-selection.md`;
- organization/faction/guild and institution/office boundary patterns;
- economy, settlement/place, service/provider, family/estate, People/NPC/social, civic, quest, account estate, and runtime ownership boundaries;
- exact current business/company surfaces classified by the audit.

Do not repeat broad evidence discovery.

## Expected output

Add:

- `docs/design/business-company-authority-boundary-decision.md`

## Required boundary decisions

- decide whether a dedicated static commercial-body identity authority is justified;
- decide whether `business` and `company` are synonyms, subtype/supertype vocabulary, or distinct identity/state layers;
- decide the conceptual authority name only if safe; do not implement paths or a schema;
- define exactly what stable descriptive identity may be owned;
- keep building/workplace templates, places/facilities, services/providers, property/ownership, account estate, workforce, stock/inventory, prices, contracts, finance, upgrades, reputation, quests, runtime ledgers, UI, and save/account state separate;
- preserve guild, institution, faction, polity, religion/order, family/household, People/NPC, profession/role, and civic owners;
- decide whether branches, brands, ventures, sole traders, partnerships, companies, merchant houses, and generated operators belong in the first boundary or remain deferred;
- decide prefix posture without renaming or migrating current `business.*`/`company.*` strings;
- keep Ironwheel Haulage Company and Gannet Cutter unapproved unless a later seed gate is explicitly selected;
- decide whether the owner is schema-ready for one docs-only schema plan, requires a narrower evidence/authorship gate, or should be preserved/deferred;
- decide Deep Research, user-question, and support-suffix posture;
- select the exact next route.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, quests, runtime, UI, account estate, save/account, or gameplay. Do not normalize prefixes, migrate anchors, approve candidate ids, or authorize provider/property/ledger behavior. Do not reopen gated/paused/rejected/closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/business-company-authority-boundary-decision.md`
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

Verify docs-only scope, unchanged content/contracts/runtime/UI/account/quest state, zero candidate ids, no prefix migration, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(economy): decide business company boundary`
