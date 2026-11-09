# Gameplay UI Redesign: Character-First Priority, Shell Intent, And Incremental Migration

Date: 2026-10-21  
Repository: `vagabond1215/Lineage_Reforged`  
Source inspected: `master` `f56229dde859b9374a54368bd8a8fd2a9872daa1`; UI consolidation branch `parallel/ui-guidance-consolidation-2026-10-21`.  
Status: **USER-DIRECTED UI PRODUCT INTENT AND MIGRATION PRIORITY RECORDED; IMPLEMENTATION MUST BE AUTHORIZED AND VERIFIED PER SLICE.** No production edit, selected-playability claim, Home activation, combat-parent acceptance, Game-version promotion or replacement of the active combat prompt.

## 1. Priority decision and authority

**Prioritize a coherent, player-usable gameplay UI ahead of completing deferred nutrition/metabolism implementation.** The old UI is no longer an appropriate final interface or efficient ordinary gameplay-testing surface. The nutrition reserve/migration contract and prospective special mage diet remain separately held: see [Draft nutrition PR #6](https://github.com/vagabond1215/Lineage_Reforged/pull/6) and the [independent Human-normalized Codex contract](https://github.com/vagabond1215/Lineage_Reforged/blob/codex/human-metabolic-reserve-contract/docs/design/human-normalized-metabolic-reserve-owner-contract-2026-10-21.md).

This is a *sequencing and presentation intent* decision. It does not supersede:
- [UI Information Architecture Boundary](ui-information-architecture-boundary.md), with its six domains, three persistent regions, text-/systems-first presentation, accessible read-only projections and no nested permanent navigations.
- [Contextual Player Action and Command Architecture](contextual-player-action-and-command-architecture-decision.md) and [local-scene projection](local-scene-context-projection-decision.md): actual concrete owner commands, no UI-calculated legality or fabricated actions.
- [Combat Skeleton First](combat-skeleton-first-priority-and-acceptance-boundary-decision.md): true action/result feedback is the current Layer A gate, not a visual cleanup.
- [Item/Equipment/Inventory Authority Boundary](item-equipment-inventory-authority-boundary-decision.md), and live Inventory/Equipment transition owners.
- [Metabolic-energy](metabolic-energy-stamina-fat-storage-and-atrophy-decision.md), [fat-mobilization](fat-mobilization-body-stat-and-climate-effects-decision.md) and [protein-recovery](protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md) decisions; they are not implemented merely because the HUD has a proposed shape.
- Active `DEV-0.7.2.13 Combat Action Result Disclosure Contract And Repair` and Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `DEV-0.7.2_NOT_READY`, `GAME_VERSION_NOT_READY`.

**Home ≠ Character Overview.** Home answers where am I, what's happening, what is around me, and what can I actually do now? Character Overview answers who is this character, what are their developed capabilities, what do they wield, how have they progressed, and what meaningful distinctions have they earned? Home/current-situation recommendations and recovery forecasts do not become permanent Character Overview cards.

## 2. Verified live source and current defects

Source inspection used:
- [`apps/rpg-ui/src/game-shell/InGameShell.tsx`](../../apps/rpg-ui/src/game-shell/InGameShell.tsx): six-domain rail in `SideNav`, selected tab as UI state, `TopStatusBar` and domain panels. Default `activeTab='character'`; a Home view is not yet the default primary production surface. `pinnedRecordIds` are currently modified from shell state and must not be silently migrated into a new storage owner.
- [`apps/rpg-ui/src/components/TopStatusBar.tsx`](../../apps/rpg-ui/src/components/TopStatusBar.tsx): name/date/context, large `Condition` capsule, enclosed `ProgressBar` HP/MP/ST meters, notices/settings, hover/click popups. Source `conditionStrip` contains owner-backed condition projection; removing the generic pill must not suppress an actionable critical warning.
- [`apps/rpg-ui/src/features/CharacterPanel.tsx`](../../apps/rpg-ui/src/features/CharacterPanel.tsx): left `SidebarMenu` for ten Character subsections, `PanelLayout` with left nav + main + right detail. Overview renders `ReadinessCard`, large `Progression Snapshot`, mixed `Core Stats`, duplicated Active Effects and Field Shortcuts. Attributes appear as a vertically long separate list.
- [`apps/rpg-ui/src/components/body-state/ReadinessCard.tsx`](../../apps/rpg-ui/src/components/body-state/ReadinessCard.tsx): permanent Condition, Stamina Regen, Recovery, Primary Issues, Recommended Actions and Recovery Projection; neutral fallbacks include `No urgent condition pressure.` and `Stay the course.` Neither is meaningful identity/capability summary.
- [`apps/rpg-ui/src/game-shell/characterAttributes.ts`](../../apps/rpg-ui/src/game-shell/characterAttributes.ts): nine ordered attributes STR, DEX, AGI, CON, VIT, INT, WIS, SPT, CHA, with actual names and tooltips.
- [`apps/rpg-ui/src/runtime/uiViewModel.ts`](../../apps/rpg-ui/src/runtime/uiViewModel.ts): read-model attributes and separately mixed `coreStats` with HP/MP/ST, energy/hydration/fatigue/protein/intoxication **and only STR/AGI/SPT**. `overviewMetrics` and `overviewDetail` include progression/standing/discoveries and internal runtime/bridge diagnostics. `activeEffects` includes player effect strings and modifier labels, not necessarily a typed effect-icon/duration contract.
- [`apps/rpg-ui/src/features/characterPanelState.ts`](../../apps/rpg-ui/src/features/characterPanelState.ts): `buildCharacterSectionItems`, `buildEquipmentEntries`, `buildInventoryEntries`, `equipInventoryItem`, `unequipItem`, `consumeInventoryItem` and selection/filter helpers. Current Inventory offers Equip/Use; Equipment offers Unequip. Do not duplicate or change these mutations as a presentation shortcut.
- [`apps/rpg-ui/src/components/layout/PanelLayout.tsx`](../../apps/rpg-ui/src/components/layout/PanelLayout.tsx): fixed inner left `220px` section rail plus optional `320px` detail. This consumes workspace width and should be replaced for Character specifically, not via an unchecked global mutation to every domain.

This source is implementation evidence, **not** approval to mutate `uiViewModel`, `SaveSnapshot`, global actions or saved UI state without parity checks.

## 3. Gameplay shell design

1. **Global region:** one compact top band with character/lineage identity, readable date/time/place, HP/MP/ST, owner-backed urgent conditions, notifications and existing settings/save controls. HP/MP/ST become **larger, readable bars without an individual pill/capsule enclosing each meter**. The current `Condition: Stable`/normal capsule disappears. A small icon (with hover, focus, activation and descriptive text) appears for *actual significant* active conditions/effects; hidden, unsupported, neutral or duplicate warnings are not rendered as fake buffs. Preserve distinct severity cues and actionable details.
2. HP/MP/ST must have complete `current/max` disclosure and accessible labels, colored with semantic roles and suitable contrast. **Fixed-width readable bars are the safe initial display**; max-relative bar width and numeric-vs-percentage preference are **future deliberate configurable options**, not accidental gameplay scaling. Do not alter the real resource values or resource calculation.
3. **Navigation:** retain the global left rail for Character, World, Activity, Codex, Quests, Chronicle. A compact Home/re-entry affordance is design intent but *not* permission to activate an unowned Home command surface. The selected domain's **sibling subsections use a horizontal strip immediately below the global top band**, not a second permanent vertical navigation rail. This is especially important in Character. Section-strip scrolling/overflow must be labeled, keyboard/focus reachable, responsive and never hide the selected section. Avoid second rows of nested permanent tabs.
4. **Workspace:** one selected main context, optional contextual details/inspector only when valuable, not a second permanent mirror of Profile/Overview. No fixed HUD-like unrelated dashboard columns. Fantasy palette: charcoal, dark forest, cream/parchment with controlled gray/silver/bronze/muted gold accents; avoid blanket blue wash, excessive badges, tiny text and decorative frames reducing reading width. Text and actual actions come before illustration.
5. Responsive behavior cannot assume a single desktop screenshot: keyboard, focus restoration, skip paths, pointer/touch, large text, narrow viewport, reduced motion and owner-visible error/unknown states must work.

## 4. Character Overview: meaningful identity and capability sheet

**Overview order, adapted to actual state:** compact identity/portrait (character name, Ancestry and *formative* Origin/Background only where owner-backed, equipped title if meaningful), **nine-attribute matrix**, selected leading developed Skills, Echo Level/Growth/progression if supported, small equipped loadout preview and actual earned distinctions. Do not imply a current player class or confuse ancestry with family lineage/bloodline, backstory with profession, standing with reputation, or Echo Level with generic power score.

**All nine attributes on Overview:** show STR Strength, DEX Dexterity, AGI Agility, CON Constitution, VIT Vitality, INT Intelligence, WIS Wisdom, SPT Spirit, CHA Charisma together in a compact 3×3 matrix (adaptive one/two/three columns by viewport). Each tile shows abbreviation, actual owner-derived current value and an intelligible name. Source breakdown, base/current adjustment, thresholds and existing tooltip description appear through one inspector/keyboard-accessible detail. Do not duplicate `Total`, `Developing`, `Player Stat`, `Unmodified` on every tile. Show a modifier indicator only when meaningful and owner-proven. **Do not render just three of nine attributes as 'Core Stats'.**

**Attributes destination:** retire the current oversized, repetitive list as a mandatory separate section *only after* inline attribute detail, search/deep-link/focus and any legitimate editing/advancement flows have a tested route; otherwise retain a temporary targeted detail section with a clear migration gate. The UI cannot delete an owning operation to tidy navigation.

**No permanent Current State dashboard:** remove the large neutral `Condition`/`Stamina Regen`/`Recovery` cards, generic `Stay the course` recommendation and forecast from Overview. These can be available in owner-backed condition/recovery detail when consequential. No duplicated top-bar HP/MP/ST, effect badges or long mixed `Core Stats` list.

**Overview is adaptive:** meaningful equipped weapon, developed skills and distinctions outrank empty wallet/reputation/standing/discovery metrics; empty counters should not command equal card area. Preserve direct navigation to detailed owner section and inspection without disabling search/favorites/pins.

**Equipment/Inventory:** keep two separate functional destinations. Overview may show 2–4 *meaningful* equipped items with slot labels and an obvious route to Equipment, **not** a slot grid or second item manager. Equipment owns loadout/slots/inspection/comparison and may open a contextual **eligible carried item picker** once implemented against its authoritative inventory/equip owner. Inventory owns carried stacks, containers, quantity, filters/sort, consumption and supported item actions. Reuse the **same** real item identity and `equipInventoryItem`/`unequipItem` logic/authority; do not clone commands between screens. No expansion of in-combat Use or arbitrary crafting/market effects.

## 5. Resources, needs, conditions and deferred Nourishment

| Concern | Persistent top bar | On-demand detailed destination | Rules |
| --- | --- | --- | --- |
| HP/MP/ST | Three readable persistent bars | Actual character/resource detail where owned | Never redundantly show permanent `Core Stats` copies on Overview |
| Active status effects | Condensed significant, typed owner-backed icon/label where actually resolvable | Traits/Effects / appropriate condition inspector | No guessed buff icon/effect magnitude/duration from free-text modifier labels |
| Fatigue/intoxication | **Only meaningful impairments** as situational status signals | Body state owner detail | Continue tracking actual values; do not equate silent normal state with absent mechanics |
| Hydration | Compact Water indicator/popover from actual `hydrationLevel` and its current authoritative bands | Detailed owner-derived hydration context | No invented Hunger meter |
| Energy | Current **effective energy or truthful owner-labeled coverage** only if clearly distinguished; not the proposed signed caloric surplus when owner lacks it | Existing body-state detail | Current `energyBalance` is previous-day coverage, not live signed energy balance |
| Carbs/Fat/Protein | **Design-only slot for three vertically stacked microbars**; omit/mark unavailable in runtime until true owner-backed positive availability pools exist | Later Nourishment inspector | `daily*Consumed`, `energyReserve.quick/stored` and `proteinSufficiency` cannot be relabeled as currently available Carbs, dietary Fat and Protein |
| Stored body fat | No global meter by default | Future detailed reserve/body-state view | Not identical to available dietary Fat or an instant Stamina refill |

Long-term **proposed** Nourishment design: zero-centered rolling signed Energy balance plus vertically stacked positive Carbs/Fat/Protein reserve bars, separate Water indicator, inspectable digestion/storage and significant deficiency warnings. This is recorded in [nutrition design PR #6](https://github.com/vagabond1215/Lineage_Reforged/pull/6) and [owner contract branch](https://github.com/vagabond1215/Lineage_Reforged/blob/codex/human-metabolic-reserve-contract/docs/design/human-normalized-metabolic-reserve-owner-contract-2026-10-21.md). Its numeric/save contract remains held: **do not invent balances or load obsolete counters into three colored bars**.

An initial UI can preserve existing truthful hydration, energy-band and deficit warning projections as clearly labeled detail. If a correct top-band Nourishment affordance cannot be sourced, **ship without the new composite visual** rather than deceive the player or block the whole Character/shell modernization.

## 6. Bounded migration schedule and gates

| Slice | First deliverable | Preconditions and excluded work |
| --- | --- | --- |
| **0. Design/owner source audit** | This product-direction document, read-only source map, chosen first route, acceptance matrix | No game/server mutation; reconcile UI index PR #5 and current combat/nutrition branches |
| **1. Character-first UI presentation** | Read-only Overview identity and **nine-attribute matrix**, compact meaningful Skills/Growth/Equipped Gear, horizontal Character sibling sections while preserving functional inventory/equipment actions | First bounded code candidate. Inspect real attribute/view-model/selection/tooltip/search owners and isolate `CharacterPanel`; no global shell rewire, Home activation, combat or nutrition simulation |
| **2. Persistent shell layout** | New top-bar HP/MP/ST bars without pill boxes, semantic condition indicators, compact global nav, consistent responsive behavior | One source of resource state; existing settings/save/alerts remain; do not merge session mutation into UI; decide sticky/top-band accessibility |
| **3. Equipment + Inventory modernization** | Differentiate loadout workspace from carried-stack workspace, shared eligible item selection, owner-backed equip/unequip/use and useful inspector | Test existing item identity, quantity, slot, container, durability, invalid/rejected operations, Save/load. No duplicative command implementation |
| **4. World and combat primary workspace** | Readable character/location and selected command/target/cost/phase/**real result**, contextual inspector/log | Gate on independently accepted DEV-0.7.2.13 engine-owned result disclosure before claiming combat feedback. Keep combat owner/timing/replay separate |
| **5. Home re-entry + remaining domains** | Owner-backed Home/current situation; Activity, Quests, Codex, Chronicle and linked-record flows, tested individually | Need dedicated Home routing/eligibility decision; defer future unsupported commands and global search/pins editor |
| **6. Final integration** | Navigation/accessibility, selected gameplay, Save/restart, responsive and ordinary-loop parity | No Game-version promotion merely for UI completion; separate readiness/release audit |

These are not six automatically authorized concurrent Codex jobs. Each next slice receives explicit scope, tests, owner and merge review. In particular, **slice 1** should ship without waiting on the unimplemented metabolic reserves, while the combat result repair remains protected from parallel overlap. If latest `master` or in-flight combat changes create code conflict, pause integration and record the exact boundary.

## 7. First Character slice: implementation acceptance matrix

- **Identity and vocabulary:** actual name/Ancestry/Origin/Background/source-backed title where present; blank/unavailable isn't fabricated; no current-class implications.
- **Nine-attribute truth:** all nine appear once with source-correct current values in source `CHARACTER_ATTRIBUTE_ORDER`; tooltip/inspector accessible by keyboard; distinctions between current/base/adjustments preserved.
- **At-a-glance hierarchy:** compact skills/progression/equipped gear; no permanent readiness dashboard, duplicated HP/MP/ST, generic recommendations, duplicate effects, internal `Runtime Bridge` diagnostics or meaningless zero metrics.
- **Nested navigation replacement:** horizontal section strip with selection/focus preserved; selected detail and screen reader labels remain correct; horizontal overflow and responsive text scale tested; no second permanent sidebar for Character.
- **Behavior parity:** Equipment and Inventory remain independently reachable and existing equip/unequip/consume filters/search/favorites/pins continue to work, with exact existing notices and owner/caller behavior. Attribute section removal is optional/held if any supported operation is lost.
- **Save and action parity:** no new schema or gameplay mutation; ordinary existing character save/load, item counts, resources and selected actions unchanged; no fabricated statuses, calories or mock character values.
- **Validation:** targeted view-model/component tests for true owner values, keyboard/focus and narrow viewport, `node --test` impacted current suites, UI-config typecheck and app-local build, and selected ordinary Character/Equipment/Inventory navigation/save readback when tool access permits. Label fixtures and screenshot concepts separately from selected-client proof.
- **Visual:** calm charcoal/forest/cream/sage with gray/bronze/silver/muted-gold accents and substantial legibility; compact information density beats number of decorative cards; no overwhelming single-color theme.

## 8. Explicit holds / non-goals

No wholesale `InGameShell`, `WorldPanel`, combat or `GameSessionContext` rewrite as the first slice. Do not implement the unowned Home action dashboard, brand-new contextual verbs, global search persistence, calendar resimulation, changed character creator, a second equipment owner, nutrition reserves, imaginary damage/target results, Magic-fat demand, player class allocation, balancing, site deployment, or Game-version increment.

## 9. Disposition

**UI_REDESIGN_PRIORITY_SELECTED; CHARACTER_FIRST_MIGRATION_CANDIDATE; NUTRITION_ENGINE_DEFERRED_WITH_DISCLOSED_UI_PLACEHOLDER; FIRST_IMPLEMENTATION_REQUIRES_EXPLICIT_SCOPED_CODEX_RUN.**

The [UI design and migration index](ui-design-intent-and-migration-guidance-index.md) links this new current user direction; the accepted [UI information architecture boundary](ui-information-architecture-boundary.md) remains the durable global frame. Review and integrate this documentation-only branch through draft PR #5 before treating it as merged source authority.
