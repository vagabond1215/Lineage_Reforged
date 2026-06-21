# GPT Deep Research Prompt Pack Decision

Source route: GPT Deep Research prompt-pack integration after Version 0.5.220 - Monster Record Schema Decision
Date: 2026-06-21
Status: approved permanent planning and prompt-routing authority; documentation only

## 1. Decision Summary

Confirm the temporary prompt pack's ten GPT Deep Research gates as the next prioritized later research set. Their labels and topics exactly match permanent entries in `docs/design/gpt-deep-research-version-tracking-decision.md` and the later research topics in `docs/design/pipeline-roadmap-consolidation-decision.md`.

Adopt the prompt pack's priority order as permanent planning guidance, subject to a live dependency recheck immediately before each gate runs. The order does not merge the topics, pre-authorize research, reserve Codex version numbers, or override the dependency point for any associated lane.

Preserve compact gate briefs, dependencies, recommended modes, artifact names, and the one-gate/one-artifact/one-integration pattern in permanent documentation. Do not preserve the ten full long-form copy-paste prompts. Future GPT threads should generate each prompt on demand from this decision, the stable tooling template, the current handoffs, and the then-current repo.

Delete `docs/dev/tmp-gptdr-prompt-pack-research-2026-06-21.md` after promotion. It has no remaining consumer.

This integration is unnumbered documentation work. `Version 0.5.220 - Monster Record Schema Decision` remains the latest completed numbered Codex run, and `Version 0.5.221 - Weapon And Armor Profile Schema Decision` remains next. No new Deep Research is required before the immediate `0.5.221`-`0.5.229` queue.

## 2. Live Repo Context

Current permanent authority already establishes:

- GPT Deep Research uses `GPT-DR.<lane>.<topic>` labels and does not consume `0.5.x` numbers;
- the numbered Codex queue remains static-authority/schema work through `0.5.229` before later research-dependent lanes;
- each research gate precedes one associated later authority/content lane rather than becoming a broad catch-all report;
- each run produces one temporary `docs/dev/tmp-*-research-YYYY-MM-DD.md` artifact;
- each temporary artifact must later be promoted and deleted, or retained with exactly one named consumer and removal condition;
- external research must not override live repo facts or permanent ownership decisions.

The tracking decision contains five additional later gates beyond this pack: companions, dialogue/social memory, procedural generation, save-state architecture, and UI/UX information architecture. The ten-gate pack is therefore the next prioritized subset, not the complete future GPT-DR inventory.

Live coordination still identifies `0.5.221` as the next numbered Codex run. The first four prioritized research gates feed later work already placed at or after map-feature seeds, services, resources, and combat status/injury decisions; they do not block current schema decisions.

## 3. Confirmed GPT-DR Gate List

| Priority | GPT-DR label | Associated later lane | Recommended mode | Temporary artifact |
| --- | --- | --- | --- | --- |
| 1 | `GPT-DR.discovery.poi-map-reveal` | Map-feature seed planning and settlement-site/district work | Light | `docs/dev/tmp-discovery-poi-map-reveal-research-YYYY-MM-DD.md` |
| 2 | `GPT-DR.services.vendor-service-access` | Service authority boundary | Light; High only for extensive comparison | `docs/dev/tmp-services-vendor-service-access-research-YYYY-MM-DD.md` |
| 3 | `GPT-DR.resources.gathering-extraction` | Resource/commodity and gathering authority | High | `docs/dev/tmp-resources-gathering-extraction-research-YYYY-MM-DD.md` |
| 4 | `GPT-DR.health.injury-recovery` | Combat status/condition/injury boundary | High | `docs/dev/tmp-health-injury-recovery-research-YYYY-MM-DD.md` |
| 5 | `GPT-DR.agriculture.land-food-livestock` | Agriculture/resource-production authority | High | `docs/dev/tmp-agriculture-land-food-livestock-research-YYYY-MM-DD.md` |
| 6 | `GPT-DR.maritime.ships-ports-sea-trade` | Maritime/port/sea-route authority | High | `docs/dev/tmp-maritime-ships-ports-sea-trade-research-YYYY-MM-DD.md` |
| 7 | `GPT-DR.time.calendar-weather-festivals` | Temporal/weather/festival authority | Light | `docs/dev/tmp-time-calendar-weather-festivals-research-YYYY-MM-DD.md` |
| 8 | `GPT-DR.property.ownership-storage-housing` | Property/housing/storage authority | Light | `docs/dev/tmp-property-ownership-storage-housing-research-YYYY-MM-DD.md` |
| 9 | `GPT-DR.construction.upgrades-infrastructure` | Construction/project/infrastructure authority | Light | `docs/dev/tmp-construction-upgrades-infrastructure-research-YYYY-MM-DD.md` |
| 10 | `GPT-DR.progression.character-creation-skills` | Later character creation/skills/progression consolidation | Light | `docs/dev/tmp-progression-character-creation-skills-research-YYYY-MM-DD.md` |

