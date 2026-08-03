# Chronicle, Notification, Operation, And Projection Provenance Audit

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only, documentation-only evidence audit; no local tests, builds, typechecks, linters, simulations, or runtime execution

## Purpose

Separate durable gameplay results from UI-created notices, Chronicle entries, operation projections, game deltas, and other presentation records before future history, replay, correction, observer-safe presentation, or representative-loop work.

This audit does not authorize a generic event framework, Chronicle migration, notification redesign, retention change, or new gameplay facts.

## Current Classification

`SESSION_HISTORY_AND_NOTICE_RECORDS_EXIST; MOST GAMEPLAY_LOOP_PROVENANCE_IS_UI_SYNTHESIZED`

The repository currently contains several different evidence classes:

- accepted engine command results and emitted events for travel, quest acceptance/tracking, and activity selection;
- campaign mutation authority records proving admission of proposed snapshots;
- session notifications and Chronicle entries stored in the snapshot;
- operation/current-activity records stored in session state;
- transient panel notices and body-state toasts;
- `GameDelta` projections emitted by engine tick surfaces;
- UI view models derived from snapshot/account/delta state.

These are not interchangeable. A notification, Chronicle entry, operation row, delta, or campaign ledger entry does not automatically prove the underlying domain result.

## Current Construction Paths

### Notifications

The UI gameplay bridge directly creates notification records with:

- an id derived from current tick plus current list length;
- title, detail, time label, and tone;
- newest-first insertion;
- truncation to eight records.

This is deterministic for one in-memory ordering, but the id is not tied to a command/result identity. Reordering, duplicate retries, concurrent same-tick results, or later correction can change the array-position component.

### Chronicle

The UI gameplay bridge directly creates Chronicle ids from current tick plus current Chronicle length, then inserts newest-first and truncates to 48 entries. Quest, activity, rest, discovery, trade, and reputation narratives are assembled by UI code.

These records are persisted history-shaped presentation, but they are not independently replay-safe result receipts. Their summaries, entities, stat-change strings, status labels, and tags are copied explanatory text rather than owner-verifiable mutation evidence.

### Operations And Current Activity

The UI bridge builds and upserts quest operations, removes them on turn-in, and replaces `currentActivity` during travel, survey, cargo, rest, and turn-in flows. The resulting state is admitted by the campaign gateway, but there is no common operation-lifecycle command/result authority.

### Transient Notices And Toasts

Panel notices and body-state toasts are presentation state. They can be dismissed or replaced and should not be treated as durable history. The shell suppresses body-state toast presentation while another notice is active.

### Game Deltas And View Models

Engine ticks can produce typed deltas and UI view models project snapshot/account/delta state. These are read-only projections. Their presence does not make them canonical durable events unless a specific owner contract says so.

## Provenance Matrix

| Surface | Durable in snapshot | Direct owner result identity | Replay/correction authority | Current classification |
| --- | ---: | ---: | ---: | --- |
| Engine travel/quest/activity emitted event | result-scoped | yes | command-specific duplicate/stale behavior varies | domain result evidence |
| Campaign authority ledger | yes | campaign mutation identity | campaign-level duplicate/lineage rules | admission evidence, not domain narrative |
| Session notification | yes | generally no | no exact duplicate/correction contract | persisted presentation record |
| Chronicle entry | yes | generally no | no exact replay/correction contract | persisted narrative projection |
| Operation/current activity | yes | generally no for UI bridge flows | no common lifecycle receipt | gameplay/session state |
| Panel notice/body toast | no durable guarantee | no | dismissible/transient | presentation only |
| Game delta | consumer-dependent | tick/source shaped | projection lifecycle only | read-only projection |
| UI view model | no | no | recomputed | presentation projection |

## Risks For Future Consumers

1. Treating Chronicle text as proof that a reward or consequence occurred exactly once.
2. Treating notification ids as stable command/result ids.
3. Replaying an accepted mutation while adding a second notification or Chronicle row.
4. Correcting gameplay state without correcting or superseding derived history.
5. Losing older history through bounded truncation while another system assumes complete event retention.
6. Conflating transient panel notices with durable session notifications.
7. Using UI-authored operation state as authoritative activity or quest progress.
8. Rendering raw game deltas as permanent canonical history.

## Minimum Future Contract Questions

A future owner-specific history integration should decide:

- which accepted result is the source of each notice, Chronicle entry, operation transition, or delta;
- whether derived records store source command/result/occurrence ids;
- duplicate and replay behavior;
- correction, supersession, and retraction behavior;
- ordering and same-tick tie-breaking;
- retention/truncation and archival boundaries;
- campaign versus account/run-history publication;
- observer-safe redaction and certainty;
- whether text is stored or re-projected from typed facts;
- accessibility and transient live-region behavior.

## Named Consumers

Future work must inspect this audit when it covers:

- Chronicle or durable history;
- notifications, toasts, badges, or live regions;
- quest/activity/rest/travel event output;
- operation lifecycle;
- replay, correction, supersession, or archival behavior;
- observer-safe presentation;
- representative-loop history claims.

## Review Trigger

Re-review at the next route claiming durable command-event provenance, replay-safe notifications, Chronicle integration, corrected history, or account/run-history publication.

## Exclusions

No source, tests, schemas, content, UI, event framework, persistence format, retention rule, active prompt, roadmap, backlog, or branch register changed in this pass.
