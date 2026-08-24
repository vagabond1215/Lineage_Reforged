# Quest, Offer, Issuer, And Arc Architecture Consolidation

Date: 2026-08-24

Status: connector-side future architecture consolidation; documentation only; no schema/runtime implementation authority

Pass 5 baseline: `164655b0bc9f57d7459dfbb7664a09b77c195b0e`

Protected active route: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

## 1. Purpose

Consolidate accepted quest identity/product direction with the repository's later objective, organization, person/NPC, office/institution, place, travel, discovery, service, inventory/reward and runtime-owner boundaries.

The goal is a durable answer to the auditability questions that arise once quests can:

- be offered in more than one settlement;
- be issued by several kinds of people or entities;
- share reusable work patterns without becoming the same authored story;
- participate in linear or branching quest chains;
- reveal or grant access to places;
- carry voluntary, organizational, legal or relationship-driven semantics;
- persist as player-specific offers and accepted state independently of the authored definition.

This consolidation does **not** create a quest schema, issuer union, arc collection, runtime offer framework, generic organization collection, content, or implementation route.

## 2. Precedence And Historical Architecture Note

Current focused authority controls over older broad architecture notes.

`docs/architecture/quest-template-system.md` remains useful as historical/reusable-stage design context, but portions of it predate later decisions. In particular, historical generic formulas, class modifiers, lineage modifiers, fixed RNG thresholds, reward multipliers and universal stage behavior are not current implementation authority merely because they appear there.

Use the later accepted rules instead:

- Lineage: Reforged is classless where current systems support that direction;
- quest eligibility should be contextual rather than a universal class/level gate;
- objective/action-tree node ids remain local to their owning definition/archetype;
- definitions, archetypes and templates are separate authorities;
- generated offers and player quest state are mutable runtime owners, not authored quest content;
- issuer strings do not manufacture person, office, institution or generic organization identity.

## 3. Stable Identity And Lifecycle Layers

Future quest work should preserve at least these **eleven distinct layers**.

| Layer | Identity/owner posture | What it answers | What it must not own by implication |
| --- | --- | --- | --- |
| **1. Quest definition** | `quest_definition.<unique_slug>` | What unique authored undertaking/story/contract is this? | Current player state, current issuer instance, chain position, current location, acceptance, progress or payout. |
| **2. Reusable archetype** | existing `civilization.quest_archetypes` | What reusable work/branching family can definitions draw from? | A unique story, live offer, player progress or canonical issuer identity. |
| **3. Procedural template** | existing `civilization.quest_templates` | What authored policy may generate repeatable offers from economy/security/frontier facts? | A hand-authored unique definition, accepted quest or global objective graph. |
| **4. Quest arc/group** | future `quest_arc.<unique_slug>` if justified | Which stable definitions belong to one story/progression group, and how are they ordered/branched? | Renaming definitions to encode sequence; player-specific progress unless a later runtime owner consumes the arc. |
| **5. Offer context/distribution rule** | future definition-local or separate authored context contract | Under what authored places/issuer relationships/circumstances may this definition be presented? | A live player offer instance, map reveal, access grant or current world mutation. |
| **6. Runtime offer instance** | future stable runtime identity, separate from title and definition id | Which specific offer has been admitted for this campaign/player/source occurrence? | Definition identity, generic acceptance, quest progress or reward execution. |
| **7. Journal projection** | current/future player/session journal owner | How is an admitted offer/active quest presented in the player's quest journal? | Canonical quest definition or issuer identity. |
| **8. Accepted/active quest state** | player/session/save/runtime owner | Has this player accepted it, is it tracked, active, completed, failed or abandoned? | Authored definition mutation or generic organization membership. |
| **9. Objective/action-tree nodes** | owner-local ids embedded in definition/archetype | What authored/check/branch structure belongs to this quest family/definition? | Globally unique objective identity or independent objective content collection. |
| **10. Runtime progression evidence** | command/result/event/occurrence/receipt owners as each quest system requires | What actually happened, in what order, and what state mutation was accepted? | Static authored facts or generic journal projection. |
| **11. Turn-in/consequence receipts** | future quest consequence/reward/access/service owners | Which payout/access/standing/item/service consequences were actually delivered exactly once? | Static reward envelopes as proof of delivery. |

