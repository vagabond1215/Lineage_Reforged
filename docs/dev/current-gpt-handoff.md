# Current GPT Handoff

Source route: `GPT-DR.food.processing-preservation`
Date: 2026-07-14

## Status

Latest completed primary:

- `Version 0.6.4 - World And Settlement Static Content Expansion`

Blocked primary:

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`
- The accepted pre-authoring gate remains authoritative. Do not author partial recipes, inherit production-chain quantities, or guess missing ratios.

Accepted temporary research gates:

1. `GPT-DR.resources.gathering-extraction`
   - artifact: `docs/dev/tmp-resources-gathering-extraction-research-2026-07-14.md`
   - commit: `780513115686ce9c9f5f3828229cd9e2e4a78d09`
2. `GPT-DR.ecology.flora-fauna-byproducts`
   - artifact: `docs/dev/tmp-ecology-flora-fauna-byproducts-research-2026-07-14.md`
   - commit: `fed3b904b03a8233d101935de01322212cb71e5e`
3. `GPT-DR.agriculture.land-food-livestock`
   - artifact: `docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md`
   - commit: `55b687f88df2375d4cefa066aa75bf267e1d48df`
4. `GPT-DR.materials.refinement-processing`
   - artifact: `docs/dev/tmp-materials-refinement-processing-research-2026-07-14.md`
   - commit: `1efd9a3ff430fe6dfde00ff436c71457c3911ea5`
5. `GPT-DR.food.processing-preservation`
   - artifact: `docs/dev/tmp-food-processing-preservation-research-2026-07-14.md`
   - commit: `c9b8834bbbf5737b41915d4b94528aa9da51a57f`

All five artifacts are accepted temporary cited research inputs. They remain non-canonical until cross-domain integration dispositions them against live repository authority.

## Immediate Next Executable Work

- gate: `GPT-DR.crafting.tools-workplaces-production`
- route: Codex Sol Ultra with direct local repository access and public web research
- expected artifact: `docs/dev/tmp-crafting-tools-workplaces-production-research-2026-07-14.md`
- Gate 6 owns the final production-authority audit-trigger decision
- commit the accepted Gate 6 artifact first, then update coordination in a separate commit
- preserve Gates 1-5 authority, the ordinary-production baseline, and every source/food/material/recipe/runtime separation
- inspect all 121 production chains and every live consumer; the Gate 5 41-chain food-core predicate is an analytical subset, not an exhaustive production boundary
- a skip of `CODEX-AUDIT.production-chain-workplace-runtime-authority` is acceptable only when Gate 6 proves every relevant resolver ambiguity is separable from revised `0.6.5` recipe and static-content authority
- otherwise Gate 6 must trigger the audit before Gate 7 and must not advance the route directly to magitech

Suggested Gate 6 commits:

1. `docs(research): add crafting production gate findings`
2. `docs(coordination): resolve production authority audit trigger`

Do not run `docs/dev/current-codex-prompt.md`. It remains the later cross-domain integration hold.

## Gate 5 Acceptance

- The accepted report has all 28 required sections and 31 complete candidate/authority rows. It grants no implementation permission.
- It uses 68 external works across 68 direct URLs: 25 A1, 11 A2, 28 B1, and 4 B2. Every registered external source is cited inline with exact body/register URL parity.
- All 32 directly cited repository URLs also have exact body/register parity.
- Repository counts, cited IDs, chain probes, candidate vocabulary, regional coverage, food/material/feed/medicine/poison boundaries, magic classes, dependency closure, and safety exclusions passed final review.
- Focused recipe, runtime-economy, and body-state tests passed 54/54.

## Accepted Gate 5 Findings

- Living source, carcass/catch, anatomical part, raw edible and non-edible output, cleaned/trimmed food, stabilized stock, preserved food, milled food, fermenting substrate, active ferment, ingredient, process aid, intermediate, dish/drink, feed, coproduct, recoverable material, contamination, spoilage, waste, market identity, chain output, recipe output, and runtime instance require separate authority.
- Canonical biological source does not establish edibility. Food grade must also be explicit for oils, fats, salts, brines, acids, smoke inputs, containers, cookware, and recovered animal/aquatic streams.
- Feed is not the default destination for bran, spent mash, pomace, husks, press cake, trimmings, or other biologically sourced residues.
- Culinary, medicinal, toxic, alchemical, ritual, material, and lore-only destinations remain separate.
- Catalog growth must pass canonical-source, repeated-consumer, value, state/role, regional, collision, safety, and gameplay-value tests. Missing relationships and runtime reservations should not become exhaustive item catalogs.

## Food, Consumption, Storage, And Runtime Owners

- Live catalogs include 1,372 items, 1,617 market values, 121 production chains, 58 workplaces, 12 planned recipes, 131 tool items, 121 skills, 117 flora, 132 fauna, 24 monsters, 22 buildings, 9 regional ecology profiles, 41 regions, 88 settlements, 28 Knowledge snippets, 4 magic services, and 27 crystals.
- Nine consumable profiles exist; only five items link to them. Three links are semantic mismatches and four profiles are orphaned.
- The body-state engine applies real energy, nutrient, hydration, intoxication, fatigue, and starvation-related effects. The UI currently decrements inventory and invokes that owner.
- Inventory stacks have item id, item key, and quantity only. No lot, freshness, spoilage, contamination, disease, temperature, food-grade, or storage-condition owner exists.
- Settlement storage is real aggregate capacity/load/utilization for all 88 settlements, but not perishable lot storage.
- `cream` and `fresh_cheese` reference `spoilage.dairy_fresh`; no spoilage-profile catalog or runtime owns it.

## Production-Chain, Recipe, Workplace, And Resolver Findings

- A reproducible eight-namespace predicate selects 41 core food-source/processing chains and all 19 explicitly authored processing-step input arrays. This is a food-core analytical set only; Gate 6 must scan every chain namespace and live consumer for cross-domain collisions and production dependencies.
- Those chains have 81 steps: 19 explicit and 62 empty input arrays; 52 explicit and 29 empty output arrays. All 29 empty outputs receive runtime-derived results.
- Twenty-four core chains have 154 variants. Six default food steps replace nonempty authored inputs with variant inputs.
- Seventeen declared stage occurrences across six food chains have no processing step.
- Nine core variant chains fail to return a requested generic primary under default resolution.
- The bread chain omits declared `bran` because final results use only last-step outputs.
- Fallback can reverse the fresh-cheese dependency, omit source crops, consume a container without source material, select broad workplace inputs, and emit finished drinks at extraction.
- Twelve planned recipes across eight families remain static and non-executing. The three food recipes are non-inheriting and materially diverge from live defaults in flour and preservation lanes.
- Resolver tool requirements aggregate every workplace job; the returned `blocked` flag is not consumed. Jobs, tiers, upgrades, and authored I/O quantities are not selected; fuel remains boolean.
- Chains/workplaces affect live cost, value, market, transport, quantity, quality, time, labor, waste, outputs, and explanations, but do not create inventory or supply bounded recipe inheritance.

## Production-Authority Audit Evidence

Gate 5 adds substantial evidence relevant to `docs/design/production-chain-workplace-runtime-authority-audit-trigger.md`:

- explicit inputs are overridden by variants;
- important inputs and outputs remain fallback-derived;
- declared stages are skipped;
- generic targets disagree with variants;
- last-step selection omits declared output;
- planned recipes diverge from live chain semantics;
- broad workplace fallback can produce implausible dependencies;
- critical-tool blocking is ineffective;
- job/tier/upgrade/fuel semantics are incomplete;
- current runtime-economy tests do not isolate food fallback, variants, blocking, or dependency closure.

Gate 5 does not make the trigger decision or authorize a correction. Gate 6 must apply the trigger decision to the complete all-chain and all-consumer evidence set. An audit skip requires affirmative proof that revised `0.6.5` can proceed without relying on unresolved resolver semantics; absence of additional defects is not sufficient by itself. Otherwise Gate 6 must accept `CODEX-AUDIT.production-chain-workplace-runtime-authority` before Gate 7.

## Unresolved Food Issues By Owner

- Gate 6: final audit trigger; all-chain and cross-namespace consumer scan; recipe/chain/runtime precedence; explicit/variant/fallback I/O; requested outputs; stage closure; byproduct carry-forward; job/tool/tier/upgrade semantics; skills; fuel/energy; quantities; workplace availability; focused regression coverage; and the boundary of any later production correction.
- Gate 7: bounded mundane-for-magic substitution, preservation-service compatibility, ice affinity, vessels, finite capacity, recharge, housing, insulation, drainage, ventilation, maintenance, failure, scarcity, security, and institutional access.
- Integration: identity/relationship promotion, food-grade and feed authority, consumable/spoilage profile corrections, catalog collisions, regional/cultural authorship, validation posture, storage reconciliation, backlog disposition, and exact revised `0.6.5` scope.
- Later runtime: cooking/recipe execution, lot/batch state, freshness, temperature, contamination, spoilage, disease, storage mutation, inventory mutation, consumption command ownership, persistence, and effects.

## Research Sequence And Integration Hold

1. `GPT-DR.resources.gathering-extraction` - complete
2. `GPT-DR.ecology.flora-fauna-byproducts` - complete
3. `GPT-DR.agriculture.land-food-livestock` - complete
4. `GPT-DR.materials.refinement-processing` - complete
5. `GPT-DR.food.processing-preservation` - complete
6. `GPT-DR.crafting.tools-workplaces-production` - active next
6a. mandatory production-authority audit-trigger review
6b. `CODEX-AUDIT.production-chain-workplace-runtime-authority` when triggered
7. `GPT-DR.magitech.production-infrastructure-substitution`
8. Unversioned cross-domain research integration
9. Any separately authorized narrow production-chain/workplace correction required by integration
10. Revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`
11. `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`
12. `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`
13. Geographic Knowledge Taxonomy And Location Recognition Contract Plan
14. Re-read runtime ownership and select exactly one later consumer

