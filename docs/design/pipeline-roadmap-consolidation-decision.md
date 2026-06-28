# Pipeline Roadmap Consolidation Decision

Source version/run: Version 0.5.217 - Pipeline Roadmap Consolidation
Date: 2026-06-20
Status: approved documentation-only pipeline authority; no implementation permission

## 1. Decision Summary

Consolidate the post-`0.5.216` planning pipeline around one monotonic version sequence, explicit dependency gates, and named retirement points for all 12 temporary Deep Research artifacts.

This consolidation pass temporarily occupies `0.5.217`. The previously queued `Version 0.5.217 - Settlement Identity Schema Decision` has not landed and moves to `Version 0.5.218 - Settlement Identity Schema Decision`. All other unlanded recommendations with numbers lower than the current anchor are renumbered when scheduled; their old labels remain historical references only.

The immediate pipeline is docs-first: settlement, recipe/production, monster, weapon/armor, quest objective/condition, people/NPC, magic-study source, polity, household/family, settlement economy, map feature, then hazard/route security. Approved schema decisions may then advance to schema/validator/focused-test passes, followed by seed plans and narrow content seeds. The hazard/route-security schema decision landed in `0.5.241`; hazard vocabulary landed in `0.5.242`, route security landed in `0.5.243`, first recipe seed planning landed in `0.5.244`, and hazard target overlays remain later.

No outstanding new Deep Research topic blocks `0.5.230`. Existing permanent decisions provide sufficient planning input. New research should be commissioned only before the later lane that needs it, not as a broad interruption to the ready schema/validator queue.

Do not roll to `0.6.0`. Runtime, UI, save-state, player-state, mutation, execution, transactions, services, combat, crafting, property, settlement simulation expansion, and integration remain blocked until static authorities and validation lanes are stable and a dedicated runtime-readiness consolidation explicitly approves the transition.

## 2. Current Planning State

The repository has completed a broad static-authority wave while retaining substantial live content and runtime foundations. The current planning problem is sequencing, not lack of ideas.

Current facts:

- 12 permanent authority-boundary decisions from `0.5.197` through `0.5.216` define world, economy, family, civic, travel, magic study, NPC/social, narrative, item/equipment, combat, crafting, and settlement ownership.
- No temporary Deep Research artifact remains in `docs/dev` from the consolidated `0.5.218`-`0.5.229` queue. The settlement, crafting, combat, item/equipment, quest/event/Chronicle, NPC/social, magic/Knowledge/study, civic, family, economy, world-map, and travel artifacts were retired by `0.5.218` through `0.5.229`.
- Multiple valid schema decisions were repeatedly displaced by user-prioritized authority lanes, leaving stale labels such as `0.5.199`, `0.5.202`, `0.5.205`, `0.5.207`, `0.5.209`, `0.5.210`, `0.5.213`, `0.5.215`, and `0.5.217` in coordination history.
- The project is still in `v0.5.x` foundation stabilization. Static authority, validation, and narrow seed work remain appropriate; broad runtime ownership transition does not.
- Religion/hotspot/sacred-site and Knowledge framework work already demonstrates the preferred cadence: decision, schema/validator/tests, seed plan, seed, then narrow integration.

This document becomes the durable source for the consolidated sequence. `docs/dev/current-codex-output.md` remains the exact latest run; `current-gpt-handoff.md` remains the immediate guardrail; the roadmap and sequenced plan mirror this decision.

## 3. Completed Authority-Boundary Decisions

