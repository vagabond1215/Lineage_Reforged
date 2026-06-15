# Religion Knowledge Domain Plan

Source version/run: Version 0.5.165 - Religion Knowledge Domain Plan
Date: 2026-06-15
Status: documentation-only Knowledge domain planning

## 1. Purpose And Status

This plan defines Religion as a future broad Knowledge domain and establishes its boundary, candidate registry metadata, current vocabulary posture, religious-hotspot direction, first seed constraints, validation expectations, and implementation sequence.

This run changes documentation only. It adds no Religion registry record, snippet, schema, validator, test, helper, adapter, content authority, runtime loading, evidence, progress, trial state, readiness content, storage, persistence, UI, event, reward, command, ownership mutation, simulation, faction, reputation, law, conversion, apostasy, Prestige, family, or gameplay behavior.

No Religion Knowledge content is live. Religion remains `v0.5.x` authored-content planning, not `v0.6.x` runtime authority.

## 2. Current Authority Recap

- The broad Knowledge registry currently contains Flora, Fauna, Minerals, Ecology, Arcane Lore, and General Lore.
- Ecology is live as authored metadata/content only and has three Tier 1 snippets.
- Flora alone references `knowledge_trial_policy.flora_tier_1`. Ecology, Fauna, Minerals, General Lore, and future Religion keep all policy references null unless a later focused plan changes them.
- The strict Knowledge Trial Readiness Policy schema exists, but readiness content, readiness semantic validation, trial attempts, outcomes, rewards, and runtime trial behavior remain absent.
- The snippet catalog contains Tier 1 records for Flora, Fauna, Minerals, Ecology, and General Lore.
- Religion is not a Knowledge registry record, snippet domain, skill domain, trial policy, readiness policy, runtime loader, or persisted state.
- `packages/content/base/world/religions.json` currently contains one `religion.elemental_pantheon` record with eight deities, six religious organizations, and four religious-site types.
- Normal content lint remains `content-lint: ok (56 files checked)`.

## 3. Religion Domain Rationale

Religion should own authored understanding of divine figures, doctrines, rites, sacred places, institutions, taboos, religious law concepts, and faith traditions. It should not be reduced to General Lore, Arcane Lore, Ecology, settlement facts, or family affiliation.

Religion may cover:

- gods, spirits, saints, ancestors, elemental powers, and local divine figures;
- doctrines, taboos, purity rules, heresy, apostasy concepts, and social expectations;
- rites, sacraments, vows, funerary customs, holy days, festivals, and pilgrimage;
- priesthoods, temples, shrines, monasteries, orders, cults, and related offices;
- sacred places, convergence sites, relic traditions, and religious hotspots;
- race, culture, family, region, settlement, and institutional variation;
- religious interpretations of nature, seasons, disaster, medicine, magic, war, trade, marriage, death, inheritance, oaths, and rulership.

These are authored facts and relationships only. They do not create faith points, worship actions, conversion, apostasy, faction rank, religious reputation, law enforcement, access checks, perks, buffs, punishments, or other runtime behavior.

## 4. Domain Boundary Decision

Select one broad initial domain:

- `knowledge_domain.religion`

Do not immediately split Religion into theology, doctrine, ritual practice, sacred places, religious law, local cults, orders, or heresy.

The broad domain is the conservative first path because:

- current religion content combines pantheon structure, deities, orders, terrain relationships, and religious-site types in one authority;
- the current registry already supports `religion_myth` as a domain group;
- current snippet vocabulary cannot yet express the most useful narrower religious subjects;
- immediate subdivision would create boundaries before authored snippets establish distinct ownership pressure;
- later splits can follow actual snippet volume, hotspot requirements, prerequisite graphs, and trial needs.

Possible later domains such as `knowledge_domain.doctrine`, `knowledge_domain.myth`, `knowledge_domain.saints_and_relics`, and `knowledge_domain.cults` remain separate roadmap candidates. This plan does not authorize them.

## 5. Boundary With Existing Domains And Systems

### General Lore

General Lore owns broad cultural, civic, historical, and regional facts when no specific domain owns the fact.

Religion should own divine, doctrinal, ritual, sacred-place, and faith-institution knowledge once a clear religious subject exists. General Lore must not remain the fallback merely because direct Religion subject authority is missing.

### Arcane Lore

Arcane Lore remains planned and blocked.

Religion may describe attitudes toward magic, sacred interpretations of magical practice, or religious organizations that use magical support. It must not grant spells, Divine or Druidic Magic skill, Magic Study readiness, catalyst access, magical institution authority, or runtime effects.

