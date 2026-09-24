# Connector Audit — Soundings F2 Consumer-Completion Owner Boundary

Date: 2026-09-24

Repository: `vagabond1215/Lineage_Reforged` only.

Posture: Connector-safe static audit. No production/test/schema/content mutation and no repair/acceptance claim.

## Source

Hosted `master` at audit start: `918b092ad3b911dd9804dd87aad1d06d2cc3736e`.

Runtime containing F2: `0df87bb7afaa4d7fcc9f08b79b7528d60727c370`.

Active route: **Soundings Publication Consumer Completion Witness Gate Repair**.

## Confirmed Defect Seam

`completeCampaignPublicationConsumers(accountId, publicationId, kinds)` finds retained publication recovery and currently enters the Soundings durability gate only when `recovery.soundingsAdmissionWitness` is present. If the sidecar witness fields are omitted while the retained recovery envelope still contains a version-2 completed Soundings snapshot, the function can update `completedConsumerKinds` or delete recovery without first proving witness durability.

The recovery parser permits `soundingsAdmissionWitness` to be absent. Therefore sidecar absence is structurally valid recovery syntax and cannot itself mean "this publication did not require Soundings provenance."

The retained `envelopeRaw` is independently bound to recovery account/slot/campaign/artifact/generation/publication/head revision/terminal facts by `readRecoveryEnvelope(...)`. Deserializing that envelope supplies the publication snapshot. Its `authorityLedger.soundingsTurnIn` state can distinguish:

- no completed Soundings authority;
- legacy version-1 completion, for which no independent witness is required;
- version-2 completion, for which independent witness durability is required.

This is the correct source of the **requirement decision**. Optional sidecar presence is evidence to validate after the requirement is known; it must not decide whether the requirement exists.

## Existing Reusable Validation Seam

The save owner already contains the necessary narrow primitives:

- `readRecoveryEnvelope(...)` validates recovery/envelope identity;
- `loadSoundingsAdmissionWitness(...)` validates stable witness structure and, when applied, verifies its first durable artifact/publication/head revision;
- `persistedSoundingsContext(...)` distinguishes `verified`, `not_completed`, `legacy_unverified`, `missing_witness`, and `invalid_witness` behavior;
- `retainRecoveryWitness(...)` validates pending recovery witness/fingerprint/first-durable identities, checks provenance against the retained envelope snapshot, detects stable-witness conflicts, and promotes/retains exact witness state;
- `recoverPublicationAddress(...)` already invokes `retainRecoveryWitness(..., true)` before projecting the playable address.

The repair therefore does not need a new provenance mechanism, account ledger, save format, or engine-owned browser-storage read.

## Required Owner Invariants

Before `completeCampaignPublicationConsumers(...)` writes any new completed consumer kind or removes recovery:

1. Parse and validate the retained envelope.
2. Determine from retained publication authority whether Soundings witness provenance is required.
3. If the retained authority is version 2 completed Soundings, require the recovery witness/fingerprint/identity evidence expected by the accepted first-publication protocol; omission cannot downgrade the publication to legacy/no-witness behavior.
4. Require publication recovery to have reached the contractually safe completion posture for consumer cleanup.
5. Validate/promote/confirm the stable witness before consumer effects.
6. Missing, pending, malformed or conflicting required evidence must reject before storage mutation.
7. Genuine non-Soundings and legacy version-1 no-witness publications must retain their current behavior.
8. Valid terminal consumer completion must remain possible after the playable slot address has been intentionally deleted; validation must not recreate that address.

## Smallest Static Repair Surface

The evidence supports a save-owner-only change centered on `completeCampaignPublicationConsumers(...)`, optionally with a tiny private helper that derives the Soundings provenance requirement from `readRecoveryEnvelope(recovery)` and performs the existing witness validation sequence.

No evidence supports changing Soundings rewards, quest state, engine progression, publication schema version, dependencies, App UI, broad persistence architecture, or defeat/recovery behavior.

## Connector Disposition

`F2_OWNER_BOUNDARY_STATIC_MAP_COMPLETE`

Production remains unchanged and F2 remains `REPAIR_REQUIRED` until Codex implements and executes the bounded repair.
