# Living Character Manuscript / Narrative Chronicle System Research

Research gate: `GPT-DR.chronicle.living-character-manuscript`
Date: 2026-07-12
Status: temporary Deep Research artifact; non-canonical planning input; requires live-repository reconciliation before durable promotion

## Research Scope And Use

This report investigates how games, RPG systems, interactive fiction, procedural narrative systems, campaign journals, life simulations, roguelike histories, and language-model narrative systems turn player activity into readable story.

It is planning input for a possible future Lineage: Reforged Story system. It does not authorize runtime implementation, schemas, content records, generated canon, save changes, UI changes, or gameplay behavior. It does not override current Chronicle, quest, account-history, discovery, event, or presentation owners. All repository-state claims must be checked against the live repository during the consuming integration pass.

The intended product is not a raw quest log, activity log, achievement feed, diary dump, or mechanical recap. It is a curated, readable manuscript of a player character's life, shaped by play while preserving the distinction between canonical gameplay facts and generated literary presentation.

## 1. Executive Summary

The strongest conceptual model is an **event-sourced living character manuscript** presented to the player as a **character chronicle**. The event-sourced part describes the design foundation: immutable gameplay facts remain the source of truth, while narrative text is a derived projection. The living-manuscript part describes the player experience: selected events are reorganized into chapters, scenes, summaries, transitions, callbacks, and appendices that read as a coherent life story.

The manuscript should not attempt to narrate every action. It should apply editorial judgment through explicit stages:

1. record canonical gameplay facts;
2. classify and score narrative significance;
3. cluster related events into arcs, scenes, montages, and quiet periods;
4. compress routine repetition;
5. select scene, paragraph, summary, mention, or omission treatment;
6. draft prose within a constrained fact envelope;
7. run editorial, continuity, spoiler, and anti-fabrication validation;
8. store generated text separately from canonical facts and player edits.

The system should reserve full scenes for turning points: consequential choices, major quest outcomes, significant combat, discovery with lasting impact, relationship changes, losses, major creations, property or title transitions, and events that resolve or transform an established thread. Routine work should usually be omitted or compressed into montage-like summaries. Repetition becomes narratively meaningful only when it demonstrates persistence, mastery, decline, obsession, preparation, economic change, relationship development, seasonal rhythm, or cumulative consequence.

Narrative memory must be explicit and structured. The generator needs access to current facts, prior manuscript summaries, unresolved threads, relationships, titles, injuries, locations, reputations, goals, recurring actors, significant possessions, moral-choice patterns, and continuity constraints. It should not infer unsupported motives, emotions, backstory, relationships, dialogue, world facts, or hidden information.

Generated prose should remain **narrative presentation**, not gameplay canon. Canonical facts should be traceable to source events or established content authority. Literary connective tissue may safely handle ordering, time passage, spatial transitions, neutral sensory framing, and cautious consequence statements, but it must not create new facts. Player edits should be stored as a separate presentation layer unless a future explicit decision defines a canon-authoring workflow.

For Lineage: Reforged, the safe route is documentation first. The research should be reconciled against existing Chronicle and runtime owners, promoted into a permanent design boundary document, and translated into a future staged roadmap. Runtime work should wait for mature event, state, persistence, relationship, quest-history, and world-history ownership.

## 2. Comparative Survey Of Relevant Systems And Examples

### Dwarf Fortress Legends

Dwarf Fortress demonstrates the value of durable simulation history, entity-centered browsing, linked events, and long-term world memory. Its strength is factual density: people, sites, artifacts, wars, deaths, creations, and relationships can be traced through generated history. Its weakness for this use case is that a history browser is not automatically a readable manuscript. The lesson is to retain the underlying event graph and entity links, but add a separate editorial projection that selects, orders, compresses, and narrates.

Useful patterns:

- immutable or durable historical facts;
- entity-centered history and cross-links;
- artifacts, places, organizations, and people as recurring narrative anchors;
- long-time-horizon consequences;
- post-play exploration of history.

Avoid copying:

- exhaustive event presentation;
- equal visual weight for trivial and major facts;
- reliance on the reader to assemble all causality unaided.

### RimWorld

RimWorld frames systemic play as a story generator. The important lesson is not that an AI should invent a plot, but that the simulation should create pressures, reversals, dependencies, relationships, injuries, scarcity, and recovery that produce meaningful material. A manuscript layer should identify causal chains and character consequences rather than merely list incidents.

Useful patterns:

- consequence chains: injury causes labor shortage, shortage causes risk, risk changes relationships or survival;
- storyteller-like pacing concepts, including pressure, respite, escalation, and recovery;
- traits and relationships as interpretive context;
- mundane systems becoming meaningful when they affect survival or identity.

Risk:

- a manuscript generator may falsely impose a clean dramatic arc on events that were merely adjacent. Causality must come from supported state changes, not literary convenience.

### Crusader Kings

Crusader Kings offers character histories, dynastic continuity, titles, marriages, wars, claims, reputations, succession, and player-authored after-action narratives. It shows that biography becomes compelling when events alter status, relationships, inheritance, and future options.

Useful patterns:

- life-stage and reign-based organization;
- title, relationship, and succession changes as chapter-worthy transitions;
- recurring family and political actors;
- epithets and reputational summaries, when supported by tracked state;
- dynastic appendices and timelines.

Risk:

- generated labels can overwrite player interpretation. The manuscript should distinguish observed patterns from definitive claims about personality or motive.

### Wildermyth

