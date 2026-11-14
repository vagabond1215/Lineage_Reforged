# Echo Baseline, Dev Console, Spawn Diagnostics, and Idle-Watch Admission Preflight

Date: 2026-10-26
Status: `CONNECTOR_SOURCE_AUDIT; DESIGN_EVIDENCE_ONLY; NO_RUNTIME_ACCEPTANCE`
Read-only source inspected: `master` `a596112acf3945f2bf7c625e943f2511d12aa710` and isolated `codex/echo-dev-console` draft PR #22 (3 commits ahead of master); gear owner draft PR #20 stays unactivated.
Related accepted user direction: [zero starting Echo, default-on Dev and future weather/spawn conditions](https://github.com/vagabond1215/Lineage_Reforged/blob/connector/founder-backstory-dev-spawner-2026-10-26/docs/design/zero-inherited-echo-dev-console-and-environment-spawn-test-contract-2026-10-26.md), [focused PR #22 checkpoint](https://github.com/vagabond1215/Lineage_Reforged/blob/codex/echo-dev-console/docs/design/echo-origin-and-developer-inspection-checkpoint-2026-10-26.md).
Change authority: source-preflight and future Codex acceptance only, not executable command permission; Game `0.1.1-prealpha` and parked `DEV-0.7.2.13` unchanged.

## Source findings and precise follow-ups

### ECHO-01: Creation origin is persisted but not a required current-format invariant

`newGameSnapshot.ts` persists an `originBaseline` from the **fully resolved starting attributes** and initial backstory skills. `progression.ts` subtracts the origin ranks/attributes before calculating skill, knowledge, stat and diversity Echo, so newly created starter proficiency itself is no longer counted. The code uses current positive growth above the immutable baseline; lowering/regaining a skill changes/restores current Echo instead of paying twice per award. A real SaveManager fixture tests baseline retention and first-load zero Echo. These are meaningful improvements.

But `PlayerProgression.originBaseline?` is **optional**, and `campaign-rules.ts:validateProgression` puts `originBaseline` in the optional-key list. `calculatePlayerEcho` therefore falls back to subtracting `0` for skill ranks and global authored defaults for attributes when the baseline is absent, recreating the old starter-Echo farm behavior on a baseline-less current-format snapshot. An origin baseline copied from another character, changed after saving, or inconsistent with the saved source is not tied to an immutable creation witness, even when structurally valid.

**Required next contract:** new-native campaign creation/admission must have valid, stable, source-owned origin evidence; current-format save and progression recompute cannot silently turn a missing/invalid baseline into an award. Since obsolete development saves are disposable, avoid writing an importer merely for the old shape. Scope mandatory validation to the intentionally accepted **new** format/epoch and retest the actual creator, SaveManager and campaign admission; do not silently break transitional test fixtures or invent a version number before examining save owners. Anti-tamper/source binding is a separate evidence/publication decision where current trust boundaries need it.

### ECHO-02: A baseline is not earned-source provenance

`calculatePlayerEcho` uses `Math.max(0, currentRank - originRank)` and similar attribute deltas. It cannot tell a naturally trained skill gain from a **later** scripted grant, temporary modifier, developer rank edit, Legacy award, cheat or other no-earn addition to the same mutable rank. `SkillRankGainPolicyInput` has `sourceLabel` and `sourceType`, but Echo currently consumes neither a durable earned-gain receipt nor a source-classified current capability split. No Dev rank editor exists in PR #22, so this is a future exploitation exposure, not proof an existing item inspector is granting Echo.

**Required next contract:** distinguish legitimate earned permanent progression from all non-earned rank/stat/knowledge tranches and simulated QA activity. Do not make the baseline from a first post-creation read (which would erase already earned growth). Prefer an existing skill/stat progression source boundary if sufficient; otherwise add the smallest actual source-classified earned evidence with idempotent current-format publication. Do not clear legitimate current Echo on each recalculation; preserve actual ability/action effectiveness. At minimum, require a denied debug rank/attribute mutation and known non-earned grant test even if those commands remain disabled. Ensure future descendant Hunter eligibility uses only the legitimate earned evidence, not raw ranks or dev grants.

### DEV-01: Popovers need two-way exclusion, focus and selected-client checks

`TopStatusBar.tsx` adds a default-visible `Dev` button with a focusable expandable panel. Clicking Dev closes Calendar and Conditions; opening Settings closes Dev by effect. But opening Dev **while Settings is already open** does not synchronously request Settings to close (Settings state belongs to `InGameShell.tsx`). Both floating panels may be present until another interaction. The Dev popup also has an outside `pointerdown` listener and Escape handling; verify its behavior against Notifications, Conditions, Calendar, Settings, tab change, focus return and narrow viewport.

**Required next contract:** select a single active top-bar menu or a minimal parent-owned mutual-exclusion callback, not a new global UI store. Opening either Dev or Settings closes the other predictably. Preserve default-on Dev policy in the current preview until the **owner explicitly changes it**, rather than adding a default-off build flag. Use actual interactive keyboard/browser checks; static SSR markup is insufficient for popover states.

### SPAWN-01: Profile gates are not complete encounter gates

`spawn/index.ts:inspectSpawnEligibility` shares `spawnProfileFailures` with `resolveSpawnCandidates` for region ancestry, hex, settlement, site, habitat and hazard pressure. It reports deterministic profile spawn-rate roll and the chosen eligible candidates. **It does not expose the reasons for every rejected encounter template**: per-entry hazard bands, zero weight, template region/habitat/movement/disposition, empty membership, or individual monster habitat are evaluated deeper in `resolveSpawnCandidates`. A profile can pass its listed constraints and its roll while selecting no encounter.

It also hardcodes `seed=0` in the Dev view while ordinary commands may use `selectionKey`; a QA inspector result is an illustrative **probe**, not a guarantee of what a real encounter action will select. Time-of-day, season and weather gates remain absent from the `SpawnProfileRecord` schema and resolver. Weather remains an untyped `WorldState.weatherState` and the calendar popup is read-only; no climate simulation or override should be claimed.

**Required next contract:** make inspection a pure explanation of the exact production candidate-selection decisions without diverging selection mathematics. Report *profile eligible*, *rate roll*, *eligible encounter set*, *selected candidate* or *no candidate: reason*, with optional explicit inspection seed/selectionKey. No encounter creation by an inspector. Add positive and negative cases for all already-authored template rules and a profile-pass/template-fail. Mark unimplemented time/weather/season fields as unsupported, not pass or reject.

### TIME-01: Generic elapsed-watch command is not presently owned

`gameplayLoop.ts:advanceSnapshotClock` is a private helper inside action-specific gameplay; each tick advances `clock`, `capturedAtTick`, `saveMeta.totalPlayTicks`, body state and runtime resources, with additional action-conditional stat effects. `packages/shared/time/src/index.ts` owns calendar tick mathematics, **not full campaign elapsed-time consequences**. `campaign-session.ts:admitCampaignMutation` requires source artifact, revision, mutation ID and owner kind; reading or mutating a React `snapshot.clock` bypasses the caller and Save owner.

A true `Dev → Advance 1 Watch` must decide whether the test acts as ordinary idle world time, a QA-only isolated simulation, or a no-consequence calendar rebase. These have different body, resource, quest deadline, economy, transport, encounter and Chronicle effects. The default clock is **6 ticks per watch** and **4 watches per day**, not a literal watch field.

**Required next contract:** decide, trace, and test idle-time effects before exposing a mutation control. Prefer a bounded QA-only full elapsed-time command with explicit limits, simulation/world/quest effect policy, revision/idempotent receipt, selected campaign isolation and Save/restart readback. `Advance N Watches` and `N Days` must be bounded or batched safely. Do not implement `Set Year/Season` by modifying raw calendar fields; a rebase is its own later decision. If a complete owner cannot be implemented coherently in this pass, leave Time visibly read-only with a **named blocked prerequisite**, rather than shipping a fake ticking button.

## Acceptance fixtures for named Codex review

| Case | Required evidence |
| --- | --- |
| E1: newly created Local, Vagabond, Exile, future unlocked Hunter/World-Stray | Zero Echo and level across creator, first recompute, actual Save/load and second restart; starting effective skill and attributes intact |
| E2: new-format snapshot without/corrupt origin baseline | Rejected or safely noncrediting at correct campaign admission; never silently awards starting Echo; obsolete dev-save importer not needed |
| E3: accepted training from baseline 25 to 26, re-evaluation, rank loss/regain | Only earned increment affects Echo; no repeated award, Save/restart preserves the same value |
| E4: post-start scripted skill/attribute/knowledge increase or QA grant | Cannot create earned Echo or Hunter descendant eligibility; deny untrusted writes until source-owner handles them |
| E5: baseline is a different character's valid-looking data | Explicit invariants and accepted authority can reject wrong source; no magical trusted data inferred from matching shape |
| U1: Settings → Dev and Dev → Settings | Never both open, keyboard focus return correct, no pointer state race, notification/calendar still reachable |
| U2: narrow viewport/mobile + keyboard | Top-bar fits, popup remains inside viewport, scroll and focus work, supported selected-client acceptance distinguished from fixture |
| S1: passing profile with no valid encounter template | Explains template-level rejection and why candidate was not selected |
| S2: profile blocked by actual region/habitat/hazard and fixed selectionKey | Exact source parity with resolver; deterministic repeat and no state mutation |
| T1: accepted 1-watch QA command, if developed | Precisely 6 elapsed ticks; body/world/quest/reservation effects are owner-defined; consistent campaign receipt and Save/restart |
| T2: duplicate/stale/time-overflow command | Rejects/no-ops without partial clock, body, quest or publication change |
| P1: current-format SaveManager and selected-client | Readback at actual revision and campaign head; no accidental new schema acceptance gap or old-save migration mandate |

Existing evidence from Codex in PR #22: owner/combat/survey 105/105, creator/persistence 55/55, save/spawn focus 35/35, UI 42/42, Node UI typecheck + direct Vite build pass; broad TypeScript 115 vs 115, zero delta. These are **reported test executions**, not independently rerun during this connector audit. PR #22's fixture-browser popup is **not** authenticated selected-client or mobile proof; no hosted Site deployment is requested here. Existing clean-master `warning` vs `success` quest test mismatch is independent and should be baseline-checked, not silently reported as regression.

## Named scope / disposition

Work on a separate Codex implementation branch or PR #22 child worktree after exact-source review. First prioritize ECHO-01/02 and DEV-01 with automated and selected-client proof, then expand SPAWN-01's pure diagnostic parity. Treat TIME-01 as a **decision-and-owner implementation only where feasible**, not permission to wire a raw tick control. Items require PR #20 native gear owner plus caller/Save activation. Regional weather overrides require a typed weather/scenario owner. This pass does not implement new founder/Hunter/World-Stray unlocks, crafting, environment simulation, combat resolution, general new inventory or Game version bumps. Preserve current draft PRs #5–#22 and protected branches.

**No runtime code was modified or executed by this connector pass.**
