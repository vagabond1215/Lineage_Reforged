# Soundings Durable Completion Independent Acceptance Audit

Date: 2026-09-20

Disposition: **REPAIR_REQUIRED**.

Slice A checkpoint: **CORE_AUTHORITY_DEFECT_FOUND**. This is a completed negative acceptance decision, not full coverage of Slices A-D.

Repository: `vagabond1215/Lineage_Reforged` only. Unversioned independent audit; parent development milestone not applicable; development milestone impact `none`; game-version impact `none`. Game `0.1.0-prealpha`, playability `INTEGRATED_LOOP`, accepted milestone `DEV-0.7.0`, band `DEV-0.7.x` remain unchanged.

## 1. Exact Source And Scope

Initial clean checkout: `fb8e5df153bc744c06510493be28d129492697af`. Fetch/prune and fast-forward synchronized clean master to audit source `e14ae0db059299f40e28c0bf25a4649ac7b07262`. Tested runtime remains implementation `af0954c294d222bc1f8667266e4549b8619d5484`. The complete intervening changed-path inventory contains only publication bookkeeping, the three September 20 Connector packets, and current prompt/handoff pointers. No runtime, content, schema, test or dependency drift.

Used all three prepared packets: preflight, static adversarial review and execution handoff under `docs/dev/connector-*-soundings-*-2026-09-20.md`. Reused their broad orientation, verified the live delta, and started at Slice A. The handoff's section 3 requires stopping broad audit expansion on an acceptance-critical defect. Production remains unchanged; Slices B/C and remaining independent Slice-A cases are not claimed complete.

Controlling terms remain the accepted Soundings authored-terms and quest-turn-in owner-contract decisions. In particular, five gold, no other reward, one-time completion, unchanged rejection, retained-source validation and deep authority before duplicate classification remain requirements.

## 2. F1 — Retained Source Claims Can Be Rebound After Acceptance

Priority: acceptance-blocking. Surfaces: `soundings-turn-in-authority.ts` retained source reconstruction/validation; `player-soundings-turn-in.ts` retained-request preparation and duplicate handling; campaign publication/load validation. Initial prepared admission checks the original source fingerprint in `campaign-session.ts`; the restarted validator does not independently bind the replacement source to that original accepted transition.

Reproduction is committed as `docs/dev/evidence/soundings-acceptance-2026-09-20/slice-a.mjs`. Run from the repository root:

```powershell
node docs/dev/evidence/soundings-acceptance-2026-09-20/slice-a.mjs
```

This is historical audit evidence, not a regression test that defines desired behavior. Its assertions deliberately confirm the faulty acceptance at the inspected runtime. After repair, retain the evidence and add ordinary regression tests that require rejection.

1. Use the existing ordinary-campaign helper: production creator, publication/load, offer acceptance, travel, four survey caller shifts with halfway restart, final publication and Starfall return. No prerequisite injection.
2. Submit through `submitSoundingsTurnInCaller`; publish and restart. Legitimate payment is 16 to 21 gold, with 8 silver unchanged.
3. Modify only a disposable copy of the accepted snapshot. Parse retained `normalizedIntent.sourceSnapshot`, change source gold 16 to 116, serialize it, reconstruct its unchanged survey graph and recompute `snapshotFingerprint`. Recompute the request canonical string, result `currencyBefore`, and seven receipts. Do not change the live wallet, survey graph, campaign control or immutable earlier publications.
4. `isTargetCampaignSnapshot` returns true. A command matching that rewritten retained intent returns `duplicate`. Original unmodified command correctly returns `request_conflict`, so this does not claim the old command bypasses conflict detection.
5. Publish the altered snapshot using the production save manager, reload it, clear the caller cache and call `submitSoundingsTurnInCaller` with the original request ID. It prepares from the rewritten retained intent and returns `terminal_result` / `duplicate`, with null acceptedState. Retained receipt says 116 to 121 gold; actual wallet remains 21.
6. A narrower variant restores the valid original Soundings graph, then changes only `sourceArtifactId` and `sourcePublicationId` to `artifact.audit.nonexistent` / `publication.audit.nonexistent`, recomputing only canonical intent. Snapshot validation, publication/restart and fresh-caller duplicate classification still succeed. No matching original artifact/publication is supplied.

Both variants were independently reproduced by a bounded read-only second reviewer against the same runtime source. The primary agent reran the committed combined reproduction successfully. During probe packaging, a second variant initially reused a stale campaign control and correctly failed publication with “Campaign head changed after this session was loaded.” The final script carries the latest control into that variant; the finding does not depend on bypassing the head check.

### Interpretation And Limits

