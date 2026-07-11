# People NPC Seed Evidence Deferral

Source version/run: Version 0.5.319 - People NPC Seed Evidence Deferral
Date: 2026-07-11
Status: documentation-only fail-closed gate; People/NPC paused

## 1. Deferral Summary

Pause People/NPC seed planning and implementation. The accepted `Version 0.5.318 - People NPC Authority Evidence Audit` found no strong canonical named-person candidate and carried forward no exact `person.*` or `npc.*` id. Repeating the same weak-source scan would not create authority.

People/NPC may reopen only after at least one genuinely new authored input exists:

1. an explicit user-authored canonical seed list;
2. a new durable repository lore/content source that clearly owns named people;
3. another later repository source that meets the same person-authority standard defined below.

No further People/NPC evidence audit, seed plan, or implementation should run until one of those inputs exists. Select docs-first `Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection` next so another current authority lane can be assessed without reopening paused or rejected work.

## 2. Current People/NPC Posture

- `docs/design/npc-social-authority-boundary-decision.md` owns the separation between canonical people, optional NPC overlays, and later social/runtime authorities.
- `docs/design/person-vs-npc-schema-decision.md` makes `civilization.people` stable named-person identity and `civilization.npcs` an optional one-to-one presence/interaction overlay that requires a resolving person.
- `docs/design/first-people-npc-content-seed-plan.md` recommends people-only first, approves no exact ids, and authorizes no seed list.
- `docs/design/people-npc-authority-evidence-audit.md` found no strong candidate after inspecting current authored evidence.
- No exact `person.*` or `npc.*` candidate is carried forward.
- A people-only seed plan, NPC overlay plan, live implementation, and normal-lint registration are not justified now.
- People/NPC is paused after this run.

Service, resource/commodity, and combat health remain stable and paused. Generic `world.pois` remains rejected. Highcrown settlement Knowledge remains closed. This gate does not choose or reopen any of those lanes.

## 3. Live-Surface And Registration Posture

- `packages/content/base/civilization/people.json` is absent.
- `packages/content/base/civilization/npcs.json` is absent.
- `packages/schemas/civilization/person.schema.json` exists.
- `packages/schemas/civilization/npc.schema.json` exists.
- `tools/content-lint/people-npcs.mjs` exists as a pure focused validator.
- `tests/unit/people-npc-validation.test.mjs` exists and uses in-memory fixtures only.
- `tests/unit/schema-files.test.mjs` includes both schema paths.
- `tools/content-lint/index.mjs` contains no People/NPC import, content path, check entry, validator call, or `main()` registration.

Normal content-lint registration must remain absent until a live wrapper exists and a separate docs-first registration decision explicitly approves normal-lint wiring. A future content authorization does not implicitly authorize registration, and a future registration decision does not implicitly authorize more records.

## 4. Accepted Future Evidence Gates

### 4.1 People seed candidate gate

A future People seed candidate is eligible for docs-only seed planning only when a new durable authored input supplies or explicitly permits every required identity fact without invention:

- exact canonical public name;
- exact intended `person.<slug>` id, or authority clear enough to derive one unambiguously;
- matching lower-snake-case `slug`;
- explicit confirmation that the entity is a person rather than a role, title, job, deity, religious label, organization, faction, guild, office, business, settlement, location, quest-contact placeholder, generated operator, combat actor, or player/account identity;
- required `aliases` posture, normally an explicit empty list when no aliases are authored;
- short non-invented public identity `summary`;
- `lifeStatus` of `living`, `deceased`, or explicitly `unknown`;
- authored record `status`, normally `planned` unless the approving source says otherwise;
- non-empty `sourceAuthorityNotes` identifying the durable authored source and why it owns person canon;
- descriptive `notes`, which may be empty if no note is required;
- `lineageId` only when an explicit resolving lineage association is authored and supported;
- an explicit boundary that the identity does not imply roles, titles, offices, affiliations, family/kinship, relationships, residence, workplaces, schedules, dialogue, services, quests, Knowledge, inventory, equipment, combat profiles, AI, runtime, UI, save/account, rewards, or gameplay.

Evidence passes this gate only when a reviewer can draft the complete schema-valid identity record without filling narrative gaps. Convenience, plausibility, a full-sounding name, or a person-shaped id is not authority.

### 4.2 NPC overlay candidate gate

