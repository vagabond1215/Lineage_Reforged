# Service Authority Post-Registration Audit

Source version/run: Version 0.5.299 - Service Authority Post-Registration Audit
Date: 2026-07-09
Status: documentation-only stability audit; no implementation

## 1. Audit Summary

The live `civilization.services` lane is stable after normal content-lint registration.

`packages/content/base/civilization/services.json` remains exactly the five approved planned provider-independent service vocabulary records. Normal content lint now includes that live file, loads the service schema, loads current building descriptors, and validates the live service wrapper through `validateServicesContent(...)` with `buildingsWrapper.records`.

No immediate service follow-up is needed. The next route should return to the oldest deferred static-authority lane that has an approved boundary but no schema plan:

- `Version 0.5.300 - Resource And Commodity Authority Schema Plan`

This audit does not add or edit service content, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, resource/commodity content, combat health content, POI/discovery content, Knowledge content, Highcrown settlement Knowledge content, or gameplay behavior.

## 2. Current Completed-State Posture

Latest completed primary before this run:

- `Version 0.5.298 - Service Authority Lint Registration`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.299 - Service Authority Post-Registration Audit`

Selected next primary route:

- `Version 0.5.300 - Resource And Commodity Authority Schema Plan`

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

A generic `world.pois` authority remains rejected by `Version 0.5.292 - Discovery And POI Boundary Decision`.

Typed combat status, condition, and injury vocabulary remains deferred behind a later schema plan, fresh audit, seed plan, and focused implementation prompt.

## 3. Live Service Seed Audit

The live service seed still contains exactly five approved records:

| Service id | Status | Family | Related building descriptor | Tags |
| --- | --- | --- | --- | --- |
| `service.lodging` | `planned` | `lodging` | `lodging` | `lodging`, `hospitality`, `rooms`, `rest` |
| `service.market_exchange` | `planned` | `market_exchange` | `market_exchange` | `market`, `exchange`, `commerce`, `counter` |
| `service.storage_warehouse` | `planned` | `storage_handling` | `storage.warehouse` | `storage`, `warehouse`, `bulk_goods`, `handling` |
| `service.archives` | `planned` | `archive_record` | `archives` | `archives`, `records`, `civic`, `reference` |
| `service.contract_board` | `planned` | `contract_brokerage` | `contract_board` | `contracts`, `brokerage`, `charters`, `notices` |

The `service.contract_board` tag `charters` remains intentional. It avoids the forbidden `ui` fragment in the original seed-plan candidate tag `guild` while preserving a neutral charter/contract-board descriptor.

No service ids, statuses, families, public postures, provider-anchor type lists, allowed-owner type lists, related building descriptors, source-authority notes, or non-execution notes need adjustment.

## 4. Normal Lint Registration Audit

`tools/content-lint/index.mjs` now has the expected registration posture:

- imports `validateServicesContent` from `./services.mjs`;
- includes `packages/content/base/civilization/services.json` in the normal `checks` array exactly once;
- loads `packages/schemas/civilization/service.schema.json`;
- loads `packages/content/base/civilization/buildings.json`;
- calls `validateServicesContent(...)`;
- passes `buildingsWrapper.records` into that call.

This means normal content lint now protects the live service seed against schema drift, forbidden service execution fields, unsafe tags, duplicate ids/slugs/names, id/slug mismatches, and stale `relatedBuildingServiceFunctions` values that no longer resolve against observed building descriptors.

Focused validation also remains aligned: `tests/unit/service-authority-validation.test.mjs` covers the live seed, the exact five planned ids, the absence of `relationshipNotes`, the `charters` tag, the normal registration, and the dependency wiring posture.

## 5. Boundary Audit

The service lane remains provider-independent static vocabulary only.

Registration did not add:

- concrete provider records or provider references;
- availability, schedules, access checks, prices, payment, stock, inventory, or storage contents;
- service effects, route traversal, travel execution, legal/reputation mutation, Knowledge progress, or gameplay behavior;
- UI menus, commands, events, rewards, Chronicle output, runtime state, save state, or account state;
- building/workplace descriptor migration;
- settlement, district, site, POI, resource, commodity, status, condition, injury, or Highcrown Knowledge content.

Existing `civilization.buildings.serviceFunctions` remain source-local descriptors. `relatedBuildingServiceFunctions` is only a provenance bridge from service vocabulary records back to observed building descriptor values.

## 6. Audit Questions Answered

1. Is `civilization.services` now a stable live static authority lane?
   - Yes, for the current narrow scope: exactly five planned provider-independent vocabulary records validated by normal content lint.
2. Does the live file still contain exactly five approved planned records?
   - Yes.
3. Does normal content lint include `packages/content/base/civilization/services.json` exactly once?
   - Yes.
4. Does normal content lint import and call `validateServicesContent(...)`?
   - Yes.
5. Does normal content lint load the service schema?
   - Yes.
6. Does normal content lint load buildings?
   - Yes.
7. Does normal content lint pass `buildingsWrapper.records`?
   - Yes.
8. Does focused validation pass for the live seed?
   - Yes.
9. Does normal content lint pass with the current checked-file count?
   - Yes, `content-lint: ok (64 files checked)`.
10. Are service ids, statuses, families, and related descriptors unchanged?
    - Yes.
11. Is `service.contract_board` tag `charters` documented and intentional?
    - Yes.
12. Are building descriptors source-local and unmigrated?
    - Yes.
13. Did registration add runtime, UI, save/account, or gameplay coupling?
    - No.
14. Are providers, availability, prices, payment, stock, access, effects, and gameplay still deferred?
    - Yes.
15. Is an immediate service follow-up needed?
    - No.
16. Should the roadmap continue service work or return to another deferred lane?
    - Return to the resource/commodity lane.
17. What is the immediate next route?
    - `Version 0.5.300 - Resource And Commodity Authority Schema Plan`.
18. Are any nonstandard runs needed before the selected next route?
    - No. A standard numbered docs-first Codex route is sufficient.
19. If a GPT Deep Research gate is relevant soon, which exact gate is it, and does it need to run before or after the next numbered Codex route?
    - `GPT-DR.resources.gathering-extraction` is the relevant future gate for deeper resource/gathering/extraction design. It does not need to run before `Version 0.5.300 - Resource And Commodity Authority Schema Plan` because `Version 0.5.288 - Resource And Commodity Schema Decision` is sufficient for one docs-first schema-plan pass. Run it later only if the schema plan finds gathering/extraction evidence is required before resource/commodity implementation or a gathering authority.
20. Are any explicit user questions required before proceeding?
    - No.

## 7. Roadmap Stability Check

The current known sequence is stable:

- `0.5.298` completed normal service content-lint registration.
- `0.5.299` is this docs-only service post-registration audit.
- `0.5.300` should return to deferred resource/commodity authority schema planning.

The service lane has now completed:

- boundary decision;
- schema plan;
- schema and focused validator;
- seed plan;
- live seed;
- normal content-lint registration;
- post-registration audit.

Remaining deferred static-authority lanes include:

- separate future `world.resources` and `world.commodities` authorities, approved in principle by `Version 0.5.288 - Resource And Commodity Schema Decision`;
- typed status/condition/injury vocabulary, approved in principle by `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`;
- later domain lanes such as agriculture, maritime, time/weather/festivals, property, construction, and progression.

Deep Research posture:

- `docs/design/gpt-deep-research-prompt-pack-decision.md` keeps `GPT-DR.resources.gathering-extraction` as the relevant future research gate for resource/commodity and gathering authority work.
- That gate is useful before deeper resource node, gathering, extraction, or implementation work.
- It is not required before the next numbered docs-first schema plan because `Version 0.5.288 - Resource And Commodity Schema Decision` already approved the paired resource/commodity authority posture in principle.
- No GPT Deep Research run should be started in this Codex run.

Support-suffix posture:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit` remains the latest support/audit run.
- No nonstandard support-suffix audit or repair run is needed before `Version 0.5.300 - Resource And Commodity Authority Schema Plan`.

