# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.121 - Knowledge Evidence Contract Plan`
Date: 2026-06-08
Branch/status assumption: `master` at commit `df6252d` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-evidence-contract-plan.md` owns future evidence identity, beneficiary ownership, source/context relationships, validation boundaries, and sequence.
- `docs/design/knowledge-snippet-content-authoring-plan.md` owns snippet authoring boundaries.
- `docs/design/knowledge-snippet-semantic-validator-plan.md` owns the snippet validation contract.
- `tools/content-lint/knowledge-snippets.mjs` owns current authored snippet validation.
- `packages/schemas/player/knowledge_snippet.schema.json` owns authored snippet structure only.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet catalog.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.121 - Knowledge Evidence Contract Plan`

Immediate next version:

- `Version 0.5.122 - Knowledge Evidence Schema Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.121 Result

- Added `docs/design/knowledge-evidence-contract-plan.md`.
- Defined evidence as scoped proof of an authorized occurrence relevant to one authored snippet, not content, progress, completion, trial state, UI state, or knowledge ownership.
- Defined a candidate future record with explicit snippet/domain/subject/source/owner/context fields and deterministic acquisition ordering.
- Selected `character` as the first owner candidate; family/account sharing remains planned and blocked, while settlement/faction ownership remains deferred.
- Separated beneficiary `ownerScope` from source/context roles such as teacher, institution, event, region, item instance, and document instance.
- Kept `sourceId` null until explicit source authorities exist.
- Deferred confidence, weight, duplicate credit, repeatability, progress math, persistence, and UI semantics.
- Changed documentation only.

## Active Guardrails For 0.5.122

Knowledge Evidence Schema Plan:

- Keep the next run planning-only.
- Select the exact evidence schema path, collection/wrapper posture, required fields, nullability, id patterns, owner vocabulary, and acquisition-context shape.
- Keep `character` as the only first implementation owner unless the plan provides a dedicated reason to defer even that.
- Do not copy `defaultEvidenceOwnerScopes` directly into an owner enum; distinguish beneficiaries from sources and contexts.
- Prefer narrow source-specific acquisition-context variants over one permissive optional-field object.
- Keep `sourceId` nullable and blocked from non-null use until source authorities are selected.
- Keep confidence and weight out of the first schema unless separately authorized by progress planning.
- Do not implement a schema file, evidence JSON, evidence state, validator, runtime loading, progress, completion, trials, UI, events, persistence, ownership mutation, or gameplay behavior.

Current follow-up risks:

- There is no selected canonical owner-id authority for character evidence yet.
- There is no selected event/action authority for evidence producers.
- Duplicate identity and duplicate progress credit are separate policies and must not be conflated.
- Family/account sharing can fabricate inherited knowledge if owner rules are permissive.
- Arcane Lore snippets remain blocked while the domain is planned.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | `docs/design/knowledge-snippet-semantic-validator-plan.md` | Completed |
| 2 | `0.5.120` | Knowledge Snippet Semantic Validator | `tools/content-lint/knowledge-snippets.mjs` | Completed |
| 3 | `0.5.121` | Knowledge Evidence Contract Plan | `docs/design/knowledge-evidence-contract-plan.md` | Completed |
| 4 | `0.5.122` | Knowledge Evidence Schema Plan | `docs/design/knowledge-evidence-contract-plan.md` | Next |
| 5 | `0.5.123` | Knowledge Evidence Schema | Future schema plan | Planned |
| 6 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 7 | `0.5.x` | Knowledge Evidence-to-Progress Rules Plan | Future focused plan | Deferred |
| 8 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.122 - Knowledge Evidence Schema Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-evidence-contract-plan.md`
- `docs/design/knowledge-snippet-content-authoring-plan.md`
- `docs/design/knowledge-snippet-semantic-validator-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `docs/design/knowledge-boundary-glossary.md`
- `docs/design/knowledge-registry-field-ownership.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `tools/content-lint/knowledge-snippets.mjs`
- `tests/unit/knowledge-snippets-validation.test.mjs`
- `docs/future_content_backlog.md`
