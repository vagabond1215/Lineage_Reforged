# Location Recognition And Geographic Knowledge Taxonomy

Date: 2026-07-28

Status: accepted decision-complete design authority; documentation only

Source run: unversioned `Geographic Knowledge Taxonomy And Location Recognition Contract Plan`

Milestone impact: `supports_current_band`

## 1. Decision Summary

Geographic Knowledge and location recognition require separate authored and mutable owners.

- A future `knowledge_domain.geography` record belongs in the broad Knowledge domain registry.
- The narrow legacy `knowledge_domains.json` resource-identification model does not own Geography.
- Character-facing Geography facets belong in a separate future typed Knowledge-taxonomy owner, not in domain metadata, place records, or UI state.
- Location-recognition profiles own authored identifying clues for one canonical subject.
- Knowledge-source teaching records relate one authorized source to specific teachable clues.
- Observation occurrences and accepted observation results own what was perceptible and interpreted in one bounded context.
- Character Knowledge evidence/progress and future recognition state remain mutable character-owned state.
- Existing `playerState.geographicKnowledge` is a preserved legacy three-scope level projection, not evidence-based recognition.

Current `Recognizing ...` snippet titles and summaries remain structural authored lore. They are not clues, criteria, scores, thresholds, grants, observations, or recognition results.

This decision adds no content, schema, validator, test, runtime, UI, save, map, overlay, claim, border, jurisdiction, dependency, or gameplay behavior.

## 2. Verified Repository Baseline

The planning baseline was reproduced on clean synchronized `master` at `0872341b12ad5fced21cd725372447c6df1249be`. The isolated remote branch `origin/prep/integrated-gameplay-0-7-readiness-audit` remains unmerged and untouched.

### 2.1 Knowledge content

| Authority | Live posture |
| --- | --- |
| Broad domain registry | 7 records: 6 active and planned `knowledge_domain.arcane_lore`; no Geography record |
| Narrow legacy domains | 4 records: Flora, Fauna, Minerals, and General Lore |
| Knowledge snippets | 28 tier-1 records |
| Domain distribution | Flora 1, Fauna 1, Minerals 1, Ecology 3, Religion 4, General Lore 18 |
| Subject distribution | flora 2, fauna 2, mineral 1, region 2, religion 1, deity 1, religious hotspot 1, sacred site 1, settlement 4, settlement district 6, settlement site 7 |
| Category distribution | identification 24, habitat 1, regional variant 1, seasonality 1, cultural context 1 |
| Source distribution | book study 21, field identification 3, travel observation 4 |
| Prerequisites | 0 snippets declare prerequisites |
| Progression | all 28 use tier 1, completion weight 1, tier-completion participation true, and trial-unlock weight 0 |
| Visibility | all 28 are locked until discovered and have hidden summaries; 24 reveal subject identity and 4 do not |
| `Recognizing ...` titles | 24 |
| Trial policy content | 1 active Flora tier-1 eligibility policy; readiness and rewards remain null/empty |

All 18 General Lore snippets are location-related: one region cultural-context record, 4 settlement identification records, 6 district identification records, and 7 site identification records. The other live place-oriented snippets are one Ecology region record and Religion records for an active sacred site and active religious hotspot.

The broad registry already accepts group value `geography_travel`, but no record uses it. General Lore currently owns `region`, `settlement`, `settlement_district`, and `settlement_site` snippets.

### 2.2 Knowledge contracts and helpers

Seven Knowledge schemas exist:

- broad domain registry;
- narrow legacy domain;
- snippets;
- evidence;
- progress;
- trial policy;
- trial-readiness policy.

The snippet and broad-registry subject vocabularies include settlement districts and settlement sites. The evidence and progress schemas do not. Their subject enums stop at the older set and therefore cannot structurally represent 13 live district/site snippets.

The repository has pure helpers for domain validation, snippet validation, evidence validation and production, evidence acceptance proposal, progress validation, initialization, evidence-to-progress proposal, progress-application proposal, completion evaluation, trial-policy validation, eligibility, and readiness. Evidence/progress/readiness records remain test fixtures or inert proposals; there is no live evidence or progress content collection, canonical mutable storage owner, accepted occurrence adapter, or runtime/UI mutation flow.

The evidence validator currently:

- requires character ownership;
- requires the evidence domain/subject to equal its referenced snippet;
- accepts only a source type declared by that snippet;
- requires `sourceId` to remain null;
- restricts unresolved event, action, document, teacher, institution, quest-outcome, Chronicle, skill, and spell references to null or absence;
- validates continent/region/settlement acquisition context;
- does not record learned, perceived, interpreted, matched, contradictory, or stale clue identity.

Progress is character/snippet scoped, stores integer points plus consumed evidence ids, and is explicitly not a percentage, completion flag, recognition result, or persistence contract.

### 2.3 Skills and source-adjacent authority

There is no dedicated Geography, cartography, literacy, language, script, heraldry, or observation Knowledge skill.

Relevant live skills are:

- `skill.survival.navigation`;
- `skill.knowledge.general_lore`;
- `skill.knowledge.civic_lore`;
- `skill.knowledge.cultural_lore`.

They may be declared support references later. Skill rank never grants Geography knowledge or recognition.

Eight generic item identities have source-adjacent names: Blank Book, Blank Scroll, Ledger, Record Book, Record Scroll, Reference Book, Route Charts, and Signet Ring. They do not contain teaching assignments, clue content, document-instance authority, authenticity, language, script, or study-completion facts.

### 2.4 Place, map, route, and political authority

| Owner | Live posture |
| --- | --- |
| `world.regions` | 41 records: 5 continents, 4 island systems, 4 oceans, 28 subregions |
| `world.region_localities` | 47 locality records |
| `world.settlements` | 88 settlement records |
| `world.settlement_districts` | 14 active records |
| `world.settlement_sites` | 20 active records; 7 have null `parentDistrictId` |
| `world.sacred_sites` | 1 active record |
| `world.religious_hotspots` | 2 records: 1 active and 1 planned |
| `world.map_features` | 8 planned semantic feature records |
| `world.world_maps` | 1 metadata record with 4 descriptive major-trade-route summaries and 4 descriptive conflict-zone summaries |
| `world.world_map_features` | 1 visual/reference aggregate with geometry and zone collections |
| `world.world_hexes` / `world.world_hex_edges` | 47 semantic cells / 49 topology edges |
| `world.travel_networks` | 1 aggregate containing 12 route records and 8 inter-port ship lanes |
| `world.polities` | 2 planned identities, Valtherion and Draemor |
| Claims | no collection, schema, validator, or content |
| Borders/frontiers | no collection, schema, validator, or content |
| Jurisdictions | no collection, schema, validator, or content; explicitly not schema-ready |
| Governments | no collection, schema, validator, or content; explicitly not schema-ready |
| Generic `world.pois` | rejected and absent |

Semantic map features own named physical identity without geometry or topology. The visual aggregate owns reference geometry without semantic identity. Travel networks own current nested routes, topology, timing, and signage descriptions. Polities own planned political identity and descriptive place anchors, not territory or control. World-map conflict-zone strings are display summaries, not canonical conflicts or claims.

### 2.5 Current runtime, save, and UI reality

The shared snapshot has a persisted `playerState.geographicKnowledge` array:

```text
scope: continent | region | settlement
geographyId: canonical region or settlement id
level: non-negative number
```

The player engine validates and upserts those entries. Granting a settlement also grants its parent region and continent. New-game creation seeds the selected continent, region, and settlement at level 1. Accepted player travel currently grants the destination settlement and its parents at level 1. Save/load fixtures preserve the array.

The UI projects levels as Unaware, Unfamiliar, Familiar, Knowledgeable, Seasoned, and Intimate and groups them under Known Lands, Known Regions, and Known Settlements. Achievements and account-estate logic also read parts of this legacy state. `sessionState.knownLocations` and `playerState.discoveryChronicle` are separate current runtime/UI surfaces.

These are real current consumers and must not be described as absent. They are also not the clue/evidence recognition system selected here:

- the level has no source, clue, observation, interpretation, contradiction, confidence, or correction provenance;
- travel currently grants the level without an evidence-acceptance boundary;
- it covers only continents/island systems, other regions, and settlements;
- it does not cover districts, sites, semantic features, routes, polities, claims, borders, or jurisdictions.

Preserve current behavior until a separately authorized adapter/migration decision characterizes it. Do not silently reinterpret its numeric levels as the recognition states in this plan.

## 3. Controlling Ownership Vocabulary

