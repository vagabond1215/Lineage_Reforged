# Household vs Family Schema Decision

Version: `Version 0.5.226 - Household vs Family Schema Decision`

Status: approved documentation-only schema posture

## 1. Decision Summary

Approve two separate future static authored collections:

- `civilization.households` for durable co-residential/domestic-unit identity;
- `civilization.families` for durable socially recognized kin-group identity.

Keep both first-pass records identity-only and descriptive. Do not embed person membership arrays. Defer membership facts to separate future `civilization.household_memberships` and `civilization.family_memberships` link authorities. Keep direct parent/child, spouse/partner, guardian/ward, adoption, and foster facts in future `civilization.kinship_links`.

Use collision-proof static ids because live mutable account families already use arbitrary `family.*` values and settlement projections synthesize `household.*` ids. Authored records use `civilization_household.<slug>` and `civilization_family.<slug>`. No equality or alias bridge to account or synthetic ids is approved.

Household membership does not imply kinship or family membership. Family membership does not imply residence, direct kinship, marriage, property, title, inheritance, or account-family identity.

No schema, validator, content, test, loader, lint registration, membership, kinship, lineage, estate, inheritance, marriage, offspring, Family Prestige, account-family, Bloodlines, runtime, UI, storage, migration, reward, command, event, property transfer, bequest, or gameplay change is authorized by this decision.

## 2. Live Repo Reality

- No authored person content has landed yet, though `Version 0.5.223` approved future `civilization.people` with `person.<slug>` ids and optional NPC overlays.
- No authored household, family, household-membership, family-membership, kinship, genealogical-lineage, clan, noble-house, dynasty, bloodline, estate, inheritance, marriage, or offspring collection/schema exists.
- `AccountFamilyRecord` owns mutable `familyId`, family name, root character, member character ids, active/dormant/closed status, timestamps, and notes.
- `AccountFamiliesState` owns mutable Family Prestige transactions and family-scoped unlocks; helpers derive balances and the Bloodlines UI presents them read-only.
- Account-family ids are unconstrained live strings and tests use `family.*`; Bloodlines tests also demonstrate that other values can appear. They are not safe static-content ids.
- `AccountRunHistoryRecord` owns player `characterId`, ancestry-oriented `lineageId`, optional account `familyId`/`parentCharacterId`, source-run continuity, and limited inheritance uses.
- `AccountEstateState` owns archived-run deposits/assets and claim previews. It is mutable account storage, not authored estate/property content.
- Player `lineageId` identifies playable ancestry/species and must not become a genealogical lineage or family id.
- Bloodlines is a projection over explicit account family, Prestige, unlock, and run-history state. It does not establish world-canon families or kinship.
- Settlement institution/property projections synthesize `npc_household`, `npc_individual`, and `household.<settlement>.<district>` owner/operator ids with property/legal labels. They are runtime projections, not authored households.

The temporary research lacked live repository access and proposed generic ids that would collide with current runtime values. This decision corrects that risk.

## 3. Existing Account Family, Estate, Bloodlines, Player Lineage, Settlement Household, Person/NPC, and Runtime Surface Inventory

Current owners remain separate:

- account family state owns mutable player-family identity, members, lifecycle, timestamps, Prestige transactions, and unlocks;
- account run history owns player-character continuity, source runs, optional parent hints, and inheritance-use counters;
- account estate state owns archived-run deposits, assets, quantities/claims, locations, and preview eligibility;
- Bloodlines owns read-only presentation of those explicit account records;
- player lineage content/state owns ancestry/species, physiology, creator selection, and related progression requirements;
- settlement simulation owns derived property operators, synthetic households, ownership/legal labels, and civic/military projections;
- future `civilization.people` owns canon named-person identity, while player/account characters remain separate;
- future authored households/families own only static civilization identities and descriptive associations.

No current owner is renamed, migrated, normalized, copied, or linked by id equality in this pass.

## 4. Household Collection Posture

Future `civilization.households` owns stable authored identity for notable domestic/co-residential units.

A household may contain relatives, partners, wards, servants, lodgers, apprentices, retainers, or unrelated co-residents. It describes a domestic unit, not a family tree, marriage, business, estate, property owner, storage container, workforce, or runtime residence state.

The initial record identifies the household, its broad household form, and descriptive place anchors. It does not enumerate members. Important historical, itinerant, communal, or currently inactive households may remain authored identities when explicit canon supports them.

Generic settlement population households, minor residents, worker rosters, and generated domestic units remain generated-once/save or runtime data, not authored content.

