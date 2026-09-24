# Soundings Consumer Completion Witness Gate Repair Record

Date: 2026-09-24. Repository: `vagabond1215/Lineage_Reforged` only.

Run: **Soundings Publication Consumer Completion Witness Gate Repair**. Result: **IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE**.

Unversioned bounded repair, package S; parent development milestone not applicable; development milestone impact `supports_current_band`; game-version impact `none`. Game `0.1.0-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, band `DEV-0.7.x` unchanged.

## Exact Source And Scope

Started clean synchronized master `a9508e658452a024310a7d3a59e1f46fd2953442`. Fetch/prune found no additional incoming work. Six intervening Connector preparation commits after audit publication `918b092ad3b911dd9804dd87aad1d06d2cc3736e` were documentation only; production/test delta from runtime `0df87bb7afaa4d7fcc9f08b79b7528d60727c370` was empty before repair. Reused all four fresh F2 Connector packets and checked live owner/callers, accepted provenance contract and F2 audit.

Final runtime/test commit: `0383cedc99a4c3d5e2c9b47cf0665683720aef9e`. All final execution below exercised precisely this production/test tree. Later coordination publication is docs only; final publication and live heads are reported separately after push/fetch/readback.

Only production file: `apps/rpg-ui/src/game-shell/saveManager.ts`. Only implementation test file: `tests/unit/soundings-admission-witness-recovery.test.mjs` (22 additional tests). Historical independent evidence stays unchanged. No App, engine, contract/schema, dependency, authored content, generated output or version change.

## F2 Repair And Evidence

Before editing, preserved B1 reproduced F2: 13 prerequisite/control cases passed, then omission allowed deletion with pending witness (exit 1). Consumer completion now validates/deserializes retained envelope, derives the version-2 requirement from publication authority, requires completed recovery posture and resolves applied stable provenance before any completion write or cleanup.

For the first durable artifact, exact recovery witness/fingerprint and durable identities are mandatory even when optional fields were removed. Later publications legitimately omit the first-publication sidecar but still require matching applied provenance. Cleanup verifies only: it cannot promote pending evidence, rewrite witness bytes or recreate a terminal address. Existing publication recovery owns promotion.

| Finding or preservation boundary | Final executable evidence |
| --- | --- |
| F2 omission, witness/fingerprint individually and together | Pending and applied first-publication tests reject; both partial and full consumer requests preserve every stored byte. |
| Malformed/conflicting sidecar, fingerprint, stable source/first IDs; missing/pending witness | All reject unchanged; forged address_verified posture cannot promote pending witness. |
| Valid first publication | Partial completion changes only recovery; final completion deletes only recovery; repeated call is byte-idempotent. |
| Later publication without sidecar | Ordinary later travel/save completes with unchanged applied witness; missing/pending/conflicting stable evidence still rejects. |
| Ordinary and legacy v1 no-witness | Completion/load retain wallet/ledger and never synthesize witness. |
| Terminal cleanup after address deletion | Consumer completion and repeated startup do not recreate playable address or alter witness. |
| Historical F1 | Preserved independent A rerun passes 68 cases, including both forgeries/session/restart. |

Independent static reviewer found no blocking issue; review is not independent executable acceptance. Normal App recovery-before-completion and publication-before-completion ordering is unchanged. F2 was an exported owner-boundary defect; ordinary UI exploitability remains unestablished.

## Validation

- Exact 16-file test command in `soundings-admission-witness-repair-implementation-record.md`, unchanged file list (the recovery file now includes 22 new tests): **165/165 pass**, zero failed/cancelled/skipped/todo, 81.943 seconds. Final recovery file has 35 tests.
- `node docs/dev/evidence/soundings-post-repair-acceptance-2026-09-24/slice-a.mjs`: **68 pass**, exit 0.
- `node docs/dev/evidence/soundings-post-repair-acceptance-2026-09-24/slice-b1.mjs`: **14 pass**, `B1_PARTIAL_PASS`, exit 0; final observation rejected=true, recoveryRetained=true, storageUnchanged=true. This bounded probe is not the complete B matrix.
- Both preserved scripts print their original hardcoded runtime label `0df87bb7...`; that identifies historical probe authorship, not this rerun's tested tree. Tested runtime is the exact commit above; no evidence file was relabeled.
- `npm run tool:content-lint`: pass, 71 files. `npm run typecheck:ui:node`: pass.
- `npm run typecheck:ui`: remains nonzero, **137 existing diagnostics**, zero sorted signature differences after normalizing line/column against `.tmp-dev070-ui-typecheck.log`. Initial patch exposed one missing TypeScript narrowing; corrected before final validation.
- From `apps/rpg-ui`, `node node_modules/vite/bin/vite.js build`: pass, 216 client modules; existing Browserslist/chunk warnings. Generated output remains untracked/ignored.
- Public JS engine import verifies `verifySoundingsAdmissionProvenance` and `isSoundingsAdmissionWitness`; unchanged bridge/export inspection and `git diff --check` pass. An initial bridge-check command used a nonexistent directory; corrected to `packages/engines/game-engine/src/index.js` and passed.

No independent ordinary browser/storage acceptance or complete B2/full-feed acceptance in this repair. Existing ordinary integration/quota test is included in 165 tests; historical browser measurements remain historical. Separate A/B1/B2/C/D acceptance remains required.

## Guardrails And Branches

FP-001/017: real ordinary fixture/caller and explicit API/UI distinction. FP-002: repair is not self acceptance. FP-003/004/005/006: retained interruption/collision/restart tests and byte-preserving failure. FP-008/009: retained protected/held refs, exact source/runtime/publication separation. FP-010: F2 fully mapped, F1 retained regression. FP-011/012/014/015: validated required authority before effects, omission/forgery/identity tests. FP-013/016 independent continuity/full-feed gates remain for audit, not claimed closed here.

One local/four hosted branches; zero open PRs by scoped query. Non-default heads/merge bases/unique commits/paths checked unchanged. Starting-source counts readiness 395/2, prompt-integrity 342/1, administration 173/1. No overlapping edit surface or consumed retention trigger; no merge/rebase/integration/deletion/PR/protection/disposition action due/performed. Exact heads/triggers are in branch register.

Next: **Soundings Durable Completion Post-F2 Independent Acceptance Audit**, package M with bounded A/B1/B2/C/D checkpoints at one runtime. Preserve earlier negative decisions and independently retest repairs before remaining gates. No game-version decision or DEV-0.7.1. Suggested runtime commit message used: `fix(soundings): verify witness before consumer completion`.
