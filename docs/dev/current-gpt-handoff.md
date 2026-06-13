# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.143 - Knowledge Completion Rules Plan`
Date: 2026-06-13
Branch/status assumption: `master` at commit `c804825` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-completion-rules-plan.md` owns completion terminology, explicit threshold authority, applied-progress interpretation, aggregation boundaries, decision-envelope safety, and later helper acceptance criteria.
- `docs/design/knowledge-progress-application-plan.md` owns the application contract.
- `tools/content-lint/knowledge-progress-application.mjs` owns the implemented inert application decision.
- `tools/content-lint/knowledge-evidence-acceptance.mjs` owns inert one-candidate acceptance decisions.
- `tools/content-lint/knowledge-progress-initialization.mjs` owns explicit zero-state initialization proposals.
- `tools/content-lint/knowledge-evidence-to-progress.mjs` owns evidence eligibility, unit deltas, ordering, and inert progress proposals.
- `tools/content-lint/knowledge-evidence.mjs` and `tools/content-lint/knowledge-progress.mjs` retain unchanged validation ownership.
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns deferred collection, atomicity, and persistence decisions.
- `docs/design/skill-mastery-trial-framework-plan.md` owns separate Skill Trial and Magic Study planning posture.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.143 - Knowledge Completion Rules Plan`

Immediate next version:

- `Version 0.5.x - Knowledge Completion Helper`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.143 Result

- Added `docs/design/knowledge-completion-rules-plan.md`.
- Defined applied progress as explicit completion input rather than persisted state.
- Defined completed snippet, tier, domain, candidate, decision, and envelope terminology.
- Requires separate explicit authored/planned snippet, tier, and domain completion policy.
- Forbids inferring thresholds from `completionWeight`, `trialUnlockWeight`, consumed-evidence count, UI, runtime state, sample values, or current catalog size.
- Defines `completionWeight` as completed-snippet aggregation weight only.
- Defines `countsTowardTierCompletion` as exact tier inclusion/exclusion only.
- Keeps domain aggregation dependent on explicit completed-tier rules rather than flat snippet or progress sums.
- Specifies a pure deterministic read-only helper shape, exact safety flags, focused test matrix, and later implementation acceptance criteria.
- Added no helper, tests, fixtures, schema/content/validator edits, state, storage, persistence, registration, trials, UI, runtime, generated output, events, rewards, ownership mutation, or gameplay behavior.

## Active Guardrails For Knowledge Completion Helper

- Add only a pure deterministic in-memory helper and focused tests.
- Consume explicit applied progress and explicit in-memory completion-policy authority.
- Validate fail-closed through unchanged current validators.
- Return only `candidate`, `incomplete`, or `blocked` read-only decisions.
- Never infer a snippet threshold from `completionWeight` or evidence count.
- Keep tier aggregation exact to owner/domain/tier and domain aggregation exact to owner/domain.
- Return every safety flag named in `docs/design/knowledge-completion-rules-plan.md` as `true`.
- Do not edit schemas, content JSON, validators, producer, acceptance, initializer, proposal, or application helpers.
- Do not add fixtures, storage, persistence, normal content-lint registration, completion state, trial readiness, Skill Trial behavior, Spell/Magic Study behavior, UI, runtime, generated output, events, rewards, ownership mutation, or gameplay behavior.

Current follow-up risks:

- Applied output is still not persisted state.
- No accepted-evidence or progress collection exists.
- Character owner and canonical sequence authorities remain unresolved.
- Distinct-id occurrence equivalence and storage-level idempotent replay remain undefined.
- Atomic accepted-evidence append and progress application remain deferred.
- Completion threshold values and canonical policy ownership remain unauthored and unresolved.
- Completion helper implementation remains deferred.
- `first_evidence` initialization remains deferred.
- Arcane Lore remains blocked.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.141` | Knowledge Progress Application Plan | `docs/design/knowledge-progress-application-plan.md` | Completed |
| 2 | `0.5.142` | Knowledge Progress Application Helper | `tools/content-lint/knowledge-progress-application.mjs` | Completed |
| 3 | `0.5.143` | Knowledge Completion Rules Plan | `docs/design/knowledge-completion-rules-plan.md` | Completed |
| 4 | `0.5.x` | Knowledge Completion Helper | `docs/design/knowledge-completion-rules-plan.md` | Next |
| 5 | `0.5.x` | Knowledge Trial Boundary Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.x - Knowledge Completion Helper`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-completion-rules-plan.md`
- `docs/design/knowledge-progress-state-plan.md`
- `docs/design/knowledge-progress-application-plan.md`
- `tools/content-lint/knowledge-progress-application.mjs`
- `tools/content-lint/knowledge-progress.mjs`
- `packages/schemas/player/knowledge_progress.schema.json`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_snippets.json`
- `docs/design/skill-mastery-trial-framework-plan.md`
- `tests/unit/knowledge-progress-application.test.mjs`
- related Knowledge validator/helper focused tests
- `docs/future_content_backlog.md`
