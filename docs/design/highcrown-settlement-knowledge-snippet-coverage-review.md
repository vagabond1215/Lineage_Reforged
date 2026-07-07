# Highcrown Settlement Knowledge Snippet Coverage Review

Source version/run: Version 0.5.280 - Highcrown Settlement Knowledge Snippet Coverage Review
Date: 2026-07-07

## Decision Summary

Option A selected: current Highcrown settlement-related General Lore coverage has a parent-settlement coverage gap.

The current Knowledge lane now has two district snippets and two site snippets for Highcrown, but no settlement-level General Lore identification snippet for `settlement.highcrown`. That is coherent as a temporary implementation state, but it should not be treated as complete player-facing place coverage. The next primary route should be a docs-first seed plan for a parent settlement snippet, not direct implementation.

## Current Versioning Posture

- Latest completed primary before this review: `Version 0.5.279 - Highcrown Settlement Site Knowledge Snippet Seed`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Current review run: `Version 0.5.280 - Highcrown Settlement Knowledge Snippet Coverage Review`.
- Immediate next primary route selected by this review: `Version 0.5.281 - Highcrown Settlement Knowledge Snippet Seed Plan`.

Three-segment versions remain primary roadmap versions. Four-segment versions remain support-run suffixes and do not consume planned primary slots.

## Current Settlement Authority Posture

`settlement.highcrown` exists in `packages/content/base/world/settlements.json` as Highcrown, a major city in Valtherion's Sapphire Rivers royal floodplain.

The settlement record provides enough authored identity evidence for a static settlement-level identification snippet:

- summary: Valtherion's imperial river capital, naming crown roads, archive districts, and barge quays;
- site context: bluffs above the main Sapphire confluence, naming stone bridges, palace terraces, and the empire's largest market courts;
- identity tags: `continental_capital`, `river_capital`, `imperial_city`, `archive_center`.

This review does not change settlement content.

## Current District Authority Posture

Two active Highcrown district records exist in `packages/content/base/world/settlement_districts.json`:

- `settlement_district.highcrown.archive_districts`, active civic record district identity.
- `settlement_district.highcrown.market_courts`, active civic-commercial district identity.

Both are static authored district records under `settlement.highcrown`. This review does not change district content.

## Current Site Authority Posture

Two active Highcrown site records exist in `packages/content/base/world/settlement_sites.json`:

- `settlement_site.highcrown.barge_quays`, active wharf site identity with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces`, active palace landmark site identity with `parentDistrictId: null`.

The null district anchors remain valid. Current evidence supports Highcrown-level site identity, not placement inside Archive Districts or Market Courts. This review does not change site content or anchors.

## Current Knowledge Snippet Posture

Exactly four Highcrown settlement-related General Lore snippets exist:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`
- `knowledge_snippet.general_lore.highcrown_barge_quays.identification`
- `knowledge_snippet.general_lore.highcrown_palace_terraces.identification`

Exactly two live `settlement_district` snippets exist for Highcrown. Exactly two live `settlement_site` snippets exist for Highcrown. No current General Lore snippet exists for `settlement.highcrown`.

This review does not add, remove, or edit Knowledge snippets.

## Current General Lore Domain/Registry Posture

`knowledge_domain.general_lore` is active and currently advertises:

- canonical subject types: `settlement`, `settlement_district`, `settlement_site`, plus other broad lore subjects;
- related collections: `world.settlements`, `world.settlement_districts`, `world.settlement_sites`;
- category support: `identification`;
- discovery source support: `book_study`;
- trial, completion, and visibility policy refs: `null`.

Schema vocabulary supports `settlement`, `settlement_district`, and `settlement_site`.

Semantic validator posture is uneven: current normal Knowledge snippet validation wires resolver-backed authorities for `settlement_district` and `settlement_site`, but not yet for `settlement` as a direct subject authority. A later implementation that adds a live `settlement` snippet will need a focused validator/test alignment unless a later audit finds the wiring already changed. This review documents that prerequisite and does not edit validators.

## Coverage Review Standard

The review uses these standards:

- Coverage does not require every authority record to have a snippet immediately.
- District and site snippets should not remain without enough parent settlement context indefinitely.
- Snippets should avoid duplicate restatement and use the narrowest truthful subject.
- `settlement` owns parent settlement identity; `settlement_district` owns district identity; `settlement_site` owns placed site identity.
- District snippets must not describe sites, and site snippets must not describe districts.
- A parent settlement snippet must not imply services, access, travel, economy, court/law, vendors, cargo/storage, UI, runtime, rewards, or gameplay.
- Public snippet references should remain active-only where current validators enforce that posture.
- Coverage remains static authored place knowledge only.
- General Lore alignment should not change unless a later implementation prompt explicitly scopes that change.

