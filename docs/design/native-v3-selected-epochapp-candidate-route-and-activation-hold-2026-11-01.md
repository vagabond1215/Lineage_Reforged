# Native v3 selected EpochApp candidate route and activation hold — 2026-11-01

Source: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; exact draft #57 parent `636ffa5cef6f971ea8b6f02be5b4dd2a2305a848`; isolated [draft PR #58](https://github.com/vagabond1215/Lineage_Reforged/pull/58), code commit `165eb3d71c00948b43d2984178a289218821afdb`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. No existing PR, protected branch, parked combat route or deployed Site was changed.

## Real caller red gate and bounded repair

The new browser regression first used the actual `EpochApp` account picker, empty slot, character randomizer, Finalize and Begin Journey in a disposable synthetic account. Before the repair, its assertion for a native `lineage.save_snapshot.v3` first publication was **red**: the real creator published v2. This reproduced #57's selected entry barrier at the highest caller.

The repair is deliberately unactivated. `EpochApp` accepts an optional candidate flag only when Vite is in development mode **and** the path is `native-selected-session-qa.html`. `App.tsx` still mounts `EpochApp` without the flag. On that local QA path, the real creator selects the existing native first-campaign adapter. The selected Character/Inventory shell binds existing native gear and fungible owners, and its Save uses #57's current reducer snapshot/control plus observed slot, account revision and artifact/publication address through `readNativeEpochAppSession` and `saveNativeSelectedSession`. A small candidate-only World/Quests/Activity panel submits established quest, travel, survey, nearby exploration, encounter and combat commands. Availability is drawn from the current quest, location, survey, exploration and legal-combat owners. A rejected candidate action leaves the current game visible with a warning.

Normal selected entry still creates v2, and normal v3 review remains read-only. No v3 command is routed through the v2 `GameSessionProvider`; no second gear, inventory or Save authority was added. The candidate route does not change save schemas or old development records.

## Executed evidence

| Check | Result |
| --- | --- |
| Real `EpochApp` creator RED before candidate binding | v2 publication instead of expected v3 |
| Disposable real-creator browser QA | Pass: v3 first publication, Character Unequip, exact physical gear ID/durability/location, ordinary Save, page restart, synthetic sign-out/sign-in, same campaign readback; separate normal creator still v2 |
| Disposable selected survey browser QA | Pass: synthetic Starfall setup, real selected quest/travel controls, four ordered survey stages, Save after each, retained gear and restart |
| Disposable selected combat browser QA | Pass: synthetic Stonevein setup, authored exploration and encounter, legal Short Bow action, selected Save and restart with gear conservation |
| Candidate layout and keyboard browser QA | Pass at 375×667, 768 and 1440; no page-wide horizontal overflow, resources/nav/Save visible, Tab reaches a button |
| Complete UI Node suite | 100/100 pass |
| Adjacent root owner suite | 303/303 pass; a broader 394-test sweep had two unrelated failures reproduced on exact #57 parent |
| UI Node typecheck and content lint | Pass; lint 72 files |
| Broad UI TypeScript vs exact #57 | 115/115 identical normalized diagnostics; zero new errors |
| Broad workspace TypeScript vs exact #57 | 763/763 identical normalized diagnostics; zero new errors |
| Direct complete-asset Vite build and staged diff check | Pass; `npm run build` remains blocked by the same 115 inherited UI TypeScript diagnostics |

The browser accounts and origin are disposable local QA fixtures. Their sign-in uses the fixture's synthetic credential. None of this is authenticated selected-client evidence for the hosted game.

## Atomic disposition

**HOLD_SELECTED_ATOMIC_ACTIVATION.** The QA path is a verified unactivated dependency, not a production cutover. The following executable gates remain:

1. Drive a single real `EpochApp` creator selection to authored Starfall and prove creator→quest→travel→four survey stages in that same selected account. The current real creator test uses a valid randomized start; the survey test uses an explicitly synthetic preselected start.
2. Exercise native Inventory Use and Equip, World/Approach presentation, combat resource effects through Normal defeat, and terminal retirement through selected controls. The candidate shell currently has only minimal World, Quests and Activity controls; `EpochApp` still holds native retirement.
3. Prove cross-slot, mixed-format, stale/duplicate request, interrupted publication and retry fences through selected UI and retained account readback. Existing owner tests support these boundaries but cannot substitute for the selected caller.
4. Keep pending defeat latent owner-tested as approved; selected pending-scenario acceptance remains open. Attempt authenticated selected Save/restart only after the local connected route is safe and complete.

Do not turn on the default v3 creator or mutation controls, merge #57/#58, deploy Site, discard old records, or advance the Game version on this evidence.

Applied failure patterns: FP-001 (real creator red then green), FP-002 (partial fixture checks do not accept the atomic parent), FP-008/009 (exact stacked head and semantic branch review), FP-011/013 (current owner source and nested physical gear preservation), FP-016 (retained publication/readback), FP-017 (authored selected reachability remains open).
