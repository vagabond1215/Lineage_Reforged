@echo off
setlocal
set "ROOT_DIR=%~dp0"
set "LOG_DIR=%ROOT_DIR%logs"
set "BOOT_LOG=%LOG_DIR%\content_story_browser.bootstrap.log"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo [%date% %time%] Launch requested.>>"%BOOT_LOG%"
start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -STA -File "%ROOT_DIR%scripts\content_story_browser.ps1" 1>>"%BOOT_LOG%" 2>&1
exit /b 0
