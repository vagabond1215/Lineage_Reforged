# Offspring, Heir, And Family Continuity Owner Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-06-14
Status: durable design decision and future-system ownership plan; documentation only

## Purpose

This document records the resolved family-creation and heir-continuity rule for future Bloodlines, family, heir, estate, heirloom, bequest, romance/courtship, and offspring systems.

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
| Recognized heir | A legal/social heir acknowledged by the relevant family, household, settlement, religion, title, or estate authority. | Recognition may differ from biological descent. |
| Illegitimate offspring | Offspring from a source outside recognized marriage/union rules. | May require acknowledgement, proof, secrecy, dispute resolution, adoption, or special support before heir eligibility. |

## Required Upstream Systems

Playable heir creation depends on future owner systems that must be planned and validated before runtime behavior:

- in-game family/household records;
- romance and courtship systems;
- marriage, union, or recognized partnership rules;
- offspring source rules;
- brothel or casual-liaison source rules using non-explicit, adult-only, fade-to-black treatment;
- illegitimate offspring recognition, secrecy, proof, dispute, adoption, and social-consequence rules;
- Prestige heir-slot unlocks;
- heir creation resolver;
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
- family branch preservation or closure choices;
- Chronicle Mark or Lineage Seal conversion only after separately approved rules.

Prestige spending must remain ledger-derived and family-scoped when family ownership exists. Account-wide Prestige or Chronicle resources must not fabricate family/offspring evidence for unrelated characters.

## Family Record Creation Rule

A first character does not automatically create a family record.

A family continuity record may be created only when a playable heir is made from an eligible offspring record, or when a later explicitly approved family lifecycle owner creates a family through validated in-game evidence.

Do not create families from:

- loose `lineageId` or ancestry/species identity;
- account id alone;
- Legacy purchase alone;
- Prestige unlock alone;
- source run id alone;
- UI placeholder state;
- inferred surname text;
- noble/title/estate concepts without owner systems.

## Heir Creation Resolver Boundary

A future pure heir creation resolver should consume explicit inputs only:

- candidate offspring records;
- current Prestige heir capacity;
- current family/household recognition data if available;
- parent character/run evidence;
- legitimacy/recognition flags;
- applicable culture, religion, settlement, estate, title, or legal authority only if those systems exist;
- selected offspring id and requested heir creation action.

The resolver should return one of:

- `heir_candidate`;
- `not_eligible`;
- `blocked`.

The resolver must not mutate saves, create characters, assign family records, grant titles, allocate estates, spend Prestige, emit events, or update UI directly.

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
2. Romance, Courtship, And Union Boundary Plan.
3. Offspring Source And Legitimacy Plan.
4. Prestige Heir Slot Unlock Plan.
5. Heir Creation Resolver Plan.
6. Heir Creation Resolver Helper.
7. Family Continuity Record Schema Plan.
8. Family Continuity Record Schema.

Only after those boundaries exist should estate, heirloom transfer, bequest claims, family-scoped Backstory Legacy unlocks, or Bloodlines family-management actions become implementation candidates.

## Guardrails For Future Prompts

Future prompts touching heirs or family creation must state:

- no automatic first-character family creation;
- no heir without in-game offspring evidence;
- no Prestige-created children;
- no family creation from lineage/species id;
- no automatic legitimate status;
- no title, estate, religion, settlement, or culture recognition without owner systems;
- no explicit sexual content;
- brothel/liaison sources, if planned, remain adult-only, non-explicit, and fade-to-black;
- implementation must be narrow, validated, and owner-aware before runtime behavior.
