# Living Character Manuscript Design Boundary

Version: `Version 0.5.344.1 - Living Character Manuscript Research Integration`
Date: 2026-07-12
Status: approved documentation-only design boundary; no schema, retention, generation, UI, storage, or runtime permission

## 1. Executive Decision

Use **Living Character Manuscript** as the player-facing term and **event-sourced narrative projection** as the technical design description. Place it within the broader Chronicle product family without renaming or replacing any current Chronicle owner.

The future manuscript is a derived editorial presentation of authoritative history. It may select, cluster, compress, arrange, summarize, and narrate supported facts. It must not become the owner of gameplay facts, reconstruct facts from prose, or mutate gameplay state. Generated wording, chapter titles, transitions, narrator tone, compression choices, regenerated variants, and player prose edits remain non-canonical presentation by default.

The live repository is not ready for implementation. It has useful current-state, discovery, session-feed, and run-end sources, but no durable general event history, complete quest-outcome history, narrative provenance owner, relationship history, or manuscript persistence owner. Research completion therefore authorizes only this durable boundary and a gated docs-first future sequence.

## 2. Conceptual And Vocabulary Model

- **Story** is a broad design concept, not a new authority name.
- **Chronicle** is the existing product and persistence family for session feeds, discovery records, account run history, and their projections. Those distinct owners remain intact.
- **Living Character Manuscript** is the future player-facing readable work about one character or run.
- **Event-sourced narrative projection** is the technical model: retained authoritative facts feed a replaceable narrative presentation.
- **Character biography** describes subject matter, but implies completeness and is better suited to a terminal or archival view.
- **Campaign journal** is a player-note or session-recap mode, not the manuscript owner.
- **Saga** and **memoir** are optional presentation voices. Memoir cannot license unsupported first-person interiority.
- **Quest log** remains current quest state/presentation and is only one possible future source.
- **Event** is an authoritative occurrence emitted or retained by its owning system.
- **Beat** is a manuscript-eligible fact or supported fact group.
- **Cluster** groups related beats without transferring fact ownership.
- **Thread** tracks a source-linked goal, relationship, place, object, or consequence across time.
- **Scene**, **developed paragraph**, **summary/montage**, **brief mention**, and **omission** are editorial treatments.
- **Chapter** is a presentation grouping with a supported temporal or thematic boundary.

## 3. Live Repository Ownership Map And Gaps

| Current source | Live owner and useful evidence | Manuscript posture | Current gap |
| --- | --- | --- | --- |
| Authored quests | `civilization.quest_definitions`, `quest_archetypes`, and `quest_templates` own authored identity and descriptive structure. | May later supply names and authored context when linked to a retained outcome. | Definitions and templates do not prove that a player experienced or resolved them. |
| Generated quest offers | `CivilizationState.quests.activeOffers` owns current generated offers. | Current offer context only after an eligibility and retention decision. | No complete accepted, failed, abandoned, expired, branch-choice, consequence, or historical offer record. |
| Player quest ids and journal | `PlayerState.activeQuestIds` / `completedQuestIds` and session `QuestJournalEntryState[]` own current mutable quest/journal views. | Insufficient as a general manuscript history source. | Journal entries are UI-ready strings without authoritative event provenance, chronology, branch history, or durable outcome envelopes. |
| Session Chronicle | `SessionState.chronicle` stores `ChronicleEventState[]`; current gameplay code appends UI-ready summaries. | Presentation/source hint only until a dedicated authority and retention audit proves eligible fields. | The feed is capped to 48 entries, uses prose labels and string arrays, and is not an immutable canonical event log. |
| Discovery Chronicle | `PlayerState.discoveryChronicle` owns persisted discovery entries with tick, source type/id, region label, and notes. | A promising narrow future source after identity, visibility, and provenance checks. | Limited categories and presentation labels; not a general world-history or place-history owner. |
| Shared engine events | `GameEventEnvelope`, `TickResult.emittedEvents`, and the shared event vocabulary own emitted runtime facts at their current seams. | Candidate factual input only after stable identifiers, payload contracts, eligibility, and durable retention exist. | No general append-only historical store; current event ids/payloads were not designed as manuscript provenance. |
| Save snapshot | `SaveSnapshot` persists current game, player, world, civilization, and session state. | May confirm current authoritative state and knowledge horizon. | A current snapshot does not prove prior transitions or historical causality and cannot replace retained events. |
| Account run history | `AccountRunHistoryRecord` owns durable run identity, outcome, selected achievements, stored payout metadata, duration, continuity links, and origin fields. | Safe limited source for terminal/run-level facts subject to lifecycle authority helpers. | Sparse summary, not a character-life event history; deleted and non-authoritative records require explicit handling. |
| Run-end Chronicle projection | `chronicleRunEndSummaryPresentation.ts` derives a read-only view from run history and account state. | Presentation precedent only; its source records may be read through their owners. | Projection labels and rows are not new canonical facts and cannot be re-ingested as evidence. |
| Account Chronicle UI | `accountMetaPresentation.ts` and related UI render run-history and estate projections. | Display only. | UI copy, filters, inferred labels, and tiles are not canonical manuscript sources. |
| Runtime gameplay loop | Current UI/game-shell orchestration mutates quest, discovery, session Chronicle, and other state. | Existing owners remain authoritative for behavior they currently perform. | UI-authored/demo orchestration and incomplete history retention make broad ingestion unsafe before the `0.6.x` ownership transition. |

