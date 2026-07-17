# Contextual Action Resolution Depth Framework

- Date: 2026-07-16
- Status: temporary design guardrail; non-canonical and non-executing
- Scope: design and planning only; no content, schema, validator, test, runtime, economy, UI, save, migration, dependency, asset, or gameplay implementation
- Named consumer: a future dedicated `Activity Resolution Depth And Attempt-State Contract Plan` after the active cross-domain production research integration and before the first player-owned gathering, crafting, Knowledge-attempt, or skill-trial runtime slice
- Removal condition: delete this temporary artifact after its accepted guidance is promoted into durable design authority, the relevant backlog entries, and an implementation-ready contract; retain it only while it prevents repeated analysis for that named consumer

## 1. Decision Summary

Use one shared contextual action-resolution framework across gathering, crafting, Knowledge, skill development, workplace activity, survival, travel, services, and bounded magic-assisted work.

Do not make every action a minigame. Do not make every action a flat RNG pass/fail check. Select resolution depth from the character, action, objective, context, and consequences.

The governing design rule is:

> Automatic resolution handles inconsequential variation. Player decisions govern material tradeoffs. Trials appear when uncertainty, consequence, and agency intersect.

The underlying calculation may be analog, but the player-facing branch should use a small set of authored outcomes with materially distinct consequences.

A workplace, job, skill, recipe, Knowledge domain, or resource does not automatically own a minigame. The individual action stage owns its resolution profile.

## 2. Gate 7 Inspection Result

Gate 7 does not overturn the proposed structure.

Gate 7 was documentation and research only. It changed no content JSON, schema, validator, test, runtime, economy, combat, medicine, infrastructure, inventory, UI, save, dependency, asset, or gameplay behavior. Cross-domain integration is active next, and revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` remains blocked.

Gate 7 strengthens this framework with four requirements for any magical or magic-assisted action:

1. **Finite resource and access**
   - vessel, charge, recharge route, provider access, scarcity, and competing uses remain explicit;
2. **Mundane housing and maintenance**
   - enclosure, mount, tool, transmission path, inspection, repair, custody, and replacement remain necessary;
3. **Visible and consequential failure**
   - depletion, mismatch, instability, breakage, theft, contamination, degraded performance, false indication, and dangerous release cannot collapse into a hidden efficiency penalty;
4. **Ordinary fallback**
   - magic may provide a bounded exception, specialty, or resilience option, but it does not erase ordinary technology, labor, material, environment, safety, waste, or fallback.

Gate 7 also reinforces that service availability, provider access, static compatibility, institutional projection, and effect execution are separate authorities. An available service may permit an attempt without resolving the attempt.

Relevant current sources include:

- `docs/dev/tmp-magitech-production-infrastructure-substitution-research-2026-07-14.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- `docs/design/knowledge-trial-boundary-plan.md`
- `docs/design/crafting-authority-boundary-decision.md`
- `docs/data-dictionary/quests.md`
- `packages/content/base/player/trials.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/crafting/recipes.json`
- `packages/content/base/quests/quest_archetypes.json`

## 3. Core Resolution Layers

Every resolvable action should pass through these layers:

1. **Eligibility**
   - Can the actor physically, cognitively, legally, institutionally, or magically attempt the action?
2. **Readiness**
   - Are the required tools, station, materials, time, access, condition, preparation, and cooldown state available?
3. **Depth selection**
   - Should this attempt be automatic, condensed, a single decision, a short trial, or an extended activity?
4. **Attempt resolution**
   - Resolve the selected actions, checks, choices, resources, metrics, and recovery routes.
5. **Outcome application**
   - Apply typed effects through the correct runtime owner.
6. **Learning and familiarity**
   - Update skill progress, target familiarity, method familiarity, Knowledge evidence, or mastery progress through the appropriate owner.
7. **Future compression**
   - Determine whether this action may be shortened or bypassed under comparable future conditions.

Eligibility, readiness, attempt resolution, outcome application, and learning must not be collapsed into one percentage.

