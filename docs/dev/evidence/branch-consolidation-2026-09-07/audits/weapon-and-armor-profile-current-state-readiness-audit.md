# Weapon And Armor Profile Current-State Readiness Audit

Date: 2026-08-03

Source route: ChatGPT via GitHub Connector

Original branch baseline: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Inspected live master: `91bd8c2c89c85fb9ea7257b2c96b68ab41231b04`

Branch: `parallel/equipment-profile-readiness-audit`

Status: `REFRESHED_CONNECTOR_EVIDENCE_CANDIDATE_INTEGRATION`

Execution posture: connector-only, read-only readiness refresh; no item, profile, schema, validator, test, lint, runtime, UI, save, combat, roadmap, or active-route change

## Purpose

Refresh the structural weapon/armor profile readiness evidence against current master and identify the smallest later planning consumer without authorizing live profile content.

This document is noncontrolling evidence. It must not be interpreted as permission to add profile records, item links, combat rules, or equipment runtime behavior.

## Freshness Review

The comparison from the original baseline to inspected master spans 84 commits.

No changed path in that range belongs to:

- `packages/schemas/items/weapon-profile.schema.json`;
- `packages/schemas/items/armor-profile.schema.json`;
- `tools/content-lint/equipment-profiles.mjs`;
- live weapon or armor profile wrappers;
- canonical item-to-profile link fields;
- equipment-profile runtime or UI consumers.

The intervening repository work added campaign persistence, publication, defeat-recovery authority, and related application coordination. It did not advance structural equipment-profile content.

Result:

`FOUNDATION_UNCHANGED_ROUTE_CONTEXT_UPDATED`

## Existing Accepted Foundation

The following remain the current structural foundation:

- strict weapon-profile schema;
- strict armor-profile schema;
- isolated pure equipment-profile validator;
- focused in-memory validation tests from historical `Version 0.5.233`;
- schema-file registration;
- accepted decision that structural descriptors are separate from item identity and action-bearing `useProfiles`.

This foundation must not be reimplemented under a new label.

## Missing Live Authority

The following remain absent on inspected master:

- `packages/content/base/items/weapon_profiles.json`;
- `packages/content/base/items/armor_profiles.json`;
- normal content-lint registration for live wrappers;
- canonical item-to-profile fields;
- an accepted live seed list;
- a provenance-complete evidence matrix for seeded records;
- runtime or UI consumers;
- migration requirements for existing items;
- any permission to alter combat calculations, equipment slots, item actions, inventory instances, durability, quality, or balance.

Therefore the remaining prerequisite is not schema construction. It is an evidence-backed seed and linkage decision.

## Readiness Classification

| Boundary | Classification |
| --- | --- |
| Schema foundation | `COMPLETE_HISTORICAL_FOUNDATION` |
| Pure validator | `COMPLETE_HISTORICAL_FOUNDATION` |
| Live profile wrappers | `ABSENT` |
| Item-to-profile linkage | `ABSENT` |
| Seed evidence | `PARTIAL_UNSELECTED` |
| Runtime/UI consumption | `ABSENT` |
| Connector-safe implementation | `NO_PACKAGE` |

## Required Seed-Evidence Questions

A later decision must resolve:

1. the exact bounded seed set for weapons and armor;
2. the canonical item identity behind every profile;
3. source authority and notes for each controlled field;
4. whether all current schema fields remain appropriate before live content begins;
5. item-to-profile relation and uniqueness rules;
6. whether one item may have more than one structural profile;
7. lifecycle and semantic-version posture;
8. normal content-lint registration and cross-reference validation;
9. compatibility with embedded `useProfiles` without migrating action authority;
10. explicit exclusions for combat formulas, inventory instances, durability, quality, balance, and UI.

Do not infer a seed merely from item names, tags, family labels, or existing combat actions.

## Relationship To Current Combat Work

The post-baseline repository added a combat-AI/gambit audit document, but no changed path establishes live structural equipment profiles.

A future profile decision may inspect combat contracts for compatibility, but profile records must remain descriptive static authority unless a separate accepted runtime package explicitly consumes them.

## Named Consumer And Review Trigger

This audit must be read by:

- a dedicated weapon/armor profile seed-evidence decision;
- a static equipment-profile implementation package;
- an equipment presentation or inventory-owner decision that proposes consuming structural descriptors;
- a combat integration review that claims weapon or armor profile authority exists.

The consuming run must cite this branch head or an integrated successor, reproduce live file existence and item-link posture from its own head, and identify which findings remain current.

## Branch Disposition

`CANDIDATE_INTEGRATION`

Integration condition:

- compare this refreshed document against current master;
- confirm no later live-profile implementation or schema revision supersedes it;
- integrate or re-author it during the named seed-evidence decision or a dedicated parallel-document coordinator pass.

Retirement condition:

- the evidence is durably integrated or superseded;
- every named consumer can reach equivalent authority on master;
- the exact branch head and preservation are verified.

No local tests, builds, typechecks, content lint, schema execution, or generated-output checks were run in this connector-only refresh.
