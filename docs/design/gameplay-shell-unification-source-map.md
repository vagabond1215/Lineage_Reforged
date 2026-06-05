# Gameplay Shell Unification Source Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future gameplay shell unification work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Map the current and deferred shell/UI-routing boundaries before any future gameplay shell unification pass changes React routing, command dispatch, layout, save/session ownership, or gameplay runtime surfaces.

This document is a planning source. It does not authorize implementation.

## Current Shell Reality

Landed shell/creator work includes:

- launcher `AppShell` use in character creation
- left-sidebar creator summary
- fixed-width creator steps
- full-character randomization
- no-selectable-backstory gating
- total attribute matrix with contribution tooltips
- read-only account meta surfaces for several account/long-term projection systems

Deferred shell work includes:

- gameplay shell unification
- gameplay runtime command routing
- economy command UI
- shop/trade/craft/caravan UI
- active magic command UI
- knowledge UI
- skill trial UI
- Family management UI
- Chronicle/Renown event output UI
- save/account/session mutation surfaces

## Core Boundary Rule

A shell is presentation and routing, not authority.

Shared layout, navigation, panels, summaries, filters, selected ids, and UI state may display and route data, but they must not become the owner of gameplay commands, saves, session mutation, character ownership, family evidence, knowledge discovery, spell casting, economy transactions, or Chronicle/Renown output.

## Shell Surface Vocabulary

| Surface | Future role | Boundary |
| --- | --- | --- |
| `launcher_shell` | top-level app frame and entry routing | should not own gameplay state mutation |
| `creator_shell` | character creation flow presentation | should not infer family/source-run/scoped evidence |
| `gameplay_shell` | future play session frame | must route commands through engine-owned contracts |
| `account_meta_panel` | read-only account/family/projection summaries | display only unless command owners exist |
| `character_panel` | current character state display | selected character is not ownership proof for other systems |
| `world_panel` | map/region/travel display | visibility is not command authority or knowledge completion |
| `combat_panel` | combat state/actions display | action selection is not spell ownership or resolver authority |
| `economy_panel` | market/shop/craft/trade display | price/projection display is not transaction authority |
| `magic_panel` | known/readiness spell display | readiness display is not casting authority |
| `knowledge_panel` | future knowledge domain/snippet display | UI visibility is not discovery/completion evidence |
| `chronicle_panel` | event/history display | displayed record is not grant/evidence unless scoped |
| `family_panel` | future family/bloodline/estate display | selected family/lineage is not owner authority by itself |

## Current Cross-Pillar UI Risks

Future shell work should guard against:

- UI selected ids being treated as command authority
- selected character being treated as family id
- selected backstory being treated as evidence
- read-only account meta projections being treated as mutable state
- Chronicle visibility being treated as evidence grant
- spell list visibility being treated as known-spell ownership
- magic readiness display being treated as active cast permission
- price displays being treated as buy/sell/craft commands
- map visibility being treated as knowledge completion
- route display being treated as caravan dispatch
- family/bloodline display being treated as mutable family state

## Command Routing Boundary

Future gameplay shell command dispatch should require explicit command contracts owned outside presentation.

Examples:

| Command area | Required owner before UI dispatch |
| --- | --- |
| magic casting | magic command contract, resolver readiness, ownership/readiness/effect owners |
| combat action | combat command contract and encounter/session owner |
| shop/trade/craft/caravan | economy command contract and inventory/currency/market/route/workplace owners |
| knowledge study/discovery | knowledge evidence/study/observation owner contracts |
| skill trials | advancement/trial owner contracts |
| family/heirloom/bequest | family/evidence/item-instance/estate owner contracts |
| Chronicle/Renown | event/evidence/output owner contracts |
| save/load | save/account/session owner contracts |

No shell component should invent these contracts locally.

## Recommended Future Pass Order

Recommended sequence when this pillar becomes active:

1. `Gameplay Shell Surface Audit`
   - inspect current AppShell, creator shell, account meta, and gameplay routes
   - docs-only
2. `Gameplay Shell Routing Plan`
   - define which surfaces exist and what data they may display
   - planning only
3. `Gameplay Command Dispatch Boundary Plan`
   - define which command families can be routed only after engine contracts exist
   - planning only
4. `Read-Only Gameplay Shell Frame`
   - UI frame only, no mutation/dispatch
5. `Focused Shell Parity Tests`
   - prove creator behavior and account meta behavior remain unchanged
6. `Narrow Command Surface Integration`
   - only after a specific engine command contract exists

## Forbidden Until Explicitly Scoped

Do not add or change:

- gameplay command dispatch
- active magic casting UI
- shop/trade/craft/caravan command UI
- knowledge completion/discovery UI behavior
- family management mutations
- Chronicle/Renown event creation
- save/account/session schema
- generated output
- broad React routing rewrite
- creator behavior changes
- source/runtime ownership changes

## Recommended Next Connector Work

The next useful connector-only pass is:

- `Advancement Event Boundary Audit`

Rationale: skill mastery trials and magic study events are planned, but runtime behavior remains deferred. That pillar needs shared event/trial vocabulary before helpers or UI work.

## Recommended Future Codex Work

Do not schedule gameplay shell unification ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Gameplay Shell Surface Audit`

It should remain docs-only/read-only and should not alter React routing, gameplay runtime, save/account/session, content, or generated output.
