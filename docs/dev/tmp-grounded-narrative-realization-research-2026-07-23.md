# Grounded Narrative Realization, Referential Grammar, And Validation Research

Run: `Grounded Narrative Realization, Referential Grammar, And Validation Research`

Date: 2026-07-24

Status: completed external research and repository-integration planning; non-canonical; no design authority or implementation permission

## 1. Execution And External-Access Confirmation

- Branch: `master`.
- Starting commit and ending pre-edit commit: `a021457a210f35d94089006e48bd71beb5f7d0bc`.
- Initial and pre-edit worktree state: clean.
- `git fetch --prune` and `git pull --ff-only` completed; the pull reported already up to date.
- Required audit commit `5288c2c5bd5f53d09d2889c42efbe7f8c53811c1` is an ancestor of `HEAD`.
- Narrative audit, elemental audit, prior output, comparative research, accepted defeat fallback, and held `0.6.6` identities matched the prompt.
- Direct access to publisher, standards-body, ACL Anthology, official documentation, and official repository pages was confirmed. No repository content was sent to an external generation service.
- Access date for every external source below is 2026-07-24.

## 2. Repository Baseline And Audited Gaps

The repository is an ESM TypeScript/JavaScript workspace. The root has no production dependencies; the React UI depends only on React and React DOM. There is no reusable narrative-realization dependency.

Relevant live seams include:

- `packages/shared/types/src/contracts.ts` and `packages/shared/events/src/index.ts`: a promising but unretained general event envelope with payloads too loose for narrative proof and ids that may collide for repeated same-tick families;
- `packages/shared/types/src/combat.ts` and `packages/engines/game-engine/src/combat/index.ts`: current combat facts and bounded summaries, not a durable action-level event-time history;
- player identity, equipment, inventory, party, route, quest, Chronicle, account, and presentation types: current projections and scattered deterministic interpolation;
- `SessionState.chronicle` and quest-journal strings: presentation, not canonical provenance;
- people/NPC records: no pronoun or grammatical profile; combatants and party members often retain only display names;
- `PlayerSexId`: mechanical identity, including `neutral`, and therefore not a grammatical-profile authority;
- later regeneration: cannot prove event-time appearance, held/worn/dropped/transferred objects, visibility, diagnosis confidence, or position.

The accepted boundary remains that gameplay owners resolve truth before narrative work. Prose cannot mutate or be parsed back into gameplay. Chronicle and Manuscript are downstream projections. Elemental ecology remains a separate evidence lane.

## 3. Research Method And Source-Quality Rubric

The research used 18 principal sources and 6 supplementary implementation sources, within the prompt limits. Principal sources were selected to answer specific repository questions, not to vote for a product.

Quality classes:

- `peer_reviewed_primary`: original archival paper from its publisher or ACL Anthology;
- `normative_standard`: standards-body specification or Recommendation;
- `official_standards_body_specification`: official standards-body publication that is not itself standards-track;
- `official_technical_primary`: current official project documentation or repository;
- `supplementary_implementation`: official repository used only for runtime, license, release, or integration posture.

Evidence strength was bounded by role. A surface realizer supports morphology and syntax claims, not factuality. A localization formatter supports message selection and locale structure, not document planning. Grammar-constrained decoding supports structural conformance, not truth. Learned entailment or consistency scores remain fallible evaluators, not proof.

## 4. Source Ledger

### Principal sources

