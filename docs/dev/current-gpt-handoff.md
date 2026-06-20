# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.201 - Civic Authority Boundary Decision`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/civic-authority-boundary-decision.md` is the permanent authority for future polity, government, jurisdiction, law, civic-actor, public-order, diplomacy, conflict, and player-state boundaries.
- `docs/dev/tmp-civic-authority-systems-research-2026-06-20.md` is temporary planning input, not design canon.
- Physical geography remains separate from political identity and claims.
- Existing settlement descriptors, map `conflictZones`, `civilization.guilds`, and derived settlement institution profiles retain their current owners and do not become polity or law authority.
- Economy, family, geography, and religion prerequisites remain owned by their existing boundary decisions.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.201 - Civic Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.202 - Polity Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.201 Result

- Selected future `world.polities` as the first civic implementation candidate, beginning with a docs-only schema decision.
- Kept polity separate from government, physical geography, factions, noble houses, religions, and runtime control state.
- Required jurisdiction authority before law-code and local-law schemas.
- Kept law, citizenship/status, crime/justice, guard/garrison/public-order, diplomacy, and conflict descriptive-only in `0.5.x`.
- Preserved factions, existing guild authority, and future institutions as distinct owners.
- Assigned claims/borders, diplomatic relations, and conflicts to separate future overlays.
- Deferred player legal status, faction reputation, wanted/bounty systems, guard AI, courts runtime, diplomacy runtime, and war/conflict simulation to `0.6+`.
- Required first-pass civic records to reject runtime, gameplay, enforcement, mutation, and simulation fields.
- Changed no content, schema, validator, test, Knowledge, runtime, UI, storage, or gameplay behavior.

## Next Route Boundary

`Version 0.5.202 - Polity Schema Decision` should remain documentation-only. It must decide the exact collection and schema paths, records-only wrapper, polity identity/form/status fields, physical-place references, future claim/government links, provenance posture, forbidden fields, validation ownership, and implementation sequence without creating a schema or content.

The temporary civic research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.

The displaced `Household vs Family Schema Decision`, deferred `Settlement Economy Schema Decision`, and `World Map Feature Authority Schema Decision` remain valid later roadmap items.
