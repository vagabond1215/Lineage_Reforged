# Repository Instructions

## Project Identity

- Working title: Lineage: Reforged.
- Genre and tone: grounded medieval fantasy RPG with systemic gameplay.
- Progression focus: lineage, legacy, dynasty continuity, and persistent history over generic perk accumulation.
- Character model: classless character development where the active system supports it; avoid adding hard class gates unless a dedicated design pass approves them.
- Design priority: durable world state, authored content integrity, and validated systems before broad runtime expansion.

## Version And Run Labels

- Use `Version X.Y.Z - Short Name` for primary Codex workflow labels. Do not use old `Step N` labels for new work.
- Use `Version X.Y.Z.S - Short Name` only for a support run attached to exactly one primary version, where `S` is the support-run counter.
- Use a stable unversioned run name for cross-cutting research, coordination, source indexing, held planning, or read-only work that does not itself advance a primary capability and is not narrowly attached to one primary.
- Each Codex prompt should include a version label when it is part of the ongoing primary or support workflow.
- Internal workflow versions are development maturity markers, not public game release versions, package versions, save-format versions, protocol versions, or compatibility promises.
- `docs/design/internal-versioning-and-release-milestone-policy.md` is the durable detailed authority for label classification, maturity-band entry, and the reserved `0.7.0`, `0.8.0`, `0.9.0`, and `1.0.0` gates.
- Patch numbers may be multi-digit, such as `Version 0.5.10 - Workflow Baseline Review`; do not roll from `v0.5.9` to `v0.6.0` automatically.
- Minor-band advancement means project maturity has changed, not that the patch count reached 9, 99, or any other visual threshold.
- A three-segment primary version is appropriate only when a run materially adds, changes, activates, or closes a durable capability or authority within the current maturity band.
- Routine audits, retries, repairs, validation, parent-specific clarification, and parent-required cleanup should use a four-segment suffix rather than consuming another primary number.
- Broad research, coordination, and future-system planning should remain unversioned unless the document itself is the required durable decision that materially advances the active capability sequence.
- Advance to a new minor band only after a docs-first readiness audit proves every criterion for that band and records an explicit accepted decision. If the gate is not accepted, continue the current band with later patch numbers.
- Before assigning any new run, classify it in this order: new-band entry, current-band primary capability, parent-specific support suffix, or unversioned work. When uncertain, choose the less maturity-significant label.
- Do not mass-renumber accepted historical versions. Apply the stricter classification prospectively and record historical anomalies rather than rewriting shared history.
- Current maturity bands:
  - `v0.1.x`: repository scaffold, workspace conventions, schemas, and first canonical content foundations.
  - `v0.2.x`: player identity, clean save/load behavior, creator/start-state, and core local UI flow foundations.
  - `v0.3.x`: world, civilization, economy, reputation foundations, and stricter content validation.
  - `v0.4.x`: account, Legacy, Chronicle, progression, and local persistence foundations.
  - `v0.5.x`: foundation stabilization, including metadata guardrails, branding alignment, workflow rules, repo hygiene, generated/log/temp cleanup, and validation hardening.
  - `v0.6.x`: runtime ownership transition and its dependency-closure work, replacing UI-authored or demo command handling with engine-owned commands, tick/event output, authoritative session updates, and the bounded static/content prerequisites needed for later integration.
  - `v0.7.x`: integrated gameplay systems interacting through stable shared contracts. Entry requires an accepted engine-owned gameplay loop with authoritative advancement/results, persistence, typed cross-system consequences, accepted-only UI application, and representative integration tests.
  - `v0.8.x`: pre-alpha vertical-slice hardening. Entry requires one repeatable end-to-end slice with its agreed gameplay systems, content, UI/accessibility posture, balance baseline, regression coverage, and reliable save/load.
  - `v0.9.x`: alpha-readiness stabilization. Entry requires the agreed alpha scope, packaging/launch and diagnostic posture, performance budgets, repeated external-play readiness, reliable current-data saves, explicit known limitations, and no ordinary-use critical blocker.
  - `v1.0.0`: accepted public-release milestone. Entry requires completed or explicitly cut launch scope, integrated launch-critical owners, release-candidate QA, stable saves and packaging, accessibility and performance acceptance, user-facing release/support material, and explicit release approval.
