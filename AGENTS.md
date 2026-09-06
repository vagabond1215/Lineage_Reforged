# Repository Instructions

## Project Identity

- Working title: Lineage: Reforged.
- Genre and tone: grounded medieval fantasy RPG with systemic gameplay.
- Progression focus: lineage, legacy, dynasty continuity, and persistent history over generic perk accumulation.
- Character model: classless character development where the active system supports it; avoid adding hard class gates unless a dedicated design pass approves them.
- Design priority: durable world state, authored content integrity, and validated systems before broad runtime expansion.

## Repository Scope Isolation

- This project context is authorized to work only on the Git repository `vagabond1215/Lineage_Reforged` and on files, issues, pull requests, branches, workflows, and declared dependencies that belong to or are explicitly associated with this repository.
- Do not inspect, search, read, compare, modify, commit to, open or update issues or pull requests in, or otherwise perform Git-repository work on any unrelated repository from this project context, even if the connected account or connector can access it.
- If the user asks for work on another Git repository, refuse that repository operation in this project and direct the user to open or switch to the project/context attached to that repository. Do not carry out the unrelated repository work here.
- Another repository is associated only when this repository or the project configuration explicitly declares it as a required dependency or integration. Shared ownership, organization membership, connector access, conversation history, or the same user account does not make another repository associated.
- Never carry requirements, screenshots, code assumptions, branch state, commit identities, prompts, issues, product decisions, test results, or implementation conclusions from another repository into Lineage: Reforged unless the material is explicitly reintroduced in the correct project and is relevant to an accepted Lineage integration boundary.
- If cross-repository contamination is detected, stop using the foreign repository context, restate that the active repository is `vagabond1215/Lineage_Reforged`, and continue only from Lineage repository authority and user instructions given in this project.

## Repository-First Agent Workflow

- `docs/dev/repository-first-agent-work-protocol.md` is the durable detailed authority for repository orientation, agent delegation, execution, validation, and handoff.
- `docs/dev/prompt-execution-platform-tool-selection-policy.md` is the durable authority for platform, tool, mode, model/version, token/quota, plugin, connector, compatibility, and staged-workflow recommendations whenever a prompt is created or revised.
- All substantive source, test, schema, migration, content, asset, dependency, generated-output, build, typecheck, or multi-file coordination work must be performed in an authenticated repository checkout through Codex or another repository-capable agent.
- Before narrowing to an edit surface, complete the protocol's whole-repository orientation: live head and worktree, all branches and open PRs, current prompt/handoff/output, historical and planning reconciliation, relevant focused authority, manifests/configuration, architecture and caller paths, tests/build/CI, mirrors/generated output, and known blockers.
- Read the complete current versions of `docs/dev/current-codex-prompt.md`, `docs/dev/current-gpt-handoff.md`, `docs/dev/current-codex-output.md`, `docs/dev/historical-version-and-deferred-route-register.md`, `docs/design/current-planning-anchor-reconciliation.md`, the prompt-execution platform/tool selection policy, the failure-pattern register, branch policy/register, and the most specific accepted decision or audit before implementation.
- Use repository agents or subagents for independent bounded inspections when useful, but give each one an exact source head, scope, required authorities, exclusions, and output contract. The coordinating agent must reconcile all reports against the same live repository head.
- Connector-prepared source replacements, patches, probes, and repair bundles are evidence only. They must be independently compared against live source, implemented in the repository, covered by repository tests, and validated before they can become implementation authority.
- A chat response is not a repository handoff. Complete substantive runs by updating the current output, handoff, prompt when routing changes, branch register, focused authority, and exact commit/push identities required by the protocol.
- If a synchronized authenticated checkout, required tooling, or prescribed validation is unavailable, report incomplete work and do not claim implementation or acceptance.

## Game Versions, Development Milestones, And Run Labels

