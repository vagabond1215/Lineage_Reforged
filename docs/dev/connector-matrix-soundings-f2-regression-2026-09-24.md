# Connector Matrix — Soundings F2 Regression Targets

Date: 2026-09-24

Repository: `vagabond1215/Lineage_Reforged` only.

Posture: Connector-safe test-planning matrix. No executable pass/fail claims beyond already-recorded audit evidence.

## Existing Fixtures To Reuse

Primary independent defect reproduction:

- `docs/dev/evidence/soundings-post-repair-acceptance-2026-09-24/slice-b1.mjs`

Existing persistence foundations:

- `tests/unit/campaign-persistence-foundation.test.mjs`
- `tests/unit/soundings-admission-witness-recovery.test.mjs`
- `tests/unit/soundings-admission-witness.test.mjs`

Relevant existing coverage already includes publication interruption/recovery, immutable-artifact conflicts, newer-head conflicts, legacy version-1 no-witness compatibility, witness pending/applied states, normal consumer completion, terminal cleanup behavior and ordinary no-Soundings publication.

## Focused Desired-Behavior Matrix

| Case | Setup | Expected result | Best existing fixture/home |
| --- | --- | --- | --- |
| F2 preserved independent probe | Version-2 Soundings publication, declared consumer, interrupt before applied witness, remove recovery witness+fingerprint | Reject unchanged; recovery retained; stable witness remains pending | `slice-b1.mjs` rerun after repair |
| Witness omitted only | Preserve fingerprint but remove recovery witness | Reject before completed-kind write/cleanup | focused Soundings recovery unit test |
| Fingerprint omitted only | Preserve pending recovery witness but remove fingerprint | Reject before mutation | focused Soundings recovery unit test |
| Witness + fingerprint omitted | Preserve version-2 envelope/head/stable pending witness | Reject before mutation | focused Soundings recovery unit test |
| Malformed recovery witness | Replace pending witness with structurally invalid/conflicting facts | Recovery parser/owner rejects unchanged | Soundings recovery unit test |
| Wrong stable witness | Recovery sidecar valid-looking; stable retained witness conflicts | Reject unchanged | Soundings recovery unit test |
| Stable witness still pending | Version-2 publication; consumer completion attempted before accepted witness durability | Reject and retain recovery | Soundings recovery unit test |
| Valid applied completion | Version-2 recovery fully address/witness verified | Complete declared kinds and clean recovery when final | campaign persistence + Soundings recovery |
| Partial consumer completion | Multiple plans, one legitimate completed kind | Persist exact partial set; retain recovery | campaign persistence |
| Failure after no prior effects | Corrupt provenance and request one or more kinds | No partial `completedConsumerKinds`; no cleanup | focused Soundings recovery unit test |
| Repeated completion | Valid completion called again after cleanup | Idempotent no-op | campaign persistence |
| Ordinary no-Soundings publication | Consumer plan with target snapshot containing no completed Soundings | Existing behavior unchanged | campaign persistence foundation |
| Legacy v1 completed Soundings, no witness | Republish/consumer completion under accepted compatibility posture | No synthetic witness; no repayment; cleanup remains valid | witness recovery legacy-v1 fixture |
| Terminal address already deleted | Fully verified terminal recovery; owner intentionally removed playable address before cleanup | Consumer completion validates retained authority without recreating slot address | campaign persistence / terminal fixture |
| Version-2 authority downgrade | Witness-backed completion changed to version 1 | Continue to reject; no cleanup bypass | existing witness downgrade regression |
| Missing recovery record | Call completion after valid recovery already removed | No-op, no resurrection | campaign persistence |

## Assertion Discipline

For every negative case capture storage bytes before the call and require exact byte equality afterward. In particular verify all of the following remain unchanged on rejection:

- publication recovery record;
- stable witness key/value;
- immutable artifact;
- campaign control/head;
- slot address if present;
- account-facing consumer evidence when the test owns it.

For positive cases verify the opposite narrowly: only the intended consumer-completion/recovery-cleanup bytes may change.

## Implementation-Test Placement

The narrowest likely placement is to extend `tests/unit/soundings-admission-witness-recovery.test.mjs` for provenance-required omission/conflict cases, while retaining generic ordinary/terminal consumer semantics in `campaign-persistence-foundation.test.mjs`.

Do not rewrite the independent `slice-b1.mjs` probe into an implementation helper. Its value is that it remains separately authored acceptance evidence.

## Repair Validation Order

1. focused new F2 tests;
2. preserved `slice-b1.mjs` expecting desired rejection;
3. preserved independent Slice A 68-case probe;
4. existing witness/persistence suites;
5. exact 143-test baseline plus new tests;
6. lint/type/build/bridge checks required by the active prompt.

## Connector Disposition

`F2_REGRESSION_MATRIX_COMPLETE`
