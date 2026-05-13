param()

$rootDir = Resolve-Path (Join-Path $PSScriptRoot '..')
$logDir = Join-Path $rootDir 'logs'
$bootLog = Join-Path $logDir 'rpg-ui.bootstrap.log'
$serverLog = Join-Path $logDir 'rpg-ui.dev-server.log'

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

function Open-UiUrlInDefaultBrowser {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url,
        [Parameter(Mandatory = $true)]
        [string]$LogPath
    )

    try {
        Start-Process -FilePath $Url -ErrorAction Stop | Out-Null
        Add-Content -Path $LogPath -Value "[$(Get-Date -Format s)] Browser launch requested via Start-Process for $Url."
        return $true
    }
    catch {
        Add-Content -Path $LogPath -Value "[$(Get-Date -Format s)] Browser launch via Start-Process failed for $Url. $($_.Exception.Message)"
    }

    try {
        Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'start', '', $Url -WindowStyle Hidden -ErrorAction Stop | Out-Null
        Add-Content -Path $LogPath -Value "[$(Get-Date -Format s)] Browser launch requested via cmd fallback for $Url."
        return $true
    }
    catch {
        Add-Content -Path $LogPath -Value "[$(Get-Date -Format s)] Browser launch via cmd fallback failed for $Url. $($_.Exception.Message)"
    }

    return $false
}

Add-Content -Path $bootLog -Value "[$(Get-Date -Format s)] Launch requested."

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm was not found on PATH. Install Node.js and npm before using Play Lineage Reforged.cmd."
    Write-Host "Bootstrap log: $bootLog"
    Add-Content -Path $bootLog -Value "[$(Get-Date -Format s)] Launch failed: npm not found. PATH=$env:PATH"
    exit 1
}

$uiAppDir = Join-Path $rootDir 'apps\rpg-ui'
$uiNodeModulesDir = Join-Path $uiAppDir 'node_modules'

if (-not (Test-Path $uiNodeModulesDir)) {
    Write-Host "RPG UI dependencies are not installed."
    Write-Host "Run 'npm install' in '$uiAppDir' after installing Node.js."
    Write-Host "Bootstrap log: $bootLog"
    Add-Content -Path $bootLog -Value "[$(Get-Date -Format s)] Launch failed: apps/rpg-ui node_modules missing."
    exit 1
}

$launchCommand = "Set-Location -LiteralPath '$rootDir'; npm run ui:dev:host *>> '$serverLog'"
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-NoProfile',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    $launchCommand
)

$uiUrl = 'http://127.0.0.1:5173/'
$opened = $false

for ($attempt = 0; $attempt -lt 30 -and -not $opened; $attempt += 1) {
    Start-Sleep -Seconds 1

    try {
        Invoke-WebRequest -UseBasicParsing -Uri $uiUrl -TimeoutSec 2 | Out-Null
        $opened = Open-UiUrlInDefaultBrowser -Url $uiUrl -LogPath $bootLog
    }
    catch {
    }
}

if (-not $opened) {
    $opened = Open-UiUrlInDefaultBrowser -Url $uiUrl -LogPath $bootLog
}

if (-not $opened) {
    Add-Content -Path $bootLog -Value "[$(Get-Date -Format s)] UI launch completed, but the default browser could not be opened automatically."
}

Add-Content -Path $bootLog -Value "[$(Get-Date -Format s)] UI launch request completed."
