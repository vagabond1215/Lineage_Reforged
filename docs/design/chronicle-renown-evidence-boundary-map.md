# Chronicle-Renown Evidence Boundary Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future Chronicle/Renown/Reputation evidence work; no source, schema, content JSON, UI, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Map the ownership and evidence boundaries between Chronicle records, Renown/Reputation, Family evidence, Backstory evidence, knowledge discovery, quest outcomes, and future runtime progression before any mutation, save/account changes, event creation, or UI command behavior is scoped.

This document is a planning source. It does not authorize implementation.

## Current Deferred Areas

Deferred roadmap areas related to this boundary include:

- Chronicle Marks
- Lineage Seals
- Chronicle/Renown event creation
- quest event creation
- scoped Backstory evidence
- family/source-run/scoped Backstory Legacy evidence
- Family Prestige earning/spending behavior
- knowledge discovery via `chronicle_record` or `quest_event`
- runtime event output from magic/combat/economy/advancement systems
- account/family/character evidence projection beyond read-only summaries

Existing landed boundaries include:

- Chronicle run-end summary planning, pure projection, focused tests, and read-only Account Meta UI have landed.
- Bloodlines pure projection and read-only account meta UI have landed.
- Family ownership boundary audit exists at `docs/design/family-ownership-boundary-audit.md`.
- Knowledge discovery source vocabulary exists at `docs/design/knowledge-discovery-source-vocabulary.md`.
- Magic resolver output remains inert; no Chronicle/Renown/quest event creation is authorized.
- Known-spell acquisition currently requires explicit character-scoped acquisition evidence and does not infer from account, family, institution, Legacy, scroll, tome, document access, or Chronicle visibility.

## Core Boundary Rule

A record is not a grant.

Chronicle visibility, Renown/Reputation, quest history, family history, or event summaries may provide future evidence references, but they must not silently create ownership, eligibility, knowledge completion, rewards, spell acquisition, Prestige, or item transfer.

## Evidence Owner Vocabulary

Future evidence-related systems should distinguish these owner scopes.

| Owner scope | Meaning | Boundary |
| --- | --- | --- |
| `account` | Account-wide profile owner. | Does not imply family, character, or source-run ownership unless explicitly linked. |
| `family` | Explicit family owner. | Must not be derived from lineage id, selected character, or Chronicle visibility. |
| `character` | Individual character owner. | Does not imply account/family proof by itself. |
| `source_run` | Specific run/session/source event owner. | Must not be treated as family id. |
| `chronicle_record` | Specific recorded event/summary owner. | May be evidence source later; not grant authority by itself. |
| `quest_event` | Specific quest outcome/event owner. | Quest visibility or acceptance is not evidence without outcome. |
| `renown_record` | Specific fame/reputation award record. | Recognition is not ownership/knowledge. |
| `legacy_purchase` | Explicit account/family/etc. unlock purchase owner. | Catalog record is not purchase evidence. |
| `item_instance` | Specific item/relic/heirloom instance. | Item catalog id is not instance ownership. |
| `knowledge_evidence` | Future knowledge-progress evidence owner. | Must not be inferred from Chronicle text alone. |
| `custom` | Special scoped owner. | Requires explicit notes and validation. |

## Boundary Map

| System | Can provide later | Must not imply automatically |
| --- | --- | --- |
| Chronicle | durable event reference, summary, source-run history, future evidence pointer | ownership, family history, knowledge completion, reward grant, spell acquisition |
| Renown/Reputation | recognition, access modifier, public/social proof, future evidence source | knowledge, family authority, Prestige currency, Backstory eligibility, item ownership |
| Quest events | authored outcome evidence, reward context, source for discovery/progression | quest visibility/acceptance as reward or knowledge grant |
| Family/Bloodlines | family-scoped owner/evidence, lineage context, future claims | account-wide ownership, character-owned proof, Chronicle fabrication |
| Backstory/Legacy | eligibility evidence, account/family/scoped unlocks after explicit rules | UI-provided ids, selected backstory, catalog presence as proof |
| Knowledge | discovery/progress evidence from quest/Chronicle only after explicit policy | automatic completion from Chronicle/Renown/quest history |
| Magic/combat/economy runtime | future event outputs with explicit owners | automatic Chronicle/Renown/quest event creation from inert helpers |
| UI | read-only presentation of evidence and summaries | creation of evidence, rewards, ownership, or state mutation |

