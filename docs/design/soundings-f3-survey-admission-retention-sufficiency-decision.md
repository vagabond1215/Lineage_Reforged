# Soundings F3 Survey Admission Retention Sufficiency Decision

Date: 2026-09-25. Repository: `vagabond1215/Lineage_Reforged` only.

Disposition: **RETENTION_SUFFICIENT_BOUNDED_REPAIR_AUTHORIZED**.

This is a narrow technical compatibility decision for F3. It does not alter authored quest terms, rewards, game version, DEV milestone, world version, dependency policy, or the accepted F1/F2 provenance contract.

## Decision

Existing retained authority is sufficient to distinguish the exact survey graph accepted at Soundings turn-in from later authorized survey projection-repair history. **No new persisted field, witness version, world/save migration, or broader retention contract is required for F3.**

The repair should recover the admission-time survey graph as an exact prefix boundary in the current survey `projectionRepairs` history, using the already-retained admission fingerprint.

## Why evidence is sufficient

At accepted Soundings admission the system already retains, through independent owners:

1. the Soundings normalized intent containing the admission `surveyFingerprint`, stripped source snapshot, and full `snapshotFingerprint`;
2. the save-owned Soundings witness containing independent `surveyFingerprint`, `sourceSnapshotFingerprint`, canonical-intent fingerprint and source/publication/continuity identities;
3. the current survey authority ledger, where projection repair is append-owned and each repair has deterministic identity/ordinal and is deep-validated by the survey authority;
4. Soundings readiness proof that no survey projection repair or correction reconciliation was pending at submission.

The original survey graph therefore need not be duplicated. For a current completed snapshot with later projection repairs, construct candidate historical survey graphs by keeping all non-`projectionRepairs` survey fields unchanged and taking prefixes of the current `projectionRepairs` array. The exact admission prefix is the one whose canonical fingerprint equals the frozen admission `surveyFingerprint`.

Then insert that recovered historical survey graph—not the full current graph—into the retained stripped source snapshot and require the existing full `snapshotFingerprint` and all existing source facts to verify. Trust-sensitive operations continue to require the independent applied witness, which separately binds the same survey/source fingerprints.

## Required properties

- Require an exact prefix match. Do not remove arbitrary repair rows or canonicalize their order.
- Preserve any projection repairs that already existed before Soundings admission; they are part of the original certified prefix.
- Permit only a suffix of later survey-owner projection repairs. Every current repair still must satisfy the normal survey validator.
- Do not use tick arithmetic as the boundary; later repair may share the Soundings tick.
- Do not modify the original intent or witness when later repairs occur.
- Keep all non-projection survey authority facts frozen to the admission view. This decision does not authorize later mutation of requests, occurrences, results, receipts, corrections, reconciliations or material survey facts.
- If no prefix matches the admission fingerprint, fail closed exactly as current invalid authority/provenance behavior requires.
- F1/F2 remain authoritative: a mutable campaign digest is not independent provenance, and consumer cleanup cannot weaken witness durability.

## Compatibility

- Existing provenance-required version-2 Soundings saves can use this derivation without migration because they already retain the necessary hashes and current survey ledger.
- Legacy version-1 no-witness saves retain their existing `legacy_unverified` posture; this decision does not synthesize provenance for them.
- Existing saves with no post-turn-in survey projection repair behave equivalently because the matching prefix is the full current repair array.

## Implementation authorization

Proceed with a bounded S-sized compatibility repair centered on Soundings survey-admission reconstruction plus focused cross-owner regressions. A new contract/persistence gate is not required unless local executable work disproves one of the static invariants above.
