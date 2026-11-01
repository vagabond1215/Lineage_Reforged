# Seeded Religious Influence, Persistent Shared World, Multi-Character Integrity and Parallel Quest Arcs

Date: 2026-10-29 (America/New_York)
Source: user religion/plot/world-economy follow-up, with source inspection of selected `master` `a596112acf3945f2bf7c625e943f2511d12aa710`.
Status: **provisional user-directed design intent, documentation-only, no executable implementation or new authored religion canon**. Companion to the religion PR #46 direction and plot-seed addendum. **This later clarification controls where the earlier draft appeared to imply fixed religious influence or a strictly one-character/one-lineage campaign.** Not a change to campaign-rules or quest authority.

## 1. New product decisions from user direction

| Topic | User direction now | Questions remaining |
| --- | --- | --- |
| Religious empire/order influence | Each seed chooses each institution's influence/notoriety from ordered classes such as `none`, `hidden`, `minor`, `moderate`, `major`, `mythical` | Whether hidden is a visibility attribute rather than an influence magnitude; scopes and quantitative definitions |
| Orders' names | Draw campaign-appropriate display names from an element/confluence-specific **bank of names** | Reuse/collision/language/history policies; stable canonical identity must not be replaced by display label |
| Relationships | Order alliances, conflicts and interdependencies differ by seed and relative influence | Valid relationship grammar, initial causality, degree of independence from base canon |
| Continuity | A story seed and the history of an existing lineage may be visible/durable to other characters **in the appropriate chronological period** | How to assign shared world timeline, historical retrospective play, simultaneity and knowledge |
| Prestige-gated play | After an appropriate Prestige unlock, players may select a multi-character shared-world / open-world / sandbox-oriented mode, with multiple independently playable characters | Exact mode name, eligibility, grandfathering, joining, migration and scope |
| World changes | Multiple characters controlled by the same player can affect the **same persistent world** | Time progression, non-active character consequences, multi-character concurrency |
| Anti-exploit | Controlled characters must not directly trade or cooperate to bypass economy rules; merchant/trader guild intermediaries and realistic local supply-demand bands proposed | Strict transfers, proxy-beneficiary tracing, market matching, licenses/sanctions, edge cases |
| Trading | A player merchant character may perform real licensed commercial activity, subject to realistic price ranges and possible license revocation, fines or sanctions | Law owner, limits, enforcement scope, player choice, how to avoid gaming guild clearing |
| Quest architecture | **Multiple coexisting questlines; no single universal main questline.** Global/international/regional politics, international/religious/order plots etc. grow from seed-established actors and hierarchies | Quest scope, overlapping outcomes, pacing, failure and who can discover/complete arcs |

These are **world-product directions** rather than current implementation claims, and the example category labels are candidate vocabulary, not approved numerical progression formulas.

## 2. Influence, notoriety, secrecy and name selection

Keep **intrinsic element/confluence identity constant** while allowing an institution's position in a particular campaign to vary. An initial profile may combine influence scale, geographic reach, public recognition, visible legitimacy, hidden patronage, resources, followers, and political leverage. These are conceptually distinct: a `hidden` organization could be tremendously powerful, and a `mythical` public reputation could belong to a depleted or fabricated institution. Hence the user's example six-value ladder is useful UX vocabulary **but should not silently become one universal scalar**. Candidate design separation:

- **Influence magnitude** (provisional): absent/none, marginal/minor, moderate, major, overwhelming/legendary. Whether `none` means no active organization, no known following, or no influence still needs a decision.
- **Public notoriety**: forgotten, rumor, recognized, renowned, legendary/mythic. The exact bands are unapproved.
- **Visibility**: public, concealed, disputed, disguised through a legitimate proxy; perception differs by observer.
- **Effective geographic scope**: local settlement, region, nation/kingdom, continent, international; scope cannot be inferred from a tier alone.
- **Present status**: active, dormant, suppressed, annexed, dissolved, extinct, or apparently extinct; source must distinguish claim vs actual event.
- **Institution name**: select from appropriate authored/validated bank of religious names associated with canonical constituent elements/confluence, culture, language and historic identity, while retaining an underlying stable reference identity for actual owner relations.

These are **recommendations to clarify the design**, not acceptance of an entire new schema. The name bank can change the public title or cultural alias across seeds without changing Fire into another intrinsic element or silently overwriting current `religious_order.*` ids. Seed-selected relations must be coherent with relative institutional influence and an authored reason, not raw conflicting random values. World history may justify asymmetry, alliance, subordination, hidden control, an extinct tradition's remnants or restoration. No preselected order must be dominant or secretly control the Adventurers Guild.