## 5. Family Collection Posture

Future `civilization.families` owns stable authored identity for a socially recognized kin group.

A family may span multiple households and places. A household may contain people from multiple families. Family identity may preserve a public name, aliases, broad place associations, recognition posture, and descriptive continuity/history without proving any direct relationship.

The authored family collection is not `AccountFamiliesState`. It does not own player-family membership, source-run links, root characters, timestamps, Prestige, unlocks, estate assets, or Bloodlines presentation.

Do not infer an authored family from a surname, account family name/id, player ancestry `lineageId`, source run, `parentCharacterId`, UI label, title, estate, settlement prose, or family-like organization.

## 6. Candidate Paths, Wrappers, Ids, Slugs, and Record Lifecycle

Approve these future household paths and identity rules:

- content: `packages/content/base/civilization/households.json`;
- schema: `packages/schemas/civilization/household.schema.json`;
- logical collection: `civilization.households`;
- wrapper: strict object with exactly `records` in the first pass;
- record id: `civilization_household.<slug>`;
- slug: lower snake case matching the id suffix.

Approve these future family paths and identity rules:

- content: `packages/content/base/civilization/families.json`;
- schema: `packages/schemas/civilization/family.schema.json`;
- logical collection: `civilization.families`;
- wrapper: strict object with exactly `records` in the first pass;
- record id: `civilization_family.<slug>`;
- slug: lower snake case matching the id suffix.

Both collections use authored-record lifecycle `status`: `planned`, `active`, or `retired`.

These prefixes intentionally avoid live mutable `family.*` and synthetic `household.*` namespaces. Do not add compatibility aliases or infer correspondence. Lifecycle status must not reuse account `active`/`dormant`/`closed` semantics or encode current residence, membership, extinction, inheritance, or runtime availability.

## 7. Minimum Household Record Contract

Approve this future minimum household record posture:

- `id`: required `civilization_household.<slug>` id;
- `slug`: required matching lower-snake-case slug;
- `name`: required canonical authored household label;
- `summary`: required concise domestic-unit description;
- `householdForm`: required controlled descriptive form;
- `placeAnchors`: required non-empty typed array;
- `status`: required `planned`, `active`, or `retired` lifecycle;
- `sourceAuthorityNotes`: required non-empty provenance/authority notes;
- `notes`: required descriptive notes array, empty when none.

First-pass `householdForm` values are `single_person`, `shared_domestic`, `extended_domestic`, `communal`, and `itinerant`.

Each place anchor contains `placeType`, `placeId`, and `anchorRole`. First-pass place types are `region`, `region_locality`, and `settlement`; roles are `domestic_base` and `associated_place`. An anchor describes authored association only. It does not establish property ownership, tenancy, access, storage, taxes, services, current position, or runtime residence.

Do not add member arrays, head-of-household ids, dependents, roles, finances, assets, property, inventory, services, employment, schedule, or runtime fields.

## 8. Minimum Family Record Contract

Approve this future minimum family record posture:

- `id`: required `civilization_family.<slug>` id;
- `slug`: required matching lower-snake-case slug;
- `name`: required canonical public family name;
- `aliases`: required array, empty when none;
- `summary`: required concise identity/continuity description;
- `recognitionPosture`: required `recognized`, `disputed`, `rumored`, or `unknown`;
- `placeAssociations`: required typed array, empty when none;
- `status`: required `planned`, `active`, or `retired` lifecycle;
- `sourceAuthorityNotes`: required non-empty provenance/authority notes;
- `notes`: required descriptive notes array, empty when none.

Each place association contains `placeType`, `placeId`, and `associationRole`. First-pass place types are `region`, `region_locality`, and `settlement`; roles are `origin_association`, `public_center`, and `historical_association`.

Recognition posture describes the public claim that the kin group exists. It does not resolve individual membership, parentage, legitimacy, title, law, property, inheritance, reputation, or player/account state.

Do not add member arrays, founder/ancestor ids, household ids, lineage, clan/noble-house/dynasty fields, titles, estates, succession, reputation scores, Prestige, or runtime fields.

## 9. Household Membership Representation

Do not embed membership in first-pass household records.

Defer canonical membership facts to future `civilization.household_memberships`. A future membership record should reference one `person.<slug>` and one `civilization_household.<slug>`, then own household role, visibility, recognition/dispute posture, provenance, and supported effective/era timing.