## 4. Resolution-Depth Tiers

### Depth 0 — Deterministic automatic action

Use when:

- the action is trivial for the actor;
- consequences are negligible;
- conditions are ordinary;
- the player has already demonstrated reliable competence;
- no meaningful objective conflict exists.

Examples:

- a master herbalist collecting a common known herb in safe weather;
- a familiar cook preparing routine travel food with ample supplies;
- a scribe copying a short ordinary notice without time pressure.

The result may still consume time and resources. It should not require a roll merely to create noise.

### Depth 1 — Skill-modified bounded resolution

Use when variation matters slightly but no meaningful decision exists.

Resolve automatically with bounded RNG or seeded variation affecting one or more dimensions such as:

- quantity;
- condition;
- time;
- minor wear;
- ordinary waste;
- routine fatigue.

This tier should not produce severe injury, permanent loss, catastrophic contamination, or major narrative consequences without a player-facing warning and a higher-depth route.

### Depth 2 — One consequential decision

Use when one concrete tradeoff exists and the options have real systemic consequences.

Each option should improve at least one valued dimension while worsening or risking another. Generic labels such as `fast`, `careful`, and `balanced` are internal profiles, not sufficient player-facing actions.

Examples:

- prune mature leaves, uproot the specimen, or mark it for later cultivation;
- follow the exposed seam or open the richer unstable fracture;
- salvage the current batch or discard it before contamination spreads;
- spend scarce charge now or preserve it for the return route.

### Depth 3 — Short trial

Use for one to three connected decisions or checkpoints when:

- the actor is below recommended competence;
- the target or method is unfamiliar;
- the resource or workpiece is rare, fragile, dangerous, or expensive;
- a recoverable mistake creates a meaningful second decision;
- context creates time, safety, quality, preservation, or resource pressure.

A short trial should normally contain:

- an approach or preparation node;
- an execution node;
- an optional recovery, stop, or press-on node.

### Depth 4 — Extended authored activity

Use sparingly for:

- mastery trials;
- exceptional or story-critical gathering;
- complex commissions;
- experimental crafting;
- contested Knowledge synthesis;
- dangerous infrastructure work;
- multi-role quest work;
- rare magical installation, binding, recharge, repair, or failure recovery.

This tier may use a state accumulator across several nodes. It must preserve meaningful state between nodes rather than presenting unrelated checks.

### Depth 5 — Project, operation, or institutional resolution

Use for work whose main decisions occur above the individual hand-action level:

- settlement construction;
- production scheduling;
- agricultural planning;
- herd management;
- caravan or expedition operation;
- major research program;
- civic magical installation;
- disaster response.

Depth 5 may contain delegated Depth 0-4 actions, but its primary metrics are project-scale: throughput, schedule, labor condition, supply continuity, maintenance debt, safety, legitimacy, cost, and strategic readiness.

## 5. Depth-Selection Factors

Depth should be selected from a profile rather than authored independently for every attempt.

### Character factors

- primary skill rank;
- supporting skill ranks;
- governing attributes;
- relevant Knowledge;
- target familiarity;
- method familiarity;
- prior successful attempts;
- recent soft failures or injuries;
- fatigue, condition, and impairment;
- available teacher, specialist, or party support.

### Action factors

- minimum attempt competence;
- recommended competence;
- intrinsic difficulty;
- stage complexity;
- material or subject sensitivity;
- recoverability of error;
- required precision;
- number of interacting resources;
- novelty or experimental status.

### Context factors

- environmental hazard;
- weather and visibility;
- time pressure;
- hostile or competitive pressure;
- legal or institutional restriction;
- site depletion or preservation concern;
- tool, station, and facility condition;
- interruption risk;
- available fallback;
- objective requirements.

### Stakes factors

- material value;
- rarity;
- injury severity;
- contamination or spoilage risk;
- permanent site or item loss;
- reputation or relationship effect;
- quest or commission importance;
- strategic scarcity;
- magical charge, access, or replacement difficulty.

## 6. Suggested Depth Selector

