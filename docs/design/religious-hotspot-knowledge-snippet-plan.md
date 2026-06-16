# Religious Hotspot Knowledge Snippet Plan

Source version/run: Version 0.5.171 - Religious Hotspot Knowledge Snippet Plan
Date: 2026-06-16
Status: documentation-only hotspot knowledge planning

## 1. Purpose And Status

This plan decides whether Religious Hotspot Knowledge snippets are ready after the first live Religion Knowledge seed and defines the safe future path for authoring them.

This run is documentation-only. It adds no live hotspot snippets, Religion snippets, schema vocabulary, validators, tests, source content, world religion content, region/locality/settlement content, runtime loading, UI, storage, persistence, trials, readiness policy, rewards, events, commands, faction, reputation, favorability, elemental alignment, Prestige, Magic Study, family, spell, or gameplay behavior.

`knowledge_domain.religion` is already active from `Version 0.5.170 - Religion Knowledge Domain Seed`. The two existing Religion snippets remain the only live Religion Knowledge snippets unless a future implementation deliberately adds more:

- `knowledge_snippet.religion.elemental_pantheon.identification`
- `knowledge_snippet.religion.light_lady.identification`

## 2. Current Authority Recap

- `knowledge_domain.religion` is active.
- Religion `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` remain null.
- Current direct Religion subject vocabulary supports `religion` and `deity`.
- The current schema also lists contextual subjects such as `settlement`, `culture`, `institution`, and `historical_event`, but the snippet validator still blocks those subjects, plus `custom`.
- `region` is supported by the current snippet validator, but current region, locality, and settlement content does not author dominant faith, tolerated faith, mismatch pressure, hotspot severity, religious jurisdiction, or direct sacred-site identity.
- `packages/content/base/world/religions.json` has `religion.elemental_pantheon`, eight deities, six religious organizations, and religious-site structure types. It does not contain actual hotspot or place records.
- Normal content lint baseline remains `content-lint: ok (56 files checked)`.

## 3. Religious Hotspot Concept

A Religious Hotspot is authored knowledge about a place or community where religious identity, doctrine, deity alignment, sacred geography, or local institutional pressure is unusually important.

It may eventually describe facts such as:

- a place strongly associated with a religion or deity;
- a shrine community;
- a sacred site;
- an area where faith mismatch matters socially;
- a region where religious neutrality, tolerance, exclusivity, or fanaticism is notable;
- a pilgrimage destination;
- a place where a religion is culturally dominant.

It must not itself create:

- reputation mutation;
- Renown loss;
- faction hostility;
- law enforcement;
- persecution;
- access denial;
- exile;
- imprisonment;
- assassination attempts;
- conversion;
- apostasy;
- favorability state;
- elemental alignment state;
- spell penalties;
- UI behavior;
- runtime behavior.

## 4. Current Content-Authority Audit

Audited files:

- `packages/content/base/world/religions.json`
- `packages/content/base/world/regions.json`
- `packages/content/base/world/region_localities.json`
- `packages/content/base/world/settlements.json`

Current world religion content authorizes:

- one top-level religion, `religion.elemental_pantheon`;
- deity identity and relationships for eight `deity.*` records;
- six `religious_order.*` organization records with favored deity ids and typical terrain tags;
- four `religious_site.*` structure types.

Current geography content includes shrine-adjacent records:

- `region.glasswake_quay`, a subregion with shrine estates, monasteries, herb gardens, lookout posts, and the `shrine` tag;
- `region_locality.lantern_shrine_gardens`, a shrine-garden locality for religious estates, records, herbs, and traveler relief;
- `settlement.glasswake_shrine`, a sea-facing shrine community with `monastic_house`, `coastal_shrine`, and `scholastic_hospice` identity tags.

Those records do not author all of the authority needed for a live hotspot snippet:

- exact religious hotspot place identity as a hotspot record;
- exact religion, deity, or institution affiliation for the place;
- dominant faith or tolerated faith;
- hotspot strength, severity, or intensity;
- mismatch, outsider, visitor-risk, or public-posture rules;
- source collection authority usable by the current snippet validator for settlement, shrine, sacred-site, or hotspot subjects.

