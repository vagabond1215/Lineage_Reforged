# Combat Text-First Feedback And Observability Prework

Date: 2026-10-20. Repository: `vagabond1215/Lineage_Reforged`. Connector-only, documentation-only, independent planning at inspected hosted source `e4974799cd612b9bf258f110fa7d5998064b2230`. **PRESENTATION_PREWORK_ONLY; NO ENGINE, UI, EVENT OR SAVE AUTHORITY CREATED.** Development impact `none`; Game-version impact `none`. This document deliberately does not change the active `DEV-0.7.2.1 Combat Terminal Owner And Durability Slice`, its prompt/output/handoff, or historical selected-playtest claims.

## Why this pass

The existing selected World encounter presents a combat beat, player HP/MP/Stamina, a list of “Foe N” with defeated flags, legal action buttons and Continue. It reports an accepted caller step in a general notice, but it does not display damage numbers, target HP, actual resolution/hit outcome, action lifecycle, detailed event chronology or precise command provenance. The selected basic-melee/sword playtest therefore proved **distinct available and accepted actions plus displayed cost**, not a specific per-hit damage comparison or full victory. Treat that epistemic gap as a future *read-only presentation and evidence* requirement, not as permission to tune damage or add UI-authored combat effects.

The approved [UI Information Architecture Boundary](ui-information-architecture-boundary.md) §10 already selects a **text-first** combat surface: combatant rows, resources/statuses, executing/channeling/recovering action states, readable queues, manual overrides, targets and chronological event/log output. Its §16 accessibility direction calls for keyboard-supported controls, restrained live announcements and exact timing text. This prework refines what should be displayed and which existing authority supplies it, without superseding that design.

## Current source/owner map

| Fact | Current observed source | Interpretation and missing projection |
| --- | --- | --- |
| Active encounter | `gameState.activeEncounter`; `packages/shared/types/src/combat.ts` (`CombatEncounterState`, `CombatantState`, `CombatActionState`) | Encounter contains combatants, action lifecycle, resources, status instances, targeting and timing. These are engine-owned state, **not all currently shown** in `WorldPanel`. |
| Legal player action | `combat/index.ts::listLegalPlayerCombatCommands` returns exact action/target/source/cost after current legality checks | Current UI can show basic melee, item-granted melee, enemy damage actions and (since DEV-0.7.2) equipped `combat.defense.block` against Self. The Block UI is owner/caller-tested, not independently selected-browser-accepted. |
| Caller receipt | `player-nearby-encounter.ts::executeNearbyEncounterStep` returns accepted/rejected outcome plus message; `GameSessionContext` publishes admitted snapshot on acceptance | “Combat Advanced” means one accepted step, **not necessarily hit, resolved damage, victory, or successfully used a potion**. An action may be queued and resolve after later Continue beats. |
| Terminal summary | Game-engine combat tick appends combat history and an encounter-ended event on resolution; nearby owner preserves command ledger/result and session currentActivity | End-event and history entry are not proof of a complete ordered **per-action** log or already-rendered player history. Do not manufacture detailed events from terminal summary. |
| Chronology | `currentTimeTick`, action timing/readiness, target/action lifecycle and accepted source snapshot/tick | Future text projection can show “queued”, “executing”, “recovering”, “ready” and known ticks from actual owner state. It must not add a second UI clock or claim future random resolution as certain. |
| Controls | `apps/rpg-ui/src/features/WorldPanel.tsx` legal-command buttons and Continue | Current labels use generic command ID fragments and Foe ordinals except explicit Basic melee and Shield Block. There is no broad target-choice panel, per-action log or independent tactic/gambit editor in this selected surface. |

## Proposed player-reading hierarchy (design-only)

1. **Situation header.** Encounter name/place only when authored, encounter/beat status, player current HP/MP/Stamina and honest pause/busy indication. Do not imply level- or build-balanced difficulty.
2. **Combatant roster.** Stable actor reference, familiar name/ordinal, ally/enemy/self classification, visible defeat/incapacitation, permitted currently observed HP/status where actually available. Do not reveal hidden information or hallucinate enemy HP visibility policy.
3. **Current intention/timing.** Owner-derived queued/executing/channeling/recovering state, actor, intended legal target and timing text when known. Distinguish “command accepted/queued” from “action started”, “effect applied”, and “turn finished”.
4. **Commands and targets.** Owner-projected exact concrete action identity; readable label, distinct grant/source when relevant, current legal target disposition, known resource cost and reason for blocked actions **only if** an owner already provides a blocker. “Self” must not appear as “Foe 0”. No unsupported “Heal”, “Use Potion”, “Cast” or “Block Ally” affordance from menu design alone.
5. **Outcome and event history.** Concise actual owner-evidenced changes and a separate chronological log *where corresponding accepted events/records exist*. Preserve hit/miss/mitigation/interrupt identities if genuinely emitted; otherwise display a neutral “Resolution details unavailable” rather than subtracting resource bars on the client to fabricate hit damage.
6. **Terminal/return.** Clear genuine allies-victorious, enemies-victorious/Normal-Stakes recovery and ready-for-ordinary-play states after admitted owner result. Durable reload UI should read saved result/history, not infer victory from missing foes.

