# DEV-0.7.1.3 — Independent G9 Lifecycle Parent Re-audit

Date: 2026-10-06. Source: clean synchronized `master`/`origin/master` `cf6e27b450a22c1ebddd02095bfa52a26540a2db`. Support suffix of planned `DEV-0.7.1`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Development impact: `supports_current_band`; Game-version impact: `none`.

## Disposition

**G9_PARENT_REPAIR_REQUIRED; G10_ACTIVATION_HELD.** The DEV-0.7.1.2 repair suite is green, but two new independent, single-row corruptions of otherwise coherent version-1 account-owned campaign graphs still let both whole-account reset and delete commit. They erase surviving authority and write a lifecycle receipt. G9 parent acceptance, planned `DEV-0.7.1`, G10, deployment and Game-version decisions remain held. Install `DEV-0.7.1.4` as a narrow repair of the existing destructive graph preflight, then independently re-audit the parent again.

## Fresh adversarial evidence

An isolated native browser probe reused the actual lifecycle owner and coherent first-campaign fixture, with a distinct randomized IndexedDB database and target/other synthetic accounts per case. It was temporary and removed after observation. The probe first exercised a valid control, then changed exactly one required row while leaving the other version-1 rows intact. Each result was observed directly in the browser; these are synthetic storage states, not production-account reachability.

| Finding and state before transition | Reset | Delete | Defect |
| --- | --- | --- | --- |
| Valid G9E deleted address: deleted current generation, receipt, first recovery, artifact, control and history retained | `committed` | `committed` | None; valid control |
| **F2:** after that valid deletion, remove only the `currentSlotGenerations` row; deletion receipt, first recovery, artifact, control and account history survive | `committed` | `committed` | Missing current deleted-generation authority was laundered into successful erasure |
| Valid first plus completed descendant to empty `quick-save`, with recovery `expectedSlotAddress: null` | `committed` | `committed` | None; valid control |
| **F3:** change only that descendant recovery's `expectedSlotAddress` to nonexistent `artifact.not-retained` / `publication.not-retained`; all actual first and descendant rows remain | `committed` | `committed` | Forged destination CAS provenance was laundered into successful erasure |

In all eight probes the other account's 12-family rows stayed byte-equivalent. The four corrupt probes changed the target account, erased target rows and created the reset/delete lifecycle receipt; the required outcome was `invalid_record` before any write, with unchanged account revision/generation, target bytes, other-account bytes and no receipt. The F2 gap is the published-campaign check accepting a deletion receipt without proving the current deleted pointer exists. The F3 gap is the descendant check accepting a schema-valid nonnull `expectedSlotAddress` without binding it to the retained prior destination publication. See `validateDestructiveGraph` in `apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts`; the destructive transaction calls it before writes, so both faults are inside that preflight.

## Parent contract and fresh checks

Independent read-only caller and graph inspections at the same source head traced selected `EpochApp` Settings/picker through the account adapter, and Normal defeat, Legacy, retirement and slot deletion through G9B–G9E owners. No separate caller defect was confirmed. Retained localStorage lifecycle code is outside the selected App. Existing holds on unsaved combat source and normal/hardcore terminal callers remain explicit; synthetic owner checks cannot accept them as ordinary reachability.

Fresh browser owner matrix: G9F lifecycle **64/64**, G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first campaign **5/5**, descendant **16/16**, witnessed descendant **11/11**. The G9F suite covers prepared/pending/terminal/witnessed validity, several row losses, historical slot reuse, zero-live-address terminal cleanup, password/CAS, two owners, generation fencing, restart, abort/quota at all eight reset/delete writes, lost readback and exact retry. Its green count does not cover F2/F3. Selected-App Settings reset and delete and picker delete each visibly retained `Campaign artifact is missing.` after an independent required-artifact corruption; picker wrong password displayed its own rejection. This demonstrates blocked presentation for a detected corruption, not fail-closed handling for F2/F3.

Focused campaign/Soundings/survey Node selection **172/172** passed; Node UI-config typecheck passed. App-local native Vite build passed on permission-adjusted retry after the sandbox could not unlink ignored generated `dist/.openai/hosting.json`. Broad UI typecheck remains nonzero with **137 diagnostics**, the known baseline; no green broad typecheck is claimed. No production source, schema, dependency, tracked generated output, deployment or Game-version change occurred. Fresh validation does not override the four corrupt-case failures.

Applicable guardrails: FP-001 (selected caller), FP-002/014/019 (retained cross-store existence and provenance before erasure), FP-003/004/005/006/011/012/013 (failure/restart/contention/readback), FP-008/009 (source and branch identity), FP-015/017/018 (failure boundaries, synthetic limits and generation fencing). F2/F3 extend the evidence for FP-019 rather than requiring a new generalized pattern. The historical multi-address receipt after slot reuse remains an unconfirmed edge to test during repair; no finding is claimed for it here.

Branch/PR review: fresh fetch/prune found two local and six hosted branches including `master`, zero open PRs. Readiness and prompt-integrity remain protected; administration, creator planning and creator implementation retain named-consumer holds and their register triggers. This audit consumes none. No merge, rebase, integration, deletion or disposition change is due. Suggested commit: `docs(persistence): hold G9 on residual destructive graph gaps`.
