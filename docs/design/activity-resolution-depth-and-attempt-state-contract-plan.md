# Activity Resolution Depth And Attempt-State Contract Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-07-19
Status: durable planning authority; documentation only; no implementation permission

## 1. Purpose

Define the durable cross-domain structure for selecting how deeply an action is resolved and for separating static action definitions from mutable attempts.

This plan consolidates the accepted design intent previously held in `docs/dev/tmp-contextual-action-resolution-depth-framework-2026-07-16.md` after reinspection of the post-Gate-7 and accepted cross-domain integration repository state.

It applies conceptually to:

- gathering and extraction;
- crafting, processing, manufacturing, repair, and salvage;
- Skill Trials and deliberate training;
- Knowledge study, research, and trials;
- magic study and bounded magic-assisted work;
- workplace and team activity;
- survival, travel, logistics, services, leadership, and administration;
- authored quest and contract action trees.

It does not authorize content, schema, validator, helper, runtime, UI, save, economy, inventory, crafting execution, gathering execution, trial execution, Knowledge mutation, magic execution, or gameplay changes.

## 2. Current Route And Scope Protection

The accepted cross-domain production research integration is complete. Revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` remains the exact active Codex route, followed by `0.6.6`, `0.6.7`, and the docs-first Geographic Knowledge Taxonomy And Location Recognition Contract Plan.

This activity-resolution plan does not enter ahead of that sequence and does not modify `docs/dev/current-codex-prompt.md`.

The first future consumer is a documentation-only `Activity Resolution Existing-System Reuse Audit` after the current static-content and geography sequence is accepted. Its held prompt is stored at:

- `docs/dev/queued-activity-resolution-existing-system-reuse-audit-prompt.md`

That queued file is not active authority.

## 3. User Intent

The system should avoid two extremes:

1. every action becoming a flat RNG pass/fail check; and
2. every action becoming a mandatory minigame.

The intended rule is:

> Automatic resolution handles inconsequential variation. Player decisions govern material tradeoffs. Trials appear when uncertainty, consequence, and agency intersect.

A choice is not meaningful merely because it is clickable. Each offered approach must create a credible tradeoff in one or more owned dimensions such as time, quantity, condition, quality, safety, material loss, tool wear, site preservation, visibility, reputation, charge, or future access.

Generic internal profiles such as `fast`, `balanced`, or `careful` are insufficient player-facing choices unless the surrounding systems make their differences material.

## 4. Live Repository Findings

### 4.1 Skill progression and legacy trials

The live skill system preserves:

- maximum rank 125;
- progression bands `clumsy`, `familiar`, `proficient`, `skilled`, and `mastery`;
- breakthrough gates at 30, 55, 80, and 100;
- current band unlock and mastery-trial relationships.

The live trial catalog contains four early/simple trial records:

- sword mastery;
- blacksmithing mastery;
- elemental magic mastery;
- Flora Knowledge mastery.

Each record currently owns a threshold, progress, maximum potential, Echo requirement, simple checkpoint thresholds, rewards, and penalties. The schema does not own authored branches, choices, result bands, recovery, cooldowns, participant roles, or attempt state.

The live progression helper accumulates success progress, reduces maximum potential after failure pressure, passes when progress reaches the trial threshold, and terminally fails when remaining potential falls below the threshold. This is a valid legacy `state_accumulator` model, but it is not a general checkpoint graph.

### 4.2 Knowledge trial foundation

Knowledge already has stronger phase separation than the legacy Skill Trial path:

```text
completion candidate
-> eligibility candidate
-> readiness candidate
-> authorized attempt
-> checkpoint resolution
-> outcome
-> cooldown and reward application
```

The repository contains:

- strict Knowledge trial eligibility-policy authority;
- one active Flora Tier 1 eligibility policy;
- a strict Knowledge trial readiness-policy schema;
- pure eligibility and readiness evaluation helpers and focused tests;
- explicit inert safety flags prohibiting attempt creation, checkpoint resolution, outcome resolution, cooldown mutation, reward grants, runtime effects, events, ownership mutation, and gameplay mutation.

The live Flora eligibility policy still has `readinessPolicyId: null`. No authored readiness-policy content wrapper, content-to-helper adapter, attempt owner, checkpoint owner, outcome owner, cooldown owner, reward owner, storage owner, or runtime owner is active.

The roadmap subsection that still labels `0.5.161 - Knowledge Trial Readiness Policy Schema` as `next` is stale relative to the live schema. Future route maintenance must distinguish the already-landed schema/helper foundation from the still-missing authored policy content, adapter, and mutable attempt authority.

### 4.3 Quest action trees

Quest archetypes and definitions currently contain the repository's richest authored branch grammar. Action nodes may use:

- phases;
- time estimates;
- role assignments and participant bounds;
- attribute, skill, ability, spell, tool, item, equipment-tag, party-size, and RNG checks;
- `criticalSuccess`, `success`, `partial`, `failure`, and `criticalFailure` branches;
- advancement, completion, failure, and authored effects.

This is the strongest candidate source for shared node and outcome vocabulary. It must not be copied directly into another system without an audit because current fields and effects are quest-owned, definitions may be more permissive than future reusable contracts, and no generic shared resolver is established.

### 4.4 Crafting and production

The accepted cross-domain synthesis establishes:

- recipes own complete explicit bounded static transformations;
- production chains own broad macro/economic context;
- `relatedProductionChainId` is descriptive and non-inheriting;
- workplaces own static capability/profile context, not instantiated facility state;
- job rows provide local role vocabulary, not selected worker runtime;
- no player crafting work-order owner exists.

A future crafting process must remain separate from recipe content and from the civilization macro resolver.

### 4.5 Gathering and extraction

The repository contains resource skills, extraction-method vocabulary, flora, fauna, minerals, workplaces, production-chain extraction steps, and world source context, but no player-owned gathering command or mutable extraction attempt owner.

No current authority consistently owns:

- target difficulty;
- minimum attempt competence;
- recommended competence;
- target or method familiarity;
- source depletion/regrowth mutation;
- gathered item creation;
- site disturbance;
- extraction hazards;
- automatic-resolution reliability.

These must be planned before a gathering runtime can safely consume the shared framework.

### 4.6 Activity selection and advancement

Player activity selection is engine-owned and accepted. Activity advancement remains deferred because current preview/execution behavior and quest-specific time, resource, skill, and discovery branches require reconciliation.

Selecting an activity must remain separate from:

- selecting resolution depth;
- authorizing an attempt;
- advancing a checkpoint;
- applying an outcome;
- granting progress or rewards.

Activity advancement is a likely future runtime integration point, but only after its own ownership and preview/execution audit.

### 4.7 Magic-assisted activity

Gate 7 and the accepted synthesis require every magic-assisted route to preserve:

- a concrete physical effect;
- finite vessel or charge state;
- affinity and compatibility;
- recharge;
- mundane housing and transmission;
- specialist labor and provider access;
- inspection, maintenance, failure, and security;
- scarcity and competing use;
- ordinary fallback.

Magic does not automatically lower action depth. It may add charge, mismatch, maintenance, access, and fallback decisions.

## 5. Core Phase Separation

Every future resolvable activity should preserve these conceptual phases:

1. **Eligibility** — whether the actor may attempt the action at all.
2. **Readiness** — whether required tools, station, material, access, time, body state, preparation, cooldown, and availability are present.
3. **Depth selection** — whether the attempt is automatic, condensed, decision-based, a short trial, an extended activity, or a project/operation.
4. **Attempt creation** — creation of one authorized mutable attempt with deterministic identity and initial state.
5. **Node or phase resolution** — checks, choices, resource pressure, metrics, recovery, and branch movement.
6. **Outcome proposal** — typed effect requests and terminal or continuing state.
7. **Owner application** — validation and mutation by inventory, progression, Knowledge, body, relationship, site, charge, economy, or other explicit owners.
8. **Learning and familiarity** — separately owned skill progress, Knowledge evidence, target familiarity, method familiarity, or mastery progress.
9. **Future compression** — whether comparable later attempts may use a shallower depth.

No phase transition is automatic merely because the preceding phase succeeded.

## 6. Resolution Depths

### Depth 0 — Deterministic automatic action

Use when:

- the action is trivial for the actor;
- conditions are ordinary;
- consequences are negligible or fully controlled;
- the actor has demonstrated reliable competence;
- no meaningful objective conflict exists.

The action may still consume time and resources. Do not roll merely to create noise.

### Depth 1 — Skill-modified bounded resolution

Use when minor variation matters but no meaningful player decision exists.

Bounded deterministic or seeded variation may affect:

- quantity;
- condition;
- time;
- routine fatigue;
- minor wear;
- ordinary waste.

Depth 1 must not hide severe injury, permanent loss, catastrophic contamination, major narrative consequences, or irreversible site destruction.

### Depth 2 — One consequential decision

Use when one concrete tradeoff exists.

Each option should improve at least one valued dimension while worsening or risking another. The decision must be understandable in fiction and mechanically legible without requiring exact percentages.

### Depth 3 — Short trial

Use for a small connected sequence, usually one to three meaningful nodes, when:

- the actor is below recommended competence;
- the method or target is unfamiliar;
- a recoverable mistake exists;
- the environment is materially difficult;
- the objective adds quality, precision, safety, secrecy, or time pressure;
- a rare opportunity or hazard deserves interaction.

Depth 3 should normally support success, partial/soft failure, failure, and a bounded recovery route where justified.

### Depth 4 — Extended authored activity

Use for signature, mastery, experimental, rare-material, dangerous, story-critical, magical, team, or multi-phase work.

Depth 4 may preserve state across phases and allow several distinct endings. It must not become a repetitive optimal-button rotation.

### Depth 5 — Project, operation, or institutional resolution

Use when the meaningful player decisions concern:

- staffing and roles;
- scheduling;
- supply allocation;
- maintenance;
- route or site planning;
- security;
- multiple batches or linked activities;
- settlement, guild, expedition, caravan, military, research, or civic objectives.

Depth 5 is not a longer personal minigame. It is an operation-level graph with different metrics and owners.

## 7. Depth Selector Contract

The future depth selector should be pure, deterministic for identical inputs, and non-mutating.

### Candidate inputs

- action/profile identity;
- domain and owner;
- requested objective;
- minimum attempt competence;
- recommended competence;
- effective primary capability;
- supporting capability;
- target familiarity;
- method familiarity;
- recipe/procedure familiarity where applicable;
- demonstrated reliability;
- tool/station/facility condition;
- material/source condition;
- environment and hazard state;
- time pressure;
- rarity and replacement cost;
- recoverability;
- narrative or authored interaction requirement;
- participant and role structure;
- difficulty-mode modifiers;
- permitted depth range from authored content;
- compression eligibility;
- explicit force-expand conditions.

### Required output posture

The selector should return an inert envelope containing:

- selected depth;
- reasons;
- applied gates and modifiers;
- missing authority blockers;
- whether player interaction is required;
- whether severe consequences are permitted;
- whether an authored graph/profile is required;
- safety flags proving no attempt, RNG consumption, mutation, reward, event, or UI action occurred.

The selector must not create an attempt or decide the final outcome.

## 8. Competence, Difficulty, Familiarity, And Reliability

### Competence

Separate:

- **minimum attempt competence** — a genuine prerequisite where an action is impossible or unacceptably unsafe without baseline technique;
- **recommended competence** — the level at which the method is reasonably controlled;
- **effective capability** — current skill plus explicitly authorized support, equipment, preparation, body, environment, Knowledge, and role effects.

Most actions should use recommended competence and graded consequences rather than hard gates.

### Familiarity

General skill and familiarity are different authorities.

Future familiarity may need separate identities for:

- target/resource/species/material;
- source type or site type;
- method or technique;
- recipe or procedure;
- tool or instrument;
- workplace/station;
- service procedure;
- magical installation or vessel.

A provisional conceptual ladder is:

```text
unknown
observed
attempted
successfully completed
familiar
reliable
mastered
```

The future audit must decide which domains need persisted stages, counters, evidence, or derived reliability and which can use simpler policy.

### Compression

Compression or bypass should require demonstrated reliability under comparable conditions, not merely one success or a 50 percent chance.

Consider:

- prior successful completion;
- effective skill versus recommended competence;
- target and method familiarity;
- ordinary environment;
- adequate tools and station;
- ordinary objective;
- acceptable expected loss;
- no severe hazard;
- high predicted safe-success reliability;
- available fallback.

A compressed action expands again when conditions, stakes, tools, objective, hazard, material, participants, or environment materially change.

## 9. Analog Calculation And Authored Outcomes

The recommended rule is:

> Calculation may be analog. Branches are discrete. The overall activity may be non-binary.

A future check may produce a performance margin from capability, preparation, support, choices, environment, prior state, bounded seeded uncertainty, difficulty, and penalties.

That continuous margin should map to only the materially distinct authored results required by the action:

- `critical_success` only when a distinct exceptional state exists;
- `success`;
- `partial` or `soft_failure`;
- `failure`;
- `critical_failure` only when a distinct severe state exists and is legible before exposure.

Binary results remain appropriate for:

- hard prerequisites;
- determinant gates;
- simple recovery checks;
- yes/no physical states;
- access granted or denied.

The number of result bands must equal the number of materially different resulting states, not the numeric precision of the underlying score.

## 10. Shared And Domain-Owned Metrics

The framework may define shared metric vocabulary, but each domain owns which metrics apply and how they mutate.

### Physical and production candidates

- acquisition;
- completion;
- yield;
- condition;
- quality/workmanship;
- integrity;
- material efficiency;
- time;
- fatigue;
- safety;
- contamination;
- defects;
- tool/facility wear;
- site disturbance;
- depletion/regrowth;
- future availability.

### Cognitive candidates

- coverage;
- confidence;
- accuracy;
- misconception pressure;
- evidence quality;
- source integrity;
- retention;
- synthesis;
- time and fatigue.

### Social and institutional candidates

- trust;
- compliance;
- legitimacy;
- morale;
- reputation;
- privacy;
- service quality;
- throughput;
- conflict;
- debt/obligation;
- access/enforcement risk.

### Travel and operation candidates

- arrival time;
- cargo condition;
- route knowledge;
- fatigue;
- supplies;
- vehicle or animal condition;
- visibility;
- incident exposure;
- escort readiness;
- route/site impact.

Shared vocabulary must not create shared mutation authority.

## 11. Static Definition And Mutable Attempt Separation

### Future static profile

A future action or activity resolution profile may contain:

- stable id;
- owner/domain;
- primary and supporting skills;
- Knowledge relationships;
- minimum/recommended competence;
- prerequisites/readiness references;
- allowed depth range;
- automatic-resolution and compression policy;
- familiarity dimensions;
- metrics;
- node graph or phase grammar;
- checks and participant aggregation;
- choices;
- result bands;
- typed effect vocabulary;
- hazards and recovery routes;
- permitted contextual modifiers.

It must not own mutable inventory, item quality history, charge spending, injury state, reward state, cooldown state, current progress, or persistence.

### Future mutable attempt

A future attempt may contain:

- attempt id;
- owner, actor, participants, and roles;
- source profile/policy ids;
- deterministic seed or randomness evidence;
- selected depth;
- current phase and node;
- selected choices;
- metrics and accumulators;
- reserved/consumed resource candidates;
- tool, facility, vessel, and environment state;
- familiarity and prior-attempt evidence;
- soft-failure/recovery state;
- elapsed sequence/time;
- history;
- terminal status.

Attempt identity, replay, persistence, stale protection, preview/execution parity, and accepted-only application require a dedicated engine-owned contract.

## 12. Team And Role Resolution

A participant count must not imply one universal aggregation rule.

Future authored modes may include:

- `all_pass`;
- `any_pass`;
- `best_of`;
- `weighted_mean`;
- `sum_margin`;
- `leader_plus_support`;
- `weakest_link`;
- authored role sequence.

Role posture:

- primary roles normally own the main execution margin;
- support roles affect preparation, capacity, time, safety, or recovery;
- specialists reveal information, unlock methods, inspect state, or control determinant nodes;
- managers act at batch, schedule, staffing, maintenance, and priority level.

Support work deserves a separate decision only when it can materially alter the result.

## 13. Typed Effect Boundary

Branches should propose typed effects to explicit owners rather than directly mutating unrelated systems.

Candidate effect requests include:

- reserve or consume an item/material instance;
- create an output candidate;
- alter workpiece integrity or defect state;
- add contamination or hazard candidates;
- apply tool/facility wear candidates;
- change elapsed sequence/time;
- add body/injury candidates;
- alter source depletion/regrowth candidates;
- change familiarity or skill-progress candidates;
- add Knowledge evidence or misconception candidates;
- change relationship/reputation candidates;
- reserve or spend charge candidates;
- schedule cooldown, maintenance, or recovery candidates;
- advance, recover, complete, fail, or abort an activity.

The generic resolver must not validate or apply effects it does not own.

## 14. Domain Adapter Decisions

### Gathering and extraction

Default posture:

- common, familiar, safe source: Depth 0 or 1;
- modest skill gap or special objective: Depth 2;
- unfamiliar, fragile, rare, or hazardous source: Depth 3;
- legendary/story-critical extraction: Depth 4;
- organized mine, forestry, fishery, agriculture, or source operation: Depth 5.

Low skill should usually reduce control, yield, condition, safety, and information rather than convert all gathering to universal pass/fail.

A dedicated source/method difficulty and familiarity authority plan is required before implementation.

### Crafting and manufacturing

Crafting should use a richer state-preserving adapter.

Possible phases:

1. inspect and prepare;
2. establish process state;
3. shape, transform, or assemble;
4. stabilize, finish, or preserve;
5. inspect, accept, recover, rework, downgrade, or discard.

Possible attempt state includes completion, integrity, workmanship, material efficiency, defects/contamination, time, fuel/charge, wear, hazards, interruption, and recovery.

A future crafting process profile must remain separate from `crafting.recipes` and production chains.

### Knowledge study and trials

Preserve the existing completion, eligibility, and readiness phases.

Interactive Knowledge should focus on meaningful judgment:

- what to trust;
- what to verify;
- breadth versus depth;
- source comparison;
- contradiction resolution;
- field proof;
- preservation, disclosure, or application.

Routine reading should normally be Depth 0 or 1. Tier trials, synthesis, original research, dangerous arcane study, or archive expeditions may use Depth 3-5.

A separate Knowledge attempt/checkpoint/outcome contract is required; do not expand the eligibility/readiness helpers into execution owners.

### Skill practice and mastery trials

Ordinary skill use should progress through the owned action result and may compress after reliability.

Short or extended trials are appropriate for:

- first serious use of a technique;
- moderate overreach;
- teacher-led introduction;
- recovery after a meaningful mistake;
- rank checkpoints;
- mastery breakthroughs.

Preserve the legacy trial accumulator through an explicit adapter until a dedicated migration or replacement decision is approved.

### Workplaces, jobs, and teams

The workplace supplies context. The job supplies role vocabulary. The action stage supplies the resolution profile.

Do not attach one minigame directly to a workplace or job id.

### Magic-assisted actions

Add mandatory affinity, vessel, charge, compatibility, housing, provider, recharge, maintenance, security, failure, scarcity, and fallback state.

Reject magical choices whose only effect is always faster, cheaper, safer, and better.

### Survival, travel, logistics, services, and leadership

Use domain-specific metrics. Routine work should be automatic or condensed. Interactive nodes should occur when environment, route, supply, customer, legal, social, emergency, security, staffing, or obligation pressures create real tradeoffs.

Combat retains its own tactical runtime and should not be replaced by this generic activity model.

## 15. Required Clarification And Audit Passes

### Pass A — Existing-system reuse audit

Reinspect the live repository after the current static/geography sequence and compare:

- quest action trees;
- legacy trial schema/content/progression helper;
- Knowledge eligibility/readiness schemas, content, helpers, and tests;
- crafting recipe authority and production-chain/workplace boundaries;
- activity selection and deferred advancement preview/execution paths;
- magic planning envelopes;
- run difficulty modifiers;
- command/event/revision patterns.

Decide what vocabulary is reusable, adaptable, quest-only, legacy-only, or unsafe to generalize.

### Pass B — Competence, difficulty, familiarity, and compression authority

Decide:

- who authors minimum and recommended competence;
- how effective capability is calculated;
- which familiarity identities exist;
- whether familiarity is evidence-based, counted, staged, or derived;
- domain-specific reliability thresholds;
- force-expand conditions;
- difficulty-mode effects on depth, RNG width, recovery, and consequence severity.

### Pass C — Shared node and result vocabulary

Define strict static vocabulary for:

- node kinds;
- checks;
- result bands;
- branches;
- recovery;
- participant aggregation;
- authored choice information;
- terminal states.

Do not select a schema until Pass A determines whether quest action trees can be safely decomposed or referenced.

### Pass D — Attempt identity, determinism, preview, and replay

Define:

- attempt identity;
- seed/randomness ownership;
- stale protection;
- preview/execution parity;
- accepted-only state application;
- persistence and replay posture;
- interruption/resume behavior;
- time/sequence ownership.

### Pass E — Typed effect ownership matrix

Map every proposed effect to an owner and reject effects without one.

At minimum inspect inventory/items, crafting workpieces, tools/facilities, progression, Knowledge, body/injury, site/ecology, relationships/reputation, charge/magic, economy/services, quests/Chronicle, and time/activity state.

### Pass F — Domain adapter plans

After the shared contracts are decided, plan separately:

1. gathering/extraction target and method profiles;
2. crafting process profiles;
3. Knowledge attempt/checkpoint/outcome;
4. Skill Trial adapter/expansion;
5. magic study adapter;
6. workplace/team operation profiles;
7. travel/logistics and service/leadership adapters.

### Pass G — Presentation and authoring tools

Only after pure contracts and simulation tests exist, plan:

- condensed versus expanded presentation;
- information certainty by skill/Knowledge;
- accessibility and pacing;
- authoring validation;
- graph reachability and ending analysis;
- probability/leverage tooling;
- UI interaction.

## 16. Recommended Future Sequence

Do not insert these runs ahead of the active static-content and geography sequence.

1. Unversioned `Activity Resolution Existing-System Reuse Audit`.
2. Documentation-only competence/familiarity/compression authority decision.
3. Shared node, outcome, aggregation, and typed-effect vocabulary plan.
4. Pure deterministic depth-selector plan and helper.
5. Attempt identity/state/determinism contract plan.
6. Legacy Skill Trial adapter decision.
7. Knowledge attempt/checkpoint/outcome contract.
8. Crafting process-profile authority decision.
9. Gathering/extraction target-method authority decision.
10. Narrow simulation-only slices:
    - one gathering target;
    - one blacksmithing mastery trial;
    - one Flora Knowledge attempt;
    - one standard crafting recipe;
    - one bounded magic-assisted maintenance/storage scenario only after effect authority exists.
11. Graph-analysis tooling.
12. Runtime mutation owners and read-only presentation, domain by domain.

Version labels must be selected from the live route when these runs become active. Historical `0.5.x` placeholders in older roadmap sections must not be executed verbatim.

## 17. Anti-Patterns

Do not implement:

- universal RNG pass/fail for all work;
- mandatory minigames for every skill use;
- `fast / balanced / careful` menus without concrete owned consequences;
- repeated manual interaction after demonstrated reliability;
- one success permanently bypassing changed conditions;
- skill rank as the only depth selector;
- Knowledge replacing practical skill;
- recipes containing mutable execution state;
- workplaces or jobs selecting one minigame by identity;
- magic as a universal efficiency multiplier;
- hidden severe consequences in Depth 0 or 1;
- critical failure without a distinct severe state;
- free-form effects that mutate unrelated systems;
- one implicit team aggregation rule;
- UI-authored scores or decisions;
- direct generic-resolver mutation across owners;
- broad schema/runtime implementation before the reuse audit.

## 18. Temporary Artifact Disposition

The guidance from `docs/dev/tmp-contextual-action-resolution-depth-framework-2026-07-16.md` is promoted into this durable plan.

That temporary artifact is fully consumed and should be deleted in the same documentation patch. No temporary replacement is required.

## 19. Acceptance Criteria For This Plan

This plan is complete when:

- the active `0.6.5` prompt remains unchanged;
- the shared framework is explicitly planning-only;
- current Skill Trial, Knowledge, quest, crafting, workplace, activity, and magic boundaries are represented accurately;
- the legacy trial accumulator is preserved rather than silently replaced;
- Knowledge eligibility/readiness remain separate from attempt execution;
- recipe and production-chain authority remains unchanged;
- gathering difficulty/familiarity gaps are explicit;
- required audits and clarification passes are named;
- the future audit prompt is held behind the current sequence;
- the consumed temporary artifact is removed;
- no content, schema, validator, helper, test, runtime, UI, save, economy, or gameplay behavior changes.
