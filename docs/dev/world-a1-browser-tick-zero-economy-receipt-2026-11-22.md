# World A1 browser content and tick-zero economy receipt

2026-11-22, America/New_York. `WORLD_A1_READY_FOR_CONNECTOR_REVIEW`. Unversioned World support, no parent milestone. Development impact `supports_current_band`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, game-version impact `none`.

Resumed draft [PR #102](https://github.com/vagabond1215/Lineage_Reforged/pull/102) at `d3cd548f6b21aff11c40637c3e16026502f8e6e2`, on `connector/l3a-world-v8-migration-preflight-2026-11-17`, with master `20abe83c2aa97ba4699711a9815d9b95e0d3df44`. The merge base is `aae4d65cdc65482032d62acef74316ed59c1eacf`. Master introduced no changes under apps, packages, tests, tools, or workflows since divergence. The authoritative manifest was copied verbatim from master without merging either master or the UI topic. The [owner work order](https://github.com/vagabond1215/Lineage_Reforged/blob/a55cec30de87a6e256f984311b59e121210f9961/docs/dev/world-creation-persistence-first-functional-milestone-2026-11-22.md) is pinned to UI topic `a55cec30de87a6e256f984311b59e121210f9961`. Source checkpoint `3994cccf70b98546f0092214ec8148cca3e55dbb` is `feat(world): verify browser tick-zero economy against pinned content`.

## Verified source path

- `apps/rpg-ui/qa/first-world-a1/` is a separate Vite build. It verifies the exact manifest blob `8dd06caec702c439ed36b59ac24c146b266adffb` and every original input, reversing CRLF checkout conversion only when the resulting bytes match the exact pin. BOM bytes survive hashing. It rejects Node built-ins and unpinned executable inputs in the browser graph. The browser loader transform replaces only the pinned `content.js` file-read seam and freezes parsed content. The JS bridges, settlement, spatial, economy, market, simulation and time algorithms remain the original owners.
- Original 41-source aggregate `sha256:9482870a7784f877bb8c789f65f29dea8fd62a18392381dc1ffd7a3f7e2659eb`. The A1 fingerprint adds the unchanged draft registry producer pin `cf58c82d4703b6fbc209e7701233881cdad415f3` for the in-memory row shape. The resulting 42-source aggregate is `sha256:c489ca61176bc3a2100f9ee80839760fc2733c9bce84be1555abe3525f3537ca`. The retained v8 format still has the historical template-only digest `sha256:72bffd19f80900849795bbbf143a60d856d03a2622bf8533cf0b31a010510255`. Saving a full-source binding is A2 work.
- The build emits one shared content set of 22 canonical JSON files (13,950,389 bytes), addressed by fingerprint and original blob identities. Chromium verifies all 22 served bodies before publishing the private in-memory resolver. Verified content and derived indexes live only in the isolated A1 page realm. Two prospective World IDs use the same verified content, with repeated use of the first ID returning its original output. Missing and replaced content late in preload both fail closed. The dedicated bundle contains no Node filesystem dependency and opens no IndexedDB store or localStorage session. The standard application build is independent of this adapter and still reports the existing Node filesystem externalization warning in the draft graph.

## Measured state and regression checks

Node used the filesystem engine against the same verified checkout sources. Chromium executed the compiled browser engine in a disposable profile. At tick 0, Deepfrost 1, year 1, both produced identical portable JSON digests for the projection, authored posture, warnings, and provisional World/receipt. The projection digest is `344f5b9728d8b0276b803ef941c5e53c0f411998341f034670fda65c4740601a`. Both produced zero warnings, the existing three local and two external settlements, and no services or minted stock.

| Measurement | UTF-8 JSON bytes |
| --- | ---: |
| Economy projection | 6,715,533 |
| Economy ledger within projection | 46,560 |
| Hierarchy snapshots within projection | 173,895 |
| Derived market states within projection | 6,131,114 |
| Simulation states within projection | 363,903 |
| In-memory World row and receipt, A1 witness | 6,721,107 + 422 |
| Actual v8 archive growth, original disposable migration fixture | 6,721,568 |

Archive growth equals that fixture's World row (6,721,130 bytes) and receipt (438 bytes). The other 14 archive families were byte-equivalent in JSON. These are serialized payload sizes. Physical IndexedDB size was not measured. The initial shape retains the existing derived projection. Market states account for about 91% of the row. The 22 authored files travel separately and are not copied to a World row or per-character Save. A later compression or recomputation decision needs to preserve the distinction between authoritative balances and derived views.

- `node --import tsx --test` passed 34/34 for A1 source pins, existing v8 migration and World lifecycle, creation contract, Starfall template, base economy, and runtime economy. The adjacent settlement-simulation labor mix assertion at line 66 fails identically at the pinned PR baseline. Exact before/after UI typecheck output was byte-identical at 184 diagnostics on the World branch. Combined build stopped at those diagnostics. Node typecheck, direct standard Vite build, isolated 27-module A1 Vite build, no-new-hex (0 across 849 files), and diff checks passed.
- For the deterministic browser witness, run `node --import tsx apps/rpg-ui/qa/first-world-a1/node-oracle.mjs` into an oracle JSON file, build with Vite using `qa/first-world-a1/vite.config.mjs` from `apps/rpg-ui`, and serve only that output on a registered disposable loopback origin. `apps/rpg-ui/tests/first-world-a1-browser-qa.py` compares the oracle and checks warm reuse, fresh realms, missing/corrupt assets, and no browser persistence. Local test used `127.0.0.1:53224`; server stopped and listener verified absent. The pre-existing real Chromium v7/v8 migration receipt was retained. A1 did not repeat that separate browser migration.
- FP-001 and FP-017 exercised the actual engine chain in both runtimes. FP-002 preserves separate acceptance for transactional creation, migration, and Save. FP-009 records the starting, implementation and publication heads. FP-011/014 checked content and transitive code ownership with exact byte pins, including negative browser witnesses. The original migration suite retained synthetic rollback, retry, lifecycle and archive checks (FP-004/005/018/019).

PR #102 remains draft and retained for independent A1 review. PR #103 and the UI and map lanes retain their existing dispositions. Production activation, native-v3 Save and migration acceptance, and UI wiring are held. A2 will separately address exact source/scenario/rules/seed binding and real atomic create, reopen and fault evidence once authorized.


## Independent Connector source review (2026-11-22)

The exact PR102 Git tree at 2f0043d2 contains every one of the published 41 distinct pinned paths with matching Git blob SHA; the extra registry pin cf58c82d also matches. No independent runtime rerun or alteration of A1 results. [A2 preflight and owner handoff](world-a2-atomic-browser-create-and-persistence-preflight-2026-11-22.md) addresses the immutable historical pin boundary, runtime-app integration, exact full vs derived state and accepted create/reopen scope. A1 remains WORLD_A1_READY_FOR_CONNECTOR_REVIEW for executable evidence; Connector source review passes. 
