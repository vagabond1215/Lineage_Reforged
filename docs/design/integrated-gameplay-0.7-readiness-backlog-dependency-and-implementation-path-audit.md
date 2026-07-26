# Integrated Gameplay 0.7 Readiness, Backlog Dependency, And Implementation Path Audit

## 1. Run And Snapshot Identity

Run classification: unversioned documentation-only repository audit.

Milestone impact: `supports_current_band`.

Audit branch:

`prep/integrated-gameplay-0-7-readiness-audit`

Branch base:

`895c02df40332c813a8403bd489af6184111ccba`

Queued-prompt commit and audit-branch head before this artifact:

`ae339eda516863f4af3043be381fb35a0c5c47db`

Fetched `origin/master` head during the audit:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

Fetched master change after the branch base:

- commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` changes only:
  - `tests/unit/region-first-world-data.test.mjs`;
  - `tests/unit/slug-content.test.mjs`;
- both readers now remove one optional leading `U+FEFF` before `JSON.parse`;
- no runtime, content, schema, persistence, UI, gameplay, or planning file changed in that commit.

Branch divergence at audit time:

- audit branch: one commit ahead of the merge base because it contains the queued audit prompt;
- audit branch: one commit behind `master` because the BOM test repair landed after branch creation;
- merge base: `895c02df40332c813a8403bd489af6184111ccba`.

Snapshot posture:

- gameplay and planning conclusions remain valid against the branch snapshot because the remote drift is test-harness-only;
- the exact current test baseline, active support-run completion, and prompt-restoration status are `integration_refresh_required`;
- this artifact must not alter live routing until a fresh connector inspection verifies the completed `0.6.6.1` support run and the subsequent static sequence.

Active route visible at the branch base:

1. `Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`;
2. restore exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`;
3. `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`;
4. Geographic Knowledge Taxonomy And Location Recognition Contract Plan;
5. Activity Resolution Existing-System Reuse Audit;
6. Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision;
7. bounded lethal-process and stabilization research only when authorized.

Latest completed primary at the branch base:

`Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`.

Controlling completed contracts include:

- campaign/Stakes, checkpoint, save-provenance, and technical-recovery design authority;
- occurrence identity, named uncertainty, commitment, and correction design authority;
- Mortal Crisis, resurrection, final closure, and Stakes authority;
- injury/recovery/restoration authority;
- narrative realization and fact-projection authority;
- elemental alignment and manifestation authority;
- engine-owned travel, quest acceptance, quest tracking, and activity selection transitions.

## 2. Executive Verdict

### 2.1 Milestone verdict

`0.7.0 - Integrated Gameplay Systems` is **not ready**.

The repository has several strong foundations:

- playable character creation and session entry;
- functioning save/load roundtrip for the current snapshot shape;
- engine-owned travel;
- engine-owned quest acceptance and tracking;
- engine-owned activity selection;
- substantial body/resource progression helpers;
- current inventory stacks and equipment state;
- authored quest, travel, activity, reputation, Chronicle, and static-content surfaces.

The missing milestone boundary is not content volume. It is authoritative integration.

The current representative cross-system gameplay exists primarily in `apps/rpg-ui/src/game-shell/gameplayLoop.ts`. Activity advancement, rest, and quest turn-in mutate many authoritative surfaces directly in the UI shell instead of flowing through a stable engine-owned attempt/result/consequence contract. Those paths do not yet have the command, result receipt, idempotency, correction, persistence-provenance, and focused regression posture required for `0.7.0`.

### 2.2 Plausible future band-entry path

A plausible future `band_entry_candidate` exists after the accepted immediate sequence:

> Engine-owned Ashen Reef survey advancement and typed consequence application, integrated with current travel, body/resource state, skills, discovery/Knowledge-facing facts, quest state, Chronicle projection, persistence, and accepted-only UI application.

This is the strongest first loop because it can reuse current authored content and several proven owners without requiring combat injury, dynamic ecology, generic inventory instances, crafting execution, NPC simulation, or a broad economy.

### 2.3 Fallback path

The fallback is:

> Engine-owned Ashen Reef survey turn-in and reward receipt, integrating quest completion, currency, skill progression, standing/reputation, Chronicle projection, persistence, idempotent payout, and accepted-only UI application.

This fallback is narrower than the rivet-cargo route because it does not require item ownership/removal semantics. It still requires explicit reward-consumption receipts and replay protection before it can be authoritative.

### 2.4 Inventory placement decision

Inventory/item ownership is a major enabling dependency, but it should **not** be inserted ahead of the first Ashen Reef survey loop merely to build a generic inventory system.

Recommended placement:

- current body/resource ownership is sufficient for the first survey advancement slice;
- a narrow reward/consumption contract may support the survey turn-in fallback without general item-instance work;
- inventory/item-instance, container, reservation, ownership, durability, stolen-state, and logistics authority should follow before the rivet-cargo, gathering/crafting, loot, builder, or dynamic-economy loops.

## 3. Current Capability Inventory

