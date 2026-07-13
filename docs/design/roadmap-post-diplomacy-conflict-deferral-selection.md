# Roadmap Post-Diplomacy-Conflict Deferral Selection

Source version/run: Version 0.5.352 - Roadmap Post-Diplomacy-Conflict Deferral Selection
Date: 2026-07-12
Status: approved documentation-only roadmap selection; no implementation permission

## 1. Selection Result

Select exactly one next route:

- `Version 0.5.353 - Validation Source Map`

The unresolved static-authority sequence has reached explicit authored-input, ready-consumer, pause, rejection, closure, dependency, research, or maturity gates. No qualifying new canon or consumer exists to reopen those lanes. The smallest eligible foundation-stabilization step is therefore a documentation-only source map of the repository's current validation commands, scripts, focused test families, broad typecheck posture, content-lint ownership, generated-output boundaries, and known environment/tooling blockers.

The source map must be read-only with respect to production code, package scripts, tests, schemas, content, generated output, dependencies, and configuration. It may identify later focused planning candidates but cannot fix, consolidate, rename, or add validation commands.

## 2. Current Lane Inventory

| Lane | Current posture | Reopening or next-step condition | Selection result |
| --- | --- | --- | --- |
| Diplomacy/conflict | Separate zero-id authored-input/ready-consumer gates | Materially new canon, authorized authorship, or qualifying consumer | Gated |
| Force/public order | One-family zero-id authored-input/ready-consumer gate | Complete new force identity and relationship evidence | Gated |
| Government/jurisdiction | Separate zero-id relational/temporal gates | Complete new canon or qualifying consumer | Gated |
| Business | Zero-id seed evidence deferral | Complete approved canon or authorized authorship | Gated |
| Faction | Zero-id seed evidence deferral | Complete approved canon or new durable source | Gated |
| Institution | Zero-id seed evidence deferral | Complete approved canon or authorized authorship | Gated |
| People/NPC | No canonical named-person seed | New durable person authority or approved exact list | Gated |
| Service | Stable registered five-record vocabulary | Named provider/access/consumer need with stable identity owners | Paused/dependency-gated |
| Resource/commodity | Stable registered four-record seed | Named expansion need; research before broad extraction/gathering work | Paused/research-gated |
| Combat health | Stable registered two-status seed | Named expansion or runtime need with an approved owner | Paused/runtime-gated |
| Generic POI | Specific place owners preferred | Only reconsider for a named specialized owner need | Rejected |
| Highcrown settlement Knowledge | Current parent/district/site coverage complete | Independently justified new Knowledge lane | Closed |
| Office | Institution/role/unit/department/force/facility boundary unresolved | Materially new evidence or ready consumer | Semantic/dependency-gated |
| Law/courts | Jurisdiction and court prerequisites unresolved | Stable jurisdiction plus dedicated owner decision | Dependency-gated |
| Claims/borders/territory/control/occupation | Physical/political scope, temporal validity, overlap, and current-state boundaries remain broad | Stronger authored evidence or a named consumer before a focused boundary | Evidence/consumer-gated |
| Provider, membership, rank, office-holder, reputation | Identity/link/state prerequisites incomplete | Stable target identities and named consumer | Dependency/runtime-gated |
| Household/family continuation | People canon and temporal link evidence incomplete | New qualifying canon and owner-specific need | Dependency-gated |
| Property, construction, agriculture, maritime, temporal systems | Cross-owner scope and external grounding remain broad | Exact research question, prerequisites, and named consumer | Research/dependency-gated |
| Living Character Manuscript | Durable boundary exists; historical retention and policy gaps remain | Complete source-retention, provenance, knowledge, persistence, fallback, and quality readiness | Maturity/research-gated |
| Broad magic runtime | Metadata/read-only foundation only | Explicit narrow ownership, command, effect, and validation approval | Maturity/runtime-gated |
| Save/account and runtime ownership transition | High-risk owner, persistence, command, and event contracts incomplete | Dedicated readiness decision with stable prerequisites | Maturity/high-risk gated |
| Validation command/source mapping | Existing scripts, tests, content lint, documented broad typecheck debt, and connector prep are available | Documentation-only current-source audit | Eligible; selected |
| Validation cleanup or support repair | No concrete failing validation defect | Exact reproduced blocker plus separately approved narrow fix | Not selected |

## 3. Why Validation Source Mapping Is Next

1. It fits `v0.5.x` foundation stabilization and validation hardening without crossing into runtime ownership.
2. `docs/design/validation-blocker-inventory.md` already provides bounded connector-side prep and explicitly names a docs-only Validation Source Map as the safest first Codex pass when this area becomes active.
3. The repository has multiple validation surfaces: package scripts, normal content lint, focused unit suites, schema parse coverage, UI/default and workspace typechecks, builds, and generated-output expectations. Their current ownership and applicability are distributed.
4. Broad UI/workspace typecheck debt is documented but must not be mixed into feature work. A source map can distinguish present commands and known blockers without fixing them.
5. Current required focused tests and normal content lint are green, so no support suffix or repair implementation is justified.
6. All higher-priority static-authority candidates are now gated or paused, and claims/borders/control still lacks the stronger evidence or consumer required by the previous selection.
7. The pass can stop after producing a durable current-state map and at most one later docs-first planning recommendation.

