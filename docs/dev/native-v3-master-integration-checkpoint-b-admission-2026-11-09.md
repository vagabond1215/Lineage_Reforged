# Native-v3 Checkpoint B — bounded admission repair

Date: 2026-11-09. Branch `codex/native-v3-master-integration-2026-11-09`, resumed from connector-prepared `bf5e202124d078679c5e7a96859e358f6b1bbd91`. Master stayed `0522161fb955a9e3128585766723b7f3fc04c4a8`. Classification: **`V3_SAVE_CLASSIFICATION_BLOCKED`** for complete Checkpoint B; the native-mode unsupported Save Play gap is repaired on this branch.

The native candidate projects a fully validated ready v3 snapshot as Play-ready, a ready v2 snapshot as `incompatible`, and an otherwise validated unknown/future snapshot version as `unsupported`. It preserves source slot objects and leaves v2 default behavior unchanged. The Main Menu does not activate incompatible/unsupported rows; Load Game shows the reason and disables Load. `EpochApp.enter` rejects a non-v3 selected snapshot before `ENTER_GAME`, so a stale menu cannot bypass the presentation check. Current clean-epoch scoped slot deletion remains the only writer; no alternate deletion owner was added.

| State | Current bounded result | Remaining gate |
| --- | --- | --- |
| Valid v3 ready | Play through existing owner | Selected independent review remains. |
| Valid v2 ready | Incompatible, Play blocked, bytes unchanged | Existing scoped Load Game deletion path only; no automatic deletion. |
| Valid unknown/future snapshot version | Unsupported, Play blocked, bytes unchanged | Format-specific explanation can improve when authoritative metadata exists. |
| Known-format malformed artifact/account | Owner `invalid_record` blocks inventory, no Play | A safe owner-supplied per-slot damaged provenance is needed before labeling one slot Damaged. |
| Storage unavailable/blocked | Existing error blocks inventory, no Play | Preserve Retry semantics; do not turn it into empty/corrupt. |
| Pending consumers/recovery | Existing owner state retained | No recovery code changed. |

The owner currently validates the complete account/slot graph in `listSlots`; a malformed record can throw `invalid_record` before a per-slot summary exists. Labeling that as a particular damaged Save would guess its owner and could hide a separate account or retained-source fault. Existing old localStorage key families lack a proven complete account-owned key graph for atomic same-origin delete, so `LEGACY_DELETE_SCOPE_UNAVAILABLE`; no legacy account-specific delete writer or account name inference was added. These are pre-alpha capability limits, not permission to load or overwrite rejected data.

Focused native launcher/top-bar tests passed 7/7, including a new v3/v2/future projection and unchanged input witness. Node UI typecheck and direct default Vite build passed. Broad UI TypeScript reported 115 diagnostics on the branch and 115 on current master; exact diagnostic equivalence was not asserted. No staging build, hosted selection, real account/Save access, Game-version change, PR lifecycle action, or master merge occurred. `HOLD_SELECTED_ATOMIC_ACTIVATION` remains.

Next single package: add a bounded authoritative read result that preserves per-slot format/integrity provenance and distinguishes recognized malformed current-format data from unsupported format and storage failure without weakening graph validation; then test synthetic neighboring slot byte preservation. Reassess metadata-only legacy listing separately only after an exact same-origin key-family ownership proof. Independent integration review follows that package.
