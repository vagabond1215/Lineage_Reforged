# Current GPT Handoff

Source route: GPT-side documentation tracking update after `Version 0.5.217 - Pipeline Roadmap Consolidation`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered Codex run remains documentation-only pipeline consolidation.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest handoff, including the GPT-side tracking update.
- `docs/design/pipeline-roadmap-consolidation-decision.md` is the permanent authority for the post-`0.5.217` dependency order, version remapping, temporary-artifact lifecycle, and research gates.
- `docs/design/gpt-deep-research-version-tracking-decision.md` is the permanent supplemental policy for representing GPT Deep Research passes before later content/authority lanes.
- GPT Deep Research gates use `GPT-DR.<lane>.<topic>` labels and do not consume `0.5.x` Codex version numbers.
- The 12 topic authority-boundary decisions remain permanent ownership authority; consolidation sequences them but does not replace their decisions.
- Temporary Deep Research artifacts are non-canonical staging inputs. Each has one named follow-up and retirement trigger.
- Once a higher version lands, older unlanded labels are historical only and must be renumbered when scheduled.
- Prefer docs-only schema decisions, then approved schema/validator/focused-test passes, then seed plans, then narrow seeds.
- Runtime, UI, save state, mutation, execution, transactions, services, combat, crafting, property, and expanded settlement simulation remain outside this `0.5.x` queue.

## Current Anchor

Latest completed numbered Codex run:

- `Version 0.5.217 - Pipeline Roadmap Consolidation`

Latest GPT-side tracking update:

- `GPT-DR tracking policy - GPT Deep Research Version Tracking Decision`

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

## GPT Deep Research Gate Policy

For later lanes that do need new research, insert the GPT-side gate before its associated numbered Codex pass using this display pattern:

```text
GPT-DR.<lane>.<topic> - <Research Title> [GPT Deep Research prerequisite]
Version 0.5.xxx - <Associated Codex Pass>
```

Current tracked future gates include services/vendors, resource nodes/gathering, health/injury/recovery, discovery/POIs, agriculture, maritime, time/calendar/weather, property/housing, construction, progression, companions, dialogue/social memory, procedural generation, save-state, and UI/UX readiness.

## Next Route Boundary

`Version 0.5.218 - Settlement Identity Schema Decision` must remain documentation-only. It should audit the existing settlement schema, classify intrinsic place/identity fields against current embedded population/economy/trade/infrastructure/guild descriptors, preserve region/locality/hex and parent/dependency coherence, define future district/site reference posture, and decide whether the settlement research artifact can be deleted.

It must not change schemas, validators, content, tests, runtime, UI, storage, gameplay, migrations, or unrelated coordination sequencing.

The full conditional roadmap through `0.5.256`, research classifications, blocked lanes, artifact retirement table, and GPT Deep Research tracking policy live in:

- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/gpt-deep-research-version-tracking-decision.md`
