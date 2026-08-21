# Quest Identity, Offer Context, And Travel-Access Product Direction

Date: 2026-08-20

Status: user-authored product direction and deferred design intent; documentation only; not an implementation package and not by itself `AUTHORED_INPUT_ACCEPTED` for the active Ashen Reef decision

Milestone impact: `supports_current_band`

## Purpose

Preserve product direction supplied while resolving `Ashen Reef Survey Offer, Journal Admission, And Travel-Access Authored-Canon Decision` without forcing the current Ashen representative path to redesign every future quest, location, organization, or access system.

This document distinguishes:

- direction that should constrain the current Ashen authored decision;
- recommended quest/location identity architecture that is already compatible with repository authority;
- future semantics that should be retained for later dedicated design and implementation work;
- exact Ashen-specific authored facts that still require a final explicit selection before the active decision can return `AUTHORED_INPUT_ACCEPTED`.

It does not change production, content, schemas, validators, tracked tests, saves, migrations, UI, gameplay, quest rewards, or travel behavior.

## 1. Current Identity Interpretation

`quest.ashen_reef_survey` is a specific runtime compatibility identity used by the accepted Ashen Reef survey loop. It must not be treated as the required long-term naming pattern for authored quests.

Current durable authored quest authority already separates:

- `civilization.quest_definitions` for unique authored quests, using `quest_definition.<unique_slug>` identities;
- `civilization.quest_archetypes` for reusable quest-family structure;
- `civilization.quest_templates` for repeatable/generated offer inputs;
- future quest arcs as a separate grouping/ordering authority rather than mutable chain state embedded in quest definitions.

Therefore the accepted survey runtime key may remain unchanged until a later compatibility/mapping decision, while the eventual authored Ashen quest definition may receive a distinct stable `quest_definition.<unique_slug>` identity.

Do not rename the accepted `quest.ashen_reef_survey` runtime key merely to improve naming aesthetics inside the authored-canon decision.

## 2. Quest ID Direction

Do not adopt a mandatory composite id grammar such as:

`[location].[entity].[type].[id].[series]`

as the global quest identity contract.

That information is useful, but it belongs primarily in typed fields and relationships rather than being encoded into one identifier. A mandatory composite id would create avoidable identity churn when:

- one story quest may be offered from multiple cities;
- a quest may move through several locations;
- an issuer delegates or changes while the authored quest remains the same;
- a quest participates in a branching chain where numeric insertion/reordering is possible;
- the same reusable quest function is authored for different issuers or purposes;
- one quest mixes exploration, political, religious, social, economic, or combat concerns.

Preferred durable rule:

- top-level authored identity remains `quest_definition.<unique_slug>`;
- the slug must be stable and globally unique inside quest-definition authority;
- the slug should be human-auditable and may include a meaningful place, issuer, or narrative qualifier when useful, but those segments are not a mandatory grammar;
- the player-facing title is presentation, not identity, and may become more narrative without forcing an id change;
- current accepted runtime ids remain separate from authored-definition ids when compatibility requires it.

## 3. Quest Chains And Multi-Origin Quests

Future multi-quest series should use separate quest-arc authority rather than mandatory numeric suffixes in every quest id.

Recommended future arc posture:

- stable `quest_arc.<unique_slug>` identity;
- arc-owned ordered/prerequisite/branch relationships among stable quest-definition ids;
- owner-local stable node keys for branching structure;
- optional display order or sequence metadata for simple linear presentation;
- no requirement that a quest id contain `1`, `2`, `3`, or another position that would become stale when a chain branches or is revised.

A quest that can begin from several cities should remain one authored definition when its narrative identity and consequences are truly the same. Its possible offer origins should be structured offer-context records or references. If different issuers, motivations, consequences, or authored outcomes make the experiences materially different, they should be distinct quest definitions even when they reuse the same archetype or target location.

Quest objectives/action-tree node ids remain local to their owning quest definition unless a later dedicated authority proves a need for global objective identity.

## 4. Quest Kind And Assignment Semantics - Deferred Direction

