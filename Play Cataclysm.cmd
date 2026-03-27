@echo off
setlocal
set "ROOT_DIR=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\launch_rpg_ui.ps1"
set "EXIT_CODE=%errorlevel%"
if not "%EXIT_CODE%"=="0" (
    echo.
    echo Play Cataclysm failed. See "%ROOT_DIR%logs\rpg-ui.bootstrap.log" for details.
    pause
)
exit /b %EXIT_CODE%