| Capability | Current evidence | Posture |
| --- | --- | --- |
| Character creation and session entry | New-game snapshot creation resolves identity, attributes, starting bundle, resources, body state, inventory/equipment, world selection, and enters the shell. | `met_foundation` |
| Current save/load | Browser-local envelope version 6, direct localStorage addressing, snapshot serialization/deserialization, 128 manual slots plus quick-save, current-data validation, focused storage tests. | `partial` |
| Accepted save/Stakes contract | Durable documentation defines campaign, continuity, checkpoint, generation, correction, closure, and recovery identities. Live save envelopes do not implement those identities. | `design_only` |
| Travel | Engine-owned plan, command, stale/revision protection, accepted result, typed event, body/time/resource mutation, serialization, accepted-only UI bridge, focused deterministic tests. | `strong` |
| Quest acceptance | Engine-owned resolver/command/event and accepted-only UI path. | `strong` |
| Quest tracking | Engine-owned resolver/command/event and accepted-only UI path. | `strong` |
| Activity selection | Engine-owned resolver/command/event, collision regression coverage, serialization, accepted-only UI bridge. | `strong` |
| Activity advancement | Shell-owned branching in `gameplayLoop.ts`; advances time/body, resources, skills, flags, operations, discovery, notifications, and Chronicle. No engine command/result owner. | `missing_authoritative_owner` |
| Rest | Shell-owned preview/execution; coin cost, body advancement, full HP/MP/stamina restoration, activity, notification, and Chronicle. It is not reconciled with the accepted injury/Mortal Crisis model. | `blocked` |
| Quest turn-in | Shell-owned completion and reward application across quest, inventory, currency, skills, standing, reputation, operations, flags, activity, tracking, notification, and Chronicle. | `missing_authoritative_owner` |
| Body/survival foundation | Energy, protein, hydration, fatigue, intoxication, starvation, recovery, action loads, previews, and difficulty modifiers exist. | `strong_foundation` |
| Mortal Crisis/injury | Durable design authority exists; functional-state, lethal-process, care, body/restoration, convalescence, and final-closure runtime owners are absent. | `design_only` |
| Inventory/equipment | Bags, stacks, overflow, equipment slots, item ids/keys, quantity, optional durability, starter state, and save roundtrip exist. General ownership, item-instance, storage, reservation, movement, transaction, and provenance owners are absent. | `partial` |
| Currency/standing/reputation | Current player state and helpers exist; the survey/rivet shell loop applies them. Generic transaction and consequence-receipt authority is missing. | `partial` |
| Chronicle/notifications | Current capped session projections exist and are useful UI facts. They are not durable occurrence/result/consequence authority. | `projection_only` |
| Generic events | `createEvent` still builds `type:domain:tick` ids, which collide for repeated same-type same-domain events in one tick. Newer owner-specific commands use richer event identities. | `mixed_and_bug_prone` |
| Combat | Combat engine, commands, events, encounter state, and tests exist. HP zero still drives legacy terminal archive, payout, estate deposit, and save deletion in the shell lifecycle. | `blocked_for_mortality_loop` |
| Static content | Large validated item/value catalogs; completed world/settlement and recipe packages; active monster/ecology package; broad descriptive authorities. | `strong_static_foundation` |
| Dynamic content execution | Spawning, populations, migration, loot rolls, item creation/ownership, crafting execution, service access, NPC schedules, construction, and active ecology/economy remain separate. | `missing_or_deferred` |

## 4. `0.7.0` Criterion Matrix

Status vocabulary: `met`, `partial`, `missing`, `blocked`, `integration_refresh_required`.

| Entry criterion | Status | Authoritative/live evidence | Missing layer | Smallest credible closure path |
| --- | --- | --- | --- | --- |
| Character creation or start-state enters a playable session | `met` | New-game snapshot and game-shell paths provide an interactive session. | No milestone blocker for a bounded slice. | Preserve and include in end-to-end test. |
| Authoritative save/load preserves required slice state | `partial` | Current localStorage envelope and serializer preserve current snapshots; focused storage tests exist. | Accepted campaign/continuity/checkpoint/generation/recovery identities are not implemented; direct overwrite is not verified publication. Current support-test baseline requires refresh after remote repair. | Implement the minimum accepted save identity/provenance needed by the selected slice, then prove save/load/restart and corruption behavior. |
| Travel or movement is engine-owned and participates in the loop | `met` | `player-travel.ts`, travel rules, typed event, preview parity, stale protection, serialization, accepted-only UI, focused tests. | No blocker for the proposed survey slice. | Reuse unchanged; do not rebuild travel generically. |
| Quests/contracts/activities advance beyond selection through an authoritative attempt/result path | `missing` | Selection/acceptance/tracking are engine-owned; advancement and turn-in remain shell-authored. | Attempt identity, result contract, effect/consequence ownership, failure and retry semantics, focused tests. | Activity reuse audit -> attempt/result decision -> engine-owned survey advancement. |
| At least one consequence-bearing interaction crosses multiple systems | `partial` | Survey/rivet/rest/turn-in code already crosses time, body, resources, inventory, skills, discovery, quest, currency, reputation, operations, and Chronicle. | The cross-system behavior is not fully engine-owned and lacks receipts/idempotency. | Extract one survey path behind owner commands and typed consequences. |
| Commands, events, synchronization, revision/stale protection, and accepted-only UI application are coherent | `partial` | Strong for travel, quest acceptance/tracking, and activity selection. | Missing for activity advancement, rest, and turn-in; generic event helper remains collision-prone. | Use owner-specific command/occurrence identity; prohibit generic event helper for the slice; apply UI only on accepted result. |
| Required inventory/resource ownership and typed effects exist | `partial` | Body/resources have owners; inventory stack shape exists; shell has direct mutation helpers. | Shared typed-effect vocabulary/ownership and inventory transaction/consumption receipts are missing. | First survey slice uses body/resource/skill/discovery effects; later inventory decision before cargo/gathering/crafting. |
| Deterministic or bounded replay/test coverage and explicit failure behavior exist | `partial` | Engine command packages have deterministic fixtures, stale rejection, atomic failure, serialization tests. | Advancement/turn-in lack equivalent command/result tests; reward replay/idempotency absent. | Add resolver, deterministic identity, no-mutation rejection, retry/idempotency, serialization, and end-to-end tests. |
| Remaining demo/UI-authored mutations do not control the milestone loop | `missing` | `gameplayLoop.ts` directly owns the candidate advancement and turn-in behavior. | Engine extraction and UI thinning. | Move only the selected representative path; leave unrelated shell behavior out of scope. |
| Known omissions are documented and do not invalidate the loop | `partial` | Extensive design and route documents describe omissions. | The selected slice and excluded systems are not yet accepted as a bounded milestone package. | Dedicated scope/acceptance decision and later readiness audit. |

