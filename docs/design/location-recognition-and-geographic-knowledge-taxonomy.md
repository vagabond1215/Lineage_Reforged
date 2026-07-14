# Location Recognition And Geographic Knowledge Taxonomy

Date: 2026-07-14
Status: approved user-intent design boundary; documentation only

## 1. Decision Summary

Character-facing Knowledge must not remain a flat list of records titled `Recognizing ...`. Knowledge presentation and achievement progress should be organized into durable categorized brackets, beginning with a first-class `Knowledge -> Geography` branch.

Geography must use a faceted hierarchy rather than one exclusive continent-to-region-to-city tree. Physical geography, settlements and places, political geography, and cartography/navigation overlap. One subject may appear through several useful browse paths without changing its canonical owner or identity.

Location recognition must be evidence-based. An authored snippet such as `Recognizing Aurelis` or `Recognizing Millrun's Wheelrace Mills` currently identifies a possible unit of knowledge; it does not yet define the criteria by which a character can recognize that subject. Future recognition requires explicit learned clues, perceptible observed clues, interpretation requirements, contextual distinctiveness, aggregation rules, contradiction handling, and recognition states.

Kingdoms, empires, city-states, and comparable realms are polity objects, not physical-region objects. Political geography describes how a polity relates to physical places through separate future claims, borders, frontiers, administrative divisions, jurisdictions, seats, and historical overlays. A polity must not own physical geometry or silently convert a region into a kingdom.

This decision changes no schema, validator, content JSON, evidence state, progress state, runtime, UI, save, migration, asset, generated output, or gameplay behavior.

## 2. Current Repository Reality

The current repository has useful foundations but not the intended recognition system:

- `knowledge_domain.general_lore` currently owns settlement, settlement-district, settlement-site, and region snippets.
- The domain registry supports the group label `geography_travel`, but no dedicated Geography domain or character-facing taxonomy exists.
- Current location snippets contain one subject, prose, broad discovery-source declarations, progression metadata, and visibility metadata.
- Discovery sources are possible routes only; access, possession, proximity, map visibility, or entering a location does not grant knowledge.
- The evidence contract can validate broad source and location context, but it does not record which identifying clues were learned, perceived, interpreted, or matched.
- The first evidence-to-progress posture treats eligible evidence as flat additive proposals and defines no clue weighting, recognition threshold, confidence, contradiction, or completion rule.
- The current evidence schema does not yet cover every live place subject used by authored snippets, including settlement districts and settlement sites.
- Existing region, locality, settlement, district, site, map-feature, route, and map authorities own physical place identity and relationships.
- The approved polity decision reserves `world.polities` for durable political identity and explicitly keeps borders, claims, jurisdiction, control, occupation, and diplomacy in separate future overlays.

Therefore every current `Recognizing ...` location snippet must be interpreted as authored identification lore only. It must not be cited as proof that the game can determine whether a character recognizes that place.

## 3. Ownership Vocabulary

Use these concepts consistently:

- **Knowledge domain:** semantic subject family that owns supported subjects, categories, and evidence routes, such as future Geography.
- **Knowledge bracket:** character-facing category used for navigation, completion summaries, achievements, and presentation.
- **Taxonomy node or facet:** one browse or aggregation path within a bracket. It does not replace canonical subject identity.
- **Subject:** the canonical thing knowledge concerns, such as a region, settlement, district, site, map feature, polity, or border claim.
- **Containment relationship:** physical or administrative relationship between subjects, owned by world or political authorities rather than inferred from the Knowledge UI.
- **Recognition profile:** authored criteria describing how one subject may be distinguished from plausible alternatives.
- **Clue:** one learnable and potentially observable identifying fact.
- **Knowledge source:** a book, sign, map, picture, teacher, rumor, institution, Chronicle record, quest outcome, or other authorized route that can teach specific clues.
- **Observation occurrence:** a bounded event describing which clues were perceptible in a particular context.
- **Evidence:** validated proof that one character encountered an authorized source or observation relevant to one knowledge target.
- **Recognition result:** a derived state based on known clues, observed clues, interpretation, contradictions, and confirmation rules.

