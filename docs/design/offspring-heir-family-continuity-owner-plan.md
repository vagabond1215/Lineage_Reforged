# Offspring, Heir, And Family Continuity Owner Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-06-14
Status: durable design decision and future-system ownership plan; documentation only

## Purpose

This document records the resolved family-creation and heir-continuity rule for future Bloodlines, family, heir, estate, heirloom, bequest, romance/courtship, marriage, naming, adoption, mortality, betrayal, and offspring systems.

It exists because family continuity must not be fabricated from account state, lineage/species identity, or Prestige unlocks alone. Future implementation must preserve grounded in-game offspring evidence before any playable heir or family continuity record can exist.

This document is not runtime code, a schema, a content catalog, a save shape, or permission to implement broad family simulation.

## Core Decision

Characters do not automatically create a family record.

A family/heir line becomes player-facing only when all of the following are true:

1. a Prestige-system unlock allows heir creation;
2. the character had offspring during gameplay or has a separately eligible adopted child under future adoption rules;
3. the player creates an heir character from an eligible offspring or adopted-child record.

Prestige unlocks control heir-character capacity. Prestige does not create offspring, invent family history, imply marriage, imply legal recognition, imply noble status, imply adoption, or create a household by itself.

Subsequent Prestige unlocks may increase the number of heir characters that can be created, but every playable heir must still come from an eligible in-game offspring or adopted-child record.

If a family has only one actual eligible offspring but multiple heir slots open, heir creation is limited by the number of actual eligible heirs. Slots are capacity, not people.

If an offspring is married off through a future unused-heir marriage system, that offspring cannot also be used for heir creation unless a later explicitly approved exception says otherwise.

## Ownership Vocabulary

| Term | Meaning | Guardrail |
| --- | --- | --- |
| Offspring record | A child exists in world/history as a result of in-game relationship, union, liaison, or other explicitly authored adult-only source. | Not automatically playable and not automatically recognized as an heir. |
| Adopted child record | A child becomes part of a household/family through adoption, wardship, or equivalent social/legal process. | Can become playable only through explicit Prestige-gated adoption eligibility rules. |
| Eligible heir | An offspring or adopted-child record that passes future inheritance, recognition, capacity, and safety rules. | Eligibility requires evidence; it is not fabricated by Prestige. |
| Heir slot | Prestige-controlled capacity to create heir characters. | A slot permits selection from eligible offspring/adopted children only. |
| Unused heir | An eligible offspring/adopted child not consumed for playable heir creation. | May later be married off only if the relevant Prestige unlock exists. |
| Married-off heir | An unused heir assigned to a marriage/household path rather than direct playable heir creation. | Cannot also be used for heir creation unless future rules explicitly allow it. |
| Playable heir character | A new character created from an eligible offspring or adopted-child record. | Creation is a player action after eligibility and capacity checks. |
| Family continuity record | The Bloodlines/family continuity record activated by an actual playable heir path. | Do not create automatically for first characters. |
| Origin family | The family from which an heir descends, is adopted into, or is recognized. | Married-out heirs should remain visible in their origin family history. |
| Marriage-created family | A new family or branch created through marriage, naming, and household departure rules. | Requires explicit Prestige unlock and valid in-game relationship/marriage authority. |
| Recognized heir | A legal/social heir acknowledged by the relevant family, household, settlement, religion, title, or estate authority. | Recognition may differ from biological descent. |
| Legitimate offspring | Offspring recognized through marriage/union or other accepted family rules. | Highest default inheritance posture, still subject to capacity and owner systems. |
| Illegitimate offspring | Offspring from a source outside recognized marriage/union rules. | May be immediately playable only with required Prestige/backstory unlocks; inheritance/renown penalties apply unless later reduced. |
| Adopted heir | Adopted child that becomes heir-eligible. | Falls between legitimate and illegitimate heirs: socially legitimate but not blood. |
| Dowry or marriage settlement | Material, social, legal, or household transfer tied to marriage. | Must not fabricate title, estate, wealth, or family status without owner systems. |
| Estate trigger | A future death/retirement/inheritance event that evaluates estate, inheritance, and surviving-claimant consequences. | Trigger only; not an automatic transfer without estate owner rules. |

## Required Upstream Systems

Playable heir creation depends on future owner systems that must be planned and validated before runtime behavior:

- in-game family/household records;
- person/offspring/adopted-child records;
- romance and courtship systems;
- marriage, union, or recognized partnership rules;
- lore-friendly family naming conventions by race, culture, and region;
- offspring source rules;
- brothel or casual-liaison source rules using non-explicit, adult-only, fade-to-black treatment;
- illegitimate offspring recognition, secrecy, proof, dispute, adoption, and social-consequence rules;
- adoption and wardship rules;
- Prestige heir-slot unlocks;
- Prestige marriage unlocks;
- Prestige adoption unlocks;
- Prestige legitimization unlocks;
- Prestige unused-heir marriage unlocks;
- heir creation resolver;
- marriage and branch creation resolver;
- mortality and retired-character lifecycle rules;
- betrayal/conspiracy risk rules;
- estate-trigger rules;
- family continuity record schema/content/state boundary;
- estate, title, religion, settlement, and culture recognition only when those owner systems exist.

## Visibility Rules

A person or family-associated record should show:

- the person's known offspring;
- adopted children associated with the household/family when adoption exists;
- legitimacy/recognition posture where known;
- whether each offspring/adopted child is playable-heir eligible, blocked, already used, married off, deceased, missing, disputed, or otherwise unavailable;
- remaining heir creation slots if heir creation has been unlocked;
- remaining unused-heir marriage-off capacity if that feature has been unlocked;
- estate-trigger status only when estate systems exist.

Visibility must not create eligibility by itself.

If heir creation is not unlocked, offspring may still be visible as family/person history where the current UI supports it, but heir-slot counts should be hidden, locked, or explanatory rather than actionable.

A family with multiple open heir slots but fewer eligible offspring/adopted children must show the actual bottleneck clearly: available heir creation is the lesser of open slots and eligible unused heirs.

## Relationship And Offspring Source Posture

Future offspring sources may include:

- marriage or recognized union;
- courtship or long-term partner relationship;
- acknowledged lover or concubine-style relationship where culturally supported;
- brothel or transactional liaison source, handled without explicit sexual content;
- illegitimate or disputed parentage source;
- adoption or wardship only if a later plan authorizes non-biological heir status.

Every source must define:

- adult-only safety requirements;
- consent-safe and non-explicit presentation boundaries;
- parent identity or known/unknown parent posture;
- legitimacy or recognition posture;
- settlement/culture/religion/legal implications when applicable;
- evidence record identity;
- heir-eligibility effect, if any;
- failure and dispute states;
- UI read-only vs actionable boundary.

## Prestige And Capacity Rules

Prestige may unlock heir creation capacity, but it cannot create heirs by itself.

Future Prestige unlock rules should distinguish:

- no heir creation unlocked;
- one eligible heir character may be created;
- additional eligible heir character capacity;
- marriage-enabled family continuity choices;
- unused-heir marriage-off capacity;
- future-only unused-heir marriage-off unlocks;
- past-unused-heir marriage-off unlocks;
- adoption-system access;
- illegitimate-heir playability access;
- legitimization event access;
- penalty reduction for illegitimate or adopted heirs;
- separate-family or branch-creation privileges;
- family branch preservation or closure choices;
- Chronicle Mark or Lineage Seal conversion only after separately approved rules.

Prestige spending must remain ledger-derived and family-scoped when family ownership exists. Account-wide Prestige or Chronicle resources must not fabricate family/offspring/adoption evidence for unrelated characters.

### Account-Wide Versus Family-Specific Prestige Upgrades

Family system unlocks must be split by what the upgrade represents.

Account-wide unlock candidates:

- heir-slot capacity rules that apply to all families;
- marriage system access;
- unused-heir marriage-off system access;
- adoption system access;
- broad heir creation UI/resolver access;
- broad backstory requirements for illegitimate/adopted heir playability if those are generic system features.

Family-specific unlock candidates:

- inheritance penalty reduction for illegitimate heirs;
- inheritance penalty reduction for adopted heirs;
- renown transfer/share improvements;
- estate share improvements;
- family legitimacy/recognition improvements;
- family branch inheritance share improvements;
- any upgrade where the social value depends on that family's renown, estate, religion, title, or local standing.

Rule of thumb:

- if the upgrade unlocks a generic system capability, it can be account-wide;
- if the upgrade changes how much value a specific family can transfer, preserve, legitimize, or socially recognize, it should be family-specific.

## Unused-Heir Marriage-Off System