Separating these layers is an auditability feature, not overengineering. It prevents one overloaded quest id or journal row from pretending to answer every authorship, distribution, progression and consequence question.

## 4. Authored Quest Definition Identity

Retain the accepted identity direction:

`quest_definition.<unique_slug>`

The slug must be stable and unique inside quest-definition authority. It may contain a meaningful place, issuer or narrative qualifier when that helps humans distinguish the record, but there is **no mandatory positional grammar** such as:

`[location].[entity].[type].[id].[series]`

Do not require parsers or auditors to derive facts from slug segments.

Prefer:

- stable id for record identity;
- explicit typed fields/references for issuer, offer contexts, target places, kind, arc membership, prerequisites and consequences;
- mutable runtime state in separate owners.

A title may change without changing the id.

A quest may change distribution without changing the id.

A quest may gain another offer origin without changing the id.

A quest arc may insert/reorder another definition without renaming existing quest ids.

## 5. Quest Arc / Chain Direction

Future quest chains should use a separate grouping/relationship authority rather than numeric suffixes embedded in definition ids.

Recommended eventual `quest_arc.<unique_slug>` posture:

- stable arc identity;
- membership references to stable quest-definition ids;
- owner-local stable arc node keys when branching is required;
- prerequisite and branch relationships;
- optional display/sequence order for simple linear arcs;
- lifecycle/provenance/notes appropriate to static authored content;
- no automatic player progress fields in the authored record.

Example concept:

```text
quest_arc.<story>
  node.envoy      -> quest_definition.the_broken_envoy
  node.banner     -> quest_definition.a_banner_without_a_lord
  node.red_ford   -> quest_definition.ashes_at_red_ford
  node.last_oath  -> quest_definition.the_last_oath
```

If a new quest is later inserted between two nodes, existing definition ids remain unchanged.

Objective/action-tree nodes remain local to each definition/archetype and must not be promoted into global arc identity merely because the arc references the quest.

No quest-arc schema is authorized by this consolidation. A concrete multi-quest chain should be the reopening trigger.

## 6. Issuer Identity Direction

Do **not** create a universal `organization.*` collection merely so quests can have one issuer field.

The repository intentionally preserves specific owner families. Future issuer references should be **owner-family-aware**.

Potential canonical issuer families include, only where those authorities actually exist and the specific record is authored:

- `person.*` — enduring named person identity;
- `npc.*` — interaction overlay when the quest relationship specifically concerns the interactable presence rather than the person;
- `guild.*` / existing guild authority;
- `faction.*` after accepted faction content exists;
- religion/religious-order identity under its existing religion owner;
- polity identity where the polity itself is the issuer;
- future government identity where a governing body is the issuer;
- future institution identity;
- future civic office identity;
- future business/company identity;
- a settlement/place only when the *place itself* is truly the authored owner rather than shorthand for an unnamed authority within it.

### 6.1 Typed issuer reference recommendation

A future quest contract should prefer a typed/reference structure conceptually like:

```text
issuer:
  ownerFamily: <person | npc | guild | faction | religion_order | polity | government | institution | office | business | ...>
  entityId: <canonical id from that owner family>
  displayName: <presentation snapshot where needed>
  contactPersonId: <optional canonical person when applicable>
  settlementContextId: <optional place context, not issuer identity>
```

This is architecture direction, not an approved schema or exact field vocabulary.

The important rule is semantic:

> **issuer type + canonical owner reference is data; parsing the issuer out of the quest id is not.**

Until a referenced owner exists, presentation fields may remain noncanonical metadata only when a focused quest decision explicitly permits it, as the Ashen canon currently does for `Starfall Harbormaster's Office` / `Duty Harbormaster`.

Do not mint an office, person or institution solely because a quest schema needs a string.

## 7. One Definition, Several Offer Origins

A quest should remain **one authored definition** when all of these are materially the same:

- narrative undertaking;
- requested outcome;
- principal issuer/authority and motivation;
- meaningful consequences;
- completion identity;
- relationship/reward posture.

The quest can still be advertised or delivered through several locations or delegates.

Examples:

- one kingdom-wide proclamation available from several city notice boards;
- one religious order's pilgrimage offered at multiple temples;
- one guild contract visible at several local guild halls;
- one military dispatch delivered by different officers acting for the same command.

Those differences belong in **offer contexts/distribution facts**, not cloned definition ids.

A future offer context may need to express:

- issuer/delegating authority reference;
- presenting place/site;
- presenting person/NPC/board/service when canonical;
- availability trigger references;
- local copy/voice variant when the underlying quest is still the same;
- eligibility/access prerequisites specific to that presentation path;
- provenance/priority/fallback rules when several contexts expose the same definition.

No multi-origin schema is authorized until a concrete quest needs it.

## 8. Similar Work From Different Issuers Usually Means Different Definitions

Two quests should normally be **different definitions** when their issuer, motive or meaningful outcome changes, even if the physical task is similar.

Ashen Reef illustrates the rule well.

These could all be separate future authored definitions:

- Starfall civic soundings for safe pilotage;
- a fisher's request to scout productive grounds;
- a hunter's request to identify trails or nesting activity;
- a noble household seeking a scenic/event site;
- a religious body investigating a sacred or elemental phenomenon;
- a military authority mapping approaches;
- a scholar studying geology, ruins or flora.

They may reuse:

- a survey archetype;
- target place references;
- some objective/action-tree structure;
- shared service/tool/location requirements.

They remain separate if motivation, issuer, consequence, relationship effect, legal posture or narrative identity materially differs.

**Functional similarity is not quest identity.**

## 9. Delegates Versus Multiple Issuers

A useful distinction for future audits:

### Delegate/presentation source

A clerk, notice board, guild hall, priest, messenger or local official may present an offer **on behalf of** one canonical issuer.

That does not necessarily make the presenter a second issuer.

### Co-issuer / multi-authority quest

A quest truly has multiple issuers only when two or more authorities jointly own the request or consequences—for example, a joint civic-guild commission or treaty obligation.

Do not infer co-issuance merely because several parties benefit from the result.

A future multi-issuer contract would require explicit cardinality, responsibility, reward/consequence and dispute semantics. It should not be added speculatively to every definition.

## 10. Availability, Eligibility, Suitability, Access, And Completion

Keep these five concepts separate.

### 10.1 Availability

**Why is an offer present now?**

Possible owner facts include:

- persistent ordinary local work;
- season/tide/weather aftermath;
- economic shortage/surplus;
- security/monster/crime pressure;
- political/religious events;
- organization progression;
- prior quest/event outcomes;
- infrastructure/resource/world-state conditions.

Availability creates the opportunity to be offered; it does not prove the player qualifies, knows the target place, can access it, or has accepted it.

### 10.2 Hard eligibility

**Will the issuer/system allow this character to accept?**

Use hard gates only when the fiction/owner requires them:

- membership/rank;
- legal authorization;
- reputation/standing;
- prerequisite quest/arc state;
- required credential/tool/item/spell/trait;
- a skill/capability threshold when the issuer would actually vet candidates;
- physical/logistical impossibility.

Avoid blanket class gates and invisible universal level gates.

### 10.3 Suitability / risk

**How advisable is the undertaking for this character/party?**

This may consider stats, skills, equipment, party support, health, fatigue, environment and expected enemies without preventing acceptance unless the issuer logically screens for those facts.

A player may be allowed to make a dangerous choice.

### 10.4 Access

**Can the character actually reach/use the required place/service/resource?**

Access is its own consequence/owner:

- route knowledge;
- fare/toll;
- permit/pass;
- transport;
- membership;
- sponsorship;
- racial/cultural/political restriction;
- private/military/religious/dungeon gating;
- quest-specific authorization.

Quest visibility must not automatically equal geographic access.

Ashen is a concrete exception where **accepted quest acceptance** legitimately supplies the charts, instructions, authorization and arranged access for the survey anchorage. That quest-specific causal choice is not a universal quest rule.

### 10.5 Completion

**What evidence proves the undertaking is done?**

Completion consumes accepted runtime progression/results/receipts and authored completion policy. It is not the same as turn-in or consequence delivery.

A completed field task may still require later return/turn-in, verification or receipt-driven payout.

