# Current Codex Prompt

## Run Identity

`Normal Stakes Defeat, Injury, Trauma, And Magical Restoration Repository Audit And Contract Planning`

Run classification: unversioned documentation-only repository audit and implementation-contract planning

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(health): audit defeat injury trauma and restoration contracts`

## Purpose

Inspect the live repository and produce the smallest decision-ready contract plan for:

1. nonterminal Normal Stakes defeat resolution;
2. naturally recoverable physical injuries;
3. trauma-instigated nonphysical conditions;
4. normally irreversible harm and rare magical restoration;
5. resurrection boundaries;
6. injury and trauma persistence, ownership, current-attribute integration, and tests;
7. the exact package sequence required before campaign-rules runtime migration.

This run is an audit and planning pass. It does not implement runtime, schemas, saves, migration, combat, health, injury, trauma, treatment, magic, resurrection, UI, tests, content, services, spells, balance, or gameplay.

## Required Source State

Read first and treat as controlling where older documents overlap:

- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`;
- `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`;
- `docs/design/combat-status-condition-injury-boundary-decision.md`.

Also read:

- `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`;
- `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`;
- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`;
- `docs/design/magic-runtime-boundary-plan.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `AGENTS.md`;
- `README.md`.

Inspect live source and tests relevant to:

- HP-zero detection and run archival;
- encounter defeat and incapacitation flags;
- party combat state and encounter outcomes;
- player resources, body state, active effects, attributes, and save snapshots;
- save-slot deletion, archival, retirement, Chronicle, estate, and Legacy payout;
- location, travel, rest, safe-settlement, and recovery surfaces;
- combat statuses, injuries, conditions, healing, services, spells, magic hooks, death, and resurrection vocabulary;
- generated TypeScript/JavaScript mirrors.

The accepted campaign-rules decision commit is:

`764f7ef5e4028e82fc76af6ae0381cc1eab00e20`

## Execution Gate

1. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state.
2. Confirm this is the active prompt.
3. Confirm commit `764f7ef5e4028e82fc76af6ae0381cc1eab00e20` is an ancestor of `HEAD`.
4. Confirm `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md` exists and is unmodified in the worktree.
5. Confirm the held `Version 0.6.6` prompt still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
6. Preserve unrelated work.
7. If live repository facts materially contradict an accepted authority, do not infer a repair. Record the contradiction in `docs/dev/current-codex-output.md`, do not create the temporary audit, and stop.

## Accepted Invariants

The following are not open recommendations.

### Campaign and Stakes

1. Difficulty, World Rules, and Stakes remain orthogonal.
2. `normal_stakes` is the only accepted initial Stakes identity.
3. Ordinary HP zero under Normal Stakes is defeat or incapacitation, not implicit terminal death.
4. Ordinary HP zero must not archive the run, delete saves, settle terminal Prestige/Legacy, or prove permanent death.
5. Runtime migration to `normal_stakes` cannot ship while ordinary HP zero still triggers terminal archival and save deletion.
6. Restricted Stakes remains a separate future authority with one continuity stream, no chosen rollback, and irreversible actual death after terminal commitment.

### Injury Classification

7. Severity and recoverability are separate dimensions.
8. Naturally recoverable physical injuries use `Minor`, `Moderate`, and `Major` severity labels.
9. A Major naturally recoverable injury remains capable of complete functional recovery by definition.
10. Naturally recoverable injuries may heal without professional treatment, although treatment may accelerate recovery, reduce impairment, or prevent complications.
11. Reduced use is injury-specific and may range from ordinary use through reduced use to protected nonuse.
12. Naturally recoverable injuries are nonchronic; complications or reinjury may causally convert them into another state.
13. Injury does not change immutable base attributes.

### Trauma

14. The accepted broad player-facing trauma umbrella is `Shaken Spirit`.
15. `Shaken Spirit` is a lore-facing trauma condition, not magical soul damage, possession, insanity, moral weakness, or a modern diagnostic catalog.
16. Trauma may self-resolve, respond to support or treatment, require focused care, persist for a long period, or remain unresolved during the campaign.
17. Trauma consequences must be event- and trigger-linked, explainable, proportional, and respectful of character agency.
18. Trauma does not rewrite immutable attributes or authored personality.

