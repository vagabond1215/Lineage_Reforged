# First Polity Content Seed Plan

Source version/run: Version 0.5.248 - First Polity Content Seed Plan
Date: 2026-06-28
Status: approved documentation-only seed plan; no live polity content

## 1. Decision Summary

`Version 0.5.248` is documentation-only. It approves a future first content seed pass for `world.polities`, but it does not create live polity content now.

The first future seed should be tiny, planned-only by default, and limited to stable political identity records whose current canon explicitly supports a named polity-like identity and validator-supported place anchors. It must not infer polities from settlement administrative roles, region names alone, map conflict zones, generic kingdom/republic prose, guild autonomy, religious labels, noble/royal flavor, generated operator ids, or runtime projections.

The recommended first implementation should create at most one or two `planned` records if a fresh audit reconfirms the candidate evidence below. If that audit finds the evidence too ambiguous, the correct implementation result is to defer live polity content rather than invent a political identity.

This pass does not approve live `packages/content/base/world/polities.json`, normal content-lint registration, government, jurisdiction, law, claim, border, control, diplomacy, conflict, faction, institution, force, tax, legal/player-state, runtime, UI, storage, command, event, reward, migration, or gameplay implementation.

## 2. Current Schema And Validator Reality

Current landed contract:

- `world.polities` is the future static authored political identity collection.
- Future content path remains `packages/content/base/world/polities.json`.
- Schema exists at `packages/schemas/world/polity.schema.json`.
- Pure validator helper exists at `tools/content-lint/polities.mjs`.
- Focused tests exist at `tests/unit/polity-validation.test.mjs`.
- Schema-file parse registration exists in `tests/unit/schema-files.test.mjs`.
- No live `packages/content/base/world/polities.json` exists.
- No normal content-lint registration exists in `tools/content-lint/index.mjs`.
- Polities remain future-contract validation only.

Current polity records require a strict `records` wrapper with `polity.<slug>` ids, matching lower-snake-case `slug`, `name`, `aliases`, `summary`, `polityForm`, non-empty `placeAnchors`, `status`, `sourceAuthorityNotes`, and `notes`.

Current `polityForm` values are `kingdom`, `realm`, `city_state`, `republic`, `confederation`, `tribal_confederacy`, `empire`, `principality`, `temporal_religious_state`, `trade_league`, and `autonomous_settlement`. Current `status` values are `planned`, `active`, and `retired`.

Current place anchors support `region`, `region_locality`, and `settlement` place types with `identity_anchor`, `seat_reference`, or `associated_place` roles. The validator resolves anchors against current active `world.regions`, `world.region_localities`, and `world.settlements`; enforces unique ids/slugs and duplicate-free anchors; requires `autonomous_settlement` records to include a settlement anchor; and rejects government, law, claim, border, control, diplomacy, conflict, tax, player-state, runtime, UI, storage, command, event, reward, and gameplay fields.

## 3. Current Content Audit Summary

This pass inspected the current polity schema, validator helper, focused tests, schema registration, normal content-lint index posture, civic and polity decision docs, regions, region localities, settlements, world maps, guilds, religion-adjacent content, quest contact/giver metadata, and backlog state.

Current audit findings:

- `packages/content/base/world/polities.json` is absent.
- `tools/content-lint/index.mjs` does not import `polities.mjs` or register `world.polities` content.
- Current region records include political prose such as Valtherion's border kingdoms, human kingdoms, elven forest realms, merchant republics, pirate states, and undersea kingdoms, but most of those phrases are generic group descriptions rather than exact polity identities.
- Current settlement records include administrative roles, royal/capital/throne/imperial wording, and civic/economic functions. Those fields are not polity authority by themselves, but they can support a planned polity candidate only when paired with explicit named political identity wording.
- Current world-map conflict zones remain display summaries and must not seed conflict, claim, border, or polity records.
- Current guild autonomy and crown-charter wording remains guild/corporate context, not polity identity.
- Current quest giver/contact `type: "government"` metadata is quest presentation context, not government or polity authority.
- The retired temporary artifact `docs/dev/tmp-civic-authority-systems-research-2026-06-20.md` is absent, matching its retirement in `0.5.225`.

The strongest current evidence supports at most a very small planned seed around named large-scale political identities already named in current place content. Weaker generic or role-only evidence should remain deferred.

## 4. First Seed Scope

The first actual polity content seed should include only:

- static political identity records in `world.polities`;
- `status: "planned"` records unless a later prompt explicitly approves active status;
- `polityForm` values already accepted by the schema;
- place anchors to existing active regions, region localities, and settlements only;
- short summaries that identify the polity without asserting borders, claims, government, ruler, law, diplomacy, or current control;
- `sourceAuthorityNotes` that cite exact current content evidence and explain why the record remains descriptive and non-executing;
- `notes` that explicitly reject government, jurisdiction, law, claims, borders, diplomacy, tax, runtime, UI, storage, command, event, reward, and gameplay behavior.

The first seed should not include:

- governments;
- settlement governments;
- jurisdictions;
- law codes or local laws;
- courts, guards, garrisons, or military forces;
- factions or institutions;
- claims, borders, control, occupations, vassalage, wars, conflicts, or diplomacy;
- citizenship, subjecthood, legal status, wanted/bounty/case state, rights, access, permits, titles, or rank;
- tax, toll, tariff, customs, treasury, economy mutation, route control, or market rights;
- Knowledge subjects, quest mutation, Chronicle mutation, runtime state, UI state, storage, commands, events, rewards, or gameplay effects.

## 5. Candidate Evidence Policy

Allowed evidence:

- current authored content that explicitly names a political identity or strongly pairs a named place identity with crown/imperial/throne political wording;
- current authored settlement or region anchors that resolve under `validatePolities`;
- existing design docs that approve only the narrow polity identity contract, not broader civic behavior;
- exact source notes that can distinguish the polity identity from physical geography and settlement administration.

Insufficient evidence by itself:

- region names alone;
- settlement `administrativeRole`;
- settlement `identityTags` such as `regional_capital`, `continental_capital`, or `imperial_city` without matching prose;
- generic references to kingdoms, republics, realms, tribes, pirate states, or undersea kingdoms;
- world-map `conflictZones`;
- guild autonomy, guild charters, guild houses, or corporate presence;
- religion, deity, order, sacred-site, or hotspot labels;
- quest giver/contact metadata;
- generated settlement operator ids or runtime institution projections;
- noble/royal/crown words used only as place flavor;
- backstories, titles, family/Prestige text, player/account state, Knowledge vocabulary, or prose that does not identify a durable polity.

If a future implementation cannot cite explicit evidence for the polity name, form, and place anchors, it must skip the candidate.

## 6. Recommended First Candidate Batch

The future `0.5.249` seed may use this candidate list only after a fresh audit reconfirms each source line and validates every anchor.

| Candidate id | Candidate name | Form | Status | Planned anchors | Why it is plausible |
| --- | --- | --- | --- | --- | --- |
| `polity.valtherion` | `Valtherion` | `empire` | `planned` | `region.valtherion` as `identity_anchor`; `settlement.highcrown` as `seat_reference` | `region.valtherion` is the primary civilization center with political-center notes. `settlement.highcrown` is named as Valtherion's imperial river capital, has imperial/crown wording, and is anchored to Valtherion/Sapphire Rivers. |
| `polity.draemor` | `Draemor` | `realm` | `planned` | `region.draemor` as `identity_anchor`; `settlement.riverthrone` as `seat_reference` | `settlement.riverthrone` is described as the political and commercial throne city of Draemor. This supports a planned polity identity more directly than generic kingdom or republic prose, while still avoiding government/control claims. |

Do not add both candidates if the future implementation cannot keep each record brief and fully cited. A one-record seed is acceptable and preferred over weak coverage.

Do not include `polity.kaelvar` in the first seed unless a future audit finds stronger exact political-identity wording than current broad references to southern powers, crown markets, and royal capital context. Do not seed coastal merchant republics, northern river kingdoms, old forest realms, pirate states, undersea kingdoms, The Crownlands, or The Lantern Crown from current generic or place-only prose.

## 7. Draft Record Shape For Future Implementation

These sketches are non-live planning examples. The future content seed must re-audit and may edit wording before authoring JSON.

```json
{
  "id": "polity.valtherion",
  "slug": "valtherion",
  "name": "Valtherion",
  "aliases": [],
  "summary": "A planned static polity identity for the imperial political context associated with Valtherion and its Highcrown seat reference.",
  "polityForm": "empire",
  "placeAnchors": [
    {
      "placeType": "region",
      "placeId": "region.valtherion",
      "anchorRole": "identity_anchor"
    },
    {
      "placeType": "settlement",
      "placeId": "settlement.highcrown",
      "anchorRole": "seat_reference"
    }
  ],
  "status": "planned",
  "sourceAuthorityNotes": [
    "Current region authority names Valtherion and describes it as the primary world civilization center and political center of the map.",
    "Current settlement authority names Highcrown as Valtherion's imperial river capital and describes palace terraces, crown roads, and the empire's largest market courts."
  ],
  "notes": [
    "Static identity only; this record does not define government, ruler, law, claim, border, control, diplomacy, tax, runtime, UI, storage, command, event, reward, or gameplay behavior."
  ]
}
```

```json
{
  "id": "polity.draemor",
  "slug": "draemor",
  "name": "Draemor",
  "aliases": [],
  "summary": "A planned static polity identity for the throne-city political context associated with Draemor and Riverthrone.",
  "polityForm": "realm",
  "placeAnchors": [
    {
      "placeType": "region",
      "placeId": "region.draemor",
      "anchorRole": "identity_anchor"
    },
    {
      "placeType": "settlement",
      "placeId": "settlement.riverthrone",
      "anchorRole": "seat_reference"
    }
  ],
  "status": "planned",
  "sourceAuthorityNotes": [
    "Current region authority names Draemor.",
    "Current settlement authority names Riverthrone as the political and commercial throne city of Draemor."
  ],
  "notes": [
    "Static identity only; this record does not define government, ruler, law, claim, border, control, diplomacy, tax, runtime, UI, storage, command, event, reward, or gameplay behavior."
  ]
}
```

