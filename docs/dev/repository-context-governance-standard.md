# Repository Context Governance Standard

Date: 2026-08-13

Status: portable project-infrastructure guidance; Lineage: Reforged may use this document directly, while another repository must explicitly adopt or adapt it inside that repository before it becomes authority there.

## Purpose

This document extracts reusable repository-management protections and workflow mechanisms that are valuable beyond one project without forcing Lineage: Reforged's full process, versioning model, or Codex-heavy execution style onto smaller repositories.

The standard is intentionally modular. A target repository should preserve its own product decisions, tool-budget rules, branch model, release/version scheme, test strategy, and project-specific authority. Adopt only the mechanisms that improve safety, continuity, validation honesty, and context isolation without creating disproportionate process overhead.

## 1. Mandatory Minimum Safety Baseline

Every repository-specific project context should establish these rules in its root `AGENTS.md` or equivalent agent instruction file.

### Repository identity and scope isolation

- Name the exact authorized Git repository, for example `owner/repository`.
- Work only on that repository plus dependencies or integrations that the repository or project configuration explicitly declares.
- Do not inspect, search, compare, modify, create issues or pull requests in, commit to, or otherwise perform Git-repository work on an unrelated repository merely because the connected account can access it.
- If a request belongs to another repository, refuse that repository operation in the current project and direct the user to the project/context attached to the requested repository.
- Shared ownership, organization membership, account access, conversation history, similar filenames, or related subject matter do not make another repository associated.
- Never import requirements, screenshots, code assumptions, prompts, branch state, commit identities, issues, test results, product decisions, or implementation conclusions from another repository unless they are explicitly reintroduced in the correct project and the local repository has a legitimate integration boundary for them.
- If cross-repository contamination is detected, stop using the foreign context and reorient from the active repository's current files and Git state.

### Repository evidence over conversational memory

- Treat current repository state as authoritative over remembered chat state.
- Refresh the live default-branch head before making a commit-sensitive decision.
- Read the repository's current handoff/instruction files before substantive work.
- Distinguish historical evidence from current authority.
- Do not claim that an implementation, test, build, migration, or audit succeeded unless the required validation actually ran in a capable environment.

### Mutation safety

- Distinguish read-only inspection from mutation.
- Do not modify production source during an acceptance audit unless that audit explicitly authorizes repair.
- Do not change prompts, coordination state, branches, or other shared authority underneath a pending independent run unless the run's protocol allows it.
- Prefer the smallest coherent patch and avoid unrelated cleanup inside a focused change.
- Before destructive Git operations, branch deletion, history rewriting, or evidence retirement, verify exact refs and prove the useful work is preserved elsewhere.

## 2. Local Tool And Resource Policy Takes Precedence

The portable standard must **not** turn every repository into a Codex-heavy project.

- Preserve an existing repository rule that avoids Codex, Work, premium reasoning, agent-mode, or other scarce-token/quota execution for routine side-project work.
- Treat tool-budget policy as repository-local authority. A rule such as "prefer connector/direct edits and avoid Codex/work tokens" remains controlling unless that repository explicitly changes it.
- Use the least-powerful safe tool that can complete the task with adequate confidence and validation.
- Escalate to a heavier execution surface only when the requested task genuinely requires capabilities that the preferred low-cost path does not provide, such as a real checkout, local commands, browser automation, build execution, complex multi-file refactoring, or high-stakes independent validation.
- Before escalation, state why the lighter path is insufficient and whether the work can instead be staged or deferred.
- Never copy Lineage's model/version cadence, audit depth, or token consumption into a small repository merely because the mechanism exists here.

## 3. Recommended Project Orientation

For a normal substantive task, establish a bounded repository-first orientation appropriate to project size.

At minimum:

1. verify repository identity and default branch;
2. refresh the live head;
3. inspect root agent instructions and README/handoff documentation;
4. identify the requested owner files and their real callers/consumers;
5. inspect relevant tests and validation commands;
6. check current branch/PR state when it can affect the work;
7. identify known blockers, generated files, migrations, or deployment constraints that intersect the task.

Large or high-risk repositories may additionally require formal current-prompt/output/handoff surfaces, branch disposition registers, failure-pattern registers, architecture ownership documents, migration authorities, or accepted decision records.

Small side projects should not create those artifacts unless they solve a real continuity or safety problem.

## 4. Recommended Documentation Roles

A repository benefits when its small set of coordination documents have non-overlapping jobs.

### `AGENTS.md`

Use for durable operating rules:

- repository scope isolation;
- repository-first evidence rule;
- tool/resource policy;
- mutation and validation guardrails;
- required orientation files;
- branch/PR expectations;
- project-specific prohibitions.

Keep current task state out of `AGENTS.md` when that state changes frequently.

### `README.md`

Use for human orientation:

- what the project is;
- setup/run commands;
- architecture/layout;
- test/validation entry points;
- where current project handoff and agent instructions live;
- important data or compatibility constraints.

The README should link to `AGENTS.md` and the current handoff when agents are expected to work in the repository.

### Current handoff document

For repositories with continuing work, maintain one lightweight current-state file such as `docs/current-project-handoff.md` containing:

- current product/development posture;
- current branch/head or accepted milestone when useful;
- recent completed work relevant to continuation;
- known browser/runtime/test limitations;
- immediate next step;
- validation expectations;
- local tool-budget constraints.

Avoid preserving obsolete directions merely as chronology in the current handoff. Move durable historical decisions elsewhere if they remain useful.

### High-assurance coordination files

Use separate prompt/output/audit/decision/register files only when the repository's complexity warrants them. They should not be mandatory for small projects.