- The canonical player-facing game version is the root `GAME_VERSION` value. `docs/dev/game-version-roadmap-and-acceptance-policy.md` controls game-version timeline, pre-alpha/alpha/beta/RC/release stages, and game-version acceptance criteria.
- Prospectively use `DEV-X.Y.Z - Short Name` for a primary Codex development milestone. Do not use old `Step N` labels for new work.
- Prospectively use `DEV-X.Y.Z.S - Short Name` only for a support run attached to exactly one primary development milestone, where `S` is the support-run counter.
- Use a stable unversioned run name for cross-cutting research, coordination, source indexing, held planning, playability prioritization, or read-only work that does not itself advance a primary development capability and is not narrowly attached to one primary.
- Each Codex prompt should include the current development-milestone label when it is part of an ongoing primary or support workflow.
- Historical `Version X.Y.Z` and `Version X.Y.Z.S` labels remain stable accepted references. Do not mass-renumber historical commits, decisions, prompts, tests, or documents; interpret those labels as legacy development-milestone identifiers in current planning.
- Game version, development milestone, build SHA, save/world/data version, deployment revision, package version, protocol/schema version, and model/tool version are separate identities. Never infer one from another.
- `docs/design/internal-versioning-and-release-milestone-policy.md` is the durable detailed authority for development-milestone classification, `DEV-` migration, historical-label compatibility, and technical maturity-band entry.
- `docs/dev/playability-posture-and-version-calibration.md` is the durable authority for the current player-facing playability posture.
- Private npm/package `version` fields are package metadata, not canonical game-version authority unless a later explicit policy says otherwise.
- Persisted fields such as `worldVersion` are save/world-state authority and must not be changed merely to align visually with `GAME_VERSION`.
- A development milestone may advance without changing the game version. A game version may advance only after a separate player-facing game-version acceptance decision proves a meaningful playable-build delta.
- Tests, schemas, validators, audits, refactors, owner migrations, deployment revisions, or documentation volume do not independently justify a game-version increment.
- Before changing `GAME_VERSION`, apply the acceptance procedure in `docs/dev/game-version-roadmap-and-acceptance-policy.md` and record an explicit `GAME_VERSION_ACCEPTED`, `GAME_VERSION_NOT_READY`, or `GAME_VERSION_BLOCKED` result.
- Development milestone patch numbers may be multi-digit, such as `DEV-0.5.10`; do not roll from `DEV-0.5.9` to `DEV-0.6.0` automatically.
- Development minor-band advancement means engineering maturity has changed, not that the patch count reached 9, 99, or any other visual threshold.
- A three-segment primary development milestone is appropriate only when a run materially adds, changes, activates, closes, or formally accepts a durable capability or authority within the current development band.
- Routine audits, retries, repairs, validation, parent-specific clarification, and parent-required cleanup should use a four-segment `DEV-X.Y.Z.S` suffix rather than consuming another primary development milestone.
- Broad research, coordination, future-system planning, and playability-prioritization work should remain unversioned unless the document itself is the required durable decision that materially advances an active development capability.
- Advance to a new development minor band only after a docs-first readiness audit proves every technical criterion for that band and records an explicit accepted decision. If the gate is not accepted, continue the current development band.
- Before assigning any new development run, classify it in this order: development-band entry, current-band primary capability, parent-specific support suffix, or unversioned work. When uncertain, choose the less maturity-significant label.
- Current historical development bands remain meaningful technical chronology:
  - legacy `0.1.x`: repository scaffold, workspace conventions, schemas, and first canonical content foundations;
  - legacy `0.2.x`: player identity, clean save/load behavior, creator/start-state, and core local UI flow foundations;
  - legacy `0.3.x`: world, civilization, economy, reputation foundations, and stricter content validation;
  - legacy `0.4.x`: account, Legacy, Chronicle, progression, and local persistence foundations;
  - legacy `0.5.x`: foundation stabilization, metadata guardrails, branding alignment, workflow rules, repo hygiene, cleanup, and validation hardening;
  - legacy/current `0.6.x`: runtime ownership transition and dependency closure;
  - `DEV-0.7.x`: integrated gameplay systems interacting through stable shared contracts;
  - `DEV-0.8.x`: vertical-slice technical hardening;
  - `DEV-0.9.x`: alpha-support technical readiness;
  - `DEV-1.0.0`: release-engineering readiness only, not automatic Game `1.0.0`.