The future contract should calculate an `effectiveCapability` and a `depthPressure` without embedding final balance values in this temporary artifact.

Conceptually:

```text
effectiveCapability =
  primary skill
  + approved supporting skills
  + attributes
  + Knowledge
  + familiarity
  + preparation
  + tools and station
  + specialist support
  + favorable environment
  - fatigue and injury
  - tool or facility defects
  - hostile conditions

depthPressure =
  difficulty gap
  + novelty
  + stakes
  + hazard
  + objective complexity
  + interruption risk
  + resource scarcity
  - demonstrated reliability
  - safe automation support
```

The selector should then apply authored overrides:

- `always_interactive` for rare story or mastery moments;
- `never_interactive` for trivial maintenance and flavor variation;
- `manual_until_familiar` for learning-sensitive actions;
- `manual_under_pressure` for otherwise routine actions made consequential by context;
- `project_only` for managerial or settlement-scale actions.

## 7. Meaningful-Decision Standard

A player-facing option is justified only when all of the following are true:

1. each option changes a valued outcome dimension;
2. at least one option gains something another does not;
3. at least one option sacrifices or risks something another protects;
4. the wider game makes those differences matter;
5. different circumstances can make different options rational;
6. the player receives enough information to understand the general tradeoff;
7. skill, Knowledge, equipment, or preparation can materially alter information, options, execution, or recovery.

When these conditions are not met, use automatic skill-modified resolution.

## 8. Shared Outcome Dimensions

The framework should use typed dimensions selected by the domain. Not every action uses every dimension.

### Physical and production dimensions

- acquisition;
- completion or progress;
- quantity or yield;
- material condition;
- workmanship or quality;
- structural integrity;
- material efficiency;
- time;
- energy or fuel use;
- tool and facility wear;
- waste and residue;
- safety;
- contamination;
- site impact;
- future availability.

### Cognitive dimensions

- coverage;
- confidence;
- accuracy;
- misconception;
- evidence quality;
- source integrity;
- retention;
- synthesis;
- time and fatigue.

### Social and institutional dimensions

- trust;
- compliance;
- legitimacy;
- morale;
- reputation;
- privacy;
- service quality;
- throughput;
- conflict;
- debt or obligation;
- access and enforcement risk.

### Travel and operation dimensions

- arrival time;
- cargo condition;
- route knowledge;
- fatigue;
- supplies;
- vehicle or animal condition;
- visibility;
- incident exposure;
- escort readiness;
- route or site impact.

## 9. Graded Outcome Bands

Avoid universal binary pass/fail. The default authored branch set should be selected by the action:

- `critical_success` when a materially distinct exceptional result exists;
- `success` for intended completion;
- `partial` or `soft_failure` for recoverable loss, reduced result, or changed route;
- `failure` for significant loss or inability to complete;
- `critical_failure` only when a distinct severe consequence is justified and legible.

Binary checks remain appropriate for:

- hard prerequisites;
- determinant gates;
- simple recovery checks;
- yes/no physical states;
- actions whose only meaningful result is access granted or denied.

The number of outcomes should equal the number of materially distinct resulting states, not the numeric precision of the underlying calculation.

## 10. Familiarity, Reliability, and Compression

Track general skill separately from familiarity with a target, method, recipe, source type, instrument, or service procedure.

A suggested familiarity ladder is:

```text
unknown
observed
attempted
successfully completed
familiar
reliable
mastered
```

The exact names may vary by domain.

Compression should require demonstrated reliability under comparable conditions, not merely one success or a 50 percent success chance.

A future automation or bypass policy should consider:

- prior successful completion;
- effective skill relative to recommended competence;
- target and method familiarity;
- ordinary environment;
- adequate tools and station;
- no unusual objective;
- no severe hazard;
- predicted safe-success reliability above a high threshold;
- acceptable expected loss;
- available fallback.

A previously compressed action should expand again when conditions become unusual, stakes rise, equipment degrades, the objective changes, or the actor attempts an advanced result.

## 11. Domain Variant — Gathering and Extraction