These exact labels comply with the permanent `GPT-DR.<lane>.<topic>` policy. Artifact names intentionally omit the `GPT-DR` prefix while retaining the topic words and required temporary/research/date markers.

## 4. Recommended GPT-DR Priority Order

Use the table order as the default research sequence:

1. Discovery first because map-feature seeds and settlement-site/district decisions need a stable POI, landmark, discovery, and reveal boundary.
2. Services second because vendors, training, lodging, repair, temples, and access gates cross settlement, site, workplace, NPC, economy, crafting, health, and religion authorities.
3. Resources third because gathering/extraction must precede resource/commodity and node decisions without disturbing item, crafting, production-chain, economy, or travel owners.
4. Health fourth because status, injury, disease, poison, fatigue, recovery, death/defeat, and healing-service questions must be separated before later combat consequence work.
5. Agriculture follows resources and benefits from economy, settlement, property, construction, and temporal boundaries.
6. Maritime follows map/route decisions and benefits from resource, economy, settlement-site, security, and travel clarity.
7. Time/weather/festivals follows static authority stabilization and remains descriptive before runtime scheduling/weather.
8. Property follows people, households/families, and settlement sites so physical anchors remain separate from mutable ownership/storage.
9. Construction follows sites, infrastructure, resources, economy, and property so templates remain separate from placed projects/runtime progress.
10. Progression waits until current player, skill, Knowledge, trial, magic-study, guild, service, quest, and training authorities are more mature.

This is planning guidance, not a rigid execution lock. Reorder only when a landed Codex decision changes a prerequisite or a user-selected later lane needs another gate first. Record any durable reorder in current coordination docs and this decision or its successor.

## 5. Dependency Map

```text
world geography + travel + settlement + map-feature decision
  -> discovery / POI / map reveal
  -> map-feature seed planning + settlement-site/district decisions

settlements + sites + buildings + workplaces + people/NPC + economy
  -> services / vendors / access
  -> service authority boundary

geography + items + crafting + production chains + economy + travel
  -> resources / gathering / extraction
  -> resource/commodity and gathering authority

combat + monsters + items + services/medicine + player/NPC state
  -> health / injury / recovery
  -> status/condition/injury boundary

resources + economy + settlement + property + construction + time/weather
  -> agriculture / food / livestock

map features + routes + settlements/sites + economy + resources + security
  -> maritime / ships / ports / sea trade

calendar + events + agriculture + travel + civic/religious cycles
  -> time / weather / festivals

people + households/families + settlement sites + economy
  -> property / ownership / storage / housing
  -> construction / upgrades / infrastructure projects

player identity + skills + Knowledge + trials + magic study + guilds + services + quests
  -> character creation / skills / progression consolidation
```