### Ecology

Ecology owns natural-system relationships.

Religion may describe sacred animals, ritual plants, seasonal observances, divine interpretations of storms, or sacred landscapes. It must not duplicate ecological habitat, behavior, climate, or resource facts.

### Settlements, Cultures, And Institutions

Settlement and culture lore should own non-religious civic and cultural facts. Religion should own faith-specific expectations, rites, organizations, sacred places, and religious pressure.

The current snippet validator blocks settlement, culture, institution, and historical-event subjects. A future snippet plan must verify or add exact subject authority before authoring those records.

### Family And Heir Systems

Family, heir, marriage, adoption, legitimacy, burial, inheritance, and lineage systems remain future roadmap material.

Religion may later describe customs that those systems consume, but this plan creates no family affiliation, marriage gate, inheritance rule, burial outcome, legitimacy effect, or generational behavior.

## 6. Candidate Registry Record

The following documentation-only draft passed the current registry schema and semantic validator in memory:

```json
{
  "id": "knowledge_domain.religion",
  "slug": "religion",
  "name": "Religion",
  "summary": "Gods, spirits, doctrines, rites, sacred places, religious institutions, holy days, taboos, and regional or cultural faith traditions.",
  "group": "religion_myth",
  "wave": 1,
  "status": "planned",
  "canonicalSubjectTypes": [
    "region",
    "settlement",
    "culture",
    "institution",
    "historical_event"
  ],
  "supportedSnippetCategories": [
    "identification",
    "behavior",
    "danger",
    "regional_variant",
    "ritual_use",
    "historical_context",
    "cultural_context"
  ],
  "supportedDiscoverySourceFamilies": [
    "field_observation",
    "textual_study",
    "instruction",
    "event_record"
  ],
  "supportedDiscoverySourceTypes": [
    "field_identification",
    "travel_observation",
    "book_study",
    "teacher_instruction",
    "institutional_study",
    "quest_event",
    "chronicle_record"
  ],
  "defaultEvidenceOwnerScopes": [
    "character",
    "institution",
    "region",
    "settlement",
    "quest_event",
    "chronicle_record",
    "document_instance",
    "teacher",
    "study_event",
    "travel_event"
  ],
  "relatedSkillIds": [
    "skill.knowledge.general_lore",
    "skill.knowledge.cultural_lore",
    "skill.knowledge.civic_lore"
  ],
  "relatedMagicSchoolIds": [],
  "relatedContentCollections": [
    "world.region_localities",
    "world.regions",
    "world.religions",
    "world.settlements"
  ],
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null,
  "schemaGapNotes": [
    "The current snippet subject vocabulary has no religion, deity, doctrine, rite, holy-day, religious-order, shrine, temple, sacred-site, or religious-hotspot subject type.",
    "The current snippet validator blocks settlement, culture, institution, historical_event, and custom subjects, leaving region as the only candidate Religion subject under current semantic authority.",
    "Current region and settlement content can identify shrine communities, but it does not yet author dominant-faith, doctrine, mismatch-pressure, hotspot, or Elemental Pantheon affiliation authority."
  ],
  "notes": [
    "Religion is authored knowledge only and does not create faith points, worship, conversion, apostasy, faction rank, reputation, law enforcement, access penalties, perks, buffs, punishment, or runtime behavior.",
    "Folk Lore, Civic Lore, and Common Lore are related references only; skill rank does not grant religious knowledge.",
    "Magic-school references remain empty so religious knowledge cannot imply Divine or Druidic Magic training, Magic Study readiness, or spell access.",
    "The record should remain planned until a later vocabulary and validator pass approves useful Religion snippet subjects and hotspot authority."
  ]
}
```

### Candidate Posture

- `group: "religion_myth"` is already allowed by the current registry schema.
- `wave: 1` matches the current broad-domain expansion phase.
- `status: "planned"` is required for the first registry-only seed because useful Religion snippets are not yet valid under current subject authority.
- `skill.knowledge.general_lore`, `skill.knowledge.cultural_lore`, and `skill.knowledge.civic_lore` all exist and have direct descriptive relevance.
- No dedicated Religion skill is invented.
- Divine and Druidic Magic remain absent from `relatedMagicSchoolIds` to prevent religious knowledge from implying magical training or access.
- All four related content collections exist as file-derived base-content authorities.
- All policy references remain null.

## 7. Vocabulary Reuse And Gaps

### Current Vocabulary To Reuse

The future registry record can safely reuse:

- group: `religion_myth`;
- subjects: `region`, `settlement`, `culture`, `institution`, and `historical_event` as registry metadata;
- categories: `identification`, `behavior`, `danger`, `regional_variant`, `ritual_use`, `historical_context`, and `cultural_context`;
- source families: `field_observation`, `textual_study`, `instruction`, and `event_record`;
- source types: `field_identification`, `travel_observation`, `book_study`, `teacher_instruction`, `institutional_study`, `quest_event`, and `chronicle_record`;
- current collections: `world.religions`, `world.regions`, `world.region_localities`, and `world.settlements`.

These values fit the registry. They do not mean that all corresponding snippet subjects are currently valid.

### Current Gaps

The snippet schema has no direct subject type for:

- religion or faith tradition;
- deity, saint, spirit, or ancestor;
- doctrine, taboo, purity rule, heresy, or apostasy concept;
- rite, sacrament, vow, holy day, festival, or pilgrimage;
- religious order, priesthood, cult, or monastic institution;
- shrine, temple, sacred site, convergence site, or religious hotspot;
- family religious tradition.

The semantic validator also blocks:

- settlement;
- culture;
- institution;
- historical event;
- custom.

Only `region` is currently usable from the candidate subject list. Do not force missing religious subjects or categories into `custom`.

## 8. Current Religion Content Findings

The current world authority contains:

- `religion.elemental_pantheon`;
- eight elemental deities;
- paired opposition and cyclical dominance relationships;
- six religious organizations;
- four religious-site types.

Current geography also contains religiously suggestive places:

- `region.glasswake_quay`, described through shrine estates and monasteries;
- `region_locality.lantern_shrine_gardens`;
- `settlement.glasswake_shrine`, a monastic shrine community.

These records do not currently establish:

- which religion, deity, doctrine, or order owns the site;
- dominant or minority faith;
- local faith expectations;
- mismatch pressure or hotspot severity;
- heretic, apostate, outsider, or reformer posture;
- temple access rules;
- local religious law or enforcement.

Therefore, they are insufficient authority for a meaningful Religion snippet seed without a later content/subject design decision.

## 9. Religious Hotspot Direction

A religious hotspot is authored knowledge about a place where local faith expectations, institutions, or risks are unusually important.

At Knowledge-content level, a hotspot may describe:

- dominant and tolerated traditions;
- visible rites, taboos, holy days, and sacred spaces;
- expected conduct and common outsider mistakes;
- local clergy, orders, shrines, or pilgrimage routes;
- social opportunities and risks associated with religious identity.

A hotspot record or snippet must not itself create:

- automatic Renown loss;
- faction or religious-reputation mutation;
- persecution, arrest, or crime behavior;
- access denial;
- marriage or family restrictions;
- conversion or apostasy;
- outsider, heretic, or apostate state;
- UI.

Local access friction, scrutiny, mismatch penalties, labels, religious opportunities, and family or institutional conflict remain deferred until separate owner and runtime plans define scope, evidence, mutation, persistence, and failure behavior.

## 10. Prestige And Backstory Boundary

Prestige may later support:

- alternate-religion backstories;
- a separate religious family path;
- abandoning a family for religion;
- joining a temple, order, cult, monastery, or related institution;
- preserving limited religious Renown;
- reducing family/religion mismatch penalties;
- conversion or apostasy backstories.

High religious standing may cross generations only through an explicit Prestige, backstory, family-recognition, or institutional owner.

This plan implements none of those concepts. It creates no Prestige unlock, backstory route, family affiliation, Renown transfer, institution membership, generation mechanic, or mismatch behavior.

## 11. First Seed-Content Direction

Do not author Religion snippets immediately after this plan.

Candidate future snippets include:

1. Elemental Pantheon summary using a future `religion` subject.
2. One deity or duality fact using a future `deity` subject.
3. One religious order or ritual-practice fact using a future institution/order subject.
4. One holy-day or rite fact using future ritual vocabulary.
5. One Glasswake religious-landscape or hotspot fact after explicit pantheon, order, dominant-faith, and pressure authority exists.

A region-backed `cultural_context` bridge is structurally possible only for existing regional facts. It must not substitute for direct Religion subject authority or invent hotspot pressure.

## 12. Validation Expectations

Recommended implementation sequence:

1. Add the exact planned Religion registry record with `status: "planned"`.
2. Run current registry structural and semantic validation.
3. Create a focused Religion Knowledge Vocabulary And Validator Plan.
4. Decide exact direct subject types and authorities for religion, deity, religious order/institution, rite, sacred site, and hotspot content.
5. Add schema and validator vocabulary only in separately approved implementation slices.
6. Create a Religion Knowledge Domain Seed Content Plan using verified authority.
7. Activate the Religion registry record only when an approved snippet seed can validate.
8. Add Religion snippets.
9. Plan religious-hotspot snippets after base Religion subjects and hotspot content authority exist.

