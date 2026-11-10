# Native-v3 pre-admission pending recovery repair

Date: 2026-11-10. Run class: unversioned support. Base: fetched `origin/master` `6fb1f233b47b7e9e5e805c1a4f21b5f49b4ce424`. Branch: `codex/native-v3-pre-admission-recovery-2026-11-10`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. `HOLD_SELECTED_ATOMIC_ACTIVATION` remains.

## Boundary and change

`EpochApp` formerly resumed every `pending_consumers` slot, then any pending terminal settlement and address closure, before native-format admission. A mixed account could therefore write v2 recovery while merely opening the native candidate. `recoverPendingInventory` now checks retained first/descendant source and published snapshot bytes before resuming, and skips incompatible v2 pending sources. The terminal adapter filters pending settlement by its validated source/publication format; the account store applies the same filter to completed terminal address closure. The default v2 call omits the filter. Malformed, mismatched or unavailable reads fail before the corresponding recovery write. A retained v2 pending slot remains pending and cannot authorize Play; an independent v3 ready slot remains visible. The native first adapter still rejects a prepared v2 attempt before publication.

## Validation and limits

- Synthetic same-origin local browser at `/native-selected-session-qa.html?pre-admission`: PASS. Real IndexedDB owner seeded one v3 ready slot, one v2 pending first publication and one prepared v2 slot. Two native inventory passes left the v2 recovery, v3 loaded slot and account profile JSON readbacks byte-equal. Native first resume refused the prepared v2 source. An injected unavailable read left those records byte-equal. A separate synthetic native account's pending first publication completed to ready; its retained envelope, account, slot and recovery receipts were identical after a second inventory pass. The browser used a disposable local origin and synthetic accounts only.
- Focused Node tests: `native-pre-admission-recovery`, `native-selected-session-host`, `native-selected-terminal-host`: 14/14 pass. The new terminal test confirms a v2 pending source is not settled by native-mode resume. These tests were added after the source edit; a red-before-green run was not recorded.
- `npm run typecheck:node` and direct `npx vite build` pass. Broad UI `npm run typecheck` reports 115 diagnostics on both this branch and clean master; changed-file diagnostics: zero. `git diff --check` passes before commit.
- A real IndexedDB v2 completed-terminal address-closure fixture and independent reviewer rerun remain open. The terminal closure filter is source-reviewed and its pending-settlement neighbor is unit tested, but this record does not claim full selected-client acceptance, activation readiness, hosted behavior or protected Save migration.

## Lifecycle

No source merge, default-v3 activation, Site action, PR lifecycle action, real account/Save operation or Game-version change. Existing native-v3, historical UI, protected and held branches/PRs retain their dispositions. Exact review trigger: independent source review and focused same-origin terminal closure/retry proof on this branch before a separate source-merge or default-activation decision.
