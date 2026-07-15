# Current GPT Handoff

Source route: `GPT-DR.materials.refinement-processing`
Date: 2026-07-14

## Status

Latest completed primary:

- `Version 0.6.4 - World And Settlement Static Content Expansion`

Blocked primary:

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`
- The accepted pre-authoring gate remains authoritative. Do not author partial recipes, inherit production-chain quantities, or guess missing ratios.

Accepted research gates:

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

All four artifacts are accepted temporary cited research inputs. They remain non-canonical until the cross-domain integration dispositions them against live repository authority.

## Immediate Next Executable Work

- gate: `GPT-DR.food.processing-preservation`
- route: Codex Sol Ultra with direct local repository access and public web research
- expected artifact: `docs/dev/tmp-food-processing-preservation-research-2026-07-14.md`
- commit the accepted artifact first, then update current coordination in a separate commit
- preserve Gates 1-4 authority, exact food/material boundary separation, and the conditional post-Gate-6 production-authority audit

Do not run `docs/dev/current-codex-prompt.md`. It remains the later cross-domain integration hold.

## Gate 4 Acceptance

- The accepted report has all 24 required sections and 36 complete candidate/authority rows. It grants no implementation permission.
- It uses 61 external works across 61 distinct URLs: 11 A2, 30 B1, and 20 B2, with no A1 or C source. Body citations and the source register have exact external URL parity.
- All 38 relied-on repository URLs also have exact body/register parity.
- Repository counts, cited IDs, resolver behavior, candidate vocabulary, material lanes, dependency closure, safety limits, and later-gate boundaries passed independent final review.
- `node --test tests/unit/civilization-runtime-economy.test.mjs` passed 5/5.

## Accepted Gate 4 Findings

- Source, raw output, stabilized stock, prepared material, refined material, intermediate, component, finished good, process aid, fuel, salvage, residue, waste, market identity, chain output, bounded recipe output, and runtime item instance must remain separate.
- The live catalog has 1,372 items and 1,617 market values, but only 409 items carry the four-stage/six-role layer; 963 remain unstaged. Existing coverage is broad enough that later work should prefer missing relationships and targeted preconditions over indiscriminate identity growth.
- Canonical biological, mineral, crystal, regional, and magic sources control identity. External evidence establishes process distinctions and dependencies, not repository availability, exact recipes, regional placement, or implementation permission.
- Ordinary material technology remains the baseline. Any later magical assistance must be canon-routed, finite, housed, maintained, scarce, failure-aware, non-universal, and unable to bypass matter, fuel, tools, skill, infrastructure, ownership, or waste.
- Material candidates remain conditional on canonical source, collision audit, repeated consumers, item/value coverage, stage/role compatibility, chain and recipe ownership, capability closure, regional support, later gates, and integration disposition.

## Production-Chain And Workplace Authority Findings

- All 121 chains are indexed and directly craft-resolvable. Current source-derived/first-candidate rules allow 120 to be consulted by item-value/market paths; `chain.forage.wild_harvest.hut` is shadowed.
- The 121 chains contain 311 processing steps. Only 19 steps have explicit input arrays, all in food chains; 292 are fallback-capable.
- There are 179 empty output arrays: 97 workplace and 82 extraction. All receive runtime-derived output explanations.
- Final resolution omits 62 declared output occurrences across 17 non-variant chains. Explicit requests for the generic primary fail in 11 variant chains.
- Material examples reproduce unrelated smelter ores, glass without sand, mixed linen/wool loom inputs, a no-input final tannery step, finished-target extraction outputs, and broad stationery/chandlery workplace fallback.
- Runtime unions tool tags across all workplace jobs, selects the penalty mode from the first primary job, can report `blocked`, but does not consume that flag before emitting outputs.
- Workplace tiers, upgrades, authored IO quantities, and job selection are unused. Fuel is a boolean surcharge rather than an item, stock, compatibility, consumption, or residue relationship. Only the final step's outputs are returned.
- Production chains and workplaces therefore affect live economic calculations, but do not provide bounded recipe quantities, recipe inheritance, inventory generation, or physical production state.

## Potential Production-Authority Audit Evidence

Gate 4 found evidence that may satisfy several triggers in `docs/design/production-chain-workplace-runtime-authority-audit-trigger.md`:

- broad fallback supplies materially important inputs and outputs;
- exact requested-output behavior can disagree with variant selection;
- live value/market consumption exceeds a purely descriptive chain posture;
- all-job tool aggregation couples unrelated job roles;
- `no_output` blocking is ineffective in the craft loop;
- focused tests do not isolate these behaviors across material lanes.

Gate 4 does not make the final trigger decision or authorize a correction. Gate 6 must either record an evidence-backed audit skip or accept `CODEX-AUDIT.production-chain-workplace-runtime-authority` before Gate 7.

## Unresolved Material Issues By Owner

- Gate 5: edible versus industrial oils/fats/salts/alcohols, milling, baking, brewing, dairy, preservation, perishability, contamination, storage, byproducts, and food/feed safety.
- Gate 6: source/material closure, production-chain/recipe/runtime precedence, requested outputs, job/tool/tier semantics, skill mapping, fuel/energy, quantities, byproducts, workplace availability, and focused regression coverage.
- Gate 7: bounded mundane-for-magic substitution, affinities, vessels, conduits, catalysts, housing, finite capacity, recharge, failure, scarcity, security, and institutional access.
- Integration: identity promotion, relationship/schema/validator posture, regional and cultural authorship, value coverage, catalog collisions, and the exact revised `0.6.5` target.

## Research Sequence And Integration Hold

1. `GPT-DR.resources.gathering-extraction` - complete
2. `GPT-DR.ecology.flora-fauna-byproducts` - complete
3. `GPT-DR.agriculture.land-food-livestock` - complete
4. `GPT-DR.materials.refinement-processing` - complete
5. `GPT-DR.food.processing-preservation` - active next
6. `GPT-DR.crafting.tools-workplaces-production`
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

`docs/dev/current-codex-prompt.md` and `docs/dev/queued-cross-domain-production-research-integration-prompt.md` remain byte-identical at Git blob `9ce61594efe498c78b0b6d0d08fdafccf7cc0c54`. Do not run the integration until all seven accepted temporary cited research artifacts exist and any Gate-6-triggered audit has been accepted. Gate 4 does not unblock `0.6.5`.

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
- `docs/design/cross-domain-natural-resources-materials-production-and-magitech-research-program.md` owns research breadth, the seven named research gates, mundane baseline, and magic constraints.
- `docs/design/production-chain-workplace-runtime-authority-audit-trigger.md` owns the post-Gate-6 conditional audit checkpoint.
- Research artifacts supply evidence, not implementation permission. Remaining gates must not change content, recipes, chains, schemas, validators, tests, lint code, runtime, UI, saves, migrations, dependencies, assets, or gameplay.
