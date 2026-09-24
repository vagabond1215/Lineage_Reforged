# Connector Static Adversarial Review — Soundings Post-Repair

Date: 2026-09-24

Repository: `vagabond1215/Lineage_Reforged` only.

Posture: static Connector review of runtime `0df87bb7afaa4d7fcc9f08b79b7528d60727c370`. No production/test mutation and no acceptance claim.

## 1. Purpose

Reduce the independent audit's expensive discovery work by separating already-covered implementation tests from acceptance-critical probes that should be independently recreated rather than merely rerunning implementation assertions.

## 2. Static Findings

### A. Witness is created from prepared source authority

The implementation constructs the session witness from the verified source snapshot and preparation/result facts, including `fingerprintSoundingsState(sourceSnapshot)`, source artifact/publication/revision/continuity, accepted continuity, survey fingerprint, canonical-intent fingerprint, result/occurrence and accepted tick.

This is the correct independence seam to probe. The audit should alter completed retained history while leaving the independently created witness untouched and require failure.

### B. Structural validation deliberately remains weaker than provenance validation

`validateSoundingsTurnInAuthority(...)` accepts both authority versions 1 and 2 and validates internal completion coherence. `verifySoundingsAdmissionProvenance(...)` is the trust-sensitive layer.

The audit should preserve at least one forged state that remains structurally valid while proving provenance rejects it. A structural validator rejection alone does not independently demonstrate F1 closure.

### C. Witness-backed legacy downgrade is explicitly closed

The final runtime adds an explicit rule: if a witness is supplied, completed Soundings authority must be version 2. Same-session and restart regressions exist for a version-2-to-version-1 substitution.

Independent audit should still recreate this without importing the implementation test helper as authority.

### D. Durable applied witness verifies the first publication

`saveManager` loads applied witness evidence and verifies its first durable artifact/publication/head revision plus provenance against that retained artifact.

This narrows the most valuable persistence attacks to witness/address/publication substitution, immutable artifact collision, recovery-stage manipulation and missing first-durable evidence.

### E. Projection repair now requires verified provenance

`repairSoundingsTurnInProjections(...)` returns no repair unless `verifySoundingsAdmissionProvenance(...)` is `verified`.

The audit should independently damage Chronicle and notification projections under valid, invalid, legacy and full-capacity conditions. It should distinguish refusal to repair from failure of unrelated continued gameplay.

## 3. Priority Independent Probe Matrix

### P0 — acceptance-critical provenance

1. Wallet-history F1 rewrite with recomputed mutable request/result/receipts, same-session.
2. Same F1 after save/restart/cache loss.
3. Nonexistent source artifact/publication rewrite, same-session and restarted.
4. Witness-backed authority downgrade version 2 -> version 1.
5. Version-2 completion with witness removed.
6. Version-2 completion with a pending witness substituted for applied evidence after restart.
7. Matching request id with witness facts altered independently from snapshot history.
8. Witness copied/transplanted from a different account/campaign/character/request context.
9. Source/accepted continuity substitution that remains internally coherent enough to reach provenance verification.
10. First-durable artifact/publication/head-revision substitution or removal.

All P0 failures must reject before trusted duplicate classification, projection repair or new publication and must preserve source snapshot/control/storage except for already-existing recovery state.

### P1 — publication/recovery durability

11. Interruption before/after pending witness write/readback.
12. Interruption before/after campaign-head publication.
13. Interruption before/after applied witness promotion/readback.
14. Repeated startup recovery is byte-idempotent.
15. Conflicting retained pending witness is never overwritten from snapshot claims.
16. Conflicting retained applied witness is never overwritten.
17. Existing immutable artifact at target id with conflicting bytes blocks recovery without replacing bytes.
18. Newer/stale campaign head or address cannot cause old recovery to rewrite newer truth.
19. Terminal cleanup/consumer completion does not recreate a deleted playable address.
20. Applied witness remains identical across later publications.

### P1 — continuity and historical semantics

21. At-head completion.
22. Non-head first completion creates/preserves the proper child continuity.
23. Later descendant fork retains original witness unchanged.
24. Later admitted spend and later earning both preserve trusted historical duplicate without rolling wallet back.
25. Defeat/recovery preserves witness bytes and historical completion authority; classify the Starfall-harbor recovery limitation separately from witness validity.
26. Legacy version-1 no-witness completion remains loadable/playable/saveable, cannot repay and cannot projection-repair from unverified history.

### P1 — projection/full-feed

27. Missing Chronicle only.
28. Missing notification only.
29. Both missing, repaired in either call/order path.
30. Misplaced but byte-correct rows.
31. Same-id conflicting rows.
32. Equal-tick ordering with opaque newer/older rows.
33. Chronicle cap full.
34. Notification cap full.
35. Full-feed repair refusal followed by unrelated accepted gameplay and later save/restart.
36. Repeated repair/restart cannot duplicate completion projections or evict newer unrelated truth.

### P2 — ordinary player path/storage

37. Fresh creator/start -> offer/accept -> Ashen -> two shifts -> explicit save/reload -> remaining shifts -> packet-ready -> 4-tick Starfall return -> submit -> exact +5g -> completed/tracking clear -> Chronicle -> save/reload -> no resubmit -> later travel/save.
38. Unsupported origins do not inherit Ashen->Starfall route.
39. No fare/Knowledge/standing/reputation/skill/item/service/salvage side effects.
40. Measure retained UTF-16 storage and intermediate writes under the existing 5 MiB bounded test posture.

## 4. Where Not To Spend Audit Budget

Do not spend independent-audit time re-deriving:

- accepted 5g product terms;
- why the witness owner is save/persistence rather than account value;
- generic quest/wallet framework alternatives;
- broad UI shell architecture;
- broad TypeScript cleanup;
- unlimited-history guarantees;
- resistance to coordinated arbitrary replacement of all browser storage.

Those are outside the installed audit or already decision-complete.

## 5. Static Risk Prioritization

Highest-value independent scrutiny:

1. first-durable witness/artifact identity and recovery ordering;
2. version-2 missing/conflicting evidence and no legacy fallback;
3. structural-valid-but-provenance-invalid forged histories;
4. full-feed projection terminal posture;
5. non-head/descendant/defeat continuity after applied witness;
6. ordinary browser/storage reproduction.

No static finding in this pass is itself a confirmed defect. The implementation should remain unchanged until the separate executable audit produces evidence.

Disposition:

`STATIC_ADVERSARIAL_PACKET_READY`
