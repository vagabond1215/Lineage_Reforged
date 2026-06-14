# Offspring, Heir, And Family Continuity Owner Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-06-14
Status: durable design decision and future-system ownership plan; documentation only

## Purpose

This document records the resolved family-creation and heir-continuity rule for future Bloodlines, family, heir, estate, heirloom, bequest, romance/courtship, marriage, naming, and offspring systems.

It exists because family continuity must not be fabricated from account state, lineage/species identity, or Prestige unlocks alone. Future implementation must preserve grounded in-game offspring evidence before any playable heir or family continuity record can exist.

This document is not runtime code, a schema, a content catalog, a save shape, or permission to implement broad family simulation.

## Core Decision

Characters do not automatically create a family record.

A family/heir line becomes player-facing only when all of the following are true:

1. a Prestige-system unlock allows heir creation;
2. the character had offspring during gameplay;
3. the player creates an heir character from an eligible offspring record.

Prestige unlocks control heir-character capacity. Prestige does not create offspring, invent family history, imply marriage, imply legal recognition, imply noble status, or create a household by itself.

Subsequent Prestige unlocks may increase the number of heir characters that can be created, but every playable heir must still come from an eligible in-game offspring record.

## Ownership Vocabulary

| Term | Meaning | Guardrail |
| --- | --- | --- |
| Offspring record | A child exists in world/history as a result of in-game relationship, union, liaison, or other explicitly authored adult-only source. | Not automatically playable and not automatically recognized as an heir. |
| Eligible heir | An offspring record that passes future inheritance, recognition, capacity, and safety rules. | Eligibility requires evidence; it is not fabricated by Prestige. |
| Heir slot | Prestige-controlled capacity to create heir characters. | A slot permits selection from eligible offspring only. |
| Playable heir character | A new character created from an eligible offspring record. | Creation is a player action after eligibility and capacity checks. |
| Family continuity record | The Bloodlines/family continuity record activated by an actual playable heir path. | Do not create automatically for first characters. |
| Origin family | The family from which an heir descends or is recognized. | Married-out heirs should remain visible in their origin family history. |
| Marriage-created family | A new family or branch created through marriage, naming, and household departure rules. | Requires explicit Prestige unlock and valid in-game relationship/marriage authority. |
| Recognized heir | A legal/social heir acknowledged by the relevant family, household, settlement, religion, title, or estate authority. | Recognition may differ from biological descent. |
| Illegitimate offspring | Offspring from a source outside recognized marriage/union rules. | May require acknowledgement, proof, secrecy, dispute resolution, adoption, or special support before heir eligibility. |
| Dowry or marriage settlement | Material, social, legal, or household transfer tied to marriage. | Must not fabricate title, estate, wealth, or family status without owner systems. |

## Required Upstream Systems

Playable heir creation depends on future owner systems that must be planned and validated before runtime behavior:

- in-game family/household records;
- romance and courtship systems;
- marriage, union, or recognized partnership rules;
- lore-friendly family naming conventions by race, culture, and region;
- offspring source rules;
- brothel or casual-liaison source rules using non-explicit, adult-only, fade-to-black treatment;
- illegitimate offspring recognition, secrecy, proof, dispute, adoption, and social-consequence rules;
- Prestige heir-slot unlocks;
- Prestige marriage unlocks;
- heir creation resolver;
- marriage and branch creation resolver;
- family continuity record schema/content/state boundary;
- estate, title, religion, settlement, and culture recognition only when those owner systems exist.

## Relationship And Offspring Source Posture

Future offspring sources may include:

- marriage or recognized union;
- courtship or long-term partner relationship;
- acknowledged lover or concubine-style relationship where culturally supported;
- brothel or transactional liaison source, handled without explicit sexual content;
- illegitimate or disputed parentage source;
- adoption or wardship only if a later plan authorizes non-biological heir status.

Every source must define:

- adult-only safety requirements;
- consent-safe and non-explicit presentation boundaries;
- parent identity or known/unknown parent posture;
- legitimacy or recognition posture;
- settlement/culture/religion/legal implications when applicable;
- evidence record identity;
- heir-eligibility effect, if any;
- failure and dispute states;
- UI read-only vs actionable boundary.

## Prestige And Capacity Rules

Prestige may unlock heir creation capacity, but it cannot create heirs by itself.

Future Prestige unlock rules should distinguish:

- no heir creation unlocked;
- one eligible heir character may be created;
- additional eligible heir character capacity;
- marriage-enabled family continuity choices;
- separate-family or branch-creation privileges;
- family branch preservation or closure choices;
- Chronicle Mark or Lineage Seal conversion only after separately approved rules.

