# Equipment and Inventory UX: First Stacked Slice

Date: 2026-10-22. Repository: `vagabond1215/Lineage_Reforged`. Run: unversioned bounded UI presentation. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, `DEV-0.7.2_NOT_READY`, `GAME_VERSION_NOT_READY`. Source: master `f56229dde859b9374a54368bd8a8fd2a9872daa1`; stacked parent PR #7 `8610260fd40a7b371a4789e954f53fc884ad71df`. Design PR #5 at `1522bb2dd902e8aa918dbe740cbd6c9f02d47c4d`; owner PR #10 at `9f390e03a26011213dee53929da309f470adba62`; top-bar PR #8 at `20825cce24703e5066fb827075d5f310e847fb34`; mobile PR #9 at `69215b6fa6b4bcc805363171541120645f365d8c`. All remain draft/unmerged. Nutrition PR #6 and protected/held refs were inspected and not consumed.

## Owner and UI action matrix

| Surface | Live projection | Existing action owner | This slice |
| --- | --- | --- | --- |
| Equipment occupied/empty | `buildEquipmentEntries`: slot ID, item ref, quantity and optional equipped durability | `unequipItem`, `toggleFavoriteItem` | Clear occupancy and selected slot; show quantity and durability only on the equipped ref; route to Inventory. No picker or new slot rule. |
| Inventory carried stack | `buildInventoryEntries`: bag/overflow, index, quantity, category and `preferredSlotId` | `equipInventoryItem` | Show source and current Equip availability; explain missing supported slot. The slot projection is corrected by unmerged PR #10 in composition. |
| Authored consumable | `consumePreview` exists only when a valid `consumableProfileId` resolves | `consumeInventoryItem` | Enable Use from profile-backed preview, including `item.breast_cut` whose legacy display category is not `consumable`; explain missing profile or zero quantity. |
| Selection/favorite/notice | Current visible entry IDs, session favorite flags and owner notice | Existing callers unchanged | Keep sort, category, pin and favorite controls; do not auto-select a different item after the chosen ID disappears. Expose selection with `aria-pressed`, reason links and focusable live notice. |

## Before and after

Before, Equipment and Inventory wrapped favorite/pin buttons inside selection buttons, which produced nested controls. An empty slot and a carried item without an action profile showed only a disabled action with no reason. Inventory Use was disabled by heuristic `category !== 'consumable'`, even for an authored profile such as Breast Cut. After, selection, favorite and pin are sibling controls; current occupancy, bag/overflow quantity, selection and reason are explicit. A source-backed consume preview controls Use. A removed stack ID stays unselected until the player chooses a current stack; the UI does not dispatch a second action against an auto-selected neighbor. Rejection notices do not call `updateSnapshot` with the unchanged snapshot.

This patch changes `CharacterPanel.tsx` only in production. Its optional `initialSection` prop supports direct section rendering in controlled tests; the game caller still opens Overview by default. No `characterPanelState.ts`, catalog, item resolver, combat, save schema, body state, nutrition, Home, creator or Game-version code was copied into this stacked branch.

## Validation

- Pre-edit SSR presentation regression: **0/1**, Equipment route remained Overview and required selection/action cues were absent.
- Stacked branch: `cd apps/rpg-ui; node --test --test-concurrency=1 tests/equipment-inventory-presentation.test.mjs tests/character-overview-render.test.mjs tests/character-owner-actions.test.mjs`: **8/8 pass** after the final added bow-projection case. (The earlier 7/7 run preceded that added case; final rerun is recorded in the completion report.)
- Disposable composed checkout: PR #7 source + exact PR #10, #8 and #9 source/tests + copied UX presentation/test only. Distinct PR #7/#8/#10 historical register entries were preserved; production paths had no textual merge conflict. With `EXPECT_EQUIPMENT_OWNER=1`, six UI files including both bow resolver and shell suites: **15/15 pass**. This proves Composite and Short Bow labels follow PR #10's live projection, with occupied-slot/overflow/state-conservation owner tests from PR #10.
- Composed root `node --test` for character navigation/attributes, equipment profiles, combat equipment/spawn/hooks, creator/start resources, nearby caller and SaveSnapshot roundtrip: **119/119 pass**.
- `npm run typecheck:node`: **pass** on stacked and composed UI. `npm exec -- vite build`: **pass** on stacked and composed UI; existing Browserslist age/large-bundle warnings.
- Independent broad `npm run typecheck` in same dependency environment: clean master **137**, clean PR #7 **136**, stacked UX **136**, composed UX/PR #10/#8/#9 **135** diagnostics; all exit 2. Normalized comparison against clean PR #7: **zero new signatures**. Its `CharacterPanel.tsx` `PanelDetailStackProps` optional-prop signature is inherited, not introduced here.
- `git diff --check`: pass on the stacked patch and disposable composition.

## Browser and acceptance hold

The exact PR #9 controlled `InGameShell` fixture was composed and its localhost Vite server returned HTTP 200 from the host. The in-app browser timed out; Windows Computer Use then stopped because it could not verify the browser URL. No new width, zoom, keyboard, popup, screenshot or selected-client observation is claimed. PR #9's earlier 320/375/768/1440 screenshots are historical supporting evidence only. No authorized authenticated selected campaign was available. **EQUIPMENT_INVENTORY_SELECTED_INTERACTION_UNVERIFIED** remains for real Equip → Unequip → Re-equip, supported Use and Save/restart/readback. Do not merge this consumer or accept upstream UI PRs from the controlled tests alone.

## Integration route and owner gaps

Keep design PR #5 as guidance; resolve PR #7 selected Character gate and inherited typing, PR #8 top-bar selected gate, and PR #9 responsive selected gate. PR #10's canonical resolver and live equip validation must be integrated or otherwise present **before** this stacked UX is accepted; rerun the composed tests and real browser checks after each integration. Then review this stacked PR against PR #7, preserving each branch-register history. No merge/deletion is performed here. Current content does not author general handedness, armor coverage, or per-instance durability for merged stacks; this UI does not infer them. The next UI slice can consider a contextual eligible-item picker only after an authoritative slot contract and selected owner-action proof.

Guardrails: FP-001 actual CharacterPanel and owner caller tests; FP-002 controlled versus selected distinction; FP-008 cross-PR semantic composition/register preservation; FP-009 exact base/head accounting; FP-015 profile/slot projection; FP-016 browser placement proof held. Suggested commit: `feat(ui): clarify Equipment and Inventory actions`.
