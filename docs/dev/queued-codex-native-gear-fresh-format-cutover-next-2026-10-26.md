# Queued Codex: Native Gear Fresh-Format Caller + Save Cutover

Date: 2026-10-26
Status: `QUEUED_OWNER_IMPLEMENTATION; NOT_INSTALLED_ON_MASTER; RUN_ONLY_WHEN_USER_SELECTS`
Game: `0.1.1-prealpha`; current capability: `INTEGRATED_LOOP`; parked combat `DEV-0.7.2.13`.
Repository: `vagabond1215/Lineage_Reforged`.
Intent: implement one coherent existing-owner-to-real-game cutover. Do not attempt a bulk PR merge, mass historical migration or UI redesign.

## Copy/paste task for Codex

Work in `vagabond1215/Lineage_Reforged`. First fetch `master` and check the exact current heads and disposition of draft PRs #19, #20, #22, #25 and #26, plus the still-parked old UI PRs #7–#16 and design PR #24. Read `AGENTS.md`, repository working protocol, current output/handoff, PR #19's approved **fresh-save epoch** product decision, PR #20's native gear-instance owner implementation/checkpoint, and PR #26's four connector evidence files, especially `docs/dev/codex-25-echo-gear-ui-integration-preflight-2026-10-26.md` and `docs/dev/connector-safe-pass-saturation-and-next-owner-admission-2026-10-26.md`. Treat the old master `docs/dev/current-codex-prompt.md` demand to repair/convert **obsolete development saves** as superseded by accepted PR #19 policy: old dev saves may be explicitly incompatible, but valid newly written format campaigns, survey evidence and publication history must survive Save/restart. Do not rewrite the installed prompt during initial source review.

**One selected mission: complete the native equipment caller + current-format Save cutover using PR #20's existing owner as source, on a new isolated implementation branch from fresh master.** Keep #20 untouched, use cherry-pick/adaptation of only necessary commits and review each conflict semantically. Do not merge PR #19 docs or #22→#25 Echo runtime as a shortcut. No parallel legacy equipment writer may remain when the new gear owner is live.

Before editing runtime, run a tight current-source closure audit: read all seven live starting bundles, their 19 distinct item identities, canonical item classes, every actually supported equip/unequip/item grant path, bags and their unique identity/capacity, 17-slot legacy equipment consumers, Character/Inventory presentation, resource/effective worn projections, combat hooks, survey capture/witness/fingerprint, session revisions, persistence serialization, SaveManager envelope/publication/recovery and selected new-character assembly. Finish **authored, validated fit profiles** for every supported nonfungible starter/equippable item; explicitly classify consumables/commodities vs durable tools, clothing, armor, accessories and containers. No item-class guess automatically creates a worn slot. Unsupported gear must fail safely without erasing valid starter items.

Implement a single revisioned native gear graph with stable per-instance IDs, actual condition/durability and exactly one worn, bag or overflow location. Creator grants, ordinary Equip/Unequip, displacement, duplicate item types and bag capacity must route through it. Preserve fungible stacks and exact-bag targeting, including duplicate bag-ID negative tests. Derive effective-worn values for combat, resources, UI and survey from that same owner, never from stale `ui.character.item-stash.*` flags or a second equipment map. Add a new current-format Save schema/envelope only as necessary; make invalid older development slots safely display as incompatible, without deleting user data. Preserve authentic **new-format** survey receipts and accepted history with explicit witness versioning where needed.

Use red-before-green tests at **real caller boundaries**, not only the stand-alone gear owner: all seven starter bundles; two copies of one item with unequal durability; equip/unequip to occupied slot; bag/overflow and stack capacity; stale selection, duplicate/retry and interrupted publication; combat/resource owner parity; exact survey capture and Soundings completion; creator→Save→full restart/load→same item IDs/locations/condition. Include malformed/corrupt current-format and intentionally incompatible old development-save cases. Run focused owner/UI/persistence/survey/combat tests, Node UI typecheck, direct Vite production build, clean-master-relative broad TS diagnostics and diff checks. Report result counts and **do not** claim authenticated selected-client acceptance unless actually executed on this branch.

Stop before touching default Area/Atlas implementation, old #16 topbar, #22→#25 Echo/Dev, founder policy, generic one-watch command, weather, resource gathering, parked combat result disclosure or Site deployment. Keep existing Dev button design policy for later integration. If complete atomic gear cutover proves too large or unsafe, **do not ship a partially activated dual owner**: stop with source-identified blockers, a bounded independent next task and tests/evidence. Commit/push only verified work to the new isolated branch, open a **draft PR**, update its own focused decision/output/handoff/branch disposition without clobbering other active prompts, and report exact SHA, PR link, accepted tests, saved data policy and held risks. No game-version change or master merge.

## Why this order

- PR #20 already supplies an isolated tested graph, six fit profiles and owner JSON readback; it is not connected to production, Save, combat or survey.
- PR #19 is the product-approved fresh-save policy, not a request to preserve ambiguous old development equip/stash data.
- PR #25 adds stronger Echo admission/Dev but is **stacked on #22** and modifies campaign validation/Save; combine only after a real cross-owner Save schema rehearsal.
- Old UI branch stack is 39 master commits behind, and master has newer Character/Calendar/Atlas source. Do not restore old components wholesale.
- PR #24's accepted default Current Area and Atlas separation stays the **next UI consumer** after coherent owner integration, not part of this cutover.

## Acceptance boundary

Implementing code and passing local tests are distinct from selected-client acceptance. The first selected-client integrated run after gear + Echo composition must separately verify creation, zero initial Echo, starter gear, real equip, Soundings four shifts/5g once, encountered gameplay, Save/restart, narrow UI/Dev focus and default named Current Area when later implemented.

Queued task only. This file is safe to commit on evidence branch, not a replacement for any in-progress Codex prompt.
