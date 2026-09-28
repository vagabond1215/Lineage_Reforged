# Post-F3 independent A/B1 evidence

Finalized 2026-09-28. Repository: `vagabond1215/Lineage_Reforged` only. Inspected source `567d250cae46a43c1c87123d63478aa9f47183f9`; exact runtime `7c8c980d01892b0f673afc5a5940aec33ad2d7a2`. The complete committed delta between them is eight coordination/design Markdown files, with no production/test drift. Concurrent audit evidence is not a production change.

Result: **CORE_AUTHORITY_PROBES_PASS** and **B1 publication/consumer boundaries pass**. B2 projection/continuity, C browser/storage, and D mechanical acceptance are separate gates; this report does not accept the complete package.

## Execution

Run from repository root:

```powershell
node docs/dev/evidence/soundings-post-f3-acceptance-2026-09-25/a-b1/independent-a-b1.mjs
node docs/dev/evidence/soundings-post-repair-acceptance-2026-09-24/slice-a.mjs
node docs/dev/evidence/soundings-post-repair-acceptance-2026-09-24/slice-b1.mjs
```

- `independent-a-b1.log`: **68 cases pass, exit 0**, final execution September 28. The September 25 version had 60 cases; final script adds eight explicit candidate/collision/address/stale-session checks. The final log replaces that preliminary log.
- `preserved-a-rerun.log`: **68 cases pass, exit 0**, September 25 independent audit rerun on the same runtime.
- `preserved-b1-rerun.log`: **14 cases pass, exit 0**, September 25 rerun; historical status string is B1_PARTIAL_PASS.

These are 150 case observations across three commands, with deliberate overlapping regression coverage, not 150 unique requirements. The two preserved scripts print historical `0df87bb7...` labels; the actual runtime used by these reruns is `7c8c980d...`. Historical negative evidence and source scripts remain unchanged.

## Evidence mapping

| Boundary | Evidence |
| --- | --- |
| Original prepared admission facts, browser-independent engine | New probe compares witness source and survey hashes to independently retained ready snapshot; original inputs unchanged. Engine duplicate/provenance run with global window getter throwing. |
| Both coherent F1 attacks before duplicate/repair/publication | New probe recreates wallet 16 -> 116 with recomputed intent/results/receipts and nonexistent artifact/publication. Structural validity established first; session and restarted variants reject provenance, keep snapshot/control/storage unchanged and cannot repair damaged projection. |
| Malformed/orphan/duplicate/wrong-owner graph and identity substitution | Preserved A independently rerun covers deep-empty authority/result, orphan result, missing source, duplicate request/occurrence/receipt, wrong owner, downgrade and 14 witness identity/source fields in session and restart contexts. |
| Retry, key ordering and stale preparation | Preserved A covers nested key-order equivalence, changed-intent conflict, revision/tick/source-artifact staleness. New probe adds retained mutation removal/duplication/substitution and missing/pending witness rejection. |
| Publication crash boundaries | New probe cuts before write, after write and during readback for candidate, recovery, pending witness, artifact, head, applied witness and address: 21 cases. Retry/startup preserves applied first-publication identity and payment; repeated recovery is byte-idempotent. |
| Exact recovery and immutable collision | New missing/changed candidate and immutable artifact collision cases reject byte-unchanged; newer campaign head blocks recovery. Preserved B1 also covers conflicting pending stable witness. |
| Stale/newer address and stale session | New cases prove older address superseded only by verified retained head; newer incompatible address and malformed address reject without replacement; old session cannot publish over advanced head. Newer address is a declared corruption fixture, not an ordinarily published newer artifact. |
| F2 witness omission and corruption | New pending/applied first-publication cases remove witness/fingerprint separately and together, use null/deep-empty and coherently changed sidecar; partial and final consumer calls reject every stored byte unchanged. |
| F2 stable evidence and cleanup | Pending forged status, missing/pending/changed stable witness, changed first artifact/publication/revision and changed envelope reject without promotion or cleanup. Valid partial completion changes only recovery; final removes it; repeat is byte-idempotent. |
| Later publication and compatibility | Ordinary travel then later sidecar-free publication still needs applied provenance. Valid case preserves original witness; missing/pending/conflicting evidence rejects. Ordinary and legacy v1 no-witness publications complete without payment replay or witness synthesis. |
| Terminal boundary | After terminal publication and address deletion, consumer cleanup plus repeated startup cannot resurrect the save or modify witness. |

Source inspection confirms `GameSessionContext.tsx` applies Soundings state only when `acceptedState` is present, and caller supplies it only for accepted engine results. Preserved A verifies legacy quest helper cannot pay. Witness creation precedes loss of verified preparation; original source facts are not synthesized from completed history. Accepted provenance/retention contract and F2/F3 focused records were reconciled with current prompt and live owner code.

## Limits and guardrails

Disposable in-memory storage and ordinary campaign helper provide executable exported-owner coverage. They do not establish browser quota, ordinary UI exploitability, all possible crash schedules, coordinated arbitrary replacement of every storage record, or full B2 compatibility. Candidate/address corruption and deliberate interruptions are labeled fixtures. No production, unit tests, schema, content, dependency or generated files were edited.

Relevant evidence satisfies FP-001/017 caller ownership and reachability distinction; FP-002 separate independent acceptance; FP-003/004/005/006 interruption/recovery/immutable boundaries; FP-009 exact runtime and historical labels; FP-010 explicit finding-to-probe mapping; FP-011/012/014/015 validation before effects, provenance and byte-preserving rejection. FP-008 branch lifecycle and FP-013/016 combined owner transitions/full-feed behavior remain coordinated outside this slice.
