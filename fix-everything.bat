@echo off
echo ====================================================
echo BOXING PROJECT COMPLETE SETUP AND FIX SCRIPT
echo ====================================================
echo.

echo Step 1: Stopping any running servers...
taskkill /F /FI "WINDOWTITLE eq API Server" /T > nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Web Server" /T > nul 2>&1
echo.

echo Step 2: Setting up API server...
cd apps\api
echo - Creating package.json...
echo {^
  "name": "boxing-api",^
  "version": "1.0.0",^
  "main": "index.js",^
  "dependencies": {},^
  "scripts": {^
    "start": "node index.js"^
  }^
} > package.json

echo - Installing API dependencies...
call npm install express cors multer path fs
echo.

echo Step 3: Setting up Web server...
cd ..\web
echo - Creating package.json...
echo {^
  "name": "boxing-web",^
  "version": "1.0.0",^
  "dependencies": {},^
  "scripts": {^
    "dev": "vite"^
  }^
} > package.json

echo - Creating vite.config.js...
echo import { defineConfig } from 'vite';> vite.config.js
echo import react from '@vitejs/plugin-react';>> vite.config.js
echo.>> vite.config.js
echo export default defineConfig({>> vite.config.js
echo   plugins: [react()],>> vite.config.js
echo   server: {>> vite.config.js
echo     port: 5173,>> vite.config.js
echo     proxy: {>> vite.config.js
echo       '/api': {>> vite.config.js
echo         target: 'http://localhost:3001',>> vite.config.js
echo         changeOrigin: true,>> vite.config.js
echo         rewrite: (path) =^> path.replace(/^\/api/, '')>> vite.config.js
echo       }>> vite.config.js
echo     }>> vite.config.js
echo   }>> vite.config.js
echo });>> vite.config.js

echo - Installing web dependencies...
call npm install vite @vitejs/plugin-react react react-dom
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
echo If you're still experiencing issues:
echo 1. Check the API and Web server windows for errors
echo 2. Try manually installing dependencies:
echo    - For API: cd apps\api ^& npm install express cors multer
echo    - For Web: cd apps\web ^& npm install vite @vitejs/plugin-react react react-dom
echo 3. Make sure no other processes are using ports 3001 or 5173
echo.
echo Press any key to exit... 