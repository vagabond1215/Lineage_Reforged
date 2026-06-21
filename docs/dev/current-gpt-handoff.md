# Current GPT Handoff

Source route: GPT-side tooling guide update after `Version 0.5.218 - Settlement Identity Schema Decision`
Date: 2026-06-21
Branch/status assumption: `master`; latest numbered Codex run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest handoff, including the GPT-side tooling guide update.
- `docs/dev/gpt-codex-tooling-instructions.md` is the active GPT/Codex operating guide for tool choice, skill choice, mode choice, prompt formatting, GPT-DR labels, and cross-thread setup.
- `docs/design/settlement-identity-schema-decision.md` is the permanent settlement identity/schema-posture authority.
- `docs/design/settlement-authority-boundary-decision.md` remains the broader settlement-space ownership authority.
- `docs/design/pipeline-roadmap-consolidation-decision.md` remains the authority for sequence, version remapping, artifact lifecycle, and research gates.
- `docs/design/gpt-deep-research-version-tracking-decision.md` remains the supplemental GPT Deep Research label policy.
- GPT Deep Research gates use `GPT-DR.<lane>.<topic>` labels and do not consume `0.5.x` Codex version numbers.
- Runtime, UI, save state, mutation, services, combat/crafting execution, property, and expanded settlement simulation remain outside this `0.5.x` decision queue.

## Current Anchor

Latest completed numbered Codex run:

- `Version 0.5.218 - Settlement Identity Schema Decision`

Latest GPT-side documentation update:

- `docs/dev/gpt-codex-tooling-instructions.md`

Immediate next numbered Codex run:

- `Version 0.5.219 - Recipe And Production Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Tooling Guide Summary

The GPT/Codex tooling guide standardizes:

- when to use GPT, Codex, Deep Research, GitHub connector tools, web search, and uploaded-file context;
- which Codex skills are useful for docs/schema/content authority work versus later browser-game/UI/asset work;
- prompt skeletons for Codex and Deep Research;
- inspect-last behavior;
- Deep Research artifact handling;
- GPT-DR gate labels;
- project guardrails for keeping `0.5.x` static authority work separate from later `0.6+` runtime/UI/save-state work;
- a consistent cross-thread opening prompt for Lineage Reforged.

## Consolidated Near-Term Queue

1. `0.5.219 - Recipe And Production Schema Decision`
2. `0.5.220 - Monster Record Schema Decision`
3. `0.5.221 - Weapon And Armor Profile Schema Decision`
4. `0.5.222 - Quest Objective And Condition Schema Decision`
5. `0.5.223 - Person vs NPC Schema Decision`
6. `0.5.224 - Magic Study Source Schema Decision`
7. `0.5.225 - Polity Schema Decision`
8. `0.5.226 - Household vs Family Schema Decision`
9. `0.5.227 - Settlement Economy Schema Decision`
10. `0.5.228 - World Map Feature Authority Schema Decision`
11. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. Use the matching permanent decision and temporary artifact for each remaining pass.

## Next Route Boundary

`Version 0.5.219 - Recipe And Production Schema Decision` remains documentation-only. It must resolve the future `crafting.recipes` contract against existing production-chain `recipeProfile` data, preserve item/workplace/economy owners, and decide the crafting research artifact's retirement.

It must not implement schemas, validators, content, tests, runtime crafting, inventory mutation, UI, storage, transactions, services, or gameplay behavior.
