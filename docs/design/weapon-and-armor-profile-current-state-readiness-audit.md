# Weapon And Armor Profile Current-State Readiness Audit

Date: 2026-07-29

Source route: ChatGPT via GitHub Connector

Source commit: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Status: connector-only, read-only readiness audit; no item, profile, schema, validator, test, lint, runtime, UI, save, combat, or roadmap change

## 1. Purpose

Refresh the accepted weapon/armor structural-profile decision against the current repository and determine the smallest remaining prerequisite before live profile content can be considered.

The original decision is:

`docs/design/weapon-and-armor-profile-schema-decision.md`

That decision approved separate future static authorities for structural equipment descriptors while preserving item identity and embedded action-bearing `useProfiles`.

This audit does not authorize profile records or implementation.

## 2. Corrected Current-State Summary

The repository is further along than the current static-content inventory wording implies.

The following foundation already exists:

- `packages/schemas/items/weapon-profile.schema.json`;
- `packages/schemas/items/armor-profile.schema.json`;
- `tools/content-lint/equipment-profiles.mjs`;
- focused in-memory validation tests from `Version 0.5.233`;
- schema-file registration for both schemas.

The following remains absent:

- `packages/content/base/items/weapon_profiles.json`;
- `packages/content/base/items/armor_profiles.json`;
- normal content-lint registration for live wrappers;
- runtime or UI consumers;
- item-to-profile fields on canonical item records;
- any authorized seed list.

Therefore the old phrase “requires a small precondition” should be understood as a **content evidence and seed-planning precondition**, not a missing schema/validator precondition.

## 3. Accepted Existing Foundation

`Version 0.5.233 - Weapon And Armor Profile Schemas And Validators` already added:

- strict future weapon and armor profile schemas;
- an isolated pure validator;
- focused tests;
- schema-file registration;
- no live profile content;
- no normal-lint registration;
- no item edits;
- no `useProfiles` migration;
- no runtime, UI, storage, combat, inventory, or gameplay behavior.

This is a completed historical foundation and must not be reimplemented under a new label.

## 4. Weapon Schema Posture

The weapon schema defines a records-only collection with a non-empty wrapper.

Each record requires exactly:

- `id`;
- `itemKey`;
- `weaponFamily`;
- `handedness`;
- `compatibleSlotIds`;
- `deliveryPosture`;
- `rangePosture`;
- `equipmentTags`;
- `sourceAuthorityNotes`;
- `notes`.

### Identity

- ID pattern: `weapon_profile.<itemKey>`;
- item key pattern: lower snake case;
- one profile is intended to resolve to one canonical weapon item.

### Controlled fields

Weapon families currently include:

- axe;
- blowgun;
- bow;
- crossbow;
- dagger;
- fan;
- flail;
- mace;
- polearm;
- sling;
- staff;
- sword;
- thrown;
- whip.

Handedness:

- one-handed;
- two-handed;
- versatile.

Delivery posture:

- melee;
- ranged;
- hybrid.

Range posture:

- close;
- reach;
- short range;
- long range;
- mixed.

Compatible slots are limited to the two canonical weapon-hand slots.

### Boundary

The schema is descriptive-only. It contains no action type, targeting, activation timing/cost, damage, effect channels, hooks, skill progression, inventory state, ownership, UI, persistence, or gameplay behavior.

## 5. Armor Schema Posture

The armor schema defines a records-only collection with a non-empty wrapper.

Each record requires exactly:

- `id`;
- `itemKey`;
- `armorKind`;
- `armorFamily`;
- `compatibleSlotIds`;
- `coverageSlotIds`;
- `weightClass`;
- `encumbrancePosture`;
- `mobilityPosture`;
- `equipmentTags`;
- `sourceAuthorityNotes`;
- `notes`.

### Identity

- ID pattern: `armor_profile.<itemKey>`;
- one profile is intended to resolve to one canonical armor-class item.

### Controlled fields

Armor kinds:

- body armor;
- shield.

Armor families:

- cloth;
- leather;
- mail;
- padded;
- plate;
- scale;
- shield.

Weight:

- light;
- medium;
- heavy.

Encumbrance:

- low;
- moderate;
- high.

Mobility:

- unrestricted;
- reduced;
- restricted.

The schema distinguishes body equipment slots from weapon-hand slots and includes body-area coverage vocabulary plus `shield_hand`.

### Boundary

