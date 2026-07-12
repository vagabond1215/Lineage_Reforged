# GPT And Codex Tooling Instructions

Date: 2026-07-12
Status: active GPT/Codex operating guide for Lineage Reforged
Audience: GPT threads, Codex prompt authors, and users choosing tools, modes, functions, and prompt packaging

## 1. Purpose

This guide standardizes how Lineage Reforged work should be routed among GPT, the GitHub connector, Codex, Deep Research, web search, CI/review workflows, and specialized asset or game skills.

The goal is not to default to one tool or maximum reasoning for every task. Select the least expensive route that still preserves repository accuracy, scope control, validation quality, and user intent.

Repository continuation, roadmap inspection, next-route selection, and prompt generation are GPT/Codex workflow tasks. Prior settlement-image or asset-prompt context must not override this workflow unless the user explicitly asks for visual production.

This guide is operational guidance. It does not replace current output, handoff, prompt, roadmap, permanent design decisions, schemas, validators, content, tests, or explicit user instructions.

## 2. Current-State Authority

At the start of repository work, prefer live repository state over memory.

Use these sources in order:

1. Latest commit and current `master` state.
2. `docs/dev/current-codex-output.md`.
3. `docs/dev/current-gpt-handoff.md`.
4. `docs/dev/current-codex-prompt.md`.
5. The active lane-specific decision, audit, deferral, pause, closure, or selection document.
6. `docs/dev/codex-sequenced-implementation-plan.md`.
7. `docs/dev/project-roadmap.md`.
8. `docs/future_content_backlog.md`.
9. `docs/design/pipeline-roadmap-consolidation-decision.md` and other durable coordination decisions.
10. `docs/dev/gpt-repository-operating-instructions.md` for GPT command behavior and prompt persistence.

When sources conflict, prefer the newer and more specific source and report the mismatch.

## 3. Routing Decision

Before choosing a tool, classify the task:

- **Repo inspection or next-route reasoning:** GPT plus GitHub connector.
- **Prompt drafting or revision:** GPT plus GitHub connector; persist the prompt to the active prompt file.
- **Narrow requested repo-doc write:** GPT plus GitHub connector when direct editing is sufficient.
- **Local multi-file edit, command execution, tests, lint, or implementation:** Codex Local.
- **Non-mutating implementation plan:** Codex Plan mode.
- **Broad external research with citations:** Deep Research or web research, only when justified.
- **Failing checks or CI logs:** CI Debug / GitHub Fix CI workflow.
- **Review comments:** Review Follow-up workflow.
- **Commit, push, or PR creation:** Publish Changes workflow when explicitly requested.
- **Visual assets, mood boards, environment scenes, or image prompts:** image/creative tools only when explicitly requested.
- **Browser UI, gameplay architecture, or playtesting:** game/browser skills only when the active task requires them.

Do not use a visual or asset skill merely because earlier conversation context discussed settlement images.

## 4. GPT And GitHub Connector

Use GPT for reasoning, route selection, prompt authorship, acceptance review, and concise explanation.

Use the GitHub connector for repository evidence and narrow writes.

### 4.1 Function Selection

Choose connector functions deliberately:

- `compare_commits` with `base: master~1` and `head: master` for `inspect last`.
- `fetch_file` for known paths; pass `ref: master` for current-state reads.
- `fetch_file` with `start_line` and `end_line` for long documents when only one section is needed.
- repository-scoped `search` for exact terms, symbols, paths, ids, or evidence before opening large files.
- `fetch_commit_workflow_runs` or status functions only when workflow status is relevant.
- `update_file` for an existing file only after fetching its current SHA.
- `create_file` only when the path is confirmed absent and the route authorizes a new file.
- sequential updates for the same path; never issue competing writes in parallel.

Avoid broad unscoped searches, repeated full-file reads, and large catalog fetches when a targeted query or line range will answer the question.

### 4.2 Direct Connector Writes

Direct GPT connector writes are appropriate for:

- user-requested operating-guide changes;
- active prompt-file updates;
- narrow documentation corrections;
- small handoff or coordination edits when explicitly requested.