### Strong fit

Gathering, foraging, woodcutting, mining, quarrying, fishing, hunting, butchering, trapping, fuel gathering, crop harvest, apiary work, clay extraction, peat cutting, salt recovery, and similar source actions benefit directly.

### Typical metrics

- acquisition;
- yield;
- condition;
- time;
- safety;
- tool wear;
- site disturbance;
- depletion or regrowth;
- contamination;
- future availability.

### Recommended depth behavior

- familiar common resource in safe conditions: Depth 0 or 1;
- modest skill gap or unusual objective: Depth 2;
- unfamiliar, fragile, rare, or hazardous source: Depth 3;
- legendary, story-critical, or multi-stage extraction: Depth 4;
- organized mine, forestry, agricultural, or fishery operation: Depth 5.

Low skill should usually reduce control, yield, condition, safety, and information rather than converting all gathering into a universal pass/fail roll.

Hard gates should be reserved for genuinely impossible or unacceptably unsafe attempts.

## 12. Domain Variant — Crafting and Manufacturing

Crafting warrants a more complex variant than routine gathering because it can preserve meaningful state across several transformations.

### Authority boundary

- `crafting.recipes` should remain the bounded static authority for explicit inputs, outputs, quantities, roles, workplaces, tools, skills, and optional non-inheriting production-chain relationship;
- the recipe must not own mutable execution state;
- the current civilization production-chain resolver must not be treated as player crafting execution;
- a future player crafting runtime should own selected item instances, active order, tools, station, time, progress, interruptions, consumption, outputs, history, and typed consequences.

### Suggested crafting attempt state

- selected recipe and requested order;
- actor and participating roles;
- tool and station instances;
- material instances and provenance;
- current phase and node;
- completion progress;
- workpiece integrity;
- workmanship or quality;
- material efficiency;
- contamination or defect state;
- elapsed time;
- energy, fuel, or charge state;
- tool and facility wear;
- active hazards;
- interruption state;
- history and recovery flags.

### Suggested phase grammar

A complex recipe may use phases such as:

1. inspect and prepare;
2. establish process state;
3. shape, transform, or assemble;
4. stabilize, finish, or preserve;
5. inspect and accept, recover, rework, downgrade, or discard.

Not every recipe needs every phase.

### Depth behavior

- known recipe, ordinary materials, good station, reliable crafter: Depth 0 or 1;
- ordinary commission with one objective tradeoff: Depth 2;
- difficult recipe, unfamiliar material, demanding order, or recoverable defect: Depth 3;
- masterwork, experimental, magical, rare-material, team, or story commission: Depth 4;
- settlement production campaign, major construction, or production scheduling: Depth 5.

### Meaningful crafting choices

Good crafting choices affect real state, for example:

- use more material to protect integrity;
- accept lower quality to finish before a deadline;
- reheat and risk grain damage or continue with poor workability;
- rework a defect and consume time/tool condition;
- downgrade the product rather than lose the entire batch;
- reserve a rare finishing material for a later stage;
- halt for maintenance or accept rising failure exposure.

Avoid copying a rotation-heavy crafting interface. The value should come from state management, authored tradeoffs, recovery, and order-specific objectives rather than repetitive optimal button sequences.

## 13. Domain Variant — Knowledge, Study, and Research

Knowledge should use the same depth-selection concept while retaining its separate eligibility and readiness boundaries.

### Preserve existing separation

```text
completion candidate
→ eligibility candidate
→ readiness candidate
→ authorized attempt
→ checkpoint resolution
→ outcome
→ cooldown and reward
```

No arrow implies automatic progression.

### Suggested Knowledge attempt state

- target domain, subject, and tier;
- source or teacher set;
- coverage;
- confidence;
- misconception pressure;
- evidence quality;
- source integrity or contradiction;
- synthesis progress;
- elapsed time;
- fatigue;
- prior soft failures;
- selected research questions;
- checkpoint history.

### Depth behavior