Wildermyth is a strong model for turning procedural events into authored-seeming presentation. It uses bounded event structures, character roles, relationships, transformations, comic panels, chapter breaks, and peacetime summaries. It demonstrates that quiet periods can be summarized rather than dramatized and that recurring character traits can support callbacks.

Useful patterns:

- authored event grammars rather than unconstrained generation;
- scene-sized transformations and relationship beats;
- explicit chapter boundaries;
- peacetime montage summaries;
- legacy and retirement as meaningful endings;
- callbacks to earlier transformations or bonds.

Risk:

- modular procedural dialogue can become locally incoherent. Continuity, role assignment, tone, and prior-state validation must precede prose realization.

### The Sims Memory And Life-Event Systems

The Sims demonstrates automatic capture of milestones and scrapbook-like presentation. The key lesson is that players value the ability to curate, annotate, and reinterpret life events.

Useful patterns:

- milestone capture;
- memory categories;
- player annotations and editable presentation;
- photographs or visual anchors where available;
- life-stage browsing.

Risk:

- automatic memory capture can become noisy, repetitive, or detached from later consequences. Memory retention should be significance-based, not merely trigger-based.

### Mount & Blade And Kenshi

These games often produce strong player-authored stories despite limited formal narration. Their lesson is that open-ended travel, recruitment, defeat, captivity, economic struggle, faction shifts, base building, and recovery can be narratively rich if the system preserves consequences.

Useful patterns:

- defeat, retreat, captivity, recovery, and rebuilding as legitimate story beats;
- regional movement and settlement relationships;
- gradual rise in reputation, wealth, force, or influence;
- self-directed goals and emergent rivalries.

Risk:

- the system may not know the player's actual goal. It should not claim ambition, vengeance, loyalty, or fear unless those are explicitly represented or player-authored.

### Battle Brothers

Battle Brothers gives individual mercenaries histories, injuries, traits, and obituaries. It demonstrates that concise commemoration can make loss meaningful.

Useful patterns:

- obituary or memorial treatment for death;
- injury and survival history;
- company or group chronology;
- selective highlighting of notable contributions;
- final run summaries.

Risk:

- formulaic obituaries can become repetitive. The system needs contribution-specific evidence and varied but restrained structures.

### Football Manager And Simulation News

Sports management games generate match reports, season summaries, transfer stories, records, and reputation narratives from structured facts. They demonstrate reliable factual text generation and the value of periodic editorial cadence.

Useful patterns:

- daily, weekly, seasonal, and career-level summary layers;
- record and trend detection;
- comparison to prior performance;
- headlines as navigation rather than full narrative;
- clear distinction between event data and presentation.

Risk:

- news-feed style is informative but can feel disposable. A living manuscript should use these techniques for summaries and appendices, not as its only voice.

### AI Dungeon And Open-Ended LLM Narrative

Open-ended language-model storytelling demonstrates flexibility but also repetition, contradiction, context loss, invented facts, unstable characterization, tonal drift, and accidental escalation. These are direct warnings for a long-running manuscript.

Useful patterns:

- natural transitions;
- varied phrasing;
- flexible scene and summary realization;
- user-selectable voice.

Required safeguards:

- retrieval from structured canonical facts;
- bounded narrative plans;
- explicit forbidden inferences;
- chapter summaries and continuity memory;
- validation against current world state;
- limited regeneration scope;
- no direct mutation of game canon.

### Tabletop Campaign Journals And Session Recaps

Campaign journals demonstrate human editorial practice: identify the session's decisive moments, group related events, omit table procedure, preserve unresolved hooks, and foreground character choices. Good recaps often include a short prior-context paragraph and a closing list of unresolved matters.

Useful patterns:

- arc-based summaries;
- named unresolved threads;
- player notes separate from narrator prose;
- selective quotation only when dialogue is recorded;
- periodic recap plus long-form chapter.

Risk:

- a single narrator can overstate consensus or assign motives to other players. The system should preserve ambiguity where the facts do not resolve it.

### Interactive Fiction And Narrative Generation Research

Interactive-fiction and natural-language-generation work emphasizes content determination, discourse planning, aggregation, referring-expression generation, and surface realization. The relevant lesson is architectural: decide what to say before deciding how to say it.

Useful patterns:

- content selection before prose;
- discourse planning across multiple threads;
- level-of-detail control;
- aggregation of repeated events;
- referent tracking and pronoun safety;
- state-aware description.

### Roguelike Morgue Files, Epitaphs, And Run Summaries

Roguelike summaries are compact, factual, and final. They often identify cause of death, milestones, possessions, enemies, score, and location.

Useful patterns:

- terminal summary or epitaph;
- compact achievement selection;
- cause-and-context reporting;
- final inventory or titles as appendices;
- run comparison.

Risk:

- a morgue file is not a manuscript. It is best used as a finale source and appendix model.

## 3. Core Design Principles For A Living Character Manuscript

### 3.1 Dual Model: Chronicle Outside, Event-Sourced Projection Inside

The player-facing concept should be a **Living Character Manuscript** or **Character Chronicle**. The internal conceptual model should be an **event-sourced narrative projection**.

This dual model avoids false choices among chronicle, biography, journal, saga, memoir, or quest-log expansion:

- **Chronicle** is the broad product family and connects to persistent history.
- **Manuscript** communicates polished readable prose and editorial structure.
- **Character biography** describes the subject but can imply posthumous completeness.
- **Campaign journal** suggests session-by-session logging and player notes.
- **Saga** is an optional tone, not the base model.
- **Player memoir** implies first-person interiority that may not be supported.
- **Quest-log expansion** is too narrow and mechanical.
- **Event-sourced narrative projection** is the correct design foundation but not the ideal player-facing name.