| ID | Source metadata and direct link | Quality | Question supported | Limitation / applicability caveat |
|---|---|---|---|---|
| P01 | Ehud Reiter and Robert Dale, “Building Applied Natural Language Generation Systems,” *Natural Language Engineering* 3(1), 1997, DOI [10.1017/S1351324997001502](https://doi.org/10.1017/S1351324997001502) | `peer_reviewed_primary` | Separation of content determination, document planning, aggregation, lexicalization, referring expressions, and realization | A classic architecture, not a current game integration or localization design |
| P02 | Albert Gatt and Emiel Krahmer, “Survey of the State of the Art in Natural Language Generation,” *JAIR* 61, 2018, DOI [10.1613/jair.5477](https://doi.org/10.1613/jair.5477) | `peer_reviewed_primary` | Modern NLG task boundaries, architectures, applications, and evaluation limits | Surveys heterogeneous systems; does not prescribe this repository’s owners |
| P03 | Emiel Krahmer and Kees van Deemter, “Computational Generation of Referring Expressions: A Survey,” *Computational Linguistics* 38(1), 2012, DOI [10.1162/COLI_a_00088](https://doi.org/10.1162/COLI_a_00088) | `peer_reviewed_primary` | Reference generation, ambiguity, context, salience, and algorithmic tradeoffs | Full REG research is broader than a first deterministic game resolver |
| P04 | Albert Gatt and Ehud Reiter, “SimpleNLG: A Realisation Engine for Practical Applications,” ENLG 2009, [ACL Anthology W09-0613](https://aclanthology.org/W09-0613/) | `peer_reviewed_primary` | Practical English morphology/syntax realization and the boundary between application input and realization | English, Java, limited document planning; application must supply correct structures |
| P05 | Grammatical Framework maintainers, “Grammatical Framework” and Resource Grammar Library documentation, current official site, [GF](https://www.grammaticalframework.org/) and [RGL synopsis](https://www.grammaticalframework.org/lib/doc/synopsis/) | `official_technical_primary` | Abstract/concrete grammar separation, multilingual resource grammars, morphology and basic syntax | Powerful but introduces a grammar language, generated resources, and integration complexity |
| P06 | Unicode Consortium, “MessageFormat 2,” current official specification site, [messageformat.unicode.org](https://messageformat.unicode.org/) | `normative_standard` | Locale-aware messages, selection, formatting, and separation of data values from localizable messages | Message formatting is not sentence planning, discourse, provenance, or factual validation |
| P07 | Unicode CLDR, “Language Plural Rules,” current official specification, [CLDR plural rules](https://cldr.unicode.org/index/cldr-spec/plural-rules) | `normative_standard` | Locale-specific plural categories and minimal-pair testing | Plural categories are numeric/linguistic categories, not universal grammatical number or pronoun profiles |
| P08 | Project Fluent, “Terms” and official syntax guide, current official documentation, [Fluent terms](https://projectfluent.org/fluent/guide/terms.html) | `official_technical_primary` | Localizer-owned variants, grammatical attributes, case/gender variation, and language-specific resources | Localization message system, not a general English surface realizer or scene planner |
| P09 | Sam Wiseman, Stuart Shieber, and Alexander Rush, “Challenges in Data-to-Document Generation,” EMNLP 2017, DOI [10.18653/v1/D17-1239](https://doi.org/10.18653/v1/D17-1239) | `peer_reviewed_primary` | Neural data-to-text fluency versus factual/document fidelity; value of structural evaluation | Sports-data domain; metrics and failure patterns transfer, not its schema |
| P10 | Craig Thomson and Ehud Reiter, “A Gold Standard Methodology for Evaluating Accuracy in Data-To-Text Systems,” INLG 2020, DOI [10.18653/v1/2020.inlg-1.22](https://doi.org/10.18653/v1/2020.inlg-1.22) | `peer_reviewed_primary` | Human annotation of factual errors and why surface metrics are insufficient | Evaluation methodology detects errors; it does not prevent them automatically |
| P11 | Joshua Maynez et al., “On Faithfulness and Factuality in Abstractive Summarization,” ACL 2020, DOI [10.18653/v1/2020.acl-main.173](https://doi.org/10.18653/v1/2020.acl-main.173) | `peer_reviewed_primary` | Hallucination prevalence and partial value of entailment-based metrics | Summarization differs from structured game facts; entailment correlation is not a guarantee |
| P12 | Wojciech Kryściński et al., “Evaluating the Factual Consistency of Abstractive Text Summarization,” EMNLP 2020, DOI [10.18653/v1/2020.emnlp-main.750](https://doi.org/10.18653/v1/2020.emnlp-main.750) | `peer_reviewed_primary` | Learned consistency checking and extraction of supporting/conflicting spans | Learned, domain-sensitive, and fallible; cannot be the sole acceptance gate |
| P13 | Saibo Geng et al., “Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning,” EMNLP 2023, DOI [10.18653/v1/2023.emnlp-main.674](https://doi.org/10.18653/v1/2023.emnlp-main.674) | `peer_reviewed_primary` | Grammar constraints can guarantee membership in an output structure | Structural validity does not establish semantic truth, safe references, or adequate content |
| P14 | inkle, “ink: open source scripting language for interactive narrative,” official repository, current release 1.2.1 dated 2026-05-05, [inkle/ink](https://github.com/inkle/ink) | `official_technical_primary` | Stateful authored narrative, choices, variables, compilation, and reproducible story state | A narrative scripting runtime, not fact-envelope realization, grammar, or semantic validation |
| P15 | Yarn Spinner, “Line Provider” and “In-built Localisation,” official docs, updated in 2025–2026, [Line Provider](https://docs.yarnspinner.dev/components/line-provider) and [localisation](https://docs.yarnspinner.dev/yarn-spinner-for-unity/assets-and-localization/inbuilt-localisation) | `official_technical_primary` | Stable line ids, separation of runtime line identity from localized presentation, variables and stateful dialogue | Dialogue authoring/dispatch, not surface realization or factual scene generation |
| P16 | Kate Compton, Ben Kybartas, and Michael Mateas, “Tracery: An Author-Focused Generative Text Tool,” AIIDE workshop, 2015, [original paper](https://www.galaxykate.com/pdfs/ComptonKybartasMateas15-Tracery%20An%20Author-Focused%20Generative%20Text%20Tool.pdf) | `peer_reviewed_primary` | Authorable expansion grammars, shallow controlled generation, and creative variation | Shallow substitutions do not supply agreement, referent safety, provenance, or truth |
| P17 | W3C, “PROV-DM: The PROV Data Model,” Recommendation, 2013-04-30, [W3C PROV-DM](https://www.w3.org/TR/prov-dm/) | `normative_standard` | Entities, activities, agents, derivation, responsibility, and provenance graphs | General conceptual model; adopting its full vocabulary would be excessive |
| P18 | A. Rundgren et al., “JSON Canonicalization Scheme (JCS),” RFC 8785, 2020, [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785) | `official_standards_body_specification` | Invariant serialization and deterministic hashing of JSON fact inputs | Informational RFC; canonical bytes do not define semantic normalization or event identity |

### Supplementary implementation sources

| ID | Source and observed posture | License / runtime | Use in this research |
|---|---|---|---|
| S01 | [SimpleNLG official repository](https://github.com/simplenlg/simplenlg): official English release 4.5.0; repository updated through 2024 | MPL-2.0; Java/Maven | Confirms mature English-realizer role but poor direct TypeScript fit and limited microplanning |
| S02 | [jsRealB official repository](https://github.com/rali-udem/jsRealB): version 5.5 dated July 2026 | JavaScript/Node/browser; lexicon data carries its stated separate Creative Commons terms | Confirms an actively maintained English/French JS realizer exists; lexicon size, dual licensing, bundle, API, and correctness need a later spike |
| S03 | [Fluent.js official repository](https://github.com/projectfluent/fluent.js): latest listed release 2025-07-18; active 2026 work visible | Apache-2.0; JavaScript/TypeScript/npm | Strong JS localization-message candidate, not narrative realization |
| S04 | [messageformat/messageformat](https://github.com/messageformat/messageformat): active JS monorepo for MF1 and MF2; MF2 parser/runtime/polyfill present | MIT; JavaScript/TypeScript/npm | Strong standards-aligned message-format candidate; adoption should wait for a localization package |
| S05 | [GF downloads and official site](https://www.grammaticalframework.org/download/): GF 3.12 released 2025-08-08; JavaScript compilation/runtime documented | GF program GPL; libraries variously LGPL/BSD; generated-resource implications require review | Maintained and multilingual, but disproportionate for the first English slice |
| S06 | [Yarn Spinner core repository](https://github.com/YarnSpinnerTool/YarnSpinner): active through 2026 | MIT; core/compiler primarily C# with engine integrations | Transfer stable-id/localization patterns; do not adopt as this narrative realizer |

## 5. Comparison Matrix

| Technique | Stage / grammar / discourse | Determinism and grounding | Localization / TS fit / license | Principal limitation | Classification | Lineage Reborn lesson |
|---|---|---|---|---|---|---|
| Classic NLG pipeline | Plans documents, microplans, realizes; REG is explicit | Deterministic when rules and inputs are versioned; grounding remains upstream | Language-neutral stages; implementation owned by project | Can become over-engineered | `directly_transferable_principle` | Preserve stage contracts while implementing only the first needed subset |
| SimpleNLG | English morphology and surface syntax; little discourse | Deterministic for supplied structures; no fact proof | Java, MPL-2.0; weak direct fit | Caller must provide correct semantics and syntax tree | `adaptable_pattern` | Use its feature/realizer boundary as a test oracle or reference, not an automatic dependency |
| jsRealB | English/French morphology and syntax | Deterministic for structured input | Strong JS fit; licensing/bundle review needed | Large lexicons and project-owned discourse/grounding still required | `dependency_candidate_for_later_evaluation` | Run a bounded offline spike before deciding library versus owned morphology |
| Grammatical Framework | Abstract/concrete multilingual grammar and RGL | Deterministic grammar generation | JS runtime possible; mixed license posture | Toolchain and grammar-authoring cost | `dependency_candidate_for_later_evaluation` | Valuable if multilingual controlled generation becomes near-term, excessive for first English crisis |
| MF2 / Fluent / CLDR | Locale message selection, variables, plural/select, translated variants | Deterministic formatting; facts supplied by caller | Excellent web/JS posture; MIT or Apache implementations | Messages, not scenes, referents, or factuality | `dependency_candidate_for_later_evaluation` | Keep locale/message keys and grammatical features separate from English sentence realization |
| Tracery-like grammar | Authored deterministic or seeded expansions | Grounded only if slots and alternatives are closed over approved facts | Native JS pattern; original ecosystem posture varies | Shallow substitutions easily break agreement or imply facts | `adaptable_pattern` | Permit typed, linted alternatives only after semantic equivalence is declared |
| Ink / Yarn Spinner | Stateful authored flow, choice pauses, stable line identity | Reproducible when state/version are retained | JS port exists for ink; Yarn core is C#; MIT | Not a fact-to-prose grammar engine | `adaptable_pattern` | Borrow stable presentation ids, pause/resume boundaries, and localization separation |
| Grammar-constrained decoding | Enforces structured candidate shape | Guarantees syntax class, not truth | Adapter-dependent | Valid structure may contain false claims | `caution_or_antipattern` if treated as factual proof | Use only to narrow an optional candidate channel |
| Learned entailment/consistency | Post-generation risk signal | Nondeterministic/model-version-sensitive; imperfect | Adds model/runtime burden | False acceptance and false rejection remain | `dependency_candidate_for_later_evaluation` | Advisory or rejection signal only, never sole acceptance |
| Canonicalized fact identity + provenance | Input identity, derivation, traceability | Strong deterministic basis when semantic normalization is defined | Natural JS/JSON fit | Hashing cannot choose facts or define truth | `directly_transferable_principle` | Version normalized source facts, plans, renderer, and accepted prose separately |

## 6. Pipeline Architecture Findings

The strongest transferable result is separation of responsibilities:

1. gameplay/domain owners accept results;
2. retention records event-time narrative facts and source provenance;
3. an observer projection removes hidden or unsupported facts;
4. a scene planner orders accepted beats and decision pauses;
5. a microplanner aggregates facts and assigns rhetorical relations that are explicitly supported;
6. a referent resolver chooses names, descriptions, groups, or pronouns;
7. an English realizer handles morphology, agreement, punctuation, and capitalization;
8. a deterministic renderer emits the minimum narrative;
9. an optional bounded adapter may request a candidate rendering of the same closed plan;
10. validators check the candidate against facts, plan, grammar, and policy;
11. rejection simplifies or falls back deterministically;
12. Chronicle, Manuscript, and UI consume accepted presentation without becoming provenance.

`Prompt generation` and `prose realization` must be separate functions. Prompt construction is an optional serialization/security boundary for a non-authoritative adapter. Prose realization is the required local capability and must work without any model. Combining them would make model availability part of the minimum path, blur input filtering with language realization, and make deterministic fallback harder to test.

## 7. Grammatical-Profile Findings

A future authority needs a language-independent core and locale modules, without accepting field names here.

The core must be able to distinguish grammatical person, semantic plurality/coordination, entity kind, permitted reference forms, and whether a profile is known, explicit, defaulted, or unavailable. An English module needs a complete paradigm where pronouns are allowed: subject, object, possessive determiner, possessive pronoun, and reflexive, plus the verb-agreement behavior that accompanies the referent.

Singular `they` and plural `they` share several surface forms but are not the same referent feature. The former denotes one entity and ordinarily takes the English `they are/have/do` agreement pattern; the latter denotes a group and also takes plural agreement. Keeping semantic cardinality separate from agreement class prevents group operations, reflexives (`themself` policy versus `themselves`), and coordinated subjects from collapsing.

Explicit author/player choice is required for personal pronoun paradigms and any exceptional self-reference. Safe defaults may exist only by entity kind: a clearly non-person object may use `it`; an organization or group may use a name or plural description according to an authored locale rule. Sex, `neutral`, name, title, lineage, appearance, and deity presentation must not infer a personal pronoun set.

When identity is missing, the safest fallback is a canonical recognized name or an observer-safe noun phrase repeated as needed. If neither is available, use a role supplied by the fact envelope, such as an identified carrier or unknown figure, without inventing demographic content. Omit pronouns when clarity cannot be proved.

## 8. English Morphology And Inflection Findings

The first subset should be deliberately small but real:

- present and simple past for authored crisis verbs;
- full handling of `be`, `have`, `do`, negation, and modal constructions actually used by locked templates;
- third-person singular agreement and coordinated/plural subjects;
- progressive only where a continuing accepted condition needs it; perfect constructions can wait unless a tested template requires anteriority;
- regular and curated irregular past/participle forms, including `go/went/gone`, `lie/lay/lain`, `lay/laid/laid`, `fall/fell/fallen`, `flee/fled`, `carry/carried`, `bleed/bled`, `lead/led`, `hold/held`, `take/took/taken`, and `wake/woke/woken`;
- regular plural and possessive rules plus an exception lexicon for nouns actually authored;
- `a/an` chosen from realized pronunciation only within a controlled lexicon; definite/indefinite article choice remains a discourse decision;
- capitalization, punctuation, contractions policy, and quote prohibition where dialogue is unsupported.

Fully inflected authored templates are the lowest-risk first fallback but multiply variants and are fragile under composition. A small project-owned feature layer is easy to test and bundle but risks linguistic edge cases. SimpleNLG is mature but Java does not match the runtime. GF is too heavy for the first scope. jsRealB is the strongest direct runtime candidate but needs license-data, bundle, API, coverage, determinism, and test-corpus evaluation.

Therefore the evidence supports a hybrid decision posture: begin with project-owned planning, referents, feature contracts, locked fully inflected fallbacks, and a narrowly tested English morphology layer; conduct a later offline jsRealB/reference-realizer spike before choosing whether production morphology stays owned or becomes library-backed. No dependency is accepted here.

## 9. Referent And Discourse Findings

Classic REG principles are adaptable, but the first package does not need an optimization-heavy algorithm. Use a conservative deterministic resolver:

- first mention: recognized canonical name, title plus name if independently known, or observer-safe description;
- later mention: pronoun only if profile is explicit, the intended antecedent is most salient, number/agreement is known, and no live competing referent matches;
- after subject or viewpoint change: prefer the name/description again;
- two actors with the same pronoun paradigm: suppress pronouns until ambiguity is removed;
- unknown or hidden identity: never reveal the canonical name; retain a stable observer-local description identity;
- groups: create a group referent only from explicit membership at that beat; dissolve it when membership or coordinated action changes;
- title/name changes: bind the event-time known label and its provenance, not current state;
- inability to prove clarity: repeat the shortest safe name or description.

Salience can start as a deterministic recency/grammatical-role state machine, not a statistical model. Each realized clause updates subject, object, focal patient, and last unambiguous mention. Repetition is preferable to a wrong pronoun.

## 10. Event-Time Fact And Provenance Findings

Current snapshots alone are insufficient; full snapshots are expensive and still lack semantic intent; raw domain events may be durable but force every later renderer to reconstruct evolving schemas. The best evidence-backed posture is mixed retention:

- durable accepted domain events/results remain authoritative where their owners already retain them;
- a compact event-time narrative view records only owner-approved, presentation-relevant facts at acceptance time;
- provenance links each fact/view to source record ids, revisions, ticks/ordering, and projection policy version;
- selected immutable content identities/revisions allow later lookup when safe;
- a current snapshot may assist immediate rendering but is never substituted for historical proof.

Information requirements include role-bound entity identities; stable event and beat order; accepted actions/results; location/route segment; visible appearance; worn/held/object-transition state; visible evidence of injury/condition; observer knowledge, recognition, visibility, diagnosis confidence, and uncertainty; plus exact source revision identities. The retained view should distinguish observed fact, owner-certified fact permitted to the viewpoint, and absence/unknown.

Do not put hidden exact timers, random seeds, raw percentages, debug ids, inaccessible diagnoses, private motives, secret identities, or future outcomes into the observer-facing envelope. If retained for provenance or validation, keep them in a separately access-controlled validation input that the renderer cannot lexicalize.

## 11. Knowledge, Visibility, And Diagnosis Findings

Knowledge projection precedes scene planning. It should combine owner-approved visibility, distance, lighting, obstruction, armor/concealment, recognition, and skill/inspection results. The renderer must not independently calculate line of sight or medical truth.

Each claim needs an epistemic posture: directly perceived, recognized, inferred under an accepted rule, reported by a source, or unknown. Confidence controls a closed phrase family. Exact diagnosis is allowed only when the domain owner says the observer knows it. Otherwise, descriptions stay with visible evidence and calibrated uncertainty. Reassessment creates a new accepted beat rather than rewriting the earlier observer state.

Qualitative urgency should be projected from an upstream severity/urgency category, not inferred from a hidden timer. The phrase set must preserve ordering without leaking values. Unsupported motive, emotion, intention, dialogue, witness, or causality is forbidden even when it would improve literary flow.

## 12. Scene And Beat Planning Findings

A scene plan is a presentation plan over immutable accepted facts. It orders by authoritative chronology, then uses explicit simultaneity groups where supplied. It may aggregate repeated equivalent observations, but it may not merge distinct transitions whose order matters.

Allowed connective relations are narrow: temporal succession, explicitly accepted cause/result, contrast between observed states, and continuation. “Because,” intention clauses, or emotional interpretation require an upstream relation, not stylistic invention.

Beat grouping should:

- establish focal actor/patient/threat and viewpoint;
- combine compatible action plus visible result;
- preserve object and location transitions;
- separate new knowledge from earlier uncertainty;
- place a hard decision boundary after the narrative context;
- resume from a new accepted result without regenerating locked prior beats;
- enforce tense, perspective, paragraph-length, sentence-count, and repeated-reference budgets.

Immediate Mortal Crisis prose can be richer than later Chronicle/Manuscript projection. Later consumers may compress or cluster the same facts but must retain source identity and cannot add truth.

## 13. Deterministic Templates And Controlled-Grammar Findings

The no-model renderer can provide connected, trustworthy prose if it operates at beat and scene levels rather than emitting one line per backend event.

The first slice needs authored sentence families for: collapse/unresponsiveness; threat posture; helper access; assessment and visible evidence; treatment attempt/result; carry/extraction; direct or intermediate route; reassessment; and a final decision lead-in. Feature slots must accept typed realized noun phrases and verb features, not arbitrary strings. Alternatives require declared semantic equivalence and deterministic selection from a source identity plus renderer/template version.

Static linting should reject missing variants, raw ids, unsupported slots, mismatched number/agreement, undeclared tense changes, forbidden mechanical tokens, and alternatives that add a fact. Golden tests should cover pronoun paradigms, unknown profiles, ambiguous actors, groups, irregular verbs, object transitions, observer uncertainty, and deterministic reproduction.

Sufficient first-slice quality is two or three coherent paragraphs with correct chronology, clear referents, accurate visible state, qualitative urgency, and a separately rendered choice. It need not deliver limitless literary variety. Correct controlled repetition is acceptable.

## 14. Bounded Generative-Adapter Findings

An optional later adapter can improve transitions, compression, controlled lexical variety, and paragraph rhythm. It cannot own fact selection, hidden-information filtering, event order, identity, pronouns, diagnosis, causality, gameplay outcome, or canonical history.

Its request must be built from an allowlisted plan, never raw saves or unrestricted authored text. Untrusted names/content must be data fields, not executable instructions. Structured output may constrain beat ids, sentence roles, and cited fact ids, but structural conformance is not factual conformance.

Record source-fact identity, plan identity, request/schema version, adapter/model version, decoding posture, candidate identity, validation report, and acceptance status. Temperature alone does not guarantee reproducibility. Cache only accepted candidates against exact versioned inputs. On timeout, privacy restriction, drift, rejection, or absence, use the deterministic renderer.

Generated prose remains replaceable presentation. Never parse it into state, never use it as evidence, and never let it silently overwrite locked/player-edited presentation.

## 15. Validation And Semantic-Fidelity Findings

Mandatory validation is layered:

1. schema and source-identity validation of facts and plan;
2. required-beat and required-fact coverage;
3. allowlisted entity/relation/value checks;
4. forbidden-fact and mechanical-language checks;
5. deterministic referent, name, profile, number, agreement, tense, viewpoint, and order checks;
6. appearance/equipment/object/injury/magic/location/position checks against event-time views;
7. observer/spoiler policy checks;
8. unsupported dialogue, motive, emotion, diagnosis, witness, outcome, and causal-language checks;
9. length/repetition/style budgets;
10. deterministic simplification and fallback on any material failure.

Rule/schema checks can guarantee conformance only for what is represented and parsed. Entity/relation extraction can miss paraphrases. NLI and learned factuality systems may provide risk signals but inherit domain, calibration, and version limitations. Round-trip parsing can agree with its own mistakes. Human-locked passages can be reviewed but still become stale when facts or templates change.

No studied validation layer guarantees unrestricted prose factuality. The only strong first-slice guarantee comes from generating inside a closed, typed deterministic language whose alternatives are prevalidated. A bounded candidate outside that language must be rejectable.

## 16. Determinism, Regeneration, And Idempotence Findings

Identity should be layered, not one overloaded event id:

- normalized source fact-set identity and provenance;
- observer-projection policy/version and projected-fact identity;
- scene-plan identity and planner version;
- locale, renderer, morphology, lexicon, and template/grammar versions;
- optional request schema, adapter/model, and decoding versions;
- candidate prose identity and validation-report identity;
- accepted presentation identity, lock state, and edit lineage.

Canonical JSON can support stable hashing only after the project defines semantic normalization: ordering of sets versus sequences, absent versus null, numeric/time representation, content revisions, and role identities. Same facts plus same versions must reproduce the deterministic fallback byte-for-byte. Presentation improvements require an explicit version change and a scoped regeneration request. Locked prose stays fixed; gameplay truth remains unchanged.

## 17. Localization Findings

Language-independent now:

- semantic roles and entity identities;
- grammatical person and semantic cardinality;
- permitted reference strategies;
- observer knowledge/provenance;
- event chronology and rhetorical relation;
- message/beat intent and locale-neutral urgency categories;
- source, plan, and presentation identities.

English-specific now:

- pronoun surface paradigms;
- agreement class behavior;
- articles/definiteness realization;
- English inflection and irregular lexicon;
- word order, punctuation, contraction, and possessive conventions.

Future locale modules may require grammatical gender, case, animacy, honorific/register, classifier, pronoun omission, richer number categories, and different word order. CLDR plural categories must not be reused as entity cardinality. MF2 or Fluent can later own localized message selection; neither should become the canonical grammatical profile. If a locale lacks full realization, use translated locked templates or an explicitly marked base-locale fallback according to a later localization policy, never ad hoc English slot insertion.

## 18. Library And Dependency Assessment

- **SimpleNLG:** handles English phrases/sentences, deterministic for structured input, mature and MPL-2.0, but Java integration is disproportionate. Reject direct production adoption for the first TS package; retain as an approach and possible offline oracle.
- **jsRealB:** handles English/French morphology and realization in JavaScript/Node and is current as of July 2026. It is the best later evaluation candidate. Before adoption, measure browser/node bundle, tree shaking, irregular coverage, API stability, deterministic output, lexicon/data licensing, build artifacts, and fit with project-owned noun phrases.
- **GF/RGL:** strongest multilingual grammar abstraction and can target JavaScript, but toolchain, grammar authoring, resource size, and mixed licensing are large commitments. Evaluate only if controlled multilingual generation becomes an accepted near-term requirement.
- **MF2 implementation:** current MIT JS/TS packages and standards alignment make it plausible for future localized message resources. It does not replace scene planning or morphology. Evaluate in a localization package, not the first narrative engine package.
- **Fluent.js:** active Apache-2.0 JS/TS implementation with expressive localizer-owned variants. Similar role boundary to MF2; choose between localization ecosystems later, not both by default.
- **ink/inkjs:** maintained, MIT, stateful interactive narrative with a JS port. Adopting a second narrative runtime would duplicate gameplay ownership. Transfer pause/resume and state/version patterns; reject as the fact-to-prose engine.
- **Yarn Spinner:** maintained, MIT, strong stable line-id/localization practice, but core integration is C#/engine-oriented and dialogue-centric. Transfer patterns; reject as the renderer.
- **Tracery ecosystem:** the shallow authored-grammar pattern is useful, but dependency posture and linguistic safety are weaker than a small project-owned typed grammar. Transfer the authoring idea, not an automatic package choice.

No dependency is accepted or added.

## 19. Mortal Crisis Presentation Application

The narrative engine receives, but never decides, accepted crisis facts. A scene may state that a character falls or becomes unresponsive only from an accepted result; state whether a threat continues, disengages, or is intercepted only from the combat/crisis owner; and describe assessment, treatment, extraction, stops, transit, and reassessment only from their owners’ accepted beats.

Equipment/object wording comes from event-time views so a carried weapon, removed helm, dropped pack, consumed supply, or transferred patient cannot drift to current state. Observer projection controls identity and diagnosis. Qualitative urgency comes from an allowed category. A pending player choice is a separate UI contract after the contextual prose.

Later treatment, resurrection, convalescence, or final closure enters only after those upstream authorities accept it. The narrative package has no timer, route optimization, care resolution, death, saving, Stakes, Prestige, heir, or reward authority.

## 20. Directly Transferable Principles

- Separate content/fact ownership, planning, microplanning, reference, and realization.
- Retain provenance and event-time presentation facts rather than treating prose as history.
- Project knowledge before planning or lexicalization.
- Prefer conservative repeated references over ambiguous pronouns.
- Give every deterministic presentation input and stage an explicit versioned identity.
- Make deterministic fallback mandatory and candidate rejection ordinary.
- Keep localization messages and locale grammar separate from language-independent semantics.
- Evaluate factual accuracy against source facts, not overlap or fluency.

## 21. Adaptable Patterns

- A small recency/role salience model adapted from REG work.
- SimpleNLG/jsRealB-style feature structures behind a project-owned boundary.
- GF’s abstract-versus-concrete grammar idea without adopting its full toolchain.
- Tracery-like closed alternatives with semantic-equivalence declarations and static linting.
- Ink/Yarn stable content ids, choice pauses, state serialization, and localization separation.
- PROV-inspired source/derivation links without importing the full ontology.
- Canonicalized JSON identities after project semantic-normalization rules are accepted.

## 22. Dependency Candidates For Later Evaluation

1. jsRealB, through an offline bounded English corpus and bundle/license spike.
2. One of MF2 or Fluent.js when a localization resource package is authorized.
3. GF only if multilingual controlled generation becomes near-term.
4. A learned entailment/consistency checker only for optional advisory validation after a privacy/runtime decision.

## 23. Cautions And Anti-Patterns

- Treating grammatical sex, `neutral`, names, appearance, or titles as pronoun inference.
- Treating plural categories as entity number or singular `they` as a plural entity.
- Storing prose, Chronicle summaries, or quest strings as factual provenance.
- Reconstructing event-time equipment/appearance solely from current saves.
- Letting a prompt/model choose facts, outcomes, visibility, reference identities, or diagnosis.
- Treating JSON/schema-valid or grammar-constrained output as factually valid.
- Treating NLI, round-trip parsing, or one learned score as a factuality guarantee.
- Random lexical variation without seeded/versioned identity and semantic equivalence.
- One line per backend event, or literary connective tissue that invents causality.
- Adding a large grammar/runtime dependency before a corpus-based evaluation.

## 24. Answers To The Sixteen Lineage Reborn Questions

1. **Minimum deterministic architecture:** owner-approved event-time facts → observer projection → scene/beat plan → referent/morphology realization → layered validation → deterministic fallback → presentation consumers.
2. **Separate prompt and realization?** Yes. Prompt construction is an optional security/serialization adapter; local realization is mandatory and model-independent.
3. **Explicit grammatical facts:** personal pronoun paradigm, person, semantic cardinality/coordination, permitted reference kinds, exceptional agreement/self-reference, and provenance. Never infer personal pronouns from sex/name/title/appearance/lineage/deity presentation.
4. **Safest missing-profile fallback:** repeat the recognized canonical name or observer-safe description; omit pronouns.
5. **First English morphology posture:** hybrid—project-owned contracts, referents, locked templates, and narrow morphology, with jsRealB evaluated offline before a production dependency decision.
6. **Singular versus plural `they`:** separate semantic cardinality/group identity from the English agreement/paradigm feature.
7. **Ambiguous referents:** suppress the pronoun and repeat the shortest observer-safe name/description; reset conservatively after subject changes.
8. **Retained event-time facts:** role identities, accepted actions/results, order/simultaneity, location/route, visible appearance, worn/held/object transitions, visible condition evidence, observer knowledge/confidence, and exact source revisions.
9. **Hidden from narrative envelope:** exact hidden timers/percentages, seeds, debug ids, inaccessible diagnoses, private motives/identity, future outcomes, and any fact barred by viewpoint. Validation-only secrets require a separate channel.
10. **Knowledge and confidence:** an upstream observer projection determines permitted claims and a closed uncertainty phrase family; reassessment is a new beat.
11. **Sufficient deterministic quality:** coherent multi-sentence beat grouping, accurate chronology/references/visible state, qualitative urgency, and a separate choice—controlled repetition is acceptable.
12. **Optional generative value:** transitions, compression, equivalent lexical variation, and rhythm; never truth, reference identity, order, diagnosis, or outcome.
13. **Mandatory validation and limits:** schema/source, coverage, entity/relation, grammar/referent/order, event-time consistency, spoiler/policy, forbidden-claim, and style checks with fallback. These cannot guarantee unrestricted prose factuality.
14. **Regeneration posture:** identical normalized facts and versions reproduce identical fallback; presentation changes require explicit versioning and scoped regeneration; locked prose and gameplay truth remain stable.
15. **Localization abstractions now:** locale-neutral roles, semantic cardinality/person, reference permissions, chronology, knowledge, intent, and provenance, with locale-owned surface paradigms and templates.
16. **Further research before decision:** no broad narrative research pass is required. The durable decision can proceed. Library adoption remains a later bounded implementation evaluation, not a decision blocker.

## 25. Recommended Durable-Decision Boundaries

The next decision should accept, narrow, or reject:

- the owner graph from authoritative results through retained event-time views to downstream presentation;
- a locale-neutral grammatical-profile boundary and conservative missing-profile behavior;
- deterministic reference/salience rules;
- the first English morphology and locked-template scope;
- event-time narrative information requirements, provenance, retention classes, and regeneration identities without final schema names;
- observer/knowledge/diagnosis projection boundaries;
- scene planning, decision pauses, validation, simplification, and fallback requirements;
- the optional adapter boundary and categorical non-authority of generated prose;
- localization seams and later dependency-evaluation gates.

It should remain documentation-only and should not decide Mortal Crisis outcomes, exact schemas/interfaces/packages, a production dependency, a model/vendor, or elemental systems.

## 26. Unresolved Decisions

- Exact accepted grammatical-profile fields and ownership for player-authored, authored NPC, transient combatant, deity, object, organization, and group referents.
- Exact English template corpus, irregular lexicon, contraction/style policy, and whether singular reflexive `themself`, `themselves`, or profile-specific authoring is accepted.
- Exact narrative-view retention owner, lifetime, compaction, migration, privacy, and save/account boundary.
- Exact semantic normalization and id composition, including repeated same-tick events and content revision identity.
- Exact observer-projection inputs and the upstream owners of visibility, recognition, and diagnosis confidence.
- Exact acceptable causality relation vocabulary and scene length/repetition budgets.
- Whether an implementation spike later selects project-owned morphology or jsRealB.
- Whether future localization chooses MF2, Fluent, another system, or project-owned resources.
- Whether optional learned validation or bounded generation is ever authorized.

These are decision or later implementation-spike questions, not gaps requiring another broad research pass.

## 27. Explicit Non-Decisions And Research Limitations

This artifact does not accept final fields, schemas, ids, storage, packages, dependencies, templates, prose style, model/service, or gameplay behavior. It does not implement or send repository data to a model. It does not revise Chronicle, Manuscript, Mortal Crisis, defeat, injury, saving, resurrection, Stakes, Prestige, succession, or content authority. It does not research or alter elemental alignment, ecology, manifestation, temperament, magic stimulus, fae, or monster behavior. It does not restore held `0.6.6`.

The evidence is strongest for architecture and boundaries, not for the exact quality of any library on Lineage-specific prose. Papers on summarization and sports data-to-text expose general failure modes but do not constitute a Lineage benchmark. Official project maintenance observations are point-in-time as of the access date. A later dependency choice requires a repository-owned corpus, license review, bundle measurement, deterministic test, and explicit authorization.

Retain this artifact until consumed by:

1. `Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision`;
2. the later Mortal Crisis/Stakes authority revision;
3. a later narrative-engine implementation prompt.
