# Knowledge, Discovery, Observation, And Visibility Ownership Audit

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only, documentation-only evidence audit; no local tests, builds, lint, simulations, content changes, reveal changes, or UI execution

## Purpose

Map current ownership of known locations, geographic Knowledge, discovery records, Codex entries, observations, certainty, provenance, hidden truth, map visibility, and UI presentation before future exploration, survey, search, or reveal work.

This audit does not authorize new Knowledge domains, observations, discoveries, map markers, certainty rules, hidden-information policy, survey behavior, or UI implementation.

## Current Classification

`MULTIPLE_SPECIALIZED_KNOWLEDGE_AND_VISIBILITY_AUTHORITIES_EXIST; NO_UNIVERSAL_REVEAL_FLAG`

The repository intentionally separates several evidence families:

- `sessionState.knownLocations` for bounded runtime location admission and presentation;
- player geographic Knowledge with region/settlement-oriented progression and provenance;
- discovery Chronicle entries for discovered flora/fauna/resource-like records;
- session Codex entries and authored reference records;
- Knowledge domain registries, snippets, source teaching, trials, and progression policies;
- quest/session flags recording bounded gameplay facts;
- observer-safe assessment/presentation contracts for uncertainty and hidden state;
- UI projections and map markers derived from current snapshot/content facts.

These surfaces should not be collapsed into a generic `world.pois`, universal discovered boolean, or UI-owned visibility store.

## Authority Matrix

| Concern | Current owner/evidence | Boundary |
| --- | --- | --- |
| Travel-known location | `sessionState.knownLocations` plus travel rules | command admission aid; not full geographic Knowledge or route knowledge |
| Geographic recognition | player geographic Knowledge and accepted taxonomy | place/domain/source/proficiency evidence; not automatic map marker or travel access |
| Discovery record | player discovery Chronicle | historical discovered-record projection; not universal Knowledge rank or Codex ownership |
| Codex entry | session/authored Codex owners and projections | reference visibility; not canonical owner of every place, quest, person, or event |
| Quest/session flag | session gameplay state | exact bounded condition; not a general observation or certainty model |
| Knowledge trial/progress | Knowledge policies and player progression | learning/proficiency; not direct world mutation or reveal without owner contract |
| Observation/provenance | focused knowledge/observer-safe decisions | source and certainty vocabulary where supplied | 
| Map marker | UI projection | presentation only; not place existence, discovery, or travel authority |
| Hidden truth | owning gameplay/content system | must remain distinct from observer knowledge and presentation |

## Current Survey/Discovery Example

The current UI gameplay bridge can add a Stormglass Bloom discovery entry and a session flag while advancing the Ashen Reef compatibility loop. That behavior demonstrates multiple simultaneous facts:

- the survey progression condition;
- a discovery Chronicle entry;
- a Codex/reference link;
- a notification and Chronicle narrative;
- later quest reward consequences.

It does not establish a reusable discovery command, observation receipt, Knowledge-progress result, or universal reveal policy.

## Key Non-Equivalences

- Known location is not route knowledge.
- Route knowledge is not destination access.
- Map visibility is not canonical discovery.
- Discovery is not proficiency.
- Proficiency is not certainty about every related fact.
- Codex visibility is not ownership of the underlying entity.
- A quest flag is not an observation record.
- A Chronicle entry is not a Knowledge source receipt.
- UI search indexing is not a canonical record store.
- Hidden truth must not be inferred from what the UI currently renders.

## Risks For Future Consumers

1. Adding a map marker when only a rumor or partial observation exists.
2. Granting travel access from a Codex entry without location/route authority.
3. Treating session flags as durable, sourced observations.
4. Awarding Knowledge progression and discovery twice on replay.
5. Revealing canonical hidden facts in Chronicle or notification text.
6. Conflating authored notes with player-authored notes.
7. Creating a generic POI system that duplicates settlement, site, map-feature, discovery, quest, and Knowledge owners.
8. Losing provenance or certainty when projecting search results.

## Minimum Future Visibility/Discovery Contract

A bounded package should decide:

1. observed subject and owner identity;
2. source, observer, time, place, and method;
3. confirmed, observed, inferred, rumored, contradicted, outdated, or hidden posture;
4. exact relationship to geographic Knowledge, Codex, discovery Chronicle, flags, and map visibility;
5. whether travel, quest, service, or command access changes;
6. duplicate/replay/correction behavior;
7. persistence and migration;
8. observer-safe projection and redaction;
9. search/indexing behavior without new canonical ownership;
10. focused tests for wrong source, hidden truth leakage, duplicate award, and copied/reordered evidence.

## Named Consumers

Future work must inspect this audit when it covers:

- geographic recognition or Knowledge progression;
- Codex, linked records, search, or provenance;
- survey discoveries;
- map markers, fog, visibility, or known locations;
- observations, rumors, certainty, or hidden information;
- `0.7.0` exploration and world-loop claims.

## Review Trigger

Re-review at any route that reveals a place or record, grants discovery/Knowledge progress, changes map visibility, or claims provenance-aware observer presentation.

## Exclusions

No Knowledge domain, observation, discovery, content, map, travel, survey, source, tests, schemas, UI, active prompt, roadmap, backlog, or branch register changed in this pass.