An NPC overlay is eligible for docs-only planning only when the canonical person already exists or is approved in the same durable authored source, and that source also supplies explicit overlay posture:

- exact intended `npc.<person-slug>` id;
- resolving `personId: person.<person-slug>` with matching suffix;
- stable `presenceMode`: `resident`, `visitor`, `itinerant`, `remote`, or explicitly `unknown`;
- explicit `interactionPosture`: `reference_only` or `interactable`;
- authored record `status`, normally `planned` unless explicitly approved otherwise;
- optional `primarySettlementId` only when a stable settlement association is explicitly authored and resolves;
- any site association only as future evidence for a separate owner/schema decision, because the current NPC schema does not support a site field;
- non-empty provenance notes identifying the source of the overlay posture;
- descriptive notes and an explicit boundary that the overlay does not imply roles, affiliations, schedules, dialogue, services, vendors, companions, inventory, equipment, combat profiles, current location, AI, memory, relationships, runtime, UI, save/account, rewards, or gameplay.

A canonical person name alone never proves presence or interactability. When overlay evidence is incomplete, the person may remain eligible while the NPC overlay remains deferred.

### 4.3 Normal-lint registration gate

Normal People/NPC content-lint registration may be considered only after:

1. at least one live People or NPC wrapper has been separately authorized and created;
2. the live wrapper passes the existing schema and focused validator;
3. references needed by that wrapper resolve under the current validator contract;
4. a separate docs-first registration decision approves exact normal-lint scope;
5. a later narrow implementation prompt authorizes the index change and focused exact-once proof.

Absent wrappers must not be registered. This deferral authorizes neither content nor registration.

## 5. Stop Conditions And Insufficient Sources

The following remain insufficient by themselves and must not trigger another audit, plan, candidate list, or implementation:

- quest contacts, giver display names, clients, or contact metadata;
- `npc.*` strings, including `npc.corin_ash`;
- tests, schema examples, documentation examples, or fixtures such as Elda Mire;
- generated `npc_individual`, `npc_household`, operator, resident, worker, guard, merchant, traveler, crowd, or similar synthetic actors;
- player-created characters, account history, archived run identities, runtime actors, combatants, or encounter actors;
- deity names, religious figures not explicitly canonized as people, religion labels, or order labels;
- organization, faction, guild, office, business, institution, or polity names;
- settlement, district, site, region, route, or other location names;
- roles, titles, jobs, workplaces, services, or provider references;
- prose-only names without a durable person-authority declaration;
- Knowledge character, teacher, source, subject, or acquisition vocabulary;
- external or Deep Research material that is not explicitly adopted as repository canon.

Deep Research cannot manufacture project canon. It may later inform demographics or social-system design, but external plausibility does not approve fictional named-person identity.

No additional People/NPC evidence audit should repeat the `0.5.318` weak-source scan unless a new durable authored source is identified first. The reopening prompt must name that new source and explain which gate facts it supplies.

## 6. Deferral Decision

People/NPC is decision-complete for the current evidence state and pauses after `0.5.319`.

The pause ends only when a future prompt identifies one of the accepted authored inputs and performs a narrow gate check against this document. Until then:

- no people-only seed plan;
- no NPC overlay seed plan;
- no candidate-id list;
- no live content implementation;
- no normal content-lint registration;
- no repeated broad evidence audit.

An explicit user-authored seed list is required if no durable repository person-authority source exists. Requesting that list is not the immediate next primary route because the project can safely progress through another docs-first roadmap lane without forcing fictional canon now.

## 7. Deep Research Posture

Deep Research is not required or useful for reopening People/NPC before repository canon exists. It cannot decide canonical names, ids, identity facts, or overlay posture for this fictional setting.

No Deep Research was run and no temporary research artifact was created.

## 8. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. The deferral is a primary docs-first gate and contains a complete stop condition.

No explicit user question is required before the next numbered route because `0.5.320` should select another docs-first authority lane. A later explicit question becomes appropriate only if the user chooses to reopen People/NPC without first adding a durable repository source; at that point, the needed input is an authored canonical seed list satisfying the People gate.