| Version | Permanent decision | Established authority |
| --- | --- | --- |
| `0.5.197` | World Geography | Preserved place hierarchy; selected future geometry-free map features; separated routes, political overlays, ecology, POIs, visual geometry, and grids. |
| `0.5.198` | Economy | Separated settlement economies, resources/commodities, market profiles, production, professions, guilds/institutions, crafting, trade overlays, and runtime economy. |
| `0.5.200` | Family | Separated people, households, families, kinship, genealogical lineages, estates, inheritance, prestige, and player legacy state. |
| `0.5.201` | Civic | Separated polities, governments, jurisdictions, laws, civic actors, public order, diplomacy/conflicts, and mutable player legal/faction state. |
| `0.5.203` | Travel | Preserved maps/hexes/edges/networks/encounters/spawns; separated route security, hazards, camps, discovery, journey state, and travel runtime. |
| `0.5.204` | Magic Study | Separated spell identity, known-spell ownership, study sources/policies, Knowledge, rituals, trials, teachers/institutions, item metadata, and player magic state. |
| `0.5.206` | NPC And Social | Selected future people/NPC separation; separated roles, workplaces, schedules, dialogue, relationships, rumors, companions, services, reputation, and runtime social state. |
| `0.5.208` | Quest Event Chronicle | Preserved definitions/archetypes/templates; separated objectives/conditions, offers, events/storylets, rumors/hooks, Chronicle templates, rewards, and narrative runtime state. |
| `0.5.209` | Item Equipment Inventory | Preserved item identity/consumables; selected future weapon/armor/container/loot authorities; separated values/currency and mutable inventory/equipment/item state. |
| `0.5.212` | Combat | Preserved monsters, encounter templates, spawn profiles, roles, and tactics; separated damage posture, statuses/injuries, loot, consequences, and combat runtime state. |
| `0.5.214` | Crafting | Selected future `crafting.recipes`; preserved production chains/workplaces/items/economy; separated tools/stations, professions, quality, repair/salvage, alchemy/enchanting, and crafting state. |
| `0.5.216` | Settlement | Preserved live `world.settlements`; separated districts, placed sites, building/infrastructure/workplace templates, services, property anchors, specialized spaces, travel anchors, and runtime state. |

Religious hotspot and sacred-site authority/schema/seed work is already landed adjacent static-authority precedent. It is not an unfinished member of this boundary-decision wave.

## 4. Temporary Research Artifact Inventory

Every temporary artifact was consumed as planning input and later retired by its named follow-up.

| Temporary artifact | Permanent consumer | Current status | Retirement trigger |
| --- | --- | --- | --- |
| `tmp-settlement-space-systems-research-2026-06-20.md` | Settlement decision and settlement identity decision | Retired in `0.5.218` after full promotion | Deleted; no remaining consumer. |
| `tmp-crafting-production-systems-research-2026-06-20.md` | Crafting decision and recipe/production decision | Retired in `0.5.219` after full promotion | Deleted; no remaining consumer. |
| `tmp-combat-encounter-systems-research-2026-06-20.md` | Combat decision and monster-record decision | Retired in `0.5.220` after full promotion | Deleted; no remaining consumer. |
| `tmp-item-equipment-inventory-systems-research-2026-06-20.md` | Item/equipment decision and weapon/armor profile decision | Retired in `0.5.221` after full promotion | Deleted; no remaining consumer. |
| `tmp-quest-event-chronicle-systems-research-2026-06-20.md` | Quest/event and objective/condition decisions | Retired in `0.5.222` after full promotion | Deleted; no remaining consumer. |
| `tmp-npc-social-systems-research-2026-06-20.md` | NPC/social and person/NPC decisions | Retired in `0.5.223` after full promotion | Deleted; no remaining consumer. |
| `tmp-magic-knowledge-study-systems-research-2026-06-20.md` | Magic-study authority and source decisions | Retired in `0.5.224` after full promotion | Deleted; no remaining consumer. |
| `tmp-civic-authority-systems-research-2026-06-20.md` | Civic authority and polity decisions | Retired in `0.5.225` after full promotion | Deleted; no remaining consumer. |
| `tmp-family-lineage-systems-research-2026-06-20.md` | Family and household/family decisions | Retired in `0.5.226` after full promotion | Deleted; no remaining consumer. |
| `tmp-economy-systems-research-2026-06-20.md` | Economy and settlement-economy decisions | Retired in `0.5.227` after full promotion | Deleted; no remaining consumer. |
| `tmp-world-map-spatial-systems-research-2026-06-19.md` | World-geography and map-feature decisions | Retired in `0.5.228` after full promotion | Deleted; no remaining consumer. |
| `tmp-travel-exploration-systems-research-2026-06-20.md` | Travel and hazard/route-security decisions | Retired in `0.5.229` after full promotion | Deleted; no remaining consumer. |

Retired temporary artifacts are not canon and must not override their permanent decisions.

## 5. Deferred Codex Route Inventory