No parallel manuscript owner may duplicate quest outcomes, discoveries, combat results, relationships, reputation, titles, injuries, property, family, inheritance, Knowledge, magic, law, faction, institution, business, or world state. The manuscript may later reference those owners only through approved historical facts.

## 4. Canonical Fact And Presentation Boundary

Three layers are required:

1. **Canonical fact**: established authored identity, authoritative emitted-and-retained gameplay occurrence, authoritative persisted state, or an explicitly owned player declaration.
2. **Safe connective operation**: chronology-preserving linkage, supported time passage, supported spatial transition, aggregation of repeated facts, cautious consequence restatement, or neutral reference to an earlier fact.
3. **Non-canonical presentation**: wording, paragraphing, chapter title, narrator voice, literary compression, metaphor, ordering that preserves chronology/causality, annotation, and regenerated or player-edited prose.

Current-state evidence must not be rewritten as a historical transition without a retained source. Adjacent events do not establish causality. UI strings, debug logs, test fixtures, generated labels, synthetic ids, prose-only mentions, and the current session Chronicle summaries must not be promoted to canonical facts by repetition.

Every factual claim in future manuscript output must be traceable at design level to one or more eligible authoritative records. Connective phrases need not each carry an id, but named entities, actions, outcomes, relationships, status, place, object, time, and causal claims must be supportable.

Unsupported backstory, relationships, dialogue, promises, motives, emotions, witnesses, injuries, objects, places, organizations, laws, customs, weather, crowd response, hidden information, causality, survival/death, and future outcomes are forbidden. When evidence is incomplete, preserve ambiguity or omit the claim.

Manuscript text and player edits must never grant, resolve, unlock, mutate, reward, punish, reveal hidden state, or persist gameplay outcomes.

## 5. Event Eligibility And Narrative Treatment

Eligibility precedes importance. An event family may feed the manuscript only when its owner provides stable identity, durable history, knowledge/spoiler classification, sufficient provenance, and a validated mapping to readable facts. An important but ineligible event must be omitted rather than guessed.

Eligible beats or clusters receive one treatment:

| Treatment | Use |
| --- | --- |
| Scene | Supported turning point with enough actors, stakes, action, and consequence for several paragraphs. |
| Developed paragraph | Important event with clear context and outcome but insufficient evidence or need for dramatization. |
| Summary / montage | Repeated or extended activity whose cumulative result matters. |
| Brief mention | Context, transition, minor consequence, or callback. |
| Omit | No durable consequence, novelty, supported thread relevance, or reader value. |

Narrative weight considers consequence magnitude, irreversibility, explicit goal relevance, relationship impact, novelty, supported risk, world impact, identity impact, callback value, player emphasis, readability cost, and spoiler/uncertainty risk. This is a design vocabulary, not an approved formula.

Full scenes are reserved for well-supported turning points. Sparse major events should receive a factual paragraph rather than fabricated sensory detail or dialogue. Quiet life remains visible through proportionate summaries when it establishes livelihood, preparation, seasonal rhythm, recovery, or contrast.

## 6. Clustering And Repetition Compression

Cluster by one or more supported dimensions: goal, quest, relationship, place, time window, explicit cause, or consequence. Keep simultaneous threads distinguishable and never reorder events in a way that changes chronology or causal meaning.

Mining, crafting, farming, gathering, trading, resting, travel, training, routine combat, and errands should normally be compressed or omitted. Aggregate them into a work shift, journey leg, training period, campaign phase, season, contract series, production run, recovery period, market cycle, repeated encounter family, or preparation phase when actor, action family, place/route, and goal align and no unique consequence intervenes.

Repetition becomes narratively meaningful only when authoritative evidence supports mastery or decline, livelihood, hardship or endurance, an explicit goal or player-framed duty, relationship change, seasonal rhythm, later preparation, cumulative economic/world effect, escalating danger, contrast, a threshold, or public reputation. Mechanical loops must not be converted into false emotional drama.