Separate links avoid rewriting household identities when membership changes, permit one person to have historical memberships, and prevent competing arrays on people and households. They also keep the initial `0.5.238` implementation limited to household/family identity schemas and validators.

Do not add `primaryHouseholdId` to person records. A derived primary-household view may be built later from validated membership facts, but it is not canonical authority.

Family membership should likewise remain outside family records in a future `civilization.family_memberships` link authority. It records socially recognized membership only and must not duplicate direct kinship facts.

## 10. Person References, Household Membership, Family Membership, and Kinship Boundary

Use future `civilization.people` and `person.<slug>` for authored person references. The stale `civilization.persons` wording in the older family boundary is superseded by `Version 0.5.223 - Person vs NPC Schema Decision`.

First-pass household and family identity records contain no person references. Future household/family membership and kinship links may reference active authored people after people content exists. Player/account `characterId` values do not resolve as `personId` and require a separate explicit bridge if ever needed.

Person records must not carry household/family arrays. Household membership means co-residence/domestic participation only. Family membership means socially recognized inclusion only. Neither fact proves the other.

Family membership does not prove biological/adoptive parentage, marriage, guardianship, fosterage, household residence, property, title, legitimacy, inheritance rights, or account-family identity.

## 11. Household vs Family vs Kinship Link Boundary

Keep three authorities distinct:

- household identity plus future household membership owns domestic/co-residential organization;
- family identity plus future family membership owns recognized kin-group identity;
- future `civilization.kinship_links` owns direct relation claims.

Kinship links, not arrays, must own parent-child, spouse/partner, former spouse/partner, guardian-ward, adoptive parent-child, foster parent-child, and disputed/concealed/rumored/unrecognized claims. Links require directional/symmetric semantics, visibility, recognition, provenance, and later effective/era posture.

Sibling, ancestor, descendant, grandparent, cousin, aunt/uncle, and similar relationships should be derived from validated direct links where possible. Co-residence must never fabricate kinship, and a shared family membership must never fabricate a direct relation.

No kinship-link schema/content is approved in this pass.

## 12. Lineage, Clan, Noble House, Dynasty, Bloodline, Estate, Property, Inheritance, Marriage, Offspring, and Succession Boundary

Keep genealogical lineage, clan, noble house, dynasty, and bloodline separate and deferred.

Player `lineageId` remains ancestry/species authority. Do not create `civilization.lineages` until a dedicated decision chooses an unambiguous name/id family that cannot collide with `lineage.human` and similar player ids. Bloodlines UI naming does not prove a bloodline content authority.

Noble houses and dynasties are political/status overlays that require family, person, polity, title/law, and recognition authority. They must not be encoded through family `recognitionPosture` or notes as executable status.

Estates/property own assets, obligations, location/control, and ownership claims. Families/households may later have typed associations, but those do not establish ownership, access, income, storage, or transfer.

Marriage/union history, inheritance rules, succession, wills/bequests, heir priority, guardianship/adoption/foster legal effects, offspring/descendant generation, and property/title transfer remain later dedicated authorities/runtime behavior. Household/family records must not execute or calculate them.

## 13. Account Family, Family Prestige, Source-Run, Estate State, Bloodlines UI, Settlement Synthetic Household, Player-State, Runtime, UI, Storage, Reward, Command, Event, and Gameplay Boundary

Existing mutable account/runtime owners remain unchanged:

- `AccountFamilyRecord` and `AccountFamiliesState` own player-family records, members, root characters, lifecycle, timestamps, Prestige transactions, and unlocks;
- `AccountRunHistoryRecord` owns run continuity, optional account family/parent hints, source runs, and inheritance-use counters;
- `AccountEstateState` owns deposits, assets, quantities/claims, locations, and previews;
- Bloodlines owns read-only account presentation;
- creator/source-run and legacy helpers own current inheritance-use and continuation behavior;
- settlement simulation owns synthetic `npc_household`/`npc_individual`, `household.<settlement>.<district>`, property/legal labels, and derived operators.

Static authored records must not reuse or resolve those ids, mirror their fields, or mutate their behavior. No authored/account family bridge is approved.

First-pass household/family schemas must reject root/member character ids, source-run ids, timestamps, account statuses, Prestige balances/transactions/unlocks, estate assets/deposits/claims, inheritance uses, Bloodlines/UI fields, generated operators, property/legal status, owner/operator fields, runtime state, storage/save state, rewards, commands, events, or gameplay effects.

## 14. Knowledge, Economy, Religion, Polity, Law, Quest, Chronicle, Travel, Magic, Item, and Service Boundary

