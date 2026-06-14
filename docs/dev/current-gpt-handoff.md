# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.146 - Knowledge Trial Eligibility Helper`
Date: 2026-06-14
Branch/status assumption: `master` at commit `3fba009` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-completion-rules-plan.md` owns completion terminology, threshold authority, aggregation, and completion safety.
- `tools/content-lint/knowledge-completion.mjs` owns the implemented pure completion decision.
- `docs/design/knowledge-trial-boundary-plan.md` owns completion-envelope authority, separate eligibility/readiness phases, trial terminology, isolation rules, and inert safety posture.
- `tools/content-lint/knowledge-trial-eligibility.mjs` owns the implemented pure eligibility decision over explicit completion envelopes and implementation-local policy.
- `docs/design/skill-mastery-trial-framework-plan.md` owns the separate Skill Trial and Spell/Magic Study framework posture.
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns deferred collection, atomicity, and persistence decisions.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.146 - Knowledge Trial Eligibility Helper`

Immediate next version:

- `Version 0.5.147 - Knowledge Trial Readiness Boundary Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.146 Result

- Added `tools/content-lint/knowledge-trial-eligibility.mjs`.
- Added 70 focused inline in-memory tests.
- Supports only exact domain- and tier-scoped eligibility targets for canonical character owners.
- Consumes explicit current completion envelopes without calling completion or inspecting raw progress/evidence.
- Requires exact implementation-local active policy with explicit required and prerequisite completion targets.
- Returns only `eligible_candidate`, `not_eligible`, or `blocked`.
- Treats well-formed incomplete, blocked, absent, or mismatched required completion targets as `not_eligible`.
- Blocks malformed/unsafe completion envelopes; malformed, missing, duplicate, conflicting, deferred, unresolved, or inactive policy/domain authority; Arcane Lore; and ambient state shortcuts.
- Keeps reward references inert and readiness, attempt, and cooldown statuses `not_evaluated`.
- Returns exact no-mutation/no-persistence/no-runtime eligibility safety flags.
- Remains unregistered from normal content lint.
- Added no schema, content JSON, validator, existing-helper edit, fixture, state, storage, persistence, UI, runtime, generated output, event, reward, ownership mutation, or gameplay behavior.

## Active Guardrails For Knowledge Trial Readiness Boundary Plan

- Documentation only; do not add a readiness helper, test, schema, content JSON, fixture, validator, or registration.
- Treat one exact `eligible_candidate` envelope as input authority, not persisted eligibility state or attempt permission.
- Define readiness separately from eligibility.
- Require explicit future readiness policy plus authoritative attempt history, cooldown, availability, and sequence/time inputs before a readiness candidate can exist.
- Define exact owner/domain/tier parity and fail-closed unsafe/malformed authority handling.
- Keep attempt creation, checkpoint resolution, outcome resolution, cooldown mutation, and reward grant outside readiness.
- Keep readiness outcomes read-only and inert; do not implement `ready_candidate`, `not_ready`, or `blocked` behavior yet.
- Preserve the current eligibility helper and completion helper unchanged.
- Do not infer readiness from completion, eligibility, `trialUnlockWeight`, catalog size, UI/runtime state, Skill Trial data, Spell/Magic Study data, or Arcane Lore references.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.
- Keep Arcane Lore planned, blocked, and deferred.
- Do not edit schemas, content JSON, validators, helpers, tests, fixtures, storage, persistence, save/account/session/database, normal lint registration, UI, runtime, generated output, events, rewards, ownership, or gameplay behavior.

Current follow-up risks:

- No canonical Knowledge eligibility/readiness policy schema, content path, or id authority exists.
- Completion and eligibility decisions remain in-memory outputs, not persisted state.
- Current snippet completion envelopes do not carry snippet-tier authority.
- No canonical readiness, attempt, checkpoint, outcome, cooldown, or reward collection exists.
- Character owner, sequence, time, storage, persistence, replay, concurrency, and availability authorities remain unresolved.
- Checkpoint scoring, recovery, outcomes, cooldowns, rewards, and runtime integration remain undefined.
- `trialUnlockWeight` has no approved interpretation.
- Arcane Lore remains blocked.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.143` | Knowledge Completion Rules Plan | `docs/design/knowledge-completion-rules-plan.md` | Completed |
| 2 | `0.5.144` | Knowledge Completion Helper | `tools/content-lint/knowledge-completion.mjs` | Completed |
| 3 | `0.5.145` | Knowledge Trial Boundary Plan | `docs/design/knowledge-trial-boundary-plan.md` | Completed |
| 4 | `0.5.146` | Knowledge Trial Eligibility Helper | `tools/content-lint/knowledge-trial-eligibility.mjs` | Completed |
| 5 | `0.5.147` | Knowledge Trial Readiness Boundary Plan | `docs/design/knowledge-trial-boundary-plan.md` | Next |
| 6 | `0.5.x` | Knowledge Trial Readiness Helper | Future focused readiness plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.147 - Knowledge Trial Readiness Boundary Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-boundary-plan.md`
- `docs/design/knowledge-completion-rules-plan.md`
- `tools/content-lint/knowledge-completion.mjs`
- `tools/content-lint/knowledge-trial-eligibility.mjs`
- `tests/unit/knowledge-trial-eligibility.test.mjs`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/design/knowledge-storage-persistence-boundary-plan.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- `docs/future_content_backlog.md`
