# Connector Audit — Soundings F3 Survey Admission View

Date: 2026-09-25. Repository: `vagabond1215/Lineage_Reforged` only.

Disposition: **ADMISSION_VIEW_BOUNDARY_MAPPED**. Documentation/static audit only; no production, test, schema, content, dependency, version, branch or PR mutation.

## Purpose

Bound F3 from `soundings-durable-completion-post-f2-independent-acceptance-audit.md`: completed Soundings currently treats the entire live `ashenReefSurvey` authority graph as frozen turn-in evidence, while the accepted survey owner can later append validated projection-repair history.

## Static ownership map

`AshenReefSurveyAuthorityState` retains `version`, optional `legacyBaseline`, `requests`, `occurrences`, `results`, `consequenceReceipts`, `projectionRepairs`, and `corrections`.

For Soundings admission, the immutable/material view is not simply “survey state without projectionRepairs”. Existing projection-repair history may already be present before turn-in and is part of the graph that the existing `surveyFingerprint` actually certified. Soundings readiness requires no pending survey projection repair and no pending correction reconciliation before submission, but it does not require historical `projectionRepairs` to be empty.

Therefore the safe boundary is:

- **Frozen at admission:** the exact survey authority graph as it existed at turn-in, including any already-authorized projection-repair prefix and resolved corrections/reconciliations that were present then.
- **Allowed later:** only independently validated survey-owner projection-repair records appended after admission; these are durable owner history, but they do not change the earlier survey result/material facts or Soundings payment authority.
- **Not automatically allowed later:** rewrites to requests, occurrences, results, consequence receipts, corrections, legacy baseline, or any pre-admission projection-repair entry. Those remain part of the original accepted survey graph and must still bind to the original admission fingerprint.

## Important consequence

A fix that drops all `projectionRepairs` before hashing is unsafe because it would erase pre-turn-in repair history from the certified admission view. A fix that compares the whole current survey graph is also wrong because valid post-turn-in append-only repair history changes that graph.

The correct conceptual object is the **exact admission-time survey graph as a prefix boundary inside the current projection-repair ledger**, with every other survey-authority field unchanged.

## Existing invariants supporting that boundary

- Soundings readiness fails while survey projection repairs or correction reconciliations remain pending.
- The survey repair owner appends a durable `projectionRepairs` entry and validates the candidate; it does not rewrite the accepted survey result.
- Survey validation assigns deterministic per-result/projection ordinals and deterministic repair IDs and rejects malformed repair evidence.
- The accepted survey contract treats Chronicle/notification presentation state as projection state rather than material gameplay facts, while the authority ledger keeps durable repair evidence.

## Repair constraints

The implementation should preserve the exact pre-admission graph, not invent a new “material-only” survey schema. Post-admission compatibility should be obtained by proving that the original graph is still an exact historical prefix of the current validated survey authority with only authorized projection-repair suffix entries added.

Do not weaken F1/F2 witness binding, recompute a witness from current mutable history, permit arbitrary survey-field drift, or silently normalize/reorder historical repair entries.