Overall decision:

`not_ready`.

A future `band_entry_candidate` is plausible, but only after the current static/documentation sequence and a bounded owner-first implementation runway.

## 5. Backlog Dependency Graph

| Lane | Current owner/foundation | Exact missing layer | Readiness state | Immediate prerequisite | Research/authored input | Content/implementation posture | Milestone contribution and coupling risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Activity advancement and result/effect ownership | Activity selection command; shell advancement; body/skill/Knowledge helpers; queued reuse audit | attempt/result vocabulary, engine command, typed effects, receipts, tests | `deferred_by_current_sequence` | Geography plan then Activity reuse audit | Repository audit first; no external research required | Strong first runtime candidate after gates | Highest direct contribution; risk of generic resolver overreach |
| Survival needs, exposure, rest, health, Mortal Crisis, injury, care, restoration | Body-state engine; injury/Mortal Crisis decisions | functional/lethal/care instances, intervention receipts, rescue/treatment/restoration, persistence, UI | `deferred_by_current_sequence` | Mortal Crisis receipt contract | Bounded medical/first-aid research only after contract | No new injury/care content yet | Critical for later combat/travel; high safety and state-coupling risk |
| Inventory, containers, storage, item instances, ownership, reservations, logistics, durability, stolen state | Item authority; bags/stacks/equipment/current save state | transaction owner, provenance, item instances, containers/storage/access, reservations, movement, failure | `ready_for_repository_audit` | Dedicated live ownership audit and authority decision | External research not required for owner boundary | Runtime not ready; static container/loot content also gated | Major enabler; generic inventory-first design is a risk |
| Gathering, harvesting, crafting execution, production, resources, commodities, services, dynamic economy | Recipes, chains, workplaces, items/values, production research synthesis | attempts, source state, depletion, yield, item creation, reservations, work orders, transactions | `blocked_by_owner_dependency` | Activity reuse plus inventory ownership | Targeted research only after owner questions are fixed | Static resource/commodity seeds may be reconsidered after `0.6.7`; runtime deferred | Strong later cross-system loop; very high coupling |
| Combat consequences, loot execution, encounters, spawns, populations, migration, runtime ecology | Combat engine; spawn candidates; monster/fauna/ecology static data | injury/Mortal Crisis integration, loot result/ownership, corpse/container, population/ecology simulation | `blocked_by_owner_dependency` | Mortal Crisis contract and inventory/loot authority | Dynamic ecology research waits until after `0.6.7` and owner definition | Static `0.6.6` only; no dynamic expansion | High value but blocked; exploit/finality risk |
| Quest completion, contracts, work orders, rewards, standing, reputation, Chronicle consequences | Quest acceptance/tracking commands; authored survey/rivet shell loop; reputation helpers | turn-in command, objective proof, result/reward receipts, idempotency, correction, transaction provenance | `ready_for_authority_decision` | Occurrence contract is complete; select narrow quest family after current gates | No broad research needed | Survey turn-in is fallback implementation candidate | High cross-system value; payout duplication risk |
| Travel, routes, hazards, recognition, maps, exploration, camping, discovery | Engine-owned travel; known locations; geography content; queued recognition plan | recognition facets/evidence, hazards, route security, camps/rest owners, discovery consequences | `deferred_by_current_sequence` | Geography/recognition plan | Navigation/recognition research waits for contract questions | Current locations sufficient for first slice; broader content deferred | Strong reuse; avoid invented maps/POIs |
| People, NPCs, households, families, kinship, schedules, jobs, companions, factions, institutions, polities, law, government | Family/account records and many design boundaries; sparse role strings | canonical identities, relationships, membership, availability, simulation owners | `blocked_by_authored_canon` | Authored setting canon and separate authority decisions | External research cannot supply canon | Do not synthesize named content from roles/quests/prose | Essential for later social world; broad canon risk |
| Estate, succession, inheritance, Legacy, Chronicle, Bloodlines, Family Prestige | Account run history, estate deposits, family ledger/projections, final-closure decisions | accepted final-closure runtime, heir/transfer/custody commands, correction and persistence integration | `blocked_by_owner_dependency` | Mortal Crisis/final closure runtime and save provenance | No external research required now | No broad content expansion | High north-star value; duplicate settlement/finality risk |
| Magic study, acquisition, casting, enchanting, magical documents, elemental response | Spell/item compatibility, study boundaries, elemental decision | study evidence, teachers/institutions/documents, acquisition, readiness, casting/enchanting execution | `blocked_by_owner_dependency` | Authored sources/institutions and owner-specific contracts | Narrow research only after consumer questions; broad elemental research already sufficient | Static magical documents remain deferred | High scope and lore coupling; do not create generic magic runtime |
| Homestead, construction, property, settlement growth, workers, maintenance, logistics | Building/workplace/infrastructure concepts | property owner, materials/inventory, blueprints, work orders, workers/jobs, persistence, maintenance | `blocked_by_owner_dependency` | Inventory/storage + NPC/job + property authority | Research waits for selected builder abstraction | Content/runtime deferred | Later vertical-slice pillar; many dependencies |
| Narrative realization, event retention, observer projection, living-character presentation | Narrative authority and current Chronicle projections | durable event/result/consequence retention, provenance, observer projection implementation, validation/fallback | `blocked_by_owner_dependency` | Occurrence/result persistence and owner receipts | Broad research not needed; implementation evidence needed | No prose expansion as authority | Valuable projection; must remain one-way |
| UI, accessibility, diagnostics, persistence, migration, packaging, testing | Six-domain shell, read-only projections, accepted-only bridges for several commands, local storage tests | thin accepted-only bridges for new loop, error/readiness UX, save provenance, corruption recovery, diagnostics, packaging | `ready_for_repository_audit` | Selected loop and owner contracts | Accessibility research can be bounded later; not a current blocker | Build only against a representative owner | Required for `0.7+`; avoid generic UI before owner evidence |

