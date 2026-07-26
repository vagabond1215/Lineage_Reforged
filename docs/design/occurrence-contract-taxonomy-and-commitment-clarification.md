# Occurrence Contract Taxonomy And Commitment Clarification

Date: 2026-07-26

Status: accepted narrow documentation-only clarification

Milestone impact: `supports_current_band`

## Scope

This clarification corrects two precision defects in `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`. It does not reopen occurrence identity, named uncertainty, replay equivalence, correction, save topology, Stakes semantics, or implementation.

## Corrected Taxonomy Diagram

The controlling taxonomy is:

```text
request / command
  -> delivery and admission
       -> occurrence
            -> deterministic accepted result
            -> uncertain accepted result -> named channel evidence
            -> no accepted result

accepted result
  -> owner-specific consequence receipts
       -> projections

explicitly owner-defined admitted rejection consequence
  -> owner-specific consequence receipt
       -> projection
```

A no-result occurrence does not generally create downstream consequences. Consequence receipts consume an accepted result, except where an owning domain explicitly defines an admitted rejection or no-result occurrence as independently consequential. A pre-admission rejection remains request/rejection evidence and creates no gameplay occurrence or consequence.

This replaces only the misleading indentation in Section 6 of the occurrence decision. The surrounding prose and owner graph remain controlling.

## Ironbound Request Commitment Clarification

Ironbound commits:

- admitted request/admission identity where the request crosses the authoritative occurrence boundary;
- accepted occurrences;
- accepted deterministic and uncertain results;
- applied owner-specific consequences;
- correction and supersession lineage.

Duplicate delivery, a rejected pre-admission request, an invalid request, or a presentation-only command record does not become committed gameplay truth merely because it was delivered or displayed. This replaces the shorthand phrases `accepted commands` in the occurrence and earlier Mortal Crisis/Stakes matrices with the more precise admitted-request boundary. It does not weaken Ironbound finality, anti-reroll behavior, retry idempotency, or technical-recovery commitment.

## Coordination Wording

The statement `No accepted semantic boundary remains deferred` in the completion output is read as:

> No semantic boundary inside the completed occurrence-contract decision scope remains deferred.

Domain-specific material-input policies, channel families, functional-state and lethal-process receipts, exact correction permissions, schemas, persistence, algorithms, tests, and implementation remain deferred to their named owners and later routes.

## Authority

This clarification is the most specific authority only for the three corrections above. All other clauses of the occurrence decision remain unchanged and controlling.
