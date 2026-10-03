# Character Creator Renovation Local Verification Runbook

Date: 2026-10-03
Status: connector-prepared local verification packet for `feature/character-creator-renovation-v1`; no merge authorization

## Purpose

This runbook packages the executable verification work that remains after the connector-side character-creator audit and implementation pass. It is intended for a normal Windows PowerShell repository checkout so the creator branch can be validated without assigning another Codex implementation run while the active `DEV-0.7.1` persistence path continues elsewhere.

The connector cannot execute these commands. Results must be treated as local evidence only after the commands actually run.

## Source And Conflict Posture

Creator branch at packet preparation:

- branch: `feature/character-creator-renovation-v1`
- implementation closure head before this runbook commit: `15126c8d3a723042f80620aadab2d2fa499903dc`
- last synchronized master head: `3335261c6e700e711aa688ebb931af0d3f7ac2f5`
- current master observed during packet preparation: `2614b7881ccc190590d54c773d3b384485776627`
- current master is two documentation-only commits ahead of the creator branch merge base; those commits touch only `docs/dev/current-codex-prompt.md` and `docs/dev/dev-0.7.1-slice-g9e-1-hardening-gate.md`
- no current master source/test/shared-contract overlap was observed

Do not merge the creator branch to `master` from this runbook. Local validation should finish first, then the branch should be reconciled again against the then-current master head before integration review.

## Repository Validation Rules Applied

The durable validation matrix classifies exact `node --test <files>` commands as focused green gates. UI/shared TypeScript changes may use `npm.cmd run typecheck` as a known-failing audit with baseline comparison. `npm.cmd test` is not a default green gate and can invoke the DB build. `npm.cmd run ui:build` is side-effectful because it writes ignored `apps/rpg-ui/dist/` output and should be run only when that output mutation is intentionally accepted.

This branch changes creator UI, helper/runtime source, shared TypeScript authority, snapshot construction, and focused tests. Therefore the preferred sequence is focused tests first, then UI typecheck audit, then optional UI build/manual smoke.

## PowerShell A: Safety And Exact-Branch Preflight

Run from the repository root.

```powershell
$ErrorActionPreference = 'Stop'

git fetch origin --prune
git status --short --branch
git switch feature/character-creator-renovation-v1
git pull --ff-only origin feature/character-creator-renovation-v1

git status --short --branch
git rev-parse HEAD
git rev-parse origin/master
git merge-base origin/master HEAD
git log --oneline --decorate -8

git diff --check origin/master...HEAD
git diff --name-status origin/master...HEAD
```

Expected precondition: no uncommitted work before tests. If the branch is behind current master, record that fact but do not merge/rebase merely to run the creator tests unless source overlap is observed.

## PowerShell B: Dependency Presence

The root package has no lockfile. The UI workspace owns `apps/rpg-ui/package-lock.json` and the TypeScript/Vite dependencies.

Check first:

```powershell
Test-Path .\apps\rpg-ui\node_modules\.bin\tsc.cmd
node --version
npm.cmd --version
```

If the first command returns `False`, dependency installation is required before typecheck/build. Installation is network-dependent and mutating, so do it only intentionally:

```powershell
npm.cmd --prefix .\apps\rpg-ui ci
```

Do not run install merely to refresh an already working dependency tree.

## PowerShell C: Creator Authority Green Gates

Run the tests added or directly modified by the renovation first:

```powershell
node --test `
  tests/unit/character-creation-profile-resolver.test.mjs `
  tests/unit/character-creator-renovation-authority.test.mjs `
  tests/unit/character-creator-sex-and-persistence.test.mjs
```

These are expected to exit zero. They cover the six-trait resolver, 90 + 10 invariant, catalog validity, appearance mechanical inertness, portrait fingerprint/request races, shared lineage sex authority, snapshot persistence separation, and creator-profile versus runtime-passive-trait isolation.

## PowerShell D: Existing Creator Regression Gates

Run existing neighboring creator tests that were not rewritten for the feature branch:

```powershell
node --test `
  tests/unit/character-creation-form.test.mjs `
  tests/unit/character-creation-randomization.test.mjs `
  tests/unit/character-creation-attribute-preview.test.mjs `
  tests/unit/backstory-creator-availability.test.mjs
```

These are expected to remain green and prove that optional-backstory behavior, form completion, navigation assumptions, full-character randomization, and visible attribute projection still work with the new creator defaults.

## PowerShell E: Start-State And Persistence Regression Gates

Because `newGameSnapshot.ts` and shared origin authority changed, run the nearest current start-state/persistence consumers:

```powershell
node --test `
  tests/unit/legacy-start-resources.test.mjs `
  tests/unit/combat-equipment-mapping.test.mjs `
  tests/unit/account-profile-storage.test.mjs `
  tests/unit/campaign-persistence-foundation.test.mjs `
  tests/simulation/save-load-roundtrip.test.mjs
```

Any failure that points at `profileTraitIds`, `appearanceDescriptorIds`, `identityProfile`, sex modifiers, creator defaults, or new-game snapshot construction is a creator-branch blocker. An unrelated pre-existing failure should be recorded separately rather than repaired opportunistically.

## PowerShell F: UI TypeScript Audit

The branch changes UI/shared TypeScript, so run the UI compiler audit:

```powershell
npm.cmd run typecheck
```

Repository policy historically classifies this as a known-failing audit rather than a universal green gate. For this branch, capture all diagnostics. Any diagnostic in a branch-added or branch-modified creator file is a blocking feature-branch defect until resolved. Unchanged baseline debt outside the creator/shared files should be recorded separately.

Useful filtered rerun when diagnostics are noisy:

```powershell
npm.cmd run typecheck 2>&1 | Tee-Object -FilePath .\creator-typecheck.log
Select-String -Path .\creator-typecheck.log -Pattern 'characterCreation|characterPortrait|player-origins|character-creator|newGameSnapshot|CharacterCreationScreen'
```

`creator-typecheck.log` is a local diagnostic artifact. Do not commit it.

## PowerShell G: Optional UI Build

Only after focused tests and typecheck review, and only if writing ignored `apps/rpg-ui/dist/` is acceptable:

```powershell
npm.cmd run ui:build
```

Afterward inspect repository status and confirm generated output did not introduce tracked changes:

```powershell
git status --short --branch
git diff --check
```

Do not hand-edit or commit `dist` as part of this creator validation.

## PowerShell H: Manual Creator Smoke

Start the existing local dev server:

```powershell
npm.cmd run ui:dev:host
```

Manual checks:

1. Open character creation through the ordinary launcher path.
2. Verify the launcher shell remains intact.
3. Verify lineage source selection still exposes retained/heir sources when available.
4. Verify Identity shows Male/Female, age, height, six Profile Traits, coloration, Appearance, portrait panel, and live attributes.
5. Confirm exactly six profile traits are required and Body Frame cannot be removed without replacement.
6. Confirm contradictory/tension combinations warn rather than silently corrupting selection.
7. Confirm appearance choices do not change attributes.
8. Switch to shaved/short hair after selecting a longer-hair style and confirm incompatible hairstyle state is removed or prevented.
9. Change sex and confirm incompatible facial-hair descriptors are removed.
10. Generate the local proof portrait. Change a portrait-relevant fact and confirm the portrait becomes `Outdated` with `Regenerate Portrait` available.
11. Temporarily create an invalid portrait identity and confirm an existing portrait remains stale rather than current.
12. Confirm portrait generation can be skipped and does not block campaign creation.
13. Walk Continent -> Region -> Settlement -> optional Backstory -> Starting Bundle -> Review.
14. Confirm starting-bundle choice labels and selections remain usable.
15. Confirm save-slot selection and overwrite confirmation still appear.
16. Begin a campaign and confirm the game reaches the normal post-creator session without creator profile IDs appearing as runtime passive traits.
17. Keyboard-only pass: tab through identity controls, trait chips, appearance chips, portrait button, step navigation, save slots, and overwrite dialog; selected/busy/stale/error states must be understandable without color alone.

Stop the dev server with `Ctrl+C` after inspection.

## PowerShell I: Optional Ordinary-Caller Probe

If the focused/start-state tests are green and extra confidence is desired without a broad full-suite run:

```powershell
node --test tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs
```

This is useful because the ordinary integration path starts from production character-creation inputs and `createNewGameSnapshot(...)`. It is not required to diagnose isolated creator UI issues.

## PowerShell J: Final Repository Hygiene

After all local checks:

```powershell
git status --short --branch
git diff --check

git diff --name-only origin/master...HEAD | Sort-Object
```

If typecheck logging was used:

```powershell
Remove-Item .\creator-typecheck.log -ErrorAction SilentlyContinue
git status --short --branch
```

The worktree should be clean except for any intentionally retained ignored build output. Do not commit generated UI output, logs, package-install noise, or unrelated fixes.

## Commands Not Recommended In Advance

Do not run these merely for creator verification:

```powershell
npm.cmd test
npm.cmd run typecheck:workspace
npm.cmd run tool:db-build
```

Reasons:

- full `npm test` is a known broad non-green audit and invokes DB-build behavior;
- workspace typecheck has a broad different compiler context and existing debt, so it adds noise before the UI-scoped audit is understood;
- DB build output is unrelated to the character creator renovation.

They may be selected later by a dedicated integration/acceptance pass if current repository policy and baseline evidence require them.

## Failure Triage Without Codex

If a focused Node test fails, capture the command and complete failure output. Do not edit unrelated systems. Most creator-local failures should be diagnosable from the named file and can be handed back to the connector for a source audit before spending Codex capacity.

If UI typecheck reports creator-branch diagnostics, save or paste only those diagnostics. The connector can inspect the exact hosted file and prepare a narrow repair recommendation; a local edit/test loop should be reserved for defects that genuinely require execution.

If UI build fails after typecheck has no creator-local errors, preserve the first Vite/build error and classify whether it is branch-local or baseline/environmental before making changes.

## Integration Gate After Local Verification

Successful local verification does not itself authorize merge. Before integration:

1. fetch current `master` again;
2. compare master-only changed paths against creator paths;
3. reconcile/rebase/merge only if required by branch policy;
4. rerun the minimum affected focused gates after any source-bearing reconciliation;
5. inspect the complete feature diff;
6. update branch disposition/coordination at the proper route checkpoint;
7. only then consider a creator-to-master PR/merge.