The candidate registry record fits the current registry schema and validator. Its implementation should avoid schema or validator changes.

Current useful snippets do not fit the current semantic authority. Do not bypass validation with `custom` or an ungrounded region bridge.

Editing the existing registry or snippet files does not add a checked content file, so normal content-lint count should remain 56 unless a later run creates and registers a genuinely new file.

## 13. Knowledge Trial And Readiness Posture

Religion planning creates none of the following:

- `trialPolicyRef`;
- trial policy content;
- `readinessPolicyId`;
- readiness policy content;
- readiness semantic validation;
- attempts, checkpoints, outcomes, cooldowns, rewards, or unlocks;
- runtime eligibility or readiness checks.

The future Religion registry record must begin with:

```json
{
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null
}
```

Any Religion trial or readiness policy requires a separate plan after the registry is active and sufficient validated snippet content exists.

## 14. Open Questions

- Should Religion remain broad long-term or split after seed content?
- Which first Religion subject should be seeded?
- Which direct authorities should own religion, deity, doctrine, rite, religious order, shrine, sacred-site, and hotspot subjects?
- Should settlement, culture, institution, and historical-event subjects become generally valid or receive narrower authority rules?
- Should a region/cultural-context bridge ever be used, or should authoring wait for direct Religion subjects?
- Which existing skills should remain related after direct Religion content exists?
- Should a dedicated Religion or Theology skill be created later?
- Which current collections are direct authorities rather than contextual references?
- How should dominant faith, tolerated faith, mismatch pressure, and hotspot severity be authored before runtime behavior?
- Should religious mismatch remain lore first, Prestige/backstory only, or later become scoped runtime friction?
- When should Religion receive Knowledge trials, if ever?
- How should Religion interact with Arcane Lore without granting Magic Study readiness or spell access?
- Which deity, order, shrine, region, or settlement should be the first narrow seed?

## 15. Non-Goals

This plan authorizes none of the following:

- no registry edit;
- no snippet edit;
- no schema or validator edit;
- no tests, fixtures, helpers, or adapters;
- no runtime loading or simulation;
- no evidence, progress, completion, trial, or readiness behavior;
- no readiness content;
- no UI or generated output;
- no storage, persistence, save, account, session, or database behavior;
- no reward, event, command, ownership mutation, or gameplay behavior;
- no faith, worship, faction, reputation, Renown, law, crime, temple access, priesthood, rank, perk, buff, punishment, conversion, or apostasy mechanics;
- no Prestige or backstory implementation;
- no family, heir, marriage, inheritance, adoption, legitimacy, burial, or generation implementation;
- no Skill Trial or Spell/Magic Study work;
- no unrelated cleanup.

## 16. Temporary Guardrail Decision

Retain this plan through the registry seed and subsequent vocabulary/validator planning. After those runs consume it, decide whether remaining guidance should stay here, move to the current handoff, become durable design-ledger material, or be removed in a cleanup pass.

## 17. Future Sequence

Recommended near-term sequence:

1. `Version 0.5.166 - Religion Knowledge Domain Registry Seed`
2. `Version 0.5.167 - Religion Knowledge Vocabulary And Validator Plan`
3. `Version 0.5.168 - Religion Knowledge Domain Seed Content Plan`
4. `Version 0.5.169 - Religious Hotspot Knowledge Snippet Plan`
5. `Version 0.5.170 - Family Visibility And Heir Slot Projection Plan`
6. `Version 0.5.171 - Race-Specific Adult Age And Maturation Plan`
7. `Version 0.5.172 - Offspring Growth Role And Activity Build Plan`
8. `Version 0.5.173 - Recipe Ownership And Personal Learning Plan`
9. `Version 0.5.174 - 0.6.0 Runtime Ownership Transition Reassessment`

The immediate next run is registry-only because the exact planned record passes current validation while useful Religion snippets require separate subject, content, and validator authority.

## 18. Acceptance Criteria For Version 0.5.166

The registry seed is complete only when it:

- adds the exact candidate record unchanged;
- keeps `status: "planned"`;
- keeps every policy reference null;
- passes current registry semantic validation and normal content lint;
- adds no Religion snippets;
- changes no schema, validator, test, helper, adapter, runtime, UI, storage, persistence, simulation, event, reward, command, ownership, or gameplay behavior;
- records that Religion remains planned metadata rather than an active snippet domain.