Recommended language:

- system/product: `Living Character Manuscript`;
- durable historical family: `Chronicle`;
- technical design description: `event-sourced narrative projection`;
- generated unit: chapter, section, scene, summary, interlude, entry, appendix record.

### 3.2 Facts First, Interpretation Second, Style Last

The system should decide:

1. what is canonically known;
2. what is narratively relevant;
3. how events relate;
4. how much detail they deserve;
5. what may be safely inferred;
6. how to express the result.

Language generation must not perform fact selection, causal inference, memory resolution, and stylistic embellishment in one unconstrained step.

### 3.3 Unequal Narrative Weight

Every event must not sound important. The prose should make clear distinctions among:

- life-changing turning point;
- major arc beat;
- supporting incident;
- routine period;
- background fact;
- omitted noise.

### 3.4 Consequence Over Activity

Actions become story when they change something: health, location, relationship, reputation, resources, obligations, goals, ownership, knowledge, status, identity, risk, or future possibility. Event selection should prioritize durable consequence and thread relevance over raw frequency.

### 3.5 Preserve Player Interpretation

The manuscript should describe choices and consequences without declaring unsupported motives. It may identify repeated observable patterns, but should qualify them as reputation, public perception, recorded tendency, or narrative theme rather than objective inner truth.

### 3.6 Respect Quiet Life

Routine work, travel, recovery, crafting, and domestic time should not vanish completely. They establish scale, livelihood, seasons, preparation, and contrast. They should usually appear as compressed passages rather than exhaustive scenes.

### 3.7 Continuity Is A First-Class Requirement

Continuity is not a final grammar check. It affects event selection, names, relationships, titles, injuries, possessions, unresolved threads, temporal order, point of view, and spoiler boundaries.

### 3.8 Generated Text Is Replaceable Presentation

Generated prose should be regenerable, revisable, and non-authoritative. Canonical events remain stable even when text changes. A player should be able to compare, edit, or regenerate presentation without changing gameplay truth.

## 4. Event Selection And Narrative-Weight Model

### 4.1 Treatment Classes

Each event or event cluster should receive one of five treatments:

| Treatment | Use | Typical size |
| --- | --- | --- |
| Scene | Turning point with supported actors, stakes, action, and consequence | Several paragraphs to a short section |
| Developed paragraph | Important event that needs context and outcome but not full dramatization | One to three paragraphs |
| Summary / montage | Repeated, extended, or lower-intensity activity with cumulative meaning | One paragraph or several sentences |
| Brief mention | Context, transition, minor consequence, or callback | Clause to one sentence |
| Omit | No durable consequence, novelty, thread relevance, or reader value | No manuscript text |

### 4.2 Narrative Weight Dimensions

A design-level scoring model should consider multiple dimensions rather than one global importance number:

- **consequence magnitude**: how much durable state changed;
- **irreversibility**: death, permanent injury, title loss, destruction, inheritance, unique choice;
- **goal relevance**: relation to explicit quest, player-marked goal, or unresolved thread;
- **relationship impact**: formation, rupture, rescue, betrayal, death, reunion, changed standing;
- **rarity and novelty**: first occurrence, unusual outcome, unique discovery;
- **risk and uncertainty**: danger, near failure, sacrifice, narrow escape;
- **world impact**: settlement, faction, institution, economy, route, property, or public state changed;
- **identity impact**: title, profession, reputation, mastery, affiliation, injury, moral-choice pattern;
- **callback value**: resolves or complicates an earlier event;
- **player emphasis**: pinned, annotated, included, excluded, or explicitly rated;
- **readability cost**: repetition, missing context, weak evidence, excessive detail;
- **spoiler or uncertainty risk**: hidden facts, ambiguous causality, unknown actors.

The score should inform treatment but not determine it alone. Editorial rules should override numerical weight where needed.

### 4.3 Events That Usually Deserve Scenes

- decisive moral or branching choices with known options and consequences;
- major quest climax, failure, abandonment with consequence, or unexpected resolution;
- named combat with major injury, death, retreat, rescue, capture, or world consequence;
- character death, near-death, retirement, succession, or irreversible departure;
- first encounter or major turning point in an important relationship;
- discovery of a place that changes goals, access, knowledge, danger, or ownership;
- creation, loss, recovery, or transfer of a uniquely significant object;
- acquisition or loss of title, property, institution, business, affiliation, or public standing;
- resolution of a long-running goal or thread;
- rare failure that changes the direction of play.

A scene still requires enough factual support. A major event with sparse data may receive a strong developed paragraph instead of fabricated dramatization.

### 4.4 Events That Usually Deserve Developed Paragraphs

- quest acceptance with real stakes and context;
- significant but non-climactic quest progress;
- important discovery without an encounter;
- meaningful trade, commission, construction, or craft result;
- reputation threshold or affiliation change;
- training milestone or mastery event;
- relocation, arrival, departure, or return with thread relevance;
- notable defeat or setback without permanent consequence;
- companion joining, leaving, or changing role when supported.

### 4.5 Events That Usually Deserve Summary

- extended travel without unique incidents;
- a season of farming, mining, crafting, trade, study, or service;
- repeated combat against the same threat class;
- repeated errands for the same goal or patron;
- preparation before a major event;
- recovery and downtime;
- gradual skill growth;
- recurring employment or business operation;
- multiple minor reputation changes that form a trend.

### 4.6 Events That Usually Deserve Omission