## 3. Proposed play-mode naming and separation from existing campaign rules

Recommended **player-facing working names**:
- **Standalone Campaign**: one separately grounded playable character or lineage and its own continuity. Does not imply a mandatory linear main quest.
- **Living World**: Prestige-unlocked **linked-character world continuity**, in which several separately legitimate player characters can be activated over time and affect one common, evolving world.
- Product capability label (internal proposal): **Shared World Continuity**. A world can be shared across the user's characters without assuming multiplayer or cross-account trading.

Avoid **Story Mode**, which is already an accepted difficulty preset; **Hardcore**, which historically conflates world difficulty and death rules; and bare **Campaign**, which currently names the general saved campaign identity. `Open World` implies geography/exploration and `Sandbox` understates persistent causality and parallel arcs. **Living World** is recommended but is not user-accepted.

This prospective **play structure/continuity choice** should be independent of the existing accepted Difficulty (Story/Favored/Mortal/Forsaken), World Rules (Heroic/Grim), and Stakes (currently accepted Normal; future Ironbound gates) axes. Actual legality of combining multiple active characters, cross-character saving or any later restricted Stakes policy is **not yet decided** and must not be inferred. Prestige is a permission to access a future play structure, not an authorization to mint descendants, transfer wealth, change campaign rules mid-save, or fabricate a family.

A character's original ancestry, biological/adoptive family relationships and eligible-heir status remain governed by the family/Prestige owners. Two independently created characters in a Living World are **not automatically siblings, heirs or members of the same lineage** just because the account controls them or they share a seed.

## 4. World timeline versus personal chronology

One shared world must have a coherent event history and chronology. A character alive in year Y should not automatically witness an event from a later year, and a newly created character should not be placed into an incompatible history without explicit era eligibility.

**Proposed separation**:
- **World continuity and world clock**: accepted shared facts, versioned plot seed and its now-established changes, institutions, events, legal/economic states and current time.
- **Independent character careers**: location, skills, wealth, inventory, quests, personal knowledge, injuries and milestones remain individually owned.
- **Lineage/household histories**: actual family and eligible heir links, retained family records, Prestige, Chronicle and historic outcomes; not copies of unrelated characters' personal progress.
- **Personal discovery**: only what each character may legitimately know at the time and in their situation. A player's out-of-character memory is not evidence that a new character has discovered the same hidden institution.
- **Event occurrence ledger**: authoritative accepted actions and causal changes that persist across character switches, descendants, historic lookup and all affected quest arcs.

**World-time recommendation:** choose one authoritative, monotonically progressing world chronology for a linked world. Switching controlled characters should not secretly rewind the whole world or independently fork it. What a non-active character may do or suffer while not selected is unresolved. A historical retrospect/replay with mutation would need a separate, strongly gated system; an heir's later era cannot alter an earlier event by editing archived narrative.

**Anti-rollback requirement:** a historical save of Character A must not reverse Character B's already accepted world effects, market payments, political events or world state. Normal Stakes save choice and especially future Ironbound restricted continuity require explicit owner integration. The current selected native v3 per-campaign artifact/recovery architecture is **not** a live shared-world authority.

## 5. Same-account multi-character trading and anti-cheat integrity

The user's exploit example: a farm/rabbit producer under one controlled character makes uneconomic underpriced sales to a restaurant/slaughterhouse under another controlled character, transferring effective wealth or value at artificially favorable terms. The user wants merchant/guild intermediation, price bands and potentially sanctions, **not** unconstrained player-to-player barter.

**Recommendation: brokered/cleared market, not merely a merchant role or a human price cap.**