## 9. Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Repeat the evidence audit | Rejected | No new durable authored source exists; repeating the same weak-source scan would create no authority. |
| People seed plan | Rejected | No exact candidate passes the People gate. |
| NPC overlay plan | Rejected | No canonical person or independent overlay posture passes the overlay gate. |
| Request an authored seed list now | Deferred | It is a valid future reopening input, but another roadmap lane can proceed without forcing user authorship now. |
| Live implementation | Rejected | Live wrappers and candidate authority are absent. |
| Pause People/NPC and route elsewhere | Selected | Preserves fail-closed canon discipline and returns sequencing to current roadmap/backlog review. |

## 10. Selected Option And Rationale

Select `Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection`.

The next run should remain docs-first, preserve the People/NPC pause, and compare current eligible roadmap/backlog lanes without automatically resuming service, resource/commodity, combat health, generic `world.pois`, Highcrown Knowledge, runtime, UI, save/account, or gameplay. It should not treat the absence of People/NPC canon as permission to broaden scope.

## 11. Risks And Mitigations

- Risk: future prompts repeat the same quest/test/operator scan. Mitigation: require the reopening prompt to name a new durable authored source before another People/NPC audit.
- Risk: an authored seed list omits schema-required identity posture. Mitigation: apply the complete People gate before approving a seed plan.
- Risk: a person name is used to infer an NPC overlay. Mitigation: require separate explicit presence and interaction evidence.
- Risk: content authorization silently expands to registration. Mitigation: retain a separate registration decision and implementation gate.
- Risk: pausing People/NPC reopens a rejected or stable lane by default. Mitigation: route to a fresh roadmap selection that preserves all existing pauses and closures until explicitly reconsidered.

## 12. Explicit Non-Goals

- no `people.json` or `npcs.json`;
- no exact people or NPC candidates;
- no people or NPC records;
- no schema, validator, test, schema-test, or normal-lint index edits;
- no quest-contact migration or id normalization;
- no generated people;
- no roles, affiliations, relationships, schedules, dialogue, services, companions, inventory, combat profiles, or AI;
- no Knowledge, Chronicle, organization/faction/guild, location/POI, runtime, UI, save/account, or gameplay work;
- no generic `world.pois` or Highcrown Knowledge reopening;
- no service, resource/commodity, or combat-health expansion;
- no Deep Research or temporary research artifact;
- no backwards compatibility or transition to `0.6.0`.

## 13. Deferral Question Answers

1. Yes. `people.json` and `npcs.json` remain absent.
2. Yes. Normal People/NPC content-lint registration remains absent.
3. Yes. Both schemas, the pure validator, focused tests, and schema parse coverage remain present.
4. No. No exact `person.*` candidate is carried forward.
5. No. No exact `npc.*` candidate is carried forward.
6. No. A people-only seed plan is not justified now.
7. No. An NPC overlay seed plan is not justified now.
8. No. Live content implementation is not authorized.
9. No. Normal content-lint registration is not authorized.
10. People/NPC may reopen only for an explicit user-authored canonical seed list, a new durable repository lore/content source that owns named people, or another later repository source meeting the same person-authority standard.
11. A future People candidate needs the complete identity facts in the People gate: canonical name/id/slug, explicit person status, aliases posture, non-invented summary, life and record status, provenance, notes, only supported optional lineage, and explicit non-implication boundaries.
12. A future NPC candidate needs an approved/resolving person plus exact overlay id/person link, stable presence mode, interaction posture, record status, only explicitly authored supported place association, provenance, notes, and explicit non-implication boundaries.
13. All weak-source classes listed in the stop-condition section remain insufficient.
14. No. Deep Research is not useful for creating repo canon before an authored source exists.
15. Yes. If no durable repository source exists, an explicit user-authored canonical seed list is required before live content.
16. Yes. People/NPC should pause after this deferral.
17. Yes. The next route should leave People/NPC and select another docs-first lane.
18. No. A support-suffix run is not needed.
19. No. An explicit user question is not needed before the next numbered roadmap-selection route.
20. Proceed with `Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection`.

## 14. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required authority, audit, handoff, roadmap, sequence, backlog, schema, validator, focused-test, normal-lint index, and schema-test reads.
- Live-wrapper, normal-registration, schema/validator/test presence, candidate-carry-forward, scope, temporary-artifact, conflict-marker, whitespace, and active-route scans.
- Required focused tests, schema tests, normal content lint, diff check, and final status are recorded in `docs/dev/current-codex-output.md`.

## 15. Next Recommended Version

Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection
