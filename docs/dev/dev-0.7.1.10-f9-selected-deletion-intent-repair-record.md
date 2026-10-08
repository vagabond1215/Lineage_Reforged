# DEV-0.7.1.10 — F9 Selected Deletion Intent Repair

Date: 2026-10-08. Support suffix of planned `DEV-0.7.1`. Starting clean fetched local and hosted `master`: `85034c6d5418bb956dc7adcfd979a81a52be6b5c`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted DEV `DEV-0.7.0`. Development impact `supports_current_band`; Game-version impact `none`.

## Reproduction and boundary

Before production edits, the native mounted `EpochApp` probe `/g9-parent-selected-20261007.html?mode=changed-selection` reproduced F9. After a delete committed and its acknowledgement was lost, picker selection moved to another account and back. A second click claimed the old tombstone as success (`targetPickerPresent=false; staleAlert=false`), although the target tombstone and other account's retained bytes did not change. This was a false selected-action success, not a second deletion.

The repair scopes the retained request ID to an exact selected delete intent, source (`picker` or `settings`), account ID, observed revision, lifecycle generation and password. Picker selection, entering Create Account, sign-in submission and password edits invalidate that intent. Settings choosing an action, password edits and Cancel invalidate it; remounting either component mints a new intent. The parent clears its retained request on invalidation. A submitted action with an uncertain acknowledgement and unchanged intent reuses its exact request ID. Changing away and back creates a different request, even if all field values return to their original values. The v7 owner, adapter, version-2 tombstone contract and version-1 compatibility were not changed.

## Repair verification

All browser probes used synthetic accounts and fault injection in native Chromium against the local Vite server. The committed `g9-parent-selected-20261007` independent-audit probe was extended **after** the pre-edit reproduction and is now repair regression evidence only. Its 15 selected-App modes passed: `external-picker`, `external-settings`, `stale-reset`, `stale-revision`, `wrong-password`, `lost-picker`, `lost-settings`, `changed-password`, `changed-selection`, `toggle-selection`, `create-form`, `changed-password-return`, `settings-cancel`, `settings-switch-action`, `other-account`. The changed-selection mode now shows stale/unavailable rather than success and retains target tombstone and other-account bytes. The lost-picker and lost-settings modes prove unchanged exact post-commit acknowledgement retry. The external modes cover a competing pre-submit delete; the other-account mode guards against mutation of a second account.

Native owner pages: `campaign-clean-epoch-normal-defeat-qa.html` **8/8**, `campaign-clean-epoch-legacy-qa.html` **6/6**, `campaign-clean-epoch-terminal-qa.html` **14/14**, `campaign-clean-epoch-slot-generation-qa.html` **13/13**, `campaign-clean-epoch-first-campaign-qa.html` **5/5**, `campaign-clean-epoch-descendant-adapter-qa.html` **16/16**, `campaign-clean-epoch-witnessed-descendant-qa.html` **11/11**, and `campaign-clean-epoch-account-lifecycle-qa.html` **90/90**; total **163/163**. G9F covers competing request, exact restart/two-owner retry, malformed and legacy tombstones, abort/quota writes, and no partial or newer-account mutation. The retained selected-App page `/campaign-clean-epoch-account-lifecycle-selected-app-qa.html?probe=` passed all **9/9** modes: `f8-picker`, `f8-settings`, `f7`, `f7-settings`, `changed-request`, `f6`, `f6-revision`, `fresh`, `wrong-password`.

Exact command and result ledger:

| Command or read | Result |
| --- | --- |
| `npm --prefix apps/rpg-ui run dev -- --host 127.0.0.1 --port 5173` then native Chromium read of each `#result`/`#qa-result` page above | 15/15 repair modes; 163/163 owner assertions; 9/9 retained selected-App modes |
| `$files=rg --files tests/unit \| rg '(campaign\|soundings\|survey)'; node --test $files` | 172 tests passed, zero failed |
| `npm run typecheck:ui:node` | pass |
| `npm run typecheck:ui` | 137 existing diagnostics; zero in changed paths |
| `./node_modules/.bin/vite.cmd build` from `apps/rpg-ui` | pass |
| `git diff --check` | pass |

## Disposition

**F9_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD.** This repair suite does not decide `G9_PARENT_ACCEPTED`. The next support run must derive a new full G9A–F parent audit from accepted authority on the pushed, read-back repair head. It must not use this repair probe, retained G9F suite, or this record as parent acceptance evidence. No G10, deployment, planned-primary or Game-version change.

Fresh fetch/prune at the inspected source found two local/six hosted refs including `master`; repository-scoped GitHub search found zero open PRs. Readiness and prompt-integrity refs remain `PROTECTED_REFERENCE`; administration, creator planning and creator implementation remain `HOLD_NAMED_CONSUMER` with their previously named triggers. Merge bases, unique commits and paths were inspected. F9 consumed none, so no merge, rebase, integration, deletion, PR or disposition change was due. Applicable FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019: actual selected caller, independent parent gate, exact durable request/retry and contention, retained version-2 contract, graph preflight, restart/readback, malformed receipt, source/branch identity, synthetic evidence limit and newer-account stability. Suggested repair commit: `fix(ui): scope deletion retry to selected intent`.
