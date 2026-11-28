# Lineage: Reforged development-mainline cleanup
# Safe by default: inventory only. -Apply removes ONLY clean, merged and empty
# historical New UI integration worktrees; never uses force and never deletes
# arbitrary sibling repositories, backup roots, browser profiles or Sites.
[CmdletBinding()]
param(
    [string]$RepoRoot = 'C:\Codex\EoL',
    [switch]$Apply,
    [switch]$DeleteMergedRemoteIntegrationBranch
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-GitOutput {
    param([string]$Directory, [string[]]$GitArgs)
    $lines = @(& git -C $Directory @GitArgs 2>&1)
    if ($LASTEXITCODE -ne 0) {
        throw "git $($GitArgs -join ' ') failed for $Directory (exit $LASTEXITCODE): $($lines -join ' ')"
    }
    return $lines
}

if (-not (Test-Path -LiteralPath $RepoRoot -PathType Container)) {
    throw "Repository folder not found: $RepoRoot"
}
$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot).TrimEnd('\')
$top = [string]((Get-GitOutput -Directory $RepoRoot -GitArgs @('rev-parse','--show-toplevel')) | Select-Object -First 1)
if ([System.IO.Path]::GetFullPath($top).TrimEnd('\') -ine $RepoRoot) {
    throw "Expected Git repository root $RepoRoot; actual root is $top"
}
$remoteUrl = [string]((Get-GitOutput -Directory $RepoRoot -GitArgs @('remote','get-url','origin')) | Select-Object -First 1)
if ($remoteUrl -notmatch '(?i)(github\.com[:/])vagabond1215/Lineage_Reforged(?:\.git)?$') {
    throw "Unexpected origin $remoteUrl. Refusing cleanup outside Lineage_Reforged."
}
$expectedMerge = '183dea35f5b9d932693cbac24b84640ef3b7735b'
& git -C $RepoRoot merge-base --is-ancestor $expectedMerge 'origin/master' 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "origin/master does not include the accepted PR #104 merge $expectedMerge. Run 'git fetch origin master' and retry."
}

Write-Host "Root: $RepoRoot"
Write-Host "Origin: $remoteUrl"
Write-Host "Mode: $(if ($Apply) {'APPLY (guarded)'} else {'DRY RUN (no deletion)'})"
Write-Host ''

# Detect listeners that may belong to the old or new preview. Conservatively
# skip all worktree removal while any common preview port is occupied.
$occupied = @()
foreach ($port in @(5244,5310,5311,5173)) {
    if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
        if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) { $occupied += $port }
    }
}
if ($occupied.Count -gt 0) {
    Write-Warning "Preview/development ports listening: $($occupied -join ', '). Worktree removal will be held; stop relevant servers and rerun."
}

# Parse Git's authoritative worktree registry. Do not recursively search for
# apparent Git folders and infer they are deletable.
$worktreeLines = @(Get-GitOutput -Directory $RepoRoot -GitArgs @('worktree','list','--porcelain'))
$worktrees = @()
$current = @{}
foreach ($line in @($worktreeLines) + @('')) {
    if ([string]::IsNullOrWhiteSpace($line)) {
        if ($current.ContainsKey('path')) { $worktrees += [pscustomobject]$current }
        $current = @{}
    } elseif ($line.StartsWith('worktree ')) {
        $current.path = $line.Substring(9)
    } elseif ($line.StartsWith('HEAD ')) {
        $current.head = $line.Substring(5)
    } elseif ($line.StartsWith('branch ')) {
        $current.branch = $line.Substring(7)
    } elseif ($line -match '^locked(?: |$)') {
        $current.locked = $true
    } elseif ($line -match '^prunable(?: |$)') {
        $current.prunable = $true
    }
}

$names = '(?i)(new-ui|selected-world|a3b|functional-world-integration|selective-ui-consolidation)'
$eligibleCount = 0
$removedCount = 0
foreach ($wt in $worktrees) {
    $path = [System.IO.Path]::GetFullPath([string]$wt.path).TrimEnd('\')
    if ($path -ieq $RepoRoot) {
        Write-Host "KEEP primary worktree: $path"
        continue
    }
    if (-not (Test-Path -LiteralPath $path -PathType Container)) {
        Write-Warning "HOLD missing/possibly prunable worktree path; requires manual inspection: $path"
        continue
    }
    if ((Get-Location).Provider.Name -eq 'FileSystem') {
        $cwd = [System.IO.Path]::GetFullPath((Get-Location).Path).TrimEnd('\')
        if ($cwd -ieq $path -or $cwd.StartsWith($path + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
            Write-Host "HOLD current PowerShell working directory: $path"
            continue
        }
    }
    $branchName = if ($wt.PSObject.Properties['branch']) { [string]$wt.branch } else { '' }
    if ($path -notmatch $names -and $branchName -notmatch $names) {
        Write-Host "HOLD other worktree (not targeted): $path"
        continue
    }
    if (($wt.PSObject.Properties.Name -contains 'locked') -and $wt.locked) {
        Write-Host "HOLD locked worktree: $path"
        continue
    }
    $head = [string]((Get-GitOutput -Directory $path -GitArgs @('rev-parse','HEAD')) | Select-Object -First 1)
    & git -C $RepoRoot merge-base --is-ancestor $head 'origin/master' 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "HOLD not fully merged into origin/master: $path"
        continue
    }
    $changes = @(Get-GitOutput -Directory $path -GitArgs @('status','--porcelain=v1','--untracked-files=all'))
    if ($changes.Count -gt 0) {
        Write-Host "HOLD modified/untracked files: $path ($($changes.Count) entries)"
        continue
    }
    $ignored = @(& git -C $path ls-files --others --ignored --exclude-standard | Select-Object -First 1)
    if ($LASTEXITCODE -ne 0 -or $ignored.Count -gt 0) {
        Write-Host "HOLD ignored or unreadable local files: $path (e.g. dependencies or QA evidence)"
        continue
    }
    $eligibleCount++
    if (-not $Apply -or $occupied.Count -gt 0) {
        Write-Host "ELIGIBLE clean merged review worktree: $path"
        continue
    }
    & git -C $RepoRoot worktree remove -- $path
    if ($LASTEXITCODE -eq 0) {
        $removedCount++
        Write-Host "REMOVED clean merged worktree: $path"
    } else {
        Write-Warning "Git refused removal, no force attempted: $path"
    }
}

# Remote cleanup is deliberately opt-in and limited to the exact merged PR head.
$branch = 'codex/new-ui-mainline-final-2026-11-23'
if ($DeleteMergedRemoteIntegrationBranch) {
    if (-not $Apply) {
        Write-Host "DRY RUN only: would inspect remote branch $branch for deletion"
    } else {
        $remote = @(& git -C $RepoRoot ls-remote --heads origin "refs/heads/$branch")
        if ($LASTEXITCODE -ne 0) { throw 'Cannot verify remote branch head. No remote deletion attempted.' }
        if ($remote.Count -eq 0) {
            Write-Host "Already absent on remote: $branch"
        } else {
            $remoteHead = ($remote[0] -split '\s+')[0]
            if ($remoteHead -ne 'ae74fea0a17b1ec809ec5c12fc1a22fdeb090656') {
                throw "Remote branch $branch moved to $remoteHead. No remote deletion attempted."
            }
            & git -C $RepoRoot merge-base --is-ancestor $remoteHead 'origin/master' 2>$null | Out-Null
            if ($LASTEXITCODE -ne 0) { throw 'Remote head is not merged. No remote deletion attempted.' }
            & git -C $RepoRoot push origin --delete $branch
            if ($LASTEXITCODE -ne 0) { throw 'Remote deletion failed; review Git output.' }
            Write-Host "DELETED exact already-merged remote PR #104 branch: $branch"
        }
    }
}

Write-Host ''
Write-Host "Clean merged target worktrees eligible: $eligibleCount; actually removed: $removedCount"
Write-Host 'Additional inventory only, NEVER auto-deleted:'
$parent = Split-Path -Parent $RepoRoot
if (Test-Path -LiteralPath $parent) {
    foreach ($dir in @(Get-ChildItem -LiteralPath $parent -Directory -Force -ErrorAction SilentlyContinue)) {
        if ($dir.FullName -ieq $RepoRoot) { continue }
        if ((Test-Path -LiteralPath (Join-Path $dir.FullName '.git')) -or
            $dir.Name -match '(?i)(backup|copy|archive|preview|test|review|old|scratch)') {
            Write-Host "INSPECT sibling directory/repository: $($dir.FullName)"
        }
    }
}
$evidence = Join-Path $RepoRoot '.codex-local'
if (Test-Path -LiteralPath $evidence) {
    foreach ($dir in @(Get-ChildItem -LiteralPath $evidence -Directory -Force -ErrorAction SilentlyContinue)) {
        if ($dir.Name -match '(?i)(new-ui|world|chromium|browser|typescript|qa)') {
            Write-Host "INSPECT local evidence (not deleted): $($dir.FullName)"
        }
    }
}
Write-Host 'Sites, browser profiles, distinct GitHub repos, unmerged branches and other backup roots are NOT deleted by this script.'
Write-Host 'No git clean -fdx, git reset, force-push, or recursive Remove-Item was used.'
