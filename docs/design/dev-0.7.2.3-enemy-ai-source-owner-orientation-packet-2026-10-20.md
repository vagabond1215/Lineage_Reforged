# DEV-0.7.2.3 Enemy AI Source/Owner Orientation Packet

Date: 2026-10-20. Repository boundary: `vagabond1215/Lineage_Reforged` only. Connector-only, **read-only source inspection plus this new document**. Exact inspected hosted `master`: `3d8fed8676d39f2bd707d5577190fcf03bd0d88e` (previous ranged closeout). **ORIENTATION_EVIDENCE_ONLY; NOT A TEST RUN, REPAIR DECISION OR IMPLEMENTATION AUTHORITY.** Parent `DEV-0.7.2`, installed next task `DEV-0.7.2.3 Enemy AI Candidate Legality And Target Verification`. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `GAME_VERSION_NOT_READY` unaffected.

This packet serves the broad *read-only* part of the constrained-Codex orientation policy; it does not replace local live worktree, test or current-prompt preflight. It must not silently expand the installed run into magic, active abilities, companions, ordered gambits, combat rebalancing or new target-system design.

## 1. Source and caller spine at inspected head

| Phase | Current source | Observed responsibility |
| --- | --- | --- |
| Authored opponent identity and package | `packages/content/base/world/monsters.json`, encounter templates/spawn profiles and `packages/engines/world-engine/src/spawn/*` | Static source refs and action package IDs enter current encounter; authored content is not a live combat action |
| Enemy instantiation | `packages/engines/game-engine/src/combat/index.ts::buildMonsterCombatant` (~1770–1870) | Enemy `controlMode: "ai"`, role/preset/tactics, resources/attributes, action package IDs in `hooks.roleModifierIds`, empty player equipment/spell/ability grants; setup is not execution |
| Encounter and campaign admission | `createEncounterFromSpawnCandidate` and `packages/engines/game-engine/src/player-nearby-encounter.ts::admitNearbyEncounter` | Attaches player and actual authored foes to an active encounter with party bindings; valid campaign state is owned by nearby/campaign admission |
| Candidate construction | `combat/index.ts::buildCandidateActionTypes` (~1995–2029), `resolveActionPackageActionType` (~1402) and `ACTION_PACKAGE_LIBRARY` (~360) | Combines item/spell/ability grants and role package mappings into candidate action IDs; falls back to basic melee when no candidates; unknown role package currently maps to basic melee |
| Action template/provenance | `resolveGrantedActionTemplate` (~716–826), `getActionTemplate` (~827) and `createCombatAction` (~1420–1490) | Looks up grant/library template, action type, source, costs, target disposition, hooks and timing; unknown action requests currently fall back to basic melee template (see existing test) |
| Action priority | `scoreActionType` (~2033–2100) and `chooseAiActionType` (~2206–2214) | Deterministic weighted scoring of candidates from tactics/role/resource ratios; not an ordered gambit interpreter or obvious hard eligibility filter |
| Target selection | `resolveRelativeTargetDisposition` (~1980–1998), `listLivingTargets`, `scoreTargetByRule` (~2100–2200), `chooseAiTargetIds` (~2215–2250) | Relative ally/enemy/self selection, living target list, preference scoring, bounded party/line/arc target list; no target returns an empty list |
| AI queue and time | `queueAiActions` (~2439–2470), `startReadyActions` (~2400–2437), `tickCombatFoundation` (~2630–2750) | AI eligibility checks control/defeat/incapacitation/control status/manual override/busy/ready; queues action, then costs are checked and paid at action start, followed by lifecycle/effect/resolution/recovery |
| Actual effect and outcome | `resolveActionTargets` (~1400), `resolveAction` (~2310–2397), `evaluateEncounterOutcome` and tick terminal cleanup | Applies recognized damage/heal/status hooks to resolved targets; terminal results, history and active-binding cleanup are runtime/campaign-owned |
| Ordinary gameplay step | `player-nearby-encounter.ts::executeNearbyEncounterStep` (~180–255) through `GameSessionContext` | Advances one beat after owner-validated player command or Continue, then admits resulting snapshot and nearby ledger; AI moves during the same tick, not via a separate UI-generated attack |

The shared canonical action/actor/timing contracts are `packages/shared/types/src/combat.ts` and tactical role/target preference contracts are `packages/shared/types/src/tactics.ts`. Existing package mappings include `melee_skirmisher`, `melee_brute`, `ranged_harrier`, `disruptor_bash`, `elemental_burst`, `enfeebling_burst`, `support_ward`, `healing_cast`. The latter families are current generic action templates and should not be mistaken for proof of a new magic spellcaster owner.

## 2. Evidence already available, not fresh test results

- Earlier `tests/unit/combat-spawn-foundation.test.mjs` proves a monster scout's ranged action package resolves to `damage.ranged` instead of melee fallback, and it intentionally asserts the **lower-level** unknown manual action fallback maps to basic melee. This is a historical contract observation, **not proof** that an unknown AI grant has a safe source.
- `tests/unit/nearby-exploration-reachability.test.mjs` covers authentic creator → exploration → admitted encounter, then player melee, Block, ranged and synthetic genuine terminal outcomes. Terminal fixtures use delayed enemy readiness for controlled proof; they are not themselves targeted enemy AI candidate-legality coverage.
- The last DEV-0.7.2.2 focused run recorded 79/79 owner/nearby/equipment/persistence tests, Node UI-config typecheck and 256-module Vite build, based on Codex's own published record. **No local tests, typechecks, builds or browser probes were run by Connector**.
- User-directed precedence is [Combat Skeleton First](combat-skeleton-first-priority-and-acceptance-boundary-decision.md). [Combat AI/Gambit Current-State Audit](combat-ai-and-gambit-current-state-audit.md) confirms real weighted AI, and [Magic/Ability/AI Owner Gates Prework](combat-magic-ability-and-ai-owner-gates-prework-2026-10-20.md) keeps legacy spells/ability metadata separate from fully authorized execution.

