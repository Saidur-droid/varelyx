@echo off
setlocal
echo Varelyx Firebase deployment
echo Project: varelyx-ai-builder-cup
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not in PATH.
  echo Install Node.js LTS, then run this file again.
  pause
  exit /b 1
)
call npx --yes firebase-tools@latest login
if errorlevel 1 (
  echo Firebase login failed or was cancelled.
  pause
  exit /b 1
)
call npx --yes firebase-tools@latest deploy --only hosting,database
if errorlevel 1 (
  echo Deployment failed. Copy the error and send it to ChatGPT.
  pause
  exit /b 1
)
echo.
echo DEPLOY COMPLETE
echo https://varelyx-ai-builder-cup.web.app
pause
