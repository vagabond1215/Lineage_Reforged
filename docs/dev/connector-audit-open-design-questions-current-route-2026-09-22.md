# Connector Audit — Outstanding Design Questions Against Current Route

Date: 2026-09-22

Repository: `vagabond1215/Lineage_Reforged` only.

Audit source before this documentation pass: hosted `master` `45356195d9556d31968fb05c4fb790ccb79a5f4d`, followed by the same-turn Connector provenance audit/decision documentation.

Posture: Connector-safe documentation audit. No production/test/schema/content mutation and no executable acceptance claim.

## 1. Reason For Audit

`docs/design/open-design-questions-index.md` was last refreshed on 2026-09-14. Its question rows remain useful, but its **Current Pipeline Context** is stale: it still describes the durable-completion implementation as pending and says no unresolved design question blocks that implementation.

The repository has since advanced through:

- Soundings durable-completion implementation;
- independent audit `REPAIR_REQUIRED` at F1;
- provenance repair investigation `PROVENANCE_CONTRACT_REQUIRED`;
- accepted documentation-only provenance contract `PROVENANCE_CONTRACT_ACCEPTED_REPAIR_AUTHORIZED`;
- installation of the bounded `Soundings Accepted Admission Witness And Provenance Binding Repair`.

This audit does not rewrite historical question rows merely because their surrounding pipeline moved.

## 2. Immediate / Open-Soon Questions

### Provenance / existing-save compatibility

Status: **resolved for implementation authorization** by:

`docs/design/soundings-accepted-admission-provenance-and-retention-contract-decision.md`

Resolution:

- future repaired Soundings completions use independently retained save-owned admission witness evidence;
- existing pre-repair completed saves remain playable/saveable for unrelated gameplay;
- existing saves do not receive synthetic trusted provenance;
- provenance-dependent historical retry/repair on legacy no-witness completion is non-mutating/unverified rather than repay/reconstruct;
- new provenance-required completions fail closed on missing/conflicting witness after recovery;
- no world/game/milestone version change is implied.

Therefore there is currently **no unresolved user product/canon question blocking the installed repair**.

## 3. Existing `OPEN_LATER` Rows

The three existing `OPEN_LATER` questions remain valid and non-blocking:

1. whether `religious_order.*` identities should become direct Knowledge subjects;
2. the final player-facing label for exact 100 elemental favorability;
3. which grounded ordinary-work quests should be authored first when that content lane is selected.

None has a current runtime consumer in the Soundings provenance repair. Do not pull them into the current package.

## 4. Existing `OPEN_STRATEGIC` Rows

The five existing strategic questions remain valid and non-blocking:

1. first builder-adjacent playable slice;
2. exact Hardcore modifications by difficulty mode;
3. exact inverse Prestige/difficulty scaling;
4. generated-NPC promotion/profile semantics;
5. item-stack separation facts beyond storage location.

Current provenance work provides no new evidence requiring any of these to be answered now.

## 5. Deferred-With-Trigger Rows

The deferred Religion/relationships, organizations/law/dynamic quests, travel/map, family/heirs, maturation/rearing, recipe/crafting, ecology/agriculture and magic-runtime rows retain their existing triggers.

No current trigger is activated merely because Soundings now has return travel, a completion receipt or a save-owned provenance repair.

In particular:

- the four-tick Ashen -> Starfall return is a bounded quest route, not the broader fast-travel/grid/caravan trigger;
- the 5g completion payment is not a generic economy/crafting trigger;
- the Duty Harbormaster role does not activate generated-NPC promotion semantics;
- the accepted survey evidence is not an inventory-item identity trigger;
- the concept-derived UI design intent does not itself reopen unrelated mechanics decisions.

## 6. UI Design Question Posture

The September 14 concept-derived gameplay shell direction is already accepted in `docs/design/ui-information-architecture-boundary.md`.

There is no unresolved UI product question blocking the provenance repair. Broad shell implementation remains deferred until the Soundings closure is independently accepted and a separate Gameplay Shell Target Architecture / incremental migration decision is selected.

## 7. Current Question Routing

Current blocking sequence is technical, not product-authored:

1. implement the accepted admission-witness/provenance repair;
2. independently audit repaired Slice A plus remaining A/B/C/D;
3. only after acceptance consider the next game-version/UI/playability decision.

If the repair discovers a conflict that cannot satisfy the accepted witness contract without changing existing-save behavior, return to a narrowly stated technical/product decision. Do not reopen unrelated rows preemptively.

## 8. Connector Disposition

`OUTSTANDING_QUESTIONS_ALIGNED_NO_CURRENT_PRODUCT_BLOCKER`

The old index's row-level open/deferred classifications remain useful; only its pipeline header/current-blocker statement is stale. A later low-risk maintenance pass may refresh that file in place, but no stale row should override the more specific current prompt/handoff/accepted provenance decision.
