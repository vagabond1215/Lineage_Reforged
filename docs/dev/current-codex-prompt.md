# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Plan the future strict business identity contract:

`Version 0.5.336 - Business Authority Schema Plan`

## Current accepted repo state

- Latest completed primary: `Version 0.5.335 - Business Company Authority Boundary Decision`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.336 - Business Authority Schema Plan`
- One future `civilization.businesses` static identity family is approved in principle.
- Business is the broad identity family; company is a possible descriptive form, not a separate owner.
- Exactly zero candidates are approved.
- No business content, schema, validator, focused test, or normal registration exists.

## Purpose

Create a docs-only business authority schema plan. Define a strict content-independent static identity contract, paths, fields, vocabularies, validation/test posture, and separate seed/registration gates without implementing files or promoting current strings.

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
- `docs/design/business-company-authority-boundary-decision.md`;
- `docs/design/business-company-authority-evidence-audit.md`;
- nearby institution and faction schema plans, schemas, validators, and focused tests;
- building/workplace, settlement/place, service/provider, account estate, quest, and runtime boundaries needed to define forbidden fields;
- `tests/unit/schema-files.test.mjs` and `tools/content-lint/index.mjs` conventions.

Do not repeat evidence discovery or infer candidates.

## Expected output

Add:

- `docs/design/business-authority-schema-plan.md`

## Required plan decisions

- decide exact future paths, likely:
  - `packages/content/base/civilization/businesses.json`;
  - `packages/schemas/civilization/business.schema.json`;
  - `tools/content-lint/businesses.mjs`;
  - `tests/unit/business-validation.test.mjs`;
- strict records-only wrapper and absent empty live wrapper posture;
- `business.<lower_snake_slug>` id/slug coherence and uniqueness;
- minimum required static identity fields;
- lifecycle vocabulary aligned with nearby authorities;
- narrow descriptive category/form and public-posture vocabularies only if safe;
- no first-pass references unless one non-implicating need is proven; prefer none;
- explicit rejection of owners/people, organizations, places/facilities, services/providers, property/account estate, workforce, schedules, production, inventory/stock, prices, contracts, finance, upgrades, reputation/access, quests, runtime ledgers, UI, save/account, and gameplay fields;
- pure issue-returning in-memory validator behavior;
- focused tests and schema-file parse coverage;
- normal content-lint registration deferral until approved live content exists;
- seed evidence gate and zero-candidate posture;
- Ironwheel/Gannet/generated-company non-promotion posture;
- whether schema/validator implementation is the next safe route.

## Guardrails

Docs only. Do not add/edit content, schemas, validators, tests, normal lint, contracts, quests, runtime, UI, account estate, save/account, or gameplay. Do not approve candidates, normalize/migrate prefixes, add aliases, or enable consumers. Do not reopen gated/paused/rejected/closed lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/business-authority-schema-plan.md`
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

Verify docs-only scope, unchanged content/contracts/runtime/UI/account/quest state, zero candidates, no prefix migration or consumer enablement, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the selected next route.

## Suggested commit message

`docs(economy): plan business authority schema`
