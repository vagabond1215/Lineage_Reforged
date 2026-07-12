# GPT Repository Operating Instructions

Date: 2026-07-12
Status: active run-agnostic GPT operating guide for Lineage Reforged repository continuance
Audience: GPT threads that need to inspect, understand, summarize, prompt, or cautiously update the Lineage Reforged repository

## 1. Purpose

This document gives generic operating instructions for a new GPT thread working with the Lineage Reforged repository. It is deliberately not tied to one version, pass, route, or Codex run.

Use it when the user asks a new thread to inspect the repository, continue the project, recover current context, write the current Codex prompt, or decide the correct next repo-facing action.

This document is an orientation and operating guide. It does not replace live repo inspection, active handoff files, current prompts, design decisions, schemas, validators, content, tests, or user instructions.

## 2. Core Rule: Inspect Before Acting

For repository facts, always prefer fresh repository state over memory, prior chat summaries, stale pasted context, or assumptions.

Before making current-state claims, inspect the repo through the GitHub connector when available. At minimum, fetch or inspect the files needed to answer the user's specific request.

Do not use web search for internal repository facts. Use web search only for external or time-sensitive facts that are not in the repository.

If the GitHub connector is unavailable, say that live repo verification is unavailable and clearly separate any remembered or user-provided context from verified repository state.

## 3. Primary Source Order

Use the following source order when reconstructing current project state.

1. Latest commit and current branch state from GitHub.
2. `docs/dev/current-codex-output.md` for the latest completed run, reported checks, behavior confirmation, risks, and suggested next version.
3. `docs/dev/current-gpt-handoff.md` for GPT-facing status, guardrails, and immediate next route.
4. `docs/dev/current-codex-prompt.md` for the active Codex prompt and exact next task.
5. The latest design document or decision document named by the output, handoff, or prompt.
6. `docs/dev/codex-sequenced-implementation-plan.md` for ordered near-term sequence.
7. `docs/dev/project-roadmap.md` for durable roadmap posture.
8. `docs/future_content_backlog.md` for deferred work and historical notes.
9. Durable coordination documents, including:
   - `docs/design/pipeline-roadmap-consolidation-decision.md`;
   - `docs/design/gpt-deep-research-version-tracking-decision.md`;
   - `docs/design/future-system-design-ledger.md`;
   - current lane-specific boundary, audit, deferral, pause, closure, or rejection documents.

If these sources conflict, prefer the more recent and more specific source, but state the conflict instead of silently merging incompatible instructions.

## 4. Standard User Commands

### 4.1 `inspect last`

When the user says `inspect last`, `inspect las`, `inspect last push`, `check last`, or similar wording:

1. Search recent commits in `vagabond1215/Lineage_Reforged`.
2. Compare `master~1..master`.
3. Fetch the main changed design/output/handoff/prompt files from the latest diff.
4. Fetch workflow runs for the latest commit if the connector supports it.
5. Decide whether the latest change should be accepted, flagged, or treated as incomplete.
6. Summarize with this structure:
   - latest commit;
   - diff scope;
   - completed route;
   - key decisions;
   - guardrails preserved or violated;
   - checks reported;
   - handoff alignment;
   - active prompt alignment;
   - workflow status;
   - acceptance verdict;
   - next route.

Do not repeat a full repository audit unless the latest diff requires it.

### 4.2 `inspect repo`

When the user says `inspect repo`, `inspect current repo`, or similar wording:

1. Search recent commits.
2. Inspect the current output, handoff, and prompt.
3. Compare from a meaningful recent baseline if needed to understand a merge, support insertion, or route displacement.
4. Fetch roadmap/sequence/backlog only when needed to verify alignment.
5. Summarize the current repository state, not only the last commit.
6. Explicitly identify the current active route and whether any support route displaced, preserved, or restored the main pipeline.

### 4.3 `prompt please`

When the user asks for the current Codex prompt:

1. Fetch `docs/dev/current-codex-prompt.md` fresh from GitHub.
2. Output the exact file content only, wrapped as:

```markdown
:::writing{variant="document" id="<random 5-digit>"}
<exact current-codex-prompt.md content>
:::
```

Do not summarize. Do not rely on stale prompt text.

### 4.4 Prompt drafting

When drafting a new Codex prompt, follow the current repository's prompt style unless the active files show a different standard.

Use this wrapper in chat:

```markdown
:::writing{variant="document" id="<random 5-digit>"}
# Current Codex Prompt

Codex 5.6 Sol Local High.

...
:::
```

A prompt should usually include:

- repository and branch;
- route/version title;
- current accepted repo state;
- purpose;
- required first steps;
- expected output;
- required decisions;
- guardrails;
- allowed changes;
- validation;
- suggested commit message.

### 4.5 Repo file updates

When the user explicitly asks GPT to create, update, or delete repository files:

1. Use the GitHub connector.
2. Keep the change narrow.
3. Do not alter the active route, handoff, prompt, roadmap, or output unless the user asks for that or the requested file itself is one of those coordination files.
4. Prefer adding standalone support documentation over modifying pipeline files when the request is general guidance.
5. After writing, fetch the changed file and cite relevant lines in the response when possible.
6. Report the new commit SHA returned by the connector.

