# Independent B2 continuity, consequences and projection evidence

Completed 2026-09-28 after the September 25 interrupted run. Repository: `vagabond1215/Lineage_Reforged`. Inspected source HEAD `567d250cae46a43c1c87123d63478aa9f47183f9`; actual runtime `7c8c980d01892b0f673afc5a5940aec33ad2d7a2`. The source delta has no changes under `packages`, `apps` or `tests`. Production and tests remained read-only.

Disposition: **B2 PASS**. No acceptance-critical defect found in this slice. This does not decide B1 publication recovery, browser C, regression D, or overall acceptance.

## Executable evidence

| Evidence | Cases | Result and boundary |
| --- | ---: | --- |
| `preserved-projections.log` | 10 | September 25 completed rerun of the preserved independent post-F2 projection script on the current runtime: missing/misplaced rows, same-ID conflicts, opaque equal-tick ordering, both survey projection owners after completion. |
| `preserved-continuity.log` | 8 | September 25 completed rerun: current-head and non-head first submission, descendants, admitted monetary fixtures, legacy v1, pending defeat and explicit safe-settlement recovery fixture. |
| `preserved-consequences.log` | 7 | September 25 completed rerun: four-tick no-fare return, unsupported/unaccepted/inaccessible rejection, exactly +5 gold/+0 silver and seven receipts, other player/game/survey/access surfaces unchanged, restart duplicate. |
| `independent-prefix.mjs` / `independent-prefix.log` | 18 | Entire independently authored F3 probe rerun September 28; exit 0 and `INDEPENDENT_F3_PREFIX_B2_PASS`. |

The three preserved scripts still print historical runtime `0383cedc`; that literal is not the tested target. Their current-runtime logs were reviewed against the complete scripts. They are independent audit probes, not implementation unit-test counts. Total B2 evidence: 43 passing cases.

Run the additional probe from repository root:

```powershell
node docs/dev/evidence/soundings-post-f3-acceptance-2026-09-25/b2/independent-prefix.mjs
```

## F3 findings

The admission survey includes three preexisting repairs, including repeated same-projection repairs at one tick. Chronicle and notification each accept three further same-tick repairs, with publication/restart after every repair. Both survey-first and Soundings-first repair orders survive restart. The frozen Soundings ledger (including original intent/source fingerprints), wallet and persisted witness remain exact throughout; duplicate never repays. Actual non-head load, child continuity creation, publication and restart retain the suffix and trusted duplicate.

Eight independent mutations reject through direct provenance verification, campaign validation, caller and publication, with unchanged source/control/storage: removed, reordered, inserted and altered prefix; malformed ordinal and duplicate suffix; result and receipt drift. The reordered distinct-owner prefix remains valid to the survey validator but fails Soundings provenance, demonstrating exact historical binding beyond structural validity.

For each full opaque feed, survey repair records accepted `projection_retention_expired` without evicting any row. Repetition returns nonaccepted terminal expiry. Soundings refuses missing completion-row repair at its own full cap (`transition_failed`, no accepted state). Later ordinary Ashen/Starfall travel and save/restart remain valid, preserving wallet, frozen ledger and witness. These are distinct owner terminal postures; survey expiry does not mean the missing Soundings projection was repaired.

## Harness correction and limits

`fixture-over-cap.log` preserves the first complete rerun's exit 1 at notification full-feed setup. The probe incorrectly supplied 12 opaque rows to a survey owner whose retained receipt cap is 10; `inspectOrderedProjectionDestination` rejects `rows.length > cap` before repair. This is a probe fixture error, not a production defect. The corrected probe first records survey expiry at its own receipt cap, then separately adds opaque fixture rows up to Soundings' 12-row notification cap. It reran in full to exit 0. No production assertion or contract was weakened.

Opaque rows, damaged projection rows, monetary admitted-owner deltas and safe-settlement recovery are explicit fixtures, not claims of ordinary UI reachability. The ordinary Starfall location is a harbor: pending defeat publication and recovery there fail unchanged. The separately declared safe-settlement fixture proves recovery-owner witness retention; it does not resolve that known location reachability limitation. Browser prerequisite reachability and actual storage retention are owned by Slice C. Publication interruption/consumer evidence is owned by B1; combine both before assigning `PERSISTENCE_AND_PROJECTION_PROBES_PASS`.
