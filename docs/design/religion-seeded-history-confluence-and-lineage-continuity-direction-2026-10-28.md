# Religion: Seeded History, Physical Confluences, and Lineage-Continuous Plots

Date: 2026-10-29 (ET)
Status: **USER-DIRECTED PROVISIONAL PRODUCT INTENT; DOCS ONLY; NOT CANONICAL PLOT CONTENT OR RUNTIME IMPLEMENTATION.**
Selected source baseline: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`. Dedicated companion to `religion-elemental-cultural-faith-institutions-and-rebirth-direction-2026-10-28.md` in held religion draft PR #46. **Where that earlier provisional summary implies that only harmoniously aligned elements may form an order, this newer user clarification supersedes it.** Future same-subject design should read this clarification first.

## 1. Player-established direction, not one fixed religious storyline

Religion must participate in **multiple back-end plots**, potentially generated from a plot seed, such that the starting story and religious power landscape **can differ between campaigns/plot seeds** rather than presenting one exhausted universal questline. The number, age, reach, current power, secrecy, survival, annexation and proxy influence of religious institutions are therefore **not frozen to a single worldwide present-day answer** merely because they appear in an example.

**Do not choose one fixed winner.** Whether an ancient single-element church dominates, was displaced by a mixed order, survives as a shadow patron, has vanished, has infiltrated an unrelated institution, or is rebuilding after suppression should depend on **the accepted campaign-world seed and subsequent causal world events**, subject to authored constraints and actual owner implementation. Which of these possibilities occur, and which organizations are involved, remain unselected.

A descendant or successor in the **same ongoing lineage/campaign continuity** should inherit the established story circumstances and their real consequences. An heir's arrival is not permission to replace an ancestor's setting with an unrelated new plot seed. The plot may change significantly where established causes support it: conquest, faction shifts, betrayal, rediscovery, restoration, death of leaders, exposure of a conspiracy, regional migration, new alliances, or deliberate actions by earlier playable characters. No event is automatic merely because an example appears in design.

**Static canon vs seed vs play history:** canonical elemental identities, existing authored source constraints and permitted plot grammar are not the same as seed-selected starting history, actual mutable campaigns, or a player's limited knowledge of them. These categories must remain distinct when a future implementation owner formalizes them.

## 2. Minimal proposed seed/story conceptual separation (not a schema)

| Layer | What it answers | Must not do |
| --- | --- | --- |
| Shared world/canon vocabulary | What are the eight actual elements and validated existing source identities? | Change Fire into a different intrinsic element or create an unseen deity as fact |
| Authored plot possibilities | Which plausible power arrangements, rivalries, historical losses and secret ties could be allowed? | Turn every example into a canonical event or grant powers without an owner |
| Campaign-specific initial plot selection | Which permitted version of the religious-political history and power relationships is true for this campaign at inception? | Replace accepted base content invalidly, alter unrelated campaigns, or expose private secrets in UI |
| Retained campaign/lineage history | Which seed was accepted, what happened, which alliances/suppression/revelations are now true, and what evidence survives across generations? | Reroll from scratch when a playable heir succeeds the previous character |
| Observer/player knowledge | What does this specific character, family, locality, faction or account actually know or believe? | Give the player hidden enemy allegiance or canonical truth from private seed metadata |
| Real event/quest owners | Which specific authored/generated quest, relationship or history transition was accepted, and what state/receipt changed? | Treat narrative prose or an offer as a completed event, payout, organization take-over or inheritance |

**Proposed narrative contract:** select and retain a campaign plot configuration once, then evolve its mutable state only through accepted owner-controlled events. Retain the scope and identity of historical facts required for the continued storyline. Where the campaign/lineage carries forward across heirs, pass forward accepted world consequences, not necessarily perfect personal knowledge. A family may keep records or rumors, and heirs may fail to know secrets discovered by a predecessor unless evidence/retention authorizes it. No specific runtime state type, generator, seed algorithm, Save field, or world-selection timing is approved by this product document.

Separate:
- **World seed:** broad potential initial political/religious arrangement and historical premises; implementation shape remains undecided.
- **Plot or arc seed:** bounded story-specific branches and participating identities; future authoring and occurrence owners must define authority.
- **Campaign and lineage state:** admitted evolving reality, including aftermath and retained long-range consequences.
- **Knowledge/revelation:** source-filtered subjective information, not a new source of ground truth.
- **New unrelated playthrough:** may legitimately select different premises; parallel family/campaign and multiplayer shared-world relationships remain unanswered.

The existing `docs/design/content-generation-boundary-map.md` distinguishes generated *proposals* from authoritative game content, and quest architecture distinguishes quest definitions, archetypes, templates, future arcs, runtime offers, actual outcomes and Chronicle. The accepted narrative-realization decision requires certified owner facts and observer filtering. These are **prerequisites for later generator design**, not evidence that a plot-seed engine already exists.

## 3. Fixed elements; cultural names, mythical figures and traditions vary

The intrinsic elemental identities stay exactly: **Fire, Water, Earth, Wind, Thunder, Ice, Light and Darkness**. Translations, dialect names, epithets and school-specific terms may vary, but translate back to the *same element*. **Stone is an accepted religious/legacy expression of Earth**, not an additional element. Do not change physical elemental identity or its established meaning by story seed.

Names, likenesses, legends and personalities of *mythic elemental figures* may differ dramatically between societies and languages. These are beliefs, narratives and religious interpretations. The fact that cultures tell different stories about the "Lady of Light" does not prove any particular divine personality is alive or that the figures are supernatural counterparts to real elementals. Keep in-world theology, culturally diverse versions and player uncertainty intact.

Each element has a repertoire of culturally interpreted traits and possible religious values. For instance Fire may inspire passion, ferocity, will, aggression, destructive transformation, purification or rebirth. **This does not mandate one personality for every fire sect, fire elemental, or fire spell.** Cultures can emphasize or invert particular facets according to their experience and history. Other elements likewise support varied interpretations. Source-certified intrinsic elemental behavior remains governed by the accepted elemental temperament/disposition/magic decision, not religious stereotypes.

## 4. Physical confluence makes multi-element orders eligible

**Any combination of elements can support an order when a real physical confluence for that combination is known** (as a phenomenon in the game world, not merely a claimed metaphor). A Fire/Water/Ice confluence and an associated order are conceivable despite theological friction. An order is **not excluded** because its members favor elements whose established metaphysical alignments differ or whose cultural traditions describe each other as impure.

For future authoring and validation, distinguish:
1. **Intrinsic elements:** fixed canonical elements. A combination does not create a ninth element.
2. **Physical confluence:** an actually justified convergence of these elemental phenomena in a world location/time/history. Its evidence and persistence need an appropriate world/magic/site source.
3. **Cultural interpretation:** who knows about the confluence, what it means to them, whether they believe it pure or dangerous.
4. **Religious order:** a **mortal institution** formed around that interpretation, with its own history, membership, discipline, factional arguments and strategic interests. It is neither an elemental being nor a guaranteed manifestation owner.
5. **Political and sectarian reaction:** unrelated orders may denounce, compete with, tolerate, annex or cooperate with this institution; outcomes depend on the seed and play history.

Physical eligibility does **not** imply harmonious theology, friendly elemental behavior, guaranteed new elementals, universal knowledge of the site, travel reachability, available local religious leader, permanent active spell effect, or an authorized membership action. Future implementation must decide whether "known" means publicly attested, locally remembered, institutionally secret, or authoritatively established world evidence; this is an open design question. Also open: natural versus deliberately produced confluences, permanence and historical-only confluences.

A single-element order is the degenerate case of a religion grounded in one element and need not fabricate a mixed-site confluence. The user's principle about confluence applies to **multi-element orders**.

## 5. Politics, pride, purity and competition are central, not exceptions

**Many different orders may revere the same element or the same physical confluence**, including distinct orders on different continents. Each can develop a unique doctrine, culture and politics. They may compete intensely over interpretation, purity, patrons, followers, territory, sacred access, institutional prestige, trade, education, magical study or political favor.

An element may inspire interpreted pride, purity, ferocity or similar virtues, but **mortal institutions can embody those traits differently**. Members and leaders remain susceptible to corruption, manipulation, schisms, prejudice, reform, ambition and human/elf/beastfolk politics. Elemental confluence makes an order *plausible*, not virtuous, benevolent, trustworthy or harmonious.

Large established orders have strategic incentives to retain followers and resist challengers; smaller and regional orders may be persecuted, absorbed, ignored, co-opted, respected or victorious. These outcomes are **seed-specific possibilities**, not universally programmed hostility or fixed balance. Religious order power, survival, public status and hidden control can vary between campaigns *and* over the inherited lineage's timeline.

Examples (Fire zealots rejecting a Fire/Water/Ice mixed church, Water/Ice purists trying to expel a Fire influence, Darkness faith disguised as `guild.adventurers_guild`, a suppressed order seeking revenge) are **hypothetical plot candidates only**. No organization or location in selected master is presently assigned such a secret role. The existing six religion-owned order identities and normal guild identity remain unchanged.

## 6. Compatible repositories and non-negotiable owner boundaries

- `packages/content/base/world/religions.json`: currently a single Pantheon, eight deities, six nested order descriptions and their existing source IDs. This pass does not introduce new faiths, alter those identities or establish new order dominance.
- `docs/design/elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md`: intrinsic elemental identities, Light-aligned Water/Wind/Ice and Darkness-aligned Fire/Earth/Thunder, and physical affinity, manifestation and temperament owners remain controlling. **Metaphysical affinity is not a rule forbidding mixed mortal religious orders.**
- `docs/design/organization-faction-guild-boundary-decision.md`: religious orders remain religion-owned; guilds/factions/institutions and their actual memberships and influence require distinct owners. A proxy identity must not silently reclassify a real canonical guild.
- `docs/design/quest-identity-offer-context-and-travel-access-product-direction.md`, `quest-offer-issuer-and-arc-architecture-consolidation.md`, and `quest-event-chronicle-authority-boundary-decision.md`: authored definitions, future arcs, offers, events, rewards, journals and histories each retain their own responsibilities.
- `docs/design/content-generation-boundary-map.md`: candidate generated content is not already authorized game canon or runtime state.
- `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`: narration and reveals must be sourced, truthful at event time, viewpoint-safe, and must not disclose secrets merely because a plot seed contains them.
- `docs/design/offspring-heir-family-continuity-owner-plan.md`: playable heirs need explicit eligible offspring/adoption and correct Prestige capacity. Successor continuity alone does not manufacture family, memberships, inherited supernatural powers or authority.

No new world-seed authority, story generator, world-politics engine, order affiliation system, secret-guild link model, choice runtime, branch replay policy, Save migration or publication mechanism is selected here. **Especially do not alter Codex's native v3 selected App, Save/recovery, Character/Inventory or active branch coordination.**

## 7. Proposed behavioral invariants for a future executable owner (not tested)

| ID | Proposed check |
| --- | --- |
| RP-01 | Separate unrelated campaign seeds can assign different starting strengths to the same approved order identities without changing elemental canon |
| RP-02 | Heir in same lineage retains accepted historical outcomes and the governing plot reality, with no unexplained reseed |
| RP-03 | A public religious rumor does not expose a hidden proxy/controller relationship |
| RP-04 | An accepted revelation remains historically true even if its institutional consequences later change |
| RP-05 | A formerly destroyed temple can be restored through evidence-backed play events, not unexplained seed replacement |
| RP-06 | Translated Fire remains Fire; no new intrinsic element is minted by regional naming |
| RP-07 | Different cultures may depict different mythical Fire patrons while keeping divine existence unproven |
| RP-08 | A supported Fire/Water/Ice confluence does not require members of its religious order to be harmonious or metaphysically aligned |
| RP-09 | Opposing or same-element orders can coexist, split, merge, compete and lose followers only through accepted world/organization events |
| RP-10 | A religious order does not become an elemental manifestation or acquire spells from its composition |
| RP-11 | Unknown confluence and hidden-order facts do not appear in player Atlas/Chronicle/narrative before legitimate discovery |
| RP-12 | Same seed plus same accepted history yields coherent current reality; deterministic reproduction policy remains an explicit later decision |
| RP-13 | Generated plot proposal cannot overwrite live world-religion JSON or create actual quest reward, membership or religious status |
| RP-14 | A lineage transition cannot reset a world war, suppression or revealed conspiracy merely because the player changes character |
| RP-15 | No plot requires a church to be evil merely because it reveres Darkness |
| RP-16 | A would-be institutional proxy must preserve its legitimate public institutional owner until explicit source identity and revelation rights exist |

These are **prospective design tests**, not implemented or passed tests.

## 8. Remaining user-level decisions, grouped for next question round

The next round should focus on actual new ambiguities instead of re-asking settled facts:
- How widely can starting history diverge across seeds: existing named orders in different positions, wholly different institutional histories, or both?
- When is a seed fixed: new world, new account/campaign, first ancestor, each newly unrelated dynasty, or another scope?
- Which historical events are *shared world canon* across all seeds, if any? How is the Pantheon formed?
- How far can religious power change through in-game decisions as opposed to background world simulation?
- Can one seed support multiple lineages sharing the same world and history, or only one persistent family story?
- How much of a prior character's private discovery or secret knowledge is inherited by a playable heir?
- What counts as a **physical confluence**: natural, magical, temporary, permanent, past or present?
- Does the founding order need to know the confluence existed, or can later historians discover an older origin?
- Can the same confluence support several rival orders, with one site contested?
- What is the historical starting status of the current six authored orders under different seeds: always existing, dormant, absent, reorganized, or plot-selectable?
- What are the rules of generated secrets and reveals so replay variety does not become arbitrary retconning?
- What drives order dominance and loss of followers in later strategic gameplay?
- How common should faith-driven espionage, political capture, purges, cult violence and secret proxies be?
- How should religion affect secular characters without imposing universal worship?
- Should appearance of a foreign culture's mythical deity be interpreted as the same elemental force by all scholars, or can that remain disputed?
- Does plot generation choose only historical relations or also present institutional cultures, values and practices?

## 9. Branch discipline / continuation gate

This is **one new Markdown addendum** to held draft religion PR #46 on `connector/religion-elemental-cultural-faith-direction-2026-10-28`; **HOLD_NAMED_CONSUMER**. It supersedes only the earlier religion *provisional interpretation of harmonious-combination exclusivity* and any presumed fixed winning religious institution, not the accepted elemental, narrative, quest, org, family or magic decisions. Do not edit PR #45 Area/Atlas, PR #40 tools, Codex stack PR #44, master, active prompt/output/handoff/register, content JSON, schema, UI, runtime, account Save or Game version. No code, tests, generator, browser verification, runtime changes or selected-client claims.
