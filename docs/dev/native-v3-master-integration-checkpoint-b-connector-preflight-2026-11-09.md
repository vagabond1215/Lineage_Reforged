# Native-v3 integration — Checkpoint B connector source preflight

Date: 2026-11-09  
Repository: `vagabond1215/Lineage_Reforged`  
Exact inspected isolated branch: `codex/native-v3-master-integration-2026-11-09` at `8263f3eb7d3922bf33d10db9c5c4cff7806ae668`  
Exact inspected `master`: `0522161fb955a9e3128585766723b7f3fc04c4a8`  
**Status: `V3_CHECKPOINT_B_SOURCE_PREFLIGHT_COMPLETE; CODE_EXECUTION_OUTSTANDING`.**

This is a **read-only GitHub source and owner-boundary analysis** recorded on the existing isolated branch. It performs no local tests, source modifications, account/Save deletion, activation, PR lifecycle action, Site change or master merge. Codex must recheck both exact refs, the checkout, and the installed [branch-local Codex task](current-codex-prompt.md) before code changes. The executed [Checkpoint A report](native-v3-master-integration-checkpoint-a-2026-11-09.md) remains `V3_INTEGRATION_PARTIAL`, with reported final focused serial 57/57 tests and passing Node UI typecheck and direct/default/staging builds. **Do not repeat those green suites** unless Checkpoint B touches a covered owner/caller or a regression actually appears.

## 1. Exact owner/caller preflight

| Surface and exact source location | What exists | Smallest required Checkpoint B change/review |
| --- | --- | --- |
| `apps/rpg-ui/src/EpochApp.tsx` `enter` about line 311, `activateSlot` about 344 and `load` about 344; `apps/rpg-ui/src/game-shell/nativeEpochAppSession.ts` lines 15–26 | In `enter`, `readNativeEpochAppSession` is called, but returns `null` for non-v3 snapshots; `enter` does **not check that return value** before dispatching `ENTER_GAME`. `activateSlot` treats any `ready` slot as loadable. The candidate flag does guard native actions/Save later. | **High-impact admission gap:** when native-v3 candidate mode is selected, an otherwise valid **v2** Save must be shown as **incompatible/delete-only**, not admitted through the old gameplay path. Preserve existing v2 default mode until independently authorized activation. Do not globally reject v2 at the shared storage layer while v2 remains the default development app. |
| `apps/rpg-ui/src/game-shell/cleanEpochLauncherRead.ts` lines 39–68; `cleanEpochAccountStore.ts` `listSlots` about 1608 and `inspectSlot` about 1697–1898 | Readiness means publication/recovery integrity. `CleanEpochSlotStatus` is `empty\|prepared\|pending_consumers\|ready\|closed\|descendant_unsupported`. A v2 or v3 valid publication can both be `ready`; the slot summary has `metadata.snapshotVersion`. Invalid publication/ledger currently throws `CampaignStoreError("invalid_record")`, which bubbles into launcher `blocked`. | Add one **native-mode reader-admission/status projection** using current authoritative format/epoch evidence. Distinguish compatible v3 from valid-but-unsupported v2 **before** gameplay admission. Avoid broad changes to the transaction/retained-artifact validator and preserve pending/closed and owner recovery semantics. |
| `apps/rpg-ui/src/game-shell/saveManager.ts` lines 575–605, 689–727 and 976–1076; `cleanEpochAccountStore.ts` `envelopeFromRaw` about 512 | Native snapshot `lineage.save_snapshot.v3`, envelope v8, v2 envelope v7 and older localStorage families already have validators; `readNativeFreshSaveSnapshot` currently combines incompatible and corrupt in one message. The v2 localStorage inspect flow uses `incompatible` and `corrupt` but is **not** the native-v3 clean-epoch launcher owner. | Reuse the existing validators and format discriminants. Never claim the release label `0.1.1-prealpha` itself determines Save compatibility, or introduce a parallel general format registry. A recognizable unsupported format is **not** corruption. Arbitrary JSON parse failure is **not evidence of an old format**. |
| `apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts` `list` about 1924; `cleanEpochAccountAdapter.ts` `selectSession` about 160 | The current account picker calls the **fully validated** clean-epoch account list. It does not enumerate unrelated old IndexedDB/localStorage families. A malformed account causes a blocked read, not a metadata-only legacy listing. | Separate current verified account pickability from **optional metadata-only** old account listing. Do not infer inaccessible-origin old accounts are visible, or rewrite full account validation to accept malformed identities as playable. Preserve `blocked_upgrade`/`unavailable` as Retry, not empty or corrupt. |
| `apps/rpg-ui/src/game-shell/cleanEpochAccountAdapter.ts` `deleteAccount` about 214–240; `cleanEpochAccountStore.ts` `transitionAccount` about 1454–1575; `LocalAccountAccessScreen.tsx` | Existing **current clean-epoch** delete requires a verified account, exact expected revision/generation and password, uses an idempotent deletion request ID, validates the complete account-owned row graph, atomically deletes its indexed families, retains a lifecycle tombstone, and verifies readback. The picker already has a deliberate delete UI for eligible accounts. | **Preserve this mature deletion owner.** Do not add a second writer to the same clean-epoch stores. A malformed/old-format account cannot be deleted via `transitionAccount` simply by bypassing its validator. Author a separate exactly scoped read/delete owner **only if** a safely discoverable legacy family and complete key graph are proven. Otherwise report `LEGACY_DELETE_SCOPE_UNAVAILABLE` as a nonblocking pre-alpha limitation. |

