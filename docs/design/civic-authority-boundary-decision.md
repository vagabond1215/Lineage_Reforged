# Civic Authority Boundary Decision

Version: `Version 0.5.201 - Civic Authority Boundary Decision`

Status: approved documentation-only authority boundary

## 1. Decision Summary

Approve a docs-first civic authority route. The first implementation candidate is `world.polities`, but implementation must begin with a separate documentation-only polity schema decision.

Keep physical geography, polity identity, government organization, jurisdiction, law text, factions, guilds, institutions, public-order forces, diplomatic relations, conflicts, and mutable player state as distinct owners. First-pass civic records are descriptive authority only and must reject runtime, gameplay, enforcement, mutation, and simulation fields.

Player legal status, faction reputation, wanted/bounty systems, guard AI, courts runtime, diplomacy runtime, and war/conflict simulation remain deferred to `0.6+`.

This document consumes `docs/dev/tmp-civic-authority-systems-research-2026-06-20.md` as planning input, corrects it against the live repository, and does not make that temporary artifact canon.

## 2. Live Repo Reality

Live inspection found no authored polity, government, governance, jurisdiction, law, faction, institution, military, crime, or settlement-government collection and no corresponding schema. The proposed civic collections therefore remain future authorities.

Existing adjacent owners must be preserved:

- `world.regions`, `world.region_localities`, settlements, maps, map features, hexes, and travel networks own physical and spatial identity. `world_maps.json` has map-level `conflictZones`, but those are geographic/map descriptors, not canonical diplomatic or conflict records.
- Settlement records own place identity plus descriptive `administrativeRole`, identity/purpose tags, economic fields, and guild presence. They do not define a government, jurisdiction, or law-code authority.
- `civilization.guilds` and its strict schema already own broad guild identity, membership models, governed activities, facilities, and quest-board posture. Civic work must reference rather than recreate guilds.
- Civilization runtime derives settlement institution profiles from existing settlement, guild, religion, magic, and economy inputs. Those projections are runtime aggregation, not authored institution identity.
- Religions, religious hotspots, and sacred sites already own their descriptive religious identities. Civic records may reference but not absorb them.
- Player titles, skills such as Diplomacy, backstory text, quest content, and Knowledge's generic `institution` source vocabulary do not establish polity, law, faction, citizenship, or legal-status authority.

No live owner is a better fit for stable political identity than future `world.polities`.

## 3. Civic Authority Ownership Boundary

Civic authority is a set of linked layers, not one universal civic record:

- physical place answers where something exists;
- polity answers which durable political identity is involved;
- government answers how authority is organized;
- jurisdiction answers where, over whom, and for what subject authority applies;
- law codes and local laws describe rules and customs;
- factions, guilds, and institutions identify distinct organized actors;
- guard, garrison, military, and public-order records describe armed or enforcement bodies;
- diplomacy and conflict records describe relations between authorities;
- runtime/save owners later track changing player status and consequences.

Cross-links do not transfer ownership. No first-pass record may execute another layer's behavior.

## 4. Polity Authority Boundary

Future `world.polities` is approved as the first civic implementation candidate. A polity record owns stable political identity, polity form, public description, supported place or claim references, and descriptive status/provenance.

A polity is not a physical region, government, faction, noble house, religion, guild, jurisdiction, diplomatic relation, or current territorial-control simulation. It may reference those authorities only after their contracts exist.

Physical geography remains separate from political claims. Polity records must not redefine region boundaries, map geometry, settlement identity, routes, biome/ecology, or POIs. Territorial claims, borders, disputed control, and occupation belong to later overlays.

## 5. Government and Settlement Authority Boundary

Polity and government must remain separate. A polity is the political identity; a future government authority describes organization, authority style, offices, succession posture, and administrative structure. Government change must not require replacement of polity identity.

Settlement government is also distinct from settlement place authority. Existing settlement `administrativeRole`, purpose tags, fort/watch descriptions, economic metadata, and guild presence remain descriptive place context. Future settlement-government records may reference a settlement, polity, government, offices, charter posture, and local authority, but must not enforce law, collect taxes, grant access, issue rewards, or mutate player state.

Autonomous settlements may later qualify as polities only through explicit polity records; autonomy must not be inferred from settlement type or prose.

## 6. Jurisdiction Boundary

Jurisdiction authority must exist before law-code or local-law schemas. A future jurisdiction record owns applicability: place or domain scope, governing authority reference, covered subjects or persons, overlap posture, priority notes, public visibility, provenance, and supported temporal status.

