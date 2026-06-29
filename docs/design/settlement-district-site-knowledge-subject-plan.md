# Settlement District/Site Knowledge Subject Plan

Source version/run: Version 0.5.261 - Settlement District/Site Knowledge Subject Plan
Date: 2026-06-29
Status: approved documentation-only subject decision; no implementation permission

## 1. Decision Summary

Approve future direct Knowledge snippet subject vocabulary for both:

- `settlement_district`
- `settlement_site`

Selected option: Option D, add both `settlement_district` and `settlement_site`.

This run does not update Knowledge schemas, Knowledge registry content, Knowledge snippets, Knowledge trial policies, settlement/district/site content, validators, tests, runtime behavior, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior.

Future subject support may be implemented before snippets are seeded. Live snippets should remain blocked while all current district and site records remain `status: "planned"`, unless a later prompt explicitly approves planned-status preview snippets.

## 2. Current Authority Posture

`world.settlements` remains canonical for settlement identity and broad place authority.

Current live district authority exists at `packages/content/base/world/settlement_districts.json` with exactly two planned Highcrown records:

- `settlement_district.highcrown.archive_districts`
- `settlement_district.highcrown.market_courts`

Current live site authority exists at `packages/content/base/world/settlement_sites.json` with exactly two planned Highcrown records:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

Both current site records use `parentDistrictId: null`.

Normal content lint registers both `world.settlement_districts` and `world.settlement_sites` through their existing pure validators. These authorities are static authored identity records only. They do not own discovery state, access, services, rewards, route topology, local geometry, UI state, storage state, commands, events, or gameplay effects.

## 3. Current Knowledge Subject Posture

The current Knowledge snippet schema and registry schema support direct subject values including `flora`, `fauna`, `mineral`, `region`, `settlement`, `religion`, `deity`, `religious_hotspot`, and `sacred_site`, plus several blocked or future values.

The current Knowledge snippet validator blocks `settlement`, `custom`, and other unsupported early subject types from live snippets. It resolves current live subjects through explicit subject authorities, and it enforces active-only references for `religious_hotspot` and `sacred_site`.

No direct `settlement_district` or `settlement_site` subject vocabulary exists today. No Knowledge snippet should infer either authority from settlement prose, site context, routes, maps, buildings, workplaces, sacred sites, hotspots, or runtime state.

## 4. Candidate Subject Options

Option A: No direct district/site Knowledge subjects; use only parent settlement snippets.

Rejected. Parent settlement snippets are useful for broad place facts, but they lose precision once validated district and site authorities exist.

Option B: Add `settlement_district` only.

Rejected. District-level snippets would help large settlement areas, but this would leave discrete placed-site facts without an equally typed authority path.

Option C: Add `settlement_site` only.

Rejected. Site-level snippets would help landmarks and facilities, but district facts would still be forced into less precise settlement subjects.

Option D: Add both `settlement_district` and `settlement_site`.

Approved. Both authority collections now exist, have stable id patterns, and are registered in normal content lint. Adding both preserves typed authority, avoids generic fallback subjects, and supports future precise snippets once records become active.

Option E: Use generic `place` or `landmark` subject values.

Rejected. Generic subjects would weaken typed authority resolution and blur ownership between settlement, district, site, sacred-site, route, map, building, workplace, and runtime systems.

## 5. Evidence Threshold

Direct district/site Knowledge subject support is justified only when all of these are true:

- the authority collection exists as live content;
- the id namespace is stable and schema-validated;
- normal content lint validates the collection;
- a future Knowledge validator can resolve subject ids to authority records;
- the subject adds precision beyond parent settlement snippets;
- snippets do not require runtime discovery, progress, access, service, UI, or gameplay state;
- snippets do not blur authority ownership with route, map, building, workplace, economy, sacred-site, religious-hotspot, quest, or UI systems.

The current repository satisfies the authority, namespace, schema, and normal-lint portions for both district and site records. It does not yet satisfy snippet seeding readiness because the current records are all `planned`.

## 6. Decision

Future Knowledge snippets should eventually be allowed to directly reference `settlement_district.<settlement_slug>.<district_slug>` records through `subjectType: "settlement_district"`.

Future Knowledge snippets should eventually be allowed to directly reference `settlement_site.<settlement_slug>.<site_slug>` records through `subjectType: "settlement_site"`.

Both subjects should use active-only public snippet eligibility by default. Planned records may support schema/validator fixtures and future planning, but live snippets should reference only active district/site authority records.

District and site snippets must require the referenced authority record to exist in live content and pass the chosen status policy. Site snippets must accept `parentDistrictId: null` when the site itself exists and passes status policy. If a future site record has a non-null `parentDistrictId`, Knowledge validation should require that district id to resolve against live district authority, share the same settlement slug, and pass district status policy.

