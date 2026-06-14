# Offspring Growth, Recipe Ownership, And Ecology Engine Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-06-14
Status: durable design expansion note; documentation only

## Purpose

This document extends the family, offspring, ecology, and civil-society design notes with future rules for yearly offspring growth allocation, family-owned recipes, recipe learning, crafting/cooking trial events, bulk preparation Prestige unlocks, flora/fauna breeding/proliferation engines, and religion-as-knowledge sequencing.

This document is not runtime code, a schema, content data, save data, or permission to implement gameplay behavior.

## Offspring Yearly Environment And Growth Roles

An offspring's environment and activities should be inspected each year or maturation step when allocating stat growth.

The base maturation model remains:

- offspring stats start at `1`;
- a maturation stat budget is derived from parent stats at birth;
- the budget grows over the race-specific maturation period;
- decimals are tracked internally;
- display/gameplay stats use floored integer values except where future stat-gain math explicitly uses decimals.

Each year/step should also evaluate the offspring's habitual environment and assigned activities. One-time training should not create an automatic permanent boon. Bonuses require repeated or habitual practice.

## Growth Roles And Activity Builds

Future systems should define yearly `growthRole` or `activityBuild` records that modify stat allocation for that year/step.

Examples:

| Growth role | Typical sources | Likely stat influence |
| --- | --- | --- |
| Schooling | school, academy, literate household, tutor, scribe apprenticeship | INT, WIS, language/lore-adjacent stats or skills |
| Tutored Heir | private tutor, family scholar, estate instructor | INT, WIS, CHA, family/culture knowledge |
| Religious Study | temple education, monastery, shrine service, doctrinal study | WIS, SPT, CHA, doctrine/religion knowledge |
| Religious Practice | ritual duty, prayer routine, service, vows, discipline | SPT, WIS, CON/VIT, religious standing where supported |
| Archery Training | range practice, hunting tutor, militia practice | DEX, perception, ranged skill affinity |
| Melee Training | weapons tutor, guard yard, family armsmaster | STR, DEX, CON/VIT, melee skill affinity |
| Squire/Retainer | noble household, knightly service, military support | STR, CON/VIT, CHA, discipline, riding/arms where supported |
| Craft Apprentice | workshop, family trade, guild contact | DEX, INT, crafting skill affinity |
| Kitchen Hand/Cook | household kitchen, tavern, camp cooking | DEX, WIS, food/cooking recipe familiarity |
| Field Labor | farm, ranch, logging, mining, hauling | STR, CON/VIT, practical ecology/material knowledge |
| Travel Exposure | caravan, pilgrimage, migration, exploration | CON/VIT, WIS, geography/ecology/culture knowledge |
| Urban Street Life | market alleys, dockyards, underworld exposure | DEX, CHA, WIS, survival/social knowledge |

A given year may have:

- one primary growth role;
- one secondary growth role;
- environmental modifiers from location, wealth, danger, family estate, active parent, tutor quality, institution quality, religion, culture, health, or war/famine/plague;
- penalties from neglect, poverty, instability, injury, illness, crime exposure, or displacement.

The allocation model should not simply add raw stats without bounds. It should redistribute or modestly increase yearly stat allowances based on activity and environment.

## Growth Role Guardrails

Future growth-role implementation must define:

- source evidence for the activity;
- whether the activity is habitual enough to count;
- minimum duration needed;
- whether the role is chosen by player, assigned by family, inferred from environment, or produced by event;
- stat weights;
- skill/knowledge affinities;
- penalties or opportunity costs;
- caps and diminishing returns;
- interaction with family-specific rearing Prestige upgrades;
- interaction with legitimate, illegitimate, adopted, ward, orphan, and married-off statuses.

Growth roles must not grant profession, backstory, recipe mastery, religious standing, guild rank, or combat mastery by themselves. They should shape maturation and future aptitude unless a separate owner system consumes the evidence.

## Recipe Ownership And Family Access

Recipes should be family-owned where appropriate.

A recipe may exist in several authority states:

- family-owned recipe;
- character-learned recipe;
- guild-owned recipe;
- institution-owned recipe;
- book/scroll/tome recipe;
- settlement/culture recipe;
- secret or restricted recipe;
- experimental/discovered recipe.

If a character leaves a family, they lose access to any family-owned recipes they have not personally used or learned.

A character's recipe access must distinguish:

- can view known family recipe;
- can attempt recipe under family access;
- personally learned;
- personally mastered or quality-rated;
- lost access because of family departure;
- blocked by guild/institution/settlement/family status;
- unavailable due to missing ingredients, tools, station, skill, or knowledge.