### Irreversible Harm And Magic

19. Normally irreversible harm does not fully regenerate through time or generic healing.
20. Mundane treatment may stabilize, rehabilitate, or support adaptation without recreating destroyed anatomy.
21. Prosthetic or assistive capability is not anatomical regrowth.
22. Only explicitly capable, extremely rare, and expensive magic may restore destroyed anatomy, regrow limbs or organs, or reverse other normally irreversible harm.
23. Ordinary healing magic does not automatically provide regrowth or resurrection.
24. Resurrection is a death-and-magic contract, not ordinary injury treatment.
25. This run must not create a resurrection exception to restricted-Stakes terminal closure.

### Attributes And Systems

26. Injury and trauma affect current-state resolution, not immutable base values.
27. Physical injury adjustments, trauma adjustments, reversible body condition, and nutrition-derived structural loss must not be double-counted.
28. Story may use coarse and generous injury/trauma projections.
29. Grim World may later deepen complications, infection, sanitation, access, or stigma only through distinct owner contracts.
30. Defeat must not automatically impose an injury, trauma, item loss, or permanent maiming as a generic tax.
31. Normally irreversible or magic-only harm must be exceptional, strongly causal, and clearly surfaced.

## Audit 1: Live HP-Zero And Defeat Lifecycle

Trace every live path that can observe or produce player HP at or below zero.

Identify:

- the authoritative HP-zero check;
- when and where it runs;
- encounter-state transitions;
- `incapacitated` and `defeated` flags;
- whether combat can end without run archival;
- party-member defeat behavior;
- encounter cleanup;
- stale save and copied-save blocking;
- archival, retirement, estate, Legacy, and Chronicle calls;
- save-slot deletion;
- UI behavior after defeat or archival;
- tests encoding current behavior.

Produce one exact call/ownership flow from HP zero to current terminal archival.

Identify the smallest seam where a Normal Stakes defeat resolver can replace terminal archival without creating a second HP authority.

## Audit 2: Default Normal Stakes Defeat Fallback

The game needs one deterministic fallback when no quest, scripted encounter, law, capture, rescue, or other context owner provides a specific defeat outcome.

Evaluate at least these candidate components:

- encounter termination;
- incapacitated versus defeated state;
- removal from immediate danger;
- nearest valid safe location or context-owned recovery location;
- time advancement;
- bounded HP restoration sufficient to resume play;
- body-state and recovery consequences;
- naturally recoverable injury consequences;
- `Shaken Spirit` consequences;
- currency, item, equipment, or supply loss;
- companion and party handling;
- quest/event state;
- Chronicle and notice output;
- repeated-defeat-loop prevention;
- absence of a valid safe location;
- deterministic save/load behavior.

Do not assume every defeat causes injury, trauma, capture, or loss.

Recommend the smallest coherent default fallback and identify which consequences should remain optional context-owned extensions.

## Audit 3: Live Health, Injury, And Condition Representation

Inventory all live or partially implemented representations for:

- active combat status effects;
- player active effects;
- body state;
- injuries, wounds, scars, impairments, pain, bleeding, concussion, fracture, maiming, and trauma vocabulary;
- current attributes and modifiers;
- treatment or healing state;
- recovery timers or elapsed-time updates;
- NPC and party health persistence;
- save and Chronicle projection.

For each relevant field or type classify it as:

- reusable owner boundary;
- migration input;
- naming conflict;
- incomplete placeholder;
- forbidden parallel authority;
- unrelated domain vocabulary.

Do not reinterpret current mutable attributes as immutable base attributes.

## Audit 4: Naturally Recoverable Injury Contract

Produce a decision-ready runtime contract plan for naturally recoverable physical injuries.

The plan must separate:

- injury identity;
- `Minor | Moderate | Major` severity;
- recovery class;
- current recovery progress;
- ordinary, reduced, or protected-use posture;
- treatment state;
- complication state;
- source event and body region where supported;
- current effects;
- save/Chronicle presentation.

Determine:

- which owner creates an injury instance;
- which owner advances healing over time;
- how rest, activity, nutrition, body state, treatment, and magic contribute without duplicating math;
- how an injury reaches complete functional recovery;
- how overuse or reinjury delays recovery;
- how a causal complication may convert the state without making every injury chronic;
- how multiple injuries combine without uncontrolled stacking;
- how temporary injury adjustments enter the current-attribute resolver;
- how scars remain descriptive without forcing permanent impairment.

Do not select exact durations, percentages, penalties, or medical formulas.

## Audit 5: `Shaken Spirit` Trauma Contract

Produce a decision-ready plan for a trauma-condition instance using the player-facing umbrella `Shaken Spirit`.

Inspect whether existing morale, fear, Knowledge, relationship, Chronicle, body-state, active-effect, or event systems provide reusable seams.

The contract plan must distinguish:

- source event;
- trigger identities or categories;
- current expression tags;
- current burden/severity;
- recovery course;
- safety/support/treatment inputs;
- current contextual effects;
- persistence and save/load;
- Chronicle explanation;
- resolution, dormancy, relapse, or continued persistence.

Use descriptive expressions such as dread, nightmares, avoidance, vigilance, suspiciousness, startle, withdrawal, or event-linked panic without creating a comprehensive modern diagnosis list.

Identify lore-compatible support owners such as household support, companions, spiritual counsel, ritual, healers, confessors, mentors, or other setting-appropriate care, while preserving cultural variation.

Require anti-frustration and agency guardrails. Do not authorize arbitrary forced dialogue, betrayal, violence, or self-destructive action.

## Audit 6: Normally Irreversible Harm And Adaptation

Plan the owner boundary for normally irreversible harm.

Determine how the future system distinguishes:

- destroyed or absent anatomy;
- persistent impairment;
- stable wound closure;
- rehabilitation;
- prosthetic or assistive compensation;
- current capability;
- magical restoration eligibility;
- restoration completion.

Identify whether any live anatomy, equipment, body-region, disability, service, spell, or item contract can support the direction without inventing premature generic infrastructure.

Normally irreversible harm must not be the routine default defeat fallback.

## Audit 7: Magical Restoration And Resurrection

Inventory live spell, magic-hook, service, healer, item, sacred-site, death, corpse, Chronicle, and save concepts relevant to:

- extraordinary tissue restoration;
- limb or organ regrowth;
- curse or transformation reversal;
- resurrection;
- healer rarity, access, cost, requirements, and institutions.

Separate:

1. ordinary healing;
2. exceptional restoration;
3. regrowth;
4. resurrection.

Identify missing owner decisions and dependencies.

Preserve these boundaries:

- generic healing cannot imply regrowth;
- the existence of resurrection in the setting does not define its Normal Stakes mechanics;
- resurrection must not bypass restricted-Stakes terminal closure;
- exact spells, prices, healer counts, probabilities, materials, rituals, corpse windows, and soul rules remain deferred.

## Audit 8: Difficulty, Story, Grim, And Stakes Interaction

Produce an interaction matrix for:

- Story/Favored/Mortal/Forsaken;
- Heroic World/Grim World;
- Normal Stakes/future restricted Stakes.

Classify which axis may tune:

- consequence weighting;
- recovery duration;
- treatment effectiveness;
- reduced-use burden;
- complication resistance;
- trauma recovery/support effectiveness;
- warnings and forecast precision.

Classify which truths cannot be tuned away:

- source event;
- existing or absent anatomy;
- immutable base attributes;
- actual magic capability;
- selected Stakes resurrection/death boundary.

Story must remain coarse and forgiving. Grim may deepen systems but cannot make all injury or trauma ubiquitous.

## Audit 9: Ownership And Persistence Matrix

Assign one owner for each concern:

- static injury/condition vocabulary;
- active injury instance;
- active trauma instance;
- source event receipt;
- body region/anatomy;
- recovery progression;
- treatment;
- complication;
- current-attribute adjustments;
- activity/use restrictions;
- magic restoration;
- prosthetics and equipment compensation;
- resurrection;
- actual death;
- defeat fallback;
- safe-location resolution;
- time advancement;
- save identity;
- Chronicle projection;
- UI explanation.

Identify all persistence and migration needs without proposing a parallel health save.

## Audit 10: Implementation Package Sequence