## 3. Focused hypotheses to reproduce locally, not conclusions

**H1: Unaffordable high-ranked candidate.** `chooseAiActionType` sorts `scoreActionType` results without an explicit `canPayCosts` gate; `queueAiActions` may create that action; `startReadyActions` cancels it if costs exceed resources. Under a stable unaffordable high-ranked package, check whether AI repeats a cancelled selection instead of choosing a payable candidate. The policy choice between wait, affordable fallback and skip needs actual supported-source evidence; do not silently alter role scoring or resource math.

**H2: Unknown, unsupported or missing source.** `resolveActionPackageActionType` defaults unknown packages to basic melee, and `getActionTemplate` defaults unknown action types to the basic melee template. The existing manual fallback test intentionally expects that behavior. For AI, establish whether an unsupported grant is misattributed, substituted, or safely excluded. Do not globally remove compatibility fallback as an unproven quick fix.

**H3: No living legal target.** `chooseAiTargetIds` returns empty for absent living targets, and `queueAiActions` skips the action in that case. Verify enemy vs ally target-team reversal, self action, defeated/incapacitated targets and outcome transition. Do not generate a target or allow friendly fire to manufacture progress.

**H4: Target invalidated between queue and resolution.** Selection uses `listLivingTargets`; `resolveActionTargets` filters missing/defeated actors at resolution. Establish supported behavior and whether any queued action still consumes a resource; decide only if tests expose a contract defect.

**H5: One ready action per interval.** Queue checks current action and queued IDs; tick starts ready actions, resolves completed, finalizes recovery and marks next ready time. Verify no overlapping action, double payment or repeated grant while busy/control-paused/interrupted.

**H6: Actor/source identity and effect semantics.** Built-in monster action packages do not equal inventory ownership or player known spells/abilities. Check `action.source`, costs, exact action type and effects through actual enemy tick; do not promote missing magic/item/ability ownership under AI as a workaround.

## 4. Proposed limited proof path for Codex

Begin with one actual authored Kobold/roadside encounter enemy action with readable source/target/cost and execution, not generic direct-helper success alone. Then vary one controlled invariant at a time (cost, grant, target life, ready state, control, busy) in a synthetic **fixture** while preserving actual `tickCombatFoundation` and nearby step caller. Assert accepted history/ledger/readback separately only where the owner publishes those facts.

Do not tune enemy HP, damage, difficulty, starting creator build or authored foe composition in production. Test-only state adjustments to hit a deterministic legality branch are acceptable if labeled. Any defect must have an exact red pre-edit reproduction and a narrow fix, followed by neighbor regression. The installed Codex prompt remains sole executable scope and owns final disposition.

## 5. Repository/ref and validation orientation

- Hosted inspected `master`: `3d8fed8676d39f2bd707d5577190fcf03bd0d88e`. Most recent code checkpoint at inspection: `e3f9d27d7e66636e8b44b5ec7cd478ce8ec97ed6` (ranged owner/caller test only); followed by docs-only ranged closeout.
- Repository-scoped PR search at this checkpoint returned **zero open PRs**. Five non-default branches exist. Against this source, comparison reports unique ahead/behind: readiness **2/642**, prompt integrity **1/589**, administration **1/420**, creator planning **8/138**, creator implementation **32/131**, respectively. These comparisons provide changed-path/divergence orientation only; the recorded protected/held dispositions still govern. No branch was changed/integrated or deleted.
- Exact legacy source/run status and protected-account disposition remain in `docs/dev/current-codex-output.md`, `current-gpt-handoff.md`, `current-codex-prompt.md`, branch register and historical/planning anchors. Do not edit them from this packet.
- The root `package.json` defines `npm test` as `node --test` and `typecheck:ui:node` as `npm --prefix ./apps/rpg-ui run typecheck:node`. Existing owner/caller tests include `tests/unit/combat-spawn-foundation.test.mjs`, `tests/unit/nearby-exploration-reachability.test.mjs` and `tests/unit/combat-equipment-mapping.test.mjs`. Use bounded focused `node --test` inputs and `npm run typecheck:ui:node`. App-local Vite build was recorded using `npx vite build` from `apps/rpg-ui`; broad `npm run typecheck:ui` has a recorded 137-diagnostic baseline (not a green gate).

## 6. Transfer and limitations

Connector inspection cannot prove locally synchronized HEAD, the local worktree, actual AI behavior, guard effectiveness, safe fallback policy, available browser profiles, currently installed Codex reasoning tier, or runtime regression. Inspect deltas and reproduce locally before assigning a defect classification. Do not infer a Game-version advancement, selected-playthrough victory, valid magic/consumable system or completed gambit system from an AI-focused fix.

**Scope of this connector pass:** One added Markdown source-orientation file; no code, content, test, schema, UI, Game version, prompt/output/handoff, protected account, branch, Site source or deployment mutations.
