# Current Codex Output

Source version/run: Difficulty Preset, Grim World, And Stakes Separation Contract Planning Audit

Date: 2026-07-21

Branch/status assumption: `master` at starting and ending commit `fbe68b7aa5641a4f38581c9da8a745b6c58a094b`; clean before the two authorized documentation changes; fetch and fast-forward pull completed with `HEAD` unchanged; ending worktree state is exactly the tracked output modification and new untracked audit listed below

Label class and parent: unversioned documentation-only repository audit and implementation-contract planning; no parent version

Milestone impact: `supports_current_band`

## Result

Produced the implementation-ready contract audit for three orthogonal campaign axes:

```text
difficultyPreset: Story | Favored | Mortal | Forsaken
worldRules: HeroicWorld | GrimWorld
stakesRules: NormalStakes | future separately accepted option
```

The smallest safe target is a versioned `CampaignRulesState` stored in saves and Chronicle records, with stable ids `story | favored | mortal | forsaken`, `heroic_world | grim_world`, and initially only `normal_stakes`. `Ironbound` remains a working title and is not accepted as an identifier. All axes and typed custom overrides should be creation-locked in the first implementation; accessibility and presentation settings remain changeable.

No live fact contradicts the controlling decision. The repository instead contains the expected legacy conflations and missing owners.

## Files Changed

- `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md`
- `docs/dev/current-codex-output.md`

## Patch Summary

- Inventoried every live campaign-difficulty definition and consumer.
- Defined canonical three-axis ids, ownership, save/Chronicle identity, change policy, and typed override provenance.
- Mapped easy/normal/hard/brutal into Favored/Mortal/Forsaken while keeping Story as a new abstraction contract.
- Classified seven Grim module families by existing foundations, missing authorities, placement, counterplay, persistence, tests, and dependency order.
- Separated saving, defeat, death, succession, archival, deletion, and crash recovery into a future Stakes owner.
- Specified combination, owner, migration, compatibility, and test matrices.
- Recorded exact remaining user decisions and a no-version package sequence.

## Principal Findings

1. Live campaign difficulty is `easy | normal | hard | brutal` plus `hardcore: boolean`. It tunes stat growth, skill/Knowledge progression, body state, and Prestige. There is no Story, World Rules, Stakes, custom difficulty, or campaign-creation selection.
2. `hardcore` is multiply conflated: it changes bodily recovery/forgiveness, Prestige/death behavior, terminal labels, and legacy payout posture. It does not enable any Grim World system.
3. Player HP at or below zero currently archives every run and clears all saves, including non-hardcore runs. Normal Stakes therefore needs an explicit ordinary defeat/death decision before runtime migration.
4. The live body-state seam can accept owner-specific difficulty policy without changing item values, but it has no Story bypass, physical-kcal/digestion/fat architecture, structural-loss state, or Grim health extension.
5. Live stat growth directly increments `PlayerState.attributes`; immutable base attributes, developed adjustments, structural-loss adjustments, and a current-attribute resolver are accepted design authority but not implemented.
6. New saves default to normal/non-hardcore; old saves normalize missing difficulty to that state. Run history, achievements, and Chronicle records do not preserve complete difficulty identity.
7. The repository has useful static/runtime foundations for Grim work—body state, hazards/status vocabulary, logistics content, reputation, polities/institutions, economy, maps/Knowledge, and save snapshots—but none of the seven requested Grim families has a complete owner contract.
8. Tracked JavaScript mirrors exist beside TypeScript player-engine sources and must be regenerated or updated with any later implementation.

## Migration Recommendation

- missing/invalid -> Mortal + Heroic World + Normal Stakes;
- easy -> Favored;
- normal -> Mortal;
- hard -> Forsaken;
- brutal -> Forsaken with explicit legacy provenance and, if accepted, typed compatibility overrides;
- every old campaign -> Heroic World and Normal Stakes unless the user explicitly selects a later accepted option;
- legacy `hardcore: true` -> never infer Grim World or a future restricted Stakes id. Split non-stakes tuning from death/save/Prestige semantics and preserve a migration marker.

