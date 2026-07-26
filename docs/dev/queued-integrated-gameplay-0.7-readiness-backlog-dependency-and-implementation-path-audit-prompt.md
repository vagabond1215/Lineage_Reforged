# Queued Codex Prompt

## Run Identity

`Integrated Gameplay 0.7 Readiness, Backlog Dependency, And Implementation Path Audit`

Run classification: unversioned documentation-only repository audit.

Parent version: none.

Milestone impact: `supports_current_band`.

Parallel branch:

`prep/integrated-gameplay-0-7-readiness-audit`

Base commit:

`895c02df40332c813a8403bd489af6184111ccba`

Suggested commit:

`docs(audit): map integrated gameplay readiness`

## Purpose

Produce a repository-grounded readiness and dependency audit that answers:

1. how close the project is to the accepted `0.7.0 - Integrated Gameplay Systems` gate;
2. which backlog lanes are ready for audit, authority decisions, research, schemas/helpers, static content, runtime implementation, or continued deferral;
3. which candidate cross-system loop is the strongest first implementation path toward `0.7.0`;
4. how likely future packages should be classified as unversioned work, three-segment `0.6.x` primaries, support suffixes, or a later `0.7.0` band-entry candidate;
5. which external research passes can safely begin, which must wait for owner contracts, and which cannot compensate for missing authored canon;
6. which content families may be considered after `0.6.7` and which must remain gated.

This pass prepares future routing only. It does not activate, implement, version, or merge any recommended path.

## Parallel-Safety Contract

This prompt is intentionally queued on a dedicated branch while the primary branch runs:

1. `Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`;
2. restored exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`;
3. reserved `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`.

The audit must not interfere with that work.

Mandatory rules:

- remain on `prep/integrated-gameplay-0-7-readiness-audit`;
- do not merge, rebase, cherry-pick, or update `master`;
- fetch remote state only for comparison;
- record the branch head and current `origin/master` head separately;
- if `origin/master` has advanced, continue as a snapshot audit and mark every potentially affected conclusion `integration_refresh_required`;
- do not modify current prompt, output, handoff, roadmap, sequenced plan, route register, continuity brief, backlog, active content, tests, runtime, schemas, validators, dependencies, saves, migrations, UI, assets, or generated files;
- create exactly one audit artifact;
- do not open or merge a pull request as part of this run.

## Exact Authorized Output

Create exactly:

`docs/design/integrated-gameplay-0.7-readiness-backlog-dependency-and-implementation-path-audit.md`

Do not modify any existing file.

## Required Sources

Read at minimum:

### Repository and workflow authority

- `AGENTS.md`
- `README.md`
- `docs/design/internal-versioning-and-release-milestone-policy.md`
- `docs/design/current-planning-anchor-reconciliation.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`

### Current milestone and queued-route authority

- `docs/design/static-content-expansion-program.md`
- `docs/design/static-content-restoration-and-mortality-research-sequencing-decision.md`
- `docs/dev/queued-activity-resolution-existing-system-reuse-audit-prompt.md`
- `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md`

### Cross-cutting design authority

- `docs/design/future-system-design-ledger.md`
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md`
- `docs/design/runtime-ownership-transition-readiness-consolidation.md`
- `docs/design/player-travel-boundary-clarification.md`
- `docs/design/ui-information-architecture-boundary.md`
- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`
- `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`
- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`

### Campaign, persistence, consequence, and narrative authority

