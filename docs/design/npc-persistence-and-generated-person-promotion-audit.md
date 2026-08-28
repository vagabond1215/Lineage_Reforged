# NPC Persistence And Generated-Person Promotion Audit

Date: 2026-08-27

Status: `AUDIT_COMPLETE_RUNTIME_GENERATED_PERSON_OWNER_MISSING_AUTHORED_CANON_REMAINS_PAUSED`

Execution surface: ChatGPT via GitHub Connector; documentation-only/read-only

Source baseline: `31cc68ff22316eb62d8b1450cfc8c9e1f0b60c95`

Active route protected: `Integrated Gameplay 0.7 Band-Entry Readiness Decision`

## 1. Result

The repository has a **static schema foundation** for canonical people and authored NPC overlays, but it does **not** have:

- live `people.json` content;
- live `npcs.json` content;
- a generated-person runtime owner;
- a generated-person persistence contract;
- a promotion mechanism from generated entity to persistent person;
- relationship/schedule/dialogue/service/companion runtime ownership for people;
- authority to infer named people from role labels, quest strings, synthetic operators, combatants, or prose.

The current correct posture is:

`STATIC_PERSON_NPC_SCHEMA_FOUNDATION_EXISTS + AUTHORED_SEED_PAUSED + GENERATED_PERSON_RUNTIME_OWNER_MISSING`

No generated role-holder should automatically become `person.*` or `npc.*`.

A future design must distinguish **campaign-local persistence** from **global authored canon**.

## 2. Current Static Authority

### Canonical person

`civilization.people` is reserved for stable authored named-person identity.

Current schema exists:

`packages/schemas/civilization/person.schema.json`

The minimum record owns:

- `id: person.<slug>`;
- `slug`;
- canonical name;
- aliases;
- short summary;
- optional canonical `lineageId`;
- `lifeStatus`;
- record lifecycle status;
- source authority notes;
- notes.

It explicitly rejects runtime/social/gameplay fields.

### Authored NPC overlay

`civilization.npcs` is reserved for optional authored presence/interaction posture for a canonical person.

Current schema exists:

`packages/schemas/civilization/npc.schema.json`

It requires:
- `id: npc.<person-slug>`;
- resolving `personId`;
- presence mode;
- interaction posture;
- lifecycle status;
- source authority notes;
- notes;
- optional stable settlement association.

It does **not** own the person's name/identity.

## 3. Important Current-State Correction

The older `Person vs NPC Schema Decision` originally recorded that no person/NPC schema existed.

That statement is historical.

Current master now contains:

- `person.schema.json`;
- `npc.schema.json`;
- `tools/content-lint/people-npcs.mjs`;
- focused `people-npc-validation.test.mjs`.

The schemas are registered in schema tests.

However the validation test explicitly confirms:

- `packages/content/base/civilization/people.json` is absent;
- `packages/content/base/civilization/npcs.json` is absent;
- normal content lint does not register those absent live collections.

Therefore the current status is:

`SCHEMA_AND_VALIDATOR_FOUNDATION_EXISTS_DEFER_CONTENT`

not “no schema,” and not “live People/NPC system.”

## 4. Authored Seed Remains Paused

The accepted People/NPC evidence deferral found no sufficiently authoritative named-person seed.

Reopening authored people/NPC content still requires genuinely new authored authority, such as:

1. explicit user-authored canonical people;
2. a new durable repository lore source that clearly owns named people;
3. another source meeting the accepted authority standard.

Do not restart candidate mining from:
- quest contact names;
- office titles;
- role labels;
- settlement functions;
- generated operators;
- prose mentions.

Those sources were already judged insufficient.

## 5. No Runtime Generated-Person Owner Exists

Repository inspection found no general runtime type or owner for:

- generated-person identity;
- generator seed;
- persistent generated resident;
- generated NPC save record;
- persistent worker/guard/merchant identity;
- promotion state.

The people validator explicitly forbids fields such as:
- `generatedPerson`;
- `generatorSeed`;
- `populationTemplateId`

inside authored person records.

That is intentional.

Generated identity belongs in a separate future runtime/save authority.

## 6. Synthetic Settlement Operators Are Not People

Settlement/institution simulation currently derives synthetic owner/operator forms such as:

- `npc_household`;
- household-shaped ids like `household.<settlement>.<district>`;
- authority ids;
- guild/company/temple operators;
- unclaimed placeholders.

These represent ownership/operator categories or simulation projections.

They do not prove:
- an individual human exists;
- a specific household member exists;
- a canonical name;
- a person record;
- an authored NPC overlay.

Do not adapt `npc_household` or similar strings into `npc.*`.

## 7. Quest Contacts Are Not Person Authority

Existing quest content can carry:
- issuer display names;
- contact names;
- organization labels;
- legacy-shaped strings such as `npc.corin_ash`.