Use Codex instead when local validation, multiple interdependent edits, code/content changes, or tests are required.

After a connector write:

1. record the returned commit SHA;
2. fetch the changed file again;
3. verify the intended text and path;
4. cite the changed lines in the response.

## 5. Codex Mode Selection

Select the current supported Codex model, execution environment, and reasoning level according to the task. Do not use one fixed setting for every request.

### 5.1 Codex 5.6 Sol Local High

Use **Codex 5.6 Sol Local High** when the task involves:

- cross-repository evidence classification;
- complex docs-only authority decisions with many owner boundaries;
- multi-file code, schema, validator, content, or test changes;
- risky edits requiring careful scope control;
- substantial validation and reconciliation of coordination files.

The active `Version 0.5.349 - Diplomacy Conflict Authority Evidence Audit` should use this mode.

### 5.2 Lighter Local Reasoning

Use a lighter supported local reasoning level for a trivial, tightly bounded task when:

- the changed path is obvious;
- no broad evidence classification is needed;
- validation is narrow;
- using High would add cost without improving confidence.

The prompt should still state exact scope, allowed paths, and validation.

### 5.3 Plan Mode

Use Codex Plan mode when the result should be a decision-complete plan and repository mutation is not authorized.

Plan mode must not write files, run cleanup, update output files, stage changes, or claim implementation.

### 5.4 Cloud

Use Cloud only when the task is materially larger than a normal local run and the benefit is clear. Do not select it merely because it is available.

## 6. Deep Research And Web Research

### 6.1 Deep Research

Use Deep Research for broad external comparison, domain research, or system-design exploration when:

- the active roadmap selects a named `GPT-DR.*` gate;
- the user explicitly requests research;
- repo-local evidence is insufficient and external sources are necessary.

Use Light when adequate. Use High only when source breadth, ambiguity, or consequence justifies it.

Do not use Deep Research for:

- ordinary repo inspection;
- current prompt generation;
- docs-only integration already supported by repository evidence;
- schema/validator/test implementation;
- CI fixes;
- formatting cleanup.

Deep Research output is non-canonical until a later repository integration pass promotes repo-corrected guidance.

### 6.2 Web Search

Use web search for current external facts, current OpenAI product behavior, laws, schedules, APIs, prices, or external sources. Use official OpenAI sources for OpenAI-product questions.

Do not use web search for internal repository facts available through GitHub.

## 7. Specialized Skills

Use specialized skills only when the task matches them.

| Task | Preferred route |
| --- | --- |
| Inspect latest commit | GPT + GitHub connector |
| Inspect current repository | GPT + GitHub connector |
| Generate or revise next prompt | GPT + GitHub connector, then update prompt file |
| Docs-only authority audit | Codex Local; High when evidence breadth warrants it |
| Schema/validator/test implementation | Codex Local with focused validation |
| CI failure | CI Debug / GitHub Fix CI |
| Review feedback | Review Follow-up |
| Commit/push/PR | Publish Changes when explicitly requested |
| External domain research | Deep Research with named gate or explicit request |
| Browser UI or playtest | Relevant game/browser skill |
| Visual concept or settlement asset | Image/creative skill only on explicit visual request |
| Matrix or large tabular audit | Spreadsheet skill when it improves analysis |

Asset-generation tools are not part of the default repository-continuation path.

## 8. Prompt Persistence

`docs/dev/current-codex-prompt.md` is the authoritative active prompt body.

When GPT generates, advances, or revises the next Codex prompt, it must:

1. inspect current output, handoff, prompt, sequence, roadmap, and active lane evidence as needed;
2. draft the exact next prompt body;
3. update `docs/dev/current-codex-prompt.md` through the GitHub connector;
4. fetch the updated file to verify it;
5. provide the selected mode line directly in chat;
6. report the path and commit SHA.

Do not only paste the new prompt in chat when the user asked to generate or update the repository's next prompt.

### 8.1 Mode Line Packaging

The platform/tool/mode line belongs in chat, outside the prompt file.

For the active route, give:

```text
Codex 5.6 Sol Local High.
```

Do not store that mode line inside `docs/dev/current-codex-prompt.md`.

