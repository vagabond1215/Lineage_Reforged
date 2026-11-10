# Native-v3 Checkpoint B admission-before-recovery result

Date: 2026-11-09. Isolated branch source `5c27d3b884968ec3c59b55d919bb3e6131238b62`; master `0c0b5c3022fffd1e0525a77da9ed8381ed47e10a`. The master delta since the integration base `0522161f` contains 12 documentation paths and zero runtime paths. The newly authored Core-entry/Hardcore direction is preserved on master and is outside this Save boundary.

**Disposition: `V3_FOUNDATION_READY_FOR_INDEPENDENT_MERGE_REVIEW; PER_SLOT_DAMAGE_UX_DEFERRED; LEGACY_DELETE_SCOPE_UNAVAILABLE`.** This is a branch source review candidate, not merge, default activation, deployment or selected-client acceptance.

The `EpochApp` Load Game command now calls `admitBeforeRecovery` immediately after the authoritative loaded slot read and before `recoverLoaded`. In native candidate mode a non-v3 snapshot throws before the legacy Normal-Stakes recovery writer can run; accepted v3 returns unchanged. The v2 default calls its existing recovery path. The later `enter` guard remains. The same ordering is used by the Characters activation route. No Save/store validator or writer changed.

| Case | Executed/inspected result |
| --- | --- |
| Valid native v3 | Native admission passes; existing Checkpoint A creator/Save/restart owner tests remain the relevant positive witness. |
| Pending valid v2 in native mode | New focused regression rejects before recovery callback; no mutation callback, no enter and unchanged synthetic source. |
| Pending valid v2 in v2 default | Existing recovery callback remains reachable; new focused test verifies invocation. |
| Known malformed account/slot graph | `listSlots` is read-only and fails closed through `invalid_record`; no per-slot damaged label is inferred from shared graph failure. |
| Storage unavailable | Launcher returns `unavailable` separately; no empty-slot or corrupt substitution. |
| Legacy account-specific deletion | Held: no proven complete old key-family graph; existing clean-epoch credentialed deletion owner remains untouched. |

The focused native host suite passed **8/8**, including the new ordering and blocked-read witnesses. `npm run typecheck:node` and the direct default Vite production build passed. Build reported existing nonblocking dynamic-import and chunk-size warnings. No broad suite, staging build, hosted browser, real account/Save, or cosmetic viewport campaign was run in this pass. The read-failure test uses a synthetic owner stub and proves the launcher result and no invoked writer; it does not constitute a raw IndexedDB corruption recovery test. Existing Checkpoint A owner test evidence remains 57/57 and was not rerun.

Remaining independent review: reconcile the 12 new master-only docs against branch coordination before any merge decision, review the full combined source diff and current v3 Save/restart on disposable local data, and decide merge/default activation separately. Per-slot Damaged attribution is deferred while the authoritative graph cannot assign a shared read failure to one slot. `HOLD_SELECTED_ATOMIC_ACTIVATION` remains. No original PR or protected branch lifecycle action occurred.
