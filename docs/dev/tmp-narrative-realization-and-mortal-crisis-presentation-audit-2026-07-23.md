# Narrative Realization And Mortal Crisis Presentation Audit

Date: 2026-07-23

Run: `Narrative Realization, Mortal Crisis Presentation, And Elemental Ecology Repository Audit And Contract Planning`

Classification: unversioned large documentation-only repository audit and contract planning

Status: audit complete; no design contract or implementation is accepted

## 1. Execution And Repository-State Confirmation

- Branch: `master`.
- First observed commit: `d2dff9fdf2b35206b5d7be91716aa614640f1ff3`.
- Fetch/prune and fast-forward pull: successful; pre-edit commit became `8bd6ddecf3714da9c222d71b61f9af06953a6395`.
- Starting worktree: clean.
- The post-pull active prompt is this audit.
- Comparative research commit `d2dff9fdf2b35206b5d7be91716aa614640f1ff3` is an ancestor of `HEAD`.
- Comparative research artifact matches required blob `26ce50958f348f316ab98bcafe31282393709fd6`.
- The comparative research output at its source commit matches `e996fd61903431b4fd364b82ed2490e6dae6270a`.
- The accepted defeat-fallback decision and worktree file match `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`.
- Held `0.6.6` remains recoverable as blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- No external research was used. Repository terms were sufficient.

## 2. Source And Authority Inventory

| Source or consumer | Live owner / representative symbol | Facts consumed | Deterministic / retained | Mortal Crisis fitness |
| --- | --- | --- | --- | --- |
| Shared events | `packages/shared/types/src/contracts.ts` — `GameEventEnvelope`; `packages/shared/events/src/index.ts` — `createEvent` | Typed name, domain, tick, unstructured payload | Deterministic id from type/domain/tick; emitted but no general durable ledger | Useful envelope seed, but ids can collide for multiple same-type events in one tick and payload semantics are not sufficient |
| Combat | `packages/shared/types/src/combat.ts`; `packages/engines/game-engine/src/combat/index.ts` | Combatants, actions, source item/spell metadata, HP/status, encounter area/outcome | Deterministic current encounter; only 24 outcome summaries retained | Useful immediate facts; loses action-level and event-time scene detail at encounter closure |
| Player and save | `PlayerState`, `SaveSnapshot`, `PlayerIdentityProfile`, `EquipmentState`, `PlayerInventoryState` | Current identity, appearance choices, resources, equipment, inventory, location, Knowledge projections | Persisted current snapshot | Can describe current state, not prior transitions or event-time truth |
| Session Chronicle | `SessionState.chronicle`, `ChronicleEventState` | UI-ready title, summary, entity/result strings | Persisted but mutable/capped by current orchestration | Presentation only; cannot be factual provenance |
| Discovery Chronicle | `PlayerDiscoveryChronicleState` | Narrow discovery identity, source, tick, notes | Persisted narrow history | Eligible later only through its owner and knowledge rules |
| Quest journal | `QuestJournalEntryState`; quest acceptance/tracking modules | Current offer/journal strings and ids | Current mutable projection | Insufficient for outcome chronology or crisis facts |
| Travel | `player-travel.ts`, travel network and world-hex records | Destination, route/static time, modes, terrain and hazards | Command result plus static content | Strong route input; no patient transport or medical tolerance owner |
| Institutions | settlement, religion, magic-infrastructure, guild and site records | Static provider/site identity and coarse capability | Authored and derived static facts | Can identify possible stops, not prove live availability, competence, access, price, or willingness |
| Account history | `AccountRunHistoryRecord` | Sparse run identity, outcome, lineage links, achievements and payout facts | Durable account record | Terminal summary only; not scene history |
| Run-end / account UI | `chronicleRunEndSummaryPresentation.ts`, `accountMetaPresentation.ts`, `achievementChroniclesPresentation.ts` | Account-owned records plus presentation inference | Deterministic projection | Presentation precedent only; output cannot be re-ingested |
| Living Character Manuscript | `docs/design/living-character-manuscript-design-boundary.md` | Proposed eligible retained facts and editorial treatments | Approved design boundary; no runtime | Correct downstream consumer boundary, not a live renderer |

There is no general narrative-realization engine. No shared owner performs grammatical profiles, referent choice, discourse tracking, tense/aspect, morphology, knowledge filtering, fact validation, or deterministic prose fallback. Current interpolation is local string construction.

## 3. Live Presentation And Prose-Generation Seams

Current seams are deterministic but fragmented:

- quest acceptance and travel build fixed Chronicle summaries in engine modules;
- `gameplayLoop.ts` and new-game creation build additional UI-ready Chronicle prose;
- body-state, combat-delta, account, Chronicle, achievement, character-panel, calendar, and economy modules each format their own labels and sentences;
- quest generation combines authored template summaries with generated notes;
- the shared event vocabulary emits factual envelopes but does not retain a complete event history;
- no external-AI, local-model, prompt-builder, grammar library, inflector, or validation pipeline exists.

These seams are useful consumers or fallback phrase sources, not a reusable engine. Allowing each domain to generate crisis prose would create parallel referent, certainty, terminology, and knowledge authorities.

Recommended boundary: a reusable presentation-owned narrative pipeline consumes owner-approved fact envelopes. Chronicle/manuscript and Mortal Crisis remain adapters/consumers. Gameplay owners never accept generated prose as input.

## 4. Identity, Sex, Gender, Pronoun, And Grammatical-Number Findings

Live distinctions are incomplete:

- `PlayerSexId = "male" | "female" | "neutral"` is a mechanical/creator identity used in attribute construction. The repository does not define `neutral` as a pronoun profile, gender identity, or plural marker.
- `PlayerCoreData` stores player name, lineage and sex; `PlayerIdentityProfile` stores age band, physique, nature, focus, height and coloration, but no gender or grammatical profile.
- authored `person`/`npc` first-pass schemas deliberately omit sex, gender and pronouns;
- `CombatantState` and `PartyMemberRuntimeState` retain `displayName` but no grammatical identity;
- monsters expose names/classes and arbitrary descriptive tags, not referent number or pronouns;
- deities expose `presentationGender: female | male`, but that is authored descriptive content and is not accepted as a general prose-driving pronoun contract;
- no live source infers pronouns from sex, name, lineage, title or appearance, which is the correct conservative posture.

Required future minimum grammatical profile, with final field names deferred:

```text
referent identity
  -> grammatical person: first | second | third
  -> grammatical number: singular | plural
  -> subject / object
  -> possessive determiner / possessive pronoun
  -> reflexive
  -> agreement profile, including irregular "be"
  -> optional safe title/honorific and name policy
  -> entity-kind fallback
```

It must represent singular `they/them/their/theirs/themself` separately from plural `they/them/their/theirs/themselves`. Safe absence behavior should prefer a canonical recognized name/title; only a declared non-person profile should default to `it`. A group may use plural `they` without changing any member's profile.

## 5. Referent And Discourse Findings

A future reusable discourse resolver is required. It should be presentation-owned, created per scene, and consume canonical entity references plus observer recognition.

Minimum discourse state:

- scene point of view, tense, phase, location and observer;
- current paragraph subject and focal patient/threat;
- recently mentioned entities and prior labels;
- same-pronoun competitors and grammatical number;
- canonical, recognized and observer-safe names/titles/roles;
- known relationships without inferred intimacy;
- visible/recognized objects and current scene positions;
- repetition budget subordinate to clarity.

Selection order should prefer an unambiguous recognized name or role before a pronoun. “Bran dragged Lyrian away as he began to lose consciousness” must be rejected or rewritten when `he` has competing referents.

This belongs in a reusable narrative/presentation package, not in Chronicle fact ownership and not solely in Mortal Crisis. The crisis adapter supplies focal roles and phase; the referent resolver supplies clear expressions.

## 6. Tense, Inflection, And Grammar Findings

The repository has no general support for:

- tense/aspect selection;
- person/number agreement;
- irregular verb realization;
- article/determiner choice;
- count/mass noun behavior;
- coordinated subjects;
- possessive formation;
- sentence joining or paragraph continuity.

Current fixed strings sometimes pluralize by hand and interpolate numeric labels, but that is not a morphology layer.

Recommended first posture is a hybrid:

1. deterministic beat planning from a validated fact envelope;
2. a small deterministic morphology/inflection layer for the accepted grammar subset;
3. authored grammar templates as the required minimum renderer;
4. an optional bounded generative adapter only after separate authorization;
5. deterministic factual, knowledge, chronology, referent and style validation;
6. deterministic factual fallback on any failure.

No third-party package is selected. Irregular verbs must be explicit data/tests rather than guessed suffix rules.

## 7. Event-Time Appearance, Equipment, And Object Findings

Immediate live state is partially usable:

- player appearance choices and coloration are persisted;
- equipment has detailed body/weapon/accessory slots and optional durability;
- inventory distinguishes bags/overflow from equipped items;
- combatant hooks retain main hand, off hand and armor item ids;
- a combat action retains source item, spell identity/family metadata, actor, targets and timing.