Use supported montage, period summary, representative vignette clearly labeled as representative, before-and-after comparison, or meaningful totals. Grind summaries must remain shorter than the turning points they contextualize.

## 7. Narrative Memory And Continuity

Future narrative memory is a derived, source-linked editorial index, not canonical state. It may cache:

- supported character identity, aliases, titles, roles, affiliations, injuries, losses, possessions, locations, skills, and explicit goals;
- canonical relationship type/status, first and last meaningful interactions, shared events, and unresolved recorded obligations;
- thread origin, active state, blockers, linked actors/places/objects/quests, prior mentions, and closure;
- place hierarchy, discovery/visit evidence, significant events, and owned connections;
- canonical standing, public reputation, recorded choices, and cautiously labeled narrative patterns;
- prior chapter summaries, point of view, tense, terminology, player edits, locks, spoiler horizon, recent phrasing, and unresolved narrative questions.

It must not infer friendship, romance, loyalty, rivalry, kinship, patronage, moral identity, or motivation from proximity or repeated co-occurrence. A narrative theme remains presentation unless a gameplay owner defines the trait.

Salience may move among active, recent, dormant-but-recallable, closed, appendix-only, and corrected-presentation states. Source facts are not deleted merely because editorial salience decreases.

## 8. Prose And Editorial Quality

The safe default is restrained third-person past tense. It supports scene and summary without claiming first-person interiority. Optional terse annals, grounded chronicle, official record, somber, or saga-like modes may change diction and rhythm only; they must not change facts, stakes, causality, certainty, or moral judgment.

Require consistent tense, point of view, names, titles, pronouns, temporal/spatial orientation, and terminology. Slow down for supported decisions and irreversible consequences; speed up for routine work, travel, recovery, preparation, and repeated combat. When factual support is sparse, summarize.

Forbid automatic destiny/fate language, unsupported emotion, weather-as-emotion, universal consequence claims, invented quotations, ornamental epithets, and automatic praise or condemnation. Avoid mechanical field names in player prose.

Before publication, future output needs separate checks for factual traceability, chronology/causality, continuity/referents, treatment balance, repetition/compression, clarity/grammar, voice consistency, spoiler/knowledge boundaries, unsupported inference, and chapter pacing/length. Failure must produce a deterministic factual fallback or no new prose, never unconstrained repair.

## 9. Manuscript And Navigation Structure

The preferred future structure is one readable book-and-chapter manuscript with secondary projections:

- chapter table of contents;
- dated timeline;
- dramatis personae only from canonical people/relationship sources;
- place index;
- quest/thread index;
- title and affiliation glossary;
- run-end or life-end epilogue;
- visibly separate player notes;
- source/provenance inspection in a transparency or debug view, not embedded in ordinary prose.

Chapter boundaries require a natural closure: arc opening/resolution, supported long time skip, regional relocation, life-stage change, title/affiliation/property/family/profession transition, death/retirement/succession, major defeat/recovery, or a length threshold paired with a real closure point. Event count alone is not a valid chapter boundary.

Official-record excerpts require actual authored or retained record text. NPC testimony, letters, diary entries, and quotations must not be generated as if witnessed.

## 10. Player Agency And Output Controls

Future players may include/exclude or emphasize eligible events, annotate, merge/split suggested chapters, select detail and compression, choose voice/point-of-view/tense, control violence/romance-family/mature-content detail and spoiler horizon, set cadence and chapter sensitivity, lock accepted passages, compare variants, and regenerate an unlocked scope.

Baseline output must not depend on manual curation. Controls affect selection and presentation within the eligible fact envelope; they never authorize invention or hidden-state disclosure.

Keep generated draft, generated variant, player-edited presentation, locked presentation, annotation, and canonical-fact correction request distinct. A prose edit is not a fact correction and is non-canonical by default. Any future player-authored canonical declaration needs a separate owner, validation policy, and explicit project decision.

## 11. Stored Versus Generated Boundary

This section defines design categories, not final schemas.

Retain through their proper owners:

- canonical events/history required for reconstruction;
- authoritative state and authored references;
- curated eligible beats or cluster decisions when deterministic reconstruction cannot be guaranteed;
- source-linked narrative memory and chapter summaries;
- generated versions and their provenance maps;
- player edits, annotations, locks, inclusion/exclusion choices, and output settings;
- revision/regeneration history.

Regenerate only presentation: sentence wording, transitions, paragraph structure, chapter titles, alternate tone, and allowed connective tissue. Never rely on generated text as the sole preservation of a gameplay fact.

Generation cadence is a later policy. Reasonable candidate boundaries include explicit open/request, supported major arc beat, rest/settlement return, save/session/chapter/season boundary, or terminal run transition. Facts must be retained even when prose generation is deferred or unavailable.

