# Native-v3 food acquisition and selected Use: local acceptance

Date: 2026-11-08. Exact starting source: draft #72 `cc7ad40f6669b7063521e1170214fe5aa0f0e95c`, stacked on unchanged #70 `fad907301d85786feaeed9cf8fecf64bc9d37949`; #71 `6878141f7d27727a0b443cdbf08abe1a2d51b2d9` is design reference only. Test-only child code: `318d032979ca0972551a234dc0b2eace182b8560` on [draft #73](https://github.com/vagabond1215/Lineage_Reforged/pull/73), based on #72. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `HOLD_SELECTED_ATOMIC_ACTIVATION`.

## Acquisition classification

| Route | Current finding |
| --- | --- |
| First-character starter | All seven records in `packages/content/base/player/starting_bundles.json`, including selectable choices, have **zero** directly consumable authored items. `item.ration_bundle` is present in six bundles but has no `consumableProfileId` in `items.json`; the orphan `consume.ration_bundle` profile is not a valid Use grant. No first-character food acquisition is proven. |
| Ordinary later character | `legacy.unlock.lineage.prepared_lineage` rank I costs four Legacy; `legacy.unlock.preparation.storehouse_keys` costs two and requires that rank. The ordinary six-life disposable local route in `apps/rpg-ui/tests/native-selected-real-creator-ration-browser-qa.mjs` previously earned Long Road and Finder's Ledger points, purchased and selected the preparation, then created a character. This historical script/evidence was inspected, **not rerun** in this pass. |
| Owner-bound later character | **Proven here.** Test-only six-point `synthetic_audit` grant was persisted through the account profile CAS. Real `CleanEpochLegacyActionAdapter` purchase of Prepared Lineage and Storehouse Keys, then real selection, succeeded. The actual `EpochApp` creator applied the selected preparation and the native creator placed `item.traveler_ration` x1 in `bag.traveler_satchel`. No item was inserted into an existing campaign. |
| Static content | `item.bread_loaf` and other food profiles exist in item/consumable content; civilization market and simulation references alone do not establish an executable selected native-v3 inventory purchase/transfer. `nativeCharacterPanelQa.tsx` directly inserts Bread Loaf only in a fixture. |
| Unsupported current acquisition | No selected native-v3 vendor/loot/transfer/reward caller for a first character was found in `native*` game-shell owners or the selected `EpochApp` route. This is an evidence limit, not a claim that future acquisition is forbidden. |

`legacyPreparationApplication.ts` adds canonical `item.traveler_ration` with dedupe-aware stacking; `cleanEpochFirstCampaignAdapter.ts` passes the actual selected account preparation to `createNativeNewGameSnapshot`. The selected preparation is consumed at campaign creation. The QA-only `?creator&candidate&food-owner-bound` route is isolated to `native-selected-session-qa.html`; it uses the synthetic prerequisite and real account/Legacy owners, then mounts the actual `EpochApp`. The native staging package was hash-identical to the exact #72 parent, so this route did not enter that package.

## Actual selected local run

The browser origin `http://127.0.0.1:5213` was newly started for this disposable run. Account `account.native.selected.qa.135479b3-567a-4899-ad47-8a9879df5bc7` was synthetic and local only. A prior HMR-created disposable account on the same isolated origin was removed with the same origin database at cleanup. The Legacy UI showed Prepared Lineage Tier I and Storehouse Keys **SELECTED**; the real creator's final review showed `Storehouse Keys — APPLIED — Traveler Ration x1` and the starter pack included that unit. Its source ledger recorded synthetic grant +6, then actual Legacy spends -4 and -2. This is **owner-bound acquisition**, not an earned-progression claim.

Before Use, a fresh account-store read showed account revision 6, campaign head revision 1, publication `publication.22d39274-2f70-43e5-aa2b-020c856582be`, one Traveler Ration in `bag.traveler_satchel`, no overflow, Use ledger revision 0 and no Use receipts. The native Inventory rendered that exact stack with enabled **Use Traveler Ration**; Rope was disabled for no authored consumption effect. Four gear instance IDs and their condition/locations were recorded.