It is not sufficient for reliable crisis narrative:

- no retained action history proves what was worn or held at an earlier event tick;
- combat history retains only encounter identity, region, result and end tick;
- action-resolution events are not retained as a general historical ledger;
- no general position, facing, distance, lighting, line-of-sight, covering or visibility owner exists;
- no event-time record proves drops, transfers, consumption, breakage, contamination, blood, armor cutting/removal, or hand release;
- inventory/equipment lack a general held-versus-carried transition ledger and two-hand occupancy contract;
- party carrying, litters, mounts, wagons and body transport are not active actor state.

Answers:

1. Current state can support a restrained immediate scene only while the active encounter and current snapshot remain available.
2. A later regeneration cannot prove event-time appearance/equipment/object truth from current state.
3. Event/action/health/equipment owners must retain source-linked facts that matter to later prose.
4. Beat transitions must contain accepted state deltas—release/drop, transfer, remove/cut, consume, damage—not be inferred by the renderer.
5. Observer visibility/recognition must gate every appearance or object claim.

Minimum future fact-envelope posture:

```text
source event/revision ids + authoritative tick
participants and observer-safe identities
event-time visible appearance/equipment/object snapshot
accepted object/position transitions ordered by beat
visibility and recognition evidence
forbidden/hidden facts
```

## 8. Knowledge, Visibility, Diagnosis, And Uncertainty Findings

Useful foundations exist:

- Knowledge domains define identification and spotting skills/thresholds;
- discovery records retain source and location context;
- player skills include Knowledge, spotting, healing, alchemy, survival and magic-related inputs;
- combat area retains region, settlement/site/hex, habitat tags and hazard pressure;
- world state retains an untyped weather object.

Missing foundations:

- observer-specific line of sight, distance, lighting, coverings and recognition;
- typed diagnosis evidence and confidence;
- persistent lethal-process/injury facts;
- professional capability and live institutional availability;
- a separation between hidden health truth and assessed prognosis.

Future knowledge projection should classify each candidate fact as direct observation, recognized identity, competent assessment, uncertain assessment, or hidden. Reassessment is a new source-linked assessment over unchanged or changed truth; prose may revise confidence without rewriting prior knowledge.

Qualitative urgency must derive from authoritative processes and transport/care constraints, then be filtered by what the observer can know. Uncertainty is not permission to randomize or conceal a committed result.

## 9. Mortal Crisis Narrative Presentation Findings

Recommended owner split:

| Phase | Authoritative owner | Narrative responsibility |
| --- | --- | --- |
| threat disposition | encounter/AI/context owner | project observed behavior, not invented motive |
| access/protection | combat, party, position and hazard owners | plan only accepted actions and blockers |
| assessment | health truth plus observer/skill knowledge adapter | render confidence and visible signs |
| stabilization | health/process and treatment action owners | state which named process changed |
| extraction | party/carry/route owners | retain object/hand/transport transitions |
| route/intermediate care | world route, institution, access and resource owners | compare accepted options causally |
| transit/reassessment | clock, route, hazard and health owners | update facts and assessment at committed beats |
| definitive treatment/resurrection | health/magic/death/Stakes owners | render accepted eligibility and result |
| recovery/final closure | health or terminal continuity owners | project closure only after authority commits it |

The crisis resolver accepts or requests player decisions at explicit phase boundaries. A scene plan persists its source phase, accepted facts and pending decision; resumption consumes a new accepted result rather than regenerating prior truth.

Default output is connected third-person past-tense narrative. Raw state ids, percentages, seeds, dice and hidden clocks remain forbidden. Qualitative urgency is derived presentation. Exact time appears only from an owner-approved, character-knowable source.

If rich prose fails, the fallback should produce short factual sentences from validated actors, actions, locations, condition changes and next required decision.

## 10. Multi-Stop Care And Transit Findings

The repository has substantial static inputs:

- route records, mode profiles, distances, travel estimates, terrain/feature variance and access requirements;
- world hexes/edges with foot, mounted and wagon posture, roads, barriers and hazards;
- settlements, districts, sites, religious structures, guilds and magic infrastructure;
- static items and spell metadata for bandages, medicines, healing, preservation and other possible inputs.

It lacks one live route-to-care owner:

- no patient transport tolerance or movement-worsening contract;
- no litter/body/carry capacity state;
- no provider competence, hours, occupancy, willingness, affordability or legal-access transaction;
- no typed distinction among diagnosis, stabilization, supplies, transport and definitive care;
- no process-specific consumable execution contract.