- **Domain:** stable broad Knowledge subject family and source-policy metadata.
- **Taxonomy node:** authored browse/aggregation facet that references a domain and allowed relationship projections without copying subjects.
- **Subject:** one canonical record owned by its place, route, map, polity, or later political owner.
- **Recognition profile:** static authored criteria for distinguishing one canonical subject.
- **Clue:** one stable profile-owned learnable and potentially observable identifying fact.
- **Source teaching:** a static relation saying one authorized source may teach named clues.
- **Observation occurrence:** one owner-admitted bounded causal opportunity to observe clues.
- **Observation result:** the accepted deterministic or uncertain result listing what was perceptible and interpreted.
- **Evidence:** character-scoped accepted proof relating an authorized source/result to a Knowledge target.
- **Recognition state:** future character-owned result derived from accepted clue knowledge and accepted observations.
- **Projection:** UI, Chronicle, map label, marker, achievement, or report derived from authority without becoming authority.

## 4. Geography Domain Contract

### 4.1 Selected owner

The first Geography domain belongs in `player.knowledge_domain_registry` as future id:

`knowledge_domain.geography`

Do not add it to the narrow `knowledge_domains.json` collection. That legacy collection owns resource-identification thresholds and requires a dedicated Knowledge skill shape that Geography does not have. Extending it would conflate broad authored domains with the existing runtime assistance model.

### 4.2 Exact first record posture

A later seed may add exactly one planned broad-registry record with:

- `id`: `knowledge_domain.geography`;
- `slug`: `geography`;
- `name`: `Geography`;
- `summary`: `Physical, inhabited, political, and cartographic knowledge of canonical places and spatial relationships, without granting travel, reveal, or recognition.`;
- `group`: `geography_travel`;
- `wave`: `1`;
- `status`: `planned`;
- `canonicalSubjectTypes`: `region`, `settlement`, `settlement_district`, `settlement_site`;
- `supportedSnippetCategories`: `identification`, `historical_context`, `cultural_context`;
- `supportedDiscoverySourceFamilies`: `field_observation`, `textual_study`, `instruction`, `event_record`;
- `supportedDiscoverySourceTypes`: `travel_observation`, `book_study`, `teacher_instruction`, `institutional_study`, `quest_event`, `chronicle_record`;
- `defaultEvidenceOwnerScopes`: `character`, `institution`, `quest_event`, `chronicle_record`, `document_instance`, `teacher`, `study_event`, `travel_event`;
- `relatedSkillIds`: `skill.survival.navigation`, `skill.knowledge.general_lore`, `skill.knowledge.civic_lore`;
- `relatedContentCollections`: `world.regions`, `world.region_localities`, `world.settlements`, `world.settlement_districts`, `world.settlement_sites`;
- `relatedMagicSchoolIds`: empty;
- null trial, completion, and visibility policy references;
- schema-gap notes naming absent map-feature, route, polity, claim, border, and jurisdiction subject types;
- notes that current sources are possible evidence routes only, current place records remain canonical owners, and no source access, travel, map visibility, skill rank, or catalog presence grants knowledge.

It remains planned until a separate content migration/seed decision selects snippets and proves every subject/source/evidence contract. Existing General Lore snippets do not move automatically.

## 5. Geography Taxonomy Contract

### 5.1 Selected owner

Taxonomy belongs in a separate future static owner:

`player.knowledge_taxonomy_nodes`

The domain registry must not absorb a mutable UI tree, and canonical place owners must not carry Knowledge navigation state.

### 5.2 First bounded node family

The smallest coherent family is one root plus four parallel facets:

- `knowledge_taxonomy_node.geography`;
- `knowledge_taxonomy_node.geography.physical_geography`;
- `knowledge_taxonomy_node.geography.settlements_and_places`;
- `knowledge_taxonomy_node.geography.political_geography`;
- `knowledge_taxonomy_node.geography.cartography_and_navigation`.

Each future node owns only:

- stable id, slug, name, summary, and planned/active/retired lifecycle;
- `domainId`;
- nullable `parentNodeId`;
- a controlled facet key;
- allowed canonical subject types;
- allowed relationship-projection kinds;
- aggregation posture;
- provenance and non-grant notes.

Nodes do not own subject records, subject membership copies, geometry, routes, claims, character progress, completion, achievements, UI order, or visibility. UI may order/project nodes later.

