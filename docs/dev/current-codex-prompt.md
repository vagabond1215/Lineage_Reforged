# DEV-0.7.1 Slice A - Ordinary Encounter Context Static Authorship

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-28. Planned current-band primary `DEV-0.7.1 - Ordinary Encounter Reachability`; this is its first internal slice, not parent acceptance. Game `0.1.1-prealpha` and `INTEGRATED_LOOP` remain unchanged. Development milestone impact `supports_current_band`; game-version impact `none`.

## Objective and boundary

Implement only the static world-owned action-context authority accepted in `docs/design/ordinary-encounter-context-authorship-decision.md`. The project owner chose a deliberate **Explore nearby environs** action from `settlement.stonevein` onto `world_hex_edge.auric_marches_ore_ridges_auric_marches_caravan_marches`, with `frontier_track` explicitly authored for that action/place. This is one representative case, never a universal first encounter. No current player action or encounter is accepted by this static slice.

Start from a fresh synchronized Lineage checkout. Review current prompt/output/handoff/history/planning, the accepted context and admission contracts, branch/PR refs, live world content/schema/lint/test owners, and relevant failure patterns. Preserve unrelated work and protected refs. Use `master` if the tree remains clean and synchronized; otherwise resolve the actual state before editing.

## Exact implementation

Add one `world.encounter_action_contexts` collection record and strict schema under `packages/content/base/world` and `packages/schemas/world`. The record must explicitly bind stable context ID, action type `player.explore.nearby`, origin Stonevein, local Auric Marches region, anchored Ore Ridges hex, the chosen Ore Ridges–Caravan Marches edge, habitat `frontier_track`, and hazard source `region.auric_marches.simulationProfile.hazardPressure`. Keep the shape reusable for other authored origins/actions. Do not place habitat on the whole region or infer it from terrain, `frontier_entry`, route prose or risk tags; do not force a template ID or change existing spawn/template/monster data.

Register the new collection in `tools/content-lint/index.mjs` and add bounded semantic validation. Verify unique IDs and action/origin/edge tuples, exact references, Stonevein-to-origin-hex anchor, edge endpoint and same-local-region coherence, valid region parent chain, explicit numeric hazard provenance, eligible profile region ancestry/habitat/hazard, and at least one template with matching disposition/movement/habitat and valid matching members. Reject wrong or ambiguous contexts. Use the existing validation structure and no new production dependencies. Add focused positive and negative tests and update the schema-file list if required. Avoid broad lint or content refactors.

Do not change game-engine/world-engine runtime, candidate selection, travel/activity commands, UI, campaign persistence, saves, existing user campaigns, combat, rewards, recovery, `GAME_VERSION` or broad TypeScript baseline. The current resolver can select a habitat-ineligible sapper template from a hand-supplied `frontier_track` context; characterize that as a later resolver gate, not a reason to alter existing template content in this slice.

## Validation and handoff

Run focused new tests, schema-file checks, `npm run tool:content-lint`, adjacent combat-spawn foundation tests, diff/whitespace and clean-scope review. Show the authored record is valid and wrong origin/hex/edge, region parent, hazard, habitat, duplicate/ambiguous keys and missing eligible profile/template/member fail closed. Do not claim creator-to-action reachability from static lint or an injected context. Preserve the known 137 broad UI diagnostics as a baseline, not a green check.

Reach a durable first checkpoint: static record, schema, lint and focused tests in one reviewed commit. Update current output/handoff, branch register, material history/planning pointers and the next prompt. The next route is a separate `DEV-0.7.1` internal slice for a real nearby-exploration command, World caller and validated context resolver; repeatable 5 MiB capacity and combat admission/outcome remain later gates. Commit, push, fetch, and read back exact hosted authority. Distinguish inspected source, implementation commit and publication head; do not mark `DEV-0.7.1` or Game `0.1.1-prealpha` newly accepted from this slice alone.
