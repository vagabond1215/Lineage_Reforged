# Diplomacy Conflict Authority Evidence Deferral

Source version/run: Version 0.5.351 - Diplomacy Conflict Authority Evidence Deferral
Date: 2026-07-12
Status: approved documentation-only deferral; separate future owners; zero ids; authored-input/ready-consumer gates fixed

## 1. Deferral Decision

Pause diplomatic-relation and conflict-identity/history schema planning, seed planning, content, registration, references, migrations, consumers, and runtime integration until a materially new authored input or a ready consumer proves the relevant minimum static contract.

Preserve separate owners and carry forward exactly zero diplomatic-relation ids and zero `conflict.*` ids. No collection path or diplomatic-relation prefix is approved. The `0.5.349` evidence audit and `0.5.350` boundary decision are complete and must not be repeated against unchanged sources.

Select `Version 0.5.352 - Roadmap Post-Diplomacy-Conflict Deferral Selection` next.

## 2. Preserved Boundaries

- Diplomatic relation owns an explicitly authored relationship posture among canonical actors during a supported effective period.
- Conflict identity/history owns one distinguishable authored conflict plus supported participant and historical posture.
- A generic political-state umbrella and a combined diplomacy/conflict schema remain rejected.
- Actor or participant references, direction or roles, cardinality, and effective temporal semantics are intrinsic. Reference-free contracts remain incoherent.
- Claims, borders, territory, control, and occupation remain separate owners.
- Polity, government, jurisdiction, law, court, force, faction, institution, place/map, route security, quest/event/Chronicle/Knowledge, reputation, combat, runtime, UI, and save/account owners remain unchanged.
- No relation, conflict, claim, treaty, alliance, rivalry, recognition, peace, war, or current state may be inferred from another owner.

## 3. Exact Reopening Inputs

Planning for either owner may reopen only when at least one materially new qualifying input exists:

1. **Explicit user-authored or approved canon**: an exact diplomatic-relation and/or conflict list that supplies the complete facts required below.
2. **New canonical repository source**: a durable source intentionally defining one or more relations or conflicts with their required actor/participant and temporal facts.
3. **Authorized political-content authorship pass**: the user intentionally prioritizes this canon and authorizes focused authorship before schema or JSON implementation.
4. **Concrete ready consumer**: a named consumer with stable target owners proves why one minimal static relation or conflict contract is required, which semantics it reads, and how validation must fail closed.

A reopening prompt must name the new input, identify diplomacy, conflict, or both, distinguish schema readiness from seed readiness, and map the evidence to the appropriate gate. A ready consumer may reopen schema review only; it cannot mint actors, relations, conflicts, participants, dates, or historical facts and cannot approve a seed. An approved exact list that lacks mandatory facts reopens focused authorship or gate review, not implementation.

## 4. Inputs That Do Not Reopen The Gate

The following remain insufficient alone or in combination:

- unchanged world-map conflict-zone names, summaries, geometry, region lists, or validation fixtures;
- polity identities, place/region/settlement prose, routes, adjacency, quest text, event presentation, or Chronicle/Knowledge vocabulary;
- UI, creator, backstory, demo, or design-example language about diplomacy, warfare, allies, rivals, envoys, kingdoms, or conflict;
- combat allies/enemies, encounter or spawn hostility, tactics, parties, units, reputation `wartime`, or mutable standing;
- schemas, validators, tests, forbidden-field lists, consumer stubs, runtime labels, or hypothetical examples that merely expect an id;
- external research, historical taxonomy, genre convention, plausible fantasy politics, fact recombination, or generated/normalized ids;
- another broad scan of unchanged repository sources.

Consumer demand cannot mint canon. Moving, copying, or rephrasing audited evidence is not materially new evidence.

## 5. Minimum Diplomatic-Relation Readiness

A docs-only diplomatic schema plan may be reconsidered only when the new input proves all of these contract questions without guessing:

1. exact canonical actor types and resolvable actor references;
2. direction, symmetry, inverse, pair-ordering, and duplicate behavior;
3. supported cardinality and multi-party posture, if any;
4. controlled relation-kind semantics without importing treaties, claims, reputation, access, or runtime behavior;
5. visibility or knowledge posture and its owner boundary;
6. record lifecycle independent of effective relation validity;
7. start, end, open-ended, overlap, contradiction, and uncertainty rules for effective validity;
8. provenance, non-implication rules, stable dependency owners, and fail-closed validation.

Every future seed must provide an exact record identity if the approved contract requires one, canonical actors, relation kind, direction/symmetry and cardinality facts, visibility, lifecycle, effective validity, provenance, and explicit non-implication. A reviewer must be able to draft the complete record without plausible inference. If any item is unresolved, both schema planning and seed implementation remain closed.

## 6. Minimum Conflict-Identity/History Readiness

A docs-only conflict schema plan may be reconsidered only when the new input proves all of these contract questions without guessing:

1. an exact identity threshold distinguishing one conflict from a map label, broad era, danger zone, raid pattern, encounter, or runtime hostility;
2. canonical participant target types and resolvable participant references;
3. controlled participant-role semantics, cardinality, sides/coalitions posture, and duplicate behavior;
4. controlled conflict-kind semantics;
5. supported start, end, open-ended, uncertain-date, phase/history, and outcome posture;
6. record lifecycle independent of historical or current conflict state;
7. durable provenance and explicit uncertainty representation;
8. non-implication of claims, borders, territory, control, occupation, alliances, hostility, armies, battles, consequences, or current war state;
9. stable dependency owners and fail-closed validation.

