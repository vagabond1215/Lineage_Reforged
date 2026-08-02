# Repository-First Agent Work Protocol

Date: 2026-07-31

Status: durable repository workflow authority

Applies to: Codex, ChatGPT Agent Mode, ChatGPT via GitHub Connector, human maintainers, and any delegated repository agent unless a more specific accepted prompt imposes stricter requirements

## Purpose

All substantive Lineage: Reforged work must be performed from the repository, through repository-aware agents, using the current handoff chain and the applicable design, contract, branch, and verification documentation. External scratch work, connector-only candidate code, generated bundles, chat summaries, and local notes are evidence inputs only until independently reconciled, implemented, validated, committed, and pushed from an authenticated repository checkout.

This protocol does not replace the active Codex prompt or a focused accepted decision. It defines the mandatory repository orientation, execution, validation, and handoff discipline surrounding those authorities.

## 1. Repository Is The Source Of Truth

- Begin substantive work from an authenticated local checkout of `vagabond1215/Lineage_Reforged`.
- Fetch and prune before relying on branch, pull-request, commit, or coordination state.
- Resolve the live default-branch head, current branch, upstream, worktree status, and divergence before editing.
- Use repository files, live Git history, branches, pull requests, tests, and generated diagnostics as authority. Do not treat chat context, an exported bundle, or an earlier connector inspection as current merely because it was accurate when produced.
- Production source, tests, schemas, migrations, content, assets, generated output, dependency changes, and multi-file coordination edits must be made and validated in the repository checkout through Codex or another repository-capable agent.
- ChatGPT via GitHub Connector remains appropriate for small complete-file documentation updates, handoff maintenance, audit preparation, branch/PR inspection, and tiny obvious changes that do not materially require local execution.
- Connector-prepared implementation candidates and repair bundles must remain explicitly marked as evidence until a repository agent independently reviews and applies them.

## 2. Mandatory Authority Reading

Before narrowing to an implementation surface, read the complete current versions of:

1. the root and any nearer `AGENTS.md` files;
2. `docs/dev/current-codex-prompt.md`;
3. `docs/dev/current-gpt-handoff.md`;
4. `docs/dev/current-codex-output.md`;
5. `docs/dev/historical-version-and-deferred-route-register.md`;
6. `docs/design/current-planning-anchor-reconciliation.md`;
7. `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
8. `docs/dev/branch-lifecycle-and-integration-policy.md`;
9. `docs/dev/branch-disposition-register.md`;
10. the most specific accepted design decision, contract, audit, migration rule, or acceptance document for the active route.

Use the precedence declared by the current handoff and planning reconciliation. Long-lived roadmap, backlog, and sequenced-plan headers may contain preserved historical wording and cannot override the current prompt, handoff, output, historical register, or focused authority.

## 3. Complete Repository Orientation

Every primary implementation, support repair, acceptance audit, multi-owner change, branch integration, or substantial cleanup run must complete a whole-repository orientation before editing. At minimum inspect:

- repository identity, default branch, permissions, live head, recent commits, and worktree cleanliness;
- all local and remote branches and all open pull requests;
- merge bases, unique commits, changed paths, semantic overlap, and current disposition for relevant branches;
- root manifests, application manifests, lockfiles, TypeScript configuration, scripts, and build entrypoints;
- available hosted CI/status checks and the local validation commands that substitute when hosted checks are absent;
- top-level architecture across `apps`, `packages`, `tools`, `tests`, and `docs`;
- the production caller path, engine/service owner, shared contracts, persistence/migration owners, projections, UI adapters, and JavaScript/TypeScript mirror posture relevant to the route;
- focused tests, adjacent regressions, integration/simulation coverage, and known baseline failures;
- generated-output, asset, temporary-artifact, and repository-hygiene rules;
- active route blockers, protected branches, deferred work, and explicit scope exclusions.

A complete review does not require rereading every historical line in the repository. It does require enough live inspection to prove that the active authority, architecture, caller path, branch state, validation surface, and known risks are understood before implementation begins.

## 4. Agent Use And Delegation

- Use Codex Local for multi-file source/content changes, commands, tests, builds, typechecking, migrations, and work that requires the real worktree.
- Use Codex Cloud only when the larger repository task justifies it and the environment can run the required validation.
- Use Plan Mode only for non-mutating analysis. Switch to an implementation-capable mode before writing or claiming repository changes.
- Use repository agents or subagents for independent bounded inspections when the task spans distinct domains, such as branch review, production caller tracing, persistence authority, test coverage, or documentation reconciliation.
- Give each delegated agent an exact source head, scope, required documents, exclusions, and output contract.
- The coordinating agent must reconcile all delegated findings against the same live repository head. Agent reports are evidence, not automatically accepted authority.
- Never allow parallel agents to edit overlapping source or coordination files without an explicit integration plan.

## 5. Pre-Edit Gate

Before changing files, record:

- inspected base head and implementation starting head;
- active version/run and label class;
- controlling prompt and focused authority;
- numbered finding or requirement inventory;
- production callers and owners;
- authorized files and explicit exclusions;
- applicable failure-pattern IDs;
- branches/PRs inspected and their dispositions;
- pre-edit reproductions or characterized behavior for every repair finding;
- validation commands and known non-gating baseline failures.

Stop and install a narrower decision or support route when the necessary fix would cross an unauthorized shared contract, save format, schema, dependency, migration, content, asset, or owner boundary.

## 6. Implementation Discipline

- Make the smallest coherent repository patch that satisfies the active authority.
- Preserve exact accepted behavior outside the numbered findings.
- Change source, tests, public exports, mirrors, migrations, generated artifacts, and documentation together when the repository contract requires them.
- Exercise the real production caller in addition to lower-level helpers.
- Reproduce failure-before-acceptance, failure-after-acceptance, retry, restart, stale state, conflicting state, duplicate submission, order reversal, and repair completion whenever applicable.
- Do not weaken validation, delete retained truth, invent unavailable provenance, or create generic frameworks to avoid a narrow repair.
- Do not write production code outside the repository and later describe it as implemented.

## 7. Validation And Diff Review

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

Do not infer validation from earlier runs. State exactly what ran in the current repository checkout and what did not.

## 8. Coordination And Handoff

Before completing a substantive run:

- update `docs/dev/current-codex-output.md` with exact findings, files, checks, counts, guardrail evidence, branch/PR review, risks, and final disposition;
- update `docs/dev/current-gpt-handoff.md` when current route, blockers, accepted boundaries, branch posture, or near-term order changes;
- update `docs/dev/current-codex-prompt.md` only when installing or revising the next executable route;
- update `docs/dev/branch-disposition-register.md` for created, changed, integrated, retained, superseded, protected, or deleted branches and PRs;
- update focused decisions, acceptance audits, historical/deferred routing, and planning reconciliation when their authority changes;
- verify every complete-file documentation write after writing;
- commit intentionally, push the branch, and report the exact final commit and live remote head.

A chat response is not a substitute for a repository handoff.

## 9. Completion Report Requirements

The final report must distinguish:

- inspected base head;
- implementation starting head;
- final committed head;
- live remote head after fetch/prune;
- repository files changed;
- checks actually run and exact results;
- applicable failure-pattern IDs and evidence;
- branch/PR actions and retained review triggers;
- unresolved risks or blockers;
- exact completion disposition and next route.

If repository access, authentication, a local checkout, required tooling, or validation is unavailable, report `IMPLEMENTATION_INCOMPLETE`. Preserve useful evidence in the repository when safely possible, but do not claim implementation, acceptance, or a green successor.

## 10. Evidence Bundles

Evidence bundles may accelerate review but never bypass it.

- Store them on an explicitly classified branch or artifact path.
- Record source head, contents, hashes, reconstruction steps, validation already performed, and validation not performed.
- Mark candidate replacements as non-authoritative.
- Require the consuming repository agent to reproduce findings, compare candidates against live source, extend repository tests, run the complete validation gate, and implement through an ordinary reviewed branch.
- Do not cherry-pick an evidence-only branch into production as a substitute for implementation.

## Current Application

Implemented `0.6.9.7` consumed draft PR #3 and `parallel/0.6.9.7-repair-bundle` only as evidence. Active independent `0.6.9.8` must continue to treat them as evidence, verify the synchronized implementation commit and every repository test/build/type/mirror/adversarial/diff gate independently, update the handoff chain, and accept the parent only on complete proof. The Ashen Reef survey route remains blocked.
