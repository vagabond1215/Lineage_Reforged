# Connector Static Adversarial Review — Soundings Durable Completion

Date: 2026-09-20

Status: `STATIC_REVIEW_COMPLETE_EXECUTABLE_PROBES_REQUIRED`

Repository: `vagabond1215/Lineage_Reforged` only.

Implementation source reviewed: `af0954c294d222bc1f8667266e4549b8619d5484` with hosted publication drift inspected through `fb8e5df153bc744c06510493be28d129492697af` before Connector-preflight publication.

Companion packet: `docs/dev/connector-preflight-soundings-durable-completion-independent-acceptance-2026-09-20.md`.

This is a static source/test review. It does not run the independent audit and does not decide acceptance.

## 1. Review Goal

Reduce expensive independent-audit discovery by identifying where fresh executable/adversarial proof has the highest value.

The implementation already has unusually broad focused tests. The remaining independent audit should therefore concentrate on **cross-boundary semantic failure**, **real runtime behavior**, and **cases where tests could agree with an implementation mistake** rather than mechanically duplicating every assertion.

## 2. Static Strengths Worth Independently Verifying, Not Rediscovering

Source inspection shows the intended architecture is present:

- Soundings submission is routed through a quest-specific engine command rather than the legacy UI payout helper;
- caller state is applied only after an accepted engine/campaign result;
- journal state and wallet balance are not used alone as durable proof;
- a separate Soundings turn-in authority graph records request, occurrence, result and seven consequence receipts;
- the currency receipt encodes exactly 5 gold and 0 silver;
- accepted survey authority is retained separately rather than copied into the turn-in ledger;
- canonical serialization recursively sorts object keys;
- the compact source representation removes the large survey graph and fingerprints the survey separately;
- campaign admission checks the exact five-gold candidate wallet state;
- Starfall return is origin-sensitive rather than a universal destination profile;
- projection repair is designed to reconstruct missing presentation rows without replaying payment;
- the legacy direct Soundings turn-in helper is intentionally blocked.

These are source facts, not an acceptance finding.

## 3. Highest-Value Independent Probe — Authority Before Duplicate

### Why it matters

`executePlayerSoundingsTurnInCommand(...)` validates campaign/session authority before classifying a retained request as a duplicate. That is the correct architectural ordering, but it is acceptance-critical because a permissive duplicate fast-path could otherwise launder corrupted persisted authority.

### Independent probes

From an accepted/restarted completion:

1. corrupt one request field while keeping request id stable;
2. corrupt one occurrence id;
3. corrupt result payment;
4. corrupt one receipt amount or owner;
5. remove one receipt;
6. duplicate one receipt;
7. corrupt accepted continuity ancestry;
8. corrupt retained survey graph after completion;
9. alter source-snapshot retained facts and recompute only superficial strings;
10. retry the original request.

Required observation:

- none classify as a benign durable duplicate;
- no wallet/quest/projection mutation occurs;
- deep authority validation fails closed.

## 4. Highest-Value Independent Probe — Canonical Intent And Conflict Semantics

### Static observation

Intent serialization recursively sorts object keys and preserves array order. Request identity is UUID-patterned and stable ids derive from that request identity.

### Independent probes

1. reconstruct semantically identical normalized intent with object keys inserted in different order and confirm canonical serialization equivalence;
2. reuse the same request id with one genuine semantic change and recompute canonical serialization;
3. mutate only `canonicalIntent` without matching normalized intent;
4. mutate nested retained source JSON while recomputing the outer canonical string;
5. alter survey fingerprint without changing the survey graph;
6. alter survey graph and recompute its fingerprint while leaving the retained source inconsistent.

Required distinction:

- equivalent object key order must not become a conflict;
- changed semantic intent must never become a duplicate;
- recomputed strings must not allow forged before-state or survey authority to pass.

## 5. Highest-Value Independent Probe — Source Reconstruction / Fingerprint Binding

### Static observation

The retained source serializes the pre-turn-in snapshot without `authorityLedger.ashenReefSurvey`; validation restores the current retained survey graph into that source and verifies both snapshot and survey fingerprints plus deep target-campaign validity.

This is the central storage optimization and therefore a key audit surface.

### Independent probes

Probe mutations in facts that are not the survey graph itself:

- wallet before state;
- tracked quest before state;
- operation before state;
- current activity before state;
- account/campaign/character identity;
- continuity id;
- tick;
- snapshot version;
- Starfall location/site state.

For each, test both:

- mutation without digest updates;
- coordinated mutation with recomputed superficial digest/string fields but without a valid matching original source graph.

Required observation: authority cannot be made self-consistent merely by changing both a result and its receipts; the reconstructed before-state remains independently binding.

## 6. Highest-Value Independent Probe — Campaign Continuity And Later Mutations

### Static observation

Soundings reuses the prepared survey campaign mutation seam. First mutation from a non-head artifact may create a continuity fork. The Soundings validator accepts result/source continuities when they remain in the current continuity ancestry.

### Independent probes

1. submit from current head;
2. submit as first mutation from a non-head artifact;
3. publish/restart;
4. perform a later accepted travel mutation;
5. publish/restart again;
6. exercise a defeat/recovery lineage rewrite after completion;
7. retry the original request at each stage.

Required observation:

- turn-in authority survives valid ancestry changes;
- latest-state duplicate does not rewind the campaign to the old retained result snapshot;
- payment is not replayed;
- invalid ancestry does not get accepted as duplicate authority.

## 7. Highest-Value Independent Probe — Projection Repair And Feed Capacity

### Static observation