## 5. Tool Routing And Capability Honesty

- Choose tools based on required access, not prestige.
- Connector/API editing is appropriate for small complete-file documentation changes, issues, branch/PR inspection, and tiny source edits that do not materially require local execution.
- A real repository checkout is required when correctness depends on local commands, builds, generated outputs, migrations, broad refactors, or executable test evidence unavailable through the connector.
- Read-only modes must not be described as implementation-capable.
- Do not imply access to browsers, private repositories, local files, plugins, CI logs, or applications unless that access is actually available in the chosen surface.
- When no single surface has all required capabilities, use an explicit staged workflow with a clear handoff and validation boundary.

## 6. Evidence, Acceptance, And Validation

- Prior reports, generated artifacts, connector-prepared patches, screenshots, and agent summaries are evidence inputs, not automatic implementation or acceptance authority.
- Reconcile imported evidence against the current repository before relying on it.
- Green test counts do not replace semantic verification of the failure mode that motivated a repair.
- Conversely, do not require unrelated broad audits for a trivial low-risk change unless the repository's own policy requires them.
- Record known baseline failures honestly; do not weaken or silently redefine a baseline merely to make a run green.
- If required validation cannot be run, report the result as incomplete rather than inferring success.

## 7. Independent Audit And Repair Separation

For high-risk systems, especially persistence, authority, financial/data integrity, migrations, security-sensitive paths, or complex state transitions:

- separate implementation from independent acceptance when practical;
- make the audit production-read-only unless repair is explicitly part of the contract;
- if the audit finds a material defect, route to the smallest repair rather than silently fixing and self-accepting in the same pass;
- re-audit after repair when acceptance matters.

This mechanism is optional for ordinary side-project UI work and should be used only when its assurance value justifies the cost.

## 8. Branch And Pull-Request Safety

- Inspect live PR/branch state before integrating or deleting relevant work.
- Mechanical mergeability does not prove semantic compatibility.
- Do not merge stale evidence branches solely because they apply cleanly.
- Preserve useful evidence until its named consumers are complete or its contents are equivalently retained.
- Use a branch/PR disposition register only when the repository has enough long-lived branches to make one valuable.
- Respect the repository's existing direct-main versus feature-branch policy; this standard does not override it.

## 9. Prompt And Handoff Hygiene

Where AI prompts are durable project infrastructure:

- keep the executable task prompt separate from transient model/tool recommendations when those recommendations can become stale;
- ensure prompts match the actual capabilities of the execution surface;
- state exact scope exclusions and fail-safe outcomes for risky work;
- refresh the prompt only when routing genuinely changes;
- do not mutate the active prompt underneath a pending independent run unless explicitly authorized.

Small repositories that do not use durable prompts do not need to create them.

## 10. Failure-Pattern Learning

When a recurring defect class is discovered, consider preserving the generalized lesson rather than only the individual bug narrative.

Useful examples include:

- testing a helper while failing to test the production caller;
- allowing retry identity to survive the wrong failure class;
- validating shape without semantic coherence;
- treating byte equality as sufficient when authoritative ordering also matters;
- claiming acceptance from implementation-owned tests;
- repairing one destination state while leaving the production discovery path unable to reach it;
- assuming historical/current branch wording is still current authority.

A formal failure-pattern register is justified only when repeated mistakes or project complexity make it useful.

## 11. Cross-Repository Standardization Procedure

When installing this framework into another repository, do it **inside that repository's own project context**.

1. Read that repository's root instructions, README, handoff, and tool-budget rules first.
2. Identify existing mechanisms that are already better suited to the project.
3. Preserve project-specific constraints, especially any rule limiting Codex/work-token use.
4. Add the mandatory minimum safety baseline to the root agent instructions.
5. Add or refresh README links to agent instructions and the current handoff.
6. Add a lightweight handoff only if ongoing work actually benefits from one.
7. Adopt higher-assurance mechanisms only when they solve a demonstrated problem.
8. Run the repository's own validation for documentation/source changes as required by its local policy.
9. Do not import Lineage-specific version numbers, project names, gameplay terminology, branch states, prompts, or implementation assumptions.
10. Record the standardization as repository-local infrastructure, not as a cross-project shared state dependency.

## 12. Adoption Tiers

### Tier A — Side project / lightweight repository

Recommended baseline:

- root `AGENTS.md` with hard repo isolation;
- README with setup, validation, and handoff links;
- lightweight current handoff if active development needs continuity;
- explicit low-cost tool policy;
- local validation honesty;
- simple direct-main or PR guidance.

Do **not** add formal versioned prompt chains, audit suffixes, branch registers, or failure-pattern registries unless needed.

### Tier B — Active multi-surface repository

Add as useful:

- stronger repository-first orientation;
- explicit branch/PR lifecycle rules;
- current handoff with exact current route;
- staged tool-routing rules;
- focused failure-pattern notes;
- independent audits for risky changes.

### Tier C — High-assurance / complex repository

May justify:

- authoritative current prompt/output/handoff chain;
- durable design/decision records;
- branch disposition register;
- failure-pattern register;
- explicit implementation versus acceptance separation;
- migration/persistence authority documents;
- exact version/run classification and milestone gates.

Lineage: Reforged currently operates near this tier. Other repositories should not inherit Tier C by default.

## 13. Non-Negotiable Standardization Rule

Standardization must reduce cross-project contamination and improve truthful execution. It must not erase useful local workflow differences.

In particular, **a target repository's existing instruction to avoid Codex/work-token usage for routine work must remain in force unless that repository explicitly authorizes a change after determining that heavier execution is necessary.**