Family-owned recipe access must not become a universal account unlock by default.

## Learned And Quality Flags

Each character should have progressive recipe knowledge flags for food and crafting recipes.

Suggested state:

- `unseen` - no known access;
- `known_by_family` - accessible through family but not personally learned;
- `seen` - character has seen or read the recipe;
- `attempted` - character has attempted the recipe;
- `learned` - character can attempt independently;
- `reliable` - reduced failure risk;
- `mastered` - strong success/quality consistency;
- `signature` - exceptional family/character specialty, if future systems support this.

Quality flags should apply to both cooking and crafting recipes.

Possible quality ladder:

- `poor`;
- `standard`;
- `good`;
- `fine`;
- `excellent`;
- `masterwork` for applicable crafts;
- food-specific or culture-specific labels may be introduced later.

Recipe quality should depend on skill, stats, equipment/tools, station quality, ingredient quality, recipe familiarity, environmental conditions, and trial performance.

## Recipe Learning Events

Recipes are learned through trial-like events, similar in spirit to spell learning or knowledge trials.

Possible triggers:

- book or scroll purchase;
- mentorship;
- guild training;
- family training;
- institution training;
- kitchen/workshop apprenticeship;
- experimentation;
- observation of another crafter/cook;
- regional/cultural exposure;
- quest or contract reward;
- religious/ritual practice where appropriate;
- reverse-engineering an item or meal;
- repeated family recipe use until personal learning occurs.

The event should resolve whether the character:

- fails to learn;
- partially understands;
- learns with low reliability;
- learns normally;
- learns with a quality bonus;
- discovers a variation;
- damages ingredients/tools or creates a flawed output;
- triggers a future mentor/guild/family response.

Learning must not be automatic from one exposure unless the recipe is intentionally trivial or the character already qualifies through strong supporting evidence.

## Cooking And Crafting Trial Events

Cooking and crafting should use trial-style events or minigames when meaningful.

The system should support:

- recipe preparation/craft event;
- one unique pass/fail roll per craft or food item;
- quality outcome;
- possible waste, partial success, flawed output, or bonus output;
- modifiers from character skill, stats, tools, station, equipment, ingredient quality, familiarity, growth/background evidence, and environmental conditions;
- different trial structures for cooking, alchemy, smithing, woodworking, tailoring, leatherworking, medicine, ritual items, and other crafts.

The system should avoid turning every trivial action into a burden. Trials should matter most for learning, quality, risk, high-value products, scarce ingredients, commissions, batch work, rare recipes, or contested conditions.

## Bulk Preparation And Bulk Crafting Prestige Unlocks

A Prestige unlock may allow bulk preparation for cooking and crafting.

This should not mean one roll creates a whole batch automatically.

Reference posture: similar to the broad idea of bulk crafting in Final Fantasy XIV, where crafts may be performed quickly in succession but each craft still has its own unique pass/fail or quality outcome.

Future Prestige upgrade paths:

- unlock bulk cooking/preparation;
- unlock bulk crafting for basic items;
- increase maximum bulk count;
- reduce bulk preparation penalties;
- reduce quality penalty in bulk mode;
- reduce ingredient waste in bulk mode;
- increase speed or convenience without removing per-item outcome checks;
- unlock family/workshop/guild bulk support where owner systems exist.

Bulk mode should apply penalties by default, such as:

- lower quality chance;
- higher fatigue;
- higher mistake risk;
- reduced learning per item;
- station/tool wear;
- ingredient waste.

Incremental Prestige unlocks may reduce those penalties.

Bulk crafting/cooking RNG should be affected by:

- relevant skill;
- stats;
- equipment/tools;
- workstation quality;
- ingredient quality;
- recipe familiarity/quality flag;
- helper/apprentice presence;
- family/guild/institution support;
- fatigue, injuries, weather, travel, danger, or time pressure where relevant.

## Recipe Inheritance Prestige Unlocks

Prestige unlocks may allow recipe inheritance or preservation.

Potential account-wide unlocks:

- unlock recipe inheritance system visibility;
- allow one family recipe to be preserved across succession;
- increase inherited-recipe capacity;
- unlock cooking recipe inheritance;
- unlock crafting recipe inheritance;
- unlock guild/institution recipe preservation lanes.

Potential family-specific unlocks:

- increase inherited family recipe capacity;
- reduce learning penalty for family recipes;
- preserve higher quality flags across generations;
- protect secret recipes when a character leaves or marries out;
- allow a married-out heir to retain selected personally learned family recipes;
- improve family training effectiveness for recipes.

