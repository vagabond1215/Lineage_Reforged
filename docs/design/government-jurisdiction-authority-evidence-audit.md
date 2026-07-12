# Government Jurisdiction Authority Evidence Audit

Source version/run: Version 0.5.341 - Government Jurisdiction Authority Evidence Audit
Date: 2026-07-12
Status: completed documentation-only evidence audit; zero candidate ids; boundary decision selected

## 1. Audit Result

Current repository evidence supports a focused government/jurisdiction owner-boundary decision, but it does not support canonical content candidates or schema planning yet.

Carry forward exactly zero `government.*` ids and zero `jurisdiction.*` ids. Select `Version 0.5.342 - Government Jurisdiction Authority Boundary Decision` next.

Government and jurisdiction must remain separate. Government describes an enduring or temporally bounded governing organization/arrangement. Jurisdiction describes where, over whom, or over which subject matter authority applies. Neither can be inferred from polity identity, physical place, settlement administration level, quest presentation, synthetic operators, property labels, or mutable lawful-standing state.

## 2. Authority Surface Posture

- No government content collection, schema, validator, focused test, or normal content-lint registration exists.
- No jurisdiction content collection, schema, validator, focused test, or normal content-lint registration exists.
- `world.polities` contains exactly two planned normally validated political identities: `polity.valtherion` and `polity.draemor`.
- Polity schema/validation explicitly rejects government and jurisdiction fields.
- Existing institution, business, faction, place, map-feature, route-security, district, and site validators reject government/jurisdiction crossover fields where applicable.
- No `government.*` or `jurisdiction.*` canonical content id exists.

Technical absence is not itself permission to create a new owner. The evidence below must first be separated by semantics.

## 3. Evidence Inventory

| Surface | Exact posture | Classification | Authority result |
| --- | --- | --- | --- |
| `polity.valtherion` | Planned `empire` identity with Valtherion and Highcrown anchors | Canonical polity identity | Does not define government, ruler, jurisdiction, law, claim, control, or tax. |
| `polity.draemor` | Planned `realm` identity with Draemor and Riverthrone anchors | Canonical polity identity | Does not define a government form or jurisdiction. |
| 88 settlement `administrativeRole` values | 5 continental, 4 regional, 19 subregional, 49 local, 11 none | Authored place descriptor vocabulary | Describes place importance/administrative role, not a governing body or applicability scope. |
| `quest_definition.brineharbor_reef_soundings` | Giver type `government`; `office.harbor_master.brineharbor`; Brineharbor Harbor Office; Harbormaster Sel Varn | Authored quest presentation anchor | Partial government-facing context only; office/position/body/provider meanings are unresolved. |
| `quest_definition.aurelis_counterfeit_ring` | Giver type `government`; `office.civic_watch.aurelis`; Aurelis Civic Watch; Inspector Halwen Crest | Authored quest presentation anchor with government/office/force ambiguity | Cannot establish government, office, institution, force, jurisdiction, or person canon. |
| Quest standing ids | `rep.harbor_authority.brineharbor`, `rep.civic_watch.aurelis` | Mutable quest/reputation targeting vocabulary | Names standing targets for requirements; does not establish static authority identities. |
| Derived authority ids | `authority.<settlement>.civic_council`, `.mixed_council`, `.frontier_claim`, `.garrison_command`, `.guild_charter` | Synthetic settlement/property simulation projection | Generated owner/operator labels, not authored governments or jurisdictions. |
| Other derived property ids | `.garrison`, `.market_charter`, `.ward_office`, `.estate_holder` | Synthetic property ownership/operator projection | Property/runtime labels; cannot mint civic canon. |
| `civil_authority` / `military_authority` | Reusable owner-type vocabulary | Runtime/template classification | A type family, not an exact identity authority. |
| `LegalStatus` | `clear_title`, `disputed`, `encumbered`, `tax_delinquent`, `guild_claim`, `condemned` | Mutable derived property-state vocabulary | Property/legal condition, not jurisdiction identity or law authority. |
| `StartLawfulStanding` | ordinary, chartered, military clearance, frontier tolerated, temple guest, unrecognized | Start-access/runtime decision vocabulary | Character access/recognition posture, not static jurisdiction. |
| District access requirements | open, licensed, chartered, sanctified, military clearance, restricted | Access/template vocabulary | Does not define the authority applying the restriction. |
| Highcrown/Market Courts Knowledge | Static settlement/district identity wording with explicit court/law exclusions | Informational place consumer | Does not establish government, jurisdiction, court, or law records. |
| UI/demo/gameplay-loop harbor-office and legal wording | Presentation and local runtime narrative | Consumer/demo state | Cannot own canonical government or jurisdiction identity. |
| Validator forbidden-field lists | Reject `governmentId`, `jurisdictionIds`, law, court, force, and behavior fields from other owners | Structural guardrail/test vocabulary | Protects boundaries but supplies no candidate. |
| Design examples and future vocabularies | Government, settlement government, civil/religious/military jurisdiction, law, force, court, citizenship | Hypothetical planning taxonomy | Useful for later boundary questions only; not canon. |

## 4. Government Evidence Assessment

### Durable evidence present

- The two polity records prove that political identities exist and may later need separate governing arrangements.
- Settlement administrative roles prove that places carry authored administrative importance.
- Two quests intentionally label their giver type as `government` and present a harbor office and civic watch.
- Derived simulation expects civil/military authority categories and local authority-shaped operator labels.

### Missing authority facts

No source provides a complete government identity or arrangement:

- no canonical government name independent of quest presentation or generated labels;
- no unambiguous `government.<slug>` authority;
- no clear distinction among governing body, government system, department/agency, institution, office, force, and local provider;
- no explicit polity-to-government cardinality or temporal validity;
- no non-invented governing-organization summary;
- no supported lifecycle, visibility, organization/form vocabulary, provenance, or reference posture for a full record;
- no evidence that `Brineharbor Harbor Office` or `Aurelis Civic Watch` is a government rather than an office, force, institution, or presentation abstraction.

The `empire` and `realm` polity forms are deliberately not detailed government forms. A seat reference is deliberately not a government record. `administrativeRole` is deliberately place-owned.

Government candidate result: exactly zero ids.

## 5. Jurisdiction Evidence Assessment

### Boundary evidence present

- The permanent civic decision defines jurisdiction as applicability distinct from place, polity, government, and law.
- Settlement administrative levels, polity/place anchors, quest locations, property labels, and access decisions demonstrate future consumers that may need applicability context.
- Multiple validators reserve the boundary by rejecting `jurisdictionIds` from unrelated static records.

### Missing authority facts

No source provides a complete jurisdiction identity or applicability record:

- no canonical jurisdiction name or `jurisdiction.<slug>` authority;
- no explicit governing authority anchor;
- no authored place, person, or subject-matter scope;
- no overlap, priority, visibility, or temporal posture;
- no clear distinction between territorial jurisdiction, administrative reach, property condition, access restriction, claim/control, route-security coverage, and legal standing;
- no non-invented summary, lifecycle, provenance, or reference model.

A polity/place association does not establish jurisdiction. Settlement `administrativeRole` does not define applicability. `LegalStatus`, `StartLawfulStanding`, and access requirements are mutable/derived consumers, not static jurisdiction authority. Law prose cannot substitute for jurisdiction.

Jurisdiction candidate result: exactly zero ids.

## 6. Preserved Owner Boundaries

- Polities keep durable political identity and descriptive form/place anchors.
- Regions, localities, settlements, districts, sites, routes, maps, and geometry keep physical/place authority.
- Institutions keep enduring body identity; office remains a distinct not-schema-ready position/unit question.
- Quests keep giver presentation, requirements, standing targets, branches, rewards, and consequences.
- Settlement simulation and property derivation keep synthetic `authority.*` owners/operators, legal status, and access decisions.
- Reputation keeps mutable fame/notoriety and scoped standing behavior.
- Law remains downstream of a future jurisdiction decision.
- Courts remain distinct from courthouse place, judicial institution, office-holders, procedure, law, and case runtime.
- Force/public order remains distinct from government, office, institution, settlement tags, mandate coverage, spawning, patrols, AI, combat, and enforcement.
- Claims/control, diplomacy/conflict, citizenship/legal status, tax, access, licenses, cases, wanted/bounty, UI, save/account, and gameplay remain separate.

No prefix normalization, alias, migration, compatibility behavior, reference, resolver, adapter, or consumer enablement is approved.

## 7. Readiness Decision

Neither government nor jurisdiction is schema-ready from this audit alone. Both have enough mixed evidence and permanent conceptual separation for one docs-only boundary decision.

The boundary decision should:

1. define government identity/arrangement versus polity, institution, office, force, settlement administration, and runtime;
2. define jurisdiction applicability versus place, polity, claim/control, government, law, access, property labels, and runtime standing;
3. decide whether government, jurisdiction, both separately, or neither can proceed to one content-independent schema plan;
4. prefer jurisdiction sequencing before law, but not assume jurisdiction schema readiness;
5. carry forward zero ids and authorize no implementation.

## 8. Deep Research, User Question, And Support Posture

Deep Research is not required before the boundary decision. The immediate problem is repository-local ownership, not comparative government or legal taxonomy.

No explicit user question is required. The boundary decision can fail closed without inventing canon and can identify a later authored-input gate.

No support-suffix run is needed. Current validation is green and the audit is decision-complete.

## 9. Temporary Guardrail Cleanup Decision

No temporary civic guardrail document was encountered. `docs/dev/tmp-civic-authority-systems-research-2026-06-20.md` remains correctly absent after its earlier retirement. Do not recreate it. Permanent civic, polity, institution/office, roadmap, and backlog documents own the remaining guidance.

## 10. Explicit Non-Goals

- no government or jurisdiction candidates, drafts, content, schemas, validators, tests, registration, references, or consumers;
- no polity, settlement, district, site, route, map, institution, office, quest, property, reputation, Knowledge, runtime, UI, save/account, or gameplay changes;
- no law, court, force, enforcement, citizenship, legal-status, tax, access, claim/control, diplomacy, conflict, membership, provider, or reputation implementation;
- no existing gate reopening, Deep Research, temporary artifact, support suffix, migration, compatibility behavior, or `0.6.0` transition.

## 11. Audit Answers

1. No dedicated government authority exists.
2. No dedicated jurisdiction authority exists.
3. Exactly zero government ids carry forward.
4. Exactly zero jurisdiction ids carry forward.
5. Polity forms/place anchors do not define government or jurisdiction.
6. Settlement administrative roles remain place descriptors.
7. The two `office.*` quest anchors remain presentation-only and semantically ambiguous.
8. Synthetic `authority.*` ids remain derived simulation/property projections.
9. Property legal status, access requirements, lawful standing, and reputation targets remain mutable consumer vocabulary.
10. Law remains downstream of jurisdiction.
11. Force/public order and enforcement remain separate.
12. Neither layer is schema-ready yet.
13. Both layers have enough mixed evidence for one focused boundary decision.
14. Deep Research is not required.
15. No explicit user question or support suffix is required.
16. No temporary guardrail doc should be retained or recreated.
17. Select `Version 0.5.342 - Government Jurisdiction Authority Boundary Decision`.

## 12. Next Recommended Version

Version 0.5.342 - Government Jurisdiction Authority Boundary Decision
