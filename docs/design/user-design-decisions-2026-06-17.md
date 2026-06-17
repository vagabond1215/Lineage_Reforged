# User Design Decisions Intake - Relationships, Survival, Travel, Family

Source route: ChatGPT via GitHub Connector  
Date: 2026-06-17  
Status: connector-side user-decision intake; documentation only; not an implementation handoff

## Purpose

This document preserves user-provided design decisions from June 17, 2026. It updates the open question posture for religion, relationships, survival, travel, inventory, law, NPCs, family, offspring growth, and future runtime planning.

This file is not:

- runtime authority;
- schema authority;
- content JSON;
- save data;
- a backlog replacement;
- permission to implement broad systems without a scoped prompt.

## Active Pipeline Confirmation

The current defaults before `Version 0.5.177 - Religious Hotspot Content Authority Seed` are accepted.

For `0.5.177`:

- seed the recommended planned hotspot records if they validate;
- keep the records `planned`;
- omit `deityIds`;
- omit `dominantFaithIds`;
- omit `toleratedFaithIds`;
- omit `restrictedFaithIds`;
- omit `religiousOrderIds`;
- do not add direct `religious_hotspot` Knowledge subject support;
- do not add snippets;
- do not add favorability, alignment, law, consequence, runtime, UI, storage, reward, event, command, Magic Study, Prestige, family, or gameplay behavior.

## Geography And Place Hierarchy

Settlements and regions are unique entities at different organizational levels.

Settlements fall within the bounds of a region and should be connected appropriately for that relationship.

Future place/hotspot work should preserve hierarchy links between:

- macro regions;
- regions/subregions;
- region localities;
- settlements;
- point-of-interest or hotspot records.

## Religious Orders, Profiles, Favorability, And Alignment

Enough should be known about the base religious orders to define ids or placeholder ids until names are finalized.

Religious orders should be assigned to respective elemental branches.

Non-religious entities such as guilds, factions, groups, governments, and similar organizations should have a religious profile if they interact with the religious paradigm.

Religious profile posture:

- profiles should include favorability levels for each elemental branch of the religious paradigm;
- the sum total favorability for a profile should be at most `100`;
- total favorability may be less than `100` if the entity has little or no relationship with religious orders or institutions;
- a purely neutral entity can have `0` favorability for all branches;
- an exclusive or fanatical entity aligned with one specific religion should have `100` favorability for that branch and `0` or lower for the others;
- entities can have abhorrent or anathema relationships with one, multiple, or all religions.

Implementation posture:

- create infrastructure/framework before assigning actual profiles and values;
- do not define broad profiles until more content authority and population exist;
- follow the recommended implementation order for alignment and favorability.

Favorability and elemental alignment are distinct:

- favorability is social disposition or relationship;
- elemental alignment is innate or intrinsic;
- a water elemental has elemental alignment of water;
- a fire spell has elemental alignment of fire;
- a character can know spells of different elements without changing the character's own elemental affinity.

Knowing a spell of a specific element should not by itself change favorability.

The process or trials associated with learning spells may affect favorability if a character largely favors some elements over others.

Prominent use of spells from specific elements can also affect favorability.

Spell penalties, if implemented later, should affect associated elements. A significant negative favorability with stone/earth should affect stone/earth spells, relationships with stone/earth elemental creatures, and fanatical institutions faithful to that element.

## Sacred Sites And Religious Hotspots

Sacred sites fall under religious hotspots.

Religious hotspots include more types than sacred sites.

Sacred sites should be rare and usually specific to one element unless they are very rare confluences.

Sacred sites should provide or enable some system mechanic later, such as:

- pilgrimage;
- elemental trials;
- quests;
- boons;
- other scoped religious mechanics.

Religious orders are not innately sacred places.

Religious orders may have authority or control over locations that are sacred sites.

## Religious Institutions, Rites, Environments, And Backstories

A religious order is an overarching organizational construct that subjects can align with, subscribe to, or belong to. It does not necessarily need to be treated as a `subject` in the same way as a place or individual entity unless a future Knowledge subject plan chooses that route.

