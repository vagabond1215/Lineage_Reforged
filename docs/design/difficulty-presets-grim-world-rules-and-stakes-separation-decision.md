# Difficulty Presets, Grim World Rules, And Stakes Separation Decision

Status: accepted documentation-only design authority  
Date: 2026-07-21  
Scope: difficulty naming, RPG abstraction, harsh-world systems, Hardcore semantics, save/death stakes, and nutrition placement  
Implementation authorization: none

## 1. Decision Summary

Lineage: Reforged will separate three concerns that games often collapse into one menu:

1. **Difficulty preset** — how forgiving or punishing enabled mechanics are.
2. **World rules** — which systemic layers exist in the campaign.
3. **Stakes rules** — how saving, death, failure, and rollback are handled.

These are orthogonal authorities.

A difficulty preset must not silently enable a different world simulation. A harsh-world mode must not merely multiply damage, prices, hunger, or enemy health. A restricted-save or permanent-death mode must not be bundled into either one unless the player explicitly selects it.

The accepted player-facing difficulty names are:

- `Story`
- `Favored`
- `Mortal`
- `Forsaken`

`Mortal` is the expected default and replaces generic `Standard` naming in player-facing presentation. `Favored` and `Forsaken` are the thematic opposite pair. `Story` is the ordinary narrative-first RPG abstraction.

The accepted world-rule names are:

- `Heroic World`
- `Grim World`

`Grim World` is the campaign's Hardcore world-simulation ruleset. It changes the kinds of problems the player faces rather than acting as a linear difficulty scalar.

Restricted saving and permanent death remain a separate future stakes option. The preferred working name is `Ironbound`, but that name and its exact rules are not yet accepted as implementation canon.

## 2. Precedence

This decision supersedes the preset naming and Hardcore posture previously described in Sections 8 and 9 of:

`docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`

That decision remains controlling for:

- immutable base attributes;
- persistent developed adjustments;
- persistent structural-loss adjustments;
- current-attribute resolution;
- nutrition and recovery as stat-growth inputs;
- structural rebuilding through ordinary growth.

This decision controls how those mechanics are exposed, simplified, tuned, or supplemented by difficulty and world rules.

## 3. Comparative Design Finding

The useful pattern from established RPG and Hardcore implementations is not “increase every number.” The stronger designs separate ordinary difficulty from special rules that alter planning, information, logistics, persistence, or mortality.

Relevant patterns include:

- survival needs, weighted supplies, delayed healing, and injury-treatment rules existing separately from combat difficulty;
- reduced HUD assistance, landmark navigation, disabled fast travel, altered saving, and survival/economy rules forming an immersion mode;
- single-save or permanent-death rules stacking separately from ordinary encounter difficulty;
- Hardcore realms or characters changing death permanence and social rules rather than merely enemy statistics.

The accepted conclusion for Lineage: Reforged is:

```text
difficulty preset
  -> tunes forgiveness, thresholds, rates, warnings, and assistance

world rules
  -> selects the systemic reality simulated by the campaign

stakes rules
  -> selects save, rollback, defeat, and death permanence
```

## 4. Difficulty Preset Axis

### 4.1 Story

`Story` is a narrative-first, standard-RPG abstraction.

Its purpose is not merely to make combat easier. It removes or abstracts technical systems that are unnecessary for a conventional role-playing experience.

Story posture:

- ordinary combat and adventure remain playable;
- food may provide healing, morale, temporary benefits, or a broad `Well Fed` state;
- exact kcal, Protein Support, fat mobilization, structural atrophy, and rebuilding arithmetic are not required for ordinary play;
- hunger, thirst, sleep, exposure, disease, and body condition may be represented through broad narrative states or disabled consequences;
- persistent structural-loss adjustments are disabled;
- passive recovery is generous;
- survival mistakes do not create campaign-threatening spirals;
- tutorials, forecasts, quest guidance, and causal explanations are maximally clear;
- no player-facing macro optimization is required;
- technical Grim World systems, when selected, resolve through broad events and forgiving checks rather than detailed meters.