Retain the following vocabulary as future product intent. Do not retrofit it into the active Ashen implementation package without a dedicated owner/schema decision.

- **Quest**: a voluntary requested undertaking. The opportunity is offered and may be accepted or ignored.
- **Mission**: an organizational assignment associated with an optional progression path. A character may refuse to pursue that progression, but completing missions may be required to advance within the organization.
- **Order**: a command backed by an authority relationship. Refusal or disobedience may itself have organizational, legal, military, religious, or criminal consequences where authored authority supports them.
- **Favor**: a comparatively rare, opportunistic task from an individual or entity, primarily relationship-driven, with variable rewards that may include money, goods, services, access, introductions, temporary membership, vouchers, auctions, merchants, or locations when those downstream owners exist.
- **Trial**: remain a separate system/authority by default. A trial may require or reference quest-like action, but existing Knowledge/trial and other future trial systems should not be collapsed into quest identity merely because action is required.

A future dedicated quest/mission/order/favor classification decision should determine typed fields, runtime consequences, acceptance/refusal semantics, organization-rank integration, law/standing effects, and UI presentation.

## 5. Narrative Naming Direction

Player-facing quest titles should be authored, contextual, and issuer-aware rather than mechanically generated from a system function.

Examples of tone, not approved canon:

- an official harbor or governing office may use a plain title such as `Survey of Ashen Reef`;
- a fisherman seeking future grounds may use a practical title such as `Scout Ashen Reef Fishing Grounds`;
- a hunter, noble household, religious body, guild, merchant, or other issuer should frame the same physical place according to its own purpose.

The stable quest-definition id must not require the player-facing title to remain unchanged. Narrative copy belongs in descriptive fields and can mature independently from stable identity.

## 6. Eligibility Direction

Quest availability and eligibility should be contextual to the actual task and issuer rather than based on one universal gamey gate.

Separate **hard admission requirements** from **suitability/risk guidance**.

Hard requirements should exist only when the fiction and owner logically require them, for example:

- organization membership or rank;
- legal or civic permission;
- reputation/standing/favor;
- an explicitly required credential, trait, item, tool, spell, or access right;
- prerequisite quest/arc state;
- a minimum skill or capability when the issuer would realistically screen candidates for it;
- physical or logistical facts that make participation impossible rather than merely dangerous.

Suitability/risk guidance may consider:

- relevant attributes and skills;
- party size and available roles;
- equipment and consumables;
- environmental hazards;
- expected hostile strength;
- the character's current health/resources/fatigue;
- whether the character plausibly understands the work being requested.

Do not make survival prediction a universal hard level gate. A dangerous quest may be visible and voluntarily accepted even when inadvisable unless the issuer would realistically refuse the character. Prefer explicit danger/suitability communication over invisible level gating.

The repository's current quest-definition `levelMin` and `classTagsAny` fields are existing authority, not endorsement of a permanent design rule. Future quest-authority work should reassess blanket level/class gating against the classless character-development direction and capability-based eligibility.

## 7. Event And Availability Triggers

Offer availability should be authored from the same common-sense causal context as the task.

Possible future triggers include, where an owning system exists:

- ordinary persistent local work;
- season or tide;
- weather or storm aftermath;
- economic shortages or surpluses;
- population/civic pressure;
- geographic or infrastructure state;
- reservoir, dam, river, road, harbor, farm, or resource conditions;
- organization progression;
- prior quests/events;
- political, religious, legal, or security conditions.

Examples such as geological, economic, population, reservoir, mountain-peak, dam, river-blockage, beaver, farm-water-use, fishing-ground, or hunting-trail surveys are retained as future design examples only. They do not authorize new simulation owners in the current Ashen route.

## 8. Journal-Admission Owner Recommendation

The stable `contracts` journal row should be created by a narrow runtime **authored quest-offer admission owner**, not by the authored quest definition itself and not by quest acceptance.

Recommended ownership split:

