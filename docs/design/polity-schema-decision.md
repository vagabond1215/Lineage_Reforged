# Polity Schema Decision

Version: `Version 0.5.225 - Polity Schema Decision`

Status: approved documentation-only schema posture

## 1. Decision Summary

Approve future `world.polities` as the static authored authority for durable political identity. A polity record identifies a political entity and its descriptive form and place anchors. It does not own government organization, rulers/offices, jurisdiction, law, citizenship, borders, claims, control, occupation, vassalage, diplomacy, conflict, factions, institutions, forces, taxation, enforcement, or player state.

Keep the first contract deliberately narrow: identity, aliases, summary, polity form, typed physical-place anchors, authored-record lifecycle, provenance, and notes. Do not infer polity identity from settlement administrative role/type/tags, region prose, map labels/conflict zones, guild or religious organization presence, generated civil/military operators, titles, families, or runtime status.

Vassal, disputed, and occupied are not polity forms. They are later relation, claim/control, or conflict postures. An autonomous settlement may be a polity only when an explicit `polity.*` record says so.

No schema, validator, content, test, loader, lint registration, government, jurisdiction, law, faction, institution, force, diplomacy, conflict, legal-status, runtime, UI, storage, migration, command, event, reward, taxation, enforcement, or gameplay change is authorized by this decision.

## 2. Live Repo Reality

- No polity, government, jurisdiction, law, faction, general institution, court, guard-force, garrison, military-force, diplomacy, political-claim, border, citizenship, or conflict collection/schema exists.
- `world.settlements` contains 88 records with `administrativeRole`, settlement hierarchy, civic/military tags, guild presence, and prose such as royal capitals. Those fields describe places; they do not establish political identity or sovereignty.
- `world.regions` contains 41 physical region records and political/civilization prose. `world.region_localities` contains 47 locality bands. Neither collection owns polities or claims.
- The single world-map record embeds four broad `conflictZones`. They are map summaries without canonical conflict ids, participants, status, control, or runtime authority.
- `civilization.guilds` contains 18 guild identities. Guilds remain corporate/economic authorities, not polities, factions, or governments.
- One religion embeds six religious-order identities; one sacred site and one religious hotspot layer exist. Religious presence does not establish temporal sovereignty.
- Settlement simulation and institution/property projections synthesize civil, military, noble, guild, company, household, and player operator ids plus local property/legal/access labels. These are derived runtime/projection owners, not authored political entities or law.
- Player reputation owns scoped fame/notoriety and crime-category recognition. It does not own citizenship, faction standing, wanted state, court state, or polity membership.
- Knowledge includes broad institution/faction vocabulary but no canonical polity/government/jurisdiction/law subject authority.

The temporary civic research correctly separates civic layers but could not fully inspect the live tree. This decision corrects its absence and ownership claims through the current checkout.

## 3. Existing Civic, Geography, Settlement, Guild, Religion, Economy, Family, Knowledge, Map, and Runtime Surface Inventory

Existing owners remain distinct:

- regions, localities, settlements, map features, hexes, and map assets own physical place and display geometry;
- settlement `administrativeRole`, identity/purpose tags, hierarchy, and guild presence remain descriptive place fields;
- world-map conflict zones remain broad legacy summaries;
- guild records own guild identity and corporate activity posture;
- religion, religious orders embedded in religion, religious hotspots, and sacred sites own religious identity/context;
- economy/workplace/infrastructure owners retain production, markets, jobs, facilities, and simulation;
- family/people decisions reserve households, families, noble houses/dynasties, people, and NPC overlays as separate authorities;
- Knowledge remains informational;
- runtime projections own derived settlement authorities, property/legal labels, start-access posture, military/civic staffing, and reputation behavior.

No existing field or projection should be renamed, migrated, normalized, or promoted into `world.polities` in this pass.

## 4. Polity Collection Posture

`world.polities` is the future static authored political-identity collection.

A record represents one explicitly canonical political entity that persists as an identity even when its government, ruler, territory, diplomatic relationships, or control changes. Historical or retired entities may remain records when canon requires stable reference.

The collection is world-owned because it identifies political entities that reference physical world places. Government, administration, law, social actors, and mutable player/civilization state remain separate civilization/runtime layers.

