# Business Authority Seed Evidence Audit

Source version/run: Version 0.5.338 - Business Authority Seed Evidence Audit
Date: 2026-07-11
Status: completed documentation-only audit; zero candidate ids; fail-closed deferral selected

## 1. Result

No current durable authored source supplies a complete canonical business record. Carry forward exactly zero `business.*` ids and select `Version 0.5.339 - Business Authority Seed Evidence Deferral` next.

The existing business schema, validator, focused tests, and schema parse coverage remain a content-independent scaffold. Live business content and normal content-lint registration remain absent.

## 2. Complete Seed Gate

Every candidate must supply all of the following without inference or fact-mixing across owners:

1. an exact canonical display name;
2. proof that the subject is an enduring commercial body rather than a branch, place, provider, person, quest abstraction, account asset, template, or generated operator;
3. an unambiguous lower-snake slug and exact `business.<slug>` authority, or explicit authority to derive both;
4. a non-invented static identity summary independent of a particular quest or operation;
5. supported lifecycle status: `planned|active|retired`;
6. supported form: `company|partnership|cooperative|other|unknown`;
7. supported public posture: `public|semi_public|secret|unknown`;
8. durable source-authority notes;
9. notes that state relevant non-implications without manufacturing missing facts; and
10. coherent first-pass identity without references or mutable commercial behavior/state.

Failure of any item rejects the candidate. `unknown` is a controlled value only where the durable source supports an unknown classification; it cannot repair uncertain identity authority.

## 3. Ironwheel Haulage Company Assessment

Source: `quest_definition.coppergate_ore_train_relief` in `packages/content/base/civilization/quest_definitions.json`.

| Required fact | Evidence | Decision |
| --- | --- | --- |
| Exact name | Quest giver display name is `Ironwheel Haulage Company`. | Supported as quest-facing display text. |
| Enduring commercial body | The quest says Ironwheel needs a reinforced crew for a delayed ore convoy. | Incomplete. This proves a quest provider/operation, not whether the identity is the enduring firm, a local branch, or another presentation abstraction. |
| Canonical id and slug | Quest giver `entityId` is `business.ironwheel_haulage_coppergate`. | Incomplete. It is a presentation anchor, not proven canonical static authority. The `coppergate` suffix could identify a branch/local qualifier rather than the core body. |
| Static summary | The quest summary describes one delayed convoy and smelter deadline. | Incomplete. Converting quest behavior into an enduring identity summary would invent scope. |
| Lifecycle status | No explicit lifecycle fact exists. | Missing. |
| Form | The display name ends with `Company`. | Partially supported, but this cannot cure the missing identity and lifecycle facts. |
| Public posture | No explicit visibility posture exists. | Missing. `unknown` would not resolve the authority ambiguity. |
| Source authority notes | The exact quest record can be cited. | Supported as provenance for the limited facts above. |
| Notes | Non-implication notes could preserve the quest boundary. | Possible, but notes cannot supply missing canonical facts. |
| Reference-free coherence | The evidence is tied to Coppergate, Foreman Mira Kell, a settlement id, and one quest operation. | Not proven. Removing those contextual facts leaves the enduring body and canonical slug unresolved. |

Ironwheel therefore fails the complete gate and is not a seed candidate. Neither `business.ironwheel_haulage_coppergate` nor a shortened invented alternative is approved.

## 4. Other Classified Evidence

- `business.gannet_cutter` remains demo/test-only and is not authored canon.
- Generated `company.<settlement>.<districtType>` ids remain synthetic owner/operator projections.
- Account-estate `business.*` values remain mutable persisted asset state.
- Building `triggerBusinessTypes` and workplace `businessScale` remain template/production vocabulary.
- Settlement business state remains derived simulation state.
- Quest trust effects and other business behavior remain quest/runtime-owned.
- Business-window UI remains a potential consumer of future ledgers, not identity authority.

None of these sources may be combined with Ironwheel to manufacture a complete record.

## 5. Candidate And Change Decision

- Exact accepted candidate ids: none.
- Live `packages/content/base/civilization/businesses.json`: remains absent.
- Normal business content-lint registration: remains absent.
- References, resolvers, adapters, migrations, prefix normalization, and consumers: remain absent.
- Existing quest, account, template, generated-company, settlement, runtime, UI, demo, and test owners: unchanged.

## 6. Reopening Evidence

A later seed audit should occur only after materially new durable input supplies the missing gate facts, such as:

1. an explicit user-authored or user-approved canonical business list;
2. a new canonical repository source intentionally defining enduring businesses and complete record facts; or
3. an explicitly authorized focused business-content authorship pass.

Another scan of unchanged sources, consumer demand, external research, genre convention, or recombination of separately owned facts does not qualify.

## 7. Research, User Question, And Support Posture

Deep Research is not required; the missing evidence is project-specific canon. Do not ask the user a broad business-worldbuilding question now. Ask only if a later roadmap decision intentionally prioritizes business authorship or a ready consumer requires canonical identities. No support-suffix run is needed because the audit is decision-complete.

## 8. Audit Answers

1. The implemented contract remains the exact seed gate.
2. Ironwheel does not satisfy every required field.
3. Its quest `entityId` does not prove canonical static namespace authority.
4. The `coppergate` suffix remains branch/core-identity ambiguous.
5. Quest operation text cannot become a static summary by inference.
6. Gannet, generated companies, account assets, templates, derived state, UI/demo/tests, and quest behavior remain non-canonical or separately owned.
7. Exactly zero candidate ids carry forward.
8. No content, registration, reference, migration, consumer, runtime, UI, account, or gameplay change is authorized.
9. Deep Research is not required.
10. No explicit user question or support-suffix run is needed now.
11. Select `Version 0.5.339 - Business Authority Seed Evidence Deferral`.

## 9. Next Recommended Version

Version 0.5.339 - Business Authority Seed Evidence Deferral