1. static quest-definition authority owns the authored definition and eligibility/availability descriptors;
2. an accepted world/civilization/player occurrence supplies the causal facts that make a specific offer available;
3. one game-engine quest-offer admission resolver validates those facts and idempotently projects one stable runtime offer/journal row;
4. existing quest acceptance/tracking commands continue to consume that admitted row and own `contracts -> active/tracked` transitions.

The later implementation-package decision should settle the exact file/type/API surface, but the owner should preserve:

- stable offer-instance identity distinct from definition identity;
- campaign/player/source-occurrence provenance;
- repeatability/recurrence key where applicable;
- retry and durable duplicate behavior;
- stale/conflicting-offer rejection;
- idempotent journal projection;
- version-7 persistence before acceptance;
- no generic quest framework beyond the smallest owner required by accepted authored policy.

Do not derive runtime offer identity from display title. Do not require location, issuer, kind, or chain position to be parsed from the id when those facts can be explicit typed fields.

## 9. Location Identity And Precision Direction

`location.ashen_reef` is currently a game-engine travel-destination key. Current travel facts map it to Starfall Port / Starfall Isle / `settlement.starfall_port` and label its local arrival surface `Survey Anchorage`. It is not a spawn coordinate and should not be treated as the universal canonical place-id format.

The authored world already has distinct place authority for regions, settlements, settlement districts, and settlement sites. Preserve that separation.

Long-term precise character location should be represented by structured canonical references rather than by an ever-growing composite location string. A future runtime location context may need, as separately authorized nullable layers:

- region or locality context;
- settlement id;
- settlement-district id;
- settlement-site id;
- placed building/interior/instance identity only after those authorities exist;
- map/hex/coordinate state only under its own spatial/runtime owner.

Do not duplicate the full parent hierarchy into every id when canonical records already contain parent references.

Buildings, shops, guildhalls, temples, inns, palaces, docks, and similar places should use settlement-site or later placed-building/interior authority as appropriate. Current travel/location runtime does not yet prove full district/building-granularity player-position ownership.

## 10. Travel-Access Philosophy

Default product direction is that ordinary regions and generally open settlements are not progression-quest gated merely because they exist.

Travel admission should instead follow lore-compatible requirements such as physical route, mode of travel, distance/time, hazards, money/tolls/fares, papers, local law, and explicit access restrictions when their owners exist.

Restricted access is a deliberate exception. Examples include:

- racially or culturally exclusionary settlements;
- guild or institutional compounds;
- religious sanctums;
- military or government areas;
- private estates/business spaces;
- criminal territories;
- dungeons or hazardous sites;
- locations requiring standing, membership, sponsorship, permits, passes, favors, quests, or specific knowledge of a route.

Where lore permits, coin, tolls, hired passage, permits, bribes, sponsorship, or services may provide alternate access paths. Those alternatives require explicit authored and runtime owners; they must not be inferred generically.

A quest may reveal or grant access to a restricted or previously unknown destination, but survey advancement itself must not become a generic travel-access owner and must retain its accepted `no_proposal` boundary.

## 11. Ashen Reef Recommendations - Not Yet Final Canon

The following are recommended defaults for the active authored-canon decision. They are recommendations to be explicitly accepted or revised, not assumptions for implementation.

