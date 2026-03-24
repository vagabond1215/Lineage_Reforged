@echo off
setlocal
set "ROOT_DIR=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\launch_rpg_ui.ps1"
exit /b %errorlevel%