| Historical/unlanded route | Consolidated version | Readiness |
| --- | --- | --- |
| Settlement Identity Schema Decision (`0.5.217`) | `0.5.218` | Ready; displaced by this consolidation. |
| Recipe And Production Schema Decision (`0.5.215`) | `0.5.219` | Ready. |
| Monster Record Schema Decision (`0.5.213`) | `0.5.220` | Ready. |
| Weapon And Armor Profile Schema Decision (`0.5.210`) | `0.5.221` | Ready after monster review clarifies shared combat references. |
| Quest Objective And Condition Schema Decision (previously `0.5.209`) | `0.5.222` | Ready after item/reward and combat-reference boundaries. |
| Person vs NPC Schema Decision (`0.5.207`) | `0.5.223` | Ready. |
| Magic Study Source Schema Decision (`0.5.205`) | `0.5.224` | Ready. |
| Polity Schema Decision (`0.5.202`) | `0.5.225` | Ready. |
| Household vs Family Schema Decision (previously `0.5.201`) | `0.5.226` | Completed after the person/NPC decision; temporary family artifact retired. |
| Settlement Economy Schema Decision (`0.5.199`) | `0.5.227` | Completed after settlement identity and crafting/production decisions; temporary economy artifact retired. |
| World Map Feature Authority Schema Decision (previously suggested `0.5.198`) | `0.5.228` | Completed after settlement identity review; temporary world-map artifact retired. |
| Hazard And Route Security Boundary Decision (previously suggested `0.5.204`) | `0.5.229` | Completed after map-feature decision; temporary travel artifact retired. |

Other valid deferred routes remain backlog candidates without assigned near-term numbers: container templates/loot tables, encounter/spawn profiles, combat status/condition, magic-study policies, dialogue/rumor/relationship links, institutions, jurisdictions/laws, trade-route overlays, settlement districts/sites, services, property, resources/commodities, and crafting repair/salvage.

## 6. Outstanding Deep Research Inventory

No new Deep Research is required before `0.5.230`.

| Topic | Classification | Required before |
| --- | --- | --- |
| Resource nodes, gathering, mining, forestry, fishing, foraging, extraction | Useful before later schema work | `0.5.254` resource/commodity decision or any gathering authority. |
| Services, vendors, shops, training, lodging, repair, temples | Useful before later boundary work | `0.5.253` service boundary. |
| Health, disease, medicine, fatigue, aging, recovery, long-term injury | Useful before later boundary work | `0.5.255` combat status/condition/injury decision. |
| Discovery, exploration records, map reveal, POIs, secrets, landmarks | Useful before content/site work | Map-feature seed planning at `0.5.250` and settlement-site decision at `0.5.252`. |
| Agriculture, land use, food, farming, livestock, harvests | Useful after core schema decisions | Resource/gathering/agriculture lane after `0.5.241`. |
| Maritime systems, ships, ports, fishing, sea trade, piracy, naval travel | Useful after route/map decisions | Post-`0.5.243` maritime authority lane. |
| Time, calendar, seasons, weather, festivals, recurring events | Useful after core schema decisions | Temporal/event/weather authority lane; not current schema queue. |
| Property, ownership, estates, businesses, storage, housing runtime | Useful after person/household/site decisions | Property authority after `0.5.252`. |
| Construction, upgrades, settlement development, projects, fortifications | Useful after site/infrastructure decisions | Construction authority after `0.5.252`. |
| Character creation, attributes, skills, progression, backgrounds, training | Can wait | Later progression consolidation after current static-authority queue. |
| Companions, party, followers, hirelings, recruitment, loyalty | Can wait | After people/NPC and relationship authority; before runtime integration. |
| Dialogue, rumors, social memory, conversations, recognition, reputation runtime | Can wait | After people/NPC schema; before social runtime. |
| Procedural generation and authored-vs-generated strategy | Can wait | After canonical schemas/content seeds define generation targets. |
| Save-state architecture and runtime persistence boundaries | `0.6` readiness research | Runtime-transition consolidation only. |
| UI/UX information architecture | `0.6` readiness research | After stable static contracts and command/state ownership. |

Research artifacts should be narrow and named for one future authority question. Do not create broad catch-all reports that duplicate the permanent roadmap.

`docs/design/gpt-deep-research-prompt-pack-decision.md` owns the default priority, dependency map, recommended modes, artifact names, and prompt-generation policy for the first ten later gates in this inventory. `GPT-DR.discovery.poi-map-reveal` is the default first later gate, subject to a live dependency check after the immediate numbered queue. The prompt pack does not reserve versions or change any associated lane's prerequisite.

