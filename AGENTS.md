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
- For the active unversioned `Culinary Preparation, Portion, Meal Composition, Food Knowledge, And Historical Ration Integration Audit` run, the chat mode line is `Codex 5.6 Sol Local High.`
- Do not include phrases like "I have included necessary files" unless the user must manually attach, move, upload, or provide files for that run.
- Tell the user explicitly when they should include files, move files, upload files, pull/sync/push, or otherwise change files manually before running a prompt.
- If no manual file action is needed, omit file-inclusion language entirely.

## Development Discipline

- Prefer the smallest coherent patch that solves the requested task.