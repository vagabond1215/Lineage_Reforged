# GPT and Codex Tooling Instructions

Date: 2026-06-21
Status: active GPT/Codex operating guide for Lineage Reforged
Audience: GPT threads, Codex prompt authors, and the user when choosing tools, skills, modes, and prompt shapes

## 1. Purpose

This document standardizes how GPT should assist the user with Lineage Reforged across threads, especially when choosing among ChatGPT/GPT, Codex, Deep Research, GitHub connector tools, Codex skills, local repo workflows, artifact tools, prompt formats, and version tracking.

Use this guide to:

- choose the best tool or skill for the task;
- keep prompt formats consistent across threads;
- preserve the `0.5.x` roadmap and versioning policy;
- avoid using Deep Research when a standard Codex prompt is better;
- avoid using game/UI/asset skills during docs/schema/content authority work unless they are truly relevant;
- maintain clear separation between GPT reasoning, Deep Research reports, and Codex repo edits.

This guide is operational guidance. It does not replace project authority decisions, schemas, content, validators, tests, or current handoff files.

## 2. Always Check The Current Project State

At the start of any repo-related response, GPT should prefer live repo state over memory.

Authoritative coordination files:

1. `docs/dev/current-codex-output.md` - exact latest run/result/status/checks.
2. `docs/dev/current-gpt-handoff.md` - immediate GPT-side guardrails and next route.
3. `docs/design/pipeline-roadmap-consolidation-decision.md` - durable post-`0.5.217` sequence, dependencies, artifact retirement, and research gates.
4. `docs/design/gpt-deep-research-version-tracking-decision.md` - GPT Deep Research gate labels and tracking policy.
5. `docs/dev/codex-sequenced-implementation-plan.md` - ordered near-term Codex queue.
6. `docs/dev/project-roadmap.md` - long-term roadmap and maturity posture.
7. `docs/future_content_backlog.md` - deferred work and historical notes.

When the user says `inspect last`, use the GitHub compare pattern:

```text
compare master~1..master
```

Then fetch the new/updated decision document and `docs/dev/current-codex-output.md` before giving a verdict.

## 3. Tool And Mode Selection

### 3.1 GPT / ChatGPT

Use GPT for:

- reasoning over strategy;
- choosing the next task;
- writing or revising Codex prompts;
- summarizing inspected repo state;
- generating Deep Research prompts;
- deciding whether a task needs Deep Research, Codex, or a specialized skill;
- producing human-readable explanations and options.

Preferred project-facing model label when asked:

```text
GPT-5.5 Thinking
```

### 3.2 Codex

Use Codex for repo work that should inspect, edit, test, validate, or commit files.

Preferred implementation/planning mode label:

```text
Codex 5.5 Local - High
```

Use Codex for:

- docs-only design decisions;
- schema decisions;
- schema/validator/focused-test implementation;
- content seed plans;
- narrow content seeds;
- CI/test/lint fixes;
- repository cleanup;
- coordinated docs updates;
- commit-ready changes.

Do not use Codex for broad external research unless the task is repo-only and does not require current external sources.

### 3.3 Deep Research

Use Deep Research for broad domain research where outside comparisons, citations, and system-design exploration are useful.

Preferred Deep Research mode line:

```text
Deep Research - Light is acceptable; use High only if available.
```

Use Deep Research for:

- new domain research before an authority lane;
- external comparison across RPG/MMO/CRPG/city-builder/tabletop/worldbuilding patterns;
- long planning reports that will later become temporary repo artifacts;
- topics listed as `GPT-DR.*` gates.

Do not use Deep Research for:

- immediate schema-decision passes already supported by existing temp artifacts;
- simple repo inspection;
- ordinary docs-only integration prompts;
- validator/test implementation;
- CI fixes;
- formatting/documentation cleanup.

### 3.4 GitHub Connector / Repo Tools

Use GitHub connector tools for:

- `inspect last` / commit comparison;
- fetching files from the repo;
- creating/updating/deleting repo docs when directly requested;
- checking PRs/issues/changed files when relevant.

Important behavior:

- After creating/updating files directly through the connector, cite fetched file lines in the final response when possible.
- Do not invent `sandbox:/mnt/data` links for connector files. Use repo paths and file citations.
- Prefer `fetch_file` for exact repo content and line citations.

### 3.5 Web Search

Use web search when facts may have changed or when the user asks about current OpenAI/Codex/ChatGPT behavior, current APIs, current prices, current docs, laws, schedules, or other unstable information.

For OpenAI product behavior, use official OpenAI sources when available. If official sources cannot be found, say what could not be verified.

Do not use web search for purely internal repo facts that can be inspected from GitHub.

### 3.6 Uploaded Files / File Search

Use uploaded files as user-provided context. If the user uploads a Deep Research report or prompt and asks to add it to the repo, treat the attachment as the source.