**Technical format distinction:** `snapshotVersion = lineage.save_snapshot.v3`; stored native envelope version **8**; clean-epoch database `lineage.campaigns.epoch1` schema version **7**; separate campaign store `lineage.campaigns` schema version **3**; `GAME_VERSION = 0.1.1-prealpha`. These are not interchangeable. The old-save no-migration product policy is [authoritative](../design/prealpha-save-format-compatibility-and-native-v3-cutover-policy-2026-11-09.md).

## 2. Focused status and action contract

| Observable case in selected **native-v3** mode | Required effect |
| --- | --- |
| Fully validated native v3 in a completed ready slot | Continue, subject to authoritative session head/revision/readback |
| Valid recognized v2 envelope/snapshot | **Incompatible**, Play disabled; retain bytes, allow only genuinely owned scoped deletion |
| Recognizable future/unknown format | **Unsupported / requires newer reader**, Play disabled; no downgrade or overwrite |
| Known v3 identity but invalid envelope, retained source, player or receipt | **Damaged/invalid**, no Play, no silent repair/reset; do not disguise corruption as v2 incompatibility |
| IndexedDB unavailable, upgrade blocked, transient I/O or quota | **Unavailable / Retry**; not empty or corrupt, and no destructive action |
| Valid owner-recognized pending consumers/recovery | Preserve pending/recovery state and invoke only the accepted recovery path before Continue |
| V2 default app, **before separately authorized activation** | Maintain its existing supported behavior; do not globally disable the v2 launcher in the shared data owners |

Use the canonical reader's format evidence and an explicit **mode-specific admission** boundary. If `listSlots` must inspect old actual bytes for status display, distinguish its **metadata-only classification** from a gameplay-ready decoded snapshot. Inspect carefully whether a single invalid slot should block the whole list; only alter that if a minimal safe presentation/provenance policy permits it. Avoid silently minting an empty new campaign over an incompatible slot.

## 3. Scope of old-account delete-only work

Current-origin storage can expose an existing clean-epoch `accounts` store and older localStorage key families. **Listing account IDs does not establish that every corresponding artifact/control/receipt can be safely deleted.** The existing `transitionAccount` protects a canonical clean-epoch account with verified credentials and an exact record graph. Do not weaken these checks for legacy UX. Prefer a narrow **metadata-only status projection** for safely readable legacy records. Implement account-specific deletion only with proven key ownership, atomicity/idempotence or equivalent safe bounded semantics, confirmation and readback while another v3 account remains intact. If unsafe, leave the delete action disabled and document the exact family/ownership blocker. Never claim browser storage access across different Site origins. Do not clear real old accounts or current selected Saves in these tests.

## 4. Minimal useful tests for Codex

Do **not** rerun all Checkpoint A 57 assertions or a monorepo matrix simply to satisfy a fixed count. Use a few **synthetic disposable** fixtures and run only the tests necessary for touched source:

1. Native-v3 mode: current v3 Save → ready/Play, with one already covered Save/restart witness reused if unchanged; recognized v2 → clear **incompatible** and no `ENTER_GAME` or writer call.
2. Native-v3 mode: malformed known-format publication → **damaged**; unsupported/unknown format → **unsupported**; storage unavailable/blocked → **Retry**, and all rejected cases leave original bytes and another valid slot unchanged.
3. Pending legitimate recovery stays distinguishable from damage; invoke existing focused recovery test **only if recovery path is modified**.
4. If implemented, one deliberate **same-origin** legacy delete and exact readback while an unrelated v3 account survives; if no safe legacy deletion owner is available, **document the non-gate limitation instead of creating a broad migration/deletion engine**.
5. One relevant app-local typecheck/build pass **only if** the modified UI/launcher compiles or its bundle is touched; avoid repetitive staging builds/hosted UI acceptance. One disposable desktop smoke check only if necessary to establish actual entry/Play blocking.

Primary existing focused examples to inspect and reuse, not an automatic suite mandate: `apps/rpg-ui/tests/native-selected-session-host.test.mjs`, `apps/rpg-ui/tests/native-session-item-actions.test.mjs`, `apps/rpg-ui/tests/native-selected-real-creator-stale-save-browser-qa.mjs`, plus existing root account/Save tests where the touched owners are exercised. Add the smallest direct `EpochApp`/launcher regression for the confirmed non-v3 admission gap.

## 5. Codex stopping and handoff

Work **only on the existing isolated branch**, after verifying a clean/understood worktree and fresh ref heads. This is **Checkpoint B implementation**, not a request to reimport the v3 stack. Correct the native-mode admission and status boundary; keep v2 default route and current-v3 transactional protection. The user has explicitly waived playable **old development** Save migration and cosmetic/release-completeness testing; avoid creating those gates.

If the reader/status work is coherent but legacy deletion cannot be safely scoped, report that as a bounded **future capability limitation**, with exact evidence, rather than holding up the whole native development integration. If any changed owner permits loss, duplication, cross-account mixing, unsupported Save Play, destructive read failure or newly broken current gameplay/build, **hold** and fix the smallest actual regression.

Record source/branch SHA, precise changed owners, commands and outcomes, a compact classification matrix, an unchanged rejected-byte witness and next exact integration decision. Publish only branch-local authorized code and focused evidence; preserve current `master`, original v3 PRs, version, default app, Sites, real user storage and `HOLD_SELECTED_ATOMIC_ACTIVATION`. No PR merge, default activation, deployment or Site deletion is authorized by this preflight.