Knowledge presentation may project these authorities, but it must not invent containment, political ownership, clues, evidence, or recognition state.

## 4. Character-Facing Knowledge Hierarchy

The top-level presentation root is:

`Knowledge`

The intended Geography branch is:

`Knowledge -> Geography`

Geography should contain four parallel primary facets.

### 4.1 Physical Geography

Physical Geography concerns the natural and spatial world:

- continents and macroregions;
- regions and subregions;
- region localities;
- landforms and waters;
- rivers, bays, coasts, mountain ranges, ridges, passes, marshes, islands, and other semantic map features;
- climate and biome context when the knowledge is primarily spatial.

Climate, biome, habitat, flora, fauna, and ecology may cross-link to Natural World or Ecology knowledge. Geography should not duplicate their detailed scientific ownership.

### 4.2 Settlements And Places

Settlements And Places concerns inhabited and constructed places:

- settlements by scale or type, including cities, towns, villages, forts, citadels, monasteries, ports, and other supported forms;
- settlement districts and wards;
- settlement sites, buildings, facilities, landmarks, and named complexes;
- associated harbors, crossings, bridgeheads, gates, plazas, and other specific place owners;
- place relationships such as located-in, part-of, near, upstream-of, adjacent-to, and approached-from when a canonical authority owns them.

A convenient browse path may be:

`Continent -> Region -> Locality -> Settlement -> District -> Site`

That path is a projection of validated relationships, not the only canonical Knowledge hierarchy. Sites without districts, settlements spanning several localities, and cross-regional routes must remain representable.

### 4.3 Political Geography

Political Geography concerns political identity and territorial relationships:

- polity identities such as kingdoms, realms, empires, city-states, republics, confederations, principalities, and autonomous settlements;
- recognized, claimed, administered, occupied, disputed, tributary, or historical territorial relationships when their own authorities exist;
- borders, frontiers, marches, enclaves, exclaves, buffer zones, and disputed zones;
- administrative divisions and jurisdictions;
- capitals, seats, and associated places;
- historical border changes and conflicting accounts.

A kingdom is a `polity.*` subject. It is not a `region.*` subject merely because it occupies territory. A physical region may be associated with several polities across time, subject to overlapping claims, or divided by several jurisdictions.

### 4.4 Cartography And Navigation

Cartography And Navigation concerns practical spatial understanding:

- routes, roads, tracks, passes, crossings, river lanes, coasts, and sea lanes;
- direction, distance, sequence of landmarks, and relative position;
- map interpretation and map provenance;
- known hazards, seasonal accessibility, and route conditions when an approved owner exists;
- wayfinding instructions and landmark chains;
- differences between approximate, surveyed, historical, and misleading maps.

Travel visibility or map display does not itself complete this knowledge.

## 5. Why Geography Must Be Faceted

A single strict tree is insufficient.

Aurelis is simultaneously:

- a settlement in a physical locality and region;
- a royal port with associated districts and sites;
- a seat or anchor of a future polity relationship;
- a destination connected by roads and sea lanes;
- a subject of cultural and historical knowledge.

The same canonical subject should be reachable through several bracket paths. Taxonomy nodes should contain references to canonical subjects and relationship queries, not copies of place records.

Character-facing achievements should aggregate by stable brackets and facets. They should not depend on a subject having only one parent category.

## 6. Kingdoms, Borders, And Political Objects

The approved boundary is:

- **Polity identity** owns the durable identity of a kingdom, empire, republic, city-state, or comparable political entity.
- **Physical geography** owns regions, localities, landforms, waters, map features, and geometry.
- **Territorial claim or control overlays** later describe what a polity claims, administers, occupies, controls, disputes, or historically held.
- **Borders or frontier overlays** later identify the boundary between claims, jurisdictions, or control postures.
- **Jurisdiction** later owns where a body of law or administration applies.
- **Government** later owns how authority is organized at a given time.

