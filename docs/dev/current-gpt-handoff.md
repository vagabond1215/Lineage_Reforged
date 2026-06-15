# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.157 - Knowledge Trial Registry Reference Alignment Plan`
Date: 2026-06-15
Branch/status assumption: `master` at commit `3122bce` before edits; the worktree was clean and aligned with `origin/master`.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-trial-registry-reference-alignment-plan.md` owns the exact `0.5.158` alignment model, validator ownership, tests, failure modes, and acceptance criteria.
- `packages/content/base/player/knowledge_domain_registry.json` owns registry references.
- `packages/content/base/player/knowledge_trial_policies.json` owns the unchanged Flora Tier 1 policy.
- `tools/content-lint/knowledge-domain-registry.mjs` owns registry-local validation.
- `tools/content-lint/knowledge-trial-policies.mjs` owns policy validation and future cross-file reference coherence.
- `tools/content-lint/index.mjs` already registers registry, snippet, and policy validation and should remain unchanged in `0.5.158`.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.157 - Knowledge Trial Registry Reference Alignment Plan`

Immediate next version:

- `Version 0.5.158 - Knowledge Trial Registry Reference Alignment`

Do not roll to `0.6.0`; the project remains in `0.5.x` foundation stabilization and ownership hardening.

## Version 0.5.157 Result

- Added `docs/design/knowledge-trial-registry-reference-alignment-plan.md`.
- Selected `knowledge_domain.flora -> knowledge_trial_policy.flora_tier_1` as the exact first alignment.
- Defined `trialPolicyRef` as one registry-selected static eligibility policy per domain.
- Kept policy scope/tier authoritative in the policy record and prohibited tier inference from id text.
- Confirmed that current schemas and index wiring need no change.
- Assigned registry-local active-domain checks to the registry validator.
- Assigned exact policy resolution, domain parity, uniqueness, and active-policy representation to the policy validator.
- Kept normal content lint at 56 checked files.
- Changed no executable, schema, content, test, fixture, helper, adapter, runtime, storage, UI, reward, event, or gameplay file.

## Active Guardrails For 0.5.158

- Set only the Flora registry `trialPolicyRef` to `knowledge_trial_policy.flora_tier_1`.
- Keep Fauna, Minerals, Arcane Lore, and General Lore references null.
- Keep Arcane Lore planned, blocked, and deferred; this alignment work does not make Arcane trial policy or runtime behavior implementation-ready.
- Keep policy and snippet content unchanged.
- Keep both schemas and `tools/content-lint/index.mjs` unchanged.
- In the registry validator, permit canonical trial references only on active non-Arcane domains; keep completion and visibility policy references null-only.
- In the policy validator, resolve exact policy ids and enforce active status, registry/policy domain parity, unique references, and exact representation of active policies.
- Preserve existing policy-internal scope/tier and completion-target validation.
- Keep normal lint output at `content-lint: ok (56 files checked)`.
- Add no helper calls, adapters, readiness, attempts, checkpoints, outcomes, cooldowns, rewards, unlocks, state, storage, persistence, UI, runtime, generated output, events, ownership mutation, or gameplay behavior.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.
- Keep family/religion/ecology/recipe expansion documents as future roadmap material outside this run.

Current follow-up risks:

- The registry has one policy pointer per domain and cannot represent multiple tier policies.
- A second active policy for one domain requires a separate registry-shape plan.
- Registry alignment does not make a trial runnable.
- No content-to-helper adapter exists.
- Readiness schema/content and mutable trial authority remain deferred.
- Flora Tier 1 has one authored counting snippet.
- Rewards remain inert and empty.
- `trialUnlockWeight` remains uninterpreted.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.156` | Knowledge Trial Policy Normal Lint Registration | `tools/content-lint/index.mjs` | Completed |
| 2 | `0.5.157` | Knowledge Trial Registry Reference Alignment Plan | `docs/design/knowledge-trial-registry-reference-alignment-plan.md` | Completed |
| 3 | `0.5.158` | Knowledge Trial Registry Reference Alignment | `docs/design/knowledge-trial-registry-reference-alignment-plan.md` | Next |
| 4 | `0.5.x` | Knowledge Trial Readiness Policy Schema | Future focused plan/run | Deferred |