Finding: current content can mention shrine-related geography and religious-site structure types, but it does not provide enough explicit authority for live Religious Hotspot Knowledge snippets.

## 5. Subject Strategy

| Subject type | Decision |
| --- | --- |
| `region` | Usable by the validator, but not a substitute for missing sacred-site, settlement, or hotspot authority. Use only if the region record explicitly authors the religious hotspot fact. Current content does not. |
| `religion` | Use only for facts about the religion itself, not place-specific hotspot pressure. |
| `deity` | Use only for facts about the deity itself, not place-specific hotspot pressure. |
| `settlement` | Keep blocked until a future schema/validator/content-authority plan changes support. |
| `culture` | Keep blocked until a future schema/validator/content-authority plan changes support. |
| `institution` | Keep blocked until a future schema/validator/content-authority plan changes support. |
| `religious_order` | Defer; nested organization records exist, but subject vocabulary and snippet authority are not implemented. |
| `shrine` | Defer; current `religious_site.shrine` is a structure type, not an actual place record. |
| `sacred_site` | Defer; actual sacred-site records do not exist. |
| `religious_hotspot` | Best future direct subject candidate after place authority exists. |
| `custom` | Do not use. |

Decision: hotspot snippets remain deferred. The best future path is to plan world geography/religion content authority first, then decide whether to add a direct `religious_hotspot` subject, shrine/sacred-site authority, or a very narrow region-backed snippet only when a region explicitly authors the hotspot fact.

## 6. Hotspot Vocabulary Decision

New vocabulary is not ready before content authority exists.

- `religious_hotspot`: defer until actual hotspot/place authority exists.
- `sacred_site`: defer until actual sacred-site records exist.
- `shrine`: defer until actual shrine instance records or explicit settlement/site authority exist.
- `religious_order`: defer; order support deserves its own subject and validation plan.
- settlement/culture/institution enablement: defer; these remain blocked by the current snippet validator.

Schema and validator changes should not be recommended before the content-authority model is planned. Shrine and sacred-site support needs actual site records, not only structure-type definitions.

## 7. Potential Future Content Authority Model

A future content-authority plan could define hotspot-capable records or fields such as:

- `religionId`
- `deityIds`
- `religiousOrderIds`
- `dominantFaithIds`
- `toleratedFaithIds`
- `restrictedFaithIds`
- `hotspotIntensity`
- `hotspotType`
- `sacredSiteIds`
- `shrineIds`
- `pilgrimageStatus`
- `publicPosture`
- `mismatchPressure`
- `notes`

This is future content-authority modeling only. It is not implemented or authorized here.

## 8. Candidate Future Snippet Directions

Do not add live JSON snippets from this plan.

| Candidate | Ready now | Blockers |
| --- | --- | --- |
| Identification of a shrine community | No | Missing place affiliation, missing shrine/sacred-site/hotspot subject vocabulary, settlement subject blocked, missing validator support. |
| Regional variant for `region.glasswake_quay` | No | Current region text mentions shrine estates but lacks exact religion/deity/order affiliation, dominant/tolerated faith, and hotspot intensity. |
| Cultural context for shrine-garden travel relief | No | Could become region-backed only if authored as a regional religious fact; current locality/settlement subjects are blocked and current content is economic/social, not hotspot authority. |
| Ritual use of a sacred site | No | Missing actual sacred-site records and ritual/doctrine authority. |
| Historical context of a pilgrimage destination | No | Missing pilgrimage status, historical-event authority, and hotspot/site subject support. |
| Danger as authored knowledge | No | Missing authored visitor-risk posture; would easily imply runtime/favorability/consequence behavior, so defer until consequence boundaries are separately designed. |

Future-only draft directions may be written later after authority exists. They must be explicitly marked non-live until implemented through validated JSON.

## 9. Favorability And Elemental Alignment Boundary

Religious favorability and elemental alignment are future design candidates only. This plan does not implement or authorize them.

They may eventually cover:

- positive, neutral, and negative relationship bands over a numeric score;
- favorability with religions, religious factions, elemental factions, guilds, regions, and kingdoms;
- prayer, donation, pilgrimage, charity, quests, notable-figure interactions, and elemental-creature interactions;
- elemental alignment postures for factions, guilds, regions, and kingdoms;
- indifferent, universal, tolerant, non-discriminatory, aligned, exclusive, fanatical, and antagonistic postures;
- diminishing returns and restitution debt;
- decay, rank checkpoints, and trials;
- service denial, bounties, exile, imprisonment, and assassination attempts;
- optional future spell-effect or spell-cost penalties;
- family Prestige mitigation.

Any such system needs its own design pass before implementation.

## 10. Consequence Boundary

Religious hotspot knowledge may eventually inform consequence design, but this plan keeps consequences out of scope.

Explicitly deferred:

- faction standing;
- religious favorability;
- regional law response;
- temple access denial;
- shop or service denial;
- guards;
- bounties;
- exile;
- imprisonment;
- assassination attempts;
- spell penalties;
- conversion or apostasy mechanics;
- family Prestige mitigation.

## 11. Knowledge Trial And Readiness Posture

This plan creates no:

- `trialPolicyRef`;
- trial policy content;
- `readinessPolicyId`;
- readiness policy content;
- readiness semantic validation;
- attempts;
- outcomes;
- cooldowns;
- rewards;
- unlocks;
- runtime checks.

Any Religion trial or readiness policy requires a separate plan after Religion has a larger validated snippet base and after hotspot/favorability boundaries are settled.

## 12. Non-Goals

- no live snippet edits;
- no registry edits;
- no schema edits;
- no validator edits;
- no tests;
- no source or content edits;
- no world religion content changes;
- no region, locality, or settlement content changes;
- no helper or adapter;
- no runtime loading;
- no simulation;
- no evidence, progress, or trial behavior;
- no readiness content;
- no UI;
- no storage or persistence;
- no reward, event, command, or gameplay behavior;
- no faith, faction, reputation, law, conversion, or apostasy mechanics;
- no religious favorability or elemental alignment;
- no spell penalty or Magic Study behavior;
- no Prestige or backstory implementation;
- no family, heir, marriage, inheritance, or adoption implementation;
- no Skill Trial or Spell/Magic Study work.

## 13. Open Questions

- Should religious hotspots be authored as place records, region facts, settlement facts, sacred-site records, or a separate hotspot collection?
- Should hotspot intensity use bands, numeric scores, or named postures?
- Should dominant faith and tolerated faith be authored on regions, settlements, institutions, or a separate relationship collection?
- Should hotspot knowledge come before or after religious favorability planning?
- Should religious orders become direct subjects before hotspot content?
- Should elemental alignment be authored as content before hotspot snippets?
- Should hotspot snippets ever use `danger`, or should danger wait for runtime/consequence design?
- Should hotspots be discoverable by book study, travel observation, teacher instruction, quest events, or institutional study?
- Should sacred places be tied to specific deities or whole religions first?

## 14. Future Sequence

Recommended immediate next:

1. `Version 0.5.172 - Religious Hotspot Content Authority Plan`

Reason: current content authority is insufficient for hotspot snippets. Before vocabulary or snippets, the project needs an explicit place/religion affiliation model for shrine, sacred-site, region, settlement, or hotspot facts.

Alternate next if the project prioritizes the user-requested feature over hotspot authoring:

1. `Version 0.5.172 - Religious Favorability And Elemental Alignment Plan`

Do not recommend `Version 0.5.172 - Religious Hotspot Schema And Validator Vocabulary Plan` or `Version 0.5.172 - Religious Hotspot Knowledge Snippet Seed Plan` until content authority exists.

## 15. Temporary Guardrail Decision

Retain this plan through the next hotspot content-authority or favorability/alignment planning pass. After that pass, move any durable subject-authority, consequence-boundary, or favorability-boundary rules into current handoff/backlog material and decide whether this temporary guardrail doc should be removed in a cleanup pass.
