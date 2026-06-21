# Current Codex Output

Source route: GPT-side tooling guide update after `Version 0.5.218 - Settlement Identity Schema Decision`
Date: 2026-06-21
Branch/status assumption: `master`; update applied directly through the GitHub connector.

## Result

Created `docs/dev/gpt-codex-tooling-instructions.md` as the active GPT/Codex operating guide for Lineage Reforged.

The guide standardizes how GPT should choose among GPT reasoning, Codex, Deep Research, GitHub connector tools, web search, uploaded-file handling, Codex skills, prompt templates, inspect-last behavior, Deep Research artifact handling, version tracking, GPT-DR labels, and cross-thread prompt setup.

This update does not change the numbered Codex queue. The next numbered Codex pass remains `Version 0.5.219 - Recipe And Production Schema Decision`.

## Files Changed

- `docs/dev/gpt-codex-tooling-instructions.md` (created)
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`

## Checks Run

- GitHub connector write completed.
- Manual scope audit - passed; documentation-only operating guide update.
- Implementation-scope audit - passed; no schema, validator, content JSON, test, runtime, UI, storage, gameplay, migration, or temporary-artifact file changed.
- No tests run; documentation-only coordination update.

## Behavior / Runtime Confirmation

Documentation only. No schema, content JSON, validator, test, runtime, UI, storage/save-state, gameplay, migration, or temporary research artifact change occurred.

## Risks / Follow-Up

- The new tooling guide should be used in future GPT threads to maintain consistent prompt shape, tool routing, skill selection, GPT-DR labels, and Codex mode choices.
- The guide is operational policy only; it does not replace permanent design decisions, current handoffs, schemas, content, validators, or tests.
- The immediate Codex queue remains unchanged and does not need new Deep Research before `0.5.219`.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.219 - Recipe And Production Schema Decision

## Suggested Commit Message

docs(dev): add GPT Codex tooling guide