Recommend the smallest package sequence that respects these gates:

1. Normal Stakes cannot become live while HP zero still deletes saves.
2. Injury and trauma instance owners must not mutate immutable base attributes.
3. The current-attribute resolver must have one authorized adjustment path.
4. Defeat fallback may need a minimal recovery consequence before the complete injury catalog exists.
5. Story and Grim availability gates remain enforced.
6. Magical restoration and resurrection must not be smuggled into the first defeat package.
7. TypeScript and tracked JavaScript mirrors must remain synchronized.

Classify each proposed package as:

- required for the first atomic campaign-rules/defeat implementation;
- safe immediate follow-up;
- later health/injury package;
- later trauma package;
- later magical-restoration package;
- later resurrection/death package.

Do not assign release numbers.

## Audit 11: Validation Matrix

Specify tests proving at least:

- Normal Stakes HP zero does not archive the run or delete saves;
- explicit terminal retirement/death remains separate;
- fallback defeat is deterministic;
- repeated defeat cannot soft-lock the player;
- defeat does not always create an injury or trauma condition;
- naturally recoverable Minor, Moderate, and Major injuries can reach complete recovery;
- reduced-use requirements are injury-specific;
- treatment assistance and natural recovery do not conflict;
- complications are causal and persisted;
- `Shaken Spirit` remains a trauma condition rather than magical soul damage or a diagnosis catalog;
- trauma may self-resolve, respond to support, or persist;
- trauma does not rewrite personality or immutable attributes;
- normally irreversible harm does not heal through generic time or ordinary healing;
- prosthetic compensation differs from regrowth;
- only explicitly capable magic restores destroyed anatomy;
- resurrection follows Stakes and death authority;
- restricted-Stakes terminal closure remains irreversible;
- injury, trauma, body condition, and structural loss are not double-counted;
- save/load does not reroll outcomes or recovery truth;
- held `0.6.6` remains untouched.

## Required Output

On successful completion, modify exactly:

1. create `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`;
2. update `docs/dev/current-codex-output.md`.

The temporary audit must contain:

1. execution and source-state confirmation;
2. live HP-zero and defeat call flow;
3. contradiction table;
4. default Normal Stakes fallback options and recommendation;
5. health/injury/condition inventory;
6. naturally recoverable injury contract plan;
7. `Shaken Spirit` trauma contract plan;
8. irreversible-harm and adaptation plan;
9. magical restoration and resurrection boundary analysis;
10. difficulty/world/stakes interaction matrix;
11. owner and persistence matrix;
12. migration and compatibility risks;
13. implementation package sequence;
14. validation matrix;
15. exact remaining user decisions;
16. explicit non-decisions.

Update `docs/dev/current-codex-output.md` with:

- source run identity;
- branch/start/end state;
- exact changed paths;
- principal repository findings;
- recommended default defeat fallback;
- injury, trauma, and restoration contract summary;
- owner conflicts;
- package sequence;
- exact remaining user decisions;
- checks run;
- held-route confirmation;
- next recommended decision run.

## Forbidden Scope

Do not modify:

- this prompt;
- current GPT handoff;
- route register;
- accepted design authorities;
- held `0.6.6`;
- retained `0.6.7` artifacts;
- runtime;
- shared types;
- schemas;
- saves;
- migrations;
- tests;
- UI;
- content;
- services;
- spells;
- generated files;
- package manifests;
- gameplay.

## Stop Conditions

Stop after the exact two documentation outputs.

Do not:

- implement defeat resolution;
- change HP-zero behavior;
- add injury or trauma state;
- add a static catalog;
- add healing, treatment, regrowth, resurrection, or prosthetic mechanics;
- select exact durations, rates, probabilities, penalties, costs, or healer counts;
- create a modern psychiatric diagnosis list;
- make every defeat cause injury or trauma;
- authorize permanent maiming as the generic Normal Stakes fallback;
- add a restricted-Stakes id;
- create a follow-on implementation prompt;
- assign a release number;
- restore `0.6.6`;
- alter `0.6.7` artifacts;
- modify any path outside the exact allowed pair.

Report the ending commit, exact changed paths, repository state, and any contradiction that prevented completion.
