@echo off
echo Starting Rumble Boxing Combo Generator...
echo.

REM Create directories needed
mkdir Rumble-Boxing-API
mkdir Rumble-Boxing-Web

REM Copy API files
xcopy /E /I /Y apps\api Rumble-Boxing-API\
xcopy /E /I /Y packages\shared-types Rumble-Boxing-API\shared-types\

REM Copy Web files
xcopy /E /I /Y apps\web Rumble-Boxing-Web\
xcopy /E /I /Y packages\shared-types Rumble-Boxing-Web\shared-types\

REM Start the API server
cd Rumble-Boxing-API
start cmd /k "npm install && npm run dev"

REM Wait a bit for the API to start
timeout /t 5

REM Start the web app
cd ..\Rumble-Boxing-Web
start cmd /k "npm install && npm run dev"

REM Open browser
timeout /t 8
start http://localhost:3000

echo.
echo If the browser doesn't open automatically, please go to:
echo http://localhost:3000
echo.
echo The application is now running. Press Ctrl+C in the command windows to stop the servers.