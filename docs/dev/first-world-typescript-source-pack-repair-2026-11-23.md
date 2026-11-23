# First World TypeScript source-pack repair

**2026-11-23. MERGE_HELD.** Owner-approved implementation on `codex/new-ui-mainline-final-2026-11-23` from `c476b18dcd7b2741d569e480fcff0c14db451c53`. Unversioned integration support, no parent milestone, development impact `supports_current_band`. Game `0.1.1-prealpha`, posture `INTEGRATED_LOOP`, game-version impact `none`.

## Repair and source identities

The five civilization-engine files use strict result types, checked bounds, ES2020 array access, and an explicit failure for absent authored travel data. The shared ledger and transport types describe existing fields that can carry explicit `undefined` in memory. The source-pack v4 verifier checks the nine successor inputs and all 55 historical pins. Seven former source files remain byte-exact in `docs/design/first-world-source-history`. Historical manifests v1–v3 keep their original contents. The Worker verifies the successor engine bytes and emits the existing v2 economy descriptor. World and receipt binding and seed derivation continue to use the v3 owner fingerprint.

| Identity | SHA-256 |
| --- | --- |
| V4 TypeScript source and build provenance | `bc1620c7b63ca410aa38f3962ca958b3130289922ee52f9208221abd1b1e0370` |
| V3 persisted World owner | `90d19ed5fa6f9c06bc093d6f775b65a5b69ad12b66a40362bd42a3bf948cfe33` |
| V2 World economy | `63ba33dc9873ce49e2a2d98ba9744e9e0c45a2ac88ef244212968bb371752437` |
| V1 original pin set | `9482870a7784f877bb8c789f65f29dea8fd62a18392381dc1ffd7a3f7e2659eb` |

The coordinate-first guard still counts existing occurrences against the original frozen baseline. Its three exact, path-scoped allowances cover only erased non-null assertions on already-present route indices. Regression tests reject extra occurrences, a different path, and changed index expressions.

## Acceptance

- **Strict TypeScript.** Node 24.14.1 and TypeScript 5.9.3 produce 118 diagnostics on the successor. The coordinate-normalized diagnostic multiset removes all 65 integration additions and adds zero compared with either the old integration or master. Master has 119. The full combined build remains blocked by the inherited diagnostics. Node typecheck and direct ordinary and World-owner-review builds passed.
- **Exact equivalence.** The A4 test runs archived and successor TypeScript in separate Node processes, compares exact output bytes for two identical genesis inputs (generations 1 and 3), and retains explicit undefined properties in the comparison. Raw engine projection, durable and portable projections, ledgers, projection digests and retained candidate rebuilds match. Tamper cases reject changed current and historical source bytes.
- **Compiled Worker and compatibility.** Chromium created a World with the historical v8 binary and exported its epoch. The successor reopened the same World and receipt at that same origin with an unchanged database graph. Across disposable origins, the successor restored the old v8 archive, reopened the verified World and continued Classic. The successor rejected corrupt and occupied restores. Independently, the compiled original v7 application upgraded into successor v8, all 14 families matched, and Classic could continue its original Save after upgrade and after archive restore. A newly created successor World also survived a full Chromium restart and opened in the selected-World Creator.
- **Engine regressions.** The affected engine and World sweep reported 44/49 versus 42/47 on the runtime-identical pre-repair branch. The same five assertions failed in both: settlement labor/business distribution, pack-train harness compatibility, ship draft-animal error wording, and two caravan cases with missing Vinecross grain. Those mechanics remain outside this repair. The no-new-hex gate and its regression tests passed.
- **Evidence.** The existing [mainline acceptance receipt](new-ui-mainline-final-acceptance-2026-11-23.md) and browser matrix are retained. This repair's focused evidence is in `C:\Codex\EoL\.codex-local\new-ui-mainline-final-20261123\typescript-repair`. FP-004/005/018/019 apply to migration and retained data, FP-009/011/014 to exact source and equivalence, and FP-001/017 to the compiled caller paths.

The forward-only v8 account-owner decision remains the merge gate. Integration stays local. PR #102 keeps its owner-review role and PR #103 keeps its presentation provenance role pending their existing review triggers. Production World writes and World-bound character and Save publication require separate approval.

Suggested commit message `fix(world): validate strict engine types with a versioned source pack`.
