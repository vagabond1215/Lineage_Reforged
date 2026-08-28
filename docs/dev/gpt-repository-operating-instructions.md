# GPT Repository Operating Instructions

Date: 2026-07-12
Updated: 2026-08-27
Status: active run-agnostic GPT operating guide for Lineage Reforged repository continuance
Audience: GPT threads that inspect, summarize, prompt, or cautiously update the Lineage Reforged repository

## 1. Purpose And Workflow Priority

This document defines how a GPT thread should continue the Lineage Reforged repository workflow.

Repository workflow is the default interpretation when the user asks to inspect the repository, continue the project, determine the next task, generate the next prompt, inspect the last run, or update project instructions.

Prior conversation context about settlement images, environment art, image-generation prompts, or other asset production must not redirect a repository-workflow request. Treat that context as relevant only when the user explicitly asks for visual or asset work. For repository continuation, use the current GPT/Codex coordination files and live GitHub state.

This guide does not replace live repo inspection, active handoffs, current prompts, design decisions, schemas, validators, content, tests, or explicit user instructions.

Use `docs/dev/codex-vs-gpt-connector-handling-procedure.md` for the current GPT/Connector versus Codex division of labor and `docs/dev/codex-resource-budget-and-execution-slicing-policy.md` when constrained Codex/high-reasoning resources affect package size or sequencing.

## 2. Core Rule: Inspect Before Acting

For repository facts, prefer fresh repository state over memory, prior chat summaries, stale pasted context, or assumptions.

Before making current-state claims, inspect the repository through the GitHub connector when available. Do not use web search for internal repository facts.

If live repository access is unavailable, state what could not be verified and clearly separate remembered or user-provided context from verified state.

## 3. Primary Source Order

Use this order when reconstructing current project state:

1. Latest commit and current `master` state.
2. `docs/dev/current-codex-output.md` for the latest completed run, reported checks, behavior confirmation, risks, and suggested next version.
3. `docs/dev/current-gpt-handoff.md` for immediate GPT-side status, guardrails, and next route.
4. `docs/dev/current-codex-prompt.md` for the active executable Codex prompt body.
5. The latest design, audit, boundary, pause, deferral, closure, or selection document named by the output, handoff, or prompt.
6. `docs/dev/codex-sequenced-implementation-plan.md` for the ordered near-term queue.
7. `docs/dev/project-roadmap.md` for durable roadmap and maturity posture.
8. `docs/future_content_backlog.md` for deferred work and historical notes.
9. Durable coordination documents, including:
   - `docs/design/pipeline-roadmap-consolidation-decision.md`;
   - `docs/design/gpt-deep-research-version-tracking-decision.md`;
   - `docs/design/future-system-design-ledger.md`;
   - `docs/dev/gpt-codex-tooling-instructions.md`.

If sources conflict, prefer the more recent and more specific source, and report the conflict rather than silently merging incompatible instructions.

## 4. Tool, Mode, And Function Routing

Do not default every task to one tool, mode, reasoning level, or function. Select the smallest route that preserves accuracy and work quality.

### 4.1 GPT With GitHub Connector

Use GPT plus the GitHub connector for:

- current-state reconstruction;
- `inspect last` and acceptance reviews;
- targeted repository searches and file reads;
- choosing the next route;
- drafting or revising the active Codex prompt;
- narrow documentation writes explicitly requested by the user;
- reporting repository-backed findings with citations.

Prefer connector functions according to task:

- `compare_commits` for `master~1..master` inspection;
- `fetch_file` for known files, with `ref: master` and line ranges for large documents;
- repository-scoped `search` for exact symbols, phrases, paths, or evidence before opening large files;
- `update_file` only after fetching the current file SHA;
- sequential writes when updating the same path;
- focused reads rather than downloading broad catalogs or large generated files.

Batch independent reads when useful, but do not perform speculative broad searches that add tokens without improving the decision.

### 4.2 Codex Local

Use Codex Local or the current authenticated repository-capable execution surface when the task requires the local worktree, production/source mutation, commands, tests/lint/build/typecheck, executable probes, local branch operations, or independent executable acceptance.