A robust future approach may require:
1. **No direct benefit transfer** among characters controlled by the same account/beneficial owner, including gifts, barter, discounted sale, contracts, private delivery, family/shared containers, indirect subsidy, wage manipulation and laundering through a controlled intermediary. Exceptions for legitimate family inheritance require their own narrow owner rules.
2. **Independent market execution**: producer sells to the market/guild-owned pool at a local market-derived clearing price; buyer purchases separately from independent available market stock at a legitimate retail/wholesale quote. The seller cannot designate the buyer or ensure that their own alternate character receives their exact inventory at a chosen price.
3. **Real economic constraints**: price bands, quality/condition, location, quantity, demand, stock, transport, taxes, storage, perishability, spread, guild fees and timing arise from real economy sources; a band is not a universal fixed price. A market must not mint currency, guarantee demand or absorb unlimited loss-making production.
4. **Licensing and affiliation**: a player trader may be a licensed market intermediary with earned fees and obligations. Licensed trader/merchant accounts must obey guild rules and independent market clearing. They cannot serve as a self-dealing bypass just because the role is different.
5. **Prevention first, then consequences**: invalid cross-controlled/related-beneficiary transactions should be rejected before moving item/currency ownership. In-world audits, revoked charters, fines and sanctions can enrich later gameplay when guild/law systems exist, but **do not rely on fines alone** after an exploitable transfer has already succeeded. Sanction authority needs properly authored guild/law/standing mechanisms.
6. **Causal stock and financial conservation**: items/currency cannot be duplicated or resurrected through character switches, saves, delayed deliveries, buyer/seller retries or rejected trades. Every executed exchange needs inventory, currency, merchant, market, tax, and audit provenance.
7. **Market manipulation**: a controlled merchant should not be able to force the same-account restaurant to buy their own discounted goods by creating a shell company, coordinated bid or manufactured shortage, even if individual quotes stay inside the nominal band.

This anti-exploit design is **a future independent Economy + Account + Guild + Save consumer**, not implemented here. The existing `guild.merchant_guild` already describes bulk exchange, credit, warehousing, arbitration and dues as authored identity. Existing market value/economy rules and projections provide planning inputs, **not** transactional matching, sanctions or current trading UI. Do not edit the guild's current authoring, create a market-clearing engine, impose executable price laws or expand PR #40's tools/stations lane here.

**Important decision:** Is the rule restricted to characters under one account, one beneficial controller or all player-controlled businesses that share a world? Anti-collusion and actual multiplayer are distinct later gates.

## 6. Multi-arc, no-singular-main-quest story architecture

There is **no single compulsory main questline**. A seed may produce several meaningful, causally connected or independent arcs, for example:
- international politics or competing regional polities;
- religious international order power, local or regional sect conflict, confluence discoveries and schism/restoration;
- commercial guild/economic disputes and supply chains;
- local relationships, culture, knowledge and personal or lineage stories.

Arcs arise from **source-valid institutions and seeded historical conditions**. The existence and current power of a major order determine whether it can plausibly issue a continent-scale plot; a minor local sect should not command nonexistent worldwide forces. One event may affect multiple arcs: a temple annexation could alter religious relations, regional politics, merchant credit, legal access and an heir's future opportunity. Actual event owners certify which consequences occur, and future quest arc grouping must not own world mutation.

**Quest identity posture**: preserve currently accepted distinct quest definitions, archetypes, procedural templates, future quest-arc grouping and per-character offer/active state; authorship is not completed history. A campaign/seed can decide which arcs exist and when opportunities arise, while character progress and objective evidence remain separate. A shared world event may close/reopen eligibility for several characters but must not automatically copy a quest's completion reward across them. Arc endings may fail, remain unresolved, or transform across generations without reseeding.

One large arc can have global stakes, but should not be privileged as a universal main story. The player should be able to pursue modest local goals while consequential events unfold elsewhere, subject to bounded simulation budgets and actual visibility.

## 7. Concrete distinctions and unclosed user decisions

Already settled by user direction:
- Influence/notoriety and names vary by seed rather than one fixed present-day religious hierarchy.
- Relationships respond to seed choices and each order's relative influence.
- Worlds and existing lineage history should remain relevant/visible to another appropriately timed player character.
- Prestige unlock can grant optional linked multi-character world play.
- Character choices can affect the world; direct alternate-character value transfer should be prevented.
- Licensed guild intermediaries with realistic price constraints are desired in future commerce.
- No compulsory single main questline; multiple scales and domains of plot coexist.

