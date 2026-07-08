# Service Authority Lint Registration Decision

Source version/run: Version 0.5.297 - Service Authority Lint Registration Decision
Date: 2026-07-08
Status: documentation-only decision; no registration implemented

## 1. Decision Summary

Approve normal content-lint registration in principle for the live `civilization.services` seed, but only in a separate narrow implementation run.

The next implementation should register the existing live service content in normal content lint by reusing the existing schema and focused validator. It should not change service records, service schema, building descriptors, provider modeling, availability, access checks, prices, payment, stock, inventory, effects, UI, runtime, save/account state, route/travel behavior, legal/reputation behavior, or gameplay.

Immediate next route:

- `Version 0.5.298 - Service Authority Lint Registration`

## 2. Current Completed-State Posture

Latest completed primary before this run:

- `Version 0.5.296 - Service Authority Seed`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.297 - Service Authority Lint Registration Decision`

Current posture:

- `0.5.296` completed the first live service authority seed.
- The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.
- A generic `world.pois` authority remains rejected by `Version 0.5.292 - Discovery And POI Boundary Decision`.
- Future `world.resources`, `world.commodities`, and typed status/condition/injury catalog work remains deferred behind separate plans.

## 3. Current Service Authority Posture

Current service authority support:

- Schema: `packages/schemas/civilization/service.schema.json`
- Focused validator/helper: `tools/content-lint/services.mjs`
- Focused test path: `tests/unit/service-authority-validation.test.mjs`
- Live content path: `packages/content/base/civilization/services.json`

Live service records:

- `service.lodging`
- `service.market_exchange`
- `service.storage_warehouse`
- `service.archives`
- `service.contract_board`

All five live records remain `status: "planned"` and provider-independent. Normal content-lint registration remains absent.

The `service.contract_board` record uses `charters` instead of the original seed-plan candidate tag `guild` because the existing focused validator rejects tags containing the forbidden `ui` fragment.

Existing `civilization.buildings.serviceFunctions` remain source-local descriptors and were not migrated.

## 4. Normal Content-Lint Audit

`tools/content-lint/index.mjs` currently has two relevant validation layers:

- a `checks` array that reads each registered content file and performs generic wrapper, slug, and name/geographic checks;
- explicit dependency validation functions that load schemas and adjacent content before calling pure focused validators.

Nearby registered authority patterns include:

- religious hotspots: `validateReligiousHotspotsAgainstDependencies()` loads live content, schema, religions, regions, localities, and settlements, then calls `validateReligiousHotspots(...)`;
- sacred sites: `validateSacredSitesAgainstDependencies()` loads live content, schema, religions, parent hotspots, regions, localities, and settlements, then calls `validateSacredSites(...)`;
- settlement districts: `validateSettlementDistrictsAgainstDependencies()` loads live districts, schema, and settlements, then calls `validateSettlementDistricts(...)`;
- settlement sites: `validateSettlementSitesAgainstDependencies()` loads live sites, schema, settlements, and districts, then calls `validateSettlementSites(...)`;
- crafting recipes and Knowledge trial policies use the same pattern for schema plus adjacent authority loading.

Normal registration for services therefore likely needs:

- one `checks` array entry for `packages/content/base/civilization/services.json`;
- one import of `validateServicesContent` from `tools/content-lint/services.mjs`;
- one dependency validation function that loads:
  - `packages/content/base/civilization/services.json`;
  - `packages/schemas/civilization/service.schema.json`;
  - `packages/content/base/civilization/buildings.json`;
- one call from `main()` after the generic file checks and among the other dependency validators.

Registration does require editing `tools/content-lint/index.mjs`. No other registration surface was found.

## 5. Focused Validator Readiness Assessment

`tools/content-lint/services.mjs` is compatible with normal lint registration as-is.

Readiness findings:

- It exports `validateServicesContent(...)`, a pure function matching nearby helper patterns.
- It accepts a `relativePath`, wrapper, schema, and adjacent building records.
- It performs structural validation against `packages/schemas/civilization/service.schema.json`.
- It validates ids, slugs, duplicate ids/slugs/names, enum values, unique arrays, safe tags, forbidden fields, nested forbidden fields, and `relatedBuildingServiceFunctions`.
- It can fail closed when a service record references an unobserved building `serviceFunctions` descriptor.
- It does not import runtime, UI, game-shell, save/account, or app code.
- It already validates the live services file successfully through focused tests.

`services.mjs` should remain a pure helper. A separate adapter export is not required before registration because the existing normal lint index already wraps pure helpers through local dependency-loading functions.

## 6. Decision Questions Answered

1. Live `civilization.services` content should be registered in normal content lint now that the file exists, but registration should happen in a separate implementation run.
2. The existing focused validator/helper is compatible as-is.
3. Normal lint registration requires changing `tools/content-lint/index.mjs`.
4. `services.mjs` should remain a pure helper; no adapter export is required unless the implementation discovers an unexpected index pattern conflict.
5. No schema change is required before registration.
6. No service content change is required before registration.
7. No test change is inherently required before registration, though a minimal normal-lint registration assertion may be added if existing test patterns need it.
8. Normal lint registration should validate the live file directly through `validateServicesContent(...)`.
9. Normal lint registration should load `packages/content/base/civilization/buildings.json` so `relatedBuildingServiceFunctions` resolves against current descriptors.
10. Registration should fail closed when related building descriptors are missing or changed.
11. Future command coverage is listed in Section 10.
12. Future forbidden changes are listed in Section 12.
13. The next version should implement registration narrowly.
14. The immediate next roadmap route should be `Version 0.5.298 - Service Authority Lint Registration`.

## 7. Options Considered

### Option A - Register `civilization.services` In Normal Content Lint Next

Selected.

The live file now exists, focused validation passes, the pure helper is compatible with index dependency-loading patterns, and normal lint should become the standard content integrity surface for authored content.

### Option B - Keep Focused Validation Only Until More Service Content Exists

Rejected.

The existing five-record seed is already live authored content. Waiting for more service content would leave the normal lint surface blind to drift in a live authority file.

### Option C - Perform A Validator-Adapter Follow-Up Before Registration

Rejected as a separate route.

No adapter blocker was found. The index already wraps pure helpers with local async dependency-loading functions.

### Option D - Register Now In This Decision Run

Rejected.

This run is explicitly docs-only. Implementation belongs in the next narrow run.

## 8. Selected Option And Rationale

Option A is selected: approve normal content-lint registration in principle for the live service seed, implemented in `Version 0.5.298 - Service Authority Lint Registration`.

Rationale:

- The live service file is now authored content and should be covered by the normal lint command.
- The focused validator already covers the required service-specific semantics.
- The required adjacent dependency is narrow and stable: current building descriptors only.
- Registration can be done without touching service records or schema.
- Failing closed on missing building descriptors preserves the deliberate bridge between service vocabulary and current source-local building `serviceFunctions`.

## 9. Future Registration Scope

The future implementation should be limited to:

- `tools/content-lint/index.mjs`;
- possibly `tests/unit/service-authority-validation.test.mjs` or another existing focused registration test, only if needed to assert registration posture;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/project-roadmap.md`;
- `docs/future_content_backlog.md`.