Use file citations for uploaded-file claims when responding from uploaded content.

## 4. Codex Skill Selection

Skill availability may vary by environment. Use the user's currently visible skill list when choosing skills.

### 4.1 High-value skills for the current Lineage Reforged pipeline

Use or recommend these most often:

| Skill | Best use |
| --- | --- |
| GitHub | Repo inspection, PR/issue flows, source browsing, publish-aware work. |
| Publish Changes | Commit/push/open PR flows after review; use cautiously. |
| Review Follow-up | Address review findings and cleanup issues after a run. |
| CI Debug / GitHub Fix CI | Debug failing tests, lint, GitHub Actions, validation failures. |
| OpenAI Docs | Verify current OpenAI/Codex behavior or API/product docs. |
| Documents / Word Docs | Create/review formal docs when a docx-style artifact is needed. |
| PDF | Read/create/verify PDFs when explicitly needed. |
| Spreadsheets | Content matrices, cross-reference audits, schema inventories, item/settlement/monster tables. |

### 4.2 Useful later for browser/game work

Use only when the task involves game-client architecture, UI, playtesting, or browser behavior:

| Skill | Best use |
| --- | --- |
| Web Game Foundations | Browser-game architecture, state flow, runtime boundaries, game-loop planning. |
| Game UI Frontend | HUDs, menus, overlays, inventory, settlement screens, character sheet, quest/map UI. |
| Browser / Chrome: Control Chrome | Browser QA, local UI inspection, console errors, screenshots. |
| Game Playtest | Browser-game playtests and QA once a playable path exists. |
| Game Studio | Routing ambiguous browser-game work to UI, playtest, engine, or asset paths. |
| Three WebGL Game / React Three Fiber Game / Phaser 2D Game | Only after a rendering/game-engine direction is chosen. |

For the current audit/docs/schema/content-authority phase, Web Game Foundations and Game Studio are usually unnecessary unless the prompt touches browser runtime architecture or game-client integration.

### 4.3 Visual and asset skills

Use for visual direction or production assets, not for current schema/content authority work:

| Skill | Best use |
| --- | --- |
| Image Gen / Generative Polish | Concept art, UI mood, item/settlement/monster visual references. |
| Mood Board Explorer | Art direction, visual territories, setting mood. |
| Scene Explorer / Shot Explorer | Scene composition, trailers, environment shots. |
| Sprite Pipeline | 2D sprite normalization/animation. |
| Web 3D Asset Pipeline | Browser-game 3D asset optimization. |
| Sora Video Generation Skill | Trailer/motion concepts. |
| Speech Generation Skill | Narration/prototype voiceover. |

### 4.4 Low-priority or conditional skills

Defer unless the task explicitly calls for them:

| Skill | Defer unless... |
| --- | --- |
| ASP.NET Core | The project moves into ASP.NET/.NET web app work. |
| WinUI App | The project needs native Windows UI. |
| Android Performance / Emulator QA | The project targets Android. |
| Plugin Creator / Skill Creator / Skill Installer | The task is about creating, editing, or installing Codex skills. |
| Ads Explorer / Offer Explorer / Positioning Explorer / Logo Explorer | The user is working on marketing, product positioning, ads, or identity. |
| Computer Use | The user explicitly needs GUI automation. |

## 5. Prompt Formatting Standards

### 5.1 Codex prompt skeleton

Use this structure for most Codex prompts:

```text
Codex 5.5 Local - High

Task:
<one clear task>

Version:
`Version 0.5.xxx - <Title>`

Purpose:
<why this pass exists>

This pass is <docs-only/schema-only/content-only/etc.>. Do not <forbidden scope>.

Before starting, update the local workspace:

```bash
git fetch origin
git pull --ff-only origin master
```

Primary sources:
- <key docs>

Also inspect:
- <repo files/directories>

Create:
- <new doc/file if any>

Update:
- <coordination docs if any>

Required decisions / implementation requirements:
1. ...
2. ...

Required sections / expected outputs:
1. ...
2. ...

Non-goals:
- no ...

Validation:
- `git diff --check`
- conflict-marker scan on changed files
- trailing-whitespace scan on changed files
- changed-path scope audit
- required-section audit when docs-only
- implementation-scope audit
- focused tests only if implementation changed

Suggested commit message:
`<conventional commit>`
```

### 5.2 Deep Research prompt skeleton

Use this structure for Deep Research:

```text
Deep Research - Light is acceptable; use High only if available.

Research topic:
<topic>

Repository:
Lineage_Reforged

Purpose:
<what to learn and why>

Important scope control:
<what not to drift into>

Primary repo areas to inspect:
- ...

Recent design docs to inspect and respect:
- ...

External research targets:
- ...

Core questions to answer:
1. ...
2. ...

Output format:
Produce a structured research report with these sections:
1. Executive Summary
2. Current Repo State
...

Important constraints:
- Do not implement code.
- Clearly separate repo facts, external research, and recommendations.
- Cite external sources.
```

