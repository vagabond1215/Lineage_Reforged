# Current Codex Output

Source version/run: Version 0.5.228 - World Map Feature Authority Schema Decision
Date: 2026-06-22
Branch/status assumption: `master`; synced with `origin/master` before editing; worktree was clean at `620e16e`.

## Result

Completed the documentation-only world map feature schema decision. The decision approves future strict records-only `world.map_features` as geometry-free semantic named-feature authority using stable `map_feature.<slug>` ids, controlled physical/cultural feature types, descriptive extent kinds, canonical place anchors, lifecycle, provenance, and optional non-authoritative visual references.

Existing `world.world_map_features` remains the unchanged visual/reference geometry aggregate. Existing places, map metadata/assets, hexes/edges, travel topology, political overlays, ecology/biomes, POIs, encounters/spawns, Knowledge, runtime, UI, and storage retain current ownership. The temporary world-map research artifact was deleted after full promotion.

## Files Changed

- `docs/design/world-map-feature-schema-decision.md` - added the permanent schema-posture decision.
- `docs/design/pipeline-roadmap-consolidation-decision.md` - recorded artifact retirement and advanced the immediate queue.
- `docs/dev/current-codex-output.md` - replaced with this run result.
- `docs/dev/current-gpt-handoff.md` - advanced the current anchor and map-feature authority rules.
- `docs/dev/project-roadmap.md` - marked `0.5.228` complete and `0.5.229` next.
- `docs/dev/codex-sequenced-implementation-plan.md` - advanced the ordered queue and decision source.
- `docs/future_content_backlog.md` - recorded the durable posture and artifact deletion.
- `docs/dev/tmp-world-map-spatial-systems-research-2026-06-19.md` - deleted after full promotion; no remaining consumer.

## Checks Run

- `git fetch origin` - passed.
- `git pull --ff-only origin master` - passed; already up to date.
- Live place, visual-map, geometry, hex/edge, route/travel, ecology/biome/climate/habitat, flora/fauna, POI, encounter/spawn, map-asset, Knowledge, schema, lint, test, runtime, and UI surface audit - passed.
- `git diff --check` - passed.
- Conflict-marker scan on changed files - passed.
- Trailing-whitespace scan on changed files - passed.
- Changed-path scope audit - passed; documentation paths only.
- Required-section audit - passed; all 17 sections present.
- Decision-completeness and visual-geometry boundary audits - passed.
- Implementation-scope and version/research tracking audits - passed.
- Tests were not run because this pass changed documentation only.

## Behavior / Runtime Confirmation

No schema, content JSON, validator, test, loader, lint registration, map feature, place, settlement, sacred-site/hotspot, visual geometry, coordinate, polygon/line/point, map asset, hex/edge/grid, route/travel, political, ecology/biome/climate, flora/fauna, encounter/spawn, POI, Knowledge, economy, runtime, UI, storage/save-state, migration, command, event, reward, service, access, law, favorability, alignment, or gameplay behavior changed.

## Risks / Follow-Up

- Conditional `0.5.240` must remain schema, pure-validator, and focused-test only; content and normal lint registration require a later seed plan.
- Semantic `map_feature.*` ids must never be equated automatically with aggregate `world_map_feature.*` or nested visual `feature.*` ids.
- Visual references are approximate/non-authoritative and cannot import geometry or establish identity.
- Routes/crossings/ports, political overlays, ecology integration, POI placement, Knowledge support, and grids require their own decisions.

## Next Recommended Version

Version 0.5.229 - Hazard And Route Security Boundary Decision

## Suggested Commit Message

`docs(world): decide map feature schema posture`