- review of familiar material: Depth 0 or 1;
- choose between breadth, verification, or focused application: Depth 2;
- first serious study of difficult material or a disputed source: Depth 3;
- tier trial, synthesis, field proof, original research, or dangerous arcane study: Depth 4;
- institutional research program or archive expedition: Depth 5.

Routine reading should not become a repeated minigame. Interactive Knowledge attempts should occur when the player chooses what to trust, verify, compare, test, preserve, or apply.

Skill and Knowledge must remain distinct. Knowledge may reveal the correct method, hazard, classification, or likely consequence; practical skill determines execution.

## 14. Domain Variant — Skill Practice and Mastery Trials

Skills benefit from a tiered system, but not every use of a skill should be a trial.

### Routine practice

Ordinary use should advance through the normal action result and may compress after reliability.

### Learning challenges

A short trial is useful when:

- the actor first attempts a technique;
- the action exceeds current recommended competence;
- a teacher introduces a new method;
- the actor attempts recovery after a meaningful mistake;
- the action is a deliberate training exercise with a clear objective.

### Rank-gate and mastery trials

The existing rank gates and trial framework support more authored depth at major thresholds. These trials should use:

- pass, soft failure, hard failure, and recovery bands;
- consecutive-soft-failure handling;
- sparse meaningful choices;
- build, equipment, teacher, institution, and environment modifiers;
- smaller bounded RNG than ordinary uncertainty;
- progress and potential state where the owning skill framework requires it.

A mastery trial should test control, adaptation, judgment, and recovery—not merely repeat routine execution with inflated numbers.

### Depth behavior

- routine practice well below capability: Depth 0 or 1;
- new technique or moderate overreach: Depth 2 or 3;
- rank checkpoint or important certification: Depth 3;
- mastery, forbidden method, or major breakthrough: Depth 4;
- school, guild, or institutional training program: Depth 5.

## 15. Domain Variant — Workplaces, Jobs, and Teams

The workplace supplies context. The job supplies role vocabulary. The action stage supplies the resolution profile.

Do not assign a minigame directly to `job.alchemist`, `job.apprentice`, or any other job identity.

A single job may perform:

- trivial handling resolved automatically;
- a meaningful preparation decision;
- a critical specialist inspection;
- a short recovery trial;
- a project-level management decision.

### Team aggregation modes

A future action contract should explicitly select one mode:

- `all_pass`;
- `any_pass`;
- `best_of`;
- `weighted_mean`;
- `sum_margin`;
- `leader_plus_support`;
- `weakest_link`;
- authored role sequence.

The aggregation rule must not be inferred from participant count.

### Role behavior

- primary roles usually own the main execution margin;
- support roles modify preparation, time, safety, capacity, or recovery;
- specialists reveal information, unlock methods, inspect state, or control critical nodes;
- managers act at batch, schedule, staffing, maintenance, and priority level.

Support work should receive an independent decision only when it can materially alter the result.

## 16. Domain Variant — Magic-Assisted Actions

Magic should use the shared framework but adds mandatory state and failure dimensions from Gate 7.

### Required additional state

- affinity and owner-specific vocabulary translation;
- vessel identity and tier;
- current charge or availability state;
- attunement and mismatch;
- stability;
- compatible conduit, catalyst, focus, or installation;
- provider and institutional access;
- mundane enclosure and transmission path;
- specialist labor;
- recharge route;
- maintenance and inspection;
- security and custody;
- ordinary fallback.

### Depth behavior

- supported familiar portable use with ample charge and safe conditions: Depth 1 or 2;
- unusual environment, scarce charge, mismatched equipment, or difficult installation: Depth 3;
- binding, repair, recharge under pressure, multi-vessel coordination, or experimental use: Depth 4;
- civic installation, strategic allocation, or institutional service operation: Depth 5.

Magic should not automatically lower resolution depth. It may introduce new decisions involving charge, access, mismatch, maintenance, security, and fallback.

A magical option is meaningful when it provides a bounded specialty or resilience benefit while preserving costs and risks. Reject options whose only function is always faster, cheaper, safer, and better.

