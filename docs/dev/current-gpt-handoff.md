# Current GPT Handoff

Source version/run: Version 0.5.275 - Highcrown Settlement Site Activation Readiness Review
Date: 2026-07-06

## Current Status

`Version 0.5.275 - Highcrown Settlement Site Activation Readiness Review` completed as documentation only.

New review document:

- `docs/design/highcrown-settlement-site-activation-readiness-review.md`

The review selected both current planned Highcrown site records for a later tiny active-status implementation as static site identity:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

No content activation happened in 0.5.275. Both records remain `status: "planned"` with `parentDistrictId: null`.

## Current Site Activation Planning Posture

Future activation is safe only as static authored site identity.

For `settlement_site.highcrown.barge_quays`, the selected future summary is:

`Static river-wharf site within Highcrown where the capital's barge quays mark its inland river trade identity.`

The selected future note is:

`Static site identity only; no dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.`

For `settlement_site.highcrown.palace_terraces`, the selected future summary is:

`Static palace landmark site within Highcrown where terraced palace grounds mark the capital's imperial bluff identity.`

The selected future note is:

`Static site identity only; no palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.`

## Current Site Anchor Posture

`Version 0.5.273 - Highcrown Settlement Site District Anchor Review` and `Version 0.5.274 - Highcrown Settlement Site Anchor Evidence Clarification Plan` still control district-anchor posture.

- `settlement_site.highcrown.barge_quays` must keep `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` must keep `parentDistrictId: null`.

Current evidence proves both as Highcrown-level sites, but does not place either inside `settlement_district.highcrown.archive_districts` or `settlement_district.highcrown.market_courts`.

Semantic proximity is not enough for a district anchor. `court_presence` is not Market Courts placement and is not court/law mechanics.

## Knowledge Posture

Exactly two live `settlement_district` snippets exist:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

No live `settlement_site` snippets exist.

No snippet exists for:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

Future site activation must not add snippets. A later active-site snippet requires a separate snippet plan.

## Domain And Registry Posture

Direct `settlement_district` and `settlement_site` Knowledge subject support exists and remains active-only.

`knowledge_domain.general_lore` is active and supports current district snippets with:

- `settlement_district` in `canonicalSubjectTypes`
- `world.settlement_districts` in `relatedContentCollections`

General Lore does not need to advertise `settlement_site` or `world.settlement_sites` until a later site-snippet plan selects live site snippet content.

## District And Site Content Posture

Current district records:

- `settlement_district.highcrown.archive_districts` is active static district identity.
- `settlement_district.highcrown.market_courts` is active static district identity.

Current site records:

- `settlement_site.highcrown.barge_quays` is planned and unanchored.
- `settlement_site.highcrown.palace_terraces` is planned and unanchored.

## Latest And Next

Latest completed:

- `Version 0.5.275 - Highcrown Settlement Site Activation Readiness Review`

Immediate next:

- `Version 0.5.276 - Highcrown Settlement Site Status Activation`

## Next Guardrail

`Version 0.5.276 - Highcrown Settlement Site Status Activation` may edit only `packages/content/base/world/settlement_sites.json`.

Allowed content edits:

- change only the selected two site records' `status`, `summary`, and `notes`;
- keep both `parentDistrictId` values as `null`.

Forbidden:

- site snippets;
- district-anchor changes;
- settlement content;
- district content;
- Knowledge registry/domain/trial-policy content;
- Knowledge schemas or validators unless a focused test expectation update is required by the content status change;
- runtime, UI, storage, commands, events, rewards, migrations, save/account behavior;
- route/travel behavior;
- building/workplace/economy behavior;
- court/law behavior;
- vendor/market behavior;
- cargo/storage behavior;
- sacred-site/religious-hotspot behavior;
- gameplay behavior.
