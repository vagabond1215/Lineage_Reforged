# Character Creator Renovation Concurrent Worktree Verification Note

Date: 2026-10-03
Status: companion to `docs/dev/character-creator-renovation-local-verification-runbook.md`; local verification only; no merge authorization

## Why This Note Exists

A local verification attempt on the primary checkout encountered Windows `EPERM` while `npm ci` tried to unlink the Rollup native binding under `apps/rpg-ui/node_modules`. That failure is consistent with another process holding the binary open. Because the active `DEV-0.7.1` G9E.1 run may legitimately own processes in the primary checkout, do not kill Node/Codex/Vite processes blindly and do not retry dependency replacement in that same working directory.

`npm ci` can also leave `node_modules` partially removed after such a failure. A later `tsc is not recognized` result therefore does not by itself indicate a creator TypeScript defect.

The safest low-interference verification path is an isolated detached Git worktree with its own `apps/rpg-ui/node_modules`.

## PowerShell: Create An Isolated Verification Worktree

Run from the primary repository checkout:

```powershell
$ErrorActionPreference = 'Stop'

git fetch origin --prune

$verifyRoot = 'C:\Codex\EoL-creator-verify'
if (Test-Path $verifyRoot) {
  throw "Verification path already exists: $verifyRoot"
}

git worktree add --detach $verifyRoot origin/feature/character-creator-renovation-v1
Set-Location $verifyRoot

git status --short --branch
git rev-parse HEAD
```

The detached worktree is intentional. It prevents accidental feature-branch commits during verification and avoids Git refusing to check out the same local branch in two worktrees.

## PowerShell: Install Only In The Isolated Worktree

```powershell
npm.cmd --prefix .\apps\rpg-ui ci --no-audit --no-fund
Test-Path .\apps\rpg-ui\node_modules\.bin\tsc.cmd
```

The second command should return `True` before typecheck/build is attempted.

## PowerShell: Focused Creator Gates

```powershell
node --test `
  tests/unit/character-creation-profile-resolver.test.mjs `
  tests/unit/character-creator-renovation-authority.test.mjs `
  tests/unit/character-creator-sex-and-persistence.test.mjs

node --test `
  tests/unit/character-creation-form.test.mjs `
  tests/unit/character-creation-randomization.test.mjs `
  tests/unit/character-creation-attribute-preview.test.mjs `
  tests/unit/backstory-creator-availability.test.mjs

node --test `
  tests/unit/legacy-start-resources.test.mjs `
  tests/unit/combat-equipment-mapping.test.mjs `
  tests/unit/account-profile-storage.test.mjs `
  tests/unit/campaign-persistence-foundation.test.mjs `
  tests/simulation/save-load-roundtrip.test.mjs
```

## PowerShell: UI Typecheck

```powershell
npm.cmd run typecheck 2>&1 | Tee-Object -FilePath "$env:TEMP\creator-typecheck.log"

Select-String `
  -Path "$env:TEMP\creator-typecheck.log" `
  -Pattern 'characterCreation|characterPortrait|player-origins|character-creator|newGameSnapshot|CharacterCreationScreen'
```

The repository historically treats UI typecheck as a baseline-aware audit rather than a universal green gate. Creator-branch diagnostics are blocking; unrelated baseline diagnostics must be classified separately.

## Optional Build And Manual Smoke

Only after focused tests/typecheck review:

```powershell
npm.cmd run ui:build
npm.cmd run ui:dev:host
```

`ui:build` writes ignored `apps/rpg-ui/dist/`. The dev server is long-running and must be stopped with `Ctrl+C` after manual verification.

## Cleanup

After verification, return to the primary checkout in a separate shell or with an explicit path and remove the detached worktree only after saving any needed logs outside it:

```powershell
Set-Location 'C:\Codex\EoL'
git worktree remove 'C:\Codex\EoL-creator-verify'
git worktree prune
```

Do not use `-f` unless the verification worktree has been inspected and any local changes are known to be disposable.

## Important Non-Actions

- Do not kill Node/Codex/Vite processes merely to unlock the primary checkout.
- Do not rerun `npm ci` in the primary checkout while another run may be using it.
- Do not merge the creator branch from this verification pass.
- Do not run broad `npm test`, workspace typecheck, or DB build merely because the isolated worktree exists.
- Recompare the creator branch with current `master` before any later integration review.