## 17. Domain Variant — Survival, Travel, and Logistics

These domains benefit when environment, route, supplies, time, cargo, fatigue, and hazard create actual tradeoffs.

### Survival

- ordinary camp setup in safe weather: Depth 0 or 1;
- choose site, fire, concealment, or shelter priorities: Depth 2;
- storm, injury, dangerous crossing, hostile terrain, or limited supplies: Depth 3 or 4.

### Travel

- known safe route with high reliability: condensed route resolution;
- route choice with time, safety, toll, secrecy, or cargo tradeoffs: Depth 2;
- segmented journey with incidents and recovery: Depth 3 or 4;
- caravan, expedition, or military movement: Depth 5.

The racing analogue should use analog arrival time, reliability, cargo condition, fatigue, and incident state rather than a single pass/fail result.

### Logistics

Individual loading and carrying are normally automatic. Interactive logistics belongs at route, allocation, scheduling, maintenance, security, or crisis nodes.

## 18. Domain Variant — Services, Social Work, Leadership, and Administration

The framework may apply to hospitality, medicine-adjacent services, trade, negotiation, diplomacy, stewardship, labor coordination, and crisis management, but the outcome dimensions must be domain-specific.

Possible metrics include:

- service quality;
- throughput;
- customer or patient confidence;
- privacy;
- trust;
- compliance;
- reputation;
- legitimacy;
- conflict risk;
- labor fatigue;
- schedule;
- resource commitment.

Routine service should be automatic or condensed. A trial is justified by difficult customers, scarce supplies, conflicting obligations, deception, legal exposure, emergency conditions, or a high-stakes relationship checkpoint.

Medical diagnosis and treatment require their own dedicated safety and authority pass before implementation. This framework does not authorize medical procedures or outcomes.

## 19. Static Definition and Runtime Attempt Separation

A future shared static definition may contain:

- action or activity ID;
- domain and owner;
- primary and supporting skills;
- Knowledge relationships;
- minimum and recommended competence;
- prerequisites and readiness requirements;
- applicable depth tiers;
- automatic-resolution policy;
- familiarity and compression policy;
- outcome dimensions;
- node graph or phase grammar;
- checks and participant aggregation;
- choice definitions;
- outcome bands;
- typed effects;
- hazards and recovery routes;
- allowed contextual modifiers.

A future mutable attempt state may contain:

- attempt ID;
- actor, participants, roles, and owner;
- source definition and policy IDs;
- RNG seed;
- current depth, phase, and node;
- selected choices;
- metrics and accumulators;
- resources and consumed/reserved instances;
- tool, facility, vessel, and environment state;
- familiarity and prior-attempt evidence;
- consecutive soft failures;
- elapsed time and sequence;
- history;
- terminal status.

Static definitions must not own mutable inventory, quality history, charge spending, injuries, rewards, progression, or persistence.

## 20. Typed Effects

Outcome branches should emit typed effect requests to the correct owner rather than directly mutating unrelated systems.

Examples:

- consume or reserve material instance;
- create output candidate;
- alter workpiece integrity;
- add contamination candidate;
- apply tool or facility wear;
- change elapsed time;
- add injury or hazard candidate;
- alter site depletion candidate;
- change familiarity or skill-progress candidate;
- add Knowledge evidence or misconception candidate;
- change reputation or relationship candidate;
- spend or reserve charge candidate;
- schedule maintenance, cooldown, or recovery candidate;
- advance, recover, complete, fail, or abort activity.

The eventual runtime owner must validate and apply each effect.

## 21. Example Depth Transitions

### Novice gatherer, high-difficulty herb

- first encounter, low skill, unknown handling hazard: Depth 3;
- after identification and one successful harvest: Depth 2 or 3;
- after familiarity but still below recommended competence: Depth 2;
- after reliable competence in ordinary conditions: Depth 1;
- during storm, contamination, or urgent commission: expand to Depth 2 or 3 again.

### Familiar smith, ordinary tool