A future high-cost Prestige-gated feature may allow unmarried, unused heirs from families to be married off later.

This should be multi-tier and capacity-bound.

### Future-Unused-Heir Marriage Unlock

The first tier should affect future families/heirs only.

Example structure:

1. first unlock allows up to one unused heir per future family to be married off if not used for heir creation;
2. later upgrades increase that cap to two, three, or more unused heirs per future family;
3. each married-off heir is removed from heir-creation availability;
4. marriage-off may create alliances, dowries, obligations, renown implications, or later family-branch hooks only if those systems exist.

### Past-Unused-Heir Marriage Unlock

A second incremental upgrade path may allow past unused heirs to be married off retroactively.

Rules:

- this path should unlock only after the future-unused-heir path exists;
- it starts conservatively, such as one past unused heir per family;
- costs should be substantially higher, such as double or more than the comparable future-facing unlock;
- it must not revive dead heirs, override already used heirs, override married-off heirs, or fabricate missing offspring;
- it must preserve current-data-first rules and avoid compatibility-style guesswork.

## Family Record Creation Rule

A first character does not automatically create a family record.

A family continuity record may be created only when a playable heir is made from an eligible offspring/adopted-child record, or when a later explicitly approved family lifecycle owner creates a family through validated in-game evidence.

Family creation should normally happen only when a character changes family identity through marriage, naming, household departure, adoption, legitimization, or an explicitly unlocked branch-creation rule.

When a new playable heir is created through direct heir creation, marriage, adoption, or another approved path, a new record within the family should be created.

When an existing character creates a separate family, a record move, translation, or continuity transfer may occur. The previous-family entry should be locked, causing a dead end to that branch of the old family tree, and a new family should be created with the appropriate record.

Do not create families from:

- loose `lineageId` or ancestry/species identity;
- account id alone;
- Legacy purchase alone;
- Prestige unlock alone;
- source run id alone;
- UI placeholder state;
- inferred surname text;
- noble/title/estate concepts without owner systems.

## Lore-Friendly Naming Rules

Naming must follow standard lore-friendly conventions and may differ by race, culture, settlement, realm, religion, or region.

Default posture:

- heirs use the origin family name by default;
- naming conventions should be data-driven only when the setting actually needs variation;
- if every current race/culture shares the same male-dominant naming convention, do not add extra race-specific infrastructure prematurely;
- if a later race or region differs, add explicit naming-rule authority rather than hard-coded exceptions.

Married heirs should remain visible in their origin family history even if their married household or new branch uses a different family name.

Female heirs may marry and change last name where the local naming convention supports that outcome. That change can create or join a new family record only through a future marriage/branch resolver, not by editing display text alone.

## Marriage-Gated Family Creation

Marriage is gated behind a Prestige unlock.

Marriage unlocks should eventually support two distinct paths:

1. mid-playthrough marriage by a direct heir;
2. character creation from an eligible heir slot as the spouse married into the family.

### Mid-Playthrough Marriage

A direct heir may create a new family through marriage during a playthrough only after the relevant Prestige unlock exists and marriage authority validates the relationship.

This must not happen at first character creation by default.

A marriage-created family can occur when:

- an heir changes family name and leaves the origin family;
- an heir joins the spouse's family under local naming law;
- an heir creates a new branch family through a Prestige-unlocked branch option;
- an heir keeps the same name but legally or socially creates a new branch, if that option is unlocked.

The origin family must retain historical visibility of the heir even when the heir enters or creates a new family.

### Married-In Character Creation

A future character-creation option may allow the player to start as a character married into the family.

Rules:

- this consumes the appropriate heir slot;
- the primary playable character becomes the spouse rather than the original heir;
- the original heir still exists as the marriage link/continuity source if the chosen scenario requires that relationship;
- the option requires both heir capacity and marriage unlock authority;
- this path must not create an offspring, spouse, marriage, family, dowry, or estate from Prestige alone;
- the spouse's identity, family name, and social placement must come from authored or generated authority approved by a future plan.

## Dominant-Sex Naming And Branch Rules

Each race, culture, or region may eventually define a dominant sex for naming, household leadership, or inheritance convention.

Do not add broad infrastructure unless it is needed. If all current cultures use a male-dominant naming convention, model that as the default convention and defer more complex race/region variation until content requires it.

Future rules should allow Prestige-gated exceptions, including:

- the last male heir of a family taking a female spouse's family name;
- a dominant character adopting a completely new family name;
- a dominant character keeping the same family name while creating a legally/socially separate branch;
- a female heir retaining origin-family visibility while joining or creating a new family by marriage;
- regional or race-specific conventions overriding the default if future setting data supports them.

These exceptions should be replay-value unlocks, not free defaults.

A family-oriented Prestige unlock may allow a dominant character to create a separate family or branch while taking reduced inheritance with them. The inheritance share should be incremental and upgrade-gated, with early values such as `0%` or `10%` before later upgrades increase the share.

## Dowry, Boon, And Marriage-Settlement Posture

Marriage can create benefits and costs, but only through explicit owner systems.

Future marriage plans should evaluate:

- dowries;
- household goods;
- tools, animals, or craft assets;
- land or estate claims;
- trade licenses or guild access;
- religious or social boons;
- alliance or renown effects;
- obligations to spouse family, temple, settlement, estate, or lord;
- inheritance reductions or exclusions;
- family-branch prestige costs;
- risks from disputed legitimacy, poor match, cultural mismatch, scandal, or unresolved offspring claims.

Marriage benefits must not become generic free-start bonuses. Every benefit needs an owner, source, scope, validation rule, and failure path.

Dowry and settlement effects should be separated from:

- title ownership;
- estate ownership;
- spouse family recognition;
- offspring eligibility;
- heir slot capacity;
- backstory unlocks;
- item-instance ownership;
- active business ownership.

## Legitimate, Illegitimate, And Adopted Heir Posture

### Legitimate Heirs

Legitimate heirs are the default high-standing inheritance path, but they still require:

- actual offspring/adopted-child evidence where relevant;
- heir capacity;
- family/household recognition;
- living/available status;
- no prior use as a playable heir or married-off heir.

### Illegitimate Offspring

Illegitimate offspring can be immediately playable if the necessary backstories and heir-access rules are unlocked through the Prestige system.

They should have reduced inheritance and reduced renown transfer by default.

A future Prestige-gated legitimization event can allow illegitimate offspring to inherit limited renown or inheritance from the associated family.

If legitimate heirs are also present, illegitimate inheritance should be significantly reduced. Incremental family-specific Prestige upgrades may reduce that penalty but should not erase the distinction too early.

Illegitimate characters should have offset benefits, such as:

- easier or earlier creation of their own family;
- bonuses or reduced costs when creating a separate family;
- access to separate-family creation even when legitimate heirs cannot yet do so;
- stronger benefits later when legitimate heirs eventually unlock equivalent family-creation options.

These benefits should create a different play path, not a strictly superior heir path.

### Adopted Children

Adopted children can become playable heirs through future Prestige-gated adoption rules.

Adopted heirs should generally fall between legitimate blood heirs and illegitimate offspring:

- more socially legitimate than illegitimate offspring;
- weaker bloodline/inheritance claim than direct legitimate offspring;
- potentially stronger household/legal recognition than an unlegitimized illegitimate child.

Prestige upgrades can reduce adoption penalties incrementally.

Penalty-reduction upgrades for adopted heirs should usually be family-specific because the value of an adopted child's recognition depends on family renown, legal posture, estate strength, and social standing.

## Mortality, Death, And Estate Trigger Posture

Death should cause an estate trigger when estate systems exist.

Retired or non-playable prior characters and ancestors should have a future death-event/chance model based on explicit inputs such as:

- age;
- average mortality age for ancestry/species/culture/world situation;
- location;
- wealth;
- social class;
- occupation or retired status;
- settlement safety;
- access to guards, medicine, sanitation, food, shelter, and community support;
- exposure to beast encounters, crime, subterfuge, betrayal, war, plague, famine, travel, or wilderness risk.

The model should follow a standard mortality progression over time.

Example design expectation:

- a retired character at 35 in a world/situation where average mortality is 42 has a low but increasing chance of death before 42;
- death at 36 should be possible but uncommon;
- survival to 50 should be possible but increasingly unlikely unless circumstances support it.

A wealthy merchant in a large city may expect longer life due to guards, sanitation, food access, and fewer beast encounters, but may have higher risks from crime, subterfuge, betrayal, rivalry, or political/economic conflict.

Mortality must not be pure random punishment. It should be explainable, world-situated, and derived from explicit risk categories.

## Betrayal And Inheritance Conspiracy Posture