- interface actions;
- inventory sorting;
- repeated purchases with no consequence;
- routine rest with no recovery significance;
- pathfinding steps;
- duplicate notifications;
- minor resource gains and losses below narrative thresholds;
- repeated combat with no injury, novelty, risk, or consequence;
- accepted-and-immediately-completed mechanical errands with no relationship or world impact;
- events already fully represented by a stronger cluster summary.

### 4.7 Avoiding The “Then This Happened” Log

The system should build paragraphs around purpose and change, not chronology alone. Techniques include:

- cluster events by goal, place, relationship, or consequence;
- open with the situation or unresolved problem;
- combine repeated actions into one sentence;
- use causally supported transitions;
- end sections on consequence, decision, or changed condition;
- vary temporal distance;
- use callbacks to prior facts;
- avoid one sentence per event;
- avoid repeating the character's name as every sentence subject;
- reserve exact counts for meaningful records, costs, durations, or losses.

## 5. Repetition And Grind Compression Strategy

### 5.1 Compression Units

Routine activity should be aggregated into meaningful units:

- work shift;
- journey leg;
- training period;
- campaign phase;
- season;
- contract series;
- production run;
- recovery period;
- market cycle;
- repeated encounter family;
- preparation phase.

### 5.2 Compression Triggers

Compress when events share most of the following:

- same actor or group;
- same action family;
- same place or route;
- same goal or employer;
- no unique named consequence;
- no significant relationship change;
- no permanent injury or loss;
- low novelty;
- close temporal proximity;
- cumulative result can be expressed accurately.

### 5.3 Skip Triggers

Skip when the activity:

- produced no durable change;
- repeats already summarized information;
- exists only for mechanical pacing;
- has no reader-facing consequence;
- would interrupt a stronger arc;
- cannot be described without exposing internal mechanics or unsupported assumptions.

### 5.4 When Repetition Becomes Meaningful

Repetition merits narrative attention when it establishes:

- mastery or decline;
- livelihood or class identity;
- hardship, scarcity, or endurance;
- obsession or duty, only when supported by explicit goals or player framing;
- changing relationship through repeated cooperation;
- seasonal or regional rhythm;
- preparation for a later event;
- cumulative economic or world effect;
- escalating danger;
- contrast before disruption;
- a record, threshold, or public reputation.

### 5.5 Compression Forms

- **single-line omission bridge**: “The following days passed without incident.” Use sparingly.
- **montage sentence**: several repeated actions with one cumulative outcome.
- **period summary**: one paragraph covering days, weeks, or a season.
- **representative vignette**: one factually supported incident represents a larger repeated period, while the text explicitly frames it as representative rather than claiming all repetitions were identical.
- **before-and-after summary**: establish starting condition and resulting change.
- **record statement**: use counts or totals where the numbers themselves matter.

### 5.6 Anti-Grind Rules

- Do not narrate every resource unit, recipe action, training repetition, rest action, or routine encounter.
- Do not convert mechanical loops into false emotional drama.
- Do not use different adjectives to disguise repeated sentence structures.
- Do not preserve exact sequence when grouping improves clarity and does not alter causality.
- Do not omit the cost or consequence of routine work when that cost is narratively important.
- Do not let grind summaries overwhelm turning points in length.

## 6. Narrative Memory And Continuity Model

The manuscript needs a dedicated derived narrative-memory layer. This is not a substitute for canonical state. It is an editorial index that points to canonical facts and prior manuscript decisions.

### 6.1 Character Identity Memory

- names and supported aliases;
- lineage, family, parentage, and inheritance facts where canonical;
- titles, ranks, professions, affiliations, and public roles;
- persistent injuries, conditions, disabilities, scars, or losses when recorded;
- significant possessions and creations;
- home, property, estate, workplace, or base relationships;
- known skills, knowledge, magic, or mastery milestones;
- explicit long-term goals and player-marked priorities.

### 6.2 Relationship Memory

For each important actor or group:

- first meeting;
- relationship type if canonically represented;
- major shared events;
- current status;
- last meaningful interaction;
- unresolved obligation, conflict, promise, debt, or goal where recorded;
- death, departure, unknown status, or estrangement;
- public standing versus private relationship, if separately owned.

The manuscript must not infer friendship, romance, loyalty, rivalry, patronage, or kinship from proximity alone.

### 6.3 Thread Memory

- active goal;
- origin event;
- supporting events;
- current state;
- blockers;
- expected or possible resolution classes without predicting outcomes;
- linked actors, places, objects, and quests;
- manuscript mentions and last recap;
- closure event or abandoned state.

### 6.4 Place Memory

- canonical place identity and hierarchy;
- first discovery or first meaningful visit;
- important events at the place;
- property, service, affiliation, danger, or reputation connections;
- last known state;
- name changes or destruction only when canonical.

### 6.5 Reputation And Moral-Pattern Memory

The system may track repeated observable choices, but should distinguish:

- canonical standing values;
- public reputation labels;
- recorded choices;
- inferred narrative theme.

A theme such as “often chose mercy” may be used cautiously if based on multiple explicit choice outcomes. It should not become a canonical trait unless the game owns that trait.

### 6.6 Manuscript Continuity Memory

- current narrator voice;
- point of view and tense;
- style controls;
- established naming and title conventions;
- chapter summaries;
- unresolved narrative questions;
- prior metaphors or motifs to avoid overuse;
- recent sentence openings and transition patterns;
- facts already explained to avoid repetitive exposition;
- player edits and locked passages;
- spoiler horizon.

### 6.7 Memory Decay And Salience

Facts should not be deleted merely because they are old. Their active narrative salience may decrease. A later event should restore salience when it reopens a relationship, place, object, injury, or goal.

