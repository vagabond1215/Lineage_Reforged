# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.147 - Knowledge Trial Readiness Boundary Plan`
Date: 2026-06-14
Branch/status assumption: `master` at commit `c30a01c` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-completion-rules-plan.md` owns completion terminology, threshold authority, aggregation, and completion safety.
- `tools/content-lint/knowledge-completion.mjs` owns the implemented pure completion decision.
- `docs/design/knowledge-trial-boundary-plan.md` owns the broad completion-to-eligibility-to-readiness separation.
- `tools/content-lint/knowledge-trial-eligibility.mjs` owns the implemented pure eligibility decision and exact eligibility envelope.
- `docs/design/knowledge-trial-readiness-boundary-plan.md` owns readiness terminology, eligibility-envelope input authority, policy/attempt/cooldown/availability/sequence-time boundaries, decisions, safety, and implementation acceptance criteria.
- `docs/design/skill-mastery-trial-framework-plan.md` owns the separate Skill Trial and Spell/Magic Study framework posture.
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns deferred collection, atomicity, and persistence decisions.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.147 - Knowledge Trial Readiness Boundary Plan`

Immediate next version:

- `Version 0.5.148 - Knowledge Trial Readiness Helper`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.147 Result

- Added `docs/design/knowledge-trial-readiness-boundary-plan.md`.
- Defines eligibility candidate, readiness candidate, policy, attempts/history/limits, cooldown, availability, prerequisites, sequence/time, blockers, and deferred authority.
- Records the current `not_ready` posture because no readiness policy or authoritative attempt/cooldown/availability/sequence-time inputs exist.
- Requires exact validation of the current eligibility envelope and safety flags.
- Defines `ready_candidate`, `not_ready`, and `blocked`.
- Requires exact owner, readiness-policy, eligibility-policy, domain, and tier parity.
- Defines explicit implementation-local readiness policy and authority concepts.
- Keeps missing/deferred policy or safely failed gates `not_ready`; malformed, unsafe, ambiguous, cross-scope, unsupported, unresolved, or Arcane Lore authority is `blocked`.
- Defines the future read-only readiness envelope and exact no-effect safety posture.
- Forbids completion/eligibility helper calls, raw progress/evidence inspection, wall-clock/random/environment inference, and all downstream trial behavior.
- Added no helper, test, fixture, schema/content/validator edit, registration, state, storage, persistence, UI, runtime, generated output, event, reward, ownership mutation, or gameplay behavior.

## Active Guardrails For Knowledge Trial Readiness Helper

- Add only a pure deterministic in-memory readiness helper and focused inline tests.
- Consume one exact eligibility envelope; do not call eligibility or completion helpers.
- Validate exact eligibility shape, target, observed fields, issues, and every current eligibility safety flag.
- Require exact implementation-local readiness policy plus explicit attempt, cooldown, availability, sequence/time, and domain authority.
- Support only `ready_candidate`, `not_ready`, and `blocked`.
- Return `not_ready` for missing/deferred readiness policy and valid but failed readiness gates.
- Return `blocked` for malformed/unsafe eligibility, active-policy eligibility mismatch, malformed/ambiguous/cross-scope authority, unsupported input, unresolved domain, or Arcane Lore.
- Keep owner, readiness-policy, eligibility-policy, domain, and tier matching exact.
- Keep reward references inert.
- Do not create attempts, resolve checkpoints/outcomes, mutate cooldowns, grant rewards, unlock content, or emit events.
- Do not use wall-clock time, randomness, hidden counters, environment, runtime globals, UI state, generated output, Skill Trial data, Spell/Magic Study data, or Arcane Lore references.
- Preserve existing helpers unchanged and keep the new helper unregistered from normal content lint.
- Do not edit schemas, content JSON, validators, existing tests/helpers, fixtures, storage, persistence, save/account/session/database, UI, runtime, generated output, events, rewards, ownership, or gameplay behavior.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.

Current follow-up risks:

- No canonical readiness policy, attempt, cooldown, availability, or sequence/time schema/content authority exists.
- Eligibility and readiness decisions remain in-memory outputs, not persisted state.
- Current snippet completion envelopes do not carry snippet-tier authority.
- Attempt lifecycle/history/counting, cooldown units, availability ownership, and time/sequence ownership remain undefined.
- Checkpoint, outcome, reward, storage, persistence, replay, concurrency, UI, runtime, and event integration remain deferred.
- `trialUnlockWeight` has no approved interpretation.
- Arcane Lore remains blocked.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.145` | Knowledge Trial Boundary Plan | `docs/design/knowledge-trial-boundary-plan.md` | Completed |
| 2 | `0.5.146` | Knowledge Trial Eligibility Helper | `tools/content-lint/knowledge-trial-eligibility.mjs` | Completed |
| 3 | `0.5.147` | Knowledge Trial Readiness Boundary Plan | `docs/design/knowledge-trial-readiness-boundary-plan.md` | Completed |
| 4 | `0.5.148` | Knowledge Trial Readiness Helper | `docs/design/knowledge-trial-readiness-boundary-plan.md` | Next |
| 5 | `0.5.x` | Knowledge Trial Schema Plan | Future focused plan | Deferred |
| 6 | `0.5.x` | Knowledge Trial Checkpoint Helper | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.148 - Knowledge Trial Readiness Helper`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-readiness-boundary-plan.md`
- `docs/design/knowledge-trial-boundary-plan.md`
- `tools/content-lint/knowledge-trial-eligibility.mjs`
- `tests/unit/knowledge-trial-eligibility.test.mjs`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/design/knowledge-storage-persistence-boundary-plan.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- related Knowledge helper focused tests
- `docs/future_content_backlog.md`