Never claim a repository file was changed unless the connector returned a successful write result.

## 5. Citation And Evidence Rules

When answering from repository state, cite fetched file lines.

Use citations for:

- current commit facts;
- current route/version facts;
- file contents;
- reported checks;
- guardrails and gates;
- active prompt requirements;
- handoff status.

Do not cite old thread citations unless they were fetched in the current thread. Do not invent sandbox links for connector files.

## 6. Acceptance Review Rules

When reviewing a completed Codex run, do not accept it only because files changed. Check the change against the active prompt.

Verify:

- changed files are within allowed scope or explicitly justified;
- docs-only runs did not modify content, schema, validator, test, runtime, UI, save/account, or gameplay files;
- current output, handoff, prompt, sequence, roadmap, and backlog agree on the next route;
- reported checks match the prompt's validation expectations;
- no gated, paused, rejected, closed, or maturity-gated lane was reopened without qualifying input;
- no candidate ids, schema plans, content records, references, migrations, consumers, runtime behavior, or canon were invented outside scope;
- temporary artifacts were deleted or retained according to the prompt's cleanup decision;
- the run selected exactly one next route when required.

If something is missing, state the issue and whether it blocks acceptance.

## 7. Roadmap And Gate Discipline

Most Lineage Reforged lanes are intentionally staged. Do not collapse audit, boundary, deferral, schema, validator, content, registration, reference, consumer, and runtime steps into one pass unless the active prompt explicitly authorizes it.

Common gates:

- evidence audit;
- owner boundary decision;
- evidence deferral;
- schema-readiness decision;
- schema plan;
- schema/validator/focused tests;
- seed plan;
- content implementation;
- normal-lint registration;
- reference integration;
- consumer integration;
- runtime readiness;
- runtime implementation.

When in doubt, choose a narrow docs-only decision route rather than implementation.

## 8. General Guardrails

Unless the active prompt says otherwise:

- do not invent canon;
- do not create candidates or ids;
- do not normalize prefixes;
- do not create schemas, validators, tests, content, wrappers, references, migrations, adapters, consumers, or runtime behavior;
- do not modify UI, account, save, gameplay, or generated artifacts;
- do not reopen gated lanes without materially new qualifying input;
- do not run or request Deep Research unless a research gate is selected or the user explicitly asks for research;
- do not advance to a new version band without a dedicated readiness decision.

Generated analysis, examples, and external research do not authorize project canon by themselves.

## 9. Handling User Design Ideas

When the user proposes a new system or design direction:

1. Classify whether it is a future idea, current-route concern, authored canon, external research topic, or repo update request.
2. Check whether the active route allows it.
3. If it crosses multiple owners, recommend a docs-only boundary or intake route rather than schema/content work.
4. Preserve current pipeline order unless the user explicitly chooses to interrupt it.
5. Capture useful questions and future route names, but do not mutate repo files unless asked.

For civic, property, government, jurisdiction, force, diplomacy, conflict, People/NPC, institution, business, faction, manuscript, runtime, save/account, magic, or broad economy ideas, assume multiple owners are involved until the repo proves otherwise.

## 10. Deep Research Handling

Use Deep Research for broad external comparison, domain research, or system-design exploration when repo-local evidence is insufficient and the user wants research.

Deep Research output should not become permanent project authority automatically. A later repository integration pass should:

- add a temporary research artifact if appropriate;
- add or update a compact intake route;
- promote only durable repo-corrected guidance into permanent design docs;
- delete the temporary artifact when fully consumed;
- preserve existing owners and gates;
- authorize no implementation unless a later route does so.

## 11. Output Style

Use concise markdown with clear headings. For inspections, prefer:

```markdown
## Inspect last

### Latest commit

### Diff scope

### Completed route

### Key decisions

### Handoff state

### Active prompt

### Checks reported

### Workflow status

### Acceptance

### Next route
```

For broader repo inspection, prefer:

```markdown
## Repo inspection

### Current commit state

### Current accepted state

### Active route

### Pipeline integrity

### Gated and paused lanes

### Risks or mismatches

### Next action
```

Be explicit about uncertainty. If a tool call fails or a file cannot be fetched, say what was not verified.

## 12. Minimal New-Thread Startup Procedure

When a new GPT thread is asked to continue the project, run this procedure before advising next actions:

1. Search recent commits in `vagabond1215/Lineage_Reforged`.
2. Fetch `docs/dev/current-codex-output.md`.
3. Fetch `docs/dev/current-gpt-handoff.md`.
4. Fetch `docs/dev/current-codex-prompt.md`.
5. Identify the latest completed route, latest support/audit route, immediate next route, expected output, allowed changes, guardrails, and validation.
6. Fetch the latest design decision named by the handoff or active prompt if needed.
7. Report the current route and ask no clarification unless the user's intended action is ambiguous or would modify the repo.

This procedure is the default way for a new thread to ascertain correct operating instructions and purposes from the repository itself.
