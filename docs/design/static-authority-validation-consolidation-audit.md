# Static Authority Validation Consolidation Audit

Source version/run: Version 0.5.290 - Static Authority Validation Consolidation Audit
Date: 2026-07-08

## 1. Audit summary

This docs-only audit confirms that the recent static authority decisions remain coherent with each other.

The current posture is conservative:

- the Highcrown settlement Knowledge lane is closed;
- service authority is approved only in principle as a future provider-independent vocabulary;
- resource and commodity authorities are approved only in principle as future separate static vocabularies;
- combat status, condition, and injury authority is approved only in principle as a future typed, non-executing vocabulary/catalog;
- no deferred service, resource, commodity, status, condition, or injury authority has been implemented.

Validation expectations are clear enough to support later focused schema/validator plans, but they are not an implementation approval. Each deferred authority still requires its own schema plan, fresh live-repo audit, and seed plan before content, validator wiring, or normal lint registration.

## 2. Current completed-state posture

Latest completed primary before this run:

- `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.290 - Static Authority Validation Consolidation Audit`

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

## 3. Static authority lane matrix

| Lane | Current authority posture | Validation posture | Implementation posture |
| --- | --- | --- | --- |
| Highcrown settlement Knowledge lane | Closed after exactly five settlement, district, and site General Lore snippets. | Direct settlement validation exists; district/site subjects remain active-only. | No further Highcrown settlement/district/site snippets without a later owner decision reopening the lane. |
| Settlement, district, and site static authority | `world.settlements` is live canonical settlement identity; `world.settlement_districts` and `world.settlement_sites` are live static identity collections. | District/site schemas and validators are implemented and registered for live content. Knowledge subject validation supports settlement, active districts, and active sites. | Anchors and content remain unchanged; current Highcrown site `parentDistrictId: null` remains valid. |
| Service authority | Current service-like descriptors remain on existing/future owners. Future `civilization.services` is justified only for provider-independent identity/vocabulary. | Documentation-only. Later schema plan must define id shape, fields, provider-reference rules, and forbidden-field checks. | Deferred. No service content, schema, validator, normal lint, runtime, UI, storage, or gameplay. |
| Resource authority | Future `world.resources` may own source-material vocabulary and environmental compatibility. | Documentation-only. Later schema plan must resolve mappings to item keys, ecology/geography references, and forbidden runtime fields. | Deferred. No resource content, schema, validator, normal lint, runtime, UI, or gameplay. |
| Commodity authority | Future `world.commodities` may own bulk trade/economic class vocabulary. | Documentation-only. Later schema plan must resolve mappings to item keys/resources, market/profile relationships, and forbidden economy/runtime fields. | Deferred. No commodity content, schema, validator, normal lint, runtime, UI, or gameplay. |
| Combat status/condition/injury vocabulary | Future typed catalog is justified in principle, with records classified as `status`, `condition`, or `injury`. | Documentation-only. Later schema plan must define kind-specific fields and shared forbidden-field validation. | Deferred. No status, condition, or injury content, schema, validator, normal lint, runtime, UI, health, save/account, or gameplay. |

## 4. Deferred implementation matrix

| Deferred item | Required prerequisite | Explicitly not approved by this audit |
| --- | --- | --- |
| `civilization.services` | Separate service schema plan, fresh live-repo audit, and seed plan. | Service records, provider records, pricing, access, stock, UI, runtime service execution. |
| `world.resources` | Separate resource/commodity schema plan or split schema plans, fresh audit, and seed plan. | Resource records, extraction behavior, node placement, stock, item instances, gathering, runtime. |
| `world.commodities` | Separate resource/commodity schema plan or split schema plans, fresh audit, and seed plan. | Commodity records, prices, trade execution, cargo movement, storage contents, vendor inventory. |
| Typed status/condition/injury catalog | Separate combat-health vocabulary schema plan, fresh audit, and seed plan. | Active status state, health/resource math, wound instances, treatment, recovery, death/defeat, persistence. |
| Future schema plans | Focused prompt with owner review and exact validation contract. | Automatic schema creation from this audit. |
| Future validator/test plans | Focused prompt after schema plan acceptance. | Automatic validator wiring, normal content-lint registration, package tests, or content checks. |

## 5. Validation posture audit

Already validated today:

- existing content lint validates current live content collections that are already implemented and registered;
- settlement subject validation supports direct `settlement` references through live `world.settlements`;
- settlement district and site schemas and validators exist, normal lint validates live district/site content, and Knowledge subject validation enforces active-only district/site snippets;
- existing item keys, market item values, recipes, production chains, monsters, encounters, spawn profiles, combat roles, and tactics retain their current validators where already implemented.

Documentation-only today:

- future `civilization.services`;
- future `world.resources`;
- future `world.commodities`;
- future typed status/condition/injury catalog;
- any shared forbidden-field validators for those deferred authorities;
- any normal content-lint registration for those deferred authorities;
- any seed content for those deferred authorities.

Later schema/validator plans must resolve:

- exact collection paths, wrappers, id prefixes, slug rules, lifecycle/status vocabulary, and required fields;
- whether resources and commodities are planned together or split;
- whether combat health vocabulary is one typed catalog or split files under one schema plan;
- active/planned semantics and whether records can exist before complete adjacent authority references;
- fail-closed reference rules for item keys, providers, ecology/geography, production/crafting, body/resource state, spell/item hooks, monsters, and future health owners;
- explicit rejection of prices, stock, item instances, cargo/storage contents, active status state, resource deltas, body-state math, wound instances, timers, runtime execution, UI, commands, events, rewards, save/account state, and gameplay fields.

## 6. Owner-boundary audit

