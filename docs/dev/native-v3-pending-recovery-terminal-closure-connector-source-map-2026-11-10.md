# Native-v3 pending-recovery independent review: terminal closure fixture source map

Date: 2026-11-10. Repository: `vagabond1215/Lineage_Reforged`.
Inspected `master` `6fb1f233b47b7e9e5e805c1a4f21b5f49b4ce424` and isolated repair branch `22a5bc4b80d34cbd6640a6b86774255ad241ac38`.
**Classification: `CONNECTOR_READ_ONLY_SOURCE_MAP; INDEPENDENT_EXECUTABLE_REVIEW_PENDING`.**
This document is a Connector-prepared orientation aid only. No tests, browser probes, local checkout or source fixes were executed by this pass, and it does **not** judge the repair independently accepted. Recheck branch/master delta before relying on exact lines or identifiers.

## Live branch and exact scope

The repair branch `codex/native-v3-pre-admission-recovery-2026-11-10` is **one commit ahead, zero behind master**, adding ten changed files. The next branch-local [active Codex prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/codex/native-v3-pre-admission-recovery-2026-11-10/docs/dev/current-codex-prompt.md) already requests independent verification and a real-owner completed-terminal closure/retry test. Do not edit the branch in a parallel Connector pass or advance its active prompt/output/handoff/register from master. A future source merge, default-v3 selection, Site publication and PR lifecycle change each remain held decisions.

## Verified source/caller map

| Source | Verified role | Check at independent review |
| --- | --- | --- |
| `apps/rpg-ui/src/EpochApp.tsx` `recoverPendingInventory` | Native-mode retained first/descendant snapshot/version check precedes resume. Invokes version-filtered terminal resume and address closure. Keeps incompatible pending slots pending while allowing independently ready slots. | Check the real `EpochApp.initialize` and `showMenu/load` callers; no alternate inventory writer bypass; v2 default with omitted filter stays as before. |
| `apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts` `retainedRecoverySnapshotVersion` | Deserializes source and envelope payload, rejects format disagreement; `envelopeFromRaw` validates envelope shape. | Verify identity, envelope version, retained artifact, current head and receipt evidence are obtained from owner, not guessed from slot metadata alone; malformed records fail closed before mutations. |
| `cleanEpochAccountStore.ts` `readTerminalRecovery` | Read-only validation joins terminal record to exact predecessor/terminal artifacts, closed control, current address or closure receipts and account state. | Use this validated record for both pending settlement and completed closure tests. |
| `cleanEpochTerminalAdapter.ts` `resumePending(accountId, requiredSnapshotVersion?)` | Gates settlement completion by validated terminal snapshot format. | An incompatible v2 pending settlement remains unchanged in native mode; lawful v3 pending settlement completes exactly once. |
| `cleanEpochAccountStore.ts` `closePendingTerminalAddressesForAccount(accountId, requiredSnapshotVersion?)` | Gates completed-but-unclosed terminal address writes by source/published format. | Old v2 settled terminal remains closed-but-unfinalized under native inventory; lawful v3 closure commits exact receipts once; malformed source never closes. |

The existing `native-pre-admission-recovery.test.mjs` tests first-campaign mixed format, pending-v3 retry, malformed/unavailable reads and a **stubbed** terminal settlement owner. The branch's [focused implementation record](https://github.com/vagabond1215/Lineage_Reforged/blob/codex/native-v3-pre-admission-recovery-2026-11-10/docs/dev/native-v3-pre-admission-pending-recovery-repair-2026-11-10.md) also reports a disposable real-IDB mixed-account first-publication browser pass. Neither covers real-IDB *completed terminal closure under the new format filter*.

## Reuse existing concrete browser/owner fixtures; do not build another general harness

- `apps/rpg-ui/g10d2-terminal-closure-qa.ts`, especially `prepare/clone/closure/faultRow` and the `closePendingTerminalAddressesForAccount` assertions near lines 80–93. Existing code makes isolated named IndexedDB clones, retains archive family hashes, probes abort/quota and ensures **1 then 0** closure retries with two deletion receipts. **Caution:** its `prepare` copies an existing owner archive from the current origin. Do **not** run that preexisting entry against any real-account origin. Use only a newly created disposable browser origin/profile with synthetic accounts, or replace its input with a freshly generated synthetic v2/v3 fixture.
- `apps/rpg-ui/campaign-clean-epoch-terminal-qa.ts` provides the `setup` pattern for independent named IndexedDB database, synthetic account/credential, creator and terminal request. It runs historical v2 by default. Adapt a minimal native-v3 setup via the already selected `CleanEpochFirstCampaignAdapter(owner, 'native_v3')` rather than casting a v2 snapshot into v3.
- `apps/rpg-ui/g9-completion-terminal-20261008.ts` near lines 195–267 exercises two-address closure, exact same-source retry, abort/quota rollback, pending settlement ordering and neighboring-account isolation. Treat as reusable older owner fixture, **not** current native-v3 acceptance.
- `apps/rpg-ui/tests/native-selected-real-creator-terminal-browser-qa.mjs` covers genuine native selected UI retirement/restart, but only ordinary retirement, not the new completed-settlement/version-filter branch.
- `apps/rpg-ui/src/nativeSelectedSessionQa.tsx` now has the isolated `?pre-admission` route. The focused independent review can extend a small fixture here if necessary, with no real account/profile or hosted Site.

## Smallest missing proof matrix

| Case | Expected readback |
| --- | --- |
| Validated v2 `settlement_completed` without `addressClosure`, then native inventory `requiredSnapshotVersion='lineage.save_snapshot.v3'` | No closure transaction; terminal artifact and retained v2 recovery bytes unchanged; no fabricated receipt; independently ready v3 slot remains usable where shared owner permits. |
| Validated v3 `settlement_completed` without `addressClosure`, native inventory twice | First pass closes exact retained address(es) once, correct account revision and deletion receipts; second pass is no-op; restarted readback matches same terminal source and receipt identity. |
| Validated v2 `accepted_pending_settlement` and v3 required format | No account-profile settlement, no terminal advance or closure. |
| Corrupted or cross-format terminal source/envelope/receipt | `invalid_record`/blocked, no derived valid format and no write; unrelated healthy account data remains byte-stable. |
| Incompatible prepared v2 first attempt and pending v2 descendant | Neither can be published/completed via native recovery; healthy independent v3 ready source can still Load if the existing graph owner authorizes it. |

The source-level `readPendingTerminalForAccount` currently fails closed if an account contains more than one pending terminal settlement. Do not bypass this shared account invariant to satisfy a mixed-slot test. Distinguish **safe refusal with exact owner explanation** from a promise that every malformed/shared-recovery account can offer independent slot availability.

## Local-review boundary

Codex should independently reproduce the real owner proof in an authenticated checkout on the isolated branch, inspect the complete branch delta and any new changes, run only directly affected focused tests, Node UI typecheck, direct Vite build and diff checks, and distinguish inherited broad UI diagnostics from new ones. A test passing in an invented mock owner is not equivalent to current-IDB closure/rollback proof. Continue to distinguish synthetic local evidence from hosted selected-client acceptance.

**No repository implementation, active coordination, original PR, Site, account/Save, Game version (`0.1.1-prealpha`) or activation operation occurred in this connector pass.** Existing historical PR evidence remains retained under the [separate preservation audit](native-v3-post-source-merge-pr63-73-retention-audit-2026-11-10.md).