- The current true game-version timeline is separate and begins with Game `0.1.x-prealpha` First Playable, then Game `0.2.0-prealpha` vertical slice, later pre-alpha expansion, Game `0.5.0-alpha`, Game `0.8.0-beta`, Game `0.9.x-rc.N`, and Game `1.0.0` accepted release, subject to the exact gates in the game-version policy.
- Platform/tool recommendations belong outside and before copy-paste prompt bodies, not inside the prompt itself.
- Before every prompt, perform the fresh capability inventory required by `docs/dev/prompt-execution-platform-tool-selection-policy.md`. Consider regular ChatGPT, Deep Research, ChatGPT via GitHub Connector, Agent Mode, GPT Work or successor workspaces, all current Codex modes, and every relevant installed or potentially installable plugin, connector, skill, and specialized tool.
- Required access and completion authority are hard gates. Do not recommend a platform that lacks required repository, local-worktree, web, application, connector, execution, validation, commit, or push capabilities.
- Do not assume tools from separate platforms can be combined. State cross-platform incompatibilities, manual handoffs, and provisional conclusions explicitly.
- Recommend an exact platform, mode, model/version, and reasoning level only when currently visible or confirmed. Otherwise recommend a capability class and disclose the uncertainty. Fixed model/version lists in older documents are historical examples only.
- Balance quality, research depth, validation authority, token/quota consumption, coordination overhead, latency, privacy, and plugin availability. Do not default every task to the same execution mode or reasoning level.
- Use higher reasoning for broad evidence synthesis, risky multi-owner decisions, persistence or acceptance work, adversarial audits, and substantial multi-file changes; use a lighter supported level only for narrow low-risk work when quality is preserved.
- Codex Plan Mode or any read-only successor mode is non-mutating: do not write files, update [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md), stage changes, untrack files, clean up artifacts, or otherwise implement work while still in that mode.
- If an implementation or cleanup request arrives while still in a non-mutating mode, return a decision-complete proposed plan and state the required mode change instead of editing files.
- Prefer ChatGPT via GitHub Connector for small repo-aware docs, handoff, audit, prompt-file, or tiny GitHub file edits when quality will not be sacrificed and local execution is not required.
- Use Codex or another authenticated repository-capable implementation surface for local validation, multi-file code/content changes, commands, tests, builds, migrations, generated output, or edits that need the real worktree.
- Use staged workflows when no single platform has both the required research depth and repository or execution access. Name the owner, handoff artifact, token/quota posture, and validation boundary for every stage.
- If a materially useful plugin or connector may be available but is not installed or activated, tell the user before the prompt, explain its value and platform, state whether the prompt can proceed without it, and offer the supported installation or activation path. Never word a prompt as though an unavailable capability is active.

## GPT Connector Active Assistance

- `docs/dev/gpt-connector-assistance-policy.md` is the durable detailed authority for proactive ChatGPT via GitHub Connector support.
- `docs/dev/codex-vs-gpt-connector-handling-procedure.md` is the durable operational sequence for dividing work between GPT/Connector preparation, bounded Codex local/executable slices, and Connector post-run review; use it with the resource-budget policy whenever Codex/high-reasoning capacity is constrained.
- GPT should actively identify safe connector work that can aid the current Codex run, prepare future Codex work, run independently in parallel, improve documentation, classify stale or historical material, or remove avoidable inspection and packaging burden from Codex.
- Prefer the least-powerful safe tool. Do not send work to Codex solely because Codex can perform it when the connector can complete it with equal confidence and lower overhead.
- Parallel connector passes should normally use isolated branches, state their source commit, avoid the active Codex edit surface, and remain unmerged until overlap and routing are reviewed.
- GPT may apply only tiny, obvious, low-risk bug or metadata fixes when intent is unambiguous, the complete patch is connector-reviewable, local execution is not materially required, and the active Codex route does not own the same files or behavior.
- GPT should maintain repository documentation when safe, but must not rewrite large files from partial fetches, delete artifacts without proven retention closure, invent canon, or claim validation that was not run.
- GPT should ask for user input when product direction, canon, UX, balance, abstraction, milestone scope, or route priority is materially ambiguous and repository evidence cannot decide it safely.
- User-direction questions should be concrete and timely enough to prevent avoidable implementation assumptions; do not ask the user to decide facts already settled by accepted repository authority.
- After completing a task, GPT should briefly reassess whether another authorized connector-safe pass would materially advance the same objective, while avoiding open-ended scope expansion or duplicate work without an independent-verification purpose.

## Branch Lifecycle And Integration

