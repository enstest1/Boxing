@echo off
echo Starting Rumble Boxing Combo Generator...
echo.
echo Opening development server at http://localhost:5173
echo.
start http://localhost:5173
echo Running application... Close this window to stop the app.
cd /d %~dp0
wsl -d Ubuntu -e bash -c "cd $(wslpath '%CD%') && pnpm dev"