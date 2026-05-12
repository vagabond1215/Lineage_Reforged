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
- Each detailed Codex output written to [docs/dev/current-codex-output.md](docs/dev/current-codex-output.md) must state:
  - source version/run
  - date
  - branch/status assumption
  - files changed
  - checks run
  - suggested commit message
  - risks/follow-up notes
  - next recommended version/run

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
