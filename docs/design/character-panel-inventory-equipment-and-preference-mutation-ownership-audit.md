# Character Panel Inventory, Equipment, And Preference Mutation Ownership Audit

Date: 2026-08-03

Execution surface: ChatGPT through GitHub Connector only

Source head inspected: `8214327906fbc2edf7ab4d02168cf94b3abc7e6f`

Status: `CANDIDATE_INTEGRATION`; documentation-only evidence; no implementation permission

## Executive Result

The Character panel is not purely presentational. It can consume inventory items, equip and unequip items, toggle favorites, track skills, and update the session snapshot.

Several of these behaviors remain UI-owned compatibility mutations. Some preference and equipment-stash data is encoded into general snapshot flags, and equipment-slot selection includes hard-coded item-key hints and name inference.

Classification:

`CHARACTER_PANEL_HAS_LIVE_MUTATION_SURFACES; DOMAIN_COMMAND_AND_PREFERENCE_OWNERSHIP_INCOMPLETE`

## Current Interaction Surface

The Character panel currently supports or imports behavior for:

- inventory categorization, sorting, selection, and detail projection;
- consumable effect previews and consumption;
- equipment projection;
- equip and unequip actions;
- favorite-item toggles;
- tracked-skill selection;
- body-state and runtime synchronization after consumption;
- panel-local notices;
- session snapshot replacement.

These actions are user-visible and can alter persistent game-shaped state. They must not be classified as read-only UI.

## Current Flag-Based Storage

`characterPanelState.ts` uses general snapshot flags for concepts including:

- tracked skill identity;
- favorite item keys;
- serialized stashed equipment payloads.

The stashed-item form embeds encoded JSON inside a string flag.

This is a compatibility mechanism, not a durable typed owner. Risks include:

- malformed or truncated payloads;
- item identity collisions;
- stale payloads after item-contract changes;
- duplicate flags;
- silent parse failure;
- inability to validate or migrate independently;
- mixing UI preference, inventory truth, and equipment recovery data in one string collection.

Tracked skill and favorites are preference-like. Stashed equipment is item/equipment state. They should not be generalized under one flag authority.

## Equipment-Slot Inference

Current slot resolution includes:

- an explicit hard-coded map for selected item keys;
- string matching for names such as sword, knife, cutlass, hook, brigandine, coat, harness, glove, focus, ledger, and case.

This provides compatibility for current content, but item-name inference is not authoritative equipment-profile linkage.

A future equipment command should consume accepted item/profile facts and validate:

- item instance ownership;
- allowed slot or slots;
- current slot occupancy;
- displacement destination;
- two-handed or linked-slot rules;
- durability and state preservation;
- duplicate and stale commands;
- atomic inventory/equipment transition;
- exact accepted result and event.

## Consumable Mutation Boundary

The panel resolves content records and consumable profiles, builds a preview, applies consumable effects to body state, changes inventory quantity, and synchronizes player runtime state.

A preview does not authorize use. A future item-use command must distinguish:

- item stack and quantity ownership;
- use-profile identity;
- dose, serving, charge, or container semantics;
- target and context;
- body/effect owner admission;
- inventory consumption receipt;
- effect application receipt;
- duplicate, stale, and correction behavior;
- accepted-only notification and Chronicle projection.

The current consumable and item-use evidence branches are mandatory sources:

- `parallel/consumable-profile-coverage-audit` at `510251f77431b694591d4cbbd8127ed0ef5d3185`;
- `parallel/item-use-profile-effect-ownership-audit` at `d0d67520d06c1172b2b8830955330b26110dee39`.

## Preference Boundary

Favorites, selected section, selected item, inventory category, and sort order are UI preferences or local view state unless explicitly promoted.

Tracked skill may affect gameplay presentation and later progression surfaces. Its owner must be decided rather than inferred from storage location.

A future preference contract should state:

- local-only versus persisted scope;
- character, save, account, or device owner;
- allowed values and stale-reference behavior;
- migration and reset behavior;
- whether preference changes emit gameplay events;
- whether gameplay simulation may consume the preference.

## Mutation Admission

The broader gameplay shell has a campaign mutation admission gateway, but each panel action still needs a named domain owner.

Generic admission should not make the UI the authoritative resolver for:

- item use;
- equipment transfer;
- inventory movement;
- preference persistence;
- skill tracking;
- body-effect realization.

The UI should submit intent and apply accepted results rather than construct cross-owner truth.

## Existing Parallel Evidence

Applicable evidence includes:

- gameplay-shell and UI state ownership: `parallel/gameplay-shell-ui-state-audit` at `882cba46578b49468bcbe624765d9dec0481eace`;
- equipment-profile readiness: `parallel/equipment-profile-readiness-audit` at `6a98bd0b1eca74cee93dca16e0e3a32d9fe595e3`;
- JS/TS module integration: `parallel/js-ts-mirror-export-integrity-audit` at `6304ebf8ab00bbf74e81cd85099dea236373c2af`;
- accessibility and input behavior: `parallel/ui-accessibility-input-source-audit` at `adbf2cef04b8423a9eedc2921e862b4c3e5f1410`.

## Safe Future Sequence

1. docs-only character-panel action and preference ownership decision;
2. pure item-use and equipment plan builders;
3. typed persisted preference decision;
4. one narrow engine-owned consumable command;
5. one narrow engine-owned equip/unequip command;
6. accepted-only panel application and notices;
7. migration away from serialized stash flags only after typed ownership exists;
8. focused duplicate, stale, atomicity, and save/load tests.

Do not migrate every flag or rebuild the entire inventory system in one pass.

## Mandatory Consumers

Future work must inspect this audit when it concerns:

- Character panel mutation behavior;
- consumable use from inventory;
- equip or unequip actions;
- equipment-slot inference;
- item favorites or tracked skills;
- serialized item data in flags;
- inventory/equipment save migration;
- claims that the Character panel is accepted-only or read-only.

## Review Trigger

Re-review when:

- item-use or equipment commands land;
- typed UI preference storage lands;
- stash flags are migrated or removed;
- equipment profiles become live item links;
- Character panel actions change;
- a milestone claims inventory/equipment UI ownership is resolved.

## Validation Limits

This audit used GitHub Connector source and document inspection only. It ran no tests, builds, typechecks, browser checks, content lint, or local Git commands.

No runtime source, tests, schemas, content, UI, prompt, handoff, roadmap, or branch register changed.