### 5.3 Inspect-last response pattern

When the user says `inspect last`:

1. Compare `master~1..master`.
2. State changed paths and scope.
3. Fetch the new/updated decision document and `current-codex-output.md`.
4. Give a verdict:
   - Acceptable / acceptable with follow-up / blocker.
5. Summarize what landed.
6. Identify risks/follow-up.
7. State the next recommended version.
8. Cite repo file lines.

### 5.4 Add-Deep-Research-to-repo pattern

When the user asks to add a Deep Research report to the repo:

1. Confirm the report content is present in the conversation/upload.
2. Create a temporary artifact under:

```text
docs/dev/tmp-<topic>-research-YYYY-MM-DD.md
```

3. Mark it temporary, non-canonical, and for one named future consumer.
4. Provide a follow-up Codex integration prompt.
5. The integration prompt should create a permanent design decision and either retain or retire the temp artifact.

## 6. Versioning And GPT Deep Research Gates

Codex passes use monotonic `Version 0.5.x - <Title>` labels.

GPT Deep Research gates use unnumbered labels:

```text
GPT-DR.<lane>.<topic>
```

They do not consume Codex version numbers.

If a Deep Research pass is required before a later lane, display it like:

```text
GPT-DR.<lane>.<topic> - <Research Title> [GPT Deep Research prerequisite]
Version 0.5.xxx - <Associated Codex Pass>
```

Current immediate queue does not require new Deep Research before `0.5.219` through `0.5.229`; existing permanent decisions and temp artifacts are enough.

## 7. Project-Specific Guardrails

For the current `0.5.x` foundation phase:

- Prefer docs-only decisions before implementation.
- Prefer schema decisions before schemas.
- Prefer schema/validator/focused tests before content seeds.
- Prefer content seed plans before content seeds.
- Keep runtime, UI, save-state, mutation, transactions, service execution, combat execution, crafting execution, property state, NPC schedule execution, pathfinding, and broad gameplay out of scope unless explicitly approved by a later readiness decision.
- Do not roll to `0.6.0` merely because version numbers are high.
- Never treat a temporary Deep Research artifact as canon.
- When a temp artifact is consumed, either delete it or name one remaining consumer and removal condition.
- Do not silently renumber old proposed versions; update coordination docs when a run lands or is displaced.

## 8. Recommended Skill Stack By Task Type

| Task type | Preferred GPT/Codex path | Useful skills/tools |
| --- | --- | --- |
| Inspect last push | GPT + GitHub connector | GitHub |
| Draft next Codex prompt | GPT | GitHub if repo state needed |
| Docs-only authority decision | Codex 5.5 Local - High | GitHub, Documents |
| Schema decision | Codex 5.5 Local - High | GitHub, Documents |
| Schema/validator/test implementation | Codex 5.5 Local - High | GitHub, CI Debug/GitHub Fix CI, Review Follow-up |
| Content matrix/audit | GPT/Codex depending on edit need | Spreadsheets, GitHub |
| Broad new domain research | Deep Research | GitHub connector, web research |
| Browser UI/game architecture | Codex with game skill only when relevant | Web Game Foundations, Game UI Frontend, Browser |
| Browser QA/playtest | Codex/browser workflow | Browser, Chrome Control, Game Playtest |
| Visual concepts/assets | GPT/image workflow | Image Gen, Mood Board Explorer, Scene Explorer |
| PR/CI cleanup | Codex | Review Follow-up, CI Debug, GitHub Fix CI |

## 9. Consistent Cross-Thread Opening Prompt

When starting a new GPT thread for Lineage Reforged, the user can paste:

```text
You are assisting with the Lineage Reforged repo. Before giving repo guidance, use the current repository state and these coordination docs as authority:

- docs/dev/current-codex-output.md
- docs/dev/current-gpt-handoff.md
- docs/design/pipeline-roadmap-consolidation-decision.md
- docs/design/gpt-deep-research-version-tracking-decision.md
- docs/dev/gpt-codex-tooling-instructions.md

Follow the established workflow:
- inspect live repo state when needed;
- use Codex 5.5 Local - High for repo edits and implementation prompts;
- use Deep Research only for named GPT-DR research gates;
- keep 0.5.x static authority/schema/content work separate from 0.6+ runtime/UI/save-state work;
- preserve prompt formatting and version tracking rules.
```

## 10. Maintenance

Update this guide when:

- the visible Codex skill list changes materially;
- a new project workflow becomes standard;
- GPT-DR labels or Codex versioning policy changes;
- `0.6` readiness changes the runtime/UI/save-state policy;
- the user identifies a better skill or prompt pattern.

Do not update this guide for every normal Codex pass. Use it for stable workflow policy, not run-by-run handoff.