## 8. Next Route Options

Option A: `Version 0.5.300 - Resource Authority Schema Plan`

Rejected as too narrow. `Version 0.5.288 - Resource And Commodity Schema Decision` approved separate future authorities, but the boundary between them is paired and should be planned together before either schema is implemented.

Option B: `Version 0.5.300 - Resource And Commodity Authority Schema Plan`

Selected. It matches the deferred `0.5.288` decision, preserves item-key ownership, and can define separate `world.resources` and `world.commodities` schema posture without implementing content, validators, normal lint registration, runtime, UI, save/account state, prices, stock, cargo, gathering, trading, crafting execution, services, or gameplay.

Option C: `Version 0.5.300 - Combat Status Condition Injury Schema Plan`

Deferred. Combat health vocabulary remains important, but the resource/commodity lane is the older deferred static-authority lane after service stabilization.

Option D: `Version 0.5.300 - Service Authority Follow-Up`

Rejected. The service lane is stable after normal registration and has no immediate blocker requiring more service work.

Option E: unnumbered GPT Deep Research gate

Rejected before the next numbered route. `GPT-DR.resources.gathering-extraction` is relevant later, but existing `0.5.288` guidance is sufficient for one docs-first resource/commodity schema plan. If a later run selects the gate, use ChatGPT Deep Research, artifact pattern `docs/dev/tmp-resources-gathering-extraction-research-YYYY-MM-DD.md`, and a named Codex integration consumer.

