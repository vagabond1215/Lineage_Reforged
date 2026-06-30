# Current GPT Handoff

Source version/run: Version 0.5.263 - Settlement District/Site Status Activation Plan
Date: 2026-06-30
Status: docs-only district/site status activation decision completed

## Current Activation Posture

- `docs/design/settlement-district-site-status-activation-plan.md` selects exactly one record for future activation:
  - `settlement_district.highcrown.archive_districts`
- The same plan defers:
  - `settlement_district.highcrown.market_courts`
  - `settlement_site.highcrown.barge_quays`
  - `settlement_site.highcrown.palace_terraces`
- District activation should precede site activation.
- The next implementation run should activate only `settlement_district.highcrown.archive_districts` unless a fresh local audit finds a blocker.
- Activation must remain static place authority only and must not imply archive access, Knowledge unlocks, storage, NPC staff, services, access rules, quests, UI, rewards, or gameplay behavior.
- `market_courts`, `barge_quays`, and `palace_terraces` remain planned because active status could imply unfinished market/economy, route/service, dock/cargo, palace/access, law/control, NPC, UI, or gameplay systems.

## Current Knowledge Subject Posture

- Direct Knowledge subject support exists for:
  - `settlement_district`
  - `settlement_site`
- Knowledge snippet validation is resolver-backed and active-only for both subject types.
- No live settlement district/site Knowledge snippets currently exist.
- Current planned district/site records remain ineligible for live snippets.
- Future activation of `settlement_district.highcrown.archive_districts` would make that one authority record eligible for a later snippet seed plan, but activation itself must not add snippets or create discovery/progress/runtime state.

## Current District/Site Content Posture

- `world.settlements` remains the canonical settlement identity and broad place authority.
- `packages/content/base/world/settlement_districts.json` exists with exactly two Highcrown records:
  - `settlement_district.highcrown.archive_districts`
  - `settlement_district.highcrown.market_courts`
- Both district records remain `status: "planned"`.
- `packages/content/base/world/settlement_sites.json` exists with exactly two Highcrown records:
  - `settlement_site.highcrown.barge_quays`
  - `settlement_site.highcrown.palace_terraces`
- Both site records remain `status: "planned"` and `parentDistrictId: null`.
- `tools/content-lint/index.mjs` still registers both `settlement_districts.json` and `settlement_sites.json`.
- Normal content lint reports `content-lint: ok (63 files checked)`.

## Latest Result

Latest completed:

- `Version 0.5.263 - Settlement District/Site Status Activation Plan`

Immediate next:

- `Version 0.5.264 - Settlement District/Site Status Activation`

## Implementation Result

- Added a docs-only activation decision at `docs/design/settlement-district-site-status-activation-plan.md`.
- Updated roadmap, sequence, backlog, GPT handoff, and Codex output docs.
- Made no settlement, district, site, Knowledge snippet, Knowledge registry/domain/trial-policy, Knowledge schema, Knowledge validator, test, runtime, UI, storage, command, event, reward, migration, save/account, route/travel, sacred-site/religious-hotspot, building/workplace/economy content, or gameplay changes.

## Next Route Guardrail

`Version 0.5.264 - Settlement District/Site Status Activation` should be a narrow implementation pass that changes only `settlement_district.highcrown.archive_districts` from `planned` to `active`, plus workflow docs. It should not activate `market_courts`, `barge_quays`, or `palace_terraces`; add Knowledge snippets; edit Knowledge schemas/validators/registry content; or change runtime, UI, storage, command/event/reward, migration, save/account, route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay behavior unless a newer prompt explicitly changes scope.
