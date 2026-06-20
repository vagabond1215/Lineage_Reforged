# Family Authority Boundary Decision

Version: `0.5.200 - Family Authority Boundary Decision`
Status: completed documentation-only decision
Date: 2026-06-20

## 1. Decision Summary

Approve a docs-first family authority route with future `civilization.households` as the first implementation candidate. Household, family, kinship link, genealogical lineage, clan/noble-house/dynasty overlay, estate, and player legacy state remain separate owners.

Direct parent, spouse/partner, guardianship, adoption, and fosterage facts belong in future `civilization.kinship_links`, not person records. Household membership is a separate domestic-membership fact and must not imply kinship. Both relationship and membership claims require visibility, recognition/dispute, provenance, and later temporal metadata.

Future static family authority keeps inheritance traditions and family prestige descriptive-only. Full player heirs, descendants, bequests, succession, property transfer, and mutable legacy continuation remain `0.6+` work. Existing account family, Family Prestige ledger, estate deposit/claim preview, source-run continuation, and Bloodlines presentation behavior remain unchanged and are not promoted into civilization content by this decision.

This run consumes `docs/dev/tmp-family-lineage-systems-research-2026-06-20.md` as planning input. It implements no schema, validator, content, test, runtime, UI, storage, inheritance, marriage, child generation, property transfer, prestige effect, Knowledge subject, or gameplay behavior.

## 2. Live Repo Reality

The temporary research provides useful conceptual boundaries but explicitly lacks repository visibility. Live inspection establishes:

- No `packages/content/base/family`, `lineage`, `characters`, `npc`, `ownership`, or `economy` collection exists.
- No canonical person, household, family, kinship, genealogical-lineage, bloodline, noble-house, clan, dynasty, or estate content schema exists.
- `AccountFamilyRecord` already provides mutable account-owned family state with `familyId`, name, root character, member character ids, lifecycle status, timestamps, and notes.
- `AccountFamiliesState` also owns Family Prestige transactions and family-scoped unlocks. Totals are derived by existing helpers and displayed read-only in Bloodlines.
- `AccountRunHistoryRecord` already carries `characterId`, ancestry-oriented `lineageId`, optional `familyId`, optional `parentCharacterId`, source-run continuity, and limited inheritance-use fields.
- Current `lineageId` drives playable ancestry/species profiles, body state, growth biases, creator selection, achievements, and Legacy requirements. It is not canonical genealogical-lineage authority.
- `AccountEstateState` already stores archived-run deposits and assets, with read-only/limited claim previews and location checks.
- Character creation can select a source run and consume a limited retired-run inheritance use. This is not a canonical heir, kinship, marriage, or family-tree system.
- The Bloodlines surface is a read-only projection over explicit account family records, Family Prestige ledgers, unlocks, and linked run history. It does not create world-canon families or kinship.
- Settlement simulation can derive `npc_household` owner/operator ids for local businesses, but those synthetic runtime ids are not authored household authority.

This decision does not remove, rename, migrate, or expand those owners. It defines the boundary for future authored civilization authority and prevents static content from duplicating mutable account state.

## 3. Person / Character Authority Boundary

Future authored named people or historical figures require a distinct person authority, likely `civilization.persons`, before household or kinship content can safely reference them.

Person authority owns intrinsic identity and authored life-status facts. It may own names, aliases, status, known place associations, descriptive roles, provenance, and notes. It must not own the entire family tree, spouse lists, parent arrays, household history, inheritance state, inventory, prestige balance, or runtime behavior.

Player characters remain runtime/save identities through snapshots and account run history. A player `characterId` must not silently become a world-canon person record. Authored NPC/historical person ids and mutable player character ids need an explicit reference policy in the next schema decision.

Current ancestry `lineageId` remains a player-origin/physiology identifier. It must never be used as a family id or genealogical-lineage id.

## 4. Household Authority Boundary

Approve future `civilization.households` as the first family-lane implementation candidate, beginning with a documentation-only schema decision.

A household owns co-residence, domestic organization, dependents, and household roles at a place and during an interval. A household may include relatives, spouses, wards, servants, lodgers, apprentices, or unrelated partners. It is not equivalent to a family, marriage, estate, business, or property owner.

Household membership must be explicit and must include, at minimum in the eventual authority model:

- referenced person or approved runtime-character identity;
- household role;
- recognition/claim status;
- visibility posture;
- provenance;
- later effective start/end or era metadata if membership changes are represented.

The next decision must choose whether membership records are strict embedded objects or a separate future `civilization.household_memberships` collection. Person records must not carry a competing household-member list. A derived `primaryHouseholdId` view may exist later, but it is not the canonical membership fact.

No household record may grant housing access, services, inventory, storage, income, labor, ownership, inheritance, prestige, or gameplay effects in its first pass.

## 5. Family Authority Boundary

Future `civilization.families` owns socially recognized kin-group identity, family name or names, public continuity, cultural/place associations, known household references, and descriptive history.

A family may span multiple households and places. A household may contain members from multiple families. Family membership does not by itself prove parentage, marriage, household residence, estate control, title, clan status, or genealogical descent.

