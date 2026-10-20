# Combat Skeleton Capability And Owner-Contract Audit

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Another Git repository is read-only reference/data only unless a separate explicit work order/context names and authorizes it.
<!-- /repo-scope-guard -->

**Owner-directed priority, 2026-10-20:** [Combat Skeleton First: Priority And Acceptance Boundary](../design/combat-skeleton-first-priority-and-acceptance-boundary-decision.md). This supersedes the previous *next-run* ordinary encounter outcome/winnability diagnosis route. It does **not** erase earlier selected defeats or relax Game-version policy. The goal is an extensible, truthful combat command/execution framework, not a balanced or necessarily victorious opening Warrior fight. Current Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS`, and `GAME_VERSION_NOT_READY` stay unchanged.

## Preflight

Synchronize Lineage `master`; inspect exact hosted/local source identity, status, open PRs and retained protected/held branch triggers. Read `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, this owner-directed decision, the existing combat audit/scoping and combat authority boundary, the contextual action/command decision and index, the current selected choice/victory record, existing Game policy and known failure patterns. Historic `ordinary-encounter-victory-and-choice-browser-access-hold.md` is **not** the current implementation gate. Preserve both genuine selected defeats and the independently proven basic-versus-sword action visibility/acceptance without treating them as balance proof.

## Read-only current-state census

Trace actual implementation, content and tests, not only design:
- `packages/engines/game-engine/src/combat/index.ts`, `player-nearby-encounter.ts`, encounter state, campaign mutation/admission and persistence/result interfaces.
- `apps/rpg-ui/src/features/WorldPanel.tsx`, `GameSessionContext.tsx`, Character inventory/consumable action, and creator-to-player-state equipment/skill/spell initialization.
- Current equipped weapon/item profiles (including Short Bow, Composite Bow, Arming Sword and shields), combat role/AI, spell/ability and statuses; distinguish metadata, owner tests, actual caller, selected UI, active runtime and deferred owner proposals.

Build a precise **capability matrix** for basic/equipped melee, ranged, shield/defense, physical abilities, magic damage/debuff/healing/support, in-combat items/consumables, AI/party, terminal outcomes, and Save/load/restart. For each: canonical action/source and owner, current executable engine path, current legal player projection and target disposition, selected UI/bridge, resources/turn/queue/effects, durability/result history, real regression evidence, missing owner or blocker, and the smallest separately implementable seam. Correct any stale observations (e.g. old Short Bow audit) using current source. Be explicit that legacy spell hooks are not a complete owned magic cast system and inventory Consume is not an authorized combat action.

Diagnose the **skeleton boundaries**, not today's character's winning odds: distinguish action identity vs family, exact legal target and action revalidation (including self/ally vs enemy-targeted damage), queue/replace/interrupt, execution/recovery/Continue, resource and effect accounting, defensives and statuses, AI legality, encounter finish/recovery and owner/admission/ledger/serialization identity. Identify any deterministic fixture/owner test needed to prove both legitimate terminal branches and continued-play/save invariants without generating a selected natural victory. Existing selected browser proof applies only to basic/sword selection, Foe 1 defeat and Normal-Stakes recovery. Do not invent hidden target damage, full victory, or terminal readback.

## Decision and output

Publish a single focused **Combat Skeleton Capability And Owner-Contract Audit** with evidence-linked coverage, acceptance dimensions and a ranked, *smallest-first* engineering sequence. Distinguish:
1. **Working/selected-proven** capability;
2. **Engine/caller implemented but selected unproven** capability;
3. **Metadata/partial** implementation with missing legality, owner, UI or persistence;
4. **Not implemented** or explicitly deferred future systems.

Select **one** bounded next Codex implementation prompt from the strongest currently observed skeleton gap, ideally exposing an existing legal combat action family end to end before adding new systems. Require pre-edit failure reproduction, focused positive/negative tests, real caller checks and selected presentation proof where the new slice affects UI. Treat unsupported spells, healing items, ammo/charge mechanics and full ordered gambits as owner-dependent separate slices; do not bridge them with fake UI commands. Do not change combat stats, enemy counts, difficulty bands, damage math or starting gear merely to achieve a win.

**This run is a documentation-only audit/priority installation:** no combat code, content, schema, tests, Game version, deployment, profile, Site source or branch mutations. Documentation diff/link checks and hosted publication readback apply; code builds/tests are not fresh evidence unless actually run and clearly identified. Update the focused audit, current output with a clearly labeled audit record, GPT handoff, next Codex prompt, historical/planning route and branch register; intentionally commit/push and verify hosted readback.

No new selected playthrough or forced encounter is required. No speculative outcome diagnosis/repair, balance tuning, protected local/hosted account access, clearing retained proof-only profiles, G10 capacity/fault reruns, held-ref integration, Home/UI overhaul or command architecture rewrite. The separate Game-version policy decision and future natural selected victory/choice/durability acceptance remain later release/representative-playability gates, not this skeleton audit's acceptance criteria.