Recommended states:

- active thread;
- recently relevant;
- dormant but recallable;
- closed;
- historical appendix only;
- invalidated or corrected presentation, while preserving the canonical source record.

## 7. Prose Quality Standards And Editorial Rules

### 7.1 Baseline Standards

- correct grammar, spelling, punctuation, and paragraphing;
- consistent tense within a manuscript mode;
- consistent point of view;
- stable names, titles, and pronouns;
- clear temporal and spatial orientation;
- smooth but factual transitions;
- varied sentence length and structure;
- restrained figurative language;
- no mechanical field names or debug language in player prose;
- no unsupported dialogue;
- no accidental spoilers.

### 7.2 Recommended Default Voice

A restrained third-person past-tense chronicler is the safest default. It supports distance, summary, and scene narration without claiming first-person interiority.

Other modes may be offered as presentation controls:

- first-person memoir, only with stricter anti-interiority rules or player-authored notes;
- terse annals;
- grounded literary chronicle;
- heroic saga;
- somber or grim chronicle;
- official record;
- journalistic campaign history.

Tone changes should affect diction and rhythm, not facts, stakes, or moral judgment.

### 7.3 Scene Transitions

Transitions should state supported changes in:

- time;
- place;
- goal;
- actor focus;
- consequence;
- chapter or life stage.

Avoid chains of generic transitions such as “then,” “after that,” “soon,” and “meanwhile.” Repetition checks should operate across the full chapter, not only adjacent sentences.

### 7.4 Detail Control

- slow down for decisions, irreversible consequences, and relationship turning points;
- speed up for travel, routine work, repeated combat, and preparation;
- summarize when factual support is sparse;
- do not “show” details that were never recorded;
- use exact mechanical numbers only when meaningful to the reader;
- avoid describing ordinary actions with climactic language.

### 7.5 Melodrama And Purple-Prose Controls

- no destiny, fate, doom, sacred vow, hatred, love, terror, despair, or triumph unless supported by canon, explicit player framing, or the selected high-style mode with safe factual phrasing;
- no weather mirroring emotion unless weather is known and the wording does not claim causality;
- no universal claims such as “nothing would ever be the same” unless the state change supports them;
- no repeated epithets or ornamental adjectives;
- no automatic moral praise or condemnation.

### 7.6 Editorial Passes

Recommended passes:

1. factual coverage and source traceability;
2. chronology and causality;
3. continuity and referent resolution;
4. scene-versus-summary balance;
5. repetition and compression;
6. prose clarity and grammar;
7. tone and point-of-view consistency;
8. spoiler and knowledge-boundary check;
9. unsupported inference check;
10. chapter-level pacing and length check.

## 8. Canon, Inference, And Anti-Fabrication Rules

### 8.1 Three-Layer Truth Model

**Canonical facts**

- emitted or persisted gameplay events;
- authoritative current state;
- established authored content;
- explicit player-authored canonical choices where the project supports them.

**Safe literary connective tissue**

- chronological linking;
- neutral descriptions of time passage;
- spatial transitions supported by travel;
- aggregation of repeated actions;
- cautious restatement of observable consequences;
- references to prior supported facts;
- generic sensory language only when it does not assert specific unrecorded conditions.

**Non-canonical presentation**

- generated sentence form;
- chapter title;
- selected metaphor;
- narrator tone;
- ordering choices that preserve chronology and causality;
- player annotations;
- alternate regenerated wording.

### 8.2 Safe Inferences

Generally safe:

- “After several weeks of training” when timestamps and repeated training events support it;
- “The journey took them north” when route and destination support it;
- “The defeat ended the attempt” when the quest or encounter state confirms failure;
- “Their standing improved” when authoritative standing changed;
- “The work became routine” only as a presentation description of repeated low-variance actions, not an emotional claim.

Require caution:

- fatigue, relief, fear, grief, pride, resentment, loyalty, affection;
- causal claims among adjacent events;
- judgments about morality or competence;
- claims that an event was widely known;
- claims that a place or object was beautiful, cursed, sacred, or feared;
- claims about weather, crowd response, dialogue, gestures, or private thought.

Forbidden without explicit support:

- invented backstory;
- invented relationships;
- invented dialogue or promises;
- invented motives or emotions;
- invented witnesses;
- invented injuries, objects, places, organizations, laws, customs, or world events;
- hidden information unknown to the player character;
- future outcomes or foreshadowing that reveals hidden design;
- resurrection, survival, death, guilt, responsibility, or causality contrary to state.

### 8.3 Sentence-Level Provenance

A future design should support tracing factual claims in generated prose back to one or more canonical events or state records. Not every connective phrase needs a source id, but every entity, action, outcome, relationship, status, place, object, time claim, and causal claim should be supportable.

### 8.4 Uncertainty Language

Where state is ambiguous, the manuscript should preserve ambiguity:

- “was last seen” instead of “died”;
- “appeared to retreat” only if observation is partial;
- “the record does not say” in an official-record voice;
- omission rather than speculation when uncertainty adds no value.

## 9. Suggested Manuscript Structures And UI / Display Patterns

### 9.1 Recommended Hybrid Structure

Use a continuous book-and-chapter model with multiple navigational projections:

- primary readable manuscript;
- chapter table of contents;
- dated timeline;
- dramatis personae;
- place index;
- thread or quest-arc index;
- glossary of titles and affiliations;
- run-end or life-end epilogue;
- source-event inspection available in a debug or transparency view, not inside normal prose.

### 9.2 Chapter-Break Triggers

Potential triggers:

- major arc opening or resolution;
- long time skip;
- relocation to a new region;
- life-stage transition;
- title, affiliation, property, family, or profession transition;
- death, retirement, succession, or inheritance;
- major defeat or recovery;
- manuscript length threshold combined with a natural closure point.

Chapter breaks should not occur solely because an arbitrary number of events was reached.

### 9.3 Section Models

- **quest-arc sections** for coherent authored or emergent goals;
- **regional sections** for travel-heavy periods;
- **life-stage sections** for long campaigns;
- **thematic interludes** for work, study, recovery, business, family, or building periods;
- **dated annals** as a secondary view;
- **official records** or notices as optional inset documents when actual source records exist;
- **player notes** as visibly separate annotations.

### 9.4 Multiple Voices

Multiple voices can add value but create continuity and canon risk. Recommended hierarchy:

1. one primary narrator voice;
2. player notes clearly labeled as player-authored;
3. official-record excerpts only from canonical records;
4. NPC or companion voice only from recorded dialogue or authored text.

Do not generate invented witness testimony, letters, journal entries, or quotations.

### 9.5 UI Patterns

- book-like reading mode with generous paragraph spacing;
- chapter cards with date, place, and key actors;
- collapsed summaries for routine periods;
- expand-to-detail for source facts or alternate versions;
- pin, exclude, annotate, lock, and regenerate controls;
- clear labels for generated, player-edited, and canonical-source content;
- spoiler settings and mature-content controls;
- comparison view for regenerated text;
- export only from the presentation layer.

## 10. Player Agency And Editability Recommendations

### 10.1 Editing

Players should be able to edit manuscript prose. Edits should be stored separately from canonical facts and should not mutate game state.

Recommended states:

- generated draft;
- player-edited presentation;
- locked presentation;
- regenerated alternative;
- canonical-fact correction request, handled outside prose editing.

### 10.2 Canon Policy

Default:

- gameplay facts are canonical;
- generated prose is non-canonical presentation;
- player edits are private or shareable presentation;
- edits do not create relationships, achievements, titles, possessions, outcomes, or world facts.

A future project may introduce explicitly authored character notes or declarations, but that requires separate ownership and validation decisions.

### 10.3 Player Curation

Players should be able to:

- mark events important;
- suppress events;
- merge or split chapter suggestions;
- choose summary/detail level;
- add notes;
- lock accepted passages;
- regenerate only an unlocked section;
- choose whether failures and routine work receive more or less emphasis;
- select narrator settings.

Player curation should not be required for acceptable baseline output.

### 10.4 Tone And Output Controls

Recommended controls:

- maximum chapter or update length;
- detail level;
- tone preset;
- point of view;
- tense;
- violence detail;
- romance and family detail;
- mature-content boundary;
- spoiler horizon;
- update cadence;
- chapter-break sensitivity;
- grind-compression strength;
- dialogue policy;
- use of exact dates and numbers;
- narrator certainty level.

Controls must never authorize invention of facts.

## 11. Design-Level Architecture Recommendation

### 11.1 Layered Pipeline

1. **Canonical event and state sources**
   - authoritative gameplay events and snapshots;
   - authored content identities;
   - player-marked narrative preferences.

2. **Narrative eligibility filter**
   - determines which event families may feed the manuscript;
   - applies spoiler, maturity, privacy, and owner-readiness rules.

3. **Importance and treatment analysis**
   - scores consequence, novelty, thread relevance, and reader value;
   - assigns candidate treatment.

4. **Event clustering and threading**
   - groups by goal, quest, relationship, place, time, cause, or consequence;
   - keeps parallel threads distinguishable.

5. **Repetition compression**
   - detects repeated action families and creates supported aggregate facts.

6. **Narrative memory projection**
   - maintains active threads, relationships, titles, injuries, locations, possessions, and prior chapter summaries;
   - points back to canonical sources.

7. **Discourse plan**
   - determines chapter structure, scene order, summary placement, transitions, callbacks, and omissions.

8. **Fact envelope for generation**
   - supplies only approved facts, allowed connective operations, voice controls, and forbidden claims.

9. **Prose drafting**
   - template, grammar, or language-model realization within the fact envelope.

10. **Editorial quality pass**
    - grammar, flow, repetition, pacing, transition, and tone.

11. **Continuity and anti-fabrication validation**
    - checks names, status, chronology, relationships, current state, spoiler boundaries, and claim provenance.

12. **Manuscript storage and revision**
    - stores generated text, chapter summaries, provenance, revision history, player edits, locks, and regeneration metadata separately from canonical facts.

13. **Player-facing projections**
    - book view, timeline, indexes, run-end summary, and transparency/debug view.

### 11.2 What Should Be Stored

Store durably:

- canonical immutable or append-only event history needed for reconstruction;
- authoritative current state and stable authored references;
- curated story beats or event-cluster decisions where deterministic reconstruction is not guaranteed;
- narrative memory facts with source links;
- chapter summaries;
- generated manuscript versions;
- player edits and lock state;
- revision and regeneration history;
- narrator/output settings;
- inclusion/exclusion preferences;
- provenance mapping.

Generate or regenerate:

- sentence wording;
- transitions;
- chapter titles;
- paragraph structure;
- alternate tone versions;
- non-canonical descriptive connective tissue.

Never rely only on generated text to preserve canonical gameplay facts.

### 11.3 Update Cadence

Do not regenerate after every minor action. Candidate moments:

- when the player opens the manuscript;
- after a major arc beat;
- at rest, settlement return, save, chapter boundary, season boundary, or session end;
- at run end, retirement, death, or archival transition;
- on explicit player request.