Jurisdiction is not law text, physical geography, polity identity, government organization, court procedure, or enforcement behavior. Civil, settlement, customary, guild, religious, military, route, port, and other jurisdictions may overlap when canon supports them; overlap must be explicit rather than flattened into a single owner.

The later schema sequence must not create law records with free-form place or owner strings as a substitute for jurisdiction authority.

## 7. Law Code and Local Law Boundary

Future law codes own descriptive bodies of law, custom, charter, or doctrine. Future local laws or ordinances own narrower statements applied through an explicit jurisdiction and, when appropriate, a parent law code.

Law codes and local laws remain descriptive-only throughout `0.5.x`. They may summarize scope, recognized rights or obligations, restricted conduct, and non-executable sanction categories. They must not calculate fines, create warrants, arrest characters, resolve trials, apply punishment, collect taxes, alter access, mutate reputation, or change legal status.

Law-code schemas must follow jurisdiction authority, not precede it.

## 8. Crime, Justice, and Punishment Boundary

Crime, justice, courts, and punishment are separate future subjects. Civic authority may eventually name descriptive offense and sanction families only when setting canon and a dedicated decision justify them.

No first-pass civic record may contain wanted levels, bounty amounts, crime reports, arrest rules, court outcome tables, sentencing logic, detention state, punishment effects, fine calculations, evidence resolution, or procedural enforcement. Courts, warrants, cases, guards, punishment, and player consequence state require later owners and remain non-executable in `0.5.x`.

## 9. Faction, Guild, and Institution Boundary

Factions, guilds, and institutions must remain distinct layers:

- a faction owns an organized political, social, ideological, criminal, rebel, or pressure-group identity when canon supports it;
- the existing `civilization.guilds` authority owns trade/craft/merchant corporate identity and its authored membership/service posture;
- a future institution authority owns a durable civic, administrative, judicial, religious, scholarly, charitable, or similar body not better owned as a guild or faction.

One entity may reference or sponsor another, but cross-links must not create duplicate canonical identities. Derived settlement institution profiles remain runtime projections and must not be treated as authored institution records. None of these authorities may grant membership, reputation, service access, discounts, rewards, quests, law exemptions, or gameplay effects in this pass.

## 10. Guard, Garrison, Military, and Public Order Boundary

Guard forces, watches, militias, garrisons, military orders, route-security bodies, and other public-order authorities remain descriptive-only in `0.5.x`.

Existing settlement fort/watch identities, infrastructure tags, trade-flow security notes, and narrative guard references remain place/economy descriptors. They are not canonical force rosters. Future force records may describe affiliation, mandate, coverage, readiness band, headquarters/site references, and public posture, but must not spawn NPCs, schedule patrols, control AI, create encounters, arrest characters, resolve combat, enforce laws, or mutate world/player state.

## 11. Citizenship, Status, Rank, and Rights Boundary

Citizenship, subjecthood, residency, guest/foreigner posture, noble or common status, office, civic rank, chartered rights, obligations, and exemptions remain descriptive vocabularies in `0.5.x`.

Player titles, family state, guild membership descriptions, ancestry `lineageId`, backstories, and settlement origin must not imply civic or legal status. Future static status authority may describe recognized categories, but mutable player citizenship, rights, duties, outlawry, exemptions, access, or legal consequences belong to runtime/save state in `0.6+`.

## 12. Diplomacy, Claims, Borders, and Conflict Boundary

Diplomatic relations and conflicts must be separate overlays. Neither belongs as an embedded mutable array on polity records.

Future political-claim/border overlays may reference polities and physical geography without changing physical place ownership. Future diplomatic-relation records may describe alliances, rivalries, vassal relationships, recognition, or truces. Future conflict records may describe wars, disputes, occupations, rebellions, succession conflicts, or historical hostilities.

Existing map `conflictZones` remain map descriptors and do not become canonical civic conflicts. Dynamic diplomacy, control/border mutation, war state, conflict events, and simulation remain deferred to `0.6+`.

## 13. Economy, Trade, Tax, and Law Integration Boundary

Civic authority may later reference economy-owned resources, commodities, markets, routes, guilds, workplaces, and settlement economy profiles. It may describe tax, tariff, toll, customs, monopoly, market-right, restricted-goods, or trade-law posture only after their owners are decided.

Economy retains production, prices, stock, trade, and simulation ownership. Civic records must not collect money, calculate rates, alter prices, redirect goods, grant discounts, create smuggling mechanics, execute customs checks, or mutate economy state. The deferred settlement-economy and route-authority decisions remain prerequisites for mechanical integration.

## 14. Family, Lineage, Noble House, and Polity Integration Boundary