Initially supported place subjects are only region, settlement, settlement district, and settlement site. Region localities, map features, routes, maps, polities, claims, borders, and jurisdictions remain blocked until their specific Knowledge subject vocabularies and lifecycle rules exist.

## 6. Recognition Profile And Clue Contract

### 6.1 Selected owner

Future static owner:

`player.location_recognition_profiles`

Record id:

`location_recognition_profile.<subject_type>.<subject_slug>`

Each profile targets exactly one canonical subject and must resolve that subject through its actual owner. No subject is created by a profile.

The first eventual profile vocabulary should be limited to active settlements, districts, and sites. Planned map features and polities are not eligible until their lifecycle and Knowledge subject decisions permit them.

### 6.2 Profile fields

A future strict profile owns:

- id, subject type, subject id, status, summary;
- comparison scope;
- globally unique embedded clue ids;
- confirmation and contradiction bands expressed as rule categories, not final balance numbers;
- provenance and notes.

It must not own geometry, discovery state, map reveal, character progress, recognition results, rewards, access, or runtime behavior.

### 6.3 Clue identity and vocabulary

Clue id:

`location_recognition_clue.<profile_slug>.<clue_slug>`

Required modality vocabulary:

- `written_identifier`;
- `emblem_or_heraldry`;
- `visual_form`;
- `structural_mechanism`;
- `spatial_relationship`;
- `cartographic`;
- `auditory`;
- `olfactory`;
- `activity_or_use`;
- `oral_identifier`;
- `historical_or_cultural`.

Required evidence-role vocabulary:

- `direct`;
- `strong`;
- `supporting`;
- `weak`;
- `contradictory`;
- `confirming`.

Each clue also declares:

- concise observable description;
- distinctiveness scope: global, region, settlement, district/candidate-set, uncommon, common, or non-diagnostic;
- independence group so restatements of one feature do not count as independent proof;
- interpretation requirements;
- observation constraints;
- source modalities that may teach it;
- stability/outdated posture;
- optional canonical subject anchors used only as references.

### 6.4 Static, contextual, presentation, uncertainty, and state split

- The profile owns invariant authored clue meaning.
- The observation result owns context: distance, viewpoint, light, weather, obstruction, audibility, operational state, candidate set, and interpreted clues.
- UI owns hints and wording only.
- A named uncertainty channel may own accepted uncertainty evidence only when a domain contract authorizes it.
- Character evidence/progress/recognition owners store accepted mutable state.

One common weak clue never confirms identity. Several independent supporting clues may establish probable or recognized identity. One authentic, visible, legible, understood, and trusted direct identifier may confirm identity. Contradictions and stale clues can block, downgrade, or support correction. Exact aggregation numbers remain deferred.

## 7. Source-Teaching Contract

Future static relation owner:

`player.knowledge_source_teachings`

A teaching record relates:

- one canonical source type and source id;
- one recognition profile;
- a duplicate-free set of clue ids;
- teaching posture and reliability;
- literacy/language/script, emblem, skill, or prior-knowledge requirements where those owners exist;
- provenance and non-grant notes.

Source identity, teaching offer, accepted evidence, progress application, and presentation remain separate.

Current source classifications:

| Candidate | Current classification |
| --- | --- |
| `world_map.first_world` | map metadata/visual reference, not a possessed or studied source |
| Route Charts / Reference Book / other generic items | item identities only; no clue-teaching authority |
| Route `signage` objects | descriptive nested route data without canonical sign identity |
| Books/documents | no authored document-instance teaching owner |
| Teachers | no canonical teacher identity/teaching owner selected |
| Institutions | no canonical institution teaching relation selected; guild/place proximity is insufficient |
| Prior travel | accepted travel result and legacy level grant; potential future occurrence source only |
| Quest outcomes / Chronicle records | supported vocabulary, but no clue-teaching adapter |
| Pictures, rumors, oral directions | no canonical source records selected |

Until an exact source owner exists, `sourceId` remains null under current evidence validation. Access, possession, proximity, membership, travel, or UI display never completes teaching.

## 8. Observation-Occurrence Contract

Use the accepted occurrence taxonomy:

```text
request
  -> admission
       -> location observation occurrence
            -> accepted observation result
                 -> candidate clue evidence
                      -> owner acceptance
                           -> future recognition proposal
```

The location-observation domain owner must establish:

- stable request and admitted occurrence identity;
- canonical profile and candidate-subject references;
- owner-certified material inputs;
- causal location/travel/activity relation;
- deterministic same-tick discriminator;
- policy/profile/content versions;
- replay and idempotency posture.

An accepted observation result may list:

- perceptible clue ids;
- interpreted clue ids;
- blocked interpretation reasons;
- contradictory or outdated clue ids;
- applicable candidate subjects;
- confirmation evidence;
- named-channel evidence references when uncertainty was authorized.

The result does not mutate Knowledge, recognition, map visibility, or UI. A later evidence producer creates candidates; an acceptance owner resolves authority, duplicate/replay, sequence, and storage; an application owner applies only accepted changes.

Materially identical retry returns the existing occurrence/result. Different evidence ids claiming one occurrence require equivalence checks. Correction retains original authority and explicit supersession/reconciliation. Projection order, event-envelope ids, wall-clock time, and global insertion order cannot define identity.

Current travel can later provide a causal source through an adapter, but its automatic legacy `geographicKnowledge` grant remains separate until explicitly migrated.

## 9. Settlement, District, And Site Evidence Closure

Subject closure rules:

### Settlement

- Subject id resolves to one live settlement.
- Region and macroregion ancestry remain settlement/world authority.
- Evidence context settlement, region, and continent must agree.

### District

- Subject id resolves to one active district.
- `parentSettlementId` resolves to one live settlement.
- District subject identity encodes the same settlement slug.
- Evidence context uses the owning settlement and its region/continent.

### Site

- Subject id resolves to one active site.
- `parentSettlementId` resolves to one live settlement.
- A null `parentDistrictId` is valid and must not be inferred.
- A non-null district resolves to one active district with the same parent settlement.
- Site subject identity encodes the same settlement slug.
- Evidence context uses the owning settlement and its region/continent.

Current snippet validation already enforces these active-subject relationships. The evidence and progress schemas remain the blocking mismatch because they omit district/site subject types. No generic POI record or shortcut subject is permitted.

## 10. Political Geography Ownership Matrix

| Concept | Owner and current posture | Geography/recognition use |
| --- | --- | --- |
| Physical regions/localities | live world owners | canonical physical subjects after vocabulary support |
| Settlements/districts/sites | live specific owners | canonical inhabited-place subjects |
| Semantic map features | 8 planned records | blocked as Knowledge subjects until active/lifecycle and subject support |
| Visual geometry | one `world.world_map_features` aggregate | reference/presentation only; never subject identity |
| World map metadata | one `world_map.first_world` record | map identity/metadata only; not character knowledge |
| Hexes/edges | world topology owners | spatial/traversal input only; no reveal or recognition |
| Routes/ship lanes | nested under one travel network | route identity/topology input; no current Knowledge subject |
| Polities | 2 planned `polity.*` records | political identity only; blocked as active Knowledge subjects |
| Claims/control/occupation | no owner | unavailable; do not infer |
| Borders/frontiers | no owner | unavailable; physical feature alignment does not create a border |
| Jurisdictions | boundary decided but not schema-ready; zero ids | unavailable |
| Governments | boundary decided but not schema-ready; zero ids | unavailable |
| Conflict-zone summaries | 4 world-map descriptive entries | display context only; no canonical conflict or territory |

Political Geography projects typed relations when their owners exist. A region never becomes a kingdom by presentation. A polity place anchor is identity/seat context, not territory, control, claim, border, or jurisdiction. A river or mountain remains physical geography even if a future border record references it.

No border, claim, control, occupation, jurisdiction, government, geometry, overlay, or political inference is authorized by this plan.

## 11. Recognition States And Legacy-Level Boundary

Future clue-based recognition should distinguish:

- `unknown`;
- `known_of`;
- `described`;
- `possible_match`;
- `probable_match`;
- `recognized`;
- `confirmed`;
- `misidentified`;
- `outdated`.

These states are not the existing numeric level ladder. No direct mapping from Unfamiliar/Familiar/Knowledgeable/Seasoned/Intimate is approved.

Recognition is also distinct from:

- snippet points or completion;
- taxonomy/achievement aggregation;
- map reveal or route visibility;
- known-location UI lists;
- travel access;
- service access;
- reputation or public recognition;
- Chronicle presence;
- ownership and rewards.

