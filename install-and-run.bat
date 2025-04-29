@echo off
echo ====================================================
echo BOXING PROJECT DEPENDENCY INSTALLATION
echo ====================================================
echo.

echo Step 1: Removing existing node_modules directories...
echo - Removing API node_modules
if exist apps\api\node_modules rmdir /s /q apps\api\node_modules
echo - Removing Web node_modules
if exist apps\web\node_modules rmdir /s /q apps\web\node_modules
echo.

echo Step 2: Installing API dependencies...
cd apps\api
call npm install
echo.

echo Step 3: Installing Web dependencies...
cd ..\web
call npm install
cd ..\..
echo.

echo Step 4: Starting the API server...
start "API Server" cmd /k "cd apps\api && node index.js"
echo.

echo Step 5: Starting the web server...
start "Web Server" cmd /k "cd apps\web && npx vite"
echo.

echo Step 6: Opening browser...
timeout /t 5
start http://localhost:5173
echo.

echo ====================================================
echo SETUP COMPLETE!
echo ====================================================
echo.
echo API server: http://localhost:3001/health
echo Web app: http://localhost:5173
echo.
echo Press any key to exit... 