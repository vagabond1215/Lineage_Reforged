# Current GPT Handoff

Source version/run: Version 0.5.282 - Settlement Knowledge Subject Validator Support Plan
Date: 2026-07-07

## Status

`Version 0.5.282 - Settlement Knowledge Subject Validator Support Plan` completed as a docs-only validator support plan.

Latest completed primary:

- `Version 0.5.282 - Settlement Knowledge Subject Validator Support Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.283 - Settlement Knowledge Subject Validator Support`

## Versioning Posture

Three-segment labels such as `0.5.283` are primary roadmap versions. Four-segment labels such as `0.5.276.1` are support-run suffixes and do not consume planned primary roadmap slots.

`0.5.282` completed as the next primary after `0.5.281`.

## Decision

Option A selected: implement focused direct `settlement` Knowledge snippet subject validator support and tests before adding the parent `settlement.highcrown` snippet.

Do not add `knowledge_snippet.general_lore.highcrown.identification` until direct `settlement` subject authority validation and focused tests land.

## Current Evidence

Schema and domain support already exist:

- `knowledge_snippet.schema.json` includes `settlement`.
- `knowledge-domain-registry.schema.json` includes `settlement`.
- `knowledge_domain.general_lore` includes `settlement`.
- `knowledge_domain.general_lore` includes `world.settlements`.
- General Lore policy refs remain `null`.

Live authority exists:

- `settlement.highcrown` exists in `world.settlements`.
- Current settlement records do not use active/planned status semantics.

Validator gap:

- `tools/content-lint/index.mjs` loads `settlements.json`.
- `settlements.json` is currently passed only to `locationAuthorities.settlements`.
- Direct `subjectAuthorities` include `settlement_district` and `settlement_site`, but not `settlement`.
- `tools/content-lint/knowledge-snippets.mjs` already requires `subjectAuthorities[record.subjectType]` and can consume a direct `settlement` authority generically.

Focused test gap:

- `tests/unit/knowledge-snippets-validation.test.mjs` loads `settlements.json`.
- The focused fixture does not currently add `settlement` to `subjectAuthorities`.
- Existing tests cover direct `settlement_district` and `settlement_site` positives/negatives, but not direct `settlement` positives/negatives.

## Next Implementation Guardrail

`Version 0.5.283 - Settlement Knowledge Subject Validator Support` should be implementation-only for validator/test support.

Allowed future implementation shape:

- add direct `settlement` to the normal `subjectAuthorities` passed into `validateKnowledgeSnippets`
- use `collectionId: "world.settlements"`
- use `idPrefix: "settlement."`
- use `idPattern: /^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/`
- use `records: settlementWrapper.records`
- preserve `locationAuthorities.settlements`
- add focused in-memory tests for accepted, missing, and malformed direct settlement subjects
- keep direct settlement references existence-backed, not active-only

Do not:

- add Knowledge snippets
- edit Knowledge registry/domain/trial-policy content
- edit schemas unless a fresh implementation audit proves the plan stale
- edit settlement/district/site content
- change anchors
- add route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site, religious-hotspot, or service content
- change runtime/UI/storage/commands/events/rewards/migrations/save-account/gameplay behavior

Suggested next commit:

`test(knowledge): support settlement subject validation`
