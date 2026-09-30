# DEV-0.7.1 Slice G8C — First Witnessed Descendant And Cross-Slot Authority Decision

Date: 2026-09-30. Inspected hosted source `ea7b8562830d1df19a4ade32f7754f7c378d6672`. Internal decision slice of planned primary `DEV-0.7.1`; parent, Game version and live activation remain held.

## Decision

**WITNESSED_DESCENDANT_AND_CROSS_SLOT_CONTRACTS_ACCEPTED; IMPLEMENTATION_HELD**

G8B exposed two new-epoch authority gaps. Both are accepted as owner contracts, but they are separate implementation slices before the real App cutover.

## A. First independently witnessed descendant

The pure creator first head remains unwitnessed because creator flow cannot complete Soundings. The first ordinary Soundings completion therefore may occur on a descendant.

The accepted authority chain is:

`ready predecessor + accepted gameplay mutation + session Soundings witness -> first witnessed descendant publication -> applied durable witness + pending descendant recovery -> consumers completed -> ready head`.

The independent input is the **session witness produced by accepted gameplay**, not snapshot agreement. The caller/adapter must prove `verifySoundingsAdmissionProvenance(targetSnapshot, sessionControl) === "verified"` before requesting publication. The transactional owner must independently require a structurally valid session witness whose account/campaign/character/request, source artifact/publication/revision/continuity and accepted result facts agree with the exact predecessor/source and target Soundings authority. It must reject missing, pending/applied-as-input, malformed, snapshot-derived, stale-source, mismatched-request, second-witness and provenance-downgrade cases.

Inside the same IndexedDB transaction that accepts the descendant artifact/head/slot and descendant recovery, the owner converts that accepted **session** witness to the one immutable **applied** witness by adding the new artifact/publication/head revision as `firstDurable*`. The recovery records that request ID. No head may become visible without artifact + applied witness + pending recovery. Abort/quota leaves none of them accepted.

Same-source retry must reuse the exact retained publication/witness/recovery. Caller loss after commit resumes by current durable head/recovery and must not mint a new witness or publication. A stale tab loses expected-head/account CAS. Once an applied witness exists, every later descendant must preserve it; no second first witness and no downgrade are legal.

Required readback is the exact new head, exact applied witness, exact pending/completed recovery, exact predecessor and immutable first witnessed artifact. Only completed consumers make the slot playable.

## B. Cross-slot manual/quick authority

Repository behavior establishes that quick save is a separately visible/loadable slot while the in-game active slot remains unchanged. The campaign nevertheless has one authoritative head. Therefore **quick/manual cross-slot save is not a second campaign head**.

The accepted model is a **durable slot address to the newly accepted immutable campaign head**:

1. source session identifies an accepted current or authorized historical artifact;
2. ordinary gameplay produces one new descendant and advances the campaign's singular head;
3. the chosen destination slot is atomically addressed to that new artifact/publication;
4. the source slot address remains unchanged unless source and destination are the same;
5. prior artifacts and prior slot addresses remain durable and loadable as historical/non-head authority;
6. loading any address reconstructs session control against the campaign's current head, so gameplay from an older address is explicitly non-head and must fork on mutation.

Thus a quick save from manual slot 1 advances the campaign head and points `quick-save` at that new head while manual slot 1 continues to address its previous accepted artifact. A later manual save from a quick-loaded or historical address follows the same rule. The UI may say “saved to quicksave” only after exact destination-address readback proves it is loadable.

The current creator-slot coupling in clean-epoch attempt/read logic is therefore an implementation limitation, not the desired post-epoch model. Campaign identity/first-publication provenance remains campaign-scoped; slot addresses are account-scoped durable references to accepted artifacts of that campaign.

### Transaction and recovery rules

Cross-slot publication must atomically validate expected campaign head, expected account revision, source artifact/publication/continuity, destination-slot expected address posture, immutable target artifact, destination address and pending consumer recovery. It must never delete or rewrite the source address or immutable history.

Destination overwrite is optimistic: the caller supplies the expected destination address (empty or exact artifact/publication identity). A changed destination produces conflict. Overwriting an address does not delete the previously addressed artifact. Delete/reset semantics remain G9 and cannot be smuggled into this owner.

Consumer fingerprints use the **destination slot**, matching the visible/loadable save address. Account history may add that destination address exactly once; it must not remove source addresses. Same-source retry must preserve the exact publication and destination address. Lost caller resumes from publication/recovery identity, not by issuing another save.

A stale source, stale campaign head, stale account revision, changed destination address, conflicting campaign in destination, malformed address, missing artifact, pending unrelated recovery, quota/abort or closed campaign fails without partial authority.

## State transitions

Witnessed same-slot or cross-slot descendant:
`ready -> publication transaction -> pending_consumers -> consumer transaction -> ready`.

Failure before publication commit leaves predecessor/head/addresses unchanged. Failure after publication commit leaves an exact recoverable `pending_consumers` head/address. Consumer completion is exactly once through receipts and account revision.

Cross-slot historical source is permitted only under the already accepted fork contract. It does not silently rebase.

## Failure-boundary acceptance matrix

| Boundary | Required result |
| --- | --- |
| Missing/invalid session witness on first Soundings completion | reject before write |
| Witness source differs from exact predecessor/source | reject before write |
| Competing first-witness tabs | one CAS winner; loser stale/conflict |
| Abort/quota during artifact/witness/head/address/recovery | transaction abort; no partial head |
| Lost caller after witnessed commit | resume exact retained recovery/witness |
| Destination changed by another tab | conflict; do not overwrite |
| Cross-slot publication commit then consumer failure | destination resolves pending authority; resume exact publication |
| Source slot after cross-slot save | unchanged address, retained artifact |
| Prior destination artifact after overwrite | retained immutable history |
| Quick-save success notice | only after exact loadable destination readback |

## Required adversarial browser QA

Implementation acceptance must cover first Soundings completion from pure creator head, restart before/after witnessed publication, missing/tampered/session-stale witness, two-tab first-witness contention, later descendants preserving the first witness, manual->quick and quick/historical->manual publication, empty and occupied destination CAS, destination race, source-address preservation, overwritten-artifact retention, non-head fork, consumer abort/retry, publication abort/quota, exact quick-slot load, and stale account/head rejection.

## Package order

These contracts should **not** share one implementation slice. They change different invariants and need isolated failure injection.

1. **G8D — First Witnessed Descendant Owner Implementation**.
2. **G8E — Cross-Slot Campaign Address Owner Implementation**.
3. **G8F — Real Async App Caller Cutover And Ordinary UI QA**.

G9 remains lifecycle/retirement/defeat/reset/delete. G10 remains coordinated development activation, long-run/two-context capacity, quota/eviction and complete verifiable backup/restore.

## Exclusions and status

No production code, tests, schema, browser data, deployment, migration, combat, Game-version or live caller changed in G8C. Existing G8B/G8A test results are prior evidence only; no executable acceptance is claimed here. Pre-cutover development data remains disposable; post-epoch history is not.

Game remains `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; planned `DEV-0.7.1` remains held. Retained branch dispositions and triggers are unchanged.