## 11. Offer Context Versus Runtime Offer Instance

An **authored offer context** describes where/why a definition *may* be presented.

A **runtime offer instance** proves that one concrete offer *was actually admitted* for a player/campaign/source occurrence.

Do not collapse them.

A future runtime offer instance should have stable identity separate from:

- definition id;
- display title;
- issuer display name;
- journal array position;
- current objective text.

It should eventually support enough provenance for:

- campaign/player identity;
- definition identity;
- source occurrence or deterministic admission key;
- offer context used, where relevant;
- recurrence instance when repeatability exists;
- retry/durable duplicate behavior;
- stale/conflict rejection;
- acceptance/consumption relationship.

Exact fields and identity formulas require a dedicated runtime decision.

The Ashen-specific staging/admission owner in `0.6.11` is deliberately narrow and should be used as evidence for a later generic decision only after independent acceptance and a second real quest proves common behavior.

## 12. Journal Projection Is Not Quest Authority

`sessionState.questJournal` is a player/session presentation/state surface.

Its row should be understood as a projection/instance record, not the canonical authored quest definition.

Therefore future journal cleanup must not require:

- display titles to be globally unique;
- issuer presentation strings to become canonical ids;
- objective prose to become objective identity;
- region labels to become location authority;
- journal ordering to become lifecycle order;
- a row id to encode location/issuer/kind/series in positional segments.

The journal may snapshot presentation for persistence/UI reasons without becoming the owner of the underlying authored identities.

## 13. Quest Kind Semantics

Preserve the accepted product vocabulary as future intent:

| Kind | Product meaning | Key future behavioral question |
| --- | --- | --- |
| **Quest** | voluntary requested undertaking | normal acceptance/ignore/decline lifecycle |
| **Mission** | organizational assignment tied to an optional progression path | whether completion is required for rank/progression and how reassignment works |
| **Order** | command backed by authority | consequences of refusal/disobedience; legal/organizational authority required |
| **Favor** | rare opportunistic relationship-driven task | variable relationship/access/service rewards and expiration/opportunity semantics |
| **Trial** | separate challenge/qualification authority by default | may require quest-like action but should not be collapsed into quest identity |

Do not implement these as one enum merely because the words are defined. A future classification decision must prove which shared fields and which distinct lifecycle/consequence contracts are actually needed.

A `Mission` is not automatically mandatory in the world; it can be mandatory **for advancement within a voluntary organization path**.

An `Order` is different because the actor is already under an authority relationship where disobedience itself can have consequences.

## 14. Contextual Narrative Naming

Stable ids and narrative titles are intentionally separate.

Player-facing titles should reflect issuer voice and purpose:

- formal civic/guild titles may be terse or bureaucratic;
- commoners may use practical everyday phrasing;
- nobles, religious authorities, criminal groups or scholars may frame the same location differently.

A quest definition can keep its stable id while its title/copy receives later editorial improvement.

When one underlying quest has several delegates/offer locations, context-aware presentation variants may be appropriate **only if they do not materially change the quest's identity, motive or consequences**. If they do, author separate definitions.

## 15. Auditability Rules

A future quest audit should be able to answer these questions without parsing prose or id segments:

- What is the canonical authored definition id?
- Which archetype/template, if any, does it reuse?
- Is it part of an arc? Which stable arc node?
- Who is the canonical issuer, and which owner family owns that identity?
- Who merely presented/delegated the offer?
- Where can it be offered?
- What occurrence made it available?
- Why was this player eligible or ineligible?
- What suitability/risk information was known?
- What access did the player already possess, and what access did acceptance/consequences grant?
- Which runtime offer instance was admitted?
- Which acceptance/progression occurrences/results/receipts belong to it?
- What evidence completed it?
- What turn-in/reward/access/service consequences were actually delivered?
- Has every one-time or recurring instance been consumed/idempotently handled?

If answering one of those questions requires guessing from a display title or composite string, the owner model is probably too implicit.

## 16. Consequence Ownership

Quest definitions may describe intended consequences, but execution belongs downstream.

Keep distinct:

- currency payout;
- item-instance/stack transfer;
- reputation/standing/favorability mutation;
- organization membership/rank changes;
- service unlocks;
- vouchers/limited access;
- merchant/auction introductions;
- permits/passes;
- location/travel access;
- Knowledge/discovery evidence;
- Chronicle/history projection.

One quest may cause several consequences atomically or in staged turn-in, but each effect needs its actual owner and idempotent delivery evidence.

This is why `580 crown + salvage rights` text was never sufficient evidence that those Ashen consequences existed.

## 17. Organization And People Boundary

Quest content may reference an existing canonical owner; it must not create one by convenience.

Examples:

- a named contact in quest prose does not automatically create `person.*`;
- `npc.*`-shaped legacy strings do not prove a canonical person/NPC;
- `office.*` presentation anchors do not prove office/institution/government authority;
- guild policy fields do not prove a current member/officer relationship;
- settlement guild presence does not mint a new guild;
- generated businesses/operators do not create canonical companies/people;
- a service id does not create its provider.

When issuer identity is missing but the quest is otherwise ready, a focused authored-canon decision may temporarily authorize presentation metadata without fabricating canonical entity ids, as with the current Ashen office role.

The correct follow-up is a later entity-owner decision when a real consumer needs that identity—not a generic placeholder registry.

## 18. Place And Travel Boundary

Quest relationships to geography should use explicit typed concepts rather than one overloaded location field.

A future definition/context may need different references for:

- issuer/home settlement;
- offer/presentation place;
- target region;
- target settlement;
- target district/site;
- required route/access surface;
- return/turn-in place;
- alternate valid origin/destination contexts.

These are not all identity components.

The runtime compatibility `location.*` destination keys remain separate from canonical authored settlement/district/site identity until a dedicated travel migration decision.

Quest completion must not silently grant map reveal, Geographic Knowledge, recognition or travel access unless a specifically authorized consequence owner does so.

## 19. Remaining Product Questions

No product question in this architecture blocks current `0.6.11`.

The following should be asked only when their trigger becomes concrete:

1. **Arc contract:** first real branching/linear multi-quest story requiring arc identity.
2. **Kind contract:** first organization/law/relationship consumer that requires Quest vs Mission vs Order vs Favor behavior.
3. **Multi-issuer contract:** first quest genuinely co-owned by multiple authorities rather than merely presented by delegates.
4. **Generic offer context contract:** second/third real quest requiring reusable multi-origin distribution after the Ashen offer owner is independently accepted.
5. **Generic issuer reference contract:** first schema pass where two or more stable issuer owner families must coexist in the same validated field.
6. **Turn-in/consequence contract:** first accepted quest whose real currency/item/standing/access/service payout must be delivered.
7. **Decline/abandonment/expiry contract:** first live quest family that actually needs destructive decline, abandonment, expiration or re-offer semantics.

Do not ask these questions merely because a generic system could theoretically support them.

## 20. Ashen Reef As First Narrow Evidence, Not Universal Pattern

`Soundings of Ashen Reef` is useful because it demonstrates the separation:

- authored definition: `quest_definition.starfall_ashen_reef_soundings`;
- accepted runtime compatibility id: `quest.ashen_reef_survey`;
- issuer presentation: Starfall Harbormaster's Office;
- contact role: Duty Harbormaster;
- offer context: ordinary Starfall start/local civic offer;
- runtime offer/journal admission: narrow `0.6.11` owner;
- acceptance: existing quest acceptance path;
- access consequence: accepted acceptance establishes the exact Ashen survey destination;
- travel/arrival: existing travel owner;
- survey progression: accepted four-shift survey owner;
- turn-in/reward: intentionally deferred.

The lesson is the **layer separation**, not the exact implementation choice.

Future quests should not all:

- stage during new-campaign creation;
- grant access on acceptance;
- use `quest.<slug>` runtime ids forever;
- use government issuers;
- be one-time;
- lack expiry;
- use survey mechanics.

General infrastructure should emerge only after additional real consumers prove which semantics are actually shared.

## 21. Pass 5 Result

Outcome: `QUEST_ARCHITECTURE_CONSOLIDATED`.

Identity/lifecycle layers explicitly separated: **11**.

Generic organization owner required: **no**.

New schema/runtime/version authorized: **none**.

Product questions required before parked `0.6.11`: **0**.