The current universal HP-zero archival behavior remains an unresolved owner conflict, not an accepted migration default.

## Checks Run

- Read every authority required by the active prompt plus `AGENTS.md` and `README.md`.
- Confirmed the active prompt and exact two-file scope.
- Recorded branch, clean starting state, starting commit, successful fetch/fast-forward pull, and unchanged ending commit.
- Confirmed controlling decision blob `0b2bfc434e586321336bbf5ecb6af55111d6db69` is present and unmodified.
- Confirmed held `0.6.6` pointer, source commit, and exact prompt blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`; inspected the object to verify its run identity.
- Searched live TypeScript, tracked JavaScript, JSON content/rules, schemas, tests, and UI for difficulty, Hardcore, Story, Easy, Normal/Standard, Hard, Simulation, Survival, Ironman, permadeath, custom difficulty, saves, death, defeat, rollback, warnings, forecasts, and relevant Grim system terms.
- Inspected run-difficulty types/resolver, global balance rules, body state, stat growth, game defaults, new-game creation, save normalization, save slots, run lifecycle, Chronicle/payout behavior, combat/encounter difficulty, economy difficulty, settings, and representative Grim foundations.
- Verified there is no live multiplayer/shared-world campaign-rules authority.
- Verified all 14 required audit sections, exact changed-path scope, absence of conflict markers and trailing whitespace, and clean Markdown diff checks.
- Did not run builds, typechecks, generators, application lint, servers, or runtime tests because this run is documentation-only.

## Unresolved Owner Conflicts

- Save/campaign Stakes versus current universal HP-zero archival and save clearing.
- Difficulty versus current `hardcore` recovery, Prestige, death, and payout behavior.
- Attribute progression versus accepted immutable base/developed/structural/current separation.
- Legacy 100-unit body energy/nutrition versus accepted physical kcal/macronutrient truth.
- Combat-profile `normal | hardcore` vocabulary versus campaign-facing terminology.
- Chronicle/achievements/Legacy payout versus missing complete campaign-rule identity and migration provenance.
- Story abstraction versus always-active technical body state.
- Each Grim family versus its missing domain-specific runtime and persistence owner.

## Exact User Decisions Still Required

1. Whether all axes and overrides are creation-locked initially.
2. The Normal Stakes HP-zero outcome.
3. Active legacy-hardcore save migration for death, Prestige, recovery, and payout behavior.
4. Whether brutal maps to Forsaken with provenance only or compatibility overrides.
5. Story’s per-owner compute-invisibly/coarsen/bypass choices.
6. Whether player-facing custom overrides ship in the first package.
7. Chronicle, achievement, and Legacy eligibility/provenance policy.
8. Core versus optional Grim module classification and first vertical slice.
9. Disposition of combat-profile `hardcore` naming.
10. Later Stakes naming and exact save/death/succession rules.

## Risks / Follow-Up Notes

The first implementation must not merely rename existing tiers. Story is not easy, Forsaken is not legacy hardcore, Grim World is not a scalar overlay, and Normal Stakes cannot inherit current permanent run archival without an explicit decision. World Rules modules need typed persistent state and owner-specific Story adapters. Save migration must be one-way from legacy `runDifficulty` to canonical campaign identity and must not dual-write two authorities indefinitely.

The temporary audit is review input. It does not authorize implementation or select exact balance values. Held `Version 0.6.6` remains paused and byte-recoverable; retained `0.6.7` artifacts remain untouched.

## Suggested Commit Message

`docs(difficulty): audit presets world rules and stakes`

## Next Recommended Version / Run

Stop for GPT/human inspection. If the audit is accepted, the next run should be an unversioned campaign-rules identity, migration, and change-policy acceptance decision resolving the listed user choices. Do not create that prompt, assign an implementation version, implement a Grim module, define restricted Stakes, or restore `0.6.6` from this run.
