# Current Codex Output

Source version/run: Version 0.5.292 - Discovery And POI Boundary Decision
Date: 2026-07-08
Branch/status assumption: `master`; worktree clean at start. `git fetch origin` succeeded. `git pull --ff-only origin master` reported already up to date.

## Result

Completed the docs-only discovery and POI boundary decision.

Selected Option A: keep POI-like authored identity on specific owner families and keep discovery state as future runtime/save ownership. A generic static `world.pois` authority remains rejected for the current roadmap posture because it would duplicate settlements, settlement districts, settlement sites, sacred sites, religious hotspots, semantic map features, and future family-specific authorities such as ruins, forts, caves, mines, ports, and landmarks.

Defined boundaries for authored public/hidden/surveyable posture, known/discovered/visited/revealed/completed state, map reveal versus Knowledge discovery, route/hex/map-feature/place references, quest/narrative discovery, encounter/spawn exposure, UI marker eligibility, rewards/events, and save/session/account persistence.

Selected `Version 0.5.293 - Service Authority Schema Plan` as the next docs-first route because the discovery/POI gate now has an intake audit and boundary decision, while the services gate already has a boundary decision that justified a future narrow provider-independent service vocabulary in principle but still requires a schema plan before any implementation.

## Files Changed

- `docs/design/discovery-poi-boundary-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master`
- read-only inspections of required roadmap, handoff, backlog, sequence, intake audit, and recent authority decision docs
- targeted searches for discovery/POI/map-reveal/travel/route/Knowledge/quest/encounter/spawn/UI/save/account terminology across docs, content, schemas, validators, runtime, tests, and UI source
- targeted record counts for map, travel, settlement/site, sacred/hotspot, encounter/spawn, quest, and Knowledge surfaces
- targeted inspection of `knownLocations`, `discoveryChronicle`, `discoveredAtTick`, `discoveredAtLabel`, and related contract/fixture surfaces
- exact source searches for `world.pois`, `point_of_interest`, `points_of_interest`, and POI-related filenames
- service-next evidence scan for `civilization.services`, services gate, and service schema prerequisites
- static-validator forbidden-field scan for discovery/map-reveal/UI/reward/gameplay fields
- `git diff --check`
- `git status --short --branch`
- changed-file conflict-marker scan
- changed-file trailing-whitespace scan
- changed-path scope audit
- stale next-version pointer scan over active handoff, roadmap, sequence, backlog, and current Codex output
- accidental implementation-language scan for POI/discovery/map-reveal/service implementation
- accidental `world.pois` approval scan
- Highcrown Knowledge reopening scan
- ASCII scan over changed files
- `git ls-files --others --exclude-standard`

## Behavior / Runtime Confirmation

No runtime, JSON content, schema, validator, test, UI, storage, command, event, reward, migration, save/account, travel/pathfinding, map reveal, exploration, quest state, Knowledge state, encounter/spawn, service, resource, commodity, status, condition, injury, Highcrown Knowledge, or gameplay behavior changed.

## Risks / Follow-Up

- `Version 0.5.293 - Service Authority Schema Plan` should remain docs-first and must not implement service content, schemas, validators, runtime, UI, storage, commands, events, rewards, save/account behavior, or gameplay.
- A generic `world.pois` authority remains rejected unless a later owner decision proves a narrow non-duplicative role.
- Existing `knownLocations`, discovery Chronicle, geographic knowledge, achievement reveal, and UI discovery surfaces remain limited runtime/session/player/account surfaces, not a complete generic discovery/map-reveal authority.
- Future POI/discovery implementation still requires a focused schema or runtime/save plan, fresh live-repo audit, validation expectations, and seed plan where relevant.
- The Highcrown settlement Knowledge lane remains closed and must not be reopened without a later owner decision.
- Future resource, commodity, and combat health vocabulary implementation still requires separate focused schema plans, fresh live-repo audits, and seed plans.
- `docs/dev/project-vision-and-continuity-brief.md` still contains a historical `0.5.174` next-version pointer and was not edited because it was outside this run's allowed update set; refresh it in a separate docs cleanup if it is treated as active route guidance.

## Next Recommended Version

Version 0.5.293 - Service Authority Schema Plan

## Suggested Commit Message

docs(roadmap): decide discovery poi boundary
