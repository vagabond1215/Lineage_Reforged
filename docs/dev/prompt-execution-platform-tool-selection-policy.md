# Prompt Execution Platform, Tool, Mode, Model, And Plugin Selection Policy

Date: 2026-08-05

Updated: 2026-08-26

Status: durable prompt-generation and execution-routing authority

Applies to: every ChatGPT, Codex, GPT Work, Agent Mode, Deep Research, connector, plugin, or other agent prompt created for Lineage: Reforged

## 1. Purpose

Every development prompt must be routed to the execution surface that can complete the task with the best practical balance of:

- required repository, web, application, connector, local-worktree, or file access;
- reasoning quality and research depth;
- ability to edit, execute, validate, commit, and push;
- token, quota, rate-window, and product-pool usage;
- latency and coordination overhead;
- privacy, credential, and data-boundary requirements;
- installed and available plugins, connectors, skills, and tools;
- compatibility between the selected platform, mode, model, and required tools.

The best model is not automatically the best route. A high-quality model without the required access or execution tools is not a valid completion surface. A highest-cost reasoning tier is also not automatically the best surface for every slice of a difficult feature.

`docs/dev/codex-resource-budget-and-execution-slicing-policy.md` is the companion durable authority for Connector-first preparation, package sizing, checkpoint design, and interruption/resume behavior when constrained repository-capable/high-reasoning resources are known.

This policy supersedes fixed model/version and platform lists in older prompt templates. Historical examples remain useful illustrations only. They are not current availability authority.

## 2. Fresh Capability Inventory Is Mandatory

Before creating or revising any executable prompt, inspect the capabilities actually available at that time. Do not rely on a prior session, remembered product list, or model name stored in repository documentation.

Inventory at minimum:

1. available platforms and work surfaces;
2. available modes on each platform;
3. selectable models and reasoning levels;
4. repository and local-worktree access;
5. web browsing and Deep Research availability;
6. connected applications and data sources;
7. installed plugins, connectors, skills, and tools;
8. plugins or connectors that may be installable but are not installed or activated;
9. execution tools such as shell, tests, builds, typecheck, browser automation, document generation, or scheduled tasks;
10. token, quota, rate-window, or product-pool constraints that are visible or known;
11. whether the user has asked to conserve a constrained pool;
12. tool combinations that are unavailable or incompatible in the same surface or session.

If any material capability is unknown, state that uncertainty before the prompt. Do not silently assume access or quota behavior.

## 3. Access And Completion Authority Are Hard Gates

Select a platform only after confirming it can access the required evidence and complete the required actions.

Examples:

- A Deep Research surface may provide stronger external-source synthesis but may not have access to the private GitHub repository or a local checkout.
- ChatGPT via GitHub Connector can inspect and update remote repository files but cannot substitute for local tests, builds, typechecks, worktree inspection, or executable probes.
- Codex may have repository and worktree access but may not expose the same Deep Research, browser, application, or connector tools as regular ChatGPT.
- GPT Work, Agent Mode, or a successor workspace may expose connected applications or multi-step workflows that are not available in Codex or Deep Research.
- A plugin available in one ChatGPT mode may not be available in another mode, in Codex, or in a separate workspace.
- Local-only files, credentials, unsynced changes, or private services can invalidate a cloud or connector route.

A route that cannot perform required validation must be classified as research, planning, preparation, or evidence collection rather than implementation or acceptance.

## 4. Platform Families To Consider

The prompt creator must consider every currently available relevant surface, including successors or renamed equivalents.

### Regular ChatGPT

Consider for:

- conversational reasoning and synthesis;
- web research and source comparison;
- connected applications and data sources;
- installed plugins and skills;
- artifact, document, spreadsheet, presentation, or image workflows;
- orchestration and prompt preparation.

Do not assume regular ChatGPT has private-repository or local-worktree access unless an active connector or repository tool proves it.