## 7. Dependency Map

```text
Settlement identity (0.5.218)
  -> settlement economy (0.5.227)
  -> map features (0.5.228)
  -> settlement districts/sites (0.5.252/0.5.256)

Recipe/production (0.5.219)
  -> recipe schema/validation (0.5.231)
  -> recipe seed plan/content seed (0.5.244-0.5.245)
  -> resources/commodities (0.5.254)

Monster (0.5.220)
  -> weapon/armor profiles (0.5.221)
  -> combat hardening (0.5.232)
  -> weapon/armor profile implementation (0.5.233)
  -> status/condition/injury boundary (0.5.255)

Quest objectives/conditions (0.5.222)
  -> quest validation (0.5.234)

People/NPC (0.5.223)
  -> household/family (0.5.226)
  -> people schema/seed (0.5.235, 0.5.246-0.5.247)
  -> services/property/companions/social runtime later

Polity (0.5.225)
  -> polity schema/seed (0.5.237, 0.5.248-0.5.249)
  -> government/jurisdiction/law later

Map features (0.5.228)
  -> hazard/route security (0.5.229, 0.5.241-0.5.243)
  -> map-feature seed (0.5.250-0.5.251)
```

Completed docs-only schema decisions: settlement identity, recipe/production, monster, weapon/armor, quest objectives/conditions, people/NPC, magic-study sources, polity, household/family, settlement economy, map features, and hazard/route security.

Blocked lanes: hazard target overlays need stable hazard vocabulary and target policy; settlement sites/districts need settlement identity review; services need people/site/economy boundaries and focused research; property needs people/household/site boundaries; resource nodes need focused research and map/economy/crafting reconciliation; status/injury needs health research; all runtime integration needs `0.6` readiness.

## 8. Version Number Cleanup

Rules:

1. This consolidation is `Version 0.5.217 - Pipeline Roadmap Consolidation`.
2. The displaced settlement decision becomes `0.5.218`; it does not share `0.5.217`.
3. A version number is consumed only by a landed run. Never reuse a completed number.
4. Once a higher version lands, an older unlanded label is stale and must be renumbered when scheduled. Do not run versions retroactively.
5. Historical docs may retain the old proposed label as history, but current coordination docs must show the consolidated label.
6. No automatic patch-to-minor rollover exists. `0.5.999` would still be valid if foundation stabilization continued.
7. `0.6.0` is a maturity transition, not the number after a convenient `0.5.x` pass.

Known collisions/stale assumptions resolved here:

- `0.5.198` is Economy, so Map Feature Schema Decision moves to `0.5.228`.
- `0.5.201` is Civic, so Household vs Family moves to `0.5.226`.
- `0.5.204` is Magic Study, so Hazard And Route Security moves to `0.5.229`.
- `0.5.209` is Item/Equipment/Inventory, so Quest Objective And Condition moves to `0.5.222`.
- `0.5.217` is this consolidation, so Settlement Identity moves to `0.5.218`.
- All other older unlanded labels are remapped in Section 5.

## 9. Recommended 0.5.x Sequenced Roadmap

The next 39 recommended passes are:

| Version | Pass | Type / gate |
| --- | --- | --- |
| `0.5.218` | Settlement Identity Schema Decision | Docs-only; audit existing schema. |
| `0.5.219` | Recipe And Production Schema Decision | Docs-only; resolve embedded recipe overlap. |
| `0.5.220` | Monster Record Schema Decision | Docs-only; audit existing schema. |
| `0.5.221` | Weapon And Armor Profile Schema Decision | Docs-only. |
| `0.5.222` | Quest Objective And Condition Schema Decision | Docs-only. |
| `0.5.223` | Person vs NPC Schema Decision | Docs-only. |
| `0.5.224` | Magic Study Source Schema Decision | Docs-only. |
| `0.5.225` | Polity Schema Decision | Docs-only. |
| `0.5.226` | Household vs Family Schema Decision | Completed docs-only; depends on people/NPC. |
| `0.5.227` | Settlement Economy Schema Decision | Completed docs-only; depends on settlement and production. |
| `0.5.228` | World Map Feature Authority Schema Decision | Completed docs-only. |
| `0.5.229` | Hazard And Route Security Boundary Decision | Completed docs-only; temporary travel artifact retired. |
| `0.5.230` | Settlement Schema And Validator Hardening | Only if `0.5.218` approves changes; focused tests. |
| `0.5.231` | Crafting Recipe Schema And Validator | Completed; strict schema, isolated validator, focused tests, no live content. |
| `0.5.232` | Monster Schema And Validator Hardening | Completed; pure monster authority validation, focused tests, no schema/content/runtime change. |
| `0.5.233` | Weapon And Armor Profile Schemas And Validators | Completed; strict future schemas, isolated pure validators, focused tests, no live profile content or normal lint registration. |
| `0.5.234` | Quest Objective And Condition Validation Pass | Completed; pure embedded action-tree validation, normal content-lint wiring, focused tests, and two minimal non-negative weight fixes. |
| `0.5.235` | People And NPC Schemas And Validators | Completed; strict future schemas, isolated pure validator, focused tests, no live content. |
| `0.5.236` | Magic Study Source Schema And Validator | Completed; strict future schema, isolated pure validator, focused tests, no live content. |
| `0.5.237` | Polity Schema And Validator | Completed; strict future schema, isolated pure validator, focused tests, no live content. |
| `0.5.238` | Household And Family Schemas And Validators | Completed; strict future schemas, isolated pure validator, focused tests, no live content. |
| `0.5.239` | Settlement Economy Schema And Validator | Completed; strict future schema, isolated pure validator, focused tests, no live content. |
| `0.5.240` | World Map Feature Schema And Validator | Completed; strict future schema, isolated pure validator, focused tests, no live content. |
| `0.5.241` | Hazard And Route Security Schema Decision | Completed docs-only; approved staged hazard-first schema posture. |
| `0.5.242` | Hazard Profile Schema And Validator | Completed; strict target-free reusable hazard vocabulary schema, isolated pure validator, focused tests, no live content. |
| `0.5.243` | Route Security Profile Schema And Validator | Completed; strict future schema, isolated pure validator, focused tests, no live content. |
| `0.5.244` | First Crafting Recipe Content Seed Plan | Completed docs-only; selected conservative standard-recipe seed strategy. |
| `0.5.245` | First Crafting Recipe Content Seed | Next conditional; content + focused validation only with explicit authorization. |
| `0.5.246` | First People And NPC Content Seed Plan | Docs-only. |
| `0.5.247` | First People And NPC Content Seed | Content + focused validation only. |
| `0.5.248` | First Polity Content Seed Plan | Docs-only. |
| `0.5.249` | First Polity Content Seed | Content + focused validation only. |
| `0.5.250` | First World Map Feature Content Seed Plan | Docs-only; use focused discovery/POI research first if needed. |
| `0.5.251` | First World Map Feature Content Seed | Content + focused validation only. |
| `0.5.252` | Settlement District And Site Authority Boundary Decision | Docs-only. |
| `0.5.253` | Service Authority Boundary Decision | Docs-only; focused service research prerequisite. |
| `0.5.254` | Resource And Commodity Schema Decision | Docs-only; focused resource-node research prerequisite. |
| `0.5.255` | Combat Status Condition And Injury Boundary Decision | Docs-only; focused health research prerequisite. |
| `0.5.256` | Settlement District And Site Schema Decision | Docs-only; depends on `0.5.252`. |
| `0.5.257` | Static Authority Validation Consolidation Audit | Read-only/docs-first audit before further seeds. |

Any failed prerequisite pauses only its lane. Do not silently broaden another run to fill the version slot.

## 10. Near-Term Priority Queue

Near-term means `0.5.218`-`0.5.229` and is now complete:

1. Consume each existing temporary artifact into its named schema/boundary decision.
2. Retire the artifact in the same run when all useful guidance is promoted; otherwise name one remaining consumer.
3. Keep every pass documentation-only.
4. Do not create schemas while unresolved overlap exists, especially settlement embedded fields, production-chain recipes, item use profiles, quest embedded objectives, and people/household identities.
5. End with hazard/route-security boundary work after map features stabilize.

Safest immediate next local Codex run: `Version 0.5.245 - First Crafting Recipe Content Seed`, only if live recipe content is explicitly authorized.

## 11. Medium-Term Priority Queue

Medium-term means `0.5.230`-`0.5.257`:

- Implement only schema/validator/focused-test work explicitly approved by the preceding decision.
- Keep existing current-data-first contracts; do not add compatibility/migration behavior unless explicitly requested.
- Use seed plans before content seeds.
- Limit seeds to one coherent collection and a small authored batch.
- Commission focused Deep Research only at the gates named in Sections 6 and 9.
- End with a static-authority validation audit before expanding more content lanes.

The medium queue is conditional. If a schema decision concludes that no implementation is needed, mark the corresponding implementation pass skipped and renumber future unlanded passes during the next coordination update rather than inventing work.

## 12. Deferred 0.6+ Runtime / UI / Save-State Queue

Do not move these into `0.5.x` through this roadmap:

- engine-owned command/event/result integration;
- save-state architecture, migrations, persistence, and runtime ownership consolidation;
- player inventory/item-instance mutation, equipment mutation, loot/reward payout, vendors, and transactions;
- quest/event/Chronicle mutation and board refresh;
- combat execution expansion, active statuses, injury/death/recovery, and AI/pathfinding expansion;
- crafting execution, recipe unlocks, active orders, quality/affix rolls, repair/salvage, and item creation;
- services, shops, training, lodging, temple effects, access gates, and provider schedules;
- NPC schedules, dialogue runtime, social memory, companions/party/loyalty, and reputation consequences;
- property ownership, housing/storage contents, rent/tax, inheritance transfer, and construction state;
- settlement development/simulation expansion, local map UI, discovery/reveal, dynamic POIs, and pathfinding;
- weather/time/festival recurring-event execution;
- broad UI/UX integration dependent on these mutable owners.

`0.6.0` requires a dedicated readiness decision confirming stable static contracts, validator coverage, owner-aware command/state boundaries, save/load policy, and a narrow integration target.

## 13. Artifact Retirement Policy

1. Temporary Deep Research artifacts are staging inputs, never canon.
2. Every artifact must name one permanent consumer and one retirement trigger.
3. An authority decision supersedes the artifact for decisions; the artifact may remain only for unpromoted detail.
4. The named next pass must either delete the artifact or document exactly one later consumer and removal condition.
5. Do not retain an artifact merely because it contains more ideas; durable deferred work belongs in the backlog or a permanent design document.
6. Deletion must update current handoff, output, roadmap/sequence if referenced, and backlog in the same run.
7. The consolidated artifact queue is now empty after `0.5.229`; future temporary research artifacts need their own named consumer and retirement trigger.

## 14. Coordination Document Update Policy

After every meaningful run:

- overwrite `current-codex-output.md` with exact source version, date, branch assumption, files, checks, behavior confirmation, risks, next version, and commit message;
- keep `current-gpt-handoff.md` limited to live authority rules and immediate next-route guardrails;
- update the roadmap only for landed status, sequence changes, maturity changes, or material dependencies;
- update the sequenced plan when a pass lands, is skipped, is blocked, or is renumbered;
- update the backlog when work is deferred, a prerequisite changes, or a temporary artifact is retained/retired;
- never let an old proposed version remain the current recommendation after a higher version lands.

Naming/cadence policy:

1. `<Topic> Deep Research` outside or as a temporary repo artifact only when a real research gap exists.
2. `<Topic> Authority Boundary Decision` for cross-owner scope.
3. `<Collection> Schema Decision` for exact paths, wrapper, ids, fields, references, forbidden fields, validation, and implementation order.
4. `<Collection> Schema And Validator` for schema, pure validator, focused tests, and registration as explicitly approved.
5. `<Collection> Content Seed Plan` for exact small candidate records without live content.
6. `<Collection> Content Seed` for narrow content plus focused validation.
7. Runtime/UI/save work only after `0.6+` readiness and an owner-aware implementation plan.

## 15. Non-Goals

- no schema, validator, content JSON, test, runtime, UI, storage/save-state, gameplay, or migration changes;
- no temporary artifact deletion or existing design-doc rename;
- no compatibility aliases or current-data migration planning beyond named future decisions;
- no runtime command/event/reward, inventory/quest/market/service/combat/crafting/property/settlement mutation;
- no claim that conditional implementation passes are pre-approved;
- no transition to `0.6.0`.

## 16. Next Recommended Version

`Version 0.5.245 - First Crafting Recipe Content Seed`

It should use `docs/design/first-crafting-recipe-content-seed-plan.md` as its source, create only a narrow planned-status recipe seed if explicitly authorized, and avoid runtime, inventory, UI, storage, command, event, reward, economy, or gameplay changes.
