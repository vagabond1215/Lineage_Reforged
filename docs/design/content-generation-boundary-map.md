# Content Generation Boundary Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future authored/generated content work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Define boundaries between authored content, generated planning output, generated game content, runtime state, UI presentation, and future bulk creation workflows before any generated content is introduced or committed.

This document is a planning source. It does not authorize generated output, content JSON edits, schema changes, or runtime implementation.

## Core Boundary Rule

Generated suggestions are not authored game content.

Prompts, draft lists, target-gap reports, source maps, generated markdown, proposed settlement names, proposed knowledge snippets, menu asset prompts, or local scratch output may support authoring decisions, but they must not become game content until an explicitly scoped authoring pass validates ownership, ids, schema, references, and system boundaries.

## Content Categories

| Category | Meaning | Commit policy |
| --- | --- | --- |
| authored content | hand-reviewed source-of-truth content JSON/TS/MD used by game systems | commit only in scoped content passes |
| planning documents | design/source maps/rules/checklists | safe for connector/Codex docs-only passes |
| generated planning output | gap reports, candidate lists, draft prompts, local analyses | commit only if explicitly scoped as report artifacts |
| generated game content | generated records intended for runtime/content loaders | forbidden until explicit content-generation pass |
| runtime state | save/account/session/player/event state | never generated as content |
| UI assets | images, icons, theme layers, screenshots | separate asset pipeline; not content JSON |
| generated output/build artifacts | compiled or generated files | do not refresh unless explicitly scoped |

## Systems Needing Generation Boundaries

| System area | Likely generated-support use | Required boundary |
| --- | --- | --- |
| knowledge domains/snippets | candidate snippets, categories, discovery sources | registry/snippet schema and owner validation before content |
| settlements/population centers | candidate names, roles, anchors, economy/survival profiles | region/locality/hex/route validation before content |
| routes/travel | candidate route labels, distances, mode estimates | grid/distance validation before content |
| items/resources | candidate item names, value profiles, resource tags | item schema/taxonomy validation before content |
| economy | candidate markets/trade flows/workplaces | no transaction/runtime mutation |
| Chronicle/Renown | candidate record/event vocabulary | no event creation or grants |
| family/Bloodlines | candidate evidence/claim vocabulary | no ownership inference |
| magic/spells | candidate study/training descriptions | no known-spell ownership/runtime effects |
| UI/menu assets | asset prompts and layer lists | no asset imports/UI changes until scoped |

## Authorship Gates

Generated content should not be committed as game content until these gates are satisfied:

1. Target schema/content shape is stable.
2. ID and slug rules are defined.
3. Owner scope is explicit where needed.
4. Reference targets exist.
5. Validation rules exist or are documented.
6. Runtime behavior remains unchanged unless explicitly scoped.
7. Generated text has been reviewed for lore/theme consistency.
8. Generated text does not imply locked/deferred systems are active.
9. Generated output is separated from source-of-truth content.
10. Tests/lint/checks for the touched content category are defined.

## Generated Planning Output Rules

Generated planning artifacts may include:

- markdown source maps
- report plans
- gap report summaries
- candidate lists marked as non-authoritative
- prompt packs
- validation checklists
- local scratch analysis if not committed

Rules:

- Mark generated/planning output clearly as non-authoritative.
- Do not mix generated suggestions with authored records in the same pass.
- Do not refresh generated output as incidental cleanup.
- Do not let generated reports become runtime loaders.
- Do not treat generated candidate ids as reserved ids unless explicitly accepted.

## Generated Game Content Rules

Before generated game content is allowed, define:

- exact target files
- maximum batch size
- id/slug/naming rules
- owner/reference validation
- review checklist
- rollback plan
- lint/test commands
- expected generated-vs-authored distinction
- whether generated records require manual conversion before commit

Recommended default:

- Generated suggestions should become manually reviewed authored content before commit.
- Bulk-generated runtime content should remain forbidden until a dedicated pipeline and validation suite exists.

## Cross-System Non-Grant Rules

- Generated settlement visibility does not grant geography or settlement lore.
- Generated knowledge snippets do not create progress state.
- Generated Chronicle records do not create rewards.
- Generated Renown text does not grant Prestige.
- Generated spell study text does not grant known spells.
- Generated item descriptions do not create item instances.
- Generated routes do not authorize travel commands.
- Generated menu assets do not imply system unlocks.
- Generated backstory/family text does not create evidence or ownership.

## Validation Questions For Future Generation Passes

Before any generated artifact is committed, answer:

1. Is this planning output, authored content, generated content, asset output, or build output?
2. Which files are allowed to change?
3. What system owns each record?
4. What ids are referenced and do they exist?
5. What schemas/lints apply?
6. What runtime behavior must remain unchanged?
7. What deferred systems must not be implied?
8. How is generated text reviewed?
9. What batch size keeps review practical?
10. What rollback strategy exists if validation fails?

## Recommended Future Pass Order

Recommended sequence when generated content becomes active:

1. `Content Generation Source Map`
   - inspect current generated/build/content conventions
   - docs-only
2. `Generated Content Classification Plan`
   - define categories, paths, and commit policies
   - planning only
3. `Single Category Prompt Pack`
   - prompts only; no content commit
4. `Small Draft Candidate Report`
   - markdown report only, explicitly non-authoritative
5. `Manual Authored Content Pilot`
   - small hand-reviewed content batch based on candidates
6. `Validation And Review Pass`
   - content lint/tests only
7. `Generation Pipeline Plan`
   - only if repeated generation proves necessary

## Forbidden Until Explicitly Scoped

Do not add or change:

- generated game content
- content JSON records
- generated output/build artifacts
- schema enums or loaders
- runtime state
- save/account/session state
- UI imports or asset references
- knowledge progress state
- Chronicle/Renown events
- route/economy/travel behavior
- family/ownership evidence

## Recommended Next Connector Work

Optional connector-only follow-up:

- `Save Load Reliability Source Map`

Rationale: many future runtime features require explicit persistence boundaries. A save/load reliability source map can prepare future state work without changing schemas or runtime.

## Recommended Stop Point

The current connector prep set is broad enough for future Codex planning.

Recommended next project work after token reset:

- `Version 0.5.107 - Knowledge Domain Registry Plan`
