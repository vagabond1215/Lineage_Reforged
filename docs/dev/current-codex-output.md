# Current Codex Output

Source version/run: Version 0.5.295 - Service Authority Seed Plan
Date: 2026-07-08
Branch/status assumption: `master`; worktree clean at start. `git fetch origin` succeeded. `git pull --ff-only origin master` succeeded and reported `Already up to date.`

## Result

Added the docs-only service authority seed plan at `docs/design/service-authority-seed-plan.md`.

The plan selects exactly five future provider-independent planned service vocabulary records for a later live seed:

- `service.lodging`
- `service.market_exchange`
- `service.storage_warehouse`
- `service.archives`
- `service.contract_board`

All selected candidates are observed in current `civilization.buildings.serviceFunctions`. The plan defines exact future field values, status choices, related building descriptors, source notes, non-execution notes, rejected candidates, normal-lint posture, live seed instructions, validation expectations, and the next route.

No live service content was added. No schema, validator, test, runtime, UI, storage, save/account, gameplay, provider, building, workplace, settlement, route, vendor, market, cargo, storage, Knowledge, resource/commodity, combat-health, POI/discovery, map-feature, sacred-site, or religious-hotspot content was changed.

## Files Changed

- `docs/design/service-authority-seed-plan.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master`
- Required reads of `AGENTS.md`, `README.md`, active output, active handoff, sequence, roadmap, backlog, service schema plan, service boundary, static-authority audit, discovery/POI boundary, resource/commodity decision, combat-health boundary, Highcrown closure review, service schema, service validator, and focused service authority tests.
- Structured extraction of current building `serviceFunctions`.
- Structured extraction of building categories.
- Structured extraction of hosted workplace ids.
- Structured extraction of building storage profile types.
- Targeted service-facing scans for market, vendor, stock, price, payment, inventory, access, lodging, clinic, ferry, port, storage, archive, contract, hygiene, laundering, runtime, UI, and travel language.
- `Test-Path -LiteralPath 'packages\content\base\civilization\services.json'` before edits (returned `False`)
- `rg -n 'civilization/services\.json|civilization\\services\.json|services\.mjs|validateServicesContent' tools\content-lint\index.mjs` before edits (no matches)
- `git diff --name-only` (changed files are docs only)
- `git diff --name-only -- packages\schemas tools\content-lint tests apps packages\engines packages\shared packages\content` (no output)
- `git ls-files --others --exclude-standard` (only `docs/design/service-authority-seed-plan.md`)
- `git diff --check` (passed; Git reported line-ending normalization warnings only)
- conflict-marker scan across changed files (no matches)
- trailing-whitespace scan across changed files (no findings)
- ASCII scan across changed files (no findings)
- stale next-version pointer scan across active docs (current pointers target `Version 0.5.296 - Service Authority Seed`)
- accidental live service file and normal content-lint registration scan after edits (live file absent; no registration matches)
- Highcrown/generic POI/deferred-behavior scan across changed docs (only guardrail language; no reopening or implementation language)
- `git status --short --branch`

## Behavior / Runtime Confirmation

Documentation-only change.

No live service content, normal content-lint registration, schema, validator, test, runtime, UI, storage, command, event, reward, migration, save/account behavior, provider availability, prices, payment, stock, inventory, access checks, service effects, route/travel behavior, legal/reputation behavior, Knowledge content, resource/commodity content, combat health content, POI/discovery content, map-feature content, sacred-site/religious-hotspot content, Highcrown Knowledge, or gameplay behavior changed.

## Risks / Follow-Up

- The next live seed must use the exact selected records and field values from `docs/design/service-authority-seed-plan.md`.
- Normal content-lint registration remains intentionally deferred unless the next prompt explicitly scopes it.
- `service.storage_warehouse` intentionally maps to observed building descriptor `storage.warehouse` because service ids require lower snake-case after `service.`.
- Rejected candidates such as `clinic`, `ferry_berth`, and `port_handling` remain deferred because they risk implying healing, travel, cargo, access, price, stock, or runtime behavior too early.
- A generic `world.pois` authority remains rejected by the current discovery/POI boundary decision.
- The Highcrown settlement Knowledge lane remains closed and must not be reopened without a later owner decision.

## Next Recommended Version

Version 0.5.296 - Service Authority Seed

## Suggested Commit Message

docs(roadmap): plan service authority seed