## 8. Future Polity Authoring Rules

Every future polity record must:

- be complete under `packages/schemas/world/polity.schema.json`;
- use `polity.<slug>` id and matching `slug`;
- use `status: "planned"` unless a future seed explicitly decides `active`;
- use `aliases: []` unless explicit aliases exist;
- use at least one resolving place anchor;
- avoid duplicate exact place anchors;
- choose the least specific accurate `polityForm`;
- keep summaries short and non-mechanical;
- use `sourceAuthorityNotes` to cite why the identity is canonical enough for planned content;
- use `notes` to state what the record does not imply.

Do not include government, jurisdiction, law, faction, institution, force, ruler, office, family/noble-house, religion, claim, border, territory, control, vassalage, diplomacy, conflict, tax, toll, tariff, customs, treasury, citizenship, legal status, player standing, runtime state, UI state, storage state, commands, events, rewards, mutation instructions, generated simulation, or gameplay effects.

## 9. Future Content Seed Implementation Plan

The next implementation candidate is `Version 0.5.249 - First Polity Content Seed`, conditional on this seed plan being accepted and live content being explicitly authorized.

That future pass may create `packages/content/base/world/polities.json` only if a fresh audit reconfirms at least one approved candidate. It may register polity content in normal content lint only if the implementation prompt explicitly approves registration. It must keep the batch very small, planned-only by default, and auditable.

Recommended implementation sequence:

1. Re-run the polity schema, validator, tests, normal-lint index, region, locality, settlement, world-map, guild, religion, quest, and runtime/projection audits.
2. Select one or two planned records from the approved candidate list.
3. Draft `polities.json` with `status: "planned"`.
4. Run focused polity validation tests.
5. Register normal content lint only if explicitly approved.
6. Run normal content lint after registration, if registration happens.
7. Audit changed paths to prove no government, law, claim, border, conflict, diplomacy, settlement, region, guild, religion, quest, Knowledge, runtime, UI, storage, command, event, reward, or gameplay files changed.

If the future audit does not support either candidate, do not create `polities.json`; document the deferral and move to the next appropriate planning lane.

## 10. Validation Checklist For Future Content Seed

The future seed implementation must run or document:

- focused polity validation tests;
- schema-file test;
- normal content lint after registration, if registration is approved;
- content audit proving every polity id/slug is unique and coherent;
- place-anchor audit proving every region, region-locality, and settlement anchor resolves against current active authority;
- autonomous-settlement audit if that form is ever used;
- forbidden-field audit for every record;
- non-inference audit proving no record was inferred from settlement administrative roles, generic political prose, world-map conflict zones, guild/religion labels, quest metadata, generated operators, player/account state, or Knowledge vocabulary alone;
- scope audit proving no government, law, claim, border, conflict, diplomacy, settlement, region, guild, religion, quest, Knowledge, runtime, UI, storage, command, event, reward, or gameplay changes;
- behavior audit proving polities are static descriptive content only.

## 11. Deferred Topics

The following remain explicitly deferred:

- live polity content until a later implementation prompt;
- active polity status unless explicitly approved;
- governments;
- settlement governments;
- jurisdictions;
- law codes and local laws;
- courts, guards, garrisons, military forces, public-order forces, and enforcement bodies;
- factions and institutions;
- claims, borders, territories, control, occupations, vassalage, diplomatic relations, wars, rebellions, disputes, and conflicts;
- citizenship, subjecthood, legal status, rank, rights, permits, access, wanted/bounty/case state, and player standing;
- tax, toll, tariff, customs, treasury, market rights, route control, and economy mutation;
- noble houses, dynasties, title authority, succession, marriage alliances, and estate/property ties;
- Knowledge polity subjects;
- quest, event, and Chronicle political mutation;
- runtime diplomacy, war, law enforcement, taxation, access, reputation, UI, storage, commands, events, rewards, and gameplay.

## 12. Temporary Artifact Handling

`docs/dev/tmp-civic-authority-systems-research-2026-06-20.md` is absent. This matches the `0.5.225` decision, which deleted it after promotion into permanent civic authority and polity schema decision docs.

No temporary polity seed artifact was found in this pass. No temporary artifact is deleted or created by this plan.

## 13. Non-Goals

This plan does not authorize:

- live polity content;
- `packages/content/base/world/polities.json`;
- normal polity content-lint registration;
- schema, validator, or focused-test changes;
- region, locality, settlement, world-map, guild, religion, quest, Knowledge, item, economy, family, people/NPC, magic, or travel content changes;
- government, jurisdiction, law, claim, border, control, diplomacy, conflict, faction, institution, force, tax, legal-status, player-state, runtime, UI, storage, command, event, reward, migration, or gameplay changes;
- compatibility aliases or transition to `0.6.0`.

## 14. Next Recommended Version

`Version 0.5.249 - First Polity Content Seed`

That future pass is conditional and should proceed only if live polity content is explicitly authorized and a fresh audit reconfirms at least one approved planned candidate.