Do not create parallel kingdom, realm, city-state, empire, confederation, or autonomous-settlement collections. Those are polity forms within one identity authority.

## 5. Candidate Paths, Wrapper, Ids, Slugs, and Record Lifecycle

Approve these future paths and identity rules:

- content: `packages/content/base/world/polities.json`;
- schema: `packages/schemas/world/polity.schema.json`;
- logical collection: `world.polities`;
- wrapper: strict object with exactly `records` in the first pass;
- record id: `polity.<slug>`;
- slug: lower snake case matching the id suffix;
- record lifecycle `status`: `planned`, `active`, or `retired`.

`planned` means a non-live authored candidate. `active` means the identity and all required references are current valid authority; it does not imply sovereign recognition, territorial control, peaceful status, or runtime power. `retired` preserves historical identity without asserting present operation.

Lifecycle status must not encode vassalage, occupation, dispute, war, government continuity, legal recognition, or player relationship.

## 6. Minimum Polity Record Contract

Approve this future minimum record posture:

- `id`: required canonical `polity.<slug>` id;
- `slug`: required matching lower-snake-case slug;
- `name`: required canonical public name;
- `aliases`: required array, empty when none;
- `summary`: required concise identity description;
- `polityForm`: required controlled form vocabulary;
- `placeAnchors`: required non-empty typed array of descriptive physical-place references;
- `status`: required `planned`, `active`, or `retired` authored lifecycle;
- `sourceAuthorityNotes`: required non-empty provenance/authority notes;
- `notes`: required descriptive notes array, empty when none.

Each `placeAnchors` entry should contain `placeType`, `placeId`, and `anchorRole`. First-pass place types are `region`, `region_locality`, and `settlement`. First-pass roles are `identity_anchor`, `seat_reference`, and `associated_place`.

An anchor is not a border, ownership record, claim, jurisdiction, control zone, administrative assignment, route, tax area, law scope, spawn area, or map geometry. `seat_reference` identifies an authored public seat association without defining the government or current ruler.

Do not add parent polity, ruler, capital-government, government id, territory arrays, subject populations, official religion, language, culture, military, treasury, tax, law, succession, title, faction, citizenship, diplomacy, control, or gameplay fields in the first contract.

## 7. Polity Form and Status Vocabulary

Approve these first-contract `polityForm` values:

- `kingdom`;
- `realm`;
- `city_state`;
- `republic`;
- `confederation`;
- `tribal_confederacy`;
- `empire`;
- `principality`;
- `temporal_religious_state`;
- `trade_league`;
- `autonomous_settlement`.

Forms describe public political identity, not detailed government structure. `republic` does not define councils or elections; `temporal_religious_state` does not redefine religion or grant divine authority; `trade_league` is a polity only when explicit canon establishes political identity beyond a guild/institution; `autonomous_settlement` requires an explicit polity record.

Do not include `noble_domain` in the first vocabulary because it may be an estate, noble-house association, or subordinate claim rather than a polity. Do not include `vassal_polity`, `disputed_polity`, or `occupied_polity`: vassalage, dispute, and occupation are relationship/control conditions, not durable form.

Do not add a second political-status enum to the first record. Lifecycle `status` is authored-data posture only; recognition, sovereignty, dependence, occupation, dispute, and control wait for later overlays.

## 8. Physical Place, Settlement, Region, Locality, Map, Border, and Claim Boundary

Polities reference physical places; they do not own or redefine them.

First-pass anchors may resolve to active regions, region localities, and settlements. Polity records must not copy place names, hierarchy, coordinates, pixels, hexes, geometry, boundaries, terrain, climate, biome, ecology, resources, routes, POIs, map assets, or travel data.

Sacred sites, religious hotspots, and other specialized places are excluded from first-pass polity anchors. A later typed relation may associate them with jurisdictions, protected places, institutions, claims, or historical context without moving their identity into polity records.

Borders, political regions, claims, disputed areas, occupation, administration, control, and cultural reach require separate future overlay authority. Existing region prose and four world-map conflict zones are not canonical claims/conflicts and must not be converted by inference.

An `autonomous_settlement` polity requires both an explicit polity record and a settlement anchor. Settlement type, `administrativeRole`, `regional_capital`, `royal_port`, fort/citadel tags, parent/dependency relationships, map labels, guild presence, or prose cannot create polity status.

