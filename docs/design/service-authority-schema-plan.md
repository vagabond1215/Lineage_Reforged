# Service Authority Schema Plan

Source version/run: Version 0.5.293 - Service Authority Schema Plan
Date: 2026-07-08
Status: documentation-only schema plan; no implementation

## 1. Plan Summary

This run defines the future static schema posture for a narrow provider-independent `civilization.services` vocabulary.

The future authority may define stable service identity, family vocabulary, descriptive tags, public posture vocabulary, provider-anchor type vocabulary, adjacent-owner type posture, provenance, and explicit non-execution guardrails. It must not define providers, availability, access checks, prices, payment, stock, inventory, storage contents, service effects, route traversal, law/reputation mutation, UI, commands, runtime state, save/account state, events, rewards, or gameplay behavior.

This run does not create service content, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, provider availability, prices, stock, access checks, effects, or gameplay.

## 2. Current Completed-State Posture

Latest completed primary before this run:

- `Version 0.5.292 - Discovery And POI Boundary Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.293 - Service Authority Schema Plan`

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

`Version 0.5.287 - Service Authority Boundary Decision` selected a hybrid model: current service-like descriptors remain on current or future owners, and a future static service catalog is justified only in principle for provider-independent identity and vocabulary.

`Version 0.5.290 - Static Authority Validation Consolidation Audit` confirmed service implementation remains deferred behind a separate schema plan, fresh live-repo audit, and seed plan.

`Version 0.5.292 - Discovery And POI Boundary Decision` rejected generic `world.pois` and selected this docs-first service schema plan as the next route.

## 3. Fresh Live-Repo Audit

No existing `civilization.services` content file, service schema, dedicated service validator, or normal content-lint registration exists.

Current service-like surfaces remain distributed:

- `civilization.buildings` contains 22 records and uses source-local `serviceFunctions`, `hostedWorkplaceIds`, categories, compatible settlement types, infrastructure requirements, placeability, and optional `storageProfiles`.
- Current building categories include `agrarian`, `civic`, `extractive`, `hospitality`, `industrial`, `maritime`, `military`, `service`, and `storage`.
- Current building `serviceFunctions` include terms such as `lodging`, `clinic`, `market_exchange`, `market_food_stalls`, `merchant_exchange`, `ferry_berth`, `port_handling`, `boat_landing`, `contract_board`, `guild_hall`, `archives`, `record_storage`, `controlled_storage`, `storage.warehouse`, `bulk_container_storage`, `dry_storage`, `haulage_staging`, `escort_staging`, `public_hygiene`, `laundering`, and additional storage, handling, stockyard, draft-yard, garrison, and waste-handling descriptors.
- Current building storage profile types are `cellar`, `granary`, `vault`, and `warehouse`; these describe capacity posture, not storage contents.
- `civilization.workplaces` remains workforce, production, tools, and facility semantics authority. It does not own service access, provider identity, or execution.
- `world.settlements`, `world.settlement_districts`, and `world.settlement_sites` own place identity and may later anchor service references only after their own schemas permit that reference posture.
- Settlement-economy, item/inventory, NPC/social, travel, civic/law, resource/commodity, and combat-health decisions all keep execution, prices, stock, state, access, and effects outside static service vocabulary.
- Current runtime/UI projections mention service coverage, lodging, local markets, reputation gates, inventory, pricing, and stock as gameplay-facing surfaces, but they do not create static service authority.

## 4. Planned Collection And Wrapper

Future collection path:

- `packages/content/base/civilization/services.json`

Future collection id:

- `civilization.services`

Future schema path:

- `packages/schemas/civilization/service.schema.json`

Future validator path:

- `tools/content-lint/services.mjs`

The planned content wrapper should match current records-only content posture:

```json
{
  "records": []
}
```

No metadata sidecar, generated file, content manifest, runtime registry, or normal content-lint registration is approved by this plan. Normal lint registration should wait until a later schema/validator run proves the helper and either a seed plan approves live content or the repo accepts future-content registration without records.

## 5. Planned Record Shape

Future service ids should use:

- `id`: `service.<slug>`
- `slug`: lower snake-case, matching the id suffix

The first-pass service schema should use these required fields:

- `id`
- `slug`
- `name`
- `status`
- `family`
- `summary`
- `tags`
- `publicPosture`
- `providerAnchorTypes`
- `allowedOwnerTypes`
- `sourceAuthorityNotes`
- `notes`

Optional fields:

- `relatedBuildingServiceFunctions`
- `relationshipNotes`

Do not include `aliases` in the first-pass schema. Service identity should not introduce migration aliases or converted-id compatibility.

