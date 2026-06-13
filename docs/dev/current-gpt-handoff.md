# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.139 - Knowledge Evidence Acceptance Helper Plan`
Date: 2026-06-13
Branch/status assumption: `master` at commit `2e44b6d` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-evidence-acceptance-helper-plan.md` owns the first pure one-candidate acceptance contract.
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns broader candidate/accepted/persisted distinctions and deferred storage ownership.
- `docs/design/knowledge-storage-fixture-boundary-plan.md` owns the planned test-only fixture family; no fixtures exist.
- `docs/design/knowledge-progress-record-initialization-plan.md` and `tools/content-lint/knowledge-progress-initialization.mjs` own zero-state initialization planning and proposals.
- `tools/content-lint/knowledge-progress.mjs`, `tools/content-lint/knowledge-evidence.mjs`, `tools/content-lint/knowledge-evidence-to-progress.mjs`, and `tools/content-lint/knowledge-evidence-producers.mjs` retain their existing pure validation, proposal, and candidate boundaries.
- `packages/content/base/player/knowledge_snippets.json` and `packages/content/base/player/knowledge_domain_registry.json` remain read-only authored authorities.
- `docs/design/skill-mastery-trial-framework-plan.md` owns separate Skill Trial and Magic Study planning posture.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.139 - Knowledge Evidence Acceptance Helper Plan`

Immediate next version:

- `Version 0.5.140 - Knowledge Evidence Acceptance Helper`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.139 Result

- Added `docs/design/knowledge-evidence-acceptance-helper-plan.md` with exactly 28 contract sections.
- Selected a pure one-candidate helper that requires an explicit current accepted wrapper, including `{ "records": [] }`.
- Retained `validateKnowledgeEvidence(...)` as the structural and semantic gate for both the candidate and current wrapper.
- Required deterministic rejection for every existing `evidenceId`, including exact replays; storage-level idempotency remains deferred.
- Selected a copied accepted record and inert decision envelope with no acceptance metadata or collection mutation.
- Kept producer, initializer, progress proposal/application, fixtures, storage, persistence, completion, trials, UI, runtime, and gameplay as separate deferred concerns.
- Added no source, tests, fixtures, schemas, validators, content, state, registration, storage, persistence, runtime, UI, generated output, or gameplay behavior.

## Active Guardrails For 0.5.140

Knowledge Evidence Acceptance Helper:

- Add only `tools/content-lint/knowledge-evidence-acceptance.mjs`, its focused unit test, and required handoff updates.
- Accept exactly one candidate per invocation.
- Require the current accepted wrapper explicitly; omission, `null`, and bare arrays fail.
- Validate current accepted evidence with empty records allowed and validate the candidate as a temporary one-record wrapper.
- Reject every existing `evidenceId`; do not implement idempotent success or occurrence-equivalence inference.
- Return a deep value copy of an accepted candidate without adding metadata or replacing the current wrapper.
- Keep validation issues separate from valid duplicate-policy rejection.
- Keep all inputs immutable and output deterministic.
- Do not add fixtures, canonical state, storage, persistence, normal lint registration, progress initialization/proposal/application, completion, trials, UI, runtime, generated output, or gameplay behavior.

Current follow-up risks:

- A pure helper cannot prevent stale-snapshot or concurrent duplicate writes.
- Distinct-id occurrence equivalence remains undefined.
- Character owner and sequence authority remain explicit-input patterns.
- No accepted-evidence collection, storage owner, persistence owner, or progress application owner exists.
- `first_evidence` initialization and atomic coordination remain deferred.
- Completion, Knowledge trials, Skill Trials, Spell/Magic Study trials, UI, runtime, and gameplay remain deferred.
- Arcane Lore remains blocked.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.138` | Knowledge Progress Record Initialization Helper | `tools/content-lint/knowledge-progress-initialization.mjs` | Completed |
| 2 | `0.5.139` | Knowledge Evidence Acceptance Helper Plan | `docs/design/knowledge-evidence-acceptance-helper-plan.md` | Completed |
| 3 | `0.5.140` | Knowledge Evidence Acceptance Helper | `tools/content-lint/knowledge-evidence-acceptance.mjs` | Next |
| 4 | `0.5.x` | Knowledge Progress Application Plan | Future focused plan | Deferred |
| 5 | `0.5.x` | Knowledge Progress Application Helper | Future focused implementation | Deferred |
| 6 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 7 | `0.5.x` | Knowledge Completion Helper | Future focused implementation | Deferred |
| 8 | `0.5.x` | Knowledge Trial Boundary Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.140 - Knowledge Evidence Acceptance Helper`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-evidence-acceptance-helper-plan.md`
- `docs/design/knowledge-storage-persistence-boundary-plan.md`
- `docs/design/knowledge-storage-fixture-boundary-plan.md`
- `docs/design/knowledge-progress-record-initialization-plan.md`
- `packages/schemas/player/knowledge_evidence.schema.json`
- `tools/content-lint/knowledge-evidence.mjs`
- `tools/content-lint/knowledge-evidence-producers.mjs`
- `tools/content-lint/knowledge-progress-initialization.mjs`
- `tools/content-lint/knowledge-evidence-to-progress.mjs`
- related unit tests
- `docs/future_content_backlog.md`
