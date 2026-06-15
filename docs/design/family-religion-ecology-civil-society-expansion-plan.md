# Family, Religion, Ecology, And Civil Society Expansion Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-06-14
Status: durable design expansion note; documentation only

## Purpose

This document records additional design decisions that extend `docs/design/offspring-heir-family-continuity-owner-plan.md` and inform future `0.5.x` planning around religion, renown, offspring maturation, inheritance, adult-age rules, social institutions, and the first Ecology knowledge-domain pass.

It is not runtime code, a schema, content data, save data, or permission to implement gameplay behavior.

## Religion, Family Affiliation, And Renown

Religion should be varied by race, culture, family, region, settlement, kingdom, and local power structure.

A family may largely follow a specific element, deity, ancestral cult, temple, doctrine, saint, spirit tradition, or other religious lane. That family association should not become a hard mandate unless a later setting-specific owner explicitly defines one.

Prestige unlocks may later support:

- access to a backstory connected to a different religion than the family norm;
- starting a separate family under a different religious affiliation;
- abandoning the family for religion;
- joining a temple, order, cult, monastery, druidic circle, elemental sect, or other religious institution;
- preserving limited religious renown between generations;
- reducing family/religion mismatch penalties;
- unlocking conversion or apostasy paths where culturally supported.

High-position religious persons may earn renown perks or institutional standing, but those perks should not translate across generations by default. Generational transfer requires an explicit Prestige unlock, backstory, family-specific religious recognition, or institutional owner.

There should be no universal religious mandate.

However, in religious hotspots, failing to follow the dominant or expected religion may cause:

- reduced local renown;
- reduced access to temple, guild, court, or marriage options;
- suspicion or notoriety;
- blocked backstory or institution support;
- higher scrutiny from local law, clergy, family elders, or factions;
- access to outsider, heretic, apostate, exile, secret-believer, or reformer play paths if supported by content.

These effects must be local or scoped. They must not become global punishment unless the world owner explicitly defines a realm-wide or religion-wide enforcement system.

## Religious Prestige Unlock Posture

Religion-related Prestige upgrades should distinguish account-wide system access from family/local religious recognition.

Account-wide candidates:

- unlock religious backstory selection support;
- unlock conversion/backstory routes;
- unlock religious institution joining routes;
- unlock religious study or pilgrimage route visibility;
- unlock apostasy/abandon-family-for-religion paths;
- unlock alternate-family religious origin creation.

Family-specific candidates:

- preserve a family's religious renown;
- reduce penalty for heirs who follow a different religion;
- increase acceptance of adopted, illegitimate, or married-in heirs through religious recognition;
- improve temple marriage options;
- improve dowry/boon/wardship outcomes where religion matters;
- transfer limited religious standing to later generations.

Local or institutional candidates:

- temple rank;
- shrine caretaker role;
- monastery/circle/order membership;
- pilgrimage recognition;
- doctrinal favor;
- local sect trust.

## Religion And Marriage

Marriage should depend on culture, race, religion, family, settlement, wealth, and social class.

Examples:

- political figures may require large public events with witnesses, temple/state recognition, dowries, alliance expectations, and public renown consequences;
- wealthy families may use marriage settlements, estate arrangements, guild records, or public feasts;
- poor farmers may have a simple private event and register with a local guild, elder, shrine, civil scribe, or village authority;
- some cultures may require temple blessing, clan approval, trial completion, bride price, dowry, oath exchange, or public feast;
- some religions may support, restrict, encourage, or penalize interfaith marriages.

Marriage must not automatically create estate, title, religious, or renown benefits. Every benefit requires an owner, scope, validation rule, and failure path.

## Civil Institutions And Adult-Only Social Systems

Brothels, slave pens, indenture houses, hired escorts, adoption services, matchmakers, wet nurses, orphanages, wardship brokers, temple shelters, and similar institutions may exist where expected for the medieval-fantasy setting.

Presence and form should vary by:

- city size;
- settlement wealth;
- local law;
- race/culture;
- religion;
- local and regional politics;
- crime prevalence;
- war, famine, migration, or plague;
- trade routes;
- local market demand;
- guild, temple, noble, or underworld control.

Large cities should generally have more options, more specialization, and more opportunity. Smaller villages may have little or none.

Religions may affect each institution positively or negatively. Local politics and crime can also affect availability, safety, cost, legality, and social risk.

