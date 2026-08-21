# Open Design Questions Index

Source route: ChatGPT via GitHub Connector  
Date: 2026-08-20  
Status: connector-side durable question index; documentation only; not an implementation handoff

## Purpose

This index is the current user/product-decision surface for design questions that remain unresolved, intentionally deferred, or were superseded by later accepted authority.

It was rebaselined from the June 18, 2026 index by `Connector-Safe Pass 1 - Open Design Questions Rebaseline` after the repository advanced from the old Religion/hotspot pipeline into the `0.6.x` runtime-ownership transition.

This file is not:

- runtime authority;
- content JSON or schema authority;
- a backlog replacement;
- a current implementation handoff;
- permission to broaden a narrow Codex prompt;
- evidence that a deferred question must be answered before its named trigger exists.

When this index conflicts with a newer focused accepted decision, current Codex output/handoff, or user-authored product direction, use the newer/more specific authority and update this index in a later connector-safe pass.

## Current Pipeline Context

Current active implementation route:

`Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

Current posture:

- accepted parent `Version 0.6.10 - Ashen Reef Survey Advancement Authority` remains accepted through `0.6.10.5`;
- the Ashen implementation-package decision returned `PACKAGE_READY`;
- `0.6.11` owns the bounded ordinary Starfall creator -> offer -> acceptance/access -> travel -> four-shift survey -> restart representative path;
- `0.6.11` must be followed by an independent `0.6.11.1` acceptance audit;
- `0.7.0` remains `NOT_READY`;
- **no question in this index is required before `0.6.11` executes**;
- this connector-side index must not replace, revise, or interrupt `docs/dev/current-codex-prompt.md`.

## Rebaseline Metrics

Baseline on 2026-08-20:

- source index date: 2026-06-18;
- obsolete pipeline pointer: `0.5.179` Religion/hotspot Knowledge subject work;
- pre-existing question rows audited: **70**;
- `OPEN_SOON`: **0**;
- `OPEN_LATER`: **3**;
- `OPEN_STRATEGIC`: **5**;
- `DEFERRED_WITH_TRIGGER`: **45**;
- `RESOLVED`: **11**;
- `SUPERSEDED`: **6**;
- new post-June deferred questions added: **3**;
- questions required before current `0.6.11`: **0**.

The point of these counts is not to score design completion. They distinguish real user decisions from questions whose owner or implementation lane does not yet exist.

## Disposition Legend

| Disposition | Meaning |
| --- | --- |
| `OPEN_SOON` | A product decision likely to block the current or immediately following accepted route. |
| `OPEN_LATER` | A valid product choice that can be answered now but is not currently blocking. |
| `OPEN_STRATEGIC` | Broad product direction that should be settled before a major future system/vertical-slice commitment. |
| `DEFERRED_WITH_TRIGGER` | Intentionally postponed until the named authority/consumer/system lane exists. Do not ask merely to fill a blank. |
| `RESOLVED` | Later accepted user/product or focused repository authority answers the question at the design level. |
| `SUPERSEDED` | The question's premise or sequencing assumption was replaced by later implementation/authority; use the newer formulation instead. |

## Open Soon

**None.**

No unresolved product/design question in this index blocks the installed `0.6.11` implementation prompt.

## Open Later

| Question | Current posture | Disposition |
| --- | --- | --- |
| Should religion-owned `religious_order.*` identities become direct Knowledge subjects, or remain learnable only through religion/institution/place context? | Religious orders remain owned by `world.religions`; the later organization boundary explicitly rejects moving them into a generic organization collection. Direct Knowledge-subject support remains a separate presentation/evidence choice. | `OPEN_LATER` |
| What final player-facing label should be used for exact `100` elemental favorability: `Consecrated`, `Fanatical`, or an order-specific label? | Shared bands are accepted; the exact final display label remains intentionally unsettled. | `OPEN_LATER` |
| Which basic ordinary-work quests should be authored first when the next ordinary-work content lane is selected? | Sewer cleaning, pest control, patrols, and similar grounded work remain examples, not an approved seed list. | `OPEN_LATER` |

## Open Strategic

| Question | Current posture | Disposition |
| --- | --- | --- |
| What should the first builder-adjacent playable slice be: bushcraft only, camp utility, survival shelter, or another deliberately small scope? | Substantial building is explicitly not early; bushcraft is the allowed early edge, but the first builder slice is still a product choice. | `OPEN_STRATEGIC` |
| How should the Hardcore toggle modify each difficulty mode? | The toggle and difficulty modes exist as accepted direction; exact mechanical effects remain unsettled. | `OPEN_STRATEGIC` |
| How should Prestige gain scale inversely with selected difficulty? | The inverse relationship is accepted; exact formula/caps are not. | `OPEN_STRATEGIC` |
| When a generated NPC becomes persistent, should its placeholder-derived traits freeze, be promoted into a fuller profile, or be selectively regenerated? | Disposable-until-promoted NPC posture is accepted; promotion profile semantics remain unresolved. | `OPEN_STRATEGIC` |
| Beyond storage location, which facts should force item-stack separation: condition, ownership, quality, provenance, or another identity boundary? | Weight/bulk and container location are accepted; additional stack identity semantics require a future inventory owner decision. | `OPEN_STRATEGIC` |

## Deferred With Trigger - Religion And Relationships

Trigger: reopen only when a concrete Religion/favorability/pilgrimage runtime or content consumer is selected.

| Question | Current posture | Disposition |
| --- | --- | --- |
| What exact rare triggers qualify each future elemental confluence sacred site? | The general two-or-more elemental authorities plus rare-trigger rule is accepted. A trigger catalog should be authored only when a confluence candidate exists. | `DEFERRED_WITH_TRIGGER` |
| What exact data fields, validation, and outcome boundary should the first pilgrimage mechanic use? | Pilgrimage remains the selected first sacred-site mechanic; runtime contract waits for a pilgrimage lane. | `DEFERRED_WITH_TRIGGER` |
| Should auspicious environment/weather concepts be religion-context records, ecology facts, event tags, hotspot modifiers, or typed links among those owners? | The environments/events are accepted lore concepts; ownership needs a named consumer. | `DEFERRED_WITH_TRIGGER` |
| How many days should relationship gains take to harden against ordinary decay? | Mixed band/checkpoint hardening is accepted; exact duration waits for mutable relationship decay authority. | `DEFERRED_WITH_TRIGGER` |
| Which relationship violations may bypass hardened checkpoints? | Serious direct betrayal/violation can bypass protection; exact taxonomy waits for relationship/law/religion consumers. | `DEFERRED_WITH_TRIGGER` |
| What positive mechanics, if any, should strong adversarial elemental relationships grant? | Potential benefits are accepted as possible; exact combat/favor mechanics wait for elemental favorability runtime. | `DEFERRED_WITH_TRIGGER` |

## Deferred With Trigger - Organizations, Law, And Quest Generation

Trigger: reopen only when the named identity/link/runtime authority becomes an active consumer.

| Question | Current posture | Disposition |
| --- | --- | --- |
| How should outsourced law enforcement be represented between a competent authority, jurisdiction, and an enforcing religious/guild/faction/public-order body? | Later authority separates government, jurisdiction, office/institution, and force/public-order identity. Exact delegation/link semantics remain deferred. | `DEFERRED_WITH_TRIGGER` |
| How should notoriety trigger higher-authority patrols, investigations, or escalation? | This is runtime public-order/enforcement behavior and waits for stable force/jurisdiction/law owners. | `DEFERRED_WITH_TRIGGER` |
| Which world-condition inputs should first drive generated/dynamic quest offers: monsters, crime, climate, economy, trade routes, civic pressure, or events? | Contextual offer triggers are accepted product direction; no generic dynamic-offer owner is currently authorized. | `DEFERRED_WITH_TRIGGER` |

## Deferred With Trigger - Travel, Map, And Discovery

Trigger: reopen when fast travel, grid travel, caravan simulation, merchant auto-travel, or a broader discovery/map-state owner is explicitly selected.

| Question | Current posture | Disposition |
| --- | --- | --- |
| What eventual success/risk model should gate fast travel, including whether the old `95%` suggestion and `1%` Prestige reductions survive? | Historical suggestion only; current engine-owned travel does not establish this future fast-travel rule. | `DEFERRED_WITH_TRIGGER` |
| Which player grid-travel actions should be first: hunting, scouting, sneaking, mounted movement, climbing, swimming, or a smaller subset? | Wait for a grid-travel action lane. | `DEFERRED_WITH_TRIGGER` |
| Should caravan travel use trial/minigame events before or alongside regular player grid travel? | Wait for caravan runtime ownership. | `DEFERRED_WITH_TRIGGER` |
| Should merchant auto-trade use the same risk/event resolver as player-present travel with automated resolution? | Plausible shared-model direction; needs economy/caravan/runtime owners. | `DEFERRED_WITH_TRIGGER` |

## Deferred With Trigger - Family, Heirs, And Maturation

Trigger: reopen only when family lifecycle/heir/maturation runtime ownership is selected.

| Question | Current posture | Disposition |
| --- | --- | --- |
| What exact adult ages should each race/culture use? | Data-driven race/culture variation is accepted; values require authored maturation content. | `DEFERRED_WITH_TRIGGER` |
| Should offspring stat growth apply semi-annually, quarterly, monthly, or another cadence? | Smaller increments are accepted; cadence should follow the eventual maturation owner's accuracy/cost. | `DEFERRED_WITH_TRIGGER` |
| Should quarter-by-quarter offspring status be the default unless day-by-day proves simpler? | Quarterly is historical preference, not implementation authority. | `DEFERRED_WITH_TRIGGER` |
| What RNG weighting range should both-parent stat inheritance use? | Parent-weighted inheritance is accepted; range is balance/runtime work. | `DEFERRED_WITH_TRIGGER` |
| How should chronic illness alter maturation/stat growth? | Chronic-status interaction waits for health/maturation integration. | `DEFERRED_WITH_TRIGGER` |
| Should original character creation retain build choice, or should some build selection move to heirs/Prestige? | Product option remains intentionally unselected until heir/creator integration is revisited. | `DEFERRED_WITH_TRIGGER` |
| What exact Prestige penalty reductions should apply to illegitimate/adopted-heir growth? | Direction accepted; balance waits for heir runtime. | `DEFERRED_WITH_TRIGGER` |
| What exact end-of-line/adopted-heir workflow follows when no adult caretaker exists? | Caretaker priority and end-of-line posture are accepted; command/state flow waits for family lifecycle. | `DEFERRED_WITH_TRIGGER` |
| What heir-slot rule determines whether an adult married-out offspring creates a new family? | Wait for heir-slot/family lifecycle authority. | `DEFERRED_WITH_TRIGGER` |

## Deferred With Trigger - Offspring Growth Roles And Rearing Prestige

Trigger: reopen only when maturation/rearing Prestige becomes an active system lane.

| Question | Current posture | Disposition |
| --- | --- | --- |
| Should growth roles apply semi-annually, quarterly, monthly, or another cadence? | Use the cadence the eventual owner can track accurately. | `DEFERRED_WITH_TRIGGER` |
| What are the first growth-focus categories and their mapping to character stat profiles? | Candidate roles exist in planning; exact live set is unauthored. | `DEFERRED_WITH_TRIGGER` |
| How should zero-sum growth-focus reallocations be calculated? | Zero-sum default is accepted; formula waits for maturation math. | `DEFERRED_WITH_TRIGGER` |
| Does the `.05` Prestige improvement affect focus variance, total role effect, or both? | Exact interpretation waits for the rearing Prestige contract. | `DEFERRED_WITH_TRIGGER` |
| What minimum time/day and days/week define habitual activity? | Needs a maturation evidence owner. | `DEFERRED_WITH_TRIGGER` |
| How should separate family-specific rearing Prestige tracks divide total-growth and role-efficiency upgrades? | Separate-track direction is accepted; track structure waits for Prestige/family runtime. | `DEFERRED_WITH_TRIGGER` |
| If 100 incremental upgrades remain desirable, should major benchmarks be 25/50/75/100 or 33/66/100? | Balance/UI decision waits for the actual upgrade track. | `DEFERRED_WITH_TRIGGER` |
| Exactly when should percentile upgrades unlock relative to flat upgrades? | Direction says after the first flat tier; exact tier waits for the live track. | `DEFERRED_WITH_TRIGGER` |

## Deferred With Trigger - Recipes, Crafting, Cooking, And Bulk Preparation

Trigger: reopen when recipe learning/quality, bulk crafting, or family recipe inheritance becomes an active runtime owner.

| Question | Current posture | Disposition |
| --- | --- | --- |
| Should recipe-learning trials be required for all recipes or only non-trivial recipes? | Current planning discourages burdening trivial actions but does not yet establish the final learning contract. | `DEFERRED_WITH_TRIGGER` |
| What final quality labels should cooking use versus crafting? | A provisional poor/standard/good/fine/excellent/masterwork ladder exists; domain/culture presentation remains unsettled. | `DEFERRED_WITH_TRIGGER` |
| Should food and crafting share one quality vocabulary or diverge by domain/culture? | Wait for quality owner/UI contract. | `DEFERRED_WITH_TRIGGER` |
| Should bulk preparation be account-wide, family-specific, guild-specific, or split by recipe/craft type? | Wait for bulk-preparation ownership and progression authority. | `DEFERRED_WITH_TRIGGER` |
| Who can view/use family recipes: all family members, household members, apprentices, or explicit access-right holders? | Family-scoped rather than account-wide is accepted; exact entitlement waits for family/recipe links. | `DEFERRED_WITH_TRIGGER` |
| Should a married-out heir keep personally learned family recipes by default? | Planning permits personally learned recipes to remain; exceptions/transfer rules wait for family lifecycle. | `DEFERRED_WITH_TRIGGER` |
| Should recipe inheritance preserve one/multiple recipes, quality flags, or access rights? | Wait for inheritance/Prestige owner. | `DEFERRED_WITH_TRIGGER` |
| Should crafting trials apply to every craft or only meaningful/high-risk/high-value work? | Planning favors meaningful work; exact runtime threshold waits for crafting execution authority. | `DEFERRED_WITH_TRIGGER` |

## Deferred With Trigger - Ecology, Agriculture, And Managed Breeding

Trigger: reopen only when macro ecology or managed estate/workplace production becomes an active runtime lane.

| Question | Current posture | Disposition |
| --- | --- | --- |
| Should macro flora/fauna use exact counts, abundance bands, or hidden estimates? | Static ecology exists, but mutable population representation remains unauthored. | `DEFERRED_WITH_TRIGGER` |
| Should agriculture use exact counts, abundance bands, or hidden estimates? | Wait for agriculture/production runtime. | `DEFERRED_WITH_TRIGGER` |
| Which managed ecology lane should come first: livestock, crops/gardens, alchemy herbs, or another domain? | Micro breeding explicitly waits for estate/workplace/ownership/storage/economy seams. | `DEFERRED_WITH_TRIGGER` |
| Should managed breeding support genetic/quality traits? | Only if a future breeding design explicitly owns them. | `DEFERRED_WITH_TRIGGER` |

## Deferred With Trigger - Magic Runtime And Catalysts

Trigger: reopen when effect-bearing magic execution or magic-law integration becomes an active runtime lane.

| Question | Current posture | Disposition |
| --- | --- | --- |
| Which spell should be the first effectful runtime candidate? | Static/study magic authority does not itself choose the first full effect-bearing runtime spell. | `DEFERRED_WITH_TRIGGER` |
| Should catalysts be reserved, consumed, or paid only after successful resolution? | Requires an atomic magic-execution/inventory contract. | `DEFERRED_WITH_TRIGGER` |
| Should future magic crime/licensing belong to law, faction/religion, a magic authority, or typed links among them? | Wait for jurisdiction/law plus effectful magic owners. | `DEFERRED_WITH_TRIGGER` |

## Resolved And Superseded Disposition Register

These pre-existing rows are retained here so their disappearance from the open sections is auditable.

| Original question | Disposition | Current answer / controlling direction |
| --- | --- | --- |
| Which religion/element/doctrine Knowledge concepts should be seeded next after the hotspot lane? | `SUPERSEDED` | The old hotspot sequence completed through later Religion, religious-hotspot, sacred-site, and Knowledge authority work. Future Religion content should be selected from a fresh gap/consumer, not this June sequencing question. |
| Which NPC or institution types can reveal relationship bands through trials or mystical means? | `RESOLVED` | Accepted June user direction permits in-world revelation through an affiliated trial-giver, institution/civil representative, fortune-teller/occult/fantasy role, or equivalent owner-approved source. Exact NPC identities remain later content. |
| Should exact relationship values ever be player-visible outside debug? | `RESOLVED` | Exact values are debug/internal by default; ordinary player presentation uses bands/in-world feedback unless a later focused UI decision explicitly changes that. |
| What is the first playable runtime loop after the Knowledge/content lane? | `RESOLVED` | The repository advanced through engine-owned travel, quest acceptance/tracking, activity ownership, campaign persistence, and Ashen survey advancement. The current representative-loop closure route is `0.6.11`. |
| Which UI surface is required before that first narrow runtime loop? | `SUPERSEDED` | The live six-domain shell exists and later `UI Information Architecture Boundary` governs future presentation. Runtime ownership advanced without a new prerequisite UI surface. |
| Should factions, guilds, institutions, governments, and religious orders use one shared organization schema or separate families? | `RESOLVED` | `Organization Faction Guild Boundary Decision` rejects a general organization umbrella in the foundation phase and preserves specific owners (guild, religion/order, polity, faction, later government/office/etc.). |
| Should law authority be location-owned, government-owned, enforcement-owned, or layered? | `RESOLVED` | Later civic authority separates government organization, jurisdiction applicability, law, office/institution, and force/enforcement. Law is downstream of stable jurisdiction rather than embedded in place/government/force identity. Exact law schema remains deferred. |
| Should quests use one hybrid authority or separate work-order/contract/event/authored authorities? | `RESOLVED` | Current quest direction uses unique authored definitions plus reusable archetypes/templates, future arcs as separate grouping authority, and later typed quest/mission/order/favor semantics. No monolithic display-title/ID grammar is required. |
| What map/grid overhaul is required before serious travel planning? | `SUPERSEDED` | Engine-owned player travel was implemented in `0.6.0` and is accepted. Future map/grid cleanup is now an independent improvement lane, not a prerequisite that can retroactively block travel. |
| What should map/grid cleanup/projection include as the first travel-adjacent pass? | `SUPERSEDED` | The historical sequencing premise no longer controls; specific world/hex/travel/discovery owners now govern future cleanup. |
| What qualifies a point of interest for registration? | `RESOLVED` | `Discovery And POI Boundary Decision` rejects a generic static POI authority. POI is a presentation concept over valid specific owner records plus runtime/player-known state. |
| What evidence can reveal a POI: word of mouth, maps, scrolls, pictures, history, direct visit, or all? | `RESOLVED` | All are permitted authored/evidence routes in product direction; the later boundary keeps the resulting known/discovered/visited/revealed state in runtime/save owners rather than static POI content. |
| Should ruins, lairs, dungeons, sacred sites, shrines, and event locations share one POI authority? | `RESOLVED` | No. Specific place/site/feature families own identity; a generic `world.pois` collection remains rejected unless a later non-duplicative role is proven. |
| Should the first gameplay shell present read-only state only? | `SUPERSEDED` | Presentation-before-mutation remains a design principle, but the live shell already consumes accepted engine-owned mutating commands. Read-only-only is no longer the shell posture. |
| Which UI surface is required before the first narrow runtime loop? (duplicate UI section row) | `SUPERSEDED` | Same disposition as above: current shell plus owner-specific UI boundary is established. |
| Should Knowledge, quest, map, reputation, and relationship journals share a common record-browser UI? | `RESOLVED` | Later UI authority approves a common linked-record/search presentation shell while explicitly forbidding a common canonical data owner. |
| Which NPC types can reveal relationship bands? (duplicate UI section row) | `RESOLVED` | Same accepted in-world revelation posture as the relationship row above. |

## New Post-June Deferred Questions

These were exposed by accepted work after the original June index. They are deliberately not blockers for `0.6.11`.

| Question | Trigger | Disposition |
| --- | --- | --- |
| What compatibility-safe migration/alias policy should eventually retire misleading runtime travel keys whose names no longer match canonical settlement/place identity? | Reopen after `0.6.11` and its audit are accepted, when a dedicated generic travel-identity cleanup is prioritized. Do not rename current keys opportunistically. | `DEFERRED_WITH_TRIGGER` |
| What exact typed semantics and refusal/consequence rules should distinguish Quest, Mission, Order, Favor, and Trial when organization/law/rank owners are mature enough to consume them? | Reopen with a dedicated quest-kind/assignment-semantics decision. | `DEFERRED_WITH_TRIGGER` |
| What exact payout, standing, item, salvage, service, or access consequences should `Soundings of Ashen Reef` award on accepted turn-in? | Reopen only when Ashen quest turn-in/reward authority is selected after ordinary reachability is independently accepted. Current canon establishes a paid civic contract but intentionally defers exact values. | `DEFERRED_WITH_TRIGGER` |

## Durable Resolved User Direction

The detailed June 17 and June 18 decisions remain preserved in:

- `docs/design/user-design-decisions-2026-06-17.md`;
- `docs/design/user-design-decisions-2026-06-18.md`.

Later specific authorities refine those decisions without erasing them. Important durable examples include:

- local single-player first; multiplayer deferred;
- separate-world character starts with later continuity options;
- classless development where supported;
- specific institutional owners rather than an indiscriminate organization bucket;
- survival bands/status effects;
- weight plus bulk/container inventory;
- generated NPCs disposable until promoted by meaningful world relationships/events;
- data-driven race/culture maturation;
- parent-weighted offspring development;
- ordinary grounded quests alongside larger authored content;
- specific place owners plus player-known/discovery state rather than a generic POI authority;
- relationship categories/bands and in-world revelation rather than routine exact-number presentation.

## Authority References Used By This Rebaseline

At minimum, this pass reconciled the index against:

- `AGENTS.md`;
- `docs/design/user-design-decisions-2026-06-17.md`;
- `docs/design/user-design-decisions-2026-06-18.md`;
- `docs/design/future-system-design-ledger.md`;
- `docs/design/organization-faction-guild-boundary-decision.md`;
- `docs/design/government-jurisdiction-authority-boundary-decision.md`;
- `docs/design/discovery-poi-boundary-decision.md`;
- `docs/design/ui-information-architecture-boundary.md`;
- `docs/design/quest-identity-offer-context-and-travel-access-product-direction.md`;
- `docs/design/offspring-growth-recipes-ecology-engine-plan.md`;
- `docs/dev/project-roadmap.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`.

## Maintenance Rule

Do not add a question here merely because a schema could contain another field. Add or reopen a question when:

1. a concrete future consumer exists;
2. repository authority cannot decide a material product choice safely;
3. the answer would change scope, behavior, canon, UX, balance, or ownership; and
4. the question is specific enough for the user to make a meaningful decision.

When an owner does not yet exist, prefer `DEFERRED_WITH_TRIGGER` over repeatedly asking speculative questions.
