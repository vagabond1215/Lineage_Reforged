# Current GPT Handoff

Source route: `GPT-DR.agriculture.land-food-livestock`
Date: 2026-07-14

## Status

Latest completed primary:

- `Version 0.6.4 - World And Settlement Static Content Expansion`

Blocked primary:

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`
- The accepted pre-authoring gate remains authoritative. Do not author partial recipes, inherit production-chain quantities, or assume missing ratios.

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

All three artifacts are accepted temporary cited research inputs. They remain non-canonical until the cross-domain integration dispositions them against live repository authority.

Immediate next executable work:

- gate: `GPT-DR.materials.refinement-processing`
- route: run the full Gate 4 research prompt directly through Codex Sol Ultra with local repository access and public web research
- expected artifact: `docs/dev/tmp-materials-refinement-processing-research-2026-07-14.md`
- preserve the same two-commit pattern: accepted artifact first, then current coordination

Do not run `docs/dev/current-codex-prompt.md`; it remains the later cross-domain integration hold. Gate 4 is a separate direct Codex research task.

## Gate 3 Acceptance

- The accepted report has all 20 required sections, 44 complete candidate/authority rows, and no implementation permission.
- It relies on 52 external works across 53 direct URLs: 1 A1, 20 A2, 30 B1, and 1 B2. Body citations and the source register have exact URL parity.
- Connected repository access was demonstrated and all relied-on repository paths were fetched or verified at the live baseline.
- The pasted Gate 3 prompt expected stale head `fa459be99125aa0601677c1e6245e8594592261a`; the accepted run reconciled to clean live head `3b616f957bdf29d41140ef60225ae43f20b0da20`, whose intervening commits changed only coordination and replaced the abandoned external-only route with direct Codex research.

## Accepted Gate 3 Findings

- The live catalogs contain 117 flora, 132 fauna, 9 regional ecology profiles, 41 regions, 47 region localities, 47 world hexes, 88 settlements, 14 districts, 20 sites, 1,372 items, 1,617 market values, 121 production chains, 12 planned recipes, 58 workplaces, 131 tools, 121 skills, 22 extraction methods, 2 resources, 2 commodities, 7 civilization-infrastructure records, and 28 Knowledge snippets.
- Gate 2 continuity remains controlling: 658 unique flora/fauna outputs all resolve to items and values; 245 biological identity keys are market-only; 11,290 scalar `{}` placeholders cannot supply yields, population, reproduction, regrowth, domestication, impact, or other quantitative biology.
- Agriculture must preserve distinct authority for wild species, cultivated species, variety/landrace, seed stock, field/orchard/pasture, individual organism, herd/flock/colony, raw output, stabilized output, lot, fodder, ingredient, commodity, chain, workplace, action, yield/state, ownership, weather, and mutable soil/water state.
- Land capability is use-specific. Irrigation, drainage, lifting, distribution, outlet, maintenance, and water allocation are separate relationships. Manure, bedding waste, compost, residues, green manure, ash, lime, and marl are not interchangeable.
- Canonical flora and fauna control every crop and animal relationship. Regional ecology plus explicit settlement roles provide macro support, but names, aliases, output arrays, workplaces, and market values do not prove cultivation, domestication, producing state, physical harvest, or item generation.
- Milk, eggs, wool, honey, manure, traction, residues, stabilization, and storage require explicit source/state/handling relationships. Hair has no current fauna output or item authority. Blood, fat, manure, guano, sinew, tendon, and offal are absent from fauna output relationships and remain consumer/collision questions.
- Storage is commodity- and climate-specific. Existing settlement simulation already owns abstract granary/cellar/warehouse/vault capacity and load; a future farm-lot owner must integrate with it rather than duplicate it.
- Ordinary technology remains primary. Any magical support must be finite, canon-routed, maintained, scarce, failure-aware, non-universal, and unable to bypass land, water, feed, labor, ownership, ecology, or infrastructure.

## Pipeline-Shift Authority Correction

- Production chains and workplaces are not wholly inert descriptions. `packages/engines/civilization-engine/src/runtime-economy.ts` loads them for live craft/value resolution, `packages/engines/civilization-engine/src/index.ts` builds settlement market states during civilization ticks, and `resolveCraftAtSettlement` is exported.
- Preserve the accepted `0.6.5` rule that production-chain profiles do not supply exact bounded recipe quantities or automatic recipe inheritance. Correct only the broader stale claim that no runtime consumes the chains.
- `chain.farming.mixed_crop` currently resolves economic outputs, time, and cost, but does not create or mutate physical fields, crops, soil, herds, farm lots, or inventory.
- Focused verification reproduced three live integration risks: its empty gather step falls back to requested `crop_bundle`; it uses `skill.crafting.cooking` rather than the existing Agriculture skill; and Farmstead tool checks aggregate required tags across every job rather than the active job/tier, allowing unrelated advanced tool requirements to affect a basic resolution.
- No runtime fix was authorized or made. Gate 4-6 synthesis and later integration must preserve the live consumer, decide intended semantics, and add focused regression coverage before any chain/workplace edit.
- Transport/trade already validate configured animal-harness-vehicle relationships and execute abstract route/cargo movement. The missing owner is agricultural field traction plus fauna-level eligibility, training, feed, rest, condition, and work state—not generic transport or harness validation.

## Gate 3 Issues Requiring Later Verification

- Reconcile the 11,290 flora/fauna scalar placeholders with schemas and lint before any biological scalar consumer.
- Verify the 83 unresolved flora domestic-variant strings and templated companion/rotation topology.
- Resolve ox milk, shared bird egg/feather state, species wool versus generic fleece, apiculture's `flora` domain, and workplace biological-source gaps.
- Decide whether a static land-use/source relationship owner is needed before selecting any agriculture runtime.
- Preserve spatial supply, macro economy seasonality, live chain/workplace economic resolution, settlement storage, and transport/trade contracts while deciding whether field/herd/lot-level state is ever required.
- Exact yields, rates, calendars, capacities, loss probabilities, spoilage, pests, disease, soil/water formulas, actions, inventory mutation, saves, and UI remain unauthorized.

## Research Sequence And Integration Hold

1. `GPT-DR.resources.gathering-extraction` - complete
2. `GPT-DR.ecology.flora-fauna-byproducts` - complete
3. `GPT-DR.agriculture.land-food-livestock` - complete
4. `GPT-DR.materials.refinement-processing` - active next
5. `GPT-DR.food.processing-preservation`
6. `GPT-DR.crafting.tools-workplaces-production`
7. `GPT-DR.magitech.production-infrastructure-substitution`
8. Unversioned cross-domain research integration
9. Revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`
10. `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`
11. `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`
12. Geographic Knowledge Taxonomy And Location Recognition Contract Plan
13. Re-read runtime ownership and select exactly one later consumer

`docs/dev/current-codex-prompt.md` and `docs/dev/queued-cross-domain-production-research-integration-prompt.md` remain byte-identical at Git blob `9ce61594efe498c78b0b6d0d08fdafccf7cc0c54`. Do not run the integration until all seven accepted temporary cited research artifacts exist. Gate 3 does not unblock `0.6.5` by itself.

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
- `docs/design/cross-domain-natural-resources-materials-production-and-magitech-research-program.md` owns research breadth, gate structure, mundane baseline, and magic constraints.
- Research artifacts supply evidence, not implementation permission. Remaining gates must not change content, recipes, chains, schemas, validators, tests, lint code, runtime, UI, saves, migrations, dependencies, assets, or gameplay.