A future betrayal feature may allow an heir to attempt to kill parents and/or other surviving heirs to inherit all or part of a previous estate.

This must be high-risk and owner-aware.

Potential success outcomes:

- inherit the full estate;
- inherit a portion of the estate;
- remove rival heirs from succession;
- create scandal, suspicion, or future renown penalties;
- create Chronicle/Bloodlines records of the act if exposed or later discovered.

Failure outcomes should be severe, including:

- player character death;
- permanent imprisonment;
- disinheritance;
- estate seizure;
- family renown collapse;
- religious/legal condemnation;
- rival-family retaliation.

This system must not exist until death, estate, inheritance, law/crime, imprisonment/death, and family-record consequences are all explicitly owned.

## Heir Creation Resolver Boundary

A future pure heir creation resolver should consume explicit inputs only:

- candidate offspring records;
- candidate adopted-child records;
- current Prestige heir capacity;
- current Prestige marriage/branch/adoption/legitimization unlocks when relevant;
- remaining unused-heir marriage-off capacity when relevant;
- current family/household recognition data if available;
- parent character/run evidence;
- legitimacy/recognition flags;
- naming-rule authority when family names may change;
- spouse or marriage authority when married-in or branch creation is requested;
- inheritance-share policy if a separate branch is requested;
- illegitimate/adopted penalty posture;
- applicable culture, religion, settlement, estate, title, or legal authority only if those systems exist;
- selected offspring/adopted-child id and requested heir creation action.

The resolver should return one of:

- `heir_candidate`;
- `adopted_heir_candidate`;
- `illegitimate_heir_candidate`;
- `married_in_candidate`;
- `married_off_candidate`;
- `branch_candidate`;
- `not_eligible`;
- `blocked`.

The resolver must not mutate saves, create characters, assign family records, grant titles, allocate estates, transfer dowries, spend Prestige, kill characters, jail characters, emit events, or update UI directly.

## Illegitimate Heir And Recognition Boundary

Illegitimate offspring are not invalid by default, but they require explicit rules.

Future planning must decide:

- whether the parent knows the child exists;
- whether the child is acknowledged;
- whether legal/religious/cultural recognition exists;
- whether estate/title inheritance allows the child;
- whether secrecy, dispute, blackmail, adoption, or legitimization can change eligibility;
- whether gameplay evidence can later prove or contest parentage.

No current implementation should assume illegitimate offspring are automatically eligible, automatically excluded, or automatically socially recognized.

## Prestige Unlock Candidate Catalog

Future Prestige unlocks may include:

### Account-Wide System Unlocks

- unlock heir creation;
- add one heir slot;
- add additional heir slots;
- unlock marriage system;
- unlock future-unused-heir marriage-off;
- increase future-unused-heir marriage-off cap;
- unlock past-unused-heir marriage-off;
- increase past-unused-heir marriage-off cap;
- unlock adoption system;
- unlock adopted-heir playability;
- unlock illegitimate-heir playability through required backstory/system support;
- unlock broad heir/family visibility panels;
- unlock broad heir creation resolver UI.

### Family-Specific Prestige Upgrades

- reduce illegitimate-heir inheritance penalty;
- reduce illegitimate-heir renown penalty;
- reduce adopted-heir inheritance penalty;
- reduce adopted-heir renown penalty;
- increase separate-branch inheritance share;
- improve legitimization outcomes;
- improve adoption recognition outcomes;
- improve married-off alliance or dowry quality where owner systems exist;
- improve estate-trigger outcomes;
- improve family-specific succession stability.

### High-Risk Or Late Unlocks

- betrayal/conspiracy access;
- reduced betrayal detection risk;
- reduced betrayal penalty if discovered;
- estate-contest access;
- branch closure or conversion into Chronicle Marks/Lineage Seals;
- title/estate inheritance paths once title/estate systems exist.

These are catalog candidates, not implementation approval.

## Non-Goals

This document does not implement:

- family records;
- offspring records;
- adoption records;
- romance/courtship;
- marriage/union rules;
- brothel or liaison systems;
- illegitimate-heir mechanics;
- adopted-heir mechanics;
- heir creation;
- married-in character creation;
- married-off heir systems;
- branch family creation;
- naming-rule data;
- dowry, boon, or marriage settlement behavior;
- inheritance-share behavior;
- Prestige spending;
- family tree mutation;
- estate/title/religion/settlement recognition;
- mortality events;
- estate triggers;
- betrayal/conspiracy behavior;
- death or imprisonment consequences;
- storage or persistence;
- UI;
- runtime events;
- gameplay behavior.