## 9. Polity vs Government Boundary

A polity owns durable political identity. A future government authority owns how authority is organized at a particular time: governing body, offices, ruler/council references, succession/selection posture, administration, mandate, and temporal association with a polity.

Settlement government is also separate. A settlement may host a seat, offices, courts, or administration without becoming a polity, and a polity may span or outlive multiple settlement-government arrangements.

The first polity record must not include government structure, ruler/person ids, offices, councils, ministries, succession, elections, charters, administrative tiers, settlement-government arrays, or government history. A later government decision must define cardinality and time/validity before any `governmentId` is added.

Derived `civil_authority`, `military_authority`, noble, guild-charter, market-charter, and garrison ids from settlement projections remain runtime/projection labels and are not government records.

## 10. Polity vs Faction, Guild, Institution, Family, Noble House, Religion, and Settlement-Government Boundary

Polities, factions, guilds, institutions, families, noble houses, dynasties, religions/orders, and settlement governments retain separate identities.

- existing `civilization.guilds` remains guild identity authority;
- future factions own organized political/social interests or pressure groups;
- future institutions own durable civic, administrative, judicial, scholarly, charitable, or religious bodies not better owned elsewhere;
- households/families/noble houses/dynasties remain family-layer authorities;
- religions and religious orders retain religion authority;
- settlement government remains local administrative organization.

A family, noble house, dynasty, religion/order, guild, faction, or institution may later govern, sponsor, claim, recognize, oppose, or participate in a polity through typed links. It must not replace the polity record or be embedded as duplicate identity.

Do not infer a polity from guild dominance, religious order presence, sacred sites, settlement guild presence, noble/royal prose, player titles, family Prestige, backstories, or synthetic operator ids.

## 11. Jurisdiction, Law, Citizenship, Status, Crime, Court, Guard, Tax, and Enforcement Boundary

Jurisdictions, law codes, local laws/ordinances, citizenship/legal statuses, courts, guard/garrison/force identities, taxation, and enforcement remain separate future authorities.

A jurisdiction defines applicability and scope; a law record describes doctrine/rules; a court/institution owns adjudicative identity; a force owns descriptive mandate/affiliation; runtime owns cases, wanted/bounty state, arrest, patrols, enforcement, punishment, tax collection, and outcomes.

Polity records must reject:

- jurisdiction or law arrays, legal text, court structures, rights/duties, citizenship classes, legal-status values, crime definitions, punishments, fines, bounties, wanted levels, prisons, guard rosters, patrol/spawn tables, military strength, tax/toll/tariff/customs rates, collection rules, exemptions, and enforcement fields;
- player or NPC citizenship, faction standing, lawful standing, property `legalStatus`, start access, immunity, permits, licenses, service access, or legal history.

Existing `LegalStatus`, `StartLawfulStanding`, civil/military access, property-title labels, and fame/notoriety runtime types remain their current narrow owners. They are not static polity law.

## 12. Diplomacy, Conflict, Vassalage, Occupation, Control, and War Boundary

Claims/borders/control, diplomatic relations, vassalage, occupations, and conflicts belong in later separate overlays, never mutable arrays on polity records.

Future overlays may describe participants, relation/conflict type, public recognition, place targets, start/end or era posture, visibility, provenance, and notes. They must distinguish claims from control, control from legal jurisdiction, vassalage from government, and historical conflict from current runtime war state.

The first polity record must not include ally/enemy lists, parent/subject polity, claims, controlled regions, borders, occupied places, disputed places, vassal/overlord ids, recognition matrices, truces, wars, fronts, military campaigns, war goals, diplomacy scores, control percentages, or dynamic status.

Existing map `conflictZones` remain broad display summaries. They do not establish canonical conflicts, participants, claims, borders, occupations, diplomacy, or war state.

Dynamic diplomacy ticks, control mutation, border changes, occupation state, conflict events, war simulation, mobilization, patrols, encounters, and outcomes remain deferred to `0.6+`.

## 13. Knowledge, Quest, Chronicle, Economy, Travel, Player-State, Runtime, UI, Storage, Reward, Command, Event, and Gameplay Boundary

Future Knowledge, quests, events, Chronicles, economy, and travel authorities may reference active polity ids only after their typed reference branches are approved.

