# Soundings Durable Completion Post-Repair Independent Acceptance Audit

Date: 2026-09-24. Repository: `vagabond1215/Lineage_Reforged` only.

Final disposition: **REPAIR_REQUIRED**. Slice A passes; Slice B1 found acceptance-critical F2. Soundings is not independently accepted.

Unversioned independent audit; parent development milestone not applicable; development milestone impact `none`; game-version impact `none`. Game `0.1.0-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, band `DEV-0.7.x` unchanged.

## Source And Orientation

Starting clean local head `6781e277f634f8c29f27ec70366ebc977145f6b1`. Fetch/prune discovered five documentation-only preparation commits; fast-forward synchronized to inspected source `c4911cdc13c2e57927ee10ed1a5f40ac4d6de72e`. Full runtime-to-source changed-path comparison contains only docs. Exact runtime under audit: `0df87bb7afaa4d7fcc9f08b79b7528d60727c370`.

Reused all three September 24 Connector preflight/static-adversarial/handoff packets, verified their source/delta claims locally and read the accepted provenance contract. Existing implementation evidence is orientation only. No runtime, implementation-test, schema, content or dependency edits are authorized or performed.

One local branch, four hosted branches, zero open PRs by scoped GitHub query. Three non-default heads and protected/held dispositions remain unchanged; no lifecycle mutation due. Final source/publication separation and hosted synchronization must be recorded at completion.

## Slice A1 — Independent Provenance And Caller

**CORE_AUTHORITY_PROBES_PASS: 68 cases**, independent probe authored for this audit and rerun by the coordinator:

```powershell
node docs/dev/evidence/soundings-post-repair-acceptance-2026-09-24/slice-a.mjs
```

- Ordinary creator/acquisition helper supplies production setup; real Soundings caller returns accepted state without mutating original input. Legacy helper cannot pay.
- Both wallet 16 -> 116 and nonexistent source artifact/publication variants remain structurally valid but reject before trusted duplicate, caller state application, projection repair and publication, with unchanged state/storage. Session cases restore pre-first-publication storage; restart cases restore applied durable storage. Explicit publication error is `provenance rejected: invalid_witness`, not a stale-head rejection.
- Version downgrade, empty/deep-empty/orphaned/duplicated/wrong-owner evidence, missing/pending witness context and fourteen independent witness-fact substitutions reject.
- Durable missing/pending witness and wrong first artifact/publication/revision reject load and publication without storage mutation.
- Legitimate session/restart duplicate and nested key-order equivalence remain valid; changed semantic intent returns request_conflict; stale prepared revision/tick/artifact rejects.
- Source trace confirms QuestsPanel routes Soundings through the dedicated caller and returns before the legacy path; GameSessionContext applies only acceptedState. Prepared admission validates the original source fingerprint and source IDs/revision before creating witness facts.

Typed engine-context corruption and persistence-owned record validation are deliberately distinct: save persistence resolves its own retained witness and does not grant authority merely from an applied witness supplied by a caller. This probe does not claim resistance to coordinated replacement of all local storage.

## Slice B1 — F2: Consumer Completion Can Discard Pending Witness Recovery

**PERSISTENCE_OR_PROJECTION_DEFECT_FOUND**, reproduced independently and rerun by the coordinator on the exact runtime above. Thirteen prerequisite/control cases pass; the defect assertion exits 1 intentionally:

```powershell
node docs/dev/evidence/soundings-post-repair-acceptance-2026-09-24/slice-b1.mjs
```

1. Create an ordinary campaign, submit through the real caller, and declare an `active_history` publication consumer.
2. Interrupt publication immediately before the applied-witness write. The immutable artifact and head exist; recovery is `head_verified`, stable witness is `pending`.
3. Control: completing the declared consumer with the untouched recovery throws `recovery must finish` and preserves every byte.
4. Remove only `soundingsAdmissionWitness` and `soundingsWitnessFingerprint` from the recovery record. Preserve its version-2 envelope, artifact, head and stable witness.
5. Call exported `completeCampaignPublicationConsumers(accountId, publicationId, ['active_history'])` again.

Expected: reject unchanged and retain recovery until required witness durability succeeds. Actual: no error, recovery deleted, stable witness still pending. Observed `rejected:false`, `recoveryRetained:false`, `storageUnchanged:false`. This discards the retained exact candidate needed by witness recovery before the accepted first-publication protocol is complete.

Cause: `apps/rpg-ui/src/game-shell/saveManager.ts`, `completeCampaignPublicationConsumers` (line 1418 at inspected runtime), gates witness verification solely on optional `recovery.soundingsAdmissionWitness` presence. Absence is not a valid legacy exemption when the retained envelope requires provenance. Accepted provenance contract sections 5 step 9 and 6 require durability before completion/cleanup. This is a fail-closed owner-boundary violation, not a demonstrated payout exploit or general coordinated-tamper attack.

**Reachability limitation:** the executable reproduction calls the exported owner API directly after corrupting recovery evidence. Current App startup runs `recoverPendingCampaignPublications` first; ordinary save/retirement callers complete consumers after successful publication. Those upstream gates mitigate ordinary UI access. Ordinary UI reachability of premature completion is not established. The owner contract nevertheless requires malformed evidence to reject at this cleanup boundary.

Passing B1 evidence: pending/head/applied writes interrupted before, after and on readback (nine cases) recover exact original first-publication identities and once-only payment/ledger, then repeat startup byte-idempotently; pending witness conflict, immutable artifact collision and newer head conflict reject byte-unchanged (three cases); unchanged valid premature consumer completion rejects (one control).

## Stop Decision, Guardrails And Next Route

F2 triggers the active prompt's critical-defect stop rule. B1 is partial/failed; B2 continuity/compatibility/full-feed projection, C ordinary browser/storage and D mechanical baseline were **not executed in this audit**. No new full-feed, browser, capacity, legacy-continuity or mechanical acceptance conclusion is available. Prior 143 tests, 71-file lint, 137-diagnostic baseline and browser/storage measurements remain implementation history only.

FP-001/017: ordinary setup and real caller, explicit owner-API versus UI reachability distinction. FP-002: independent audit, no production self-repair. FP-008/009: protected refs and runtime/source/publication separation. FP-010/014/015: independent malformed/forged evidence and exact before-state binding in A. FP-012: session/restart uniqueness and F2 omission at consumer completion. FP-003/004/005/006/011: B1 interruption, conflict, readback and fail-closed ordering. FP-013/016: continuity and full-feed gates remain unexecuted, not satisfied by this audit.

Smallest successor: **Soundings Publication Consumer Completion Witness Gate Repair**, package S, unversioned bounded repair under the accepted provenance contract. Validate provenance-required recovery independently of optional witness field presence before changing consumer completion or deleting recovery. Preserve ordinary/legacy no-witness behavior and terminal cleanup without recreating deleted playable addresses. Add desired-behavior regression and positive controls, then return to a separate independent audit of all required slices on the new target. No new product decision, milestone or game-version increment is implied.

## Publication

Only independent evidence and coordination documentation changed. No production/runtime/test/schema/content/dependency edits. Diff/whitespace checks are required before publication; exact publication commit, push/fetch/clean hosted equality and hosted prompt/output/handoff readback are reported at completion. This publication's Git commit identifies the audit separately from inspected source and runtime. No branch integration/deletion or PR action is due; retained review triggers remain in the branch register.
