# Current GPT Handoff

Source route: `GPT-DR.ecology.flora-fauna-byproducts`
Date: 2026-07-14

## Status

Latest completed primary:

- `Version 0.6.4 - World And Settlement Static Content Expansion`

Blocked primary:

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`
- The accepted pre-authoring gate remains authoritative; do not author partial recipes or assume missing quantities.

Accepted research gates:

1. `GPT-DR.resources.gathering-extraction`
   - artifact: `docs/dev/tmp-resources-gathering-extraction-research-2026-07-14.md`
   - commit: `780513115686ce9c9f5f3828229cd9e2e4a78d09`
2. `GPT-DR.ecology.flora-fauna-byproducts`
   - artifact: `docs/dev/tmp-ecology-flora-fauna-byproducts-research-2026-07-14.md`
   - commit: `fed3b904b03a8233d101935de01322212cb71e5e`

Both artifacts are accepted temporary cited research inputs. They remain non-canonical until the cross-domain integration dispositions them against live repository authority.

Immediate next executable work:

- gate: `GPT-DR.agriculture.land-food-livestock`
- research route: ChatGPT Deep Research with the GitHub connector explicitly enabled for `vagabond1215/Lineage_Reforged` and public web research enabled
- final authority route: Codex Sol Ultra verifies repository claims, repairs weak or stale findings, creates the accepted artifact, and commits coordination updates
- expected artifact: `docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md`

The Deep Research pass is not independently authoritative. If it cannot read the live private repository, treat its output only as external-source reconnaissance and require Codex to reconstruct all repository baseline and ownership sections before acceptance.

## Gate 2 Acceptance And Cleanup

The accepted Gate 2 report is repository-grounded, uses 55 external sources, and has source-quality distribution 18 A1, 14 A2, 19 B1, and 4 B2. Its body citations and source register have exact URL parity.

The failed-attempt cleanup audit found no tracked, untracked, staged, ignored, or reachable-history Gate 2 report or candidate artifact. Nothing from the rejected attempt was assimilated, cited, removed, or renamed. The rejected report supplied no evidence. The former rejection record in the coordination files was retained only as provenance during this reconciliation and has now been replaced by the accepted current state.

## Accepted Gate 2 Findings

- The live catalogs contain 117 flora, 132 fauna, 24 monsters, 93 habitats, 36 biomes, 9 regional ecology profiles, 1,372 items, 1,617 market values, 121 production chains, 12 planned recipes across 8 families, 58 workplaces, 131 tools, 121 skills, 22 extraction methods, 2 resources, 2 commodities, 56 minerals, 27 crystals, 4 magic-infrastructure records, 28 Knowledge snippets, and 9 consumable profiles.
- Flora exposes 199 unique output keys across 1,394 occurrences; fauna exposes 459 across 484 occurrences. All 658 combined output keys resolve to canonical items and market values.
- All 249 flora/fauna IDs have market values, but only four are item keys; the other 245 are market identities, not inventory aliases.
- The biological catalogs contain 11,290 scalar `{}` placeholders where schemas declare booleans or numbers. Identity and relationship topology can be audited, but scalar ecology, yields, reproduction, population, regrowth, domestication, and destructive-impact values cannot be inferred.
- Static monster drops and loot are source-local probability envelopes only. No current runtime rolls them, creates inventory instances, executes harvesting/butchery/fishing, or owns mutable population and recovery state.
- Source, living individual, anatomical part, raw output, stabilized material, ingredient, finished product, market identity, loot possibility, generated instance, and mutable ecology state require separate authority.
- Existing identity breadth favors source-to-output, part-to-output, route, stabilization, tool/workplace/skill, ecology, and hazard relationships over automatic catalog expansion.
- Ordinary technology remains primary. Magic may only be bounded, finite, maintained, non-universal, canon-dependent assistance with explicit vessel, affinity, recharge, scale, failure, scarcity, security, and institutional ownership.

## Gate 2 Issues Requiring Later Verification

- Reconcile the 11,290 placeholder scalars with declared schemas and the lint placeholder path before any biological scalar consumer.
- Verify the shared female-only bird egg/feather route, `fauna.garter_snake` oviparity, the milk-producing `fauna.ox` identity, cervid antler routes, shell/scute/scale/bone naming, passive roe posture, and direct fish or marine-mammal oil stage collapse.
- Verify the six implied monster/fauna parallels before populating optional lineage fields.
- Determine whether raw pearl/nacre and other conditional byproducts have a canonical source, repeated consumers, and complete item/value/chain authority.
- Preserve existing generic guild controls while separately authoring any region/source-specific sacred, taboo, status, legal, or enforcement behavior.
- Do not infer yields, timers, quality, hazard chances, magical potency, actions, item creation, generated loot, populations, effects, economy behavior, or persistence from this report.

## Research Sequence And Integration Hold

1. `GPT-DR.resources.gathering-extraction` - complete
2. `GPT-DR.ecology.flora-fauna-byproducts` - complete
3. `GPT-DR.agriculture.land-food-livestock` - active next
4. `GPT-DR.materials.refinement-processing`
5. `GPT-DR.food.processing-preservation`
6. `GPT-DR.crafting.tools-workplaces-production`
7. `GPT-DR.magitech.production-infrastructure-substitution`
8. Unversioned cross-domain research integration
9. Revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`
10. `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`
11. `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`
12. Geographic Knowledge Taxonomy And Location Recognition Contract Plan
13. Re-read runtime ownership and select exactly one later consumer

`docs/dev/current-codex-prompt.md` and `docs/dev/queued-cross-domain-production-research-integration-prompt.md` remain byte-identical integration holds. Do not run the integration until all seven accepted temporary cited research artifacts exist. Gate 2 does not unblock `0.6.5` by itself.

## Preserved 0.6.5 Blocker

- Live recipes remain 12 planned standard records across 8 families.
- All 18 proposed recipe IDs and named item, value, tool, workplace, skill, and production-chain references resolved.
- Fifteen proposed rows used inputs absent from their named production-chain profile.
- Pastry dough omitted profile-declared `honeycomb`.
- Savory meat pie lacked an exact chain step consuming `smoked_meat`.
- The only exact input/output step shape lacked an authoritative quantity ratio.
- No recipe, test, schema, validator, runtime, UI, save, dependency, asset, or gameplay file changed.

Do not rerun the failed implementation target, author partial rows, or assume `1:1` quantities.

## Durable Boundaries

- `docs/design/0.6.5-research-prerequisite-and-recipe-authority-reconciliation.md` owns the sequence correction and recipe/chain posture.
- `docs/design/cross-domain-natural-resources-materials-production-and-magitech-research-program.md` owns research breadth, gate structure, mundane baseline, and magic constraints.
- `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md` owns later location recognition and character-facing Geography intentions.
- Research artifacts supply evidence, not implementation permission. Do not change content, recipes, production chains, schemas, validators, tests, lint code, runtime, UI, saves, migrations, dependencies, assets, or gameplay during the remaining gates.
