# Native-v3 Checkpoint B — admission-before-recovery and practical merge-scope connector review

Date: 2026-11-09. Repository: `vagabond1215/Lineage_Reforged`. Exact inspected integration source head: `50aab130c690a11c463322919ab04119849a6619`. Status: **`V3_ADMISSION_RECOVERY_ORDER_REVIEWED; FOCUSED_CODE_REPAIR_AND_TEST_NEEDED`**. This is GitHub **source inspection only**, not an executed test, deployed app observation, merge approval or user-account access. Preserve the existing isolated task branch and fresh-check live refs.

## 1. Small but important newly observed command-boundary gap

At the Checkpoint B head, `apps/rpg-ui/src/EpochApp.tsx` has successfully added native-mode status projection and rejected-format guards for Main Menu, Load Game presentation, `activateSlot`, and `enter`. However, the separate **Load Game callback** `load` (around lines 350–359) does:

1. Await `services.launcher.load(...)` for the selected ready slot.
2. Invoke `await recoverLoaded(accountId, slotId, ..., result.value.slot.loaded)`.
3. Only then invoke `enter(...)`, where `readNativeEpochAppSession` rejects non-v3 snapshots.

`recoverLoaded` (around lines 334–347) returns v3 unchanged, but for a **v2** snapshot with `hasPendingNormalDefeat(snapshot)` it can call the **mutating** `services.normalDefeat.recover`. Thus the native-mode *post-recovery* `enter` rejection does not itself prove a rejected v2 Save was never mutated. The normal UI disables non-v3 Load, and `activateSlot` has an earlier guard, so this is a **potential alternate-caller/recovery ordering risk**, not proof of an observed user-level exploit or data corruption.

**Smallest repair:** in the actual `load` command boundary, when `nativeCandidate` is selected, require the loaded snapshot to be accepted native-v3 **before** calling `recoverLoaded` or any other recovery/mutation owner. Preserve v2 default behavior and retain the existing `enter` guard as defense in depth. Optionally centralize the **read-only native admission predicate** only if simpler than duplicating a check; do not invent a parallel Save registry or redesign the recovery owner.

**Focused regression:** supply a synthetic otherwise-valid v2 Save with `normalDefeatReceipts` pending, call the native-mode load handler or extracted command function as close as feasible to the owner, and prove it rejects **before** any `normalDefeat.recover` invocation, `ENTER_GAME`, changed slot/campaign bytes or account-side effect. Also keep one valid native v3 positive path and one v2-default behavior witness. The previously reported 7/7 status-projection test does **not** cover this alternate Load path.

## 2. Damaged-slot label: avoid building a forensic reader for pre-alpha

`cleanEpochAccountStore.ts` `listSlots` (about 1608–1630) runs `inspectSlot` sequentially in a read-only transaction. If `inspectSlot` finds malformed account, shared campaign/attempt, retained descendant, artifact, slot generation or receipt evidence, it throws `invalid_record`. `CleanEpochLauncherRead.inventory` catches that and returns a blocked owner result. This is **already fail closed**: it does not load or label incomplete data as an empty slot. Some failures pertain to a **shared account or campaign graph**, not one known slot. Arbitrarily catching every `invalid_record` inside a slot and labeling that slot `corrupt` risks hiding shared authority loss and misattributing deletion.

**Practical foundation-level disposition to evaluate:** preserve the *account/inventory-level* blocked status with neutral **“Save data could not be validated; Play is unavailable and the data was not changed”** messaging for indeterminate `invalid_record`, and preserve separate `unavailable`/`blocked_upgrade` Retry semantics. Do **not** label the exact slot `Damaged` unless the existing authoritative store can prove that attribution without weakening graph validation. Per-slot forensic diagnosis is a **nonblocking future UX improvement** when fail-closed admission is intact and fresh v3 saves/restart work. If owner evidence instead shows malformed one-slot state makes good neighboring slots silently accessible/rewritable or damages them, that is a genuine safety blocker and should get a separate minimum repair.

**Minimal tests:** one representative malformed known-format record and one healthy neighbor in a synthetic account; verify no gameplay admission, overwrite, deletion, or neighboring record mutation. One unavailable read should remain Retry, not “corrupt,” and a valid fresh v3 save should remain usable. Do not force isolated per-slot display if the owner lacks reliable causal provenance.

## 3. Legacy delete-only: retain the safe owner and the scoped hold

`cleanEpochAccountStore.transitionAccount("delete")` already requires verified identity, credential, exact revision/generation, complete account-owned row graph, transaction/receipt/tombstone and readback. `cleanEpochAccountAdapter.deleteAccount` is the existing safe caller. Arbitrary older localStorage and cross-origin account bytes do **not** have the proven same-origin, exact-account ownership graph needed for an independent deletion writer. Keep `LEGACY_DELETE_SCOPE_UNAVAILABLE` as a **documented optional capability gap**, not a pre-alpha v3 source merge blocker. It is safer to leave an unsupported old account invisible than to present a misleading Delete action or touch other accounts.

Valid current clean-epoch accounts and supported scoped slot deletion are separate and must remain functional. Future metadata-only legacy inventory requires a specific family + source/owner + delete-graph audit, not this run.

## 4. Master advancement and relevant design precedent

When this connector pass began, `master` had advanced beyond the prior `0522161f` integration base. Its inspected delta was **documentation-only** (the new [Core World Entries, Hardcore, Prestige, Succession owner direction](../design/core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md), plus edits to the regional playthrough priorities, open design questions index and roadmap). Refresh the **exact current master SHA and diff again at execution**. No new overlapping runtime diff was observed in that snapshot; this does **not** justify overwriting master design documents with branch-local historical copies.

The newer Core-World owner direction requires a **mandatory authored Core entry** rather than the prior optional/skippable introductory scene. That is relevant to **later gameplay** planning but not a requirement to implement Core onboarding, Hardcore, succession or estate systems as native-v3 integration tests. Preserve this newer master design priority in the final integration; do not expand Checkpoint B.

## 5. Bounded next execution and disposition

1. Recheck branch/master refs, dirty worktrees, output/handoff and correct source paths.
2. Fix **only** native Load admission **before** any v2 defeat-recovery mutation, if source still matches.
3. Inspect indeterminate `invalid_record` versus storage failures; use truthful account-level blocked/Retry presentation without per-slot guessing. If current behavior already satisfies this conservative rule, record that and do not build more diagnostic machinery.
4. Run **only** a new focused admission-before-recovery regression, a changed-caller positive v3/negative v2 witness and one read-failure noninterference test; one relevant typecheck/build if touched. Do not rerun unchanged 57/57 or broad suites.
5. Publish the narrow code/test result on the isolated integration branch with exact files/commit, classify residual *UX* gaps separately from any *integrity* blocker, and recommend **independent development-master merge review** if core owners are coherent. Do not merge, activate v3, deploy, delete a Site, mutate real Saves or change Game version.

Possible outcome: `V3_FOUNDATION_READY_FOR_INDEPENDENT_MERGE_REVIEW; PER_SLOT_DAMAGE_UX_DEFERRED; LEGACY_DELETE_SCOPE_UNAVAILABLE` **only if executed focused safety/positive tests support it**. Otherwise report an exact remaining source-safety blocker. The source connector report alone **does not** establish readiness.
