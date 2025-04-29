@echo off
echo Starting Rumble Boxing Combo Generator...
echo.
echo This script will:
echo 1. Start the API server in WSL
echo 2. Start the web app in your browser
echo.
echo Press any key to continue...
pause > nul

REM Start the API server in WSL
start wsl -e bash -c "cd /mnt/c/Users/tomic/Desktop/Cursor/Boxing && pnpm --filter api dev"
echo API server starting...
timeout /t 3 > nul

REM Start the web app in browser
echo Opening web app...
start http://localhost:3000

REM Start the web server in WSL
wsl -e bash -c "cd /mnt/c/Users/tomic/Desktop/Cursor/Boxing && pnpm --filter web dev"