param()

$rootDir = Resolve-Path (Join-Path $PSScriptRoot '..')
$logDir = Join-Path $rootDir 'logs'
$bootLog = Join-Path $logDir 'rpg-ui.bootstrap.log'
$serverLog = Join-Path $logDir 'rpg-ui.dev-server.log'

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

Add-Content -Path $bootLog -Value "[$(Get-Date -Format s)] Launch requested."

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm was not found on PATH. Install Node.js and npm before using Play Cataclysm.cmd."
    Add-Content -Path $bootLog -Value "[$(Get-Date -Format s)] Launch failed: npm not found."
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
        Start-Process $uiUrl
        $opened = $true
    }
    catch {
    }
}

if (-not $opened) {
    Start-Process $uiUrl
}

Add-Content -Path $bootLog -Value "[$(Get-Date -Format s)] UI launch request completed."