The design should support deferred generation without losing facts.

## 12. Pitfalls And Mitigations

| Pitfall | Mitigation |
| --- | --- |
| Mechanical recap | Plan around goals, consequences, and threads; do not map one sentence to one event. |
| Exhaustive log | Use treatment classes, thresholds, omission, and chapter length budgets. |
| Overwriting player interpretation | Avoid unsupported motive/emotion; expose tone and curation controls. |
| Fabricated canon | Fact envelopes, provenance, explicit inference policy, validation. |
| Tonal inconsistency | Stable voice profile and chapter-level editorial pass. |
| Purple prose | Restrained default voice, intensity tied to event weight, banned cliché checks. |
| Repetitive transitions | Chapter-level repetition analysis and varied discourse structures. |
| Grind overload | Aggregate by period, goal, result, and consequence; omit unchanged loops. |
| Ignored consequences | Score durable state changes and reopen prior threads when affected. |
| Forgotten relationships | Structured relationship memory with current status and source links. |
| Spoilers | Player-knowledge horizon and hidden-state filtering before generation. |
| Equal importance | Explicit treatment classes and event-weight contrast. |
| Walls of text | Chapter/section budgets, whitespace, collapsible routine summaries, indexes. |
| Contradicting state | Validate against current state and chronology before publication. |
| Hallucinated dialogue | Use only recorded or authored dialogue; otherwise paraphrase actions. |
| Unstable long-term voice | Persist narrator settings, chapter summaries, terminology, and locked text. |
| Regeneration destroys edits | Separate generated and player-edited layers; regenerate unlocked scopes only. |
| Hidden mechanical authority | Generated text never grants, mutates, unlocks, or resolves gameplay state. |
| False causality | Require explicit or strongly supported causal links; otherwise use chronology only. |
| Every failure becomes tragedy | Scale language to actual consequence and player-selected tone. |
| Every victory becomes heroism | Describe outcome and public standing without automatic moral praise. |

## 13. Specific Recommendations For Lineage: Reforged

These recommendations require live-repository reconciliation before promotion.

### 13.1 Ownership Placement

The manuscript should be a separate **Story / Manuscript projection layer** that consumes authoritative sources. It should not be embedded as prose inside quest definitions, account records, or UI components.

Likely ownership relationships:

- account/save state owns durable character/run identity and persistence;
- runtime event systems own emitted gameplay facts;
- quest history owns accepted, completed, failed, abandoned, and branching outcomes;
- character history owns injuries, titles, skills, affiliations, possessions, and relevant progression facts;
- world and relationship systems own current canonical state;
- Chronicle/manuscript layer owns curation, clustering, narrative memory, generated text, chapter summaries, revisions, and presentation settings;
- UI owns display and edit interaction, not fact generation or canonical mutation.

### 13.2 Canonical Versus Generated

Canonical:

- authored content and identities;
- authoritative gameplay outcomes;
- persisted state;
- explicit player choices and edits only where a future owner deliberately treats them as canonical.

Non-canonical presentation:

- prose;
- chapter titles;
- transitions;
- narrator voice;
- literary compression;
- player manuscript edits by default.

### 13.3 Systems That May Feed It Later

Only after each has stable authority and history:

- quest acceptance, progress, outcomes, failure, abandonment, and choices;
- travel, arrival, discovery, and location history;
- combat outcomes, injuries, retreats, defeats, death, and recovery;
- relationships and recurring actors;
- reputation and standing;
- property, estate, business, employment, storage, inheritance, and ownership;
- crafting and significant creations;
- trade and economic milestones;
- guild, faction, institution, polity, service, and legal interactions;
- family, lineage, companions, rivals, patrons, and succession;
- Knowledge, training, magic study, trials, and progression;
- world changes caused or witnessed by the character.

### 13.4 Systems That Should Not Feed It Yet

Do not feed unstable, inferred, placeholder, demo-only, presentation-only, or synthetic data as canon. Avoid broad ingestion from:

- UI text;
- generated labels without stable identity;
- debug logs;
- test fixtures;
- prose-only mentions;
- unowned relationship implications;
- unresolved office, force, government, jurisdiction, law, People/NPC, faction, institution, or business candidates;
- future systems without persisted outcomes;
- hidden state beyond the character's knowledge.

### 13.5 Runtime Deferral

Do not implement a live generator until the project has:

- stable event ownership and identifiers;
- adequate persisted history;
- authoritative quest outcome history;
- stable character and relationship identities;
- clear current-state and historical-state boundaries;
- save and revision ownership;
- spoiler/knowledge boundaries;
- a deterministic fallback for prose-generation failure;
- quality evaluation criteria.

### 13.6 Docs-First Route

1. reconcile this research against current repository owners;
2. create a permanent Living Character Manuscript design boundary;
3. define vocabulary: event, beat, cluster, thread, scene, summary, chapter, manuscript, Chronicle, canonical fact, presentation inference;
4. map current and missing source owners;
5. define event eligibility and anti-fabrication rules;
6. define sample fact envelopes and manually authored output examples using clearly hypothetical, non-canonical fixtures;
7. define a future data-retention decision without final schemas;
8. define UI and editability boundaries;
9. define readiness gates for a later offline prototype;
10. keep runtime implementation out of the current maturity phase unless separately approved.

## 14. Proposed Future Roadmap Sequence

This sequence is advisory research output, not an approved numbered roadmap.

### Phase A: Durable Documentation

