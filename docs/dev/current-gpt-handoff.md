# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.206 - NPC And Social Authority Boundary Decision`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/npc-social-authority-boundary-decision.md` is the permanent authority for people, NPC overlays, social roles, schedules, dialogue, relationships, rumors, companion eligibility, services, Knowledge recognition, and player social-state boundaries.
- `docs/dev/tmp-npc-social-systems-research-2026-06-20.md` is temporary planning input, not design canon.
- Existing workplaces retain facility/job/economy authority; people/NPC records may only reference them.
- Existing player fame/notoriety state and behavior retain their current runtime owner and are not person-local relationship authority.
- Direct kin/care facts remain assigned to future family kinship links; general social links must not duplicate them.
- Economy, family, civic, travel, geography, Religion, and magic prerequisites remain owned by their existing boundary decisions.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.206 - NPC And Social Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.207 - Person vs NPC Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.206 Result

- Selected future `civilization.people` as the first NPC/social implementation candidate, beginning with a docs-only schema decision.
- Kept stable person identity separate from NPC presence/interactable overlays and reusable social roles.
- Kept workplaces/jobs and services/economy separate from person identity.
- Assigned canonical non-kin social relationships to dedicated link records rather than person/NPC arrays.
- Kept schedules descriptive/non-executable and dialogue topics authored/effect-free throughout `0.5.x`.
- Kept rumors as authored seeds and companions as eligibility/characterization authority only.
- Kept service/vendor references reference-only and Knowledge recognition informational-only.
- Preserved current player fame/notoriety behavior while deferring new relationship, memory, favorability/standing, companion, dialogue, schedule, AI, and service runtime to `0.6+`.
- Required new first-pass social records to reject runtime, gameplay, memory, reputation, service-access, player-state, storage, and UI fields.
- Changed no content, schema, validator, test, Knowledge, runtime, UI, storage, or gameplay behavior.

## Next Route Boundary

`Version 0.5.207 - Person vs NPC Schema Decision` should remain documentation-only. It must decide exact collection/schema paths, records-only wrapper, ids, minimum person fields, life/presence status, person-vs-overlay duplication rules, supported references, generated-person posture, forbidden fields, validation ownership, and implementation order without creating schemas or content.

The temporary NPC/social research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.

The unlanded `Version 0.5.205 - Magic Study Source Schema Decision`, deferred `Hazard And Route Security Boundary Decision`, `Polity Schema Decision`, `Household vs Family Schema Decision`, `Settlement Economy Schema Decision`, and `World Map Feature Authority Schema Decision` remain valid later roadmap items.