| Concern | Current owner or future owner | Boundary result |
| --- | --- | --- |
| Item identity | `items.items` | Resource/commodity records may reference item keys later but must not replace, rename, alias, migrate, or duplicate item identity. |
| Item instances | Runtime/save inventory and item-instance owners | Forbidden to services, resources, commodities, and static combat-health vocabulary. |
| Service vocabulary | Future `civilization.services`, if implemented | Provider-independent identity only; no provider availability or execution. |
| Provider identity and availability | Future people/NPC, building/site, guild/institution, schedule, runtime/service systems | Static services must not own current availability, staffing, queues, hours, or access. |
| Resources | Future `world.resources` | Source-material vocabulary only; no nodes, quantities, extraction, stock, or gameplay. |
| Commodities | Future `world.commodities` | Bulk trade/economic class vocabulary only; no prices, stock, cargo, trades, or storage contents. |
| Prices and market values | `civilization.market_item_values`, economy rules, runtime economy | Forbidden to services, resources, commodities, and static combat-health vocabulary. |
| Stock and inventory | Future vendor/shop/storage/runtime owners | Forbidden to static vocabularies. |
| Cargo/storage | Future cargo/storage authorities and runtime storage owners | Static vocabularies may at most describe handling context if later approved; they must not own contents or movement. |
| Combat status instances | Combat runtime/save state | Future static vocabulary may define names only, not active stacks, magnitudes, actors, or timers. |
| Health/resource state | Player/combat resource runtime and save state | Static vocabulary must not define HP, MP, stamina, resource deltas, modifiers, or recovery math. |
| Body state | Player body state and body-state runtime helpers | Static condition vocabulary must not own current nutrition, hydration, fatigue, intoxication, starvation, or multipliers. |
| Wounds/injuries | Future health/injury runtime/save/player/NPC owners | Static injury vocabulary must not own wound instances, severity, location, treatment, scars, or recovery timers. |
| Runtime execution | Runtime engines and focused gameplay systems | Forbidden to all deferred static authorities. |
| UI/commands/events/rewards | UI, command, event, reward, Chronicle, and runtime owners | Forbidden to all deferred static authorities. |
| Save/account persistence | Save/account/player-state owners | Forbidden to all deferred static authorities. |

Later prompts must avoid conflating static vocabulary with provider availability, item ownership, trade execution, cargo movement, combat state, health state, treatment, recovery, persistence, UI, or gameplay.

## 7. Stale reference audit

After this run, active route-bearing docs should state:

- latest completed primary: `Version 0.5.290 - Static Authority Validation Consolidation Audit`;
- latest support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`;
- immediate next primary route: `Version 0.5.291 - Discovery And POI Gate Intake Audit`.

The `0.5.290` route is now complete. The older `0.5.286` queue is also complete through its fourth and final item.

Historical design documents may still say their own next route at the time they were written. Those are acceptable historical references if they are not active handoff or roadmap pointers.

One older strategic brief, `docs/dev/project-vision-and-continuity-brief.md`, still contains a historical `0.5.174` next-version pointer. This audit did not edit that file because it was outside the allowed update set for this run. If that brief is still treated as active route guidance, a later documentation cleanup should refresh it.

## 8. Contradiction audit

No contradiction was found between the active handoff, roadmap, backlog, and recent design decisions for the static authority lanes:

- `0.5.285` closes the Highcrown settlement Knowledge lane;
- `0.5.287` defers service implementation while approving a future narrow vocabulary in principle;
- `0.5.288` defers resource/commodity implementation while approving separate future authorities in principle;
- `0.5.289` defers combat health vocabulary implementation while approving a future typed catalog in principle;
- `0.5.290` consolidates those decisions without creating new schema, content, validator, runtime, UI, or gameplay authority.

The main caution is sequencing clarity after the completed `0.5.286` through `0.5.290` queue. The backlog identifies discovery/POIs as the first of the next ten later gates, so the next route should be an intake audit, not implementation.

## 9. Highcrown settlement Knowledge lane

The Highcrown settlement Knowledge lane remains closed.

Do not add more Highcrown parent settlement, district, or site General Lore snippets, edit Knowledge registry/domain/trial-policy content for this lane, change Highcrown settlement/district/site content, change site anchors, or reopen the lane without a later owner decision.

## 10. Next recommended version

Version 0.5.291 - Discovery And POI Gate Intake Audit

Reasoning: the current service/resource/combat boundary queue has ended. The backlog identifies discovery/POIs as the first of the next ten later gates. A docs-first intake audit is the smallest safe next step because it can inspect current travel, map-feature, Knowledge, quest, settlement/site, discovery, and runtime boundaries before deciding whether any future schema or seed route is justified.

That route must not implement POI content, discovery state, map reveal, travel behavior, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, save/account behavior, or gameplay.

## 11. Explicit non-goals

This audit does not add or edit service content, resource content, commodity content, combat status content, condition content, injury content, Knowledge snippets, Knowledge registry/domain/trial-policy content, content JSON files, schemas, validators, tests, runtime code, UI, storage, commands, events, rewards, migrations, save/account behavior, combat behavior, health/resource behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, anchors, sacred-site or religious-hotspot content, or gameplay behavior.

This audit does not implement `civilization.services`, `world.resources`, `world.commodities`, or any status/condition/injury catalog.

## 12. Validation/checks run

Planned docs-only checks for this run:

- `git diff --check`
- `git status --short --branch`
- changed-file conflict-marker scan
- changed-file trailing-whitespace scan
- changed-path scope audit
- stale next-version pointer scan over active handoff, roadmap, sequence, backlog, and current Codex output
- accidental implementation-language scan for deferred service/resource/commodity/status/condition/injury lanes

Package tests are not required because this run is documentation-only.