## 4. Required Scope For `0.5.353`

The next run should inspect only the current validation/tooling surfaces needed to answer:

- which root/package scripts expose tests, typechecks, builds, content lint, schema checks, and scenario checks;
- which focused test families and pure validators protect the current authority/content lanes;
- what normal content lint loads and which live collections it owns;
- which validation commands are appropriate for docs-only, content, schema/validator, runtime/helper, UI, and generated-output changes;
- which broad typecheck or environment blockers are current, historical, unknown, or stale;
- where generated/vendor artifacts, network dependency, and Git sandbox behavior affect confidence without being repository defects;
- what duplicated, missing, ambiguous, or stale routing deserves a later plan, if any.

It must produce `docs/design/validation-source-map.md`, use repository-local evidence, and keep findings descriptive. It must not run broad cleanup or alter any command surface.

## 5. Stop Conditions

Stop and report rather than broadening if:

- mapping requires changing a script, dependency, config, source, test, schema, content file, or generated output;
- a broad typecheck produces many unrelated failures that require triage beyond classification;
- a network or sandbox limitation prevents one command from being observed;
- an apparent defect cannot be reproduced or assigned to a stable owner;
- the next step would combine validation cleanup with feature work;
- no single coherent later improvement is justified.

A source map may recommend a later Validation Command Matrix Plan, a focused blocker audit, or no immediate follow-up. It may not authorize implementation.

## 6. Preserved Guardrails

- Every current authored-input and ready-consumer gate remains closed without a named qualifying input.
- Service, resource/commodity, and combat-health pauses remain unchanged.
- Generic `world.pois` remains rejected; Highcrown settlement Knowledge remains closed.
- Office, law/courts, claims/control, providers/links, broad research systems, manuscript, magic, save/account, and runtime retain their current gates.
- No content, schema, validator, test, package script, config, dependency, runtime, UI, save/account, or gameplay change is implied.
- No generated/vendor artifact may be refreshed or edited.
- Focused tests and normal content lint remain the accepted confidence path for this roadmap run.
- Remain in `v0.5.x`; no runtime-readiness decision approves `0.6.0`.

## 7. Alternatives Considered

| Option | Decision | Reason |
| --- | --- | --- |
| Reopen diplomacy/conflict or another zero-id lane | Rejected | No qualifying new canon, authorized authorship, or consumer exists. |
| Claims/borders/control evidence audit | Deferred | The previous selection requires stronger evidence or a named consumer; neither changed. |
| Expand service, resource/commodity, or combat health | Rejected | Stable registered seeds are paused and no named need exists. |
| Manuscript source-retention planning | Deferred | Important but larger and still maturity/research-gated. |
| Runtime/save/account readiness | Rejected | High-risk ownership and persistence prerequisites remain incomplete. |
| Deep Research | Rejected now | The selected work is repository-local command/source mapping. |
| Validation cleanup or support suffix | Rejected | There is no concrete failing defect and cleanup is not authorized. |
| Validation Source Map | Selected | Bounded, locally evidenced, stabilization-aligned, and non-mutating outside docs. |

## 8. User Question, Research, Support, And Temporary Docs

No explicit user question is required. The source map can classify current repository evidence without product or canon decisions.

Deep Research is not required. External validation practices are not needed to map the repository's current commands and owners.

No support suffix is needed because required focused validation is green and no defect is being repaired.

No temporary artifact is needed. The existing connector prep remains a planning source; the next run should create one permanent design source map and decide whether the older prep remains useful, is superseded, or needs a later cleanup decision. It must not delete that prep unless deletion is explicitly allowed by the next prompt.

## 9. Explicit Non-Goals

- no validation implementation, cleanup, consolidation, renaming, script addition, dependency change, config change, or formatting sweep;
- no broad typecheck fixes, UI refactor, generated-output refresh, network/certificate change, or Git configuration change;
- no content, schema, validator, test, normal-lint registration, contract, runtime, UI, save/account, migration, or gameplay change;
- no canon, candidate ids, gated-lane reopening, Deep Research, temporary artifact, support suffix, or `0.6.0` transition.

## 10. Selection Answers

1. All zero-id authority lanes remain gated.
2. Service, resource/commodity, and combat health remain paused.
3. Generic POI remains rejected and Highcrown Knowledge remains closed.
4. Office, law/courts, claims/control, links/state, research systems, manuscript, magic, save/account, and runtime remain gated.
5. Claims/borders/control is not reopened because stronger evidence or a named consumer is absent.
6. No concrete validation defect justifies a support suffix or cleanup run.
7. A repository-local Validation Source Map is the smallest eligible stabilization route.
8. The next run is descriptive and docs-only; it may recommend but not implement later validation work.
9. No explicit user question, Deep Research, support suffix, or temporary artifact is required.
10. Remain in `v0.5.x`.
11. Select `Version 0.5.353 - Validation Source Map`.

## 11. Next Recommended Version

Version 0.5.353 - Validation Source Map
