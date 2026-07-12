# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the narrow business validation scaffold:

`Version 0.5.337 - Business Authority Schema And Validator`

## Current accepted repo state

- Latest completed primary: `Version 0.5.336 - Business Authority Schema Plan`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.337 - Business Authority Schema And Validator`
- The exact strict contract is defined in `docs/design/business-authority-schema-plan.md`.
- No live business content, candidate id, normal registration, reference, migration, adapter, or consumer enablement is approved.

## Purpose

Implement only the planned strict business schema, pure issue-returning in-memory validator, focused tests, and schema-file parse coverage. Keep live content and normal content-lint registration absent.

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
- nearby institution/faction schemas, validators, focused tests, and plans;
- `tests/unit/schema-files.test.mjs` and `tools/content-lint/index.mjs` conventions;
- current business/company surfaces only to verify they remain unchanged and unpromoted.

## Required implementation

Add:

- `packages/schemas/civilization/business.schema.json`
- `tools/content-lint/businesses.mjs`
- `tests/unit/business-validation.test.mjs`

Update `tests/unit/schema-files.test.mjs` only for schema parse coverage.

Implement the exact planned contract:

- strict `{ "records": [...] }` wrapper;
- exact required fields: `id`, `slug`, `name`, `status`, `form`, `publicPosture`, `summary`, `sourceAuthorityNotes`, `notes`;
- `business.<lower_snake_slug>` identity and exact id/slug coherence;
- unique ids/slugs;
- `planned|active|retired` lifecycle;
- form `company|partnership|cooperative|other|unknown`;
- public posture `public|semi_public|secret|unknown` as descriptive visibility only;
- trimmed non-empty name/summary/provenance entries, at least one provenance note, unique provenance/notes;
- no category, industry, type, scale, reference fields, or resolver logic;
- strict unknown-field rejection.

The validator must be pure, issue-returning, and fixture-driven. It must not read the filesystem or import normal content lint.

Focused tests must prove valid/empty fixture acceptance, wrapper/required-field/identity/duplicate/text/enum/note failures, representative forbidden-field rejection, validator purity, absent live content, absent normal registration, and no live candidate ids or promotion of current strings.

## Guardrails

Do not create `packages/content/base/civilization/businesses.json`. Do not edit `tools/content-lint/index.mjs`. Do not change quests, buildings, workplaces, settlement simulation, shared contracts, account estate/storage, UI, demos, tests outside the focused new test/schema-smoke entry, save/account, or gameplay. Do not promote Ironwheel/Gannet/generated company ids, normalize prefixes, add aliases/migrations/adapters, references, resolvers, or consumers. Do not reopen gated/paused/rejected/closed lanes. Do not run Deep Research.

## Allowed changes

- `packages/schemas/civilization/business.schema.json`
- `tools/content-lint/businesses.mjs`
- `tests/unit/business-validation.test.mjs`
- `tests/unit/schema-files.test.mjs` only for schema parse coverage
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

Verify exact allowed scope, absent live content/normal registration/candidates/references/migrations/consumer changes, unchanged current business/company strings and owners, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the next runnable route.

## Suggested commit message

`feat(economy): add business authority validation`