## 12. Smallest Later Implementation Package

Selected future package:

`Settlement District And Site Knowledge Evidence Subject Closure`

Classification: current-band primary capability candidate in `0.6.x`, with no number assigned during this unversioned planning run. It materially closes a live cross-layer Knowledge contract but does not satisfy any `0.7.0` integrated-gameplay criterion. Activity Resolution reuse remains the immediate next documentation run before this package is scheduled.

### Allowed scope

- add `settlement_district` and `settlement_site` to the Knowledge evidence and progress schema subject enums;
- add exact focused fixtures for the 6 live district snippets and 7 live site snippets;
- prove target parity with the referenced snippet;
- prove active parent settlement closure;
- prove active district closure for non-null site district refs;
- prove null site district refs remain valid;
- prove planned/retired, unresolved, malformed, and cross-settlement subjects reject;
- prove existing Flora/Fauna/Minerals/General Lore behavior remains unchanged.

### Allowed files

- `packages/schemas/player/knowledge_evidence.schema.json`;
- `packages/schemas/player/knowledge_progress.schema.json`;
- only the existing pure Knowledge evidence/progress validators or adapters proven necessary by the signature/authority audit;
- only their focused unit tests and schema-file assertions;
- required coordination documents.

### Prerequisites

- fresh clean/synchronized repository audit;
- exact characterization of every evidence/progress helper that consumes subject enums;
- explicit authority inputs for districts and sites where semantic validation needs them;
- no change to snippet content, domain registry, legacy Geography levels, storage, runtime, UI, or saves.

### Fail-closed conditions

Stop if closure requires:

- weakening active-subject or parent validation;
- treating snippet parity alone as proof when required place authority is unavailable;
- adding generic POI authority;
- expanding to recognition profiles, source teaching, occurrence execution, persistence, or UI;
- migrating General Lore snippets;
- changing current travel grants or geographic level semantics.

The separate planned Geography domain seed and taxonomy/profile schema plans remain later packages. They must not be bundled into this closure.

## 13. Deferred Implementation Sequence

After the immediate Activity Resolution Existing-System Reuse Audit, retain this owner-correct sequence:

1. settlement district/site evidence/progress subject closure;
2. planned broad Geography domain seed;
3. taxonomy-node schema/validator plan and then its bounded five-node seed;
4. recognition-profile/clue schema and validator;
5. source-teaching schema and owner-specific source adapters;
6. location-observation occurrence/result contract implementation;
7. character evidence/recognition storage and accepted-only application;
8. legacy `geographicKnowledge` characterization, adapter, and migration decision;
9. read-only UI/taxonomy/achievement projection;
10. separately authorized map reveal, political overlays, or gameplay consumers.

Each item requires its own scope and acceptance evidence. No later step may be inferred from completion of an earlier static package.

## 14. Acceptance Rules

Future work must prove:

- every profile targets one canonical subject;
- every clue has stable identity, modality, evidence role, independence, and context;
- every learned clue has an authorized source and character beneficiary;
- every observed clue comes from an accepted bounded occurrence/result;
- interpretation requirements are explicit and use live owners;
- common clues do not independently identify a subject;
- contradictions, alternatives, uncertainty, stale knowledge, and correction are representable;
- accepted-only application is idempotent;
- district/site parent and lifecycle closure is enforced;
- physical geography, routes, maps, polities, claims, borders, jurisdictions, and UI stay in their owners;
- catalog presence, travel, access, possession, visibility, and prose do not grant recognition.

## 15. Explicit Non-Goals

- no content or snippet migration;
- no schema, validator, test, helper, or runtime change;
- no Geography domain or taxonomy content in this run;
- no recognition profiles or clues in this run;
- no source teaching, evidence, progress, storage, occurrence, command, event, save, or UI implementation;
- no change to legacy geographic levels or travel grants;
- no map reveal, fog of war, markers, routes, pathfinding, coordinates, geometry, overlays, borders, claims, jurisdictions, governments, or political control;
- no generic POI authority;
- no activity-resolution implementation;
- no modification of the isolated readiness branch.

## 16. Immediate Route

This Geography/recognition plan is accepted when its coordination and hygiene gates pass.

The immediate next run remains the unversioned `Activity Resolution Existing-System Reuse Audit`. The selected settlement district/site evidence closure is a later current-band candidate and does not displace that audit.