## 0.5.x Candidate Sequence

The safe `0.5.x` sequence is docs-first and pure-helper-first:

1. Offspring, Heir, And Family Continuity Owner Plan - this document.
2. Lore-Friendly Family Naming Convention Plan.
3. Family Visibility And Heir Slot Projection Plan.
4. Romance, Courtship, And Union Boundary Plan.
5. Marriage, Dowry, And Family Branch Boundary Plan.
6. Offspring Source And Legitimacy Plan.
7. Adoption And Wardship Boundary Plan.
8. Prestige Heir Slot Unlock Plan.
9. Prestige Marriage And Branch Unlock Plan.
10. Prestige Adoption And Legitimization Unlock Plan.
11. Unused-Heir Marriage-Off Unlock Plan.
12. Heir Creation Resolver Plan.
13. Heir Creation Resolver Helper.
14. Family Continuity Record Schema Plan.
15. Family Continuity Record Schema.
16. Retired Character Mortality And Estate Trigger Plan.
17. Betrayal And Inheritance Conspiracy Boundary Plan.

Only after those boundaries exist should estate, heirloom transfer, bequest claims, family-scoped Backstory Legacy unlocks, Bloodlines family-management actions, death events, inheritance mutation, or betrayal gameplay become implementation candidates.

## Guardrails For Future Prompts

Future prompts touching heirs, marriage, adoption, mortality, betrayal, or family creation must state:

- no automatic first-character family creation;
- no heir without in-game offspring or eligible adoption evidence;
- no Prestige-created children;
- no Prestige-created marriage, adoption, or spouse;
- no family creation from lineage/species id;
- heir slots are capacity only and are limited by actual eligible heirs;
- married-off offspring cannot also be used for heir creation;
- family creation normally occurs only through validated marriage, name change, household departure, adoption, legitimization, or branch-creation authority;
- heirs use origin family name by default unless lore-friendly naming rules say otherwise;
- married heirs remain visible in origin-family history;
- offspring should be visible on associated person/family records where supported;
- remaining heir slots should be visible only once unlocked;
- married-in character creation consumes an heir slot and makes the spouse the primary character;
- marriage, branch creation, additional heir choices, adoption, legitimization, and unused-heir marriage-off are Prestige-gated;
- no automatic legitimate status;
- no title, estate, religion, settlement, culture, dowry, boon, inheritance, mortality, betrayal, or imprisonment effect without owner systems;
- no explicit sexual content;
- brothel/liaison sources, if planned, remain adult-only, non-explicit, and fade-to-black;
- implementation must be narrow, validated, and owner-aware before runtime behavior.

## Open User Decisions

The following questions remain unresolved and should be answered before implementing schemas or helpers:

1. Should the default current setting assume a male-dominant naming/inheritance convention for all races until a race or region explicitly differs?
2. Which races or regions, if any, should use female-dominant, bilateral, clan-based, matrilineal, patronymic, matronymic, or house-based naming conventions?
3. Should married-in character creation be available only at new-run creation, or also as a mid-run handoff after marriage?
4. Should dowries be mostly material, social, legal, religious, or mixed by culture and settlement?
5. Should a dominant-character branch creation unlock begin at `0%`, `10%`, or another inherited-share value?
6. Should keeping the same family name while founding a new branch require a stronger Prestige unlock than taking a spouse's name?
7. Should spouse-origin families be generated, authored, or selected from existing settlement/family records?
8. Should illegitimate offspring ever be eligible for married-in or branch-creation paths without formal recognition?
9. What should the first account-wide heir-slot unlock cost and grant?
10. What should the first future-unused-heir marriage-off unlock cost and cap?
11. What should the past-unused-heir marriage-off unlock multiplier be relative to future-only unlocks?
12. Should adopted heirs inherit bloodline bonuses at reduced strength, inherit only estate/renown posture, or use a separate adoption benefit model?
13. Which mortality inputs should be modeled first: age, wealth, location, occupation/status, or world danger?
14. Should betrayal be player-initiated only, NPC/rival-initiated later, or both?
15. Should betrayal failure always be permanent death/jailing, or should lesser failures exist at high Prestige tiers?