## 6. Candidate Integrated-Loop Comparison

Scale: 1 = poor/high blocker, 5 = strong/low blocker. `Blocker count` and `exploit risk` are reverse-scored: 5 means fewer blockers/lower risk.

| Candidate | Authority readiness | Live reuse | Persistence | Content | UI | Tests | Cross-system value | Blocker count | Exploit/idempotency | Save/Stakes/occurrence fit | Bounded slice | `0.7.0` contribution | Total posture |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Activity attempt/result -> body/resource/skill/Knowledge/quest consequences | 4 | 5 | 3 | 5 | 5 | 2 | 5 | 4 | 3 | 4 | 5 | 5 | **Recommended** |
| Travel -> exposure/resource consequence -> rest/recovery | 3 | 5 | 3 | 4 | 5 | 3 | 4 | 3 | 4 | 3 | 4 | 4 | Wait for Mortal Crisis/rest authority |
| Combat -> defeat/injury/care/recovery | 2 | 4 | 2 | 4 | 3 | 3 | 5 | 1 | 2 | 2 | 2 | 4 | Blocked by mortality and HP-zero archival |
| Gathering -> inventory ownership -> crafting result | 2 | 3 | 2 | 5 | 3 | 2 | 5 | 1 | 2 | 3 | 3 | 5 | Blocked by inventory/source/crafting owners |
| Quest completion/turn-in -> economy/reputation/Chronicle consequence | 3 | 5 | 3 | 5 | 5 | 1 | 5 | 3 | 2 | 4 | 4 | 5 | **Fallback**, survey quest only first |

### Why the other candidates wait

Travel/rest waits because current rest directly restores HP and resources and is not reconciled with injury, care requirement, resurrection, or convalescence authority.

Combat waits because HP zero still triggers terminal archive behavior and the functional/lethal/care runtime owners do not exist.

Gathering/crafting waits because source depletion, attempt difficulty, item creation, inventory ownership, reservations, and crafting result ownership are unresolved.

Generic quest turn-in is not the first choice because reward application has higher idempotency and transaction risk. A single survey turn-in remains a viable fallback after a narrow reward receipt is defined.

## 7. Recommended First Loop And Fallback

### 7.1 Recommended first loop

Stable descriptive name:

`Engine-Owned Survey Activity Advancement And Typed Consequence Slice`

Representative content:

`quest.ashen_reef_survey`.

Required flow:

```text
known-location travel
  -> accepted survey attempt command
  -> authoritative activity occurrence
  -> accepted result receipt
  -> owner-specific consequences
       time/body/resource
       skill progression proposal/application
       survey objective evidence
       operation update
       discovery/Knowledge-facing fact
  -> projections
       notification
       Chronicle
       activity/quest UI
  -> persisted accepted snapshot
```

Reasons:

- travel already has the strongest engine-owned command/test boundary;
- survey advancement already has authored content and visible user value;
- body/resource and skill helpers already exist;
- it avoids item-instance and reward payout dependencies in its first increment;
- it creates a reusable example for the later Activity Resolution audit without prebuilding a generic resolver;
- it crosses enough systems to be meaningful while remaining one quest/activity family.

Required exclusions:

- no general activity framework for every domain;
- no generic effect engine;
- no dynamic RNG unless the selected result requires an authorized uncertainty channel;
- no inventory, crafting, combat, injury, NPC, economy, or builder expansion;
- no automatic `0.7.0` claim.

### 7.2 Fallback loop

Stable descriptive name:

`Engine-Owned Survey Turn-In And Reward Receipt Slice`.

Required flow:

```text
completed survey evidence
  -> turn-in command
  -> accepted completion occurrence/result
  -> one idempotent reward/consequence receipt
       quest completed
       currency grant
       skill progression
       standing/reputation
       operation removal
  -> Chronicle/notification projection
  -> persisted accepted snapshot
```

Use the Ashen Reef survey first. Do not use the rivet-cargo quest until inventory-consumption authority is defined and the flag/inventory divergence defect is corrected.

## 8. Candidate Implementation Package Runway

The following names are candidates, not active versions. Exact future patch numbers remain unassigned.