## Evidence Record Questions

Future planning should answer:

1. What system produced the evidence?
2. What exact owner scope owns it?
3. What exact owner id is authoritative?
4. What target system can consume it?
5. What target id does it authorize?
6. Is it display-only, eligibility evidence, reward evidence, discovery evidence, or ownership evidence?
7. Is it persistent, run-local, account-level, family-level, or character-level?
8. Can it be revoked, superseded, inherited, or transferred?
9. Does it require a Chronicle record, quest outcome, Renown award, or runtime event envelope?
10. What test proves wrong-owner evidence fails?

## Candidate Evidence Shape

Planning-only sketch:

```json
{
  "evidenceId": "evidence.example",
  "evidenceKind": "chronicle_record",
  "ownerScope": "character",
  "ownerId": "character.example",
  "sourceSystem": "chronicle",
  "sourceRecordId": "chronicle.example",
  "targetSystem": "knowledge",
  "targetId": "knowledge_snippet.example",
  "authority": "display_only",
  "persistencePolicy": "account_profile",
  "notes": "Planning only; not live content."
}
```

Do not implement this shape until a dedicated schema/runtime pass is scoped.

## Non-Grant Rules

- Chronicle visibility does not create evidence by itself.
- A Chronicle record does not prove family ownership unless it explicitly carries a family owner scope and valid owner id.
- Renown/Reputation does not grant Family Prestige.
- Reputation does not prove knowledge.
- Quest visibility or acceptance does not grant reward evidence.
- Quest completion does not grant knowledge unless explicit outcome evidence exists.
- Backstory selection does not create scoped evidence.
- Legacy catalog presence does not equal purchase ownership.
- Magic inert envelopes do not emit Chronicle/Renown/quest records.
- Combat outcomes do not emit Chronicle/Renown/quest records until event owners exist.
- UI cannot create evidence by selecting a record, source, backstory, family, or character.

## Future Validation Rules

Future evidence validation should protect:

- known owner scopes only
- owner id format by owner scope
- target system and target id compatibility
- evidence kind compatibility with source system
- wrong-owner evidence fails
- missing owner evidence fails
- display-only records cannot unlock behavior
- UI-provided ids are not accepted as authority
- Chronicle text is not parsed into ownership
- Renown/Reputation cannot masquerade as Prestige currency
- account evidence cannot silently become family or character evidence
- family evidence cannot silently become character evidence
- character evidence cannot silently become account/family evidence

## Recommended Future Pass Order

Recommended sequence when this pillar becomes active:

1. `Chronicle-Renown Evidence Source Map`
   - inspect current Chronicle projection, reputation award content, account meta UI, and quest reward paths
   - docs-only
2. `Evidence Owner Vocabulary Plan`
   - define durable owner scopes and target systems for evidence
   - planning only
3. `Chronicle Evidence Validation Helper Plan`
   - plan pure helpers for wrong-owner/missing-owner/display-only validation
   - no mutation
4. `Chronicle-Renown Evidence Projection Helper`
   - pure read-only projection over explicit evidence records
   - no event creation
5. `Quest/Chronicle Knowledge Evidence Plan`
   - define how quest/Chronicle records can eventually reference knowledge discovery without auto-completion
6. `Runtime Event Output Ownership Plan`
   - define how combat/magic/economy/advancement output events become Chronicle/Renown/quest candidates later

## Forbidden Until Explicitly Scoped

Do not add or change:

- Chronicle/Renown event creation
- quest event creation
- save/account/session evidence state
- Family Prestige earning/spending
- Chronicle Marks or Lineage Seals runtime behavior
- scoped Backstory evidence mutation
- knowledge completion from Chronicle/quest/Renown
- known-spell acquisition from Chronicle/quest/Renown
- item/heirloom transfer from Chronicle/quest/Renown
- UI command buttons
- generated output
- content JSON records
- schema migrations
- runtime dispatch/event envelopes

## Recommended Next Connector Work

The next useful connector-only pass is:

- `Economy Command Surface Source Map`

Rationale: economy clarity projections exist, but shop/trade/craft/caravan command behavior and UI remain deferred. That pillar needs command-surface boundaries before runtime work.

## Recommended Future Codex Work

Do not schedule this pillar ahead of the active knowledge-domain sequence unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Chronicle-Renown Evidence Source Map`

It should remain docs-only and should not alter Chronicle, reputation, quest, account, save, UI, or runtime behavior.
