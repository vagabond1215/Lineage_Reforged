@echo off
setlocal
set "ROOT_DIR=%~dp0"
call "%ROOT_DIR%run-content-browser.cmd"
exit /b %errorlevel%
