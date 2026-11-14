# Non-Fungible Gear Cutover: Recovery And Regression Packet

Date: 2026-10-26
Status: `CONNECTOR_PREP_ONLY; TEST_CASES_NOT_EXECUTED; DESIGN_DECISIONS_PENDING`
Source baseline: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`
Active implementation owner: current `docs/dev/current-codex-prompt.md` on `master`.
Companion caller source map: [Non-Fungible Gear Cutover Caller And Classification Audit](nonfungible-gear-cutover-caller-and-classification-audit-2026-10-26.md).
Do not use this document to authorize partial migration, force a save schema, or infer selected-client acceptance.

## 1. Purpose

Supply specific independent negative/restart fixtures for Codex's isolated-branch gear cutover, including the actual legacy information-loss case, old-save recovery without fabricating provenance, catalog-scoped gear classification, and current-v2 versus historical-v0.6.0 save boundaries.

This is deliberately a **test contract candidate**, not a code patch. Exact implementation details, quarantine UX, receipt schema and format-version decisions remain controlled by the validated owner route. Existing authorized historical survey witnesses and legacy/target save publication must survive unchanged.

## 2. Admission and inventory fixture matrix

| ID | Construct a real saved/caller fixture | Assert at the eventual conversion boundary |
| --- | --- | --- |
| GEAR-01 | Unequip a damaged bow into a bag with one same-key bow through `CharacterPanel` → `unequipItem`; Save/reload; legacy stash flag remains. | Current audit correctly flags ambiguity. The future cutover neither chooses a random bow to inherit durability nor loses a unit. The owner provides an **actionable, bounded recovery/quarantine path** retaining source evidence. |
| GEAR-02 | Repeat GEAR-01 with opposite physical bow histories that collapse into identical old stack+flag bytes. | The migration does **not** pretend to distinguish histories that serialize identically. Recovery outcome is explicit, not inferred. |
| GEAR-03 | Legacy `slot.accessory.ear` quantity two with one durability scalar; similar old `slot.accessory.fingers` multi-quantity. | Do not assign one durability to all instances; retain full original ref, track ambiguity/excess, and choose no irreversible distribution without an accepted repair rule. |
| GEAR-04 | Old single-item Ear, Eyes and Fingers plus unchanged other 14 old positions. | Map first positions left-first under a versioned conversion; preserve item quantity, modifiers, durability and old survey witness. |
| GEAR-05 | Ordinary bag has 300 rations plus one wearable; overflow also contains rations. | Gear-scoped migration does not reject merely because **fungible** quantity exceeds diagnostic 256-row preview limit; bulk stacks still conserve quantity. |
| GEAR-06 | Bag contains an actually equip-capable combat tool with wear, plus bulk tool materials and a weapon. | Classification uses authoritative item/profile semantics; a user-facing `tool` string or default class alone cannot silently discard uniquely worn/provenance-bearing gear. Preserve unrelated supplies as stacks. |
| GEAR-07 | Two identical **new-format** bows with different durability, initially in the same bag. | Each has unique stable ID. Equip either specific ID; Unequip and sort/transfer/reload never swaps durability or merges identities. |
| GEAR-08 | Equip a third item into an occupied slot, displacing the old item into a full bag / overflow. | Atomic destination selection, identity and condition conservation; no lost gear, duplicate gear or silently over-capacity bag. |
| GEAR-09 | Stale list selection after bag sort/stack removal; malformed/duplicated bag IDs; negative/overflowing quantities. | Stale/invalid request returns no mutation; malformed old source remains recoverable and cannot activate a partial ledger. |
| GEAR-10 | A saved preset eventually references one now-sold, destroyed or otherwise unavailable item ID. | The preset reference does not conjure a replacement or create a second location. (Deferred preset-phase regression, **not** current cutover implementation.) |

Any case that the current content does not permit must be reported as a deliberately constructed fixture versus demonstrated production reachability. Do not label the entire future matrix as passing because the existing read-only audits pass.

## 3. Save admission, provenance and restart matrix

| ID | Source / operation | Required proof |
| --- | --- | --- |
| SAVE-01 | Current new-game target snapshot `lineage.save_snapshot.v2`, existing stored target envelope + indexed artifact. | Current admission/readback remains valid through format and identity checks. A new version/field is admitted only through a version-aware explicit contract. |
| SAVE-02 | Historical legacy envelope with `snapshotVersion = 0.6.0` and an old slot map. | Existing migration path remains readable; an unknown target-version string must not be accepted by relabeling it as legacy. |
| SAVE-03 | Old Ashen Reef survey `ownerInputs.equipment` with exact 17 keys and fingerprint/provenance. | Historical proof validates unaltered after a new live character equipment conversion. Future capture has a separately accepted history adapter or versioned witness; no retrofit. |
| SAVE-04 | Same old artifact loaded twice, both attempting conversion. | Persisted receipt binds source account/campaign/character, artifact identity, revision and source format; no second migration or new IDs on repeat. |
| SAVE-05 | Interrupted publish, local write failure, stale revision/conflicting envelope/IndexedDB address, or partial write. | No newly admitted half-migrated campaign, duplicate gear, lost rollback artifact or silently advanced campaign control. Test the actual SaveManager and IndexedDB caller path. |
| SAVE-06 | Quarantined ambiguous stash/source with valid other campaign records. | Old bytes retained; character has an explicit recovery route. Unambiguous records remain conserved and a failed recovery attempt does not destroy/save-over source. |
| SAVE-07 | Old equipment has `resourceModifiers`; after conversion/save/reload it is equipped, then unequipped, then re-equipped. | Resource maxima/tick effects exactly once from effective worn state; no double bonuses from shadow legacy gear or presets. |
| SAVE-08 | Item loss/transfer, UI sort, bag index changes and game tick advance after first accepted migration. | Stable IDs survive and are independent of `capturedAtTick`, unstable indexes or repeated provisional `legacy-unit.v1.*` proposals. |

**Historical vs target format distinction:** `newGameSnapshot.ts` emits `lineage.save_snapshot.v2`; `saveManager.ts` checks target `TARGET_SNAPSHOT_FORMAT`, while explicit `0.6.0` comparisons guard older envelopes. `campaignIndexedDbStore.ts` ties artifact snapshot version to `snapshotFormatId`. `serializeSnapshot` / `deserializeSnapshot` alone are not a version migrator. Each surface needs independent proof and old-artifact retention.

## 4. Actual caller/projection parity

| ID | Production entry / projection | Required evidence |
| --- | --- | --- |
| PATH-01 | `CharacterPanel` selected Inventory Equip and selected Equipment Unequip | Targeted ID cannot be swapped by stale UI list selection; real action, resulting snapshot, notice, Save/restart and repeated click tested. |
| PATH-02 | Starter equipment and Legacy preparation grants | Correct number of newly owned units; no duplicate from item-key dedupe, no missing starting tool/equipment or modifier. |
| PATH-03 | `gameplayLoop.ts` Rivet Shortfall quest cargo | Ordinary cargo quantities continue to add/remove through accepted fungible stacks; migrated gear's location and durability unchanged. |
| PATH-04 | `combat/index.ts` weapon/armor hooks and action eligibility | Same actually worn gear yields same valid melee/ranged/shield use and provenance as legacy; offhand/mainhand identity consistent; inventory and inactive preset items give no actions. |
| PATH-05 | `player-resources.ts`, `player-engine` delta, `uiViewModel.ts` | No modifier multiplication, double counts or phantom capacity; one owner-backed effective-worn projection. |
| PATH-06 | Account estate deposit path | Existing `SAFE_ITEM_CLASSES = {commodity, consumable}` semantics remain unchanged; no gear automatically enters the estate or becomes inheritable through this cutover. |
| PATH-07 | Historical survey activity advancement/capture | Exact-17 historical witness still validates even if live owner representation is new. |
| PATH-08 | Existing active encounter and Save/restart | Do not reinterpret combat's captured equipment provenance or change combat resolution while performing ownership migration; test pre-existing active and terminal states where save owner admits them. |

## 5. Recovery semantics to settle before mutation

A permanent `blocked` flag is not a recovery owner. For old ambiguous records, Codex must present a decision-complete supported recovery path. Minimum properties:

1. **Keep original source readable/recoverable.** Retain raw provenance and an immutable converted-from marker rather than rewriting the only archived artifact.
2. **Maintain exact physical quantities.** Unknown per-instance durability stays unknown/attached to source evidence; never assume the last equipped item's stored condition belongs to an arbitrary available duplicate.
3. **Provide reachable resolution.** A repair/quarantine result must be represented by an explicit owner and caller that users can reach from Save recovery or gameplay. Storing an error string forever is not enough.
4. **State what can be used while unresolved.** Some records may need restricted item actions, not permanent campaign-wide lockout; define bounds and rollback before code.
5. **Make repeated operations safe.** Same source event, retry after crash, stale session and multiple identical copies must not mint duplicate IDs or retroactively swap provenance.
6. **Avoid unrelated systems.** This project stage does not decide heirloom inheritance, estate gear transfers, quality/crafting instances, new loadout UI, underwater restrictions or timed Equip behavior.

Do not silently elect any particular lost-provenance repair policy on behalf of the owner. Document candidate approaches and their player-visible tradeoffs if that choice remains material; implement only an accepted, safely testable contract.

## 6. Suggested bounded Codex checkpoints and stop conditions

**Checkpoint A: owner contract and reproducible fixtures.** Identify exact gear eligibility and all mutation/read/save consumers from a synchronized checkout. Produce red tests for the real merged-bow failure, safe target+legacy format reads, 300-ration plus one-gear case, source-bound IDs, and lossless source preservation.

**Checkpoint B: coherent owner integration** only if all required owners are ready. Introduce stable gear identity, location, accepted old-save conversion/quarantine, real gear movement and effective-worn projection in one connected branch, with no parallel legacy mutator. Use internal targeted commits for review, not a partially operational deployment.

**Checkpoint C: persistence and acceptance.** Run ordinary caller/Save/restart/adversarial cases, selected real client when access is authorized, and independent code/revision review. Keep branch unmerged until the exact rollback and historical-save evidence is accepted. No Site deployment or Game-version adjustment from this preparatory packet.

If the complete cutover is too large for one safe accepted package, **do not merely mint inactive extra IDs** and claim progress. Leave active gameplay alone, record the specific unresolved contract, and select the smallest necessary decision or evidence pass. The existing read-only planners remain useful evidence; avoid endless near-identical probes without a new blocker or decision.

No test commands were executed by the connector. This packet is a proposed execution matrix, not completed verification.
