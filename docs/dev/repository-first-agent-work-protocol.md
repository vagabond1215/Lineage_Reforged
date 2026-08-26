# Repository-First Agent Work Protocol

Date: 2026-07-31

Updated: 2026-08-26

Status: durable repository workflow authority

Applies to: Codex, regular ChatGPT, ChatGPT Deep Research, ChatGPT Agent Mode, GPT Work or successor workspaces, ChatGPT via GitHub Connector, human maintainers, and any delegated repository agent unless a more specific accepted prompt imposes stricter requirements

## Purpose

All substantive Lineage: Reforged work must be performed from the repository, through repository-aware agents, using the current handoff chain and the applicable design, contract, branch, and verification documentation. External scratch work, connector-only candidate code, generated bundles, chat summaries, Deep Research reports, plugin outputs, and local notes are evidence inputs only until independently reconciled, implemented, validated, committed, and pushed from an authenticated repository checkout.

This protocol does not replace the active Codex prompt or a focused accepted decision. It defines the mandatory repository orientation, execution, validation, prompt-routing, resource-slicing, and handoff discipline surrounding those authorities.

## 1. Repository Is The Source Of Truth

- Begin substantive work from an authenticated local checkout of `vagabond1215/Lineage_Reforged`.
- Fetch and prune before relying on branch, pull-request, commit, or coordination state.
- Resolve the live default-branch head, current branch, upstream, worktree status, and divergence before editing.
- Use repository files, live Git history, branches, pull requests, tests, and generated diagnostics as authority. Do not treat chat context, an exported bundle, a Deep Research report, plugin output, or an earlier connector inspection as current merely because it was accurate when produced.
- Production source, tests, schemas, migrations, content, assets, generated output, dependency changes, and multi-file coordination edits must be made and validated in the repository checkout through Codex or another repository-capable agent.
- ChatGPT via GitHub Connector remains appropriate for small complete-file documentation updates, handoff maintenance, audit preparation, branch/PR inspection, and tiny obvious changes that do not materially require local execution.
- Connector-prepared implementation candidates and repair bundles must remain explicitly marked as evidence until a repository agent independently reviews and applies them.
- External research and application-workflow outputs must identify their source platform, access limits, and transfer boundary before a repository agent relies on them.

## 2. Mandatory Authority Reading

Before narrowing to an implementation surface, read the complete current versions of:

1. the root and any nearer `AGENTS.md` files;
2. `docs/dev/current-codex-prompt.md`;
3. `docs/dev/current-gpt-handoff.md`;
4. `docs/dev/current-codex-output.md`;
5. `docs/dev/prompt-execution-platform-tool-selection-policy.md`;
6. `docs/dev/codex-resource-budget-and-execution-slicing-policy.md`;
7. `docs/dev/historical-version-and-deferred-route-register.md`;
8. `docs/design/current-planning-anchor-reconciliation.md`;
9. `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
10. `docs/dev/branch-lifecycle-and-integration-policy.md`;
11. `docs/dev/branch-disposition-register.md`;
12. the most specific accepted design decision, contract, audit, migration rule, or acceptance document for the active route.

Use the precedence declared by the current handoff and planning reconciliation. Long-lived roadmap, backlog, prompt-template examples, and sequenced-plan headers may contain preserved historical wording and cannot override the current prompt, handoff, output, platform/tool selection policy, resource-slicing policy, historical register, or focused authority.

## 3. Complete Repository Orientation And Connector Delta Verification

Every primary implementation, support repair, acceptance audit, multi-owner change, branch integration, or substantial cleanup run must complete a whole-repository orientation before editing. At minimum establish:

- repository identity, default branch, permissions, live head, recent commits, and worktree cleanliness;
- all local and remote branches and all open pull requests;
- merge bases, unique commits, changed paths, semantic overlap, and current disposition for relevant branches;
- root manifests, application manifests, lockfiles, TypeScript configuration, scripts, and build entrypoints;
- available hosted CI/status checks and the local validation commands that substitute when hosted checks are absent;
- top-level architecture across `apps`, `packages`, `tools`, `tests`, and `docs`;
- the production caller path, engine/service owner, shared contracts, persistence/migration owners, projections, UI adapters, and JavaScript/TypeScript mirror posture relevant to the route;
- focused tests, adjacent regressions, integration/simulation coverage, and known baseline failures;
- generated-output, asset, temporary-artifact, and repository-hygiene rules;
- active route blockers, protected branches, deferred work, and explicit scope exclusions;
- the capability and access assumptions carried into the prompt, including which platform owns repository inspection, external research, application access, implementation, validation, commit, and push.

A complete review does not require rereading every historical line in the repository. It does require enough live evidence to prove that the active authority, architecture, caller path, branch state, validation surface, tool boundaries, and known risks are understood before implementation begins.

When `docs/dev/codex-resource-budget-and-execution-slicing-policy.md` applies, a current Connector-prepared orientation packet at an exact source head may satisfy the broad read-only inventory portion of this orientation. In that case Codex should perform delta verification rather than repeat broad discovery: verify repository identity, synchronized local head/upstream/worktree, current prompt and changed authority, the complete delta from the packet head, the exact production/test files it will modify or audit, every material Connector claim on which implementation or acceptance depends, local validation commands, and any branch/PR/ref whose state changed. Connector evidence never substitutes for executable proof, and an independent acceptance audit must still independently reproduce every material behavior required for its final disposition.

If the local head differs from the Connector packet head, inspect the complete intervening commit/file delta before relying on the packet. If the delta materially changes an owner, caller, persistence contract, branch disposition, or active route, refresh or discard the packet rather than treating it as current.

## 4. Platform, Tool, Mode, Model, Plugin, And Resource Routing

`docs/dev/prompt-execution-platform-tool-selection-policy.md` controls prompt-routing decisions. `docs/dev/codex-resource-budget-and-execution-slicing-policy.md` controls decomposition and checkpoint expectations when a constrained resource posture is known.

Before every prompt is created or revised:

- inventory the platforms, modes, models, reasoning levels, connectors, plugins, skills, and tools actually available at that time;
- consider regular ChatGPT, Deep Research, ChatGPT via GitHub Connector, Agent Mode, GPT Work or successor workspaces, all current Codex modes, and relevant installed or potentially installable plugins;
- treat repository, local-worktree, web, application, execution, validation, authentication, commit, and push access as hard gates;
- identify tools that cannot operate together in the same surface or session;
- distinguish installed and active plugins from potentially available but inactive, unavailable, or unknown plugins;
- balance quality, research depth, token/quota use, latency, privacy, coordination overhead, and validation authority;
- classify a nontrivial Codex package by resource size (`XS`, `S`, `M`, `L`, or `XL`) when the resource-slicing policy applies;
- identify the expected first durable checkpoint and move safe reconnaissance to Connector work first;
- recommend an exact model/version only when currently visible or confirmed;
- use an explicit staged workflow when no single surface has all required access and tools.

Do not assume:

- Deep Research has private-repository access;
- Codex has the same Deep Research, browser, application, connector, or plugin surface as regular ChatGPT;
- GPT Work, Agent Mode, regular ChatGPT, and Codex share token pools, file state, connectors, or installed plugins;
- a connector can run local tests or inspect an unsynced worktree;
- a cloud agent can see local-only files, credentials, or changes;
- an available plugin is installed or authorized;
- the strongest reasoning tier is appropriate for every slice of a difficult feature;
- a known short-window limit should be spent repeating Connector-safe orientation that already has an exact current evidence packet.

If a materially useful plugin or connector may be available but is not installed or activated, tell the user before the prompt, explain why it would help, state whether the prompt can proceed without it, and offer the supported activation or installation route. Do not write the prompt as if that capability is active.

The platform, mode, model/version, reasoning, tool, plugin, token/quota, incompatibility, manual-preflight, alternative-route, package-size, and checkpoint recommendation belongs outside the copy-paste prompt body.

## 5. Agent Use And Delegation

- Use the least-powerful safe execution surface that preserves quality and completion authority.
- Use ChatGPT Deep Research for source-heavy external research when repository mutation is not required, then transfer its cited output into a repository-aware stage when necessary.
- Use ChatGPT via GitHub Connector for bounded remote repository inspection, complete-file documentation updates, prompt/handoff maintenance, orientation packets, source maps, acceptance matrices, and isolated evidence passes that do not require local execution.
- Use GPT Work, Agent Mode, or successor workspaces for connected application or browser workflows when their active tools match the task.
- Use Codex or another authenticated repository-capable implementation surface for multi-file source/content changes, commands, tests, builds, typechecking, migrations, generated output, and work that requires the real worktree.
- Use cloud execution only when remote state is synchronized and the required validation, assets, credentials, and dependencies are available there.
- Use Plan Mode or any read-only successor mode only for non-mutating analysis. Switch to an implementation-capable mode before writing or claiming repository changes.
- Use repository agents or subagents for independent bounded inspections when the task spans distinct domains, such as branch review, production caller tracing, persistence authority, test coverage, or documentation reconciliation.
- Give each delegated agent an exact source head, platform/mode, available tools, scope, required documents, exclusions, and output contract.
- The coordinating agent must reconcile all delegated findings against the same live repository head. Agent, research, and plugin reports are evidence, not automatically accepted authority.
- Never allow parallel agents to edit overlapping source or coordination files without an explicit integration plan.
- For staged workflows, name which stage owns research, repository comparison, implementation, executable validation, commit, push, and final handoff.
- Do not use high-reasoning subagents for broad rediscovery already covered by a current Connector packet unless the active audit requires genuinely independent semantic verification of that claim.

## 6. Pre-Edit Gate

Before changing files, record:

- inspected base head and implementation starting head;
- active version/run and label class;
- controlling prompt and focused authority;
- selected execution platform, mode, model/version or capability class, and reasoning level;
- required tools/connectors and their active availability;
- materially relevant plugins that are active, inactive, unavailable, or unknown;
- known cross-platform incompatibilities and manual handoffs;
- resource package size class and expected first durable checkpoint when applicable;
- Connector orientation packet identity/source head and the verified delta, when one is used;
- numbered finding or requirement inventory;
- production callers and owners;
- authorized files and explicit exclusions;
- applicable failure-pattern IDs;
- branches/PRs inspected and their dispositions;
- pre-edit reproductions or characterized behavior for every repair finding;
- validation commands and known non-gating baseline failures.

Stop and install a narrower decision or support route when the necessary fix would cross an unauthorized shared contract, save format, schema, dependency, migration, content, asset, or owner boundary.

Stop and reroute when the selected platform cannot access required evidence or perform required validation. Do not downgrade an implementation or acceptance claim merely to fit the current tool surface.

When a known short-window constraint makes an `L` or `XL` package unlikely to reach a useful checkpoint, decompose it before execution unless an explicit atomicity or independent-audit reason requires the coupled run. Internal slices may remain under the same semantic version and do not require version inflation.

## 7. Implementation Discipline

- Make the smallest coherent repository patch that satisfies the active authority.
- Under a constrained resource posture, structure the run so a useful durable checkpoint is reached early rather than only after broad analysis.
- Preserve exact accepted behavior outside the numbered findings.
- Change source, tests, public exports, mirrors, migrations, generated artifacts, and documentation together when the repository contract requires them.
- Exercise the real production caller in addition to lower-level helpers.
- Reproduce failure-before-acceptance, failure-after-acceptance, retry, restart, stale state, conflicting state, duplicate submission, order reversal, and repair completion whenever applicable.
- Do not weaken validation, delete retained truth, invent unavailable provenance, or create generic frameworks to avoid a narrow repair.
- Do not write production code outside the repository and later describe it as implemented.
- Do not promote external research or connector evidence into runtime authority without repository comparison and the required executable proof.
- If a quota/rate interruption occurs, preserve valid partial work and resume from current state; if the worktree is clean and context is lost after orientation only, return to Connector decomposition rather than automatically paying to repeat the same broad discovery.

## 8. Validation And Diff Review

Run all validation required by the active prompt and the changed surfaces. The completion evidence must normally include:

- focused tests for every finding and failure boundary;
- the prescribed adjacent regression group;
- application production build when UI or imported engine code is affected;
- bounded and repository-wide TypeScript posture as required, including diagnostic counts and whether changed files are named;
- content lint, schema validation, database build, scenario execution, migration checks, or generated-output verification when relevant;
- JavaScript/TypeScript mirror and public-export checks;
- adversarial probes independent of the implementation path when the route is a repair or acceptance audit;
- `git diff --check`;
- complete unstaged and staged diff inspection;
- final `git status`, branch/upstream state, and live post-fetch head verification.

Do not infer validation from earlier runs, another platform, or a research stage. State exactly what ran in the current repository checkout and what did not.

Connector preparation may precompute the validation matrix, expected baseline, changed-file map, and independent-probe plan, but Codex/local execution must run the validation required for implementation or acceptance.

## 9. Coordination And Handoff

Before completing a substantive run:

- update `docs/dev/current-codex-output.md` with exact findings, files, checks, counts, guardrail evidence, branch/PR review, risks, and final disposition;
- update `docs/dev/current-gpt-handoff.md` when current route, blockers, accepted boundaries, branch posture, near-term order, or execution-stage assumptions change;
- update `docs/dev/current-codex-prompt.md` only when installing or revising the next executable route;
- when a prompt is installed or revised, verify that its wording matches the intended execution surface and give the fresh outside-prompt recommendation required by `docs/dev/prompt-execution-platform-tool-selection-policy.md` and `docs/dev/codex-resource-budget-and-execution-slicing-policy.md`;
- update `docs/dev/branch-disposition-register.md` for created, changed, integrated, retained, superseded, protected, or deleted branches and PRs;
- update focused decisions, acceptance audits, historical/deferred routing, and planning reconciliation when their authority changes;
- verify every complete-file documentation write after writing;
- commit intentionally, push the branch, and report the exact final commit and live remote head.

A chat response is not a substitute for a repository handoff.

## 10. Completion Report Requirements

The final report must distinguish:

- inspected base head;
- implementation starting head;
- final committed head;
- live remote head after fetch/prune;
- repository files changed;
- platform, mode, model/version or capability class, and tools actually used;
- plugins/connectors used and material unavailable capabilities;
- package size/checkpoint posture when resource slicing applied;
- checks actually run and exact results;
- applicable failure-pattern IDs and evidence;
- branch/PR actions and retained review triggers;
- unresolved risks or blockers;
- exact completion disposition and next route.

If repository access, authentication, a local checkout, required tooling, plugin, connector, or validation is unavailable, report `IMPLEMENTATION_INCOMPLETE`. Preserve useful evidence in the repository when safely possible, but do not claim implementation, acceptance, or a green successor.

## 11. Evidence Bundles

Evidence bundles may accelerate review but never bypass it.

- Store them on an explicitly classified branch or artifact path.
- Record source head, producing platform/mode, accessible sources, contents, hashes, reconstruction steps, validation already performed, and validation not performed.
- Mark candidate replacements as non-authoritative.
- Require the consuming repository agent to reproduce findings, compare candidates against live source, extend repository tests, run the complete validation gate, and implement through an ordinary reviewed branch.
- Do not cherry-pick an evidence-only branch into production as a substitute for implementation.

A Connector orientation/evidence packet is not an implementation bundle. It may reduce repeated discovery under the resource-slicing policy, but its material claims still require local verification at the boundaries named there.

## Current Application

Installed `Version 0.6.9.11 - Historical Recovery Fork Authority Acceptance Audit` independently accepted parent `0.6.9`. `Version 0.6.10 - Ashen Reef Survey Advancement Authority` implemented its bounded persisted receipt/command/owner/UI package at `008db9c93eb8818aea51652be07fd196df41c45f`, was repaired at `59af92629a79e95fa20247959159e336a8dbc88e` and `07c57392c8078927e4f9e12efe18d8d89bb1fc70`, and was independently accepted through `0.6.10.5` at `950e851446fb75bfbdb717d0ea33e33ec2907d4a`. The ordinary-reachability dependency decision correctly returned `NO_PACKAGE` until authored input was supplied. The later accepted Soundings canon closed that blocker, and the implementation-package decision returned `PACKAGE_READY`. `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence` was implemented at `3ca23d6864541a899ea61a6bf26257665f754e78` and remains `IMPLEMENTED_PENDING_PARENT_AUDIT`. Active work is `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`, an independent production-read-only audit. PR #2, PR #3, their superseded branches, the four survey-applicable Connector refs, and the protected readiness branch remain read-only evidence. Representative evidence remains incomplete until `0.6.11.1` independently accepts it; `0.7.0` remains `NOT_READY`.