### 8.2 Prompt File Shape

The prompt file should begin:

```text
# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.
```

A prompt should normally contain:

- route/version;
- current accepted state;
- purpose;
- required first steps;
- focused source reads;
- expected outputs;
- required decisions or implementation requirements;
- guardrails and non-goals;
- allowed changes;
- validation;
- suggested commit message.

### 8.3 Displaying The Current Prompt

When the user asks for the current prompt without requesting a change:

1. fetch the file fresh;
2. give the selected mode line in chat;
3. reproduce the exact prompt body;
4. do not silently edit or summarize it.

## 9. Token And Work-Quality Optimization

Optimize cost and quality together.

### 9.1 Repository Reads

- Search first when the relevant path or occurrence is unknown.
- Fetch exact known coordination files directly.
- Use line ranges for long docs.
- Avoid repeatedly fetching unchanged files in the same thread.
- Batch independent small reads when it reduces round trips.
- Do not fetch huge JSON catalogs unless the active evidence question requires them.

### 9.2 Prompt Scope

- Name the smallest sufficient source set.
- Require targeted discovery rather than full-repository scans.
- Preserve all critical owner boundaries and anti-canon rules.
- Avoid copying unrelated durable background into every prompt.
- Include exact allowed paths and validations.
- Use focused tests for changed areas; use normal content lint only when required by the active route.

### 9.3 Reasoning Level

- Use High for difficult evidence synthesis, risky multi-owner decisions, and substantial implementation.
- Use lighter reasoning for obvious, narrow edits.
- Use Plan mode when mutation is forbidden.
- Use Deep Research Light before High when Light can answer the external question.

Never reduce cost by omitting necessary validation, owner separation, source verification, or scope control.

## 10. Versioning And Research Gates

Codex primary passes use monotonic three-segment labels:

```text
Version 0.5.xxx - Title
```

Support runs may use a fourth segment and do not consume the next primary slot unless explicitly promoted.

GPT Deep Research gates use unnumbered labels:

```text
GPT-DR.<lane>.<topic>
```

Research gates do not consume Codex version numbers.

Do not roll to `0.6.0` because the patch number is large. Runtime ownership transition requires a dedicated readiness decision.

## 11. Project Guardrails

During the current `0.5.x` foundation phase:

- prefer evidence audits and boundary decisions before implementation;
- prefer schema decisions before schemas;
- prefer schema/validator/focused tests before content;
- prefer seed plans before content seeds;
- keep runtime, UI, save-state, mutation, transaction, service execution, combat execution, crafting execution, property state, NPC scheduling, and broad gameplay outside scope unless explicitly approved;
- do not invent canon, ids, candidates, relations, or historical facts;
- do not treat visual prompts or external research as canonical evidence;
- do not reopen gated, paused, rejected, or closed lanes without qualifying input;
- retire temporary research artifacts when their named consumer has fully promoted the useful guidance.

## 12. Standard Command Handling

### `inspect last`

- compare `master~1..master`;
- inspect changed paths and principal changed documents;
- compare the result against the active prompt;
- check reported validations and workflow status when available;
- give an acceptance verdict and next route.

### `inspect repo`

- inspect latest commit, output, handoff, and prompt;
- inspect sequence, roadmap, backlog, and lane-specific docs only as needed;
- report active route, pipeline integrity, gates, risks, and next action.

### `prompt please`

- fetch the current prompt fresh;
- give the selected mode line in chat;
- reproduce the exact prompt body.

### `generate the next prompt`

- inspect current coordination state;
- determine the exact next route;
- update `docs/dev/current-codex-prompt.md`;
- verify the write;
- give the selected mode line and commit confirmation in chat.

## 13. Maintenance

Update this guide when:

- supported Codex models or modes change materially;
- connector capabilities or preferred function patterns change;
- the prompt persistence workflow changes;
- a new project workflow becomes standard;
- GPT-DR tracking changes;
- runtime-readiness policy changes;
- the user identifies a better cost/quality routing pattern.

Do not update it for every normal Codex pass. Run-specific state belongs in current output, handoff, prompt, sequence, roadmap, and backlog.