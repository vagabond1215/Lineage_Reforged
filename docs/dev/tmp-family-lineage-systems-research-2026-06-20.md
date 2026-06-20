# Temporary Deep Research: Family, Lineage, Households, Inheritance, Estates, and Generational Continuity

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research run from the user-provided family/lineage/inheritance prompt.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

The research pass examined family, lineage, households, inheritance, estates, bloodlines, dynasties, kinship, succession, property, family prestige, bequests, and generational continuity for Lineage Reforged.

The most important conclusion is that Lineage Reforged should not start with bloodlines or inheritance mechanics. It should start by defining a clean authority boundary between:

- individual person authority;
- household authority;
- family authority;
- kinship link authority;
- lineage authority;
- noble house / clan overlays;
- estate / property overlap;
- future player legacy state.

A robust model should separate persons, families/households, and relationship links rather than collapsing everything into a single family-tree record. Mature genealogy and archival approaches such as GEDCOM and Records in Contexts separate individuals, families, and relation records. This supports a first-pass design based on descriptive identity and graph validity instead of runtime inheritance or family simulation.

Recommended first implementation posture:

1. Docs-only family authority boundary decision.
2. Household vs family schema decision.
3. Kinship-link authority schema decision.
4. Household/family/kinship validators before any inheritance, estate, or player legacy runtime work.

## 2. Repository Inspection Caveat

The Deep Research report states that repository-specific file tree and file contents were not surfaced to the model beyond the user-supplied brief. Therefore, concrete repo facts about live collections, schemas, tests, validators, and records are unspecified in the research report and must be verified by Codex in the live checkout before creating any permanent design document.

The user-provided research specification targeted these paths for inspection:

- `packages/content/base/world/**`
- `packages/content/base/civilization/**`
- `packages/content/base/player/**`
- `packages/content/base/family/**`
- `packages/content/base/lineage/**`
- `packages/content/base/characters/**`
- `packages/content/base/npc/**`
- `packages/content/base/ownership/**`
- `packages/content/base/economy/**`
- `packages/content/base/items/**`
- `packages/schemas/**`
- `tools/content-lint/**`
- `tests/unit/**`
- `docs/design/**`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

Codex must treat this artifact as planning input, not proof that any referenced collection exists.

## 3. Current Gaps And Risks

Given the repo-state caveat, the main risks are architectural:

1. **Unit confusion**
   Household, family, lineage, estate, noble house, clan, and dynasty can easily be collapsed into one record. They should remain distinct until live content proves a simpler model is sufficient.

2. **Relationship duplication**
   Parentage, spouse links, guardianship, adoption, fosterage, and household membership can easily be stored on both person records and family records. Direct kin facts should have one canonical owner.

3. **Premature mechanics**
   Inheritance priority, property transfer, spouse rules, bequests, prestige scores, and heir succession should not become content authority in the first pass.

4. **Over-biologized bloodlines**
   Bloodline language can become deterministic and mechanically prescriptive. Prefer narrative heritage, social lineage, ritual identity, and Knowledge-gated legacy unless explicit canon requires more.

5. **Runtime/player state leakage**
   Player heirs, bequests, legacy continuation, marriage mechanics, children systems, property transfer, and family reputation should remain future runtime/save systems.

## 4. Recommended Family / Lineage Hierarchy

Recommended hierarchy:

- `person` / character / NPC;
- `household`;
- `family`;
- `lineage`;
- `clan` or `noble_house` where canon requires it;
- `dynasty` as a long-term political/social continuity overlay;
- `estate` parallel to family/lineage, not inside it;
- `player_legacy_state` as runtime/save state only.

Suggested conceptual model:

```text
Person / NPC / Character
  -> Household
  -> Family
  -> Lineage
  -> Clan or Noble House
  -> Dynasty

Family / Lineage may control or be associated with Estate
Player Legacy State may reference persons, households, estates, heirs, and bequests later, but remains runtime-only.
```

## 5. Individual, Household, Family, And Lineage Boundaries

### Person

Owns intrinsic identity, life status, and direct identity references.

Should not own the entire family tree.

Possible fields later:

- `id`
- `slug`
- `name`
- `status`
- `lifeStatus`
- `primaryHouseholdId`
- `familyId`
- `sourceAuthorityNotes`
- `notes`

### Household

Owns co-residence, domestic organization, and day-to-day dependency.

It is the best layer for residence, head-of-household, dependents, and household roles.

### Family

Owns socially recognized kin group identity, surname or family name if applicable, customary associations, member families/households, and public identity.

### Lineage

Owns descent-claiming continuity, historical branch identity, founder or ancestor references, and multi-generation continuity.

### Bloodline

