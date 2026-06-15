# Religion Knowledge Domain Seed Content Plan

Source version/run: Version 0.5.169 - Religion Knowledge Domain Seed Content Plan
Date: 2026-06-15
Status: documentation-only seed-content planning

## 1. Purpose And Status

This plan selects the exact first future Religion Knowledge snippet seed and activation path. It uses the newly implemented `religion` and `deity` subject authority to choose a minimal content slice that can validate cleanly in a later implementation run.

This run changes documentation only. It adds no live Religion snippets, does not activate Religion, and changes no schema, validator, test, source content, world religion content, runtime, UI, storage, persistence, trial, readiness, reward, event, command, faction, reputation, favorability, elemental alignment, Prestige, Magic Study, family, or gameplay behavior.

`knowledge_domain.religion` remains `status: "planned"` until the future seed implementation.

## 2. Current Authority Recap

- `knowledge_domain.religion` exists as planned registry metadata in `packages/content/base/player/knowledge_domain_registry.json`.
- Religion `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` remain null.
- `religion` and `deity` are valid snippet and registry subject types.
- The snippet validator can resolve top-level `religion.*` records from `world.religions`.
- The snippet validator can resolve nested `deity.*` records flattened from `world.religions`.
- Snippets still require an active domain, so Religion snippets cannot validate against live content until Religion is activated.
- `packages/content/base/world/religions.json` currently includes `religion.elemental_pantheon`, eight deities, elemental dualities, opposition relationships, organizations, and religious-site types.
- Orders, doctrine, rites, holy days, shrines, sacred sites, hotspots, settlement/culture/institution/historical-event Religion snippets, and `custom` remain unsupported or blocked.
- Normal content lint baseline remains `content-lint: ok (56 files checked)`.

## 3. Seed Strategy Decision

The next implementation should activate `knowledge_domain.religion` and add exactly two Tier 1 Religion snippets in the same narrow content run:

1. `knowledge_snippet.religion.elemental_pantheon.identification`
2. `knowledge_snippet.religion.light_lady.identification`

This is the smallest useful seed because it proves both new direct authorities:

- `religion` subject authority through `religion.elemental_pantheon`;
- `deity` subject authority through `deity.light_lady`.

The seed is enough to prove the Religion domain without adding runtime implications because both snippets are identity-level authored knowledge. They do not describe worship state, favorability, faction standing, spell access, legal consequence, conversion, apostasy, family status, or gameplay effects.

Do not add order, site, doctrine, rite, holy-day, hotspot, or region-bridge snippets in the first implementation. Keep all Religion policy refs null.

## 4. Exact Future Snippet Drafts

These are draft records for the later `Version 0.5.170 - Religion Knowledge Domain Seed` implementation. Do not add them in this planning run.

### Elemental Pantheon Identification

```json
{
  "id": "knowledge_snippet.religion.elemental_pantheon.identification",
  "domainId": "knowledge_domain.religion",
  "subjectType": "religion",
  "subjectId": "religion.elemental_pantheon",
  "tier": 1,
  "category": "identification",
  "title": "Recognizing the Elemental Pantheon",
  "summary": "The Elemental Pantheon is a balanced elemental religion built around paired opposition, cyclical dominance, and geography-shaped worship.",
  "discoverySources": [
    {
      "sourceType": "book_study",
      "sourceId": null
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": true,
    "hiddenSummary": "An unidentified faith tradition remains to be understood."
  },
  "notes": [
    "This snippet is authored Religion knowledge only and grants no worship, favorability, faction standing, spell access, Magic Study readiness, reputation, law effect, conversion, apostasy, Prestige, family status, or runtime behavior."
  ]
}
```

Authority basis:

- `religion.elemental_pantheon` is the top-level religion id in `packages/content/base/world/religions.json`.
- The record name is `Elemental Pantheon`.
- The summary is drawn directly from the top-level religion summary: a balanced elemental religion built around paired opposition, cyclical dominance, and geography-shaped worship.
- The presence of eight deity records, dualities, dominance-cycle entries, organizations, and structure types supports treating this as a whole-tradition identity snippet, but the snippet summary intentionally stays at the top-level religion summary.

Do not infer worship requirements, doctrine, favorability, penalties, spell access, divine rank, priesthood rank, institutional membership, hotspot pressure, dominant regional faith, legal consequence, faction hostility, or elemental creature consequence.

### Lady Of Light Identification

```json
{
  "id": "knowledge_snippet.religion.light_lady.identification",
  "domainId": "knowledge_domain.religion",
  "subjectType": "deity",
  "subjectId": "deity.light_lady",
  "tier": 1,
  "category": "identification",
  "title": "Recognizing the Lady of Light",
  "summary": "The Lady of Light is a female light deity of the Elemental Pantheon associated with guidance, healing, and judgment, and opposed to the Lord of Darkness.",
  "discoverySources": [
    {
      "sourceType": "book_study",
      "sourceId": null
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": true,
    "hiddenSummary": "An unidentified deity remains to be understood."
  },
  "notes": [
    "This snippet is authored Religion knowledge only and grants no worship, favorability, faction standing, spell access, Magic Study readiness, reputation, law effect, conversion, apostasy, Prestige, family status, or runtime behavior."
  ]
}
```

Authority basis:

- `deity.light_lady` is a nested deity id under `religion.elemental_pantheon`.
- Its name is `Lady of Light`.
- Its `presentationGender` is `female`.
- Its `element` is `light`.
- Its `domains` are `guidance`, `healing`, and `judgment`.
- Its `opposedDeityId` is `deity.dark_lord`.
- The `dualities` array explicitly records `deity.light_lady` and `deity.dark_lord` with relationship `opposed`.
- `deity.dark_lord` is the nested deity named `Lord of Darkness`.

