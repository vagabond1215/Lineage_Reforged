# Connector-Safe Pass 5 - Quest, Offer, Issuer, And Organization Architecture Consolidation Plan

Date: 2026-08-24

Status: ACTIVE

Execution surface: GitHub Connector, documentation-only

Protected active implementation route: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

## Purpose

Consolidate accepted quest identity/product direction with later organization, person/NPC, office/institution, place, discovery, travel, service, reward, and objective authorities into one future-facing architecture note.

The pass must clarify how future quests can be uniquely identified, offered from multiple places, issued by different owner families, grouped into arcs, admitted into a player journal, distinguished from missions/orders/favors/trials, and linked to location/access consequences without creating a generic organization owner or encoding mutable context into quest ids.

This is architecture consolidation only. It must not create schemas, content, runtime code, test expectations, new canon, or a generic quest framework.

## Goals

1. Define the durable identity layers that future quest work should keep separate:
   - authored quest definition;
   - optional quest arc/grouping;
   - authored offer context/distribution rule;
   - runtime offer instance/journal row;
   - accepted/active quest state;
   - objectives/action-tree local identities;
   - consequences/turn-in receipts.
2. Define issuer-reference direction that works with specific owner families (guild, faction, religion/order, polity/government/office/institution, business, person, etc.) without a universal organization collection.
3. Define the difference among:
   - same quest offered in several places;
   - same quest offered by several delegates of one authority;
   - similar work for materially different issuers/motives, which should usually be separate definitions.
4. Separate availability, hard eligibility, suitability/risk, access, and completion conditions.
5. Preserve future Quest/Mission/Order/Favor/Trial semantics without prematurely hard-coding one schema.
6. Define auditability expectations: stable ids plus typed relationship fields, no positional parsing of composite ids.
7. Preserve the Ashen-specific `0.6.11` owner as the first narrow representative implementation, not proof that all quests should use new-campaign staging or acceptance-owned travel access.
8. Record remaining product decisions that are truly necessary only when a concrete generic quest/organization consumer appears.

## Baseline Benchmarks

Record:

- hosted head after Pass 4;
- current prompt SHA;
- currently accepted authored quest identity family;
- currently accepted reusable archetype/template/objective authorities;
- current organization-owner posture (specific owners, no general organization collection);
- number of architecture layers explicitly separated by completion;
- number of remaining open product questions required before `0.6.11` (expected 0).

## Completion Benchmarks

Pass 5 succeeds only if:

- at least seven quest identity/lifecycle layers are explicitly separated;
- issuer references are owner-family-aware and do not require a generic organization schema;
- multi-origin versus multi-issuer semantics are decision-complete at the architecture level;
- arcs/chains are separated from quest ids and objective ids;
- availability, eligibility, suitability, access and completion are separately defined;
- runtime offer instances are not derived from display titles;
- reward/access/service outcomes remain downstream consequence owners;
- no generic implementation package or version is activated;
- current `0.6.11` prompt remains byte-identical;
- final diff is documentation-only and no branch/PR action occurs.

## Evidence Set

Minimum:

- `docs/design/quest-identity-offer-context-and-travel-access-product-direction.md`;
- `docs/design/quest-objective-and-condition-schema-decision.md`;
- `docs/data-dictionary/quests.md`;
- authored quest definition/archetype/template authority as read-only evidence;
- `docs/design/organization-faction-guild-boundary-decision.md`;
- `docs/design/person-vs-npc-schema-decision.md`;
- `docs/design/institution-office-authority-boundary-decision.md`;
- `docs/design/government-jurisdiction-authority-boundary-decision.md`;
- `docs/design/service-authority-boundary-decision.md`;
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- `docs/design/discovery-poi-boundary-decision.md`;
- Pass 2 travel identity audit;
- Pass 4 deferred-system authority reconciliation;
- accepted Ashen canon/package as the first concrete example.

## Scope Exclusions

Do not:

- change quest content/schema/types/runtime/tests;
- invent a universal `organization.*` identity;
- author new guilds, factions, offices, governments, people, businesses, religions, settlements, or quests;
- choose generic recurrence/reward/expiry formulas;
- implement Quest/Mission/Order/Favor behavior;
- create quest-arc content;
- create generic offer/admission/access/consequence runtime owners;
- alter current Ashen implementation scope;
- change current prompt/output/handoff, roadmap, sequenced plan, branches or PRs.

## Expected Output

Primary:

- `docs/design/quest-offer-issuer-and-arc-architecture-consolidation.md`.

Coordination:

- completion appendix in this plan.