Design guardrails:

- keep explicit sexual content out of UI and generated output;
- brothel/escort/liaison systems, if implemented later, remain adult-only, non-explicit, and fade-to-black;
- coercive institutions such as slavery or indenture should be treated as serious social/legal systems with risks and consequences, not casual perks;
- these systems must not create offspring, marriage, adoption, social status, or estate outcomes without explicit evidence and owner rules;
- institution access should be scoped to settlement/culture/religion/law/crime context.

## Race-Specific Adult Age And Maturation

Each race should define an adult age that is realistic for the lore of the game.

Adult age is required before systems can safely reason about:

- when an offspring can become a playable heir;
- when marriage/courtship can become available;
- when adoption/wardship changes status;
- when training, apprenticeship, military duty, religious vows, guild entry, or estate obligations begin;
- when an offspring's maturation stat progression completes.

Adult-age rules should be data-driven only when multiple races or cultures actually differ. If early content only needs one default adult age, avoid broad infrastructure until variation is required.

## Offspring Maturation Stat Model

A character may continue their game to raise offspring before retiring.

Offspring stats start at `1` and grow toward a maturation profile derived from the parent's current stats at the time the offspring is born.

Base maturation model:

1. Calculate the parent's total stats at offspring birth.
2. Treat that total as the offspring's base maturation stat budget.
3. Divide the budget across maturation years/steps up to the race's adult age.
4. Preserve the parent's stat distribution ratio.
5. Track decimals internally.
6. Use the floored integer value for display and gameplay calculations, except for future stat-gain calculations that may use the decimal value.

Example:

- parent has `100` total stats when the offspring is born;
- offspring adult age is `16`;
- base growth is `100 / 16 = 6.25` stat points per maturation year/step;
- parent has `10 STR` out of `100` total stats;
- STR receives `10%` of each `6.25` growth step;
- if internal STR is `7.39`, effective displayed/calculated STR is `7`;
- if internal STR is `7.99`, effective displayed/calculated STR is still `7`.

Open implementation detail: future planning should decide whether the maturation step is exactly one year, one level, one birthday tick, one season/year abstraction, or another time step.

The model must avoid runaway growth. It should make the younger generation generally capable of surpassing the prior one over time, while keeping progression bounded by cost, age, family-specific upgrades, and diminishing returns.

## Active-Parent Rearing Prestige Upgrades

A family-specific Prestige upgrade path may reward time spent raising offspring while the parent is still the active account character and before the parent is retired.

Concept:

- every year/step an offspring grows while the parent remains active can add bonus maturation growth;
- early upgrades may add flat growth, such as `+1 stat point per year` and then `+2 stat points per year`;
- after a defined tier threshold, such as 5 or 10 upgrades, a percentage-based path may unlock;
- percentage upgrades may start small, such as `+0.1% stat points per year/step`;
- costs should increase rapidly, similar to incremental-game upgrade curves;
- this path should usually be family-specific because it represents a family's investment, training, household stability, mentors, estate safety, and accumulated rearing culture.

This upgrade path should not be account-wide by default.

Future planning must define:

- flat upgrade tier count;
- cost curve;
- percent upgrade threshold;
- percent scaling cap;
- whether the bonus applies to all offspring of the family or only selected offspring;
- whether illegitimate/adopted heirs receive the same benefit;
- whether war, poverty, travel, illness, or estate instability reduces the benefit.

## Estate Ownership, Death, And Succession

Estates should be tied to the senior-most active character where appropriate and passed according to explicit inheritance rules.

A heir's own earnings remain with that heir and are not automatically counted as part of the parent's estate while the parent is alive.

If a heir has offspring and dies before their parent, that heir's estate should be handled for their own offspring according to succession rules.

Death should cause an estate trigger when estate systems exist.

Estate trigger outcomes must depend on explicit owner systems, such as:

- parent estate;
- heir-owned estate;
- spouse estate;
- dowry/marriage settlement;
- legitimate offspring;
- illegitimate offspring;
- adopted children;
- family branch status;
- religious/civil inheritance law;
- local or regional authority;
- wills, bequests, or legal claims if implemented;
- debt, crime, confiscation, betrayal, or political punishment.

## Orphan And Wardship Succession Defaults

If an offspring becomes orphaned, default caretaker/succession logic should follow a sensible hierarchy.

Default order:

1. paternal/origin-family grandparents where applicable;
2. alternate grandparents, such as the mother's side, if the first path is unavailable;
3. uncles, aunts, or equivalent close relatives;
4. ward of the estate with paid caretakers if estate wealth supports it;
5. orphan status if estate value is low and no family caretaker path exists;
6. line ends if no heir slots, caretaker path, estate support, or playable continuity option exists.

A move to alternate grandparents or another family side may create a new family if slots and owner rules allow it.

Wardship and orphan outcomes must not automatically create a playable heir. They establish status, vulnerability, and future eligibility for systems that explicitly consume them.

## Renown Labels By Race, Kingdom, And Culture

Renown should use common-sense labels for each race, kingdom, culture, settlement type, and authority structure.

Kingdoms are not yet implemented, but rank and recognition planning should assume they may eventually exist.

Examples:

- goblins may have a rank structure focused more on societal role, usefulness, cunning, crew position, gang status, or survival hierarchy than formal political nobility;
- elves may have fewer formal political ranks, more council roles, elder recognition, artistic/spiritual honor, lineage-memory status, or role-oriented cultural respect;
- multiple human kingdoms can share similar hierarchies or differ significantly, similar to how real-world military ranks overlap while retaining branch/cultural differences;
- some cultures may value religious role, age, craft mastery, warrior reputation, merchant credit, clan seniority, or scholarship more than political titles.

Renown labels are presentation and scope. They must not automatically grant estate, title, military command, religious authority, marriage access, or family legitimacy without owner systems.

## Ecology Knowledge Domain Starting Point

The next knowledge-domain expansion should start with Ecology.

Runtime for `0.6.x` should remain deferred until the project reaches runtime ownership work. There is enough `0.5.x` planning, validation, schema, content, and pure-helper work to do first.

The Ecology domain should support knowledge around:

- habitats;
- predator/prey relationships;
- seasonal behavior;
- breeding patterns;
- migration;
- byproducts;
- resource outputs;
- dangers;
- lookalikes;
- regional variation;
- domestication or ranching relevance;
- farming/gardening relevance;
- disease/vector relationships;
- climate interaction;
- settlement/trade impact;
- religious or cultural interpretations where appropriate.

Ecology should connect later to flora/fauna, medicine, material processing, trade goods, settlement lore, travel danger, and crafting inputs, but initial work should remain authored knowledge-domain planning/content rather than simulation.

## Recommended 0.5.x Additions From This Expansion

Add these candidates to the broader `0.5.x` roadmap as docs-first unless explicitly narrowed later:

1. Religion, Family Affiliation, And Renown Boundary Plan.
2. Religious Hotspot Renown And Notoriety Plan.
3. Race-Specific Adult Age And Maturation Plan.
4. Offspring Maturation Stat Model Plan.
5. Active-Parent Rearing Prestige Upgrade Plan.
6. Civil Institutions And Adult-Only Social Systems Boundary Plan.
7. Estate Succession And Orphan Wardship Boundary Plan.
8. Renown Labels By Race, Kingdom, And Culture Plan.
9. Ecology Knowledge Domain Plan.
10. Ecology Knowledge Domain Seed Content Plan.

## Open User Decisions

Questions to answer before implementation:

1. What is the default adult age for humans, and should non-human races differ immediately or later?
2. Should offspring maturation use yearly ticks, level steps, birthday events, season/year abstraction, or another time step?
3. Should offspring inherit only the active parent's stat distribution, both parents' distributions, or a weighted blend?
4. Should active-parent rearing bonuses apply to all children or require selecting a focus child?
5. What should the flat rearing bonus tier count be before percentage upgrades unlock: 5, 10, or another number?
6. Should family-specific rearing upgrades apply equally to legitimate, illegitimate, and adopted heirs?
7. Which religions/elements should exist as initial family-affiliation examples?
8. Which settlements or regions should be early religious hotspots?
9. Should religious mismatch usually cause reduced renown, notoriety, blocked options, or mostly social flavor at first?
10. Should ecology begin as one broad domain or be split immediately into habitat, flora ecology, fauna ecology, climate, and resource ecology?
11. Should slave pens/indenture systems exist as visible institutions, hidden underworld institutions, or only as narrative background until later law/crime systems exist?
12. Should orphaned high-estate children default to paid caretakers, extended family control, religious wardship, or estate stewardship first?
