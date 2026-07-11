# Faction Authority Seed Evidence Deferral

Source version/run: Version 0.5.326 - Faction Authority Seed Evidence Deferral
Date: 2026-07-11
Status: approved documentation-only deferral and reopening gate

## 1. Deferral Summary

Defer faction seed planning and live faction content because the repository contains no durable canonical faction candidate that satisfies the accepted boundary and complete static record gate.

Carry forward zero `faction.*` ids. Preserve the completed strict schema, pure validator, focused tests, and schema parse coverage. Keep the live wrapper and normal content-lint registration absent.

Do not repeat broad faction evidence scans until a new durable authored input exists. Select `Version 0.5.327 - Roadmap Post-Faction Deferral Selection` next so another eligible docs-first lane can be chosen without weakening this gate.

## 2. Current Completed-State Posture

- Latest completed primary: `Version 0.5.326 - Faction Authority Seed Evidence Deferral`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Immediate next primary route: `Version 0.5.327 - Roadmap Post-Faction Deferral Selection`.
- `packages/schemas/civilization/faction.schema.json`, `tools/content-lint/factions.mjs`, `tests/unit/faction-validation.test.mjs`, and schema parse coverage are complete and unchanged.
- `packages/content/base/civilization/factions.json` remains absent.
- No content `faction.*` record exists and no candidate id is carried forward.
- `tools/content-lint/index.mjs` remains without faction registration.
- Existing owners remain protected; People/NPC, service, resource/commodity, and combat health remain paused; generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed.

## 3. Contract Readiness Versus Seed Readiness

The faction contract is technically ready for future static records:

- strict records-only wrapper;
- exact required identity, lifecycle, classification, visibility, provenance, and note fields;
- id/slug coherence and uniqueness;
- no first-pass cross-authority references;
- pure in-memory semantic validation;
- focused rejection of unknown, behavioral, mutable-state, runtime, UI, save/account, and gameplay fields.

That readiness does not create fictional canon. A schema describes how a valid record must look; it does not prove that any repository entity should become a record. Seed readiness requires a durable authored identity source, which is absent.

## 4. Candidate Carry-Forward Decision

Carry forward zero candidate ids.

Specifically, do not carry forward or normalize:

- `faction.river_compact`, which is an explicitly non-canonical test fixture;
- `factions.harbor_office`, which is demo presentation data with a non-contract id and office semantics;
- any id derived from “harbor gang,” “faction retaliation,” pirate states/tribes/havens, raiders, bandits, backstory `factionId`, guilds, religious orders, polities, settlements, businesses, families/houses, movement/ideology labels, shadow networks, runtime groups, or standing/reputation.

No faction seed plan, draft record, empty live wrapper, or content implementation is approved.

## 5. Reopening Gate

Faction seed planning may reopen only after one of these inputs exists:

1. an explicit user-authored canonical faction seed list; or
2. a new durable repository lore/content source that clearly owns named faction identity.

For each proposed candidate, the reopening input must supply or explicitly authorize without invention:

- exact canonical name;
- authority for a matching `faction.<lower_snake_slug>` id and slug;
- proof of a durable named non-sovereign organized collective under the accepted faction boundary;
- proof that no existing or deferred specific owner is a better fit;
- non-invented summary;
- supported category, or justified `other` only after faction identity is proven;
- supported public posture, or explicit use of `unknown` when canon is silent;
- lifecycle posture, normally `planned`;
- non-empty durable provenance notes;
- explicit non-implication notes excluding members, leaders, affiliations, relationships, standing, services, law, territory, runtime, UI, save/account, and gameplay.

When a valid new input appears, first run a narrow readiness review against `docs/design/faction-authority-schema-plan.md` and `docs/design/faction-authority-seed-evidence-audit.md`. Do not skip directly to content.

## 6. Prohibited Weak Sources And Inference Boundaries

The following remain insufficient and must not be combined to manufacture a candidate:

- quest giver anchors, quest prose, failure text, gang/bruiser labels, bandits, raiders, pirates, or other unnamed narrative groups;
- generic backstory `factionId` or `faction` eligibility scopes;
- UI categories, standing panels, demo snapshots, placeholder ids, warnings, or “needs canonical refs” labels;
- schemas, validators, focused fixtures, examples, forbidden-field lists, or planning taxonomies;
- guild identities or settlement guild presence;
- religions or religion-owned religious orders;
- polities, governments, jurisdictions, laws, offices, forces, businesses, companies, services, families, clans, houses, dynasties, lineages, places, parties, professions, movements, or ideology-only concepts;
- settlement/region prose, pirate havens, anchorages, enclaves, or demographic aggregates;
- generated shadow networks, institution profiles, generated businesses, owner/operator categories, organization-id lists, runtime actor groups, standing, reputation, or favorability state.

