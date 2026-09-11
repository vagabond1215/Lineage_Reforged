# Game 0.1.x Playability Gap Prioritization Decision

Date: 2026-09-11

Label class: unversioned player-facing prioritization decision

Development milestone impact: `none`

Game-version impact: `none`

Accepted development milestone: `DEV-0.7.0 - Integrated Gameplay Systems Band Entry`

Current development band: `DEV-0.7.x`

Game version: `0.1.0-prealpha`

Playability posture: `INTEGRATED_LOOP`

Execution posture: production-read-only decision with local player-path reproduction and documentation publication

## Objective

Reproduce the actual ordinary player path and select the smallest coherent next player-facing capability by comparing playability gain, loop closure, dependency closure, architectural risk, package size, and regression burden. Publish a decision before assigning implementation work. Do not implement the selected capability in this run.

`DEV-0.7.0` is accepted. This does not create Game `0.7.0`, Game `0.2.0`, vertical-slice acceptance, alpha, beta, or a percentage-complete claim. Keep `GAME_VERSION` unchanged and do not automatically allocate `DEV-0.7.1` or Game `0.1.1-prealpha`.

## Orientation And Authority

Work only in `vagabond1215/Lineage_Reforged`. Follow `AGENTS.md`, the repository-first protocol, platform/tool selection policy, resource-slicing policy, Codex-versus-Connector handling procedure, branch policy/register, and applicable failure-pattern guardrails. Fetch/prune, verify clean synchronized `master`, inventory live branches/open PRs, and record exact source and publication heads. Preserve unrelated work and protected references.

Read the complete current prompt/output/handoff, historical register, planning reconciliation, and:

- `docs/design/integrated-gameplay-0.7-band-entry-readiness-decision.md`, including the DEV-0.7.0 acceptance appendix;
- `docs/dev/game-version-roadmap-and-acceptance-policy.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- `docs/dev/playability-posture-and-version-calibration.md`;
- `docs/design/ashen-reef-survey-ordinary-reachability-implementation-package-decision.md`, including independent 0.6.11.1 acceptance;
- `docs/design/ashen-reef-survey-advancement-authority-acceptance-audit.md`;
- `docs/design/ashen-reef-soundings-authored-canon-decision.md`;
- `docs/design/quest-turn-in-and-reward-readiness-audit.md`;
- `docs/design/inventory-stack-and-item-instance-identity-audit.md`;
- `docs/design/npc-persistence-and-generated-person-promotion-audit.md`;
- `docs/design/ui-information-architecture-boundary.md`;
- `docs/dev/evidence/branch-consolidation-2026-09-07/README.md` and the specific preserved audits needed for compared candidates.

Inspect the complete delta from milestone verification source `d8c413208237f3ee3a895f133a1963400d76e938` and the later milestone publication commits to live head. Historical audit proposals and legacy reward formulas are evidence only. Do not reopen accepted ownership without fresh contradictory evidence.

## Required Decision Work

1. Reproduce fresh Starfall character creation, retained campaign publication/load, Soundings availability and acceptance/access, travel/arrival, four real-caller survey shifts, save/restart, and durable duplicate behavior. Use a disposable local campaign; preserve existing user saves. Exercise ordinary UI navigation where available and distinguish observed UI experience from lower-level executable evidence. Never inject eligibility or use demo state as representative proof. If UI access is unavailable, record the exact limitation and do not claim a completed player-experience decision from source inspection alone.
2. Record what the player sees, chooses, gains, retains, and can do next. Identify the first missing closure owner, misleading readiness/return affordance, placeholder behavior, or absence of meaningful choice. Stop at the accepted active/unturned-in boundary; characterize legacy turn-in source without treating its payout as accepted canon.
3. Compare narrow authoritative Soundings turn-in/reward, inventory/equipment, crafting/economy, combat/challenges, NPC/services, progression/lineage, UI/accessibility, and content breadth. Give each candidate an evidence-backed assessment of player payoff, loop/dependency closure, missing owners and authored decisions, architectural/save risks, package size, and regression burden. Avoid speculative precision or scoring that hides an unresolved prerequisite.
4. Treat Soundings closure as a strong candidate, not a predetermined winner. Its exact paid-contract terms remain deferred; do not invent reward amounts, standing, items, salvage rights, recurrence, or a person/office identity. Distinguish owner design from balance/canon input.
5. Select one smallest coherent package or one exact prerequisite decision. Ask a concrete user-direction question only when product/canon/UX/balance evidence cannot safely decide the boundary. Do not silently convert unresolved product choices into implementation permission.
6. Classify the next run under the development-milestone policy after the selection. Do not assign a development primary merely because this decision completed. A potential future game-version increment requires a separate accepted playable delta and game-version gate after implementation and acceptance.

## Validation And First Durable Checkpoint

The first checkpoint is a completed reproduction record and candidate matrix in `docs/design/game-0.1.x-playability-gap-prioritization-decision.md`, with uncertainty and uncompleted work explicit if interrupted.

Run the ordinary-reachability integration test and the focused checks needed to substantiate any alleged regression. If launching/building the UI, use the existing configuration and direct Vite build as appropriate. The milestone gate passed 82/82 prescribed tests, Node configuration typecheck, and Vite server/client build. Broad UI typecheck remains a known non-green 137-diagnostic baseline; do not claim it passes or repair it inside this decision. Expand validation only for actual drift or a finding.

Apply at least FP-001, FP-002, FP-008, FP-009 and FP-017; add FP-013/014 when assessing persisted owner boundaries. Separate fresh observations from predecessor test results. Review all documentation diffs and run `git diff --check`.

## Result And Coordination

Return one `PLAYABILITY_PRIORITY_SELECTED` or `PLAYABILITY_PRIORITY_BLOCKED` decision. Record the reproduced player path, candidate comparison, exact selected boundary, product questions, exclusions, owners, required validation, and next route. A blocked decision must name the missing evidence/input and smallest resolution.

Update the focused decision, current output/handoff, historical register/planning reconciliation and live headers only where routing changes. Install one separate executable next prompt only if its prerequisites and scope are decision-complete; otherwise install the exact prerequisite. Keep platform/model/plugin/quota recommendations outside the prompt body and provide a fresh capability inventory in chat.

Commit only intended documentation, push `master`, fetch/prune, verify local/tracking/live hosted heads, retrieve hosted prompt/output/handoff, and finish clean. Report exact commits, branches/PRs inspected, retained review triggers, checks, limitations, and game/development version separation.

## Exclusions

No production, UI, content, schema, tracked-test, dependency, asset, serializer, save, migration, `GAME_VERSION`, or `worldVersion` edits. No gameplay implementation, reward balancing, broad cleanup, generic framework, evidence/protected branch mutation, branch retirement, deployment, vertical-slice/alpha/beta acceptance, or cross-repository work.