Elemental-aligned religion does not necessarily require `holy days` as a first concept.

Auspicious environments and events are more important early religious-context candidates, including but not limited to:

- desert;
- ocean;
- river;
- jungle;
- steppe;
- volcano;
- mountain peaks;
- caves;
- thunderstorms;
- deluge;
- flood;
- fire;
- earthquake;
- hot clear weather;
- eclipse;
- other weather or weather-event conditions.

Rites, rituals, and institution locations should consider auspicious environments and events.

Religious adherence, conversion, and apostasy should include institutional aspects:

- jobs and workplaces;
- faithful clients;
- potential adversaries;
- local or regional mandates where appropriate;
- institutionalization or radicalization where supported by location/race/culture;
- open-policy defaults where appropriate.

Legal status should not be directly tied to religion by default.

However, governments may mandate adherence or preclude worship of other religions in specific areas.

Religious backstories should be planned for:

- adherence to one or more religions;
- abhorrence or anathema relationships to one, multiple, or all religions;
- minor starting favorability boosts;
- potential unique starting locations or jobs;
- incremental Prestige increases;
- connection to spellcaster Prestige where appropriate;
- possible elemental-initiate backstory where the selected element grants basic elemental spells or a starting spell loadout.

These religious backstories should follow the existing skill/backstory style: minor starting boosts or start-option unlocks rather than broad immediate power.

## Relationship Systems, Display, Trials, And Decay

Reputation is local or regional social relationship and should be separate from religious favorability.

Reputation and religious favorability are both relationship systems and may eventually be displayed together on the same UI screen in distinct sections, but UI work can come much later.

Recommended structure should reflect relationship categories, such as:

- `relationships.elemental.[element]`;
- `relationships.reputation.[entity]`;
- other scoped relationship branches as needed.

Relationship displays should have numeric values and bands internally, but the exact numeric value does not need to be shown to the player.

Player-facing labels can represent bands, such as:

- familiar;
- adept;
- favored;
- initiate;
- or other labels appropriate to the specific relationship system.

Relationship increase/decrease should be visible only in a debug sense.

Outside debug, changes should be discoverable through in-world means, such as:

- fortune teller;
- occult or fantasy NPC;
- institution representative;
- civil authority representative;
- trial-giver NPC tied to the relationship owner.

Standard way to check a relationship value:

1. Visit the affiliated entity or institution.
2. Speak to the NPC that initiates the associated trial.
3. If the character's relationship band is appropriate, the trial can be offered, possibly with additional requirements.

All relationship progression should require some kind of trial, even if simple, such as:

- purchasing a license;
- proving faith;
- proving loyalty;
- performing a quest;
- proving lineage;
- institution-specific challenge;
- civil or religious test.

Decay rules:

- any standing can decay to a previous checkpoint;
- decay should have diminishing returns;
- recent changes can decay more quickly;
- long-maintained standing should decay slowly;
- decay cannot normally decrease below checkpoints;
- checkpoints can be tier bands, intermediate segments within a tier, or a mixture;
- recent additions can decay quickly to a recent segment until hardened by maintaining it for a required number of days.

Character actions or events that violate the precepts of the related entity can cause relationship loss below normally protected tiers or bands.

Examples:

- a noble caught committing crime;
- a religious official committing offenses;
- serious betrayal of an institution.

## Player Mode, World Model, Party, And Difficulty

The intended structure for now is local single-player.

Multiplayer may branch later, but it is not the initial priority.

At first start, each character should have a separate world.

Future Prestige unlocks can support creating characters into a pre-existing world for a single-player multi-character experience through:

- heirs;
- marriage;
- rival systems;
- apprentice systems;
- similar legacy or continuity mechanics.

Party members should largely be NPC characters with logic controls similar in spirit to Final Fantasy XII gambits.

Difficulty planning/preparation exists, but functional difficulty selection at character creation still needs implementation or confirmation.

## Survival State

Survival state should use descriptive bands with display elements.

Examples:

- hunger;
- thirst;
- comfort;
- climate/environment comfort;
- stress.