Select the current supported model/reasoning tier from a fresh capability and resource preflight. Do not hard-code one model as the permanent default.

- Use the strongest/highest-cost reasoning only for slices that materially need it, such as multi-owner semantics, persistence/idempotency, migration, representative integration, or adversarial acceptance.
- When that tier is constrained, narrow the slice and move repository discovery/packaging to Connector work first.
- Use a lighter supported local reasoning level for deterministic bounded implementation when it preserves quality.
- Use Plan mode for decision-complete non-mutating planning when implementation is not authorized.
- Use another larger execution surface only when its capabilities materially improve completion and repository policy permits it.

Codex prompts must name the required validations, scope boundaries, package-size/checkpoint posture, and what Connector evidence may be reused through delta verification. Do not ask Codex to infer permission from adjacent roadmap work.

### 4.3 Deep Research

Use Deep Research only when the active pipeline selects a named research gate, the user explicitly requests external research, or repo-local evidence is insufficient for a broad domain question.

Use Light when adequate. Use High only when source breadth, ambiguity, or consequence justifies the additional cost. Deep Research does not edit the repository and does not create canon automatically.

### 4.4 Web, Assets, And Specialized Skills

Use web search only for external or time-sensitive facts. Use official sources for current OpenAI product behavior.

Use image, mood-board, scene, shot, UI, browser-game, or asset-production skills only for an explicit visual, asset, UI, or playtest request. They are not substitutes for the GPT/Codex repository workflow.

Use CI or review-follow-up workflows only when checks or review comments are actually involved. Use publish workflows only when the user asks to commit, push, or open a pull request through that route.

## 5. Prompt Persistence And Chat Packaging

`docs/dev/current-codex-prompt.md` is the authoritative active prompt body.

When the user asks GPT to generate, prepare, revise, or advance the next Codex prompt:

1. Inspect the current output, handoff, active prompt, relevant lane document, sequence, and roadmap as needed.
2. Determine the exact next route without inventing a new route or bypassing a gate.
3. Write the complete prompt body to `docs/dev/current-codex-prompt.md` through the GitHub connector.
4. Fetch the updated file to verify the write.
5. In chat, give the selected tool/mode line directly, outside the prompt body.
6. Report the updated path and commit SHA.

For the currently active route, the chat mode line is:

```text
Codex 5.6 Sol Local High.
```

Do not store the platform/tool/mode line inside `docs/dev/current-codex-prompt.md`. The prompt file should begin with `# Current Codex Prompt` and then the executable task body.

Do not merely reproduce a newly drafted prompt in chat when the user asked to generate or update the next repository prompt. Persist it first.

When the user asks only to display the current prompt:

1. Fetch `docs/dev/current-codex-prompt.md` fresh.
2. Give the appropriate mode line in chat.
3. Then reproduce the exact prompt body without silently editing it.

## 6. Prompt Quality And Token Discipline

A Codex prompt should usually include:

- repository and branch;
- route/version title;
- current accepted repository state;
- purpose;
- required first steps;
- primary sources and targeted evidence areas;
- expected output;
- required decisions or implementation requirements;
- guardrails and non-goals;
- allowed changes;
- validation;
- suggested commit message.

Optimize work quality and token use by:

- reading the exact current coordination files before drafting;
- searching for specific evidence before opening large files;
- using line-ranged reads for long documents;
- naming the minimum source set required for the task;
- requiring targeted discovery rather than full-repository scans;
- avoiding repeated restatement of durable guardrails when a precise reference is sufficient, while retaining all scope-critical restrictions;
- using focused tests for changed authorities and broader lint only when the active route requires it;
- excluding unrelated asset, UI, runtime, content, or research work.

Do not optimize tokens by omitting a necessary owner boundary, validation command, allowed-path list, or anti-canon guardrail.

## 7. Standard User Commands

### 7.1 `inspect last`

When the user says `inspect last`, `inspect las`, `inspect last push`, `check last`, or similar wording:

1. Search recent commits.
2. Compare `master~1..master`.
3. Fetch the principal changed decision/output/handoff/prompt files.
4. Fetch workflow status for the latest commit when available and relevant.
5. Compare the landed change against the active prompt.
6. Return an acceptance verdict and the next route.

Do not repeat a full repository audit unless the latest diff requires it.

### 7.2 `inspect repo`

When the user asks to inspect the current repository:

1. Inspect recent commit state.
2. Fetch current output, handoff, and prompt.
3. Inspect sequence, roadmap, backlog, and lane-specific documents only as needed to verify alignment.
4. Identify the latest completed primary route, latest support route, active route, pipeline integrity, and any mismatch.

### 7.3 `prompt please`

When the user asks for the current prompt:

1. Fetch the active prompt fresh.
2. Give the selected mode line directly in chat.
3. Output the exact prompt body.
4. Do not rely on stale prompt text.

### 7.4 `generate the next prompt`

When the user asks to generate the next prompt:

1. Inspect current repository coordination state.
2. Draft the exact next prompt.
3. Update `docs/dev/current-codex-prompt.md`.
4. Verify the updated file.
5. Give the selected mode line and concise write confirmation in chat.

## 8. Repo File Updates

When the user explicitly asks GPT to create, update, or delete repository files:

1. Use the GitHub connector.
2. Keep the change narrow and preserve unrelated work.
3. Fetch the current file and SHA before replacing it.
4. Do not alter pipeline coordination files unless requested or required by the requested workflow action.
5. After writing, fetch the changed file and cite relevant lines.
6. Report the returned commit SHA.

Never claim a file was changed unless the connector returned a successful write result.

## 9. Acceptance Review Rules

When reviewing a completed Codex run, verify:

- changed paths were allowed or explicitly justified;
- docs-only runs did not modify content, schema, validators, tests, runtime, UI, save/account, or gameplay files;
- output, handoff, prompt, sequence, roadmap, and backlog agree on the next route;
- reported checks satisfy the active prompt;
- gated, paused, rejected, closed, and maturity-gated lanes remained closed unless qualifying input was supplied;
- no candidates, ids, canon, references, migrations, consumers, schemas, or runtime behavior were invented outside scope;
- temporary artifacts were retained or retired according to the active route;
- the run selected no more than the permitted number of next routes.

If something is missing, state whether it is informational, a follow-up, or an acceptance blocker.

## 10. Roadmap And Gate Discipline

Do not collapse staged work unless the active prompt authorizes it.

Common gates include:

- evidence audit;
- owner boundary decision;
- evidence deferral;
- schema-readiness decision;
- schema plan;
- schema, validator, and focused tests;
- seed plan;
- content implementation;
- normal-lint registration;
- reference integration;
- consumer integration;
- runtime readiness;
- runtime implementation.

When uncertain, choose a narrow docs-only route rather than implementation.

## 11. General Guardrails

Unless the active prompt says otherwise:

- do not invent canon, candidates, or ids;
- do not normalize prefixes;
- do not create schemas, validators, tests, content, wrappers, references, migrations, adapters, consumers, or runtime behavior;
- do not modify UI, account, save, gameplay, or generated artifacts;
- do not reopen gated lanes without materially new qualifying input;
- do not run Deep Research unless a research gate or explicit user request justifies it;
- do not advance to a new version band without a dedicated readiness decision.

Generated analysis, examples, visual prompts, and external research do not authorize project canon by themselves.

## 12. Minimal New-Thread Startup Procedure

When a new GPT thread is asked to continue the project:

1. Search recent commits in `vagabond1215/Lineage_Reforged`.
2. Fetch `docs/dev/current-codex-output.md`.
3. Fetch `docs/dev/current-gpt-handoff.md`.
4. Fetch `docs/dev/current-codex-prompt.md`.
5. Identify the latest completed route, latest support route, active route, expected output, allowed changes, guardrails, and validation.
6. Fetch the latest lane-specific decision named by the handoff or prompt when needed.
7. Follow the GPT/Codex workflow in this guide rather than unrelated prior asset-prompt context.

This is the default procedure for reconstructing the correct repository purpose and next action.