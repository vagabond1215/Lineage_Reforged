# Travel Compatibility Identity And Migration-Intent Audit

Date: 2026-08-24

Status: connector-side documentation-only audit; no implementation authority

Source baseline before Pass 2: `58ce5acfbb6d79b2c1e3905a3a886be23b46376b`

Pass 2 planning commit: `61a7470797680f5b75f5f27c329e26adb8e49d5f`

Protected active implementation route: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

## 1. Decision Summary

The current engine travel catalog contains exactly four live `location.*` destination ids. None is a clean canonical place-id family. Three are historical/compatibility aliases whose keys differ materially from the canonical settlement identities carried by their own destination facts. The fourth, `location.ashen_reef`, is a compatibility destination for a reef survey approach/anchorage and is intentionally narrower than its associated Starfall settlement.

This is auditability and future migration debt, not a current permission to rename ids.

No runtime id, save row, travel command, source file, content record, schema, validator, test, migration, activity, quest, or current prompt is changed by this audit.

The only current correctness defect in this family that belongs to an active package is the Starfall-versus-Ashen origin collision already owned by `0.6.11`. Unrelated compatibility-key cleanup remains deferred.

## 2. Current Runtime Destination Inventory

`packages/engines/game-engine/src/player-travel-rules.ts` currently owns these four destination records:

| Runtime destination id | Current destination name | Region | Settlement owner carried by runtime facts | Runtime site label | Classification |
| --- | --- | --- | --- | --- | --- |
| `location.saltmere` | `Aurelis` | `region.verdant_thalos` / Verdant Thalos | `settlement.aurelis` | `Harbor Quarter` | `COMPATIBILITY_ALIAS` |
| `location.westreach` | `Stonevein` | `region.auric_marches` / The Auric Marches | `settlement.stonevein` | `Market Ward` | `COMPATIBILITY_ALIAS` |
| `location.ashen_reef` | `Starfall Port` in current v1 travel presentation | `region.starfall_isle` / Starfall Isle | `settlement.starfall_port` | `Survey Anchorage` | `SITE_OR_APPROACH_KEY` plus retained compatibility identity |
| `location.crown_bastion` | `Sunspire Reach` | `region.silver_valleys` / Silver Valleys | `settlement.sunspire_reach` | `Gate Muster` | `COMPATIBILITY_ALIAS` |

Count benchmarks:

- live destination keys: **4**;
- keys whose id label differs materially from current destination name/settlement identity: **4**;
- keys directly owned in part by active `0.6.11`: **1** (`location.ashen_reef`);
- unrelated mismatch blockers before `0.6.11`: **0**.

No entry is classified `NAME_ALIGNED`.

## 3. Why The Three Settlement Aliases Are Not Safe Rename Candidates Yet

### 3.1 `location.saltmere`

Current travel facts identify the destination as Aurelis and `settlement.aurelis`, while the runtime key and arrival activity retain Saltmere naming.

The id is not isolated presentation. Repository search shows it is consumed by travel rules/commands, gameplay shell paths, demo snapshot state, snapshot synchronization, shared/runtime state, and focused travel tests. Saltmere-era presentation also appears in retained historical evidence and other current compatibility surfaces.

Therefore:

- `location.saltmere` should be treated as a runtime compatibility alias, not current canonical settlement identity;
- `settlement.aurelis` is the strongest current settlement reference already carried by travel facts;
- this audit does **not** prove that `Saltmere` should become a canonical Aurelis site, district, alias record, or historical-name record;
- a later migration must separately decide what retained Saltmere narrative/history, if any, is still canonically meaningful.

### 3.2 `location.westreach`

Current travel facts identify the destination as Stonevein and `settlement.stonevein`; the runtime key and arrival activity retain Westreach naming.

Direct consumers include travel origin resolution, known-location eligibility, command/result/event behavior, gameplay-shell travel paths, and focused unit/characterization tests.

Therefore:

- classify `location.westreach` as `COMPATIBILITY_ALIAS`;
- do not infer a new `settlement_site.*` or district named Westreach from the runtime key;
- do not rename it until a later implementation pass can update all consumers and prove persistence/current-state semantics together.

### 3.3 `location.crown_bastion`

Current travel facts identify the destination as Sunspire Reach and `settlement.sunspire_reach`; the runtime key and arrival activity retain Crown Bastion naming.

The current runtime site label is `Gate Muster`, not `Crown Bastion`. Current authored settlement-site authority does not establish a canonical `Crown Bastion` site identity merely because the travel compatibility key exists.

Therefore:

- classify `location.crown_bastion` as `COMPATIBILITY_ALIAS`;
- preserve the possibility that Crown Bastion may later be authored as a site/fort/landmark if explicit canon supplies that identity;
- do not promote the compatibility string into static place authority by inference;
- do not mechanically rewrite the key to `location.sunspire_reach` without a migration/ownership decision.

## 4. Why `location.ashen_reef` Is Different

The Ashen key should not be treated as merely an outdated name for `settlement.starfall_port`.

Accepted authored direction already establishes that:

- Ashen Reef is a distinct hazardous reef complex associated with Starfall maritime approaches;
- `location.ashen_reef` is the current travel compatibility key for the survey approach/anchorage;
- its runtime settlement context is `settlement.starfall_port` because the current travel system is settlement-oriented;
- `Survey Anchorage` is the arrival surface;
- the key must not imply identity equality between Ashen Reef and Starfall Port.