| Order | Candidate package | Class | Milestone impact | Owner/scope | Required inputs | Output/evidence | Completion gate | Explicitly out of scope |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `0.6.6.1 UTF-8 BOM Test-Harness Repair Completion` | `support_suffix_candidate` already active | `supports_current_band` | two test readers and support coordination | current support prompt | focused tests, full parent baseline, exact prompt restoration | verified 146/146 and restored parent prompt | content authoring |
| 2 | `0.6.6 Monster/Ecology/Loot Static Package` | active parent primary | `advances_current_band` | exact nine-row static package | restored exact prompt | content lint and focused tests | exact matrix accepted | dynamic ecology/loot |
| 3 | `0.6.7 Cross-Content Coherence Audit` | reserved primary | `advances_current_band` | cumulative static authorities | accepted `0.6.6` | coherence and artifact dispositions | no unresolved cross-content defect | runtime implementation |
| 4 | `Geographic Knowledge And Recognition Contract` | `unversioned` | `supports_current_band` | geography/observer evidence | `0.6.7` baseline | durable taxonomy/recognition plan | accepted contract | maps/runtime discovery |
| 5 | `Activity Resolution Existing-System Reuse Audit` | `unversioned` | `supports_current_band` | live activity/trial/quest/crafting/Knowledge reuse | Geography contract | reuse/adaptation/rejection matrix | accepted owner sequence | framework implementation |
| 6 | `Mortal Crisis Receipt Contract` | `unversioned` or durable primary only if activated per policy | `supports_current_band` | functional/lethal/care receipts | current mortality authority | exact receipt/owner contract | accepted contract | clinical catalog/runtime |
| 7 | `Selected Survey Slice Scope And Owner Decision` | `unversioned` | `supports_current_band` | one representative survey loop | steps 4-6 and this audit refreshed | exact command/result/effect/persistence/UI scope | no unresolved owner ambiguity | generic activity system |
| 8 | `Minimum Save Identity And Accepted-State Publication For The Slice` | `three_segment_primary_candidate` | `advances_current_band` | campaign/continuity/revision/publication subset | accepted save contract, selected slice | runtime contracts, persistence, tests | save/load/restart/corruption tests pass | full checkpoint UI or all Stakes modes unless required |
| 9 | `Owner-Specific Occurrence And Result Receipt Foundation` | `three_segment_primary_candidate` | `advances_current_band` | selected survey occurrence/result only | occurrence contract, slice decision | stable ids, retry/idempotency, correction seam | deterministic and duplicate-delivery tests | generic bus/global RNG |
| 10 | `Engine-Owned Survey Activity Advancement Command` | `three_segment_primary_candidate` | `advances_current_band` | survey attempt/admission/result | Activity audit, receipt foundation | command/resolver/result/event tests | atomic accepted/rejected behavior | all activities |
| 11 | `Survey Consequence Owner Adapters` | `three_segment_primary_candidate` | `advances_current_band` | body/resource, skill, quest evidence, discovery fact | typed ownership matrix | owner-specific receipts and reconciliation tests | no direct generic mutation | inventory/reward/economy expansion |
| 12 | `Accepted-Only Survey UI And Preview Integration` | `three_segment_primary_candidate` | `advances_current_band` | thin shell bridge and view model | engine package | parity, accessibility/readiness, no direct mutation tests | UI applies accepted state only | shell redesign |
| 13 | `Survey Slice Persistence And End-To-End Regression` | `three_segment_primary_candidate` or support if attached | `advances_current_band` | save/load/restart, failure, replay | completed slice | end-to-end deterministic fixtures | representative loop survives save/load and failures | unrelated systems |
| 14 | `Integrated Gameplay 0.7 Readiness Audit` | `unversioned` | `band_entry_candidate` | exact milestone criteria | all selected-slice packages | criterion matrix and gameplay evidence | explicit `accepted` required | aspirational promotion |
| 15 | `0.7.0 Integrated Gameplay Systems` | `band_entry_candidate` | `band_entry_candidate` | bounded accepted slice only | accepted readiness audit | integration/acceptance package | every criterion accepted | broad feature dump |

## 9. Research Disposition Matrix

| Proposed pass/topic | Classification | Exact question | Intended consumer | Why current evidence is insufficient | Earliest safe trigger | Disposition | Forbidden conclusion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Live inventory/item ownership audit | repository-only, safe after current branch work | Which current writers/readers own stacks, equipment, rewards, estate assets, and persistence, and what minimum transaction contract is needed? | later inventory authority and cargo/gathering loops | current state exists but ownership and transaction boundaries are fragmented | may be prepared in parallel on an isolated branch; refresh before use | durable audit or consumed by authority decision | do not implement generic inventory |
| Activity advancement characterization | repository-only, already queued through reuse audit | Which shell branches and helpers can be reused, adapted, or rejected for a survey attempt/result path? | first integrated loop | direct mutations are known but not yet systematically classified | after Geography plan per accepted route | durable reuse audit | do not generalize by field-name similarity |
| Quest reward/idempotency audit | repository-only | What proves completion, reward eligibility, prior consumption, correction, and downstream application for one quest family? | survey turn-in fallback | current shell applies rewards without a durable receipt | after occurrence authority refresh and before turn-in implementation | focused decision/audit | do not create a generic reward engine |
| Save implementation gap audit | repository-only | What minimum accepted campaign/continuity/revision/publication subset must land for the selected slice? | persistence package | design contract exceeds live envelope | after active static sequence or in isolated preparation | durable implementation plan | do not expose hidden recovery as rollback |
| Lethal processes and stabilization | external research, must wait | Which causal categories and intervention capabilities should a bounded game catalog represent? | lethal-process/care authority and content | contract must define abstraction and consumers first | after Mortal Crisis receipt contract | temporary cited research with named consumer/removal gate | no clinical advice, exact real-world timers, or direct balance import |
| Geographic recognition/navigation | external research, must wait | Which evidence/clue classes are useful for recognition and uncertainty? | Geography/recognition implementation/content | observer and recognition facets are not yet accepted | after Geography contract defines questions | temporary research | no fabricated maps or canon |
| Dynamic ecology/population/spawning | external research, must wait for `0.6.7` and owner | Which population abstractions fit selected encounter/ecology owners? | later ecology/spawn design | static package is still under active audit sequence | after `0.6.7` and owner decision | temporary research | static membership does not imply population/spawn behavior |
| Medieval logistics/container capacity | external research, wait for inventory owner | What bounded abstractions support carrying, storage, and transport? | inventory/logistics decision | owner and unit semantics unresolved | after inventory audit selects model | temporary research | do not import false precision |
| NPC/institution/polity identity | blocked by authored canon | What named people and organizations exist? | people/social/civic content | external evidence cannot create setting facts | explicit authored canon | authored source, not research substitution | no synthesis from role strings or prose |
| Production/materials/food/crafting/magitech | sufficiently researched | No new broad question presently justified | later owner-specific consumers | seven-gate synthesis already exists | only reopen for a named unresolved consumer | retain durable synthesis; remove temporary artifacts per existing rules | do not rerun broad research for volume |
| Elemental ecology/behavior and narrative realization | sufficiently researched/decided | No new broad pass presently justified | later owner-specific implementation | durable decisions already establish boundaries | reopen only on specific implementation ambiguity | durable decisions remain controlling | no broad repeat research |