Defer unless setting canon requires it. If introduced, it should be narrative/social/ritual/magical heritage, not default biological determinism.

### Estate

Owns property and obligation aggregate. A family may control an estate, but estate is not the same as family.

### Player legacy state

Runtime/save owner for heirs, succession, bequests, inheritance transfer, legacy continuity, and player death outcomes. It should not be static content authority.

## 6. Kinship And Relationship Model

Recommended ownership model: make direct kin facts first-class relationship/link records.

Author directly:

- parent-child;
- spouse/partner;
- former spouse;
- guardian-ward;
- adoption;
- fosterage;
- household membership;
- betrothal if canon requires it;
- disputed or rumored relationship claims.

Derive:

- siblings;
- grandparents;
- cousins;
- uncles/aunts;
- ancestor/descendant chains;
- most affinity relations.

Potential future `civilization.kinship_links` shape:

```json
{
  "id": "kinship_link.<person_a_slug>.<relation>.<person_b_slug>",
  "status": "planned",
  "relationType": "parent_child",
  "personAId": "person.example_a",
  "personBId": "person.example_b",
  "claimStrength": "recognized",
  "visibility": "public",
  "sourceAuthorityNotes": [],
  "notes": []
}
```

Important validation direction:

- no self-parenting;
- no parent-child cycles;
- no impossible self-ancestor loops;
- disputed/hidden relationships allowed only with explicit visibility and claim metadata;
- spouse/union coherence must be validated by a future marriage/union owner.

## 7. Marriage, Partnership, And Household Formation

Do not make marriage equal household.

Recommended split:

- household owns residence/domestic membership;
- marriage or union records own spouse/partner history;
- kinship links own relationship facts;
- family records own broader recognized kin identity.

Topics for later dedicated decision:

- marriage;
- remarriage;
- widowhood;
- divorce/annulment if canon supports it;
- adoption;
- fosterage;
- guardianship;
- household formation and dissolution;
- family alliances;
- dowry/bridewealth/contracts if setting requires them;
- religious/legal restrictions.

Sensitive or culturally variable topics should remain optional and descriptive until canon demands them.

## 8. Inheritance And Succession

Separate descriptive inheritance authority from runtime transfer behavior.

Safe early descriptive authority may include:

- inheritance tradition notes;
- named heir claims;
- customary succession modes;
- family succession notes;
- estate association;
- heirloom provenance;
- dispute flags;
- source authority notes.

Deferred runtime behavior:

- automatic property transfer;
- share calculation;
- bequest execution;
- heir priority calculation;
- income handoff;
- title/rank transfer;
- property storage mutation;
- family reputation effects.

Potential future collection:

- `civilization.inheritance_rules`

But this should come after household/family/kinship/estate boundaries are stable.

## 9. Estates, Property, And Ownership Overlap

Estates should remain separate from family identity.

An estate may include:

- homes;
- farms;
- workshops;
- shops;
- mines;
- ships;
- warehouses;
- inns/taverns;
- manors;
- noble estates;
- family businesses;
- heirlooms;
- land claims;
- leases/rent obligations;
- tax obligations;
- bequests.

Family/lineage records may reference estates as associations or control claims, but property ownership and transfer should remain property/estate authority or runtime save state.

Forbidden in first-pass family authority:

- property transfer;
- rent collection;
- tax calculation;
- estate income;
- shop inventory;
- storage state;
- ownership commands;
- runtime bequests;
- gameplay rewards.

## 10. Bloodlines, Traits, Heritage, And Legacy

Bloodline should be reserved for explicit setting needs.

Safe alternatives:

- lineage identity;
- family tradition;
- ancestral obligation;
- house reputation;
- craft tradition;
- religious association;
- heirloom provenance;
- magical/ritual heritage only if canon supports it.

Avoid default deterministic biological inheritance. Prefer authored narrative heritage and social inheritance.

If bloodlines are introduced later, require:

- explicit canon justification;
- descriptive-only first pass;
- no mechanical bonuses;
- no deterministic trait claims without setting proof;
- Knowledge-gated discovery options.

## 11. Family Prestige And Reputation

Family prestige should initially be descriptive and banded, not numeric simulation.

Potential future fields:

- `prestigeBand`
- `publicReputationNotes`
- `regionalStanding`
- `guildReputationNotes`
- `religiousReputationNotes`
- `politicalReputationNotes`
- `feudRefs`
- `patronageRefs`
- `debtObligationNotes`
- `disgraceNotes`

Forbidden early effects:

- favorability deltas;
- alignment changes;
- reputation score math;
- automatic discounts;
- social access grants;
- law exemptions;
- rank changes;
- reward triggers.

## 12. NPC, Character, And Player Integration

Authored NPCs and characters should link to households, families, and kinship links without owning all relationship facts themselves.

