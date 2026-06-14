# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.153 - Knowledge Trial Policy Semantic Validator Plan`
Date: 2026-06-14
Branch/status assumption: `master` at commit `5adac38` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `packages/schemas/player/knowledge_trial_policy.schema.json` owns the strict structure of one static authored Knowledge trial eligibility policy.
- `packages/content/base/player/knowledge_trial_policies.json` owns the current exact one-record authored Flora Tier 1 eligibility-policy skeleton.
- `docs/design/knowledge-trial-policy-content-plan.md` owns the first content path, wrapper shape, selected one-record Flora Tier 1 slice, registry-null posture, semantic-validation sequence, and Version 0.5.152 acceptance criteria.
- `docs/design/knowledge-trial-policy-semantic-validator-plan.md` owns the future validator location, schema-first semantic rules, diagnostic posture, unregistered implementation sequence, focused test matrix, and Version 0.5.154 acceptance criteria.
- `docs/design/knowledge-trial-schema-plan.md` owns the broader policy/content split, mutable-state exclusions, and deferred readiness posture.
- `tools/content-lint/knowledge-completion.mjs` owns current pure completion decisions.
- `tools/content-lint/knowledge-trial-eligibility.mjs` owns current operation-local eligibility evaluation.
- `tools/content-lint/knowledge-trial-readiness.mjs` owns current operation-local readiness evaluation.
- `packages/content/base/player/knowledge_domain_registry.json` owns domain status and nullable trial-policy references.
- `packages/content/base/player/knowledge_snippets.json` owns the current authored snippet inventory.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.153 - Knowledge Trial Policy Semantic Validator Plan`

Immediate next version:

- `Version 0.5.154 - Knowledge Trial Policy Semantic Validator`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.153 Result

- Added `docs/design/knowledge-trial-policy-semantic-validator-plan.md`.
- Selected future `tools/content-lint/knowledge-trial-policies.mjs`.
- Defined an explicit pure input contract over policy wrapper, live schema, domain registry, and snippets.
- Required exact wrapper and schema-first validation.
- Required duplicate-aware active non-Arcane domain and snippet resolution.
- Required exact policy-domain parity and matching domain/tier target coherence.
- Selected hard semantic failure for non-null readiness references and non-empty reward references.
- Required every registry `trialPolicyRef` to remain null.
- Selected deterministic path-bearing `Error` messages matching current lint convention.
- Selected an unregistered module plus focused tests for Version 0.5.154.
- Added no validator, test, registration, schema/content edit, helper change, adapter, state, persistence, runtime, UI, reward, event, ownership mutation, or gameplay behavior.

## Active Guardrails For Semantic Validator

- Add only `tools/content-lint/knowledge-trial-policies.mjs`, one focused validator test file, and required coordination docs.
- Keep `packages/content/base/player/knowledge_trial_policies.json`, its schema, registry, and snippets unchanged.
- Validate the exact wrapper and every record structurally before semantics.
- Fail closed on duplicate ids, unresolved or duplicate authorities, inactive/planned/Arcane domains, cross-domain targets, incoherent policy scope, duplicate targets, unresolved snippets, non-null readiness, non-empty rewards, and non-null registry `trialPolicyRef`.
- Require a matching required domain target for domain policies and matching required tier target for tier policies.
- Do not infer tier or completion from snippets or owner state.
- Do not call completion, eligibility, or readiness helpers.
- Keep the module pure, deterministic, input-preserving, and unregistered in normal content lint.
- Do not add adapters, readiness content, mutable authority, storage, persistence, UI, runtime, generated output, events, rewards, ownership mutation, or gameplay behavior.

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
| 3 | `0.5.152` | Knowledge Trial Authored Policy Content Skeleton | `packages/content/base/player/knowledge_trial_policies.json` | Completed |
| 4 | `0.5.153` | Knowledge Trial Policy Semantic Validator Plan | `docs/design/knowledge-trial-policy-semantic-validator-plan.md` | Completed |
| 5 | `0.5.154` | Knowledge Trial Policy Semantic Validator | `docs/design/knowledge-trial-policy-semantic-validator-plan.md` | Next |
| 6 | `0.5.x` | Knowledge Trial Policy Normal Lint Registration | Future focused run | Deferred |
| 7 | `0.5.x` | Knowledge Trial Registry Reference Alignment | Future focused run | Deferred |
| 8 | `0.5.x` | Knowledge Trial Readiness Policy Schema | Future focused run | Deferred |

## Next Prompt Source Stack

For `Version 0.5.154 - Knowledge Trial Policy Semantic Validator`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-trial-policy-content-plan.md`
- `docs/design/knowledge-trial-policy-semantic-validator-plan.md`
- `docs/design/knowledge-trial-schema-plan.md`
- `packages/schemas/player/knowledge_trial_policy.schema.json`
- `packages/content/base/player/knowledge_trial_policies.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_snippets.json`
- `tools/content-lint/knowledge-domain-registry.mjs`
- `tools/content-lint/knowledge-snippets.mjs`
- `tools/content-lint/index.mjs`
- `tests/unit/knowledge-domain-registry-validation.test.mjs`
- `tests/unit/knowledge-snippets-validation.test.mjs`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
