# Combat Skeleton Parallel Connector Prework Index

Date: 2026-10-20. Repository: `vagabond1215/Lineage_Reforged`. **CONNECTOR_PREWORK_INDEX_ONLY; NOT IMPLEMENTATION/ACCEPTANCE AUTHORITY.** Read-only source inspection plus independently committed new documentation in the sequence below, starting after the DEV-0.7.2 equipped self Block code checkpoint `9bc145aefd7e99ceee4ec317584543f6dfe78878`. The latest pre-index connector checkpoint is `d349dc96103585064c426d2cb2fe9d1be6ee6d4c`. This file merely locates the material for later *optional* named consumers; it does not update the active Codex prompt.

## Completed connector-safe sequence

| Order | File | Transfer value and explicit limit |
| --- | --- | --- |
| 0 (prior independent pass) | [Creator-to-Combat Input Compatibility](creator-to-combat-input-compatibility-prework-2026-10-20.md) | Maps accepted creator snapshot/attributes/resources/equipment/skills/spells to combatant hooks and later integration scenarios; does not authorize creator changes |
| 1 | [Combat Feedback And Observability](combat-text-first-feedback-and-observability-prework-2026-10-20.md) | Read-only text-first action/target/timing/log/receipt projection requirements; no fabricated damage events or UI changes |
| 2 | [Combat Equipment And Ranged Ammunition](combat-equipment-and-ranged-ammunition-interface-prework-2026-10-20.md) | Current Short Bow/Composite Bow source facts; action grants vs equip/handedness vs ammo/durability owner separation; no ammo consumption implementation |
| 3 | [Combat Item And Consumable Activation](combat-item-consumable-activation-prerequisites-prework-2026-10-20.md) | Inventory/stack/quantity/use/action/effect/turn/idempotency questions; no potion, healing, combat item or universal consume power created |
| 4 | [Combat Magic, Ability, And AI Owner Gates](combat-magic-ability-and-ai-owner-gates-prework-2026-10-20.md) | Catalog and legacy hooks vs owned spells/ability triggers/AI vs gambits/party, with missing-owner gates; no active magic or NPC party runtime created |

## Active execution has precedence

At the source checkpoint inspected for these passes, the currently installed executable prompt is **DEV-0.7.2.1 Combat Terminal Owner And Durability Slice** (`docs/dev/current-codex-prompt.md`). It alone controls the next in-flight Codex scope: legitimate deterministic ally/enemy terminal results through actual owner/caller, cleanup, ledger, continued play and serialization. Its work must not be replaced by one of these planning documents or silently expanded to ranged ammo, healing items, magic or whole-party gambits.

The most recent committed combat implementation before connector prework was DEV-0.7.2 self-target Shield Block at `9bc145aefd7e99ceee4ec317584543f6dfe78878`, **owner/caller-tested but selected UI unproven**. This index does not update that evidence class. The combat skeleton priority remains governed by [Combat Skeleton First](combat-skeleton-first-priority-and-acceptance-boundary-decision.md), [Current Combat Capability Audit](combat-skeleton-capability-and-owner-contract-audit-2026-10-20.md), current Game version policy, and repository workflow/branch protection.

## How later Codex may use this packet without wasting quota

1. Resume the **same** rate-limited Codex thread/worktree where retained, as prescribed by `docs/dev/codex-resource-budget-and-execution-slicing-policy.md`. First inspect local current HEAD/status and interrupted work; do not reset valid partial changes or repeat broad inventory by default.
2. Synchronize/compare with live `master` safely. If uncommitted work exists, preserve and review it before choosing a merge/rebase/fast-forward strategy. Treat each connector document as **read-only candidate evidence**, not executable validation or new task authority.
3. The new documents are independent Markdown additions; inspect the exact Git diff and note any intervening Codex commits. The local agent must independently verify relevant source/test/production facts if it relies on a claim.
4. Complete the installed terminal/durability requirements first, with focused owner/caller test evidence and one durable checkpoint. Then record its actual acceptance/repair result and choose the next bounded executable slice from fresh current state; the combat audit historically favors ranged followed by ability/AI legality, but a new finding may change that choice.
5. Do not absorb the unimplemented ammo/medicine/magic/gambit questions into a single `DEV-0.7.2.1` scope. Their owner decisions may be consumed later by separate prompts after appropriate evidence and user priorities.
6. Do not promote Game `0.1.1-prealpha`, edit `GAME_VERSION`, tune the current starter fight to guarantee victory, claim selected natural victory, deploy, access protected accounts, integrate held creator branches, or alter the active Codex handoff based on this index alone.

## Publication and evidence scope

This connector sequence consisted of isolated new `docs/design/` Markdown files. No code, test, schema, content, migration, Game version, account, browser, Site source, deployment, branch or PR mutation. No local commands, test executions, builds, typechecks, selected browser action, Codex run or milestone acceptance are claimed. Current Codex files (`docs/dev/current-codex-prompt.md`, `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`) and the selected acceptance records remain unchanged by these passes. Later source/readback may supersede these checkpoint descriptions; recheck live HEAD.