- routine replacement with ordinary stock: Depth 1;
- rushed commission requiring a tradeoff between delivery and finish: Depth 2;
- unfamiliar alloy or recoverable defect: Depth 3;
- masterwork, rare material, magical binding, or ceremonial commission: Depth 4.

### Knowledge attempt

- review known herb signs: Depth 1;
- choose whether to verify a questionable field guide: Depth 2;
- reconcile contradictory sources and prove classification in the field: Depth 3;
- complete a tier trial or original synthesis: Depth 4.

### Ice-assisted conditioned container

- routine inspection with known fixture and adequate charge: Depth 1;
- decide whether to spend charge now or move goods to an ordinary cellar: Depth 2;
- hidden warming, condensation, scarce recharge, or damaged seal: Depth 3;
- emergency preservation during transport or installation repair: Depth 4;
- warehouse-scale allocation and maintenance planning: Depth 5.

## 22. Anti-Patterns

Do not implement:

- a universal RNG pass/fail roll for all work;
- a standard `fast / balanced / careful` menu without concrete consequences;
- a minigame attached to every use of a skill;
- repeated manual interaction after demonstrated reliability;
- one success permanently bypassing all future difficulty;
- skill rank as the only depth selector;
- Knowledge replacing practical execution skill;
- a recipe record containing mutable crafting state;
- a workplace or job identity automatically selecting one minigame;
- magic as a universal efficiency multiplier;
- hidden severe consequences inside Depth 0 or 1;
- critical failure where no distinct severe state exists;
- free-form outcome prose without typed effects;
- one implicit team aggregation rule for every activity;
- direct cross-system mutation from a generic resolver.

## 23. Recommended Future Design Sequence

1. Complete the active cross-domain production research integration without expanding its scope into runtime action design.
2. Promote or retain this artifact explicitly under its named consumer.
3. Write the durable Activity Resolution Depth decision.
4. Define a pure deterministic depth selector with no mutation.
5. Define the shared static action-node and outcome-effect vocabulary.
6. Define the mutable attempt-state contract separately.
7. Adapt the legacy skill trial as a `state_accumulator` model without changing rank gates casually.
8. Preserve Knowledge eligibility/readiness helpers and add a separate Knowledge attempt contract.
9. Define a crafting process profile separate from recipes and production chains.
10. Implement narrow simulation-only slices:
    - one gathering target;
    - one blacksmithing mastery trial;
    - one Flora Knowledge attempt;
    - one standard crafting recipe;
    - one bounded magic-assisted maintenance or storage scenario only after its authority exists.
11. Add graph-analysis tooling for ending probability, acceptable-completion probability, node leverage, role leverage, recovery reliance, expected loss, variance, reachability, preparation value, and outcome entropy.
12. Add runtime mutation owners only after each domain contract is accepted.

## 24. Acceptance Questions for the Named Consumer

The future dedicated design pass should answer:

1. What exact fields select depth without embedding balance prematurely?
2. Which familiarity identities are global, target-specific, method-specific, recipe-specific, or source-specific?
3. What reliability threshold permits compression or bypass in each domain?
4. Which outcome dimensions are shared vocabulary and which remain domain-owned?
5. Which node types and outcome bands are universal?
6. How are team aggregation and specialist intervention authored?
7. Which typed effects may the shared resolver emit?
8. Which runtime owner applies each effect?
9. How do difficulty modes alter depth, RNG width, recovery, and consequence severity?
10. How does authored content force interaction for important moments without making routine work repetitive?
11. How do magic charge, access, maintenance, failure, and fallback integrate without creating generic tag-driven execution?
12. What exact promotion and cleanup action removes this temporary artifact?

## 25. Current Disposition

`retain_for_named_consumer`

This artifact should not alter the active cross-domain integration target, revised `0.6.5`, recipe quantities, production-chain authority, workplace content, skill ranks, Knowledge policies, trial data, magic metadata, or runtime behavior. It exists only to preserve the accepted contextual-resolution proposal and Gate 7 refinements for the later dedicated contract pass.