Prestige spending must remain ledger-derived and family-scoped when family ownership exists. Account-wide Prestige or Chronicle resources must not fabricate family/offspring evidence for unrelated characters.

## Family Record Creation Rule

A first character does not automatically create a family record.

A family continuity record may be created only when a playable heir is made from an eligible offspring record, or when a later explicitly approved family lifecycle owner creates a family through validated in-game evidence.

Family creation should normally happen only when a character changes family identity through marriage, naming, household departure, or an explicitly unlocked branch-creation rule.

Do not create families from:

- loose `lineageId` or ancestry/species identity;
- account id alone;
- Legacy purchase alone;
- Prestige unlock alone;
- source run id alone;
- UI placeholder state;
- inferred surname text;
- noble/title/estate concepts without owner systems.

## Lore-Friendly Naming Rules

Naming must follow standard lore-friendly conventions and may differ by race, culture, settlement, realm, religion, or region.

Default posture:

- heirs use the origin family name by default;
- naming conventions should be data-driven only when the setting actually needs variation;
- if every current race/culture shares the same male-dominant naming convention, do not add extra race-specific infrastructure prematurely;
- if a later race or region differs, add explicit naming-rule authority rather than hard-coded exceptions.

Married heirs should remain visible in their origin family history even if their married household or new branch uses a different family name.

Female heirs may marry and change last name where the local naming convention supports that outcome. That change can create or join a new family record only through a future marriage/branch resolver, not by editing display text alone.

## Marriage-Gated Family Creation

Marriage is gated behind a Prestige unlock.

Marriage unlocks should eventually support two distinct paths:

1. mid-playthrough marriage by a direct heir;
2. character creation from an eligible heir slot as the spouse married into the family.

### Mid-Playthrough Marriage

A direct heir may create a new family through marriage during a playthrough only after the relevant Prestige unlock exists and marriage authority validates the relationship.

This must not happen at first character creation by default.

A marriage-created family can occur when:

- an heir changes family name and leaves the origin family;
- an heir joins the spouse's family under local naming law;
- an heir creates a new branch family through a Prestige-unlocked branch option;
- an heir keeps the same name but legally or socially creates a new branch, if that option is unlocked.

The origin family must retain historical visibility of the heir even when the heir enters or creates a new family.

### Married-In Character Creation

A future character-creation option may allow the player to start as a character married into the family.

Rules:

- this consumes the appropriate heir slot;
- the primary playable character becomes the spouse rather than the original heir;
- the original heir still exists as the marriage link/continuity source if the chosen scenario requires that relationship;
- the option requires both heir capacity and marriage unlock authority;
- this path must not create an offspring, spouse, marriage, family, dowry, or estate from Prestige alone;
- the spouse's identity, family name, and social placement must come from authored or generated authority approved by a future plan.

## Dominant-Sex Naming And Branch Rules

Each race, culture, or region may eventually define a dominant sex for naming, household leadership, or inheritance convention.

Do not add broad infrastructure unless it is needed. If all current cultures use a male-dominant naming convention, model that as the default convention and defer more complex race/region variation until content requires it.

Future rules should allow Prestige-gated exceptions, including:

- the last male heir of a family taking a female spouse's family name;
- a dominant character adopting a completely new family name;
- a dominant character keeping the same family name while creating a legally/socially separate branch;
- a female heir retaining origin-family visibility while joining or creating a new family by marriage;
- regional or race-specific conventions overriding the default if future setting data supports them.

These exceptions should be replay-value unlocks, not free defaults.

A family-oriented Prestige unlock may allow a dominant character to create a separate family or branch while taking reduced inheritance with them. The inheritance share should be incremental and upgrade-gated, with early values such as `0%` or `10%` before later upgrades increase the share.

## Dowry, Boon, And Marriage-Settlement Posture

Marriage can create benefits and costs, but only through explicit owner systems.

Future marriage plans should evaluate:

- dowries;
- household goods;
- tools, animals, or craft assets;
- land or estate claims;
- trade licenses or guild access;
- religious or social boons;
- alliance or renown effects;
- obligations to spouse family, temple, settlement, estate, or lord;
- inheritance reductions or exclusions;
- family-branch prestige costs;
- risks from disputed legitimacy, poor match, cultural mismatch, scandal, or unresolved offspring claims.

Marriage benefits must not become generic free-start bonuses. Every benefit needs an owner, source, scope, validation rule, and failure path.

Dowry and settlement effects should be separated from:

- title ownership;
- estate ownership;
- spouse family recognition;
- offspring eligibility;
- heir slot capacity;
- backstory unlocks;
- item-instance ownership;
- active business ownership.