Do not infer worship requirements, doctrine, favorability, penalties, spell access, divine rank, priesthood rank, institutional membership, hotspot pressure, dominant regional faith, legal consequence, faction hostility, or elemental creature consequence.

## 5. Optional Third Snippet Decision

Do not include an optional third snippet in the first seed.

A deity-opposition or duality snippet is safe in principle because `opposedDeityId` and the explicit Light/Dark duality exist, but it would introduce relationship authoring before the domain has proven simple identity snippets. Defer relationship snippets to a second Religion seed after the first two records validate live.

## 6. Activation Plan

The future implementation should change `knowledge_domain.religion.status` from `planned` to `active` in the same run that adds the two approved snippets.

Do not perform a status-only activation run. Religion should become active only when the live snippet catalog contains approved Religion snippets that pass current validation.

The implementation must keep:

```json
{
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null
}
```

Do not add Knowledge Trial readiness content, trial policy content, or runtime behavior.

## 7. Validation Plan For The Future Seed

The future implementation must validate the exact draft records through:

- current snippet schema validation;
- current registry schema validation;
- semantic validation through `tools/content-lint/knowledge-snippets.mjs`;
- `world.religions` top-level authority for `religion.elemental_pantheon`;
- `world.religions` flattened nested deity authority for `deity.light_lady`;
- active-domain requirement after Religion activation;
- subject collection coherence through `world.religions`;
- supported category check for `identification`;
- supported source type check for `book_study`;
- null `sourceId` rule;
- duplicate snippet-id rejection;
- unsupported subject-type rejection for blocked subjects;
- normal content lint remaining `content-lint: ok (56 files checked)`.

No new content file is expected. The implementation should edit only existing registry/snippet content files plus required coordination docs.

## 8. Deferred Religious Hotspot Boundary

Religious hotspot snippets remain deferred.

Do not plan hotspot snippets until all of the following exist:

- dominant faith authority;
- tolerated faith authority;
- mismatch pressure or hotspot severity content;
- direct place identity;
- separate owner/runtime plans for consequences.

Hotspot planning must not imply Renown loss, reputation mutation, faction hostility, law enforcement, persecution, access denial, exile, imprisonment, assassination, conversion, apostasy, or UI behavior.

## 9. Deferred Favorability And Elemental Alignment Boundary

`Religious Favorability And Elemental Alignment Plan` is a future design candidate only. This seed-content plan does not implement or authorize it.

The future candidate may eventually cover:

- character favorability with religions, religious factions, elemental factions, guilds, regions, and kingdoms;
- positive, neutral, and negative display bands over a numeric score;
- prayer, donation, pilgrimage, charity, quests, notable-figure interactions, and elemental-creature interactions as favor sources;
- elemental alignment for religions, factions, guilds, regions, and kingdoms;
- indifferent, universal, tolerant, non-discriminatory, aligned, exclusive, fanatical, and antagonistic postures;
- diminishing returns on donations and restitution;
- time decay, rank checkpoints, and trials;
- consequences such as service denial, bounties, exile, imprisonment, and assassination attempts;
- optional future spell-effect/cost penalties and family Prestige mitigation.

Any such system requires its own design pass after the immediate Religion Knowledge seed path. It must define ownership, state, persistence, runtime authority, UI posture, and safety boundaries before implementation.

## 10. Knowledge Trial And Readiness Posture

The seed plan creates no:

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

Any Religion trial or readiness policy requires a separate plan after Religion is active and has sufficient validated snippets.

## 11. Non-Goals

- no live registry edit;
- no live snippet edit;
- no schema edit;
- no validator edit;
- no tests;
- no source/content edits;
- no world religion content changes;
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

## 12. Open Questions

- Should the first implementation seed one or two deity snippets? Current recommendation: one deity snippet only.
- Which deity best proves the domain without implying runtime magic or worship behavior? Current recommendation: `deity.light_lady`, because its identity, element, domains, opposed deity, and explicit duality are direct authored fields.
- Should deity opposition be represented in the first seed or deferred to a second seed? Current recommendation: include only the opposed-deity fact inside identity wording and defer a dedicated relationship snippet.
- Should `cultural_context` or `identification` be preferred for pantheon-level knowledge? Current recommendation: `identification` for the first seed because it proves subject identity without broader social claims.
- Should Religion receive Knowledge trials later, or remain snippet-only for longer?
- When should religious orders become direct snippet subjects?
- Should religious hotspot content come before or after favorability/alignment planning?
- Where should future favorability state live: character, faction, religion, institution, or a relationship ledger?

## 13. Future Sequence

Immediate next:

1. `Version 0.5.170 - Religion Knowledge Domain Seed`

Likely follow-up:

2. `Version 0.5.171 - Religious Hotspot Knowledge Snippet Plan`
3. `Version 0.5.172 - Religious Favorability And Elemental Alignment Plan`, if the project chooses to prioritize the new feature request after the first Religion seed

Recommendation: implement the two-snippet Religion seed first. It proves the domain, activation, and direct subject authority with minimal content risk. After that, plan religious hotspots before favorability/alignment only if the project wants place-based religious pressure; otherwise move directly to the favorability/alignment design candidate.

## 14. Temporary Guardrail Decision

Retain this plan through `Version 0.5.170 - Religion Knowledge Domain Seed`. After the seed lands, either remove this temporary guardrail in a cleanup pass or keep only the deferred hotspot and favorability/alignment boundaries in current handoff/backlog material.