Missing or misplaced Chronicle/notification rows can be reconstructed from durable receipts. Conflicting rows fail validation. Repair refuses to evict rows when a destination is at capacity. Ordinary synchronization may skip insertion when capacity is full so unrelated accepted play is not frozen.

This is the clearest unresolved acceptance-sensitive design edge called out by the implementation itself.

### Independent probe matrix

For both Chronicle and notification feeds:

1. remove the expected completion row;
2. restart;
3. exact retry should repair without payment replay;
4. move expected row to a wrong position and verify deterministic convergence;
5. repeat repair and restart;
6. replace expected row with conflicting same-id content and verify fail-closed;
7. fill feed to capacity without the expected row;
8. retry and confirm no row eviction and no payment replay;
9. perform an unrelated accepted mutation and confirm ordinary play continues;
10. restart again and inspect how the UI communicates the accepted completion when the projection still cannot be restored.

### Audit question

The audit must decide whether the full-feed state is an acceptable bounded limitation or creates a materially misleading/unfinishable ordinary player posture. Connector does **not** decide that question.

## 8. Highest-Value Independent Probe — Real Browser Storage

### Static observation

The first implementation design repeated large survey graphs and reportedly reached about 9.4 MB in browser storage. The repaired design stores the graph once and reports about 3.1 MB for the tested publication sequence. The integration harness caps storage at 5 MiB.

### Independent browser evidence

Use a fresh disposable local account/origin and explicitly:

- create/start;
- accept Soundings;
- travel;
- execute two shifts;
- save/reload;
- execute remaining two shifts;
- return;
- submit;
- save/reload;
- continue travel;
- save again.

Capture whether any quota/storage exception occurs and record actual browser-visible persisted state after reload.

Do not interpret this as proof of arbitrary-length campaign history. The claim is only the bounded tested sequence.

## 9. Return-Travel Semantics

### Static observation

`settlement.starfall_port` is only resolved from `location.ashen_reef`. It derives the maritime profile from the outbound Ashen route. Existing tests assert no global destination facts for Starfall and reject other origins.

The resolver intentionally allows the route when the Soundings journal row is either `active` **or `completed``, provided retained Ashen access remains coherent.

### Independent probes

- active completed-packet return → exactly four ticks/no fare;
- unrelated origin → unknown destination;
- malformed/stale/wrong-player/wrong-origin → unchanged rejection;
- completion followed by later Ashen travel and another Starfall return → verify this retained route access is consistent with accepted known-route semantics and does not create a new service/access reward or knowledge grant;
- confirm return does not alter currency or geographic knowledge.

The completed-contract route persistence is intentional in current source/tests, but independent audit should verify it against the accepted product boundary rather than assuming the test itself settles the semantic question.

## 10. Turn-In Readiness Versus Presentation

### Static observation

Readiness calls deep target-campaign validation before checking the exact four-stage survey graph and Starfall location. This correctly prevents UI flags alone from authorizing payment.

### Independent probes

- fabricate objective checkmarks/flags without complete survey authority;
- fabricate “packet ready” presentation text;
- complete four-stage graph but remove one authoritative receipt;
- leave a survey projection repair pending;
- place player at a Starfall-looking site label while resolved travel location remains Ashen;
- duplicate the quest row.

All should remain unavailable and unchanged on submission attempt.

## 11. Exact Consequence Exclusion

The independent audit should compare before/after values for at least:

- silver and copper;
- standing;
- reputation/fame;
- skills;
- inventory;
- geographic knowledge;
- discovery Chronicle / Stormglass;
- body/resource state at turn-in tick;
- clock tick at turn-in;
- unrelated quest rows/operations.

Only the accepted consequences should differ. The four-tick travel may alter travel-owned body/resources/time before submission; turn-in itself should not add a hidden time/body cost.

## 12. Caller/UI Failure Boundaries

### Static observation

The real caller keeps the request command only for `transition_failed` technical retries and clears it for terminal results. `GameSessionContext` only applies `acceptedState`. QuestsPanel uses the authoritative path for Soundings and returns before the legacy helper.

### Independent probes

- force an expected rejection and confirm no snapshot application;
- force a technical transition failure and verify request identity is retained for retry;
- retry after the underlying technical condition is corrected;
- exact duplicate after completion should not create a second accepted UI state;
- completed UI remains non-resubmittable;
- legacy `turnInQuest` direct Soundings invocation cannot pay or complete.

## 13. Test-Agreement Risks

The following behaviors already have tracked tests, but deserve at least one independent probe because tests and implementation could share the same assumption:

- completed-contract Starfall return remains available;
- seven receipts are sufficient and correctly owned;
- feed-full projection posture is acceptable;
- source reconstruction is sufficient after future continuity changes;
- 5 MiB bounded storage is representative enough for this capability;
- survey content v3 presentation does not mutate retained v1/v2 authority.

Independent acceptance should challenge these assumptions rather than merely rerun the same fixtures.

## 14. Baseline Regression Priorities

After adversarial probes, reproduce the exact implementation test group and check:

- 123/123 baseline;
- 71-file content lint;
- UI Node config typecheck;
- broad UI diagnostic signature parity with known 137 baseline;
- direct Vite build;
- diff/bridge/export hygiene.

Do not spend high-reasoning time investigating every pre-existing broad TS diagnostic unless the signature set changes.

## 15. Static Review Disposition

`STATIC_REVIEW_COMPLETE_EXECUTABLE_PROBES_REQUIRED`

No static contradiction was found that by itself authorizes a Connector-side repair or invalidates the installed audit. The highest-value unresolved questions are deliberately handed to independent executable review, especially projection-capacity posture, real browser persistence, continuity/retry behavior and adversarial before-state binding.
