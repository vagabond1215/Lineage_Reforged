# Native v3 selected React Save rollback and recovery gate — 2026-11-02

Source: live `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; exact [draft #62](https://github.com/vagabond1215/Lineage_Reforged/pull/62) `9a878fe0a501d36510735f52e4852b460726bb1f`; isolated [draft #63](https://github.com/vagabond1215/Lineage_Reforged/pull/63) `codex/native-v3-selected-fault-recovery`, test commit `85406182d370c625a8d7a2c8832a58ac94278ae6`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. **HOLD_SELECTED_ATOMIC_ACTIVATION.**

## Selected failure matrix

| Boundary | Fresh selected evidence | Retained result |
| --- | --- | --- |
| Before publication writes | Disposable real `EpochApp` creator, native-v3 candidate, Unequip Short Bow, React Save; account store's `beforeWrite` callback aborts the actual publication transaction once. | The UI displays the campaign-data error and Retry control. Slot head, source/destination address, account revision and gear remain unchanged; no pending descendant. |
| After transaction writes, before commit | Same independent creator/caller with `afterWrite` abort on the actual transaction. | All writes roll back. The same retained source and absence of pending recovery are read back. |
| Retry after either abort | Actual UI `Retry campaign data` reopens the account, Continue reloads the original source, then Unequip and React Save are repeated. | Exactly one accepted account revision/new publication; Short Bow instance ID, durability and bag location retained. A further restart reads the same publication and physical graph. |
| After durable commit, lost acknowledgement | #62's real React Save regression, freshly rerun here. | UI failure followed by restart reads one committed publication and revision with exact bow state. |
| Cross-slot, mixed-format and old-save rejection | #62/#61 real-creator cross-slot and publication-fault browser scripts, freshly rerun here. | Quick Save v3 and retained slot-2 v2 coexist; native admission refuses the actual v2 slot without deleting its record. Host-level rollback, stale/duplicate, changed-destination and old-source retry remain green. |

The new fault injection is local browser QA only: a one-shot wrapper around the existing `CleanEpochAccountStore.publishDescendant` sets its established transaction callback during that publication, then restores it. It does not add a Save owner, alter account data outside the disposable browser profile, or change production source. Before/after tests use the same-slot React Save destination, so the source and destination address are the same retained slot. Cross-slot faults are covered by the freshly rerun host test; the real React cross-slot fault remains a separate optional acceptance row.

## Validation and disposition

New browser modes **2/2** pass; freshly rerun adjacent real-creator browser scripts **3/3** pass. UI Node **101/101**; focused root achievement/Legacy/gear/Save/survey **85/85**; Node UI typecheck; content lint **72 files**; direct complete-asset Vite build **284 client modules**; `node --check` and diff checks pass. Exact #62 parent versus child broad TypeScript: UI **115/115** with identical hash `3FE565D4…`; normalized workspace **763/763** with identical hash `CA5CD156…`, zero new diagnostics. The combined `tsc && vite` script remains blocked by inherited broad diagnostics. The six-life Ration acquisition/Use regression from #62 was not repeated because no production owner changed; its evidence remains inherited support.

Applied FP-001 (real React caller), FP-002 (green QA does not accept activation), FP-003 (visible Retry exits blocking posture), FP-005 (caller-state loss, UI Retry and restart), FP-008/009 (exact branch/head), FP-011/013 (single owner and physical gear conservation), FP-016 (publication placement and rollback). No production implementation, save schema, item content, gameplay rule, account reset, PR merge, Site deployment or Game-version change occurred.

No authorized authenticated **native-v3** selected environment was identified: the deployed selected game remains v2 and the native candidate is QA-only. Existing authorization to use a signed-in test account does not create a deployed native-v3 candidate, and this pass did not deploy one. Default creator stays v2, native production review stays read-only and pending defeat retains its approved latent owner-tested disposition. The next gate is an independent integration-readiness review and authorized authenticated selected-client route; do not mark atomic activation accepted from these disposable tests.
