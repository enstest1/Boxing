@echo off
echo Cleaning API setup...
cd apps\api

echo Removing node_modules (if exists)...
if exist node_modules rmdir /s /q node_modules

echo Removing package-lock.json (if exists)...
if exist package-lock.json del package-lock.json

echo Installing API dependencies (this may take a minute)...
call npm install

echo Done installing API dependencies.
echo Starting API server...
node index.js
pause 