## 12. Source Readiness Gates

A source family is eligible only after all applicable gates pass:

1. authoritative static and runtime owners are named;
2. stable entity/event ids and factual payload semantics exist;
3. relevant history is durably retained, not merely visible in current state or UI;
4. chronology, outcome, uncertainty, and current-versus-historical state are explicit;
5. player-knowledge/spoiler and sensitive-content boundaries exist;
6. provenance can trace output claims to sources;
7. save/account ownership and revision behavior are decided;
8. a deterministic fallback and quality-evaluation threshold exist;
9. focused tests can prove no canonical mutation and no unsupported claims.

The current session Chronicle feed, quest-journal prose, UI labels, generated offers, shared emitted events without retention, and save snapshots without transition history do not pass these gates as broad manuscript inputs.

Do not ingest unresolved or inferred People/NPC, relationship, office, force, government, jurisdiction, law, faction, institution, business, property, inheritance, reputation, combat-history, or magic-history facts. Do not ingest debug logs, fixtures, demo-only strings, synthetic projections, hidden state, or generated prose.

## 13. Docs-First Future Sequence

The future lane remains gated and does not displace the active authority queue. Each step requires separate approval:

1. vocabulary and owner map maintenance as source systems mature;
2. focused historical-source and retention audit;
3. canon, inference, provenance, uncertainty, spoiler, privacy, and knowledge policy;
4. event eligibility, treatment, clustering, and compression design;
5. narrative-memory and continuity design;
6. prose/editorial style and measurable quality rubric;
7. player editability and presentation-state boundary;
8. manuscript information architecture and accessibility plan;
9. historical-retention and reconstruction requirements plan;
10. explicitly hypothetical fixture corpus and human-written targets;
11. offline event-to-outline prototype decision;
12. offline constrained realization and evaluation decision;
13. storage/revision boundary decision;
14. runtime readiness decision before any adapter, generator, validator, UI, or opt-in pilot.

No item automatically authorizes the next. Runtime manuscript work remains outside the current `0.5.x` stabilization scope.

## 14. Pitfalls And Required Mitigations

| Risk | Required mitigation |
| --- | --- |
| Mechanical recap or exhaustive log | Select by supported consequence/thread relevance; enforce treatment and length budgets. |
| Fabricated canon or false causality | Fact envelopes, source provenance, explicit inference policy, uncertainty, and validation. |
| Overwriting player interpretation | Avoid motives/emotions and moral verdicts; expose safe curation controls. |
| Grind overload or equal importance | Cluster, compress, omit, and preserve strong contrast around turning points. |
| Forgotten continuity | Source-linked memory for active/dormant threads, actors, places, objects, and prior summaries. |
| Spoilers or hidden-state leaks | Filter by player knowledge before selection and generation. |
| Repetitive or purple prose | Restrained default, chapter-level editorial passes, and deterministic factual fallback. |
| Contradicting current state | Validate chronology and state at publication time without rewriting source history. |
| Regeneration destroys edits | Separate variants, player edits, annotations, and locked scopes. |
| Hidden mechanical authority | One-way projection only; no commands, grants, rewards, resolutions, or state mutation. |
| Presentation recirculated as fact | Never treat Chronicle summaries, UI labels, manuscript prose, or projections as source evidence. |

## 15. Open Questions Before Implementation

- Is the primary manuscript scoped to one character, one run, or a character view plus separate lineage/account volumes?
- Is restrained third-person past tense mandatory, and which additional voices are worth validating?
- Can a future explicit player declaration of goal or motive become canonical, and which owner validates it?
- Which current emitted event families deserve durable history, and what must be added for quest choices, failure, abandonment, relationship change, injury, recovery, property, and world consequence?
- How are corrected/invalidated facts, renamed entities, retcons, partial observations, and deleted run records represented?
- What is the player-knowledge model and spoiler horizon for witnessed, learned, rumored, and hidden information?
- Which sensitive-content categories and accessibility/localization requirements are mandatory?
- What factuality, continuity, compression, readability, and tone thresholds block publication?
- What deterministic fallback is used when generation or validation fails?
- Which canonical records, clusters, summaries, versions, provenance maps, and edits are retained, and for how long?
- What compute, storage, regeneration, export, privacy, and sharing policies apply?

## 16. Research Consumption And Cleanup

This boundary consumed the useful owner-aware guidance from `docs/dev/tmp-living-character-manuscript-research-2026-07-12.md` and corrected it against live repository sources. The temporary artifact is deleted in this run so it cannot remain a parallel authority.

`docs/design/living-character-manuscript-research-intake-route.md` remains as a compact historical intake and consumption record. This document is the durable manuscript design authority. It provides no implementation permission.
