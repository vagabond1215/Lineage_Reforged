# Settlement District/Site Status Activation Plan

Source version/run: Version 0.5.263 - Settlement District/Site Status Activation Plan
Date: 2026-06-30
Status: approved documentation-only activation decision; no content implementation

## 1. Decision Summary

Select exactly one current planned settlement place authority record for future active-status implementation:

- `settlement_district.highcrown.archive_districts`

Defer the other three current records:

- `settlement_district.highcrown.market_courts`
- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This is a docs-only decision. It does not activate records, edit settlement/district/site content, add Knowledge snippets, edit Knowledge schemas or validators, change tests, change runtime behavior, alter UI/storage/commands/events/rewards/migrations/save-account behavior, or add route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay behavior.

The selected activation batch is intentionally tiny because `archive_districts` has direct authored evidence and can remain static civic place identity without implying market, route, service, access, palace, ownership, or gameplay systems.

## 2. Current Authority Posture

`world.settlements` remains the canonical settlement identity and broad place authority.

Current live settlement district authority exists at `packages/content/base/world/settlement_districts.json` with exactly two planned Highcrown records:

- `settlement_district.highcrown.archive_districts`
- `settlement_district.highcrown.market_courts`

Current live settlement site authority exists at `packages/content/base/world/settlement_sites.json` with exactly two planned Highcrown records:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

Both site records currently use `parentDistrictId: null`.

Normal content lint registers both `world.settlement_districts` and `world.settlement_sites`. These records are static authored place identity only. They do not own coordinates, geometry, route topology, services, vendors, stock, prices, access control, NPC staffing, ownership, discovery state, UI state, storage state, commands, events, rewards, or gameplay effects.

## 3. Current Knowledge Posture

Direct Knowledge subject support now exists for:

- `settlement_district`
- `settlement_site`

The Knowledge snippet schema and mirrored Knowledge domain registry schema include both values. The Knowledge snippet validator resolves district and site subject ids against live authority records and enforces active-only eligibility.

Current planned district/site records remain ineligible for live public Knowledge snippets. Activating a record in a later implementation run would make that authority record eligible for a later Knowledge snippet seed plan, but activation alone would not create snippets, discovery, progress, rewards, runtime state, or UI behavior.

No live `settlement_district` or `settlement_site` Knowledge snippets currently exist.

## 4. Activation Threshold

A current district/site record may be selected for future activation only if:

- the parent settlement exists and is current;
- the record has explicit authored evidence in existing settlement content, district/site planning docs, or live district/site content;
- the record is stable static place authority, not a runtime, service, building, route, map, or UI proxy;
- activation does not require coordinates, geometry, route topology, service execution, vendor stock, prices, ownership, access-control behavior, NPC staffing, discovery state, UI state, storage state, commands, events, rewards, or gameplay effects;
- the record is specific enough to support future public Knowledge snippets;
- activation will not imply unfinished buildings, services, routes, markets, archive access, palace functions, laws, ownership, or gameplay systems exist;
- activation is safe under the active-only Knowledge subject policy implemented in `Version 0.5.262`.

Records may remain planned even when they are valid static content if active status would likely imply unfinished adjacent systems to players or future authors.

## 5. Candidate Audit Method

This pass audited:

- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`
- `docs/design/settlement-district-site-knowledge-subject-plan.md`
- `docs/design/first-settlement-district-content-seed-plan.md`
- `docs/design/first-settlement-site-content-seed-plan.md`
- `docs/design/settlement-district-site-authority-boundary-decision.md`
- `packages/content/base/world/settlements.json`
- `packages/content/base/world/settlement_districts.json`
- `packages/content/base/world/settlement_sites.json`
- current Knowledge snippet content and schema/validator surfaces
- current district/site validators and normal lint registration

For each candidate, the audit checked:

- id;
- current status;
- parent settlement id;
- parent district id when applicable;
- evidence source;
- evidence strength;
- whether the record is stable static identity;
- what activation would mean;
- what activation must not imply;
- Knowledge snippet readiness after activation;
- decision and reason.

## 6. Candidate-By-Candidate Decision

### `settlement_district.highcrown.archive_districts`

- Current status: `planned`.
- Parent settlement id: `settlement.highcrown`.
- Parent district id: not applicable.
- Evidence source: Highcrown summary explicitly references "archive districts"; `docs/design/first-settlement-district-content-seed-plan.md` selected it as a district candidate.
- Evidence strength: strong. The phrase names districts directly and ties them to current Highcrown settlement identity.
- Stable static identity: yes. The record can describe a civic/administrative area without creating archive buildings, access, storage, services, NPC staff, quest hooks, Knowledge unlocks, or gameplay behavior.
- What activation would mean: the archive districts are accepted as current static authored district identity under Highcrown.
- What activation must not imply: no archive access, record browsing, knowledge unlocks, storage inventories, bureaucracy service, NPC staff, law/court behavior, quest hooks, UI marker, discovery state, or gameplay effect.
- Knowledge snippet readiness after activation: eligible for a later snippet planning pass as a direct `settlement_district` subject; no snippet should be added by activation itself.
- Decision: activate candidate later.
- Reason: direct stable district evidence, low reliance on unfinished adjacent systems, and a clean static-only interpretation make this the safest first activation.

### `settlement_district.highcrown.market_courts`

- Current status: `planned`.
- Parent settlement id: `settlement.highcrown`.
- Parent district id: not applicable.
- Evidence source: Highcrown `siteContext` references "the empire's largest market courts"; `docs/design/first-settlement-district-content-seed-plan.md` selected it as a market district candidate.
- Evidence strength: strong for existence, but semantically coupled to unfinished economy/service expectations.
- Stable static identity: partially. The district identity is stable, but active status may imply public-facing market operation.
- What activation would mean: the market courts are accepted as current static authored market district identity.
- What activation must not imply: no prices, vendors, stock, taxes, market UI, trade execution, economy simulation, service access, ownership, court/law mechanics, or route logistics.
- Knowledge snippet readiness after activation: would become eligible for a later direct `settlement_district` snippet, but such a snippet would need careful wording to avoid market/service/economy promises.
- Decision: defer candidate.
- Reason: although evidence is direct, active public status risks implying unresolved market, vendor, tax, trade, and service systems. Keep planned until a later economy/service boundary or snippet plan can control those implications.

### `settlement_site.highcrown.barge_quays`

- Current status: `planned`.
- Parent settlement id: `settlement.highcrown`.
- Parent district id: `null`.
- Evidence source: Highcrown summary explicitly references "barge quays"; `docs/design/first-settlement-site-content-seed-plan.md` selected it as a site candidate.
- Evidence strength: strong for existence as a river wharf/local anchor.
- Stable static identity: partially. The placed-site identity is stable, but active status may imply route, cargo, dock service, travel, storage, or access behavior.
- What activation would mean: the Barge Quays are accepted as current static authored placed-site identity under Highcrown with no district anchor.
- What activation must not imply: no route topology, travel node, cargo inventory, ship service, storage, vendor, access rule, ownership, pathfinding, UI marker, or gameplay behavior.
- Knowledge snippet readiness after activation: would become eligible for a later direct `settlement_site` snippet, but a snippet would need strict route/service exclusions.
- Decision: defer candidate.
- Reason: the site is explicit and valuable, but active status risks implying unfinished route/travel, cargo, service, storage, and access systems. Keep planned until route/service implications are better bounded.

### `settlement_site.highcrown.palace_terraces`

- Current status: `planned`.
- Parent settlement id: `settlement.highcrown`.
- Parent district id: `null`.
- Evidence source: Highcrown `siteContext` explicitly references "palace terraces"; `docs/design/first-settlement-site-content-seed-plan.md` selected it as a palace landmark candidate.
- Evidence strength: strong for existence as a palace landmark.
- Stable static identity: partially. The landmark identity is stable, but active status may imply court access, NPC staffing, law/control, ownership, quests, services, or UI access.
- What activation would mean: the Palace Terraces are accepted as current static authored placed-site identity under Highcrown with no district anchor.
- What activation must not imply: no court services, palace access rules, NPC staffing, ownership, law/control system, quest hooks, UI marker, discovery state, or gameplay behavior.
- Knowledge snippet readiness after activation: would become eligible for a later direct `settlement_site` snippet, but snippet planning would need strict court/access exclusions.
- Decision: defer candidate.
- Reason: the evidence is direct, but palace/court semantics are high-risk for unfinished access, law, NPC, ownership, and quest expectations. Keep planned until a later civic/service/access boundary can contain those implications.

## 7. Selected Activation Candidates

Select this single-record future activation batch:

- `settlement_district.highcrown.archive_districts`

The selected batch should activate only the status field in a later implementation run unless a tiny text clarification is required to preserve static-only meaning.

District activation should precede site activation. Activating a low-risk district first provides one direct Knowledge-eligible place subject without prematurely making market, route, dock, palace, access, or service-adjacent site records public-active.

## 8. Deferred Candidates

Defer:

- `settlement_district.highcrown.market_courts`
- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

Deferred does not mean rejected. All three remain valid planned static authority records. Their activation should wait until a later pass can explicitly constrain market/economy, route/travel/dock-service, and palace/civic-access implications, or until a focused Knowledge snippet seed plan proves safe static wording after the first district activation lands.

## 9. Future Implementation Plan

If this plan is implemented next, the next run may:

- edit only `packages/content/base/world/settlement_districts.json`;
- change only `settlement_district.highcrown.archive_districts` from `status: "planned"` to `status: "active"`;
- keep its id, slug, name, summary, parent id, district type, tags, notes, and sourceAuthorityNotes unchanged unless a tiny wording clarification is required to reinforce static-only activation;
- leave `settlement_district.highcrown.market_courts` planned;
- leave both site records planned with `parentDistrictId: null`;
- add no Knowledge snippets;
- change no Knowledge schema, validator, registry/domain, trial-policy, runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay files;
- run district validation tests;
- run site validation tests to prove unchanged site posture;
- run Knowledge snippet validation tests to prove the active district can be accepted in fixtures and that no live district/site snippets were added;
- run schema-files test;
- run normal content lint;
- update workflow docs.

If a future implementation audit finds that `archive_districts` activation is unsafe, it should defer and select a narrower evidence/authority follow-up instead of broadening the batch.

## 10. Knowledge Snippet Readiness Impact

Direct Knowledge subject support now exists for district/site subjects. Active-only validation means all current planned records remain ineligible for live snippets.

Activating `settlement_district.highcrown.archive_districts` later would make that single authority record eligible for later direct `settlement_district` Knowledge snippet planning. It would not create a snippet by itself.

A later Knowledge snippet seed plan must separately decide whether any snippet should be authored, which domain should advertise the subject, what collection references are needed, what wording is safe, and which discovery source families apply.

Activation alone does not create discovery, progress, runtime state, access, services, rewards, or UI behavior.

## 11. Explicit Non-Goals

- no record activation in this run;
- no settlement, district, or site content edits;
- no Knowledge snippets;
- no Knowledge schema or validator edits;
- no Knowledge registry/domain/trial-policy content edits;
- no tests changed;
- no runtime discovery, progress, access, services, rewards, commands, events, UI, storage, migration, save/account, or gameplay behavior;
- no route/travel, map, building, workplace, economy, sacred-site, religious-hotspot, quest, NPC, family, civic, magic, item, or crafting content changes;
- no coordinates, geometry, pathfinding, map marker, route node, vendor stock, price, tax, law, control, ownership, NPC schedule, quest trigger, UI state, storage state, command, event, reward, migration, or gameplay behavior;
- no transition to `0.6.0`.

## 12. Validation And Audit Posture

This planning run should verify:

- district content exists and remains unchanged;
- site content exists and remains unchanged;
- Knowledge snippets remain unchanged;
- Knowledge schema, validator, and test files remain unchanged;
- normal lint registration for settlement districts and settlement sites remains present;
- changed paths are docs-only;
- no runtime/UI/storage/command/event/reward/migration/gameplay paths changed;
- `git diff --check` passes;
- conflict-marker and trailing-whitespace scans pass on changed files.

Tests are optional for this docs-only run. If run, prefer focused validation only:

- `node --test tests\unit\knowledge-snippets-validation.test.mjs`
- `node --test tests\unit\settlement-district-validation.test.mjs`
- `node --test tests\unit\settlement-site-validation.test.mjs`
- `node --test tests\unit\schema-files.test.mjs`
- `npm.cmd run tool:content-lint`

## 13. Next Recommended Version

`Version 0.5.264 - Settlement District/Site Status Activation`

That run should activate only `settlement_district.highcrown.archive_districts`, preserve all deferred candidates, add no snippets, and keep changes limited to the selected district status plus workflow docs unless a fresh local audit finds a blocker.
