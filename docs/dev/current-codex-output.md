# Current Codex Output

Source version/run: `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`
Date: 2026-07-19
Branch/status assumption: `master`; clean at starting commit `b8262c87308601b98e27965ab1585d430c1771da`, then required fetch/pull fast-forwarded to `80eb3bea72236d47b301a3dea0b4649081e1aed2` before authoring; no unrelated local changes were present.

## Result

Completed the exact synthesis-owned recipe expansion. Added 16 planned standard recipes, increasing the live catalog from 12 to 28 records and represented families from 8 to 10 by adding `cooperage` and `forging`.

Exact added ids:

- `recipe.flax_bundle_to_linen_thread`
- `recipe.wool_fleece_to_yarn`
- `recipe.yarn_to_wool_cloth`
- `recipe.linen_thread_to_fine_cloth`
- `recipe.flour_to_bread_dough`
- `recipe.fish_raw_and_salt_crystal_to_smoked_fish`
- `recipe.plank_to_barrel_stave`
- `recipe.barrel_stave_metal_ring_and_resin_pitch_to_cask`
- `recipe.copper_ore_to_copper_ingot`
- `recipe.copper_ore_and_tin_ore_to_bronze_ingot`
- `recipe.iron_ingot_to_metal_plate`
- `recipe.iron_ingot_to_blade_blank`
- `recipe.blade_blank_tool_handle_and_leather_strap_to_arming_sword`
- `recipe.cured_leather_to_leather_strap`
- `recipe.cured_leather_to_hardened_leather_panel`
- `recipe.metal_ring_and_leather_strap_to_mail_coif`

All 16 match the exact input/output quantities and roles, workplace, tools, skill/rank, and optional chain relationships in synthesis Section 13. Every integer is explicitly recorded as authored game-scale `bounded_design_inference`; no historical yield, runtime balance formula, or chain-derived ratio is claimed.

Final inventory: 1,372 items (24 accessory, 18 armor, 14 clothing, 1,114 commodity, 26 consumable, 131 tool, 10 vehicle, 35 weapon); 1,617 unique market-value keys; 9 consumable profiles; no live weapon/armor profile collections; 28 planned standard recipes across 10 families; 58 workplaces; 121 skills; 121 production chains; 2 planned resources; and 2 planned commodities.

Exact target, duplicate id/slug, direct no-op, same-role duplication, positive-integer, exactly-one-primary, and item/value/tool/workplace/skill/chain closure audits reported zero issues. Resources and commodities remained byte-identical at SHA-256 `7D9E306F70B3CBC5CE0E55537117D8AA36FF44698FAC4A8E4334B6AFBE4D5CB6` and `60C2CB6DF3B9A46048156559E774A0C6A5170853BB8F94206AF6F9CE17A3685B`.

No resolver, chain fallback, workplace I/O, candidate ordering, variant, stage/carry, value, price, job/tier/progression, fuel/power, or runtime field was consumed. `relatedProductionChainId` remains descriptive, existence-checked, and non-inheriting.

The Gate 6 research artifact and production-authority audit reached their sole-consumer removal conditions and were removed. Remaining owner-specific chain/workplace type, topology, semantic-validation, resolver-test, economy-documentation, Stonevein-placement, and transport-baseline work remains durably routed. Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.

Installed the exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt with a nine-region, nine-fauna-lineage monster matrix, exact source-local drop closure, current combat/action vocabulary only, and explicit runtime/gameplay prohibitions. The Geography/recognition plan remains immediately after `0.6.7`; the activity-resolution reuse audit remains behind that plan.

## Files Changed

- `packages/content/base/crafting/recipes.json`
- `tests/unit/crafting-recipes-validation.test.mjs`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/design/static-content-expansion-program.md`
- `docs/design/cross-domain-production-research-synthesis.md`
- removed `docs/dev/tmp-crafting-tools-workplaces-production-research-2026-07-14.md`
- removed `docs/dev/tmp-production-chain-workplace-runtime-authority-audit-2026-07-15.md`

## Checks Run

- Required `git fetch` and `git pull --ff-only`; fast-forwarded cleanly before authoring.
- Reproduced baseline and final inventories plus item-class, recipe-family, role, quantity, reference, and value closure.
- `npm.cmd run tool:content-lint` — passed, 67 files checked.
- `node --test tests/unit/crafting-recipes-validation.test.mjs tests/unit/equipment-profiles-validation.test.mjs tests/unit/resource-commodity-authority-validation.test.mjs tests/unit/schema-files.test.mjs` — passed, 310/310.
- Exact-target/invariant/reference audit — passed with `AUDIT_ISSUES=0`.
- Resource/commodity byte-identity hashes — unchanged.
- Conflict-marker, trailing-whitespace, `git diff --check`, changed-path, and full-diff review — passed.

No builds, typechecks, package installation, servers, generators, or full test suite were run.

## Behavior / Runtime Confirmation

Static planned recipe content and its focused validation expectations changed. Crafting availability/execution, input consumption, output creation, production-chain behavior, inventory, economy, equipment profiles, resources, commodities, combat, ecology, medicine, magic, Knowledge/recognition, runtime, UI, commands, events, saves, migrations, dependencies, assets, and gameplay did not change.

## Risks / Follow-Up

- The new quantities are deliberate structural batch units but are not executable crafting balance authority.
- Production-chain/workplace resolver corrections remain separate owner-specific work and must not be inferred from these recipes.
- `0.6.6` must remain static and source-local; it must stop if any exact fauna/ecology/role/tactics/action/item/value reference has drifted.
- `0.6.7` owns the remaining six research-artifact disposition decision and cross-content coherence audit.

## Next Recommended Version

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`

Mode: `Codex 5.6 Sol Local High.`

## Suggested Commit Message

`content(crafting): add research-informed planned recipes`
