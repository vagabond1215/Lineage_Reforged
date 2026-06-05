# Current Prep Index And Codex Source Stack

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only index of planning work added while waiting for Codex token reset; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Provide a compact index of recent connector-only planning documents so future Codex prompts can reference the right prep files without overloading each task.

This document is a planning index. It does not authorize implementation.

## Core Boundary Rule

An index is not authority expansion.

This document links and groups planning sources. It does not make any deferred system implemented, change roadmap order, modify runtime behavior, or convert connector-only prep into versioned Codex output.

## Active Version Anchor

Current recommended Codex continuation remains:

- `Version 0.5.107 - Knowledge Domain Registry Plan`

Use the existing dev handoff, roadmap, current Codex output, knowledge schema, backlog, and the knowledge-specific prep stack as the primary source set for that version.

## Primary 0.5.107 Knowledge Source Stack

Use for `Version 0.5.107 - Knowledge Domain Registry Plan`:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/sequenced-implementation-plan.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `docs/future_content_backlog.md`
- `docs/design/knowledge-framework-source-map.md`
- `docs/design/knowledge-domain-backlog-normalization.md`
- `docs/design/knowledge-discovery-source-vocabulary.md`
- `docs/design/knowledge-registry-field-ownership.md`
- `docs/design/knowledge-boundary-glossary.md`

## Knowledge Prep Stack

| File | Use |
| --- | --- |
| `docs/design/knowledge-framework-source-map.md` | Source map of existing knowledge schema/content relationships and gaps. |
| `docs/design/knowledge-domain-backlog-normalization.md` | Normalized domain backlog by wave/group/status. |
| `docs/design/knowledge-discovery-source-vocabulary.md` | Discovery source families, source semantics, and non-grant rules. |
| `docs/design/knowledge-registry-field-ownership.md` | Registry vs snippet vs runtime/evidence/validation/presentation ownership. |
| `docs/design/knowledge-boundary-glossary.md` | Clear boundaries between knowledge and adjacent systems. |

## Runtime/State/Events Prep Stack

| File | Use |
| --- | --- |
| `docs/design/runtime-state-ownership-ledger-prep.md` | Cross-pillar owner scopes and mutation-authority levels. |
| `docs/design/advancement-event-boundary-audit.md` | Advancement event families, owner scopes, target systems, non-grant rules. |
| `docs/design/chronicle-renown-evidence-boundary-map.md` | Chronicle/Renown/quest/family/knowledge evidence boundaries. |
| `docs/design/save-load-reliability-source-map.md` | Persistence owner vocabulary and save/load reliability boundaries. |
| `docs/design/validation-blocker-inventory.md` | Validation/tooling blocker categories and confidence-path guidance. |

## Family/Legacy/Magic/Combat Prep Stack

| File | Use |
| --- | --- |
| `docs/design/family-ownership-boundary-audit.md` | Family, Bloodlines, heirloom, bequest, Prestige, Backstory evidence boundaries. |
| `docs/design/legacy-combat-spell-runtime-source-map.md` | Legacy combat spell staging/runtime ownership source map. |
| `docs/design/legacy-combat-spell-runtime-ownership-plan.md` | Existing deferred combat spell runtime ownership plan. |
| `docs/design/shared-spell-hook-support-plan.md` | Spell hook support plan. |
| `docs/design/magic-resolver-planned-output-envelope-plan.md` | Magic resolver inert envelope planning. |

## Economy/Travel/Map/Settlement Prep Stack

| File | Use |
| --- | --- |
| `docs/design/economy-command-surface-source-map.md` | Shop/trade/craft/caravan/workplace/market command-surface boundaries. |
| `docs/design/travel-knowledge-route-source-map.md` | Travel/geography/route/knowledge source boundaries. |
| `docs/design/map-grid-distance-source-map.md` | Current grid scale, route distance, travel mode, and population-center hooks. |
| `docs/design/regional-population-center-expansion-audit.md` | Region/locality/hex/settlement expansion input audit. |
| `docs/design/settlement-placement-heuristics-plan.md` | Non-runtime settlement placement heuristics. |
| `docs/design/settlement-expansion-content-shape-plan.md` | Settlement authoring field/id/population/economy/survival rules. |
| `docs/design/settlement-target-gap-report-plan.md` | Future read-only settlement target gap reporting plan. |
| `docs/design/pilot-region-selection-criteria-plan.md` | Criteria for selecting first pilot region; no content expansion. |

## UI/Asset/Generation Prep Stack

| File | Use |
| --- | --- |
| `docs/design/gameplay-shell-unification-source-map.md` | Gameplay shell/UI-routing boundaries. |
| `docs/design/main-menu-theme-asset-source-map.md` | Main menu light/dark asset source map and generation categories. |
| `docs/design/content-generation-boundary-map.md` | Authored vs generated content boundaries. |

## Recommended Prompt Source Selection

Do not include every prep document in every Codex prompt. Select the smallest stack that matches the task.

### For 0.5.107 Knowledge Domain Registry Plan

Use:

- primary 0.5.107 source stack
- knowledge prep stack
- optionally `runtime-state-ownership-ledger-prep.md` for owner vocabulary only

Avoid:

- settlement/map/menu asset/save-load stacks unless the task explicitly references them

### For future map/grid/distance work

Use:

- `docs/design/map-grid-distance-source-map.md`
- `docs/design/travel-knowledge-route-source-map.md`
- `docs/design/runtime-state-ownership-ledger-prep.md`
- `packages/engines/civilization-engine/src/spatial-world.ts`
- `packages/engines/civilization-engine/src/content.ts`

### For future settlement expansion work

Use:

- map/grid/distance stack
- regional population expansion audit
- placement heuristics plan
- content shape plan
- target gap report plan
- pilot region selection criteria plan

### For future economy command work

Use:

- `docs/design/economy-command-surface-source-map.md`
- `docs/design/runtime-state-ownership-ledger-prep.md`
- `docs/design/content-generation-boundary-map.md`

### For future UI shell/menu asset work

Use:

- `docs/design/gameplay-shell-unification-source-map.md`
- `docs/design/main-menu-theme-asset-source-map.md`
- `docs/design/content-generation-boundary-map.md`

## Stop Point Recommendation

The connector-only prep set is broad enough.

Recommended next project action:

- resume with `Version 0.5.107 - Knowledge Domain Registry Plan` after Codex tokens reset.

## Guardrails For Future Codex Prompts

- Treat connector-only prep docs as planning sources, not implemented behavior.
- Keep the active roadmap sequence intact unless explicitly changed.
- Do not update `docs/dev/current-codex-output.md` for connector-only prep.
- Do not advance roadmap versions for connector-only prep.
- Do not introduce runtime behavior, content JSON, generated output, UI changes, or schema changes from prep docs alone.