Story does not delete the underlying ownership architecture. It permits the runtime to bypass, collapse, or neutralize technical calculations through explicit difficulty rules rather than creating separate incompatible item or body-state truths.

### 4.2 Favored

`Favored` means favored by divine benevolence, fortune, fate, ancestry, patronage, or the world's metaphysical order.

It is the easier full-system mode.

Favored posture:

- all mechanics selected by the World Rules axis remain enabled;
- physical nutrition, recovery, current attributes, body condition, and structural-loss architecture remain coherent;
- healthy Energy and Protein regions are more forgiving;
- grace periods are longer;
- accumulation rates for harmful conditions are slower;
- recovery and rebuilding are faster;
- warnings occur earlier;
- forecasts and causal explanations are more precise;
- merchants, institutions, travel, and social systems may use more favorable uncertainty or outcome weighting where the owning system permits it;
- the player receives the complete game structure without the baseline harshness of Mortal.

Favored must not falsify physical food truth. A loaf contains the same authored kcal and protein across Favored, Mortal, and Forsaken. Favored changes thresholds, support, rates, and consequences.

### 4.3 Mortal

`Mortal` is the expected way to play Lineage: Reforged.

It replaces player-facing `Standard` naming.

Mortal posture:

- every mechanic selected by the World Rules axis is enabled;
- the core metabolism, nutrition, recovery, current-attribute, and structural-loss systems are active in Heroic World;
- the additional Grim World systems are active when Grim World is selected;
- baseline bands, rates, grace periods, and recovery rules apply;
- persistent structural loss is enabled but requires substantial sustained neglect, disuse, illness, injury, or combined deterioration;
- warnings and tutorials provide a gentle entrance without removing systems;
- early-game presentation teaches causal relationships progressively;
- ordinary mistakes are recoverable;
- persistent loss requires an extended failure pattern rather than one missed meal or one difficult day.

Mortal is gentle in onboarding, not incomplete in mechanics.

### 4.4 Forsaken

`Forsaken` is the thematic opposite of Favored.

It is the difficult full-system mode.

Forsaken posture:

- all mechanics selected by the World Rules axis remain enabled;
- healthy bands are less forgiving;
- grace periods are shorter but remain meaningful;
- harmful accumulation is faster and recovery is slower;
- rebuilding destroyed capacity is more demanding;
- scarcity, institutional pressure, hostile outcomes, and environmental consequences may use less favorable owner-approved weighting;
- warnings may be later or less precise, but required causal information must remain obtainable;
- no difficulty setting may create untelegraphed unavoidable punishment merely for being difficult;
- physical truth remains unchanged.

Forsaken is not the Hardcore world mode. It is a harsher tuning preset that can be combined with either Heroic World or Grim World.

## 5. World Rules Axis

### 5.1 Heroic World

`Heroic World` is the default fantasy-world posture.

It preserves a coherent and materially grounded setting while omitting technical social and biological burdens that do not need to be universal in a standard fantasy campaign.

Heroic World includes the accepted core systems:

- food, digestion, Energy, Stamina, hunger, satiety, hydration, and Protein Support according to difficulty;
- body condition, fat reserve, climate interaction, recovery, growth, and structural loss according to difficulty;
- ordinary crime, law, politics, trade, fraud, illness, and scarcity where authored by content or existing owner systems;
- contextual economy and social consequences;
- heroic affordances, reliable institutions, and readable counterplay sufficient for an ordinary RPG campaign.

Heroic World does not imply a literally perfect society. It means the game does not continuously simulate every harsh historical externality as a systemic player burden.

### 5.2 Grim World

`Grim World` is the Hardcore world-simulation ruleset.

It changes the campaign from curated heroic fantasy toward a causally harsh material and institutional reality.

Grim World must add systems or materially deepen existing systems. It cannot be implemented as a bundle of scalar multipliers.

Candidate Grim World modules are listed below. Their exact implementation requires separate owner contracts and may be introduced in phases.

## 6. Grim World Module Families

### 6.1 Health, sanitation, and contamination

Candidate systems:

