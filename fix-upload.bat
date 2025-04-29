@echo off
echo Installing multer for file uploads...

cd apps\api
call npm install multer
echo Stopping any running API servers...
taskkill /F /FI "WINDOWTITLE eq API Server" /T > nul 2>&1

echo Starting API server with file upload support...
start "API Server" cmd /k "node index.js"

echo Installing FormData polyfill for frontend...
cd ..\web
call npm install form-data
echo Stopping any running Web servers...
taskkill /F /FI "WINDOWTITLE eq Web Server" /T > nul 2>&1

echo Starting web server...
start "Web Server" cmd /k "npx vite"

echo Opening browser...
timeout /t 3
start http://localhost:5173

echo Done! The application should now handle file uploads correctly.
echo API server: http://localhost:3001/health
echo Web app: http://localhost:5173
echo Try uploading a file now! 