Open decisions that cannot be silently finalized:
1. Is an influence tier a public reputation, genuine power, geographic reach, or a combination? Can hidden be a separate axis?
2. Does the selected name represent one permanent underlying named order, a seed-selected alternate local title, or a whole new organization identity?
3. Are a world's plot seed and initial world year tied to each new independent campaign or a separate selectable persistent world?
4. At what point can a standalone campaign be upgraded into Living World, and may it preserve existing saves?
5. How many independent characters and family lines may join one world; are unrelated creations allowed? Is this single-account only or eventually multiplayer?
6. When switching characters, does world time advance only through accepted active actions, through a turn schedule, or in real time? What happens to inactive characters and their property?
7. Can a younger character be selected before an older character's retirement if their lives overlap, and can switching permit actions in conflicting chronological order?
8. How much shared world knowledge is automatically available to a new character; how much personal information remains private?
9. Can characters on the same account ever exchange anything deliberately, such as family bequests, employer wages, quest assistance or market trades, after owner-approved safeguards?
10. Should merchant-guild intermediation be mandatory for **all** categories or specifically high-risk inter-character transactions? What about ordinary NPC shops and direct bartering between unrelated players?
11. What counts as fair, lawful pricing in an emergent market? Is price band mandatory, guild-wide, localized or supply/demand adaptive?
12. How should legitimate merchant profit, entrepreneurship and stock risk coexist with bans on related-party self-dealing?
13. Should guild sanctions be purely enforced preconditions, world-crime consequences, or both, and which authority can actually suspend a merchant license?
14. Are different story arcs allowed to compete for unique historical outcomes, or should all arcs always remain completable independently?
15. Which arcs continue to evolve when nobody pursues them, and how does a seed avoid overwhelming background churn?
16. Can a later heir inherit a political/religious arc's consequences without inheriting completion, secrets or rewards?
17. Is the optional Prestige upgrade account-wide permission, per-world unlock, or family-specific privilege?
18. What restrictions apply to higher Stakes/committed save modes in multi-character worlds?

## 8. Future named consumer gates and proposed acceptance cases

Consumer dependencies, **not tasks to run now**: world/plot seed owner + persistent world timeline owner; account/character and Save publication owner; character/family eligibility and Stakes owner; quest/event/Chronicle owner; guild/market/currency/item owner; law/sanction owner; knowledge/spoiler projection and narrative owner.

Candidate future acceptance checks, not executed:
- SW-01: same validated canon, two seeds, different religious influence, no renamed intrinsic elements;
- SW-02: hidden powerful order stays unknown to an unqualified character;
- SW-03: joining an existing world cannot rewrite a lineage's prior accepted event;
- SW-04: two controlled characters' accepted world changes remain after switching;
- SW-05: switching cannot replay historical reward or undo another character's accepted market sale;
- SW-06: invalid same-controller underpriced direct transfer is rejected before inventory/currency mutation;
- SW-07: intermediary controlled merchant cannot redirect discounted farm produce to own restaurant;
- SW-08: market bid/ask quotes reflect real stock, origin, condition, fees and range from actual economy owner;
- SW-09: sanctioned trader action uses an actual licensing/law owner, not story text as enforcement;
- SW-10: character B does not automatically inherit A's personal quest payout, secrets or spell ownership;
- SW-11: two regional/international arcs can coexist; one may fail without completing another;
- SW-12: different plot-seed name aliases resolve to supported owner identities and avoid collisions;
- SW-13: character at earlier date cannot access future public history from its world lineage;
- SW-14: higher-Stakes mode cannot use alternate-character saves to reverse committed consequences.

This is **documentation-only**. It is not a test implementation and does not assert any test passed.

## 9. References, branch hold, and prohibitions

Relevant controlling references:
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`: three independent campaign axes and Story difficulty; no new fourth axis implementation by this doc.
- `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`: Heroic/Grim world and Stakes remain distinct.
- `docs/design/ordinary-campaign-publication-capacity-and-retention-contract-decision.md`: save artifact/head and higher-capacity retention commitments; no shared-world transactional storage currently established.
- `docs/design/offspring-heir-family-continuity-owner-plan.md`: heir and family relationships require actual evidence and proper unlocks.
- `docs/design/organization-faction-guild-boundary-decision.md`: protect existing religion/order and guild owner identities.
- `docs/design/economy-authority-boundary-decision.md`, `economy-command-surface-source-map.md`: runtime market and transactional ownership remain distinct from descriptive guild and market data.
- `docs/design/quest-offer-issuer-and-arc-architecture-consolidation.md`, `quest-event-chronicle-authority-boundary-decision.md`: quest arcs, generation, offers, accepted events and rewards have distinct owners.
- `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`: no seed-secret knowledge leaks through prose.
- Companion religion docs in held PR #46: elemental cultural faith direction; seeded history/physical confluence/lineage continuity direction.

**HOLD_NAMED_CONSUMER**. Retain in religion draft PR #46 for future Religion/Plot/World Continuity design selection and later separate named implementation consumers. No change to master, Codex active native v3 prompt/output/handoff/branch register, PR #45 Area/Atlas, PR #40 tools/stations, current world religion JSON, quest and guild content, runtime economy, item inventory, currency, Save, UI, tests, or Game version. No tests executed or claimed.
