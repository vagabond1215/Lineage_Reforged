# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

## Run Identity

Run:

`Version 0.6.4 - World And Settlement Static Content Expansion`

Suggested commit message:

`content(world): expand settlement districts sites and features`

## Execution Gate

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state. Preserve unrelated work.
2. Read:
   - `AGENTS.md`
   - `README.md`
   - `docs/dev/current-codex-output.md`
   - `docs/dev/current-gpt-handoff.md`
   - `docs/dev/current-codex-prompt.md`
   - `docs/design/static-content-expansion-program.md`
   - `docs/dev/historical-version-and-deferred-route-register.md`
   - `docs/dev/codex-sequenced-implementation-plan.md`
   - `docs/dev/project-roadmap.md`
   - `docs/future_content_backlog.md`
   - focused settlement, district/site, semantic map-feature, Knowledge, schema, validator, and test sources required by the target batch.
3. Confirm the unversioned `Historical Route Cleanup And Static Content Expansion Pipeline Integration` is complete and this exact `0.6.4` prompt is installed.
4. If the repository has advanced beyond this prompt, preserve the live anchor and stop for remapping. Never rewind a newer accepted route.
5. This is a content implementation run. Do not modify runtime, UI, saves, migrations, dependencies, package metadata, generated output, or assets.

## Purpose

Implement one substantial, coherent expansion of existing world and settlement canon using current strict owner families. Enrich nine existing settlements across three geographic clusters with districts, named settlement sites, semantic map features, and descriptive General Lore coverage.

Do not add generic `world.pois`, visual map geometry, simulation, or gameplay behavior.

## Mandatory Pre-Authoring Inventory

Before editing, reproduce and report at least:

- settlements: 88;
- settlement districts: 2 active;
- settlement sites: 2 active;
- regions: 41;
- region localities: 47;
- semantic map features: 2 planned;
- visual world-map aggregates: 1;
- Knowledge registry: 7 domains, 6 active and 1 planned;
- Knowledge snippets: 16;
- services: 5 planned;
- resources: 2 planned;
- commodities: 2 planned.

If the live counts differ, inspect the change and revise the matrix only when required by actual newer canon. Record the evidence; do not force stale counts.

Search every proposed id, slug, name, alias, parent, subject, and geographic anchor before authoring. Review existing settlement economy, survival, infrastructure, culture, religion, terrain, trade, guild, visual-map, region, locality, and hex descriptions for all target parents.

## Geographic Coverage Matrix And Exact Target

Use these existing parents and purposes:

| Cluster | Existing parent settlements | Coverage purpose | Exact additions |
| --- | --- | --- | --- |
| Verdant Thalos | `settlement.aurelis`, `settlement.vinecross`, `settlement.redcliff_quay` | continental city, inland market, and harbor relationships around the Thalos Run | 4 districts, 6 sites, 2 semantic map features, 4 General Lore snippets |
| Heart Basin | `settlement.riverthrone`, `settlement.granary_crown`, `settlement.millrun` | river capital, granary city, and production-market differentiation | 4 districts, 6 sites, 2 semantic map features, 4 General Lore snippets |
| Stormcap Coast | `settlement.breaksail`, `settlement.stormwatch_citadel`, `settlement.cliffsalt_priory` | harbor, defensive citadel, and religious coastal identity | 4 districts, 6 sites, 2 semantic map features, 4 General Lore snippets |

Implement exactly:

- 12 new settlement district records;
- 18 new settlement site records;
- 6 new semantic map-feature records;
- 12 new `knowledge_domain.general_lore` snippets covering the new/existing cluster canon.

Do not add settlement, region, locality, visual world-map geometry, service, resource, or commodity records. If a required reference cannot close without one, stop and report the blocker instead of broadening scope.

## Authoring Rules

### Districts and sites

- Use `packages/content/base/world/settlement_districts.json` and `packages/content/base/world/settlement_sites.json` only.
- Make major settlements structurally distinct through scale-appropriate civic, market, production, harbor, defensive, religious, residential, or archival functions supported by parent canon.
- Do not force districts onto settlements whose scale supports only named sites; distribute the exact matrix deliberately among the three parents in each cluster.
- Every record needs a unique id, slug, name, summary, valid parent, supported type/tags, honest lifecycle, and source-authority note.
- A site may reference a new district only when the physical/functional relationship is explicit. Otherwise attach it directly to the parent settlement.
- New records intended for Knowledge subjects must be `active`. Active means authored canonical availability, not simulation, discovery, staffing, services, or gameplay.
- Avoid duplicated functions, interchangeable prose, adjective-only variants, and claims that require NPC schedules, vendors, construction, property, taxation, law enforcement, dynamic economy, or runtime state.

### Semantic map features