Recommended separation:

- authored canon: named people, known families, known households, historical lineages;
- generated once and saved: minor households, collateral kin, settlement population scaffolding if needed;
- runtime save state: player heirs, bequests, succession state, player family changes, descendants, household mutations.

Future player systems should not pollute static content authority.

## 13. Economy, Crafting, And Property Integration

Family systems will eventually interact with:

- family businesses;
- guild membership;
- inherited professions;
- family workshops;
- inherited recipes/techniques;
- household labor;
- estate income;
- property maintenance;
- family debt;
- dowries/bequests;
- heirloom tools/materials.

Do not implement economy/crafting/property mechanics in the family pass.

Recommended boundary:

- family describes kin/social identity;
- economy describes production/market context;
- estate/property authority describes controlled assets;
- crafting describes transformations and requirements;
- player runtime state later connects ownership and inheritance.

## 14. Law, Polity, Religion, And Culture Integration

Family systems may later reference:

- local laws;
- polities;
- noble houses;
- clans;
- religions;
- sacred sites;
- marriage restrictions;
- inheritance restrictions;
- adoption/guardianship rules;
- vows/oaths;
- inheritance disputes;
- exile/outlawry;
- family feuds.

These should be references to future law/polity/religion/culture authorities, not hardcoded family behavior.

Legal and political effects remain descriptive until dedicated systems exist.

## 15. Knowledge System Integration

Future Knowledge may identify:

- families;
- lineages;
- noble houses;
- clans;
- estates;
- heirlooms;
- ancestry claims;
- hidden/disputed parentage;
- inheritance traditions;
- family reputation;
- estate history.

Likely future Knowledge subject types:

- `family`
- `lineage`
- `noble_house`
- `clan`
- `estate`
- `heirloom`

Households may be too volatile for a first Knowledge subject unless historically notable.

Knowledge must not grant:

- inheritance rights;
- property transfer;
- marriage access;
- prestige points;
- favorability;
- law exemptions;
- social rank;
- gameplay rewards.

## 16. Proposed Content Collections And Schema Concepts

These are recommendations, not proof that these collections currently exist.

| Proposed collection | Purpose | First-pass priority |
|---|---|---:|
| `civilization.households` | co-residential domestic units | 1 |
| `civilization.families` | socially recognized kin groups | 2 |
| `civilization.kinship_links` | direct relationship facts | 3 |
| `civilization.marriage_records` | union/spouse history | later |
| `civilization.lineages` | descent-claiming continuity branches | later |
| `civilization.noble_houses` | political/elite family overlays | later |
| `civilization.clans` | broader descent/cultural kin structures | defer unless canon needs it |
| `civilization.estate_records` | property-and-obligation aggregates | after family/household |
| `civilization.inheritance_rules` | descriptive succession customs | late/docs-first |
| `civilization.family_businesses` | family-linked economic entities | after economy/property stable |
| `items.heirlooms` | heritage objects with provenance | later |
| `player.legacy_state` | mutable save-state continuity | 0.6+ runtime only |
| `player.heirs` | runtime claimant set | 0.6+ runtime only |
| `player.bequests` | runtime wills/transfers | 0.6+ runtime only |

## 17. Validation And Test Strategy

Early validation should focus on graph coherence and authority boundaries.

Validation ideas:

- strict records-only wrappers;
- canonical id/slug agreement;
- unique IDs;
- active parent authority checks;
- no person as their own parent/child/ancestor/descendant;
- no impossible parent-child cycles;
- spouse/marriage record coherence;
- household member references resolve;
- household-to-settlement or property anchors resolve;
- family-to-settlement coherence;
- family membership does not duplicate direct parentage ownership;
- estate/property ownership references resolve;
- inheritance rules do not reference missing law/polity/religion authority;
- no runtime ownership transfer fields;
- no gameplay reward fields;
- no duplicate relationship ownership across records.

Forbidden early fields:

- `inheritanceTransfer`
- `propertyTransfer`
- `legacyState`
- `heirPriorityRuntime`
- `marriageMechanics`
- `childrenGeneration`
- `prestigeScoreDelta`
- `favorabilityEffects`
- `alignmentEffects`
- `incomePerDay`
- `storageState`
- `uiState`
- `runtimeState`
- `gameplayEffects`

## 18. Authored-Vs-Generated Data Strategy

Fully authored:

- named families;
- important households;
- known lineages;
- noble houses/clans if canon requires them;
- major estates;
- major kinship links for canonical figures;
- heirloom provenance.

Derived:

- siblings;
- grandparents;
- cousins;
- ancestor/descendant chains;
- family tree displays;
- some inheritance claim summaries.

Generated once and saved:

- minor household rosters;
- collateral kin;
- generic settlement population family scaffolds if needed later.

Runtime-generated and saved:

- player heirs;
- descendants;
- bequests;
- succession state;
- marriage/children systems;
- household moves;
- property transfers;
- player legacy continuation.

## 19. Gameplay Integration Roadmap

Near term:

- authored family/household/kinship authority;
- validation-safe relationship graph;
- future Knowledge support;
- descriptive cross-links to settlement, economy, estate, religion, and polity contexts.

Mid term:

- family reputation descriptions;
- lineage lore;
- estate histories;
- heirloom provenance;
- non-mechanical succession traditions.

Long term:

- player heirs;
- legacy continuation after death;
- household economy;
- inheritance disputes;
- marriage alliances;
- estate transfers;
- family quests;
- dynastic reputation;
- Chronicle/legacy records.

## 20. Recommended Versioned Implementation Sequence

Suggested sequence:

1. `0.5.200 - Family Authority Boundary Decision`
   - docs-only;
   - decide person/household/family/kinship/lineage/estate/player legacy boundaries.

2. `0.5.201 - Household vs Family Schema Decision`
   - docs-only;
   - resolve first two easily conflated units.

3. `0.5.202 - Kinship Link Authority Schema Decision`
   - docs-only;
   - decide direct relationship ownership.

4. `0.5.203 - Household Schema And Validator`
   - schema/validator/tests;
   - no broad content seed.

5. `0.5.204 - Family Schema And Validator`
   - schema/validator/tests.

6. `0.5.205 - Kinship Links Schema And Validator`
   - graph/coherence validator.

7. `0.5.206 - Pilot Household And Family Seed Plan`
   - docs-only.

8. `0.5.207 - Pilot Household And Family Seed`
   - narrow content seed.

9. `0.5.208 - Marriage And Guardianship Boundary Decision`
   - docs-only.

10. `0.5.209 - Estate And Inheritance Boundary Decision`
    - docs-only.

11. `0.5.210 - Family Knowledge Subject Decision`
    - docs-only.

12. `0.6+`
    - player legacy, heirs, inheritance runtime, property transfers, family UI, Chronicle integration.

## 21. Open Questions

- Does current canon require bloodlines as a distinct layer, or are lineage and heritage notes sufficient?
- Are noble houses, clans, and dynasties already distinct in current setting canon?
- Does household membership need date/era intervals in the first schema?
- Will estates anchor to settlements, map features, or dedicated property/site authority?
- Should family Knowledge live under an existing domain or a future social/civilization domain?
- Which current live NPC/person authority should own person identity, if any exists?
- Is the first content seed better as a household, a family, or a kinship fixture?

## 22. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.200 - Family Authority Boundary Decision`

Goal:
Create a docs-only design decision defining the canonical boundary between individual person authority, household authority, family authority, kinship link authority, lineage authority, noble house/clan overlays, estate/property overlap, and future player legacy state.

Primary task:
Inspect the live repo, correct this research artifact where repo-state assumptions are stale, and create a permanent design decision:

`docs/design/family-authority-boundary-decision.md`

Required decisions:

1. Whether `civilization.households` should be the first implementation candidate.
2. Whether direct kin facts must live in `civilization.kinship_links` instead of person records.
3. Whether `civilization.families` and `civilization.lineages` must remain separate.
4. Whether `civilization.bloodlines` is deferred unless world canon requires it.
5. Whether estates remain separate from family identity.
6. Whether inheritance rules stay descriptive-only in `0.5.x`.
7. Whether player heirs, bequests, and legacy continuation are deferred to `0.6+`.
8. Whether family prestige remains descriptive-only and non-mechanical.
9. Whether household membership and spouse/parent relations require visibility and dispute metadata.
10. Which schema decision should come next after the boundary document.

Suggested commit message:

`docs(family): decide authority boundaries`

## External References Used By Deep Research

- FamilySearch GEDCOM Specification: https://gedcom.io/specifications/FamilySearchGEDCOMv7.html
- ICA Records in Contexts Ontology: https://www.ica.org/standards/RiC/ontology
- FAO Family Farming Decade: https://www.fao.org/family-farming-decade/home/en/
- FAO Identifying the Family Farm: https://www.fao.org/3/i4306e/i4306e.pdf
- Privacy, ethics, and data access: A case study of the Fragile Families Challenge: https://arxiv.org/abs/1809.00103
- Evolution of family systems and resultant socio-economic structures: https://arxiv.org/abs/2009.11035
- Emergence of Kinship Structures and Descent Systems: https://arxiv.org/abs/2105.08014
- Kinship Is a Network Tracking Social Technology, Not an Evolutionary Phenomenon: https://arxiv.org/abs/2204.02336