Existing `AccountFamilyRecord` remains mutable player/account state, not a substitute for world-canon family content. The next schema decision must define whether authored and account family ids can ever refer to the same identity and how duplicate ownership is prevented. It must not add aliases or infer a static family from `lineageId`, source run, surname, UI label, or account id.

## 6. Kinship Link Authority Boundary

Direct kin and care relations must live in future `civilization.kinship_links`, not as spouse, parent, child, guardian, adoptive, or foster arrays on person or family records.

First-class direct facts may include:

- parent-child;
- spouse or recognized partner;
- former spouse/partner when historically relevant;
- guardian-ward;
- adoptive parent-child;
- foster parent-child;
- disputed, rumored, concealed, or unrecognized claims.

Sibling, grandparent, cousin, aunt/uncle, ancestor, descendant, and most affinity relations should be derived from validated direct links.

Every direct link requires directional semantics where applicable, visibility metadata, recognition/claim status, provenance, and later effective-date or era support. It must distinguish biological, adoptive, foster, legal, ritual, social, and disputed claims where canon requires those meanings.

Household membership is not a kinship link. A household record or membership authority may reference the same people, but co-residence must never create parent, spouse, or family facts by inference.

## 7. Lineage, Bloodline, Clan, Noble House, and Dynasty Boundary

Keep future families and genealogical lineages separate.

- Family owns a socially recognized kin group.
- Genealogical lineage owns a claimed descent branch, ancestor/founder continuity, and multi-generation historical identity.
- Clan owns a broader cultural or descent-based affiliation when setting canon requires it.
- Noble house owns a political/status overlay and must reference title, polity, law, or recognition authority before claiming power.
- Dynasty owns ruling or office-holding continuity across families/branches and must not imply current rule without polity authority.

The name `lineage` is already overloaded by playable ancestry ids such as `lineage.human`. Before a `civilization.lineages` collection is implemented, a dedicated decision must choose an unambiguous id family and prohibit cross-use with player ancestry `lineageId`.

Defer `civilization.bloodlines` unless explicit world canon proves a distinct narrative, ritual, magical, or hereditary authority that family and genealogical lineage cannot express. The current Bloodlines UI title and account family presentation do not prove a bloodline content collection is required.

No clan, noble house, dynasty, lineage, or bloodline record may grant title, office, rank, traits, stat tendencies, spell access, property, legitimacy, favorability, alignment, or gameplay effects in its first pass.

## 8. Estate, Property, and Ownership Boundary

Estates and property remain separate from family identity.

A future estate/property authority owns land, buildings, workshops, businesses, ships, warehouses, household goods, obligations, and control claims. A family, lineage, clan, noble house, household, or person may reference an estate association, but that reference does not establish ownership or transfer rights.

Existing `AccountEstateState` remains mutable account storage for archived-run assets and previews. It is not world-canon estate content and must not be copied into family records.

Family authority must reject property inventories, ownership mutation, estate income, rent, taxes, storage state, shop inventory, transfer commands, and bequest execution.

## 9. Inheritance and Succession Boundary

Keep inheritance and succession descriptive-only in `0.5.x`.

Safe future authority may record customary succession traditions, historical succession notes, recognized or disputed historical claims, inheritance-law references, and provenance. Executable rules belong to later dedicated owners after person, household, family, kinship, estate/property, law, and polity authority are stable.

Do not calculate heir priority, transfer property, divide shares, move inventory, grant title/rank, collect income, spend prestige, execute wills, resolve disputes, or mutate save state from family content.

## 10. Marriage, Partnership, Guardianship, Adoption, and Fosterage Boundary

Marriage is not household membership, and household membership is not marriage.

Kinship links may record a spouse/partner fact, guardian-ward relation, adoption, or fosterage with visibility and claim metadata. A later marriage/union authority should own ceremony, legal/religious recognition, history, dissolution, widowhood, and culturally specific restrictions when those concepts become necessary.

Guardianship, adoption, and fosterage must remain distinct relation types. They must not fabricate biological parentage, inheritance rights, family membership, household residence, or legal status without explicit authority.

No first-pass record may create marriage access, dowry/bridewealth transfer, children, descendants, household formation/dissolution, custody effects, law effects, favorability, alignment, or gameplay behavior.

## 11. Family Prestige and Reputation Boundary

Static family, household, lineage, clan, noble-house, and dynasty content may use descriptive reputation or prestige bands and sourced notes only. Those fields must be non-mechanical and must not contain score deltas, spend costs, unlock effects, rank grants, discounts, access, or relationship effects.

Existing account Family Prestige is already a mutable family-scoped ledger with grant/spend transactions, derived totals, and unlock references. It remains the current account-state owner and is unchanged by this decision. Static family content must not duplicate its balance or transaction state.

Future integration between authored family reputation and account Family Prestige requires a dedicated owner and must not be inferred from a shared family name or id.

## 12. NPC, Player, and Runtime Legacy Boundary

Authored civilization authority may later describe canonical people, households, families, links, and historical lineages. Mutable player families, run history, source-run continuity, Family Prestige, unlocks, estate assets, and future descendants remain account/save state.