The selected Inventory **Use Traveler Ration** click produced `Use Traveler Ration completed.` and removed the stack row. A fresh retained-store read **before Save** still showed the original publication, quantity 1 and ledger revision 0, proving the accepted gameplay change was not silently written to its predecessor. The selected **Save** then produced account revision 7, head revision 2 and new publication `publication.a82f0fa0-5905-4c25-bf85-1f1ef8751fac`.

| Retained field | Before | After Save |
| --- | ---: | ---: |
| Traveler Ration quantity | 1 | 0 |
| Native Use ledger revision / receipts | 0 / 0 | 1 / 1 |
| Daily calories | 0 | 22.66 |
| Daily protein / carbs / fat | 0 / 0 / 0 | 4.9 / 9.72 / 5 |
| Daily hydration consumed | 0 | 3 |
| Quick energy reserve | 70 | 83.119 |
| Hydration level | 80 | 83 |
| HP / MP / Stamina | 120 / 60 / 112 | 120 / 60 / 112 |

The retained Use receipt request ID was `native.selected.ui.3abcef4b-aee9-43aa-ab51-4a450b5e6045`; its fingerprint names the exact prior satchel stack and index. Gear graph, quest IDs and null encounter were identical across the two readbacks. The UI was navigated to `?resume&candidate` and loaded the same saved character; Inventory then showed Rope but no Traveler Ration. A separate temporary, read-only local QA page opened a **fresh account-store connection** and compared the restarted source against the saved source: same publication and account revision, exact inventory, body, resources, Use ledger, gear and quest data. All comparisons passed. The temporary page was removed afterward.

The local browser acceptance did not exercise exact duplicate/conflicting request IDs via UI. PR #72's permanent combat-legality test and this pass's native item/session tests cover duplicate replay, conflicting IDs, stale selections, encounter and pending-defeat rejection through the actual owner. No new runtime defect was reproduced, and no gameplay owner was changed.

## Verification and limits

- Focused native creator, fungible Use, combat legality, selected Character, item/session, selected session, pending and Character panel: **34/34** (eight test files, each executed sequentially to avoid shared Vite cache/port contention).
- Root Legacy account/unlock/preparation/purchase: **46/46**. Adjacent v2 Inventory/Equipment: **28/28**. Root Save roundtrip: **3/3**.
- UI Node typecheck passed. Broad UI TypeScript: **194 diagnostic lines on child and exact #72 parent, zero textual delta**; broad typecheck remains baseline-blocked.
- Native staging Vite: **286 modules**, 36 files, **31,688,504 bytes**. Every relative file path, byte count and SHA-256 matched a fresh exact #72 parent build; the QA-only route is absent from the staging artifact. This is a local build comparison, **not** a newly approved publication artifact.
- Initial test attempts from the wrong working directory, concurrent Vite tests sharing a cache, and a staging build without its required origin failed as setup errors. Corrected sequential/correct-origin runs above passed. `git diff --check` passed.
- No authenticated hosted food acquisition/Use/Save acceptance was performed or authorized. Ordinary first-character edible acquisition is still absent; historical multi-life earned-route evidence was not repeated. A new exact artifact requires separate review and owner approval before any private staging publication. Atomic activation remains held.

Applied failure patterns: FP-001 actual `EpochApp` creator/Inventory/Save caller; FP-005 exact source versus accepted Save, retry/stale owner regressions; FP-011 combat/pending admission retained from #72; FP-017 synthetic prerequisites are explicitly excluded from ordinary acquisition proof. No PR merge, rebase, retarget, deletion, Site deployment, existing-account change, Save-format change or Game-version change. Disposable local origin account storage was deleted; the task-owned server and tab were closed.

**Next bounded task:** review this test-only child with #72. If authenticated food acceptance is desired, prepare a new exact staging artifact and obtain separate publication approval, then use an authorized owner account to verify a legitimately earned later-character preparation, selected Use and same-campaign Save/restart. Any new first-character food acquisition needs a separate gameplay/content owner decision; do not infer it from this fixture.