`docs/dev/current-codex-prompt.md` and `docs/dev/queued-cross-domain-production-research-integration-prompt.md` remain byte-identical at Git blob `9ce61594efe498c78b0b6d0d08fdafccf7cc0c54`. Do not run integration until all seven accepted artifacts exist and any Gate-6-triggered audit has been accepted. Gate 5 does not unblock `0.6.5`.

## Preserved 0.6.5 Blocker

- Live recipes remain 12 planned standard records across 8 families.
- All 18 proposed recipe IDs and named item, value, tool, workplace, skill, and production-chain references resolved.
- Fifteen proposed rows used inputs absent from their named production-chain profile.
- Pastry dough omitted profile-declared `honeycomb`.
- Savory meat pie lacked an exact chain step consuming `smoked_meat`.
- The only exact input/output step shape lacked an authoritative quantity ratio.
- No partial recipes or guessed quantities are permitted.

## Durable Boundaries

- `docs/design/0.6.5-research-prerequisite-and-recipe-authority-reconciliation.md` owns the sequence correction and bounded recipe/chain posture.
- `docs/design/cross-domain-natural-resources-materials-production-and-magitech-research-program.md` owns research breadth, the seven gates, mundane baseline, and magic constraints.
- `docs/design/production-chain-workplace-runtime-authority-audit-trigger.md` owns the post-Gate-6 conditional audit checkpoint.
- Research artifacts supply evidence, not implementation permission. Remaining gates must not change content, recipes, chains, schemas, validators, tests, lint, runtime, UI, saves, migrations, dependencies, assets, or gameplay.