The schema does not own mitigation, block formulas, reactions, movement costs, stamina costs, current durability, equipped state, item-instance state, UI, persistence, or combat resolution.

## 6. Pure Validator Posture

`tools/content-lint/equipment-profiles.mjs` is an isolated validator with no content loading or runtime side effects.

It:

- validates only a supported local JSON Schema subset;
- validates strict wrapper and record structure;
- enforces non-empty records;
- indexes canonical items by unique item key;
- enforces unique profile IDs and unique profile item keys;
- enforces exact `*_profile.<itemKey>` identity coherence;
- requires weapon profiles to resolve to `itemClass: weapon`;
- requires armor profiles to resolve to `itemClass: armor`;
- restricts weapon compatible slots to canonical weapon slots;
- requires two-handed weapons to include both weapon slots;
- distinguishes shield and body-armor slot/coverage behavior;
- rejects direct migration of action/use, runtime, inventory, quality, durability, reward, storage, and UI fields;
- returns inert sorted ID lists.

### Important validator choices

For shields:

- `armorKind` must be `shield`;
- `armorFamily` must be `shield`;
- compatible slots must be weapon-hand slots;
- coverage must be `shield_hand` only.

For body armor:

- family cannot be `shield`;
- compatible slots must be body armor slots;
- coverage cannot include `shield_hand`.

This is a meaningful semantic foundation, not merely schema parse coverage.

## 7. Current Item And Use-Profile Boundary

The accepted live inventory still contains:

- 1,372 item identities;
- 35 weapon-class items;
- 18 armor-class items;
- sparse embedded `useProfiles` across weapon, armor, tool, clothing, shield, and magic-focus use cases.

`items.items` remains canonical for:

- identity and classification;
- values and marketability;
- material and production metadata;
- generic tags and roles;
- existing embedded `useProfiles`;
- consumable, spoilage, conduit, and catalyst references where applicable.

Embedded `useProfiles` remain action/use authority for:

- action type;
- target and activation profile;
- skills and rank requirements;
- effect channels;
- combat tags;
- resolution hooks;
- grant tags;
- shield/armor action or reaction posture.

A future structural profile must not duplicate or reinterpret those fields.

## 8. Live Content And Registration State

Both live content wrappers are absent.

Because the profile schemas require at least one record, empty placeholder wrappers would fail and should not be created.

Normal content-lint registration is also correctly absent. Registration must wait until:

1. one or both live wrappers are separately authorized;
2. exact records are selected;
3. every required descriptor is supported by repository authority;
4. the live wrapper passes the existing schema and pure validator;
5. a separate registration decision or exact implementation prompt authorizes normal-lint wiring.

Content authorization must not silently authorize registration, and registration must not silently authorize more content.

## 9. Current Consumer Posture

No production engine or application consumer should be inferred from schema/validator existence.

Current combat behavior continues to consume embedded item `useProfiles` where supported.

There is no accepted consumer that:

- looks up weapon profiles by item key;
- looks up armor profiles by item key;
- uses profile family for damage or mitigation;
- equips or unequips based on profiles;
- calculates encumbrance or mobility;
- applies range or handedness behavior;
- renders profile data in UI;
- persists profile state.

A static profile record would be descriptive canon only until a later consumer contract is accepted.

## 10. Readiness Question: Is A Schema Package Needed?

No.

Result:

`SCHEMA_VALIDATOR_FOUNDATION_ALREADY_COMPLETE`

Creating another schema/validator package would duplicate accepted `0.5.233` work and risk conflicting vocabularies.

## 11. Readiness Question: Is A Live Seed Package Ready?

Not yet.

Result:

`CONTENT_SEED_EVIDENCE_NOT_YET_CLOSED`

The schemas define required classifications, but the current audit has not proven exact values for any candidate item without inference.

Examples of facts that must be proven per weapon candidate:

- exact family;
- handedness;
- compatible slots;
- melee/ranged/hybrid delivery;
- broad range posture;
- every equipment tag;
- provenance.

Examples for armor candidates:

- body armor versus shield;
- exact family;
- compatible equipment slot;
- actual body-area coverage;
- weight class;
- encumbrance posture;
- mobility posture;
- every equipment tag;
- provenance.

Generic item names and item branches may support some facts, but they do not automatically prove every required field.

## 12. Strong Candidate Evidence Sources

A future seed-candidate audit should inspect, in order:

1. canonical item identity, branch, sub-branch, roles, tags, material, and notes;
2. embedded `useProfiles` for handling and delivery compatibility only, without migrating action behavior;
3. canonical equipment-slot vocabulary;
4. current combat handling consumers;
5. recipe and production records for structural identity only;
6. authored item descriptions or durable lore;
7. accepted design decisions.

It should explicitly classify each field as:

- directly authored;
- safely derived from exact canonical classification;
- bounded compatibility inference;
- unsupported.

A record is seed-ready only if every required field is directly authored or accepted as bounded static classification by a focused decision.

## 13. Candidate Selection Strategy

Do not attempt all 53 weapon/armor items in the first seed.

The safest first seed should be a small matrix of items whose current evidence is unusually strong.

A candidate matrix might include:

- one clear one-handed melee weapon;
- one clear two-handed weapon;
- one clear ranged weapon;
- one clear shield;
- one clear light body-armor item;
- one clear heavy body-armor item.

The exact items must be chosen by evidence, not by filling category quotas.

Exclude or defer:

- hybrid tools;
- magical foci;
- clothing with armor-like use profiles;
- improvised weapons;
- ambiguous versatile weapons;
- multi-slot or layered armor with unclear coverage;
- items whose structural family is not in the current schema enums;
- items requiring new vocabulary.

## 14. Vocabularies Requiring Fresh Review

Before selecting records, verify whether current enums still cover the item catalog without forcing misclassification.

Potential pressure points include:

- weapon families absent from the schema;
- thrown weapons that are also knives, axes, or spears;
- versatile versus two-handed posture;
- shields whose size/handling may differ;
- clothing or protective gear outside the six body-armor families;
- armor layering;
- helmets, gloves, boots, and partial pieces where `armorFamily` may be clear but mobility posture is not;
- fantasy materials that do not change family but may affect weight assumptions.

Do not widen enums inside a seed plan unless a separate evidence-backed schema amendment is selected.

## 15. Smallest Safe Next Pass

Recommended route:

`First Weapon And Armor Profile Seed Candidate Evidence Audit`

Classification:

`UNVERSIONED_PREREQUISITE`

Allowed output:

- one candidate matrix;
- exact evidence per required field;
- exclusions and unsupported fields;
- a decision to select a tiny seed plan or return `NO_PACKAGE`.

The candidate audit should not edit schemas, validators, tests, items, use profiles, or content.

## 16. Later Package Sequence

If the candidate audit closes a tiny set:

1. **Seed plan**
   - approve exact records and values;
   - decide whether one or both wrappers are included;
   - no implementation.
2. **Seed implementation**
   - create only authorized wrappers and records;
   - update focused live-seed tests if an existing test surface is identified;
   - no normal-lint registration unless explicitly included by a separate decision.
3. **Registration decision**
   - inspect live stability and exact dependency loading;
   - approve or reject normal-lint wiring.
4. **Registration implementation and audit**
   - register exact live wrappers;
   - prove exact-once imports/checks and current item dependency;
   - no runtime consumer.
5. **Consumer classification**
   - decide whether any UI, equipment, combat, crafting, or Knowledge consumer is justified.

## 17. Documentation Maintenance Finding

`docs/design/static-content-expansion-program.md` currently describes weapon and armor profiles as having no live collection and requiring a small precondition.

The “no live collection” fact is correct.

The blocker wording is incomplete because schemas, validator, focused tests, and schema registration already exist. A later safe complete-file maintenance pass should clarify:

- foundation: complete;
- live content: absent;
- current blocker: exact seed evidence and seed plan;
- normal-lint registration: deferred until live content.

Do not edit that high-conflict coordination document from this isolated pass.

## 18. User Direction Needed Later

Before broad equipment-profile authoring, obtain user direction on:

- desired equipment taxonomy granularity;
- whether fantasy materials alter only item identity or also structural profile posture;
- whether armor layering is an intended system;
- whether versatile weapons should have an explicit use-mode concept later;
- whether shields are treated primarily as armor, weapons, or both in player-facing organization;
- whether regional/cultural variants should share families or have distinct structural tags.

These choices can affect schema vocabulary and should not be inferred from the first few obvious records.

## 19. Final Disposition

Result:

`SEED_CANDIDATE_AUDIT_READY`

Implementation:

`NO_PACKAGE`

The static structural-profile foundation is already robust. The correct next step is not schema work; it is a small evidence audit that proves complete records for a deliberately tiny first seed without migrating action behavior or inventing equipment semantics.
