# Soundings Durable Completion Post-F2 Independent Acceptance Audit

Date: 2026-09-24. Repository: `vagabond1215/Lineage_Reforged` only.

Final disposition: **REPAIR_REQUIRED**. Finding **F3: completed Soundings authority blocks authorized survey projection repair**.

Unversioned independent audit; parent development milestone not applicable; development milestone impact `none`; game-version impact `none`. Game `0.1.0-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, band `DEV-0.7.x` unchanged.

## Source And Checkpoint Provenance

Started clean at `b857db9fce62604cc0a3b9e36fd498681985f269`; fetched and fast-forwarded three documentation-only commits to `21d52a7b6cfcbcfb6e4fd304011f066615ba3866`. Exact runtime remains `0383cedc99a4c3d5e2c9b47cf0665683720aef9e`. Complete runtime-to-source changed-path inventory is documentation only. Runtime/tests/schema/content/dependency comparison is empty; preserved A/B1 probes are unchanged.

Current prompt explicitly permits the operator checkpoint in `docs/dev/evidence/soundings-post-f2-operator-checkpoint-2026-09-24.md`. The operator reported a detached exact-runtime HEAD and A68/B1-14 passes, including repaired F2 rejection with unchanged storage. This run verified the checkpoint applicability conditions and did **not** rerun A/B1. Embedded old probe labels remain historical. This is operator-supplied evidence, not execution newly performed by this audit.

Reused September 24 post-repair/F2 Connector packets and verified focused owner code against accepted authored, survey, turn-in and provenance contracts. Production/test files remain unchanged.

## B2 Executed Evidence

All commands run from repository root against the runtime-equivalent tree above. Independently authored probes are under `docs/dev/evidence/soundings-post-f2-acceptance-2026-09-24/`.

| Probe | Coordinator-verified result | Scope |
| --- | --- | --- |
| `node docs/dev/evidence/soundings-post-f2-acceptance-2026-09-24/b2-consequences.mjs` | 7 cases pass, exit 0 | Ordinary four-tick return, no fare/knowledge/access award, no universal Starfall profile, unsupported origin/unaccepted quest/missing access reject unchanged, exact +5g/+0s/seven receipts, quest lifecycle, all other player/game/survey/access surfaces unchanged, restart duplicate, completed return. |
| `node docs/dev/evidence/soundings-post-f2-acceptance-2026-09-24/b2-continuity.mjs` | 8 compound cases pass, exit 0 | Current/non-head first submission, child/descendant continuity and restart, admitted spend/earn fixtures, legacy no-witness load/play/save, defeat/recovery witness preservation with explicit reachability limits. |
| `node docs/dev/evidence/soundings-post-f2-acceptance-2026-09-24/b2-projections.mjs` | 8 cases pass, then F3 desired-behavior assertion fails, exit 1 | Soundings Chronicle/notification missing/misplaced repair/restart, conflicting same-ID rejection, opaque equal-tick ordering; then pre/post-completion survey Chronicle repair comparison. |

The consequences probe's initial expected-player comparison omitted the legitimate active/completed quest-ID transition. Its expectation was corrected to include that authored lifecycle change; all unrelated player surfaces still compare exactly. This was a probe correction, not a product defect.

## F3 Reproduction And Cause

1. Acquire ordinary survey readiness through creator/accept/travel/four survey shifts/return owners.
2. Control: remove the latest survey Chronicle projection before Soundings completion. Shared campaign validation remains true; call `repairPlayerSurveyActivityProjection` for that result/Chronicle. Result: accepted `projection_repaired`.
3. Submit Soundings normally, publish and restart with applied witness.
4. Remove only the same survey Chronicle projection from a copy of the completed snapshot. Retained survey authority, Soundings ledger and witness remain unchanged; shared campaign validation remains true.
5. Invoke the same survey repair owner. Actual: rejected `projection_invalid`, source/control/storage unchanged. Expected: authorized projection-only repair remains available without changing survey result, Soundings payment or original admission witness.

Coordinator observation:

```json
{"kind":"chronicle","controlCode":"projection_repaired","controlAccepted":true,"postCompletionCode":"projection_invalid","postCompletionAccepted":false,"sourceValid":true,"sourceUnchanged":true,"storageUnchanged":true}
```

`packages/engines/game-engine/src/player-survey-activity-advancement.ts` appends the required projection repair record at line 2143, then validates the candidate at line 2144. `soundings-turn-in-authority.ts` line 93 demands that the entire current survey graph equal the survey fingerprint frozen at turn-in. Lines 98-99 also reconstruct historical source by substituting the current graph. Appending valid later `projectionRepairs` therefore invalidates completed Soundings authority.

The accepted survey owner contract (`ashen-reef-survey-activity-advancement-scope-and-owner-contract-decision.md`, section 11) allows projection-only notice/Chronicle repair without changing the survey result. The active audit requires both owner repair orders and preservation of nested survey ownership. Completion cannot disable that accepted transition merely because later repair bookkeeping differs from the original admission graph.

This is an authorized owner-transition compatibility defect. No payment replay, destructive mutation, witness forgery or ordinary UI exploit is demonstrated. The reproduction explicitly removes a projection in a disposable fixture; the proof concerns the repair API, not the frequency of ordinary missing-row production. Current rejection preserves state, but prevents the authorized repair.

## Limits And Stop Rule

F3 triggers the critical-defect stop rule. B2 result is **PERSISTENCE_OR_PROJECTION_DEFECT_FOUND**. The probe stops at the first failed Chronicle repair assertion; post-completion survey notification repair, remaining both-owner orders, full-feed/cap terminal posture and unrelated gameplay after full-feed failure are **unexecuted**, not inferred pass or fail.

C ordinary browser/storage and D mechanical regression are **not executed in this audit**. Browser readiness was inspected read-only (existing localhost login page); no account/save was modified and no ordinary-flow acceptance is claimed. Historical 165-test/build/lint/browser/capacity results remain repair evidence, not this audit's fresh evidence. No new storage measurement or final full-feed conclusion is available.

Continuity limits: spending/earnings use explicitly admitted owner fixtures, not shop/job UI proof. Legacy completion is a declared version-1 fixture before witness persistence. Ordinary Starfall is `harbor`, so the existing safe-`settlement` recovery requirement prevents ordinary harbor completion; pending defeat/publication/recovery reject unchanged. An explicitly added safe-settlement fixture exercises real pending/completion/publication owners and verifies witness preservation. This known separate reachability limitation is not repaired or silently accepted here.

## Guardrails And Successor

FP-001/017: ordinary prerequisites and explicit fixture/API/UI limits. FP-002: independent negative audit, no self-repair. FP-008/009: protected refs and source/runtime/publication separation. FP-010: F3 mapped to exact source/reproduction; F1/F2 chronology/checkpoint preserved. FP-011/012/014/015: unchanged failure evidence and original admission binding retained. FP-013/016: nested owner repair compatibility reveals F3; incomplete full-feed gates remain open. Recovery-related FP-003/004/005/006 evidence is limited to the retained B1 checkpoint and bounded B2 continuity checks.

Smallest successor: **Soundings Survey Projection Repair Compatibility Repair**. Preserve immutable accepted survey/admission facts while allowing independently validated later projection-only repair history. Do not simply remove the fingerprint check, strip arbitrary mutable fields, recompute the witness from the latest graph, or weaken F1/F2 protections. Reconcile source reconstruction, witness verification and survey repair ownership; preserve first-publication and legacy/terminal compatibility. If existing retained evidence cannot distinguish admissible later repairs from forged history, record the precise missing contract/retention requirement before implementation rather than inventing authority.

## Branch And Publication Review

One local/four hosted branches; scoped query zero open PRs. Exact three non-default heads/merge bases/unique paths rechecked unchanged. Source master-only/ref-only counts: readiness 400/2, prompt-integrity 347/1, administration 178/1. Protected/held dispositions and triggers in branch register remain unchanged; no merge/rebase/integration/deletion/PR/protection action due or performed.

Only audit probes and relevant coordination documentation changed. Final publication is a later documentation/evidence commit distinct from runtime and inspected source. Completion report supplies exact pushed head, fetch/prune/clean local-tracking-hosted equality and hosted prompt/output/handoff readback.
