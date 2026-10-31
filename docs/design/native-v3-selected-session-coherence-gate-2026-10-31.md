# Native v3 selected session coherence gate — 2026-10-31

Source: draft [PR #55](https://github.com/vagabond1215/Lineage_Reforged/pull/55) at `9e7ae00f308851e18477e871648aae2e951bf487`; implementation: stacked draft [PR #56](https://github.com/vagabond1215/Lineage_Reforged/pull/56), code commit `1c0fc0d408f637515982d8103f39e3135a3bba8a`. Current `master` was `a596112acf3945f2bf7c625e943f2511d12aa710`. Game remains `0.1.1-prealpha`; selected production remains v2. This is an unactivated owner repair, **not** native selected UI acceptance.

## Reproduced failure and repair

At #55, a native creator snapshot S0 could carry bread quantity 2 and a worn Short Bow. After Use accepted S1/C1, an equipment move submitted S0 with C1. The gear revision had not changed, so the item owner accepted it and restored the consumed bread. The reverse gear-then-Use order also accepted stale S0. Direct central duplicate admission after a later accepted mutation returned an older retained snapshot. Red tests recorded both lost-update orderings before the repair.

The campaign session control now binds the exact native source serialization when the account owner reads an artifact and after every accepted mutation. Admission validates the current retained snapshot, control posture, ordered accepted mutation chain, revision and continuity before native mutation. A stale or mixed-format source rejects without publication. A historical exact duplicate returns its original result identity with the **latest** snapshot/control; it cannot roll state back. Non-head forks retain their accepted continuity. The binding is transient session state; it does not add a save field or second mutation authority. Native item, quest, travel, survey, pending, descendant Save and terminal callers use the central coherence inspection or its admission result. v2 control construction and mutation semantics remain unchanged.

The trusted account readback constructs bound native controls at head and non-head. New synthetic native fixtures explicitly bind their initial source; an unbound native control rejects initial admission. Tests cover Use→gear and gear→Use, quest/travel→item, exact duplicate after another mutation, non-head fork, mixed format, stale selected session, Save and terminal publication blocks, quantity and physical gear conservation.

## Executed verification

| Check | Result |
| --- | --- |
| Focused native item and selected host tests | 19/19 pass |
| Complete UI Node suite | 99/99 pass |
| Adjacent root persistence, account, gear, combat, resource and survey tests | 131/131 pass |
| Synthetic local real-`EpochApp` session, gameplay, combat and terminal browser QA | Pass; selected native controls remain read-only |
| Controlled pending browser QA | native 10/10; v2 Normal defeat 8/8; v2 terminal 14/14 |
| UI Node typecheck, content lint | Pass; lint 72 files |
| Direct complete-asset Vite production build, diff check | Pass |
| Broad UI TypeScript vs exact #55 parent | 115/115 diagnostics; zero new normalized diagnostics |
| Workspace TypeScript vs exact #55 parent | 762 sparse parent / 763 full child; only additional diagnostic is an unchanged `apps/sim-runner/src/index.ts` file omitted by the sparse parent checkout |

The pending browser QA initially exposed a changed error precedence: intrinsically invalid ordinary pending Save returned `stale_head` instead of `invalid_record`. Validation was reordered so intrinsic invalidity remains `invalid_record` while a valid-shaped but stale native source is rejected by the coherence fence. The pending and v2 browser suites then passed.

## Disposition

**HOLD_SELECTED_ATOMIC_ACTIVATION.** `EpochApp` still starts selected campaigns through its v2 first-campaign service. Native v3 load renders `NativeCharacterReviewShell` in read-only mode; selected Save and retirement deliberately reject native v3. World/Approach, quest/travel/survey, combat/resource/defeat and lifecycle controls have only unactivated owner hosts, not one proven selected UI route. No real authenticated selected native-v3 creation→action→Save→restart/sign-in sequence was run. Synthetic browser accounts are supporting evidence only. The owner allows `recovery_pending` to remain latent and owner-tested; selected pending-scenario acceptance stays open.

Next gate: begin with a failing real `EpochApp` selected-caller test, then connect creator, selected actions, World/survey/combat, ordinary Save/recovery/terminal and mixed-format handling as **one** route. Keep v2 selected and native v3 read-only unless the complete route passes executable and authenticated selected Save/restart checks. No existing draft PR was merged, retargeted or deployed.

Applied failure patterns: FP-001 (real selected caller boundary explicitly tested and held), FP-002 (green owner tests do not accept activation), FP-005/012 (duplicate and retry), FP-008/009 (exact stacked base), FP-011/013 (provenance before mutation and nested state conservation), FP-015/016 (effective source and publication placement), FP-017 (controlled pending is not ordinary selected reachability).
