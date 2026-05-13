# Repository Instructions

## Project Identity

- Working title: Lineage: Reforged.
- Genre and tone: grounded medieval fantasy RPG with systemic gameplay.
- Progression focus: lineage, legacy, dynasty continuity, and persistent history over generic perk accumulation.
- Character model: classless character development where the active system supports it; avoid adding hard class gates unless a dedicated design pass approves them.
- Design priority: durable world state, authored content integrity, and validated systems before broad runtime expansion.

## Version And Run Labels

- Use `Version X.Y.Z - Short Name` for Codex workflow labels. Do not use old `Step N` labels for new work.
- Each Codex prompt should include a version label when it is part of the ongoing workflow.
- Internal workflow versions are development maturity markers, not public game release versions.
- Patch numbers may be multi-digit, such as `Version 0.5.10 - Workflow Baseline Review`; do not roll from `v0.5.9` to `v0.6.0` automatically.
- Minor-band advancement means project maturity has changed, not that the patch count reached 9.
- Patch versions advance for scoped audits, implementations, cleanup, docs, validation, or handoff runs within the same maturity band.
- Advance to a new minor band only when the project enters the next maturity phase described below:
  - `v0.1.x`: repository scaffold, workspace conventions, schemas, and first canonical content foundations.
  - `v0.2.x`: player identity, save compatibility, creator/start-state, and core local UI flow foundations.
  - `v0.3.x`: world, civilization, economy, reputation foundations, and stricter content validation.
  - `v0.4.x`: account, Legacy, Chronicle, progression, and local persistence foundations.
  - `v0.5.x`: foundation stabilization, including metadata guardrails, branding alignment, workflow rules, repo hygiene, generated/log/temp cleanup, and validation hardening.
  - `v0.6.x`: runtime ownership transition, replacing UI-authored or demo command handling with engine-owned commands, tick/event output, and authoritative session updates.
  - `v0.7.x`: integrated gameplay systems interacting through stable shared contracts.
  - `v0.8.x`: pre-alpha vertical-slice hardening, narrow content completeness, balancing, and regression coverage.
  - `v0.9.x`: alpha-readiness stabilization, migration policy, known limitations, packaging/launch flow, save compatibility, and release-candidate QA.
- Use later `v0.8.x` labels only when a narrow playable path is being stabilized as a pre-alpha slice.
- Reserve alpha readiness until a playable, validated vertical slice has engine-owned runtime behavior, stable save/load, and explicit known limits.
- Platform/tool recommendations belong outside and before copy-paste prompt bodies, not inside the prompt itself.
- Accepted platform/tool labels:
  - ChatGPT via GitHub Connector
  - ChatGPT Deep Research
  - ChatGPT Agent Mode
  - Codex 5.5 Plan Mode
  - Codex 5.5 Local
  - Codex 5.5 Cloud, only when justified by larger multi-file work
- Codex Plan Mode is non-mutating: do not write files, update [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md), stage changes, untrack files, clean up artifacts, or otherwise implement work while still in Plan Mode.
- If an implementation or cleanup request arrives while still in Codex Plan Mode, return a decision-complete proposed plan instead of editing files.
- Prefer ChatGPT via GitHub Connector for small repo-aware docs, handoff, audit, or tiny GitHub file edits when quality will not be sacrificed.
- Use Codex for local validation, multi-file code/content changes, commands, tests, or edits that need the local working tree.
- Each detailed Codex output written to [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md) must state:
  - source version/run
  - date
  - branch/status assumption
  - files changed
  - checks run
  - suggested commit message
  - risks/follow-up notes
  - next recommended version/run

## Prompt Packaging

- Copy-paste prompts should not include the platform/tool label inside the prompt body.
- State the platform/tool label outside and before the copy-paste prompt.
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

- At the start of substantial Codex work, review [README.md](README.md) and [docs/future_content_backlog.md](docs/future_content_backlog.md) before running major commands or editing files.
- On every Codex run that adds content, changes scope, or explicitly defers work, update [docs/future_content_backlog.md](docs/future_content_backlog.md).
- Add newly deferred systems, blocked follow-up work, and implementation notes for anything intentionally held off.
- When a deferred item is started or completed, update or remove its backlog entry in the same run.
- Keep backlog entries concrete: what is deferred, what prerequisite must exist first, and which content/system layer should own future implementation.

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
