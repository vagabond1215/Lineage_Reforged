# Content-Lint, Schema Registration, And Validator Coverage Source Audit

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only, documentation-only source audit; no local content lint, tests, builds, typechecks, database generation, or catalog-count execution

## Purpose

Map live content families, schemas, schema-file registration, semantic validators, cross-reference checks, hook-support checks, and normal content-lint coverage before future content, schema, migration, or validator packages.

This audit does not authorize content, schema, validator, test, generated-database, or registration changes.

## Current Classification

`BROAD_CROSS_DOMAIN_CONTENT_LINT_EXISTS; COVERAGE_MUST_BE_PROVEN_PER_PACKAGE`

The root repository exposes `npm run tool:content-lint`, whose Node entrypoint imports and combines broad schema, semantic, lifecycle, cross-reference, and hook-support checks.

The lint surface includes or references validation for domains such as:

- Knowledge domains, snippets, and trial policies;
- religions, sacred sites, and hotspots;
- settlement maps, districts, sites, services, routes, and structures;
- monsters, fauna, ecology, habitats, loot, and combat health vocabulary;
- quests and action trees;
- crafting recipes, resources, commodities, workplaces, production chains, and economy relationships;
- polities, guilds, map features, world regions, hexes, routes, travel modes, and settlements;
- item, spell, magic, and combat hook support;
- lethal-process definition catalogs;
- other canonical content and cross-domain references loaded by the central entrypoint.

## Distinct Validation Layers

| Layer | Purpose | Failure not caught by JSON parsing alone |
| --- | --- | --- |
| JSON syntax | parse file | invalid references, semantics, lifecycle, unsupported hooks |
| JSON Schema | structural shape | cross-file identity, owner, or semantic mismatch |
| schema-file registration | make schema part of known validation surface | orphan schema never exercised |
| wrapper/catalog registration | include live content file | valid schema with no active content consumer |
| semantic validator | domain-specific invariants | internally valid but impossible or contradictory records |
| cross-reference validator | referenced ids/owners exist | dangling or wrong-family links |
| lifecycle/runtime-isolation check | legal relationship and non-runtime misuse | static data silently treated as executable authority |
| hook-support validator | effect/action hooks are implemented and allowed | content advertises unsupported behavior |
| focused tests | validator edge cases and exact accepted package | accidental weakening or missed boundary |
| normal lint | repository-wide integration | package passes focused checks but breaks another domain |

## Current Important Examples

### Equipment Profiles

Weapon and armor profile schemas and pure validation helpers exist, while live profile wrapper files and normal live-content registration remain absent. This is intentional readiness posture, not necessarily a lint defect. A future seed package must distinguish schema registration from live catalog activation.

### Consumable Profiles

Profile catalogs and item links exist with known semantic/link defects recorded by the dedicated consumable audit. Structural validity does not prove truthful item/profile linkage, dose/serving authority, or executable effects.

### Lethal-Process Definitions

The static foundation has strict owner catalogs, a shared envelope schema, semantic validation, registration, and focused acceptance evidence. That does not authorize mutable health runtime instances.

### Hook-Support Checks

Combat and magic validators protect supported resolution and generation hooks. Adding content that names a hook requires proving the hook is supported and correctly owned; a structurally valid string is insufficient.

## Coverage Risks

1. A schema exists but is not registered.
2. A schema is registered but no live wrapper/catalog is loaded.
3. A live content file is loaded without the intended semantic validator.
4. A focused validator passes but normal cross-domain lint fails.
5. A reference points to the wrong owner family while still matching a generic id pattern.
6. Content advertises an unsupported combat, spell, item, or lifecycle hook.
7. A validator is weakened to make one package pass.
8. BOM/encoding behavior differs across readers.
9. Generated database output is mistaken for source authority.
10. Connector inspection repeats historical counts without executing current lint.

## Required Future Content-Package Gate

Every content or schema package should record:

1. exact source files and owner;
2. schema paths and registration;
3. live wrapper/catalog registration posture;
4. semantic validators and focused tests;
5. cross-reference and hook-support implications;
6. normal content-lint result from a fresh local run;
7. database-generation implications, if any;
8. runtime-isolation and non-grant rules;
9. changed-file and complete-diff inspection;
10. accepted counts derived from executed evidence rather than stale documents.

A package may intentionally add a schema without live content, but must say so explicitly and must not claim runtime or catalog maturity.

## Named Consumers

Future work must inspect this audit when it covers:

- any static content package;
- schema activation or migration;
- validator or lint registration;
- content hook support;
- cross-content coherence;
- generated database output;
- `0.7.0` content-readiness claims.

## Review Trigger

Re-review at the next content/schema package, validator registration change, broad static-content readiness audit, or content-lint architecture change.

## Exclusions

No content, schema, validator, tests, generated output, source, dependencies, active prompt, roadmap, backlog, or branch register changed in this pass.