- `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`
- `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md`
- `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`
- `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`
- `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md`
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`
- `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`
- `docs/design/elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md`

### Representative static and future-owner decisions

Inspect relevant permanent decisions and live contracts for:

- inventory, equipment, containers, ownership, loot, rewards, and item instances;
- activities, trials, attempts, results, effects, skills, and Knowledge;
- travel, hazards, routes, rest, exposure, and recognition;
- combat, defeat, health, injury, care, body, and restoration;
- quests, completion, rewards, Chronicle, reputation, and standing;
- crafting, production, workplaces, resources, commodities, services, and economy;
- people, NPCs, households, families, kinship, schedules, factions, institutions, polities, law, and civic systems;
- estate, succession, Legacy, Chronicle, Bloodlines, Family Prestige, and inheritance;
- magic study, spell acquisition, casting readiness, spell hooks, and elemental response;
- homestead, construction, property, settlement growth, workers, and logistics.

Do not assume a document path from memory. Search the repository and cite the exact controlling path used.

## Live Repository Inspection

Inspect implementation and tests, not only documentation. At minimum trace:

- character/session entry and current start-state flow;
- save creation, load, overwrite, slot addressing, snapshot serialization, account history, archival, and recovery;
- engine-owned travel, quest acceptance, quest tracking, and activity selection;
- activity advancement and preview seams;
- rest preview/execution seams;
- quest completion/turn-in and reward seams;
- current player resources, body state, attributes, active effects, inventory/equipment, currency, Knowledge, skills, quests, Chronicle, party, and world/session state;
- combat resolution, defeat, HP-zero handling, encounter cleanup, history, and UI lifecycle interpretation;
- item, recipe, monster-drop, quest-reward, service, economy, and storage representations;
- current command, result, event, occurrence, revision, stale-protection, synchronization, and accepted-only UI patterns;
- representative UI adapters and any remaining UI-authored mutations relevant to candidate loops;
- focused tests that prove or fail to prove each capability.

Use search and read-only scripts where helpful. Do not alter files to make an audit easier.

## Required Audit Method

### 1. Reproduce the current maturity baseline

Record:

- audit branch head;
- `origin/master` head;
- divergence between them;
- active primary/support route visible at branch base;
- latest completed primary and controlling contracts;
- current static milestone posture;
- whether any inspected source changed on `origin/master` after the branch base.

Do not claim newer remote work is accepted on this branch. Classify it only as drift requiring integration refresh.

### 2. Evaluate every `0.7.0` criterion individually

Use the exact criteria in `docs/design/internal-versioning-and-release-milestone-policy.md`.

For each criterion provide:

- status: `met`, `partial`, `missing`, `blocked`, or `integration_refresh_required`;
- authoritative evidence;
- live implementation evidence;
- test evidence;
- missing owner or contract;
- smallest credible package or package sequence that could close the gap;
- dependencies and disallowed shortcuts.

The audit must explicitly decide whether `0.7.0` is currently `not_ready`, `blocked`, or a plausible future `band_entry_candidate`. It may not mark `0.7.0` accepted.

### 3. Build a backlog dependency graph

Classify every material lane into one current readiness state:

- `ready_for_repository_audit`;
- `ready_for_authority_decision`;
- `ready_for_bounded_external_research`;
- `ready_for_schema_or_pure_helper`;
- `ready_for_static_seed_plan`;
- `ready_for_static_content_after_gate`;
- `ready_for_runtime_package`;
- `blocked_by_authored_canon`;
- `blocked_by_owner_dependency`;
- `deferred_by_current_sequence`;
- `closed_or_rejected`.

At minimum include:

1. activity advancement and result/effect ownership;
2. survival needs, exposure, rest, health, Mortal Crisis, injury, care, and restoration;
3. inventory, containers, storage, item instances, ownership, reservations, logistics, durability, and stolen state;
4. gathering, harvesting, crafting execution, production, resources, commodities, services, and dynamic economy;
5. combat consequences, loot execution, encounters, spawns, populations, migration, and runtime ecology;
6. quest completion, contracts, work orders, rewards, standing, reputation, and Chronicle consequences;
7. travel, routes, hazards, recognition, maps, exploration, camping, and discovery;
8. people, NPCs, households, families, kinship, schedules, jobs, companions, factions, institutions, polities, law, and government;
9. estate, succession, inheritance, Legacy, Chronicle, Bloodlines, and Family Prestige;
10. magic study, acquisition, casting, enchanting, magical documents, and elemental responses;
11. homestead, construction, property, settlement growth, workers, maintenance, and builder logistics;
12. narrative realization, event retention, observer projection, and living-character presentation;
13. UI, accessibility, diagnostics, persistence, migration, packaging, and testing foundations relevant to later maturity bands.

For each lane identify:

- current owner;
- completed foundation;
- exact missing layer;
- immediate prerequisite;
- research need;
- authored-input need;
- content readiness;
- implementation readiness;
- milestone contribution;
- likely coupling risks.

### 4. Compare candidate first integrated loops

Evaluate at least these candidates:

1. activity attempt/result -> typed effects -> body/resource/skill/Knowledge consequences;
2. travel -> exposure/resource consequence -> rest/recovery;
3. combat -> defeat/injury/care/recovery;
4. gathering -> inventory ownership -> crafting result;
5. quest completion/turn-in -> inventory/economy/reputation/Chronicle consequence.

Use one consistent qualitative scoring matrix with at least:

- authority readiness;
- live implementation reuse;
- persistence readiness;
- content readiness;
- UI readiness;
- test readiness;
- cross-system value;
- blocker count;
- exploit/idempotency risk;
- save/Stakes/occurrence compatibility;
- ability to remain a bounded slice;
- contribution to the exact `0.7.0` gate.

Choose:

- one recommended first integrated-loop path;
- one fallback path;
- explicit reasons the other candidates should wait.

Do not implement the choice and do not assign it an exact future patch number.

### 5. Produce an implementation package runway

Create a dependency-ordered sequence of candidate packages from the current post-`0.6.7` bridge through a possible future `0.7.0` readiness audit.

For each candidate package provide:

- stable descriptive name;
- package class: `unversioned`, `three_segment_primary_candidate`, `support_suffix_candidate`, or `band_entry_candidate`;
- milestone impact: `none`, `supports_current_band`, `advances_current_band`, or `band_entry_candidate`;
- owner and scope;
- required inputs;
- authorized output category;
- tests/evidence needed;
- completion gate;
- what remains explicitly out of scope.

Do not allocate exact `0.6.8`, `0.6.9`, or later numbers. Patch labels are assigned only when a package becomes active against fresh repository state.

Preserve the currently accepted immediate order:

1. `0.6.6.1` support repair;
2. exact `0.6.6`;
3. `0.6.7`;
4. Geography/recognition plan;
5. Activity Resolution reuse audit;
6. Mortal Crisis receipt contract;
7. bounded lethal-process/stabilization research when authorized.

Recommendations from this audit begin after, or are explicitly parallel-preparatory to, those gates. They may not displace them.

### 6. Build a research disposition matrix

Separate:

- repository-only audits safe now;
- external research that can safely begin now because its questions are owner-independent;
- external research that must wait for a contract to define the questions;
- research that must wait for accepted static content or `0.6.7`;
- topics blocked by authored setting canon rather than external evidence;
- topics already sufficiently researched and not needing another broad pass.

For each proposed research pass state:

- exact research question;
- intended consumer;
- why current evidence is insufficient;
- earliest safe trigger;
- artifact retention/removal rule;
- forbidden conclusions or implementation claims.

Do not perform external research during this audit.

### 7. Build a content-readiness matrix

Evaluate at minimum:

- weapon and armor profiles;
- hazards and route-security profiles;
- resources and commodities;
- services;
- polities and civic identities;
- people/NPCs and institutions;
- magic-study sources and magical documents;
- combat-health/lethal-process/care vocabularies;
- general loot tables and container templates;
- additional monsters/fauna/ecology after `0.6.7`;
- Knowledge/recognition content;
- settlements, districts, sites, maps, and generic POIs;
- recipes, alchemy, enchanting, repair, and salvage;
- family, household, kinship, estate, and succession content.

For each family classify:

- `consider_after_0.6.7`;
- `needs_repository_audit`;
- `needs_authority_decision`;
- `needs_external_research`;
- `needs_authored_canon`;
- `needs_runtime_owner_first`;
- `remain_deferred`;
- `closed_or_rejected`.

Static content must not be treated as proof that runtime behavior, availability, ownership, discovery, rewards, or simulation exists.

### 8. Map later maturity bands without inflating versions

Provide a concise readiness map for:

- remaining `0.6.x` ownership/integration work;
- `0.7.0 - Integrated Gameplay Systems`;
- `0.8.0 - Pre-Alpha Vertical Slice`;
- `0.9.0 - Alpha Readiness`;
- `1.0.0 - Accepted Release`.

For each band identify:

- required capabilities;
- strongest current foundations;
- major missing pillars;
- evidence that must exist before a readiness audit;
- work that does not independently justify entry.

Do not invent release dates, effort estimates, marketing commitments, or exact future patch counts.

### 9. Identify stale, duplicate, broken, and orphaned planning signals

Report, but do not edit:

- stale live-current headers;
- conflicting route order;
- obsolete queued prompts;
- dead temporary artifacts;
- temporary evidence with no named consumer;
- accepted decisions missing from route or source maps;
- backlog entries whose blockers are already resolved;
- backlog entries that imply permission broader than current authority;
- future lanes duplicated under multiple names;
- file references that do not resolve;
- implementation claims contradicted by live code or tests.

Distinguish historical chronology from genuinely misleading live pointers.

## Required Output Structure

The single audit artifact must contain:

1. **Run And Snapshot Identity**
2. **Executive Verdict**
3. **Current Capability Inventory**
4. **`0.7.0` Criterion Matrix**
5. **Backlog Dependency Graph**
6. **Candidate Integrated-Loop Comparison**
7. **Recommended First Loop And Fallback**
8. **Candidate Implementation Package Runway**
9. **Research Disposition Matrix**
10. **Content-Readiness Matrix**
11. **Authored-Canon Blockers**
12. **Persistence, UI, Testing, And Operational Gaps**
13. **Later Maturity-Band Map**
14. **Stale, Broken, Duplicate, Or Orphaned Signals**
15. **Integration Refresh Checklist**
16. **Mandatory Conclusions**
17. **Sources Inspected**

Use tables where they improve comparison, but retain enough prose to explain dependencies and authority boundaries.

## Mandatory Conclusions

The audit must explicitly accept or reject each statement with evidence:

1. `0.7.0` is not currently accepted merely because the static milestone or several command transitions exist.
2. The project must remain in `0.6.x` until a separate readiness audit proves every `0.7.0` entry criterion.
3. Static content, schemas, pure helpers, read-only projections, and selection-only commands do not independently satisfy integrated gameplay.
4. The immediate `0.6.6.1 -> 0.6.6 -> 0.6.7 -> Geography -> Activity reuse -> Mortal Crisis receipt` sequence remains controlling.
5. A first integrated loop must cross at least two authoritative systems and include persistence, failure behavior, accepted-only UI application, and representative tests.
6. Generic command buses, generic effect systems, generic RNG streams, generic inventory menus, and generic simulation layers must not be prebuilt without representative owner evidence.
7. Inventory/item ownership is a major enabling dependency, but the audit must determine whether it belongs before, inside, or after the recommended first integrated loop.
8. Combat-to-injury integration cannot bypass the accepted Mortal Crisis and receipt sequence.
9. Dynamic ecology, spawning, and loot execution cannot be inferred from static monster/ecology/drop content.
10. NPC, institution, faction, civic, and family content cannot be synthesized from role labels, quest strings, generated operators, or prose when authored canon is absent.
11. External research cannot replace missing authority or authored setting facts.
12. Research artifacts need named consumers and disposition rules.
13. Future package classes may be recommended, but exact `0.6.x` patch numbers must remain unassigned until activation.
14. Support suffixes belong to one parent primary and do not consume a new primary label.
15. `0.8.0`, `0.9.0`, and `1.0.0` remain evidence-gated milestones, not aspirational schedule labels.
16. Snapshot conclusions must be refreshed against `master` before they alter live routing.

## Prohibited Scope

Do not:

- modify any existing file;
- update the active prompt, handoff, output, route register, roadmap, sequenced plan, continuity brief, backlog, or static program;
- author content;
- implement commands, events, effects, inventory, crafting, combat, health, survival, quests, economy, NPCs, construction, magic, narrative, saves, migrations, UI, or tests;
- change schemas, validators, dependencies, package manifests, lockfiles, assets, generated files, or configuration;
- normalize BOM-bearing files or perform unrelated cleanup;
- assign exact future `0.6.x` patch numbers;
- claim `0.7.0`, `0.8.0`, `0.9.0`, or `1.0.0` readiness;
- perform external web research;
- create speculative canonical people, institutions, factions, polities, maps, resources, services, injuries, treatments, spells, items, monsters, quests, or settlements;
- treat a design document as runtime authority;
- merge or rebase the parallel branch;
- edit files merely because wording is old when they are historical chronology rather than live routing.

## Validation

Before committing:

1. confirm exactly one new file exists;
2. confirm every existing tracked file is byte-unchanged;
3. confirm the output names the branch base and fetched `origin/master` head;
4. confirm every material recommendation cites repository evidence;
5. confirm unresolved or drift-sensitive conclusions are marked honestly;
6. confirm no exact future patch number was allocated;
7. confirm the current active route was not displaced;
8. run conflict-marker and trailing-whitespace searches;
9. run `git diff --check`;
10. review the complete diff.

Do not run package installation, generators, servers, builds, typechecks, or the full test suite. Existing focused tests may be run read-only only when needed to verify a claimed live capability; record the command and result without attempting repairs.

## Completion And Integration Posture

After the audit is complete:

- commit only the single audit artifact on the parallel branch;
- do not update current coordination documents;
- do not merge automatically;
- report the branch, commit, artifact path, base commit, compared `origin/master` head, drift findings, recommended first loop, fallback loop, and refresh conditions;
- require a fresh connector-side inspection after the active static sequence before any recommendation is promoted into the live route.