Future typed links may associate households/families with Knowledge, economy, religion, polities/law, quests/Chronicles, travel, magic, items, or services only after each owning authority and privacy/visibility posture exists.

Knowledge may later identify public families or historical context, but must not expose private household/membership/kinship facts without explicit authority. It must not grant membership, inheritance, property, marriage access, Prestige, rank/title, law exemptions, rewards, or behavior.

Economy/workplaces own production, jobs, businesses, prices, income, and labor. Religion owns faith/orders/sacred places. Polity/law owns political/legal identity. Quests/Chronicles own narrative descriptors/state boundaries. Travel owns movement/routes. Magic owns spell/study authority. Items/services retain their own identity and execution.

Household/family records must not grant employment, recipes, shops, income, taxes, property, titles, offices, religious standing, spell access, services, access, favorability/alignment, reputation, rewards, commands, events, or gameplay effects.

## 15. Future Schema and Validator Direction

`Version 0.5.238 - Household And Family Schemas And Validators` remains the conditional implementation candidate after the docs-first queue.

That pass should create the two identity schemas, pure semantic validators, and focused in-memory tests only. It should not add live content, membership/kinship schemas, loaders, normal content-lint registration, account adapters, migrations, runtime state, UI, storage, or behavior.

Future validation should enforce:

1. strict records-only wrappers;
2. unique `civilization_household.<slug>` and `civilization_family.<slug>` ids/slugs with exact suffix agreement;
3. no collision/equality bridge with account `familyId`, synthetic `household.*`, player `lineageId`, or character ids;
4. controlled lifecycle, household-form, recognition, place-type, and anchor/association-role vocabularies;
5. household place anchors are non-empty, duplicate-free, and resolve to active regions/localities/settlements;
6. family place associations are duplicate-free and resolve when present;
7. no member, person, household, family, kinship, lineage, estate, title, or ownership arrays/fields in identity records;
8. no inference from surnames, account data, source runs, ancestry ids, parent hints, UI, settlement projections, synthetic operators, titles, prose, or property labels;
9. forbidden inheritance, property transfer, marriage/offspring, Prestige, reputation, access/service, reward, runtime, storage, UI, command, event, and gameplay fields are rejected.

Membership and kinship require later dedicated decisions. Any seed plan after `0.5.238` must use explicit canon and must not copy account or generated settlement data.

## 16. Temporary Research Artifact Handling

Delete `docs/dev/tmp-family-lineage-systems-research-2026-06-20.md` in this pass.

Its useful person, household, family, membership, kinship, marriage, lineage/clan/noble-house/dynasty/bloodline, estate/property, inheritance/succession, Prestige, NPC/player/runtime, economy/law/religion/polity, Knowledge, validation, authored/generated, and roadmap boundaries are now permanently owned by `docs/design/family-authority-boundary-decision.md`, `docs/design/person-vs-npc-schema-decision.md`, this decision, and the future-content backlog. No named future consumer remains.

Future family work must start from permanent design docs and a fresh live-repo audit rather than restoring or treating the temporary report as canon.

## 17. Non-Goals

- no schema, validator, content JSON, test, loader, normal lint registration, or migration changes;
- no household/family seed content, membership/kinship links, lineage, clan, noble house, dynasty, bloodline, estate, inheritance, marriage, guardianship, adoption, fosterage, offspring, or descendant schema/content;
- no Knowledge registry/snippet behavior or account-family, Family Prestige, source-run, estate, inheritance-use, Bloodlines, creator, or legacy behavior changes;
- no settlement, geography, economy, religion, polity, law, person/NPC, quest, travel, item, magic, or runtime authority changes;
- no property/inheritance/bequest/title transfer, heir priority, child generation, marriage mechanics, estate income, Prestige mechanics, favorability/alignment, reputation, law effects, access, services, rewards, commands, events, UI, storage, or gameplay behavior;
- no compatibility aliases, id migration, data rename, new Deep Research, or transition to `0.6.0`.

## 18. Next Recommended Version

Proceed with `Version 0.5.227 - Settlement Economy Schema Decision`.

That run remains documentation-only. It should reconcile embedded settlement economy fields with future settlement-economy authority, preserve markets/production/guild/runtime owners, and decide the economy temporary research artifact's retirement.

No new GPT Deep Research is required before `0.5.227`. GPT-DR gates remain non-Codex labels, and permanent prompt-pack guidance does not interrupt the immediate numbered queue.
