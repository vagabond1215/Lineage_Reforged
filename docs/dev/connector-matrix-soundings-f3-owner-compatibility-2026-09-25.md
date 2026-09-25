# Connector Matrix — Soundings F3 Cross-Owner Compatibility

Date: 2026-09-25. Repository: `vagabond1215/Lineage_Reforged` only.

Disposition: **REGRESSION_MATRIX_READY**. This matrix is preparation, not executable acceptance.

## Required focused cases

| Case | Required result |
| --- | --- |
| Chronicle repair before Soundings | Accepted by survey owner; resulting repaired survey graph can be submitted normally. |
| Notification repair before Soundings | Same. |
| Chronicle repair after Soundings | Accepted `projection_repaired`; original Soundings witness/payment unchanged. |
| Notification repair after Soundings | Same. |
| Pre-turn-in repair prefix + post-turn-in repair suffix | Admission fingerprint continues to bind the exact pre-turn-in prefix; later suffix remains valid. |
| Multiple post-turn-in repairs | Each append remains compatible; repeated restart preserves all repair history and original witness. |
| Soundings projection repair then survey repair | Both owners remain available in that order; no replay/payment. |
| Survey repair then Soundings projection repair | Both owners remain available in reverse order. |
| Descendant continuity after post-turn-in survey repair | Witness, admission survey boundary and current repair history survive travel/fork/restart. |
| Same-tick post-turn-in repair | Must work; implementation must not infer boundary from `appliedTick`. |
| No post-turn-in repairs | Existing full-graph fingerprint path remains equivalent. |

## Fail-closed mutation cases

| Mutation | Required result |
| --- | --- |
| Alter a pre-turn-in projection-repair entry | Reject completed authority/provenance unchanged. |
| Remove a pre-turn-in repair entry | Reject. |
| Reorder pre-turn-in repair entries | Reject. |
| Insert forged entry inside the pre-turn-in prefix | Reject. |
| Alter requests/occurrences/results/receipts | Reject; F1 protections retained. |
| Alter corrections/reconciliations from admission graph | Reject. |
| Change survey fingerprint only inside campaign snapshot | Independent witness mismatch rejects. |
| Change witness survey fingerprint | Reject. |
| Change source snapshot/source fingerprint | Reject. |
| Malformed/conflicting current repair suffix | Normal survey validation rejects; Soundings must not bless it. |
| Version-2 missing/conflicting witness | Existing F1/F2 fail-closed behavior retained. |

## Projection capacity / full-feed cases

After the compatibility repair, finish the B2 matrix that F3 interrupted:

- Chronicle and notification full-feed/cap behavior for survey repair;
- Soundings completion projection repair at/near capacity in both owner orders;
- repeated repair/restart at capacity;
- no eviction of newer opaque accepted truth;
- repair refusal at capacity leaves source/storage unchanged;
- unrelated accepted gameplay and later save/restart still work after a projection repair refusal;
- missing projection is never mistaken for a new quest acceptance/payment.

## Existing evidence to preserve

- operator A68/B1-14 checkpoint is historical independent evidence for runtime `0383ced...` only;
- F3 repair creates a new runtime, so retained A/B1 probes must be rerun on the final repair tree;
- current `b2-consequences.mjs`, `b2-continuity.mjs`, and `b2-projections.mjs` remain independent desired-behavior probes and should all be rerun;
- exact 16-file Soundings baseline was 165 tests before F3; add focused F3 tests rather than replacing that baseline;
- adjacent survey activity command/persistence tests are mandatory because F3 changes a cross-owner validation seam.

## Guardrail

Do not make a test green by normalizing away all projection-repair history. At least one test must establish **non-empty repair history already present at Soundings admission plus a later appended repair**, proving that the implementation recovered the historical prefix rather than simply excluding the field from authority.
