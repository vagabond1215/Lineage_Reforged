## 2026-10-28 — Native v3 account descendant and recovery child

Source run: unversioned native v3 clean-epoch account-descendant gate; parent PR #39 `ed351578f57a6f44a257c79715b55b46c3c9617b`; clean master `a596112acf3945f2bf7c625e943f2511d12aa710`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; development impact `supports_current_band`; game-version impact `none`; branch `codex/native-v3-account-descendant`, unselected stacked draft, no selected-client acceptance. Files changed: `cleanEpochDescendantAdapter.ts`, `saveManager.ts`, `campaignIndexedDbStore.ts`, native browser QA, [focused decision](../design/native-v3-account-descendant-and-recovery-decision-2026-10-28.md), [next route](next-native-v3-lifecycle-and-selected-cutover-gate-2026-10-28.md), this output, handoff and branch register. Native v3 ordinary same/cross-slot descendant now uses the existing account owner and version-8 artifact, projects achievements at one retained timestamp, preserves physical gear and exact survey ledger, and resumes pending account consumers. v2 remains version 7. Red caller tests exposed the v2-only guard, final-stage achievement replay mismatch and post-survey Save mismatch before repair.

Checks: synthetic IndexedDB browser QA **13/13**; focused owner **59/59**; native and selected-v2 app **47/47**; adjacent v2 survey **76/76**; Node UI typecheck pass; content lint **72 files**; app-local direct Vite build **271 client modules**; app broad TS exact parent **115/115**, zero differing lines; workspace broad TS **763**, matching recorded clean-master baseline and no changed-file diagnostics; diff check pass. A root-cwd Vite/test invocation failed for wrong app root/HMR collision; app-cwd serial tests and build passed. No authenticated selected v3 gameplay; selected App is still v2. Applied FP-001/002/003/005/009/012/013/014/015/016/017 with detailed evidence in the focused decision. Branch/PR lifecycle: inspected master, #39/#38 and open #5–#39; this new child is **HOLD_SELECTED_ATOMIC_ACTIVATION** pending native terminal/recovery, mixed-format lifecycle and selected Save/restart. No integration, deletion or disposition change to existing drafts. Suggested commit: `feat(save): admit native v3 clean-epoch descendants`. Risks: terminal and pending-defeat lifecycle remain v2-only or unproven; no Site or Game version change. Next recommended unversioned [native lifecycle and selected cutover gate](next-native-v3-lifecycle-and-selected-cutover-gate-2026-10-28.md); no separate Game-version decision.

## 2026-10-28 — Unselected native four-stage survey and retained replay

**Source run:** unversioned native gear activation support; parent milestone n/a. Clean master `a596112acf3945f2bf7c625e943f2511d12aa710`; parent draft PR #38 `f8efcff7510c2deebfa71d6948b32c8c4f054414`; isolated [draft PR #39](https://github.com/vagabond1215/Lineage_Reforged/pull/39), initial code commit `52794065cfe8dab0754ed5c24bbfd0f8c45a7611`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; label class unversioned; development impact `supports_current_band`; game-version impact `none`. Status **UNSELECTED_FOUR_STAGE_REPLAY_VERIFIED; ACCOUNT_DESCENDANT_SELECTED_HELD**.

Files changed: `packages/engines/game-engine/src/native-survey-ledger.ts`, `native-survey-shift-candidate.ts`; `apps/rpg-ui/src/game-shell/campaignIndexedDbStore.ts`, `apps/rpg-ui/tests/native-survey-source-caller.test.mjs`, `apps/rpg-ui/native-gear-v3-publication-qa.ts`; [focused decision](../design/native-v3-four-stage-survey-retained-replay-decision-2026-10-28.md), next prompt, this output, handoff and branch register. Red-before-green absent four-stage command and permissive pending-correction ledger shape. Native ledger version 2 records ordered results/receipts; generic v3 store replays every shift from retained physical source and rejects missing/changed ancestors. Final survey applies authored discovery, operation, flags, Codex unlock where present, and notification/Chronicle projections. No selected App route changed.

Checks: native app owner/UI **26/26**, adjacent v2 survey **62/62**, selected-v2 Character/Equipment/Inventory **30/30**, synthetic browser IndexedDB QA **11/11** with four-stage publication/restart, exact retry, second-stage abort and intermediate source-loss rejection. Node UI typecheck pass, content lint **72 files**, direct Vite **271 client modules**, `git diff --check` pass. Broad TypeScript equals clean master: UI **115/115**, workspace **763/763**, no changed-file diagnostics. Browser QA is synthetic; no authenticated selected v3 gameplay or clean-epoch v3 descendant Save/restart was run. Applied FP-001/002/005/009/012/013/014/015/016/017; precise evidence in the focused decision.

Branch lifecycle: fetch/prune verified master/#37/#38, inventoried 29 local and 42 remote refs and 34 open PRs (#5–#38) before #39. #39 is draft stacked on #38. Existing drafts and protected refs retain prior holds. No merge, retarget, closure or branch deletion due/performed. Review #39 when version-aware clean-epoch descendant, consumer recovery, mixed-format fences and selected Save/restart are independently proven; exact heads must be rechecked. Suggested commit `docs(gear): record four-stage native survey handoff`. Next [native v3 account descendant and recovery gate](next-native-v3-account-descendant-recovery-2026-10-28.md); no Game-version decision.

## 2026-10-28 — Unselected native first-shift ledger and retained replay

**Source run:** unversioned native gear activation support; parent development milestone n/a. Clean master `a596112acf3945f2bf7c625e943f2511d12aa710`; parent draft PR #37 `d5983b481761f07ec7d74dc343a1ef5c145cf182`; isolated [draft PR #38](https://github.com/vagabond1215/Lineage_Reforged/pull/38) implementation `f093e05fd618d0c79295fec9dc51fd4ee088e4e7`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; label class unversioned; development impact `supports_current_band`; game-version impact `none`. Status **UNSELECTED_NATIVE_FIRST_SHIFT_LEDGER_AND_REPLAY_VERIFIED; BROWSER_DESCENDANT_SELECTED_HELD**.

Files changed: new `packages/engines/game-engine/src/native-survey-ledger.ts`; `native-campaign-rules.ts`, `campaign-rules.ts`, `native-survey-material.ts`; `apps/rpg-ui/src/game-shell/campaignIndexedDbStore.ts`, `apps/rpg-ui/tests/native-survey-source-caller.test.mjs`, `apps/rpg-ui/native-gear-v3-publication-qa.ts`; focused design decision, next prompt, this output, handoff and branch register. Red-before-green missing ledger; first native shift now carries a versioned result and is admitted only by deep local replay. Version-8 store recomputes against the immutable predecessor in publication/readback. Actual selected App remains v2. See [focused decision](../design/native-v3-first-shift-ledger-and-retained-source-replay-2026-10-28.md).

Checks: focused native app **32/32** (ledger real caller **6/6**), adjacent v2 Ashen Reef/survey/resource/combat/persistence **100/100**, selected-v2 Character/Equipment/Inventory **30/30**. Node UI typecheck pass; content lint **72 files**; direct Vite build **271 client modules**; QA source transform pass; `git diff --check` pass. Broad TypeScript equals clean master: UI **115/115**, workspace **763/763**, no changed-file diagnostics. The broader initially parallel root selection was interrupted after no further output; it is not counted. In-app browser first timed out on sandboxed localhost; a hidden host-visible Vite helper then served the same isolated QA page and synthetic IndexedDB browser checks passed **10/10**, including actual first-shift publication, readback/restart, exact retry, stale fork and source-artifact-loss refusal. No selected-client gameplay, v3 account descendant or four-stage Save/restart proof is claimed. Applied FP-001/002/005/009/012/014/015/017; FP-013/016 remain for descendant/projection history.

Branch lifecycle: fetched/pruned, inspected 33 open PRs (#5–#37) before this child and relevant remote heads; #38 now draft stacked on #37. #19–#38 and separate Echo/Dev/Area/UI branches retain named-consumer holds. No existing PR merged, retargeted or closed; no branch deleted. Review trigger: browser IndexedDB first-shift proof followed by native sectors 2/3, ruins, v3 account descendant/recovery and selected Save/restart. Suggested commit `docs(gear): record first-shift ledger handoff`. Next [four-stage descendant and recovery gate](next-native-v3-survey-four-stage-descendant-2026-10-28.md); no Game-version decision.

## 2026-10-28 — Unselected native survey first-shift mutation candidate

**Source run:** unversioned native gear activation support. Clean master `a596112acf3945f2bf7c625e943f2511d12aa710`; parent draft PR #36 `93a1b06c9fc1b83b14df264fb26ba96b9574e390`; isolated [draft PR #37](https://github.com/vagabond1215/Lineage_Reforged/pull/37), implementation `8f256dc7ce64275ec64237f8f9ae199e380aae7e`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; label class unversioned, parent n/a; development impact `supports_current_band`, game-version impact `none`. Status **UNSELECTED_FIRST_SHIFT_MUTATION_CANDIDATE_VERIFIED; DURABLE_COMMAND_DESCENDANT_SELECTED_HELD**. [Focused evidence](../design/native-v3-survey-first-shift-candidate-and-admission-gate-2026-10-28.md).

Files changed: new `packages/engines/game-engine/src/native-survey-shift-candidate.ts`, `campaign-rules.ts` material runtime result, `native-campaign-rules.ts` fail-closed survey-marker admission, real-caller test, failure-pattern entry, focused decision, next prompt, this output, handoff and branch register. Red-before-green missing mutation module; a second red test exposed unwitnessed survey progress accepted by native Save admission. First-shift clone now mutates body/resources/stat growth/skill/flag/operation/quest but cannot publish. Focused native app **31/31**, adjacent v2 survey/resource/combat **50/50**, selected-v2 Character/Equipment/Inventory **30/30**, Node UI typecheck, content lint **72 files**, direct Vite **267 client modules**, diff check pass. Broad UI **115 branch / 115 clean master**, workspace **763 / 763**, no changed-file diagnostics. In-app browser QA again timed out on isolated localhost; no selected-client proof. Applied FP-001/002/009/014/015/017; FP-005/012/013/016 remain for durable command/recovery/projections.

Branch lifecycle: fetched/pruned; verified master and #36, inspected 32 open repository PRs and relevant refs; #19–#37 plus separate stacks retained draft/held. No merge, retarget, closure or deletion due/performed. Review at native ledger/replay, v3 descendant/recovery and selected activation. Suggested commit `docs(gear): record native first-shift candidate gate`. Next [native ledger, replay and descendant publication](next-native-v3-survey-ledger-replay-and-publication-2026-10-28.md). No Game-version decision.

## 2026-10-28 — Unselected retained native v3 survey source

**Source run:** unversioned native gear activation support. Clean master `a596112acf3945f2bf7c625e943f2511d12aa710`; parent draft PR #35 `db1d9441c247494b92ed0258bbcb00370a366317`; isolated [draft PR #36](https://github.com/vagabond1215/Lineage_Reforged/pull/36), implementation `4220d0ffeb552238f9467a9873d52ac7f6ae52b4`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; label class unversioned, parent n/a; development impact `supports_current_band`, game-version impact `none`. Status **RETAINED_NATIVE_SOURCE_READ_VERIFIED; NATIVE_COMMAND_DESCENDANT_SELECTED_HELD**. [Focused evidence](../design/native-v3-retained-survey-source-binding-gate-2026-10-28.md).

Files changed: new `apps/rpg-ui/src/game-shell/nativeSurveyRetainedSource.ts`, real-caller test and synthetic browser QA case; focused decision, next prompt, this output, handoff and branch register. The reader obtains current v3 artifact/head identity from retained campaign store bytes and resolves first-shift native worn-gear survey material without mutation. Red-before-green missing module. Native app **30/30**, adjacent v2 survey/resource/combat **50/50**, selected-v2 Character/Equipment/Inventory **30/30**, Node UI typecheck, content lint **72 files**, direct Vite **267 client modules**, diff check pass. Broad UI **115 branch / 115 clean master**, workspace **763 / 763**, no changed-file diagnostics. Browser QA was added but not executed: in-app browser timed out on isolated localhost. No selected-client proof. Applied FP-001/002/009/014/015/017; FP-005/012/013/016 remain for retained command/publication.

Branch lifecycle: fetched/pruned; verified master and #35, inspected 32 open repository PRs and relevant refs; #19–#36 plus separate stacks retained draft/held. No merge, retarget, closure or deletion due/performed. Review at native command/replay, descendant/recovery and selected activation. Suggested commit `docs(gear): record retained native survey source gate`. Next [native survey command and descendant](next-native-v3-survey-command-and-descendant-2026-10-28.md). No Game-version decision.

## 2026-10-27 — Unselected native v3 survey material replay

**Source run:** unversioned native gear activation support; master `a596112acf3945f2bf7c625e943f2511d12aa710`; parent draft PR #34 `83f4fc8f288a00899fa8ed0e6fb92f08ff887ad7`; new isolated [draft PR #35](https://github.com/vagabond1215/Lineage_Reforged/pull/35), implementation `64b01785c5836731f969456cd378e0b6d6b051ff`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; label class unversioned, parent n/a; development impact `supports_current_band`, game-version impact `none`. Status **UNSELECTED_NATIVE_MATERIAL_VERIFIED; COMMAND_DESCENDANT_SELECTED_HELD**. [Focused evidence](../design/native-v3-survey-material-replay-and-publication-gate-2026-10-27.md).

Files changed: `packages/engines/game-engine/src/campaign-rules.ts`, new `native-survey-material.ts`, `apps/rpg-ui/tests/native-survey-source-caller.test.mjs`, focused decision, next prompt, this output, handoff and branch register. Shared survey material accepts v2 equipment map or native worn modifiers; pure native replay checks exact source/witness and derives first-shift material without mutation. Red-before-green missing module. Native app **29/29**, selected-v2 UI **30/30**, adjacent root **61/61**, Node typecheck, content lint **72 files**, direct Vite **267 client modules**, diff check pass. Broad UI **115 branch / 115 clean master** and workspace **763 / 763**, no changed-file diagnostics. No browser or selected-client proof. Applied FP-001/002/009/014/015/017; FP-005/012/013/016 remain future publication gates.

Branch lifecycle: fetched/pruned; verified master, parent #34 and repository open PRs; #19–#35 and separate stacks retained draft/held. No merge, closure or deletion due or performed. Review at retained native command/replay, descendant/recovery and selected activation. Suggested commit `docs(gear): record native survey material gate`. Next [native survey command, retained witness and descendant](next-native-v3-survey-command-retained-witness-and-descendant-2026-10-27.md). No Game-version decision.

## 2026-10-27 — Unselected native v3 survey source caller

**Source run:** unversioned native gear activation support. Clean master `a596112acf3945f2bf7c625e943f2511d12aa710`; parent draft PR #33 `017080ff0556a7471950b5c9c51b349e8645a161`; isolated [draft PR #34](https://github.com/vagabond1215/Lineage_Reforged/pull/34), implementation `071208e7a57bed8699db25ed42b9d4f4b8cac013`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; label class unversioned, parent n/a; development impact `supports_current_band`, game-version impact `none`. Status **UNSELECTED_NATIVE_SURVEY_SOURCE_VERIFIED; FULL_COMMAND_DESCENDANT_SELECTED_HELD**. [Focused evidence](../design/native-v3-survey-source-and-descendant-gate-2026-10-27.md).

Files changed: `packages/engines/game-engine/src/native-survey-source.ts` (new read-only v3 source capture); `player-travel-rules.ts` (location-only reader type); `apps/rpg-ui/tests/native-survey-source-caller.test.mjs` (new real-caller and rejection coverage); focused decision, next prompt, this output, handoff and branch register. Red-before-green missing module, then tests **2/2**. Native app **28/28**, selected-v2 Character/Equipment/Inventory UI **30/30**, adjacent root survey/combat/resource/Save **61/61**; Node UI typecheck, content lint **72 files**, direct Vite build **267 client modules**, diff check pass. Broad UI **115 branch / 115 clean master**, root **763 / 763**, no changed-file diagnostics. No browser or selected-client proof. Applied FP-001/002/009/015/016/017; FP-005/012/013/014 remain future retained-command gates.

Branch lifecycle: fetched/pruned; inspected master, #32/#33 and repository-scoped open PRs; #19–#34 plus separate stacks retained draft/held. No integration/deletion due or performed. Review at native command/replay, descendant/recovery and selected activation gate. Suggested commit `docs(gear): record native survey source gate`. Next [native survey command and retained publication](next-native-v3-survey-material-command-and-publication-2026-10-27.md). No Game-version decision.

## 2026-10-27 — Unselected native creator resource setup

Additional adjacent selected-v2 Character/Equipment/Inventory UI regressions **22/22 passed**; nonfatal server-render and HMR-port warnings remain.

**Source run:** unversioned native gear activation support; isolated [draft PR #33](https://github.com/vagabond1215/Lineage_Reforged/pull/33) `codex/native-gear-survey-readers` from draft PR #32 `c1cc26289a5a77528decb62b732206af2015bdc6`; inspected master `a596112acf3945f2bf7c625e943f2511d12aa710`. Implementation `83ad058f73551ad2434021759f89b6bb2e512a4e`, evidence `a0b5431eacee700575fd4ba4f00ac40dd41b5bf8`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. Label class unversioned, parent n/a; development impact `supports_current_band`, game-version impact `none`. Status `UNSELECTED_NATIVE_CREATOR_RESOURCE_SETUP_VERIFIED; SURVEY_WITNESS_AND_SELECTED_V3_HELD`. [Focused checkpoint](../design/native-v3-creator-resource-and-survey-boundary-2026-10-27.md).

Files changed: `apps/rpg-ui/src/game-shell/nativeNewGameSnapshot.ts`, new `nativeStartingResources.ts` and eight-case real creator test, `packages/engines/game-engine/src/native-effective-worn.ts`; this output, focused checkpoint, handoff, branch register and next prompt. Native creator initial HP/MP/Stamina now resolve from native worn gear, preserving nonphysical Legacy modifiers and all seven starter bundles. No v3 survey witness, descendant recovery or selected App change.

Checks: red missing native resource owner; final focused native app **26/26**, adjacent root creator/combat/resource/survey/persistence **57/57**, Node UI typecheck, content lint **72 files**, direct Vite **267 client modules**, diff check pass. Broad UI **115 branch / 115 clean master**, root **763 / 763**, no changed-file diagnostics. Native browser QA attempted but local URL timed out in app browser; selected-client proof was not run. Applied FP-001/002/005/009/012/013/014/015/016/017 as bounded in the focused checkpoint.

Branch lifecycle: fetched/pruned; master and #31/#32 exact heads verified; #19/#20/#22/#25/#26/#27/#28/#29/#30/#31/#32 retained draft; new #33 targets #32 and remains draft. No merge, retarget, closure or deletion due/performed. Suggested commit `docs(gear): record native creator resource gate`. Next [native survey witness and descendant prompt](next-native-v3-survey-witness-and-descendant-2026-10-27.md). No Game-version decision.

## 2026-10-27 — Unselected native v3 fungible Use checkpoint

**Source run:** unversioned native gear activation support; isolated [draft PR #32](https://github.com/vagabond1215/Lineage_Reforged/pull/32) `codex/native-gear-fungible-use` from draft PR #31 `f1fbe5f86efda7e4eefd483b4858ca634cf941a9`, master `a596112acf3945f2bf7c625e943f2511d12aa710`. Implementation `cd7bd6e5`, evidence `742a2dec`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. Label class unversioned, parent n/a, development impact `supports_current_band`, game-version impact `none`. Status `UNSELECTED_NATIVE_USE_VERIFIED; CONNECTED_V3_ACTIVATION_HELD`. [Focused checkpoint](../design/native-gear-v3-fungible-use-checkpoint-2026-10-27.md).

Files changed: `nativeFungibleActions.ts`, its real-caller test, native Use ledger, native creator and campaign admission, shared resource resolver TS/tracked JS mirror and modifier-parity test; focused checkpoint, this output, handoff, branch register and next prompt. Candidate native Use targets exact bag/overflow stacks, requires an authored profile, consumes one unit and records a durable retry identity; shared resources accept native worn modifiers without persisting a legacy equipment map. Selected App and master prompt unchanged.

Checks: red missing action and stale tracked runtime mirror before repair; app owner/UI **40/40**, adjacent root **14/14**, Node UI typecheck, content lint **72 files**, direct Vite **265 client modules**, diff check pass. Broad UI **115 branch / 115 clean master**, root **763 / 763**, no changed-file diagnostics. Isolated browser QA attempted; app browser could not reach local Vite URL, so browser and selected-client proof remain open. Applied FP-001/002/005/009/012/013/014/015/016/017; exact evidence and blockers in focused checkpoint.

Branch lifecycle: fetched/pruned and verified master/#31 source; #19/#20/#22/#25/#26/#27/#28/#29/#30/#31 retained draft; new [draft PR #32](https://github.com/vagabond1215/Lineage_Reforged/pull/32) targets #31. No merge, retarget, closure or deletion due/performed. Suggested commit `docs(gear): record native fungible use checkpoint`. Remaining gates are independent creator resources, production readers, native survey, descendant/recovery and authentic selected v3 Save/restart. Next [native survey and readers prompt](next-native-gear-v3-survey-and-readers-2026-10-27.md); no Game-version decision.

## 2026-10-27 — Unselected native v3 instance action checkpoint

**Source run:** unversioned native gear activation support, `codex/native-gear-owner-action` from draft PR #30 `2d7f809e34e5c90ff2a9c6c63a1bc735e9d1a1e4`; implementation `e0fe34f98b945eb5b930ec615d4c996e099b4dbd`, projection `adeff6e0c895517d72d429efa00dcbfe09871973` and placement `631fcf2a40db69b80e23553ea5f7735ee8b6fb89` are [draft PR #31](https://github.com/vagabond1215/Lineage_Reforged/pull/31); verified master `a596112acf3945f2bf7c625e943f2511d12aa710`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. Label class unversioned, parent n/a, development impact `supports_current_band`, game-version impact `none`. Status `UNSELECTED_INSTANCE_ACTION_VERIFIED; CONNECTED_V3_ACTIVATION_HELD`. [Focused checkpoint](../design/native-gear-v3-instance-action-checkpoint-2026-10-27.md).

Files changed: `apps/rpg-ui/src/game-shell/nativeCharacterActions.ts`, `packages/engines/game-engine/src/native-effective-worn.ts`, `apps/rpg-ui/tests/native-gear-action-caller.test.mjs`, `packages/engines/game-engine/src/gear-instance-owner.ts`, focused checkpoint, this output, handoff and branch register. Candidate instance-ID move uses only the PR #20 physical owner, retains exact condition/location, rejects malformed/stale/duplicate/invalid requests and revalidates the native campaign. Read-only native worn projection supplies canonical Character and combat provenance facts and current authored resource modifiers. No selected UI or old-map mutation.

Checks: red missing caller/projection modules and malformed destination crash before fixes; final focused app 36/36, adjacent root 90/90, native browser first-publication/failure/restart QA 8/8, content lint 72 files, Node UI typecheck, direct Vite build 264 client modules and diff check passed. Broad UI 115/115 and root 763/763 current branch/master, no changed-file diagnostics. Selected gameplay was **not run**. Applicable FP-001/002/005/009/012/013/014/015/016/017; evidence and unmet gates in focused checkpoint.

Branch lifecycle: fetched/pruned; #19/#20/#22/#25/#26/#27/#28/#29/#30 inspected and retained draft. New #31 remains draft pending review. No merge, retarget, cleanup or deletion due/performed. Suggested commit `feat(gear): add unselected native worn projection`. Risks: fungible Use, production effective-worn combat/resource/Character integration, native survey, native creator resources and descendant/terminal recovery remain connected blockers. Next: continue [owner-action, effective-worn and survey cutover](next-native-gear-owner-action-effective-worn-survey-2026-10-27.md) from this child; no Game-version decision.

## 2026-10-27 — Unselected native v3 artifact publication and restart

**Source run:** unversioned native gear activation support, isolated `codex/native-gear-v3-publication` from PR #29 `1e93174129f0bc0f2ebb82b34c4db43c4bc4085c`, verified master `a596112acf3945f2bf7c625e943f2511d12aa710`; implementation `4773c06d`, evidence `5b51ca00`, draft [PR #30](https://github.com/vagabond1215/Lineage_Reforged/pull/30) targeting #29. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. Label class unversioned, parent n/a, development impact `supports_current_band`, game-version impact `none`. Status `UNSELECTED_NATIVE_V3_FIRST_ARTIFACT_AND_RESTART_VERIFIED; SELECTED_ACTIVATION_HELD`. [Focused decision](../design/native-gear-v3-artifact-publication-and-restart-checkpoint-2026-10-27.md).

### A. Files changed

`apps/rpg-ui/src/game-shell/saveManager.ts`, `campaignIndexedDbStore.ts`, `cleanEpochAccountStore.ts`, `cleanEpochFirstCampaignAdapter.ts`; `apps/rpg-ui/tests/native-gear-current-caller-gate.test.mjs`; `apps/rpg-ui/native-gear-v3-publication-qa.ts`, `.html`; focused decision, output/handoff/register and next prompt. Selected `App`, master prompt, gameplay owner, IndexedDB schema version, Site and Game version unchanged.

### B. Patch summary

Real creator v3 output now prepares a version-8 envelope and publishes through the existing atomic artifact/head/address store. An explicit unselected clean-epoch adapter mode reserves the account/slot, publishes the first v3 artifact, commits ordinary consumer receipts and restarts with exact gear graph and account identity. Cross-format campaign heads and retained v2/v3 attempts conflict without deleting records. Native Soundings remains blocked. Default selected adapter remains v2.

### C. Tests or checks run

Red-before-green missing artifact builder. Native browser QA **8/8**; existing v2 first-campaign browser **5/5**; existing campaign IndexedDB browser **12/12**. Focused app Node **13/13**, adjacent root owner/creator/combat/resource/survey/persistence **93/93**. Content lint **72 files**, Node UI typecheck, direct Vite build **264 client modules**, `git diff --check` pass. Broad UI diagnostics **115 master / 115 PR #29 / 115 branch**; root **763 / 763 / 763**, none in changed files. Broad TypeScript remains baseline failing. No full workspace suite or authenticated selected v3 gameplay.

### D. Risks / follow-up notes

FP-001/002/005/009/012/013/014/015/016/017 applied as detailed in focused decision. Vite reports known large chunk and ineffective dynamic import because the unselected native rules are statically reachable by the candidate store. Selected App still creates/loads v2; native Equipment/Inventory callers, effective-worn combat/resources/Character, native survey witnesses and v3 descendant/terminal acceptance remain. PRs #19/#20/#22/#25/#26/#27/#28/#29 inspected and retained draft; new #30 remains draft, with no merge/retarget/closure/deletion due or performed. Suggested commit `feat(gear): publish unselected native v3 campaign artifacts`. Next named run: [connected owner-action, effective-worn and survey cutover](next-native-gear-owner-action-effective-worn-survey-2026-10-27.md). No Game-version decision proposed.

## 2026-10-27 — Positive native v3 creator and Save read admission

**Source run:** unversioned native gear activation support, isolated `codex/native-gear-positive-v3`, implementation/evidence `f89e29797bb7a1d1106911d1c95527cd4d1c8f16`, draft [PR #29](https://github.com/vagabond1215/Lineage_Reforged/pull/29) targeting #28 `bcdedd4dd448158a326c0299c6ab19551ca53d59`; master `a596112acf3945f2bf7c625e943f2511d12aa710`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. Label class unversioned, parent n/a, development impact `supports_current_band`, game-version impact `none`. Status `POSITIVE_FRESH_V3_CREATOR_AND_READ_ADMISSION_VERIFIED; PUBLICATION_AND_ACTIVATION_HELD`. [Focused evidence](../design/native-gear-positive-v3-creator-admission-checkpoint-2026-10-27.md).

### A. Files changed

`apps/rpg-ui/src/game-shell/nativeNewGameSnapshot.ts`, `legacyPreparationApplication.ts`, `saveManager.ts`; `apps/rpg-ui/tests/native-gear-current-caller-gate.test.mjs`; `packages/shared/types/src/contracts.ts`; `packages/engines/game-engine/src/native-campaign-rules.ts`, `campaign-rules.ts`, `gear-instance-owner.ts`; focused decision, failure pattern, output/handoff/register and next prompt. Master prompt and selected App route unchanged.

### B. Patch summary

An unselected native creator successor grants actual seven-bundle/ten-choice equipment from canonical grants into the existing graph, plus Legacy Bedroll, while keeping fungible stacks. Shared v2/v3 types, fresh native campaign admission and SaveManager read admission accept those complete v3 outputs. A red regression found v2 format-string spoof admission; exact v2 physical-shape validation now blocks it. Actual v3 publication, selected UI actions, effective-worn readers and native survey evidence remain unimplemented, so no selected cutover occurred.

### C. Tests or checks run

Red-before-green native creator module missing and v2 spoof assertion failed before repair. Final focused app **12/12**, adjacent root owner/creator/combat/resource/survey/persistence **93/93**, content lint **72 files**, Node UI typecheck and direct Vite build pass; `git diff --check` pass. Broad UI TypeScript **115 master / 115 #28 / 115 branch**; root **763 master / 765 #28 / 763 branch**. No full workspace suite, actual v3 artifact/restart or selected-client acceptance.

### D. Risks / follow-up notes

FP-001/002/005/009/012/013/014/015/016/017 applied; exact evidence and unmet gates are in focused decision. PRs #19/#20/#22/#25/#26/#27/#28 inspected, all retained draft; no integration, closure, retarget or deletion trigger consumed. Suggested commit `feat(gear): admit positive native creator campaigns`. Next run: unselected v3 SaveManager artifact publication/readback/restart with mixed-format fencing, then connected actions/effective-worn/survey activation. No Game-version decision proposed.

## 2026-10-27 — Candidate native physical contract checkpoint

**Source run:** unversioned native gear fresh-format support on new `codex/native-gear-contract-cutover`, implementation/evidence `fd67a0e343a880932dd1b973c80ec076c42dda30`, draft [PR #28](https://github.com/vagabond1215/Lineage_Reforged/pull/28) targeting #27 `b1bb93c82b45dee9a6f64a496c0dd3b67ae1375e`; synchronized master `a596112acf3945f2bf7c625e943f2511d12aa710`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; label class unversioned, parent n/a, development impact `supports_current_band`, game-version impact `none`. Status `CANDIDATE_PHYSICAL_CONTRACT_VERIFIED; ATOMIC_CALLER_SAVE_CUTOVER_HELD`. [Focused gate](../design/native-gear-physical-boundary-and-atomic-caller-gate-2026-10-27.md).

### A. Files changed

`packages/engines/game-engine/src/native-gear-physical-boundary.ts`; `apps/rpg-ui/tests/native-gear-physical-boundary.test.mjs`, `native-gear-current-caller-gate.test.mjs`; focused gate, this output/handoff/register and next prompt. No production caller, current master prompt, Save schema, Site or Game version changed.

### B. Patch summary

Added a versioned candidate physical-state validator: one owner graph, fungible-only stacks, canonical identities, capacity, old-map/stash rejection and explicit incompatible-development-save guidance. Tested two distinct bow instances and 300 rations through JSON readback. All seven real creator callers still output v2/17-slot state; no v3 creator, UI action, combat/resource/survey/Save activation is claimed. The full atomic cutover is held on the exact campaign-rules/survey/SaveManager dependencies in the focused gate.

### C. Tests or checks run

Red-before-green module absence; candidate boundary 5/5; seven real creator bundle gate 1/1; adjacent root 82/82; app group 8/8; content lint 72 files; Node UI typecheck and direct Vite build pass. Broad UI TypeScript 115 clean master / 115 branch; broad root 763 clean master / 765 PR #27 base / 765 branch, zero new module diagnostics. `git diff --check` pass. No v3 selected-client Save/restart, interrupted publication, full workspace suite or Site check.

### D. Risks / follow-up notes

FP-001/002/005/009/012/013/014/015/016/017 applied as detailed in focused gate. PRs #19/#20/#22/#25/#26/#27 inspected and retained draft; no integration, closure or deletion trigger consumed. Suggested commit `feat(gear): define candidate native physical save boundary`. Next recommended run: atomic v3 campaign, survey, SaveManager, creator, action, projection and current-format restart cutover, with failing real-caller tests first. No Game-version decision proposed.

## 2026-10-26 — Native gear fresh-format activation gate

**Source run:** unversioned native gear cutover checkpoint; source `master` `a596112acf3945f2bf7c625e943f2511d12aa710`, PR #20 base `0d6debe5`, implementation/evidence commit `50a63fdaa4c22cd7beea4ea6dda3949844197a03` on `codex/native-gear-fresh-cutover`, stacked draft [PR #27](https://github.com/vagabond1215/Lineage_Reforged/pull/27) targeting #20. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. Label class unversioned, parent n/a, development impact `supports_current_band`, game-version impact `none`. Status: `OWNER_FIT_VERIFIED; ATOMIC_CALLER_SAVE_CUTOVER_HELD`. [Focused evidence](../design/native-gear-fresh-format-activation-gate-2026-10-26.md).

### A. Files changed

`packages/engines/game-engine/src/gear-instance-owner.ts`, `packages/content/base/items/equipment_fit_profiles.json`, `tests/unit/gear-instance-owner.test.mjs`, `apps/rpg-ui/tests/native-gear-fit-parity.test.mjs`, focused decision and this branch's output/handoff/register/next prompt. The current master prompt is untouched.

### B. Patch summary

Extended the unactivated #20 owner with explicit fit profiles for all 50 types accepted by the current resolver, plus six carried-only starter types. All seven bundles have complete classification (24 identities: 19 durable and five fungible); ten choice-resolved native-owner grant/readback fixtures prove unique IDs, location and condition. The selected creator, equipment/Inventory actions, combat/resources, survey and Save still use the prior authority. A partial activation would publish two physical ledgers, so the requested atomic cutover remains incomplete.

### C. Tests or checks run

Red-before-green starter test failed on `item.lumber_axe`, then native owner 9/9, live-resolver parity 1/1, adjacent owner/combat/persistence/survey 89/89, app Equipment/Inventory set 14/14, master creator/combat/Save fixture 37/37. Content lint 72 files, Node UI typecheck, strict owner typecheck, direct Vite build and `git diff --check` pass. Broad TypeScript 115 master / 115 candidate, zero normalized delta. These do not establish current-format real-caller Save/restart or selected-client acceptance.

### D. Risks / follow-up notes

FP-001/002 real caller is unactivated; FP-005/012 stale/duplicate owner fixtures only; FP-008/009 exact branch and source heads separated; FP-013/014/015/016 new graph publication, witness and effects require atomic contracts; FP-017 creator fixture is not selected gameplay. PRs #19, #20, #22, #25 and #26 inspected and retained draft; #22→#25 Echo stack is separate. No merge, close, deletion, deployment or Game-version change. Suggested commit: `docs(gear): record native activation gate`. Next recommended run: fresh-format PlayerState/Save/survey contract and full caller activation after red real-caller tests; no separate game-version decision proposed.

## 2026-10-26 — Fresh gear-instance owner foundation checkpoint

**Source run:** unversioned Character Equipment fresh-format owner support. Inspected `master`/`origin/master` `a596112acf3945f2bf7c625e943f2511d12aa710`; PR #19 docs head `62d6cc7b00fdd9f17a4424aafd6527a754b1906c` supersedes obsolete-save migration. Branch `codex/gear-instance-fresh-epoch`, pushed implementation head `5464858bde0ac2c2bf715a43480b394837f04fac`, draft [PR #20](https://github.com/vagabond1215/Lineage_Reforged/pull/20), review-held. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; label class unversioned, parent milestone n/a, development impact `supports_current_band`, game-version impact `none`.

### A. Files changed

`packages/engines/game-engine/src/gear-instance-owner.ts`, `packages/content/base/items/equipment_fit_profiles.json`, `tests/unit/gear-instance-owner.test.mjs`, [focused decision](../design/character-fresh-gear-instance-owner-foundation-2026-10-26.md), current output/handoff/prompt and branch register.

### B. Patch summary

Implemented an executable version-1 item-instance/location owner. Generated IDs and individual durability persist through owner JSON readback; grants, worn/bag/overflow movement, displacement and bag-capacity handling are atomic. Stale and duplicate requests do not mutate. Native Equipment/Clothing/Accessory positions include Back, sided Ear/Eye and ten rings; six item profiles author the initial proven fit subset. The owner is deliberately **not activated** in 17-slot gameplay, UI or SaveSnapshot v2, because doing so without a full caller/save/survey cutover would create a second physical ledger.

### C. Tests or checks run

Red-before-green: new suite initially failed with `ERR_MODULE_NOT_FOUND`; owner 5/5 final. Root owner/combat/Save suite 45/45; adjacent app Equipment/Inventory/Character suite 29/29 from `apps/rpg-ui`; content lint 72 existing registered files; `typecheck:node` pass; isolated owner `tsc --strict` pass; direct Vite production build pass. Broad UI TypeScript 115 error signatures on clean master and 115 on branch, zero delta. Staged `git diff --check` passed. The first app test invocation from repository root failed because its Vite `/src` root was wrong; it was rerun successfully from the required app directory. No new owner selected-client Save/restart, actual campaign creation, combat/resource parity, interrupted publication or survey witness proof is claimed.

### D. Risks / follow-up notes

FP-001: actual caller cutover remains required; FP-002: green foundation tests do not accept the parent; FP-005: stale/duplicate owner requests tested; FP-009: source and draft branch identities separated; FP-013: future nested Save owner must survive all campaign rewrites; FP-014/FP-016: new-format graph/witness publication requires independent verification. Open PRs #5–#19 were inspected; #19 remains draft design direction, #17/#18 remain evidence, all prior holds retain review triggers. No merge, closure, deletion, Site deployment or Game version change. Suggested commit: `feat(equipment): add native gear instance owner foundation`. Next run: atomic real-caller and fresh-format Save cutover, including fit coverage, starter/quest/combat/resource/survey integration and incompatible-save guidance.

## 2026-10-26 — Stage 2 durable item-location owner gate

**Source run:** unversioned Character equipment owner support; fetched/pruned synchronized `master`/`origin/master` `0d4fbbacda714a23e2b6a5922b8cc8f1a9ab3546`, source/test/decision commit `dae9e6e6`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; label class unversioned, parent milestone n/a, development impact `supports_current_band`, game-version impact `none`. [Focused Stage 2 decision](../design/character-durable-item-location-stage-2-decision-2026-10-26.md).

### A. Files changed

`packages/engines/game-engine/src/legacy-item-location-audit.ts`, `apps/rpg-ui/tests/legacy-item-location-audit.test.mjs`, focused Stage 2 decision, linked Stage 1 decision and next installed prompt; this output, handoff and branch register record completion.

### B. Patch summary

Added a read-only source-location audit of old equipped, bag and overflow quantities. It retains original source records, enumerates bounded source units, and blocks legacy stash flags, malformed equipment/inventory, duplicate bag ids and invalid quantities. A real UI Equip/Unequip test proves that old item-type stash flags cannot identify which of two merged identical bows owns durability after Save. No live instance ID, location ledger, save migration, new slots, gameplay action, UI toggle or Site deployment was activated. The complete durable owner cutover is held on this information-loss boundary and requires an owner-backed repair/quarantine path.

### C. Tests or checks run

Red-before-green: the new suite failed before the module existed; malformed inventory and equipment tests failed before their fail-closed guards, then passed. Final UI **41/41**, focused equipment/combat/resource/Save and historical-survey/persistence **99/99**, Node UI typecheck pass, direct Vite production build pass. Broad TypeScript on an independent clean `0d4fbbac` worktree and changed checkout: **115 vs 115 diagnostics, zero delta**. `npm run ui:build` exits 2 on those existing errors; isolated new-module typecheck reports only existing `settlement-institutions.ts:1111`. Staged `git diff --check` passed. No selected-client conversion or Save/restart claim is made: the feature remains inactive.

### D. Risks / follow-up notes

FP-001: real `unequipItem` plus SaveSnapshot serialization reproduces merged-copy identity loss. FP-002: green tests do not accept the live owner or layered-loadout parent. FP-003: any future migration quarantine needs a reachable repair owner before activation. FP-009: fetched base, source commit and final remote head are distinct identities. FP-016: existing exact 17-slot Ashen Reef witness/Save tests pass, but no new live projection is accepted. Draft PRs #5–#17 were reinspected as open draft and retained; #17 `9f427961` is design evidence only. Protected/creator/nutrition refs and parked DEV-0.7.2.13 retain their prior holds; no merge or deletion trigger was consumed. Suggested source commit: `test(equipment): audit legacy item-location conversion gate`. Next: one isolated-branch non-fungible owner/action/Save cutover with an explicit ambiguity repair policy; no UI loadout controls yet.

## 2026-10-26 — Layered equipment historical migration probe

**Source run:** unversioned Character layered-equipment owner support; fetched/pruned clean tracked `master`/`origin/master` `cf8eb7a8d1e4a3acf389b5f02ed036047fc58737`; source/test/decision commit `aae4eb0b`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; label class unversioned, parent milestone n/a, development impact `supports_current_band`, game-version impact `none`. [Focused owner decision](../design/character-layered-equipment-migration-probe-decision-2026-10-26.md).

### A. Files changed

`packages/engines/game-engine/src/equipment-migration-plan.ts`, `tests/unit/equipment-migration-plan.test.mjs`, focused migration decision, linked preflight and next installed prompt; this output, handoff and branch register record completion.

### B. Patch summary

Added a pure, versioned 17-slot historical save inspection probe. It proposes snapshot-scoped per-unit IDs and deterministic left-side Ear/Eye/Ring positions, retains complete source quantity/durability/modifiers, and blocks invalid or ambiguous multi-unit records. `activation: not_authorized` explicitly prevents the probe from being treated as live migration authority. No live save, slot, item action, combat/resource reader, clock, UI, or Site deployment changed. Durable instance/location ownership, actual sided slots, layered clothing/presets, authored fit and one-watch Equip remain deferred.

### C. Tests or checks run

Red-before-green: new focused test failed on missing module; revised left-side/excess assertion failed against an initial right-side proposal, then passed after repair. Final focused migration **4/4**; equipment/combat/resource/Save selection **55/55**; campaign persistence and historical survey **44/44**; UI suite from `apps/rpg-ui` **36/36**. Node UI typecheck passed. Clean-master broad TypeScript comparison: **115 vs 115 diagnostics, zero delta**. `npm run ui:build` stopped at those same preexisting diagnostics; direct `npx vite build` from `apps/rpg-ui` succeeded. Staged `git diff --check` passed. The first root-invoked UI test run failed due Vite's working-directory resolution; rerun from the UI package passed. An overbroad owner invocation was interrupted after stalled session output; the bounded owner and persistence suites above completed separately. Isolated typecheck of the new module reported only the preexisting `settlement-institutions.ts:1111` error, no new-module diagnostic.

### D. Risks / follow-up notes

FP-001: actual live readers/action paths were inspected, but this probe is not installed in them. FP-002: passing fixtures do not accept the layered-loadout parent or selected gameplay. FP-009: baseline, source commit and final pushed head are distinguished. FP-016: historical Ashen Reef validation and exact source bytes remain unchanged; a future migrated live record still needs history-safe projection and restart proof. Selected-client acceptance is held because no new interactive behavior exists in this slice. Draft PRs #5–#17 were inspected and retained; #17's `9f427961` follow-up is design evidence only, no merge or deletion trigger. Protected refs, nutrition and parked DEV-0.7.2.13 remain untouched. Suggested source commit: `feat(equipment): add read-only legacy migration probe`; next route: durable wearable instance/location owner and versioned conversion, not UI toggles.

## 2026-10-26 — Character equipment frame refinement and layered-loadout preflight

**Source run:** unversioned Character presentation and owner preflight; inspected clean tracked `master`/`origin/master` `18260c6a5a64eeb918f000cef57e0a0d23eaf768`, implemented/pushed/read back `3c9a71e2d5722101ee45be8b5b1d7e0753cc5c4a`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; label class unversioned, parent milestone n/a, development impact `supports_current_band`, game-version impact `none`. [Detailed record](character-equipment-layout-and-loadout-preflight-record-2026-10-26.md).

### A. Files changed

`apps/rpg-ui/src/features/character-sheet.css`, `apps/rpg-ui/tests/character-overview-render.test.mjs`, focused layered-loadout preflight, UI information-architecture boundary, focused run record, current/deferred prompts, current output/handoff, historical/planning reconciliation and branch register.

### B. Patch summary

Outer Overview slot boxes removed; inner item squares enlarged 50%; nine stat tiles tightened for 3-digit values. Existing 17 owner-backed slots and actions remain. Owner's real layered/preset/sided-slot/one-watch direction is recorded, with functional UI held until versioned save/item-instance/fit/action owners can preserve item conservation and time semantics.

### C. Checks run

Focused Overview 1/1 after final test assertion, full UI 36/36 before that assertion, Node UI typecheck and Vite build pass; broad UI TypeScript 115 prior-baseline diagnostics (exit 2). Companion Site Node check/build pass; its byte-matched CSS was pushed/read back at `5ce989ff0a7f4e49be7d95b017854e65513686d9` and owner-private version 16 deployed. Local/hosted browser reached Account Login only; no authenticated new-layout acceptance or Save/restart claim.

### D. Risks / follow-up notes

FP-001/002/009/016: actual owner and Save caller paths were inspected; fixture tests do not establish selected gameplay; base versus final publication identities are separate; slot byte sizing was checked at desktop/mobile breakpoints but authenticated post-change viewport is held. The historical survey exact-17-key validator and `0.6.0` save admission gates require a backward-compatible owner migration. Draft PRs #5–#17 inspected and retained; no merge/deletion trigger. An empty, unpushed owner inspection branch was deleted after returning to `master`. Suggested commit: `ui: enlarge Character item frames and tighten attributes`. Next: bounded layered-equipment owner and migration decision, then implementation, then real UI controls. DEV-0.7.2.13 and Game version remain unchanged.

## 2026-10-25 — Humanoid Character equipment diagram

**Source run:** unversioned bounded Character presentation on `master`, inspected base `58355b40dd1c3014902a1bb5b68d0e3e48799dc4`, implementation `4144c179b44bb74e8247b403b9902623bcceac63` pushed/read back. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; label class unversioned; parent development milestone n/a; development impact `none`; game-version impact `none`. [Focused evidence](humanoid-character-equipment-layout-2026-10-25.md).

### A. Files changed

`CharacterPanel.tsx`, `character-sheet.css`, focused Overview render test, UI information-architecture boundary and focused record; this output, handoff and branch register record final publication.

### B. Patch summary

All 17 canonical slots appear once in a six-row humanoid diagram with row-major Tab order. Head/eyes/ear are above neck/shoulder and torso; hands/weapons/waist sit beside the middle; fingers are below hands; legs, feet and ankle finish the layout. No equipment owner, item art, compatibility, action or save change. Companion Site source `b9da49fe80ea5147122f009a674315999c30c175` was pushed/read back and owner-private version 15 deployed as `appgdep_6adea1a1b938819191e9adeedc48eee9`.

### C. Tests and checks run

Focused render 1/1, UI suite 36/36, Node typecheck and Vite production build pass in both Lineage and private Site source, broad TypeScript 115 prior-baseline diagnostics with none in changed source, `git diff --check` pass. Signed-in Merrit Slot 1 selected desktop check showed the new spatial/AX order, Head inspection reached the correct Equipment detail, and Back returned to Character. FP-001 actual caller and route, FP-002 selected limits, FP-008 PR #17 semantic boundary and FP-009 source/deployment identities are recorded in the focused evidence.

### D. Risks / follow-up notes

Local in-app browser could not reach the temporary Vite preview; the temp files and server were removed. A signed-in desktop visual check passed, while narrow-screen viewport and physical keyboard Tab/Enter checks remain unobserved. PRs #5–#16 retain prior holds; new docs-only PR #17 is deferred mechanics, not this visual owner. No branch integration or retirement was due. Suggested commit for this coordination update: `docs(dev): record humanoid Equipment layout publication`. Next: bounded narrow-screen/keyboard acceptance and separately scoped normal-zoom Equipment action reachability. Parked DEV-0.7.2.13 and Game version remain unchanged.

## 2026-10-25 — Character sheet navigation consolidation

**Source run:** unversioned bounded Character presentation; `master` base `5facfee1df8fc740a26191cb576e0d789c5cdfbb`, implementation `e36370fc1037ab8d8d7b0210ba45c56df667ceb0` pushed/read back. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; label class unversioned; parent development milestone n/a; development impact `none`; game-version impact `none`. [Focused evidence](character-sheet-navigation-consolidation-2026-10-25.md).

### A. Files changed

`CharacterPanel.tsx`, `mobile-shell.css`, Character Overview render test, obsolete Character nav helper/unit test, UI information-architecture boundary and focused evidence record. This output, handoff and branch register are the completion coordination update.

### B. Patch summary

Removed the repeating horizontal Character subsection bar. Added owner-backed, collapsed Standing, Reputation and Discoveries sections below the sheet's existing expanders. Preserved detail views via inline links, Equipment management via matrix/link, separate Inventory dock and focusable return navigation. No gameplay/save/schema change. Companion Site source `57a128f7735af8af8dc2e6bab48d44b6af439af0` was pushed/read back; owner-private version 14 deployed successfully as `appgdep_6ade8f2572988191a64caca9db10a993`.

### C. Tests and checks run

Focused Character render 1/1; UI suite 36/36; Node UI typecheck pass in both Lineage and Site checkout; Vite production build pass in both; broad UI TypeScript 115 existing diagnostics, none in changed source, matching prior clean-master baseline; `git diff --check` pass. The incorrect initial directory-form Node test invocation was rerun with explicit files. The Site version readback matched pushed source SHA and archive hash. FP-001 caller-path rendering/route reachability is tested; FP-002 selected acceptance remains held; FP-009 inspected base, implementation and deployed source are distinct above.

### D. Risks / follow-up notes

Authenticated interaction for this exact navigation change remains held: IAB showed Account Login, while the authorized Brave window was in active use on an unrelated page. No credentials were used. Draft PRs #5–#16 and protected/creator/nutrition refs retain their prior holds; no branch action due. Suggested commit message for this coordination update: `docs(dev): record Character sheet navigation publication`. Next: selected click/keyboard/Save-restart check when the signed-in game is available, then a separate normal-zoom Equipment action reachability repair. Preserve parked DEV-0.7.2.13 and Game version.

## 2026-10-25 — Selected Character sheet completion

**Source run:** unversioned Character UI presentation completion; branch/status `master`, source `03f668795d0c331944471c030f8fb054890ab865` pushed/read back; Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; parent development milestone n/a; development-milestone impact `none`; game-version impact `none`. [Focused evidence](character-sheet-selected-finish-2026-10-25.md).

### A. Files changed

CharacterPanel, Character sheet CSS, InGameShell, focused Overview/navigation tests, three selected screenshots, focused record and current coordination records.

### B. Patch summary

Square bounded art and right-column attribute/progression detail removed the unused desktop sheet band. Distinct Character/Inventory component identities fixed selected navigation showing Inventory heading above stale Equipment content. The profile grid's explicit bounded column removed selected 375px horizontal clipping (`719` to `295` scroll width inside a `295`px profile). Gameplay owners and save schemas are unchanged.

### C. Tests and checks run

Three red-before-green focused assertions; final UI **36/36**, Node UI typecheck pass, Vite build pass, broad UI TypeScript **115 preexisting diagnostics** equal to baseline, `git diff --check` pass. Authorized selected Brave Slot 1 proved nine attributes, 17 slots, Enter toggle, Pickaxe unequip→bag→Save/restart→re-equip→Save/restart with quantity 1 and 100% durability. Selected layouts inspected at 375×667, 768×812 and desktop. FP-001/002/009/016 evidence is in the focused record.

### D. Risks / follow-up notes

Normal-zoom Equipment selected-slot action reachability remains a separate UI defect; 80% browser zoom exposed the control for the selected round trip. No authored item art, live weather mapping or nutrition reserve owner was invented. Lineage source commits `77ed9747`, `0882a026`, `03f66879` and companion Site source `89c52e14` were pushed/read back; owner-private Site version 13 deployed successfully as `appgdep_6ade1f6cfe608191a6921ad562639724`. Draft PRs #5–#16 retain their existing holds; no branch action due. Suggested commit: `docs(dev): record selected Character sheet completion`. Next: bounded Equipment action reachability at 100% zoom; preserve DEV-0.7.2.13 and Game version.

## 2026-10-25 — Weather artwork and root scaffold placement

**Run:** unversioned Lineage asset organization on `master` after compact Character source `508f1ea0`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; development-milestone and game-version impacts `none`. DEV-0.7.2.13 remains parked. [Focused record](weather-artwork-root-placement-2026-10-25.md).

### A. Files changed

27 source weather PNGs under `assets/weather/source/`, asset README, focused record and current coordination records. Outside the repository, 33 hash-verified duplicate/copied root PNGs and two empty task scaffolds were removed; the user-retained Wind Mage image and unrelated project work were left in place.

### B. Patch summary

Weather art is organized as source material without shipping it or implying current weather owner state. Already-published season art remains in its canonical UI asset folder. No gameplay, calendar, save or UI behavior changed.

### C. Tests and checks run

Weather copy SHA-256 **27/27**, season SHA-256 **6/6**, weather PNG decode **27/27**; empty scaffold predelete file count zero and path checks passed. No runtime test applies to unreferenced source artwork. FP-009: exact hashes and deletion inventory read back. No other failure pattern applies.

### D. Risks / follow-up notes

Nonempty `C:\Codex\2026-09-12` belongs to another project and remains outside this repository's mutation authority. Asset commit `ac813b30e5138ae512c36a68d4b3939ec7f92a96` was pushed/read back. Draft PRs #5–#16 and protected refs retain dispositions; no branch action due. Suggested commit: `chore(assets): organize weather source artwork`. Next: define a weather owner/mapping before publishing or displaying these icons.

## 2026-10-25 — Compact scalable Character Overview

**Run:** unversioned Character UI presentation on `master` from `401b9761536d38635ac6945ad010c64c71666835`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; development-milestone impact `none`, game-version impact `none`. DEV-0.7.2.13 remains parked. [Focused record](compact-character-overview-sheet-2026-10-25.md).

### A. Files changed

CharacterPanel, character-sheet CSS, equipment presentation projection, Overview render test, UI boundary and current coordination records.

### B. Patch summary

Portrait and all nine inspectable attributes form the left rail; saved base identity and all 17 canonical equipment frames occupy the adjacent area. Empty frames have no item image or visible Empty label; current items use the restrained fallback because no item artwork is authored. Skills, Traits, Effects, Echo/Growth and earned titles expand independently without preview truncation. Equipment and Inventory owner actions and save state are unchanged.

### C. Tests and checks run

Overview rendering **1/1**, full UI **35/35**, relevant owner actions **13/13**, Node UI typecheck and Vite build pass. Broad UI TypeScript **115 existing diagnostics**, equal to clean-main baseline, with none newly introduced in touched files. `git diff --check` passes. FP-001/002/009/016 evidence and the visual-check limitation are in the focused record.

### D. Risks / follow-up notes

Windows Computer Use stopped after it could not verify the active browser URL; live viewport, keyboard and authenticated selected-client acceptance remain open. Lineage implementation `508f1ea086b185949cfefed4a76024aa19fc35e4` and authorized Site source `813fc0c2d442874168741c60a9e7ad07a0f61452` were pushed/read back; owner-private Site version 10 deployed successfully as `appgdep_6ade178d91d48191a731e7dbebe9a58d`. UI drafts #5–#16, creator/nutrition/protected branches and Game version retain their dispositions; no branch action was due. Suggested commit: `feat(ui): compact scalable Character Overview`. Next: authorized selected Character viewport/keyboard/Save review, then separately add real item art if authored.

## 2026-10-25 — Six-season calendar and top-bar emblems

**Run:** unversioned UI/calendar support on `master` from `c74ba8cbd`; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`; development-milestone and game-version impacts `none`. DEV-0.7.2.13 stays parked. [Focused record](six-season-calendar-topbar-2026-10-25.md).

### A. Files changed

Shared time/types, calendar and climate content/schema/lint, economy and clock validation, top-bar/calendar presentation and CSS, six public emblems, focused tests and current documentation.

### B. Patch summary

Canonical season order is Deepfrost, Thaw, Waking, Swelter, Harvest, Withering, with formal `The` names. The top-bar name area now contains a season emblem and owner-backed date/watch; current weather is disclosed as unavailable. Legacy Winter/Spring/Summer save values remain readable and normalize on the next clock tick. No numeric economy, climate or save schema changes.

### C. Tests and checks run

Focused calendar/art/SaveSnapshot **14/14**, full UI **35/35**, owner/economy/snapshot **100/100**, content lint **72 files**, Node UI typecheck and Vite build pass. Broad UI TypeScript **115 diagnostics** against prior **117** baseline, with none newly introduced in touched files. `git diff --check` passes. FP-001/002/009/016 evidence is in the focused record.

### D. Risks / follow-up notes

Authenticated selected UI and Save/restart proof remains held. Lineage implementation `9222f564460403098d397d4393ab286d68e460cf` and separately authorized Site source `47e66ad3aa265d1724395ba87dc7d65200492cb8` were pushed/read back; owner-private Site version 9 deployed successfully as `appgdep_6add8208aaf0819195a34e7dfcf93b2b`. UI drafts #5–#16, creator/nutrition/protected branches and Game version retain current dispositions; no branch action was due. Suggested commit: `docs(ui): record six-season Site publication`. Next: authorized selected calendar/viewport review and later owner-backed weather projection.

## 2026-10-24 — Compact Character sheet and Inventory dock

**Run:** unversioned UI presentation on `master` from `ea8923fe`; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`; milestone and game-version impacts `none`. DEV-0.7.2.13 stays parked. [Focused record](compact-character-sheet-ui-2026-10-24.md).

### A. Files changed

CharacterPanel and new sheet CSS, InGameShell/dock/view-model navigation, top bar/icons/layout/mobile CSS, UI types, focused UI and keyboard tests, UI boundary and current coordination records.

### B. Patch summary

Character Overview now groups known-size identity, lineage illustration, nine attributes, leading skills, traits, growth and equipped gear into a compact sheet. Inventory moves to the main dock with owner actions unchanged. Top padding shrinks, Energy/Water vertical meters grow, horizontal resource/macro tracks share a maximum width, and calendar-derived SVG symbols replace climate text without claiming live weather.

### C. Tests and checks run

Focused UI/owner **34/34 pass**, Character keyboard unit **1/1 pass**, Node typecheck and Vite build pass. Broad TypeScript remains at **117 existing diagnostics**, none in touched files; `git diff --check` passes. FP-001/002/009/016 apply with evidence in the focused record.

### D. Risks / follow-up notes

Localhost browser access was denied and authenticated hosted gameplay was unavailable, so selected viewport, action and Save/restart acceptance remain held. Lineage source commit `5f735b816df4461d26db61d2000fc5134d1b4798` and companion Site source `ccb0e004584eeb0cf5c86cae416ef0211aa811d6` were pushed/read back; private Site version 7 deployed successfully as `appgdep_6add699e55e081919c144ae099d663af`. Draft #5–#16, creator/nutrition/protected branches and Game version are unchanged. Suggested commit: `docs(ui): record Character sheet publication readback`. Next bounded run: selected responsive/navigation review on exact main, followed by an owner-backed weather projection only if accepted.

## 2026-10-24 — Character Attributes and Codex Atlas

**Run:** unversioned UI navigation on `master` from inspected `7428c66d`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; development milestone and game-version impacts `none`. DEV-0.7.2.13 stays parked. [Focused record](character-attributes-and-codex-atlas-2026-10-24.md).

### A. Files changed

CharacterPanel, CodexPanel, section/view-model navigation, Atlas/Overview/keyboard tests, UI boundary and focused/coordination records.

### B. Patch summary

Removed duplicate Character Attributes and Geographic Knowledge subsections. Overview retains nine selectable attribute details; Codex Atlas reuses visible owner-backed lands, regions and settlements with search, count and a read-only detail view. No map, travel or save owner changed.

### C. Tests and checks run

UI **35/35** and keyboard/geographic unit **4/4** pass; Node UI typecheck and Vite build pass. Broad TypeScript retains **117 baseline diagnostics** after a new nullable count was repaired. `git diff --check` passes. FP-001/002/009/016 evidence is in the focused record.

### D. Risks / follow-up notes

Lineage implementation `1989abcff5d5862ffa6c65169de21c6dcacaff11` and companion Site source `25020c69c3ee5c2cd50328ad653a03a77efdafe5` were pushed/read back; owner-private Site version 8 deployed as `appgdep_6add7e3e999c8191be99f00849796ca8`. Hosted preview remains at Account Login, so selected navigation and Save/restart are held. Draft #5–#16 retain named consumers; no branch action was due. Suggested commit: `docs(ui): record Atlas publication readback`. Next run: authorized selected viewport/navigation and Save review; no Game-version decision.

# Current Codex Output

## 2026-10-24 — Safe UI branch integration and Site synchronization

**Run:** unversioned branch integration review from `master` `ea9dc17f`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development-milestone and game-version impacts `none`. DEV-0.7.2.13 remains parked. [Focused decision](ui-safe-integration-and-deployment-review-2026-10-24.md).

### A. Files changed

UI information-architecture boundary §23, focused branch/deployment review, current output/handoff and branch register. No production source, tests, schemas, assets or Game version changed.

### B. Patch summary

Re-authored the still-valid Character-first priority from PR #5 against current main, including the selected-client acceptance hold and marked macro-prototype exception. No old PR branch is safe to Git-merge directly; #7–#16 source is already re-authored on main, while unique evidence/selected gates remain held. #6 and the distinct Creator branch remain separate.

### C. Tests and checks run

Fresh branch/PR inventory and semantic changed-path comparison; Site source/deployment readback. Focused current-main UI **34/34 pass**, Node typecheck pass, Vite build pass (unchanged JS/CSS assets), broad TypeScript exit 2 with **117 existing diagnostics**, and `git diff --check` pass. FP-002/008/009/016 apply; evidence is in the focused decision.

### D. Risks / follow-up notes

No PR merge/closure or branch deletion; all prior named consumers remain. Lineage design-reconciliation commit `184e75e709b28c03d68d488e89430b4d914ba24f` was pushed/read back. Site source is app-equivalent after line-ending normalization, and saved Site version 6 was redeployed successfully as `appgdep_6add196ce5588191a5eecd7ad658fc27`; no new Site version was created. Selected-client UI/Save acceptance and live external Creator-image delivery remain unverified. Next run: exact-main selected UI/Save acceptance and evidence-preserving PR supersession; separate Creator/nutrition owner reviews, no Game-version decision.

## 2026-10-24 — Dismissible notices across the active Epoch app

**Run:** unversioned UI support from `master` `4d128c65`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development-milestone and game-version impacts `none`. DEV-0.7.2.13 remains parked. [Focused record](dismissible-notices-all-screens-2026-10-24.md).

### A. Files changed

`EpochApp`, `InGameShell`, shared `NoticeToast`, focused notice test and this focused/coordination handoff.

### B. Patch summary

Account, menu, creator, load and settings notices now use the same eight-second in-page popup as gameplay notices. Hover/focus pauses expiry; explicit timeout and persistence are honored. The saving badge no longer overlaps the popup. Existing notice owner/reducer and gameplay state are unchanged.

### C. Tests and checks run

Focused UI 34/34, Node UI typecheck and Vite build pass. Broad TypeScript remains at 117 prior-baseline diagnostics with none in touched files. `git diff --check` passes. FP-001/002/009/016 applied as described in the focused record.

### D. Risks / follow-up notes

Lineage implementation `e555c569c33d0fe7b798d3b10be380b5473d847d` and companion Site source `dfb74ac9d2fc102888e43070d441ad4f820abd6d` were pushed/read back; Sites **version 6** deployed successfully at `https://lineage-reforged-preview.vagabond1215.chatgpt.site`. Local browser route timed out; hosted app reaches Account Login, so authenticated selected notice interactions and Save/restart remain held. Twelve open PRs #5–#16 retain their prior dispositions; no branch action is due. Next bounded review: selected notice timing and keyboard behavior when authorized access exists; no new milestone or Game-version decision.

## 2026-10-24 — In-game notice toast and marked nutrition layout preview

**Run:** unversioned UI presentation support on `master` from `5d9ad83b`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development-milestone and game-version impacts `none`. DEV-0.7.2.13 stays parked. [Focused record](in-game-notice-and-nutrition-preview-2026-10-24.md).

### A. Files changed

TopStatusBar, top-status CSS, InGameShell, NoticeBanner, two focused UI tests, focused record, current output/handoff and branch register.

### B. Patch summary

Ordinary notices become fixed, dismissible eight-second in-page toasts with explicit timeout/persistence support. The top bar presents a visibly marked illustrative Protein/Carbs/Fat and zero-centered balance prototype while showing actual tracked Energy and Water. Water is a vertical owner-backed meter; no nutrition or save owner changed.

### C. Tests and checks run

Focused UI tests 33/33, Node typecheck and Vite build pass. Broad UI TypeScript remains at 117 pre-existing diagnostics with none in touched files. `git diff --check` passes. Local in-app browser visual route timed out, so selected visual/Save acceptance remains open. FP-001, FP-002, FP-009 and FP-016 applied as detailed in the focused record.

### D. Risks / follow-up notes

Lineage source `a5e49c18b7fe2298bdc25e5e1e92c536782448b0` is pushed/read back. The separately authorized companion Site source `b5b78531754bb9bed3d498f61fc7987865d3a280` is pushed/read back and Sites **version 5** deployed successfully at `https://lineage-reforged-preview.vagabond1215.chatgpt.site`. Hosted browser reaches Account Login; authenticated in-game visual/Save acceptance remains held. The static macro fills are deliberately labeled preview. No Lineage branch/PR disposition changes or cleanup are due; #5–#16 remain draft with exact-main selected acceptance/evidence triggers. Next run: bounded hosted UI layout and selected-client review; no new development milestone or Game-version decision.

## 2026-10-24 — UI branch and worktree consolidation

**Run:** unversioned repository coordination at synchronized `master`/`origin/master` `f6c7b504`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development-milestone and game-version impacts `none`. DEV-0.7.2.13 remains parked. [Focused record](ui-branch-worktree-consolidation-2026-10-24.md).

### A. Files changed

Focused consolidation record, branch-disposition register, current output and handoff. No product source, tests, schemas, dependencies or Game version changed.

### B. Patch summary

Removed eight clean, remote-backed local implementation worktrees and their verified residual dependency junctions. Preserved all local/remote branch refs, twelve open draft PRs, dirty rehearsal worktrees and protected references. No branch disposition changed because unique PR evidence and exact-main selected acceptance still have named consumers.

### C. Tests and checks run

Fetched/pruned; inspected open PRs #5–#16, exact refs, branch/worktree status, remote-head equivalence and junction targets; post-cleanup worktree inventory; `git diff --check` before commit. No product tests were rerun for coordination-only cleanup. FP-002, FP-008 and FP-009 applied through explicit acceptance hold, semantic stack retention and exact ref checks.

### D. Risks / follow-up notes

Review each dirty detached composition's unique evidence before removal. Reconcile #5 design, then prove exact-main selected Character/Equipment/Inventory/top-bar/shell actions and Save/restart before closing draft PRs or deleting branches. The installed UI readiness prompt predates the master source integration and needs a dedicated refresh before reuse. Suggested commit: `docs(ui): record safe worktree consolidation`.

## 2026-10-24 — Full preview UI source integration to main

**Run:** unversioned UI presentation integration from current master `2b7bd6ee`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development and Game-version impacts `none`. DEV-0.7.2.13 combat remains parked. [Focused record](topbar-dock-main-integration-record-2026-10-24.md).

### A. Files changed

CharacterPanel and section navigation; characterPanelState and equipment-slot owner; new-game snapshot; TopStatusBar, TopResourceMeter and owner projection; SideNav, AppLayout and responsive CSS; nine focused UI tests, one root navigation test and integration/coordination documentation.

### B. Patch summary

Re-authored the full current Character/Equipment/Inventory, owner, top-bar and shell production stack from draft #7–#16 on current master. The clearly illustrative Protein/Carbs/Fat review fixture is excluded. A narrow CharacterPanel optional-type repair removed 18 new broad TypeScript diagnostics without changing owner actions.

### C. Tests and checks run

Composed focused UI tests 32/32; adjacent SaveSnapshot, Character navigation, equipment/combat-profile and body-state tests 51/51; Node UI typecheck and Vite production build pass; broad UI TypeScript 117 existing diagnostics versus clean master 137, zero new lines; `git diff --check` pass. Exact-source controlled browser checked nine attributes, Equipment/Inventory, Composite Bow round trip, navigation, focus, disclosures and 375/667/768/1440px overflow. FP-001/002/008/009/016 applied. Authenticated selected-client Save/restart acceptance remains open.

### D. Risks / follow-up notes

This source push does not merge or accept PR histories, nutrition or design guidance. #7–#16 remain draft and held for selected gameplay/Save review and evidence-preserving disposition. Suggested commit: `ui: integrate Character and status shell on main`.


## 2026-10-23 — UI branch consolidation and preview access decision

**Run:** unversioned UI coordination on synchronized `master`/`origin/master` `8981bf02aa9fef535862ed92947ab2326e129343` before publication. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; development and Game-version impacts `none`. DEV-0.7.2.13 combat remains parked. [Focused decision and full branch map](ui-branch-consolidation-and-preview-access-decision-2026-10-23.md).

### A. Files changed

Focused branch/access decision, this output, current handoff and branch-disposition register. No product source, auth owner, tests, schemas, generated output or Game version changed.

### B. Patch summary

The existing combined-shell fixture provides sign-in-free visual review, so a shared simple-password development login would add a recoverable credential path without proving authenticated selected gameplay or persistence. Primary checkout returned to current `master`; one clean detached PR #7 baseline worktree was removed after exact-head/clean-status verification. Twelve live draft PRs and all held or protected branches remain retained. No PR merge, retarget, closure, force update or remote branch deletion was safe at this checkpoint.

### C. Tests and checks run

Fetched/pruned; read all twelve draft PRs; checked branch/worktree inventory, merge bases, unique scopes and auth owner; verified the removed worktree was clean and its head remained reachable; ran `git diff --check` for these documentation edits. No gameplay test or selected-client acceptance was performed. FP-002, FP-008, FP-009 and FP-017 applied: fixture evidence is labeled, stacks remain separate, exact refs were recorded, and selected reachability remains a hold.

### D. Risks / follow-up notes

Dirty composed worktrees retain unpromoted evidence and must be reviewed individually before removal. Integrate only after current design guidance reconciliation, owner stack #10→#12→#13, Character stack #7→#11→#14, top-bar #8→#16 and responsive shell #9→#15 pass their dedicated semantic and selected gates. PR #6 nutrition remains separate. No disposition changed; next review trigger for each retained ref is in the focused decision. Suggested commit: `docs(ui): record safe branch consolidation and preview access`.

## 2026-10-21 — DEV-0.7.2.12 Combat Skeleton Layer A Parent Re-Audit

**DEV-0.7.2_NOT_READY; LAYER_A_RESULT_DISCLOSURE_FAILED; GAME_VERSION_NOT_READY.** Inspected clean fetched/pruned synchronized `master`/`origin/master` `008533e635a4b2e62977e738d2f11790169586fd`; final publication SHA follows push/readback. Support suffix of parent DEV-0.7.2; development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`.

### A. Files changed

[Focused parent re-audit](../design/dev-0.7.2.12-combat-skeleton-layer-a-parent-reaudit-2026-10-21.md), current output/handoff/prompt, historical/deferred and planning route, branch register. No production source, test, content, schema, save format, generated/vendor file or `GAME_VERSION` edit.

### B. Patch summary

The parent matrix now credits DEV-0.7.2.10 selected Block and DEV-0.7.2.11 selected bow/restart evidence without treating it as action-specific damage proof. The first remaining Layer A failure is player-facing result disclosure: World labels the equipped Short Bow `ranged primary`, returns `Combat advanced one beat`, and does not show target HP, hit/miss, damage or action phase after later beats. This does not meet the accepted action/target/cost/result feedback dimension. Install **DEV-0.7.2.13 Combat Action Result Disclosure Contract And Repair**; independently re-audit the parent afterward. Suggested commit: `docs(combat): hold Layer A on result disclosure`.

### C. Tests and checks run

Fresh five-file combat, nearby, equipment and persistence `node --test`: **96/96 passed**. Source review traced item grants, legal projection, World UI, session caller, nearby revalidation/ledger, tick/effects, terminal history and SaveManager snapshot serialization. Historical DEV-0.7.2.9 89/89 and earlier selected observations remain separately labeled. Fetch/prune, five branch heads/merge bases/unique scopes and zero open repository PRs were checked; documentation diff/check and hosted readback follow this edit. FP-001/002/008/009/010/017/020/021/022 applied through caller, parent, branch, acquisition and target-loss evidence; no new pattern.

### D. Risks / follow-up notes

No UI owner for a per-action hit/damage result was established in this audit; computing one from aggregate HP would misattribute concurrent effects. The next run must decide exact result ownership and compatibility before any repair. Controlled victory remains Layer A mechanics evidence; natural selected victory, broader systems, balance, Home UI and Game version remain separate. Two `PROTECTED_REFERENCE` and three `HOLD_NAMED_CONSUMER` refs are retained; no disposition, integration, deletion or PR action was due.

## 2026-10-21 — DEV-0.7.2.11 Selected Equipped Ranged UI And Restart Verification

**SELECTED_EQUIPPED_RANGED_AND_RESTART_VERIFIED; DEV-0.7.2_NOT_READY; GAME_VERSION_NOT_READY.** Source and implementation starting head: clean fetched/pruned synchronized `master`/`origin/master` `838fa936fae1f7434d7f2e1bbf66f42793173fb9`; final publication SHA follows push/readback. Support suffix of parent DEV-0.7.2; development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. No parent or Game-version acceptance occurred.

### A. Files changed

[Focused selected record](../design/dev-0.7.2.11-selected-equipped-ranged-ui-and-restart-record-2026-10-21.md), current output/handoff/prompt, historical/deferred and planning route, branch register. No production source, tests, content, schema, save format, generated/vendor file or `GAME_VERSION` changed. The local proof account/profile and Slot 1 remain outside repository evidence.

### B. Patch summary

The user-prepared ordinary Hunter Slot 1 campaign showed an equipped right-hand Short Bow. One selected World exploration found a candidate; visible Approach opened three-foe combat at beat 1. `ranged primary — Foe 1/2/3 (5 Stamina, 0 MP)` was offered separately from basic melee (4 Stamina). Clicking Foe 1 advanced to beat 2 and spent five Stamina, 101/103 to 96/103. Continue remained available through beat 6. Selected Save reported verified Slot 1. After Chrome client close, host-server recovery and user-assisted isolated-profile reopen/load, the agent read back the same character, beat 6, HP 65/108, MP 82/82, Stamina 96/103, three foes, Continue, equipped Short Bow and Archery rank 1. The UI's generic action notice does not expose hit/miss, Foe 1 HP or damage; no such selected result is claimed. Suggested commit: `docs(combat): verify selected hunter bow and restart`.

### C. Tests and checks run

Fresh selected UI action/save and post-restart readback are detailed in the focused record. No code changed and no new unit test, typecheck or build was needed; historical DEV-0.7.2.9 89/89 and DEV-0.7.2.2 owner/caller evidence remain supporting only. Live Git fetch/prune, exact source/status, five branch heads/merge bases/unique paths and zero open repository PRs were checked. Documentation diff/check and hosted publication readback follow this edit. FP-001/017: actual World/Settings/load caller path; FP-002: no parent/Game promotion; FP-008/009: branch and SHA identities kept distinct. No new pattern.

### D. Risks / follow-up notes

The selected action/payment and retained combat state are proven; exact hit, damage, completed recovery, natural victory or terminal result are not. The generic `ranged primary` label and `Combat advanced one beat` notice are a disclosure limit requiring independent Layer A parent judgment. Five nondefault refs retain two `PROTECTED_REFERENCE` and three `HOLD_NAMED_CONSUMER` dispositions; no branch/PR action or named trigger due. Install **DEV-0.7.2.12 Combat Skeleton Layer A Parent Re-Audit**. Quick Shot acquisition, ammo/range/hand/durability, wider combat systems, balance, Home UI and Game-version decision stay separate.

## 2026-10-21 — DEV-0.7.2.10 Selected Shield Block UI And Restart Verification

**SELECTED_SHIELD_BLOCK_AND_RESTART_VERIFIED; DEV-0.7.2_NOT_READY; GAME_VERSION_NOT_READY.** Source: clean fetched/pruned synchronized `master`/`origin/master` `c4b4a5c5cef5ed665fcda2bdad55349b67537653`; final publication SHA follows push/readback. Support suffix of parent DEV-0.7.2; development impact `supports_current_band`, Game-version impact `none`; date 2026-10-21; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`.

### A. Files changed

[Focused selected record](../design/dev-0.7.2.10-selected-shield-block-ui-and-restart-record-2026-10-21.md), current output/handoff/prompt, historical/deferred and planning route, branch register. No production source, tests, content, schema, save format, generated/vendor file or `GAME_VERSION` changed. The user-authorized synthetic proof account and Slot 1 reside only in an isolated local Brave profile.

### B. Patch summary

Ordinary shield-equipped Warrior creator, five World explorations and authentic Approach reached three-foe combat at beat 5. `Shield Block — Self (2 Stamina, 0 MP)` was visible beside independent basic melee and equipped attacks. Selected Block click was accepted; beat 6 showed 91/95 Stamina after 93/95 and a Continue control. Save, client close/restart, sign-in and same Slot 1 load retained beat 6 and the paid state. One ordinary Continue reached beat 7 with active `Shield Block` in Character Overview and Traits / Effects; a second selected Save/restart/sign-in/load retained Tick/combat beat 7, 91/95 Stamina, the active effect and Continue. The UI did not expose exact ledger IDs or mitigation. The Layer A selected Block and restart row is verified; selected ranged and later parent/Layer C gates remain open. Suggested commit: `docs(combat): verify selected shield block and restart`.

### C. Tests and checks run

Fresh selected UI actions and two client-window close/restart/sign-in/Slot 1 readbacks described in the focused record. No code was changed, so no new unit test, typecheck or build was run; DEV-0.7.2.9's 89/89 is historical supporting evidence only. Git fetch/prune, clean exact source/status, five branch heads/merge bases/unique path scopes and zero open repository PRs were checked. Documentation diff/check and hosted publication readback follow this edit. FP-001/017: authentic creator/World/Approach/selected Block path; FP-002: one row does not accept parent/Game; FP-008/009: retained branch and inspected/final/hosted identities remain distinct. No new pattern.

### D. Risks / follow-up notes

Selected status persistence and continued combat control are proven; no selected enemy hit, mitigation amount, status expiry, complete recovery, victory or terminal readback is claimed. Five nondefault refs retain two `PROTECTED_REFERENCE` and three `HOLD_NAMED_CONSUMER` dispositions; no branch/PR action or named trigger due. Next: **DEV-0.7.2.11 Selected Equipped Ranged UI And Restart Verification**; Quick Shot acquisition, ammo/range/hand/durability, natural victory, balance, Home UI and Game-version decision stay separate.

## 2026-10-21 — DEV-0.7.2.9 Combat Skeleton Parent Acceptance Audit

**DEV-0.7.2_NOT_READY; SELECTED_BLOCK_RANGED_AND_RESTART_ROWS_OPEN; GAME_VERSION_NOT_READY.** Source and implementation starting head: clean fetched/pruned synchronized `master`/`origin/master` `f7cc87ab4faef483785f38e13b32975e4379032b`; final publication SHA follows push/readback. Support suffix of DEV-0.7.2; parent DEV-0.7.2; development impact `supports_current_band`, Game-version impact `none`; date 2026-10-21; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. The [focused parent audit](../design/dev-0.7.2.9-combat-skeleton-parent-acceptance-audit-2026-10-21.md) separates exact owner, ordinary nearby caller and historical selected-client rows. Basic/sword are independently selected-proven; Block, Short Bow, authored AI, both terminal branches, target legality/payment, replay and serialization have bounded owner/caller proof. Layer A requires selected UI checks for exposed actions: Block and ranged remain unproven, as does selected combat Save/restart readback. Natural selected victory remains the later representative Layer C gate, not the reason for this Layer A hold. No source-backed defect or production repair was found.

### A. Files changed

Focused parent audit; current output, handoff and installed DEV-0.7.2.10 prompt; historical/deferred and planning route; combat capability audit route note; branch register. No production source, tests, content, schema, generated/vendor files, account, browser profile or `GAME_VERSION` changed.

### B. Patch summary

Recorded `DEV-0.7.2_NOT_READY` from the explicit row matrix and installed only **DEV-0.7.2.10 Selected Shield Block UI And Restart Verification**. Selected ranged and any remaining restart invariant are separate Layer A gates; natural victory and terminal selected readback remain Layer C. No Home UI, command architecture, balance, Quick Shot activation or broader combat capability was opened. Suggested commit: `docs(combat): hold parent acceptance on selected proof`.

### C. Tests and checks run

Fresh four-file combat/nearby/equipment/persistence suite **89/89 pass** at inspected head. Read current combat legality/tick and nearby admission/step source, WorldPanel and GameSessionContext caller; independently reconciled prior focused records with selected basic/sword record. Read-only Windows app inventory found no isolated selected Lineage browser window; no selected action/account was made. Git fetch/prune, exact branch merge bases/unique path inventory, repository-scoped GitHub search **zero open PRs**, hosted source CI/status **no checks reported**, and diff checks before publication. No typecheck/build was rerun for documentation-only changes; prior slice results are historical support. FP-001/002/008/009/017/020/021/022 applied via real-caller trace, failure-boundary matrix, evidence-class separation, target/payment and acquisition gates, and exact source/ref accounting; no new pattern.

### D. Risks and follow-up notes

No full selected browser restart/sign-in/load or selected Block/ranged UI proof. Controlled terminal SaveManager load is not a full process restart. Five nondefault refs retain two `PROTECTED_REFERENCE` and three `HOLD_NAMED_CONSUMER` dispositions; no branch/PR action or named trigger due. Reinspect at the next selected route; retained review triggers remain scheduled readiness/protection, dedicated prompt audit, administration/governance, creator design, and dedicated G9/G10-aware creator integration. Quick Shot acquisition, ammo/range/hand/durability, magic/items/companions/gambits, selected natural victory and Game version stay separate. Next: DEV-0.7.2.10; no Game-version decision.

## 2026-10-20 — DEV-0.7.2.8 Paid Combat Target-Loss Contract Verification

**POST_PAYMENT_TARGET_LOSS_OWNER_CALLER_VERIFIED; NO_PRODUCTION_DEFECT; GAME_VERSION_NOT_READY.** Clean fetched/pruned synchronized `master`/`origin/master` source `5a3aa3e4617944444785c03a79382d9465ed4a16`; support suffix of DEV-0.7.2, development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; date 2026-10-20. Files changed: two focused combat/nearby test files, [record](../design/dev-0.7.2.8-paid-combat-target-loss-contract-verification-record-2026-10-20.md), current prompt/output/handoff, capability audit route note, historical/planning anchors and branch register. Controlled basic/sword/bow owner cases now assert exact spent cost, target identity, full recovery, no invalid/alternate effect, no weapon skill candidate or attempted cap/rank change under defeated/incapacitated/missing/newly same-team post-payment target loss; valid-target positives retain damage and sword/bow skill attempts. Ordinary nearby owner step cases assert one receipt, duplicate/conflict/stale after serialized readback, unchanged skill state and alternative availability. The pre-payment cancellation matrix remains green. No new red finding; no production source/content/schema/generated/vendor or Game-version change. Focused combat/nearby/equipment/persistence **89/89**, diff check pass; typecheck/build not run for test/docs-only change. No selected browser or natural target-loss claim. FP-001/002/008/009/017/020/022 applied; no new pattern. Five unchanged nondefault refs retain two protected/three held dispositions; zero open PRs; no integration, deletion or disposition trigger. Suggested commit: `test(combat): verify paid target-loss contract`. Risks: selected Block/ranged UI and natural victory remain separate; broader capabilities/acquisition/balance and Game-version acceptance held. Next: DEV-0.7.2.9 Combat Skeleton Parent Acceptance Audit; no separate Game-version decision. Final publication SHA follows push/readback.

## 2026-10-20 — DEV-0.7.2.7 Post-Payment Combat Target-Loss Policy Decision

**POST_PAYMENT_TARGET_LOSS_POLICY_ACCEPTED_FOR_CURRENT_ATTACKS; NO_RUNTIME_REPAIR_REQUIRED; GAME_VERSION_NOT_READY.** Clean fetched/pruned synchronized `master`/`origin/master` source `d1495d0c27185139f4cad866371332f05e8f7801`; support suffix of DEV-0.7.2, development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; date 2026-10-20. Files changed: [focused decision](../design/dev-0.7.2.7-post-payment-combat-target-loss-policy-decision-2026-10-20.md), current prompt/output/handoff, FP-022, capability audit route note, historical/planning anchors and branch register. For the three current single-target basic/sword/bow enemy attacks, a valid action that has started and paid keeps the spent cost and full recovery when its target becomes invalid; no automatic retarget, enemy effect, weapon skill-gain candidate/cap use or synthetic hit is permitted. The action completes its lifecycle; one nearby command receipt remains an admission fact rather than proof of a hit. This explicit policy closes DEV-0.7.2.6's undecided refund/recovery boundary. No production source, tests, content, schema, generated/vendor or `GAME_VERSION` edit; no selected UI action. Fresh focused combat/nearby/equipment/persistence suite **88/88** passes; diff check passes. Typecheck/build not rerun for docs-only decision; prior DEV-0.7.2.6 checks remain supporting evidence. FP-001/002/008/009/017/020/022 applied; no new pattern. Five unchanged nondefault refs remain two protected/three held; zero open PRs; no integration, deletion or disposition trigger. Suggested commit: `docs(combat): decide paid target-loss policy`. Risks: no independent post-decision skill-gain/receipt matrix or selected natural target-loss proof; Quick Shot acquisition, selected victory, balance and Game-version acceptance remain separate. Next: DEV-0.7.2.8 Paid Combat Target-Loss Contract Verification; no separate Game-version decision. Final publication SHA follows push/readback.

## 2026-10-20 — DEV-0.7.2.6 Queued Combat Target Legality And Payment Verification

**PRE-PAYMENT_TARGET_LEGALITY_REPAIRED; POST-PAYMENT_REFUND_POLICY_OPEN; GAME_VERSION_NOT_READY.** Clean fetched/pruned synchronized `master`/`origin/master` source `dc591c4fcc733739484eec632ed13d4b16bdc73b`; support suffix of DEV-0.7.2, development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; date 2026-10-20. Files changed: combat owner, two focused test files, [record](../design/dev-0.7.2.6-queued-combat-target-legality-and-payment-record-2026-10-20.md), current output/handoff/prompt, failure-pattern register, capability audit route note, historical/planning anchors and branch register. Pre-edit red proved a defeated queued target still paid; a second red check proved a newly same-team target remained in legal projection. Owner now rejects invalid enemy targets before payment, excludes same-team projection and applies no enemy effect to incapacitated/newly allied targets after payment. Controlled basic/sword/bow owner matrix covers lost target before and after payment, wrong-side, affordability and alternate targets; ordinary nearby owner step tests verify exact command, payment, negative replay, recovery, ledger and serialization. Current spent-cost/full-recovery after payment is observed, not accepted refund policy; DEV-0.7.2.7 decides it. Focused combat/nearby/equipment/persistence **88/88**, Node UI-config typecheck, 256-module app-local Vite build and diff check pass. No selected browser claim; broad UI typecheck not rerun. FP-001/002/008/009/017/020 and new FP-022 applied through the stated evidence. Five unchanged nondefault refs remain two protected/three held; zero open PRs; no integration, deletion or disposition trigger. Suggested commit: `fix(combat): recheck queued enemy targets before payment and effect`. Risks: post-payment target-loss policy and selected natural victory remain open. Next: DEV-0.7.2.7 Post-Payment Combat Target-Loss Policy Decision; no separate Game-version decision. Final publication SHA follows push/readback.

## 2026-10-20 — DEV-0.7.2.5 Physical Ability Acquisition Evidence Contract Decision

**QUICK_SHOT_ACQUISITION_NOT_PRODUCTION_REACHABLE; ABILITY_ACTIVATION_HELD; GAME_VERSION_NOT_READY.** Clean synchronized source `3982b910f601e40e36472fd21745482b21c2f842`; support suffix of DEV-0.7.2, development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. Files changed: [focused decision](../design/dev-0.7.2.5-physical-ability-acquisition-evidence-contract-decision-2026-10-20.md), current prompt/output/handoff, capability audit route note, historical/planning anchors, branch register and FP-021. Village Hunter requires family-scoped Legacy plus earned hunting/source-run evidence. Its Legacy definition is absent from the live catalog (`unknown_unlock`); the account run summary retains no earned hunting evidence; the creator passes neither family ID nor typed evidence records. Pure resolver fixtures and an heir source ID do not make Quick Shot obtainable. Ordered future gates are source-run evidence owner, explicit family/purchase owner, creator projection and only then combat legality. No production/test/content/schema edit or selected account action. Focused live owner suite **58/58** passes; expanded **61/63** has two pre-existing stale assertions about the partially migrated Backstory Legacy draft, separately recorded. No typecheck/build was required for this docs-only decision; diff check passes. FP-001/002/007/008/009/017 and new FP-021 applied. Five unchanged nondefault refs retain two protected/three held dispositions; zero open PRs; no integration/deletion trigger. Suggested commit: `docs(combat): hold physical ability on acquisition authority and route target legality`. Risk: multi-owner acquisition and stale draft tests remain open. Next: DEV-0.7.2.6 Queued Combat Target Legality And Payment Verification; no separate Game-version decision. Publication SHA follows push/readback.

## 2026-10-20 — DEV-0.7.2.4 Owned Physical Ability Provenance And Legality Verification

**NO_ORDINARY_OWNED_ACTIVE_PHYSICAL_ABILITY; ACQUISITION_EVIDENCE_GATE_OPEN; GAME_VERSION_NOT_READY.** Clean synchronized source `1a8ff2f970ff6033bc32b1fb166132c410b3aec7`; support suffix of parent DEV-0.7.2, development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. Files changed: [focused record](../design/dev-0.7.2.4-owned-physical-ability-provenance-and-legality-record-2026-10-20.md), current prompt/output/handoff, capability audit route note, historical/planning anchors and branch register. The only starting active physical ability is Village Hunter's Quick Shot; Village Hunter is Tier 2 locked behind family Legacy and earned/source-run evidence. Creator eligibility provides no `evidenceRecords` to the resolver, so a real Village Hunter snapshot was rejected before combat. Garrison Ward's Hold Formation is also locked and is a command. No synthetic grant, production repair or retained test edit. Quick Shot's catalog requires archery rank 8, AGI 10 and archery handling; current combat grant construction does not enforce those requirements. Its ranged damage and timing paths exist, but `tempo.quick` has no separate effect; cooldown/trigger enforcement is absent. Ability owner/nearby/selected acceptance remains unproven. Focused combat/equipment/nearby/persistence **85/85**, eligibility/content **20/20**, Node UI-config typecheck and app-local 256-module Vite build pass; diff check pass. Broad UI typecheck not rerun (recorded 137 baseline), no selected UI action. FP-001/002/017 evidence boundary and FP-008/009 source/branch/publication identity applied; no new pattern. Five nondefault refs unchanged, two protected/three held, zero open PRs; no integration/deletion or disposition trigger. Suggested commit: `docs(combat): record ability acquisition gate and route evidence contract`. Risk: acquisition evidence owner and combat requirement checks are open; selected victory/balance/Game acceptance separate. Next: DEV-0.7.2.5 Physical Ability Acquisition Evidence Contract Decision; no separate Game-version decision. Final publication SHA follows push/readback.

## 2026-10-20 — DEV-0.7.2.3 Enemy AI Candidate Legality And Target Verification

**AI_PAYABLE_CANDIDATE_DEFECT_REPAIRED; AUTHORED_ENEMY_CALLER_VERIFIED; SELECTED_UI_UNPROVEN; GAME_VERSION_NOT_READY.** Clean synchronized source `ab31fb1c6b5fa4ba46cdff650cb18bdb488ed74f`, after verifying two design-only connector prework commits over prior Codex `3d8fed86`; code/test checkpoint `79e3df834d674c014c6fb3e7cb6a1b0b96cb64d3` pushed and hosted-read back. Support suffix of parent DEV-0.7.2, development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; date 2026-10-20. Files changed: combat AI owner, two focused tests, [record](../design/dev-0.7.2.3-enemy-ai-candidate-legality-and-target-record-2026-10-20.md), current prompt/output/handoff, failure-pattern register, capability-audit route note, historical/planning anchors and branch register. An ordinary authored Kobold Scout action traverses nearby admission/Continue with exact package/source/action/target/cost, damage, recovery, one payment, ledger and serialized state. Pre-edit red test proved a five-Stamina ranged action was queued/cancelled on two ticks while four-Stamina supported melee was payable. AI selection now filters by the existing cost rule before scoring; with no payable candidate it waits without queue churn. Unknown role package retains explicit basic fallback; defeated/incapacitated target, no-target and blocked/busy actor tests pass. Focused combat/equipment/nearby/persistence suite **85/85**, Node UI-config typecheck, 256-module app-local Vite build and diff check pass; broad UI typecheck not rerun (recorded 137 baseline), no selected browser claim. FP-001/002/008/009/017 applied; new FP-020 records scored-candidate executability. Five unchanged nondefault refs retain two protected/three held dispositions, zero open PRs, no integration/deletion/disposition trigger. Suggested commit: `docs(combat): close AI legality repair and route physical ability`. Risks: current unsupported spell/ability owners, temporary incapacitation terminal policy, later target invalidation and selected UI remain unproven. Next: DEV-0.7.2.4 Owned Physical Ability Provenance And Legality Verification; no separate Game-version decision. Documentation publication SHA follows push/readback.

## 2026-10-20 — DEV-0.7.2.2 Equipped Ranged Weapon Owner And Caller Verification

**EQUIPPED_RANGED_OWNER_CALLER_VERIFIED; AMMUNITION_OWNER_ABSENT; SELECTED_UI_UNPROVEN; GAME_VERSION_NOT_READY.** Clean synchronized source `bed02a2a336aeba7a61bd19094bc28e36c49529f`; test-only checkpoint `e3f9d27d7e66636e8b44b5ec7cd478ce8ec97ed6` pushed and hosted-read back. Support suffix of parent DEV-0.7.2, development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. Files changed: nearby owner/caller test, [focused record](../design/dev-0.7.2.2-equipped-ranged-owner-and-caller-verification-record-2026-10-20.md), current prompt/output/handoff, capability audit route note, historical/planning anchors and branch register. Ordinary Hunter Short Bow and synthetic equipped Composite Bow pass exact source/archery/target/cost, nearby ledger, queue/start/resolve/recovery, actual ranged damage, one skill gain and serialization. Short Bow succeeds both with and without arrows, and inventory is unchanged; inventory-only bow and unaffordable command are rejected. No production defect or code repair. The first negative fixture put four Stamina before exploration, which restored it; moving that condition to the admitted combatant corrected the test setup. Focused combat/equipment/nearby/persistence suite 79/79, Node UI-config typecheck, app-local 256-module Vite build and diff check pass. Broad UI typecheck not rerun; empty in-app/MCP browser inventory supplied no isolated selected profile. FP-001/002/008/009/017 applied through real caller, fixture/selected distinction and branch/source/readback; no new pattern. Five unchanged nondefault refs retain two protected/three held dispositions; zero open PRs; no branch action/review trigger. Suggested commit: `docs(combat): close ranged owner proof and route AI legality`. Risks: ammunition/range/hand/durability owners and selected UI remain unproven, with no Game-version or balance decision. Next: DEV-0.7.2.3 Enemy AI Candidate Legality And Target Verification. Documentation publication SHA follows push/readback.

## 2026-10-20 — DEV-0.7.2.1 Combat Terminal Owner And Durability Slice

**TERMINAL_OWNER_AND_DURABILITY_FIXTURE_PROVEN; NATURAL_SELECTED_VICTORY_UNPROVEN; GAME_VERSION_NOT_READY.** Source `43f21f53e6fedd6c4b2c27f4a7a03893e50b2e32`, clean synchronized `master` after a safe fast-forward of six independent design-only connector prework commits; test checkpoint `e888b9c61175cfdbae46e939145a3a1d9ceb87fa` hosted-read back. Run label DEV-0.7.2.1 support suffix, parent DEV-0.7.2, development impact `supports_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. Files changed: one nearby owner/caller test, [focused record](../design/dev-0.7.2.1-combat-terminal-owner-and-durability-record-2026-10-20.md), current prompt/output/handoff, capability audit route note, historical/planning anchors and branch register. Controlled legitimate owner/nearby-caller fixtures prove ally victory, playable Normal-Stakes defeat and pending recovery, exact history/tick, cleanup, ledger/admission, serialization, SaveManager load, continued exploration, duplicate/conflict/stale/wrong-actor and failed-step byte stability. No production defect or code repair. A test-only timestamp assumption was corrected because recovery advances campaign time after combat ends. Focused combat/caller/persistence tests 73/73; Node UI-config typecheck and 256-module Vite build pass; `git diff --check` pass. Broad UI typecheck and selected browser were not rerun (no UI changed). FP-001/002/008/009/017 applied; FP-005/012 duplicate and load boundaries checked within one process, with full restart and post-reload retry still open. No new pattern. Five nondefault refs retain two protected/three held dispositions, zero open PRs; no integration/deletion or disposition trigger. Suggested commit: `docs(combat): close terminal owner proof and route ranged caller`. Limits: fixture victory is not natural selected victory, full browser restart was not run, and balance/Game-version gates remain later. Next: DEV-0.7.2.2 Equipped Ranged Weapon Owner And Caller Verification. Documentation publication SHA follows push/readback.

## 2026-10-20 — DEV-0.7.2 Self-Target Shield Block Legal Command Slice

**SELF_TARGET_SHIELD_BLOCK_OWNER_AND_CALLER_VERIFIED; SELECTED_UI_UNPROVEN; GAME_VERSION_NOT_READY.** Source `0f672d02e38710440e3cb8ebd908aede1829a40e`, clean synchronized `master`; primary current-band DEV-0.7.2, parent `none`, development impact `advances_current_band`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. Files changed: combat owner projection, WorldPanel label, two focused test files, [focused record](../design/dev-0.7.2-self-target-shield-block-implementation-record-2026-10-20.md), current prompt/output/handoff, historical/planning route and branch register. Pre-edit two new assertions failed (36/38); post-edit owner/caller 38/38, equipment/profile 40/40, Node UI-config typecheck and 256-module Vite build passed. Broad UI typecheck remains at 137 recorded baseline diagnostics; no selected UI proof because only empty in-app/MCP browser surfaces were available and the retained isolated Chrome profile was not. Real nearby admission/step caller proves Block self target, cost/status, Continue recovery, ledger, duplicate/conflict/stale and serialization; existing owner test proves mitigation. FP-001/002/008/009/017 applied; no new pattern. Five retained refs remain two protected/three held, zero open PRs, no trigger or branch action. Suggested commit: `feat(combat): expose equipped self shield block`. Risk: selected Block UI and natural victory are unproven; magic/items remain outside this owner. Next support run: DEV-0.7.2.1 Combat Terminal Owner And Durability Slice. Publication SHA follows push/readback.

## 2026-10-20 — Combat skeleton capability and owner-contract audit

**COMBAT_SKELETON_PARTIAL; FIRST_SLICE_SELF_TARGET_SHIELD_BLOCK; GAME_VERSION_NOT_READY.** Source run: unversioned documentation-only audit at clean synchronized `master`/`origin/master` `19e8acd3d2d7ef99c03cd43e928e8cc4df4105e9`; development milestone impact `none`, Game-version impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. The focused [capability audit](../design/combat-skeleton-capability-and-owner-contract-audit-2026-10-20.md) traces melee, ranged, shield, ability, legacy magic, item, AI/party, outcome and durability paths against real sources, caller and tests. Current Short Bow and Composite Bow both have authored ranged profiles. Equipped Block has a self-target shield status/mitigation owner, but the legal player projection rejects all non-enemy-damage commands and WorldPanel labels all targets as foes; this is the smallest first seam. No fresh code tests or selected playthrough were run. Files changed: focused audit, current prompt/output/handoff, historical/planning anchors and branch register. Checks: source/caller/test readback, documentation links and `git diff --check`; hosted publication identity follows push. FP-001/002/007/008/009/017 applied through real caller requirement, evidence class separation and exact branch/source review. Five nondefault refs inspected against this source; two protected and three held, zero open PRs; no disposition change, integration or deletion due. Suggested commit: `docs(combat): audit skeleton capability and install shield block slice`. Risk: direct Block fixture execution is not ordinary command acceptance; selected natural victory and terminal durability remain later gates. Next: execute the installed Self-Target Shield Block Legal Command Slice, then separately select terminal owner/durability proof.

> **2026-10-20 owner-directed routing note (connector documentation, NOT a Codex run):** The project owner now prioritizes the reusable combat skeleton and complete owner-validated action/target/effect/outcome interfaces over diagnosing why the current unfinished Stonevein Warrior lost two natural encounters. See `docs/design/combat-skeleton-first-priority-and-acceptance-boundary-decision.md`. **Current next Codex prompt: Combat Skeleton Capability And Owner-Contract Audit.** The selected results below remain accurate historical observations, including basic/sword acceptance, genuine Normal-Stakes defeats and unproven natural victory. This reroute does not establish a new combat implementation, Codex test run, selected victory, Game acceptance or altered G10/branch/protected-account authority.


## 2026-10-20 Ordinary Encounter Victory And Choice Independent Selected Acceptance

Source run: **Ordinary Encounter Victory And Choice Independent Selected Acceptance**, unversioned; parent milestone not applicable. Date 2026-10-20. Clean synchronized `master`/`origin/master` source `85867a8cb0f0ff21fcef7b61bf8cf0776880f247`; repository `vagabond1215/Lineage_Reforged`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; `DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS`. Development impact `none`; Game-version impact `none`; `GAME_VERSION_NOT_READY`. **SELECTED_BASIC_AND_SWORD_COMMANDS_AVAILABLE_AND_ACCEPTED; ORDINARY_ENCOUNTER_VICTORY_AND_CHOICE_NOT_PROVEN.** Focused record: `docs/design/ordinary-encounter-selected-choice-and-victory-boundary-2026-10-20.md`.

### A. Files changed

Added the focused selected boundary record. Advanced current output, handoff, prompt, historical/planning route and branch register. No production source, tests, content, schema, generated/vendor file, `GAME_VERSION`, Site-source repository, deployment, protected account or held branch changed.

### B. Patch summary

One newly empty disposable Chrome profile reached the locally served default App at `http://localhost:5472/`; one synthetic/disposable account created one ordinary Stonevein Human Warrior/Arming Sword campaign in Slot 1. Visible World exploration produced no-candidate feedback, then an authentic candidate and separate Approach; the three-foe encounter opened at beat 4. Basic melee and Arming Sword profile were simultaneously visible against legal foes. Basic against Foe 1 was accepted at beat 4 with 4 Stamina spent; sword profile against Foe 1 was independently accepted at beat 13 with 4 Stamina spent. Later legal sword actions targeted Foe 1 at beats 21 and 29; Foe 1 was visibly defeated at beat 33. The player fell under Normal Stakes after Continue from beat 34; World showed recovery at 33/132 HP. The fixed matrix stopped at this first remaining failed victory boundary. No post-victory continuation, Save/load, restart/sign-in/load, exact terminal ledger/head/revision readback or Game-version acceptance is claimed. The installed next route is separate read-only outcome diagnosis and smallest repair decision, not speculative combat tuning.

### C. Tests or checks run

Fresh selected default-App caller actions and visible receipts described in the focused record. Focused combat/equipment/exploration tests 41/41; Node UI-config typecheck pass; app-local Vite build pass with 256 client modules. Broad UI typecheck exit 1, 137 TypeScript diagnostics, equal to baseline and not green. Fresh fetch/prune, exact `master`/`origin/master` status, five retained ref heads/merge bases/unique path scopes, zero open repository PRs through the repository-scoped connector; local `gh` CLI unavailable. Documentation links, `git diff --check`, complete diff, commit/push and hosted readback are publication checks. FP-001/017: real selected creator-to-World/admission/combat caller and strict separation from owner tests; FP-002: failed victory blocks overall/Game acceptance despite green focused tests; FP-007: bounded documentation-only closeout; FP-008/009: held refs and source/final/hosted heads separated. No new generalized failure-pattern entry.

### D. Risks / follow-up notes

Selected UI does not expose command/source IDs, target HP/damage, or exact terminal persistence identities; none are invented. Two natural selected defeats do not establish unwinnability or a combat balance defect. Preserve the fixed matrix for later independent replay, previous defeat as separate evidence, G10D/G10F limits, both protected account authorities and both retained proof-only profiles. Five non-default branches remain in registered protected/held states; no disposition change, merge, rebase, integration, deletion or PR action due/performed. Suggested commit: `docs(combat): record selected choice and victory boundary`. Next recommended run: **Ordinary Encounter Outcome Diagnosis And Smallest Repair Decision**; a separate Game-version decision remains gated on full selected victory/continuation/durability proof. Final publication SHA follows push/readback.

## 2026-10-20 Ordinary Combat Basic Action Selection Repair

Source run: **Ordinary Combat Basic Action Selection Repair**, unversioned; parent milestone not applicable. Date 2026-10-20. Clean synchronized `master`/`origin/master` source `66f42e27`; code checkpoint `42c0fcd5` pushed. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; `DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS`. Development impact `none`; Game-version impact `none`; `GAME_VERSION_NOT_READY`. **BASIC_MELEE_OWNER_AND_CALLER_REPAIR_VERIFIED; INDEPENDENT_SELECTED_ACCEPTANCE_PENDING.**

### A. Files changed

Production `packages/engines/game-engine/src/combat/index.ts`; tests `tests/unit/combat-spawn-foundation.test.mjs` and `tests/unit/nearby-exploration-reachability.test.mjs`. Focused record `docs/design/ordinary-combat-basic-action-selection-repair-record.md`; current output/handoff/prompt, historical/planning route and branch register. No content, schema, UI layout, persistence, generated/vendor file, Game version or Site-source repository changed.

### B. Patch summary

The exact ordinary Warrior/Arming Sword owner and caller tests failed before the fix because family-matched sword grant resolution shadowed the engine's basic action and the legal-list identity guard dropped it. Exact basic melee now resolves to its engine template while sword profile remains its own action. Basic source no longer falsely claims the sword item. The selected App's existing `WorldPanel` maps the returned legal commands to distinct buttons; the ordinary creator-to-encounter caller accepted each through `executeNearbyEncounterStep`. The unchanged selected acceptance matrix is installed next, after the separately committed repair.

### C. Tests or checks run

Pre-edit red owner and ordinary caller reproductions; focused combat/equipment/exploration/encounter tests 100/100, final narrower rerun 41/41; Node UI-config typecheck pass; app-local Vite build pass, 256 client modules; broad UI typecheck 137 diagnostics, matching baseline, not green; `git diff --check` pass. FP-001: genuine creator, exploration, admission and encounter-step caller exercised; FP-017: automated evidence is not selected browser acceptance; FP-002: no Game promotion; FP-008/009: five held/protected refs and inspected/pushed identities distinguished. No new failure-pattern entry is needed.

### D. Risks / follow-up notes

No new selected browser victory, continued play or durable terminal readback is claimed. The prior selected Normal-Stakes defeat remains distinct. G10D/G10F limits and both protected account authorities remain. Five non-default hosted refs were inspected at source; zero open repository PRs; no branch action or disposition change due. Suggested code commit: `fix(combat): keep basic melee separate from sword profile` (`42c0fcd5`). Suggested documentation commit: `docs(combat): hand repaired action to independent selected proof`. Next run: **Ordinary Encounter Victory And Choice Independent Selected Acceptance**; a separate Game-version decision may follow a proven matrix.

## 2026-10-19 Contextual Player Action And Command Architecture

Source development run: **Contextual Player Action And Command Architecture**, unversioned parallel documentation run; parent milestone not applicable. Source `master`/`origin/master` `bc66a5460c7a77b12b4eda997749ad42a620c554`, initially clean after fetch/fast-forward. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS`. Development impact `none`; Game-version impact `none`; `GAME_VERSION_NOT_READY`. **ARCHITECTURE DEFINED; IMPLEMENTATION NOT YET AUTHORIZED.** The Ordinary Combat Basic Action Selection Repair remains the active executable route in the unchanged current prompt.

### A. Files changed

Added `docs/design/contextual-player-command-architecture-index.md`, `contextual-player-action-and-command-architecture-decision.md`, `local-scene-context-projection-decision.md`, and `contextual-player-affordance-and-owner-matrices.md`. Marked the temporary audit input superseded while retaining it. Updated current output, handoff, historical/planning route and branch register. No production source, tests, schema, generated output, Game version, Site source, deployment, account or held branch changed.

### B. Patch summary

Defined owner-preserving local scene and action projection, concrete command identity distinct from family/compatibility tags, minimum descriptor, availability/disclosure, composable interaction shapes, fifteen-scene affordance matrix, domain routing, Home consumption, migration from existing controls, existing-command first slice and separate environmental resource loop recommendation. Current engine commands and current UI bridges are distinguished from design-only or missing owners. The temporary audit's material requirements are individually disposed in its appended §24; deletion is deferred to a separate cleanup commit after durable readback. The active combat repair route is preserved verbatim.

### C. Tests or checks run

Fresh fetch/prune and exact source head; complete temporary input; accepted contextual/UI and focused encounter authorities; relevant live types, production callers and owner boundaries; five retained branch heads, merge bases, unique paths and zero open repository PRs. Documentation link/readback, `git diff --check`, staged diff, final commit/push and hosted SHA readback are publication checks. No executable test, selected browser proof, build or typecheck is claimed for this documentation-only package. Applicable FP-001: real caller mapping, not invented playability; FP-002/017: no Game/selected acceptance from design; FP-007: bounded additions/top-of-file coordination patches; FP-008/009: semantic held-ref review and source/final-head separation.

### D. Risks / follow-up notes

Exact local/interior/resource/vessel identity, law/crime, timed work, general trade/crafting/property and broader item/quest owner migration require separate decisions. The first Home implementation follows combat repair, independent encounter acceptance and separate Game-version decision, and uses existing commands only. Five retained non-default refs keep their registered protected/held dispositions; no integration, deletion or PR action is due. Suggested commit: `docs(design): define contextual player command architecture`. Next active run: **Ordinary Combat Basic Action Selection Repair**; architecture acceptance is parallel, not its replacement. Final publication SHA follows push/readback.

## 2026-10-19 Ordinary Encounter selected basic-action and victory boundary

Source: clean fetched `master`/`origin/master` `55249da5ed24d021b9f62069b61bf737c71fe330`; repository `vagabond1215/Lineage_Reforged`. Label class: unversioned selected-path proof, parent milestone not applicable; development impact `none`, Game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS`. **SELECTED_COMBAT_BASIC_ACTION_NOT_PROJECTED; ORDINARY_ENCOUNTER_VICTORY_AND_CHOICE_NOT_PROVEN; GAME_VERSION_NOT_READY.** Focused selected record: `docs/design/ordinary-encounter-selected-basic-action-and-victory-boundary.md`.

### A. Files changed

Added the focused selected boundary record; advanced current output, handoff, prompt, historical/planning route and branch register. No production source, test, schema, generated asset, `GAME_VERSION`, Site-source repository, deployment, protected account or held branch changed.

### B. Patch summary

A newly empty Chrome profile on fresh local `127.0.0.1:5471` reached the actual selected App. One disposable account and one ordinary Stonevein Warrior/Arming Sword character explored six times, with five displayed no-candidate results and one natural candidate; visible Approach admitted a three-foe encounter. At the first legal command point, `combat.melee.primary` and `combat.interrupt.shield_bash` were offered, but `combat.attack.melee.basic` was not. The selected sword and shield actions were accepted with distinct 4/8 Stamina costs. The same encounter naturally ended in Normal-Stakes defeat/recovery, with World HP 33/132 and a Chronicle defeat/recovery entry at tick 41. No victory, post-victory continued play, Save/load or restart was observed. The disposable origin had one initial artifact, so the terminal defeat is not described as durable evidence. A source hypothesis points to family-matched sword grant resolution shadowing the basic template, then the legal-list action-type guard dropping it. Install only the separate **Ordinary Combat Basic Action Selection Repair**, then an independent replay of the fixed selected matrix. One defeat does not prove balance is broken or justify tuning.

### C. Tests or checks run

Fresh focused Node combat equipment/spawn and nearby exploration tests 38/38; Node UI-config typecheck PASS; app-local Vite build PASS, 256 client modules, `index-DRiJsDUZ.js`. Broad UI typecheck exit 2 with 137 TypeScript diagnostics, equal to the recorded baseline and not green. Read-only selected UI/DOM, profile-command-line, initial empty fourteen-store and post-run one-artifact checks were performed; no direct IndexedDB writes or engine/fixture mutation. Fresh fetch/prune and repository-scoped PR check found zero open PRs. Five non-default heads/merge bases, unique commits/paths and named dispositions were reviewed; no integration/deletion or disposition change due. Documentation diff and final publication checks follow. FP-001/017: selected gap prevails over source/test prediction; FP-002: no Game promotion; FP-007: bounded docs; FP-008/009: held refs and inspected/final/hosted identities distinguished. No new general failure-pattern entry required.

### D. Risks / follow-up notes

The selected UI omits the intended basic melee option while a sword profile is equipped; sword versus shield bash action identity and cost were visible, but tactical effect was not exposed. Victory remains unproven; the natural defeat is not a substitute. Preserve `G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT`, `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED`, `G10_DURABILITY_READY`, G10F local evidence limit and both distinct protected accounts. The disposable proof profile is retained. No data clear, G10 capacity/fault rerun, deployment, held-branch integration, `GAME_VERSION` change, Game acceptance or UI overhaul. Suggested commit: `docs(proof): record selected combat basic-action boundary`. Next recommended run: **Ordinary Combat Basic Action Selection Repair**; independent selected victory/choice acceptance follows that repair, and any Game-version decision remains separate. Final publication SHA follows push/readback.

## 2026-10-19 Ordinary Encounter Victory And Choice selected-browser access hold

Source: clean fetched `master`/`origin/master` `da20ea31804f34e29da179d8be53f569caa7c720`; repository `vagabond1215/Lineage_Reforged`. Label class: unversioned selected-path proof/feasibility, parent milestone not applicable; development impact `none`, Game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS`. **ORDINARY_ENCOUNTER_SELECTED_PROOF_UNEXECUTED_BROWSER_ORIGIN_UNAVAILABLE; GAME_VERSION_NOT_READY.** Focused matrix/disposition: `docs/design/ordinary-encounter-victory-and-choice-browser-access-hold.md`.

### A. Files changed

Added the focused browser-access hold/fixed selected matrix; updated this output, current handoff/prompt, historical/planning route and branch register. No production source, tests, schema, generated asset, `GAME_VERSION`, protected account, Site-source repository, deployment or held branch changed.

### B. Patch summary

Fresh source inspection confirmed ordinary World Explore/Approach/legal-command/Continue controls, GameSessionContext production owner routing, encounter active/victory/defeat ledger outcomes, authored low-difficulty hostile Kaelvar patrol, and default Warrior Arming Sword equipment/weapon action alongside basic melee. Those facts and tests are support only. Local Vite served a fresh `127.0.0.1:5348` origin, but the selected in-app browser timed out on both `127.0.0.1:5348` and `localhost:5348`; hosted preview opened with a protected account in the picker. No selected account/campaign was made or touched. Therefore no no-candidate, candidate, admission, selected command, victory, continuation or Save/load/restart evidence exists in this run. This is tool/origin access, not a demonstrated product failure. Resume the same fixed proof with a reachable isolated browser origin/profile; only a completed selected result can route a product repair or separate Game policy section 7 decision.

### C. Tests or checks run

Fresh focused Node combat equipment, spawn foundation and nearby exploration tests 38/38; Node UI-config typecheck PASS; app-local Vite build PASS, 256 modules, `index-DRiJsDUZ.js`, 2,842,595 bytes, SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`. Broad UI typecheck exit 1 with 137 diagnostics, matching the recorded baseline, not green. Fresh repository-scoped GitHub PR search found zero open PRs. Five non-default heads, merge bases, unique commits/path counts and named dispositions were inspected; no trigger, disposition change, integration or deletion due. Documentation diff check and publication readback follow. Applicable FP-001/017: no source/fixture promotion to selected proof; FP-002: no Game acceptance from technical checks; FP-007: bounded documentation patch; FP-008/009: semantic held-ref and inspected/final-hosted identity review. No new reusable pattern identified.

### D. Risks / follow-up notes

The required selected campaign and durable victory/choice proof remain unrun. Existing G10B.5 selected genuine defeat/recovery remains separate supporting evidence. Preserve `G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT`, `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED`, `G10_DURABILITY_READY`, G10F local evidence limit and distinct protected local/hosted accounts. No data clear, capacity/fault rerun, deployment, Site-source mutation, `GAME_VERSION` change, Game acceptance, held-branch integration or UI overhaul. Suggested commit: `docs(proof): record selected encounter browser access hold`. Next recommended run: resume **Ordinary Encounter Victory And Choice Completion Proof** on a reachable isolated selected browser origin. No separate Game-version decision is yet installed. Final publication SHA follows push and independent hosted readback.

## 2026-10-19 Post-DEV-0.7.1 Playability And Game-Version Eligibility Decision

Source: clean fetched Lineage `master`/`origin/master` `334fae75b1cd7935d965f051f296cf27d3ee936d`; branch/status assumption `master`. Label class: unversioned documentation decision, no parent; development impact `none`, Game-version impact `none`. **GAME_VERSION_NOT_READY.** Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS` unchanged. Focused decision: `docs/design/post-dev-0.7.1-playability-and-game-version-eligibility-decision.md`.

Files changed: focused decision, current output/handoff/prompt, current Game-version policy status/route, playability calibration, historical/planning route and branch register. No production code, schema, Site-source repository, generated asset, protected account/archive, deployment or `GAME_VERSION` changed. Suggested commit: `docs(decision): hold Game version on playable encounter closure`.

Policy §5/§7 requires an accepted coherent player-visible delta and its ordinary proof; §6 reserves `0.2.0-prealpha` for a much broader vertical-slice gate. Prior accepted Game `0.1.1` closed ordinary Soundings. Later Activity Revenue truthfulness, authored World exploration and G10B.5's natural selected Stonevein encounter/basic attack/HP-zero/Normal-Stakes recovery are genuine scoped evidence. No accepted selected victory or distinct meaningful combat-choice outcome was found in the G10B/G10D/G10E ledgers; current source can project legal commands but projection alone is not that playthrough proof. DEV-0.7.1 durability and G10F hosted deployment do not independently justify a patch. The next smallest coherent player-facing capability is a single ordinary context-driven encounter with meaningful choice, durable victory or existing defeat/recovery, continued play and save/load/restart. Install only a separate bounded selected proof/feasibility route; a later Game-version decision remains separate.

Fresh checks: exact fetched head/worktree, `GAME_VERSION`, complete Game policy/current playability, previous Game decision, post-Soundings priorities, parent/G10B.5 focused evidence, selected World-panel command surface, changed production commit inventory since the prior accepted gameplay build, five retained branch heads/merge bases/unique paths and zero open repository PRs. No browser, build, broad typecheck, owner regression, protected-storage read, G10 stress/fault/capacity or Sites operation was run. `git diff --check`, staged diff and final hosted readback follow publication. Applicable FP-001/017 (selected versus helper/source proof), FP-002 (technical tests do not promote Game), FP-007 (bounded docs edits), FP-008/009 (branch and source/final identities). Five protected/held refs retain their named triggers, with no integration/deletion/PR action due or performed. Preserve `G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT`, `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED`, `G10_DURABILITY_READY`, G10F local evidence limit and separate protected local/hosted authorities.

## 2026-10-19 DEV-0.7.1 Parent Acceptance Audit

Source: clean fetched Lineage `master`/`origin/master` `d39ea2888c170512bc1a7e25129c39c7333d39d7`. Branch/status assumption: `master`, zero initial changes. Label class: primary development milestone acceptance; parent: not applicable. Development impact: `advances_current_band`; Game-version impact: `none`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. **DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS.** Focused complete G1–G10F ledger and decision: `docs/design/dev-0.7.1-parent-acceptance-audit.md`.

Files changed: focused parent audit, current output/handoff/prompt, historical/deferred and planning route registers, branch register. No production source/schema, Site-source repository, generated asset, private credential/archive, account/origin, deployment, `GAME_VERSION` or held branch changed. Suggested commit: `docs(decision): accept DEV-0.7.1 with documented limits`.

G1–G8 staged owner/adapter/caller rows, G9 independent parent and F1–F9, G10B selected caller, G10C archive, G10D fixed D1–D7, G10E independent E1–E9 and G10F hosted operational cutover all reconcile without a missing mandatory row. Fresh source diff from G10E client/config to inspected head was empty; main → default App → EpochApp uses `lineage.campaigns.epoch1` v7 and fourteen archive families. Fresh 256-module Vite build emitted exact `index-DRiJsDUZ.js`, 2,842,595 bytes, SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`. Fresh read-only Sites get/list/deployment confirmed active owner-private custom-access version 3, Site-source commit `dcd5d38396fb6ebc2b347d087a6ff6b57541603f`, successful deployment `appgdep_6ad691c7b9908191a949302943bc8551` at the hosted preview. The accepted hosted account/Save/load/restart/backup is owner-supplied operational evidence, **not** a new browser probe. Historical version 2 is not epoch-compatible rollback.

Preserve `G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT`, `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED`, `G10_DURABILITY_READY`, G10F's distinct protected local/hosted authorities and local credential/selected-backup evidence limit. `persist()` denial, `persisted()=false`, safe origin-loss simulation and involuntary eviction are distinct. Fresh 65/65 focused Node Soundings/lifecycle tests, UI Node-config typecheck and app-local Vite build passed; broad UI typecheck retains 137 baseline diagnostics (exit 2), not green. No fresh G10B–E stress/capacity/fault or selected hosted account/storage operation was claimed. `git diff --check`, staged review and final publication readback follow the commit.

Applicable FP-001/002/003/004/005/006/007/008/009/011/012/014/017/018/019: real selected evidence is kept separate from owner fixtures and today's checks; complete parent boundary matrix, exact recovery/Retry, graph provenance/generation, bounded documentation, held-ref semantics and inspected/evidence/final heads were reconciled. Fresh fetch/prune and repository-scoped GitHub search found five retained non-default hosted refs and zero open PRs. Two protected and three held named-consumer dispositions remain unchanged; no merge/rebase/deletion/integration or PR action was due. Exact heads/merge bases/unique paths/triggers are in the refreshed branch register. Next: separate unversioned post-DEV-0.7.1 playability/Game-version eligibility decision; do not infer `GAME_VERSION` promotion from this milestone.

## 2026-10-19 DEV-0.7.1 Slice G10F hosted epoch cutover closeout

Source: clean fetched local/hosted `master` `874999443ec116986d533751763bc97e51630a63`. Branch/status: `master`; label class: parent-specific support suffix under planned `DEV-0.7.1`; development impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10F_HOSTED_EPOCH_CUTOVER_ACCEPTED; HOSTED_VERSION_3_EPOCH_CLIENT_VERIFIED; HOSTED_PROTECTED_EPOCH_AUTHORITY_ESTABLISHED.** Preserve G10D/G10E, G10F.2/G10F.4 and `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED` exactly. Focused decision: `docs/design/dev-0.7.1-slice-g10f-hosted-epoch-cutover-acceptance-decision.md`.

### A. Files changed

Added the focused hosted G10F acceptance decision and updated current output, handoff, parent-audit prompt, planning/historical route and branch register. No production source, schema, Site-source repository, saved Site version, deployment, browser/profile/site data, protected account, `GAME_VERSION` or held branch changed in this Lineage run.

### B. Patch summary

The owner supplied the completed separate Site-source operation as authoritative: owner-private version 3 from Site-source commit `dcd5d38396fb6ebc2b347d087a6ff6b57541603f`, exact live `index-DRiJsDUZ.js` bytes/SHA and epoch1 v7 selected route verified before hosted account creation; successful hosted account/campaign/Save/load/restart/sign-in, consistent head/history and verified 136,718-byte selected fourteen-family backup retained off-repository. Fresh Sites metadata independently confirms active project `appgprj_6a92239b7f5c8191a91bcf4ee1f0e136`, saved version 3 and successful deployment `appgdep_6ad691c7b9908191a949302943bc8551`. Fresh Lineage inspection confirms no production-client/config delta since accepted G10E and the exact expected built asset hash. The separate operation removed redundant character-creator public copies only in Site source and observed pinned remote PNG assets. Sites' internal TAR digest mismatch is an opaque packaging representation, with actual live client independently verified in the supplied result. G10F.5/G10F.6 publication hold is superseded. Local and hosted protected accounts are distinct origin authorities. Historical version 2 is not a compatible rollback. Install only separate `DEV-0.7.1 Parent Acceptance Audit`.

### C. Tests or checks run

Fetched/pruned exact hosted/local Lineage source; repository-scoped GitHub search returned zero open PRs; five non-default ref heads, merge bases, unique commits/paths and semantic overlap were reinspected. Fresh read-only Sites `get_site`, `list_site_versions` and version 3 deployment-status calls passed. Local built HTML/asset bytes and SHA-256 matched supplied live identity; G10E-to-current production-client/config diff was empty. The selected hosted account/backup sequence is authoritative **supplied operational evidence**, not a new browser test in this Lineage closeout. No new source build, browser operation, archive export, deployment, stress/fault/capacity/eviction test or Site-source inspection occurred. Documentation diff and final hosted publication checks follow. Applied FP-001/002/007/008/009/011/014/018: preserve selected-caller provenance, parent versus slice acceptance, bounded edits, exact source/deployment/account boundaries, complete backup identity and protected data; no new pattern.

### D. Risks / follow-up notes

No raw user-held credential, backup bytes or exact nonsecret hosted account/head IDs are stored in Lineage; do not invent them. The owner's operational report states that selected backup integrity/family/graph checks passed. `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED` remains explicit. Protected local and hosted accounts must not be cleared; rollback must use version 3 or independently verified epoch-compatible saved build. Five held/protected refs retain dispositions, zero open PRs, no integration/deletion/action due or performed. Suggested commit: `docs(decision): accept hosted epoch cutover and route parent audit`. Next run only `DEV-0.7.1 Parent Acceptance Audit`; no DEV parent or Game-version acceptance here. Final publication SHA follows independent hosted readback.

## 2026-10-19 DEV-0.7.1 Slice G10F.5 hosted publication boundary

Source: clean fetched local/hosted `master` `ccb9d438528793d773275f1869ea3f86a35bad4e`. Branch/status: `master`; label class: parent-specific support suffix under planned `DEV-0.7.1`; development impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10F5_HOSTED_PUBLICATION_BOUNDARY_CONFIRMED_CROSS_REPO_WORK_ORDER_REQUIRED; HOSTED_CUTOVER_NOT_EXECUTED.** Preserve `G10_DURABILITY_READY`, `G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT`, `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED`, `G10F2_PRECUTOVER_DISPOSAL_WAIVER_ACCEPTED`, `G10F3_LOCAL_EPOCH_CUTOVER_FUNCTIONALLY_PROVEN_WITH_EVIDENCE_LIMIT`, `PROTECTED_VALIDATION_ACCOUNT_RETAINED` and `SELECTED_BACKUP_FAILURE_UNCLASSIFIED_NONDIAGNOSTIC`. Focused decision: `docs/design/dev-0.7.1-slice-g10f-5-hosted-publication-boundary-decision.md`.

### A. Files changed

Added the focused hosted boundary decision and explicit proposed cross-repository work order; updated current output, handoff, held next-route prompt, planning/historical route and branch register. No production source, schema, build output, Site-source repository, saved Site version, deployment, browser/account data, `GAME_VERSION` or held branch changed.

### B. Patch summary

Fresh Sites readback confirms project `appgprj_6a92239b7f5c8191a91bcf4ee1f0e136`, active custom-access owner Site at `https://lineage-reforged-preview.vagabond1215.chatgpt.site`; live successful deployment `appgdep_6a979a45c5548191947f9d31aa730b85` still selects historical saved version 2/source `8857c08bb272f36938fde0a72087c5c0865be80b`. Only historical versions 1 and 2 are saved. The Lineage production client/config has no delta since accepted G10E; local validated HTML selects the same 2,842,595-byte `index-DRiJsDUZ.js`, SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`, epoch1 v7. Current Sites save contract requires a pushed full SHA matching configured source branch HEAD and a matching package. G10F.1's non-deploying metadata identifies that configured source as the **distinct** `cloudflare_artifact` Git repository, expected branch `main`; its current HEAD was not inspected or changed. Therefore a separate explicit work order/context naming that repository is required before sync/save/publish. The exact proposed work order is in the focused decision; the current Lineage prompt is a routing hold, not cross-repository authorization.

### C. Tests or checks run

Fetched/pruned exact hosted/local source; fresh Sites `get_site`, `list_site_versions` and successful deployment-status readback; compared saved source/version/deployment identities. Rechecked project manifest, default entry, epoch database/version, built HTML/asset bytes/SHA, and empty G10E-to-current production-client/config diff. Read Sites `save_site_version` contract and prior G10F.1 provider/branch metadata; did not mint a credential. Repository-scoped GitHub open-PR search returned zero; five non-default refs' heads, merge bases, unique commits/paths and semantic overlap were reinspected. Documentation diff/publication checks follow. No browser, user-data, source-repo, build, stress, fault, capacity or eviction operation. Applied FP-002/007/008/009/011/014/018: parent/readiness separation, bounded docs, held-branch/source/head provenance, saved-version versus local-package identity, and protected new-data boundary; no new pattern.

### D. Risks / follow-up notes

The Site-source repository's current HEAD and any new package upload acceptance remain unverified in this Lineage context. The previous 459,617,327-byte ignored candidate is not a saved version. Historical version 2 cannot be treated as compatible rollback after new hosted epoch data exists. The protected local `Epoch Cutover 2026-10-18` account remains untouched; old-data waiver never covers it or future accounts. Five retained refs keep their prior protected/held dispositions, zero open PRs, no integration/deletion/action due or performed. Suggested commit: `docs(decision): hold hosted epoch publication at Site source boundary`. Next route is a **separate explicit Site-source repository work order/context**, not executable Lineage G10F.6 work. No hosted activation, planned parent/Game acceptance or held-branch integration. Final publication SHA follows independent hosted readback.

## 2026-10-19 DEV-0.7.1 Slice G10F.4 source-only local closeout

Source: clean fetched local/hosted `master` `1468bd522b7b64a8c201f0cf9ae2d0151fd498d5`. Branch/status: `master`; label class: parent-specific support suffix under planned `DEV-0.7.1`; development impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10F3_LOCAL_EPOCH_CUTOVER_FUNCTIONALLY_PROVEN_WITH_EVIDENCE_LIMIT; PROTECTED_VALIDATION_ACCOUNT_RETAINED; SELECTED_BACKUP_FAILURE_UNCLASSIFIED_NONDIAGNOSTIC; HOSTED_CUTOVER_NOT_EXECUTED.** Preserve `G10_DURABILITY_READY`, `G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT`, `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED`, and `G10F2_PRECUTOVER_DISPOSAL_WAIVER_ACCEPTED`. Focused disposition: `docs/design/dev-0.7.1-slice-g10f-4-local-cutover-source-only-closeout.md`.

### A. Files changed

Added only the focused source-only disposition; updated current output, handoff, prompt, planning/historical route and branch register. No production source, schema, test, generated asset, browser account/data, Site-source repository, hosted deployment, `GAME_VERSION` or held branch changed.

### B. Patch summary

Directly reconciled the G10F.3 selected observations against `EpochApp.tsx`, `CleanEpochAccountStore.exportArchive()`, `CleanEpochAccountAdapter.deleteAccount()` and `g10e-readback.ts`. The Settings backup catch covers export through download setup, so its generic error cannot identify a stage or defect. Production export is a complete fourteen-family validated/digested snapshot with a 64 MiB cap. Accepted G10E selected export/restore succeeded on unchanged production client source and the same built asset. Existing-account deletion requires exact revision/generation and current password; the retained first account cannot be normally deleted without its unavailable credential. The G10E helper itself exports the complete epoch, so it was not used to recover missing IDs from the mixed origin. Local registration/campaign/Save/load/restart and exact temporary deletion remain historical G10F.3 selected evidence. Missing IDs are an automation evidence gap, not graph-failure evidence; no production repair is justified. Install only G10F.5 separate hosted publication work-order boundary.

### C. Tests or checks run

Fetched/pruned and matched requested hosted/local source; repository-scoped GitHub search found zero open PRs; inspected five non-default ref heads, merge bases, unique commits/paths and semantic overlap. `git diff` against accepted G10E production-client source returned no delta. Fresh `npm run typecheck:node` and `npx vite build` passed; the 256-module client again emitted `index-DRiJsDUZ.js`, 2,842,595 bytes, SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`. Source/control-flow and focused G10E E6/E7 evidence inspected. Documentation diff check and hosted readback follow publication. No new browser, protected-data, whole-epoch export, G10B–E stress/fault/capacity or eviction work. Applied FP-001/002/007/008/009/011/014/018/019 through selected-evidence provenance, acceptance separation, bounded edits, exact ref/source identity, archive-scope caution and intact credential/generation deletion guard; no new pattern.

### D. Risks / follow-up notes

The first protected local account remains inaccessible by known password and has no verified selected backup; exact IDs remain unrecorded. The generic Settings error is unclassified, not a diagnosed production defect. Future owner-created accounts are protected from creation. The hosted preview's last verified revision is historical pre-epoch; no hosted cutover occurred. A separate named work order/context is required before any `cloudflare_artifact` Site-source Git mutation. Five held/protected refs retain their dispositions, no branch integration/deletion or PR action due/performed. Suggested commit: `docs(decision): close local epoch cutover with evidence limit`. Next run G10F.5 hosted publication work-order boundary only; no parent/Game acceptance. Final publication SHA follows independent hosted readback.

## 2026-10-19 DEV-0.7.1 Slice G10F.3 partial local cutover and temporary account deletion

Source: clean synchronized local/hosted `master` `801ce23ad03f15c1551086d21ce96cb04bc8e89b`. Branch/status: `master`; label class: parent-specific support suffix under planned `DEV-0.7.1`; development impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10F3_LOCAL_CUTOVER_PARTIAL_PROTECTED_DATA_HELD.** Preserve `G10_DURABILITY_READY`, `G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT`, `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED`, and `G10F2_PRECUTOVER_DISPOSAL_WAIVER_ACCEPTED`. Focused record: `docs/design/dev-0.7.1-slice-g10f-3-local-cutover-partial-record.md`.

### A. Files changed

Added the focused partial-cutover record and updated current output, handoff, prompt, planning/historical route and branch register. No production source, schema, generated asset, hosted Site, other repository, Game version or held branch was changed. On the exact local origin, one protected account/campaign/save was created and one separate temporary zero-save account was created, restarted, signed in and deleted with action-time owner confirmation.

### B. Patch summary

The owner confirmed old tabs closed. The exact accepted epoch asset was rebuilt and served locally at `127.0.0.1:5173`; selected first-account campaign/save/load and full-page restart succeeded. The first account is the new protected persistence boundary. Browser automation then lost its generated password, so exact nonsecret account/head/history IDs and a selected backup are absent. Settings reported a generic archive failure, without an underlying cause. The owner directed preservation of that account and no replacement. A separate requested temporary account was deleted through the App's bounded Delete Account flow; after restart it was absent and the protected account remained listed. Hosted Site publication was not performed because it would require a separately authorized Site-source Git repository write.

### C. Tests or checks run

Fetched/pruned source and reviewed five held/protected refs and zero open Lineage PRs; fresh Vite build passed (256 modules), exact served asset returned HTTP 200 with matching 2,842,595-byte SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`. Mounted default-App registration/campaign/Save/load/restart passed at the displayed level; temporary-account restart/sign-in/Delete Account/post-restart absence passed. No broad typecheck, G10B–E stress, fault, capacity or eviction probe was run. Applicable FP-001, FP-002, FP-007, FP-008/009, FP-011/014, FP-018/019: selected caller, bounded evidence, precise source/ref/graph claims and exact-account destructive action. No new reusable pattern registered.

### D. Risks / follow-up notes

G10F.3 is **not accepted**: the protected first account remains on the local origin but its password is unavailable, exact graph identities were not captured, selected backup failed generically, and hosted preview remains historical. The automatic approval review rejected a later whole-archive attempt through the temporary account because it would expose other accounts' material; no retry was made. Preserve the protected account; classify the backup failure and identity recovery separately before any repair/destructive step. Five held/protected refs retain their dispositions; no integration/deletion/PR action due or performed. Suggested commit: `docs(evidence): record partial local epoch cutover and temporary deletion`. Install only G10F.4 bounded recovery/readback classification. No DEV/Game acceptance or held-branch integration. Final publication SHA follows hosted readback.

## 2026-10-18 DEV-0.7.1 Slice G10F.2 owner pre-cutover disposal decision

Source: clean fetched local/hosted `master` `b46d581dbca4ece6d7d3f509e158e035420ea99c`. Date 2026-10-18. Branch/status assumption `master`; label class: parent-specific support suffix under planned `DEV-0.7.1`; development impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10F2_PRECUTOVER_DISPOSAL_WAIVER_ACCEPTED; OPERATIONAL_CUTOVER_NOT_EXECUTED.** Preserve `G10_DURABILITY_READY`, `G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT`, and `ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED`. Focused authority: `docs/design/dev-0.7.1-slice-g10f-2-precutover-development-data-disposal-owner-decision.md`.

### A. Files changed

Added the focused owner decision; marked G10F/G10F.1 historical preservation gates superseded; updated current output, handoff, prompt, planning/historical route and branch register. No production source, schema, tests, generated asset, account, Site or `GAME_VERSION` changed.

### B. Patch summary

The owner's explicit instruction makes every existing Lineage hosted-preview/local-development account and save created before operational cutover disposable, including pre-cutover epoch-schema tests. Target-specific old-data backup, migration, age inventory solely for preservation, and saved rollback as an old-data precondition are waived. No clearing is required; optional deactivation/flagging/deletion remains exact-account/origin/profile and generation-fenced. Close retained old tabs, serve the validated epoch client, and verify a fresh post-cutover account/campaign/save/load/restart. The first successful durable post-cutover epoch account begins protected new-data authority. Historical Sites version 2 cannot edit it. The separate Sites source repository still needs its own named work order for any source write. No cutover action occurred.

### C. Tests or checks run

Fetched/pruned Lineage refs; independently read back the starting hosted commit and zero open PRs; rechecked five non-default refs' merge bases, unique commits and changed-path counts; reviewed current G10F/G10F.1 and accepted clean-development reset authority; checked the bounded documentation diff and final hosted publication. No browser, deployment, build, storage or production test was run for this docs-only decision. Applied FP-002, FP-007, FP-008/009, FP-011/014 and FP-018/019 by keeping acceptance separate, using bounded supersession notes, preserving evidence provenance, and retaining exact targeting for destructive operations.

### D. Risks / follow-up notes

The owner waiver resolves old-data preservation blockers but does not itself deploy the epoch build or create a protected account. At the later cutover, recheck retained old-tab closure and served asset/deployment identity; any optional deletion must target only authorized Lineage data. Existing post-cutover data must never be covered by this waiver. Five protected/held refs retain their registered dispositions; zero open PRs; no branch integration/deletion due or performed. Suggested commit: `docs(decision): accept pre-cutover development data disposal waiver`. Install only **DEV-0.7.1 Slice G10F.3 — Operational Epoch Cutover And First Protected Readback**. `DEV-0.7.1` acceptance and Game-version decision remain separate. Final publication SHA follows independent hosted readback.

## 2026-10-18 DEV-0.7.1 Slice G10F.1 target, backup and rollback evidence completion

Source: clean fetched/authenticated local/hosted `master` `9778a3ec8d2fdd39945b8dadb75d1a426faa1cd9`. Date 2026-10-18. Branch/status assumption `master`. Label class: parent-specific support pre-operation evidence under planned `DEV-0.7.1`; development impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10_DURABILITY_READY; G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT; ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED; G10F_ACTIVATION_HELD_TARGET_AND_ROLLBACK_PROOF_OPEN; G10F1_OWNER_PAIR_AND_SAVED_ROLLBACK_OPEN.** Focused row decision: `docs/design/dev-0.7.1-slice-g10f-1-target-backup-rollback-evidence-disposition.md`.

### A. Files changed

Added the focused G10F.1 evidence disposition and updated current output, handoff, next prompt, historical/planning route and branch register. Fresh build output and a local 459,617,327-byte rollback candidate remain ignored under `apps/rpg-ui/dist` and `.tmp-g10f1`; they are not tracked or a saved Sites version. No production source, dependency, schema, user data, Site deployment, `GAME_VERSION` or held branch changed.

### B. Patch summary

Read-only Sites metadata still identifies the hosted URL/project and successful historical version 2/deployment from source `8857c08b`; no saved epoch version exists. Fresh Vite build reproduced G10E's exact `index-DRiJsDUZ.js` (2,842,595 bytes; SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`) and IndexedDB epoch1 v7 owner. The installed Sites build-preparation script plus local tar produced an ignored Worker-package candidate at `C:\Codex\EoL\.tmp-g10f1\g10f1-epoch-rollback-candidate.tar.gz`, 459,617,327 bytes, SHA-256 `3C77AE34F21001B64BEE770771F878CA01B03A3061673AF02559DA3D372018EC`; all 183 entries enumerated and extracted manifest/worker/index/asset identities matched. This is verified **local content**, not a saved/upload-accepted/deployable Sites rollback. Sites saving requires its distinct `cloudflare_artifact` source repository branch HEAD to match the archive source; this work order authorizes only the Lineage repository, so no Site source push/save occurred. The accessible browser showed no tabs but no owner profiles. Owner follow-up identifies Brave Nightly 1.100.5 (Chromium 156.0.8078.39), profile `Personal`, as the usual browser/profile for the exact hosted preview URL; no tabs are currently open, and a recent character used a preexisting account. Epoch authority remains unknown. Localhost testing was through Codex/Codex browser without exact local origin/profile binding. The former GitHub Pages site is not a cutover target. No pair data-age classification or operational backup is established. The four-fact owner evidence rows and conditional selected backup gate are in the focused disposition.

### C. Tests or checks run

Fresh fetch/prune and independent hosted source/PR readback; Sites get/list/deployment/custom-domain reads; no local 5173/QA listeners; accessible browser inventory; source-versus-G10E production diff; app-local `npx vite build` PASS (256 client modules); extracted package manifest/worker/index/JS hash, archive integrity/entry count and SHA-256; branch merge-base/unique-commit/path inspection; staged documentation diff check and final hosted publication readback. No G10B–E browser stress, quota, fault, capacity, persistence or live user-storage probe; no broad UI typecheck claimed. Applicable FP-002, FP-007, FP-008/009, FP-011/014, FP-018/019: readiness/parent separation, bounded docs, exact refs/publication, package versus archive provenance, no destructive pair inference. No new generalized pattern.

### D. Risks / follow-up notes

For hosted Brave `Personal`, epoch-authority state remains pending; the owner says no tabs are currently open and permits deletion if compatibility issues warrant it, but this run does not delete data or treat permission as proof of storage age. Exact local origin/profile use and any additional owner pair remain pending. A pair with epoch data needs its own selected off-browser backup and fourteen-family/graph verification; an empty/pre-cutover-only pair has no legacy backup obligation. The candidate package has not been uploaded or saved; the separate Site source repository requires an explicit named work order before source sync/save-only version creation, and 459 MB upload acceptance is untested. Historical Sites version 2 cannot edit epoch data. Five protected/held refs and zero open PRs retain their triggers; no branch action due/performed. Suggested commit: `docs(decision): hold G10F1 on owner pairs and saved rollback`. Next run: **DEV-0.7.1 Slice G10F.2 owner pair evidence and saved rollback authorization**. No Game-version decision. Final publication SHA follows independent hosted readback.

## 2026-10-18 DEV-0.7.1 Slice G10F operational epoch cutover preflight

Source: clean fetched/authenticated local/hosted `master` `7c16b5a8041cc27fa7c299d41acb66007a36a70c`. Date 2026-10-18. Branch/status assumption `master`. Label class: parent-specific support preflight under planned `DEV-0.7.1`; development impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10_DURABILITY_READY; G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT; ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED; G10F_ACTIVATION_HELD_TARGET_AND_ROLLBACK_PROOF_OPEN.** Focused decision: `docs/design/dev-0.7.1-slice-g10f-operational-epoch-cutover-preflight-decision.md`.

### A. Files changed

Added only the focused G10F operational decision; updated current output, handoff, next prompt, historical/planning route and branch register. No production source, schema, test, generated asset, site/profile/user data, deployment, `GAME_VERSION` or held branch changed.

### B. Patch summary

Read-only Sites metadata established owner-only hosted project `appgprj_6a92239b7f5c8191a91bcf4ee1f0e136` at `https://lineage-reforged-preview.vagabond1215.chatgpt.site`, current successful version 2/deployment `appgdep_6a979a45c5548191947f9d31aa730b85`, historical source `8857c08bb272f36938fde0a72087c5c0865be80b`, updated 2026-09-02. It is not the G10E validated epoch client. The local ignored G10E asset remains 2,842,595 bytes with SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`; neither listed Sites version is established as epoch-compatible rollback. Normal local origin `http://127.0.0.1:5173` was not listening; `localhost:5173` is a separate conditional origin. Fresh accessible Codex in-app-browser inventory returned zero tabs but did not expose other owner browsers/profiles. Exact profile pairs, tab census, per-pair data age, operational backup and deployable epoch-compatible rollback remain unknown. No clear is authorized on an ambiguous or already-epoch pair. Installed only G10F.1 target/backup/rollback evidence completion, not operational cutover.

### C. Tests or checks run

Fresh fetch/prune and local/hosted source identity; read-only Sites `get_site`, two saved versions, zero custom domains and current deployment status; local built asset bytes/SHA and HTML; local listener check; accessible browser tab inventory; accepted G10A/E/reset authorities; live branch merge-base/unique-commit/path review and zero open repository PRs; documentation diff/readback and final hosted publication check. No G10B–E browser test, new build, typecheck, fault/capacity test, storage mutation or operational site action ran. Applied FP-002 (readiness distinct from activation/parent), FP-007 (bounded docs edits), FP-008/009 (semantic held refs and exact source/final identities), FP-011/014 (backup provenance), FP-018/019 (exact pair/graph before destructive clear). No new generalized pattern.

### D. Risks / follow-up notes

The old Sites version 2 cannot be used to edit a new epoch account; the unknown owner profile/data-age census and missing preserved compatible rollback are hard stops. G10E synthetic off-browser archive is not a target-specific user-held operational backup. Persistence denial, safe origin-loss recovery and unobserved involuntary eviction remain distinct. Five hosted non-default refs remain protected/held with unchanged triggers; no integration, deletion or PR action due/performed. Suggested commit: `docs(decision): hold G10F cutover on target and rollback evidence`. Next run: **DEV-0.7.1 Slice G10F.1 target, backup and rollback evidence completion**; no Game-version decision. Final hosted publication SHA follows independent readback.

## 2026-10-18 DEV-0.7.1 Slice G10E independent durability readiness

Source: clean fetched/authenticated local/hosted `master` `9e606a789a8eca8bd1f4c8d0093aab80968243b3`; fixed E1–E9 pre-probe matrix `c395cc80b0f57d7d4c148b1023690809e3bb4fca`; nonsecret evidence checkpoint `94487dc64e8433d473cae3514c892a218aeb5fbf`; focused decision `d251c2c979c8debc8bdc5a56fab1a7ffd9c33a54`, all pushed and independently hosted-read back. Date 2026-10-18. Branch/status assumption `master`. Label class: parent-specific support readiness audit under planned `DEV-0.7.1`; development milestone impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10_DURABILITY_READY; G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT; ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED; ACTIVATION_HELD.** Complete row dispositions: `docs/design/dev-0.7.1-slice-g10e-independent-durability-readiness-disposition.md`.

### A. Files changed

Added fixed matrix before probes, test-only readback/real-old-writer/selected-file comparison and evidence verification helpers, nonsecret G10E source/stale/legacy/selected archive/restore/persistence receipts and two synthetic screenshots, and the focused E1–E9 decision. Updated this output, current GPT handoff/prompt, historical/planning route and branch register. No production source, schema, dependency, generated mirror, built asset, private archive, existing user site data or `GAME_VERSION` changed.

### B. Patch summary

Mounted the exact 2,842,595-byte built default client SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`; its selected path is epoch IndexedDB v7 and fourteen families. At isolated `:5353`, selected ordinary Stonevein World/non-head and completed four-shift Starfall Soundings/Chronicle 9 formed the measured two-account, four-head pre-concurrency graph (5,140,088 bytes). Two selected contexts: primary accepted one Save, stale second Save visibly blocked and left all families/identities/bytes unchanged; Retry and full-page restart found the newer head, then one later selected Save advanced exactly once. An actual retained old account/session and v7 save writer created legacy namespace keys without changing the epoch hint or 14-family graph, even after selected restart; selected Save left the original eight old key signatures stable. The selected Settings password-gated 6,197,782-byte archive, copied to a private off-browser location, matched its adjacent owner export on all family signatures and graph identities; independent `createdAt` explains the different whole-file SHA. Empty `:5354` imported that copy, credential sign-in and older non-head Quick Save plus completed Soundings/Chronicle load worked, and restart retained exact source-checkpoint graph. Both origins returned `persisted()=false`, `persist()=false`; actual involuntary eviction was not observed. G10D accepted evidence remains in its original scope, not counted as fresh G10E proof. No production repair justified. Installed only separate G10F **operational cutover decision preflight**, not deployment or activation.

### C. Tests or checks run

`PASS_G10E_FRESH_SELECTED_GRAPH_RECONCILIATION`; `PASS_G10E_EXACT_SELECTED_GRAPH` against the private selected file; 54/54 focused campaign/Soundings/survey owner tests; `npm run typecheck:ui:node` pass; app-local `npx vite build` pass at 256 modules. Broad `npm run typecheck:ui` retained 137 pre-existing diagnostics (exit 2), not a green result. Built HTML/asset, selected `App` entry, epoch DB/hint and absence of retained old prefixes in the built asset; JavaScript mirrors/public exports covered by focused tests; documentation/staged diff checks. Five live non-default refs with exact heads/merge bases/unique paths and zero open repository PRs inspected; no integration/deletion/disposition change due or performed. Applied FP-001/017 (ordinary selected reachability), FP-002 (readiness distinct from parent), FP-003/004/005/006 (blocked, Retry, restart, no drift), FP-007 (bounded large-file edit), FP-008/009 (source/evidence/decision/final publication and held refs), FP-011/012/014 (complete archive/receipt provenance), FP-018/019 (generation and complete graph). No new generalized failure pattern.

### D. Risks / follow-up notes

Source estimate usage/quota `3,625,312 / 10,741,043,552`; restore `2,473,903 / 10,739,892,143`; persistence denied on both. Actual involuntary browser eviction remains unobserved; a user-held complete backup is the recovery path after loss. Private synthetic backup/credential remain outside the repository. Readiness does not authorize a specific target deployment, pre-cutover clear or planned DEV/Game acceptance. Five protected/held branches retain the exact register triggers; G10E consumed none. Suggested final routing commit: `docs(handoff): route separate G10F cutover preflight`. Next recommended run: **DEV-0.7.1 Slice G10F operational epoch cutover decision preflight**, documentation-only; no separate Game-version decision proposed. Final routing SHA is reported after push and independent hosted readback.

## 2026-10-17 DEV-0.7.1 Slice G10D.6 independent overall D1–D7 disposition

Source: initially clean fetched/authenticated local and independently verified hosted `master` `ed804023d4b5c782df7d0bdb8b8ca6b83a2f94e4`; focused G10D.6 evidence/decision checkpoint `1bba23d254322ed2cfd634fbeda14167d9bfdaab` pushed and independently hosted-read back before routing. Date 2026-10-17. Branch/status assumption `master`. Label class: support acceptance audit under planned parent `DEV-0.7.1`; development milestone impact `supports_current_band`; game-version impact `none`. Current Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT; ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED; G10E_ROUTE_INSTALLED_NOT_EXECUTED; ACTIVATION_HELD.** Focused row decision: `docs/design/dev-0.7.1-slice-g10d-6-independent-overall-ledger-disposition.md`.

### A. Files changed

Added the read-only nonsecret G10D.6 independent ledger verifier/result and focused D1–D7 decision; appended the original fixed G10D matrix; updated this output, handoff, current prompt, historical/planning route and branch register. No production source, schema, generated mirror, dependency, built asset, private archive, site/user data or `GAME_VERSION` changed.

### B. Patch summary

Independent parsing rechecked the accepted `:5343` **one-graph** 120-save/39-load/ten-restart/two-context ledger: exact seven 14-family rows, 1,628,697→8,732,446 archive bytes, 4→124 descendant recoveries, 7→127 immutable artifacts, account revision 8→128, three histories/heads, four addresses, fixed witness and all prior checkpoint artifacts retained. Its owner exports are not selected-download receipts. The distinct fresh `:5346` graph supplies exact baseline and 120 password-gated Settings receipts: selected/adjacent owner bytes 1,658,326 and 9,106,532, with all fourteen family count/serialized-byte/digest signatures and graph identities equal. Separate export `createdAt` timestamps explain different whole-file SHA values. D3/D4 independent grown-graph fault and mounted blocked/Retry scopes, D5 selected restore/atomic import/valid near-cap owner boundary, and G10D.3 D6 contractual recoverability all satisfy the original fixed rows without relabeling their evidence. `persist()` denial, `persisted()=false`, safe origin-loss simulation and **actual involuntary eviction unobserved** remain distinct. D7 publication and validation scope is explicit. All D1–D7 rows pass; only separate G10E readiness route was installed, not executed.

### C. Tests or checks run

Fresh fetch/prune and exact local/upstream/hosted source readback; zero open repository PRs; five nondefault ref heads/merge bases/unique paths/dispositions; full fixed-matrix and G10D.1–5 evidence reconciliation; new read-only `PASS_G10D6_EXISTING_SELECTED_LEDGER_RECONCILIATION` against both separate graphs and the two exact selected receipts; source/evidence/decision commit ancestry, no production/shared mirror delta from accepted combined proof, no credential-bearing data in the new nonsecret JSON, staged diff check and independent hosted focused commit readback. Prior G10D.1/G10D.2/G10D.5 selected/owner/browser and Node UI-config/Vite checks are **historical**, not freshly rerun here; the recorded 256-module built asset is `index-DRiJsDUZ.js` SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`. Broad UI's 137 baseline diagnostics are not called green. Applied FP-001/017 (actual selected reachability), FP-002 (complete ledger before parent acceptance), FP-003/004/005/006 (blocked/Retry and exact restart), FP-007 (bounded large-file edits), FP-008/009 (held refs and exact publication heads), FP-011/012/014 (complete provenance), FP-018/019 (destructive-generation and graph completeness); executable evidence is prior within recorded scopes, while this pass independently audits it.

### D. Risks / follow-up notes

There is no observed involuntary eviction or browser-specific retention guarantee; a user-held backup is necessary for recovery after total origin loss. No G10E action, production repair, deployment, activation, site/user data clearing, planned DEV/Game acceptance, `GAME_VERSION` change or held-branch integration occurred. Five hosted refs remain protected/held; zero open PRs and no branch disposition change, merge, rebase, deletion or integration due/performed. Suggested final coordination commit: `docs(handoff): install separate G10E readiness audit`. Next recommended run: **DEV-0.7.1 Slice G10E independent durability and activation-readiness audit**; no separate Game-version decision proposed. Final coordination SHA follows commit/push/hosted readback.

## 2026-10-17 DEV-0.7.1 Slice G10D.5 exact selected baseline/final download proof

Source: initially clean fetched/authenticated local and hosted `master` `99d20dd9007c39d4d8c933849334edf78a01ef25`; fixed checklist/test harness pre-action checkpoint `5c1ca781`; focused evidence checkpoint published and independently hosted-read back at `d0f532180dd1db631fc1687297bd37a030c284cc`. Branch/status assumption: `master`. Date 2026-10-17. Label class: support evidence slice under planned parent `DEV-0.7.1`; development milestone impact `supports_current_band`; game-version impact `none`. Current Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10D_D1_COMBINED_SELECTED_PROVEN; G10D_D2_CHECKPOINT_ACCOUNTING_AND_SELECTED_BASELINE_FINAL_DOWNLOAD_PROVEN; G10D_D3_D5_FAULT_AND_BOUNDARY_PROVEN; G10D_D6_CONTRACTUAL_RECOVERABILITY_PROVEN; ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED; G10D_OVERALL_OPEN_SEPARATE_DISPOSITION; G10E_NOT_INSTALLED; ACTIVATION_HELD.**

### A. Files changed

Added test-only `apps/rpg-ui/g10d5-*` mounted harness, selected-download comparator and independent ledger verifier; fixed pre-action checklist; complete nonsecret seven-row ledger, two exact selected file receipts and independent result under `docs/dev/evidence`; focused G10D.5 decision and original matrix addendum; this output, current handoff/prompt, historical/planning route and branch register. No production source, schema, dependency, built asset, private archive, site/user data or `GAME_VERSION` changed.

### B. Patch summary

The complete contemporaneous search found no exact `:5343` selected Settings download receipts, so one fresh disposable `:5346` default-App account established ordinary World/non-head, natural Stonevein Normal-Stakes defeat/recovery, four-shift completed Soundings and three active run histories before baseline. The same graph completed 120 accepted descendant saves, 39 selected loads, ten full-page restarts and two contexts, with complete fourteen-family measurements exactly at 0/20/40/60/80/100/120. All 128 final artifacts, three heads/histories and the witness survived; no quota/prune/drift or false selected success. Actual password-gated Settings downloads occurred at exact 0 and 120. Baseline owner/selected files each measured 1,658,326 bytes, final owner/selected each 9,106,532 bytes; all fourteen family signatures and nonsecret account/head/history/address/artifact identities matched at each. Their whole-file SHA-256 values differ because each export generated a distinct `createdAt`; every SHA is recorded separately in `docs/design/dev-0.7.1-slice-g10d-5-exact-selected-download-proof.md`. Independent verifier result: `PASS_G10D5_INDEPENDENT_RECONCILIATION`. Original G10D.4 missing selected-download subcheck is proven **from this fresh graph**, without attributing downloads to `:5343`. D3–D6 prior evidence was not rerun. No production repair justified. Installed only separate G10D.6 overall D1–D7 ledger disposition; G10D overall was not accepted and G10E not installed.

### C. Tests or checks run

Fresh source/ref/open-PR inventory; exact pre-action checklist; mounted selected ordinary graph, 120-save/two-context/39-load/ten-restart run; seven complete owner-export/checkpoint self digests and selected baseline/final file readbacks; independent Node verifier with ledger SHA-256 `ff9ab531894f14861b2b21e7ee17718434ec803c8a56a44bbc86973755a8e79a`; selected receipt file SHAs `d5fa182b31558eda814aaa58870ca1a65f5aa70b97eb2ab0bfee33c2860fa1a9` and `8ec6dae48ccfbfbc3a69d34c89b2cb3c27e89766066510d53e48e4eb1b156fb1`. Fresh `npm run typecheck:node` and `npx vite build` passed; built client remained `index-DRiJsDUZ.js` SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`. Broad UI typecheck retained 137 pre-existing diagnostics and is not green. Staged documentation diff check and hosted evidence-commit readback passed. Applied FP-001/017 (ordinary selected caller path), FP-002 (no overall acceptance by subcheck), FP-003/004/005/006 (selected load/restart/other-head integrity), FP-007 (bounded large-file edits), FP-008/009 (held refs and publication identities), FP-011/012/014 (complete file/family provenance), FP-018/019 (retained complete graph). The fresh evidence only covers G10D.5; prior fault/restore evidence retains its original scope.

### D. Risks / follow-up notes

`persisted()` was false at all seven measured points; `persist()` was not called in this run. Actual involuntary eviction remains unobserved; G10D.3 contractual D6 limit remains. Five hosted refs remain protected/held and repository-scoped open PR count was zero; no branch trigger, disposition change, integration or deletion was due/performed. Suggested final coordination commit: `docs(handoff): install separate G10D overall disposition`. Next recommended run: **DEV-0.7.1 Slice G10D.6 separate overall D1–D7 ledger disposition**. G10E, deployment, activation, data clearing, planned DEV/Game acceptance, `GAME_VERSION` change and held-branch integration remain blocked; no separate Game-version decision proposed. Final coordination publication SHA is reported after push/independent hosted readback.

## 2026-10-17 DEV-0.7.1 Slice G10D.4 independent overall ledger audit

Source: initially clean fetched authenticated local and independently verified hosted `master` `a527071a254dc87554a757220e264174338b6084`; branch/status assumption `master`. Date 2026-10-17. Label class: support evidence/acceptance audit under planned parent `DEV-0.7.1`; development milestone impact `supports_current_band`; game-version impact `none`. Current Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10D_D1_COMBINED_SELECTED_PROVEN; G10D_D2_CHECKPOINT_ACCOUNTING_PROVEN_SELECTED_DOWNLOAD_OPEN; G10D_D3_D5_FAULT_AND_BOUNDARY_PROVEN; G10D_D6_CONTRACTUAL_RECOVERABILITY_PROVEN; ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED; G10D_OVERALL_OPEN; G10E_NOT_INSTALLED; ACTIVATION_HELD.** Focused row-by-row decision: `docs/design/dev-0.7.1-slice-g10d-4-independent-overall-ledger-audit.md`.

### A. Files changed

Added the independent G10D.4 D1–D7 audit; appended its disposition to the original fixed G10D matrix; updated this output, current handoff and next prompt, historical/planning route and branch register. No production source, schema, test harness, dependency, generated output, archive payload, browser/site/user data or `GAME_VERSION` changed.

### B. Patch summary

Independent parsing of the sole accepted combined `:5343` ledger verified seven exact 0/20/40/60/80/100/120 rows, fourteen family signatures at each, one stable account, three run histories/heads, four addresses, one fixed witness digest, 4→124 descendants, 7→127 retained artifacts and 8→128 account revision. The reported 120 accepted selected saves, 39 loads, 10 restarts and two contexts, with ordinary mixed branches before baseline, remain D1 authority. Independent D3/D4 grown-graph quota/abort and selected blocked/Retry evidence, D5 selected two-origin restore/second backup plus valid 67,047,945-byte near-cap owner restore, and G10D.3 contractual D6 retain their accepted limits. `persist()` denial, `persisted()=false`, safe origin-loss simulation and **unobserved involuntary eviction** are not conflated.

The original fixed measurement plan at `1eef3dc4` additionally required an actual **selected G10C download at baseline and final**. The accepted combined checklist and ledger record owner-export bytes/digests at 0 and 120 but no selected Settings download/file identity at either exact point. G10D.2's 10,394,105-byte selected file was created after later graph growth and cannot replace the 8,732,446-byte `:5343` final checkpoint; the older `:5330` selected file is a different graph. Thus D2's main checkpoint accounting stays proven, but its fixed selected-download subcheck is **OPEN**, so G10D overall is not accepted. No measured failure justifies production repair. Installed only **G10D.5 exact selected baseline/final download proof**, beginning with a search for contemporaneous exact receipts and otherwise requiring a fresh disposable selected graph. G10E is not installed.

### C. Tests or checks run

Fresh fetch/prune, exact local/upstream and hosted source identity, repo-scoped GitHub open-PR search (zero), five non-default hosted ref heads/merge bases/divergence/unique path counts, fixed-matrix text verified in pre-probe `1eef3dc4`, G10D.1 combined evidence JSON parsed and file SHA-256 matched `03160b8548dcfbcadd471c8cf2dbb2b1bb924af1b4c0a2cf9ae25d3ed1c086ae`; growth/retention invariants checked independently. G10D.2 checklist/results and three nonsecret D5 JSON ledgers were reconciled; all JSON parsed and D5 first/middle/last/valid-near-cap versus padded-over-cap boundaries remained distinct. Prior Node UI-config typechecks and app-local Vite builds passed with the recorded 256-module built asset `index-DRiJsDUZ.js` SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`; broad UI retained 137 baseline diagnostics and is not green. These are **historical** executable checks; no new G10D.4 browser/build/fault/capacity check was run. Documentation diff and final hosted readback are publication checks.

Applied FP-001/017 (selected ordinary path versus fixtures), FP-002 (no overall acceptance from partial/focused passes), FP-003/004/005/006 (blocked completion, contention, restart and newer truth), FP-007 (bounded large-file edits), FP-008/009 (held branch semantics and distinct source/evidence/final heads), FP-011/012/014 (complete provenance/identity), FP-018/019 (destructive generation and graph completeness). Existing G10D.1/G10D.2 evidence covers executable boundaries; this audit adds no fresh runtime proof. The missing exact selected-download row is a gate-accounting omission, not an observed production defect.

### D. Risks / follow-up notes

G10D remains open on one exact fixed-plan selected baseline/final download requirement. If no contemporaneous private receipt binds both exact `:5343` points, a new combined selected graph is required; do not infer a historical receipt from off-checkpoint archives. Five hosted refs retain protected/held dispositions and zero open PRs; no branch disposition change, integration or deletion was due/performed. Suggested commit: `docs(audit): retain G10D download proof gate`. Next recommended run: **DEV-0.7.1 Slice G10D.5 exact selected baseline/final download proof**. G10E, activation, deployment, site/user data clearing, planned DEV/Game acceptance, `GAME_VERSION` changes and held-branch integration remain blocked; no separate Game-version decision is proposed.


## 2026-10-17 DEV-0.7.1 Slice G10D.3 D6 authority disposition

Source: initially clean fetched/authenticated local and independently verified hosted `master` `80051b2a7da5d0bd3162dde0a50cc8c002d24b6a`; branch/status assumption `master`. Date 2026-10-17. Label class: support evidence/authority slice under planned parent `DEV-0.7.1`; development milestone impact `supports_current_band`; game-version impact `none`. Current Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10D_D1_D2_SELECTED_PROVEN_ON_COMBINED_GRAPH; G10D_D3_D5_FAULT_AND_BOUNDARY_PROVEN; G10D_D6_CONTRACTUAL_RECOVERABILITY_PROVEN; ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED; G10D_OVERALL_NOT_ACCEPTED; G10E_NOT_INSTALLED; ACTIVATION_HELD.**

### A. Files changed

Added `docs/design/dev-0.7.1-slice-g10d-3-d6-authority-disposition.md`; appended the bounded D6-E1 decision to the fixed G10D matrix; updated this output, current handoff and prompt, historical/planning route and branch register. No production source, test harness, schema, dependency, generated output, browser/site/user data or `GAME_VERSION` changed.

### B. Patch summary

The focused comparison places the original capacity/retention, clean-epoch, G9A and G10A recovery requirements before the fixed G10D conditional D6 wording and the later G10D.2 conservative open-row rule. G10A explicitly treats profile deletion/browser eviction as a **recoverability scenario** with a user-held verified backup as recovery path; the fixed G10D row says an actual **required** eviction behavior that cannot safely be exercised stays open. No accepted pre-G10D.2 decision requires inducing involuntary eviction. D6-E1 is therefore closed by this explicit authority interpretation, preserving G10D.2's measured `persist()=false`/`persisted()=false`, exact estimates, safe origin-loss simulation and selected complete archive restores as separate facts. Actual involuntary eviction remains unobserved. Current selected source read-only inspection confirms retained-session missing-account and selected-account missing-data paths reject, while a wholly lost origin without a hint is indistinguishable from a fresh origin and uses user-held import. The first focused D6 decision/matrix checkpoint was committed and hosted-read back at `642b60bb3802e6b01c58a079eb10edd88934cd02`. G10D overall was **not** accepted here; only G10D.4 independent overall-ledger disposition is installed.

### C. Tests or checks run

Fresh fetch/prune; exact local/upstream and hosted prompt identity; repository-scoped PR search (zero open); five non-default hosted refs and local creator ref with live merge bases, unique paths and semantic overlap; original/fixed/later authority comparison; read-only selected fail-closed caller trace; G10D.1/G10D.2 nonsecret evidence reconciliation; staged documentation diff check; independent hosted focused decision and commit readback. No browser, capacity, fault, disk-pressure, profile-clear, production test/build or persistence probe was run in G10D.3. Applied FP-001/002 (do not inflate source or partial evidence to parent acceptance), FP-003 (reachable blocked/recovery contract), FP-007 (bounded edits to large current files), FP-008/009 (held branch and distinct source/checkpoint/final heads), FP-017 (selected path retained as the D1/D2 authority) and FP-019 (complete archive graph rather than partial recovery). Checks cover only the documentation/authority scope.

### D. Risks / follow-up notes

Actual involuntary eviction was not observed and there is no browser-specific eviction-protection guarantee. User-held backups must exist before a loss; an entirely erased origin cannot locally distinguish loss from first visit. D6 is closed only on the documented product contract and tested selected restore path. G10D overall and G10E remain held until a separate D1–D7 ledger disposition and its hosted publication. Five hosted refs remain protected/held, zero open PRs, no disposition/integration/deletion was due or performed. Suggested commits: `docs(decision): settle G10D D6 recoverability authority` (published checkpoint) and `docs(handoff): install separate G10D overall ledger audit`. Next recommended run: **DEV-0.7.1 Slice G10D.4 independent overall G10D ledger disposition**; no separate Game-version decision is proposed.


## 2026-10-17 DEV-0.7.1 Slice G10D.2 separate fault and persistence proof

Source: initially clean synchronized authenticated local/hosted `master` `0c13999ea832661dc35db74a69d8371e8b3fd485`; fixed pre-injection checklist committed/pushed at `f47179625d1921100ce15f29893da1c3612b953b`. Date 2026-10-17; branch/status assumption `master`. Label class: support evidence slice under planned parent `DEV-0.7.1`; development milestone impact `supports_current_band`; game-version impact `none`. Current Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10D_D1_D2_SELECTED_PROVEN_ON_COMBINED_GRAPH; G10D_D3_D5_FAULT_AND_BOUNDARY_PROVEN; G10D_D6_RECOVERY_PROVEN_ACTUAL_EVICTION_OPEN; G10E_NOT_INSTALLED; ACTIVATION_HELD.** The G10D.1 exact 0/20/40/60/80/100/120 14-family ledger remains the sole D1/D2 authority; no D1/D2 rerun is claimed.

### A. Files changed

Test-only disposable G10D.2 browser QA pages/runners under `apps/rpg-ui/g10d2-*`; fixed pre-injection checklist, nonsecret D3–D6 row narrative and D5 selected backup/owner JSON under `docs/dev/evidence`; focused G10D matrix; current output, handoff and next prompt; historical/planning route and branch register. No production source, schema, dependency, generated mirror, selected save behavior, deployment, site/user data or `GAME_VERSION` changed. Raw password-gated archives and verifier records remain user-held outside the repository.

### B. Patch summary

The grown D3 source cloned the accepted selected G10D.1 8,732,446-byte graph with 127 artifacts, 124 descendant recoveries, three heads/run histories and one Soundings witness. Independent quota/abort clones proved descendant publication 1/2/4 rollback, descendant and first pending-consumer 1/2 exact-once completion, Soundings witness publication 1/3/5 and pending consumer 1/2, terminal publication 1/2/4 and settlement 1/2, settled two-address closure 1/4/8, account reset/delete 1/2 and address deletion 1/2/4. Every precommit fault preserved the prior 14-family graph after restart; accepted pending operations retained one immutable artifact/receipt and completed once. Mounted default App selected Quick Save publication and consumer faults displayed blocked/Retry without false success; full-page restart and Retry completed the exact pending publications. D3 and D4 pass within their injected-fault scopes.

D5 export read-fault rejected without partial download and left the source exact. Six independent import quota/abort cases at row writes 1/137/274 left an empty target after restart and allowed exact fourteen-family retry; occupied target refused. The selected Settings backup was 10,394,105 bytes (SHA-256 `9ac68d52dc9391a2d2d9146e67584a003295bd15adc00ca3dc1c4d4684eae94b`); isolated selected restore/sign-in, mixed-history load, restart, ordinary World fork Save and second backup passed. The 10,460,960-byte second backup (SHA-256 `0c320b565318521477461ebe279fabda54188edf6b8b0b12c0b743141fd70b13`) restored to a third origin with exact 14-family comparison, 136/136 original artifacts retained and exactly one new descendant/artifact. An independent owner-only growth accepted 920 more descendant saves, reached a valid 67,047,945-byte archive (SHA-256 `45a1c78a3ee2fb245fde5efd9b8327c83452a90ee8c8540bf4dba5499f99b9f6`, 60,919 bytes below cap) and restored all fourteen family digests, including 1,056 artifacts and two witnesses. Separate invalid padded 67,108,865-byte input rejected before writes with an empty target. D5-E2 passes; the padding is not counted as valid archive success or as D1/D2 selected capacity evidence.

At three origins, `estimate()` returned actual origin-wide usage/quota values, `persist()` was supported but returned `false`, and `persisted()` stayed `false`; exact before/after values are in `docs/dev/evidence/g10d2-fault-persistence-results-2026-10-17.md`. A private user-held archive restored at fresh origins after safe origin-loss simulation, with selected login/load/restart and exact graph readback. No actual involuntary eviction was observed; forcing browser disk pressure risks unrelated user data and manual clearing is not eviction. Older accepted capacity/epoch/G10 decisions require eviction posture and user-controlled recovery, but do not explicitly demand inducing involuntary eviction as a reproducible event. The fixed G10D matrix/current prompt still require the unobserved unsafe actual-eviction row to remain open pending explicit authority disposition. No legitimate selected operation failed or accepted graph changed, so no production repair was made.

### C. Tests or checks run

Browser owner runners: D3 `PASS_D3_OWNER_PARTIAL` plus witness `PASS_SOUNDINGS_FAULTS`; D4 `PASS_D4_T_L_PARTIAL` plus settled closure `PASS_TERMINAL_CLOSURE`; D5 `PASS_D5_OWNER_PARTIAL` plus `PASS_NEAR_64_MIB_CAP`, each with independent nonsecret evidence. Mounted selected Quick Save blocked/Retry/full-page restart, selected Settings download and two isolated picker restores/sign-ins/historical loads, second backup and exact family comparison all passed. Node-config UI typecheck PASS; app-local Vite build PASS (256 client modules, built `index-DRiJsDUZ.js` SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`); broad UI typecheck still has 137 baseline diagnostics, zero `g10d2-*` diagnostics, and is not green. Nonsecret JSON parsed, Python verifier helper compiled, generated bytecode removed. Final diff, branch and hosted publication checks are recorded after final push/readback. Applied FP-001/002/003/004/005/006/008/009/011/012/014/017/018/019: selected caller and blocked completion, independent graph/gate accounting, restart/same-source retry, no newer-head overwrite, witness/receipt provenance and unique durable evidence, actual ordinary branch reachability from G10D.1, destructive generation/complete-graph rollback, branch semantic hold and distinct source/final hosted identities.

### D. Risks / follow-up notes

D3–D5 pass within their fixed fault/size scopes; D6 actual browser eviction remains open, so G10D overall is unaccepted. The installed next prompt is only **DEV-0.7.1 Slice G10D.3 actual-eviction gate authority disposition**: decide whether the demonstrated missing-data fail-closed posture and off-browser exact recovery contract can settle the environmental limit without mislabeling a simulation or retroactively weakening the fixed row. Five non-default hosted branches and one local creator tracking ref retained their protected/held dispositions; zero open PRs; no branch disposition change, integration or deletion was due/performed. Suggested commit message: `test: record G10D fault and recovery boundaries`. G10E, activation, deployment, planned DEV/Game acceptance, `GAME_VERSION` change and held-branch integration remain blocked.

## 2026-10-16 DEV-0.7.1 Slice G10D.1 combined-graph acceptance reconciliation

Source: initially clean fetched local/hosted `master` `79af985dddbf047032462ecfdc8807e16f40bd4e`; authenticated repository `vagabond1215/Lineage_Reforged`. Date 2026-10-16; branch/status assumption `master`. Label class: support evidence slice under planned parent `DEV-0.7.1`; development milestone impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10B_SELECTED_CLIENT_PROVEN; SAVE_INTENT_CLASSIFIED_NO_REPAIR; G10C_BACKUP_RESTORE_ACCEPTED; G10D_D1_D2_SELECTED_PROVEN_ON_COMBINED_GRAPH; G10D_D3_D6_PROOF_REQUIRED; G10E_NOT_INSTALLED; ACTIVATION_HELD.** This section supersedes only the earlier G10D.1 D1/D2 reasoning below.

### A. Files changed

Test-only selected harness `apps/rpg-ui/g10d1-combined-20261016.html/.ts`; fixed pre-run checklist and complete nonsecret JSON in `docs/dev/evidence`; focused G10D matrix; current output, handoff and prompt; historical/planning route and branch register. No production code, schema, dependency, generated mirror, save intent, archive policy, deployment, site/user data or `GAME_VERSION` changed.

### B. Patch summary

Re-reading the G10D.1 prompt and fixed checklist found no accepted authority to combine `:5342` one-campaign/zero-witness capacity rows with `:5341` post-checkpoint gameplay branches. Both remain support, and the earlier D1/D2 PASS claim was premature. A fresh isolated `:5343` default-App graph contained three ordinary selected campaign histories **before baseline**: Marza's World/non-head Quick Save fork; Lysara's natural Stonevein HP-zero Normal-Stakes defeat and recovery with durable Chronicle; Faye's Starfall Soundings offer, four shifts and accepted turn-in with one witness and nine Chronicle entries. The same account then passed 120 further accepted descendant saves, 39 selected loads, 10 full-page restarts and two contexts. All 14 family counts/bytes/digests and whole archive bytes/digest, account/head/history/address IDs and storage readings are recorded at exact 0/20/40/60/80/100/120 in `docs/dev/evidence/g10d1-combined-selected-2026-10-16.json`. Baseline/120 archive bytes were 1,628,697/8,732,446; artifacts 7/127; descendant recoveries 4/124; account revision 8/128 and measured campaign head revision 3/123. Three runs, four addresses and one witness were retained at every row. No prune, quota fault, selected failure or graph drift occurred. D1/D2 are conclusively proven on this one combined graph; only G10D.2 D3–D6 is installed. No production repair.

### C. Tests or checks run

Selected default-App observations: ordinary World fork, Stonevein defeat/recovery to 26/104 HP, completed Soundings/5g reward, selected Save/restart/Load of both branches; final selected readbacks retained defeat Chronicle and completed Soundings/21g 8s/nine Chronicle entries. The measured run passed 120/120 accepted saves, 39 loads, 10 restarts, two same-origin contexts, seven exact complete checkpoints and post-block graph comparisons. Independent nonsecret ledger validation checked fourteen stable family names, baseline-plus-save descendant count, exact head/account revision increments, stable witness digest, three run records, and retained 7-to-127 artifacts. The ledger file SHA-256 is `03160b8548dcfbcadd471c8cf2dbb2b1bb924af1b4c0a2cf9ae25d3ed1c086ae`. Node-config typecheck PASS; app-local Vite build PASS (256 client modules; `index-DRiJsDUZ.js`); broad UI typecheck retains 137 baseline diagnostics and is not green. Diff, built-client/mirror and hosted publication checks are recorded at completion. Applicable failure patterns FP-001/002/003/005/008/009/011/014/017: selected caller, exact gate separation, acknowledged head readback, load/restart recovery, held-branch semantics, source/final hosted identity, retained graph provenance, correct history fields and ordinary reachability.

### D. Risks / follow-up notes

The observed archive grew 7,103,749 bytes over 120 saves. A linear 1,000-save illustration is about 60,826,605 bytes from this mixed baseline, below the 64 MiB input cap, but it is not a tested 1,000-save or quota guarantee. Browser origin usage estimates varied nonmonotonically and `persisted()=false` at every checkpoint does not prove eviction. D3–D6 and actual-eviction proof remain open. Five non-default hosted branches and one local tracking branch retained protected/held dispositions; repository-scoped GitHub search found zero open PRs. No branch disposition change, integration, deletion or PR action was due. Suggested commit message: `docs: reconcile G10D combined selected capacity proof`. Next installed run: only **G10D.2 D3–D6 fault and browser-persistence proof**. G10D overall, G10E, activation, deployment, planned DEV/Game acceptance, `GAME_VERSION` change and held-branch integration remain blocked.

## 2026-10-16 DEV-0.7.1 Slice G10D.1 selected mixed-branch and exact-checkpoint proof

Source: initially clean synchronized authenticated local/hosted `master` `40e02933e080ee975cd3efd15a11cb12bf532f73`; test-only and documentation files were untracked/edited only after orientation. Date 2026-10-16; branch/status assumption `master`. Label class: bounded evidence slice under planned parent `DEV-0.7.1`; development milestone impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10B_SELECTED_CLIENT_PROVEN; SAVE_INTENT_CLASSIFIED_NO_REPAIR; G10C_BACKUP_RESTORE_ACCEPTED; G10D_D1_D2_SELECTED_PROVEN; G10D_D3_D6_PROOF_REQUIRED; G10E_NOT_INSTALLED; ACTIVATION_HELD.** Fixed matrix and exact row ledger: `docs/design/dev-0.7.1-slice-g10d-long-run-capacity-quota-eviction-matrix.md` and `docs/dev/evidence/g10d1-selected-corrected-2026-10-16.json`.

Evidence checkpoint `c3afd8e7418cd62965ece81614ca48a8e5995f6b` was committed on `master`, pushed and independently fetched through the repository-scoped GitHub connector by resolving hosted `master` to that exact SHA. The hosted prompt file readback names only G10D.2. This handoff update is a later documentation commit; its final hosted SHA is reported in chat after publication.

### A. Files changed

Test-only mounted default-App two-context harness `apps/rpg-ui/g10d1-context-20261015.html`, `g10d1-selected-20261015.html/.ts`; fixed pre-run checklist; two fresh nonsecret evidence JSON files (the first has an explicitly invalid extra run-ID projection and is supporting only); focused G10D matrix; current output/handoff/prompt, historical/planning route and branch register. No production source, schema, dependency, generated mirror, save intent, archive policy, deployment, site/user data or `GAME_VERSION` changed.

### B. Patch summary

The first fresh selected `:5341` run completed 120 accepted descendant saves, 38 selected loads, 10 full-page restarts and two contexts, followed by ordinary selected World/non-head fork, Soundings offer/four shifts/turn-in/Save/restart/Load, natural Stonevein Normal-Stakes HP-zero/recovery/Save/restart/Load, four active run histories and Chronicle growth. Its test-only capture projected `runId` from a `characterId` record and wrote null for that extra identity. The capture was corrected and an independent new empty-origin `:5342` selected run repeated **all** 120 saves, 38 loads and 10 restarts with exact seven checkpoints, valid historical character and slot-generation IDs, complete 14-family bytes/digests and whole-archive bytes/digest. The corrected 120-save archive was 6,372,317 bytes with 121 immutable artifacts and no observed pruning or graph drift. D1/D2 pass within the fixed scope; D3–D6 remain separate open gates. No measured selected failure justified production repair. Only a separate G10D.2 D3–D6 proof prompt is installed.

### C. Tests or checks run

Mounted selected runs: 120/120 accepted saves each, 38 loads and 10 restarts each, two same-origin contexts, exact 0/20/40/60/80/100/120 family/head/address/history/account/storage rows; post-block selected load/restart graph comparisons PASS. Fresh ordinary branch readbacks are classified separately from the exact checkpoint graph. At corrected checkpoints archive bytes were 77,836 / 1,141,258 / 2,187,438 / 3,233,618 / 4,279,798 / 5,325,997 / 6,372,317; all 14 family row counts/serialized bytes/SHA-256 and whole digests are in the nonsecret JSON. `persisted()=false` at all corrected checkpoints; no eviction proof. Node-config UI typecheck PASS; app-local Vite build PASS (256 client modules, `index-DRiJsDUZ.js`, SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`); broad UI typecheck retains 137 baseline diagnostics, zero G10D.1-path diagnostics, so it is not green. Diff and publication checks are recorded at final commit/readback. FP-001/002/003/005/008/009/011/014/017 applied: actual default-App caller, exact gate separation, persisted selected completion, load/restart recovery, held-branch semantics, distinct source/final/hosted heads, accepted graph provenance, valid record-field identities and ordinary reachability rather than fixture substitution.

### D. Risks / follow-up notes

The corrected observed slope illustrates about 52,531,844 archive bytes at 1,000 saves, below the 67,108,864-byte G10C input cap; this is not a tested 1,000-save or quota guarantee. Origin-wide estimate readings varied nonmonotonically. D3 publication/consumer faults, D4 mixed-owner faults, D5 grown-source export/import faults and D6 persistence/actual eviction remain **OPEN**; prior owner probes and restores are support only. D1 lineage evidence is active run-history and Chronicle growth, not retirement or terminal succession. The five non-default hosted branches and one non-default local tracking branch retain protected/held dispositions; repository-scoped GitHub search returned zero open PRs. No branch disposition change, merge, deletion, integration or PR action was due/performed. Exact review triggers remain in the branch register. Suggested commit message: `docs: prove G10D selected checkpoints and route fault proof`. Next: **G10D.2 D3–D6 fault and browser-persistence proof only**. G10E, activation, deployment, planned DEV/Game acceptance, `GAME_VERSION` change and held-branch integration remain blocked.

## 2026-10-15 DEV-0.7.1 Slice G10D measured partial and bounded G10D.1 route

Source: clean fetched authenticated local/hosted `master` `28ce4b0b41f0a2b9bd4a5d962e34c53797e60ac2`; pre-probe matrix commit `1eef3dc4` pushed before the first G10D executable probe. Date 2026-10-15; branch/status assumption `master`, initially clean. Label class: bounded current-band evidence slice under planned parent `DEV-0.7.1`; development milestone impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10B_SELECTED_CLIENT_PROVEN; SAVE_INTENT_CLASSIFIED_NO_REPAIR; G10C_BACKUP_RESTORE_ACCEPTED; G10D_CAPACITY_MEASURED_PARTIAL; G10D_PROOF_REQUIRED; G10E_NOT_INSTALLED; ACTIVATION_HELD.** Complete fixed pre-edit matrix and row evidence: `docs/design/dev-0.7.1-slice-g10d-long-run-capacity-quota-eviction-matrix.md`.

### A. Files changed

Test-only disposable local-origin `apps/rpg-ui/g10d-metrics.html/.ts`; focused G10D matrix; current output/handoff/prompt, planning/historical route and branch register. No production source, schema, dependency, generated mirror, credential algorithm, save intent, archive policy, deployment, site/user data or `GAME_VERSION` changed.

### B. Patch summary

The matrix inventoried every one of the 14 epoch families and their graph links before production edits or browser probes. The metrics harness records nonsecret complete-family row counts/serialized bytes/digests, archive bytes/digest, account/head/address IDs and browser estimate/persistence posture; its separate button requests persistence on disposable origins. The selected 120-save workload measured 7,351,270 archive bytes from a 136,429-byte baseline, without observed pruning, false success or quota fault. A selected G10C backup restored at a fresh origin; genuine World growth from a restored non-head branch produced a 7,416,497-byte second selected backup, which restored and authenticated at a third empty origin. The first G10D proof blockers remain; only bounded G10D.1 selected mixed-branch/checkpoint proof is installed.

### C. Tests or checks run

Mounted default App: 120 accepted descendant saves, 24 loads, six restarts, two same-origin contexts, selected World action, stale writer refusal/Retry, retained Quick Save and Slot 1 non-head fork. Baseline, 20, 37, 60, 80, 100 and 120 full 14-family checkpoints plus incomplete 40-save bytes/count measurement; exact numbers and digests in focused matrix. Selected password-gated backup/import/login/ready history loads passed at fresh `5331`; second backup after one legitimate fork descendant imported and authenticated at fresh `5332`. All three disposable origins supported `navigator.storage.persist()` but denied it; `persisted()=false`. This is an origin-loss simulation, not actual browser eviction. Fresh supporting owner regressions: G10C archive 364 assertions, terminal 14/14, G10B.5 descendant 27 assertions. UI Node-config typecheck PASS; app-local Vite build PASS (256 client modules, `index-DRiJsDUZ.js`, SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`); broad UI typecheck retains 137 baseline diagnostics and zero new metrics-path diagnostics, so is not green. No edited JS mirror or tracked build output; diff checks PASS. FP-001/002/003/005/008/009/011/012/014/017/018/019 applied through selected caller, explicit supporting-vs-fresh gate accounting, stale writer, complete archive graph, generation-safe restore and exact source/build/hosted identities; remaining proof rows stay open.

### D. Risks / follow-up notes

D1 lacks fresh selected Soundings, Normal-Stakes and lineage/Chronicle branches. D2 missed the exact 40-save family bytes/digest/head/quota despite a complete 37-save off-checkpoint and later checkpoints. D3/D4 have fresh rerun regression support, not independent fixed-graph write-position proof; D5 lacks grown-source read-fault/size-boundary proof; D6 has denied persistence and no actual eviction. No measured durability defect justifies a production repair. The next route is **DEV-0.7.1 Slice G10D.1 Selected Mixed-Branch Capacity Checkpoint Proof**; G10E remains held. Five non-default hosted branches and two local branches retain protected/held dispositions; zero open PRs at final review, with no branch action or integration due. Exact review triggers remain in the branch register. Suggested commit message: `docs: record G10D capacity limits and route selected proof`. No deployment, activation, data clear, planned DEV/Game acceptance or held-branch integration.

## 2026-10-14 DEV-0.7.1 Slice G10C final acceptance and G10D route

Source: clean fetched local/hosted `master` `46f6b4e18e29b7fe4d68412c2910a468c21073ae`; implementation/evidence checkpoint `96ea4bc2845621c3b65a850c11d1293b289062c4` pushed and independently read back at hosted `master`. Date 2026-10-14; branch/status assumption `master`, initially clean and synchronized. Label class: bounded current-band implementation under planned parent `DEV-0.7.1`; development impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted DEV `DEV-0.7.0` unchanged. **G10B_SELECTED_CLIENT_PROVEN; SAVE_INTENT_CLASSIFIED_NO_REPAIR; G10C_BACKUP_RESTORE_ACCEPTED; G10D_ROUTE_INSTALLED_NOT_IMPLEMENTED; ACTIVATION_HELD.** Focused pre-edit matrix and final A1–A7 ledger: `docs/design/dev-0.7.1-slice-g10c-backup-restore-acceptance-matrix.md`.

### A. Files changed

Production `apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts`, selected `EpochApp.tsx`, account picker and Settings components; four test-only G10C QA files; focused matrix; current output/handoff/prompt, planning/historical route and branch register. No schema, dependency, generated mirror, credential algorithm, `GAME_VERSION`, deployment or site/user data edit.

### B. Patch summary

User-controlled portable v1 archive covers all 14 exact epoch families, including credential verifier records, immutable non-head/fork artifacts, pending recovery, Soundings witnesses and lifecycle/deletion receipts. Export is one consistent read transaction. Import caps input at 64 MiB, validates version, complete family/key/count/digest and destructive graph before mutation, rejects occupied targets, adds all rows in one transaction and verifies every family on committed readback. Selected controls warn of sensitive sign-in and game-state material; post-commit readback uncertainty is distinct from success. Separate G10D long-run capacity/quota/eviction **route only** is now installed.

### C. Tests or checks run

Fresh disposable owner browser **364 assertions PASS**, including the 57-row complete graph, corruption/version/missing/duplicate/unknown/forged/unsorted/oversized negatives and abort/quota rollback at every write position. Mounted selected default App passed six-account mixed-history import/login/load/restart for pending recovery, ordinary Soundings and natural Normal-Stakes defeat, non-head fork and a second selected backup after legitimate recovery growth. Two simultaneous selected imports at a fresh origin yielded one winner and one closed failure; 14/14 family counts/digests matched the source on winner export. A separate mounted post-commit readback interruption showed no false success, survived restart, refused occupied reimport, restored login and exported 14/14 matching family counts/digests. UI Node-config typecheck and app-local Vite build PASS; broad UI retains 137 baseline diagnostics, zero edited-path diagnostics, so it is not green. Built asset `index-DRiJsDUZ.js` SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE` contains the selected archive surface; edited JS mirrors absent; diff checks PASS. Applied FP-001/002/003/005/008/009/011/012/014/017/018/019 with actual selected caller, separate gate classification, pending/retry/failure boundaries, source/build/hosted readback, complete graph and destructive generation preflight.

### D. Risks / follow-up notes

Five non-default hosted branches, two local branches and zero open repository PRs inspected. Readiness/prompt-integrity remain `PROTECTED_REFERENCE`; administration/creator planning/creator implementation remain `HOLD_NAMED_CONSUMER`, with unchanged exact review triggers in the branch register. No disposition change, integration, deletion or PR action due/performed. The 64 MiB cap and SHA-256 checks are bounded G10C integrity measures, not a long-run capacity guarantee or signature against a coherent malicious rewrite. Suggested documentation commit message: `docs: accept G10C and install G10D capacity route`. Next run: **DEV-0.7.1 Slice G10D Long-Run Capacity, Quota And Eviction Posture**. No G10D implementation, deployment, activation, data clear, planned DEV/Game acceptance or held-branch integration. Final handoff publication head is verified after this documentation push.

## 2026-10-14 DEV-0.7.1 Slice G10C archive implementation and bounded proof

Source: clean fetched local/hosted `master` `46f6b4e18e29b7fe4d68412c2910a468c21073ae`. Date 2026-10-14; branch/status assumption `master`, initially clean; no unrelated work overwritten. Label class: bounded current-band implementation under planned parent `DEV-0.7.1`; development impact `supports_current_band`, game-version impact `none`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted DEV `DEV-0.7.0` unchanged. **G10B_SELECTED_CLIENT_PROVEN; SAVE_INTENT_CLASSIFIED_NO_REPAIR; G10C_OWNER_BOUNDARY_PROVEN; G10C_SELECTED_RICH_HISTORY_PROVEN; G10C_IMPORT_RACE_AND_LOST_READBACK_OPEN; G10D_NOT_INSTALLED; ACTIVATION_HELD.** Focused pre-edit matrix and row disposition: `docs/design/dev-0.7.1-slice-g10c-backup-restore-acceptance-matrix.md`.

### A. Files changed

Production: `cleanEpochAccountStore.ts`, selected `EpochApp.tsx`, account picker and Settings components. Test-only: `g10c-archive-owner-qa.html/.ts`. Focused matrix and current output/handoff/prompt, historical/planning route and branch register. No schema, credential algorithm, JS mirror, dependency, authored content, deployment, site/user data or `GAME_VERSION` edit.

### B. Patch summary

One user-controlled versioned JSON archive covers all 14 exact epoch stores and account verifier records in a consistent read transaction. Manifest includes schema/source identity, counts and SHA-256 digests. Import caps 64 MiB, rejects noncanonical keys/families, duplicate rows, unsupported values and inconsistent graph links before mutation; one write transaction fences all target stores empty, adds all rows, then verifies each family digest on readback. Selected Settings download verifies the current password; picker import requires an empty epoch. Both controls warn that the file contains sensitive sign-in and game-state data. Committed-but-unverified restore has a distinct closed message. No credential material enters notices/errors/logs. A combined-graph probe discovered and drove the canonical key-order preflight repair.

### C. Tests or checks run

Fresh disposable owner browser **208 assertions PASS**, including combined witness/terminal/deletion/lifecycle graph, restored pending completion, ordinary Soundings, natural Normal-Stakes HP-zero recovery, non-head fork, second backup, forged links, size/version/corruption/unknown/duplicate/unsorted rejection, occupied and lost-acknowledgement restart, and every row-position abort/quota rollback. Selected default-App synthetic local-origin export/import/login/ready load and second backup passed across ports 5317/5318/5319; occupied reimport refused. A separate mounted selected port-5320 mixed-history import showed six accounts, restored Soundings completion and 5g reward, genuine Normal-Stakes defeat Chronicle and HP 33/132, restored pending completion across restart, and a ready quick-save fork beside Slot 1. Second selected backup grew from 2,091,390 to 2,095,051 bytes; nonsecret manifest inspection showed the pending account revision 1→2 and recovery `accepted_pending_consumers`→`consumers_completed` with five first-recovery rows preserved. UI Node-config typecheck PASS; app-local Vite build PASS (256 client modules, `index-DRiJsDUZ.js`, SHA-256 `C95D70960DF7F26B6EB53B1A4C90D15C657E4B8F9B52677545CE4084DA6B44AE`); broad UI typecheck retains **137 baseline diagnostics**, zero edited-path diagnostics, not green. JS mirrors absent for edited paths; built-client archive and selected UI strings present. `git diff --check` PASS. Applied FP-001/002/003/005/008/009/011/012/014/017/018/019: real selected caller, explicit gate separation, pending completion, lost-ack restart, branch isolation, exact source/build/hosted identity, full graph provenance and generation/erasure preflight. Selected race and lost-readback FP-001/005 closure remains open.

### D. Risks / follow-up notes

Five hosted non-default branches, two local branches and zero open repository PRs inspected. Readiness/prompt-integrity remain `PROTECTED_REFERENCE`; administration/creator planning/creator implementation remain `HOLD_NAMED_CONSUMER`, with unchanged exact triggers in branch register. No disposition change, integration, deletion or PR action was due/performed. A3 selected competing-import race and A6 mounted lost-readback presentation are open; therefore G10C is not accepted and G10D is not installed. Suggested commit message: `feat: add atomic complete-epoch backup and restore`. Next run: bounded `DEV-0.7.1 Slice G10C Selected Import Race And Lost-Readback Completion`, then G10D only if its remaining row ledger passes. No deployment, activation, data clear, planned DEV/Game acceptance or held-branch integration. Evidence and final hosted publication heads will be appended after push/readback.

## 2026-10-14 DEV-0.7.1 Slice G10B.5 independent selected-client acceptance

Source: clean fetched local/hosted `master` `af5f41f4f559426ab42cc7e62dcb66fba83c3de7`. Fresh matrix was committed with test-only evidence as `b0a3775eb76f7ecfd122958e6556d9fb77b7a915`, pushed and independently read back from hosted `master`; final handoff head is checked separately. Date 2026-10-14; branch/status assumption `master`, no unrelated work overwritten. Label class: unversioned independent acceptance audit under planned parent `DEV-0.7.1`; development impact `supports_current_band`, game-version impact `none`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted DEV `DEV-0.7.0` unchanged. **G10B_SELECTED_CLIENT_PROVEN; SAVE_INTENT_CLASSIFIED_NO_REPAIR; G10C_ROUTE_INSTALLED_NOT_IMPLEMENTED; ACTIVATION_HELD.** Fixed pre-probe matrix and row-by-row IDs: `docs/design/dev-0.7.1-slice-g10b-5-independent-selected-client-acceptance-audit.md`.

### A. Files changed

Added twelve `apps/rpg-ui/g10b5-*` test-only selected App and unique owner probe files plus focused audit. Updated current output, handoff, prompt, planning/historical route and branch register. No production source, schema, dependency, authored content, generated asset, deployment, site/user data or `GAME_VERSION` changed.

### B. Patch summary

The entire L/P/F/S/D/H/R/V matrix was authored before the first G10B.5 probe. Fresh two-context selected 20/20 proved one post-commit lost-acknowledgement head, actual `Retry campaign data`/restart exact readback, stale contender fencing, pre-submit failure and later deliberate same-content/changed-intent Saves as new commands. Fresh selected pending first/descendant completion retained exact artifacts; owner pending negatives 21/21, isolated lifecycle 12/12 and owner encounter/fault negatives 27/27 passed. The user-approved reset affected only the disposable matrix account; a stale selected tab's Save was generation-fenced and Retry/restart showed empty. Ordinary selected Selene completed Soundings offer/acceptance/four shifts/turn-in/Save/restart with one witness and one 5g credit. Ordinary selected Rowan found a natural Stonevein candidate after no-match, admitted it, used legal combat commands, reached genuine HP zero, recovered to 33/132 and retained the exact Normal-Stakes receipt through Save/restart. Selected non-head Quick Save fork preserved newer Slot 1, Stonevein Slot 2 and all seven historical artifacts; the three distinct heads were loaded after separate restarts. Representative mixed graph reached 9,980,678 pessimistic JSON UTF-16 bytes, one Soundings witness and 31 encounter command receipts without pruning or quota failure. This does not accept G10D long-run/eviction. G10B.1 synthetic heir 31/31 is regression only. No same unresolved Save intent duplicated authority, so no request-ID machinery.

### C. Tests or checks run

Selected 20/20, owner lifecycle 12/12, pending negatives 21/21, encounter/fault negatives 27/27, heir regression 31/31; seven focused Node suites 126/126; UI Node-config typecheck PASS; app-local Vite build PASS (256 client modules, `index-CUOgjCgu.js`, SHA-256 `ABB032137F3653E7A400ABC4519DDD284A88352D1A33B3402339CE7FABFE58E9`). Broad UI typecheck retains 137 baseline diagnostics, zero new G10B.5 paths, **not green**. JS mirrors/export, built-client old-prefix absence and staged `git diff --check` PASS. Exact IDs and driver corrections are in the focused audit. FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018/019 applied: real selected caller, fail-closed pending/fault/retry, exact provenance/duplicates, no synthetic reachability inference, complete generation reset, retained graph and distinct source/evidence/final heads.

### D. Risks / follow-up notes

Five hosted non-default branches, two local branches and zero open repository PRs inspected. Readiness/prompt-integrity remain `PROTECTED_REFERENCE`; administration/creator planning/creator implementation remain `HOLD_NAMED_CONSUMER` with triggers in the branch register. No disposition change, integration, merge, rebase, deletion or PR action was due/performed. G10B proof is bounded to the fixed matrix; it does not prove ordinary heir eligibility, G10C backup/restore, G10D long-run quota/eviction, activation or parent acceptance. Suggested handoff commit: `docs: install G10C backup restore route after G10B proof`. Next: separate G10C route only. G10C implementation in this audit, G10D, deployment, activation, site/user data clearing, planned DEV/Game acceptance and held-branch integration stay blocked.

## 2026-10-12 DEV-0.7.1 Slice G10B.4 authored Normal-Stakes reachability

Source: initially clean, fetched local/hosted `master` `3045963ec2b2ac988ff2f19e3beea4d98b8535e5`. Focused source/evidence checkpoint `7e4e94f02f08f9a41a74cdd6f110b390b53fd279` was pushed and independently read back from hosted `master`; final handoff head is checked separately. Date 2026-10-12; branch/status assumption `master`, no unrelated work overwritten. Label class: bounded unversioned executable support slice under planned parent `DEV-0.7.1`; development impact `supports_current_band`, game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10B4_ORDINARY_NORMAL_STAKES_REACHABILITY_VERIFIED; G10B_SELECTED_CLIENT_NOT_PROVEN; G10C_NOT_INSTALLED; ACTIVATION_HELD.** Focused pre-probe matrix, capacity decision and row evidence: `docs/design/dev-0.7.1-slice-g10b-4-capacity-and-reachability-record.md`.

### A. Files changed

Production: selected `WorldPanel` and `GameSessionContext`, game-engine encounter owner, combat legal-command/static-content dependencies and campaign-session guard, shared optional encounter ledger type with two exact JavaScript mirrors. Test-only: two browser capacity/persistence pages and two Node probes. Focused evidence, current output/handoff/prompt, planning/historical route and branch register. No authored world content, dependency, generated asset, deployment, site/user data, `GAME_VERSION` or held branch changed.

### B. Patch summary

Preimplementation gate: 24 ordinary Stonevein action/publication cycles, nine natural candidates, 25 exact retained heads, fault abort and restart passed **107/107** in a unique disposable browser database; separate engine candidate-size projection recorded 27,778-byte maximum encounter. The narrow browser-safe combat loader and candidate admission/command/outcome caller then bound exact authored context, source candidate, campaign revision and retained request identity. Selected World controls admit one natural encounter, offer legal attacks and explicit combat beats, and present generic foe tokens. Existing engine AI/damage and Normal-Stakes owner resolve HP-zero without fabricated rewards. Actual selected creator → two no-match actions → natural candidate → three foes → legal melee/30 further beats → one recovered defeat → Save/reload was observed with HP 33/132 and one retained Chronicle event. G10B.3 `SAVE_INTENT_CLASSIFIED_NO_REPAIR` remains unchanged; no save request-ID machinery. Focused owner/engine negative, restart, fault and history probes are supporting reachability evidence only. A separate **G10B.5 fresh matrix-first independent selected-client re-audit** is installed; G10B is not accepted.

### C. Tests or checks run

Actual selected UI creator/action/combat/Save/restart PASS. Latest ordinary Node probe **61 assertions**, including negative origin, stale/conflicting/unknown/wrong actor/target, duplicate and HP-zero recovery. Latest disposable browser epoch owner **117 assertions**: three naturally selected defeats, nine actions/six no-match, 19 publications, active and legal-command restart duplicate, 49 command receipts, three historical exact reads and faulted publication retaining prior head/account; larger earlier runs reached 29 publications and 51,658 UTF-16 authority bytes. Bounded capacity inequality remains over 5.35 billion bytes below half the browser-estimated quota after pessimistic actual-size substitution; G10D long-run capacity remains unproven. Focused nearby/combat/campaign Node **174/174**, UI Node-config typecheck PASS, app-local Vite build PASS (256 client modules, `index-CUOgjCgu.js`, SHA-256 `ABB032137F3653E7A400ABC4519DDD284A88352D1A33B3402339CE7FABFE58E9`); old auth/save prefixes absent. Broad UI typecheck **137 existing diagnostics**, zero new changed-path diagnostics, not green. JS mirrors/export and staged `git diff --check` PASS. No content lint was needed because authored content did not change. FP-001/002/003/005/008/009/011/012/014/015/017 applied with selected caller, fail-closed receipt/source/failure, capacity and held-branch evidence in the focused record.

### D. Risks / follow-up notes

Five hosted non-default branches and zero open repository PRs inspected. Readiness/prompt-integrity remain `PROTECTED_REFERENCE`; administration/creator planning/creator implementation remain `HOLD_NAMED_CONSUMER` with their registered exact review triggers. No disposition change, integration, merge, rebase, deletion or PR action was due/performed. The representative three-defeat growth is bounded, and G10B.1/2/3/4 evidence cannot be counted as fresh G10B.5 completion. Suggested handoff commit: `docs: install independent G10B selected-client re-audit`. Next: G10B.5 only. G10C/G10D, deployment, activation, data clear, planned DEV/Game acceptance and held-branch integration remain blocked.

## 2026-10-12 DEV-0.7.1 Slice G10B.3 selected Save classification

Evidence commit `b254233a90906f302e6a16c5ec1e72f822f7585f` was pushed and independently read back from hosted `master`; the final handoff-annotation head is checked separately.

Source: clean synchronized local/hosted `master` `65abab40991870746ac18133dda71c4af065bc47`. Date 2026-10-12; branch/status assumption: `master`, initially clean; no unrelated work overwritten. Label class: unversioned executable support investigation under planned parent `DEV-0.7.1`; development impact `supports_current_band`, game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10B_3_SAVE_INTENT_CLASSIFIED_NO_REPAIR; G10B_SELECTED_CLIENT_NOT_PROVEN; G10C_NOT_INSTALLED; ACTIVATION_HELD.** Focused pre-probe matrix and exact IDs: `docs/design/dev-0.7.1-slice-g10b-3-reproduce-and-classify-decision.md`.

### A. Files changed

Added six development-local `apps/rpg-ui/g10b3-*` selected-UI and isolated generation probe files and the focused decision. Updated current output, handoff, prompt, planning/historical routes and branch register. No production source, schema, dependency, generated asset, deployment, site/user data or `GAME_VERSION` changed.

### B. Patch summary and decision

Mounted default-App two-context **16/16**: pre-submit failure left owner fixed; post-commit lost acknowledgement produced exactly one head; both `Retry campaign data` actions and restart reread it without publication; stale contender Save blocked. A later explicit same-content `Save` with `All Changes Saved` produced one *new intent* and head at the same tick; an accepted shift followed by explicit Save produced one later head at tick 2. Accepted G8C authority directs lost callers to resume by publication/recovery identity. Thus G10B.2 L1's duplicate-intent inference is superseded, and no production request-ID repair is warranted. Isolated unique-database lifecycle-generation/revision harness **14/14** fenced old session/hint/Save after a synthetic reset, with no target resurrection or unrelated-account mutation; it is not selected acceptance. Current World action only creates a candidate, so ordinary selected HP-zero combat/Normal-Stakes remains unreachable. The smallest separately owned route is bounded Stonevein candidate admission/legal combat/outcome/recovery with capacity preflight, followed by a **new matrix-first independent G10B re-audit** with representative ordinary history growth. G10B is not accepted.

### C. Tests or checks run

Selected browser 16/16; isolated generation browser 14/14; focused Node campaign/Soundings/survey **103/103**; UI Node-config typecheck **PASS**; app-local Vite production build **PASS** (244 client modules, selected asset `index-CyVGQ0Rd.js`); broad UI typecheck **137 existing diagnostics**, zero in G10B.3 probe files, not green. `git diff --check`, build identity inspection and exact hosted readback are final publication gates. Applied FP-001/002/003/008/009/011/012/017: real selected Retry and owner IDs, no parent acceptance from focused pass, explicit unreachable defeat, held branch semantics, source/published head separation, stale authority and genuine duplicate evidence, and ordinary reachability distinct from synthetic fixtures.

### D. Risks / follow-up notes

Five hosted non-default branches inspected; protected readiness/prompt-integrity and held administration/creator planning/creator implementation dispositions unchanged. Repository-scoped GitHub search found zero open PRs. No branch action was due or performed; exact review triggers remain in the branch register. Suggested commit message: `docs: classify G10B.3 selected Save intent and hold defeat route`. Next route: **G10B.4 authored Normal-Stakes reachability gate**, then a separate fresh G10B completion re-audit. G10C/G10D, deployment, activation, data clear, planned-primary/Game-version acceptance and held-branch integration stay blocked.

## 2026-10-12 DEV-0.7.1 Slice G10B.2 independent selected-client proof

Source: clean fetched local/hosted `master` `232b97cee0a14cdc6dc07c63fa874a50b97c3502`. Evidence commit `0f5f07f325b598ff9b0d542d8f9ce4802cb43200` was pushed and independently read back at hosted `master`. Label class: unversioned executable gate under planned parent `DEV-0.7.1`; development impact `supports_current_band`; game-version impact `none`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted DEV `DEV-0.7.0`. Date 2026-10-12; branch/status assumption: `master`, initially clean and synchronized, held branches untouched. **G10B_SELECTED_CLIENT_NOT_PROVEN; G10B_REPAIR_AND_REACHABILITY_ROUTE_REQUIRED; G10C_NOT_INSTALLED; ACTIVATION_HELD.** Detailed row matrix and exact IDs: `docs/design/dev-0.7.1-slice-g10b-2-independent-selected-client-proof.md`.

### A. Files changed

Added six disposable development-local selected App/owner probe files under `apps/rpg-ui/g10b2-*` and the focused independent evidence decision. Updated current output, handoff, prompt, planning/historical route and branch register. No production source, schema, dependency, generated asset, Game version, deployment or user/site data was changed.

### B. Patch summary and decision

P1 first/descendant selected pending completion **PASS** in two contexts. S1 ordinary selected Soundings offer/accept/four shifts/turn-in/save/restart **PASS** with one applied witness, one 5g credit, quest/activity/notification/Chronicle and later fork all read back. C1 creator regression **PASS 31/31**, synthetic eligibility only. L1 **FAIL**: genuine post-commit lost acknowledgement and selected Retry/restart read the exact revision-3 head, but unchanged Save after restart minted distinct revision-4 artifact/publication; selected exact same-intent replay identity is not established. F1 **INCOMPLETE**: stale revision contender blocked; automatic approval review rejected the selected stale-generation Save after a disposable reset because it might recreate campaign data, and it was not retried. D1 **INCOMPLETE/unreachable**: selected authored gameplay has no observed HP-zero Normal-Stakes emitter; no fixture was substituted. H1 **INCOMPLETE**: a four-artifact non-head fork preserved one witness/payment and nine Chronicle/notification rows through 16 ticks, but representative defeat/lineage and longer growth cannot be claimed. The evidence matrix was written during the first ordinary probe rather than before all probes, so it cannot support a fully prewritten-matrix claim.

### C. Tests or checks run

Fresh two-context mounted default-App harness: **19 supporting assertions**, with an explicit L1 FAIL gate; fresh creator regression **31/31**; focused campaign/Soundings/survey Node **172/172**; UI Node-config typecheck **PASS**; app-local Vite production build **PASS** (244 client modules), emitted selected `index-CyVGQ0Rd.js` SHA-256 `DA3684F179A0AB3BA5D4820D0CDB83748E9E47FDD19A45D361B9FFDCCE0E76D1`, old auth/account/save/attempt prefixes absent. Broad UI typecheck remains **137 baseline diagnostics**, none in new files; not a green gate. Full diff and `git diff --check` are publication gates. Failure-pattern IDs applied: FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018/019, with row-specific evidence and limits in the focused decision.

### D. Risks / follow-up notes

Five hosted non-default branches were re-inventoried; protected readiness/prompt-integrity and held administration/creator planning/creator implementation dispositions unchanged. GitHub repository-scoped search found zero open PRs. No merge, rebase, deletion, integration or PR action was due. Suggested commit message: `docs: record held G10B.2 selected-client proof`. Next route: `DEV-0.7.1 Slice G10B.3 — Selected Save Request Identity Repair`, followed by a separate fresh G10B re-audit and an accepted ordinary defeat reachability route; G10C, G10D, planned-primary acceptance, deployment and Game-version change remain held. Evidence commit is recorded above; final hosted handoff head is reported after publication.

## 2026-10-10 DEV-0.7.1 Slice G10B.1 selected creator repair

Source and implementation start: clean local/hosted `master` `d4bbddf96293b4e45093b4edb3b4ce4610dc109b`; repair commit `46c3a3e637e65e39cc1014348733e9361b34a71e` pushed and independently read back from hosted `master`. Planned parent `DEV-0.7.1`; label class: bounded unversioned repair slice; development impact `supports_current_band`; Game-version impact `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. Decision **G10B_1_REPAIR_VERIFIED; G10B_COMPLETION_PROOF_REQUIRED; G10C_NOT_INSTALLED; ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g10b-1-selected-creator-repair-record.md`.

### A. Files changed

Production `apps/rpg-ui/src/EpochApp.tsx`; mounted default-App `apps/rpg-ui/g10b-heir-selected-repro-20261009.tsx`; focused repair record; current output, handoff, prompt, planning/historical route and branch register. No schema, retirement, inheritance-grant, creator design, dependency, generated asset, deployment, site-data or `GAME_VERSION` change.

### B. Patch summary

The corrected pre-edit repro reached creator Finalize and failed with a synthetic eligible retired source retained by production account CAS but absent from the selected creator. `EpochApp` now passes `resolveEligibleHeirSources(current.accountProfile)` through the existing creator prop. Eligibility policy and epoch account authority stay intact. The repaired mounted default App passed **31/31** for eligible presentation, exact selected source and accepted slot-2 `sourceRunId`, zero-use/archived exclusion, pre-action no-write, restart/readback and unrelated-account stability. The fixture is synthetic; ordinary retirement still archives with zero uses. A separate independent G10B completion proof is installed in the current prompt for remaining lost-save/pending/account-generation and ordinary Soundings/Normal-defeat/history rows; no G10B acceptance follows from this repair.

### C. Tests or checks run

Pre-edit selected Finalize failure reproduced on disposable origin. Repaired mounted default App **31/31**; adjacent fresh-origin two-context selected App **15/15**. Focused campaign/Soundings/survey Node **172/172**; UI Node-config typecheck **PASS**; app-local Vite build **PASS**, 244 client modules, `index-CyVGQ0Rd.js`; built HTML/asset epoch identity present and old auth/account/save/attempt/legacy-copy strings absent. Broad UI typecheck **137 existing diagnostics**, zero in changed `EpochApp.tsx`; not green. Staged diff check **PASS**; repair commit hosted readback **PASS**. A sandboxed build first hit `realpath EPERM` and passed under filesystem escalation. An adjacent harness run on the heir fixture's origin failed its fresh-account assumption; fresh port 5283 passed. No existing site data was cleared.

### D. Risks / follow-up notes

FP-001/017: actual Finalize and synthetic/ordinary distinction; FP-002: no G10B/parent acceptance; FP-003/004/005/006: bounded two-context retry evidence; FP-008/009: five held refs and exact hosted readback; FP-011/012/013/014/015 and FP-018/019: existing owner/history/destructive limits remain separate. Two local and six hosted refs including master, zero open PRs. Readiness/prompt-integrity `PROTECTED_REFERENCE`; administration/creator planning/creator implementation `HOLD_NAMED_CONSUMER`, triggers unchanged. No branch disposition change, integration, deletion or PR action due/performed. Suggested repair commit: `fix(creator): present eligible epoch heir sources` (committed). Next: **DEV-0.7.1 Slice G10B.2 independent selected-client completion proof**. G10C, deployment and Game-version decision remain held. Final handoff publication/readback is a separate identity.

## 2026-10-09 DEV-0.7.1 Slice G10B selected-client and two-context gate

Source **DEV-0.7.1 Slice G10B**, unversioned executable gate under planned parent `DEV-0.7.1`; initial clean fetched local/hosted `master` `ffadd05448fa8f49724a3d4a3727d5da2ef98ad9`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Decision **G10B_REPAIR_REQUIRED; G10C_NOT_INSTALLED; ACTIVATION_HELD**. Focused row ledger: `docs/design/dev-0.7.1-slice-g10b-selected-client-two-context-evidence-and-repair-decision.md`. Evidence commit `a90e12d156cbaa814e1f9a5f8f8af0e56ffb5f1f` was pushed and independently read back from hosted `master`; the final handoff-annotation head is checked separately.

### A. Files changed

Test-only two-context and selected-heir browser harnesses under `apps/rpg-ui/g10b-*`, focused G10B evidence/decision, current output/handoff/prompt, planning/historical route and branch register. No production code, schema, dependency, generated asset, deployment, site-data or `GAME_VERSION` edit.

### B. Patch summary

Fresh exact-source build emitted the same selected epoch client before and after the test-only pages. A fresh disposable same-origin two-frame default-App run passed **15/15** for ordinary registration/creator/first campaign, manual and quick save, second-context stale head block/Retry, quota and aborted publication block/Retry with both accepted addresses fixed, old localStorage and old IndexedDB writer isolation, restart, and another-account epoch byte stability. Mounted selected G9 regressions independently passed Legacy/terminal/address/account, Normal-defeat fixture, witnessed Soundings fixture and exact lost-acknowledgement deletion retry. **F1 reproduced:** production resolver finds one synthetically eligible retired source, but mounted default App creator has no Heir Start because selected `EpochApp` passes `eligibleHeirSources={[]}`. Ordinary terminal retirement archives its run with zero inheritance uses, so the fixture is not ordinary lineage reachability. Selected ordinary Soundings completion, HP-zero Normal defeat, two-context lost-save/pending/account-generation and exact selected history growth are not closed by supporting suites. Install only **G10B.1 selected creator eligible-source presentation repair**, followed by independent G10B completion proof; do not advance G10C.

### C. Tests or checks run

Fresh fetch/prune, exact SHA/readback, clean initial tree, zero open repository PRs, five non-default branch merge bases/commits/paths. App-local Vite build twice **PASS**, 244 modules, identical `index-wcwuW0xv.js`; built old auth/accounts/save/attempt prefix check absent. Native browser: new G10B two-context **15/15**, selected eligible-source **REPRO**; retained selected **50/50**, **10/10**, **44/44**, **39/39**; supporting graph/owner/witness/defeat/descendant **157/157**, **43/43**, **391/391**, **132/132**, **16/16**. Unavailable/blocked-open App views displayed blocked/Retry. Focused Node campaign/Soundings/survey **172/172**; UI Node-config typecheck **PASS**. Focused TS probe found no new G10B harness diagnostics; transitive UI source diagnostics are baseline, so no broad UI green claim. Staged `git diff --check` and evidence-commit hosted readback **PASS**; final annotation readback is separate. The earlier disposable harness attempts at ports 5277 and 5279 failed test assumptions and were corrected; no data clear occurred.

### D. Risks / follow-up notes

FP-001/017 (actual caller and synthetic eligibility distinction) exposed F1; FP-002 withholds gate/parent acceptance; FP-003/004/005/006 bound fault, retry and contention claims; FP-008/009 govern branch and final head; FP-011/012/013/014/015 and FP-018/019 limit witnessed/history and destructive conclusions to observed cases. Branches/PRs: two local/six hosted refs including master, zero open PRs; readiness/prompt-integrity `PROTECTED_REFERENCE`, administration/creator planning/creator implementation `HOLD_NAMED_CONSUMER`, triggers unchanged. No disposition change, integration, deletion or PR action was due/performed. Suggested commit: `test(audit): record G10B selected-client repair gate`. Next: **DEV-0.7.1 Slice G10B.1** only. No Game-version decision proposed.

## 2026-10-09 DEV-0.7.1 Slice G10A coordinated activation entry decision

Source **DEV-0.7.1 Slice G10A**, docs-first decision under planned parent `DEV-0.7.1`; initial clean `master` and fetched `origin/master` both `31e8a0d9560692e24c516c1cd71c614532d3b94b`. Decision commit `3c575a631a9ebb4bd034a468f495277d20a7d799` was pushed and independently read back from hosted `master`; the final handoff-annotation head is checked separately. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Label class: unversioned coordination decision using a slice identifier; development milestone impact `supports_current_band`, Game-version impact `none`. Decision **G10_ENTRY_SEQUENCE_DEFINED; ACTIVATION_AND_POST_EPOCH_DURABILITY_HELD**. Focused authority: `docs/design/dev-0.7.1-slice-g10a-coordinated-activation-entry-decision.md`.

### A. Files changed

Focused G10A decision, current prompt/output/handoff, planning/historical route and branch register only. No production code, schema, dependency, tracked built output, deployment, site data or `GAME_VERSION` change.

### B. Patch summary

The selected boot chain is `main.tsx` → `App` default → `EpochApp`; retained `LegacyApp` and old localStorage owners are source references. The selected App routes account/creator/load/manual/quick save, Normal defeat, Soundings, Legacy, terminal, address and account lifecycle through epoch adapters and `lineage.campaigns.epoch1` v7. Its localStorage writes are limited to the epoch session hint and theme/time preferences. Fresh built-client inspection found the epoch database/hint and no old auth/account/save/attempt prefix; inactive legacy UI wording remains bundled. Same-origin old tabs can still write obsolete keys, so cutover needs exact origin/profile and tab preflight. No selected backup/restore or storage-estimate/persistence handling exists. Genuine two-context, ordinary lineage/Soundings/non-head long-run growth, dynamic quota/eviction and verified user backup/restore are unproven. Install only **G10B development-local selected-client and two-context proof**, followed by G10C backup/restore, G10D long-run capacity/eviction, G10E independent durability readiness and a separate operational cutover.

### C. Tests or checks run

Fresh `git fetch --prune origin`; `HEAD == origin/master == 31e8a0d9`, independently confirmed by hosted `git ls-remote`; clean initial tree and `GAME_VERSION` readback. Selected source/import/storage search and exact old-writer prefix comparison; app-local Vite build **PASS** (244 modules, `index-wcwuW0xv.js`) after a sandbox-only dependency `realpath EPERM` retry outside the sandbox. Built HTML/JS string and localStorage context inspection. Repository-scoped GitHub search found zero open PRs. `git diff --check` passed. No native-browser G10 action, long-run workload, quota/eviction test, backup/restore, deployment or broad typecheck ran; G9 counts are prior evidence only. Final hosted readback is a completion gate.

### D. Risks / follow-up notes

Applicable FP-001/017, FP-002, FP-003/004/005/006, FP-008/009, FP-011/012/013/014/015 and FP-018/019 set the actual-caller, reachability, held-parent, fail-closed/retry, source/branch and complete-history/destructive graph gates for G10B-D; G10A makes no executable acceptance claim. Two local/six hosted refs including master were inspected; readiness/prompt-integrity remain protected and administration/creator planning/creator implementation retain named consumers and exact triggers in the branch register. No disposition change, integration, merge, rebase, deletion or PR action was due/performed. Suggested commit: `docs(decision): define G10 activation and durability gates`. Next run: **DEV-0.7.1 Slice G10B**. No separate Game-version decision proposed.

## 2026-10-08 DEV-0.7.1.13 residual G9 evidence completion and parent acceptance

Source **DEV-0.7.1.13**, support suffix of planned parent `DEV-0.7.1`; initial clean `master`, fetched `origin/master` and independently hosted `master` all `3e72e6c1d14571602c43f2cd0861d7d4bb778028`. Focused acceptance evidence commit `fb8e2c6743893e647142771a9f8a9ee874990c5c` was pushed and independently read back from hosted `master`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Development impact `supports_current_band`; Game-version impact `none`. Decision **G9_PARENT_ACCEPTED**; no planned-primary, G10 implementation, deployment or Game-version acceptance. Exact matrix: `docs/design/dev-0.7.1.13-g9-residual-evidence-completion-audit.md`.

### A. Files changed

Eight independently authored residual native browser entrypoints and scripts (`apps/rpg-ui/g9-residual-{owner,selected,defeat-selected,inheritance,graphs,lifecycle,witness-selected,intent-selected}-20261008`), focused acceptance audit, current output/handoff/prompt, planning/historical route and branch register. No production owner/adapter/App, schema, dependency, tracked generated output, G10 implementation, deployment or Game-version source edit.

### B. Patch summary

The residual matrix was saved before probes and only DEV-.12 `INCOMPLETE` cells were closed. New production owner/adapter and actual mounted selected `EpochApp` probes passed **374/374** independent assertions: accepted-pending first account fence; selected Normal-defeat blocked/Retry/ready; selected Legacy preparation, retirement, address deletion, reset and fully witnessed delete; positive terminal payout/newer-head refusal; one-use synthetic eligible retired-source inheritance; paired six-shape corrupt/coherent reset/delete; old persisted hint/tab/session/prepared reentry; lost reset/delete receipt readback, malformed/legacy/v2 tombstones, fresh same-ID registration refusal; picker/Settings wrong/stale/changed request behavior and all-family other-account bytes. DEV-.12's exact witnessed/fault/restart scope remains **937/937**, rerun here as regression. Final G9A–F/F1–F9 matrix is all `PASS`; no production defect was found. Install **separate docs-first G10A activation entry decision**, not activation.

### C. Tests and checks run

`npm --prefix apps/rpg-ui run dev -- --host 127.0.0.1 --port 5173`; native Chromium `#audit` on eight new residual URLs **43 + 50 + 10 + 11 + 157 + 39 + 44 + 20 = 374/374**. Six preserved DEV-.12 URL/modes **391 + 132 + 177 + 162 + 36 + 39 = 937/937** separately. Supporting nine G9 browser URLs **176/176** (8 Normal defeat, 13 account, 6 Legacy, 14 terminal, 13 slot generation, 90 lifecycle, 5 first, 16 descendant, 11 witnessed). `$files = rg --files tests/unit | rg '(campaign|soundings|survey)'; node --test $files`: **172/172**. `npm run typecheck:ui:node`: pass. `npm run typecheck:ui`: **137 existing diagnostics**, zero in new/G9 paths. App-local `./node_modules/.bin/vite.cmd build`: pass after sandbox-only Vite `realpath EPERM` retry with filesystem escalation. `git diff --cached --check`: pass. A first synthetic inheritance setup hit a full legacy localStorage origin; an independently new fixture passed 11/11 without clearing retained user QA data.

### D. Risks / follow-up notes

Applicable FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019: exact production/selected caller, genuine witness, atomic fault/retry/restart/two-owner, malformed graph/receipt and prewrite, stale/newer and request identity, independent acceptance and hosted source/branch checks are mapped in the focused audit. Eligible retired inheritance source and injected faults are synthetic; they do not claim production-account reachability or long-run G10 durability. Fresh fetch/prune inspected two local/six hosted refs, merge bases, unique commits/paths and zero open repository PRs. Protected readiness/prompt-integrity and named-consumer administration/creator holds retain their exact review triggers. No integration, merge, rebase, deletion, PR or disposition change due/performed. Suggested routing commit `docs(dev): install G10 activation entry decision`; next separate run **DEV-0.7.1 Slice G10A**. Planned primary, deployment and Game-version decisions remain separate.

## 2026-10-08 DEV-0.7.1.12 independent G9 evidence completion audit

Source **DEV-0.7.1.12**, support suffix of planned parent `DEV-0.7.1`; inspected clean `master` and fetched/read-back hosted `master` `a4012d451638a833ea45d7229d33ab4546c0db82`. Audit evidence commit `6417b561b776c414e8eecec9596afa097c81cabb` was pushed and independently read back from hosted `master`; installed prompt and focused audit blobs matched local. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Development milestone impact `supports_current_band`; Game-version impact `none`. Decision **G9_PARENT_AUDIT_INCOMPLETE; G10_ACTIVATION_HELD**. Focused pre-probe and completed row matrix: `docs/design/dev-0.7.1.12-g9-independent-evidence-completion-audit.md`.

### A. Files changed

Five new independent browser entrypoints and their scripts (`apps/rpg-ui/g9-completion-{witness,defeat,terminal,account,selected}-20261008` with terminal two modes), focused audit, current output/handoff/prompt, planning/historical route and branch register. No production owner, adapter, selected App, schema, dependency, tracked generated output, G10, deployment or Game-version source edit. Initial worktree clean.

### B. Patch summary

The matrix was saved before probes. New production-path/native browser checks pass **937/937 independent assertions**: genuine production-authorized Soundings witness; paired coherent/missing/malformed/cross-bound witnessed reset/delete; all **12 account families simultaneously populated**; **25** destructive writes each for reset and delete under abort and quota; Normal-defeat **6** publication/consumer writes under both faults plus restart/lost readback; terminal **6** publication/settlement and **8** closure writes under both faults plus malformed membership and lost readback; account/profile/credential/Legacy CAS and exact retries; actual mounted selected `EpochApp` picker/Settings changed versus unchanged request identity and competing owner. No new production defect was observed. Several exact rows remain independently unexercised (selected defeat/retirement/address/reset, retired-source inheritance race and invalid history, prepared/pending/reused-slot corrupt/coherent graph variants, lifecycle receipt malformations and stale reentry); no prior repair or audit suite substitutes. Install only `DEV-0.7.1.13` residual G9 evidence completion; no parent acceptance or G10.

### C. Tests and checks run

`npm --prefix apps/rpg-ui run dev -- --host 127.0.0.1 --port 5173`; native Chromium independent URLs/modes and exact counts: witness **391**, defeat **132**, terminal publication **177**, terminal closure **162**, account/Legacy **36**, mounted selected App **39**; all pass. Supporting existing G9 browser suites **176/176** separately (8 Normal defeat, 13 account adapter, 6 Legacy, 14 terminal, 13 slot generation, 90 lifecycle, 5 first campaign, 16 descendant, 11 witnessed descendant). `$files = rg --files tests/unit | rg '(campaign|soundings|survey)'; node --test $files`: **172/172**. `npm run typecheck:ui:node`: pass. `npm run typecheck:ui`: **137 existing diagnostics**, zero in new probe/G9 production paths. App-local `./node_modules/.bin/vite.cmd build`: pass. `git diff --cached --check`: pass after staging. Synthetic fixtures do not prove production-account reachability.

### D. Risks / follow-up notes

Applicable FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019: evidence and exact limits recorded row-by-row in focused audit. Fetch/prune reviewed two local and six hosted refs, merge bases/unique commits/paths and zero open repository PRs. Protected readiness/prompt-integrity and named-consumer administration/creator holds retain existing exact triggers; no integration, merge, rebase, deletion, PR or disposition change due/performed. Suggested commit `test(persistence): record independent G9 evidence completion gaps`. Next `DEV-0.7.1.13` is evidence-only; planned primary, deployment and Game-version remain held.

## 2026-10-08 DEV-0.7.1.11 independent full G9A–F parent re-audit

Source **DEV-0.7.1.11**, support suffix of planned `DEV-0.7.1`; clean fetched local/hosted `master` `c606b491c4457dcacc378e359a0f06d673781a39` at inspection. Audit evidence commit `04d3942bae4fb1f5147884acdb9b4bb5f91bed17` was pushed and independently read back from hosted `master`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Decision **G9_PARENT_AUDIT_INCOMPLETE; G10_ACTIVATION_HELD**. Focused matrix and exact gaps: `docs/design/dev-0.7.1.11-g9-lifecycle-parent-independent-reaudit.md`.

### A. Files changed

Fresh independent owner and mounted selected-App synthetic audit pages (`apps/rpg-ui/g9-full-parent-20261008.{html,ts}`, `apps/rpg-ui/g9-full-selected-20261008.{html,tsx}`), focused audit matrix, current prompt/output/handoff, planning/historical route and branch register. No production source, schema, dependency, tracked generated output, deployment, G10 or Game-version edit. Initial worktree was clean.

### B. Patch summary

The full G9A–F matrix was written before authoring probes. New owner probes passed **398 assertions**, including fresh Normal-defeat recovery, Legacy CAS, terminal retirement, address deletion and reuse, paired destructive graph corruptions, 8 abort/quota write positions per transition, retained exact version-2 delete request and reset/delete retry. Actual mounted `EpochApp` passed **22/22 modes, 155 assertions** for picker/Settings F6–F9 intent boundaries and selected defeat/Legacy/terminal/address/reset. The committed F9 probe, earlier F1–F9 harnesses and G9F repair QA were not imported or counted as acceptance evidence. Multiple required rows remain unexercised: genuine witnessed Soundings graph, complete G9B/G9D fault/restart surfaces, all simultaneously populated 12-family erasure and several G9C/E/reentry boundaries. Thus no `G9_PARENT_ACCEPTED` decision is supportable. Install only **DEV-0.7.1.12 independent G9 evidence completion**; G10 remains held.

### C. Tests and checks run

`npm --prefix apps/rpg-ui run dev -- --host 127.0.0.1 --port 5173`; native Chromium `/g9-full-parent-20261008.html` **398/398** and `/g9-full-selected-20261008.html?mode=` **22/22 modes, 155/155 assertions** (all modes/counts in focused audit). Supporting existing G9 browser pages **163/163**, separate from acceptance. `$files=rg --files tests/unit | rg '(campaign|soundings|survey)'; node --test $files`: **172/172**, zero failed. `npm run typecheck:ui:node`: pass. `npm run typecheck:ui`: **137 existing diagnostics**, zero in new audit paths. `./node_modules/.bin/vite.cmd build` from `apps/rpg-ui`: pass after sandbox realpath retry. `git diff --check` and final branch/source review recorded before publication. All browser accounts/faults synthetic; no production-account reachability claim.

### D. Risks / follow-up notes

Applicable FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019: production caller, independent gate, competing/exact retries, malformed graph/tombstone, restart and atomicity, source/branch identity and synthetic evidence limits. Their observed coverage and remaining gaps are row-by-row in focused audit; repair suites cannot fill the gaps. Fetch/prune inspected two local/six hosted refs including `master`, with zero open repository PRs. Readiness/prompt-integrity remain protected; administration/creator planning/creator implementation retain named-consumer holds and review triggers in branch register. No trigger, disposition change, integration, merge, rebase, deletion or PR action was due. Suggested commit `test(persistence): record independent G9 parent evidence gaps`. Next `DEV-0.7.1.12` must close gaps before a full parent decision; no G10, planned-primary, deployment or Game-version acceptance.

## 2026-10-08 DEV-0.7.1.10 F9 selected deletion intent repair

Source **DEV-0.7.1.10**, support suffix of planned `DEV-0.7.1`; starting clean fetched local/hosted `master` `85034c6d5418bb956dc7adcfd979a81a52be6b5c`. Repair commit `d1f5e2fdb6a1b773f2a57cd1350d701170cf8099` was pushed and independently read back from hosted `master`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Decision **F9_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD**.

### A. Files changed

`apps/rpg-ui/src/EpochApp.tsx`, `apps/rpg-ui/src/game-shell/components/LocalAccountAccessScreen.tsx`, `apps/rpg-ui/src/game-shell/components/SettingsScreen.tsx`, `apps/rpg-ui/g9-parent-selected-20261007.tsx`, and `docs/dev/dev-0.7.1.10-f9-selected-deletion-intent-repair-record.md` in the repair commit. This routing publication updates current output, handoff, prompt, planning/historical route and branch register. No owner/adapter/schema/dependency/generated-output, deployment, G10 or Game-version edit.

### B. Patch summary

Before production edits, the mounted selected App reproduced F9: changed picker selection after a committed delete with lost acknowledgement reused an old request and reported false success while target tombstone and other-account bytes stayed fixed. The selected picker/Settings now mint and invalidate a delete intent on selection, action, password and abandonment changes; `EpochApp` keys its retained request by source, intent and exact observed request fields. Unchanged lost-acknowledgement retry retains the same request. Version-2 tombstone owner/adapter binding is unchanged. A fresh **DEV-0.7.1.11 independent full G9A–F parent re-audit** is installed; this repair cannot accept G9. Focused record: `docs/dev/dev-0.7.1.10-f9-selected-deletion-intent-repair-record.md`.

### C. Tests and checks run

`npm --prefix apps/rpg-ui run dev -- --host 127.0.0.1 --port 5173` and native Chromium pages: selected repair `/g9-parent-selected-20261007.html?mode=` **15/15** (changed-selection, toggle, create, password-return, Settings cancel/action change, competing pre-submit deletes, lost acknowledgement exact retries, stale and other-account controls); retained selected `/campaign-clean-epoch-account-lifecycle-selected-app-qa.html?probe=` **9/9**; owner G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first **5/5**, descendant **16/16**, witnessed **11/11**, G9F **90/90**: **163/163**. `$files=rg --files tests/unit | rg '(campaign|soundings|survey)'; node --test $files`: **172/172**, zero fail. `npm run typecheck:ui:node`: pass. `npm run typecheck:ui`: **137 existing diagnostics**, zero in changed paths. `./node_modules/.bin/vite.cmd build` from `apps/rpg-ui`: pass. `git diff --check`: pass. All browser accounts/faults synthetic; repair QA is not parent-acceptance evidence.

### D. Risks / follow-up notes

Applicable FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019: actual selected caller and abandon/retry boundary, independent parent gate, exact competing and restarted owner, graph/receipt failures, no newer-account mutation, source/branch identity and synthetic evidence limit. Fetch/prune inspected two local/six hosted refs and zero open repository PRs. Readiness/prompt-integrity remain protected; administration/creator planning/creator implementation remain held for named consumers. No trigger, disposition change, integration, merge, rebase, deletion or PR action was due. Inspected merge bases/unique commits/paths and triggers are in the branch register. Suggested routing commit: `docs(dev): install independent G9 parent re-audit`. The next run must derive new full G9A–F probes; no G10 until an explicit independent `G9_PARENT_ACCEPTED`.

## 2026-10-07 DEV-0.7.1.9 independent G9 lifecycle parent re-audit

Source **DEV-0.7.1.9**, support suffix of planned `DEV-0.7.1`; clean fetched local/hosted `master` `efe5630e5c9fb76a084ce977e0ef4e82b603788f` at inspection. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Decision **G9_PARENT_REPAIR_REQUIRED; G10_ACTIVATION_HELD**. Focused audit: `docs/design/dev-0.7.1.9-g9-lifecycle-parent-independent-reaudit.md`.

### A. Files changed

Fresh independent owner and mounted-App synthetic QA entrypoints (`g9-parent-independent-20261007.ts`/`.html`, `g9-parent-selected-20261007.tsx`/`.html`), focused audit, FP-018, installed current prompt, this output, current handoff, planning/historical route and branch register. No production code, schema, dependency, tracked generated output, deployment, G10 or Game-version change.

### B. Patch summary

Independent owner checks **229 assertions passed** across paired reset/delete F1–F4 corruptions and valid graph controls, F5 historical deletion retry, competing exact request/restart, malformed/legacy tombstone, first-write abort/quota, and stale generation. The actual mounted `EpochApp` passed **8/9** independent picker/Settings modes for F6–F8 but failed one newly derived F9 mode: after a committed delete lost readback, picker selection moved to another account and back; the second click reused the original request ID, removed the target entry and showed no stale warning. Tombstone/other-account bytes stayed unchanged. The completed earlier action cannot authorize a changed selection's new success. Parent acceptance remains blocked. Install only **DEV-0.7.1.10 F9 Selected Deletion Intent Change Repair**, then a separate fresh parent audit.

### C. Tests and checks run

Run `npm --prefix apps/rpg-ui run dev -- --host 127.0.0.1 --port 5173`, then native Chromium IAB read `#result` from `/g9-parent-independent-20261007.html` (**PASS 229 assertions**) and `/g9-parent-selected-20261007.html?mode=` for `external-picker`, `external-settings`, `stale-reset`, `stale-revision`, `wrong-password`, `lost-picker`, `lost-settings`, `changed-password`, `changed-selection` (**8 PASS, F9 expected FAIL**, repeated). Supporting native URLs in the focused audit: G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first **5/5**, descendant **16/16**, witnessed **11/11**, G9F **90/90** (total **163/163**). `$files=rg --files tests/unit | rg '(campaign|soundings|survey)'; node --test $files` returned **172/172, zero fail**. `npm run typecheck:ui:node` passed. `npm run typecheck:ui` returned **137** preexisting diagnostics and zero in audited production/probe paths. From `apps/rpg-ui`, `./node_modules/.bin/vite.cmd build` passed after a sandbox `EPERM` retry outside that restriction. `git diff --cached --check` passed. Synthetic fixtures do not prove production-account reachability.

Applicable FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019: actual selected caller and F9 selection change, independent parent gate, exact retry/competing request, malformed authority, restart/abort/quota, graph prewrite, source/branch identity, synthetic limit and other-account stability. FP-018 was generalized for F9.

### D. Risks / follow-up notes

Fetch/prune found two local and six hosted refs including `master`; repository-scoped connector found zero open PRs. Protected readiness/prompt refs and held administration/creator refs retain their exact register triggers; F9 consumes none. No integration, merge, rebase, branch deletion, PR or disposition change was due/performed. Suggested commit `docs(persistence): hold G9 on changed selected deletion intent`. G10, planned-primary, deployment and Game-version acceptance stay held. Final commit/push/readback identity is reported after publication.

## 2026-10-07 DEV-0.7.1.8 F8 exact selected deletion request repair

Source `DEV-0.7.1.8`, support suffix of planned `DEV-0.7.1`; parent not accepted. Inspected clean fetched `master`/hosted `master` `00bd7ce727bae9d04287c1faa56fbe3de5f50af0`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **F8_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1.8-f8-exact-selected-deletion-request-repair-record.md`.

### A. Files changed

`cleanEpochAccountStore.ts`, `cleanEpochAccountAdapter.ts`, actual selected `EpochApp.tsx`, native G9F and selected-App QA, focused repair record, current prompt/output/handoff, planning/historical route and branch register. No database version upgrade, new production dependency, generated output, deployment, G10 or Game-version change.

### B. Patch summary

Before production edits, actual selected picker and Settings each claimed another owner's same-generation tombstone before any selected delete submission. New deletes persist a UUID request identity in an additive version-2 tombstone; owner and adapter require exact identity on absent-account retry. Old version-1 tombstones stay readable but cannot fabricate an identity. Selected App retains the originally submitted request across uncertain acknowledgement and mints a new identity for changed input. Current password remains required and verified before first deletion. Reset/session generation fences remain intact. Repair checks cannot accept G9 parent.

### C. Tests and checks run

Synthetic actual selected-App F8 picker/Settings now show `Account changed before deletion.` without clearing as success; changed request blocks; exact lost acknowledgement retry works from picker and Settings; fresh, wrong-password, stale reset generation and stale ordinary revision controls pass. Native G9F **90/90** (including all eight abort/quota write points, restart/two-owner and malformed/missing/legacy tombstones); adjacent G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first **5/5**, descendant **16/16**, witnessed **11/11**. Focused campaign/Soundings/survey Node **172/172**; Node UI-config typecheck and app-local Vite build pass. Broad UI typecheck remains at **137** known diagnostics, zero in changed paths. `git diff --check` passes. Synthetic fixtures do not establish production reachability.

Applicable FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019: selected caller and exact retry, independent acceptance gate, contention/rollback/readback, no newer-account mutation, branch/source identity, retained provenance, malformed duplicate rejection, synthetic limit and destructive prewrite graph regression. Exact evidence is in the focused record.

### D. Risks / follow-up notes

Fresh fetch/prune found two local/six hosted refs including `master`; repository-scoped GitHub connector found zero open PRs. Readiness and prompt-integrity remain protected; administration, creator planning and creator implementation retain named-consumer holds. No integration, deletion, PR or disposition change due/performed. Suggested commit `fix(persistence): bind account deletion retry to exact request`. Install `DEV-0.7.1.9` independent G9 parent re-audit on read-back hosted repair; G10, planned primary, deployment and Game-version acceptance remain held. Final commit/push/readback identities are reported after publication.

## 2026-10-07 DEV-0.7.1.7 independent G9 lifecycle parent re-audit

Source **DEV-0.7.1.7 — Independent G9 Lifecycle Parent Re-audit**, support suffix of planned `DEV-0.7.1`, from clean freshly fetched `master`/hosted `master` `b4a1aeb5230ae9bb6f25617775273f837dde98c4`, including independently read-back F4–F7 repair `1c8791c7`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Decision **G9_PARENT_REPAIR_REQUIRED; G10_ACTIVATION_HELD**. Focused audit: `docs/design/dev-0.7.1.7-g9-lifecycle-parent-independent-reaudit.md`.

Files changed: focused audit, FP-018, this output, current handoff/prompt, planning/historical and branch routing. Disposable independent browser probes were removed; no production code, schema, dependency, tracked generated output, deployment or Game version changed. Independent synthetic browser checks **50/50** passed: **48 paired reset/delete graph** corruptions and valid prepared, pending, multi-address, witnessed, terminal, historical reuse controls with zero prewrite calls on corruption and byte-stable account families, plus **two F5** restart/two-owner and negative retry checks. Actual selected `EpochApp` **six valid/stale/lost-acknowledgement modes passed; two F8 pre-submit external deletion modes failed**: picker and Settings claimed another owner's tombstone as success without a submitted selected request. This is a new cross-slice parent blocker, not evidence for acceptance from G9F **86/86**.

Supporting fresh validation: G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first **5/5**, descendant **16/16**, witnessed **11/11**; focused Node **174/174**, Node UI-config typecheck and app-local Vite build pass after an `EPERM` permission-adjusted build retry. Broad UI typecheck remains nonzero with **137 baseline diagnostics**, none in audited owner/caller paths. G9F supplies supporting abort/quota all eight destructive writes, restart, two-owner and readback cases; this independent audit's F8 selected-App failure controls the decision. Synthetic accounts do not establish production reachability. `git diff --check` is the publication gate. Applicable FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019; focused audit provides exact evidence and FP-018 now names pre-submit tombstone confusion.

Branch/PR review: fresh fetch/prune found two local/six hosted refs including `master`, zero open PRs. Readiness and prompt-integrity remain protected; administration, creator planning and creator implementation keep their named-consumer holds and exact register triggers. No integration, merge, rebase, deletion, PR or disposition change due/performed. Suggested commit `docs(persistence): hold G9 on unsubmitted deletion retry`. Next **DEV-0.7.1.8 — F8 Exact Selected Deletion Request Repair**, then a new independent parent audit only after repair passes and is pushed/read back. G10, planned primary, deployment and Game-version acceptance remain held.

## 2026-10-07 DEV-0.7.1.6 G9 residual history, deletion retry and picker CAS repair

Source run **DEV-0.7.1.6 — G9 History, Deletion Retry And Picker CAS Repair**, support suffix of planned `DEV-0.7.1`, from clean fetched `master`/`origin/master` `36590ae36964327c7c2d12a706bec956ae4c3866`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **F4_F7_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1.6-g9-history-deletion-retry-picker-cas-repair-record.md`. Repair commit `1c8791c7d25d2d295a85d74504a4748b7bbfcc72` was pushed and independently read back from hosted `master`; fresh fetch read the focused record from `origin/master`.

Files changed in repair: `cleanEpochAccountStore.ts`, `cleanEpochAccountAdapter.ts`, `EpochApp.tsx`, `LocalAccountAccessScreen.tsx`, `launcherAuthManager.ts`, native lifecycle QA, selected-App QA HTML/TSX, focused record. This routing commit updates current output/handoff/prompt/planning/historical/branch docs only. F4 account run slots and outcome now bind to live campaign addresses before destructive writes. F5 historical same-campaign deleted-slot receipt remains readable and exact retry returns the old receipt without modifying the newer occupant. F6 picker delete uses its observed revision/generation CAS. F7 picker and Settings exact lost-delete-acknowledgement retries reach durable tombstone proof. No schema, dependency, ordinary owner, tracked generated output, deployment or Game-version change.

Fresh validation: G9F native **86/86** with paired F4 prewrite corruption and F5 valid/corrupt retry controls; selected-App **5/5** (F6 and F7 reproduced against old callers before edits, then repaired); G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first **5/5**, descendant **16/16**, witnessed **11/11**; focused Node **174/174**, Node UI-config and app-local Vite build pass, `git diff --check` pass. Build needed a permission-adjusted retry for ignored generated hosting output. Broad UI typecheck remains nonzero with **137 baseline diagnostics**, none in changed production paths. Synthetic local fixtures do not prove production-account reachability. Applicable FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018/019; exact prewrite, CAS, retry, restart, two-owner, abort/quota and caller evidence is in the focused record.

Branch/PR lifecycle: fresh fetch/prune found two local/six hosted refs including `master`, zero open PRs. Readiness and prompt-integrity remain protected; administration, creator planning and creator implementation retain named-consumer holds and exact register triggers. No integration, merge, rebase, deletion, PR or disposition change was due. Suggested routing commit: `docs(persistence): install independent G9 parent re-audit`. Next **DEV-0.7.1.7 — Independent G9 Lifecycle Parent Re-audit**. Repair checks do not decide `G9_PARENT_ACCEPTED`; G10, planned primary, deployment and Game-version acceptance remain held.

## 2026-10-06 DEV-0.7.1.5 independent G9 lifecycle parent re-audit

Source run **DEV-0.7.1.5 — Independent G9 Lifecycle Parent Re-audit**, support suffix of planned `DEV-0.7.1`, from clean freshly fetched `master`/`origin/master` `637fec3bcad865001c25868a94a62fcbcc4f2ccd`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **G9_PARENT_REPAIR_REQUIRED; G10_ACTIVATION_HELD**. Focused independent audit: `docs/design/dev-0.7.1.5-g9-lifecycle-parent-independent-reaudit.md`. Codex local implementation-capable checkout, shell, Git, native Chromium and GitHub repository PR search were used; no additional plugin or cross-platform transfer was needed.

Files changed: focused audit, this output, current handoff/prompt, planning/historical/branch routing and FP-018/019 evidence. No production source, schema, dependency, tracked generated output, deployment or Game version changed. Disposable native probe files were removed. Independent **35/35 executed** browser probes confirmed F1–F3 corruptions now reject before write, with valid multi-address/terminal controls; they also found F4. One-row ghost `saveSlotIds` and one-row `deleted` outcome with a live address each made **both reset and delete commit with eight writes**, erasing surviving version-1 target rows. F5: after valid same-campaign deleted-slot reoccupation, old receipt read returned `invalid_record` and exact retry `conflict` despite unchanged rows. F6: a selected-picker-equivalent stale generation-1 selection followed by another owner's reset to generation 2 allowed a fresh-read delete of generation 2. F7: exact adapter tombstone retry returned ready, while the selected-App picker precheck reads an absent account and cannot reach it. F6/F7 selected-App UI injection remains a repair-run gate. No parent acceptance follows from the 80/80 repair suite.

Fresh checks: native G9F **80/80**, G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first **5/5**, descendant **16/16**, witnessed **11/11**; focused campaign/Soundings/survey Node **165/165 PASS**; Node UI-config typecheck and app-local Vite build **PASS** after a permission-adjusted retry for ignored generated hosting output. Broad UI typecheck remains **nonzero with 137 diagnostics**, none in audited owner/caller paths. A fresh selected-App synthetic picker showed wrong-password rejection; corrupt-artifact presentation was prior-run evidence, not a fresh F4 UI proof. `git diff --check` is the publication gate. Applicable FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018/019: focused audit gives transaction, caller, provenance, CAS, retry, synthetic and baseline evidence.

Branch/PR review: fetch/prune found two local and six hosted refs including `master`, zero open PRs. Readiness and prompt-integrity remain protected; administration, creator planning and creator implementation retain named-consumer holds and exact register triggers. No integration, merge, rebase, deletion, PR or disposition change was due. Suggested commit: `docs(persistence): hold G9 on residual history and retry gaps`. Next **DEV-0.7.1.6 — Residual G9 History, Deletion Retry And Picker CAS Repair** only, followed by a new independent parent audit. G10, planned primary, deployment and Game-version acceptance remain held.

## 2026-10-06 DEV-0.7.1.4 residual G9 destructive graph preflight repair

Source run **DEV-0.7.1.4 — Residual G9 Destructive Graph Preflight Repair**, support suffix of planned `DEV-0.7.1`, from clean synchronized `master`/`origin/master` `f3a697ec8ab30d3cd167e826e1bff9a4d323aebb`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **F2_F3_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1.4-g9-residual-destructive-graph-preflight-repair-record.md`. Repair commit `39d886350a7dfb7d94c1514df3e9c5833456177e` was pushed; independent `git ls-remote origin refs/heads/master` returned that exact SHA and fresh fetch read the focused record back from `origin/master` before this routing update.

Files changed in the repair: `apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts`, `apps/rpg-ui/campaign-clean-epoch-account-lifecycle-qa.ts`, focused record. Transaction-local preflight now requires a current generation pointer for every retained deletion-receipt slot, replays first/descendant/terminal/deletion address events by account revision and checks exact prior destination and final slot state. Legitimate historical receipts, multi-address slot reuse, same-campaign descendant reoccupation and terminal cleanup remain accepted. This publication updates current output/handoff/prompt/planning/historical/branch routing only. No schema, dependency, ordinary owner, selected-App source, tracked generated output, deployment or Game version changed.

Fresh checks: G9F native lifecycle **80/80**, adjacent G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first **5/5**, descendant **16/16**, witnessed **11/11**; focused Node **172/172**; Node UI-config typecheck and app-local Vite build pass. The broad UI typecheck remains **nonzero with 137 diagnostics**, none in changed paths; build required a permission-adjusted retry for ignored generated output. Selected-App Settings reset/delete and picker delete visibly blocked on a separate synthetic missing-artifact fixture. Paired F2/F3 reset/delete cases assert `invalid_record` before any write, byte-stable target/other account families, unchanged account revision/generation and no receipt. `git diff --check` passed. Applicable guardrails FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018/019: exact evidence and synthetic reachability limit are in the focused record.

Branch/PR review: fresh fetch/prune found two local and six hosted refs including `master`, zero open PRs. Readiness and prompt-integrity stay protected; administration, creator planning and creator implementation retain named-consumer holds and exact register triggers. No integration, merge, rebase, deletion, PR or disposition change was due. Suggested commit for this routing: `docs(persistence): install independent G9 parent re-audit`. Next **DEV-0.7.1.5 — Independent G9 Lifecycle Parent Re-audit**. The repair suite does not decide `G9_PARENT_ACCEPTED`; G10, planned primary, deployment and Game-version acceptance remain held.

## 2026-10-06 DEV-0.7.1.3 independent G9 parent re-audit

Source run **DEV-0.7.1.3 — Independent G9 Lifecycle Parent Re-audit**, support suffix of planned `DEV-0.7.1`, from clean synchronized `master`/`origin/master` `cf6e27b450a22c1ebddd02095bfa52a26540a2db`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **G9_PARENT_REPAIR_REQUIRED; G10_ACTIVATION_HELD**. Focused authority: `docs/design/dev-0.7.1.3-g9-lifecycle-parent-independent-reaudit.md`.

Files changed: focused parent re-audit, this output, current handoff/prompt, planning and historical registers, FP-019 evidence and branch review. No production source, schema, dependency, tracked generated output, deployment or Game version changed. Temporary independent probe files were removed. F2: after valid G9E deletion, removing its current deleted-generation row still lets reset/delete commit. F3: forging a descendant recovery's prior destination address binding to nonexistent artifact/publication IDs also lets both commit. Four corrupt browser probes erased target version-1 rows and wrote lifecycle receipts; four paired valid controls committed as expected, while the other account stayed byte-equivalent. Parent acceptance is unavailable even though the existing suite is green.

Fresh checks: G9F lifecycle **64/64**, G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first campaign **5/5**, descendant adapter **16/16**, witnessed descendant **11/11**; focused Node **172/172**, Node UI-config typecheck and app-local Vite build pass. The build required an elevated retry to replace ignored generated hosting output. Selected App Settings reset/delete and picker delete blocked on a separate synthetic missing-artifact case; picker wrong password blocked. Broad UI typecheck remains **nonzero with 137 existing diagnostics**. Applicable FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018/019: selected caller and ordinary owners were traced, fresh corruption/validity probes and retained rollback/retry matrix were reconciled, synthetic limits and generation fencing stated. FP-019 gains this focused evidence.

Branch/PR review: two local/six hosted refs including `master`, zero open PRs. Readiness and prompt-integrity remain protected; administration, creator planning and creator implementation retain named-consumer holds. No integration, merge, rebase, deletion, PR or disposition change due; exact review triggers remain in the branch register. Suggested commit: `docs(persistence): hold G9 on residual destructive graph gaps`. Next **DEV-0.7.1.4 — Residual G9 Destructive Graph Preflight Repair** only. G10, planned primary, deployment and Game-version acceptance held.

Publication: audit and handoff commit `e3187cc75798d5510e24ed3ed70ad19166ae469f` was pushed to hosted `master`; independent `git ls-remote origin refs/heads/master` returned that exact SHA. Fresh fetch read back the installed DEV-0.7.1.4 prompt from `origin/master`. This annotation is a separate documentation commit; its final hosted head is reported at completion.

## 2026-10-05 DEV-0.7.1.2 G9 destructive graph preflight repair

Source run **DEV-0.7.1.2 — G9 Destructive Campaign-Graph Preflight Repair**, support suffix of planned `DEV-0.7.1`, from clean synchronized `master`/`origin/master` `f528df391f47429901218642029ee4eacb58c9a1`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **F1_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1.2-g9-destructive-graph-preflight-repair-record.md`.

Files changed: `cleanEpochAccountStore.ts` transaction-local account-wide graph preflight; coherent lifecycle browser corruption matrix; selected App synthetic corruption control; focused repair record and current output/handoff/prompt/planning/historical/branch routing. No schema, dependency, ordinary owner, tracked generated output, deployment or Game version changed. The preflight validates required cross-store existence, identity, provenance and account receipts before reset/delete's first write, including prepared, pending, published, descendant, terminal, deleted-address and historical generations. Both destructive actions now reject partial graph loss without an account/lifecycle mutation.

Fresh checks: native G9F lifecycle **64/64**, G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first campaign **5/5**, descendant adapter **16/16**, witnessed descendant **11/11**; focused campaign/Soundings/survey Node **174/174**; Node UI-config typecheck, app-local Vite build and diff check pass. Selected App synthetic corrupt-artifact Settings reset/delete display `Campaign artifact is missing.` and Characters displays campaign data unavailable. Broad UI typecheck remains **nonzero with 137 existing diagnostics**, none in changed paths. Synthetic fixtures do not establish production reachability. FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018/019 apply; the focused record links failure-boundary, provenance, retry, caller and generation evidence.

Branch/PR review: two local/six hosted refs including `master`, zero open PRs. Readiness/prompt-integrity remain protected; administration, creator planning and creator implementation retain named-consumer holds and exact register triggers. No integration, merge, rebase, deletion, PR or disposition change due. Suggested commit: `fix(persistence): preflight account campaign graph before erasure`. Next **DEV-0.7.1.3 — Independent G9 Lifecycle Parent Re-audit** only; G10, planned primary, deployment and Game-version acceptance held pending explicit `G9_PARENT_ACCEPTED`.

Publication: repair, QA and handoff commit `d0a3ca171a22b4059ecd85f335974286315152cc` was pushed to hosted `master`; independent `git ls-remote origin refs/heads/master` returned that exact SHA, and a fresh fetch read back the installed `DEV-0.7.1.3` prompt from `origin/master`. This publication annotation is a separate documentation commit; its final hosted head is reported in the completion response.

## 2026-10-05 DEV-0.7.1.1 G9 lifecycle parent audit

Source run **DEV-0.7.1.1 — G9 Lifecycle Parent Acceptance Audit**, support suffix of planned `DEV-0.7.1`, from clean synchronized `master`/`origin/master` `de5b1cab7bf9adeee418e42f31dbd19830ea69af`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **G9_PARENT_REPAIR_REQUIRED; G10_ACTIVATION_HELD**. Focused authority: `docs/design/dev-0.7.1.1-g9-lifecycle-parent-acceptance-audit.md`, F1.

Files changed: focused parent audit, FP-019, active repair prompt and current output/handoff/planning/historical/branch routing. No production source, schema, dependency, tracked generated artifact or Game version changed. Synthetic isolated browser probes published coherent first campaigns, removed required artifact/control/first-recovery/address/generation rows with surviving version-1 attempts, and found both reset and delete committed in all ten cases. A genuinely witnessed descendant missing its durable Soundings witness also committed reset and delete. The destructive preflight validates only surviving row shapes, erases remaining evidence and writes success authority, contrary to G9A's missing-data rule. Disposable probe pages were removed after observation; the repair must add durable tests.

Fresh checks: G9B browser **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, G9F **12/12**, plus **12/12 defect reproductions**; focused campaign/Soundings/survey Node **174/174**; Node UI-config typecheck and app-local Vite build pass. Broad UI typecheck is **nonzero with 137 diagnostics**. Existing G9F passes do not close F1. Applicable FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018/019: source/caller route, cross-store failure boundary, retry/rollback evidence, synthetic limits and branch/head separation were reviewed. F1 specifically requires FP-002/014/019 repair proof.

Branch/PR review: two local and six hosted branches including `master`, zero open PRs. Readiness/prompt-integrity remain protected; administration/creator planning/creator implementation remain held for register triggers. No integration, deletion or disposition change is due. Suggested commit: `docs(persistence): require G9 destructive graph repair`. Risks/follow-up: parent acceptance cannot proceed until F1 repair and independent re-audit; install **DEV-0.7.1.2 — G9 Destructive Campaign-Graph Preflight Repair**. G10, capacity/backup, death gameplay, combat, deployment, planned primary and Game-version acceptance held. Final hosted head is read back after publication.

## 2026-10-03 DEV-0.7.1 Slice G9F account lifecycle closure

Source run **DEV-0.7.1 Slice G9F — Account Reset/Delete And Session Invalidation** from clean synchronized `master`/`origin/master` `d41c289692a64f2a9546edc4abcbff938aa37c7f`. Label class: internal support of planned primary `DEV-0.7.1` (parent held); Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **G9F_ACCOUNT_RESET_DELETE_AND_SESSION_INVALIDATION_VERIFIED; G9_PARENT_AUDIT_NEXT; ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g9f-account-lifecycle-record.md`.

Files changed: additive v7 `cleanEpochAccountStore.ts` lifecycle receipt/tombstone and whole-account transaction, generation-bound `cleanEpochAccountAdapter.ts`, selected `EpochApp.tsx` Settings/account-picker controls, picker failure presentation, focused owner/App browser QA, FP-018, focused record and current routing/output/handoff/planning/historical/branch documents. Reset preserves credential/account ID and freshens profile; delete removes the account. Both erase the 12 account-owned data families atomically. Exact old reset retry never exposes or erases newer-generation data. The owner requires the current password; account registration, persisted hint and live App session reentry respect the lifecycle generation. No G9E address-only contract, separate legacy staging DB, other account, dependency or Game version changed.

Checks: synthetic native G9F **12/12**, G9E **13/13**, G9D **14/14**, adjacent browser **130/130**; selected-App Settings reset/delete and picker wrong-password/success readback; focused Node **174/174**; Node UI-config typecheck, app-local Vite build and diff check **PASS**. Broad UI typecheck retains **137 known diagnostics**, none in changed G9F production files. Full workspace `npm test` was not used as a green gate under the validation matrix. Applicable FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017/018: actual selected caller, all-write abort/quota, two owners, restart, exact retry/readback, malformed authority, generation-bound reentry, branch/hosted head separation and synthetic-source labeling.

Branch/PR review: two local/six hosted refs and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness and prompt-integrity remain protected; administration, creator planning and creator implementation remain held for their named consumers, with exact triggers in the branch register. No merge, rebase, integration, deletion or PR action due. Suggested commit: `feat(persistence): guard account lifecycle generations in epoch store`. Next **DEV-0.7.1.1 — G9 Lifecycle Parent Acceptance Audit**; G10, capacity/eviction/backup, death caller, combat, deployment, planned primary and Game-version acceptance held. Final commit/push and hosted-head readback are reported separately at publication.

Publication: G9F implementation commit `cf593f4ad56d98d9e3e7edde8fa8e6fe2b958806` was pushed to hosted `master`; `git ls-remote origin refs/heads/master` returned that exact SHA. This publication annotation is a separate documentation commit; its final hosted-head identity is reported in the completion response.

## 2026-10-03 DEV-0.7.1 Slice G9E.1 hardening closure

Source run **DEV-0.7.1 Slice G9E.1 — Slot Generation Hardening Before G9F** from clean synchronized `master`/`origin/master` `2614b788`. Label class: support suffix of planned primary `DEV-0.7.1` (parent held); Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **G9E_SLOT_GENERATION_AND_ADDRESS_DELETION_VERIFIED; G9E_1_HARDENING_VERIFIED; G9F_NEXT; ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g9e-1-hardening-gate.md`.

Files changed: focused G9E browser QA, selected-App synthetic QA controls, `EpochApp.tsx` deletion notice, focused hardening record, and current routing/output/handoff/planning/historical/branch documents. No schema, account reset/delete, immutable evidence pruning or Game-version change. Actual save-envelope and first-recovery `generationId` values fail slot-generation CAS; witnessed published two-address v5 authority migrates and restarts with artifact/control/witness/consumer evidence. Two-address terminal closure abort/quota at every eight writes preserves both closed addresses and permits exact retry; post-commit readback loss retains the same closure identity, two receipts and account revision. The App's success notice now follows refreshed slot occupancy, including exact old-generation retry after replacement.

Checks: native G9E **13/13**, hardened G9D **14/14**, adjacent owner/browser **130/130**, selected-App exact stale retry/current deletion/retirement, focused campaign/Soundings/survey Node **174/174**, Node UI-config typecheck, app-local Vite build and `git diff --check` **PASS**. The broad UI audit reports the unchanged **137 diagnostics**, none in `EpochApp.tsx`; full workspace `npm test` was not run as a green gate under the validation matrix. The first Node attempt overlapped an unrelated checkout switch and is not counted; the complete rerun passed on `master`. Synthetic browser accounts and an ignored generated fixture were used; the fixture is removed after validation. FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017 apply: actual selected App, transaction rollback, durable readback/retry, migration provenance, branch isolation and synthetic-source limits were checked.

Branch/PR review: two local/six hosted refs and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls) at final fetch. Readiness `59c103c3` and prompt integrity `58a34e37` remain `PROTECTED_REFERENCE`; administration `210df5bc`, creator planning `2cf0cb6c`, and creator implementation `d7d12467` remain `HOLD_NAMED_CONSUMER` with their existing named review triggers. The local creator branch remains behind its hosted ref by one commit and was left untouched. No integration, merge, rebase, deletion or PR action was due. Suggested commit: `test(persistence): close G9E.1 hardening gate`. Next: **DEV-0.7.1 Slice G9F — Account Reset/Delete And Session Invalidation** from G9A. G10, parent and Game-version acceptance remain held. Final commit/push/hosted readback are reported separately at publication.

## 2026-10-02 DEV-0.7.1 Slice G9E address-generation prerequisite

Source run **DEV-0.7.1 Slice G9E — Slot Closure/Delete And Inheritance Consumption** from clean synchronized `master`/`origin/master` `4ebfc220df2b0948b303cd1cbb38c41a49cd044d`. Label class: internal support of planned primary `DEV-0.7.1` (parent held); Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **G9D_HARDENING_VERIFIED; G9E_ADDRESS_GENERATION_CONTRACT_REQUIRED; DELETION_HELD**. Focused decision: `docs/design/dev-0.7.1-slice-g9e-address-generation-prerequisite-decision.md`.

Files changed: focused G9E prerequisite decision and current routing/output/handoff/planning/historical/branch documents only. The v5 attempt and first-recovery stores are keyed `[accountId,slotId]`. Keeping those required historical rows after address deletion makes that slot impossible to reserve for another campaign; removing them loses accepted evidence. Existing slot inventory and recovery readers also require an address for a completed first recovery. The chosen additive v6 generation-scoped authority and deletion receipts must be implemented before enabling existing delete controls. G9D terminal history is `archived`, while existing heir eligibility requires `retired`; no new inheritance grant is authorized.

Checks run on hardened source: native terminal **14/14 PASS**; adjacent owner/browser **130/130 PASS**; Node campaign/Soundings/survey **127/127 PASS**; Node UI-config typecheck and app-local Vite build **PASS**. Broad UI typecheck retains **137 known diagnostics**, none in G9D files. Ignored generated fixture removed. Source/schema/caller/retention inspection, live open-PR page, branch unique-path review and diff checks. No G9E browser or production validation is claimed because no G9E source changed. FP-001/002/003/004/005/008/009/012/014/015/017 apply: actual delete/creator reachability, durable completion, slot contention and exact retry must be proven in the next implementation; this decision does not substitute for them.

Branch/PR review: one local/five hosted refs including `master`; zero open PRs. Readiness `59c103c3`, prompt integrity `58a34e37`, administration `210df5bc` retain existing dispositions and triggers. `planning/character-creator-trait-system` advanced from `af7fbd28` to `8ea2da63` by post-push fetch; six unique planning commits/five unique docs remain `HOLD_NAMED_CONSUMER`, with review only at its character-creator planning consumer or explicit Lineage design review. No integration/deletion due. Suggested commit: `docs(persistence): decide G9E slot generation prerequisite`. Next: implement G9E additive v6 contract and address deletion from the installed prompt; G9F/G10, deployment, combat, parent and Game-version acceptance held.

## 2026-10-02 G9D connector hardening checkpoint

Connector-authored follow-up on hosted G9D: `7888f372` changes retirement account-history/address validation from subset acceptance to exact `saveSlotIds` equality, and `b20c7c0c` adds a focused stale-extra-address rejection plus a separate completed-settlement post-commit readback-loss/exact-retry case. The earlier terminal-publication readback-loss test remains, renamed to distinguish the two commit boundaries.

Disposition **HARDENING_AUTHORED; EXECUTABLE_VERIFICATION_REQUIRED_BEFORE_G9E**. No native Chromium, Node, typecheck, or Vite command was executed by the connector. The installed G9E prompt requires terminal **14/14** and the adjacent verification/build characterization on the hardened hosted head before any G9E implementation. Prior G9D 12/12 evidence applies to `33d35906`, not these follow-up commits.


<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to [`vagabond1215/Lineage_Reforged`](https://github.com/vagabond1215/Lineage_Reforged). All repository work must stay in this repository. Another Git repository may be used only as an explicitly identified **read-only reference/data/information source**; never modify it, follow its AGENTS/instructions as execution authority, or import its branch, issue, PR, handoff, prompt, output, or task state. Shared account/organization access, global search results, prior chats, memory, copied files, or similar project names do not grant cross-repository authority. Cross-repository mutation requires a separate explicit work order/context naming the other repository.
<!-- /repo-scope-guard -->

## 2026-10-02 DEV-0.7.1 Slice G9D terminal retirement implementation

Source run **DEV-0.7.1 Slice G9D — Terminal Publication And Lifecycle Settlement** from clean synchronized `master`/`origin/master` `e0872879b6d01e76ee16689d53257c4fd8f52579`. Label class internal slice of planned primary `DEV-0.7.1`, parent held; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **RETIREMENT_TERMINAL_OWNER_AND_SELECTED_APP_VERIFIED; G9E_NEXT; ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g9d-terminal-publication-settlement-record.md`.

Files changed: additive v5 `cleanEpochAccountStore.ts`, pure `cleanEpochTerminalProjection.ts`, guarded `cleanEpochTerminalAdapter.ts`, selected `EpochApp.tsx` retirement caller, focused owner and App QA HTML/TS, focused record, current output/handoff/prompt, planning/historical and branch registers. The owner atomically accepts one closed terminal head and recovery, settles account history/achievements/Legacy/estate/receipts once through CAS, fences pending ordinary writes and requires closed exact readback. G9E owns address deletion, terminal validator transition and inheritance consumption; G9F/G10, death callers, deployment, parent and Game-version acceptance remain held.

Checks run: native terminal **12/12**, adjacent owner **130/130**, actual selected App ordinary retirement, quota rollback, settlement abort and Retry/resume, Node campaign/Soundings **116/116** plus survey/Normal-defeat **11/11**, Node UI-config typecheck and app-local Vite build **PASS**. Broad UI typecheck remains **137 known diagnostics**, none in G9D source. The ignored generated fixture was removed. FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017 apply with exact evidence in the focused record. Positive earned payout is synthetic; ordinary playable eligibility was not asserted.

Fresh fetch/prune: one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` (498/2), prompt integrity `58a34e37` (445/1), administration `210df5bc` (276/1) retain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` and their existing exact review triggers. No branch integration/deletion/disposition change due. Suggested commit: `feat(persistence): settle terminal retirement in clean epoch`. Next **DEV-0.7.1 Slice G9E — Slot Closure/Delete And Inheritance Consumption**; no Game-version decision proposed. Counts describe inspected source, pending final hosted-head readback.

## 2026-10-02 DEV-0.7.1 Slice G9D terminal store prerequisite

Source run **DEV-0.7.1 Slice G9D — Terminal Publication And Lifecycle Settlement**; clean synchronized inspected `master`/`origin/master` `59cf8c77222cbb3fb525aa073bf7b481cce3b5b6`. Label class internal slice of planned primary `DEV-0.7.1`, parent held; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **G9D_SCHEMA_CONTRACT_REQUIRED; TERMINAL_IMPLEMENTATION_HELD**. Focused decision: `docs/design/dev-0.7.1-slice-g9d-terminal-store-prerequisite-decision.md`.

Files changed: the focused decision and current output/handoff/prompt/planning/historical/branch routing documents only. The v4 account store has no lifecycle recovery family; ordinary descendant recovery requires nonterminal artifacts and ordinary consumers. The retained archive helper still consults localStorage even with persistence/deletion disabled. The decided v5 additive lifecycle store, unique source index, atomic terminal publication/recovery, storage-free retirement projection, CAS settlement and exact readback are installed as the next G9D implementation route. No source, schema, browser data, deployment or Game-version mutation occurred in this prerequisite. The selected App retirement button remains held.

Checks run: fresh fetch/prune and synchronized head; source/caller/schema and G9A/G9B/G9C authority inspection; live GitHub open-PR page; branch merge bases, ahead/behind and unique paths; document reread and `git diff --check`. No browser QA, Node tests, typecheck or build was run because no executable source changed. FP-002 prevents parent acceptance from a document; FP-008/009 separate inspected and final hosted heads and retain semantic branch dispositions; FP-012/014/015 require complete recovery evidence and derived payout/estate recomputation in the next pass; FP-017 separates future synthetic payout from ordinary reachability.

One local/four hosted branches, zero open PRs. Readiness `59c103c3`/base `895c02df` was 497 master-only/2 ref-only; prompt integrity `58a34e37`/base `3d77171c` was 444/1; administration `210df5bc`/base `fd40571b` was 275/1. Their unique docs do not overlap this decision. Dispositions stay `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; review triggers stay scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. No integration, merge, deletion, PR or disposition change due. Suggested commit: `docs(persistence): decide G9D terminal store prerequisite`. Next **DEV-0.7.1 Slice G9D implementation from additive v5 schema**; G9E/F, G10, combat and parent acceptance held. No separate Game-version decision proposed. Counts describe inspected source, not final hosted head.

## 2026-10-02 DEV-0.7.1 Slice G9C revisioned account/Legacy actions

Source run **DEV-0.7.1 Slice G9C — Revisioned Account And Legacy Actions**; planned primary `DEV-0.7.1` remains held. Inspected/starting clean synchronized `master`/`origin/master` `85786625`; code `83d14c90`, selected-App QA `9e95e1a9`. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; label class internal primary slice, parent not accepted; development impact `supports_current_band`, Game-version impact `none`. Result **REVISIONED_LEGACY_ACTIONS_VERIFIED; G9D_NEXT; ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g9c-revisioned-account-legacy-actions-record.md`.

Files changed: selected `EpochApp.tsx`, new clean-epoch Legacy adapter, native owner and selected-App QA HTML/TS, focused record, current output/handoff/prompt, planning/historical and branch registers. Existing purchase/select/choice/remove controls use pure Legacy calculation and exact account-profile/revision CAS/readback. Existing profile/password account-adapter owners were reverified; no selected-App or retained-App profile/password edit controls exist, and adding them would exceed G9C's UX exclusion. No existing action falls back to localStorage.

Fresh focused native browser **6/6**, adjacent owner browser **130/130**, total **136/136 PASS**. Actual selected App proved purchase, selection, reload, quota and abort rollback/readback, retry and stale second tab. Node campaign/Normal-defeat/Soundings **126/126 PASS**; Node UI-config and app-local Vite build pass. Broad UI remains **137 baseline diagnostics**, zero G9C source paths; diff checks pass. Synthetic QA Prestige does not prove ordinary earned-Prestige reachability before G9D. FP-001/002/003/004/005/006/008/009/012/013/014/015/017 applied with focused evidence.

Fresh fetch/prune: one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` (494/2), prompt integrity `58a34e37` (441/1), administration `210df5bc` (272/1) retain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; triggers unchanged. No branch integration/deletion/disposition change due. Suggested code commits `feat(persistence): route Legacy actions through epoch account CAS` (`83d14c90`) and `test(persistence): probe Legacy App abort quota and stale tabs` (`9e95e1a9`); suggested handoff commit `docs(handoff): close G9C and install G9D`. Next **DEV-0.7.1 Slice G9D — Terminal Publication And Lifecycle Settlement**; G9E/F, G10, combat and parent acceptance held. No separate Game-version decision proposed.

## 2026-10-02 DEV-0.7.1 Slice G9B Normal defeat recovery publication

Source run **DEV-0.7.1 Slice G9B — Normal Defeat Recovery Publication Owner Implementation**; internal implementation slice of planned primary `DEV-0.7.1`, parent held. Inspected/starting clean synchronized `master`/`origin/master` `09c4d74f`; code/QA checkpoint `13622ef2`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **RETAINED_NORMAL_DEFEAT_RECOVERY_OWNER_VERIFIED; G9C_AND_ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g9b-normal-defeat-recovery-publication-record.md`.

Files changed: `apps/rpg-ui/src/game-shell/cleanEpochNormalDefeatRecoveryAdapter.ts`, selected `EpochApp.tsx`, local-only `campaign-clean-epoch-normal-defeat-qa.html/.ts`, focused record, current output/handoff/prompt, planning/historical and branch registers. The adapter validates exact retained pending receipt, source/control, account/head/address; uses campaign-session gameplay recovery; publishes via ordinary descendant owner, completes consumers, reads back exact ready; retries accepted pending/completed identities without minting another publication. The selected App routes retained pending load/save through it. No schema, dependency, legacy writer, migration, reset/deletion, deployment or Game-version change.

Fresh native Chromium focused QA **8/8**, adjacent owner suites **130/130**, total **138/138 PASS**; actual App retained pending load, quota, abort, lost caller/restart and exact ready readback exercised. Campaign/Normal-defeat/Soundings Node **126/126 PASS**; Node UI-config, app-local Vite build and diff checks pass. Broad UI typecheck remains **137 known diagnostics**, zero G9B paths. Valid ordinary closed slot and natural combat-triggered pending state remain held; see focused boundary. FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017 applied with the focused evidence.

Fresh fetch/prune: one local/four hosted branches; [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` (492/2), prompt integrity `58a34e37` (439/1), administration `210df5bc` (270/1) retain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Review triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. No branch integration/deletion/disposition change due. Suggested code commit `feat(persistence): publish retained Normal defeat recovery in epoch` (recorded `13622ef2`); suggested handoff commit `docs(handoff): close G9B and install G9C`. Next **DEV-0.7.1 Slice G9C — Revisioned Account And Legacy Actions**; G9D-F, G10, combat and planned parent acceptance held. No separate Game-version decision proposed.

## 2026-10-02 DEV-0.7.1 Slice G9A lifecycle/destructive authority decision

Connector-safe documentation-only decision from hosted source `418fba0e3e356608fbed550a0849e359e80724f3`. Result **LIFECYCLE_DESTRUCTIVE_CONTRACT_ACCEPTED; G9_IMPLEMENTATION_HELD**. Focused authority: `docs/design/g9a-epoch-lifecycle-and-destructive-transition-authority-decision.md`.

G9A separates Normal-Stakes recovery, terminal settlement, slot-address deletion, ordinary account edits and explicit account reset/delete. Ordinary recovery must use `completePendingNormalDefeatRecovery` then the clean-epoch descendant publication/consumer/readback path. Terminal retirement/death requires a terminal descendant plus durable lifecycle recovery and exactly-once history/achievement/payout/estate settlement before addresses close. Slot deletion removes only an address and updates run-history membership; immutable artifacts/provenance remain. Reset/delete are account-wide destructive transactions with stale-tab invalidation; delete requires a retained tombstone/generation against identity resurrection. Existing localStorage lifecycle helpers remain calculation evidence only, not persistence owners.

Accepted implementation order: **G9B Normal Defeat Recovery Publication Owner → G9C Revisioned Account And Legacy Actions → G9D Terminal Publication And Lifecycle Settlement → G9E Slot Closure/Delete And Inheritance Consumption → G9F Account Reset/Delete And Session Invalidation**. G10 remains activation, built-output/storage audit, long-run/two-context capacity, eviction and complete verifiable backup/restore. No production code/schema/browser data/deployment/Game-version/branch disposition changed in G9A. Installed next prompt: **DEV-0.7.1 Slice G9B — Normal Defeat Recovery Publication Owner Implementation**.


## 2026-10-01 DEV-0.7.1 Slice G8F.1 actual App failure UI

Source run **DEV-0.7.1 Slice G8F.1 — Actual App Failure UI And Recovery Proof**; support run of planned primary `DEV-0.7.1`, parent held. Starting clean synchronized `master`/`origin/master` `9cd07551000ede0e211f0da8ba278c679ea1d914`; code/QA checkpoint `a9070e33`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, game-version impact `none`. Result **G8F_ACTUAL_APP_FAILURE_UI_VERIFIED; G9_AND_ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g8f-1-actual-app-failure-ui-record.md`.

Files changed: `apps/rpg-ui/src/EpochApp.tsx`, local-only `campaign-clean-epoch-app-failure-qa.html/.ts`, focused record, FP-004 addendum, current output/handoff/prompt, planning/historical and branch registers. The App now resumes only the destination address that owns a pending descendant recovery; an older source address can also display pending under the shared head. It re-reads inventory and blocks if pending remains. No schema, dependency, old-save migration, deployment, browser reset or Game-version change.

Native actual App: artifact-write quota and abort each blocked without head/account/receipt mutation, followed by reachable Retry; prepared first attempt, pending first and descendant, and pending cross-slot quick publication resumed exactly with account consumers; two-tab pending and stale account conflicts blocked the loser; injected stale head/destination inputs blocked without writes. The cross-slot pending publication retained the exact quick publication identity after recovery. No unexpected localStorage writes were observed by the local QA page. Adjacent browser **130/130 PASS**, campaign/Soundings Node **116/116 PASS**, Node UI-config and targeted QA TypeScript checks plus app-local Vite build pass. Broad UI typecheck remains **137 known diagnostics**, with only the pre-existing MainMenu optional-prop diagnostic in a changed path. FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017 applied as bounded in the focused record; FP-004 was updated for shared-head address aliases.

Fresh fetch/prune: one local/four hosted branches; [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` (483/2), prompt integrity `58a34e37` (430/1), administration `210df5bc` (261/1) retain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; no disposition, integration or deletion due. Review triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. Suggested code commit `fix(persistence): recover pending cross-slot head from destination` (recorded `a9070e33`); suggested handoff commit `docs(handoff): close G8F failure UI and install G9A decision`. Next **DEV-0.7.1 Slice G9A — Epoch Lifecycle And Destructive Transition Authority Decision**; G10 activation/post-epoch durability, combat and parent acceptance remain held. No separate Game-version decision proposed.

## 2026-10-01 DEV-0.7.1 Slice G8F caller checkpoint

Source run **DEV-0.7.1 Slice G8F — Real Async App Caller Cutover And Ordinary UI QA**; internal slice of planned primary `DEV-0.7.1`, parent held. Starting synchronized `master`/`origin/master` `2dcbee6c97a8680bce0a2066d3bad6b3ae9cd734`; code checkpoint `08329e90`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted DEV `DEV-0.7.0`; development impact `supports_current_band`; game-version impact `none`. Result **REAL_ASYNC_APP_ORDINARY_PATH_VERIFIED; G8F_FAILURE_UI_ACCEPTANCE_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g8f-real-async-app-caller-checkpoint.md`.

Files changed: selected `App.tsx`, new `EpochApp.tsx`, epoch owner/adapter comments, game-shell slot state and four launcher/account components, local-only bootstrap fault QA page, focused record, current output/handoff/prompt, branch register and planning/historical pointers. The App awaits epoch bootstrap, inventory, creator, exact load and descendant saves, retains source/destination address expectations and blocks G9 lifecycle actions. Strict Mode stale initialization closes its IndexedDB owner. No deployment or browser reset.

Actual native Chromium UI proved new account/creator, manual/quick cross-slot saves, restart/load, non-head fork, two-tab stale refusal, Soundings first witnessed completion and later save, and unavailable/blocked/malformed IndexedDB bootstrap. Adjacent native owner suites **130/130** and Node campaign/Soundings **116/116** pass; Node UI-config typecheck and app-local Vite build pass. Broad UI typecheck retains **137 known diagnostics**, with only the pre-existing MainMenu optional-prop diagnostic in a changed path. Actual-App pending consumer, write-time quota/abort and distinct stale head/destination injections remain unproved; install G8F.1 support before G9. FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017 applied as bounded in the focused record.

Fresh fetch/prune: one local/four hosted branches; [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` (481/2), prompt integrity `58a34e37` (428/1), administration `210df5bc` (259/1) retain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. No disposition, integration or deletion due. Suggested code commit `feat(persistence): select awaited clean-epoch App caller` (recorded `08329e90`); suggested handoff commit `docs(handoff): record G8F caller checkpoint and install UI failure proof`. Next **DEV-0.7.1 Slice G8F.1 — Actual App Failure UI And Recovery Proof** (support of planned `DEV-0.7.1`); G9 lifecycle and G10 activation/post-epoch durability, combat and parent acceptance remain held. No separate Game-version decision proposed.

## 2026-09-30 DEV-0.7.1 Slice G8E implementation

Source run **DEV-0.7.1 Slice G8E — Cross-Slot Campaign Address Owner Implementation**; label class internal slice of planned current-band primary `DEV-0.7.1`, parent held. Inspected and implementation starting `master`/`origin/master` `fe78984d953097975ae993ecce8757ab32c2f560`; code/QA checkpoint `1a38a677a9f1415bd5a21332418210067220fa42`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted DEV `DEV-0.7.0`; development impact `supports_current_band`; game-version impact `none`. Result **CROSS_SLOT_CAMPAIGN_ADDRESS_OWNER_VERIFIED; REAL_APP_AND_ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g8e-cross-slot-campaign-address-owner-record.md`.

Files changed: `apps/rpg-ui/src/game-shell/campaignIndexedDbStore.ts`, `cleanEpochAccountStore.ts`, `cleanEpochDescendantAdapter.ts`, three adjacent native QA scripts, focused record, current output/handoff/prompt, historical/deferred register, planning reconciliation and branch register. The inert transaction CASes the destination address and retains source/overwritten artifacts; account-scoped slot reads materialize historical addresses against the singular head, while recovery and account consumers bind to the destination. G8D first/later Soundings witness provenance remains. No App, lifecycle/reset/delete, schema, old-save migration, deployment, dependency or Game-version change.

Fresh final native Chromium suites **130/130 PASS** (G8E/G8B descendant 16, G8D witness 11, G8A 7, G7B 5, G7A 13, clean epoch 52, publication 12, canonical 14). Adjacent Node campaign/Soundings **116/116 PASS**; Node UI-config typecheck and app-local Vite build **PASS**; broad UI typecheck retains **137 known diagnostics**, zero in changed production files. `git diff --cached --check` passed for the code commit. Ordinary App UI and post-epoch durability were not claimed. FP-001/002 bound inert versus live/parent evidence; FP-003/004/005/006 cover pending, contention, restart, CAS and abort/quota; FP-011/012/013/014/015 cover provenance, retained nested history and receipts; FP-008/009 cover branch/head accounting. No new pattern added.

Fresh fetch/prune at source found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` was 479/2, prompt integrity `58a34e37`/base `3d77171c` was 426/1, administration `210df5bc`/base `fd40571b` was 257/1; unique paths remain two readiness docs, one prompt audit and one research evidence doc. Dispositions remain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; review triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. No branch integration, merge, rebase, deletion, PR or disposition change due. Suggested code commit `feat(persistence): address cross-slot campaign descendants` (recorded as `1a38a677`); suggested handoff commit `docs(handoff): record G8E address checkpoint and install G8F`.

Next route **DEV-0.7.1 Slice G8F — Real Async App Caller Cutover And Ordinary UI QA**. G9 lifecycle/reset/delete, G10 coordinated activation/post-epoch durability and backup/restore, combat and parent acceptance remain held. No separate Game-version decision proposed. Final hosted head requires post-push readback.

## 2026-09-30 DEV-0.7.1 Slice G8D implementation

Source run **DEV-0.7.1 Slice G8D — First Witnessed Descendant Owner Implementation**; label class internal slice of planned current-band primary `DEV-0.7.1`, parent held. Inspected and implementation starting head `master`/`origin/master` `1ad268e956cfd4396feadad0dbcd3764a90bd5b9`; code/QA checkpoint `745e1b4d`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted DEV `DEV-0.7.0`. Development impact `supports_current_band`; game-version impact `none`. Result **FIRST_WITNESSED_DESCENDANT_OWNER_VERIFIED; CROSS_SLOT_AND_LIVE_APP_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g8d-first-witnessed-descendant-owner-record.md`.

Files changed: `campaignIndexedDbStore.ts`, `cleanEpochAccountStore.ts`, `cleanEpochDescendantAdapter.ts`, new witnessed-descendant native QA `.ts`/`.html`, focused record, current output/handoff/prompt, planning reconciliation, historical and branch registers, failure-pattern addendum. The caller verifies the gameplay session witness before publication; the transaction validates retained source/target, promotes that witness to applied first-durable identity, and commits it with artifact/head/slot/pending recovery. Readback checks the immutable first witnessed artifact and source; creator recovery can predate the first witness. No cross-slot, App, schema, reset, deployment, migration, dependency or Game-version change.

Fresh checks: headless native Chromium witnessed QA **9/9**, G8B/G8A/G7B/G7A/clean-epoch/publication/canonical **111/111**, adjacent Node campaign/Soundings **116/116**, Node UI-config typecheck **PASS**, app-local Vite build **PASS**, broad UI typecheck **137 known baseline diagnostics**, zero in changed production files. Staged code diff check passed; final docs diff check remains a handoff gate. No ordinary App UI QA or parent acceptance. FP-001/002 bound inert proof below live caller; FP-003/004/005/006 cover recovery, contention, restart and failure injection; FP-011/012/013/014/015 cover independent witness/source/history and downgrade; FP-008/009 cover branch and head accounting. FP-014 received the creator-versus-first-witness addendum.

Fresh fetch/prune found one local/four hosted branches; [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` was 477/2, prompt integrity `58a34e37`/base `3d77171c` was 424/1, administration `210df5bc`/base `fd40571b` was 255/1 at inspected source. Unique paths remain two readiness docs, one prompt-audit doc and one research-evidence doc. Dispositions remain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. No integration, merge, rebase, deletion or disposition change due. Suggested code commit: `feat(persistence): publish first witnessed descendants in epoch` (recorded as `745e1b4d`); suggested handoff commit: `docs(handoff): record G8D witness checkpoint and install G8E`.

Next run **DEV-0.7.1 Slice G8E — Cross-Slot Campaign Address Owner Implementation**. G8F real App cutover, G9 lifecycle, G10 activation/post-epoch long-run durability and backup/restore, combat and parent acceptance remain held. No separate Game-version decision proposed. Final committed and hosted head require post-push readback.

## 2026-09-30 DEV-0.7.1 Slice G8C decision

Source hosted head inspected: `ea7b8562830d1df19a4ade32f7754f7c378d6672`. Result **WITNESSED_DESCENDANT_AND_CROSS_SLOT_CONTRACTS_ACCEPTED; IMPLEMENTATION_HELD**. Focused authority: `docs/design/g8c-first-witnessed-descendant-and-cross-slot-authority-decision.md`.

G8C accepts two separate owner contracts. First Soundings completion after a pure creator head must publish from the independently produced session witness; the transactional owner converts that exact session witness to the immutable applied witness with the first durable descendant identity in the same transaction as artifact/head/address/pending recovery. Snapshot agreement cannot mint provenance. Second, manual/quick cross-slot save uses one singular campaign head plus durable account-scoped slot addresses: destination points to the newly accepted immutable head, source address remains unchanged, and prior artifacts/addresses remain durable. Destination overwrite requires optimistic expected-address CAS and never prunes history.

Implementation order is G8D witnessed descendant owner, G8E cross-slot campaign address owner, then G8F real async App cutover and ordinary UI QA. G9 lifecycle/reset/delete and G10 activation/durability remain separate. No production code/test/schema/browser/deployment change and no executable acceptance occurred in G8C. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged; planned `DEV-0.7.1` held.

Retained branch dispositions remain readiness/prompt-integrity `PROTECTED_REFERENCE` and administration `HOLD_NAMED_CONSUMER`; their exact triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. G8C consumes none.



## 2026-09-30 DEV-0.7.1 Slice G8B checkpoint

Source run **DEV-0.7.1 Slice G8B — Inert Same-Slot Descendant Caller Checkpoint**; label class internal slice of planned current-band primary `DEV-0.7.1`, parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development impact `supports_current_band`; game-version impact `none`. Clean synchronized source `master`/`origin/master` `55c558fb335ac9b285d38a6b215d72424cbff920`. Result **SAME_SLOT_DESCENDANT_CALLER_VERIFIED; LIVE_APP_CUTOVER_HELD**. Final hosted head requires post-push readback.

### A. Files changed

New `apps/rpg-ui/src/game-shell/cleanEpochDescendantAdapter.ts` and `.js` mirror, `cleanEpochAccountStore.ts` current pending descendant locator, native browser QA page/script, focused G8B record, current output/handoff/prompt, historical/deferred route, planning reconciliation and branch register. No App, legacy owner, schema, deployment/reset, dependency, combat or Game-version change.

### B. Patch summary

An inert same-slot ordinary descendant caller verifies account revision, current head and retained source, evaluates the complete achievement/account projection, publishes through the guarded G6 owner with four required consumer plans, completes account consumers and requires exact ready-slot readback. A lost accepted caller can locate the current pending descendant by durable account/slot head and resume after restart. Stale retry, cross-slot quick/manual destination and new post-creator Soundings witness introduction block rather than replacing accepted authority. A legitimate non-head gameplay mutation forks and retains earlier artifacts.

The installed G8B real App switch is still unsafe: G6 binds artifacts/recoveries to the creator slot and has no transaction/recovery for quick-save's separate address; G6 and the low-level owner cannot durably introduce the first Soundings witness on a descendant after the G7B pure creator. These affect new-epoch saves. **G8 ordinary App acceptance is not claimed.** Installed G8C to decide the missing owner contracts before further code cutover.

### C. Tests or checks run

Native Chromium descendant adapter **8/8 PASS**; G8A launcher **7/7**, G7B first campaign **5/5**, G7A account **13/13**, clean epoch **52/52**, publication **12/12**, canonical **14/14 PASS**. Adjacent campaign **51/51** and Soundings **53/53 PASS**. Node UI config typecheck and app-local Vite build **PASS** (229 client modules). Broad UI typecheck retains **137 baseline diagnostics**, zero naming G8B production files. `git diff --check` PASS. Native ordinary App UI QA was not run because the App route is still held.

FP-001/002 bound inert versus real caller and parent acceptance. FP-003/004/005/006 use durable current-slot recovery, restart, stale and two-owner checks; production reachability remains pending. FP-011/012/013/014/015 use exact source/receipt readback, retained non-head fork and rerun Soundings/owner suites, not a new first-witness caller proof. FP-008/009 govern branch/head accounting. No new generalized failure pattern found.

### D. Risks / follow-up notes

G8C must decide first witnessed descendant and cross-slot quick/manual authority. Implement each accepted contract in bounded owner slices, then finish real App cutover and native ordinary UI QA. G9 lifecycle/reset/delete and G10 coordinated activation plus post-epoch long-run/two-browser capacity, quota/eviction and backup/restore remain held. Suggested commit: `feat(persistence): add inert descendant caller recovery`.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` is 469 master-only/2 ref-only; prompt integrity `58a34e37`/base `3d77171c` is 416/1; administration `210df5bc`/base `fd40571b` is 247/1. Their unique paths remain two readiness docs, one prompt-audit doc and one research-evidence doc. Dispositions stay `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; exact triggers are scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. No merge, deletion, integration, PR or disposition action due. Counts describe the inspected source, not final head. Next run **DEV-0.7.1 Slice G8C — First Witnessed Descendant And Cross-Slot Authority Decision**; no Game-version decision proposed.

## 2026-09-30 DEV-0.7.1 Slice G8A checkpoint

Source run **DEV-0.7.1 Slice G8A — Inert Async Launcher Read Checkpoint**; label class internal slice of planned current-band primary `DEV-0.7.1`, parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development impact `supports_current_band`; game-version impact `none`. Clean synchronized source `master`/`origin/master` `8e8ce9f39ebb760edd40bf3a978e68d655bee21e`. Result **EPOCH_LAUNCHER_READ_BOUNDARY_VERIFIED; LIVE_APP_CUTOVER_HELD**. Final hosted head requires post-push readback.

### A. Files changed

New `apps/rpg-ui/src/game-shell/cleanEpochLauncherRead.ts` and `.js` mirror, native browser QA page/script, focused G8A record, current output/handoff/prompt, historical/deferred route, planning reconciliation and branch register. No App, legacy owner, deployment, reset, dependency, combat or Game-version change.

### B. Patch summary

The inert reader composes validated epoch session selection, account-scoped inventory and exact ready-slot load. It checks account revision around reads, distinguishes prepared/pending/closed/unsupported from empty, and returns typed blocked results without a default profile or empty fallback. The installed G8 permits this narrower safe checkpoint because real App actions remain coupled to synchronous legacy account/save/lifecycle owners. G8 ordinary App acceptance is **not** claimed; G8B is installed for the real caller switch and ordinary descendant adapter.

### C. Tests or checks run

Native Chromium G8A fixture **7/7 PASS**; G7B first campaign **5/5**, G7A account adapter **13/13**, clean epoch **52/52**, publication **12/12**, canonical **14/14 PASS**. Adjacent campaign **51/51** and Soundings **53/53 PASS**. Node UI config typecheck and app-local Vite build **PASS** (229 client modules). Broad UI typecheck reports **137 existing diagnostics**, zero naming G8A files. `git diff --check` PASS. An initial clean-epoch/publication/canonical QA attempt lacked ignored fixture JSON; the generated-fixture rerun passed. Native ordinary App UI QA remains pending.

FP-001/002 bound the inert claim; FP-003/004/005/006 are addressed by blocked statuses, restart and stable revision in the new fixture, with two-owner publication proof reused from G6/G7B; FP-011/012/013/014/015 use rerun owner/adjacent suites, not new caller proof; FP-008/009 govern branch/head accounting. No new generalized pattern found.

### D. Risks / follow-up notes

The real App still selects legacy localStorage authority. Complete G8B account, creator, load and manual/quick descendant callers plus reachable blocked/retry UI before G8 acceptance. G9 lifecycle/reset/delete and G10 coordinated activation and post-epoch long-run/two-browser capacity, quota/eviction and backup/restore remain held. Suggested commit: `feat(persistence): add inert epoch launcher read boundary`.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` is 468 master-only/2 ref-only; prompt integrity `58a34e37`/base `3d77171c` is 415/1; administration `210df5bc`/base `fd40571b` is 246/1. Unique paths remain two readiness docs, one prompt-audit doc and one research-evidence doc. Dispositions stay `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; triggers are scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. No branch action due. Counts describe the inspected source, not final head. Next run **DEV-0.7.1 Slice G8B — Real Async App Caller Cutover**; no Game-version decision proposed.

Date: 2026-09-30. Source run: **DEV-0.7.1 Slice G7B — Inert First-Campaign Orchestration And Pending-Account Fence**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` `5a5f6b10e92bddbfee58051d3014699850351753`; code checkpoint `c25fc296`. Result: **INERT_FIRST_CAMPAIGN_ORCHESTRATION_VERIFIED; LIVE_CALLERS_HELD**. Final hosted head requires post-push verification.

## A. Files changed

`apps/rpg-ui/src/game-shell/cleanEpochFirstCampaignAdapter.ts` and `.js` mirror, `cleanEpochAccountStore.ts`, first-campaign native QA page/script, adjusted clean-epoch QA expectations, focused G7B record, current output/handoff/prompt, historical/deferred route, planning reconciliation and branch register. No App import, activation, reset, legacy migration, dependency, combat or Game-version change.

## B. Patch summary

The inert adapter reads the retained account and attempt before preparation, builds one exact creator snapshot with selected Legacy preparation and optional heir source, reserves it transactionally, publishes the first artifact and pending recovery, completes every mandatory account consumer and reads the ready slot before success. Restart and two-owner retries preserve the accepted attempt/publication; conflicting creator input blocks. The pure creator stages but cannot complete Soundings, so generated and retained first attempts require `not_completed`; no witness is synthesized. Profile/password mutations now share an IndexedDB transaction with all account attempts and recoveries, blocking a revision change while first or descendant consumers are pending; sign-in keeps the reserved revision.

## C. Tests and checks run

Fresh native Chromium first-campaign QA **5/5 PASS**, clean-epoch **52/52 PASS**, account adapter **13/13 PASS**, publication **12/12 PASS**, canonical **14/14 PASS**. Adjacent campaign/creator/account tests **51/51 PASS**, Soundings provenance/completion **53/53 PASS**. Node UI config typecheck **PASS** and app-local Vite build **PASS** (229 client modules). Broad UI typecheck remains **137 baseline diagnostics**; targeted TypeScript inspection showed zero G7B-file diagnostics and 22 unrelated imported-source diagnostics. `git diff --check` **PASS**. The focused record names scenario evidence and limits.

FP-001/002 restrict this to inert adapter proof; FP-003/004/005/006 cover reachable `resume`, account-wide fence, lost caller, two owners and conflict. FP-011/012/013/014/015 cover creator Soundings posture, independent owner witness regression, unique receipts, selected preparation/inheritance and full retained snapshot/readback. FP-008/009 govern branch and exact-head accounting. No new generalized pattern.

Fresh fetch/prune at inspected source found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (466 master-only/2 ref-only), prompt integrity `58a34e37`/base `3d77171c` (413/1), administration `210df5bc`/base `fd40571b` (244/1) retain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; triggers are scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. None was consumed; no branch action or PR was due.

## D. Risks and follow-up notes

No production App caller selects the adapter. G8 owns ordinary async App bootstrap/load/new campaign/manual and quick actions; G9 lifecycle/reset/delete; G10 coordinated development-only activation and post-epoch long-run/two-browser capacity, quota/eviction and backup/restore acceptance. Suggested code commit: `feat(persistence): orchestrate inert first campaigns in clean epoch` (`c25fc296`); suggested handoff commit: `docs(handoff): record G7B checkpoint and install G8`. No Game-version decision proposed.

---

Date: 2026-09-30. Source run: **DEV-0.7.1 Slice G7A — Inert Epoch Account And Auth Adapter Checkpoint**. Label class: internal checkpoint of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` `0b60cfad8fa35bd5eb472d4502db2b22e39cf60d`; code checkpoint `b0ed5ca8`. Result: **INERT_EPOCH_ACCOUNT_AUTH_ADAPTER_VERIFIED; FIRST_CAMPAIGN_AND_LIVE_CALLERS_HELD**. Final hosted head requires post-push verification.

## A. Files changed

`apps/rpg-ui/src/game-shell/cleanEpochAccountAdapter.ts` and `.js` mirror, pure export visibility in `launcherAuthManager.ts`, native account-adapter QA page/script, focused G7A record, current output/handoff/prompt, historical/deferred route, planning reconciliation and branch register. No App caller, deployment, browser reset, legacy migration, dependency, combat or Game-version change.

## B. Patch summary

Inert async registration, PBKDF2 sign-in, epoch-only validated session hint, profile CAS and password mutation use the clean-epoch IndexedDB account owner and typed blocked results. Registration retains caller-created identity across retry/restart and same-input owner races. Sign-in rereads the credential after PBKDF2 without incrementing account revision, preserving prepared first-campaign restart eligibility. Session hint failure reports the committed account ID for password recovery. Installed **DEV-0.7.1 Slice G7B — Inert First-Campaign Orchestration And Pending-Account Fence** because a retained first-campaign attempt currently lacks independent Soundings witness evidence and account mutation must be atomically fenced while an attempt/recovery is pending.

## C. Tests and checks run

Fresh native Chromium account-adapter QA **13/13 PASS**, existing clean-epoch QA **52/52 PASS**, publication QA **12/12 PASS**, adjacent campaign/Soundings tests **68/68 PASS**, Node UI typecheck **PASS**, app-local Vite build **PASS** (229 client modules). Broad UI typecheck remains **137 pre-existing diagnostics, zero in changed production files**. Staged `git diff --check` **PASS**. Adapter QA covers registration/restart/race, wrong credential, sign-in revision stability, session hint failures, two-owner profile CAS, password change, abort/quota, unavailable and malformed retained data. Existing owner suites were rerun fresh, but G1-G6 implementation evidence is inherited. No real App or first-campaign caller was exercised.

FP-001/002 bound the inert checkpoint; FP-003 reserves pending completion for G7B; FP-004/005/006 cover identity contention/retry and account CAS; FP-011/014 cover retained credential/session validation. FP-012/013/015 remain in freshly rerun owner regressions and require G7B adapter-path evidence. FP-008/009 govern branch/head reporting. No new generalized pattern.

Fresh fetch/prune at inspected source found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (464 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (411/1), administration `210df5bc`/base `fd40571b` (242/1) retain two readiness docs, one prompt-audit doc and one research-evidence doc. Dispositions remain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed. Counts describe inspected source.

## D. Risks and follow-up notes

No first-campaign adapter or production caller selects epoch authority. G7B must retain or prove inapplicable Soundings witness at a prepared first attempt, then implement prepare/publish/consumer completion with restart and exact readback; it must atomically prevent profile/password changes from stranding a pending attempt. G8-G10 App/lifecycle/activation and post-epoch durability remain. Suggested code commit: `feat(persistence): add inert clean-epoch account auth adapter`; handoff commit: `docs(handoff): record G7A account checkpoint and install G7B`. No Game-version decision proposed.

---

Date: 2026-09-30. Source run: **DEV-0.7.1 Slice G6 - Inert Descendant Publication And General Recovery Transactions**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` `692a14f34f34d8f0b1c89e999530f96096d206e4`; code checkpoint `878ca3623c2b5e1a6bab183764acfcfb2e29e05c` and `c6aa39f190ee705765bff4afade75586f23d33a8`. Result: **INERT_ORDINARY_DESCENDANT_RECOVERY_AND_HISTORY_VERIFIED; LIVE_CALLERS_HELD**. Final hosted head requires post-push verification.

## A. Files changed

`apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts`, native `apps/rpg-ui/campaign-clean-epoch-qa.ts`, focused G6 record, current output/handoff/prompt, historical/deferred route, planning reconciliation and branch register. No live caller, deployment, browser data, legacy migration, dependency, combat or Game-version change.

## B. Patch summary

Schema v4 retains each descendant's source, predecessor, immutable artifact and pending/completed recovery. The account-scoped ordinary publisher couples campaign-head and account-revision CAS, first Soundings provenance, exact consumer plans, same-source retry and atomic recovery. Transactional completion applies account history/Chronicle, achievements, Legacy rewards, last played and unique receipts. Current and historical reads validate the complete chain and retain non-head/fork artifacts; pending, raw/unrecovered, stale, closed and malformed states remain nonplayable. Terminal/Normal defeat lifecycle settlement is reserved for G9. Installed **DEV-0.7.1 Slice G7 - Epoch Account, Auth And First-Campaign Orchestration Adapters**.

## C. Tests and checks run

Fresh native Chromium clean-epoch QA **52/52 PASS**, existing publication QA **12/12 PASS**, adjacent campaign/Soundings tests **68/68 PASS**, Node UI typecheck **PASS**, app-local Vite build **PASS** (229 client modules), broad UI typecheck **137 baseline diagnostics, zero changed-file diagnostics**, staged `git diff --check` **PASS**. Focused synthetic QA covers first and second descendants, historical reopen/fork, two-owner contention, stale account/head, retry/restart, each publication/consumer abort and quota boundary, missing evidence and Soundings first provenance. These are inert helper checks, not real App or long-running two-browser acceptance.

FP-001/002 limit helper and parent claims; FP-003 has an inert pending completion owner while production reachability remains G7-G9; FP-004/005/006 cover resource-scoped contention, retry/restart and stale authority; FP-011/012/013/014/015 cover retained source/provenance, unique receipts, full nested snapshot and derived account projection checks; FP-008/009 govern branch/head reporting. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (461 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (408/1), administration `210df5bc`/base `fd40571b` (239/1) retain two readiness docs, one prompt-audit doc and one research-evidence doc. Dispositions remain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; review triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed. Counts describe inspected source.

## D. Risks and follow-up notes

No real App/launcher/save/lifecycle caller uses the epoch. G7-G9 must establish reachable async actions and terminal/reset/delete semantics. G10 owns deployment/reset, long-running capacity, quota/eviction, backup/restore and two-browser ordinary-path acceptance. Slice C combat and planned parent remain held. Suggested code commit: `feat(persistence): add inert descendant recovery transactions`; handoff commit: `docs(handoff): record G6 descendant transactions and install G7`. No Game-version decision proposed.

---

Date: 2026-09-30. Source run: **DEV-0.7.1 Slice G5 - Inert Clean-Epoch Slot Inventory And Verified First-Head Load**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` `80274c0923e5c84cc1e91db45b28806a6088e21a`, code checkpoint `af285bb92af9c81c6fd9147f012dfb5ff674a742`. Result: **FIRST_HEAD_READ_SURFACE_VERIFIED_IN_INERT_EPOCH; DESCENDANT_AND_LIVE_CALLERS_HELD**. Final hosted head requires post-push verification.

## A. Files changed

`apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts`, native `apps/rpg-ui/campaign-clean-epoch-qa.ts`, focused G5 record, current output/handoff/prompt, historical/deferred route, planning reconciliation and branch register. No live caller, schema, browser user data, deployment, dependency, gameplay or Game version change.

## B. Patch summary

Readonly account-scoped `listSlots` and `readSlot` distinguish empty, prepared, pending consumers, playable completed first head, closed head and unsupported descendant. Exact first artifact, slot/control/head, independent Soundings witness, unique applied consumer receipts and retained first run address are required before returning a snapshot/session control. Failed reads never become empty/default or legacy fallback. Descendant history remains retained and nonplayable pending G6. Installed **DEV-0.7.1 Slice G6 - Inert Descendant Publication And General Recovery Transactions**.

## C. Tests and checks run

Fresh native Chromium clean-epoch QA **42/42 PASS**, existing publication QA **12/12 PASS**, adjacent campaign/Soundings tests **68/68 PASS**, Node UI typecheck **PASS**, app-local Vite build **PASS** (229 modules), broad UI typecheck **137 baseline diagnostics with zero in changed store**, staged `git diff --check` **PASS**. Synthetic helper QA does not accept real callers or long-running capacity. FP-001/002 limit claims; FP-003/004/005/006 cover explicit block, contention/restart and stale authority; FP-011/012/013/014/015 cover provenance, unique receipts, full nested snapshot and retained history; FP-008/009 govern branch/head accounting. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (459 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (406/1), administration `210df5bc`/base `fd40571b` (237/1) retain two readiness docs, one prompt-audit doc and one research-evidence doc. Dispositions remain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; review triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed. Counts describe inspected source.

## D. Risks and follow-up notes

No real App/launcher/save/lifecycle caller selects epoch authority. Descendant publication/consumer completion, non-head/fork playable history, async callers, account reset/delete, backup/restore, dynamic quota/eviction and two-browser long-run capacity remain. Slice C combat/parent acceptance held. Suggested commit: `feat(persistence): add inert clean-epoch first-head slot reads`. No Game-version decision proposed.

---

Date: 2026-09-30. Source run: **Clean-Epoch Async Caller Ownership And Activation Package Decision**. Label class: unversioned cross-owner decision; parent development milestone not applicable, planned `DEV-0.7.1` held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` `631477f168ef9f828e053a7384a0b5aa9c4fecc6`. Result: **ASYNC_CALLER_ROUTE_SELECTED; LIVE_ACTIVATION_HELD**. Final hosted head requires post-push verification.

## A. Files changed

Focused `docs/design/clean-epoch-async-caller-ownership-and-activation-package-decision.md`; current prompt, output/handoff, historical/deferred route, planning reconciliation and branch register. No production code, browser data, deployment, dependency, gameplay or Game version changes.

## B. Patch summary

Fresh source inspection maps legacy launcher/auth, profile/credential, attempt, save/list/load/recovery, App bootstrap/action and lifecycle callers. G4 supplies only an inert complete first-publication transaction; there is no account-scoped epoch slot inventory/load, general descendant/account consumer owner, or epoch reset/delete. Selected bounded G5 read surface before G6 descendant/history and G7-G9 async caller packages; G10 coordinates activation and post-epoch two-browser/long-run capacity, quota/eviction and backup/restore gates. Installed **DEV-0.7.1 Slice G5 - Inert Clean-Epoch Slot Inventory And Verified First-Head Load**. Sole-user pre-cutover data stays disposable; new-epoch durability is mandatory.

## C. Tests and checks run

Fresh code/doc/branch inspection and staged `git diff --check` only; no new browser QA, typecheck or build in this docs-only pass. G4 native Chromium 35/35, publication 12/12, adjacent 68/68, Node typecheck and Vite build are reused evidence, not acceptance of real callers. FP-001/002 limit claims; FP-003/004/005/006 require failure, contention and retry; FP-011/012/013/014/015 govern provenance, complete receipts and nested history; FP-008/009 govern branch/head reporting. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (458 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (405/1), administration `210df5bc`/base `fd40571b` (236/1) retain two readiness docs, one prompt-audit doc and one research-evidence doc. Dispositions remain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; triggers are scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. None consumed; no branch integration, deletion, PR or disposition action due/performed. Counts describe inspected source.

## D. Risks and follow-up notes

No real caller uses epoch authority; activation and development reset remain held. General descendant publication, non-head/fork history, async App/auth/lifecycle, reset/delete, backup/restore and long-running capacity are separate gates. Slice C combat/parent acceptance held. Suggested commit: `docs(persistence): decide async caller packages and install G5`. No Game-version decision proposed.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice G4 - Clean-Epoch Account Consumer Completion Transactions**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `f23670f1ffa29465798b84f86d9604b0f1e1280d`; code checkpoint `920f6301`. Result: **FIRST_CAMPAIGN_CONSUMERS_COMPLETE_IN_INERT_EPOCH; LIVE_CALLER_ACTIVATION_HELD**. Final hosted head requires post-push verification.

## A. Files changed

`cleanEpochAccountStore.ts`, `campaignIndexedDbStore.ts` and `campaign-clean-epoch-qa.ts` implement and verify the inert account-consumer completion transaction. New focused G4 record; current output/handoff/prompt, historical/deferred route, planning reconciliation and branch register. No live caller, user browser data, deployment, dependency, gameplay or game-version change.

## B. Patch summary

First publication now validates every applicable new-campaign plan and retained fingerprint. Completion atomically applies full account achievement/history, preparation, optional one-use inheritance, last-played and exact applied receipts with the completed recovery record. Same-source retry/restart, account revision conflicts, abort/quota and missing Soundings provenance fail closed. Installed unversioned **Clean-Epoch Async Caller Ownership And Activation Package Decision** to select ordered live-caller packages from actual source.

## C. Tests and checks run

Fresh native Chromium clean-epoch QA **35/35** and existing publication QA **12/12**; adjacent campaign/Soundings tests **68/68**; Node UI typecheck **PASS**; app-local Vite build **PASS** (229 modules); broad UI typecheck **137 baseline diagnostics**, zero in changed source; staged `git diff --check` **PASS**. Synthetic helper checks do not accept live callers or long-running capacity.

FP-001/002 limit helper and parent claims; FP-003/004/005/006 cover reachable completion, contention, retry and stale head; FP-011/012/013/014/015 govern provenance, duplicate receipts, nested state and derived facts. FP-008/009 govern branch/head accounting. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (456 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (403/1), administration `210df5bc`/base `fd40571b` (234/1) retain unique docs and dispositions `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition change due/performed. Counts describe inspected source.

## D. Risks and follow-up notes

No real App/launcher/save caller selects the new epoch. A concurrent account revision change during pending recovery blocks completion; live callers need ordered writes or a separately proven repair. Account reset/delete, backup/restore, quota/eviction and two-browser long-running acceptance remain. Slice C capacity, combat and parent acceptance remain held. Suggested commit: `docs(handoff): record G4 consumer checkpoint and install caller decision`. No game-version decision proposed.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice G3 - Clean-Epoch Publication Recovery And Consumer Transactions**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `d31ab58331e1da401ac4e61f33f0ee4bfe3e3ed2`; code checkpoint `a49acbc4`. Result: **FIRST_PUBLICATION_RECOVERY_CHECKPOINT_IMPLEMENTED; CONSUMER_COMPLETION_AND_ACTIVATION_HELD**. Final hosted head requires post-push verification.

## A. Files changed

`campaignIndexedDbStore.ts`, `cleanEpochAccountStore.ts` and `campaign-clean-epoch-qa.ts` add the inert transactional checkpoint and QA. New focused G3 record; current output/handoff/prompt, historical/deferred route, planning reconciliation and branch register. No live caller, user browser data, deployment, dependency, gameplay or game-version change.

## B. Patch summary

Clean-epoch schema v3 retains typed pending recovery atomically with first artifact/head/slot and Soundings witness. First publication requires exact retained account/attempt, unchanged account revision, empty destination and required history plan. Same-source retry/restart reads exact accepted publication and pending recovery; stale or malformed links, head conflict, abort and quota fail closed. Account consumers are explicitly pending. Installed **DEV-0.7.1 Slice G4 - Clean-Epoch Account Consumer Completion Transactions** for the coupled remainder.

## C. Tests and checks run

Fresh native Chromium clean-epoch QA **27/27**, rerun after final guard; v1 publication QA **12/12**; adjacent campaign/Soundings tests **68/68**; Node UI typecheck **PASS**; app-local Vite build **PASS** on isolated rerun (229 modules). A concurrent build attempt had a transient HTML path failure. Broad UI typecheck has **137 baseline diagnostics**, zero in changed files. `git diff --check` **PASS**. Synthetic helper proof does not accept live callers or capacity.

FP-001/002 limit helper and parent claims; FP-003/004/005/006 cover pending recovery, contention, retry and stale head; FP-011/012/013/014/015 govern provenance and complete nested authority. FP-008/009 govern branch/head accounting. G4 still owns consumer evidence. No new generalized failure pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (454 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (401/1), administration `210df5bc`/base `fd40571b` (232/1) retain their unique docs and dispositions `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition change due/performed. Counts describe inspected source.

## D. Risks and follow-up notes

The accepted first publication remains `accepted_pending_consumers`, so no clean-epoch campaign is complete. G4 must atomically apply complete profile/Chronicle/Legacy consumer plans with revision, retry and Soundings checks. Later real async caller cutover, reset/delete, backup/restore and long-running two-browser capacity are separate gates. Slice C capacity, combat and parent acceptance remain held. Suggested commit: `docs(handoff): record G3 publication checkpoint and install G4`. No game-version decision proposed.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice G2 - Clean-Epoch Attempt And Recovery Transactions**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `a7a0969bebe48c3a36a2760e4c46d31d5b8fcc3d`; code checkpoint `8affd8c428d3d4a643246df527ac84f5e7b27666`. Result: **ACCOUNT_SLOT_ATTEMPT_CHECKPOINT_IMPLEMENTED; RECOVERY_CONSUMERS_AND_ACTIVATION_HELD**. Final hosted head will be verified after handoff push.

## A. Files changed

`cleanEpochAccountStore.ts` and `campaign-clean-epoch-qa.ts` implement and verify the inert v2 account-slot attempt reservation. New focused G2 record; current output/handoff/prompt, historical/deferred route, planning reconciliation and branch register. No live caller, browser user data, deployment, dependency, gameplay or game-version change.

## B. Patch summary

The new-epoch database now stores a typed `prepared` new-campaign attempt keyed by account and slot. A single write transaction validates complete retained account authority, expected account revision, exact attempt identity and snapshot/consumer plans, empty slot and absent campaign control. Same-source retry and restart recover the exact record; regenerated or competing attempts conflict; abort/quota cannot leave partial data. Version-1 account data upgrades to schema v2. No new-epoch publication, recovery or consumer-completion API is exposed. The active G2 prompt permits this tested `S` checkpoint; **DEV-0.7.1 Slice G3 - Clean-Epoch Publication Recovery And Consumer Transactions** is installed for the coupled remainder.

## C. Tests and checks run

Fresh native Chromium clean-epoch QA **18/18**, existing publication QA **12/12**, adjacent campaign/Soundings tests **68/68**, Node UI typecheck **PASS**, app-local Vite build **PASS** (229 modules), broad UI typecheck **137 baseline diagnostics** with zero in changed files, staged `git diff --check` **PASS**. Synthetic fixture and QA browser/server were removed after testing. No user campaign data or hosted deployment was touched. The focused G2 record lists exact cases and limits.

FP-001/002 prohibit live-caller or parent acceptance from helper QA. FP-003/004/005 require reachable pending recovery, account-slot contention and lost-caller retry; FP-006/011/012/013/014/015 govern later publication, Soundings and full nested account/history authority. FP-008/009 govern branch/head accounting. No new generalized pattern was added.

Fresh fetch/prune at inspected source found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (452 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (399/1), administration `210df5bc`/base `fd40571b` (230/1) retain their unique docs and dispositions `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Review triggers: scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition change was due/performed.

## D. Risks and follow-up notes

Prepared attempts reserve an account slot but cannot yet publish or complete. G3 must couple publication, pending recovery, first Soundings witness/artifact and profile consumers before any accepted new-epoch campaign; later real async callers, reset/delete, backup/restore, long-run two-browser capacity and activation remain. Slice C capacity, combat and parent acceptance stay held. Suggested commit: `docs(handoff): record G2 attempt checkpoint and install G3`. No game-version decision proposed.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice G1 - Clean-Epoch Transactional Account Store Extension**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `04d36930b8e5dd53f8508e820ddb41e8a37d64e2`; code checkpoint `b1aa1ec405d3ba41c15d69f77fc07ab983f3bc45`. Result: **CLEAN_EPOCH_ACCOUNT_CHECKPOINT_IMPLEMENTED; ATTEMPT_RECOVERY_AND_ACTIVATION_HELD**. Final hosted head will be verified after handoff push.

## A. Files changed

`campaignIndexedDbStore.ts` shares its four-store publication schema; new `cleanEpochAccountStore.ts` and `campaign-clean-epoch-qa.ts`/`.html` supply an inert distinct database and native QA. New focused G1 record; current output/handoff, historical/deferred route, planning reconciliation, branch register and installed G2 prompt. No live caller, browser user data, deployment, dependency, gameplay or game-version change.

## B. Patch summary

The new `lineage.campaigns.epoch1` database has an atomic account record holding complete profile and PBKDF2 credential. Registration, profile and credential revision updates, exact duplicate retry, stale/conflict rejection, list/read validation and selected-account hint readback are isolated from legacy storage. No attempt/recovery transaction or new-epoch publication is exposed yet; the installed prompt explicitly permits this tested account checkpoint and routes those coupled records to **DEV-0.7.1 Slice G2 - Clean-Epoch Attempt And Recovery Transactions**. Full post-epoch durability and real async caller work remain required.

## C. Tests and checks run

Fresh native Chromium clean-epoch QA **10/10**, existing publication QA **12/12**, adjacent campaign/Soundings tests **68/68**, Node UI typecheck **PASS**, app-local Vite build **PASS** (229 modules), broad UI typecheck **137 baseline diagnostics** with zero in changed owner files, staged `git diff --check` **PASS**. The synthetic fixture was removed and QA server/tab closed. No hosted deployment or user campaign data was touched. The focused G1 record identifies the exact browser and failure-boundary cases.

FP-001/002 constrain real-caller and parent claims; FP-003/004/005/006 remain G2/later repair, contention, retry and stale-projection gates. FP-008/009 apply to branch/head accounting; FP-012 covers duplicate/conflicting registration; FP-013/014/015 constrain complete nested account/campaign authority. No new generalized failure pattern was added.

At code checkpoint after fresh fetch/prune, one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls) were inspected. Readiness `59c103c3`/base `895c02df` (451 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (398/1), administration `210df5bc`/base `fd40571b` (229/1) retain unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition change due/performed.

## D. Risks and follow-up notes

No App/launcher/save caller imports the store, and helper QA cannot prove live cutover, reset/delete, long-run capacity or two-browser behavior. The account owner rejects incomplete retained profiles; attempts, recovery/consumers, account-checked publication and later reset/delete still need implementation. Slice C capacity, combat and parent acceptance remain held. Suggested commit: `docs(handoff): record G1 account checkpoint and install G2`. No game-version decision proposed.

---

Date: 2026-09-29. Source run: **Development-Only Clean Persistence Epoch Route Decision**. Label class: unversioned owner-policy decision; planned parent `DEV-0.7.1` held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `18ef8008e398cf13c316374a403d7069e7fedc7d`. Result: **CLEAN_DEVELOPMENT_EPOCH_ROUTE_ACCEPTED; IMPLEMENTATION_AND_ACTIVATION_HELD**.

## A. Files changed

New focused clean-epoch route decision; supersession notes in writer-fence, migration, canonical and retention decisions; current prompt/output/handoff, historical register, planning reconciliation and branch register. No source, browser storage, deployment, dependency, gameplay or game-version change.

## B. Patch summary

The owner confirms a sole-user development/testing deployment and waives *all* pre-cutover browser-local test data. A deliberate close/reload and origin-specific reset at eventual activation replaces technical all-old-tab exclusion and legacy migration gates. Use a fresh versioned IndexedDB database plus epoch-specific account/session keys, with no legacy fallback. Keep inert Slice E/F history, but do not activate an importer. After cutover, preserve complete campaign/world/lineage/Chronicle/history, non-head/fork artifacts, first Soundings provenance, account/attempt/recovery semantics, backup/restore and long-running capacity. Installed inert **DEV-0.7.1 Slice G1 - Clean-Epoch Transactional Account Store Extension**. No reset was performed.

## C. Tests and checks run

Fresh fetch/prune; exact branch and unique-path inventory; [zero-open-PR readback](https://github.com/vagabond1215/Lineage_Reforged/pulls); current schema, caller and authority review; documentation diff and `git diff --check`. No test, build, typecheck, native browser execution, Sites mutation or user-data read in this decision. Slice F's browser 14/15/12, adjacent 68 tests, Node typecheck and Vite build are reused evidence. Broad UI 137 diagnostics remain a known baseline, not a fresh green result. FP-001/002/003/004/005/006/011/012/013/014/015 are future post-epoch/caller constraints; FP-008/009 apply to branch/head review.

One local/four hosted branches and zero open PRs inspected. Readiness `59c103c3`/base `895c02df` (449 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (396/1), administration `210df5bc`/base `fd40571b` (227/1) retain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. No disposition change, integration, deletion, PR or branch action due/performed.

## D. Risks and follow-up notes

The operational close/reset is a sole-user development cutover assumption, not software proof that an arbitrary same-origin old script cannot run. New authority must stay isolated from legacy writes and fail closed. G1 does not activate it. Post-epoch capacity, real caller, two-browser, recovery and rollback/backup acceptance still gate activation/parent. Suggested commit: `docs(decision): accept development clean persistence epoch`. No game-version decision proposed.

---

Date: 2026-09-29. Source run: **Legacy Writer Fence And Async Caller Cutover Feasibility Decision**. Label class: unversioned documentation decision; planned parent `DEV-0.7.1` held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `37549a2cc6b82eb090df9384aa23aa1dc74a2fc1`. Result: **SAME_ORIGIN_OLD_WRITER_EXCLUSION_UNPROVEN; CLEAN_EPOCH_ALLOWED_IN_PRINCIPLE; ACTIVATION_HELD**. Final hosted head is verified after documentation push.

## A. Files changed

New `docs/design/legacy-writer-fence-and-async-caller-cutover-feasibility-decision.md`; owner-policy supersession notes in the focused canonical and migration decisions; current output/handoff, historical/deferred route, planning reconciliation, branch register and installed successor prompt. No production code, deployment, browser user data, dependency or game-version change.

## B. Patch summary

The owner selected the existing origin and waived backward preservation/migration/export of pre-cutover legacy saves; new-epoch saves and long-running history remain fully durable. Direct synchronous legacy writers remain in save, profile, attempt, launcher and lifecycle owners. The configured owner-only Sites preview has a successful version-2 deployment dated 2026-09-02; its source SHA is absent from this checkout and deployment metadata provides no open-tab/old-client barrier. New markers or cooperative signals cannot stop already-open old scripts, and IndexedDB/localStorage share no transaction. An isolated new database plus versioned auth/account namespace could make old writes non-interfering, but neither exact old-bundle capability nor literal old-writer exclusion is proven. The full earlier G migration package is not admitted; installed **Clean Persistence Epoch Namespace And Deployed Old-Client Capability Decision** as the next bounded route. No old keys were deleted.

## C. Tests and checks run

Fresh fetch/prune, exact branch divergence and unique-path inventory, [zero-open-PR readback](https://github.com/vagabond1215/Lineage_Reforged/pulls), current source/caller/hosting-config inspection, read-only Sites project/version/deployment metadata, and documentation diff check. No test, build, typecheck, native browser migration probe or user-data read was run in this docs-only decision. Slice F's Chromium 14/15/12 suites, 68 adjacent tests, Node typecheck and Vite build are **reused prior evidence**; broad UI typecheck's 137 diagnostics remain a baseline, not a green result. Detailed fresh evidence and limits are in the focused decision.

FP-001/002/003/004/005/006/009/011/012/013/014/015 apply as future real-caller, parent, repair, contention, retry, stale authority, provenance and nested-history constraints; FP-008 applies to semantic branch review. No new generalized pattern is needed.

One local/four hosted branches and zero open PRs were inspected. Readiness `59c103c3`/base `895c02df` (448 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (395/1), administration `210df5bc`/base `fd40571b` (226/1) retain their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. No trigger consumed, integration, deletion, PR or disposition change due/performed.

## D. Risks and follow-up notes

Same-origin all-old-tab exclusion cannot be proved from the present app or Sites metadata. A disjoint namespace is only a candidate non-interference boundary and cannot silently replace the owner's stated exclusion requirement. New-epoch account/credential transition and actual published-bundle capabilities need a separate decision. Slice C capacity, live activation, combat admission and parent acceptance stay held. Suggested commit: `docs(decision): hold same-origin cutover at old-client boundary`. No game-version decision proposed.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice F - Inert Canonical Materialization And Exact Readback**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `122082a611bf72b981a5f783b12c5506ceec5519`. Result: **INERT_CANONICAL_MATERIALIZATION_IMPLEMENTED; ACTIVATION_HELD**. Code checkpoint `d81c5ea2`; final hosted head is verified after handoff push.

## A. Files changed

Additive schema version 3 in `apps/rpg-ui/src/game-shell/campaignIndexedDbStore.ts`; new injected-source `legacyCanonicalMaterializationStore.ts`; synthetic native-browser `campaign-canonical-qa.html` and `.ts`; focused Slice F record, current output/handoff, historical/deferred route, planning reconciliation, branch register and successor prompt. No live caller import, source-key write, user data, dependency, combat or game-version change.

## B. Patch summary

Generation-scoped inert canonical records/manifests preserve exact source keys, UTF-16 raw values and digests across account and origin-unscoped families. Byte-verified Slice-E staging, graph/blocker analysis, provisional atomic scope write, independent close/reopen exact readback, source recensus, same-source retry and changed-source separation fail closed. Existing v1/v2 stores remain operational; no authority selector exists. Installed unversioned **Legacy Writer Fence And Async Caller Cutover Feasibility Decision** before live caller mutation.

## C. Tests and checks run

Fresh native Chromium canonical QA **14/14 PASS**; existing legacy-copy QA **15/15 PASS**; existing v1 publication QA **12/12 PASS** after v3 upgrade. Adjacent campaign/Soundings tests **68/68 PASS**. Node config typecheck **PASS**; Vite production build **PASS** (229 modules); staged diff check **PASS**. Broad UI typecheck **FAIL** with 137 known baseline diagnostics and zero in changed owner files. The first QA rerun found same-source final-manifest retry and blocked-upgrade error-code defects; both were fixed before final green evidence. Detailed fixtures, cases and limits: `docs/dev/dev-0.7.1-slice-f-inert-canonical-materialization-record.md`.

FP-001/002/003/004/005/006/009/011/012/013/014/015 apply: isolated QA does not accept the parent; account-wide blockers, exact source/provenance, conflict, lost-state retry and independently retained first Soundings witness/artifact were exercised or held for real caller repair as named in the focused record. FP-008 applies to semantic branch review. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (446 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (393/1), administration `210df5bc`/base `fd40571b` (224/1) retain only their registered unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Exact review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. No trigger consumed, disposition change, integration, deletion or PR action due/performed.

## D. Risks and follow-up notes

Older open clients remain unfenced; activation, async caller conversion, reset/delete, export/restore, production repair, two-browser long-run capacity and combat acceptance remain held. Slice C capacity failure persists. Suggested handoff commit: `docs(handoff): record Slice F and writer-fence route`. No `GAME_VERSION` or parent acceptance; no separate game-version decision proposed.

---

Date: 2026-09-29. Source run: **Legacy Campaign Canonical Materialization And Activation Boundary Decision**. Label class: unversioned documentation decision; planned parent `DEV-0.7.1` held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `307be4860c5fb7ca2ade90461ae57873a32cfbea`. Result: **CANONICAL_MATERIALIZATION_CONTRACT_ACCEPTED; ACTIVATION_HELD**. Final committed and hosted head are verified after push.

## A. Files changed

New `docs/design/legacy-campaign-canonical-materialization-and-activation-boundary-decision.md`; current output/handoff, historical/deferred route, planning reconciliation, branch register and installed successor prompt. No source, test, schema, browser user data, dependency or game-version change.

## B. Patch summary

Selected additive IndexedDB version-3 generation-scoped inert canonical records and manifest with exact source raw/digest preservation, queryable identities for all current families, non-head/fork artifacts, every slot, pending recovery/candidate/attempt, independent first Soundings witness/artifact, v6 group, full account profile/consumers and unknown quarantine. Separate exact close/reopen/restart readback and account-wide graph validation precede any selection. Mapped save/profile/attempt/launcher/App/runLifecycle synchronous callers to later async ownership and pending/error states. Activation requires source re-enumeration, repair completion, old-writer fencing, account reset/delete tombstone, export/restore and epoch-bound account selection. A new marker cannot force an older open tab to stop writing; activation stays held. Installed **DEV-0.7.1 Slice F - Inert Canonical Materialization And Exact Readback** only.

## C. Tests and checks run

Fresh fetch/prune, branch merge-base/unique-path inventory, scoped GitHub open-PR readback, live source/caller and authority inspection, and `git diff --check` after documentation edit. No tests, build, typecheck, native browser QA or user-data mutation were run in this docs-only decision. Slice E's 15/15 new and 12/12 existing Chromium QA, 68/68 adjacent tests, Node config typecheck and Vite build are **reused prior evidence**. Broad UI typecheck's 137 diagnostics remain a known baseline, not a green result.

FP-001/002/003/004/005/006/009/011/012/013/014/015 apply as future acceptance constraints: the decision names real caller and reachable repair owners, account-wide contention, lost-state retry, stale authority, exact source/provenance, complete duplicate and nested history checks. It does not claim those tests were executed now. No new generalized pattern is needed.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (445 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (392/1), administration `210df5bc`/base `fd40571b` (223/1) retain unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. None consumed; no branch integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Old uncooperative tabs and cross-API non-atomic writes still prevent activation. Slice F must remain inert; later caller conversion, reset/delete, source fence, export/restore, two-browser long-run workload and combat admission are separate. Slice C capacity failure and parent hold persist. Suggested commit: `docs(decision): define canonical materialization boundary`. No `GAME_VERSION` or parent acceptance; next recommended run is Slice F, with no separate game-version decision now.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice E - Inert Legacy Authority Copy And Verification**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `87ddc774dec662bdc68d0ae30428505ff0c5d0c2`. Result: **INERT_COPY_IMPLEMENTED; ACTIVATION_HELD**. Code checkpoint and final hosted head are resolved after commit/push.

## A. Files changed

Additive v2 schema and shared database opener in `campaignIndexedDbStore.ts`; new isolated `legacyCampaignCopyStore.ts`; validator exports in `saveManager.ts` and `accountProfileManager.ts`; native legacy-copy QA page/script and v2-aware existing QA script; focused Slice E record; current output/handoff, historical/deferred route, planning reconciliation, branch register and installed successor prompt. No App/launcher import, user data, production dependency, content, combat or game-version change.

## B. Patch summary

An injected `Storage` source is copied into inert `legacyCopyRecords` and a provisional manifest. Exact UTF-16 raw values, all relevant account/legacy namespaces and unknown/malformed entries survive. Double source enumeration, one IndexedDB staging transaction, close/reopen readback, final source comparison, same-source retry, distinct changed-source generations, stale status and named semantic blockers make copy failures explicit. Existing v1 publication stores remain operational. A verified manifest is not an activation marker. The successor is the unversioned **Legacy Campaign Canonical Materialization And Activation Boundary Decision**.

## C. Tests and checks run

Native in-app Chromium: Slice E copy QA **15/15 PASS**; existing v1 publication QA after v2 upgrade **12/12 PASS**. Adjacent campaign persistence/Soundings **68/68 PASS**. Node config typecheck **PASS**; Vite production build **PASS**, 229 client modules. Broad UI typecheck **FAIL**, 137 baseline diagnostics and zero in changed files. Diff check **PASS**. The first existing QA rerun reached 11/12 because its blocked-upgrade fixture still requested version 2; targeting version 3 restored the intended test, 12/12. No second-browser, natural quota, live caller, export/restore or long-run workload acceptance is claimed. Detailed evidence: `docs/dev/dev-0.7.1-slice-e-inert-legacy-authority-copy-record.md`.

FP-001/002/003/004/005/006/009/011/012/013/014/015 applied: isolated tests do not accept parent; account-wide contention, source mutation, crash/retry and independently retained first Soundings artifact are exercised; actual caller/repair completion remain future gates. No new pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` / base `895c02df` (444 master-only/2 ref-only), prompt-integrity `58a34e37` / base `3d77171c` (391/1), administration `210df5bc` / base `fd40571b` (222/1) retain unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Copy is inert and account receipts/v6 conversion can remain blocked. `localStorage` has no cross-tab freeze; activation needs source recheck, old-writer fencing and a complete canonical schema. Account reset/delete, async App/launcher callers, export/rollback and two-browser long-run capacity remain open; Slice C capacity and combat holds persist. Suggested commit: `feat(storage): add inert legacy authority copy`. No `GAME_VERSION` or parent acceptance; no separate game-version decision proposed now.

---

Date: 2026-09-29. Source run: **Legacy Campaign Store Migration Boundary Decision**. Label class: unversioned documentation decision; planned parent `DEV-0.7.1` held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `a2ce0de324fe7c04fc43a9b28d573616c0095e2e`. Result: **MIGRATION_COPY_CONTRACT_ACCEPTED; ACTIVATION_HELD**. Final publication/live head is verified after push.

## A. Files changed

New focused `docs/design/legacy-campaign-store-migration-boundary-decision.md`; current output, handoff, historical/deferred route, planning reconciliation, branch register and installed successor prompt. No production code, schema, test, user save, account, dependency or version change.

## B. Patch summary

Inventoried v7 artifact/control/slot/candidate/recovery/witness, v6 and obsolete keys, migration receipt/source, account profile/history/consumers, new-campaign attempts, active pointer, launcher auth and preferences from live owner/caller paths. Accepted additive IndexedDB v2 inert exact-raw staged copy and account-wide verification, with malformed/unknown evidence retained and no live caller cutover. Version 1 cannot import all retained history or account state. Later activation requires complete canonical records, async callers, stale-tab fencing, restart readback, export/rollback and account reset/delete coordination. Installed **DEV-0.7.1 Slice E - Inert Legacy Authority Copy And Verification** only; Slice C capacity and combat holds persist.

## C. Tests and checks run

Fresh fetch/prune, exact source/head and branch inventory, zero-open-PR GitHub readback, focused source/authority review and `git diff --check` after documentation edit. No tests, build, typecheck, native browser QA or user-data probe run in this documentation-only decision. Slice D's Chromium 12/12, adjacent 68/68, Vite build and Node config typecheck are **reused prior evidence**; broad UI typecheck's 137 diagnostics are a known baseline, not green.

FP-001/002/003/004/005/006/009/011/012/013/014/015 applied as migration contract guards: real caller and restart gates remain future implementation obligations; current decision maps account-wide recovery, complete evidence, independently retained Soundings first artifact, preserved nested/account history, source/hosted identities and fail-closed staging. No new generalized failure pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` / base `895c02df` (443 master-only/2 ref-only), prompt-integrity `58a34e37` / base `3d77171c` (390/1), administration `210df5bc` / base `fd40571b` (221/1) retain their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Stage E will not activate IndexedDB or resolve dynamic capacity. Cross-tab source writes can invalidate a captured generation; quarantine and retry are required. Account reset/delete currently omit attempt and IndexedDB data, so cutover must close that path. First Soundings witness and artifact, non-head/fork history, pending consumers and unknown keys cannot be dropped. Suggested commit: `docs(decision): define inert legacy campaign copy boundary`. No `GAME_VERSION` or parent acceptance; next recommended run is Slice E, with later activation and a separately measured game-version decision only when player-facing criteria warrant it.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice D - Transactional Campaign Store Foundation**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `54c4595f122b194d33a520352b11ed43e755632e`. Result: **TRANSACTION_FOUNDATION_IMPLEMENTED; LIVE_CUTOVER_HELD**. Implementation checkpoint and final hosted head are resolved after commit/push.

## A. Files changed

New IndexedDB owner `apps/rpg-ui/src/game-shell/campaignIndexedDbStore.ts`; existing guard/type exports in `saveManager.ts`; native QA page and fixture helper; focused implementation record; this output, handoff, historical/deferred register, planning reconciliation, branch register and installed successor prompt. No live caller, legacy save, dependency, content, shared schema, combat or game-version change.

## B. Patch summary

Version 1 IndexedDB schema has account-scoped artifact/control/slot/witness records and indexes. One async publication transaction validates exact expected head, retained predecessor artifact, v7 envelope/snapshot identities, slot, immutable conflicts and independent applied Soundings provenance; it commits all required records or aborts. Post-commit readback verifies raw artifact/address and control/witness. Same-source retry is idempotent. Failure codes distinguish unavailable, blocked upgrade, quota, abort, stale head, conflict, invalid record and readback failure. Current synchronous localStorage callers remain unchanged. The installed successor is the unversioned **Legacy Campaign Store Migration Boundary Decision** before any copy/cutover.

## C. Tests and checks run

Native Codex in-app Chromium QA: **12/12 PASS** with synthetic production-owner fixtures, including first and descendant Soundings, write-by-write abort, injected quota, stale/conflict/malformed, reopen/retry and blocked/unavailable. Adjacent campaign persistence and Soundings recovery: **68/68 PASS**. Production Vite build: **PASS**, 229 client modules; Node config typecheck: **PASS**. Broad UI typecheck: **FAIL**, known 137 diagnostics, zero in changed source files. Diff check: **PASS**. Command-line headless Edge/Chrome GPU startup failed before page load; native in-app browser QA completed instead. Natural quota, second browser, live save cutover and long-run stress remain untested. Detailed evidence and reproduction route: `docs/dev/dev-0.7.1-slice-d-transactional-campaign-store-foundation-record.md`.

FP-002/004/005/006/009/011/012/014/015 applied: green tests do not accept parent; account/slot and predecessor conflicts fail closed; reopen and retry preserve exact bytes; source and publication heads remain distinct; validators and retained first-publication witness/artifact control authority. FP-003 is a later migration/caller gate. No new pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` / base `895c02df` (441 master-only/2 ref-only), prompt-integrity `58a34e37` / base `3d77171c` (388/1), administration `210df5bc` / base `fd40571b` (219/1) retain their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

The backend is not activated and has no browser capacity acceptance. The 5 MiB Slice C localStorage failure and combat hold remain. Next work must inventory all legacy families and define verified non-activating copy, activation, rollback and async caller ownership without deleting user data. Suggested commit: `feat(storage): add transactional IndexedDB campaign foundation`. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` and planned parent unchanged.

---

Date: 2026-09-29. Source run: **Ordinary Campaign Publication Capacity And Retention Contract Decision**. Label class: unversioned cross-cutting documentation decision; parent `DEV-0.7.1` remains planned/held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `a16523d8e08b14816a75db95e0b135c09ae40fc9`. Result: **RETENTION_BOUNDARY_ACCEPTED; HIGHER_CAPACITY_BACKEND_REQUIRED; COMBAT_ADMISSION_HELD**.

## A. Files changed

Focused `docs/design/ordinary-campaign-publication-capacity-and-retention-contract-decision.md`, this output, current GPT handoff and installed next prompt, historical/deferred register, planning reconciliation and branch register. No production, test, save, content, dependency or version edit.

## B. Patch summary

Slice C's 5 MiB quota is classified as a current `localStorage` constraint, not a product campaign-size limit. The inventory preserves immutable artifacts, non-head slots, Soundings first-publication witness/artifact, migration source/receipt and account history. Completed candidate envelopes alone are conditionally redundant after exact artifact, recovery, witness, consumer and cross-slot checks; cleanup is only a bridge. At action 50, subtracting all 2,545,248 candidate bytes would leave an arithmetic 2,605,580-byte store, while 2,544,942 artifact bytes remain. Long-running campaigns require a higher-capacity backend. IndexedDB is selected for transactional local campaign/account authority, with dynamic quota, export/rollback and async caller migration gates. No backend implementation or candidate deletion occurred. The next installed prompt is `DEV-0.7.1 Slice D - Transactional Campaign Store Foundation`.

## C. Tests and checks run

Read-only live source/caller and key-family trace, exact Slice C JSON arithmetic, official browser-storage reference review, branch/PR inventory, documentation diff and `git diff --check`. The earlier Slice C probe/38 tests/lint/build are **reused evidence**, not rerun. No new probe, test, build, typecheck, browser QA save or migration was run in this documentation decision. FP-002: the failed capacity gate still holds the parent. FP-003/004/005/006: recovery, slot-wide contention, lost-caller retry and newer-address precedence are explicit. FP-008/009: protected refs and source versus publication identity are separated. FP-011/012/013/014/015: migration must preserve witness priority, complete duplicate evidence and nested owner history; no mutable-digest shortcut. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` / base `895c02df` (437 master-only/2 ref-only), prompt-integrity `58a34e37` / base `3d77171c` (384/1), administration `210df5bc` / base `fd40571b` (215/1) retain their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions. Review triggers remain readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

IndexedDB has browser/device-dependent quota and possible eviction; native browser, migration, export/restore and long-run tests remain mandatory. The next Slice D is a foundation checkpoint only and cannot clear current capacity or combat gates. Future slices own verified copy/cutover, async callers, candidate cleanup and account-wide stress. Suggested commit: `docs(decision): require higher-capacity campaign persistence`. No game-version or parent acceptance.

---

Date: 2026-09-29. Source run: **Ordinary Campaign Publication Capacity And Retention Direction Clarification**. Label class: unversioned cross-cutting coordination; parent `DEV-0.7.1` remains planned and held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `f0d8b4c82ba3683e1ec0a5df084625423f0d6a6e`. Result: **DIRECTION_RECORDED; RETENTION_DECISION_NOT_STARTED**.

## A. Files changed

Installed decision prompt, Slice C focused preflight record, this output, current GPT handoff, historical/deferred register, planning reconciliation and branch disposition register. No production, test, schema, content, save or version change.

## B. Patch summary

The project owner clarified that the measured 5 MiB ceiling constrains current persistence, not product campaign length. The installed decision now separately requires proof of genuinely redundant copies eligible for bounds and a long-running-campaign backend-capacity/migration disposition. Legitimate durable history remains protected. The Slice C measurements remain historical evidence; the retention decision itself was not executed.

## C. Tests and checks run

Documentation diff/readback and `git diff --check` only; no executable tests or browser campaign mutation. FP-002/008/009/011/012/014/015: capacity failure remains explicit, measured source and authority identities remain separated, and no accepted source, witness, history or newer head is declared disposable. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches, and the scoped GitHub PR page showed zero open PRs; retained readiness `59c103c3` and prompt-integrity `58a34e37` remain protected, administration `210df5bc` remains held. This direction clarification consumes none of their review triggers and requires no integration, deletion, PR or disposition action. Review triggers remain readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective.

## D. Risks and follow-up notes

The current backend still fails the measured repeatability gate. The next installed run is the unversioned **Ordinary Campaign Publication Capacity And Retention Contract Decision**, documentation only, with independent retention and backend-capacity findings. Suggested commit message: `docs(prompt): preserve long-running campaign data in retention decision`. No implementation repair, migration or combat acceptance is claimed.

---

Date: 2026-09-28. Source run: **DEV-0.7.1 Slice C - Repeatable Encounter Capacity Preflight**. Label class: internal slice of planned current-band primary `DEV-0.7.1 - Ordinary Encounter Reachability`; parent remains unaccepted. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `fead51012561ca584359fcadf51d801b196ac21d`; implementation/evidence checkpoint `bb24c483d7d683466d28dcace57fc1e6a723de0a`. Result: **CAPACITY_GATE_FAILED; COMBAT_ADMISSION_HELD**. Final documentation publication head is verified after push.

## A. Files changed

Bounded retry repair in `apps/rpg-ui/src/game-shell/saveManager.ts`; repeatable instrumented probe `tests/probes/ordinary-encounter-capacity-preflight.mjs`; exact captured output `docs/dev/evidence/ordinary-encounter-capacity-preflight-2026-09-28.json`; focused decision `docs/design/ordinary-encounter-publication-capacity-preflight.md`; this output, current GPT handoff, installed next prompt, historical/deferred register, planning reconciliation and branch register. No encounter admission, combat/outcome, content, schema, dependency or `GAME_VERSION` edit.

## B. Patch summary

The production creator-to-World caller and save/publication owner were exercised repeatedly against a 5,242,880-byte UTF-16 whole-store limit using an isolated in-memory localStorage model with a QA account profile. The current world candidate was replaced each action, but durable candidate and artifact envelopes accumulated. At saved action 50 the store was 5,150,828 bytes; action 51's recovery write proposed 5,277,474 and hit quota. The previous head revision 51 remained loadable, while a failed candidate copy remained. Exact retry again hit quota. Separately, a post-head slot-address failure/retry exposed a completed no-consumer recovery record that remained after successful retry. The small repair clears and verifies that record, allowing the next save. Detailed method, limitations and decision are in the focused record.

## C. Tests and checks run

The final captured probe has 22 candidate and 29 no-candidate accepted actions; save/reload checked each successful publication's immutable artifact bytes, tick, Stamina, candidate and publication identity. Snapshot-only serialized size at action 50 was 48,606 bytes, while the whole store was 5,150,828. The action-51 rejection retained the earlier verified head and exact retry made no further write; a separate post-head address-failure retry reused one publication/two artifacts, cleared recovery and saved tick 2 afterward. The probe passed. Focused/adjacent campaign, encounter and Soundings integration tests: **38/38**. Content lint: **72 files checked**. Sequential production Vite build: **PASS**, 229 client modules; the first concurrent build's HTML-output failure was superseded by this clean rerun. Broad `npm run ui:build`: **FAIL**, the unchanged known 137 TypeScript diagnostics, with no new `saveManager` diagnostic. `git diff --cached --check` passed at checkpoint. No actual browser account or save was mutated; this run measures production persistence code under a quota-enforcing model rather than a browser engine's exact quota.

FP-001/017: actual creator/action/campaign caller and production save APIs rather than an injected candidate. FP-002: failed capacity cannot accept parent or combat. FP-003/005: no-consumer recovery retry now completes and a later save proceeds; quota retry preserves prior head. FP-011/012/014/015: exact immutable artifact readback and owner-derived state, with failed writes not promoted. FP-008/009: retained refs inspected and source/checkpoint/publication identities separated. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and zero open PRs. At inspected source, retained readiness `59c103c3` / base `895c02df` was 434 master-only/2 ref-only, prompt-integrity `58a34e37` / base `3d77171c` was 381/1, administration `210df5bc` / base `fd40571b` was 212/1. Their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions remain unchanged. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None was consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Retained candidate/artifact copies consume more than 5 MiB after a bounded sequence of ordinary save cycles, even before combat history. The model includes only one QA campaign and default account profile, no full account consumer projection, other saves or future combat receipts; no universal capacity claim follows. The installed next route is the unversioned **Ordinary Campaign Publication Capacity And Retention Contract Decision**, documentation only, to define safe bounded preservation and quota recovery before an implementation repair. Suggested implementation/evidence commit: `fix(save): complete no-consumer publication retry` (committed); suggested handoff commit: `docs(handoff): record ordinary publication capacity gate`. No game-version decision or parent acceptance.

---

Date: 2026-09-28. Source run: **DEV-0.7.1 Slice B - Ordinary Nearby Exploration Reachability**. Label class: internal slice of planned current-band primary `DEV-0.7.1 - Ordinary Encounter Reachability`; parent remains unaccepted. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `f4b510ee081ea0c46a47807b719b24509c7979d3`; implementation checkpoint `400fc0facd5119333fb5591afd216a10a79582a0`. Result: **ORDINARY_CONTEXT_REACHABLE; COMBAT_ADMISSION_HELD**. Final publication head is verified after push.

## A. Files changed

Implementation: `packages/engines/game-engine/src/player-nearby-exploration.ts` and `.js`, `packages/engines/world-engine/src/spawn/content.ts` and `index.ts`, `packages/shared/types/src/contracts.ts` and `encounters.ts`, `apps/rpg-ui/src/runtime/nearbyExplorationCaller.ts` and `GameSessionContext.tsx`, `apps/rpg-ui/src/features/WorldPanel.tsx`, and `tests/unit/nearby-exploration-reachability.test.mjs`. Coordination: this output, current GPT handoff, installed next prompt, historical/deferred register, planning reconciliation and branch register. No content, schema, combat admission/outcome, reward, dependency or `GAME_VERSION` edit.

## B. Patch summary

The World control accepts one deliberate `player.explore.nearby` command only from an exact known authored settlement/context. The engine rechecks current geography, hex/edge, local-to-macro ancestry, habitat and hazard provenance, campaign/action identity and snapshot revision before applying one watch of low-intensity strain and a 2 Stamina action cost. The campaign caller publishes only an accepted mutation. Spawn selection sorts stable IDs and filters profiles, templates and every monster member by authored place, habitat, hazard, movement and disposition; the habitat-ineligible sapper is excluded. A deterministic no-candidate draw is a successful no-encounter result. A selected candidate and context are stored as isolated world observations, separate from the legacy combat queue; the next accepted exploration supersedes them. The current settlement remains authoritative, no encounter is admitted and no reward is issued. An unlinked origin/action stays unavailable.

## C. Tests and checks run

Focused plus adjacent travel/activity/spawn/campaign persistence tests: **84/84**. Content lint: **72 files checked**. Production Vite build: **PASS**, 229 client modules, after stopping the concurrent dev server; the earlier concurrent build failed in Vite's HTML output path and was superseded by this clean rerun. `git diff --cached --check`: **PASS**. Broad `npm run ui:build`: **FAIL**, the known 137 TypeScript diagnostics; the two reported `WorldPanel.tsx` optional-prop diagnostics predate this slice, and no new exploration-file diagnostic was reported. Do not treat the broad build as green.

Real browser QA used a new isolated local QA account and Slot 2 creator campaign, with Stonevein selected through ordinary creator steps. In World, the first Explore action found an authored candidate and displayed “No encounter has begun”; the control remained available. A second action returned “No encounter was found” and replaced the prior signs. Stamina changed from 99/99 to 96/98 after the first action, and the session Save control reported “All Changes Saved” for Slot 2. The browser reload returned to login, so a post-reload browser readback was not completed; the focused serialize/deserialize and repeat-action test verifies candidate persistence and supersession. Browser text and control availability were inspected through the accessibility tree; the existing narrow shell layout remains outside this slice.

FP-001/017: creator-to-World-to-campaign positive path and a second origin/unlinked action, with no injected candidate. FP-002: parent and combat remain held despite green focused checks. FP-003/005: next action replaces candidate, stale/rejected command preserves source, accepted campaign mutation owns publication. FP-014/015: authored geography/hazard and member eligibility rederived at execution. FP-008/009: protected refs reviewed; source, checkpoint and publication identities distinguished. No new generalized failure pattern.

Fresh fetch/prune found one local/four hosted branches; the scoped GitHub PR page showed zero open PRs. At inspected source, readiness `59c103c3` / base `895c02df` was 432 master-only/2 ref-only; prompt-integrity `58a34e37` / base `3d77171c` was 379/1; administration `210df5bc` / base `fd40571b` was 210/1. Unique paths and dispositions remain unchanged: readiness and prompt-integrity `PROTECTED_REFERENCE`, administration `HOLD_NAMED_CONSUMER`. Their exact review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. No trigger was consumed; no integration, deletion, PR or disposition change was due or performed.

## D. Risks and follow-up notes

The retained Soundings measurement left only 166,674 UTF-16 bytes below a 5 MiB storage limit. This slice did not measure a repeatable campaign history or admission/outcome effects; capacity is the next gate. Browser reload readback is unverified because the disposable local QA account signed out on refresh. Combat admission, success/defeat/recovery and the planned parent remain held. Suggested implementation commit: `feat(world): reach authored nearby exploration from World` (committed). Suggested handoff commit: `docs(handoff): route encounter capacity preflight`. Next recommended run: **DEV-0.7.1 Slice C - Repeatable Encounter Capacity Preflight**; no game-version decision.

---

Date: 2026-09-28. Source run: **DEV-0.7.1 Slice A - Ordinary Encounter Context Static Authorship**. Label class: internal slice of planned current-band primary `DEV-0.7.1 - Ordinary Encounter Reachability`; parent remains unaccepted. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `05836a6976ee45014012af4b13a77fc5a746e2b3`; implementation checkpoint `c9b38166` (full identity in Git). Result: **STATIC_CONTEXT_AUTHORED; ORDINARY_REACHABILITY_PENDING**. Publication head is verified after push.

## A. Files changed

Added `packages/content/base/world/encounter_action_contexts.json`, `packages/schemas/world/encounter-action-context.schema.json`, `tools/content-lint/encounter-action-contexts.mjs`, and `tests/unit/encounter-action-context-static-authority.test.mjs`; registered the collection in `tools/content-lint/index.mjs` and schema in `tests/unit/schema-files.test.mjs`. Updated this output, current GPT handoff, installed next prompt, historical/deferred register, planning reconciliation and branch register. No runtime, UI, save, combat, existing encounter content or `GAME_VERSION` change.

## B. Patch summary

One world-owned record binds deliberate `player.explore.nearby` at Stonevein to the authored Ore Ridges–Caravan Marches edge, explicit `frontier_track`, and Auric Marches region hazard source. The reusable strict schema and semantic lint reject ambiguous identities, wrong origin/hex/edge or region ancestry, absent or invalid hazard and missing compatible spawn profile, template or monster member. The compatible roadside patrol is eligibility evidence only; no template is forced. Other origins/actions still have no authored record and cannot produce a positive encounter. The existing sapper selector gap remains a later runtime gate.

## C. Tests and checks run

`node --test tests/unit/encounter-action-context-static-authority.test.mjs`: **23/23**; `node --test tests/unit/schema-files.test.mjs`: **107/107**; `npm run tool:content-lint`: **72 files checked**; `node --test tests/unit/combat-spawn-foundation.test.mjs`: **30/30**. `git diff --cached --check` passed at implementation checkpoint. Tests cover exact positive record and wrong origin, hex, edge direction/region, parent, hazard source/value, habitat, profile, template, member, duplicate ID/tuple and unknown field. Static lint does not exercise creator, player action, World UI, save, spawn selection or capacity. Known 137 broad UI diagnostics were not rerun.

FP-002/017: static green evidence does not accept the parent or ordinary encounter reachability. FP-014/015: lint derives references, ancestry, hazard and member eligibility from live world catalogs. FP-008/009: retained refs reviewed semantically and inspected/implementation/publication identities separated. FP-001's real-caller proof remains for Slice B; no new generalized failure pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Retained readiness `59c103c3` / base `895c02df`, prompt-integrity `58a34e37` / base `3d77171c`, and administration `210df5bc` / base `fd40571b` retain unique documentation-only paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

The next internal slice must implement the deliberate command, exact current-location resolver, World caller and eligible template filtering, then prove creator-to-action and honest no-match behavior. Repeatable 5 MiB capacity and combat admission/outcome remain separate later gates. Suggested implementation commit: `feat(world): author ordinary encounter action context` (committed). Suggested handoff commit: `docs(handoff): route ordinary encounter reachability slice`. No new milestone or game-version acceptance.

---

Date: 2026-09-28. Source run: **Ordinary Encounter Context Authorship Decision**. Label class unversioned; parent not applicable. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized source and documentation starting head `3976619afbabb063624fcb15e10bd619b5f7e133`; publication identity is verified separately after push. Result: **AUTHORED_CONTEXT_DECIDED; IMPLEMENTATION_HELD**.

## A. Files changed

Focused `docs/design/ordinary-encounter-context-authorship-decision.md`, current prompt/output/handoff, historical/deferred register, planning-anchor reconciliation and branch register. No production source, content, schema, UI, test, save, dependency or game-version change.

## B. Patch summary

The project owner explicitly chose deliberate **Explore nearby environs** from Stonevein onto the authored Ore Ridge–Caravan Marches pass, with `frontier_track` to be explicitly placed for this one action/context. Stonevein is a reference, never a universal first encounter. The actual creator still has one known settlement and arrival activity, no encounter context, and no known travel catalog destination. Ordinary travel is a whole-leg alias command; generic shift stays in town. The focused decision fixes exact place, habitat and hazard provenance, owner split, a static authoring/lint slice, separate reachable-action slice and capacity/combat gates. The installed next prompt is `DEV-0.7.1 Slice A - Ordinary Encounter Context Static Authorship`; it does not implement combat or accept the planned parent milestone.

## C. Tests and checks run

Fresh fetch/prune confirmed source `HEAD == origin/master`, clean tree, one local/four hosted branches, and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Read-only creator probe used `createNewGameSnapshot` with validated Stonevein form and found `destination_not_known` for all four current travel catalog IDs; ordinary shift preview was available but carried no off-settlement context. Source inspection covered creator, World/Activity UI callers, travel/activity owners, exact routes/hexes/edges, world schemas, content-lint registration, and spawn/template/member/hazard authority. `node --test tests/unit/player-travel-command.test.mjs tests/unit/player-activity-selection-command.test.mjs tests/unit/combat-spawn-foundation.test.mjs` passed **47/47**. A hand-supplied resolver context at tick 1 yielded 36 hits for seeds 0–99, including a habitat-ineligible sapper template; this characterizes a later selector gate, not ordinary reachability. No browser run, positive ordinary caller, save mutation or capacity measurement. `git diff --check` and final publication/readback remain final gates; known 137 broad UI diagnostics were not rerun or called green.

FP-001/017: ordinary creator/caller probe separates reachability from demo and injected spawn tests. FP-002: 47 green units do not accept ordinary combat. FP-008/009: retained branches reviewed semantically and inspected/publication heads distinguished. No new generalized pattern.

Retained readiness `59c103c3` (429 master-only/2 ref-only), prompt-integrity `58a34e37` (376/1) and administration `210df5bc` (207/1) have unchanged merge bases, unique paths and dispositions `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Their review triggers are respectively scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no merge, rebase, integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

The accepted reference needs a new action/context record and a later real World-panel caller. Unknown origins/actions stay `no_eligible_encounter`; current source cannot yet admit a positive encounter. The current resolver's template-habitat omission must be repaired in the later action/resolver slice. Repeatable campaign storage remains separate: retained peak 5,076,206/5,242,880 UTF-16 bytes leaves 166,674. Suggested commit: `docs(decision): select nearby exploration context authorship`. Next recommended run: **DEV-0.7.1 Slice A - Ordinary Encounter Context Static Authorship**; no separate game-version decision.

---

Date: 2026-09-28. Source run: **Ordinary Encounter Admission And Outcome Ownership Contract Decision**. Label class unversioned; parent not applicable. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized source `fefd6bae0acca2bef53bb1eadc922350d557dffc`; documentation publication identity is verified separately after push. Result: **CONTRACT_ACCEPTED; IMPLEMENTATION_HELD**.

## A. Files changed

Focused contract `docs/design/ordinary-encounter-admission-and-outcome-ownership-contract-decision.md`; clarification in the preceding combat package decision; current prompt, output and GPT handoff; historical/deferred register, planning-anchor reconciliation and branch register. No production source/content/UI/test/schema/save/dependency or game-version file changed.

## B. Patch summary

Accepted a reusable, context-driven, fail-closed contract under the user's explicit direction: current location, exact authored hex/edge, local-to-macro region, habitat, hazard and accepted ordinary action determine whether a candidate exists. Stonevein/caravan approach is a reference only; no universal Stonevein/Kaelvar/kobold first fight. Missing authored eligibility returns `no_eligible_encounter`. The contract assigns candidate identity, deterministic ordering, one-time campaign admission, legal commands, success/no-reward result, Normal-Stakes defeat/recovery, compact durable evidence, observer-safe text-first controls and repeatable-storage gate. Current content does not authorize an action-to-habitat link and no positive ordinary caller exists. Installed only **Ordinary Encounter Context Authorship Decision**, documentation-only, as next route; no combat implementation package.

## C. Tests and checks run

Fresh fetch/prune confirmed local/hosted equality and clean source. Live creator, world hex/edge, region, spawn, travel/activity, combat, campaign session, recovery, UI contract, save and test owners were re-inspected. `node --test tests/unit/combat-spawn-foundation.test.mjs`: 30/30 pass; `node --test tests/unit/player-travel-command.test.mjs`: 8/8 pass; `node --test tests/unit/campaign-persistence-foundation.test.mjs`: 33/33 pass. A read-only spawn resolver probe with `region.auric_marches`, anchored ore-ridges hex, empty habitat and authored hazard 46 returned zero candidates at ticks 0, 1, 5, 25 and 99. This does not prove the ordinary UI path. No browser execution, positive encounter, save mutation or storage-growth measurement. `git diff --check` and final scope review are publication gates; the 137 broad UI diagnostics remain a known baseline, not a green result.

FP-001/017: ordinary caller cannot be replaced by an injected candidate. FP-002: green foundation tests do not establish playable acceptance. FP-003/005/011/012/014/015: pending completion, precedence, caller-state loss, semantic receipt/duplicate validation and owner-derived facts are contract gates. FP-008/009: source/publication and protected branch state remain distinct. No new generalized pattern is needed.

One local/four hosted branches and zero open PRs. Retained readiness `59c103c3` (428/2), prompt-integrity `58a34e37` (375/1) and administration `210df5bc` (206/1) have unchanged exact heads/merge bases/unique paths and remain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, and `HOLD_NAMED_CONSUMER`. Review triggers: scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no branch/PR action due/performed.

## D. Risks and follow-up notes

Current world data provide Stonevein's location and risk descriptors but no authorized `frontier_track`, `roadside_ditch` or `quarry_edge` mapping for an ordinary action. Any actual positive implementation still needs one authored reachable context and an instrumented repeated-campaign capacity result; retained peak 5,076,206/5,242,880 leaves 166,674 UTF-16 bytes. Recovery is source-plausible at an exact known settlement but not accepted through combat. No game-version or milestone advancement. Suggested commit: `docs(contract): define context-driven encounter admission`. Next recommended run: **Ordinary Encounter Context Authorship Decision**; no separate game-version decision.

---

Date: 2026-09-28. Source run: **Ordinary Combat/Challenge And Recovery Package Decision**. Label class: unversioned; parent not applicable. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized source `b0692e9fad000e364e4e871eba11cdfb1ca1682f`; documentation publication identity is verified separately after push. Result: **COMBAT_CHALLENGE_PREREQUISITE_REQUIRED**.

## A. Files changed

Focused decision `docs/design/ordinary-combat-challenge-and-recovery-package-decision.md`; current prompt, handoff and output; historical/deferred register, planning-anchor reconciliation and branch register. No production source, content, UI, test, save, schema, dependency or game-version file changed.

## B. Patch summary

Installed exactly one documentation prerequisite, **Ordinary Encounter Admission And Outcome Ownership Contract Decision**. The provisional source-derived scenario is creator-selected Stonevein with Warrior arming sword, buckler and light armor, and existing Kaelvar roadside kobold patrol content. It is not yet an ordinary playable route: creator records Auric Marches without frontier habitat; authored spawn selection expects Kaelvar with frontier tags; ordinary UI does not call `runGameTick`; and combat result handling does not call `resolveNormalDefeat` or pass through an accepted campaign mutation. The new contract prompt resolves that one world-to-campaign admission/outcome seam before implementation. The focused decision records conservative text-first presentation, safe-settlement recovery and storage gates. No loot, currency, reputation, quest reward or generalized inventory is inferred.

## C. Tests and checks run

Fresh fetch/prune, three-commit documentation-only delta review from Connector packet `8fbc63bdf4ccde39475d7e485dc8135d749703a1`, clean worktree/upstream, branch inventory and live source/test tracing. `node --test tests/unit/combat-spawn-foundation.test.mjs`: 30/30 pass. `node --test tests/unit/campaign-persistence-foundation.test.mjs`: 33/33 pass. These are foundation checks, not ordinary UI or combat-loop acceptance. No browser run or production change. `git diff --check` and post-edit scope review are publication gates. The broad UI baseline remains 137 diagnostics, not a newly green check.

FP-001/017: distinguished ordinary UI caller from engine/simulation and injected candidates. FP-002: green units do not accept a playable parent. FP-003/005/012: pending recovery completion, retry and durable duplicate proof required before implementation. FP-008/009: inspected protected refs and kept source/publication identities distinct. No new generalized pattern is warranted.

One local/four hosted branches; GitHub showed zero open PRs. Readiness `59c103c3` (427/2), prompt-integrity `58a34e37` (374/1) and administration `210df5bc` (205/1) retain their exact heads, unique paths and prior `PROTECTED_REFERENCE`/`HOLD_NAMED_CONSUMER` dispositions. Review triggers respectively remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Normal-Stakes recovery is implemented but not wired to combat resolution. Stonevein creator facts satisfy the current known-settlement predicate in source, yet ordinary combat recovery and restart still need executable proof. Repeatable defeat can grow receipts/ledger/Chronicle; retained storage peak 5,076,206/5,242,880 leaves 166,674 UTF-16 bytes, so the additional-history reopening trigger is consumed before implementation. Candidate geography/habitat and observer policy remain undecided. No game-version or milestone advancement. Suggested documentation commit: `docs(decision): require ordinary encounter admission contract`. Next recommended run: **Ordinary Encounter Admission And Outcome Ownership Contract Decision**; no separate game-version decision proposed.

---

Date: 2026-09-28. Source run: **Activity Revenue Presentation Truthfulness Repair**. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Unversioned; parent not applicable; development milestone impact `none`; game-version impact `none`. Result: **PRESENTATION_REPAIR_VERIFIED**. Inspected and implementation-starting head `1f6d513a0c780ff52a8d7b9af6282c3010557d15`; implementation commit `c2d07ac8d4b4e1a404687cbd9d86c533feeb9222`; resumed validation head `c950f5fe1f4094140475eb7f61f0817ad2d2782b`. Final coordination/publication head is reported after commit and push.

## A. Files changed

Implementation: `apps/rpg-ui/src/runtime/uiViewModel.ts` at the checkpoint commit. Closure documentation: focused repair record, selected planning decision, current prompt/output/handoff, planning reconciliation, historical/deferred route register, and branch register. No game-version, engine, save, schema, or content change.

## B. Patch summary

The Daily Revenue card now says `Not tracked` and `Daily revenue is not currently tracked.` The prior literal 842 and false session-record attribution are gone. Other metrics and gameplay controls remain as before. The focused repair record contains the source-to-renderer trace and browser observations.

## C. Checks and evidence

App-local Vite build passed (216 client modules); Node configuration typecheck passed. Broad UI typecheck reported the known 137 diagnostics, not green. Diff/whitespace checks passed. The isolated QA campaign used ordinary creator, contract acceptance, and confirmed travel to Ashen Reef after explicit user authorization. In the active-survey Activity view, active operations were 1, current activity was Surveying Ashen Reef, Daily Revenue was Not tracked, and Advance Shift was enabled with sector 1 outlook. Wide render was readable; the narrow view preserved text but the existing shell left about 92px of scrollable main-pane height at 390px. No survey shift or quest submission was performed. Rendered observations are in the focused repair record; comprehensive accessibility and new gameplay acceptance are not claimed.

FP-001/017: actual creator, contract, travel, and Activity caller exercised without injection. FP-002: disposition is limited to the presentation repair. FP-008/009: branch/PR scope and distinct source/implementation/checkpoint/publication identities reviewed. Fresh fetch/prune; one local/four hosted branches; zero open PRs. Retained branch heads and unique paths unchanged; readiness 423/2, prompt-integrity 370/1, administration 201/1 at the resumed validation head. Their protected/held dispositions and exact review triggers are unchanged; no branch action due or performed.

## D. Risks and next route

No new revenue owner is implied. The known 137 UI diagnostics and narrow shell layout remain. The ranked storage, other presentation, recovery, and gameplay candidates retain their prior reopening triggers; none was consumed by this repair. No new executable package is installed. Suggested implementation commit: `fix(ui): present daily revenue as untracked` (committed). Suggested closure commit: `docs(handoff): close Activity revenue presentation repair`.
## 2026-10-02 DEV-0.7.1 Slice G9E implementation

Source run **DEV-0.7.1 Slice G9E — Slot Generation And Address Deletion** from synchronized `master`/`origin/master` `c318f64c2f96c932777ca5b8c7454ced9794cada`. Implementation/QA commit `618c8e5dfe4aac961467df92e9e08f3064273a0b`; final documentation/hosted head to be read back after push. Label class: internal support of planned primary `DEV-0.7.1` (parent held). Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`; development impact `supports_current_band`, Game-version impact `none`. Result **G9E_SLOT_GENERATION_AND_ADDRESS_DELETION_VERIFIED; G9F_NEXT; ACTIVATION_HELD**. Focused record: `docs/dev/dev-0.7.1-slice-g9e-slot-generation-address-deletion-record.md`.

Files changed: clean epoch IndexedDB owner and terminal adapter; selected App and existing delete controls; existing clean epoch QA, new focused G9E QA and synthetic selected-App fault controls; this record and current routing/output/handoff/planning/historical/branch documents. Additive v6 campaign-keyed attempts/recoveries, current slot-generation pointers and immutable deletion receipts preserve historical authority while allowing repeat slot reuse. Player deletion is account/address/generation CAS; completed terminal cleanup removes all addresses atomically after G9D settlement readback. Archival retirement remains ineligible for inheritance under the accepted rule.

Checks run: native G9E **10/10**, hardened G9D **14/14**, adjacent browser **130/130**, focused Node **174/174**, Node UI-config typecheck and app-local Vite build **PASS**, selected-App synthetic delete/quota/retry, same-slot replacement publication and stale second-tab rejection, diff check. Broad UI typecheck retains **137 known diagnostics**; one unchanged Main Menu layout diagnostic, zero introduced in G9E code. Full workspace `npm test` was stopped after unrelated failures; no full-workspace pass claimed. FP-001/002/003/004/005/006/008/009/011/012/013/014/015/017 applied; caller, rollback, contention, retained evidence, exact retry/readback and synthetic-source limits are detailed in the focused record.

Branch/PR lifecycle: one local/six hosted refs, zero open PRs. Readiness and prompt audit remain protected; administration, character-creator planning and new creator implementation branch `9f246be8` remain held for named consumers. No integration, deletion or PR action due; exact review triggers in the branch register. Suggested commit `feat(persistence): retain slot generations through address deletion`. Risks/follow-up: G9F account-wide reset/delete and session invalidation next; G10 activation, capacity/backup, death callers, combat, planned parent and Game-version acceptance held. No separate game-version decision proposed.
