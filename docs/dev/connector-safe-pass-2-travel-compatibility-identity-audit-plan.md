# Connector-Safe Pass 2 - Travel Compatibility Identity And Migration-Intent Audit Plan

Date: 2026-08-24

Status: COMPLETE

Execution surface: GitHub Connector, documentation-only

Protected active implementation route: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

## Purpose

Audit current runtime travel destination compatibility keys against canonical settlement/place authority, document where names and identities have drifted, and define a safe future cleanup/migration intent without changing any runtime id, save shape, travel behavior, content JSON, schema, tracked test, or the installed `0.6.11` prompt.

This pass exists because current engine travel uses compatibility destination ids such as `location.saltmere`, `location.westreach`, `location.ashen_reef`, and `location.crown_bastion`, while their current destination facts may point at differently named canonical settlements or site-level destinations. That is an auditability and future-migration concern, but it is not permission to rename live ids.

## Goals

1. Inventory every current `PLAYER_TRAVEL_DESTINATIONS` compatibility key and its live destination facts.
2. Map each key to the strongest current authored place owner available: region, settlement, district/site, or explicit compatibility-only destination.
3. Classify each key as one of:
   - `NAME_ALIGNED`: id meaning still matches canonical destination identity closely enough;
   - `COMPATIBILITY_ALIAS`: stable runtime key whose historical name differs from canonical place identity;
   - `SITE_OR_APPROACH_KEY`: runtime destination is narrower than its settlement owner and should not be equated with the settlement;
   - `AMBIGUOUS_NEEDS_LATER_OWNER`: repository evidence is insufficient for a safe future canonical replacement.
4. Identify all direct consumers that make a rename/migration nontrivial: known-location rows, current-location resolution, activity ids/labels, fixtures/tests, demo presentation, save/persistence authority, quest/survey dependencies, and any recovery path.
5. Separate the Ashen-specific correction already owned by `0.6.11` from unrelated compatibility-key cleanup.
6. Define a future migration-intent contract that requires an explicit implementation decision before any id changes.
7. Add/update only documentation needed to preserve this audit and future trigger; do not alter active implementation routing.

## Baseline Benchmarks

At pass start record:

- hosted `master` head;
- installed current-prompt blob SHA;
- number of entries in `PLAYER_TRAVEL_DESTINATIONS`;
- number of entries whose key label differs materially from current destination `name`/`settlementId`;
- number of keys directly involved in the active `0.6.11` package;
- whether any mismatch is a current blocker outside `0.6.11`.

## Completion Benchmarks

Pass 2 succeeds only if:

- every live destination key is inventoried with canonical mapping and classification;
- the audit names concrete consumers that prevent casual renaming;
- no proposed replacement id is promoted to runtime authority without an accepted owner/migration decision;
- Ashen-specific origin/site correction remains solely within `0.6.11`;
- unrelated travel-key cleanup remains deferred;
- the open-design question/backlog posture is updated only if the existing deferred trigger is too vague;
- `docs/dev/current-codex-prompt.md` remains byte-identical;
- no production/source/content/schema/test/save/runtime/branch/PR mutation occurs;
- hosted comparison from pass start to completion contains documentation files only.

## Evidence Set

Minimum inspection:

- `AGENTS.md`;
- `packages/engines/game-engine/src/player-travel-rules.ts`;
- travel command/caller surfaces and focused tests as read-only evidence;
- `docs/design/travel-authority-boundary-decision.md`;
- `docs/design/discovery-poi-boundary-decision.md`;
- `docs/design/quest-identity-offer-context-and-travel-access-product-direction.md`;
- `docs/design/ashen-reef-soundings-authored-canon-decision.md`;
- current `0.6.11` package decision/prompt/handoff;
- canonical world settlement/site content relevant to the four live destinations;
- save/known-location and Normal recovery authorities where they consume travel ids.

## Method

1. Snapshot live head and current prompt SHA.
2. Inventory live destination constants and origin-resolution behavior.
3. Search only `vagabond1215/Lineage_Reforged` for each key and canonical settlement/site identity.
4. Trace direct consumers and persistence-sensitive references.
5. Classify naming debt versus genuine semantic defects.
6. Produce a durable design/audit document with an explicit future reopening trigger and migration guardrails.
7. Update the deferred design index/backlog only where needed for discoverability.
8. Verify the current prompt SHA and documentation-only final diff.

## Scope Exclusions

Do not:

- rename any `location.*`, `settlement.*`, `activity.*`, quest, operation, or survey id;
- edit travel source or tests;
- add alias/migration code;
- modify known-location/save state;
- change current travel balance, ticks, costs, access, discovery, map/fog, or destination availability;
- broaden the Ashen `0.6.11` correction to other destinations;
- invent canonical settlements/sites from compatibility names;
- alter branches, PRs, or `0.7.0` readiness;
- replace the current Codex prompt.

## Stop Conditions

Stop and classify an item as ambiguous/deferred if:

- canonical place ownership is conflicting or absent;
- a rename would require runtime validation not available through the Connector;
- a compatibility id may encode behavior or historical save meaning not safely inferable from static inspection;
- resolving the issue would change active `0.6.11` implementation scope.

## Expected Outputs

Primary:

- `docs/design/travel-compatibility-identity-and-migration-intent-audit.md`.

Coordination:

- completion appendix in this plan;
- optional narrow update to `docs/design/open-design-questions-index.md` or `docs/future_content_backlog.md` only if it improves future discoverability without changing priority.

No implementation prompt change is authorized.

## Completion Appendix

Outcome: `AUDIT_COMPLETE_DEFER_MIGRATION`

Baseline head before Pass 2: `58ce5acfbb6d79b2c1e3905a3a886be23b46376b`.

Planning commit: `61a7470797680f5b75f5f27c329e26adb8e49d5f`.

Audit artifact: `docs/design/travel-compatibility-identity-and-migration-intent-audit.md`.

Measured results:

- live travel destination keys inspected: **4**;
- materially name-divergent compatibility keys: **4**;
- `COMPATIBILITY_ALIAS`: **3** (`location.saltmere`, `location.westreach`, `location.crown_bastion`);
- `SITE_OR_APPROACH_KEY`: **1** (`location.ashen_reef`);
- `NAME_ALIGNED`: **0**;
- keys directly involved in active `0.6.11`: **1**;
- unrelated current blockers found: **0**.

Key finding: the four keys must not be treated as one homogeneous rename set. Saltmere/Aurelis, Westreach/Stonevein, and Crown Bastion/Sunspire Reach are settlement-era compatibility aliases. Ashen Reef is a narrower reef/anchorage destination whose current settlement-backed origin collision is already owned by `0.6.11`.

The existing open-design index already carries a deferred compatibility-key-cleanup trigger, so no priority/index rewrite was needed. The new focused audit is now the detailed authority for that future question.

No runtime/source/content/schema/test/save/branch/PR change was authorized or made. The active `0.6.11` prompt remains parked and must be verified byte-identical in final hosted validation.