Likely index changes:

- import `validateServicesContent`;
- add `packages/content/base/civilization/services.json` to `checks`;
- add `validateServicesAgainstDependencies()` or equivalent;
- load service content, service schema, and building content;
- call `validateServicesContent({ relativePath, wrapper, schema, buildings })`;
- call the new dependency function from `main()`.

## 10. Required Future Command Coverage

The future registration implementation should run:

- `npm.cmd run tool:content-lint`
- `node --test tests\unit\service-authority-validation.test.mjs`
- `node --test tests\unit\schema-files.test.mjs` if schema coverage or related assertions are touched
- `git diff --check`
- `git status --short --branch`

If a focused registration assertion is added or updated, run that exact test file and report the result.

## 11. Required Future Scans

The future registration implementation should scan for:

- conflict markers;
- trailing whitespace;
- accidental service content edits;
- accidental service schema edits;
- accidental service validator edits beyond a tiny adapter only if one is required;
- accidental building/workplace descriptor migration;
- accidental provider availability, schedules, access checks, prices/payment, stock/inventory, storage contents, effects, UI, runtime, save/account, route/travel, legal/reputation, command, event, reward, or gameplay fields;
- accidental Highcrown Knowledge reopening;
- stale next-version pointers.

## 12. Explicit Forbidden Future Registration Changes