The person/NPC validators deliberately reject those shapes as canonical person/NPC evidence.

The accepted Soundings quest likewise uses:
- `Starfall Harbormaster's Office`;
- `Duty Harbormaster`

as presentation/role labels without minting a person or office-holder record.

That is the correct current pattern.

## 8. Combatants Are Not Automatically People

Combat has its own actor/combatant identities.

A combatant can represent:
- player;
- enemy;
- ally;
- spawned actor.

Combat identity/state does not establish enduring world-person identity.

If a future generated combatant survives and becomes narratively persistent, a dedicated promotion/persistence owner must create the durable relationship. Do not reuse `combatantId` as `personId`.

## 9. Player Characters Are Separate

Player identity, account history, lineage/Legacy and archived runs remain player/account authorities.

Do not require player characters to resolve to `civilization.people`.

A player becoming historically important in a campaign does not imply mutation of static authored people content.

If future Chronicle/world-history systems need to refer to historical player characters, they should reference player/account/run identity or a dedicated historical-actor projection.

## 10. Two Different Meanings Of “Promotion”

Future work must distinguish two very different transitions.

### A. Runtime persistence promotion

Example:

`ephemeral generated merchant -> persistent campaign-local generated person`

This means the simulation decides the entity now needs durable identity because the player interacted with it or another owner references it.

This should create **runtime/save authority**, not static authored canon.

Possible future identity family should be separate from:
- `person.*`;
- `npc.*`;
- combatant ids;
- synthetic operator ids.

Exact id vocabulary remains undecided.

### B. Authored canon promotion

Example:

a designer explicitly decides that a named individual is now part of global authored setting canon.

This requires:
- authored product/canon approval;
- a `civilization.people` record;
- source authority notes;
- optionally an authored `civilization.npcs` overlay.

A player's local runtime history should **not automatically write static content into the repository**.

Disposition:

`RUNTIME_PERSISTENCE_CAN_BE_SYSTEMIC; GLOBAL_CANON_PROMOTION_MUST_BE_AUTHORED`.

## 11. Recommended Future Runtime Identity Layers

This is design direction only.

### Layer 1 — ephemeral role/operator

Short-lived entity used for:
- crowd/member slot;
- anonymous worker;
- generic guard;
- transient combatant;
- procedural service actor.

May be regenerated if no durable owner references it.

### Layer 2 — persistent generated person

Campaign/save-owned stable identity created when persistence is justified.

Likely owns or references:
- durable generated-person id;
- stable generated identity facts;
- generation/source provenance;
- campaign/continuity identity;
- creation occurrence;
- persistent presentation name;
- identity seed/source template where useful.

It should **not** absorb:
- current job;
- current location;
- relationships;
- inventory;
- household links;
- faction memberships;
- schedule;
- combat state.

Those belong to their own runtime/link owners.

### Layer 3 — authored canonical person

Static `civilization.people`.

Exists independent of one campaign/save.

### Layer 4 — authored NPC overlay

Static `civilization.npcs`, referencing Layer 3.

### Layer 5 — runtime presence/interaction instance

Current location, schedule occurrence, dialogue session, service interaction, combat actor, party presence, etc.

These may reference a persistent generated person or authored person/NPC but do not replace identity authority.

## 12. What Should Trigger Runtime Persistence

A future decision should consider persistence when an ephemeral entity becomes the target/source of durable state.

Strong candidate triggers include:

- player forms a remembered relationship;
- quest/contract references that exact individual;
- item/property/estate ownership references the individual;
- household/kinship state references them;
- recurring service/provider relationship requires continuity;
- injury/death/legal state must persist;
- Chronicle/history records a personally meaningful event;
- recruitment/companion/party membership occurs;
- reputation/recognition attaches to the person rather than role;
- player explicitly names/marks/remembers the individual where product design supports it.

Weak/non-trigger examples:
- being visible once;
- appearing as an anonymous shop clerk;
- occupying a generic guard slot;
- being one combatant in a random encounter;
- a settlement needing “some operator” for a projection.

Persistence should be **need-driven**, not population-wide by default.

## 13. What Must Freeze On Persistence

If a generated entity becomes persistent, identity facts used to recognize the same individual must stop rerolling.

Likely freeze candidates:
- durable generated-person id;
- chosen/generated name;
- stable physical/identity seed needed for presentation continuity;
- lineage/species identity if generated and authoritative;
- generation provenance;
- campaign/continuity of origin;
- creation tick/occurrence;
- stable authored/generated distinction.

Do not automatically freeze mutable world facts such as:
- occupation;
- title;
- location;
- employer;
- household membership;
- relationship score;
- inventory;
- health;
- schedule;
- wealth;
- faction standing.

Those should remain owned by temporal/runtime systems.

## 14. Regeneration Direction

Recommended default:

`FREEZE_IDENTITY; RECOMPUTE_DERIVED_PRESENTATION; MUTATE_WORLD_STATE_THROUGH OWNERS`.

Meaning:
- do not reroll the person's identity;
- presentation details may be derived deterministically from frozen identity facts;
- job/location/schedule/etc can change through world simulation;
- current combat stats can derive from current state;
- no giant serialized NPC blob should become the sole source of truth.

Exact generator-seed mechanics remain a future decision.

## 15. Deduplication

A future generated-person owner must prevent one individual from being minted multiple times because several systems encounter them.

Potential required keys:
- durable generated-person id;
- source occurrence or generation identity;
- campaign/continuity id.

Do not deduplicate by display name.

Two people may legitimately share names, and one role title may represent many individuals over time.

## 16. Relationship And Household Boundary

Current accepted design separates:

- person identity;
- NPC presence;
- household/family;
- kinship;
- non-kin relationships;
- workplaces/roles;
- factions/institutions;
- services.

A persistent generated person should become **referenceable** by these future link owners.

It should not receive arrays of all relationships/memberships on its identity record.

This keeps temporal state out of identity authority.

## 17. Death And Historical Persistence

A persistent person's death should not necessarily delete their identity.

Future runtime generated-person authority should distinguish:
- identity persistence;
- life state;
- active world presence.

Similarly, authored `civilization.people` already separates `lifeStatus` from NPC presence.

A deceased persistent person may remain relevant to:
- Chronicle;
- family;
- inheritance;
- property history;
- quests;
- reputation;
- knowledge;
- legal records.

Do not equate “not currently spawned” with “ceases to exist.”

## 18. Companion / Recruitment Implication

No active companion runtime owner exists in the inspected People/NPC foundation.

Future recruitment should require persistent identity before durable companion state can reference the individual.

A generic combatant should not become a permanent companion merely by copying combat state.

Companion/party state should reference a persistent person identity and own:
- membership;
- current participation;
- party role;
- availability;
- temporary combat projection.

## 19. Canon Promotion Rule

A campaign-generated person may inspire later authored content, but the transition should be editorial, not automatic.

Recommended flow:

1. export/inspect campaign-local person evidence;
2. explicit product/canon approval;
3. author a new `person.<slug>` record;
4. record source authority/provenance;
5. add optional authored NPC overlay if justified;
6. define any compatibility/link mapping separately.

Do not silently rewrite an existing save-generated id into a global authored id.

Whether an authored canon person should map back onto prior campaign-generated instances is a separate migration question and should default to **no automatic retroactive merge**.

## 20. Current Open Product Questions

A future generated-person contract needs user direction on:

1. Which interactions are strong enough to force persistence?
2. Should the game persist every directly conversed-with NPC, or only relationship/quest/property/etc references?
3. Can the player explicitly “remember” or name an otherwise generic person?
4. How long can an unreferenced persistent generated person be retained before archival?
5. Are generated names globally unique, locally unique, or allowed to duplicate naturally?
6. How much appearance/personality data must freeze?
7. Does identity persist across succession to heirs automatically when that person is still alive?
8. When does a generated person become historical after death or departure?
9. Can campaign-local people ever be promoted into official game canon, and if so only through developer/editor approval? Recommended: yes, editorial only.
10. Should persistent generated persons survive save branching/forks as lineage-specific identities or share an ancestor identity with branch-local state? This depends on current campaign continuity/fork policy and requires a dedicated decision.

These questions do not affect the active `0.7` band-entry gate.

## 21. Current Findings

### F-01 — Static schemas exist; live content does not

Current schemas/validators are foundation only.

### F-02 — Authored People/NPC seed remains evidence-gated

No canonical seed should be inferred.

### F-03 — No generated-person runtime/save owner exists

Promotion cannot be implemented safely yet.

### F-04 — Synthetic settlement operators are projections

They are not canonical or persistent people.

### F-05 — Quest contact strings remain presentation

Do not mint people from them.

### F-06 — Combat identity is separate

Combatant persistence is not person persistence.

### F-07 — Runtime persistence and global canon promotion are different mechanisms

This distinction should control future design.

## 22. Recommended Future Decision

When a real NPC/social consumer is selected, first open:

**Generated Person Identity, Persistence, Promotion, And Reference Contract Decision**

That decision should define:
- identity allocation;
- persistence triggers;
- generation provenance;
- freeze/regenerate fields;
- deduplication;
- save/continuity/fork behavior;
- reference semantics;
- death/archive semantics;
- authored-person bridge posture.

Only after that should runtime generated-person implementation begin.

Do not reopen live `civilization.people` content seeding without new authored canon.

## 23. Decision

`RUNTIME_GENERATED_PERSON_OWNER_MISSING_AUTHORED_CANON_REMAINS_PAUSED`

No implementation package is authorized by this audit.
