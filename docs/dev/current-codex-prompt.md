# Character Layered Equipment Owner Contract And Save Migration

Date/route: 2026-10-26, unversioned owner-contract and staged migration route; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, game-version impact none. The earlier unfinished Character UI stack readiness prompt is preserved in `docs/dev/deferred-character-ui-stack-readiness-prompt-2026-10-26.md`. DEV-0.7.2.13 combat result disclosure remains parked in its exact deferred prompt; neither route is accepted by this switch.

## Mission

Implement the next **bounded owner-first slice** needed for the owner's Character equipment direction in `docs/design/character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md`. Current Overview uses one 17-slot `EquipmentState` and fungible inventory stacks. Do not put interactive loadout controls on Overview until real saved state and an authoritative apply command can support them.

First reconcile the accepted item/equipment/inventory authority, draft PR #17's physical fit and identity preflight, current item contracts, starter equipment, inventory actions, SaveSnapshot serialization/load, the historical Ashen Reef survey's exact 17-slot witness and `0.6.0` admission gates, clock/body/world advancement and combat equipment provenance. Produce an explicit backward-compatible migration and transaction design for real Back, sided Ear/Eye and ten sided Ring slots, left-side legacy migration, layered clothing, and saved Equipment/Casual/Accessories configurations. A saved preset references an owned item; it never duplicates a physical item.

Then implement only a coherent owner slice that can be fully tested in this run. Choose the smallest independently useful foundation, such as versioned slot migration plus item-location identity, and state precisely what remains before a one-watch loadout apply. If this foundation cannot safely be isolated, record the decision-complete contract and hold code changes; do not invent fit flags, time side effects, restriction/ability rules or a UI-only switch.

## Required checks

- Fetch/prune and orient to latest `master`, worktree, open PRs and branch register. Read the full current prompt/handoff/output, historical and planning reconciliation, platform/resource policies, relevant failure patterns, accepted item authority and focused preflight. Preserve unrelated changes and protected refs.
- Specify exact old-save migration, item conservation, durability, quantity, occupied-slot, bag/overflow, duplicate-instance and same-item-in-two-presets rules before mutation. Explicitly address the user's left-side migration decision.
- Treat one watch as six current clock ticks, charged only after a fully accepted atomic action. Inspect existing time-consuming owner actions for body/world/save semantics. Reject active combat and other genuinely modeled incapacities through owner state; do not fabricate unavailable swimming/captivity/ability facts.
- Add a failing owner regression before each repair, then run focused equipment/inventory/combat-profile/persistence tests, Node UI typecheck, Vite build, broad TypeScript baseline comparison and `git diff --check`. Where authorized selected gameplay access exists, verify exact item actions, Save/restart, keyboard and responsive UI; otherwise retain the explicit hold.
- Commit/push verified work and update the focused decision, current output/handoff, branch disposition and next prompt. Do not merge draft PRs #5–#17, alter nutrition or combat resolution, or advance `GAME_VERSION`.

Success is one truthful, durable owner checkpoint with exact evidence and an explicit remaining path to the final Overview controls and saved layered loadouts. The entire layered equipment feature must not be claimed complete from the presentation subset or a fixture.