`sourceAuthorityNotes` should be a non-empty array. `notes` should be an array and should include an explicit non-execution boundary note for every live seed record.

## 6. Lifecycle And Status

Use the standard static-authority status vocabulary:

- `planned`
- `active`
- `retired`

A service record may be `active` before canonical providers exist only if it remains pure vocabulary with no provider ids, availability, access checks, prices, stock, effects, UI, runtime, or save/account state. However, the first seed plan should prefer `planned` unless it proves that an active vocabulary-only service is needed by an existing validated consumer.

`retired` means the record remains historical static vocabulary and must not be used by new content unless a later migration or compatibility pass explicitly scopes that work. This plan does not approve migrations or compatibility aliases.

## 7. Family And Tag Vocabulary

The first-pass `family` enum should be conservative and provider-independent:

- `lodging`
- `market_exchange`
- `storage_handling`
- `travel_support`
- `civic_administration`
- `guild_institutional`
- `archive_record`
- `health_care`
- `training`
- `repair`
- `religious_service`
- `hygiene_laundry`
- `contract_brokerage`
- `draft_labor`
- `security_support`

`tags` should be controlled lower-snake strings. They may refine descriptive vocabulary such as `public_counter`, `licensed`, `route_facing`, `bulk_goods`, `records`, `care`, `maintenance`, `contracting`, `guild`, `waterfront`, or `lodging`. Tags must not be free-form prose, prices, access formulas, effects, stock categories, provider ids, UI flags, or runtime hooks.

Later expansion of `family` or `tags` requires a focused schema update or content seed plan.

## 8. Public Posture

`publicPosture` should be descriptive only, with this initial enum:

- `public`
- `limited`
- `restricted`
- `institutional`
- `regulated`

This field may say a service type is commonly public, limited, restricted, institutional, or regulated. It must not encode active access checks, player eligibility, faction standing thresholds, law outcomes, prices, membership records, permits, quest gates, UI visibility, or runtime service availability.

## 9. Provider And Owner Reference Posture

`providerAnchorTypes` and `allowedOwnerTypes` are type vocabularies only. They must not contain concrete ids.

Initial `providerAnchorTypes` enum:

- `building_template`
- `settlement_site`
- `settlement_district`
- `settlement`
- `workplace`
- `guild`
- `institution`
- `person`
- `npc`
- `route_facility`
- `market_context`
- `civic_authority`
- `religious_site`

Initial `allowedOwnerTypes` enum:

- `civilization.buildings`
- `civilization.workplaces`
- `civilization.guilds`
- `world.settlements`
- `world.settlement_districts`
- `world.settlement_sites`
- `world.travel_networks`
- `world.sacred_sites`
- `world.religious_hotspots`
- `civilization.quest_definitions`
- `civilization.quest_templates`
- `future.people`
- `future.npcs`
- `future.institutions`

These fields only describe which owner families may later reference a service vocabulary record after their own schemas and validators approve such references. They do not make those references valid today.

Forbidden first-pass fields include `providerRefs`, `providerIds`, `buildingIds`, `siteIds`, `npcIds`, `personIds`, `guildIds`, `settlementIds`, `currentProviders`, `availableProviders`, `openingHours`, `schedule`, `queue`, `staffing`, or equivalent concrete provider state.

## 10. Relationship To Building Service Functions

Existing `civilization.buildings.serviceFunctions` remain source-local descriptors.

The optional `relatedBuildingServiceFunctions` field may list current descriptor strings that a service vocabulary record helps define. It is a bridge for vocabulary clarity only. It must not migrate building records, require building records to change, make building descriptors canonical service ids, or authorize a service content seed by itself.

If this field is implemented, validation should require every listed descriptor to be an observed current building `serviceFunctions` value or a value explicitly approved by the same service seed plan. Unknown values should fail closed.

## 11. Forbidden Fields

The future service schema and validator should reject fields that imply execution or state ownership, including:

- provider availability, schedules, opening hours, appointments, queues, staffing, shifts, or capacity state;
- access checks, player eligibility, membership state, permits, reputation thresholds, faction standing, legal status, warrants, bounties, favorability, or court outcomes;
- prices, fees, discounts, taxes, tolls, fines, tariffs, payment, wallet mutation, credit, debt, or ledger changes;
- stock, shop inventory, vendor inventory, restock timing, item instances, item movement, ownership, theft, storage contents, container contents, cargo contents, or cargo movement;
- training, healing, repair, spell, crafting, lodging, banking, travel, court, worship, study, trial, or Knowledge effects;
- route traversal, ferry execution, cargo execution, pathfinding, transport state, journey state, travel time, or destination eligibility;
- UI menus, marker visibility, command handlers, events, rewards, Chronicle output, runtime state, save state, account state, history mutation, or gameplay execution.

