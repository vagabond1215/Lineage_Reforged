# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.150 - Knowledge Trial Static Policy Schema`
Date: 2026-06-14
Branch/status assumption: `master` at commit `51bdff4` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `packages/schemas/player/knowledge_trial_policy.schema.json` owns the strict structural contract for one static authored Knowledge trial eligibility policy.
- `docs/design/knowledge-trial-schema-plan.md` owns the policy/content split, content-path recommendation, mutable-state exclusions, semantic-validation sequence, and deferred readiness posture.
- `tools/content-lint/knowledge-completion.mjs` owns the current pure completion decision.
- `tools/content-lint/knowledge-trial-eligibility.mjs` owns the current operation-local eligibility contract.
- `tools/content-lint/knowledge-trial-readiness.mjs` owns the current operation-local readiness contract.
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns deferred state, sequence, atomicity, and persistence decisions.
- `docs/design/skill-mastery-trial-framework-plan.md` owns the separate Skill Trial and Spell/Magic Study posture.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.150 - Knowledge Trial Static Policy Schema`

Immediate next version:

- `Version 0.5.151 - Knowledge Trial Policy Content Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.150 Result

- Added `packages/schemas/player/knowledge_trial_policy.schema.json`.
- Added it to the focused schema-file inventory and structural contract coverage.
- Defined strict domain- and tier-scoped static eligibility-policy records.
- Required `ownerScope: "character"` and rejected concrete `ownerId`.
- Defined exact snippet, tier, and domain completion requirement variants with `requiredDecision: "candidate"`.
- Required a non-empty primary requirement array and allowed an empty prerequisite array.
- Allowed nullable inert `knowledge_trial_readiness_policy.*` references.
- Allowed unique canonical dotted reward references and unique non-empty notes.
- Rejected extra fields, operation envelopes, mutable authority, trial state, UI/runtime/persistence fields, Skill Trial fields, and Spell/Magic Study fields.
- Added no policy content, readiness schema, semantic validator, adapter, fixture, normal lint registration, state, persistence, runtime, or gameplay behavior.

## Active Guardrails For Policy Content Planning

- Plan only; do not add `packages/content/base/player/knowledge_trial_policies.json` during 0.5.151.
- Use the new schema as structural authority without weakening or expanding it.
- Decide the smallest first authored eligibility-policy set, exact ids, target scopes, requirements, prerequisites, nullable readiness references, inert reward references, and notes.
- Resolve whether the first content slice is domain-scoped, tier-scoped, or both from current active completion authority.
- Keep `ownerId` out of authored content.
- Keep Arcane Lore planned, blocked, and absent from active policy content.
- Keep Knowledge, Skill, and Spell/Magic Study policy families separate.
- Define later semantic checks for wrapper shape, policy uniqueness, active domains, exact snippet/domain references, duplicate requirements, cross-section duplication, target parity, and registry `trialPolicyRef` alignment.
- Do not add readiness policy schema/content, attempt/cooldown/availability/sequence-time authority, adapters, fixtures, registration, storage, persistence, UI, runtime, events, rewards, or gameplay behavior.
- Do not edit current completion, eligibility, or readiness helpers.

Current follow-up risks:

- No canonical policy content authority exists.
- No semantic validator or content-to-helper adapter exists.
- Readiness schema remains deferred.
- Attempt lifecycle/status vocabulary is not canonical.
- Mutable authority and persistence ownership remain undefined.
- Current snippet completion envelopes do not carry tier.
- `trialUnlockWeight` remains uninterpreted.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.149` | Knowledge Trial Schema Plan | `docs/design/knowledge-trial-schema-plan.md` | Completed |
| 2 | `0.5.150` | Knowledge Trial Static Policy Schema | `packages/schemas/player/knowledge_trial_policy.schema.json` | Completed |
| 3 | `0.5.151` | Knowledge Trial Policy Content Plan | `docs/design/knowledge-trial-schema-plan.md` | Next |
| 4 | `0.5.x` | Knowledge Trial Authored Policy Content | Future focused run | Deferred |
| 5 | `0.5.x` | Knowledge Trial Policy Semantic Validator Plan | Future focused run | Deferred |
| 6 | `0.5.x` | Knowledge Trial Readiness Policy Schema | Future focused run | Deferred |

## Next Prompt Source Stack

For `Version 0.5.151 - Knowledge Trial Policy Content Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-schema-plan.md`
- `docs/design/knowledge-trial-boundary-plan.md`
- `packages/schemas/player/knowledge_trial_policy.schema.json`
- `packages/schemas/player/knowledge-domain-registry.schema.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_snippets.json`
- `tools/content-lint/knowledge-completion.mjs`
- `tools/content-lint/knowledge-trial-eligibility.mjs`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
