@echo off
setlocal
set "ROOT_DIR=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -STA -File "%ROOT_DIR%scripts\content_story_browser.ps1"