Some survival aspects should be represented as status effects or state bands, such as:

- wet;
- soaked;
- cold;
- freezing;
- similar condition-specific statuses.

Use status icons or state-band displays as appropriate.

## Builder Scope And Starting Conditions

Real building should not be an early feature aside from bushcraft.

Substantial building should be locked behind:

- skill levels;
- technology unlocks;
- tools;
- permission for building, when applicable;
- resources;
- manpower.

Default character start:

- small village or encampment;
- near a larger city;
- low threat.

Prestige unlocks can allow alternate character starts.

Difficulty settings can also affect starts once difficulty is implemented.

## Inventory And Storage

Inventory should be lore-friendly and similar to Dungeons & Dragons logic.

A character can carry only so much by both:

- volume;
- weight.

Example:

- a character cannot carry more feathers than would fit in combined storage packs even if they can lift the weight.

Transportation tools such as wagons or carts can extend practical inventory.

Items should be stacked or organized with counts, but separated by storage location, such as:

- backpack;
- pouch;
- purse;
- pocket;
- cart;
- saddlebag;
- quiver;
- belt;
- other containers.

## NPC Generation And Persistence

NPCs do not all need persistent names.

There should be NPCs with set functions and jobs.

The world should have standard NPC profiles appropriate to lore and culture.

Most NPCs should have uneventful, ordinary lives; some should not.

NPC generation should follow that posture.

If easier, a singular world with static NPCs is acceptable.

Design investigation remains needed because some players may prefer a world they can learn and know, while others may prefer an ever-changing system with familiar structure and changing polish details.

## Factions, Guilds, Institutions, And Organizations

Factions, guilds, institutions, religious orders, governments, and similar entities have overlap and divergence.

Schema strategy should balance:

- minimizing unnecessary new schemas and systems;
- avoiding large numbers of unused variables across broad schemas;
- preserving special requirements for religious, governmental, guild, faction, and institutional entities.

## Law And Enforcement

Laws are specific to the authority that governs the location.

Locations may fall under:

- kingdoms with extensive enforcement, regulation, and law;
- less intrusive or less restrictive regional authorities;
- fringe settlements that do not enforce kingdom law;
- local authorities with informal rules.

Large cities are likely to follow kingdom rules, be guarded and patrolled, and still have high crime, with crime being high-risk/high-reward.

Frontier outposts are less likely to care about small infractions because manual labor and fighters may matter more than arbitrary rules.

Local authorities are responsible for enforcing the laws of the government they belong to, if any.

High-notoriety or repeated crime may cause kingdom patrols or investigations to prevent or inhibit corruption.

Kingdoms can outsource law enforcement to institutions or organizations depending on presence and trust.

Examples:

- a kingdom may cede enforcement rules to a religious sect in sacred sites;
- a kingdom may contract law enforcement in frontier towns to trustworthy factions or guilds with a strong local presence.

## Quests And Work

Quests should be hybrid.

They should account for:

- monster activity;
- criminal activity;
- climate;
- events;
- supply and demand;
- trade-route activity;
- other local conditions.

Basic ordinary-work quests should exist, such as:

- sewer cleaning;
- pest control;
- patrolling;
- similar normal activities.

## Travel, Routes, And Events

Travel should depend on travel type.

Caravan travel:

- should have point-to-point route planning;
- can use a minigame-style implementation similar in spirit to Torn City racing;
- should use RNG to open possible trial-like events based on risk, danger, climate, and local conditions;
- a low-level character guarding a low-risk caravan may complete a full journey without any events;
- animal, monster, or bandit encounters can populate during travel depending on area.

Trader/merchant travel:

- a merchant can run the caravan directly if funded by them;
- one-way trips stop in the destination town for selling and restocking;
- merchant characters may create quests to attract adventurer protection or contract known NPCs directly;
- developed merchants with trade businesses can employ traders to auto-trade, using standard RNG event auto-completion.

Trial events during travel occur only on planned routes where the character is present.

Fast travel:

- future Prestige unlocks can unlock fast travel with a horse or other vehicle;
- character can set a known and previously visited destination;
- route calculates risk from duration, danger, climate, and areas passed through;
- time compression can then occur with standard RNG elements;
- prohibited when starting success rate is below `95%`;
- incremental Prestige can lower that threshold by `1%` per upgrade.

Standard character travel:

- grid-by-grid movement;
- each travel segment has an event chance based on travel mode, skill, level, and chosen action.

Example actions:

- hunting: high chance to spawn hunting events when location is appropriate, based on tracking skill and population;
- scouting: stealth bonus to discover without aggroing monsters, bandits, or animals;
- sneaking: larger stealth bonus at cost of time/speed;
- horseback actions such as charge, gallop, or trot affecting horse endurance, hunger, thirst, and speed;
- location-aware actions such as climb, swim, mount, dismount.

## Points Of Interest And Discovery

Points of interest should include all known locations with gameplay value, such as quests or events.

POIs should be sortable by:

- type;
- proximity;
- other useful filters.

A point of interest should only be registered if known.

A place can become known by:

- word of mouth;
- seeing a map;
- seeing a scroll;
- seeing a picture;
- reading historical or descriptive text;
- visiting the place.

Once visited, more details can become known and added to the codex entry.

## Player-To-Player Trade

Player-to-player trade is deferred.

## Adult Age, Offspring Growth, And Stat Inheritance

Early adult-age rules should use data-driven race/culture variation.

Offspring age by birthday.

Stat-point increases can occur more than once a year to avoid unrealistic stat spikes, such as:

- semi-annually;
- quarterly;
- other recommended cadence.

Prestige may unlock a training calendar for offspring stat adjustments, with incremental upgrades to increase stat variance.

By default, offspring follow their parents' stat profile.

Offspring should use both parents' weighted stats with an RNG weighting value.

Stat inheritance applies to all offspring raised by the family.

Illegitimate heirs use a standard racial profile for stat gains.

Adopted heirs follow a standard racial profile until adoption, then follow parental stats.

Prestige unlocks can reduce penalties for illegitimate and adopted heir stats.

Environment effects:

- war can increase stats through increased activity where existing stat-progression systems support that;
- poverty affects stat growth indirectly if it causes malnourishment;
- lack of education or social interaction should negatively affect mental stats;
- family Prestige can reduce these penalties.

Illness should limit stat growth only if it falls under a chronic status.

Build integration should be reviewed against existing character creation builds. A future option is to remove build choice from original character creation and tie build directly into the heir system, with original player-character build selection unlocked only by Prestige if needed.

Quarter-by-quarter handling is preferred unless day-by-day tracking is easier than tracking quarter status.

## Active-Parent Rearing Prestige And Growth Roles

Flat increases and percentile increases should be parallel after unlocked.

Percentile upgrades should unlock at the first tier of flat upgrades.

A standard incremental path should be used for both.

If using 100 incremental upgrades with 3 or 4 benchmarks, the percentile path should unlock at either 25 or 33 upgrades; use recommended design in a future plan.

Family-specific rearing Prestige increases should apply to both total growth and role efficiency, using different Prestige unlocks.

Offspring growth roles should be annual but broken up into semi-annual, quarterly, or monthly rates depending on what is easiest to track accurately.

Each year should follow the standard parent-weighted profile, with positives or negatives based on environment and focus.

Reference current character-creator stat profiles for examples.

Focus can affect multiple stats, but should be zero-sum by default.

Prestige unlocks can increase the zero-sum adjustment by `.05` per upgrade.

Habitual activity should share a standard definition based on minimum time per day across a minimum number of days per week. A future plan should recommend standard structures for this.

## Orphans, Caretakers, And Marriage-Out Rules

Default caretaker order for orphaned offspring:

1. adult siblings;
2. adult uncles or aunts;
3. grandparents.

If no adult records exist, character death should be an end-of-line instance and the offspring should become an adopted heir.

A Prestige unlock can add a caretaker option for end-of-line cases, but heirs in this situation use a standard racial stat profile.

Offspring should not be married out until adult.

If adult offspring are married off to another family, they create a new family if heir slots were available.
