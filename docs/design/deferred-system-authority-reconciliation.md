# Deferred-System Authority Reconciliation

Date: 2026-08-24

Status: connector-side authority map; documentation only; not an implementation route

Pass 4 baseline: `f9a6cc84950f99d98bc9e225c28efcd2ab8904c8`

Protected active implementation route: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

## 1. Purpose

This document is a compact lookup surface for major deferred systems whose intent is otherwise distributed across the chronological backlog, future-system design ledger, open-design question index, historical/deferred route register, roadmap, and focused design decisions.

It does not replace those documents.

Use this map to answer five questions before opening a future lane:

1. Does a focused owner/boundary already exist?
2. Is there a static/schema foundation without runtime ownership?
3. Is the topic still only product direction?
4. What exact evidence, authored input, or downstream consumer is missing?
5. What event should reopen the lane?

When this map conflicts with a newer focused accepted decision or current Codex handoff, use the newer/more specific authority and rebaseline this map later.

## 2. Status Vocabulary

| Status | Meaning |
| --- | --- |
| `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | Ownership/separation is accepted; mutable/gameplay execution remains deferred. |
| `SCHEMA_OR_STATIC_FOUNDATION_EXISTS_DEFER_CONSUMER` | A schema/static authority or concrete record family exists; next behavior waits for a named consumer/runtime owner. |
| `PRODUCT_DIRECTION_ONLY` | User/product intent exists, but a dedicated owner/schema/behavior decision has not yet accepted implementation structure. |
| `EVIDENCE_OR_AUTHORED_INPUT_REQUIRED` | The boundary is known enough to identify what is missing, but implementation must wait for explicit canon/evidence/reference semantics. |
| `REJECTED_OR_SUPERSEDED_MODEL` | A tempting generic/older model has been explicitly rejected or replaced. |
| `ACTIVE_ELSEWHERE` | Part of the topic is currently owned by another active package and must not be opened independently. |

## 3. Authority Matrix

| System family | Current focused authority | Current status | Remaining deferred decision / missing owner | Reopening trigger |
| --- | --- | --- | --- | --- |
| **Quest arcs/chains** | `quest-identity-offer-context-and-travel-access-product-direction.md`; quest objective/condition authority | `PRODUCT_DIRECTION_ONLY` | Separate `quest_arc.<slug>` grouping/branch/order contract, prerequisite semantics, authored vs runtime arc state, validation and presentation. Do not encode chain position in quest ids. | Reopen when a concrete multi-quest authored story/organization chain requires branching/ordering beyond independent quest definitions. |
| **Quest / Mission / Order / Favor / Trial semantics** | `quest-identity-offer-context-and-travel-access-product-direction.md` | `PRODUCT_DIRECTION_ONLY` | Typed classification, refusal semantics, legal/organizational consequences, rank progression links, favor access/reward consequences, UI vocabulary. Trial remains separate by default. | Reopen when a concrete organization/law/relationship consumer requires behavior different from voluntary quests. |
| **Quest turn-in and reward execution** | quest reward envelopes; `item-equipment-inventory-authority-boundary-decision.md`; Ashen canon/package | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | Owner for actual payout, item instance/stack transfer, standing/reputation change, service/access consequences, claim/idempotency and persistence. Static reward declarations do not execute. | Reopen after a quest with accepted completion/turn-in semantics needs real consequence delivery; Ashen exact payout remains intentionally deferred. |
| **Quest offer admission / distribution** | `quest-identity-offer-context-and-travel-access-product-direction.md`; active Ashen package | `ACTIVE_ELSEWHERE` for the Ashen-specific first owner; otherwise `PRODUCT_DIRECTION_ONLY` | Generic multi-origin distribution, recurrence, dynamic world-condition offers, stable offer-instance policy across quest families. | Do not reopen generically until `0.6.11`/`0.6.11.1` close the first engine-owned representative offer path and a second consumer proves shared infrastructure is warranted. |
| **Guilds / factions / generic organizations** | `organization-faction-guild-boundary-decision.md`; later faction schema work | `REJECTED_OR_SUPERSEDED_MODEL` for a universal organization collection; `SCHEMA_OR_STATIC_FOUNDATION_EXISTS_DEFER_CONSUMER` for specific owners | Keep guilds, factions, polities, religions/orders, businesses, offices, families and forces distinct. Membership/rank/affiliation are separate link/runtime concerns. | Reopen a specific owner only when explicit canon or a named consumer needs it. Do not reopen a generic organization umbrella without evidence that it adds authority without duplication. |
| **Institutions and civic offices** | `institution-office-authority-boundary-decision.md`; `civic-authority-boundary-decision.md` | `EVIDENCE_OR_AUTHORED_INPUT_REQUIRED` | Stable institution/office identities, references, cardinality and distinction from government, facility/site, provider, guild, religion/order, business and person/office-holder. | Reopen when explicit authored civic bodies/offices or a concrete consumer requires canonical identity rather than presentation anchors such as quest `office.*` strings. |
| **Government and jurisdiction** | `government-jurisdiction-authority-boundary-decision.md` | `EVIDENCE_OR_AUTHORED_INPUT_REQUIRED` | Government organization/temporal contract; jurisdiction authority/scope cardinality, overlap/priority and temporal validity. Neither is schema-ready. | Reopen only with explicit authored government/jurisdiction facts, a durable new source, authorized civic authorship, or a ready consumer with stable referenced owners. |
| **Law, courts, enforcement and public order** | government/jurisdiction boundary; `force-public-order-authority-boundary-decision.md`; related deferrals | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` / evidence-gated | Law remains downstream of jurisdiction; courts split institution/office/place/jurisdiction/procedure/case; enforcement/forces remain separate. Arrests, warrants, cases, punishment, patrols and wanted state are runtime concerns. | Reopen after jurisdiction is decision/schema-ready and a concrete legal/public-order consumer requires one bounded law or force contract. |
| **Business/company/provider/service identity** | organization boundary; business/company boundary/evidence audit; `service-authority-boundary-decision.md` and later service registration | `SCHEMA_OR_STATIC_FOUNDATION_EXISTS_DEFER_CONSUMER` for provider-independent services; business/provider identity remains evidence-gated | Stable company/provider identity and provider-to-service association; current services answer *what service exists*, not who offers it, access, price, stock or execution. | Reopen when a canonical business/provider is explicitly authored or a runtime service consumer needs one stable provider link. |
| **Travel compatibility destination cleanup** | `travel-compatibility-identity-and-migration-intent-audit.md` | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | Three settlement-era compatibility aliases and one narrower Ashen approach key need independent migration treatment; no replacement ids are authorized. | Reopen after `0.6.11.1` or when a journey/route/precise-location/save consumer requires canonical destination references. |
| **Broader journey/grid/fast travel** | existing engine-owned player travel; travel design notes; hazard/route security boundaries | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | Route planning, journey state, event rolls, caravan/merchant behavior, grid actions, risk/success model, fast-travel thresholds and alternate modes. Earlier “map/grid before any travel” sequencing is superseded by landed engine travel. | Reopen when current engine travel requires a real journey/route consumer; choose the smallest travel mode rather than re-planning all modes together. |
| **Discovery / POI / map reveal** | `discovery-poi-boundary-decision.md` | `REJECTED_OR_SUPERSEDED_MODEL` for generic `world.pois`; `BOUNDARY_ACCEPTED_DEFER_RUNTIME` for discovery state | Specific place families own identity. Player/session/account runtime owns known/discovered/visited/revealed state. Map reveal/fog/route visibility remain separate runtime state. | Reopen when a map/discovery UI or travel consumer needs a minimal durable reveal/visibility owner. Do not create a generic static POI catalog merely for presentation. |
| **District/site/building/interior player position** | `settlement-district-site-authority-boundary-decision.md`; settlement district/site activation work; quest/travel product direction | `SCHEMA_OR_STATIC_FOUNDATION_EXISTS_DEFER_CONSUMER` for districts/sites; `PRODUCT_DIRECTION_ONLY` for building/interior runtime position | Current authored districts/sites are distinct place owners. Precise character position needs structured references; placed-building/interior/instance ownership is not established. | Reopen when travel, activity, interaction or UI requires location precision beyond settlement/site labels and an actual building/interior owner is selected. |
| **People / NPC identity and persistence** | `person-vs-npc-schema-decision.md` | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | Future `civilization.people` canonical person identity and optional `civilization.npcs` presence overlays are defined conceptually, but content/runtime generation, schedules, dialogue, interaction, promotion and persistence are not implemented. | Reopen when explicit canonical named-person evidence exists or a concrete quest/service/companion/schedule consumer requires one person/NPC record. Generated role-placeholder promotion semantics remain a product question. |
| **Relationships / reputation / standing / favorability** | organization boundary; user relationship decisions; elemental alignment decision; existing broad reputation/standing owners | `PRODUCT_DIRECTION_ONLY` for generalized local relationship runtime; specific broad current owners remain | Separate public reputation, membership, legal status, access, trust/favorability, relationship state, recognition and rank; exact decay/hardening/checkpoints and reveal mechanics. Do not put mutable relationship values in static organization identity. | Reopen when one concrete relationship owner (e.g. faction, religious order, person, settlement) needs engine-owned mutation and persistence. |
| **Elemental alignment / temperament / magic stimulus** | `elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md` | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | Translate accepted conceptual alignment/environment/temperament/stimulus semantics into runtime/save ownership without collapsing them into religious favorability or learned-spell identity. | Reopen when a real magic/environment/relationship consumer needs alignment to affect resolution or persistence. |
| **Family / households / kinship / heirs** | `family-authority-boundary-decision.md`; `offspring-heir-family-continuity-owner-plan.md`; current account family/Bloodlines owners | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | Static family/household/kinship identity remains separate from mutable account families. Heir generation, descendants, marriage, succession, care/adoption, bequests and property transfer require runtime owners. | Reopen when a concrete succession/heir gameplay slice is selected and person/family/kinship/estate dependencies are decision-ready. |
| **Maturation / rearing Prestige / growth roles** | `offspring-growth-recipes-ecology-engine-plan.md`; user design decisions; family owner work | `PRODUCT_DIRECTION_ONLY` | Exact cadence, growth-role categories, evidence of habitual activity, parent-weight/RNG formulas, zero-sum focus math, Prestige unlock tracks and orphan/adoptive adjustments. | Reopen only as part of an accepted offspring/heir lifecycle implementation, not as an isolated stat simulator. |
| **Inventory containers / stack identity / item instances** | `item-equipment-inventory-authority-boundary-decision.md`; contextual-action decisions | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | Static container templates remain future; runtime already owns bags/stacks/equipment/wallet. Unique item instances, ownership, condition, quality, provenance, container movement and additional stack-splitting rules need dedicated runtime/save decisions. | Reopen when inventory mutation/storage/loot/reward/crafting needs identity stronger than current stacks and exact container semantics. |
| **Player-facing recipes / crafting execution** | `crafting-authority-boundary-decision.md`; `recipe-and-production-schema-decision.md`; current production chains/workplaces | `SCHEMA_OR_STATIC_FOUNDATION_EXISTS_DEFER_CONSUMER` | Reconcile player recipes with embedded production-chain recipe profiles; recipe learning/ownership; inventory consumption/output creation; stations/tools; quality; repair/salvage; runtime orders/history. | Reopen when a specific player crafting loop is selected and inventory/item-instance mutation plus recipe ownership can be named explicitly. |
| **Cooking / bulk preparation / family recipes** | culinary permanent decisions; offspring/recipe design plan; crafting boundary | `PRODUCT_DIRECTION_ONLY` for bulk/family progression; culinary data/presentation decisions exist | Which recipes require trials, quality labels, family access/learning, married-out inheritance, bulk scope and per-item outcome semantics. | Reopen with a concrete cooking/crafting runtime loop after recipe/inventory ownership is ready. |
| **Ecology / agriculture / managed breeding** | static content expansion/ecology research; offspring-growth ecology plan; resource/habitat owners | `PRODUCT_DIRECTION_ONLY` for mutable population/breeding | Macro abundance/count model, depletion/reproduction/migration ownership, agriculture state, managed stock identity, genetic/quality traits and economy effects. | Reopen after estate/workplace/ownership/storage/economy seams exist for managed systems, or when a concrete wild-population consumer needs a bounded regional abundance state. |
| **Magic Study** | `magic-study-authority-boundary-decision.md`; `magic-study-source-schema-decision.md` | `SCHEMA_OR_STATIC_FOUNDATION_EXISTS_DEFER_CONSUMER` | Study source/evidence contracts exist conceptually/static-first; mutating study attempts, learning progression and effect-bearing downstream use remain separate. | Reopen when a real engine-owned learning/study loop is selected with authoritative occurrence/result/persistence. |
| **Effect-bearing spell casting / catalysts** | magic study boundary; legacy spell runtime source map; item catalyst/conduit metadata; combat/runtime decisions | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | First effectful spell candidate, resolver ownership, resource/catalyst reservation/consumption timing, failure atomicity, combat/world effect ownership and persistence. Item catalyst metadata is compatibility only, not consumption state. | Reopen when one explicit spell/effect consumer is chosen and its combat/world owner can be tested end to end. |
| **Magic legality/licensing** | government/jurisdiction/law boundaries; organization/religion boundaries | `EVIDENCE_OR_AUTHORED_INPUT_REQUIRED` | Which authority licenses/restricts magic, where it applies, enforcement, permits and consequences. Cannot be a magic-global rule by inference. | Reopen after jurisdiction/law authority exists for a concrete polity/place and authored canon specifies a restriction or licensing regime. |
| **Survival state / body recovery** | user survival direction; metabolic/nutrition decisions; care/stakes decisions | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` for several body/recovery subcontracts; broader survival loop not selected | Hunger/thirst/climate/comfort/stress presentation and mutation cadence; integration of metabolic/body-condition research with ordinary activities and difficulty without over-simulation. | Reopen with a concrete survival activity/rest/travel consumer, using existing body/care authorities rather than creating another parallel physiology ledger. |
| **Builder / bushcraft / construction** | user design decisions; open-design index; survival-builder gap audit | `PRODUCT_DIRECTION_ONLY` | First builder-adjacent slice remains unresolved; substantial construction requires skills, technology, tools, permission, resources and manpower. | Reopen only after product chooses the first small builder slice (likely bushcraft/camp utility) and its item/place/activity owners are ready. |
| **UI common record/search/history** | `ui-information-architecture-boundary.md` | `BOUNDARY_ACCEPTED_DEFER_RUNTIME` | Read-only typed search/index/history/pins storage and navigation owner. Common UI projection must not become common canonical entity storage. | Reopen when a real UI implementation package needs cross-domain search or linked-record navigation after current owner projections are stable. |
| **Player-authored notes** | `ui-information-architecture-boundary.md` | `PRODUCT_DIRECTION_ONLY` | Storage scope, owner, edit history, save/account lifecycle and separation from authored/runtime existing `notes` fields. | Reopen only when player notes are intentionally prioritized; never repurpose existing authored note fields. |
| **Access/services/favor rewards** | quest product direction; service authority; organization and travel boundaries | `PRODUCT_DIRECTION_ONLY` | Temporary membership, vouchers, introductions, merchant/auction access, location access and service unlocks need typed consequence owners and idempotent grant/expiry semantics. | Reopen when one concrete favor/quest consequence requires a real downstream access or service grant. |

## 4. Rejected Generic Shortcuts

The following broad shortcuts remain unsafe even when they appear to reduce implementation count:

- one generic `organization` collection for guilds/factions/religions/governments/offices/businesses;
- one generic static `world.pois` collection for every interesting place;
- one universal quest id grammar encoding location/issuer/type/series;
- one generic relationship ledger that erases owner-specific semantics before concrete consumers exist;
- one generic travel destination rename/migration applied identically to all current `location.*` keys;
- static content fields that directly own player-known/revealed state, inventory contents, current membership, reputation, reward payout or runtime mutation;
- promotion of quest giver strings, generated runtime ids, site labels, prose names or demo fixtures into canonical entity authority by inference.

These are not missing implementation tasks; several are explicitly rejected ownership models.

## 5. Current Active-Route Isolation

Nothing in this reconciliation competes with the parked `0.6.11` implementation package.

The only mapped families currently active inside `0.6.11` are the **Ashen-specific** offer admission, acceptance-triggered access, Starfall/Ashen origin correction and representative-loop evidence. This document does not broaden those into generic quest, travel, reward, organization, discovery, relationship or precise-location frameworks.

No additional authored product decision is required before `0.6.11`.

## 6. How Future Work Should Use This Map

When a deferred system becomes relevant:

1. start from the focused authority named here;
2. inspect live repository state and later decisions before trusting this map;
3. name the concrete consumer and mutation/evidence owner;
4. resolve only the missing boundary required by that consumer;
5. keep unrelated deferred families closed;
6. update the open-design question index only if user/product input becomes genuinely timely;
7. use Codex/worktree when source, schema, content, tests, build, migration, persistence or multi-file implementation is required.

The backlog remains useful chronology. The design ledger remains useful broad intent. Neither should be treated as an implementation queue without these owner/readiness checks.

## 7. Pass 4 Result

Outcome: `AUTHORITY_MAP_RECONCILED`.

Major deferred families mapped: **29**.

Current-route conflicts: **0**.

No new implementation/version route is authorized by this document.