Every future seed must provide exact canonical identity, participants and roles, conflict kind, temporal/history posture, lifecycle, provenance, uncertainty, and non-implication. A reviewer must be able to draft the complete record without importing facts from map, place, combat, claim/control, or runtime owners. If any item is unresolved, both schema planning and seed implementation remain closed.

## 7. Separate Future Gates

- **Readiness gate**: evaluate only the named materially new input; do not rescan unrelated surfaces.
- **Schema-plan gate**: decide collection paths, prefix/id posture, wrappers, fields, vocabularies, references, cardinality, temporal semantics, provenance, forbidden fields, dependencies, and focused tests. It may still approve no schema.
- **Schema/validator gate**: a later narrow implementation may add only an approved schema, pure validator, focused in-memory tests, and schema parse coverage.
- **Seed-plan gate**: after the relevant schema foundation exists, approve exact records using the complete seed gate; zero records remains valid.
- **Content gate**: only a later explicitly selected run may create live content; do not create empty wrappers.
- **Registration gate**: normal content-lint registration remains separate until live content exists and passes focused validation.
- **Reference gate**: actor, participant, temporal, and any later cross-owner references require approved semantics, stable targets, cardinality, lifecycle/validity posture, and fail-closed dependency validation.
- **Migration gate**: no migration, alias, retired-id, compatibility, or historical-id behavior is implied.
- **Consumer gate**: each consumer requires a later owner-specific integration decision; static identity enables none automatically.
- **Runtime gate**: current relations, negotiations, hostility, alliances, war state, fronts, forces, battles, occupation/control, AI, commands, events, rewards, consequences, visibility, and player political state remain maturity-gated runtime/save concerns.

## 8. Owner And Non-Inference Rules

- Actor identity does not create a diplomatic relation or conflict.
- A map conflict zone remains a display/reference summary and cannot create conflict identity, participants, claims, borders, or control.
- A conflict does not automatically create rivalry, war, non-recognition, peace, truce, alliance, claims, control, or occupation records.
- A diplomatic relation does not create treaty execution, conflict participation, trade/access rights, reputation, military cooperation, or current behavior.
- Conflict end or ceasefire does not establish peace, recognition, normalized relations, or alliance.
- References never transfer ownership, and missing authority fails closed.
- Do not normalize existing polity, map, place, quest, event, combat, reputation, UI, or runtime strings into new ids.

## 9. User Question, Research, Support, And Temporary Docs

Do not ask the user for broad political worldbuilding now. Ask only when roadmap selection intentionally prioritizes diplomacy/conflict canon, a concrete ready consumer requires one of these static owners, or the user independently chooses to author them. Request the exact facts required by the applicable readiness gate.

Deep Research is not required and cannot establish project canon. No support-suffix run is needed; the audit, boundary decision, and deferral are decision-complete. No temporary diplomacy/conflict artifact exists or should be created from unchanged evidence. Keep the audit as the permanent evidence classification and the boundary decision as the permanent owner boundary.

## 10. Roadmap Posture

Diplomacy/conflict joins force/public order, government/jurisdiction, business, faction, institution, and People/NPC as a gated lane. Service, resource/commodity, and combat health remain paused. Generic `world.pois` remains rejected. Highcrown settlement Knowledge remains closed. Office remains not schema-ready. Living Character Manuscript implementation and runtime ownership transition remain maturity-gated.

The next run must compare remaining eligible docs-first routes without reopening gated, paused, rejected, closed, research-gated, or maturity-gated work by default.

## 11. Explicit Non-Goals

- no candidates, ids, collection/prefix contracts, schema plans, schemas, content, validators, tests, registration, references, migrations, adapters, consumers, or compatibility behavior;
- no invented actors, pairs, relations, conflicts, participants, roles, kinds, dates, causes, phases, outcomes, claims, borders, treaties, alliances, rivalries, recognition, peace, war, or canon;
- no political, combat, runtime, UI, save/account, event, command, reward, consequence, or gameplay work;
- no changed owner, repeated audit, broad user question, Deep Research, temporary artifact, support suffix, gated-lane reopening, or `0.6.0` transition.

## 12. Deferral Answers

1. Diplomacy and conflict remain separate future owners.
2. Exactly zero diplomatic-relation ids and zero `conflict.*` ids carry forward.
3. The audit and boundary decision are complete; unchanged-source rescans are prohibited.
4. Reopening requires materially new approved canon, a new canonical source, authorized political authorship, or a ready consumer proving the applicable minimum contract.
5. A ready consumer may reopen schema review only and cannot mint canon or authorize seeds.
6. Diplomacy requires complete actor/reference, direction/symmetry, cardinality, relation-kind, visibility, lifecycle, effective-validity, provenance, and non-implication evidence.
7. Conflict requires complete identity, participant/role, kind, temporal-history, lifecycle, provenance, uncertainty, and non-implication evidence.
8. Map zones, polity ids, prose, presentation, combat/reputation/runtime vocabulary, guardrails, examples, research, and fact recombination do not qualify.
9. Readiness, schema plan, schema/validator, seed plan, content, registration, references, migrations, consumers, and runtime remain separate gates.
10. Claims/borders/territory/control/occupation and all adjacent owners remain separate.
11. Ask the user only when political canon is intentionally prioritized or a ready consumer requires it, not now.
12. Deep Research and a support suffix are not required; no temporary artifact should be created.
13. Select `Version 0.5.352 - Roadmap Post-Diplomacy-Conflict Deferral Selection`.

## 13. Next Recommended Version

Version 0.5.352 - Roadmap Post-Diplomacy-Conflict Deferral Selection