- Static content, isolated schemas, pure helpers, read-only projections, selection-only commands, or documentation volume do not independently justify promotion to `0.7.0` or a later milestone.
- Use later `v0.8.x` labels only when a narrow playable path is being stabilized as a pre-alpha slice.
- Reserve `v0.9.x` until sustained alpha testing is viable; reserve `1.0.0` until release-readiness acceptance is recorded.
- Platform/tool recommendations belong outside and before copy-paste prompt bodies, not inside the prompt itself.
- Accepted platform/tool labels:
  - ChatGPT via GitHub Connector
  - ChatGPT Deep Research
  - ChatGPT Agent Mode
  - Codex 5.6 Sol Plan Mode
  - Codex 5.6 Sol Local, with reasoning level selected according to task complexity
  - Codex 5.6 Sol Cloud, only when justified by larger multi-file work
- Do not default every task to the same execution mode or reasoning level. Use High for broad evidence synthesis, risky multi-owner decisions, and substantial multi-file work; use a lighter supported level for trivial narrow edits when quality is preserved.
- Codex Plan Mode is non-mutating: do not write files, update [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md), stage changes, untrack files, clean up artifacts, or otherwise implement work while still in Plan Mode.
- If an implementation or cleanup request arrives while still in Codex Plan Mode, return a decision-complete proposed plan instead of editing files.
- Prefer ChatGPT via GitHub Connector for small repo-aware docs, handoff, audit, prompt-file, or tiny GitHub file edits when quality will not be sacrificed.
- Use Codex for local validation, multi-file code/content changes, commands, tests, or edits that need the local working tree.
- Each detailed Codex output written to [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md) must state:
  - source version/run
  - date
  - branch/status assumption
  - label class: primary, support suffix, or unversioned
  - parent version when the run is a support suffix
  - milestone impact: `none`, `supports_current_band`, `advances_current_band`, or `band_entry_candidate`
  - files changed
  - checks run
  - suggested commit message
  - risks/follow-up notes
  - next recommended version/run

## Prompt Packaging

- Copy-paste prompts should not include the platform/tool label inside the prompt body.
- State the platform/tool label outside and before the copy-paste prompt.
- [docs/dev/current-codex-prompt.md](docs/dev/current-codex-prompt.md) stores the authoritative active prompt body and should not include the platform/tool/mode line.
- When GPT generates, advances, or revises the next Codex prompt, it must update `docs/dev/current-codex-prompt.md`, fetch the file to verify the write, and give the selected platform/tool/mode line directly in chat.
- For the active `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`, the chat mode line is `Codex 5.6 Sol Local High.`
- Do not include phrases like "I have included necessary files" unless the user must manually attach, move, upload, or provide files for that run.
- Tell the user explicitly when they should include files, move files, upload files, pull/sync/push, or otherwise change files manually before running a prompt.
- If no manual file action is needed, omit file-inclusion language entirely.

## Development Discipline

- Prefer the smallest coherent patch that solves the requested task.
- Preserve unrelated worktree changes.
- Use read-only audits before broad edits.
- Do not mix cleanup, feature work, rename work, and system design in one run unless explicitly requested.
- Do not refactor unrelated systems.
- Skip uncertain changes instead of guessing.
- Until explicitly requested, this pre-release project should not plan or implement backwards compatibility. Do not add old-save preservation, old-account preservation, migration aliases, retired-id compatibility, converted-id compatibility, historical id preservation, or migration-only behavior unless the user explicitly asks for compatibility work.
- Update `README.md`, `docs/future_content_backlog.md`, changelogs, `AGENTS.md`, or `.gitignore` only when relevant to the current change.
- If generated or vendor artifacts appear tracked, flag them rather than editing them unless explicitly asked.

## High-Risk Areas

Treat these as high-risk and require narrow scope plus focused validation:

- combat math and stat scaling
- progression and rank-gate math
- economy and trade simulation
- magic runtime behavior
- save/account schema
- Legacy, account, preparation, and payout behavior
- generated/vendor artifacts
- broad UI rewrites

## Magic Guardrails