Dependencies identify when research becomes useful; they do not transfer authority. Each gate must preserve the static-versus-runtime and owner boundaries in the permanent decisions current when it runs.

## 6. Prompt-Pack Preservation Policy

Do not copy the ten full long-form prompts into permanent design or tooling docs. They are useful staging material but contain repo-state wording, sequencing context, and exclusions that will age as decisions land.

Permanent preservation consists of:

- exact GPT-DR label;
- priority and associated later lane;
- compact research goal and dependency map;
- recommended Light/High mode;
- exact temporary artifact naming pattern;
- the standard scope controls and integration lifecycle;
- the rule that a full prompt is generated immediately before the research run from current authority.

When a gate is selected, GPT should:

1. inspect current handoffs and all permanent decisions relevant to that gate;
2. confirm its associated lane is approaching and prerequisites are stable enough;
3. build one copy-paste prompt using the Deep Research skeleton in `docs/dev/gpt-codex-tooling-instructions.md`;
4. preserve the gate's narrow topic, dependencies, exclusions, output sections, citation requirement, and exact temporary artifact name;
5. run only that gate, not the remaining pack;
6. add the resulting temporary artifact and schedule one named integration consumer.

The permanent decision is the prompt-pack reference. No separate long-form dev prompt-pack file is needed.

## 7. Tooling Guide Update Policy

The tooling guide should contain only stable routing rules:

- link to this permanent prompt-pack decision;
- generate full GPT-DR prompts on demand rather than maintaining copied prompt bodies;
- run one gate at a time with its recommended mode;
- perform a live dependency check before execution;
- create one exact temporary artifact per gate;
- require a later Codex documentation integration that retires or explicitly retains the artifact;
- never consume a Codex version number for the research run.

Do not update the tooling guide for ordinary changes in the current numbered queue or paste gate-specific long-form research prompts into it. Current handoffs remain the authority for the next numbered Codex run.

## 8. Temporary Artifact Handling

Delete `docs/dev/tmp-gptdr-prompt-pack-research-2026-06-21.md` in this pass.

All durable content is promoted into this decision and the stable tooling-guide reference: the exact ten gates, priority, dependencies, modes, artifact names, prompt-generation policy, and integration lifecycle. The ten full prompt bodies are intentionally not permanent authority and should not be retained as a second prompt library.

There is no remaining consumer for the temporary prompt-pack artifact. Future GPT-DR prompts must use this permanent decision plus live repo inspection.

## 9. Non-Goals

This decision does not authorize:

- schemas, validators, tests, content JSON, runtime, UI, storage/save-state, migrations, gameplay, or implementation changes;
- a new Deep Research run or execution of any prompt;
- merging the ten gates into one report or authority lane;
- changing, renumbering, or interrupting the immediate Codex queue;
- reserving `0.5.x` numbers for GPT-DR work;
- treating external research as canonical repo authority;
- retaining a permanent library of stale full prompts;
- transition to `0.6.0`.

## 10. Next Recommended Numbered Codex Version

`Version 0.5.221 - Weapon And Armor Profile Schema Decision` remains the next numbered Codex run.

`Version 0.5.220 - Monster Record Schema Decision` remains the latest completed numbered run. This unnumbered prompt-pack integration changes no numbered route and requires no new Deep Research before `0.5.221` through `0.5.229`.

## 11. First Recommended Later GPT-DR Gate

`GPT-DR.discovery.poi-map-reveal` is the first recommended later gate.

Do not run it during the immediate numbered schema-decision queue. Recheck readiness after the `0.5.228` map-feature authority schema decision and run it before map-feature seed planning at `0.5.249` and settlement district/site work at `0.5.251` if those lanes still need discovery, POI, landmark, secret, or map-reveal guidance.

Its generated prompt must preserve world geography, travel, settlement, and map-feature ownership and exclude runtime travel state, pathfinding, UI, save state, encounter generation, procedural generation, quest state, and automatic map rendering.
