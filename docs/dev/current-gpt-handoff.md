# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.151 - Knowledge Trial Policy Content Plan`
Date: 2026-06-14
Branch/status assumption: `master` at commit `d6e4445` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `packages/schemas/player/knowledge_trial_policy.schema.json` owns the strict structure of one static authored Knowledge trial eligibility policy.
- `docs/design/knowledge-trial-policy-content-plan.md` owns the first content path, wrapper shape, selected one-record Flora Tier 1 slice, registry-null posture, semantic-validation sequence, and Version 0.5.152 acceptance criteria.
- `docs/design/knowledge-trial-schema-plan.md` owns the broader policy/content split, mutable-state exclusions, and deferred readiness posture.
- `tools/content-lint/knowledge-completion.mjs` owns current pure completion decisions.
- `tools/content-lint/knowledge-trial-eligibility.mjs` owns current operation-local eligibility evaluation.
- `tools/content-lint/knowledge-trial-readiness.mjs` owns current operation-local readiness evaluation.
- `packages/content/base/player/knowledge_domain_registry.json` owns domain status and nullable trial-policy references.
- `packages/content/base/player/knowledge_snippets.json` owns the current authored snippet inventory.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.151 - Knowledge Trial Policy Content Plan`

Immediate next version:

- `Version 0.5.152 - Knowledge Trial Authored Policy Content Skeleton`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.151 Result

- Added `docs/design/knowledge-trial-policy-content-plan.md`.
- Selected `packages/content/base/player/knowledge_trial_policies.json`.
- Selected a wrapper object containing one `records` array.
- Selected exactly one first record: `knowledge_trial_policy.flora_tier_1`.
- Selected active character-scoped, tier-scoped Flora Tier 1 policy authority.
- Required one exact Flora Tier 1 completion candidate.
- Kept prerequisite completion targets empty.
- Kept `readinessPolicyId` null and `rewardRefs` empty.
- Kept all registry `trialPolicyRef` values null until semantic validation and separately authorized alignment exist.
- Rejected domain scope as too broad for current coverage.
- Rejected a snippet-only requirement as a substitute for explicit tier completion.
- Kept Fauna, Minerals, General Lore, and Arcane Lore policy content deferred.
- Added no content JSON, schema edit, validator, adapter, test, fixture, registration, state, persistence, runtime, UI, or gameplay behavior.

## Active Guardrails For Content Skeleton

- Add only `packages/content/base/player/knowledge_trial_policies.json`, focused content/schema parse tests, and required coordination docs.
- Use exactly `{ "records": [...] }` with no wrapper extras.
- Add exactly the selected `knowledge_trial_policy.flora_tier_1` record from the content plan.
- Keep `ownerScope: "character"` and omit `ownerId`.
- Use top-level tier scope for `knowledge_domain.flora`, tier `1`.
- Require exactly one tier completion target for Flora Tier 1 with `requiredDecision: "candidate"`.
- Keep prerequisites empty, `readinessPolicyId` null, and `rewardRefs` empty.
- Preserve the two inert notes selected in the plan.
- Keep all registry `trialPolicyRef` values null.
- Do not add Fauna, Minerals, General Lore, or Arcane Lore policies.
- Do not edit schemas, helpers, existing helper tests, validators, fixtures, or normal content-lint registration.
- Do not add semantic validation, content-to-helper adaptation, readiness content, mutable authority, storage, persistence, UI, runtime, generated output, events, rewards, ownership mutation, or gameplay behavior.

Current follow-up risks:

- No semantic validator or content-to-helper adapter exists.
- Canonical completion-policy content does not exist.
- Readiness schema/content remains deferred.
- Current Flora Tier 1 has one authored counting snippet.
- Registry alignment requires a later separately authorized run.
- `trialUnlockWeight` remains uninterpreted.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.150` | Knowledge Trial Static Policy Schema | `packages/schemas/player/knowledge_trial_policy.schema.json` | Completed |
| 2 | `0.5.151` | Knowledge Trial Policy Content Plan | `docs/design/knowledge-trial-policy-content-plan.md` | Completed |
| 3 | `0.5.152` | Knowledge Trial Authored Policy Content Skeleton | `docs/design/knowledge-trial-policy-content-plan.md` | Next |
| 4 | `0.5.x` | Knowledge Trial Policy Semantic Validator Plan | Future focused run | Deferred |
| 5 | `0.5.x` | Knowledge Trial Policy Semantic Validator | Future focused run | Deferred |
| 6 | `0.5.x` | Knowledge Trial Registry Reference Alignment | Future focused run | Deferred |
| 7 | `0.5.x` | Knowledge Trial Readiness Policy Schema | Future focused run | Deferred |

## Next Prompt Source Stack

For `Version 0.5.152 - Knowledge Trial Authored Policy Content Skeleton`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-policy-content-plan.md`
- `docs/design/knowledge-trial-schema-plan.md`
- `packages/schemas/player/knowledge_trial_policy.schema.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_snippets.json`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