Repeated broad scans of these same sources are prohibited unless new authored material or a materially changed repository source is identified first.

## 7. Registration Posture

Normal faction content-lint registration remains unauthorized while the live wrapper is absent.

After an explicitly approved seed is implemented, registration still requires a separate decision and narrow exact-once wiring run. That later run must prove one validator import, one content path/check, one helper invocation, and one normal-lint execution path without changing accepted seed content.

Schema parse coverage and focused validation do not count as normal content registration.

## 8. Deep Research Posture

Deep Research is not required. The blocker is missing project-authored canon, not missing external taxonomy, political theory, criminal-network research, or faction-system comparison.

External research cannot create canonical Lineage: Reforged faction names or authorize seed facts. No research artifact should be created until a concrete external question and named downstream consumer exist.

## 9. Support-Suffix / Explicit-Question Posture

No support-suffix run is needed. The deferral is complete and routes to a new primary roadmap selection.

No explicit user question is needed before `0.5.327`; the project can select another eligible lane. A user-authored list or new durable source becomes necessary only when faction seed planning is intentionally reopened.

## 10. Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Seed plan now | Rejected | Zero candidates pass the complete authored-evidence gate. |
| Live implementation | Rejected | No seed is approved and no live wrapper should exist. |
| Normal registration | Rejected | Registration cannot precede live content and a separate decision. |
| Repeat evidence audit | Rejected | The completed audit covered the repository; no new authored input exists. |
| Request user-authored faction list now | Not required for routing | Such a list is an accepted future reopening input, but the project can progress in another lane without blocking on it. |
| Deferral and route elsewhere | Selected | Preserves the valid contract and exact gate while avoiding invented canon and repeated scans. |

## 11. Selected Option And Rationale

Select deferral and route elsewhere.

The faction lane has useful validation scaffolding but no data authority. Recording a durable authored-input gate prevents tests, demos, hooks, prose, existing owners, or runtime projections from leaking into canon. A general roadmap selection can now compare remaining lanes without reopening any paused, rejected, or closed area by default.

## 12. Explicit Non-Goals

- no faction/organization content, candidates, ids, drafts, aliases, migrations, or compatibility behavior;
- no schema, validator, test, schema parse, or normal content-lint changes;
- no edits to live guild, polity, religion/order, place, quest, Knowledge, service, resource/commodity, combat health, People/NPC, economy, account, reputation, runtime, UI, save/account, or gameplay surfaces;
- no references, resolvers, memberships, affiliations, leaders, ranks, offices, relationships, standing, reputation, favorability, providers, services, laws, jurisdictions, diplomacy, conflict, territory, AI, dialogue, schedules, or effects;
- no repeated weak-source scan, inferred canon, generic `world.pois`, Highcrown Knowledge reopening, paused-lane expansion, Deep Research, temporary artifact, or `0.6.0` transition.

## 13. Deferral Question Answers

1. Yes. The faction schema, pure validator, focused tests, and schema parse coverage are complete.
2. No. Live faction content is not present.
3. No. Normal faction registration is not present.
4. No. Zero candidate ids are carried forward.
5. The lane is deferred because no durable authored source supplies a canonical faction and every required static record fact without invention.
6. Reopen only for an explicit user-authored canonical faction list or a new durable repository lore/content source meeting the full gate.
7. All quest/prose/hooks/UI/demo/test/example/existing-owner/pirate-raider/derived/runtime/standing sources listed in this deferral remain prohibited for inference.
8. No. Broad evidence scanning must not repeat without new authored input or a materially changed named source.
9. No. A faction seed plan is not approved.
10. No. Content implementation is not approved.
11. No. Normal registration is not approved.
12. No. Deep Research is not required.
13. No. A support-suffix run is not needed.
14. No. An explicit user question is not needed before routing elsewhere.
15. Select `Version 0.5.327 - Roadmap Post-Faction Deferral Selection`.

## 14. Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required handoff, active prompt, roadmap, sequence, backlog, faction audit/plan/boundary, People/NPC deferral, validation consolidation, pipeline, schema, validator, focused-test, schema-test, and normal-lint reads.
- Narrow reconfirmation of absent live faction content, absent content `faction.*` ids, absent normal registration, and unchanged validation scaffolding.
- Required tests, normal content lint, scope, conflict-marker, whitespace, artifact, stale-route, diff, and final-status checks are recorded in `docs/dev/current-codex-output.md`.

## 15. Next Recommended Version

Version 0.5.327 - Roadmap Post-Faction Deferral Selection
