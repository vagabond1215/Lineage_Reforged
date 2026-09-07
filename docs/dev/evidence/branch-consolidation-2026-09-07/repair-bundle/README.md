# Version 0.6.9.7 Connector Repair Bundle

Status: evidence-only input for the active Codex implementation route

Source repository: `vagabond1215/Lineage_Reforged`

Source `master` head: `b6422118567a79a23be3377f035dd3a6905d4d8b`

Active consumer:

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

## Authority And Use

This directory is a connector-prepared, repository-native representation of the local repair bundle. It is **not accepted implementation authority** and must not be merged or copied blindly.

Codex must:

1. resolve and verify live `master` before using the bundle;
2. read the controlling prompt and decisions first;
3. inspect these artifacts as candidate evidence only;
4. reproduce all three findings against untouched live source;
5. independently reconcile each replacement against the live files and shared contracts;
6. extend the focused repository test suite rather than treating the standalone probes as substitutes;
7. run every focused and prescribed test, the RPG UI production build, bounded TypeScript audit, mirror checks, fresh adversarial probes, complete diff inspection, and `git diff --check`;
8. implement through the active Codex branch/worktree under normal repository policy;
9. report `IMPLEMENTED_PENDING_PARENT_AUDIT` only after the complete repository validation and coordination-document update succeeds.

Do not cherry-pick this evidence branch as a completed implementation package. Do not replace production files from these candidates without reviewing the complete live diff.

## Contents

The original ZIP is retained as five ordered Base64 parts because the connector content API writes UTF-8 text, not binary files:

- `Lineage_Reborn_0.6.9.7_local_repair_bundle.zip.b64.part01`
- `Lineage_Reborn_0.6.9.7_local_repair_bundle.zip.b64.part02`
- `Lineage_Reborn_0.6.9.7_local_repair_bundle.zip.b64.part03`
- `Lineage_Reborn_0.6.9.7_local_repair_bundle.zip.b64.part04`
- `Lineage_Reborn_0.6.9.7_local_repair_bundle.zip.b64.part05`
- `MANIFEST.sha256` — SHA-256 identities for the original ZIP and every retained member.

Reconstruct from the repository root with:

```bash
cat docs/dev/repair-bundles/version-0.6.9.7/Lineage_Reborn_0.6.9.7_local_repair_bundle.zip.b64.part{01..05} \
  | base64 --decode \
  > /tmp/Lineage_Reborn_0.6.9.7_local_repair_bundle.zip
sha256sum /tmp/Lineage_Reborn_0.6.9.7_local_repair_bundle.zip
unzip -l /tmp/Lineage_Reborn_0.6.9.7_local_repair_bundle.zip
```

Expected ZIP SHA-256:

`c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`

The ZIP contains:

- complete candidate replacements for `normal-defeat.ts` and `campaign-session.ts`;
- the pre-edit reproduction probe;
- the 48-case adversarial probe;
- the local implementation report and matrices.

## Scope Boundary

The bundle does not authorize:

- shared type or save-contract changes;
- dependency changes;
- survey behavior;
- protected-branch changes;
- PR #2 changes;
- parent `0.6.9` acceptance;
- installation of `0.6.9.8` before successful repository implementation and validation.

## Disposition

Branch disposition: `HOLD_NAMED_CONSUMER`.

Named consumer: the active `0.6.9.7` Codex implementation run.

Next review trigger: after Codex has independently implemented or rejected every bundle candidate against the then-live `master`.

Retirement rule: preserve until the accepted implementation or an explicit superseding disposition makes every useful artifact reachable or equivalently recorded on `master`.