Knowledge may later describe polity identity/history but must not grant citizenship, legal knowledge effects, immunity, rank, access, reputation, diplomacy standing, rewards, or behavior. Quests/events/Chronicles may reference political context but must not mutate government, law, claims, control, diplomacy, conflict, player legal state, or polity lifecycle.

Economy retains production, markets, values, trade, workplaces, property, and simulation. Travel retains routes, security/hazards, journeys, and pathfinding. Polity references must not collect taxes/tolls, set prices, control routes, grant market rights, enforce customs, spawn guards, alter encounters, or change access.

Player/session/save/runtime owners retain fame/notoriety, future faction reputation, citizenship/legal status, wanted/bounty/case state, permits, access, diplomacy consequences, quest state, history, and UI projections.

Static polity records must reject runtime state, storage/save state, UI state, commands, events, rewards, mutation instructions, gameplay effects, and generated political simulation.

## 14. Future Schema and Validator Direction

`Version 0.5.237 - Polity Schema And Validator` remains the conditional implementation candidate after the docs-first queue.

That pass should create the strict schema, pure semantic validator, and focused in-memory tests only. It should not add live polity content, loaders, normal content-lint registration, governments, claims, laws, factions, institutions, forces, diplomacy/conflicts, Knowledge subjects, runtime state, UI, storage, or behavior.

Future validation should enforce:

1. strict records-only wrapper;
2. unique `polity.<slug>` ids/slugs and exact suffix agreement;
3. allowed lifecycle and polity-form vocabulary;
4. aliases/notes arrays are well-formed and place-anchor arrays reject duplicates;
5. typed region, region-locality, and settlement anchors resolve to active current authority;
6. anchor roles are controlled and never interpreted as geometry, claim, control, jurisdiction, or ownership;
7. autonomous settlements require explicit polity records and valid settlement anchors;
8. no inferred records from settlements, regions, maps, conflict zones, guilds, religions, families, titles, backstories, prose, or runtime operators;
9. no government, jurisdiction, law, faction, institution, family/noble-house, religion, claim, border, vassalage, diplomacy, conflict, force, tax, legal/player-state, runtime, storage, UI, command, event, reward, or gameplay fields.

After `0.5.237`, the existing conditional `Version 0.5.247 - First Polity Content Seed Plan` should select only explicit canon and prove its place anchors without inferring political identity from current prose.

## 15. Temporary Research Artifact Handling

Delete `docs/dev/tmp-civic-authority-systems-research-2026-06-20.md` in this pass.

Its useful polity, government, settlement-government, jurisdiction, law, crime/justice, faction/guild/institution, force, citizenship/status, claim/border, diplomacy/conflict, economy/tax, family/noble-house, religion, Knowledge, validation, authored/generated, and runtime boundaries are now permanently owned by `docs/design/civic-authority-boundary-decision.md`, this decision, and the future-content backlog. No named future consumer remains.

Future civic work must start from permanent design docs and a fresh live-repo audit rather than restoring or treating the temporary report as canon.

## 16. Non-Goals

- no schema, validator, content JSON, test, loader, normal lint registration, or migration changes;
- no polity seed content or government, jurisdiction, law-code/local-law, faction, institution, court, guard, garrison, military, diplomacy, conflict, claim, border, citizenship, status, crime, punishment, tax, toll, tariff, or customs schema/content;
- no Knowledge registry/snippet behavior or settlement, geography, guild, religion, economy, family, person/NPC, quest, travel, item, magic, or runtime authority changes;
- no player legal status, faction reputation, wanted/bounty/case systems, guard AI, patrols, court outcomes, law enforcement, diplomacy runtime, war simulation, tax collection, access grants, rewards, commands, events, UI, storage, or gameplay behavior;
- no compatibility aliases, political inference/migration, new Deep Research, or transition to `0.6.0`.

## 17. Next Recommended Version

Proceed with `Version 0.5.226 - Household vs Family Schema Decision`.

That run remains documentation-only. It should decide exact household and family collection/schema posture after the person/NPC decision, preserve kinship/lineage/noble-house/estate/player-family owners, and decide the family temporary research artifact's retirement.

No new GPT Deep Research is required before `0.5.226`. GPT-DR gates remain non-Codex labels, and permanent prompt-pack guidance does not interrupt the immediate numbered queue.