The current source incorrectly resolves every character in `settlement.starfall_port` as already being at `location.ashen_reef`. `0.6.11` already owns the bounded site-aware correction: only the survey anchorage/legacy Ashen site posture should resolve to the reef destination; ordinary Starfall positions remain Starfall origins.

Therefore:

- classify `location.ashen_reef` as `SITE_OR_APPROACH_KEY` with retained compatibility identity;
- do not include it in a future blind settlement-alias rename;
- let `0.6.11` perform only its already-authorized origin/presentation correction;
- any later canonical reef/site/route destination identity migration must be a separate post-acceptance decision.

## 5. Canonical Place Ownership Boundary

Current authored world authority separates place families rather than using `location.*` as a universal canonical id namespace.

Relevant principles:

- settlements own settlement identity;
- settlement districts and settlement sites own narrower authored place identity where records actually exist;
- runtime `KnownLocationState` owns player/session knowledge of a location id and its presentation facts; it is not a static canonical place catalog;
- discovery/POI presentation must derive from specific authored owners plus player-known/reveal state rather than creating a generic POI/place owner;
- runtime site labels such as `Harbor Quarter`, `Market Ward`, `Survey Anchorage`, or `Gate Muster` do not independently mint canonical `settlement_site.*` records.

`packages/content/base/world/settlement_sites.json` currently contains only explicitly authored site records. None of the four travel arrival labels should be promoted into that authority merely because the travel engine displays them.

## 6. Migration-Sensitive Consumer Matrix

A future rename is not a string-cleanup exercise.

| Consumer | Why it matters |
| --- | --- |
| `PLAYER_TRAVEL_DESTINATIONS` | Destination lookup is keyed by the current `location.*` ids. |
| `getCurrentPlayerTravelLocationId(...)` | Origin resolution hard-codes settlement -> compatibility-id mappings. |
| `KnownLocationState.id` / `sessionState.knownLocations` | Travel eligibility compares the requested destination id against durable/session-known rows. |
| Travel plan/result/event facts | Destination and origin ids become command/result/event evidence. |
| Arrival activity ids and labels | Several retain the old compatibility-name vocabulary independently of the settlement display name. |
| Gameplay shell/callers | Current UI/caller behavior submits and interprets the compatibility destination ids. |
| Demo/fixture state | Historical demo rows and test fixtures use the current ids and may retain older presentation. |
| Focused travel tests | Unit/characterization tests encode exact ids, labels, acceptance/rejection, and origin behavior. |
| Snapshot synchronization/persistence | Known-location and current-location semantics survive projection/publication boundaries. |
| Defeat/recovery and retained authority | Some recovery/evidence paths depend on exact place/location facts and must be reverified rather than text-replaced. |
| Ashen quest/survey | `location.ashen_reef` is causal eligibility for the accepted survey path and has additional operation/activity dependencies. |

Any future implementation must inspect the live complete consumer set again; this table is a minimum migration surface, not a closed file list.

## 7. Future Migration Intent

A later travel/location identity cleanup should be a dedicated repository-capable implementation decision, not an incidental edit inside another gameplay package.

Recommended decision order:

1. **Choose the canonical runtime destination owner.** Decide whether player travel should target canonical settlements directly, canonical sites/routes where narrower destinations exist, or a small typed travel-destination record that references canonical place owners without duplicating them.
2. **Re-inventory current consumers.** Search live source, tests, content, saves/current fixtures, event/result contracts, recovery, UI callers, and persistence at the implementation head.
3. **Classify each legacy key independently.** Do not assume the three settlement aliases and Ashen approach key receive the same migration treatment.
4. **Choose current-data migration semantics deliberately.** The repository is pre-release/current-data-first by default; do not add permanent aliases or old-save rescue behavior unless a concrete retained-authority/compatibility requirement proves it necessary.
5. **Preserve historical evidence where required.** A current runtime rename must not rewrite accepted historical documents, retained survey v1 authority, old receipts/results/events, or historical audit evidence merely for naming consistency.
6. **Update the full mutation atomically.** If ids change, update destination lookup, origin resolution, known-location rows, current creator/recovery state, callers, tests, and persistence-validation expectations as one coherent package.
7. **Prove restart/retry behavior.** Validate current authoritative publication/load/restart and any duplicate/retry path that consumes the changed identities.

No replacement id is authorized by this audit.

## 8. Reopening Trigger

Reopen this migration only after one of these triggers occurs:

- `0.6.11` implementation and independent `0.6.11.1` acceptance are complete and a subsequent travel/location cleanup is intentionally prioritized;
- a new travel/journey/route or precise-location consumer requires canonical destination references rather than compatibility keys;
- a save/current-data contract must change and destination identity is part of that change;
- explicit authored place work establishes one of the old compatibility names as a real site/fort/district/history identity and a consumer needs that distinction.

Do **not** reopen merely because a key name looks untidy.

## 9. Current Route Effect

None.

`Version 0.6.11` remains the parked active implementation route. Its Ashen-specific site-aware correction remains required exactly as authorized. This audit does not add Saltmere/Aurelis, Westreach/Stonevein, or Crown Bastion/Sunspire Reach cleanup to that package.

No additional authored user decision is required before `0.6.11`.

## 10. Pass 2 Disposition

Outcome: `AUDIT_COMPLETE_DEFER_MIGRATION`

- four live compatibility destinations inventoried;
- three settlement compatibility aliases identified;
- one narrower reef/anchorage compatibility destination identified;
- zero unrelated blockers found;
- future migration requires repository-capable implementation and validation;
- active Ashen implementation scope remains unchanged.