1. Living Character Manuscript research integration and live-repo source reconciliation.
2. Story / Chronicle / Manuscript vocabulary and ownership boundary decision.
3. Existing event-history and narrative-source audit.
4. Canon, inference, spoiler, and provenance policy.
5. Event selection, weight, clustering, and compression design.
6. Narrative memory and continuity design.
7. Prose style, editorial, and quality-evaluation guide.
8. Player editability and presentation-state boundary.
9. Manuscript structure and UI information-architecture plan.

### Phase B: Readiness And Offline Prototyping

10. Historical-event retention and reconstruction requirements plan.
11. Hypothetical fixture corpus and human-written target chapters.
12. Offline event-to-outline prototype plan.
13. Offline outline-to-prose comparison using templates and constrained language-model generation.
14. Evaluation rubric for factuality, continuity, compression, readability, tone, and player preference.
15. Storage/revision boundary decision.

### Phase C: Runtime Candidate Planning

Only after runtime maturity:

16. event eligibility adapter plan;
17. narrative-memory projection plan;
18. bounded chapter-generation contract;
19. continuity/provenance validator plan;
20. read-only manuscript projection;
21. player edit and revision projection;
22. narrow opt-in runtime generation pilot.

No phase should be treated as automatic authorization for the next.

## 15. Open Questions Before Implementation

### Product And Voice

- Is the player-facing name Story, Chronicle, Manuscript, Life, Saga, or another term?
- Is there one primary narrator or several selectable voices?
- Is third-person past tense the required default?
- Should the manuscript cover one character, one run, one lineage, or provide separate layers for each?
- How should active-character text differ from posthumous biography?

### Canon And Agency

- Can any player-authored manuscript edit become canonical, and through what explicit owner?
- Should player annotations be private, exportable, or shareable?
- Can players mark goals or motives that the manuscript may treat as first-person truth?
- How should corrections to canonical facts be distinguished from prose edits?

### Event Sources

- Which current event and history sources are sufficiently authoritative?
- What history is currently lost and cannot be reconstructed?
- Which systems need stable identities before manuscript ingestion?
- How should repeated generated offers, encounters, and minor transactions be grouped?
- How should abandonment, timeout, refusal, and silent non-completion differ?

### Memory And Continuity

- How long should active memory remain salient?
- What belongs in character, relationship, thread, place, and manuscript memory?
- How should retcons, corrected content, or invalidated state be represented?
- How should titles, aliases, and renamed places be handled over time?

### Prose And Quality

- What quality threshold blocks publication of a generated chapter?
- What deterministic fallback exists when generation or validation fails?
- How many tone presets are worth maintaining and testing?
- How should localization preserve style and anti-fabrication guarantees?
- How should chapter length budgets respond to unusually eventful periods?

### Privacy, Safety, And Content Controls

- What mature-content categories need explicit controls?
- How should romance, family, death, injury, crime, punishment, and violence detail be bounded?
- Can players exclude sensitive categories from narrative treatment while retaining canonical history?
- How should hidden information and spoiler horizons be represented?

### Storage And Performance

- Which facts must be retained indefinitely?
- Can chapters be reconstructed deterministically from events and settings?
- Which generated versions and provenance maps should be retained?
- When should regeneration occur, and what is the compute budget?
- How are locked player edits preserved across new chapters and style changes?

### Evaluation

- What human evaluation rubric measures factuality, continuity, readability, pacing, compression, tone, and player ownership?
- What automated checks can detect unsupported facts, contradictions, repeated phrasing, and chronology errors?
- What sample play histories represent quiet lives, grind-heavy lives, short failed runs, long dynastic careers, morally inconsistent choices, and heavily edited manuscripts?

## Source Notes

The research synthesis drew on the following examples and discussions. These sources are evidence and inspiration, not Lineage canon or implementation authority.

- Dwarf Fortress Wiki, “Legends”: https://dwarffortresswiki.org/Legends
- Zayd Qazi, “The Story Generator: A Game Design Analysis of RimWorld”: https://zaydqazi.substack.com/p/the-story-generator-a-game-design
- Vice, “Wildermyth Embraces Storytelling Traditions in a Procedural Narrative”: https://www.vice.com/en/article/wildermyth-review/
- The Sims Wiki, “Memories”: https://sims.fandom.com/wiki/Memories
- RPGFan, “Battle Brothers Review”: https://www.rpgfan.com/review/battle-brothers/
- New to Narrative, “Procedural Narrative and How to Make It Coherent”: https://newtonarrative.com/blog/procedural-narrative-and-how-to-keep-it-coherent/
- Emily Short, “AI Research on Dialogue and Story Generation”: https://emshort.blog/2018/10/16/mailbag-ai-research-on-dialogue-and-story-generation/
- Game Developer, “What’s the Difference Between Procedural Narrative and Emergent Narrative?”: https://www.gamedeveloper.com/design/what-s-the-difference-between-procedural-narrative-and-emergent-narrative-
- Pablo Gervás et al., “From the Event Log of a Social Simulation to Narrative Discourse: Content Planning in Story Generation”: https://www.academia.edu/58855758/From_the_event_log_of_a_social_simulation_to_narrative_discourse_Content_planning_in_story_generation

## Consumption Requirement

The consuming Codex integration pass must:

- inspect current repository owners and correct stale assumptions;
- promote durable guidance into permanent design documentation;
- update the centralized roadmap, sequence, backlog, handoff, and prompt as warranted;
- keep generated prose presentation-only;
- preserve the canonical-fact versus literary-text boundary;
- make an explicit decision to delete this temporary artifact if fully consumed, or retain it only with one named next consumer and removal condition;
- implement no runtime, schema, content, validator, test, UI, save/account, or gameplay change.