Equivalent fields with different names should be rejected by intent even if a later validator does not list the exact spelling yet.

## 12. Validation Expectations

A later schema/validator implementation should prove:

- wrapper has only `records`;
- records use no additional properties;
- ids match `^service\\.[a-z0-9]+(?:_[a-z0-9]+)*$`;
- `slug` matches the id suffix;
- ids, slugs, and names are unique;
- `status`, `family`, and `publicPosture` use approved enums;
- `tags`, `providerAnchorTypes`, `allowedOwnerTypes`, and `relatedBuildingServiceFunctions` are unique arrays;
- tags use lower-snake strings and no free-form prose;
- `providerAnchorTypes` and `allowedOwnerTypes` contain type names only, not concrete ids;
- `relatedBuildingServiceFunctions`, when present, resolves to observed or same-plan-approved descriptor values;
- `sourceAuthorityNotes` is non-empty;
- forbidden fields and nested forbidden-field intent fail closed;
- no schema, validator, or normal lint wiring imports runtime/UI code.

Focused tests should cover a valid minimal record, duplicate ids/slugs, malformed ids, slug/id mismatch, invalid status/family/posture, duplicate array values, concrete provider refs, unresolved building service functions, forbidden pricing/stock/payment/access/effect/runtime/UI fields, and an active vocabulary-only record with no provider refs.

## 13. First Seed Prerequisites

Before any live service content seed, a later run must provide:

- a fresh live-repo audit of current service-like descriptors and service-facing runtime/UI language;
- an exact tiny candidate list;
- planned versus active status selection for each candidate;
- proof that each record is provider-independent vocabulary only;
- exact `family`, `tags`, `publicPosture`, `providerAnchorTypes`, `allowedOwnerTypes`, `relatedBuildingServiceFunctions`, `sourceAuthorityNotes`, and `notes`;
- proof that no candidate implies provider availability, prices, stock, payment, access checks, effects, UI, runtime, save/account state, or gameplay;
- a decision on whether normal content lint registration should wait for the first content seed or land with the schema/validator before live content.

Good first seed candidates should be drawn from existing building descriptors such as `lodging`, `market_exchange`, `clinic`, `storage.warehouse`, `ferry_berth`, `port_handling`, `archives`, `contract_board`, `public_hygiene`, or `laundering`, but this plan does not select any live seed records.

## 14. Rejected Alternatives

- Implement `civilization.services` now: rejected because this run is documentation-only.
- Keep all service vocabulary forever source-local: rejected as the long-term posture because service terms are already cross-domain enough to need a possible central vocabulary.
- Add concrete provider refs in the first service schema: rejected because provider identity and availability belong to separate current or future owners.
- Require migration of `civilization.buildings.serviceFunctions`: rejected because current descriptors remain valid source-local fields.
- Add aliases for service ids: rejected because this pre-release project should not add compatibility or migration-only behavior without explicit approval.
- Bundle services with vendors, shops, markets, resources, commodities, travel, courts, healing, repair, training, or UI: rejected because those systems own execution/state separately.
- Reopen Highcrown Knowledge work: rejected because the Highcrown settlement Knowledge lane is closed.

## 15. Explicit Non-Goals

This plan does not add or edit service content, resource content, commodity content, combat status/condition/injury content, Knowledge snippets, Knowledge registry/domain/trial-policy content, content JSON files, schemas, validators, tests, runtime code, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, anchors, sacred-site/religious-hotspot content, or gameplay behavior.

This plan does not authorize service providers, service availability, service access, prices, stock, storage contents, service effects, UI menus, normal content-lint registration, generated content, migrations, backwards compatibility, old-save preservation, or transition to `0.6.0`.

## 16. Next Recommended Version

Version 0.5.294 - Service Authority Schema And Validator

Reasoning: this plan now resolves the exact future collection path, wrapper, id pattern, status posture, field list, provider-reference boundaries, forbidden fields, validation expectations, and seed prerequisites requested by `0.5.287` and `0.5.290`. The next safe step is a narrow schema/validator implementation without live content, normal lint registration, runtime, UI, storage, commands, events, rewards, save/account behavior, provider availability, access checks, prices, stock, effects, or gameplay.

If a fresh prompt prefers another docs-first gate before implementation, choose a service seed/readiness plan instead of broadening the schema/validator scope.
