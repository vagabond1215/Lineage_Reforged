# DEV-0.7.1.6 — G9 History, Deletion Retry And Picker CAS Repair

Date: 2026-10-07. Source: freshly fetched clean `master`/`origin/master` `36590ae36964327c7c2d12a706bec956ae4c3866`. Support suffix of planned `DEV-0.7.1`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Development impact `supports_current_band`; Game-version impact `none`.

## Disposition

**F4_F7_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD.** This is a bounded repair check, not `G9_PARENT_ACCEPTED`. The separate parent audit must start from the pushed hosted repair head and independently exercise G9A–F, including partial graph corruption and selected callers. G10 implementation, deployment, planned-primary and Game-version acceptance remain held.

## Reproduction and patch

The prior independent audit's F4/F5 cases were reproduced from coherent synthetic published campaigns; F4 reset/delete accepted a ghost run slot and a deleted run with a live address, while F5's old receipt read and exact retry failed after same-campaign reoccupation. Before changing selected callers, the actual `EpochApp` picker was driven through a disposable synthetic browser probe. F6: after a second owner reset the displayed generation-1 account to generation 2, the stale picker deleted generation 2. F7: after an injected post-commit delete acknowledgement loss, an exact retry entered the App's blocked screen although the delete tombstone existed.

- `validateDestructiveGraph` now requires every account run slot to resolve to the same campaign/character's live address, and checks active/deleted/archived outcome against live addresses and closed control. The existing address-to-run check is limited to the exact pending publication, preserving pending first/descendant/terminal states. All checks occur in the reset/delete transaction before its first write.
- Historical deletion receipt reading and exact owner retry now recognize a published, structurally matching same-campaign newer slot generation. The old receipt stays keyed by its deleted generation. A changed request remains a conflict; the exact retry returns the old receipt without writing or treating the newer occupant as the old target.
- The epoch account list carries the revision and lifecycle generation observed when the picker was populated. Picker delete passes those values to the adapter's CAS; it no longer rereads and adopts a newer account. The same retained request reaches a tombstone-backed retry after a lost acknowledgement. Settings delete skips only the preliminary session validation on retry; the adapter/owner still enforce the captured revision, generation, credential on a live account, and exact tombstone identity on an absent one.

## Verification

The native G9F lifecycle matrix passes **86/86**: paired F4 ghost-slot and deleted-live-run reset/delete corruptions reject `invalid_record` before `beforeWrite`, preserve target and other 12-family bytes, account revision/generation and absent lifecycle receipt; coherent, prepared, pending, multi-address, deleted/reused and zero-address terminal controls commit. The historical same-campaign receipt is byte-equivalent after restart/reoccupation, exact retry returns `same_source_retry` with unchanged newer rows, changed retry rejects, and a malformed old receipt fails closed. Existing abort/quota at every eight-write transition, two-owner contention, restart and lost-readback controls pass.

The selected-App synthetic browser matrix passes **5/5**: stale picker CAS, picker lost-delete acknowledgement retry, Settings lost-delete acknowledgement retry, fresh picker deletion, and wrong-password rejection. F6's observed generation 1 survives as generation 2 with `Account changed before deletion.`; F7 picker and Settings return to Account Login after matching tombstone proof, without a blocked screen. These are synthetic local-browser fixtures, not evidence of production-account reachability.

Adjacent native suites: G9B Normal defeat **8/8**, G9C Legacy **6/6**, G9D terminal **14/14**, G9E slot generation **13/13**, first campaign **5/5**, descendant adapter **16/16**, witnessed descendant **11/11**. Focused campaign/Soundings/survey Node **174/174**; Node UI-config typecheck and app-local Vite build pass. The build needed a permission-adjusted retry to replace ignored generated hosting output. Broad UI typecheck remains nonzero with **137 diagnostics**, none in changed production paths. `git diff --check` passes.

Applicable guardrails: FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018/019. FP-019 is satisfied by paired prewrite corruption and valid graph controls; FP-018 by observed picker CAS, exact tombstone retry, two-owner and restart evidence. The repair suite does not discharge independent parent acceptance.

Fresh branch/PR inventory at source: two local/six hosted refs including `master`, zero open PRs. Readiness and prompt-integrity refs stay `PROTECTED_REFERENCE`; administration, creator planning and creator implementation stay `HOLD_NAMED_CONSUMER` with register triggers unchanged. No branch integration, rebase, deletion or disposition change is due. No schema/dependency, ordinary owner, Game version, deployment or tracked generated output changed.
