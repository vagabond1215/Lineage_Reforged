# DEV-0.7.1.2 — G9 Destructive Campaign-Graph Preflight Repair

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-05. Support run attached to planned primary `DEV-0.7.1`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Begin from synchronized hosted `master`. G9 parent acceptance, G10 activation, deployment, planned primary and Game-version acceptance remain held.

## Objective

Repair only F1 in `docs/design/dev-0.7.1.1-g9-lifecycle-parent-acceptance-audit.md`. `CleanEpochAccountStore.transitionAccount` presently validates surviving row shapes but allows incomplete campaign graphs to be erased. Isolated published-campaign probes removed a required artifact, control, first recovery, slot address, slot generation or Soundings witness with version-1 rows still present; both reset and delete committed. G9A requires unexpected missing storage to fail closed. Do not treat these defect reproductions as successful behavior.

## Required implementation and verification

- Reconcile live schema and G9A–G9F authority. Build one account-wide graph preflight inside the destructive transaction before its first write. Validate required cross-store existence, identity and provenance for actual prepared, pending, published, descendant, terminal, deleted-address and historical states. A surviving row's key/version is insufficient. Distinguish optional evidence from evidence required by a specific accepted state; valid G9E deleted addresses and closed history must remain destructible.
- For both reset and delete, make missing or corrupt required artifact, control, first/descendant/terminal recovery, witness, slot address, current generation, deletion receipt or binding fail closed with unchanged account revision/generation, surviving bytes, other account and no lifecycle receipt. Preserve password verification, exact CAS, tombstone and same-source retry. Do not add a production dependency or route through retained localStorage lifecycle writers.
- Replace or supplement G9F's independent-row synthetic seeds with coherent campaign graphs wherever tests claim graph completeness. Add durable native browser regressions for each F1 category and valid controls, pending first/descendant/terminal recovery before reset/delete, two tabs, restart, abort/quota, lost readback/exact retry, old hints/registration and selected-App blocked presentation. Prove valid reset/delete after G9E address deletion and terminal cleanup. If a state needs a separate accepted repair owner, block it explicitly and record that narrow decision.
- Run the smallest G9 owner/adjacent browser, focused Node, Node UI-config, app-local Vite and broad UI baseline matrix needed for confidence. Distinguish fresh checks, retained evidence and synthetic fixtures. Do not call the broad UI baseline green if it remains nonzero.

Fetch/prune and inspect live branches/open PRs with retained review triggers. Record a focused F1 repair result and remaining parent audit gate, update current output/handoff/prompt/planning/historical/branch routing as applicable, commit/push and read back hosted head. Install an independent G9 parent re-audit prompt only after the repair passes. Do not begin G10 unless that later audit explicitly reaches `G9_PARENT_ACCEPTED`; do not accept planned `DEV-0.7.1`, deploy or change `GAME_VERSION` in this support repair.