1. Preserve `quest.ashen_reef_survey` as the accepted survey runtime compatibility key. Do **not** declare it the final authored quest-definition id.
2. Create a later unique authored definition under `quest_definition.<unique_slug>` for this specific contract. The unique slug may include a Starfall/Ashen/issuer qualifier if that makes this contract unambiguous, but no global composite-id grammar is required.
3. Treat `Survey of Ashen Reef` as an acceptable formal placeholder title for the current representative quest. The title may later be replaced with stronger narrative wording without changing stable identity.
4. Preserve the distinct Brineharbor reef-soundings charter as a separate quest. Similar function and target environment do not make two authored motivations the same quest.
5. Treat `location.ashen_reef` as the current compatibility travel key for the **Ashen Reef survey anchorage/approach associated with Starfall**, not as proof that Starfall Port and Ashen Reef are the same canonical place.
6. Keep broad Starfall/region access conceptually separate from access to the specific survey anchorage. A later location/travel refinement may split the settlement destination from the reef site/route without changing the current accepted survey owner until a migration/compatibility decision authorizes it.
7. For the first representative path, prefer a one-time initial authored survey contract rather than defining all future survey work as repeatable. Later recurring fishing, hunting, hydrographic, economic, ecological, religious, noble-event, or other surveys should reuse archetypes/templates or receive distinct authored definitions according to their issuer and consequences.
8. Prefer the quest-offer occurrence, rather than survey completion, as the earliest point that can legitimately convey the exact survey destination/route. Whether mere offer presentation grants travel admission or only recognition while a separate fare/charter/access occurrence admits travel remains an explicit Ashen decision.
9. Prefer a narrow authored quest-offer admission owner as described above for question 6. Existing quest acceptance must remain a consumer rather than silently becoming the offer creator.
10. Do not make a generic level or class requirement the reason this quest appears. Use the eventual issuer/task context to decide mandatory qualifications and separately expose suitability/danger.

## 12. Exact Ashen Inputs Still Required

Before the active authored-canon decision can safely return `AUTHORED_INPUT_ACCEPTED`, an authorized product decision still needs to select or approve:

1. the specific canonical authored quest-definition identity/slug for this representative contract, or explicit permission to retain a clearly marked provisional authored slug until a later narrative naming pass;
2. the canonical issuer and delivery surface for this particular quest, including whether the issuer is Starfall-local and what current/future entity authority should anchor it;
3. whether current Starfall Port / Starfall Isle association is accepted for the Ashen survey approach, revised, or only retained as compatibility runtime mapping;
4. whether `Survey of Ashen Reef` is accepted as the current player-facing placeholder title;
5. where the offer can ordinarily appear: local-only, multiple explicit settlements, an organization network, or another authored delivery mechanism;
6. the exact first availability trigger and any mandatory hard qualifications;
7. one-time/repeatable, persistence, expiry, decline, and re-offer posture for this specific contract;
8. whether offer presentation itself grants the exact `location.ashen_reef` travel row, quest acceptance grants it, or another explicit access/fare/charter interaction owns admission.

The journal-admission technical owner has a recommended architecture in this document and can be finalized in the later implementation-package decision once the authored occurrence is known.

## 13. Deferred Development Intents

Preserve these for later dedicated decisions; do not widen the active Ashen authored-canon run to implement them:

- quest-arc schema/content authority and branching series relationships;
- multi-origin quest offer contexts and distribution surfaces;
- quest/mission/order/favor typed semantics and consequences;
- relationship/service/access reward authority for favors;
- organization rank/progression missions and enforceable orders;
- contextual eligibility/suitability/risk model modernization, including review of `levelMin` and `classTagsAny`;
- dynamic world-condition offer triggers;
- canonical issuer references after people/NPC/office/institution/business/faction authorities are sufficiently mature;
- general travel-access policy, alternate access methods, toll/fare/pass/bribe/sponsorship behavior, and restricted-settlement policies;
- district/site/building/interior-granularity player location state;
- travel destinations referencing canonical sites/routes rather than compatibility keys;
- narrative quest-title/copy pass;
- recurring survey families and multiple independently motivated Ashen Reef quests;
- turn-in, rewards, currencies, standing, inventory, service unlocks, access vouchers, and other consequence execution.

## 14. Current Route Effect

This product direction narrows the active `Ashen Reef Survey Offer, Journal Admission, And Travel-Access Authored-Canon Decision`; it does not complete it.

The next Codex run should not spend time debating a global composite quest-id grammar or redesigning the complete location hierarchy. It should treat those questions as bounded by this document and request only the remaining exact Ashen-specific authored selections listed above.

Until those selections are explicit:

- keep `AUTHORED_INPUT_REQUIRED` as the fail-closed outcome;
- do not authorize `Version 0.6.11`;
- do not install an implementation prompt;
- do not rename accepted runtime survey identities;
- do not modify production/content/schema/test/save/UI/gameplay surfaces;
- keep `0.7.0` `NOT_READY`.