### ChatGPT Deep Research

Consider for:

- broad external research;
- literature, standards, product, market, historical, scientific, or comparative evidence;
- source-heavy synthesis where depth matters more than repository mutation.

Deep Research is not automatically repository-aware. The user's currently reported operating constraint is that Deep Research can run without consuming Codex or GPT Work tokens, but cannot be granted private GitHub repository access through that surface. Treat this as a current user-specific observation and re-verify it whenever platform capabilities change.

When repository evidence is also required, use an explicit staged workflow rather than pretending one surface has both capabilities.

### ChatGPT Via GitHub Connector

Consider for:

- remote repository inspection;
- branch, commit, PR, issue, and file review;
- complete-file documentation edits;
- prompt, handoff, output, source-map, and small coordination updates;
- isolated connector-only audits;
- preparing exact implementation and validation requirements for Codex;
- preparing exact-head orientation packets, changed-file maps, owner/caller matrices, baseline diagnostics, and acceptance checklists that reduce repeated Codex discovery.

Do not claim local execution, tests, builds, typechecks, worktree state, or generated-output validation from connector inspection alone.

### ChatGPT Agent Mode, GPT Work, Or Successor Workspaces

Consider for:

- multi-step browser or application workflows;
- connected services and business tools;
- tasks requiring interactive navigation or cross-application coordination;
- work that benefits from workspace-specific plugins or connectors.

Inspect the actual enabled tools before routing. Do not assume Agent Mode, GPT Work, regular ChatGPT, and Codex share plugins, token pools, connectors, repository access, or file state.

### Codex

Consider for:

- authenticated repository checkout work;
- production, test, schema, migration, content, asset, dependency, and generated-output changes;
- local commands, tests, builds, typechecks, linters, generators, and executable probes;
- iterative edit-test-debug cycles;
- branch integration, rebase, conflict resolution, commit, and push workflows;
- acceptance work that depends on executable proof.

Inspect the available Codex modes, models, environments, reasoning levels, repository state, and current resource constraints at prompt-generation time.

Plan or read-only modes must not be given implementation language. Local, cloud, persistent-goal, or successor modes must receive mode-specific scope, validation, stop, resource, and handoff instructions.

### Plugins, Connectors, Skills, And Specialized Tools

Consider all installed capabilities that materially improve quality or reduce cost, including repository, research, document, spreadsheet, presentation, PDF, creative-production, CRM, calendar, email, project, and other domain-specific tools.

Do not invoke a plugin merely because it exists. It must improve the current task and be compatible with the selected surface.

## 5. Plugin And Connector Availability Disclosure

Before presenting a prompt, classify materially relevant plugins, connectors, or skills as one of:

- `AVAILABLE_AND_ACTIVE`;
- `AVAILABLE_NOT_INSTALLED_OR_NOT_ACTIVATED`;
- `UNAVAILABLE_ON_RECOMMENDED_SURFACE`;
- `AVAILABILITY_UNKNOWN`;
- `NOT_RELEVANT`.

If a plugin or connector may be available but is not installed or activated:

1. tell the user before the prompt;
2. identify why it would help;
3. state which platform or mode would use it;
4. state whether the prompt can still run without it;
5. offer the installation or activation path when the current interface supports discovery or installation;
6. do not write the prompt as though the missing capability is already present.

Do not install, activate, authorize, or connect a plugin without the user's direction when permission or account access is required.

## 6. Tool Compatibility And Handoff Boundaries

Tools available on separate platforms must not be described as one combined agent unless an actual integrated surface proves that combination.

For every multi-platform workflow, define:

- which stage runs on which platform;
- what evidence each stage can access;
- what output must be transferred between stages;
- whether transfer is automatic or manual;
- which stage owns repository edits;
- which stage owns executable validation;
- which token or quota pool each stage is expected to consume, when known;
- which conclusions remain provisional until repository-aware validation.

