# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.158 - 0.5.x Roadmap Integration Pass`
Date: 2026-06-15
Branch/status assumption: `master` at commit `3940f34` before edits; the worktree was clean and aligned with `origin/master`.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order, candidate lanes, maturity direction, and unresolved roadmap questions.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-trial-registry-reference-alignment-plan.md` owns the exact alignment model, validator ownership, tests, failure modes, and acceptance criteria now assigned to `0.5.159`.
- `packages/content/base/player/knowledge_domain_registry.json` owns registry references.
- `packages/content/base/player/knowledge_trial_policies.json` owns the unchanged Flora Tier 1 policy.
- `tools/content-lint/knowledge-domain-registry.mjs` owns registry-local validation.
- `tools/content-lint/knowledge-trial-policies.mjs` owns policy validation and future cross-file reference coherence.
- `tools/content-lint/index.mjs` already registers registry, snippet, and policy validation and should remain unchanged in `0.5.159`.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.158 - 0.5.x Roadmap Integration Pass`

Immediate next version:

- `Version 0.5.159 - Knowledge Trial Registry Reference Alignment`

The project remains in `0.5.x` foundation stabilization and ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.158 Result

- Inserted the documentation-only roadmap integration pass before the previously planned alignment implementation.
- Shifted Knowledge Trial Registry Reference Alignment from `0.5.158` to `0.5.159`.
- Added expanded candidate lanes for Knowledge readiness, Ecology, religion, family/heirs, marriage/adoption, estate/mortality, recipes/crafting, civil institutions, macro/micro ecology, Renown labels, Skill/Magic trials, and the runtime-ownership bridge.
- Recorded recommended `0.5.159` through `0.5.169` direction and high-priority unresolved maturation, ecology, religion, recipe, crafting, and population-model questions.
- Changed no source, schema, content, test, fixture, runtime, UI, storage, persistence, event, reward, or gameplay behavior.

## Active Guardrails For 0.5.159

- Set only the Flora registry `trialPolicyRef` to `knowledge_trial_policy.flora_tier_1`.
- Keep Fauna, Minerals, Arcane Lore, and General Lore references null.
- Keep Arcane Lore planned, blocked, and deferred.
- Keep policy and snippet content unchanged.
- Keep both schemas and `tools/content-lint/index.mjs` unchanged.
- In the registry validator, permit canonical trial references only on active non-Arcane domains; keep completion and visibility policy references null-only.
- In the policy validator, resolve exact policy ids and enforce active status, registry/policy domain parity, unique references, and exact representation of active policies.
- Preserve existing policy-internal scope/tier and completion-target validation.
- Keep normal lint output at `content-lint: ok (56 files checked)`.
- Registry alignment remains content-lint authority only and does not make a Knowledge trial runnable.
- Add no helper calls, adapters, readiness, attempts, checkpoints, outcomes, cooldowns, rewards, unlocks, state, storage, persistence, UI, runtime, generated output, events, ownership mutation, or gameplay behavior.
- Keep Knowledge, Skill, and Spell/Magic Study trial families separate.
- Do not absorb family, heir, religion, ecology, recipe, crafting, civil-society, maturation, or estate implementation into this run.

Current follow-up risks:

- The registry has one policy pointer per domain and cannot represent multiple tier policies.
- A second active policy for one domain requires a separate registry-shape plan.
- No content-to-helper adapter exists.
- Readiness schema/content and mutable trial authority remain deferred.
- Flora Tier 1 has one authored counting snippet.
- Rewards remain inert and empty.
- `trialUnlockWeight` remains uninterpreted.

## Near-Term Sequence

This ordering is recommended direction, not implementation lock-in:

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.159` | Knowledge Trial Registry Reference Alignment | Next |
| 2 | `0.5.160` | Knowledge Trial Readiness Policy Schema Plan | Recommended |
| 3 | `0.5.161` | Ecology Knowledge Domain Plan | Recommended |
| 4 | `0.5.162` | Ecology Knowledge Domain Seed Content Plan | Recommended |
| 5 | `0.5.163` | Religion Knowledge Domain Plan | Recommended |
| 6 | `0.5.164` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 7 | `0.5.165` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 8 | `0.5.166` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 9 | `0.5.167` | Offspring Growth Role And Activity Build Plan | Recommended |
| 10 | `0.5.168` | Recipe Ownership And Personal Learning Plan | Recommended |
| 11 | `0.5.169` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
