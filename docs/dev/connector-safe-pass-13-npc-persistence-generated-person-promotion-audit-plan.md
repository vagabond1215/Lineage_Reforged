# Connector-Safe Pass 13 - NPC Persistence And Generated-Person Promotion Audit

Date: 2026-08-27

Status: ACTIVE

Execution surface: ChatGPT via GitHub Connector; documentation-only/read-only repository inspection

Source head: `da12fc306318982866640a716e566ce6b1ec7b6f`

Active route protected: `Integrated Gameplay 0.7 Band-Entry Readiness Decision`

## Purpose

Map current people/NPC identity, generated role-holder data, persistence, relationship, and presence semantics so future world/NPC work can distinguish canonical authored people from disposable/generated operators and runtime presence overlays.

## Questions

1. What canonical person/NPC schema or boundary exists today?
2. Which runtime or demo surfaces currently generate, embed, or project NPC-like identities?
3. Which generated identities persist through save/load, and which are presentation-only?
4. What current relationships, schedules, roles, households, locations, traits, or inventories attach to NPC-like records?
5. What would make a generated NPC eligible for promotion into a canonical persistent person?
6. Which facts must be frozen on promotion versus regenerated from world state?
7. How should promotion avoid manufacturing canon from quest issuer strings, office labels, role labels, or generated operators?
8. Which product decisions remain open?

## Success Criteria

- current person versus NPC boundary mapped;
- generated/runtime/presentation/canonical identities separated;
- promotion prerequisites and persistence requirements identified;
- no named person canon invented;
- no production/schema/content/test/save change;
- no effect on active 0.7 band-entry decision.

## Expected Output

- `docs/design/npc-persistence-and-generated-person-promotion-audit.md`;
- completion appendix in this plan.
