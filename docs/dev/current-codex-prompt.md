# Version 0.6.10.4 - Ashen Reef Survey Progression Coherence And Projection Placement Repair

Date: 2026-08-13

Label class: support suffix

Parent version: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Milestone impact: `supports_current_band`

Starting source before `0.6.10.3` coordination: `bc9783803c08ab403cad0302727d5b701291da40`

`0.6.10.3` audit authority commit: `ad4a080acc3d05a4a790c4b219780db11a1be1a1`

Inspected implementation: `008db9c93eb8818aea51652be07fd196df41c45f`

Inspected first repair: `59af92629a79e95fa20247959159e336a8dbc88e`

## Objective

Repair only the two residual authority defects independently reproduced by `Version 0.6.10.3`:

- `AR-007`: persisted survey progression/Echo authority is internally validated but is not recomputed from its retained owner inputs before durable duplicate resolution;
- `AR-008`: byte-correct notification and Chronicle rows can occupy the wrong total-authority position, survive restart, and remain undiscoverable by projection repair.

Preserve every passing `0.6.10`/`0.6.10.2` contract. This support run cannot accept parent `0.6.10`, cannot issue a representative-loop classification, and cannot make a `0.7.0` band-entry decision.

## Orientation And Coordination

Read `AGENTS.md` completely, then follow the repository-first protocol, prompt-execution platform/tool policy, branch policy/register, and applicable failure-pattern guardrails. Read the complete current prompt, handoff, output, historical register, planning reconciliation, focused survey receipt decision, permanent acceptance audit including the `0.6.10.3` appendix, accepted occurrence/correction authority, and relevant `0.6.9` persistence/recovery authorities.

Fetch/prune, fast-forward a clean `master` if necessary, and verify local, remote, prompt, and hosted identities before editing. Preserve unrelated worktree changes; stop if synchronization, required tooling, or the exact authority chain is unavailable.

Use multi-agent work only for bounded, separable read-only inspection. The primary agent must make every implementation and authority decision and must reverify material subagent claims against the synchronized checkout. Do not pause for a routine GPT/Connector pass.

Inspect the four exact read-only Connector evidence refs and the protected readiness ref only as reusable evidence:

- activity advancement: `b4cbaea5f4292904bba62f60a0108bb84f2bd405`;
- progression/reward mutation: `387f2491d0d671ee7834656c28183e72a798f1ca`;
- Chronicle/notification provenance: `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`;
- Knowledge/discovery visibility: `46434f31f8b06d49aad9a516543fbe36d188d519`;
- protected integrated-gameplay readiness: `59c103c3a06d55f35bffa735fd4b7814dffb583e`.

Do not merge, rebase, mutate, or delete those refs. Reinspect both open pull requests and every registered lifecycle trigger; perform no lifecycle action unless fresh evidence and the controlling policy make it due.

## Required Repair 1: Owner-Derived Progression Coherence

At the semantic authority gate used before durable duplicate lookup, recompute the exact retained progression/Echo result from the retained authoritative attributes, skills, and progression inputs by using `resolvePlayerEchoProgression(...)` or the exact repository-authoritative equivalent. Require exact semantic equality between the retained progression facts and the owner-derived result.

The repair must:

1. retain the existing deep structural, arithmetic, origin, reputation, clock-month-13, and recursively canonical serialization checks;
2. reject an internally self-consistent zero/stale/alternate Echo state when it contradicts retained attributes or skills;
3. reject forged contribution, diversity, adjusted-Echo, level, or legacy-growth combinations even when the caller recomputes every exposed canonical string;
4. run before durable duplicate resolution, mutation, repair, migration, and publication authority can trust the graph;
5. preserve legitimate owner-derived progressions, canonical key-order-equivalent retries, current-state duplicates, and restart behavior;
6. avoid a second independent formula: import or call the authoritative owner resolver unless a proven dependency boundary requires one exact shared extraction.

Add same-process and save/reload regressions proving that legitimate original retries remain duplicates and forged retries fail closed without mutation or rollback.

## Required Repair 2: Projection Placement Authority

Use one total `(appliedTick, stable resultId)` authority order for survey-known notification and Chronicle projections. Destination inspection must validate both exact row bytes and exact placement among survey-known rows; content equality alone cannot return `projection_already_correct`.

Implement one decision-complete repair posture for byte-correct placement drift. Prefer explicit typed states such as observed `misordered` and accepted repair outcome `reordered`, but use repository-consistent exact names. Deep validators, persisted repair authority, correction gates, restart behavior, and public contracts must agree.

The repair must:

1. discover reversed or otherwise permuted byte-correct survey-known rows after initial application or a prior repair;
2. deterministically place survey-known rows into their authority order while preserving every opaque row's exact bytes and index;
3. never evict a retained row merely to repair placement;
4. retain terminal `retention_expired` behavior for a full capped destination whose missing target cannot be restored without displacing opaque truth;
5. converge when repair is invoked through either affected result and in either invocation order;
6. make subsequent repair an idempotent duplicate/already-correct result;
7. preserve pending-only event repair, correction-pending blocks, repair ordinals, caps, malformed-row fail-closed behavior, and legitimate retention eviction.

Cover notification and Chronicle destinations at different ticks and the same tick, with reversed known rows, opaque rows, capped destinations, applied/inserted/replaced/reordered histories, both repair invocation orders, version-7 publish/readback/restart, correction pending/completion, and duplicate event/repair calls.

## Allowed Source And Test Surface

Prefer the smallest coherent patch. The expected production surface is:

- `packages/engines/game-engine/src/campaign-rules.ts` and its tracked JavaScript mirror;
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts` and its tracked JavaScript mirror;
- `packages/shared/types/src/contracts.ts` and its tracked JavaScript mirror only if the explicit repair posture changes persisted contracts;
- game-engine/shared index mirrors only if an actual export is required;
- `tests/unit/player-survey-activity-advancement-command.test.mjs`;
- `tests/unit/player-survey-activity-advancement-persistence.test.mjs`.

Do not touch UI/context/gameplay-loop, save format version, migrations, Normal defeat/recovery, content, canon, assets, dependencies, unrelated formatting, generic projection infrastructure, or other owner systems unless compilation or a reproduced authority path proves the smallest repair cannot be complete without that file. If scope must expand materially, stop with `REPAIR_INCOMPLETE` and record the exact blocker instead of guessing.

Preserve TS/JS mirror parity. Do not introduce a production dependency, version bump, migration, broad refactor, or balance change.

## Required Validation

At minimum run and report:

1. focused survey characterization, command, and persistence tests;
2. adversarial progression tests for well-shaped forged derived states, canonical-string recomputation, legitimate variants, durable duplicate behavior, and restart;
3. adversarial projection tests for content-correct row permutation, equal/different ticks, opaque rows, caps, both repair orders, correction, event, and restart;
4. `gameplay-loop-skill-gating`, campaign persistence, save/load round trip, and the same adjacent travel, quest acceptance/tracking, activity selection, body/resources, stat/progression/reputation, publication, and caller matrix used by `0.6.10.3`;
5. the Knowledge boundary matrix and clock/schema matrix;
6. RPG UI production build;
7. bounded TypeScript audit classified against the exact registered baseline;
8. `git diff --check`, production/test diff inspection, source/mirror guards, and final worktree hygiene.

Apply at minimum `FP-001`, `FP-002`, `FP-003`, `FP-005`, `FP-006`, `FP-008`, `FP-009`, `FP-011`, `FP-012`, `FP-013`, `FP-014`, `FP-015`, and `FP-016`. Green counts do not replace adversarial owner recomputation, duplicate-order, destination-placement, restart, retention, or repair-completion proof.

## Outcome And Stop Conditions

Return exactly one implementation disposition:

- `IMPLEMENTED_PENDING_REAUDIT`: both residual defects are repaired, every retained contract passes, coordination is complete, and a separate production-read-only `Version 0.6.10.5 - Ashen Reef Survey Progression And Projection Post-Repair Acceptance Audit` is installed;
- `REPAIR_INCOMPLETE`: either defect remains, required scope expands materially, validation is unavailable or fails materially, or repository/hosted state cannot be verified.

Do not return `PARENT_ACCEPTED`, `REPRESENTATIVE_LOOP_ACCEPTED`, `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`, or any `0.7.0` acceptance classification from this implementation run.

## Completion And Publication

Update current prompt/output/handoff, this focused acceptance audit, repository-first Current Application, historical register, planning reconciliation, roadmap, sequenced plan, continuity brief, backlog, static program, failure-pattern register if new reusable evidence warrants it, and branch register. Preserve dated history and exact supersession language.

On `IMPLEMENTED_PENDING_REAUDIT`, install the complete `0.6.10.5` production-read-only audit prompt. On `REPAIR_INCOMPLETE`, install only the smallest decision-complete retry or prerequisite route justified by evidence.

Commit only intended files, push `master`, fetch again, verify `HEAD == origin/master`, retrieve the hosted prompt/output/handoff, inspect hosted status/check/workflow evidence, and finish with a clean worktree. Report exact implementation and coordination commit identities, branch/PR dispositions, checks, failure-pattern evidence, risks, and next route.
