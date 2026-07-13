# GPT Deep Research Version Tracking Decision

Source route: GPT-side documentation tracking update after `Version 0.5.217 - Pipeline Roadmap Consolidation`
Date: 2026-06-20
Status: approved documentation-only tracking update; no implementation permission

## 1. Decision Summary

Track GPT Deep Research passes as explicit non-Codex research gates in the planning pipeline before their associated content or authority lanes. These research gates do not consume `0.5.x` Codex version numbers, but they must appear in current coordination guidance whenever they are prerequisites for a later lane.

Use the label format:

`GPT-DR.<lane>.<short-topic>`

Examples:

- `GPT-DR.services.vendor-service-access`
- `GPT-DR.resources.gathering-extraction`
- `GPT-DR.health.injury-recovery`
- `GPT-DR.chronicle.living-character-manuscript`

A GPT Deep Research pass should produce one temporary artifact under `docs/dev/tmp-*-research-YYYY-MM-DD.md` before its associated Codex lane starts. The follow-up Codex pass must then either consume and retain the artifact with one named next consumer, or promote the useful guidance into permanent design docs and retire the artifact.

This update changes version tracking only. It does not move the immediate Codex queue that existed when this decision landed.

## 2. Tracking Rules

1. Codex implementation/planning passes keep the monotonic `Version 0.5.x - <Title>` numbering.
2. GPT Deep Research passes use `GPT-DR.<lane>.<topic>` labels and do not consume Codex patch numbers.
3. If a Deep Research pass is required before a later numbered content/authority lane, list it immediately before that lane in roadmap/sequence language.
4. A Deep Research gate is complete only when its resulting temporary artifact is committed to `docs/dev/` or explicitly marked as not retained.
5. A temporary artifact remains non-canonical and cannot override a permanent design decision.
6. The first Codex pass after a Deep Research artifact must name the artifact as planning input and correct any stale or unverified repo-state claims through live repo inspection.
7. Deep Research gates should be narrow and tied to one future authority question; do not use catch-all reports to bypass the consolidated roadmap.
8. Deep Research gates may be run on GPT Light when credits require it, provided uncertainty is labeled.
9. A completed research gate may be consumed through a four-segment support route when integration should not displace or renumber the next primary roadmap version.
10. Research completion does not authorize implementation. Durable promotion, ownership reconciliation, and a separate implementation decision remain required.

## 3. Immediate Codex Queue At Original Decision

No new Deep Research blocked the ready docs-only schema-decision queue at the time this decision landed:

| Codex version | Pass | Deep Research requirement |
| --- | --- | --- |
| `0.5.218` | Settlement Identity Schema Decision | Existing settlement artifact already committed and consumed by settlement boundary decision. |
| `0.5.219` | Recipe And Production Schema Decision | Existing crafting artifact already committed and consumed by crafting boundary decision. |
| `0.5.220` | Monster Record Schema Decision | Existing combat artifact already committed and consumed by combat boundary decision. |
| `0.5.221` | Weapon And Armor Profile Schema Decision | Existing item/equipment artifact already committed and consumed by item boundary decision. |
| `0.5.222` | Quest Objective And Condition Schema Decision | Existing quest/event artifact already committed and consumed by quest boundary decision. |
| `0.5.223` | Person vs NPC Schema Decision | Existing NPC/social artifact already committed and consumed by NPC boundary decision. |
| `0.5.224` | Magic Study Source Schema Decision | Existing magic-study artifact already committed and consumed by magic-study boundary decision. |
| `0.5.225` | Polity Schema Decision | Existing civic artifact already committed and consumed by civic boundary decision. |
| `0.5.226` | Household vs Family Schema Decision | Existing family artifact already committed and consumed by family boundary decision. |
| `0.5.227` | Settlement Economy Schema Decision | Existing economy artifact already committed and consumed by economy boundary decision. |
| `0.5.228` | World Map Feature Authority Schema Decision | Existing world-map artifact already committed and consumed by geography boundary decision. |
| `0.5.229` | Hazard And Route Security Boundary Decision | Existing travel artifact already committed and consumed by travel boundary decision. |

This section is historical context. Current routing is controlled by the current handoff, prompt, roadmap, and sequence files.

## 4. Research Gates Before Later Content Lanes

The following GPT Deep Research gates should be tracked before their associated later content or authority lanes.