Family, household, genealogical lineage, clan, noble house, dynasty, estate, inheritance, and kinship authority remain owned by the family boundary decision. A noble house or dynasty may sponsor, claim, govern, or dispute a polity, but it does not replace polity or government identity.

Succession claims, marriage alliances, inheritance disputes, family prestige, titles, and estates remain descriptive cross-links until their own authorities exist. Existing account family, Family Prestige, estate, source-run inheritance, and Bloodlines presentation state must not populate or mutate civic authority.

## 15. Religion and Civil Authority Integration Boundary

Religions, religious hotspots, and sacred sites keep their existing authority. Future religious institutions, jurisdictions, customary law, civic privileges, protected sites, oaths, or civil-religious conflicts may reference those records after dedicated decisions.

Polity or law records must not redefine doctrine, worship, sacred-site identity, favorability, alignment, conversion, religious standing, spell access, or religious gameplay. Religious authority must not be inferred from hotspot dominance or sacred-site presence.

## 16. Knowledge Integration Boundary

Civic Knowledge remains informational pending a dedicated subject-vocabulary decision. Future subjects may expose polity identity/history, government structure, jurisdiction scope, law summaries, faction/guild/institution context, public claims, diplomacy, conflicts, or status vocabulary after canonical authorities exist.

Existing generic Knowledge `institution` ownership/source vocabulary is not authored civic-institution authority. No polity, government, jurisdiction, law, faction, citizenship, diplomacy, or conflict subject is approved here. Knowledge must not grant legal immunity, rights, access, rank, reputation, discounts, favorable enforcement, diplomacy standing, rewards, or gameplay effects.

## 17. First Implementation Candidate

The first implementation candidate is `world.polities`, starting with a documentation-only schema decision rather than a schema file.

`world.polities` is preferred because the live repository has rich physical-place authority but no canonical stable political-identity owner. Polity identity is also the narrowest useful reference prerequisite for later government, claim, jurisdiction, diplomacy, and conflict layers.

The candidate does not authorize schema, validator, content, test, loader, Knowledge, runtime, UI, storage, or gameplay work.

## 18. Future Validation Direction

Later schema and validator passes should be staged separately and eventually enforce:

1. strict records-only wrappers and canonical id/slug agreement;
2. unique polity identities and active-parent/reference coherence;
3. references to existing physical places without duplicated geometry or place fields;
4. polity/government separation and explicit government references only after that authority exists;
5. explicit jurisdiction owner, scope, applicability, overlap, visibility, provenance, and temporal posture;
6. law-code and local-law references only after jurisdiction authority exists;
7. distinct faction, guild, and institution ownership with duplicate-identity checks;
8. descriptive force affiliation and place coverage without rosters, spawning, AI, enforcement, or combat fields;
9. separate diplomacy, claim/border, and conflict records with no invalid self-relations;
10. no inference of polity, citizenship, law, faction, institution, or force authority from prose, tags, origin, title, family state, guild presence, or map conflict zones;
11. no player legal-status, faction-reputation, wanted/bounty, tax-collection, diplomacy-tick, war-simulation, runtime, storage, UI, command, event, reward, or gameplay fields.

No schema, validator, test, or content-lint change is authorized by this decision.

## 19. Temporary Research Artifact Handling

`docs/dev/tmp-civic-authority-systems-research-2026-06-20.md` was consumed as planning input and remains temporary, not final canon.

Keep it through the next polity schema-decision pass because it contains candidate fields and later government, jurisdiction, law, faction, institution, force, diplomacy, conflict, status, and Knowledge questions not fully promoted here. That pass must delete the artifact if all useful guidance is promoted, or name its next concrete consumer and removal condition.

## 20. Non-Goals

- no schema, validator, content JSON, test, Knowledge registry, or snippet changes;
- no economy, family, geography, or religion authority changes;
- no runtime system, UI, storage, command, event, reward, service, access, favorability, alignment, or gameplay behavior;
- no crime, punishment, bounty, wanted, arrest, court, guard AI, patrol, law-enforcement, faction-reputation, player-legal-status, diplomacy, war/conflict, taxation, tariff, toll, or customs mechanics;
- no migration, compatibility alias, data rename, or transition to `0.6.0`.

## 21. Next Recommended Version

`Version 0.5.202 - Polity Schema Decision`

That run should remain documentation-only and decide the exact `world.polities` path, wrapper, identity model, allowed descriptive fields, physical-place and future-overlay references, status/provenance posture, forbidden fields, validation ownership, and temporary-artifact cleanup without implementation.