## Heir Creation Resolver Boundary

A future pure heir creation resolver should consume explicit inputs only:

- candidate offspring records;
- current Prestige heir capacity;
- current Prestige marriage/branch unlocks when relevant;
- current family/household recognition data if available;
- parent character/run evidence;
- legitimacy/recognition flags;
- naming-rule authority when family names may change;
- spouse or marriage authority when married-in or branch creation is requested;
- inheritance-share policy if a separate branch is requested;
- applicable culture, religion, settlement, estate, title, or legal authority only if those systems exist;
- selected offspring id and requested heir creation action.

The resolver should return one of:

- `heir_candidate`;
- `married_in_candidate`;
- `branch_candidate`;
- `not_eligible`;
- `blocked`.

The resolver must not mutate saves, create characters, assign family records, grant titles, allocate estates, transfer dowries, spend Prestige, emit events, or update UI directly.

## Illegitimate Heir And Recognition Boundary

Illegitimate offspring are not invalid by default, but they require explicit rules.

Future planning must decide:

- whether the parent knows the child exists;
- whether the child is acknowledged;
- whether legal/religious/cultural recognition exists;
- whether estate/title inheritance allows the child;
- whether secrecy, dispute, blackmail, adoption, or legitimization can change eligibility;
- whether gameplay evidence can later prove or contest parentage.

No current implementation should assume illegitimate offspring are automatically eligible, automatically excluded, or automatically socially recognized.

## Non-Goals

This document does not implement:

- family records;
- offspring records;
- romance/courtship;
- marriage/union rules;
- brothel or liaison systems;
- illegitimate-heir mechanics;
- heir creation;
- married-in character creation;
- branch family creation;
- naming-rule data;
- dowry, boon, or marriage settlement behavior;
- inheritance-share behavior;
- Prestige spending;
- family tree mutation;
- estate/title/religion/settlement recognition;
- storage or persistence;
- UI;
- runtime events;
- gameplay behavior.

## 0.5.x Candidate Sequence

The safe `0.5.x` sequence is docs-first and pure-helper-first:

1. Offspring, Heir, And Family Continuity Owner Plan - this document.
2. Lore-Friendly Family Naming Convention Plan.
3. Romance, Courtship, And Union Boundary Plan.
4. Marriage, Dowry, And Family Branch Boundary Plan.
5. Offspring Source And Legitimacy Plan.
6. Prestige Heir Slot Unlock Plan.
7. Prestige Marriage And Branch Unlock Plan.
8. Heir Creation Resolver Plan.
9. Heir Creation Resolver Helper.
10. Family Continuity Record Schema Plan.
11. Family Continuity Record Schema.

Only after those boundaries exist should estate, heirloom transfer, bequest claims, family-scoped Backstory Legacy unlocks, or Bloodlines family-management actions become implementation candidates.

## Guardrails For Future Prompts

Future prompts touching heirs, marriage, or family creation must state:

- no automatic first-character family creation;
- no heir without in-game offspring evidence;
- no Prestige-created children;
- no Prestige-created marriage or spouse;
- no family creation from lineage/species id;
- family creation normally occurs only through validated marriage, name change, household departure, or branch-creation authority;
- heirs use origin family name by default unless lore-friendly naming rules say otherwise;
- married heirs remain visible in origin-family history;
- married-in character creation consumes an heir slot and makes the spouse the primary character;
- marriage, branch creation, and additional heir choices are Prestige-gated;
- no automatic legitimate status;
- no title, estate, religion, settlement, culture, dowry, boon, or inheritance effect without owner systems;
- no explicit sexual content;
- brothel/liaison sources, if planned, remain adult-only, non-explicit, and fade-to-black;
- implementation must be narrow, validated, and owner-aware before runtime behavior.

## Open User Decisions

The following questions remain unresolved and should be answered before implementing schemas or helpers:

1. Should the default current setting assume a male-dominant naming/inheritance convention for all races until a race or region explicitly differs?
2. Which races or regions, if any, should use female-dominant, bilateral, clan-based, matrilineal, patronymic, matronymic, or house-based naming conventions?
3. Should married-in character creation be available only at new-run creation, or also as a mid-run handoff after marriage?
4. Should dowries be mostly material, social, legal, religious, or mixed by culture and settlement?
5. Should a dominant-character branch creation unlock begin at `0%`, `10%`, or another inherited-share value?
6. Should keeping the same family name while founding a new branch require a stronger Prestige unlock than taking a spouse's name?
7. Should spouse-origin families be generated, authored, or selected from existing settlement/family records?
8. Should illegitimate offspring ever be eligible for married-in or branch-creation paths without formal recognition?
