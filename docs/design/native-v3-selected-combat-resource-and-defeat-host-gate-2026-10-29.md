# Native v3 selected combat, resources and defeat host gate — 2026-10-29

Status: **NATIVE_SELECTED_COMBAT_HOST_VERIFIED; SELECTED_V3_ATOMIC_ACTIVATION_HELD**. This is unversioned support for the current development band. Game `0.1.1-prealpha` and `INTEGRATED_LOOP` are unchanged.

## Source and owner boundary

Fetched/pruned master `a596112acf3945f2bf7c625e943f2511d12aa710`; verified draft #19 `62d6cc7b`, #43 `8a03c461`, #44 `022fe22d`, #47 `3201c1c7`, #48 `10822490`, #49 `a625cea2`, #50 `5fc741aa`, #51 `586b0c67` and exact parent #52 `5b8a36e76e0f4cf55fe420e520dc6a0f9cc0f318`. [Draft PR #53](https://github.com/vagabond1215/Lineage_Reforged/pull/53) is a direct child of #52. Code `18a407e640bc3e3047d091abe3a68aac08850af3` and the focused ranged-action test `941d7e50aff878941604e92f11fddb9b8dc5eca9` were committed before this record. #19's obsolete-development-save waiver remains in force; old records were not migrated, reset or deleted.

The real native creator can start in Stonevein. Existing nearby exploration selects an authored candidate there, then the existing encounter owner admits and advances it. `nativeSelectedCombat.ts` binds those accepted results to #51/#52's one selected snapshot/control/source pair. The combat owner reads effective worn items from the physical gear graph, including Short Bow action provenance, while nearby admission and step require the caller-supplied native validator for v3. Resource ticking accepts that same worn modifier projection without persisting a v2 equipment map. Rejected, stale, duplicate, mixed-format, wrong-source and missing-validator actions retain the caller pair.

## Executable evidence and limits

The first real-creator regression was red at encounter admission (`transition_failed`) because combat read the removed v2 equipment map. It became green after the owner read native worn gear. A direct Node adjacent run then exposed a `.js` import of a TypeScript-only projection; a single shared runtime projection now serves Vite and Node. Broad TypeScript initially found nine new diagnostics; all were repaired against the exact #52 baseline.

| Check | Result |
| --- | --- |
| Focused native host | 4/4 pass after final ranged-action and validator-fence assertions |
| Full UI Node suite | 90/90 pass before final test-only assertions; focused host rerun passes after them |
| Adjacent root combat, resources, gear, exploration and Save | 77/77 pass |
| Existing direct Node combat-delta presentation | Fails identically on #52 and child: pre-existing missing `nativeSelectedCharacter.js` import |
| UI Node typecheck | pass |
| Broad UI TypeScript | #52 115, child 115; zero new normalized signatures |
| Broad workspace TypeScript | #52 762, child 762; zero new normalized signatures |
| Content lint | pass, 72 files |
| Direct Vite production build | pass; sparse worktree omits public artwork and warns on four launcher URLs |
| Disposable synthetic Chrome | pass: real native creator/account/Continue, authored encounter, enemy HP damage, Normal defeat, first-write aborted Save preserving the old head, exact retry, readback and page restart; selected `EpochApp` controls remain held |
| `git diff --check` | pass after whitespace correction |

The owner-backed Short Bow grants `combat.ranged.primary`, consumes 5 Stamina, and retains `item.short_bow` and archery provenance; a separate authentic enemy sequence reduces HP and ends in `enemies_victorious`. At Stonevein, Normal-defeat authority immediately restores the player at the known safe settlement and records one **playable** receipt. This does **not** prove a selected `recovery_pending` publication or dedicated recovery caller. The only authored nearby exploration origin currently is Stonevein; do not manufacture an unsafe location, forced spawn or HP-zero state to satisfy that gate. #44's unselected pending-publication tests remain supporting evidence only.

The synthetic browser account was disposable and not the user's authenticated selected campaign. The actual `EpochApp` still presents read-only native Character review after Continue; native selected combat, World, survey, terminal and ordinary UI Save controls remain unavailable. Selected v2 play is unchanged. This sparse build is not a deployable full-asset artifact.

Applied FP-001 (real creator/account/Continue, authored command and browser caller), FP-002/017 (synthetic proof kept separate from authenticated acceptance), FP-003 (pending entry/exit remains an explicit gate), FP-005/012 (duplicate, stale and interrupted Save retry), FP-008/009 (exact stacked base and live branch disposition), FP-011/013/015 (validator before native mutation and physical gear conservation), and FP-016 (actual selected shell hold and readback). No new generalized failure pattern was identified.

Keep #53 draft and stacked on #52. Review after an authentic selected pending-defeat route or a documented product decision on its reachability, terminal history/Save controls, mixed-format tab and rollback gates, and authenticated current-format Save/restart all cohere. No merge, Site deployment, game-version advancement or branch deletion occurred.