A river or mountain range may physically mark a border, but the river or range remains a geographic feature. A separate political-border record states that a claim or jurisdiction uses that feature as a boundary.

Borders must support:

- precise, approximate, customary, surveyed, fortified, natural-feature-aligned, and disputed postures;
- overlapping or contradictory claims;
- current and historical validity;
- incomplete character knowledge;
- stale maps and outdated testimony;
- different public, local, legal, and practical understandings.

Do not add a `kingdomRegionId`, territory array, or border geometry directly to a polity identity merely to simplify Knowledge presentation.

## 7. Location Recognition Model

### 7.1 Knowledge Of A Place Is Not Recognition Of A Place

The system must distinguish:

- knowing that a place exists;
- knowing facts or descriptions about it;
- knowing one or more identifying clues;
- being able to identify it from a particular viewpoint or source;
- probable recognition;
- confirmed identity;
- familiarity or mastery.

A character may know the name Wheelrace Mills without recognizing it from the road. A character may recognize a working mill without knowing that it is specifically Wheelrace Mills.

### 7.2 Recognition Profiles

Each recognizable location should eventually have one canonical recognition profile. The profile should reference the canonical subject and contain authored clue definitions rather than duplicating the complete place record.

A future profile should be able to express:

- clue identity;
- sensory or informational modality;
- concise clue description;
- whether the clue is direct, strong, supporting, weak, contradictory, or confirming;
- the comparison scope in which it is distinctive;
- literacy, language, script, emblem, profession, skill, or prior-knowledge requirements;
- distance, viewpoint, lighting, weather, obstruction, audibility, operational-state, and accessibility constraints;
- stability or likelihood of becoming outdated;
- relationships to other clues;
- whether the clue may be learned from text, image, map, instruction, rumor, or direct experience.

The first implementation should prefer explicit rule bands over pretending that one universal numeric weight is accurate in every context.

### 7.3 Clue Modalities

Required future clue families include:

- `written_identifier`: names, signs, plaques, carved labels, milestones, harbor boards;
- `emblem_or_heraldry`: coats of arms, guild marks, religious signs, flags, seals, maker marks;
- `visual_form`: silhouette, roofline, construction material, color, height, towers, facade, layout;
- `structural_mechanism`: waterwheel, windmill sails, cranes, kilns, sluices, furnaces, defensive works;
- `spatial_relationship`: beside a bridge, upstream of a landing, beneath a cliff, opposite a temple, third gate after a plaza;
- `cartographic`: map position, route sequence, coordinate, coastline shape, surveyed relationship;
- `auditory`: bells, machinery, surf, market calls, forge noise, millstones;
- `olfactory`: smoke, salt fish, tannery odor, herbs, pitch, flour dust;
- `activity_or_use`: shipbuilding, threshing, milling, worship, military signaling, market exchange;
- `oral_identifier`: spoken name, local nickname, directions, warning, story, or description;
- `historical_or_cultural`: memorial event, founder, customary association, legend, ritual, or local saying.

### 7.4 Interpretation Requirements

Perception and understanding are separate.

Examples:

- Seeing letters does not mean the character can read them.
- Reading requires appropriate literacy, language, and script knowledge.
- Seeing a heraldic device does not mean the character knows which polity or institution it represents.
- Seeing a turning wheel does not necessarily mean the character understands a water-powered mill.
- Recognizing a mill mechanism may require common-world familiarity, a relevant practical skill, prior instruction, or an already learned clue.
- A distant silhouette may reveal towers but not inscriptions or machinery.
- A silent or damaged mill may not expose the same clues as an operating mill.

The system must support partial interpretation rather than converting every perceived object into its canonical meaning.

### 7.5 Contextual Distinctiveness

Clue usefulness is contextual.

A reddish-orange clay tile roof is:

- directly useful if it is unique in the comparison area;
- weak if half the district shares it;
- useful only in combination if paired with a rare tower, adjacent bridge, and known emblem;
- misleading if the roof has been replaced or the description is old.

Recognition must compare clues against plausible alternatives in the current context. A clue must not have one permanent identifying value independent of locality, visibility, and competing subjects.

Future evaluation should distinguish:

- globally unique;
- unique within a settlement;
- unique within a district or visible candidate set;
- uncommon;
- common;
- non-diagnostic;
- contradictory or outdated.

### 7.6 Learned Clues And Observed Clues

Knowledge sources should teach specific clues, not silently grant final recognition.

Possible source outcomes include:

- a written guide teaches a name, district, appearance, and neighboring landmark;
- oral directions teach a route sequence and local nickname;
- a picture teaches a facade or skyline but not exact location;
- a map teaches spatial position and route relations;
- a sign provides a direct identifier only when visible, authentic, legible, and understood;
- practical experience teaches the function of a waterwheel, kiln, crane, or other mechanism;
- repeated travel teaches approach views, neighborhood layout, and stable landmark chains;
- a rumor teaches a clue with uncertain reliability;
- a Chronicle record teaches historical identity but may be outdated for current recognition.

An observation occurrence should record which clues were perceptible and which were successfully interpreted. The recognition consumer should compare that result with the character's learned clues.

### 7.7 Aggregation And Confirmation

Rules must support these principles:

- one authentic, legible, understood, and trusted direct identifier may confirm identity;
- one common weak clue must never be sufficient merely because it matches;
- several independent supporting clues may establish probable or recognized identity;
- multiple clues that are merely restatements of one feature must not be treated as independent proof;
- contradictions must reduce or block recognition;
- stale or unreliable clues may produce uncertainty or misidentification;
- proximity, map visibility, catalog presence, or entering the owning settlement must not automatically recognize every subject within it.

The future implementation must define deterministic aggregation, but this decision does not select final numbers or formulas.

### 7.8 Recognition States

The character-facing model should support at least:

- `unknown`: no usable knowledge of the subject;
- `known_of`: knows the name or existence but cannot reliably identify it;
- `described`: knows one or more clues or facts;
- `possible_match`: current observation matches weak or incomplete clues;
- `probable_match`: several independent clues support the identity;
- `recognized`: sufficient valid evidence supports the identity;
- `confirmed`: a direct identifier or authoritative confirmation establishes identity;
- `misidentified`: the character has accepted the wrong subject identity;
- `outdated`: known clues are materially stale or contradicted by current evidence.

Recognition state is not the same as total lore completion, map revelation, travel access, service access, ownership, reputation, or achievement completion.

## 8. Examples

### 8.1 Aurelis

Possible learned clues:

- a sheltered southern deep-water bay;
- palace roads rising inland from the port;
- royal naval yards on the harbor frontage;
- terraced vineyards behind the city;
- crown harbor emblems or official signs;
- a known relation to the Thalos Run and Aurelis Bay.

Approaching by sea, the combined bay shape, naval yards, terraced slopes, palace approaches, and recognized harbor emblem may establish recognition. A readable and trusted official harbor board may confirm it. Merely seeing a large coastal city does not.

### 8.2 Wheelrace Mills

Possible learned clues:

- located in Millrun's Wheelwater Ward;
- positioned along the fast branch channel;
- multiple waterwheels and mill structures;
- near Towpath Landing;
- flour dust, millstone carts, or grinding noise;
- a wheel-and-sheaf emblem or written name board.

One waterwheel may identify a generic mill but not Wheelrace Mills. A red tile roof is weak if common locally. Several wheels on the correct branch channel, near the expected landing, with matching mill activity and emblem may establish recognition. A literate character reading a trusted name board may confirm it. Understanding why the wheels power the mill requires functional knowledge beyond simply seeing them.

## 9. Knowledge Progress, Completion, And Achievements

Character-facing achievements should be grouped by stable domains and facets rather than by a flat count of snippets.