- food-borne illness;
- water-borne illness;
- parasites;
- cross-contamination;
- sanitation quality;
- waste and latrine proximity;
- vermin exposure;
- unsafe butchery and preservation;
- spoiled-water and contaminated-container states;
- wound infection;
- untreated illness progression;
- shelter and bedding hygiene;
- settlement outbreak state;
- healer, apothecary, quarantine, and public-health responses.

These systems must be causal and inspectable. A character should become ill because of traceable exposure and risk, not because a hidden random punishment timer fired.

### 6.2 Material survival and logistics

Candidate systems:

- water-source quality and transport;
- fuel, shelter, clothing, drying, and washing requirements;
- deeper spoilage and preservation consequences;
- pack-animal needs;
- supply loss during travel;
- weather-driven road and transport disruption;
- storage pests;
- equipment maintenance and failure pressure;
- increased importance of local services and safe lodging.

Grim logistics should create planning and tradeoffs, not repetitive busywork without meaningful decisions.

### 6.3 Crime, violence, and personal security

Candidate systems:

- violent crime outside authored quest scenes;
- burglary, robbery, extortion, kidnapping, and protection rackets;
- unsafe districts, roads, inns, workplaces, and markets;
- witness reliability and imperfect enforcement;
- organized crime and patronage;
- retaliation and local protection networks;
- stronger consequences for visibly carrying wealth, rare goods, or political status;
- guards and authorities whose reliability depends on polity, class, corruption, relationship, and local capacity.

Crime risk must be contextual. Every settlement must not become uniformly murderous.

### 6.4 Taxation, service, and institutional burden

Candidate systems:

- tolls;
- household, land, market, guild, road, and emergency levies;
- mandatory military service, militia duty, labor service, requisition, or billeting where the polity has authority;
- debt, arrears, confiscation, and negotiated exemptions;
- arbitrary or corrupt assessment;
- legal privilege and unequal enforcement;
- patronage, office, citizenship, class, lineage, household, guild, and religious status affecting obligations.

These systems must be polity-, law-, status-, and event-owned. Grim World must not create one universal tax or conscription mechanic disconnected from the world's institutions.

### 6.5 Corruption, fraud, and market uncertainty

Candidate systems:

- adulterated food, medicine, fuel, metal, and textiles;
- false weights and measures;
- counterfeit goods or currency where setting authority permits;
- bribery, kickbacks, favoritism, and gatekeeping;
- manipulated scarcity;
- hidden defects;
- contract fraud;
- inspection, reputation, witnesses, guild guarantees, and legal recourse;
- insurance, surety, patronage, or escrow-like protections where culturally appropriate.

The existing mystery-assortment, item-inspection, merchant-permission, and knowledge boundaries remain applicable. Grim World deepens uncertainty and institutional response; it does not authorize arbitrary manifest rerolls.

### 6.6 Information and navigation friction

Candidate systems:

- imperfect maps and stale local information;
- uncertain merchant stock or service availability;
- rumors, misinformation, and conflicting testimony;
- reduced perfect knowledge of safety, law, disease, prices, and political risk;
- greater reliance on landmarks, guides, local knowledge, scouts, records, and relationships;
- optional reduction of HUD certainty.

Information friction must create discoverable gameplay. It must not simply hide facts the character should obviously know.

### 6.7 Persistence and world consequences

Candidate systems:

- persistent local shortages and outbreaks;
- longer-lasting injury, illness, debt, legal, and reputation consequences;
- NPC and household vulnerability;
- market recovery over time rather than instant restock;
- institutional memory;
- local displacement, labor shortage, recruitment pressure, and crime response;
- persistent effects from war, famine, epidemic, disaster, and political change.

Grim World should make the world remember events without requiring permanent death or restricted saving.

## 7. Nutrition Placement

The core nutrition model remains part of Mortal gameplay. It is not moved wholesale into Grim World.

Accepted placement:

| Concern | Story | Favored | Mortal | Forsaken | Grim World extension |
|---|---|---|---|---|---|
| food and broad satiety | simplified | full | full | full | full |
| exact internal kcal and macros | may be bypassed or hidden | retained | retained | retained | retained |
| digestion and Energy | simplified or neutralized | full and forgiving | full baseline | full and strict | full plus contamination/illness interactions |
| Protein Support and recovery | broad support state | full and forgiving | full baseline | full and strict | full plus illness/parasite/sanitation effects |
| fat reserve and climate | optional abstraction | full and forgiving | full baseline | full and strict | full plus harsher exposure/logistics |
| structural atrophy and rebuilding | disabled | enabled with long grace | enabled baseline | enabled strict | enabled according to selected difficulty |
| food/water-borne disease and parasites | broad narrative events if Grim selected | Grim-only systemic layer | Grim-only systemic layer | Grim-only systemic layer | enabled |
| sanitation simulation | broad narrative abstraction if Grim selected | Grim-only systemic layer | Grim-only systemic layer | Grim-only systemic layer | enabled |

This preserves the work already invested in meaningful meals, calories, protein, recovery, and body state while providing a conventional RPG experience in Story.

## 8. Stakes Axis

Difficulty and Grim World do not automatically control save or death permanence.

A future stakes contract should consider at least:

### Normal stakes

- ordinary manual and automatic saves according to platform and existing save authority;
- defeat and death resolve through accepted campaign rules;
- no permanent campaign deletion merely because the player selected Forsaken or Grim World.

### Ironbound stakes — working title

Potential rules:

- one authoritative campaign save or tightly limited save set;
- save-and-exit rather than unrestricted rollback;
- permanent character death, party death, lineage consequence, or campaign failure according to a later explicit decision;
- anti-crash and corruption recovery protections;
- clear opt-in warning;
- no silent activation after campaign start;
- independent combination with Favored, Mortal, Forsaken, Heroic World, or Grim World where technically supportable.

`Ironbound` is not yet authorized. It is recorded to prevent future work from incorrectly using `Hardcore` to mean both harsh-world simulation and permanent death.

## 9. Combination Rules

The axes should be combinable.

Examples:

| Difficulty | World rules | Result |
|---|---|---|
| Story | Heroic World | conventional narrative RPG with simplified survival and body systems |
| Story | Grim World | harsh themes and world events resolved through broad, forgiving abstractions |
| Favored | Heroic World | complete core game with benevolent tuning |
| Favored | Grim World | complete harsh-world systems with generous thresholds and recovery |
| Mortal | Heroic World | default intended Lineage: Reforged experience |
| Mortal | Grim World | default full harsh-world simulation |
| Forsaken | Heroic World | demanding core game without added Grim systemic layers |
| Forsaken | Grim World | most demanding systemic campaign without automatically changing save/death stakes |

Story plus Grim World is permitted. Story still disables technical micromanagement; Grim events and systems are projected through coarse states, authored choices, and forgiving resolution.

## 10. Difficulty-Owned Variables

Difficulty may tune:

- combat and challenge parameters owned by their domains;
- Energy and Protein consequence thresholds;
- grace periods;
- accumulation and recovery rates;
- structural-loss rate and floor;
- rebuilding rate;
- illness and contamination susceptibility when the relevant world systems are enabled;
- economic and institutional outcome weighting where the owning system permits it;
- warning lead time;
- forecast precision;
- tutorial and explanation depth;
- assistance, retry, and failure-recovery rules that do not belong to the Stakes axis.

Difficulty must not change:

- authored physical kcal or protein in food;
- the true manifest of an item or assortment;
- immutable base attributes;
- historical facts already established in the campaign;
- whether a selected World Rules module exists, except Story's explicit abstraction or neutralization of technical consequences;
- save or death permanence unless the player also selects a Stakes rule.

## 11. Grim World Design Requirements

Every Grim World system must satisfy:

1. **Causality** — consequences arise from traceable exposure, law, institution, event, or behavior.
2. **Telegraphing** — characters can obtain warnings, evidence, or contextual clues.
3. **Counterplay** — preparation, skills, equipment, knowledge, allies, money, status, or choices can reduce risk.
4. **Local variation** — regions, polities, communities, occupations, and institutions differ.
5. **Persistence** — meaningful consequences are not immediately reset.
6. **Proportionality** — ordinary life is not an uninterrupted sequence of catastrophes.
7. **No universal grimdark assumption** — kindness, competence, safety, law, trust, and functioning institutions continue to exist.
8. **No scalar duplication** — Grim World modules must not merely duplicate Forsaken's harsher rates.
9. **Owner separation** — disease, crime, law, economy, nutrition, activity, and saves retain distinct authorities.
10. **Manageable presentation** — the player receives decisions and causal summaries rather than mandatory spreadsheets.

## 12. Owner Matrix

| Concern | Owner |
|---|---|
| difficulty preset identity | difficulty/global-rules owner |
| Story/Favored/Mortal/Forsaken parameters | difficulty/global-rules owner plus domain-owned tunables |
| Heroic World versus Grim World selection | campaign/world-rules owner |
| Grim health and sanitation systems | health/body-state/environment/content owners under explicit contracts |
| crime and security | NPC/social/law/event authorities |
| taxation, service, and institutional burden | polity/law/economy/household authorities |
| fraud and market uncertainty | economy/transaction/item-observation authorities |
| information friction | Knowledge/UI/location/merchant projection owners |
| save restrictions and permanent death | save/campaign-stakes owner |
| nutrition physical truth | static nutrition and meal aggregation owners |
| nutrition consequences | body state plus difficulty |
| current attributes | attribute-resolution owner |
| presentation labels and explanations | UI only |

## 13. Implementation Sequence Recommendation

Do not implement Grim World as one monolithic package.

Recommended order:

1. difficulty and world-rules contract/schema;
2. Story/Favored/Mortal/Forsaken preset migration;
3. Heroic World/Grim World campaign selection and save identity;
4. core nutrition/current-attribute integration under the new preset names;
5. one representative Grim health/sanitation vertical slice;
6. one representative Grim social/legal vertical slice;
7. one representative Grim economy/fraud vertical slice;
8. information-friction projection;
9. persistent world-state integration;
10. separate Stakes/Ironbound decision and implementation, if accepted.

Each Grim module requires its own owner-aware acceptance and tests.

## 14. Required Validation

A later implementation must prove:

- Story does not require technical nutrition management;
- Favored, Mortal, and Forsaken share the same physical item truth;
- Mortal enables all mechanics selected by the World Rules axis;
- Forsaken changes tuning without silently enabling Grim World;
- Grim World adds systems rather than merely multiplying difficulty values;
- Story plus Grim World remains playable through coarse abstraction;
- nutrition remains core in Mortal Heroic World;
- disease and sanitation are not active as systemic universal burdens in Heroic World unless separately authored;
- save restrictions and permanent death do not activate from Forsaken or Grim World alone;
- campaign/save identity records all selected axes;
- changing permitted settings cannot corrupt body state, world state, or current attributes;
- one owner resolves each consequence.

## 15. Remaining Decisions

The architecture and names are accepted. Later focused work must determine:

1. exact numeric parameters for Favored, Mortal, and Forsaken;
2. exact Story abstractions and which technical state may be skipped versus computed invisibly;
3. the first Grim World vertical slice;
4. whether campaigns may change difficulty or world rules after creation and under what migration rules;
5. whether achievements or Chronicle records distinguish the selected axes;
6. whether `Ironbound` is the final stakes-mode name;
7. the exact death, defeat, save, and rollback rules for any future stakes mode;
8. which Grim modules are base-game priorities versus later expansions.

## 16. Explicit Non-Decisions

This decision does not:

- implement difficulty, nutrition, disease, sanitation, crime, taxation, conscription, corruption, saves, permanent death, UI, or world simulation;
- assign exact balance values;
- require every Grim World module to launch together;
- make ordinary cultures or peoples inherently diseased, criminal, corrupt, or violent;
- authorize universal mandatory service or taxation outside polity and legal authority;
- assign a release version;
- restore held Version 0.6.6;
- alter the immutable-base and current-attribute decision.