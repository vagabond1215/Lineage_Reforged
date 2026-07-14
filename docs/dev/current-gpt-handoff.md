# Current GPT Handoff

Source version/run: `Version 0.6.4 - World And Settlement Static Content Expansion`
Date: 2026-07-14

## Status

Latest completed primary:

- `Version 0.6.4 - World And Settlement Static Content Expansion`

Latest completed support/audit:

- `Version 0.6.3.3 - Engine-Owned Activity Selection Post-Repair Audit`

Completed maintenance:

- Unversioned `Historical Route Cleanup And Static Content Expansion Pipeline Integration`

Immediate next primary:

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`

Immediate route after accepted `0.6.5`:

- seven-gate `Cross-Domain Natural Resources, Materials, Production, And Magitech Research Program`;
- unversioned `Cross-Domain Natural Resources, Materials, Production, And Magitech Research Integration`;
- revised `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` only after research integration accepts.

Current execution status:

- Blocked at the `0.6.5` pre-authoring gate. All named identities resolve, but the named production-chain profiles do not supply the exact transformations and quantity ratios required to author the 18-row target without invention.

## Completed Package Evidence

- `0.6.4` is committed as `44dfb0a79bdd9941ca45e39d83b125b3ced6d9ca`, with parent `1e62aaeb4a7a23c5514eb7ffb49f26d20f9a6070`.
- The committed subject, `Harden diplomacy conflict authority evidence flow`, is historically inaccurate. The accepted diff is the canonical `Version 0.6.4 - World And Settlement Static Content Expansion` package; its intended subject was `content(world): expand settlement districts sites and features`. Shared history must not be rewritten.
- `0.6.4` added exactly 12 active districts, 18 active sites, 6 planned semantic map features, and 12 General Lore snippets across Verdant Thalos, Heart Basin, and Stormcap Coast.
- Live totals are 14 districts, 20 sites, 8 semantic map features, and 28 Knowledge snippets, including 18 General Lore snippets.
- The exact cluster matrix is 4 districts, 6 sites, 2 semantic features, and 4 General Lore snippets per cluster.
- All identity, parent, subject, geographic, and visual references close; 592/592 focused tests and normal content lint at 67 files pass.
- No schema, validator, generic POI, visual geometry, paused authority, runtime, UI, save, migration, dependency, asset, or gameplay behavior changed.

## Durable Authorities

- `docs/dev/historical-version-and-deferred-route-register.md` is the canonical query surface for historical aliases, suffixes, identity conflicts, deferred classifications, and reopening triggers.
- `docs/design/static-content-expansion-program.md` owns live inventory, readiness decisions, the static/runtime boundary, batch policy, the static sequence, and the runtime-resumption rule.
- `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md` owns the user-directed location-recognition criteria, character-facing Geography bracket/facets, and polity/border Knowledge boundary.
- `docs/design/cross-domain-natural-resources-materials-production-and-magitech-research-program.md` owns the user-directed broad research scope, seven gate sequence, mundane-technology baseline, useful-but-non-universal magic posture, and integration requirements.
- `docs/dev/queued-cross-domain-production-research-integration-prompt.md` is the exact Codex integration prompt to activate after successful `0.6.5`.
- `docs/dev/current-codex-prompt.md` contains the exact `0.6.5` implementation prompt and must activate that queued integration prompt after success.

## Historical Resolution

- `0.5.211` is an evidenced unused numbering gap; no proposal, implementation, or reservation exists.
- `0.5.356.1 - Tool Surface Test Post-Repair Audit` is conditional support only if fresh focused evidence contradicts the accepted repair.
- `0.5.357` canonically means Runtime Ownership Transition Readiness Consolidation. The older tool-surface audit identity is superseded.
- Historical proposed labels `0.5.199`, `0.5.202`, `0.5.205`, `0.5.207`, `0.5.210`, `0.5.213`, and `0.5.215` completed at `0.5.227`, `0.5.225`, `0.5.224`, `0.5.223`, `0.5.221`, `0.5.220`, and `0.5.219` respectively.

## Recognition And Geographic Knowledge Boundary

- Existing location snippets titled `Recognizing ...` are structural authored lore. They do not yet define the clues or criteria by which a character recognizes a place.
- Future recognition must compare learned clues with perceptible observed clues and account for literacy, language, emblems, practical understanding, viewpoint, sensory conditions, contextual distinctiveness, contradictions, and confirmation.
- Character-facing knowledge should project `Knowledge -> Geography` with parallel Physical Geography, Settlements And Places, Political Geography, and Cartography And Navigation facets. Do not force every subject into one exclusive continent-to-region-to-city tree.
- Kingdoms, empires, city-states, and similar realms remain `polity.*` identities. Borders, claims, control, jurisdiction, and historical territorial changes require separate overlays; physical regions and map features remain distinct owners.
- Preserve the docs-first post-`0.6.7` support route `Geographic Knowledge Taxonomy And Location Recognition Contract Plan`. Do not silently drop it when generating later prompts or handoffs.

## Cross-Domain Production And Magitech Research Boundary

- The research is broader than the 30 recipes expected after `0.6.5`. It covers flora, fungi, fauna, aquatic sources, monster-adjacent byproducts, minerals, ingredients, material states, refinement, food preservation, crafting processes, tools, workplaces, infrastructure, technology level, and magical substitution.
- Run seven named GPT Deep Research gates, one cited temporary artifact per gate. Do not merge them into one catch-all report.
- Research ordinary technology first. Magic may assist or replace modern-like functions in bounded specialist or institutional cases, but it is not the default household or settlement baseline.
- Magic must account for affinity, vessel tier/capacity, efficiency, stability, attunement, recharge, ambient conditions, target size/throughput, material conductivity/retention, skill, installation, maintenance, failure, scarcity, and cost.
- Preserve useful player-facing magical paths. Do not make magic merely decorative or so rare that meaningful magical production and infrastructure progression is absent.
- The Ice-conditioned-container example is a required case study. Relative shard/crystal/cluster recommendations may be researched, but exact size, temperature, duration, and balance formulas remain deferred.
- External research remains non-canonical until the unversioned integration reconciles it against live repository authority.
- `0.6.6` remains reserved until the integration either accepts `0.6.5` as-is or routes the smallest necessary `0.6.5.x` repair.

## Static Program Boundary

`0.6.4` is complete. Continue the exact route:

1. `0.6.5` - item, material, and recipe static content.
2. Seven GPT-DR gates for resources, ecology/byproducts, agriculture, material refinement, food processing, crafting production, and magitech substitution.
3. Unversioned cross-domain research integration.
4. Revised `0.6.6` - monster, ecology, and loot static content.
5. `0.6.7` - cross-content coherence and coverage audit.
6. Docs-first Geographic Knowledge Taxonomy And Location Recognition Contract Plan.
7. Re-read current source and select exactly one of activity advancement, rest, or quest turn-in.

The exact `0.6.5` target adds 18 planned standard recipes using existing item/material identities, values, tools, workplaces, skills, and production chains. It adds no item, value, profile, resource, commodity, workplace, tool, skill, chain, schema, validator, or lint-registration record.

All 18 proposed recipe ids remain available, and every referenced item key, tool, workplace, skill, and production-chain id resolves in the live catalogs. The prompt's fail-closed gate triggered: 15 rows use inputs absent from the named chain profile, the pastry-dough row omits required `honeycomb`, the meat-pie row lacks an exact step consuming `smoked_meat`, and the only exact step shape still has no authoritative quantity ratio. Do not implement partial rows or invent quantities. Reconcile the `0.6.5` target against current production-chain authority before recipe authoring.

Services and resource/commodity expansion remain paused. Weapon/armor profiles still require live collections and normal-lint registration before content. Consumable-profile anomalies remain out of scope. Generic `world.pois` remains rejected.

Static content and research must not imply item instances, inventory/storage mutation, crafting execution, dynamic vendors/economy/services, encounter/spawn simulation, dynamic loot, NPC population/schedules, construction/property/taxation/law enforcement, runtime ecology, spell casting, enchanting execution, or gameplay behavior.

Suggested next commit:

`docs(crafting): reconcile 0.6.5 exact recipe target`
