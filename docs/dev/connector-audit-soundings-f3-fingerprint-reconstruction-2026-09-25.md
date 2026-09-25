# Connector Audit — Soundings F3 Fingerprint And Reconstruction Call Sites

Date: 2026-09-25. Repository: `vagabond1215/Lineage_Reforged` only.

Disposition: **FINGERPRINT_DEPENDENCY_MAPPED**. Static Connector analysis only.

## Current binding chain

### Preparation

`player-soundings-turn-in.ts` creates the normalized intent with:

- `sourceSnapshot: retainSoundingsSource(snapshot)`;
- `snapshotFingerprint: fingerprintSoundingsState(snapshot)`;
- `surveyFingerprint: fingerprintSoundingsState(snapshot.authorityLedger!.ashenReefSurvey)`.

`retainSoundingsSource` intentionally removes `authorityLedger.ashenReefSurvey` from the retained serialized source because survey authority is retained by its own owner. This prevents duplicating the whole survey graph in the Soundings request.

### Independent witness

Campaign admission mints the save-owned Soundings witness from the verified source and retains both:

- `sourceSnapshotFingerprint` for the exact full source snapshot;
- `surveyFingerprint` for the exact survey authority at admission;
- the canonical-intent fingerprint and source/publication/continuity identities.

This is important: the admission survey hash exists outside the mutable completed campaign snapshot and therefore remains the independent F1 provenance anchor.

### Current structural validator

`validateSoundingsTurnInAuthority` currently makes two assumptions that F3 disproves:

1. the current live survey graph must hash exactly to `intent.surveyFingerprint`;
2. historical source reconstruction may insert the entire current live survey graph into the retained source before checking `intent.snapshotFingerprint`.

Both assumptions become false after a valid survey-owner projection-repair append.

### Witness verifier

`soundings-admission-witness.ts` compares witness facts to the completed request intent and calls the Soundings structural validator first. It does not need browser storage or a duplicate survey graph. If the structural validator can safely reconstruct the exact admission survey graph, the existing witness remains the independent authority proving that the stored `surveyFingerprint` and source fingerprint are the original accepted values.

## Smallest coherent seam

Introduce one narrowly owned helper in/near Soundings authority that resolves the **admission survey graph** from:

- the current validated survey authority;
- the frozen `surveyFingerprint` from the Soundings intent/witness.

The helper should search only prefixes of the current `projectionRepairs` array while leaving every other survey-authority field byte/structure-equivalent. It should accept exactly when one prefix hashes to the frozen admission survey fingerprint. The normal no-later-repair case is the full current array. A pre-turn-in repair history is therefore retained exactly rather than stripped.

Use that recovered admission survey graph in both places that currently substitute the entire current graph:

- survey fingerprint admission check;
- retained-source reconstruction before checking `snapshotFingerprint` and the rest of the original source facts.

The live snapshot should continue to retain and validate the full current survey graph, including the authorized suffix. Do not rewrite it to the historical prefix.

## Fail-closed requirements

Reject if:

- no projection-repair prefix reproduces the frozen survey fingerprint;
- any non-`projectionRepairs` survey field changed relative to the certified graph (prefix search cannot hide such drift);
- a pre-admission repair entry was removed, altered, reordered or replaced;
- malformed/forged current repair history fails normal survey validation;
- intent/witness survey fingerprints conflict;
- source snapshot reconstruction fails its existing fingerprint or source-fact checks.

Do not use `appliedTick` as the admission boundary: a projection repair may occur at the same gameplay tick as Soundings completion. The existing cryptographic admission fingerprint is the stronger boundary.

## Surfaces expected to change

Likely production surface is limited to `soundings-turn-in-authority.ts` plus focused tests, with a shared/private helper as needed. `soundings-admission-witness.ts` and `campaign-session.ts` should require changes only if executable validation exposes an actual dependency; their retained facts are already sufficient for the static design above.