Possible Geography achievement paths include:

- continents and macroregions known;
- regions and localities described;
- settlements known of;
- settlements recognized in the field;
- districts and sites confirmed;
- physical features identified;
- routes and approaches understood;
- polity identities known;
- borders or claims understood at a stated validity level.

Achievement aggregation must distinguish awareness, descriptive knowledge, field recognition, and confirmation. Reading one list of city names must not award the same result as reliably navigating to and recognizing those cities.

The UI may project a browse path such as:

`Knowledge -> Geography -> Settlements And Places -> Kaelvar -> Verdant Thalos -> Aurelis`

It may also project the same subject through:

`Knowledge -> Geography -> Political Geography -> <Polity> -> Seats -> Aurelis`

These are character-facing projections over canonical relationships, not duplicate Aurelis records.

## 10. Future Authority Direction

A later docs-first schema decision should evaluate the following separate authorities:

1. A dedicated `knowledge_domain.geography` record rather than continuing to place all location knowledge in General Lore.
2. A Knowledge taxonomy or bracket authority for hierarchical/faceted presentation and achievement aggregation. Do not overload the domain registry with mutable UI trees without a focused decision.
3. Expanded subject vocabulary for map features, routes, polities, territorial claims, borders, jurisdictions, settlement districts, settlement sites, and other approved place owners.
4. Location recognition profiles with explicit clue definitions.
5. Knowledge-source records that state which clues a book, sign, map, picture, teacher, institution, rumor, quest outcome, or Chronicle record can teach.
6. Observation occurrences that state which clues were perceptible and interpreted.
7. Evidence producers that validate source, clue, subject, owner, location, and occurrence relationships.
8. Recognition aggregation and contradiction rules.
9. Progress/completion rules that separate awareness, description, recognition, confirmation, and achievements.
10. Read-only UI projection only after the data and state owners exist.

No future pass should combine all ten layers into one implementation package.

## 11. Required Implementation Order

Preserve the active `0.6.5`-`0.6.7` static-content program.

After `0.6.7` acceptance, run a docs-first support pass named:

`Geographic Knowledge Taxonomy And Location Recognition Contract Plan`

That pass should:

1. inventory current location snippets, domain fields, evidence/progress schemas, subject vocabularies, skills, place authorities, map/route authorities, and polity/border decisions;
2. decide the first Geography domain and taxonomy-node contracts;
3. decide recognition-profile and clue contracts;
4. decide how source records teach clues;
5. decide how observation occurrences expose clues;
6. close the settlement-district and settlement-site evidence subject gap;
7. decide political-geography subject ownership without implementing borders or claims by inference;
8. select one smallest implementation package;
9. preserve current runtime-consumer candidates until the support pass completes.

The support pass must not reinterpret existing `Recognizing ...` snippets as completed recognition criteria.

## 12. Acceptance Principles For Future Work

Future recognition work is acceptable only when it can prove:

- every recognition profile targets one canonical subject;
- every clue has a stable identity and explicit modality;
- every learned clue has an authorized source and beneficiary;
- every observed clue comes from a bounded occurrence;
- literacy, language, emblem, practical-knowledge, perception, and context requirements are explicit where relevant;
- common clues cannot independently identify a subject;
- contextual distinctiveness and plausible alternatives are considered;
- contradictions and outdated clues are representable;
- direct confirmation is distinguished from probable recognition;
- no knowledge, recognition, achievement, map, access, service, reward, or gameplay state is granted by catalog presence alone;
- polity, claim, border, jurisdiction, and physical geography remain separate authorities;
- UI remains a projection and does not become recognition authority.

## 13. Active Pipeline Boundary

This decision is durable but queued. It does not displace `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`, `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`, or `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`.

Every active and generated prompt in that sequence must preserve this decision and the post-`0.6.7` support route. Existing location snippets remain valid static lore records, but they must be described as structural authored knowledge rather than full recognition mechanics.