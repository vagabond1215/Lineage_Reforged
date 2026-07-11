# Current Codex Prompt

Codex 5.6 Sol Local High.

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement the next docs-first schema plan:

`Version 0.5.329 - Institution Authority Schema Plan`

## Current accepted repo state

- Latest completed primary: `Version 0.5.328 - Institution Office Authority Boundary Decision`
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`
- Immediate next primary route: `Version 0.5.329 - Institution Authority Schema Plan`
- Institution is approved conceptually as narrow static identity for durable named civic, administrative, judicial, scholarly, charitable, educational, archival, medical, or similar bodies not better owned elsewhere.
- Office remains separate and not schema-ready because position/unit/department/force/role/facility meanings remain unresolved.
- No institution or office collection/schema exists and no candidate id is approved.
- Knowledge and Magic Study contain fail-closed institution consumer vocabulary; it is not identity canon and must not be enabled by this plan.
- Quest office anchors and derived institution profiles remain presentation/synthetic only.
- No Deep Research or explicit user question is required.

## Purpose

Create a docs-only institution authority schema plan. Define a future strict `civilization.institutions` static identity contract and staged schema/validator/test/content/registration posture without implementing any file or candidate.

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
- `docs/design/institution-office-authority-boundary-decision.md`;
- `docs/design/organization-faction-guild-authority-evidence-audit.md`;
- `docs/design/organization-faction-guild-boundary-decision.md`;
- `docs/design/faction-authority-schema-plan.md` as a nearby strict static-identity planning pattern;
- civic, economy, NPC/social, People deferral, service, Knowledge, and Magic Study boundaries relevant to institutions;
- nearby schemas, pure validators, focused tests, schema parse coverage, and `tools/content-lint/index.mjs` conventions.

Do not repeat broad evidence discovery or infer candidates.

## Expected output

Add:

- `docs/design/institution-authority-schema-plan.md`

## Required plan decisions

Decide at minimum:

- authority name and future paths, likely:
  - `civilization.institutions`;
  - `packages/content/base/civilization/institutions.json`;
  - `packages/schemas/civilization/institution.schema.json`;
  - `tools/content-lint/institutions.mjs`;
  - `tests/unit/institution-validation.test.mjs`;
- strict records-only wrapper and absent empty live wrapper posture;
- `institution.<lower_snake_slug>` id/slug coherence;
- minimum required static identity fields;
- lifecycle vocabulary aligned with nearby authorities;
- narrow descriptive category and public-posture vocabularies;
- whether any optional reference is safe; prefer no first-pass references unless a non-implicating need is proven;
- explicit rejection of office, government, jurisdiction, law, force, guild, faction, religion/order, business, family, place/facility, service/provider, profession/role, person/NPC, membership, employment, leadership, reputation, access, finance, schedule, Knowledge/Magic mutation, runtime, UI, save/account, and gameplay fields;
- pure in-memory validator behavior and focused tests;
- schema parse coverage;
- normal content-lint registration deferral until approved live content exists;
- seed evidence gate and explicit no-candidate posture;
- whether a schema/validator implementation is the next safe route.

## Required questions

Answer:

1. Is live institution content present?
2. Is an institution schema/validator/test present?
3. Is normal institution registration present?
4. What exact future paths should be used?
5. What wrapper and required fields should be planned?
6. What id/slug/lifecycle rules should apply?
7. What category/public-posture vocabulary should apply?
8. Are any first-pass references allowed?
9. Which fields and inference sources must be forbidden?
10. What must the validator enforce?
11. What must focused tests cover?
12. Should normal registration accompany schema/validator implementation?
13. Is any live seed or candidate id approved?
14. Does the plan enable Knowledge or Magic Study institution refs?
15. Is office work reopened?
16. Is Deep Research required?
17. Is a support-suffix run needed?
18. Is an explicit user question needed?
19. What exact next route is selected?

## Guardrails

Docs only. Do not create/edit content, schemas, validators, tests, normal lint, consumers, runtime, UI, save/account, or gameplay. Do not approve candidates. Do not enable institution references in Knowledge/Magic Study. Do not reopen office, government, provider, membership, reputation, faction, People/NPC, service, resource/commodity, combat health, generic POI, or Highcrown Knowledge lanes. Do not run Deep Research.

## Allowed changes

- `docs/design/institution-authority-schema-plan.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Validation

Run:

```bash
node --test tests/unit/schema-files.test.mjs
npm.cmd run tool:content-lint
git diff --check
git status --short --branch
```

Verify docs-only scope, absent institution content/schema/validator/registration/candidates, no consumer enablement, no Deep Research artifacts, no conflict markers/trailing whitespace, and aligned route pointers. Update this prompt to the next runnable route.

## Suggested commit message

`docs(civ): plan institution authority schema`