A future crisis route planner should compare a direct destination and bounded intermediate-stop candidates using accepted route legs, transport modes, hazards, access, provider capabilities, resource transactions and patient tolerances. It should return a causal plan, not “nearest healer” and not an aggregate survival roll.

An intermediate stop is useful only when a named service changes a named constraint—for example stabilization, diagnosis, supplies, escort or transport—enough to offset its detour and movement burden.

## 11. Prompt-Generation And Validation Architecture Options

`Prompt generation` and `prose realization` must remain separate:

- a prompt/request adapter serializes only allowed facts and controls for an optional bounded generator;
- prose realization may use deterministic templates or an accepted candidate;
- neither owns gameplay truth.

Recommended future pipeline:

```text
gameplay/event owners
  -> retained factual event or accepted snapshot
  -> narrative fact envelope with provenance and forbidden facts
  -> scene/beat planner
  -> referent + grammar resolver
  -> deterministic template OR bounded request adapter
  -> candidate prose
  -> factual + chronology + continuity + grammar + knowledge + style validation
  -> accepted presentation OR deterministic factual fallback
```

Required controls include stable source/revision ids, idempotent regeneration, tense/POV, allowed vocabulary, length/repetition budgets, and exact validation of entities, names, pronouns, objects, equipment, appearance, locations, injuries, magic and chronology.

Unsupported dialogue, motives, emotions, witnesses, equipment, appearance, diagnoses, entities or outcomes require rejection or simplification. Generated prose is never parsed back into canonical state. Minimum viable output has no external-model dependency.

## 12. Recommended Owner Graph

```text
authoritative event/domain owners
  -> retained facts and event-time views
      -> knowledge/visibility projection
          -> narrative fact envelope
              -> scene/beat planner
                  -> discourse/referent + grammar
                      -> renderer/generative adapter
                          -> validator/fallback
                              -> Mortal Crisis UI / Chronicle / Manuscript
```

Mortal Crisis resolution, route/care, health, magic, equipment and element response remain upstream authorities. Chronicle and Manuscript are downstream projections.

Forbidden parallel authorities:

- prose owning health, death, equipment, identity, magic or elemental intent;
- Chronicle strings used as canonical event records;
- current save snapshots reconstructed into unsupported historical transitions;
- the generator inventing hidden facts;
- UI labels becoming stable ids;
- separate crisis-only pronoun or grammar rules.

Likely cycles to prevent: Chronicle prose feeding narrative facts; narrative output updating recognition; crisis presentation choosing gameplay outcomes; elemental narrative labels driving AI response.

## 13. Future Test Matrix

- male, female, singular-they, plural-they and non-person profiles;
- titled/named entities that forbid pronouns;
- ambiguous same-pronoun actors and coordinated subjects;
- past/present tense and irregular `be`, `have`, `do`, `go`, `lie`, `lay`, `fall`, `flee`, `carry`;
- observer does not recognize an identity;
- armor/darkness hides appearance;
- equipment dropped, consumed, damaged, removed and transferred across beats;
- carrier releases a two-handed object before carrying a patient;
- progressive diagnosis with changed confidence;
- hidden exact timer rendered only as qualitative urgency;
- direct versus intermediate-care route;
- same envelope regenerates deterministically;
- unsupported-fact candidate is rejected;
- invalid rich prose produces deterministic fallback;
- no generated text mutates gameplay or becomes evidence.

## 14. Unresolved Decisions

- final grammatical-profile fields and safe defaults;
- scope of the first morphology/inflection subset;
- where retained event-time narrative views live and for how long;
- observer/visibility/recognition authority;
- initial health assessment and qualitative-urgency vocabulary;
- Mortal Crisis phase/decision persistence;
- care-provider capability and transport contracts;
- whether any bounded generator is ever authorized and its deployment/privacy boundary;
- validator strictness, revision identity and accepted prose persistence;
- relationship between short crisis scenes and later Manuscript regeneration.

## 15. Explicit Non-Decisions And Limitations

This audit does not accept field names, schemas, grammar rules, prompts, model providers, prose style, timers, care values or Mortal Crisis outcomes. It does not implement or send repository data to an external model. It does not revise save, defeat, injury, resurrection, Stakes, Chronicle or Manuscript authority.

The audit is repository evidence, retained for:

1. `Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision`;
2. the later Mortal Crisis/Stakes authority revision;
3. a later narrative-engine implementation prompt.