Current recommendation:

- do not start a broad external content-research program now;
- safe parallel work is repository-only and must remain isolated from the active static route;
- external research should have a named consumer and an explicit retention/removal rule.

## 10. Content-Readiness Matrix

| Content family | Classification | Earliest credible trigger | Required owner/decision | Current recommendation |
| --- | --- | --- | --- | --- |
| Weapon and armor profiles | `consider_after_0.6.7` and `needs_repository_audit` | accepted `0.6.7` plus fresh reconciliation of embedded `useProfiles` | weapon/armor profile schema/content seed plan | plausible next static family, but do not activate during current sequence |
| Hazards and route-security profiles | `needs_authority_decision` | Geography/recognition contract | hazard/route-security owner and consumer | keep deferred |
| Resources and commodities | `needs_authority_decision` | `0.6.7` plus bounded reopening decision | relationship/schema and static seed authority | consider a narrow paired seed, not broad filler |
| Services | `needs_runtime_owner_first` | provider/access/price/stock/effect consumer selected | service availability and transaction owners | remain deferred |
| Polities and civic identities | `needs_authored_canon` | explicit authored setting sources | polity/government/jurisdiction authority | no speculative expansion |
| People/NPCs and institutions | `needs_authored_canon` | authored named identities and relationships | people, household, institution owners | no promotion from roles, quest strings, or generated operators |
| Magic-study sources and magical documents | `needs_authored_canon` and `needs_runtime_owner_first` | study/acquisition authority and authored teachers/institutions/documents | magic study and item/document owners | remain deferred |
| Combat-health/lethal-process/care vocabularies | `needs_authority_decision` and `needs_external_research` | Mortal Crisis receipt contract then bounded research | health/lethal/care owner | do not author now |
| General loot tables and container templates | `needs_runtime_owner_first` | inventory/ownership and loot-result decision | item/container/loot static owners plus runtime consumer | remain deferred |
| Additional monsters/fauna/ecology | `consider_after_0.6.7` | accepted `0.6.7` with explicit gap | static program and exact matrix | do not assume another broad package is needed |
| Knowledge/recognition content | `needs_authority_decision` | Geography/recognition plan | observer/recognition evidence owner | current snippets are lore, not mechanics |
| Settlements, districts, sites, maps, generic POIs | mixed: `remain_deferred` / `needs_authored_canon` | explicit coverage gap after `0.6.7`; map canon where needed | world/geography/map owners | enrich only named gaps; generic POIs remain rejected |
| Recipes, alchemy, enchanting, repair, salvage | `needs_runtime_owner_first` | selected process consumer and inventory owner | activity/crafting/item transaction owners | current 28 recipes are sufficient static baseline |
| Family, household, kinship, estate, succession | `needs_authored_canon` and `needs_runtime_owner_first` | final-closure/save runtime plus authored relationships | family/estate/succession owners | remain deferred |

## 11. Authored-Canon Blockers

The following cannot be closed by repository inference or external comparative research:

- named people and family relationships;
- named institutions, guilds, orders, offices, and membership;
- named factions, polities, governments, jurisdictions, and diplomatic relationships;
- authoritative map geometry and exact spatial placement;
- canonical service providers and their social/legal access;
- teachers, schools, magical texts, licenses, orders, and study relationships;
- specific estate/property ownership and succession relationships;
- canonical laws, crimes, courts, offices, and exemptions;
- settlement-specific NPC schedules, witnesses, rivals, contacts, and household membership.

Role labels, quest contact prose, generated operators, titles, settlement functions, and UI strings may identify requirements, but they must not be promoted into canonical people or organizations without authored evidence.

## 12. Persistence, UI, Testing, And Operational Gaps

### 12.1 Persistence

Current save strengths:

- stable current snapshot roundtrip;
- account-scoped localStorage keying;
- explicit corrupt/incompatible slot states;
- metadata and 128 manual slots plus quick-save;
- current storage tests.

Current gaps:

- no live campaign, continuity/timeline, checkpoint, generation, branch, correction, or closure identity;
- no verified publish/index ordering or hidden recovery generations;
- direct `setItem` overwrite;
- no committed-result or consequence-receipt persistence;
- no implementation of Committed/Ironbound topology;
- no copied-save/stale-generation authority protection;
- legacy HP-zero terminal archival remains live.

### 12.2 UI

Strengths:

- accepted-only application for travel, quest acceptance/tracking, and activity selection;
- useful body-state preview components;
- current quest/activity/world panels;
- read-only view-model separation in several areas.

Gaps:

- advancement, rest, and turn-in still call shell mutation functions directly;
- turn-in has no accepted/rejected result contract at the UI boundary;
- current projections do not expose durable occurrence/result/consequence provenance;
- error, retry, duplicate, correction, and committed-outcome states are not represented;
- full accessibility and input posture for an integrated slice is not proven.

### 12.3 Tests

Strengths:

- strong focused command tests for travel, quest acceptance, quest tracking, and activity selection;
- serialization and no-mutation rejection tests;
- save/account storage tests;
- broad static schema/lint tests.

Gaps:

- no equivalent focused command suite for activity advancement, rest, or quest turn-in;
- no reward duplicate-delivery/idempotency tests;
- no persistence/restart end-to-end test for the candidate loop;
- no correction/supersession test for applied consequences;
- no Mortal Crisis replacement test for HP-zero archival;
- the branch test baseline is `integration_refresh_required` after the remote BOM repair.

### 12.4 Operational maturity

Missing before later bands:

- accepted save corruption/recovery implementation;
- diagnostics/crash-report posture;
- packaging/install/update/launch validation;
- performance and stress budgets;
- external playtest workflow;
- accessibility acceptance;
- issue-reporting and clean data-reset posture.

These are not required to author the first owner-specific packages, but they remain explicit blockers for `0.8.0`, `0.9.0`, and `1.0.0`.

## 13. Later Maturity-Band Map

| Band | Required capability | Strongest current foundations | Major missing pillars | Evidence before readiness audit | Work that does not independently justify entry |
| --- | --- | --- | --- | --- | --- |
| Remaining `0.6.x` | owner-first contracts and bounded capability packages | travel/quest/activity selection, body state, static content, design authority | attempt/result/effects, save provenance, integrated loop, mortality runtime, inventory ownership | focused package tests and accepted transitions | research volume, patch count, static content count |
| `0.7.0` Integrated Gameplay | one engine-owned persistent cross-system loop | proposed survey slice and current command foundations | advancement/result owner, typed consequences, persistence, accepted-only UI, end-to-end tests | every policy criterion individually accepted | selection-only commands, schemas, helpers, read-only UI |
| `0.8.0` Pre-Alpha Vertical Slice | repeatable coherent bounded region/adventure path | world/settlement/static content and future `0.7` loop | encounters/combat or explicit exclusion, inventory/equipment, agreed crafting/economy/NPC/services subset, hardened UI/balance | repeatable end-to-end slice, restart tests, accessibility basics, anti-exploit checks | broad content outside selected slice |
| `0.9.0` Alpha Readiness | sustained external alpha operation | accepted pre-alpha slice | launch-scope integration, packaging, diagnostics, performance, balancing, accessibility, issue workflow | target-platform install/launch/save/error/stress evidence | developer-only vertical slice |
| `1.0.0` Accepted Release | accepted launch scope and release QA | later alpha foundations | launch-critical completeness, support/legal/privacy/ops, release-candidate QA | exact release commit/artifacts/checks/known-issue acceptance | accumulated patches or schedule aspiration |

## 14. Stale, Broken, Duplicate, Or Orphaned Signals

### 14.1 Confirmed live defects or implementation hazards

#### Generic event identity collision

`packages/shared/events/src/index.ts` still creates generic ids as:

```text
type:domain:tick
```

Repeated same-type same-domain events in one tick collide. Owner-specific travel/activity/quest command packages use richer identities and should be the model for the selected slice. The generic helper must not become the new slice's authority.

#### Rivet turn-in can reward inconsistent state

`gameplayLoop.ts` treats the session flag `gameplay.quest.rivet_shortfall_relief.crates_secured` as turn-in proof. During turn-in it calls inventory removal but ignores the Boolean result, then continues to grant currency, skills, standing, reputation, and completion.

Therefore a state with the flag present but fewer than six actual crates can receive the full reward. This is a real owner/integrity defect and a reason not to select the rivet quest as the first turn-in slice.

Required later fix posture:

- do not patch it opportunistically in this audit;
- define authoritative objective evidence and inventory-consumption receipt;
- reject atomically when the required cargo cannot be consumed;
- add inconsistent-state, duplicate-delivery, save/load, and replay tests.

#### Legacy HP-zero terminal archival

`resolveTerminalArchiveReason` treats HP `<= 0` as death and `archiveActiveRun` may pay Legacy, deposit estate assets, delete saves, and close the run. This contradicts the accepted distinction among defeat, functional state, lethal process, actual death, resurrection eligibility, and final closure.

This remains blocked behind the Mortal Crisis runtime sequence.

#### Rest bypass risk

Current rest directly fills HP, MP, and stamina to maximum. It must not be promoted as general recovery after injury/Mortal Crisis runtime lands. Future rest needs owner-specific treatment of functional state, lethal processes, care requirement, injury, aftereffects, and convalescence.

### 14.2 Planning signals requiring disposition

- `docs/dev/queued-codex-cleanup-prompt.md` still labels itself queued even though the canonical historical/deferred register and cleanup route have landed. It is historical evidence, but its live-looking execution language can misroute a future agent unless explicitly dispositioned.
- `docs/dev/queued-static-content-expansion-integration-prompt.md` likewise describes a route that has already been consumed by the accepted static program. It should eventually be marked consumed/historical or removed under a dedicated maintenance pass.
- `docs/dev/project-roadmap.md` and `docs/dev/codex-sequenced-implementation-plan.md` retain stale current-anchor headers. `docs/design/current-planning-anchor-reconciliation.md` correctly supersedes those lines; do not rewrite historical rows casually.
- the branch's queued audit prompt remains valid until this artifact is accepted or rejected. After disposition, it should not remain a second active-looking route.

### 14.3 Remote support-run integration state

At audit time, `master` contains the two-test BOM repair commit, but `docs/dev/current-codex-prompt.md` still contains the `0.6.6.1` support prompt rather than the restored exact `0.6.6` prompt.

This may be an in-progress multi-commit support run. Treat it as `integration_refresh_required`, not as a completed route. Before running `0.6.6`, verify:

- focused tests and the parent baseline pass at the required count;
- content files remain byte-identical;
- current output/handoff/register record completion;
- exact parent prompt blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` is restored;
- no support prompt remains live accidentally.

### 14.4 Unresolved file/reference posture

No required source path used by this audit was found missing.

Temporary artifacts should remain governed by their named consumers and removal conditions. This audit did not find evidence sufficient to delete research artifacts broadly.

## 15. Integration Refresh Checklist

Before any recommendation changes live routing:

1. Fetch current `master` and record the new head.
2. Verify the complete `0.6.6.1` support-run range, not only its first test commit.
3. Confirm exact `0.6.6` prompt restoration and coordination updates.
4. After `0.6.6`, refresh monster/fauna/ecology/drop counts and changed paths.
5. After `0.6.7`, refresh static-content coherence, temporary-artifact dispositions, and content-readiness classifications.
6. After Geography/recognition, refresh travel/discovery/Knowledge assumptions.
7. After the Activity Resolution reuse audit, replace this audit's provisional reuse classifications with the accepted matrix.
8. After the Mortal Crisis receipt contract, rescore travel/rest and combat/injury candidates.
9. Reinspect `gameplayLoop.ts`, save management, command/event owners, and focused tests for drift.
10. Reconfirm the rivet flag/inventory defect and generic event collision before creating repair prompts; close them only through owner-specific packages.
11. Re-evaluate whether the first survey loop can use current body/resources without general inventory authority.
12. Select exact future package labels only against fresh repository state and the versioning policy.
13. Dispose or historicalize this queued prompt and artifact explicitly after integration.
14. Do not merge this branch automatically.

## 16. Mandatory Conclusions

1. **Accept.** `0.7.0` is not accepted merely because static milestones and several command transitions exist.
2. **Accept.** The project remains in `0.6.x` until a separate readiness audit accepts every `0.7.0` criterion.
3. **Accept.** Static content, schemas, pure helpers, read-only projections, and selection-only commands do not independently satisfy integrated gameplay.
4. **Accept with integration refresh required.** The immediate `0.6.6.1 -> 0.6.6 -> 0.6.7 -> Geography -> Activity reuse -> Mortal Crisis receipt` sequence remains controlling, but the remote support run must be inspected through completion.
5. **Accept.** A first integrated loop must cross at least two authoritative systems and include persistence, failure behavior, accepted-only UI application, and representative tests.
6. **Accept.** Generic command buses, generic effect systems, generic RNG streams, generic inventory menus, and generic simulation layers must not be prebuilt without representative owner evidence.
7. **Accept with placement decision.** Inventory/item ownership is a major enabling dependency; it belongs after the first inventory-free survey advancement core and before cargo, gathering/crafting, loot, builder, or dynamic-economy loops.
8. **Accept.** Combat-to-injury integration cannot bypass the Mortal Crisis and receipt sequence.
9. **Accept.** Dynamic ecology, spawning, and loot execution cannot be inferred from static monster/ecology/drop content.
10. **Accept.** NPC, institution, faction, civic, and family content cannot be synthesized from role labels, quest strings, generated operators, or prose when authored canon is absent.
11. **Accept.** External research cannot replace missing authority or authored setting facts.
12. **Accept.** Every research artifact needs a named consumer and disposition rule.
13. **Accept.** Future package classes may be recommended, but exact future `0.6.x` patch numbers remain unassigned until activation.
14. **Accept.** Support suffixes belong to one parent primary and do not consume a new primary label.
15. **Accept.** `0.8.0`, `0.9.0`, and `1.0.0` remain evidence-gated milestones, not schedule labels.
16. **Accept.** Snapshot conclusions must be refreshed against `master` before changing live routing.

## 17. Sources Inspected

Repository/workflow and current-route authority:

- `AGENTS.md`
- `README.md`
- `docs/design/internal-versioning-and-release-milestone-policy.md`
- `docs/design/current-planning-anchor-reconciliation.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`

Milestone and queued-route authority:

- `docs/design/static-content-expansion-program.md`
- `docs/design/static-content-restoration-and-mortality-research-sequencing-decision.md`
- `docs/dev/queued-activity-resolution-existing-system-reuse-audit-prompt.md`
- `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md`
- `docs/dev/queued-codex-cleanup-prompt.md`
- `docs/dev/queued-static-content-expansion-integration-prompt.md`

Cross-cutting design authority:

- `docs/design/future-system-design-ledger.md`
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md`
- `docs/design/runtime-ownership-transition-readiness-consolidation.md`
- `docs/design/player-travel-boundary-clarification.md`
- `docs/design/ui-information-architecture-boundary.md`
- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`
- `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`
- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`

Campaign, consequence, mortality, narrative, and elemental authority:

- `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`
- `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md`
- `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`
- `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`
- `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md`
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`
- `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`
- `docs/design/elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md`

Representative implementation and tests:

- `packages/shared/types/src/contracts.ts`
- `packages/shared/events/src/index.ts`
- `packages/engines/game-engine/src/save-snapshot.ts`
- `packages/engines/game-engine/src/player-travel-rules.ts`
- `packages/engines/game-engine/src/player-travel.ts`
- `packages/engines/game-engine/src/player-quest-acceptance.ts`
- `packages/engines/game-engine/src/player-quest-tracking.ts`
- `packages/engines/game-engine/src/player-activity-selection.ts`
- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `apps/rpg-ui/src/game-shell/saveManager.ts`
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`
- `apps/rpg-ui/src/game-shell/state.ts`
- `apps/rpg-ui/src/features/ActivityPanel.tsx`
- `apps/rpg-ui/src/features/QuestsPanel.tsx`
- `tests/unit/player-travel-command.test.mjs`
- `tests/unit/player-activity-selection-command.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`
- `tests/unit/run-lifecycle.test.mjs`

## Completion Posture

This audit changes no runtime, content, schema, validator, test, save, migration, dependency, UI, asset, generated output, or active coordination file.

It does not activate a future package, assign an exact patch number, claim `0.7.0`, or merge into `master`.

A fresh connector-side inspection is mandatory before any recommendation is promoted into the live route.