- `docs/dev/branch-lifecycle-and-integration-policy.md` is the durable detailed authority for branch inspection, integration, retention, supersession, and deletion.
- `docs/dev/branch-disposition-register.md` is the current coordination surface for known non-default branches and pull requests; live refs must be reinspected before action.
- Codex must fetch and prune, inventory relevant local and remote branches and open PRs, inspect each candidate's merge base, unique commits, changed paths, current authority, and semantic overlap, and assign or refresh a disposition at the checkpoints defined by the branch policy.
- Do not merge branches merely because Git reports no textual conflict. Review semantic compatibility and run validation appropriate to the branch contents.
- Integrate documentation-only unique-path branches only after rereading them against current authority. Rebase or re-author stale, mixed, implementation, schema, content, save, migration, asset, dependency, or generated-output branches as required before validation.
- Delete local or remote branches only after accepted work is reachable or equivalently preserved on `master`, all named consumers are complete, linked PRs are resolved, and the exact ref and head SHA are verified.
- Explicitly protected branches remain read-only and must not be merged, rebased, force-updated, or deleted unless a later accepted prompt or explicit user instruction changes that status.
- Every Codex completion report must state the branches and PRs inspected, disposition changes, integrations or deletions performed, validation run, and exact review trigger for every retained branch. If no branch action was due, state that explicitly.
- Branch cleanup must not silently broaden the active package. Record a decision-complete disposition and schedule the smallest dedicated integration pass when branch work is useful but not safe inside the active route.

## Failure Patterns And Verification Guardrails

- `docs/dev/codex-failure-patterns-and-verification-guardrails.md` is the durable project-specific register of reusable failure patterns and required prevention checks.
- Codex must read the relevant entries before implementation, repair, parent acceptance, persistence/migration/publication work, real-caller UI workflow changes, branch integration, or workflow-authority maintenance.
- Apply only entries relevant to the active surface; do not bloat trivial runs with unrelated history.
- Green test counts do not replace the register's required caller-path, failure-boundary, restart, retry, conflict, and repair-completion checks.
- Every applicable completion report must list the pattern IDs applied and the evidence satisfying them. If no entry applies, state that explicitly.
- When a new independent inspection reveals a reusable omission, add or update one generalized entry and link the focused audit rather than duplicating the full defect narrative.

- Each detailed Codex output written to [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md) must state:
  - source development milestone/run
  - current game version
  - current playability posture
  - date
  - branch/status assumption
  - label class: primary development milestone, support suffix, or unversioned
  - parent development milestone when the run is a support suffix
  - development milestone impact: `none`, `supports_current_band`, `advances_current_band`, or `band_entry_candidate`
  - game-version impact: `none`, `candidate`, or accepted explicit game-version decision
  - files changed
  - checks run
  - applicable failure-pattern IDs and verification evidence, or an explicit statement that none apply
  - branch/PR lifecycle review and disposition changes
  - suggested commit message
  - risks/follow-up notes
  - next recommended development milestone/run and any separately proposed game-version decision

## Prompt Packaging

- Copy-paste prompts should not include a platform, tool, mode, model/version, plugin, or token/quota recommendation inside the prompt body.
- State the fresh recommendation outside and before the copy-paste prompt using the recommendation block in `docs/dev/prompt-execution-platform-tool-selection-policy.md`.
- [docs/dev/current-codex-prompt.md](docs/dev/current-codex-prompt.md) stores the authoritative active prompt body and should not include the run-specific platform/tool/mode/model line.
- When GPT generates, advances, or revises the next Codex prompt, it must update `docs/dev/current-codex-prompt.md`, fetch the file to verify the write, and give the selected platform, mode, model/version or capability class, reasoning level, required tools/connectors, plugin status, token/quota posture, manual preflight, known incompatibilities, alternative route, and capability-check date directly in chat.
- Before presenting the prompt, disclose materially useful plugins or connectors that are available but not installed or activated, unavailable on the recommended surface, or of unknown availability.
- Do not store a run-specific platform/tool/mode/model recommendation in this durable instruction file; select it from the current capability inventory so repository documentation cannot become a stale execution pointer.
- Prompt wording must match the selected surface. Deep Research prompts must not claim private-repository access; connector prompts must not claim local execution; non-mutating Codex prompts must not authorize edits; implementation prompts must name worktree, validation, branch, commit, and handoff requirements; staged workflows must define transfer boundaries.
- Do not include phrases like "I have included necessary files" unless the user must manually attach, move, upload, or provide files for that run.
- Tell the user explicitly when they should include files, move files, upload files, transfer a research brief, pull/sync/push, activate a plugin, authorize a connector, or otherwise change files or access before running a prompt.
- If no manual file, access, plugin, authorization, or transfer action is needed, omit that language entirely.

## Development Discipline

- Prefer the smallest coherent patch that solves the requested task.