The active matrix and static packet sections 3-5 explicitly require forged/recomputed retained source probes and an independently binding before-state. Internal consistency of a replaceable source and its replaceable digest does not satisfy that requirement. The two variants are one provenance/binding finding, not two unrelated repairs.

This is an adversarial retained-history test, not an ordinary UI exploit, spontaneous corruption, extra payout or proof that arbitrary hostile full-save rewriting can be prevented without an external trust root. The actual wallet is not credited again. No user save was accessed or changed. Do not expand the repair into general anti-cheat, signing, remote trust infrastructure or a generic wallet ledger.

Smallest repair boundary: establish and validate quest-specific source provenance against independently retained accepted source/transition authority at load/publication/retry. Preserve legitimate later wallet changes, continuity forks and compact survey storage. Another digest copied beside the same mutable source is insufficient; comparing every later wallet directly to receipt-after would incorrectly reject later accepted spending/earnings. If existing retained authority cannot support the required binding, record the precise missing contract and stop at a bounded provenance decision rather than inventing a new trust system.

## 3. Positive Slice-A Evidence

The committed independent probe also verifies unchanged source snapshot/control and no benign duplicate for corrupted request linkage, occurrence identity, payment, receipt owner, missing receipt, duplicated receipt and continuity ancestry. Wrong account/campaign/character commands, stale revision/tick and duplicated quest identity reject unchanged. Equivalent nested object-key ordering returns an exact duplicate; semantic revision changes return request_conflict. The ordinary caller returns acceptedState only on acceptance; a clean completed retry returns none; direct legacy `turnInQuest` cannot pay Soundings.

Source tracing confirms QuestsPanel returns through the dedicated Soundings caller before legacy turn-in, and GameSessionContext applies only acceptedState. The fingerprint implementation and readiness/authority/prepared-admission boundaries were inspected. This is not a claim that every independent negative probe in the prepared packet completed before the stop.

## 4. Fresh Mechanical Validation

- Exact combined command in the implementation record: **123/123 passed**, 0 failed/skipped.
- Content lint: **71 files**, pass.
- UI Node configuration typecheck: pass.
- Broad UI typecheck: **137 diagnostics**; normalized line/column-independent signatures compared to `.tmp-dev070-ui-typecheck.log`: **0 differences**. Broad TS remains non-green. No production file changed.
- Direct Vite build from `apps/rpg-ui`: pass, **214 client modules**; existing Browserslist-age and chunk-size warnings remain.
- Soundings engine export and all five TS/JS bridges inspected.
- Independent reproduction above: exit 0, confirming F1 and the listed positive guards.
- Final diff/whitespace/intended-file review and hosted synchronization are recorded by current output and the publication completion message.

The green baseline does not cover F1. No new browser/storage acceptance was attempted after the Slice-A stop. The implementation's earlier browser sequence and approximately 3.1 MB measurement remain historical evidence only. Projection capacity, both-order repair, later forks/defeat/recovery, ordinary browser flow and all remaining acceptance matrix rows still require independent post-repair evaluation.

## 5. Guardrails And Branches

FP-001: real runtime caller and production publication/load exercised; UI application seam traced. FP-002: independent adversarial probe disproves acceptance despite 123 green tests. FP-008/009: exact source delta, refs and distinct publication identity. FP-012: deep corruption and exact/changed/key-reordered duplicate probes. FP-014/015: F1 demonstrates that recomputed strings do not prove source provenance. FP-017: prerequisite acquisition through ordinary owners; mutation occurs only in negative copies afterward. FP-013/016 remain required post-repair audit gates, not independently accepted here. F1 extends the evidence for existing FP-014/015; no new generalized pattern ID is needed.

Fresh fetch: one local branch and four hosted branches; scoped GitHub query: zero open PRs. Readiness `59c103c3a06d55f35bffa735fd4b7814dffb583e` and prompt-integrity `58a34e37ee531aa1f6c87086b4a4a6d20d571f9f` remain protected. Administration `210df5bcc017a8f31d621a553b5496c668540d29` remains held. Prior unique-path/disposition evidence reused because those heads are unchanged. No integration/deletion or disposition change due; the fast-forward only synchronized master. Exact next review triggers remain in the refreshed branch register.

## 6. Disposition And Successor

**REPAIR_REQUIRED**. Install **Soundings Retained Source Provenance And Before-State Binding Repair**, unversioned and limited to F1. Follow with separately installed independent acceptance; resume the prepared matrix after revalidating the repaired Slice A. Do not implement repair during this audit, self-accept the result, allocate DEV-0.7.1, advance GAME_VERSION or begin broad shell work.