Typical valid staged workflow:

```text
Stage A — ChatGPT Deep Research
External-source research and cited synthesis only. No private-repository claims.

Stage B — ChatGPT via GitHub Connector
Reconcile current repository authority, exact source head, owners, branches, tests, scope, product questions, and Codex handoff without claiming local execution.

Stage C — Codex implementation or audit mode
Perform only the bounded mutation or independent executable proof that requires the authenticated checkout; validate, commit, and push as authorized.
```

Do not ask one stage to repeat another stage's work without a clear independent-verification purpose. When Connector preparation is current at an exact head, Codex should use delta verification rather than redo broad discovery, subject to the repository-first and resource-slicing policies.

## 7. Selection Scorecard

Evaluate candidate routes in this order.

### 7.1 Required access and authority

Hard gate:

- Can it access every required source?
- Can it make the required changes?
- Can it run the required validation?
- Can it produce the required repository handoff?

### 7.2 Quality and depth

Consider:

- reasoning strength;
- source breadth and citation quality;
- long-context synthesis;
- code and architecture understanding;
- ability to perform independent adversarial review.

### 7.3 Token, quota, rate-window, and cost posture

Consider:

- which product pool is consumed;
- whether a separate research or Connector surface preserves a constrained Codex/GPT Work pool;
- whether moving between surfaces duplicates context and token cost;
- whether a lighter model or connector pass can complete the task without lowering confidence;
- whether a broader model is justified by risk, ambiguity, or multi-owner scope;
- whether the package is `XS`, `S`, `M`, `L`, or `XL` under `docs/dev/codex-resource-budget-and-execution-slicing-policy.md`;
- whether a useful durable checkpoint is likely within the currently known short-window allowance;
- whether an `M`, `L`, or `XL` package should be split before the strongest/highest-cost reasoning tier is used.

When quota accounting is unknown, say so. Do not invent token-cost facts. When the user reports a material limit or asks to conserve a pool, treat it as an operating constraint for prompt design until rechecked.

### 7.4 Execution and validation

Consider:

- local versus remote execution;
- tests, builds, typechecks, linters, generators, and browser checks;
- ability to inspect worktree, branches, PRs, and generated artifacts;
- commit, push, and branch-lifecycle support.

### 7.5 Coordination overhead

Consider:

- manual copying or attachment requirements;
- loss of repository context between surfaces;
- duplicated research;
- plugin activation steps;
- user intervention and authentication;
- risk of stale remote versus local state;
- whether additional Connector/chat back-and-forth materially reduces expensive Codex rediscovery.

### 7.6 Privacy and permission boundaries

Consider:

- private repository access;
- local credentials and secrets;
- connected account permissions;
- external uploads or manual transfers;
- whether the selected surface may access the required data.

## 8. Prompt Wording Must Match The Selected Surface

The same task must not receive identical wording on every platform.

### For Deep Research

Include:

- external research question and boundaries;
- source-quality and recency requirements;
- required citations;
- explicit statement that private repository facts are unavailable unless separately supplied;
- a structured handoff for a later repository-aware stage;
- no repository mutation or validation claims.

### For ChatGPT Via GitHub Connector

Include:

- exact repository and source head when known;
- exact files, branches, PRs, commits, or authorities to inspect;
- complete-file write restrictions;
- connector-only validation limits;
- no local test/build/typecheck claims;
- exact coordination, orientation-packet, or Codex handoff output.

### For Codex Plan Or Read-Only Mode

Include:

- non-mutating posture;
- repository orientation and evidence requirements;
- decision-complete plan output;
- explicit prohibition on file edits, commits, and implementation claims;
- the mode switch required before implementation.

### For Codex Implementation Modes

Include:

- repository synchronization and worktree preflight;
- authorized and forbidden paths;
- production callers and owner boundaries;
- exact tests and validation;
- branch, commit, push, and handoff requirements;
- stop conditions for unauthorized scope or missing evidence;
- reasoning level appropriate to risk and complexity;
- package size/checkpoint posture when constrained resources are known;
- exact Connector orientation packet and delta-verification rules when one exists.

### For GPT Work, Agent Mode, Or Application Workflows

Include:

- exact connected applications and tools;
- permission and authentication boundaries;
- required UI or workflow steps;
- user-confirmation gates for consequential actions;
- output transfer to repository-aware stages when needed;
- explicit note when repository access is absent.

## 9. Model, Mode, And Version Recommendation Rule

At prompt-generation time:

1. inspect the currently selectable models and modes;
2. recommend an exact model/version only when it is actually visible or confirmed;
3. otherwise recommend a capability class and tell the user to select the strongest currently available matching model;
4. choose reasoning depth according to task risk and complexity;
5. do not preserve run-specific model/version names in durable prompt bodies;
6. do not treat repository workflow versions as model versions.

Use higher reasoning for:

- broad evidence synthesis that cannot safely be moved to a separate research/Connector stage;
- architecture or owner-boundary decisions;
- persistence, migration, account, publication, or acceptance work;
- adversarial audits;
- substantial multi-file implementation that cannot safely be decomposed further.

Use a lighter supported level when the task has already been reduced to a narrow deterministic slice and quality is preserved.

When the strongest/highest-cost reasoning tier is required or recommended, scope should normally get smaller, not larger. Under a known constrained short-window posture, `L` and `XL` prompts must be decomposed first unless the user explicitly approves the cost and an accepted authority documents why the work must remain atomic. `M` prompts should be split by default. Preserve semantic versioning by using internal slices rather than inventing versions merely for resource management.

## 9.1 Connector-First Codex Slicing Gate

Before installing a nontrivial Codex prompt under a known constrained resource posture:

1. complete the useful Connector-first preparation allowed by `docs/dev/codex-resource-budget-and-execution-slicing-policy.md`;
2. classify the Codex package `XS`, `S`, `M`, `L`, or `XL`;
3. name the expected first durable checkpoint;
4. state what reconnaissance, documentation, branch/PR review, product-question closure, source mapping, and acceptance planning were moved out of Codex;
5. state what Codex must independently verify locally;
6. if the package is `L` or `XL`, present a decomposition plan rather than a monolithic highest-reasoning recommendation;
7. if the package is `M`, split it unless a concrete atomicity reason is recorded;
8. include an interruption/resume posture when resource exhaustion is materially plausible.

If an interrupted Codex thread has a clean worktree and has lost the prior orientation context, do not automatically pay for the same broad discovery again. Return to Connector preparation/decomposition unless fresh local evidence makes rerunning the orientation necessary.

## 10. Required Outside-Prompt Recommendation Block

Every copy-paste prompt must be preceded in chat by a fresh recommendation block. This block remains outside `docs/dev/current-codex-prompt.md` and outside the copy-paste prompt body.

Use:

```text
Recommended platform: <current platform or staged workflow>
Recommended mode: <current mode>
Recommended model/version: <confirmed current model/version or capability class>
Reasoning/depth: <level and justification>
Why this route: <access, quality, validation, and efficiency rationale>
Required tools/connectors: <active capabilities>
Plugin status: <active; potentially available but not installed; unavailable; unknown>
Token/quota posture: <known pool and expected relative use, or unknown>
Package size: <XS/S/M/L/XL when applicable>
Connector-first preparation: <complete/incomplete/not applicable and why>
Expected first checkpoint: <durable checkpoint or not applicable>
Manual preflight: <sync, attach, copy research handoff, activate plugin, or none>
Known incompatibilities: <tools or access not available together>
Alternative route: <next-best route and tradeoff>
Capability check date: <date>
```

Omit fields that are genuinely irrelevant, but never omit a material access limitation, resource constraint, unavailable plugin, manual transfer, validation gap, or required decomposition.