- Use `packages/content/base/world/map_features.json` only.
- Add named rivers, ridges, bays, headlands, passes, marshes, or comparable geographic identities justified by current region/settlement canon.
- Close every place anchor and visual reference under the current schema and validator.
- Keep these records semantic and descriptive. Do not edit `world_map_features.json`, invent pixel geometry, add map images, or create a generic POI authority.
- Use the lifecycle status that honestly reflects current authored/reference readiness; do not mark a feature active merely to suggest unavailable gameplay.

### Knowledge

- Use the active `knowledge_domain.general_lore` authority and `packages/content/base/player/knowledge_snippets.json`.
- Add exactly 12 snippets total: four per cluster. Collectively cover parent settlement and new district/site subjects; do not create snippets for unsupported map-feature subjects.
- Every subject must exist and be active, and every subject/source type must be declared by the live registry.
- Keep snippets concise, descriptive, source-traceable, and non-spoiler. They must not grant discovery, skill, travel access, rewards, reputation, services, magic, or state changes.
- Do not change domain activation, policies, trial readiness, or Arcane Lore.

### Existing paused authorities

- Services, resources, and commodities remain paused. Existing records may inform descriptions, but do not add or activate them and do not claim provider availability, extraction, production, stock, prices, or trade simulation.
- Do not modify settlements, regions, localities, hexes, visual map aggregates, economy/runtime content, or other catalog families to make the batch easier.

## Allowed Files

Production content changes are limited to:

- `packages/content/base/world/settlement_districts.json`
- `packages/content/base/world/settlement_sites.json`
- `packages/content/base/world/map_features.json`
- `packages/content/base/player/knowledge_snippets.json`

Focused tests may be changed only when the new records expose a real existing coverage gap in the current authority test, not to weaken assertions or accommodate invalid content.

Coordination documentation may be updated only where required:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/design/static-content-expansion-program.md` only if live evidence requires a factual correction.

Do not change schemas or validators unless the current valid contract cannot express one of the already approved record types. If that occurs, stop and report the exact blocker; do not combine contract redesign with this content batch.

## Prohibited Scope

Do not add or change:

- runtime, UI, commands, events, saves, migrations, dependencies, package metadata, generated output, or assets;
- population simulation, NPC schedules/workers, vendors, stock, prices, services, construction, property, settlement growth, taxation, law enforcement, dynamic economy, reputation, rewards, discovery state, travel behavior, encounters, spawns, loot, or gameplay;
- generic `world.pois` or any parallel place authority;
- world-map image geometry or cartography;
- backwards-compatibility aliases or migration behavior;
- unrelated cleanup, renames, formatting, content, or tests.

## Validation

Run the smallest complete checks for this package:

1. Reproduce final counts and the three-cluster matrix.
2. Run normal content lint: `npm.cmd run tool:content-lint`.
3. Run the focused settlement district/site, map-feature, Knowledge registry/snippet, and schema-file tests that own these paths. Discover exact test filenames from the live checkout; do not guess or run the full suite.
4. Search for duplicate ids, slugs, names, aliases, missing parents, unsupported subject/source types, and orphan geographic references.
5. Confirm no generic `world.pois`, visual geometry, paused-authority, runtime, UI, save, migration, dependency, generated-output, or asset path changed.
6. Run conflict-marker and trailing-whitespace searches.
7. Run `git diff --check`.
8. Inspect the complete changed-path set and diff.

Do not run builds, typechecks, package installation, servers, generators, or the full test suite.

## Documentation And Next Prompt

On success:

- overwrite `docs/dev/current-codex-output.md` with the exact run result, counts, files, checks, behavior confirmation, risks, and suggested commit;
- update the current handoff and roadmap anchors so `0.6.4` is complete and `0.6.5` is next;
- update `docs/future_content_backlog.md` because this run adds canon and advances the program;
- overwrite `docs/dev/current-codex-prompt.md` with an exact implementation prompt for `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`.

The installed `0.6.5` prompt must require a fresh item/value/profile/recipe/resource/commodity/workplace/tool/skill inventory; define a dependency-closed set of recipe families and exact target batch; preserve paused resource/commodity expansion unless its reopening trigger has separately passed; add the narrow live collection/lint precondition before weapon or armor profiles if profiles are included; require item/value/input/output/tool/workplace/skill/profile closure, normal content lint, focused authority tests, and complete changed-path review; prohibit item-instance state, durability/quality/spoilage mutation, reservations, storage ownership, inventory capacity, crafting execution, dynamic availability, runtime, UI, saves, migrations, and gameplay; and require the exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt after successful completion.

Do not select a runtime consumer during this run.

## Completion Report

Record:

- starting commit and branch state;
- pre- and post-authoring counts;
- completed coverage matrix and dependency closure;
- exact new canon by owner family;
- files changed;
- checks run and results;
- confirmation that no integrated gameplay behavior changed;
- any skipped target and evidence-backed blocker;
- whether the exact `0.6.5` prompt was installed;
- suggested commit message.
