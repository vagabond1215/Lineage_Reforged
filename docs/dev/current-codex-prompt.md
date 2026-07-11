# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the narrow schema/validator slice:

`Version 0.5.330 - Institution Authority Schema And Validator`

## Current accepted repo state

- Latest completed primary: `Version 0.5.329 - Institution Authority Schema Plan`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.330 - Institution Authority Schema And Validator`
- The exact strict contract is defined in `docs/design/institution-authority-schema-plan.md`.
- No live institution content, candidate id, normal registration, reference, resolver, or consumer enablement is approved.
- Office remains separate and not schema-ready.
- No Deep Research or explicit user question is required.

## Purpose

Implement only the planned strict institution schema, pure in-memory validator, focused tests, and schema-file parse coverage. Keep live content and normal content-lint registration absent.

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
- current output, handoff, active prompt, sequence, roadmap, and backlog;
- `docs/design/institution-authority-schema-plan.md`;
- `docs/design/institution-office-authority-boundary-decision.md`;
- nearby faction schema, validator, focused tests, and plan;
- `tests/unit/schema-files.test.mjs` and `tools/content-lint/index.mjs` conventions;
- relevant Knowledge, Magic Study, service, backstory, quest, and runtime institution hooks only to verify they remain unchanged and fail closed.

## Required implementation

Add:

- `packages/schemas/civilization/institution.schema.json`
- `tools/content-lint/institutions.mjs`
- `tests/unit/institution-validation.test.mjs`

Update schema-file parse coverage only as needed.

Implement the exact planned contract:

- strict `{ "records": [...] }` wrapper;
- exact required fields: `id`, `slug`, `name`, `status`, `category`, `publicPosture`, `summary`, `sourceAuthorityNotes`, `notes`;
- `institution.<lower_snake_slug>` identity and exact id/slug coherence;
- unique ids/slugs;
- `planned|active|retired` lifecycle;
- category `civic|administrative|judicial|scholarly|charitable|educational|archival|medical|other`;
- public posture `public|semi_public|secret|unknown` as descriptive visibility only;
- trimmed non-empty name/summary/provenance entries, at least one provenance note, unique provenance/notes;
- no reference fields or resolver logic;
- strict unknown-field rejection.

The validator must be pure, issue-returning, and fixture-driven. It must not read the filesystem or import normal content lint.

Focused tests must prove valid/empty fixture acceptance, wrapper/required-field/identity/duplicate/text/enum/note failures, representative forbidden-field rejection, absent live content, absent normal registration, and no candidate ids.

## Guardrails

Do not create `packages/content/base/civilization/institutions.json`. Do not edit `tools/content-lint/index.mjs` or register institutions in normal lint. Do not add candidates, references, resolvers, aliases, migrations, adapters, or consumer enablement. Do not edit Knowledge, Magic Study, backstory, service, quest, runtime, UI, save/account, or gameplay surfaces. Do not reopen office or any paused/blocked/rejected/closed lane. Do not run Deep Research.

## Allowed changes

- `packages/schemas/civilization/institution.schema.json`
- `tools/content-lint/institutions.mjs`
- `tests/unit/institution-validation.test.mjs`
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
node --test tests/unit/institution-validation.test.mjs
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify exact allowed scope, absent live content/normal registration/candidates/references/resolvers/consumer changes, no temporary artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the next runnable route.

## Suggested commit message

`feat(civ): add institution authority validation`