- Magic metadata and validation are ahead of runtime behavior.
- Magic tags are compatibility/modifier metadata only.
- Do not add generic tag-driven spell execution.
- Do not expand runtime magic unless the prompt explicitly scopes that runtime work.
- Do not add magic skill gain or Magic Legacy power without dedicated approval.
- Treat [docs/design/spellbook-expansion-blueprint.md](docs/design/spellbook-expansion-blueprint.md) as design guidance, not implementation permission.
- Do not infer permission to add spells, spellbook UI, acquisition, catalyst effects, affinity/resistance behavior, or runtime spell expansion from metadata-only work.

## Codex Run Maintenance

- At the start of substantial Codex work, review [README.md](README.md), [docs/dev/current-gpt-handoff.md](docs/dev/current-gpt-handoff.md) when present, and [docs/future_content_backlog.md](docs/future_content_backlog.md) before running major commands or editing files.
- On every Codex run that adds content, changes scope, or explicitly defers work, update [docs/future_content_backlog.md](docs/future_content_backlog.md).
- Add newly deferred systems, blocked follow-up work, and implementation notes for anything intentionally held off.
- When a deferred item is started or completed, update or remove its backlog entry in the same run.
- Keep backlog entries concrete: what is deferred, what prerequisite must exist first, and which content/system layer should own future implementation.

## GPT Handoff Policy

- [docs/dev/current-gpt-handoff.md](docs/dev/current-gpt-handoff.md) is the current ChatGPT/GitHub Connector, Deep Research, or Agent Mode handoff for future Codex work.
- It should contain only connector-side findings, instructions, risks, and follow-up context that remain pertinent for future development.
- It is not a transcript or accumulating long log. Replace or prune stale entries when they are implemented, superseded, or no longer useful.
- Do not update [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md) from a GPT/GitHub Connector planning pass.
- If [docs/dev/current-gpt-handoff.md](docs/dev/current-gpt-handoff.md) conflicts with a newer Codex handoff, trust the newer Codex handoff for exact implementation state and update the GPT handoff when appropriate.

## Temporary Guardrail Docs

- Focused audit, source, triage, and hardening docs are temporary guardrails, not a second backlog.
- Keep them while they directly support an upcoming implementation or planning prompt, prevent repeated analysis, or hold task-specific guidance that is too detailed for the current handoff or durable design ledger.
- When a Codex or planning run consumes one, decide whether remaining guidance should stay in that file, move into the current handoff, move into the roadmap, become durable design-ledger material, or be recorded in the backlog.
- After the useful guidance is implemented, superseded, or promoted into a durable authority file, remove the temporary guardrail doc in a cleanup pass.
- Prompts that rely on temporary guardrail docs should require an explicit cleanup decision in their final output.

## Codex Output Policy

- Prefer writing the final detailed result to [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md).
- Overwrite [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md) after each meaningful Codex run. Do not append historical results.
- Do not create an accumulating transcript file or long run log. Historical detail belongs in git commits.
- Keep the Codex app response extremely short when the output file is available.
- The app response should usually be: `Done. Wrote latest output to docs/dev/current-codex-output.md. Suggested commit: <message>.`
- If files changed, include the suggested commit message in the app response.
- If a blocking issue occurs, report the blocker briefly in the app and write details to the output file.
- Do not paste large summaries in the app unless explicitly requested.

## Expected Repo Output Format

[docs/dev/current-codex-output.md](docs/dev/current-codex-output.md) should use this structure:

```markdown
# Current Codex Output

Source version/run:
Date:
Branch/status assumption:
Label class:
Parent version, when applicable:
Milestone impact:

## Result
Short result summary.

## Files Changed
- ...

## Checks Run
- ...

## Behavior / Runtime Confirmation
State whether runtime, JSON, schema, UI, or data behavior changed.

## Risks / Follow-Up
- ...

## Next Recommended Version
Version X.Y.Z - Name

## Suggested Commit Message
...
```

## Token Discipline

- Keep scope tight.
- Avoid multi-system changes.
- Skip uncertain changes instead of guessing.
- Report blocked work instead of broadening scope.
- Avoid verbose app output when the result file is available.

## Required Deferred Topics

Track these until they are fully implemented:

- magical books / tomes after the spell database is established
- magical scrolls after the spell database is established
- enchanter-authored arcane documents as the owning implementation path
- region-based maps after region definitions and cartography data exist
- any additional content/system improvements intentionally postponed during a Codex run