## 9. Selected Next Route

Selected route:

- `Version 0.5.300 - Resource And Commodity Authority Schema Plan`

Rationale:

- Service authority has no immediate post-registration blocker.
- `Version 0.5.288 - Resource And Commodity Schema Decision` approved resources and commodities as separate future static authorities but treated their boundary as a paired lane.
- A docs-first schema plan can define exact future paths, wrappers, id patterns, fields, forbidden fields, validation posture, and seed prerequisites without implementing content or behavior.
- Combat status/condition/injury remains deferred after resource/commodity because resource/commodity is the older unresolved static-authority lane after service stabilization.
- No explicit user question is required before proceeding to the selected next route.

## 10. Risks And Follow-Up

- The next resource/commodity run should be docs-first and should not create content, schemas, validators, tests, normal lint registration, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay.
- Resource and commodity planning must preserve `items.items` as canonical item-key identity and keep prices, stock, item instances, cargo movement, storage contents, service execution, gathering/extraction, trading, crafting execution, runtime, UI, and gameplay outside static records.
- Service content expansion, service provider modeling, descriptor migration, providers, availability, access checks, prices, payment, stock, effects, runtime, UI, save/account, route/travel, legal/reputation, and gameplay remain deferred.
- The Highcrown settlement Knowledge lane remains closed.
- Generic `world.pois` remains rejected.
- Typed status/condition/injury vocabulary remains deferred.
- `GPT-DR.resources.gathering-extraction` remains a later research gate, not a prerequisite for the next numbered schema-plan run.

## 11. Explicit Non-Goals

This audit does not add or edit service content, resource content, commodity content, combat status content, condition content, injury content, Knowledge snippets, Knowledge registry/domain/trial-policy content, content JSON files, schemas, validators, tests, runtime code, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, anchors, sacred-site/religious-hotspot content, map-feature content, POI/discovery content, providers, prices, stock, access checks, effects, or gameplay behavior.

This audit does not run Deep Research, create temporary research artifacts, implement `world.resources`, implement `world.commodities`, implement a status/condition/injury catalog, implement `world.pois`, or reopen the closed Highcrown settlement Knowledge lane.

## 12. Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master`
- Required reads of `AGENTS.md`, `README.md`, current output, current handoff, sequence, roadmap, backlog, pipeline roadmap consolidation decision, GPT Deep Research prompt-pack decision, recent service authority docs, resource/commodity and combat boundary docs, discovery/POI boundary docs, Highcrown closure review, live service content, service schema, service validator, normal content-lint index, focused service tests, and current building descriptors.
- `node --test tests/unit/service-authority-validation.test.mjs`
- `npm.cmd run tool:content-lint`
- `git diff --check`
- Changed-file conflict-marker scan
- Changed-file trailing-whitespace scan
- Changed-path scope audit
- Service implementation no-diff audit
- Active-route pointer scan

## 13. Next Recommended Version

Version 0.5.300 - Resource And Commodity Authority Schema Plan

That run should define the future schema posture for separate `world.resources` and `world.commodities` static authorities. It should include a fresh live-repo audit across item keys, market values, production chains, recipes, settlement economy strings, ecology/geography descriptors, flora/fauna outputs, services, and runtime boundaries, but it should not implement resource or commodity content, schemas, validators, tests, normal lint registration, runtime, UI, save/account behavior, storage, commands, events, rewards, migrations, prices, stock, cargo, gathering, trading, crafting execution, service execution, or gameplay.