## Coverage Matrix

| Authority id | Authority type | Current status | General Lore snippet present | Direct Knowledge subject support | Registry/domain support | Coverage status | Recommended action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `settlement.highcrown` | settlement | present | no | partial: schema/registry yes, semantic resolver wiring not yet passed as direct snippet authority | yes: `settlement` and `world.settlements` | gap | Plan a parent settlement snippet first; include validator/test prerequisite review before implementation. |
| `settlement_district.highcrown.archive_districts` | settlement_district | active | yes: `knowledge_snippet.general_lore.highcrown_archive_districts.identification` | yes | yes | covered | No immediate change. |
| `settlement_district.highcrown.market_courts` | settlement_district | active | yes: `knowledge_snippet.general_lore.highcrown_market_courts.identification` | yes | yes | covered | No immediate change. |
| `settlement_site.highcrown.barge_quays` | settlement_site | active; `parentDistrictId: null` | yes: `knowledge_snippet.general_lore.highcrown_barge_quays.identification` | yes | yes | covered | No immediate change. |
| `settlement_site.highcrown.palace_terraces` | settlement_site | active; `parentDistrictId: null` | yes: `knowledge_snippet.general_lore.highcrown_palace_terraces.identification` | yes | yes | covered | No immediate change. |

## Parent Settlement Coverage Review: `settlement.highcrown`

Current coverage has district and site snippets but no parent settlement snippet. That creates a player-facing structure gap because the more specific Highcrown place identities can be discovered without a General Lore record that identifies Highcrown itself as the parent imperial river capital.

General Lore already advertises `settlement` and `world.settlements`, and the schema vocabulary includes `settlement`. The live Highcrown settlement record has enough authored identity evidence for static settlement identification. However, current semantic Knowledge snippet validation does not yet pass `settlement` as a direct subject authority in the same way it passes `settlement_district` and `settlement_site`. That means a later implementation should either first align validator/test wiring for settlement subjects or include that alignment in a separately scoped implementation run.

A settlement-level snippet would not duplicate the district/site snippets if it stays at parent identity level. It should summarize Highcrown as an imperial river capital and contextualize archive districts, barge quays, palace terraces, and market courts without granting or implying any service, route, access, market, court/law, cargo/storage, UI, runtime, reward, or gameplay behavior.

Candidate future shape remains planning-only:

- id: `knowledge_snippet.general_lore.highcrown.identification`
- domainId: `knowledge_domain.general_lore`
- subjectType: `settlement`
- subjectId: `settlement.highcrown`
- tier: `1`
- category: `identification`
- title: `Recognizing Highcrown`
- summary: `Highcrown is Valtherion's imperial river capital, where crown roads, archive districts, barge quays, palace terraces, and market courts define the capital's administrative, river-trade, and civic identity.`
- discovery source type: `book_study`
- source id: `null`
- completionWeight: `1`
- countsTowardTierCompletion: `true`
- trialUnlockWeight: `0`
- lockedUntilDiscovered: `true`
- revealsSubjectIdentity: `true`
- hidden summary: `An unidentified imperial river capital remains to be understood.`
- note: `This snippet is authored settlement identity knowledge only and grants no settlement access, services, vendors, prices, trade execution, travel routes, dock operation, cargo inventory, storage, palace access, court/law mechanics, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.`

This candidate is safe enough for a future docs-first plan to evaluate, but it is not approved for implementation by this review.

## District Coverage Review

The current district snippets remain sufficient and should not be changed in this review.

`knowledge_snippet.general_lore.highcrown_archive_districts.identification` correctly uses the active `settlement_district.highcrown.archive_districts` subject, fits General Lore, and preserves static-only boundaries. It does not need to merge into a settlement snippet.

`knowledge_snippet.general_lore.highcrown_market_courts.identification` correctly uses the active `settlement_district.highcrown.market_courts` subject, fits General Lore, and preserves static-only market/civic wording. It does not imply vendors, prices, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, UI, runtime, rewards, or gameplay behavior.

## Site Coverage Review

The current site snippets remain sufficient and should not be changed in this review.

