@echo off
echo Cleaning Web setup...
cd apps\web

echo Removing node_modules (if exists)...
if exist node_modules rmdir /s /q node_modules

echo Removing package-lock.json (if exists)...
if exist package-lock.json del package-lock.json

echo Installing Web dependencies (this may take a minute)...
call npm install

echo Done installing Web dependencies.
echo Starting Web server...
npx vite
pause 