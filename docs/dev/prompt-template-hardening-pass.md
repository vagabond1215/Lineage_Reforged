# Prompt Template Hardening Pass

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Status: connector-only prompt guidance; no runtime/source/UI/content changes

## Purpose

This pass creates reusable prompt scaffolds for future Codex work so implementation prompts stay narrow, current-data-safe, and easier to validate.

This document does not:

- replace `AGENTS.md`
- replace `docs/dev/current-gpt-handoff.md`
- replace `docs/dev/current-codex-output.md`
- edit runtime/source/schema/UI/content files
- grant permission to implement broad systems
- update generated UI output

## Required Outside-Prompt Routing Block

Every generated development prompt should start with an outside-prompt recommendation block:

```text
Recommended platform/tool/model: <one accepted label>
Why: <short reason>
Manual preflight: <pull/sync/include files/none>
Token posture: <tight / medium / broad but bounded>
Research needed: <none / web / repo-only / deep research>
```

Accepted labels:

- ChatGPT via GitHub Connector
- ChatGPT Deep Research
- ChatGPT Agent Mode
- Codex 5.5 Plan Mode
- Codex 5.5 Local
- Codex 5.5 Cloud

Do not put this routing block inside the copy-paste prompt body.

## Universal Codex Prompt Skeleton

```text
Version X.Y.Z - Short Name

Goal:
<one-sentence goal>

Read first:
- AGENTS.md
- README.md
- docs/dev/current-codex-output.md
- docs/dev/current-gpt-handoff.md
- docs/dev/project-roadmap.md when version order/tool routing matters
- docs/design/future-system-design-ledger.md when design criteria/vocabulary/future-system boundaries matter
- <specific source docs/files>

Scope:
- <allowed work>

Do not:
- <forbidden work>

Implementation constraints:
- Use current branch reality only.
- Do not add backwards compatibility, migration aliases, old-save rescue, or old-account preservation unless explicitly requested.
- Keep the patch narrow and owner-aware.
- Do not import design docs or draft catalogs into runtime code unless this prompt explicitly says to migrate live content.
- Do not update docs/dev/current-codex-output.md until the end of the Codex run.

Validation:
- <focused tests/commands>
- If a broad workspace command fails for known pre-existing reasons, report it and keep focused validation clear.

Required output:
Update docs/dev/current-codex-output.md with:
- source version/run
- date
- branch/status assumption
- files changed
- checks run
- behavior/runtime confirmation
- risks/follow-up
- next recommended version
- suggested commit message
```

## Docs-Only Connector Prompt Skeleton

Use for GitHub Connector planning/audit/tiny docs edits.

```text
Run a ChatGPT via GitHub Connector docs-only pass.

Goal:
<goal>

Inspect:
- <files>

Allowed:
- create/update focused docs only
- update roadmap/handoff only if this pass changes routing or queue status

Forbidden:
- runtime/source/schema/UI/content changes
- generated output changes
- docs/dev/current-codex-output.md edits
- broad backlog rewrites from partial fetches
- treating planning docs as implementation permission

Output:
- concise result
- created/updated files
- commit sha(s)
- next recommended pass
```

## Temporary Guardrail Cleanup Requirement

When a prompt references a focused audit/source/guardrail doc, include an explicit cleanup decision in the required output.

Use this block when relevant:

```text
Temporary guardrail cleanup:
- State whether any focused audit/source docs used by this run remain useful.
- If a doc is consumed, implemented, superseded, or promoted into another durable file, delete it in this run or recommend exact deletion/folding follow-up.
- Do not leave temporary guardrail docs accumulating as a second backlog.
```

Apply this especially to docs such as:

- `docs/design/*-audit.md`
- `docs/design/*-scoping-pass.md`
- `docs/dev/*-triage-plan.md`
- `docs/dev/*-hardening-pass.md`

Do not delete a focused guardrail doc before its guidance has been consumed, implemented, superseded, or promoted into `current-gpt-handoff.md`, `project-roadmap.md`, `future-system-design-ledger.md`, `future_content_backlog.md`, or `current-codex-output.md`.

## Content Draft Prompt Guardrails

Use when authoring content records.

Required prompt fields:

- State whether records are live, draft-only, hidden, catalog-visible, inert, or effect-bearing.
- State whether runtime imports the target file.
- State what UI surfaces can currently see the records.
- State whether `implementationPriority`, `scope`, `currency`, or `purchaseMode` are enforcement fields or descriptive only.
- Include tests proving no accidental visibility or execution when required.

Forbidden shortcuts:

- assuming `catalog_only` hides records unless runtime enforces it
- adding live records without checking existing UI readers
- importing draft docs into runtime
- adding generic effect execution

## Resolver / Evidence Prompt Guardrails

Use for Backstory Eligibility, Legacy purchase evidence, Bloodlines evidence, renown, or family ownership.

Required:

- identify caller/source of evidence
- identify owner id: account, family, region, institution, estate/title, source-run, or character
- state whether the owner exists in current data
- prove wrong-owner evidence fails
- prove missing owner evidence fails
- prove UI cannot fabricate evidence

Forbidden:

- deriving `familyId` from `sourceRunId`
- deriving family from `lineageId`
- deriving status/title from estate or wealth alone
- passing ids by hand without scoped helper/owner validation

## View-Model / Read-Only UI Prompt Guardrails

Use for Bloodlines, Chronicle summary, economy clarity, calendar popup, magic compendium, or account meta surfaces.

Required:

- pure projection first
- current data only
- empty states
- missing/partial data behavior
- no mutation
- no action buttons unless behavior exists
- focused view-model tests before/with UI

Forbidden:

- React sprawl before view-model plan
- fake placeholders that imply live actions
- generated lore unsupported by data
- hidden resolver/purchase calls from UI
- mutation from summary/presentation views

## High-Risk Runtime Prompt Guardrails

Use for combat, economy, magic runtime, save/account schema, Legacy behavior, progression math.

Required:

- exact function/files in scope
- exact behavior changed
- focused tests
- old behavior confirmation where relevant
- clear forbidden adjacent systems

Forbidden:

- broad rewrites
- formula changes without tests
- weakening validation
- direct skill rank grants outside policy
- generic tag-driven execution
- save/account schema changes without explicit current-data rules

## Recommended Use

Future ChatGPT responses can cite this document when generating Codex prompts, but the prompt itself should still be tailored to the current task.

Do not blindly copy the universal skeleton if a shorter prompt is enough. Token discipline still applies.