## Truth and provenance contract for a later implementation

- **Three different events:** `request admitted` (ledger/caller result), `action progressed/resolved` (combat runtime) and `effect observed` (resource/status/condition/result mutation). Their labels cannot be conflated. Display resource *cost paid* only when committed; before then label owner-projected resource cost as planned/required.
- **Data ownership:** A pure read-only projection may join combatant/action/target IDs with current visible labels. The combat engine must own any future fine-grained accepted resolution receipts and event ordering; UI must not invent RNG, damage roll, hit chance, estimated enemy health, action cause or mitigation values from snapshots.
- **Visibility:** Distinguish player-visible state, observed combat effects, uncertain information and developer-only diagnostics. Foe ordinal alone is a presentation handle, not persistent identity or authority.
- **Chronology and undo:** Show current accepted step and past committed facts. Rejections, duplicates and stale requests do not gain a fictitious turn, damage event or second Chronicle entry.
- **Accessible text-first surface:** Exact timing/state labels supplement any progress bars. Contextual keyboard action selection, target labels, restrained `aria-live` updates and a user-controlled scrollable log are later UI requirements consistent with the accepted information architecture.
- **Version and compatibility:** No new serialized event log should be specified or generated until a focused combat event/receipt owner decision and migration plan proves it necessary. Current terminal history/ledger and saved snapshots remain untouched.

## Later acceptance scenarios (not executed, not Codex's active test plan)

| ID | Future setup | Expected truthful presentation invariant |
| --- | --- | --- |
| F1 | Legal basic melee and sword profile in one encounter | Both commands remain visibly distinct by label, current target and cost; no family alias hides one |
| F2 | Equipped self Block | “Shield Block — Self” with committed cost and later owner-applied status; neither hidden as foe-target nor claimed selected-proven from owner tests |
| F3 | Queued attack needs further Continue beats | Accepted/queued does not display “hit for N” before actual resolution; known lifecycle is distinguishable from wait |
| F4 | Insufficient resource, wrong target, busy/paused, stale request | Owner refusal or no available projection; no fabricated paid cost, changed health or duplicate step |
| F5 | Hit, miss, mitigated action, interrupt and status expiration | Each may be displayed only if the live owner supplies an auditable observable fact; otherwise mark the missing observation contract |
| F6 | Real controlled owner victory and Normal-Stakes defeat | Result and transition labels come from owner/admitted history, never from UI foe counting; no natural-balance claim |
| F7 | Save/reload/restart after accepted combat state | Available action/result/timing/history read from serialized authority; missing detailed log is not recreated as fact |
| F8 | Alternative input and narrow screen | Labels, targets, timing and feedback remain keyboard/accessible, text reflow preserves the current legal options |

## Trigger and safe sequencing

After the active DEV-0.7.2.1 terminal/durability run closes and a later combat UI/read-only-projection implementation slice is separately authorized, inspect the **new** source and exact event/ledger/Chronicle contracts. Prove the narrowest already-supported read-only projection first. If meaningful per-action outcome information is truly absent, propose a separate engine-owned accepted combat-resolution receipt design, replay policy and persistent storage decision; do **not** bridge that gap by deriving effects in React.

Related authorities: [Combat Skeleton First](combat-skeleton-first-priority-and-acceptance-boundary-decision.md), [Combat Capability Audit](combat-skeleton-capability-and-owner-contract-audit-2026-10-20.md), [Contextual Player Commands](contextual-player-action-and-command-architecture-decision.md), [UI Information Architecture](ui-information-architecture-boundary.md), [Creator-to-Combat Input Compatibility](creator-to-combat-input-compatibility-prework-2026-10-20.md).

**Pass limit:** only this independent new Markdown file. No production/schema/content/test/snapshot/Game-version/creator/UI change; no selected browser probe, local build, terminal acceptance, protected-account access, held branch action, Site operation, or alteration of the installed Codex prompt. All future scenarios are proposed, not passing tests.