A character leaving a family should only retain recipes they personally learned or that a future rule explicitly transfers.

## Flora And Fauna Breeding/Proliferation Engines

Flora and fauna breeding should eventually use both macro and micro engines.

### Macro Regional Wild Population Engine

The macro engine should model simplified large-scale regional wild breeding/proliferation.

Each region/grid may track:

- population or abundance estimate;
- breeding gains;
- hunting pressure;
- gathering pressure;
- natural losses;
- predator/prey pressure;
- disease or blight;
- seasonal modifiers;
- reproduction season;
- migration;
- habitat suitability;
- climate and weather trends;
- environmental disasters or events;
- settlement expansion;
- trade demand;
- religious/cultural protections or taboos;
- local law/hunting restrictions;
- crime/poaching pressure.

The engine should compare breeding/proliferation against regional hunting/gathering and natural losses.

This should remain simplified and data-driven at first. It should support readable trends and consequences, not a full ecological simulator.

### Micro Managed Breeding Engine

The micro engine should apply to managed cases such as:

- farms;
- ranches;
- gardens;
- orchards;
- kennels;
- stables;
- apiaries;
- breeding pens;
- alchemy gardens;
- herb plots;
- rare beast handling where supported.

Micro breeding should consider:

- owned animals/plants;
- space and facilities;
- caretaker skill;
- family/estate/workplace ownership;
- season;
- feed/soil/water;
- health and disease;
- selected breeding pairs/stock where relevant;
- climate;
- predators/theft/crime;
- religious/cultural restrictions;
- market demand;
- genetic/quality traits only if future design supports them.

Micro systems should wait for estate, workplace, ownership, storage, and economy seams.

### Flora/Fauna Engine Guardrails

Initial `0.5.x` work should stay in knowledge-domain planning/content, schema planning, validators, or pure projection.

Do not implement runtime breeding, population mutation, hunting depletion, gathering mutation, estate production, or market effects until owner systems exist.

## Religion Sequencing: Knowledge First

Religion institutions will be difficult to define fully before settlement and region data are expanded.

Therefore, religion should first be defined on a knowledge basis.

Recommended first steps:

1. define religion/element/doctrine concepts as Knowledge domains/snippets;
2. define religious hotspots as knowledge/context notes, not institutions;
3. define local religious expectations as lore and renown posture, not active mandates;
4. defer temple/order/cult institution implementation until settlement/region authority exists;
5. defer religious rank, title, marriage authority, and institutional perks until owners exist.

This allows religion to inform culture, renown, marriage, ecology interpretation, magic study, and backstory planning without prematurely creating institutional runtime systems.

## Recommended 0.5.x Candidates From This Plan

Add or consider these docs-first/pure-helper candidates:

1. Offspring Growth Role And Activity Build Plan.
2. Offspring Yearly Environment Growth Allocation Plan.
3. Recipe Ownership And Personal Learning Plan.
4. Cooking And Crafting Trial Event Plan.
5. Bulk Cooking/Crafting Prestige Unlock Plan.
6. Recipe Inheritance Prestige Unlock Plan.
7. Flora/Fauna Macro Population Engine Plan.
8. Flora/Fauna Micro Managed Breeding Plan.
9. Religion Knowledge Domain Plan.
10. Religious Hotspot Knowledge Snippet Plan.
11. Ecology Domain Seed Content Plan.

## Open User Decisions

Questions to answer before implementation:

1. Should offspring yearly growth roles be player-selected, inferred from environment, event-assigned, or mixed?
2. Should each year have one primary growth role, or primary plus secondary?
3. Should family-specific rearing Prestige increase total growth, improve role efficiency, or both?
4. Should recipe learning trials be required for all recipes or only non-trivial recipes?
5. What should recipe quality labels be for cooking versus crafting?
6. Should bulk preparation be account-wide, family-specific, guild-specific, or split by recipe/craft type?
7. Should family recipes be visible to all family members, only household members, only apprentices, or only those with access rights?
8. Should a married-out heir keep personally learned family recipes by default?
9. Should macro flora/fauna population use exact counts, abundance bands, or hidden estimates?
10. Should micro breeding start with livestock, crops/gardens, alchemy herbs, or remain fully deferred until estate systems?
11. Which religion/element/doctrine knowledge concepts should be seeded first?
12. Should religious hotspots be recorded under Ecology, Culture, Religion, Settlement Lore, or multiple domains?