The registration implementation must not:

- edit `packages/content/base/civilization/services.json`;
- add, remove, or change service records;
- edit `packages/schemas/civilization/service.schema.json`;
- migrate or edit `civilization.buildings.serviceFunctions`;
- edit building, workplace, settlement, district, site, route, travel, vendor, shop, market, cargo, or storage records;
- add provider records;
- add provider availability, schedules, access checks, prices, payment, stock, inventory, storage contents, effects, UI, runtime, save/account state, commands, events, rewards, route/travel behavior, legal/reputation behavior, or gameplay;
- edit Knowledge snippets, registry, domain, or trial-policy content;
- implement resources, commodities, combat status/condition/injury vocabulary, or generic `world.pois`;
- reopen the closed Highcrown settlement Knowledge lane.

## 13. Risks And Mitigations

- Risk: adding services to normal lint raises the checked-file count and can expose drift when building descriptors change. Mitigation: this is desired fail-closed behavior because service records explicitly claim those descriptors.
- Risk: implementing registration could accidentally broaden service authority into providers or execution. Mitigation: restrict the next run to index wiring and validation only.
- Risk: a future test may assert exact checked-file counts. Mitigation: update only minimal expected normal-lint coverage if such a test exists.
- Risk: `service.contract_board` tag history may confuse future seed comparisons. Mitigation: preserve the live `charters` tag unless a later validator revision intentionally changes tag-fragment policy.

## 14. Rejected Alternatives

- Registering in this run: rejected because this is docs-only.
- Leaving services focused-only indefinitely: rejected because the content file is now live.
- Editing service schema before registration: rejected because no schema blocker exists.
- Editing service records before registration: rejected because focused validation already passes.
- Migrating building descriptors to service ids: rejected because building descriptors remain source-local.
- Adding provider/content expansion before registration: rejected because provider identity and execution are outside static service authority.

## 15. Explicit Non-Goals

This decision does not add or edit service content, service schema, service validator, content lint registration, tests, runtime code, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, Knowledge content, resource content, commodity content, combat status/condition/injury content, POI/discovery content, map-feature content, sacred-site or religious-hotspot content, or gameplay behavior.

This decision does not approve providers, provider availability, schedules, access checks, prices, payment, stock, inventory, storage contents, effects, UI menus, commands, rewards, save/account state, generated content, migrations, compatibility aliases, old-save preservation, or transition to `0.6.0`.

## 16. Checks Run

Read-only audits and checks used for this decision:

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (reported known multi-branch fast-forward ambiguity)
- `git rev-parse HEAD`
- `git rev-parse origin/master`
- `git merge-base HEAD origin/master`
- Required reads of active output, handoff, sequence, roadmap, backlog, service seed plan, service schema plan, service boundary, static-authority audit, discovery/POI boundary, resource/commodity decision, combat-health boundary, and Highcrown closure docs.
- Reads of `packages/content/base/civilization/services.json`, `packages/schemas/civilization/service.schema.json`, `tools/content-lint/services.mjs`, `tools/content-lint/index.mjs`, `tests/unit/service-authority-validation.test.mjs`, and `tests/unit/schema-files.test.mjs`.
- Targeted normal content-lint registration pattern audit over `tools/content-lint/index.mjs`.
- Reads of nearby validators: settlement districts, settlement sites, sacred sites, and religious hotspots.
- `node --test tests\unit\service-authority-validation.test.mjs` (passed; 53 tests)

## 17. Next Recommended Version

Version 0.5.298 - Service Authority Lint Registration

Reasoning: the live service seed exists, focused validation passes, the validator is compatible with normal lint orchestration, and the only remaining service authority hardening step is narrow normal content-lint registration for the existing live file.