Defer full player heirs, descendant generation, bequest preparation/execution, branch closure, succession, household mutation, property transfer, heirloom transfer, and player legacy continuation to `0.6+`.

The current source-run selector, limited inheritance-use consumption, account family records, estate deposits/claim previews, and Bloodlines read-only projection remain existing narrow behavior. They are not proof of an heir authority, do not establish kinship, and are not expanded by this decision.

## 13. Economy, Crafting, Law, Religion, and Polity Integration Boundary

Family authorities may later reference settlement, economy, profession, guild, institution, crafting tradition, estate, law, religion, culture, polity, title, or sacred-site authorities after those owners exist.

References remain descriptive in the first pass. They must not grant employment, guild membership, recipes, shops, income, estate control, taxes, law exemptions, marriage restrictions, titles, offices, religious standing, spell access, services, favorability, alignment, or gameplay effects.

`docs/design/economy-authority-boundary-decision.md` owns the economy/property separation, and `docs/design/world-geography-authority-boundary-decision.md` owns place/political-overlay prerequisites. Family content must consume rather than redefine those authorities.

## 14. Knowledge Integration Boundary

Family Knowledge remains informational until a dedicated Knowledge subject decision approves exact subject types and canonical collections.

Future Knowledge may identify families, genealogical lineages, clans, noble houses, dynasties, estates, historical kinship claims, inheritance traditions, or reputation context after their authorities exist. Households and private kinship claims may be unsuitable as first subjects because visibility and mutable membership must be respected.

No `knowledge_domain.family`, `family`, `lineage`, `household`, or kinship shortcut is approved here. Knowledge must not grant inheritance rights, family membership, property, marriage access, prestige, favorability, law exemptions, rank, unlocks, or gameplay rewards.

## 15. First Implementation Candidate

The first implementation candidate is `civilization.households`, beginning with a documentation-only household-vs-family schema decision rather than a schema file.

The next run should be:

`Version 0.5.201 - Household vs Family Schema Decision`

It must decide collection paths and id families, the minimum authored person-reference prerequisite, household membership representation, household and family lifecycle status, place anchors, visibility/dispute/provenance metadata, strict forbidden fields, validation ownership, and the boundary with `AccountFamilyRecord` and synthetic `npc_household` runtime ids. It must not create schemas, validators, content, tests, runtime adapters, compatibility aliases, or migration behavior.

Household is the first candidate because no existing authored content owner represents durable co-residential domestic units. It is not ready for implementation until the next decision resolves person ids and prevents overlap with account/runtime owners.

## 16. Future Validation Direction

Later schema and validator work should be staged separately and eventually enforce:

1. strict records-only wrappers and canonical id/slug agreement;
2. unique person, household, family, kinship-link, and later lineage identities;
3. canonical person and place references with active-parent coherence;
4. no duplicate household membership ownership;
5. explicit membership role, visibility, claim/recognition, provenance, and supported temporal posture;
6. direct kinship ownership only in kinship links;
7. directional relation semantics and reciprocal spouse/partner coherence;
8. no self-parent, self-spouse, self-guardian, or impossible parent/ancestor cycles;
9. distinct biological, adoptive, foster, guardian, social, legal, ritual, disputed, and concealed claims where supported;
10. no inference from household co-residence, surname, player ancestry `lineageId`, source run, or UI labels;
11. estate/property, title/polity, religion, law, economy, guild, and institution reference validity only after those authorities exist;
12. rejection of runtime, storage, UI, inheritance transfer, property transfer, child generation, heir state, bequest execution, prestige effects, ownership mutation, command, event, reward, and gameplay fields.

No schema, validator, test, or content-lint change is authorized by this decision.

## 17. Temporary Research Artifact Handling

`docs/dev/tmp-family-lineage-systems-research-2026-06-20.md` was consumed as planning input and remains a temporary guardrail, not final design canon.

Keep it through `0.5.201` because it contains candidate fields and later kinship, marriage, lineage, estate, inheritance, prestige, and Knowledge questions not fully owned by this boundary document. The schema-decision run must delete it if all useful guidance has been promoted, or retain it only with a named next consumer and removal condition.

## 18. Non-Goals

- no schema, validator, content JSON, Knowledge registry/snippet, or test changes;
- no economy or geography authority changes;
- no runtime system, UI, storage, inheritance, property transfer, marriage, partnership, guardianship, adoption, fosterage, children/descendant generation, heir succession, bequest execution, or family-management changes;
- no family reputation mechanics, Family Prestige behavior changes, favorability/alignment effects, estate income, ownership mutation, title/rank transfer, or law effects;
- no command, event, reward, service, access, or gameplay behavior;
- no migration, compatibility alias, rename, or deletion of existing account family, estate, lineage/ancestry, source-run, or Bloodlines owners;
- no transition to `0.6.0`.

## 19. Next Recommended Version

`Version 0.5.201 - Household vs Family Schema Decision`

That run should remain documentation-only and resolve person references, membership ownership, id namespaces, and account/runtime overlap before any schema or content implementation.
