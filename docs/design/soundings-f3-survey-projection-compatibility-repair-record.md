# Soundings F3 Survey Projection Compatibility Repair Record

Date: 2026-09-25. Run: **Soundings Survey Projection Repair Compatibility Repair**. Result: **IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE**.

Unversioned bounded repair, package S; parent development milestone not applicable; development milestone impact `supports_current_band`; game-version impact `none`. Game `0.1.0-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, band `DEV-0.7.x` unchanged.

## Source And Repair

Clean start `232379e58675d3b9fb97c56c11bbf789cdc36976`; fetched/fast-forwarded seven docs-only commits to source `413c4abfba65ae4cc8b60c0beb7799fc01f6eeae`. Verified complete post-runtime delta from `0383cedc99a4c3d5e2c9b47cf0665683720aef9e` was docs/evidence only. Reused all five September 25 F3 packets, including `soundings-f3-survey-admission-retention-sufficiency-decision.md`: RETENTION_SUFFICIENT_BOUNDED_REPAIR_AUTHORIZED.

Final production/test commit: `7c8c980d01892b0f673afc5a5940aec33ad2d7a2`. Validation below exercised that exact production/test tree. Later coordination publication is docs only; completion report supplies exact pushed/live identity and hosted readback.

F3 reproduced before editing: independent B2 projections probe passed eight cases then rejected post-completion survey Chronicle repair with projection_invalid, while pre-completion control succeeded. No probe was changed.

`packages/engines/game-engine/src/soundings-turn-in-authority.ts` now recovers the exact admission survey graph by testing every prefix of the current projectionRepairs ledger against the frozen survey fingerprint, rejecting no match or nonunique match. All other survey fields stay unchanged. That recovered graph is used for historical source reconstruction and the original full snapshot fingerprint. The live graph keeps its full later repair history. Tick values do not define the boundary.

`campaign-rules.ts` exports the existing safe survey validator so the Soundings seam can validate the entire current survey graph, including its suffix, without calling the parent campaign validator recursively. This is necessary because the provenance verifier can call Soundings validation directly. Validation logic is reused unchanged; the existing JS export-star bridge exposes it. No new persistence field, witness version, migration, dependency, reward, UI or content change. Original intent/witness facts are never rewritten.

## Finding-To-Test Matrix

New `tests/unit/soundings-survey-repair-compatibility.test.mjs` has 18 focused cases:

- Nonempty pre-turn-in Chronicle/notification repair prefix; same-tick later repairs, repeated repair and restart preserve original Soundings ledger, payment and witness.
- Both survey/Soundings projection repair orders; actual non-head descendant fork and restarted history.
- Altered, removed, reordered or inserted pre-admission entries; malformed/conflicting suffix; request/occurrence/result/receipt/correction drift all reject before state/storage effects, including direct provenance verification.
- Chronicle/notification capacity fixtures prove accepted survey retention_expired records preserve opaque rows and remain idempotent. Full Soundings repair refusal preserves state/storage; later ordinary travel and save/restart preserve original witness/payment authority.

Capacity and damaged projections are explicitly labeled fixtures, not claims about UI reachability. Initial focused test failures identified test assumptions: notification insertion fixture was already full; rejected caller can return null result; survey and Soundings notification caps differ. Fixtures/assertions were corrected to the accepted contracts, without production changes. Final results supersede that intermediate run.

## Validation

- Exact 16-file command in `soundings-admission-witness-repair-implementation-record.md`: **165/165 pass**, zero failed/cancelled/skipped/todo, 105.186 seconds. Includes adjacent survey command/persistence suites.
- `node --test tests/unit/soundings-survey-repair-compatibility.test.mjs`: **18/18 pass**. Combined baseline plus focused coverage: 183 tests.
- Preserved A 68 and B1-14 probes pass on repaired tree. Their embedded 0df87bb7 runtime strings are historical labels.
- Preserved B2 consequences 7, continuity 8 and projections 10 pass. Their embedded 0383cedc labels are historical; actual tested tree is identified above. Notification probe correctly accepts existing retention-expired posture when full.
- Content lint: 71 files pass. Node UI typecheck pass. Broad UI typecheck nonzero with 137 known diagnostics; sorted signatures normalized for line/column exactly match `.tmp-dev070-ui-typecheck.log`.
- Direct application-local `node node_modules/vite/bin/vite.js build` passes, 216 client modules. Existing Browserslist/chunk warnings and plugin timing warning do not prevent build.
- Public witness exports and new survey-validator JS bridge import pass; diff/whitespace/intended-file review pass.

No fresh browser/storage acceptance in this repair. Existing ordinary integration/quota coverage is included in the baseline; complete independent full-feed/browser/storage acceptance remains a separate route. Preserved historical negative audits remain chronology, not acceptance.

## Guardrails, Branches And Next Route

FP-001/017: production caller/ordinary setup and explicit fixture limits. FP-002: repair pending independent acceptance. FP-008/009: exact source/runtime/publication and protected refs. FP-010: F3 reproduction/test map and F1/F2 preserved probes. FP-011/012/014/015: independent witness unchanged, original source exact hash, malformed suffix/direct verifier fail-closed checks. FP-013: nested owner transitions remain valid after parent completion. FP-016: both orders and bounded capacity/terminal behavior; independent full matrix still required. Existing recovery FP-003/004/005/006 coverage remains in baseline/B1.

One local/four hosted branches, zero open PRs. Three retained heads, merge bases, unique commits/paths unchanged; counts at source readiness 408/2, prompt-integrity 355/1, administration 186/1. No overlap or consumed trigger; no merge/rebase/integration/deletion/PR/protection/disposition action due/performed. Exact triggers in branch register.

Next: **Soundings Durable Completion Post-F3 Independent Acceptance Audit**, complete A/B1/B2/C/D on the exact repaired runtime. No self acceptance, DEV-0.7.1 or game-version proposal. Suggested runtime commit: `fix(soundings): retain exact survey admission prefix`.