## 11. Prompt Creation Preflight Checklist

Before delivering any prompt, confirm:

- the task and completion authority are classified;
- all relevant platforms were considered;
- required repository, web, local, application, and connector access was checked;
- current modes and models were inspected or uncertainty was disclosed;
- relevant installed plugins and tools were inspected;
- potentially useful uninstalled or inactive plugins were disclosed;
- incompatible tool combinations were disclosed;
- token/quota/rate-window tradeoffs were considered without inventing facts;
- package size and expected first checkpoint were classified when resource slicing applies;
- useful Connector-first preparation is complete or its omission is justified;
- `M`, `L`, or `XL` work was decomposed as required by the resource-slicing policy;
- prompt wording matches the selected surface;
- staged handoffs are explicit when one surface cannot do the entire job;
- internal workflow versioning is separate from model/version recommendation;
- the outside-prompt recommendation block is present;
- the prompt body contains no stale platform line;
- manual file, sync, attachment, authorization, or plugin actions are stated only when required.

## 12. Repository Documentation And Handoff

When a prompt is installed or revised:

- keep the authoritative prompt body in `docs/dev/current-codex-prompt.md` when it is a Codex route;
- record durable capability and resource requirements and access assumptions, not transient model marketing names, in repository docs;
- give the fresh platform/mode/model/resource recommendation in chat;
- update `docs/dev/current-gpt-handoff.md` when routing assumptions or required stages change;
- update `docs/dev/current-codex-output.md` when the prompt-generation or coordination run materially changes current execution guidance;
- preserve or cite the Connector orientation packet when one is expected to save Codex discovery work;
- verify every repository write;
- preserve the current active route unless the prompt itself is authorized to advance it.

## 13. Examples

### External research before repository implementation

```text
Recommended platform: staged workflow — ChatGPT Deep Research, then ChatGPT via GitHub Connector, then Codex
Why this route: Deep Research provides external-source depth; Connector reconciles current private-repository authority and prepares the exact implementation packet; Codex owns only the local mutation and executable validation that require the authenticated checkout.
Required tools/connectors: web research in Stage A; GitHub Connector in Stage B; authenticated repository checkout in Stage C.
Plugin status: disclose any research or repository plugin that is available but inactive.
Manual preflight: transfer only the required research handoff when an automatic repository artifact is not available.
Known incompatibilities: Deep Research may not share private repository access or Codex context; Connector cannot run local validation.
```

### Small repository documentation update

```text
Recommended platform: ChatGPT via GitHub Connector
Why this route: complete-file documentation change with remote repository evidence; no local execution required.
Known incompatibilities: connector inspection cannot validate local tests, builds, or worktree state.
```

### Bounded implementation after Connector preparation

```text
Recommended platform: Codex repository implementation mode
Why this route: Connector preparation has already reconciled exact source head, owners, callers, changed paths, and validation expectations; this slice requires synchronized source edits and local executable proof.
Package size: S
Expected first checkpoint: one owner implemented with focused tests green and a durable commit.
Reasoning/depth: use high reasoning only if this slice retains a persistence/atomicity or owner-conflict problem; otherwise use the lightest supported tier that preserves quality.
Manual preflight: synchronize the authenticated checkout and verify the Connector packet delta.
```

### Oversized package under a constrained high-reasoning window

```text
Package size: L or XL
Recommendation: do not run as one highest-reasoning prompt. Complete Connector-first preparation and split into owner/checkpoint slices, keeping one semantic version and a separate independent acceptance route.
```

## 14. Historical Compatibility

Older documents may name specific ChatGPT or Codex versions, modes, products, or earlier quota assumptions. Treat those names and limits as historical context unless the current prompt-generation preflight confirms they remain available and appropriate.

The dynamic capability inventory, resource-slicing policy, and outside-prompt recommendation required by this policy control future prompt routing.