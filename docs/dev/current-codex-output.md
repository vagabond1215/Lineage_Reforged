# Current Codex Output

Date: 2026-07-27

Source version/run: `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`

Label class: primary

Parent version: not applicable

Milestone impact: `advances_current_band`

Branch/status assumption: `master` began clean and synchronized with `origin/master` at `9a2fec9cc11718b5c9fb1264099bff51eabc9b4b`; this report describes the validated working tree before the run commit.

## Result

`0.6.6` is complete and accepted.

The exact nine-row regional species package landed without broadening monster, ecology, loot, combat, runtime, or simulation authority. Each new monster is a `species_only` beast variant of one live fauna record, reuses a live combat/scaling template, uses only live role/preset/action vocabulary, and exposes only the ordered source-fauna slaughter-output item keys through static source-local drop envelopes. Each matching regional ecology profile gained exactly one native-fauna id.

## Baseline And Final Inventories

| Inventory | Baseline | Final |
| --- | ---: | ---: |
| Monsters | 24 | 33 |
| Beast / humanoid / ooze / elemental / undead / giantkin | 9 / 6 / 3 / 2 / 3 / 1 | 18 / 6 / 3 / 2 / 3 / 1 |
| Low / moderate / high / severe threat | 5 / 12 / 6 / 1 | 6 / 15 / 11 / 1 |
| Monster drop rows | 49 | 77 |
| Monster loot rows | 20 | 20 |
| Empty monster `loot` arrays | 12 | 21 |
| Explicit fauna lineages | 0 | 9 |
| Fauna records | 132 | 132 |
| Regional ecology profiles | 9 | 9 |
| Biomes / habitats / roles / tactics presets | 36 / 93 / 9 / 9 | unchanged |
| Items / market values / recipes | 1,372 / 1,617 / 28 | unchanged |

## Exact Accepted Matrix

| Monster | Fauna lineage | Ecology / biome | Threat / role | Actions | Copied template |
| --- | --- | --- | --- | --- | --- |
| `monster.kaelvar_cliff_viper` | `fauna.cliff_viper` | Kaelvar / dry scrub | high / disruptor | `melee_skirmisher`, `enfeebling_burst` | `monster.cave_spider_matron` |
| `monster.valtherion_brown_bear` | `fauna.bear` | Valtherion / mixed forest | high / frontliner | `melee_brute` | `monster.ember_boar` |
| `monster.serathyl_ravine_wolverine` | `fauna.wolverine` | Serathyl / temperate rainforest | high / opportunist | `melee_skirmisher` | `monster.shadow_wolf` |
| `monster.draemor_marsh_alligator` | `fauna.american_alligator` | Draemor / marsh | high / tank protector | `melee_brute` | `monster.bog_troll` |
| `monster.talmyran_savanna_scorpion` | `fauna.scorpion` | Talmyra / savanna | moderate / disruptor | `melee_skirmisher`, `enfeebling_burst` | `monster.dune_scorpion` |
| `monster.myridian_reef_lobster` | `fauna.reef_lobster` | Myridian Chain / marine | moderate / tank protector | `melee_brute` | `monster.dire_boar` |
| `monster.lantern_glowmire_caecilian` | `fauna.glowmire_caecilian` | Lantern Isles / mangrove forest | moderate / debuffer controller | `melee_brute` | `monster.mire_slime` |
| `monster.serpents_wake_tide_lizard` | `fauna.tide_lizard` | Serpent's Wake / mangrove forest | low / opportunist | `melee_skirmisher` | `monster.granary_rat` |
| `monster.dawnreach_bull_walrus` | `fauna.walrus` | Dawnreach Isles / tundra | high / tank protector | `melee_brute` | `monster.bog_troll` |

The nine source-local drop arrays contain exactly 28 rows. Their ordered item keys equal each base fauna's slaughter-output ingredients followed by byproducts, and every row uses the required positional quantity/chance envelope. All nine `loot` arrays are empty.

## Closure And Behavior Confirmation

- All monster ids, slugs, names, tags, and source-local drop keys are unique where required; no lineage cycle exists.
- All fauna, ecology, region, biome, habitat, combat-role, enemy-preset, action-package, item, market-value, and copied-template references close.
- Each selected fauna id appears exactly once in exactly its target ecology profile.
- The nine copied `combatProfile` and `difficultyScalingHooks` objects equal their named templates value-for-value.
- No generic loot table, direct region/biome/ecology field, spawn rule, population rule, attack, effect, reward, anatomy, harvesting, or executable/runtime field was added.
- Existing monster and regional-ecology semantics were not changed; the production diff is only nine appended monster records and nine appended native-fauna ids.
- Runtime, UI, commands, events, saves, migrations, economy, crafting, magic, Knowledge, and recognition behavior are unchanged.

## Files Changed

Production and focused validation:

- `packages/content/base/world/monsters.json`
- `packages/content/base/world/regional_ecology_profiles.json`
- `tests/unit/monster-validation-hardening.test.mjs`

Coordination:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/design/static-content-expansion-program.md`
- `docs/dev/historical-version-and-deferred-route-register.md`

## Checks Run

- `git pull --ff-only` - already up to date.
- `npm.cmd run tool:content-lint` - passed; 67 files checked.
- `node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs` - passed; 147 tests after the final exact-package assertions.
- Exact inventory/distribution and reference-closure assertions - passed.
- Conflict-marker and trailing-whitespace searches - clean.
- `git diff --check` - clean.
- Complete changed-path and full-diff review - accepted.

No build, typecheck, package install, server, generator, or full-suite command was run.

## Temporary Artifact Disposition

The six Gate 1-5 and Gate 7 research artifacts remain present and solely assigned to `0.6.7`; `0.6.6` did not delete or reassign them. The consumed Gate 6 and production-authority-audit artifacts remain absent and were not restored.

## Risks / Follow-Up Notes

- The new records are static authority only. No spawn frequency, population, ecology simulation, loot execution, harvesting, inventory mutation, combat effect, or reward behavior exists because of this package.
- The broad workspace typecheck remains the separately classified 173-diagnostic known-failing audit and was outside this run.
- `0.6.7` must be read-first and repair only proven defects. It must decide the six retained research-artifact removal conditions without broadening content or runtime.
- Geography/recognition remains immediately after accepted `0.6.7`; current `Recognizing ...` snippets remain structural lore only. The activity-resolution reuse audit remains behind Geography.

Suggested commit message:

`content(world): expand regional monster ecology`

## Next Recommended Version / Run

`Version 0.6.7 - Cross-Content Coherence And Coverage Audit`