| GPT gate | Research topic | Required before associated lane |
| --- | --- | --- |
| `GPT-DR.discovery.poi-map-reveal` | Discovery, exploration records, map reveal, POIs, secrets, and landmarks | Before map-feature seed planning and before settlement-site authority if those passes need discovery/place-detail guidance. |
| `GPT-DR.services.vendor-service-access` | Services, vendors, shops, training, lodging, repair services, temples, access gates | Before `Service Authority Boundary Decision`. |
| `GPT-DR.resources.gathering-extraction` | Resource nodes, gathering, mining, forestry, fishing nodes, foraging, extraction | Before `Resource And Commodity Schema Decision` or any gathering authority lane. |
| `GPT-DR.health.injury-recovery` | Health, disease, medicine, fatigue, aging, recovery, long-term injury | Before `Combat Status Condition And Injury Boundary Decision`. |
| `GPT-DR.agriculture.land-food-livestock` | Agriculture, land use, food systems, farming, livestock, harvests | Before agriculture/resource-production authority lanes after core map/economy/crafting schemas stabilize. |
| `GPT-DR.maritime.ships-ports-sea-trade` | Maritime systems, ships, ports, fishing, sea trade, piracy, naval travel | Before maritime authority lanes after route/map decisions. |
| `GPT-DR.time.calendar-weather-festivals` | Time, calendar, seasons, weather, festivals, recurring events | Before temporal/event/weather authority lanes. |
| `GPT-DR.property.ownership-storage-housing` | Property, ownership, estates, businesses, storage, housing runtime | Before property/housing authority lanes after people/household/site decisions. |
| `GPT-DR.construction.upgrades-infrastructure` | Construction, upgrades, settlement development, building projects, fortifications | Before construction/project authority lanes after settlement-site/infrastructure decisions. |
| `GPT-DR.progression.character-creation-skills` | Character creation, attributes, skills, progression, classes/backgrounds, training | Before a later progression consolidation or training authority lane. |
| `GPT-DR.companions.party-followers-loyalty` | Companions, party management, followers, hirelings, recruitment, loyalty | Before companion/party authority after people/NPC and relationship boundaries. |
| `GPT-DR.dialogue.rumors-social-memory` | Dialogue, rumors, social memory, conversations, recognition, reputation runtime | Before dialogue/rumor/social-memory authority after people/NPC schema. |
| `GPT-DR.procedural.authored-generated-strategy` | Procedural generation and authored-vs-generated strategy | Before procedural content generation policies after canonical schemas and first seeds. |
| `GPT-DR.chronicle.living-character-manuscript` | Living character manuscript, event selection, grind compression, narrative memory, prose quality, canon/inference, editability, storage, and presentation boundaries | Before any Story/Chronicle manuscript authority, historical-retention, generation, storage, editability, UI, or runtime lane. |
| `GPT-DR.save.runtime-persistence` | Save-state architecture and runtime persistence boundaries | Before any `0.6` runtime-readiness transition. |
| `GPT-DR.ui.information-architecture` | UI/UX information architecture | Before broad UI integration after stable static contracts and command/state ownership. |

## 5. Version Display Policy

When a later content lane has a required research gate, display it as:

```text
GPT-DR.<lane>.<topic> - <Research Title> [GPT Deep Research prerequisite]
Version 0.5.xxx - <Associated Codex Pass>
```

Example:

```text
GPT-DR.services.vendor-service-access - Services, Vendors, Shops, Training, Lodging, Repair, Temples
Version 0.5.xxx - Service Authority Boundary Decision
```

This keeps the numbered Codex stream monotonic while making GPT-side research visible and ordered.

When a completed research artifact needs immediate reconciliation but should not consume the next primary route, use a support suffix:

```text
GPT-DR.<lane>.<topic> - <Research Title> [completed]
Version 0.5.xxx.1 - <Research Integration>
Version 0.5.yyy - <Existing next primary route>
```

## 6. Non-Goals

- no schema changes;
- no validator changes;
- no content JSON changes;
- no tests changed;
- no runtime changes;
- no UI changes;
- no storage/save-state changes;
- no gameplay changes;
- no migrations;
- no automatic temporary artifact deletion;
- no implementation authorization from research alone;
- no transition to `0.6.0`.

## 7. Original Next Recommended Version

At the time this decision landed, the next numbered Codex pass remained:

`Version 0.5.218 - Settlement Identity Schema Decision`

That historical route is complete and is not current pipeline authority.

## 8. Consumed Addendum: Living Character Manuscript Research

The following gate completed on 2026-07-12:

- `GPT-DR.chronicle.living-character-manuscript - Living Character Manuscript / Narrative Chronicle System`

Temporary artifact, deleted after durable promotion in `0.5.344.1`:

- `docs/dev/tmp-living-character-manuscript-research-2026-07-12.md`

Intake route:

- `docs/design/living-character-manuscript-research-intake-route.md`

The artifact was non-canonical planning input. `Version 0.5.344.1` reconciled it against live Chronicle, quest, account-history, discovery, event, runtime, UI, and persistence owners and promoted durable guidance into `docs/design/living-character-manuscript-design-boundary.md`.

The selected immediate support route is:

- `Version 0.5.344.1 - Living Character Manuscript Research Integration`

This support route completed documentation-only, promoted durable guidance into the permanent design boundary, updated central coordination, and deleted the fully consumed temporary artifact. It does not authorize a manuscript implementation.

The research intake originally targeted `Version 0.5.345 - Force Public Order Authority Evidence Audit` as the resumed primary route. That route completed on the local primary sequence before the intake commits were merged. After the support integration, resume the now-current primary route:

- `Version 0.5.346 - Force Public Order Authority Boundary Decision`

## 9. Consumed Addendum: UI Information Architecture Research

The following gate completed on 2026-07-13:

- `GPT-DR.ui.information-architecture - UI/UX and Information Architecture`

Temporary artifact, deleted after durable promotion in `0.6.1.2`:

- `docs/dev/tmp-ui-information-architecture-research-2026-07-13.md`

`Version 0.6.1.2 - UI Information Architecture Research Integration` reconciled the report against the live six-domain shell, current view-model and snapshot owners, runtime command transition, combat timing/action contracts, tactics scoring/preferences, persistence, and UI implementation. Durable guidance now lives in `docs/design/ui-information-architecture-boundary.md`.

The integration preserved a text-first shell, rejected universal Codex ownership, a new canonical Speed/ATB model, rendered-battlefield requirements, fixed party size, and implicit ordered-gambit runtime authority. It made no runtime, UI, schema, content, save, test, or asset change and resumes the unchanged primary route:

- `Version 0.6.2 - Engine-Owned Quest Tracking Command`
