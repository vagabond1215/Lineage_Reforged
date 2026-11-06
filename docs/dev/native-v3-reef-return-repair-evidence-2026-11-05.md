# Native-v3 Ashen Reef return repair evidence

Date: 2026-11-05. Source: exact hosted-evidence child `15329022285ba3b5a63d27549cdfd0c191eee460`, whose application ancestor is draft #68 `658111eff37a21fb02cee8831251a4f28b36ef3c`. Isolated branch `codex/native-v3-reef-return-repair`. Master inspected at `a596112acf3945f2bf7c625e943f2511d12aa710`. Drafts #64–#68 retained unchanged.

## Failure and correction

The new real-creator test first reached four retained survey stages and the accepted Reef-to-Starfall travel-owner result, then failed at `isNativeTargetCampaignSnapshot(ownerResult.snapshot) === false`. The last survey result's live clock/body/resource equality was the first rejecting boundary. The selected wrapper returned `invalid_native_result`, leaving the source session unchanged. This is an admission defect, not a travel access or disabled-button defect.

`packages/engines/game-engine/src/native-survey-ledger.ts` now validates historical worn material from the retained witness and applies exact stage-state checks only while the live snapshot is still at that stage. Later descendants retain ordered ledger and monotonic clock/play-tick checks. Existing version-8 store checks anchor descendants to the exact retained stage and replay its predecessor chain. `EpochApp` already routes rejected native actions through a warning notice; no new UI error owner was added.

## Verification

- Red-before-green `apps/rpg-ui/tests/native-reef-return.test.mjs`: authentic Harbormast native creator, selected passenger, quest acceptance, Reef travel, four owner shifts with publication/readback between each, selected return and post-return artifact readback. The return assertion failed before the repair and passes after it. Repeating the stale command leaves the session unchanged; forged fourth-stage material and backward clock reject; native gear identity, condition/location graph, campaign identity, survey ledger and owner-derived body/resources remain conserved.
- Focused UI owner suite: **19/19** (`native-reef-return`, selected gameplay host, Harbormast passage and survey source caller).
- Adjacent v2 Soundings return/turn-in/persistence: **22/22**.
- Disposable local browser: real `EpochApp` creator controls choose Harbormast/Hunter, board the passenger route, accept Soundings, travel Reef, Save each of four shifts, restart the same campaign, return to Starfall, Save and restart again. Pass. The script checks account revision and exact publication identity after the return Save, plus physical gear and survey count. This is synthetic local registration and **not authenticated staging acceptance**. Earlier run failures were QA-script control-label and asynchronous readback polling mistakes; both were corrected before the passing run.
- Node UI typecheck: pass. Content lint: 72 files pass. Direct v2 Vite build: 285 client modules pass. Direct native staging Vite build: 284 modules pass. Broad UI TypeScript: exact parent **115** diagnostics, child **115**, zero normalized delta. `git diff --check`: pass.

## Unpublished artifact

The complete optimized staging output has **36 files / 31,678,940 bytes**. Per-file manifest: [native-v3-reef-return-artifact-manifest-2026-11-05.txt](native-v3-reef-return-artifact-manifest-2026-11-05.txt), SHA-256 `699e930e056f9d44b2ac234164aa3655356cdd8a8bb0e0c722007d55358685a3`. Measured local tar: **31,709,184 bytes**, SHA-256 `10d2e65cfe1fe5604aaf32985e1bb43b9195597e8c97f53c304ce831a509eb1e`. Compared with PR #68's locally verified 36-file manifest `621201b51ffc32f3fb145c21575437231edec4385f4793cae93840d0a28a60a9`: only the bundle JS and referencing `index.html` differ; all other **34 files** are byte-identical. The 128 creator source PNGs and pinned GitHub source are unchanged. No QA entrypoint or synthetic account is in the package.

The artifact is unapproved and unpublished. The private staging Site remains on verified maintenance v1; production v2 Site version 16 and accounts are untouched. No protected branch or Game-version change. `HOLD_STAGING_PUBLICATION` / `HOLD_SELECTED_ATOMIC_ACTIVATION` remain. The next blocker is native-v3 Soundings turn-in ownership, followed by a newly reviewed exact combined artifact and separate private-publication approval. Remaining selected Ration Use, combat/defeat, retirement, cross-slot, failure/retry, responsive/keyboard and served-byte gates also remain.
