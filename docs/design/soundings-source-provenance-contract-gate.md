# Soundings Source Provenance Contract Gate

Date: 2026-09-22

Disposition: **PROVENANCE_CONTRACT_REQUIRED**. F1 remains **REPAIR_REQUIRED**; no production repair or independent acceptance is claimed.

Run: Soundings Retained Source Provenance And Before-State Binding Repair. Unversioned bounded investigation, parent not applicable, development milestone impact `none`, game-version impact `none`. Game `0.1.0-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, band `DEV-0.7.x` unchanged.

## Source And First Checkpoint

Clean synchronized inspected/start head: `50110d7e871d3959040abe3102be439dc23fea8c`. Runtime: `af0954c294d222bc1f8667266e4549b8619d5484`. Audit source: `e14ae0db059299f40e28c0bf25a4649ac7b07262`. Delta is the prior audit evidence and coordination only. The three September 20 Connector packets supplied orientation; focused source/caller/persistence facts were independently checked. One bounded read-only reviewer independently examined retention at the same source head and concurred with this gate.

The controlling prompt explicitly requires stopping at a provenance decision when existing retained authority cannot establish binding without a new trust/retention contract. That condition is met. This document establishes the gate and a decision-complete successor scope; it does not accept a new retention model.

Before edits the working tree was clean, master and origin/master matched after fetch/prune, and the scoped GitHub query returned no open PRs. The authorized edit surface is this evidence, its disposable executable probe, owner-contract appendix and current coordination. No runtime, existing tests, schema, dependency, generated output or historical audit probe is edited.

## One Finding, Both Variants

Running `node docs/dev/evidence/soundings-acceptance-2026-09-20/slice-a.mjs` freshly reproduced both F1 variants:

| F1 variant | Fresh observation | Disposition |
| --- | --- | --- |
| Historical wallet 16 -> 116 with source/hash/result/receipt recomputation | Deep validation succeeds; publication/restart and empty-cache caller return duplicate; actual gold stays 21 while receipts claim 116 -> 121 | Open; requires independent original admission binding |
| Nonexistent source artifact/publication IDs with canonical intent recomputation | Publication/restart and empty-cache caller return duplicate | Open; requires verified provenance linked to original admission |

The probe also preserves unchanged rejection for malformed authority, changed intent, stale/wrong identity and checks semantic key-order equivalence. It is historical faulty-behavior evidence, not a passing repair regression. No extra payment or ordinary UI exploit was demonstrated.

## Existing Evidence And Exact Missing Link

Source line references below are at the inspected head.

| Existing owner/evidence | What it establishes | Missing fact |
| --- | --- | --- |
| `campaign-session.ts:499-500,574-579` prepared source/control fingerprints | Original source is checked while admitting the command | Preparation is transient; no independent persisted original admission record |
| `campaign-session.ts:631-652` retained mutation result | Session-local accepted result, revision and source identity fields | Cleared by `createCampaignSessionControl` at lines 267-297 on publication/load |
| `saveManager.ts:54-70,637-674,2017-2055` immutable publication envelopes and campaign head | Exact published snapshots and artifact/address agreement | Loaded base may precede unpublished accepted mutations; head/previous-head is not a transition history |
| `saveManager.ts:2082-2086,2095-2104,2306-2315` recovery cleanup and control reconstruction | Publication recovery and fresh session initialization | Recovery is temporary; accepted mutation history is not rehydrated |
| `contracts.ts:1258-1285` campaign identity and migration/fork/defeat/retirement ledger | Campaign and continuity ancestry | No Soundings original before-state admission binding |
| `player-soundings-turn-in.ts:45` normalized intent | Loaded artifact/publication IDs plus current source snapshot/session revision | Artifact identifies session base, not necessarily immediately-before source |
| `soundings-turn-in-authority.ts:74-114`; `campaign-rules.ts:2067-2068` | Self-contained source reconstruction and receipt consistency | No independently supplied accepted record; nonexistent IDs satisfy string shape |

Paths above are under `packages/engines/game-engine/src`, except shared `packages/shared/types/src/contracts.ts` and `apps/rpg-ui/src/game-shell/saveManager.ts`.

Fresh executable gap probe:

```powershell
node docs/dev/evidence/soundings-provenance-2026-09-22/retention-gap.mjs
```

It uses ordinary creator/offer/travel/four shifts and disposable storage capped at 5 MiB. Four immutable artifacts exist before submission. The loaded artifact is at Ashen Reef tick 12 / publication revision 4; the valid submission source is at Starfall tick 16 / session revision 5 after unpublished return travel. No stored artifact equals the exact current source. The legitimate accepted session has two retained mutation results; after completion publication/restart there are zero retained results and zero accepted mutation IDs. The clean empty-cache retry remains duplicate. No user save is read or modified.

Thus checking source identity existence alone is insufficient; exact comparison to the loaded artifact rejects an ordinary valid command. An existing completion publication may help compare selected later retries, but choosing it as the original authority, retaining it, establishing first-publication admission and handling missing/ambiguous evidence requires an explicit contract. No existing complete replay log reconstructs all unpublished source mutations. Copying another digest beside the request is not independent evidence. Comparing latest wallet to historical receipt-after rejects legitimate subsequent spending/earnings.

## Smallest Successor Decision

Install **Soundings Accepted Admission Provenance And Retention Contract Decision**, documentation-only. Prefer evaluating a compact quest-specific admission witness owned by the existing campaign admission/persistence boundary, created from verified preparation rather than reconstructed from the mutable completed request. This is a proposal, not accepted implementation authority.

The decision must settle all of:

1. **Authority and binding:** exact request, account/campaign/character, source artifact/publication, source session revision, source/accepted continuity, original before-state fingerprint and accepted intent/result relationship. Explain the bounded independence model; arbitrary coordinated rewriting of all local storage is outside the claim.
2. **Creation and first publication:** who creates the record, when it becomes accepted/durable, how unpublished completion can retry, and failure/crash/retry ordering before/after publication. Never infer original acceptance merely because a new snapshot contains a self-consistent ledger.
3. **Retention and lookup:** separate independently owned record/address, uniqueness, collision/conflict/missing-evidence behavior, retention through later publications/non-head forks/defeat/recovery, and validation context for pure engine/caller/load/publication/projection seams. If selecting existing immutable completion publications instead, prove first-admission linkage and deterministic historical selection without a new hidden trust assumption.
4. **Compatibility:** existing absent-ledger saves remain valid. Existing completed saves lack the proposed record; do not silently synthesize trusted evidence from F1-controlled fields, silently disable valid saves, or invent migration authority. Establish when existing immutable publications can prove facts and explicitly request product direction if preservation and fail-closed binding cannot both be met.
5. **Size and scope:** single-owned survey graph; compact retained evidence and bounded 5 MiB ordinary sequence. No generic wallet ledger, signing service, anti-cheat infrastructure, new dependencies or broad architecture.
6. **Executable implementation contract:** map both F1 variants to unchanged rejection before duplicate, projection repair and publication after cache loss/restart; preserve valid historical retry after spending/earnings, non-head first submission, ancestry, defeat/recovery, survey versions, seven receipts, exact 5g and key-order equivalence. Keep independent post-repair A/B/C/D acceptance separate.

Accepted decision outcome must be either `PROVENANCE_CONTRACT_ACCEPTED_REPAIR_AUTHORIZED` with a fully bounded implementation prompt, or `PROVENANCE_CONTRACT_BLOCKED` with exact unresolved evidence/product choice. This investigation does not execute that successor decision or self-authorize its contract.

## Validation And Limits

The fresh F1 and retention-gap probes establish the contract gate, not repair success. Mechanical validation is recorded in current output. Browser acceptance and the remaining independent A/B/C/D matrix remain open; the memory-backed 5 MiB probe is not real-browser evidence. Broad UI TypeScript remains a known non-green baseline. No rejection regression is added because production is deliberately unchanged.

Guardrails: FP-001/017 ordinary acquisition, real caller and publication/load; FP-002 no acceptance from green baseline; FP-008/009 live scoped refs and source/publication separation; FP-010 both F1 variants mapped; FP-012 cache-loss/key-order/conflict evidence; FP-014/015 missing independent inputs explicitly blocks repair. FP-013/016 remain required successor preservation/projection checks, not fresh acceptance claims. Existing FP-014 already captures this failure; no new pattern is needed.

No branch integration/deletion is due. Exact retained refs/triggers and fresh merge-base/unique-path inventory are recorded in the branch register. Final publication is a later documentation/evidence commit, identified in the completion report after commit/push/readback.