`knowledge_snippet.general_lore.highcrown_barge_quays.identification` correctly uses the active `settlement_site.highcrown.barge_quays` subject. Its `parentDistrictId: null` authority posture remains valid. The snippet does not imply Market Courts ownership, dock operation, cargo/storage, travel, route topology, vendors, services, UI, runtime, rewards, or gameplay behavior.

`knowledge_snippet.general_lore.highcrown_palace_terraces.identification` correctly uses the active `settlement_site.highcrown.palace_terraces` subject. Its `parentDistrictId: null` authority posture remains valid. The snippet does not imply placement inside Market Courts or Archive Districts and does not imply palace access, court/law mechanics, services, UI, runtime, rewards, or gameplay behavior.

## Coherence Risks And Wording Boundaries

The main coherence risk is orphaned specificity: a player-facing Knowledge structure can now identify Highcrown's districts and sites before it has a settlement-level Highcrown identity snippet. That is acceptable as a temporary lane state, but it should be closed through a planned parent settlement snippet.

The main implementation risk is validator readiness. Schema and registry vocabulary already include settlement support, but live semantic snippet validation needs focused confirmation and likely explicit `settlement` subject authority wiring before a `settlement.highcrown` snippet can be implemented safely.

The wording boundary for any future parent snippet is strict. It may describe static settlement identity and authored place context only. It must not imply services, access, travel, route topology, market operation, vendors, prices, dock operation, cargo/storage, palace access, law/court mechanics, ownership, NPC staffing, UI, runtime, rewards, or gameplay.

## Decision Outcome

Selected outcome: Option A.

Parent-settlement coverage gap found; plan a later docs-first settlement snippet seed plan.

## Future Implementation Recommendation, If Any

Next primary route:

`Version 0.5.281 - Highcrown Settlement Knowledge Snippet Seed Plan`

That run should remain docs-first. It should evaluate the exact parent settlement snippet shape, decide whether validator/test alignment is a prerequisite for implementation, and preserve the no-snippet/no-registry/no-schema/no-validator/no-content/no-behavior boundary unless a later focused implementation prompt explicitly scopes those changes.

## Rejected Alternatives

- Adding the parent settlement snippet now: rejected because this run is coverage review only.
- Adding any other snippets now: rejected as out of scope.
- Editing existing district snippets now: rejected because current district coverage is sufficient.
- Editing existing site snippets now: rejected because current site coverage is sufficient.
- Editing General Lore registry, domain, or trial-policy content now: rejected because current registry/domain posture is sufficient for review and this run is docs-only.
- Editing Knowledge schemas or validators now: rejected because validator alignment needs a later focused scope.
- Changing settlement, district, or site content: rejected as forbidden by this review.
- Changing site anchors: rejected because current null anchors remain valid.
- Merging district/site snippets into a settlement snippet: rejected because direct district and site subjects are more precise.
- Using settlement snippets to imply services, travel, market operation, palace access, court/law, cargo/storage, UI, runtime, rewards, or gameplay: rejected.
- Adding route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site, or religious-hotspot content: rejected as out of scope.

## Explicit Non-Goals

This review does not add snippets, edit Knowledge registry/domain/trial-policy content, edit Knowledge schemas or validators, edit settlement/district/site content, change site anchors, edit tests, or change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel systems, building/workplace/economy systems, court/law systems, vendor/market systems, cargo/storage systems, sacred-site/religious-hotspot content, or gameplay behavior.

## Validation And Audit Posture

Read-only audits confirmed:

- `settlement.highcrown` exists and remains unchanged by this review.
- Both Highcrown district records remain active and unchanged by this review.
- Both Highcrown site records remain active with `parentDistrictId: null` and unchanged by this review.
- Exactly four Highcrown settlement-related General Lore snippets exist.
- Exactly two live Highcrown `settlement_district` snippets exist.
- Exactly two live Highcrown `settlement_site` snippets exist.
- No `settlement.highcrown` General Lore snippet exists.
- General Lore supports `settlement`, `settlement_district`, `settlement_site`, `world.settlements`, `world.settlement_districts`, `world.settlement_sites`, `identification`, and `book_study`.
- General Lore policy refs remain `null`.
- Schemas include `settlement`, `settlement_district`, and `settlement_site` subject vocabulary.
- Current semantic validator wiring should be treated as requiring settlement-subject follow-up before a parent settlement snippet implementation.
- Normal content lint remained clean at `content-lint: ok (63 files checked)`.

## Next Recommended Version

Version 0.5.281 - Highcrown Settlement Knowledge Snippet Seed Plan