Knowledge snippets must not infer districts or sites from settlements, prose, routes, maps, buildings, workplaces, sacred sites, hotspots, or runtime state.

This pass must not add actual snippets.

## 7. Future Schema/Validator Requirements

A future implementation run may:

- add `settlement_district` and `settlement_site` to `packages/schemas/player/knowledge_snippet.schema.json`;
- add the same values to `packages/schemas/player/knowledge-domain-registry.schema.json` if that remains the registry subject vocabulary owner;
- update `tools/content-lint/knowledge-snippets.mjs` with explicit subject authority adapters;
- resolve `settlement_district` ids against `packages/content/base/world/settlement_districts.json`;
- resolve `settlement_site` ids against `packages/content/base/world/settlement_sites.json`;
- require `subjectType: "settlement_district"` ids to match `settlement_district.<settlement_slug>.<district_slug>`;
- require `subjectType: "settlement_site"` ids to match `settlement_site.<settlement_slug>.<site_slug>`;
- enforce active-only status for live snippet references unless a later plan explicitly changes policy;
- fail lint for missing or status-ineligible authority ids;
- accept `parentDistrictId: null` site records when the site itself is eligible;
- validate non-null site district anchors against current district authority when relevant;
- add focused tests for subject vocabulary, authority resolution, status rejection, malformed ids, unresolved ids, and null district anchors.

That implementation run should not add snippets unless a later prompt explicitly scopes snippet seeding.

## 8. Future Registry/Snippet Posture

This plan does not update `knowledge_domain_registry.json`, `knowledge_domains.json`, `knowledge_snippets.json`, or `knowledge_trial_policies.json`.

Future subject vocabulary implementation should not add snippets. Registry alignment should happen only if existing Knowledge architecture requires live registry records to advertise subject types before focused validation can prove support. Otherwise, registry alignment should wait for a later seed plan and should remain paired with active snippet readiness.

A later seed plan should decide whether any district/site snippet is appropriate once at least one target authority record is active.

Do not create Knowledge snippets for planned district/site records unless a later prompt explicitly approves planned-status preview snippets.

## 9. Activation Policy

Selected policy: active-only.

Public Knowledge snippets can reference only `status: "active"` district/site records. Current planned records are suitable for authority validation and future implementation tests, but not for live public snippet content.

Planned-or-active is rejected for default public Knowledge because it would publish facts about not-yet-active authored places before their activation readiness is decided.

All-status is rejected because retired records should not remain generally eligible for new public snippets without a separate historical-knowledge policy.

## 10. Rejected Alternatives

- adding actual snippets now;
- adding direct subjects without resolver validation;
- allowing Knowledge to infer site or district ids from settlement prose;
- using district/site snippets to activate runtime discovery state;
- using parent settlement snippets as a permanent substitute once precise site/district authority is active;
- using generic `place` or `landmark` subjects when typed authority exists;
- treating `parentDistrictId: null` as invalid for otherwise eligible site records;
- treating a parent settlement snippet as proof that a district or site exists.

## 11. Implementation Guardrails For Future Run

If the next route is subject vocabulary implementation, it should:

- update only Knowledge subject schema, Knowledge snippet validator, focused tests, and workflow docs;
- not edit live settlement, district, or site content;
- not add Knowledge snippets;
- not edit Knowledge registry, domain, or trial-policy content unless the existing subject-vocabulary architecture strictly requires it;
- preserve district/site content and normal lint registration;
- run focused Knowledge validation tests;
- run the schema-files test or record the known unrelated `sacred_site` assertion failure if it still exists;
- run normal content lint;
- run scope audits proving no Knowledge content, settlement/district/site content, runtime, UI, storage, command, event, reward, migration, or gameplay files changed;
- handle the known `sacred_site` schema-files assertion deliberately if it still exists, without unrelated Knowledge changes unless scoped.

## 12. Explicit Non-Goals

- no Knowledge schema edits in this run;
- no Knowledge validator edits;
- no Knowledge registry/domain/trial-policy edits;
- no Knowledge snippets;
- no settlement, district, or site content edits;
- no settlement, district, or site schema edits;
- no content-lint registration changes;
- no tests;
- no runtime discovery, access, services, rewards, commands, events, UI, storage, migration, save/account, or gameplay behavior;
- no route, map, building, workplace, economy, sacred-site, religious-hotspot, quest, NPC, family, civic, magic, item, or crafting content changes;
- no transition to `0.6.0`.

## 13. Next Recommended Version

`Version 0.5.262 - Settlement District/Site Knowledge Subject Schema And Validator`

That run should implement only direct subject vocabulary and resolver-backed active-only validation for `settlement_district` and `settlement_site`, plus focused tests and workflow docs. It should not add snippets or edit settlement, district, site, Knowledge registry, Knowledge domain, trial-policy, runtime, UI, storage, command, event, reward, migration, save/account, or gameplay files unless a newer prompt explicitly changes scope.
