# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.217 - Pipeline Roadmap Consolidation`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/pipeline-roadmap-consolidation-decision.md` is the permanent authority for the post-`0.5.217` dependency order, version remapping, temporary-artifact lifecycle, and research gates.
- The 12 topic authority-boundary decisions remain permanent ownership authority; consolidation sequences them but does not replace their decisions.
- Temporary Deep Research artifacts are non-canonical staging inputs. Each has one named follow-up and retirement trigger.
- Once a higher version lands, older unlanded labels are historical only and must be renumbered when scheduled.
- Prefer docs-only schema decisions, then approved schema/validator/focused-test passes, then seed plans, then narrow seeds.
- Runtime, UI, save state, mutation, execution, transactions, services, combat, crafting, property, and expanded settlement simulation remain outside this `0.5.x` queue.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.217 - Pipeline Roadmap Consolidation`

Immediate next numbered Codex run:

- `Version 0.5.218 - Settlement Identity Schema Decision`

The prior `Version 0.5.217 - Settlement Identity Schema Decision` did not land and was displaced by consolidation. Do not reuse that label.

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Consolidated Near-Term Queue

1. `0.5.218 - Settlement Identity Schema Decision`
2. `0.5.219 - Recipe And Production Schema Decision`
3. `0.5.220 - Monster Record Schema Decision`
4. `0.5.221 - Weapon And Armor Profile Schema Decision`
5. `0.5.222 - Quest Objective And Condition Schema Decision`
6. `0.5.223 - Person vs NPC Schema Decision`
7. `0.5.224 - Magic Study Source Schema Decision`
8. `0.5.225 - Polity Schema Decision`
9. `0.5.226 - Household vs Family Schema Decision`
10. `0.5.227 - Settlement Economy Schema Decision`
11. `0.5.228 - World Map Feature Authority Schema Decision`
12. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. Use the matching permanent decision and temporary artifact for each pass.

## Next Route Boundary

`Version 0.5.218 - Settlement Identity Schema Decision` must remain documentation-only. It should audit the existing settlement schema, classify intrinsic place/identity fields against current embedded population/economy/trade/infrastructure/guild descriptors, preserve region/locality/hex and parent/dependency coherence, define future district/site reference posture, and decide whether the settlement research artifact can be deleted.

It must not change schemas, validators, content, tests, runtime, UI, storage, gameplay, migrations, or unrelated coordination sequencing.

The full conditional roadmap through `0.5.256`, research classifications, blocked lanes, and artifact retirement table live in `docs/design/pipeline-roadmap-consolidation-decision.md`.
